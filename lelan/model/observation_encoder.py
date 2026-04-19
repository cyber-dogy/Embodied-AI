from __future__ import annotations

from collections.abc import Sequence

import torch
import torch.nn as nn
import torch.nn.functional as F

from common.task_text import resolve_task_text
from mdit.model.encoders.clip_rgb_text_token import (
    CLIPTextModel,
    CLIPTokenizer,
    _CLIPVisionBranch,
    _set_requires_grad,
)
from .history_encoder import HistoryEncoder


class ObservationEncoder(nn.Module):
    """Reconstructed MDIT RGB+text token encoder with a LeLaN history branch.

    Contract matches the current MDIT mainline encoder:
    output shape is (B, T_obs, obs_features_dim + y_dim).

    LeLaN keeps one extra branch per camera:
    each observation frame is encoded both by the MDIT CLIP vision backbone and
    by a dedicated EfficientNet history encoder, then fused back into the
    step-wise conditioning token.
    """

    def __init__(self, config) -> None:
        super().__init__()
        if CLIPTokenizer is None or CLIPTextModel is None:
            raise ImportError("LeLaN text encoder requires transformers to be installed.")
        self.config = config
        self.obs_features_dim = int(config.obs_features_dim)
        self.robot_state_dim = int(config.y_dim)
        self.camera_names = tuple(config.camera_names)
        self.num_cameras = len(self.camera_names)
        self.image_size = tuple(int(v) for v in config.vision_image_size)
        self.default_task_text = resolve_task_text(
            task_name=str(config.task_name),
            text_source=str(config.text_source),
            descriptions=None,
            override_text=config.task_text_override,
        )

        self.vision_branches = nn.ModuleList(
            [
                _CLIPVisionBranch(
                    backbone_name=str(config.vision_backbone_name),
                    pretrained=bool(config.vision_pretrained),
                    train_mode=str(config.vision_train_mode),
                    num_unfreeze_blocks=int(config.vision_num_unfreeze_blocks),
                    activation_checkpointing=bool(config.activation_checkpointing),
                )
                for _ in self.camera_names
            ]
        )
        vision_dim = int(self.vision_branches[0].output_dim)

        self.history_encoders = nn.ModuleList(
            [
                HistoryEncoder(
                    backbone=str(config.history_encoder.backbone),
                    encoding_dim=int(self.obs_features_dim),
                    features_per_group=int(config.history_encoder.features_per_group),
                    pretrained=bool(config.history_encoder.pretrained),
                )
                for _ in self.camera_names
            ]
        )

        self.text_tokenizer = CLIPTokenizer.from_pretrained(str(config.text_model_name))
        self.text_encoder = CLIPTextModel.from_pretrained(str(config.text_model_name))
        _set_requires_grad(self.text_encoder, False)
        self.text_projection_dim = int(config.text_projection_dim)
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

        self.camera_feature_adapter = nn.Sequential(
            nn.Linear(vision_dim, self.obs_features_dim),
            nn.GELU(approximate="tanh"),
            nn.Linear(self.obs_features_dim, self.obs_features_dim),
        )
        self.history_feature_adapter = nn.Sequential(
            nn.Linear(self.obs_features_dim, self.obs_features_dim),
            nn.GELU(approximate="tanh"),
            nn.Linear(self.obs_features_dim, self.obs_features_dim),
        )
        self.camera_history_fuser = nn.Sequential(
            nn.Linear(self.obs_features_dim * 2, self.obs_features_dim),
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

    @property
    def conditioning_dim(self) -> int:
        return int(self.obs_features_dim + self.robot_state_dim)

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
        return self.text_to_fusion(self.text_projection(pooled))

    def _to_bthwc(self, obs_rgb: torch.Tensor) -> torch.Tensor:
        if obs_rgb.ndim != 6:
            raise ValueError(
                "Expected obs_rgb with shape (B, T_obs, N_cam, H, W, C) or (B, T_obs, N_cam, C, H, W), "
                f"got {tuple(obs_rgb.shape)}"
            )
        if obs_rgb.shape[-1] == 3:
            return obs_rgb.float()
        if obs_rgb.shape[3] == 3:
            return obs_rgb.permute(0, 1, 2, 4, 5, 3).float()
        raise ValueError(f"RGB obs must have channel dim of size 3, got {tuple(obs_rgb.shape)}")

    def forward(
        self,
        obs_rgb: torch.Tensor,
        robot_state_obs: torch.Tensor,
        task_text: str | Sequence[str] | None = None,
    ) -> torch.Tensor:
        obs_rgb = self._to_bthwc(obs_rgb)
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

        text_token = self._encode_text(task_text, batch_size, obs_rgb.device)
        text_tokens = text_token.unsqueeze(1).expand(-1, n_obs_steps, -1)

        camera_tokens: list[torch.Tensor] = []
        for cam_idx, vision_branch in enumerate(self.vision_branches):
            cam_bthwc = obs_rgb[:, :, cam_idx]
            cam_bchw = cam_bthwc.reshape(batch_size * n_obs_steps, *cam_bthwc.shape[-3:]).permute(0, 3, 1, 2)
            cam_bchw = self._normalize_images(cam_bchw)

            clip_features = vision_branch(cam_bchw)
            clip_features = self.camera_feature_adapter(clip_features)

            history_features = self.history_encoders[cam_idx](cam_bchw)
            history_features = self.history_feature_adapter(history_features)

            fused_camera_features = self.camera_history_fuser(
                torch.cat([clip_features, history_features], dim=-1)
            )
            camera_tokens.append(fused_camera_features.reshape(batch_size, n_obs_steps, -1))

        state_tokens = self.robot_state_adapter(robot_state_obs.float())
        fusion_features = torch.cat([*camera_tokens, state_tokens, text_tokens], dim=-1)
        step_tokens = self.step_fusion_adapter(fusion_features)
        cond_obs_tokens = self.cond_token_projector(step_tokens)
        return torch.cat([cond_obs_tokens, robot_state_obs.float()], dim=-1)

    def encode(self, batch: dict[str, torch.Tensor | Sequence[str]]) -> torch.Tensor:
        return self(
            batch["observation.images"],
            batch["observation.state"],
            task_text=batch.get("task"),
        )
