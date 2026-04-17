from __future__ import annotations

from collections.abc import Sequence

import torch
import torch.nn as nn
import torch.nn.functional as F

from common.task_text import resolve_task_text

from .clip_rgb_text_token import _CLIPVisionBranch, _set_requires_grad

try:  # pragma: no cover - optional at import time
    from transformers import CLIPTextModel, CLIPTokenizer
except ImportError:  # pragma: no cover
    CLIPTextModel = None  # type: ignore[assignment]
    CLIPTokenizer = None  # type: ignore[assignment]


class ClipRgbTextMTDPEncoder(nn.Module):
    """严格 MTDP 线使用的 observation encoder。

    输出不是 PDIT 风格的 cond tokens，而是 MTDP 风格的 global conditioning vector:
    (B, n_obs_steps * (robot_state + 5 * camera_cls + text_proj))
    """

    def __init__(
        self,
        *,
        n_obs_steps: int,
        robot_state_dim: int,
        camera_names: tuple[str, ...],
        image_size: tuple[int, int],
        vision_backbone_name: str,
        vision_pretrained: bool,
        vision_train_mode: str,
        vision_num_unfreeze_blocks: int,
        text_model_name: str,
        text_projection_dim: int,
        task_name: str,
        task_text_override: str | None,
        activation_checkpointing: bool = False,
        vision_encode_chunk_size: int = 0,
    ) -> None:
        super().__init__()
        if CLIPTokenizer is None or CLIPTextModel is None:
            raise ImportError("mdit text encoder requires transformers to be installed.")

        self.n_obs_steps = int(n_obs_steps)
        self.robot_state_dim = int(robot_state_dim)
        self.camera_names = tuple(camera_names)
        self.num_cameras = len(self.camera_names)
        self.image_size = (int(image_size[0]), int(image_size[1]))
        self.vision_encode_chunk_size = int(vision_encode_chunk_size)
        if self.vision_encode_chunk_size < 0:
            raise ValueError("vision_encode_chunk_size must be >= 0")

        self.default_task_text = resolve_task_text(
            task_name=str(task_name),
            text_source="task_template",
            descriptions=None,
            override_text=task_text_override,
        )

        self.vision_branches = nn.ModuleList(
            [
                _CLIPVisionBranch(
                    backbone_name=str(vision_backbone_name),
                    pretrained=bool(vision_pretrained),
                    train_mode=str(vision_train_mode),
                    num_unfreeze_blocks=int(vision_num_unfreeze_blocks),
                    activation_checkpointing=bool(activation_checkpointing),
                )
                for _ in self.camera_names
            ]
        )
        self.vision_output_dim = int(self.vision_branches[0].output_dim)

        self.text_tokenizer = CLIPTokenizer.from_pretrained(str(text_model_name))
        self.text_encoder = CLIPTextModel.from_pretrained(str(text_model_name))
        _set_requires_grad(self.text_encoder, False)
        self.text_projection_dim = int(text_projection_dim)
        self.text_projection = nn.Sequential(
            nn.Linear(int(self.text_encoder.config.hidden_size), self.text_projection_dim),
            nn.GELU(approximate="tanh"),
            nn.Linear(self.text_projection_dim, self.text_projection_dim),
        )

        self.per_step_conditioning_dim = (
            self.robot_state_dim
            + self.num_cameras * self.vision_output_dim
            + self.text_projection_dim
        )
        self.conditioning_dim = self.per_step_conditioning_dim * self.n_obs_steps

        self.register_buffer(
            "_clip_mean",
            torch.tensor([0.48145466, 0.4578275, 0.40821073], dtype=torch.float32).view(1, 3, 1, 1),
            persistent=False,
        )
        self.register_buffer(
            "_clip_std",
            torch.tensor([0.26862954, 0.26130258, 0.27577711], dtype=torch.float32).view(1, 3, 1, 1),
            persistent=False,
        )

    @staticmethod
    def _ensure_text_batch(task_text: str | Sequence[str] | None, batch_size: int, default_text: str) -> list[str]:
        if task_text is None:
            return [default_text for _ in range(batch_size)]
        if isinstance(task_text, str):
            return [task_text for _ in range(batch_size)]
        texts = [str(item) for item in task_text]
        if len(texts) == batch_size:
            return texts
        if len(texts) == 1:
            return texts * batch_size
        raise ValueError(f"task_text batch mismatch: got {len(texts)} texts for batch_size={batch_size}")

    def _normalize_images(self, images_bchw: torch.Tensor) -> torch.Tensor:
        images = images_bchw.float()
        if images.max() > 1.0:
            images = images / 255.0
        if images.shape[-2:] != self.image_size:
            images = F.interpolate(
                images,
                size=self.image_size,
                mode="bilinear",
                align_corners=False,
                antialias=True,
            )
        mean = self._clip_mean.to(device=images.device, dtype=images.dtype)
        std = self._clip_std.to(device=images.device, dtype=images.dtype)
        return (images - mean) / std

    def _encode_text(
        self,
        task_text: str | Sequence[str] | None,
        batch_size: int,
        device: torch.device,
    ) -> torch.Tensor:
        texts = self._ensure_text_batch(task_text, batch_size, self.default_task_text)
        text_inputs = self.text_tokenizer(
            texts,
            padding=True,
            truncation=True,
            return_tensors="pt",
        )
        text_inputs = {key: value.to(device=device) for key, value in text_inputs.items()}
        with torch.no_grad():
            text_outputs = self.text_encoder(**text_inputs)
            if getattr(text_outputs, "pooler_output", None) is not None:
                pooled = text_outputs.pooler_output
            else:
                pooled = text_outputs.last_hidden_state[:, 0]
        return self.text_projection(pooled)

    def _encode_camera_branch(
        self,
        branch: nn.Module,
        images_bchw: torch.Tensor,
    ) -> torch.Tensor:
        if self.vision_encode_chunk_size <= 0:
            return branch(images_bchw)
        chunks: list[torch.Tensor] = []
        for chunk in torch.split(images_bchw, int(self.vision_encode_chunk_size), dim=0):
            chunks.append(branch(chunk))
        return torch.cat(chunks, dim=0)

    def vision_parameters(self) -> list[nn.Parameter]:
        return [param for param in self.vision_branches.parameters() if param.requires_grad]

    def non_vision_parameters(self) -> list[nn.Parameter]:
        params: list[nn.Parameter] = []
        for name, param in self.named_parameters():
            if not param.requires_grad:
                continue
            if name.startswith("vision_branches."):
                continue
            params.append(param)
        return params

    def forward(
        self,
        obs_rgb: torch.Tensor,
        robot_state_obs: torch.Tensor,
        task_text: str | Sequence[str] | None = None,
    ) -> torch.Tensor:
        if obs_rgb.ndim != 6:
            raise ValueError(
                "Expected obs_rgb with shape (B, T_obs, N_cam, H, W, C), "
                f"got {tuple(obs_rgb.shape)}"
            )
        if robot_state_obs.ndim != 3:
            raise ValueError(
                "Expected robot_state_obs with shape (B, T_obs, state_dim), "
                f"got {tuple(robot_state_obs.shape)}"
            )

        batch_size, n_obs_steps, n_cam, _, _, channels = obs_rgb.shape
        if channels != 3:
            raise ValueError(f"RGB obs must have 3 channels, got {channels}")
        if n_cam != self.num_cameras:
            raise ValueError(f"Expected {self.num_cameras} cameras, got {n_cam}")
        if n_obs_steps != self.n_obs_steps:
            raise ValueError(f"Expected {self.n_obs_steps} obs steps, got {n_obs_steps}")

        camera_features: list[torch.Tensor] = []
        for cam_idx, vision_branch in enumerate(self.vision_branches):
            cam_bthwc = obs_rgb[:, :, cam_idx].float()
            cam_bchw = cam_bthwc.reshape(batch_size * n_obs_steps, *cam_bthwc.shape[-3:]).permute(0, 3, 1, 2)
            cam_bchw = self._normalize_images(cam_bchw)
            cam_features = self._encode_camera_branch(vision_branch, cam_bchw)
            camera_features.append(cam_features.reshape(batch_size, n_obs_steps, cam_features.shape[-1]))

        text_features = self._encode_text(task_text, batch_size, obs_rgb.device)
        text_features = text_features.unsqueeze(1).expand(-1, n_obs_steps, -1)

        # 顺序保持与 MTDP 一致：state -> multi-camera CLS -> text，然后再跨时间 flatten。
        step_features = torch.cat([robot_state_obs.float(), *camera_features, text_features], dim=-1)
        return step_features.flatten(start_dim=1)
