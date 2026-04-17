from __future__ import annotations

from collections.abc import Sequence

import torch
import torch.nn as nn
import torch.nn.functional as F

from common.task_text import resolve_task_text

try:  # pragma: no cover - optional at import time
    import timm
except ImportError:  # pragma: no cover
    timm = None

try:  # pragma: no cover - optional at import time
    from transformers import CLIPTextModel, CLIPTokenizer
except ImportError:  # pragma: no cover
    CLIPTextModel = None  # type: ignore[assignment]
    CLIPTokenizer = None  # type: ignore[assignment]


def _set_requires_grad(module: nn.Module, enabled: bool) -> None:
    for param in module.parameters():
        param.requires_grad_(enabled)


class _CLIPVisionBranch(nn.Module):
    def __init__(
        self,
        *,
        backbone_name: str,
        pretrained: bool,
        train_mode: str,
        num_unfreeze_blocks: int,
        activation_checkpointing: bool = False,
    ) -> None:
        super().__init__()
        if timm is None:
            raise ImportError("mdit encoder requires timm to be installed.")
        self.backbone = timm.create_model(
            str(backbone_name),
            pretrained=bool(pretrained),
            num_classes=0,
        )
        self.train_mode = str(train_mode)
        self.num_unfreeze_blocks = int(num_unfreeze_blocks)
        self.activation_checkpointing = bool(activation_checkpointing)
        self.output_dim = int(getattr(self.backbone, "num_features", getattr(self.backbone, "embed_dim", 768)))
        if self.activation_checkpointing:
            grad_ckpt_setter = getattr(self.backbone, "set_grad_checkpointing", None)
            if not callable(grad_ckpt_setter):
                raise ValueError(
                    f"Vision backbone {type(self.backbone).__name__} does not support activation checkpointing."
                )
            # 只在显式请求时打开，避免污染现有主线的默认执行图。
            grad_ckpt_setter(True)
        self._configure_train_mode()

    def _configure_train_mode(self) -> None:
        mode = self.train_mode.lower().strip()
        _set_requires_grad(self.backbone, False)
        if mode in {"frozen", "freeze", "none"}:
            return
        if mode not in {"last_block", "last_n_blocks"}:
            raise ValueError(
                f"Unsupported vision_train_mode={self.train_mode!r}. "
                "Use 'frozen' or 'last_block'."
            )
        blocks = getattr(self.backbone, "blocks", None)
        if blocks is None:
            raise ValueError(
                f"Vision backbone {type(self.backbone).__name__} does not expose `.blocks` for last-block finetune."
            )
        if len(blocks) == 0:
            return

        n_unfreeze = max(1, int(self.num_unfreeze_blocks))
        n_unfreeze = min(n_unfreeze, len(blocks))
        for block in blocks[-n_unfreeze:]:
            _set_requires_grad(block, True)

        # Keep the output normalization trainable with the last block.
        for maybe_norm in ("norm", "fc_norm", "ln_pre", "ln_post"):
            norm_module = getattr(self.backbone, maybe_norm, None)
            if isinstance(norm_module, nn.Module):
                _set_requires_grad(norm_module, True)

    def forward(self, images: torch.Tensor) -> torch.Tensor:
        features = self.backbone.forward_features(images)
        if isinstance(features, (tuple, list)):
            features = features[0]
        if features.ndim == 3:
            return features[:, 0]
        if features.ndim == 2:
            return features
        return torch.flatten(features, start_dim=1)


class ClipRgbTextTokenEncoder(nn.Module):
    """5 independent CLIP vision branches + CLIP text, producing 3 fused obs tokens.

    Output token contract follows PDIT cond token shape:
    (B, T_obs, obs_features_dim + y_dim)
    """

    def __init__(
        self,
        *,
        obs_features_dim: int,
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
        token_fusion_mode: str,
        fusion_recipe: str = "step_fusion",
        activation_checkpointing: bool = False,
    ) -> None:
        super().__init__()
        if CLIPTokenizer is None or CLIPTextModel is None:
            raise ImportError("mdit text encoder requires transformers to be installed.")
        self.obs_features_dim = int(obs_features_dim)
        self.robot_state_dim = int(robot_state_dim)
        self.camera_names = tuple(camera_names)
        self.num_cameras = len(self.camera_names)
        self.image_size = (int(image_size[0]), int(image_size[1]))
        self.token_fusion_mode = str(token_fusion_mode)
        self.fusion_recipe = str(fusion_recipe)
        if self.token_fusion_mode != "3_token":
            raise ValueError(
                f"Only token_fusion_mode='3_token' is supported, got {self.token_fusion_mode!r}."
            )
        if self.fusion_recipe not in {"step_fusion", "faithful_concat"}:
            raise ValueError(
                f"Unsupported fusion_recipe={self.fusion_recipe!r}. "
                "Use 'step_fusion' or 'faithful_concat'."
            )

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
        vision_dim = int(self.vision_branches[0].output_dim)

        self.text_tokenizer = CLIPTokenizer.from_pretrained(str(text_model_name))
        self.text_encoder = CLIPTextModel.from_pretrained(str(text_model_name))
        _set_requires_grad(self.text_encoder, False)
        self.text_projection_dim = int(text_projection_dim)
        self.text_projection = nn.Sequential(
            nn.Linear(int(self.text_encoder.config.hidden_size), self.text_projection_dim),
            nn.GELU(approximate="tanh"),
            nn.Linear(self.text_projection_dim, self.text_projection_dim),
        )
        self.text_to_fusion = (
            nn.Identity()
            if self.text_projection_dim == self.obs_features_dim
            else nn.Linear(self.text_projection_dim, self.obs_features_dim)
        )

        if self.fusion_recipe == "step_fusion":
            self.camera_feature_adapter = nn.Sequential(
                nn.Linear(vision_dim, self.obs_features_dim),
                nn.GELU(approximate="tanh"),
                nn.Linear(self.obs_features_dim, self.obs_features_dim),
            )
            self.robot_state_adapter = nn.Sequential(
                nn.Linear(self.robot_state_dim, self.obs_features_dim),
                nn.GELU(approximate="tanh"),
                nn.Linear(self.obs_features_dim, self.obs_features_dim),
            )
            fusion_in_dim = self.obs_features_dim * (self.num_cameras + 2)
            self.step_fusion_adapter = nn.Sequential(
                nn.Linear(fusion_in_dim, self.obs_features_dim),
                nn.GELU(approximate="tanh"),
                nn.Linear(self.obs_features_dim, self.obs_features_dim),
            )
            self.cond_token_projector = nn.Sequential(
                nn.Linear(self.obs_features_dim, self.obs_features_dim),
                nn.GELU(approximate="tanh"),
                nn.Linear(self.obs_features_dim, self.obs_features_dim),
            )
            self.faithful_concat_projector = None
        else:
            self.camera_feature_adapter = nn.Identity()
            self.robot_state_adapter = None
            faithful_in_dim = vision_dim * self.num_cameras + self.robot_state_dim + self.text_projection_dim
            self.step_fusion_adapter = None
            self.cond_token_projector = None
            self.faithful_concat_projector = nn.Sequential(
                nn.Linear(faithful_in_dim, self.obs_features_dim),
                nn.GELU(approximate="tanh"),
                nn.Linear(self.obs_features_dim, self.obs_features_dim),
            )

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
        text_list = [str(item) for item in task_text]
        if len(text_list) == batch_size:
            return text_list
        if len(text_list) == 1:
            return text_list * batch_size
        raise ValueError(f"task_text batch mismatch: got {len(text_list)} texts for batch_size={batch_size}")

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

    def _encode_text(self, task_text: str | Sequence[str] | None, batch_size: int, device: torch.device) -> torch.Tensor:
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
        return self.text_to_fusion(self.text_projection(pooled))

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

        camera_tokens: list[torch.Tensor] = []
        for cam_idx, vision_branch in enumerate(self.vision_branches):
            cam_bthwc = obs_rgb[:, :, cam_idx].float()
            cam_bchw = cam_bthwc.reshape(batch_size * n_obs_steps, *cam_bthwc.shape[-3:]).permute(0, 3, 1, 2)
            cam_bchw = self._normalize_images(cam_bchw)
            cam_features = vision_branch(cam_bchw)
            cam_features = self.camera_feature_adapter(cam_features)
            camera_tokens.append(cam_features.reshape(batch_size, n_obs_steps, cam_features.shape[-1]))

        text_token = self._encode_text(task_text, batch_size, obs_rgb.device)
        text_tokens = text_token.unsqueeze(1).expand(-1, n_obs_steps, -1)

        if self.fusion_recipe == "step_fusion":
            state_tokens = self.robot_state_adapter(robot_state_obs.float())
            fusion_features = torch.cat([*camera_tokens, state_tokens, text_tokens], dim=-1)
            step_tokens = self.step_fusion_adapter(fusion_features)
            cond_obs_tokens = self.cond_token_projector(step_tokens)
        else:
            camera_concat = torch.cat(camera_tokens, dim=-1)
            faithful_features = torch.cat([camera_concat, robot_state_obs.float(), text_tokens], dim=-1)
            cond_obs_tokens = self.faithful_concat_projector(faithful_features)

        # Keep PDIT cond contract: cond_dim = obs_features_dim + y_dim
        return torch.cat([cond_obs_tokens, robot_state_obs.float()], dim=-1)
