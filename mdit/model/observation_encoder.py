from __future__ import annotations

import contextlib
from abc import ABC, abstractmethod

import einops
import torch
import torch.nn as nn
import torchvision
from torch import Tensor

from mdit.constants import OBS_IMAGES, OBS_PCD, OBS_STATE, TASK
from pdit.model.encoders.pointnet.pointnet import PointNetfeat


def _default_clip_mean() -> tuple[float, float, float]:
    return (0.48145466, 0.4578275, 0.40821073)


def _default_clip_std() -> tuple[float, float, float]:
    return (0.26862954, 0.26130258, 0.27577711)


class BaseVisionEncoder(ABC):
    @abstractmethod
    def forward(self, x: Tensor) -> Tensor:
        raise NotImplementedError

    @abstractmethod
    def get_output_shape(self) -> tuple[int, int, int]:
        raise NotImplementedError


class DinoV3Encoder(nn.Module, BaseVisionEncoder):
    def __init__(self, config) -> None:
        super().__init__()
        import timm

        self.config = config
        self.model = timm.create_model(
            config.backbone,
            pretrained=True,
            num_classes=0,
        )
        self.embed_dim = int(self.model.embed_dim)

    def forward(self, x: Tensor) -> Tensor:
        features = self.model.forward_features(x)
        cls_token = features[:, 0]
        batch_size = int(cls_token.shape[0])
        return cls_token.reshape(batch_size, self.embed_dim, 1, 1)

    def get_output_shape(self) -> tuple[int, int, int]:
        return (self.embed_dim, 1, 1)


class CLIPEncoder(nn.Module, BaseVisionEncoder):
    def __init__(self, config) -> None:
        super().__init__()
        import timm

        self.config = config
        self.model = timm.create_model(
            config.backbone,
            pretrained=True,
            num_classes=0,
        )
        self.embed_dim = int(self.model.embed_dim)
        self._configure_train_mode(
            str(getattr(config, "train_mode", "all")).lower(),
            num_unfreeze_blocks=int(getattr(config, "num_unfreeze_blocks", 1)),
        )

    def _configure_train_mode(self, train_mode: str, num_unfreeze_blocks: int = 1) -> None:
        """Set which parameters are trainable.

        Args:
            train_mode: One of:
                "frozen"       – freeze the entire encoder
                "all"          – unfreeze the entire encoder
                "last_block"   – alias for last_n_blocks with num_unfreeze_blocks=1
                "last_n_blocks"– unfreeze the top-N transformer blocks + final norm
            num_unfreeze_blocks: Number of blocks from the top to unfreeze when
                train_mode is "last_block" or "last_n_blocks".  Ignored for other modes.
        """
        for param in self.model.parameters():
            param.requires_grad_(False)

        if train_mode == "frozen":
            return
        if train_mode == "all":
            for param in self.model.parameters():
                param.requires_grad_(True)
            return
        if train_mode not in ("last_block", "last_n_blocks"):
            raise ValueError(
                f"Unsupported vision train_mode: {train_mode!r}. "
                "Choose from: 'frozen', 'all', 'last_block', 'last_n_blocks'."
            )

        n = int(max(1, num_unfreeze_blocks))

        # timm ViTs expose blocks as nn.Sequential; other models use list or
        # nn.ModuleList.  Accept all three to avoid silently falling back.
        _BLOCK_CONTAINER_TYPES = (list, nn.ModuleList, nn.Sequential)

        blocks = getattr(self.model, "blocks", None)
        if isinstance(blocks, _BLOCK_CONTAINER_TYPES) and len(blocks) > 0:
            for block in list(blocks)[-n:]:
                for param in block.parameters():
                    param.requires_grad_(True)
            norm = getattr(self.model, "norm", None)
            if isinstance(norm, nn.Module):
                for param in norm.parameters():
                    param.requires_grad_(True)
            return

        layers = getattr(self.model, "layers", None)
        if isinstance(layers, _BLOCK_CONTAINER_TYPES) and len(layers) > 0:
            for layer in list(layers)[-n:]:
                if isinstance(layer, nn.Module):
                    for param in layer.parameters():
                        param.requires_grad_(True)
            return

        # Fallback: unfreeze everything if no standard block structure found
        for param in self.model.parameters():
            param.requires_grad_(True)

    def forward(self, x: Tensor) -> Tensor:
        features = self.model.forward_features(x)
        cls_token = features[:, 0]
        batch_size = int(cls_token.shape[0])
        return cls_token.reshape(batch_size, self.embed_dim, 1, 1)

    def get_output_shape(self) -> tuple[int, int, int]:
        return (self.embed_dim, 1, 1)


def create_vision_encoder(config) -> BaseVisionEncoder:
    backbone_name = str(config.backbone).lower()
    if "clip" in backbone_name:
        return CLIPEncoder(config)
    if "dinov3" in backbone_name:
        return DinoV3Encoder(config)
    raise ValueError(
        f"Unsupported vision backbone: {config.backbone}. "
        "Currently supported backbones must contain either 'clip' or 'dinov3'."
    )


class PointNetObsTokenEncoder(nn.Module):
    """PointNet-based observation encoder matching PDIT's implementation exactly."""

    def __init__(
        self,
        embed_dim: int,
        input_channels: int,
        input_transform: bool,
        use_group_norm: bool = False,
    ) -> None:
        super().__init__()
        assert input_channels in [3, 6], "Input channels must be 3 or 6"
        self.embed_dim = int(embed_dim)
        from common.torch_utils import replace_submodules
        self.backbone = nn.Sequential(
            PointNetfeat(input_channels, input_transform),
            nn.Mish(),
            nn.Linear(1024, 512),
            nn.Mish(),
            nn.Linear(512, embed_dim),
        )
        if use_group_norm:
            self.backbone = replace_submodules(
                root_module=self.backbone,
                predicate=lambda x: isinstance(x, nn.BatchNorm1d),
                func=lambda x: nn.GroupNorm(
                    num_groups=x.num_features // 16,
                    num_channels=x.num_features,
                ),
            )

    def forward(self, pcd: Tensor, robot_state_obs: Tensor) -> Tensor:
        """
        Args:
            pcd: (B, T_obs, P, C) point cloud tensor
            robot_state_obs: (B, T_obs, state_dim) robot state tensor
        Returns:
            (B, T_obs, embed_dim + state_dim) per-timestep observation tokens
        """
        batch_size, n_obs_steps, n_points, channels = pcd.shape
        flat_pcd = pcd.float().reshape(batch_size * n_obs_steps, n_points, channels).permute(0, 2, 1)
        flat_robot_state = robot_state_obs.float().reshape(batch_size * n_obs_steps, -1)

        # PointNet Conv1d+BatchNorm is prone to non-finite outputs under fp16 autocast
        autocast_off = (
            torch.autocast(device_type=flat_pcd.device.type, enabled=False)
            if flat_pcd.device.type in {"cuda", "cpu"}
            else contextlib.nullcontext()
        )
        with autocast_off:
            encoded_pcd = self.backbone(flat_pcd)

        obs_tokens = torch.cat([encoded_pcd, flat_robot_state], dim=-1)
        return obs_tokens.reshape(batch_size, n_obs_steps, -1)


class CLIPTextEncoder(nn.Module):
    def __init__(self, model_name: str, projection_dim: int) -> None:
        super().__init__()
        from transformers import CLIPTextModel, CLIPTokenizer

        self.tokenizer = CLIPTokenizer.from_pretrained(model_name)
        self.text_encoder = CLIPTextModel.from_pretrained(model_name)
        for param in self.text_encoder.parameters():
            param.requires_grad_(False)
        self.text_embed_dim = int(self.text_encoder.config.hidden_size)
        self.projection = nn.Linear(self.text_embed_dim, projection_dim)

    def forward(self, text: str | list[str]) -> Tensor:
        if isinstance(text, str):
            text = [text]
        tokenized = self.tokenizer(text, padding=True, truncation=True, return_tensors="pt")
        tokenized = {
            key: value.to(next(self.parameters()).device)
            for key, value in tokenized.items()
        }
        with torch.no_grad():
            outputs = self.text_encoder(**tokenized)
            text_features = outputs.pooler_output
        return self.projection(text_features)


class ObservationEncoder(nn.Module):
    def __init__(self, config) -> None:
        super().__init__()
        self.config = config
        self.robot_state_dim = int(config.robot_state_dim)
        self.use_pcd = bool(config.use_pcd)
        self.transformer_variant = str(
            getattr(config, "transformer_variant", getattr(config, "pcd_transformer_variant", "mdit"))
        ).lower()
        self._is_legacy_pdit = self.transformer_variant == "pdit"

        if self.use_pcd:
            pcd_cfg = config.observation_encoder.pcd
            input_channels = 6 if bool(pcd_cfg.use_color) else 3
            self.pcd_encoder = PointNetObsTokenEncoder(
                embed_dim=int(pcd_cfg.embed_dim),
                input_channels=input_channels,
                input_transform=bool(pcd_cfg.input_transform),
                use_group_norm=bool(pcd_cfg.use_group_norm),
            )
            norm_center = tuple(float(v) for v in pcd_cfg.norm_center)
            self.register_buffer(
                "_pcd_norm_center",
                torch.tensor(norm_center, dtype=torch.float32),
                persistent=False,
            )
            # Unused in PCD mode
            self.vision_encoder = None
            self.vision_encoders = None
            self.text_encoder = None
            self.state_token_proj = None
            self.vision_token_proj = None
            self.text_token_proj = None
            self.visual_feature_dim = 0
            self.text_dim = 0
            self.num_cameras = 0
            self.camera_names = []
            self.token_dim = self.robot_state_dim + int(pcd_cfg.embed_dim)
        else:
            vision_config = config.observation_encoder.vision
            self.camera_names = list(config.camera_names)
            self.num_cameras = len(self.camera_names)
            self.text_dim = int(config.transformer.hidden_dim)
            self.pcd_encoder = None

            self._setup_preprocessing(vision_config)

            if self.num_cameras > 0:
                if bool(vision_config.use_separate_encoder_per_camera):
                    self.vision_encoders = nn.ModuleList(
                        [create_vision_encoder(vision_config) for _ in self.camera_names]
                    )
                    self.vision_encoder = None
                    vision_probe = self.vision_encoders[0]
                else:
                    self.vision_encoder = create_vision_encoder(vision_config)
                    self.vision_encoders = None
                    vision_probe = self.vision_encoder
                mean, std = self._resolve_image_stats(vision_probe)
                self.register_buffer("_img_mean", torch.tensor(mean).view(1, 3, 1, 1), persistent=False)
                self.register_buffer("_img_std", torch.tensor(std).view(1, 3, 1, 1), persistent=False)
                feature_c, feature_h, feature_w = vision_probe.get_output_shape()
                self.visual_feature_dim = int(feature_c * feature_h * feature_w)
            else:
                self.vision_encoder = None
                self.vision_encoders = None
                self.visual_feature_dim = 0
                self.register_buffer("_img_mean", torch.tensor(_default_clip_mean()).view(1, 3, 1, 1), persistent=False)
                self.register_buffer("_img_std", torch.tensor(_default_clip_std()).view(1, 3, 1, 1), persistent=False)

            text_model_name = str(config.observation_encoder.text.model)
            self.text_encoder = CLIPTextEncoder(model_name=text_model_name, projection_dim=self.text_dim)
            hidden_dim = int(config.transformer.hidden_dim)
            self.state_token_proj = nn.Linear(self.robot_state_dim, hidden_dim)
            self.vision_token_proj = (
                None if self.visual_feature_dim <= 0 else nn.Linear(self.visual_feature_dim, hidden_dim)
            )
            if self.text_dim == hidden_dim:
                self.text_token_proj = nn.Identity()
            else:
                self.text_token_proj = nn.Linear(self.text_dim, hidden_dim)
            if self._is_legacy_pdit:
                self.token_dim = hidden_dim
            else:
                self.token_dim = self.robot_state_dim + self.text_dim + self.visual_feature_dim * self.num_cameras

        self.conditioning_dim = self._compute_conditioning_dim()

    def _setup_preprocessing(self, vision_config) -> None:
        resize_shape = getattr(vision_config, "resize_shape", None)
        crop_shape = getattr(vision_config, "crop_shape", None)
        crop_is_random = bool(getattr(vision_config, "crop_is_random", False))

        self.resize = None
        if resize_shape is not None:
            self.resize = torchvision.transforms.Resize(
                size=resize_shape,
                interpolation=torchvision.transforms.InterpolationMode.BILINEAR,
                antialias=True,
            )

        self.center_crop = None
        self.random_crop = None
        if crop_shape is not None:
            self.center_crop = torchvision.transforms.CenterCrop(crop_shape)
            self.random_crop = (
                torchvision.transforms.RandomCrop(crop_shape) if crop_is_random else self.center_crop
            )

    def _resolve_image_stats(self, vision_encoder: BaseVisionEncoder) -> tuple[tuple[float, ...], tuple[float, ...]]:
        pretrained_cfg = getattr(getattr(vision_encoder, "model", None), "pretrained_cfg", {}) or {}
        mean = tuple(float(v) for v in pretrained_cfg.get("mean", _default_clip_mean()))
        std = tuple(float(v) for v in pretrained_cfg.get("std", _default_clip_std()))
        return mean, std

    def _compute_conditioning_dim(self) -> int:
        if self.use_pcd:
            return int(self.token_dim * int(self.config.n_obs_steps))
        if self._is_legacy_pdit:
            return int(self.token_dim * self._num_condition_tokens())
        return int(self.token_dim * int(self.config.n_obs_steps))

    def _num_condition_tokens(self) -> int:
        if self.use_pcd:
            return int(self.config.n_obs_steps)
        token_count = int(self.config.n_obs_steps) * (1 + int(self.num_cameras))
        if self.text_encoder is not None:
            token_count += 1
        return token_count

    def _encode_rgb_camera_features(self, images: Tensor, batch_size: int, n_obs_steps: int) -> Tensor | None:
        if self.num_cameras <= 0:
            return None

        if self.vision_encoders is not None:
            camera_features = []
            for cam_idx in range(self.num_cameras):
                cam_images = images[:, :, cam_idx]
                cam_images = einops.rearrange(cam_images, "b s c h w -> (b s) c h w")
                cam_images = self._apply_preprocessing(cam_images)
                cam_features = self.vision_encoders[cam_idx](cam_images).flatten(start_dim=1)
                cam_features = einops.rearrange(cam_features, "(b s) f -> b s f", b=batch_size, s=n_obs_steps)
                camera_features.append(cam_features)
            return torch.stack(camera_features, dim=2)

        flat_images = einops.rearrange(images, "b s n c h w -> (b s n) c h w")
        flat_images = self._apply_preprocessing(flat_images)
        flat_features = self.vision_encoder(flat_images).flatten(start_dim=1)
        return einops.rearrange(
            flat_features,
            "(b s n) f -> b s n f",
            b=batch_size,
            s=n_obs_steps,
            n=self.num_cameras,
        )

    def _apply_preprocessing(self, images: Tensor) -> Tensor:
        images = images.to(dtype=torch.float32)
        if torch.max(images) > 1.0:
            images = images / 255.0
        if self.resize is not None:
            images = self.resize(images)
        if self.center_crop is not None:
            crop = self.random_crop if self.training and self.random_crop is not None else self.center_crop
            images = crop(images)
        images = (images - self._img_mean.to(device=images.device, dtype=images.dtype)) / self._img_std.to(
            device=images.device,
            dtype=images.dtype,
        )
        return images

    def encode_tokens(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        if self.use_pcd:
            pcd = batch[OBS_PCD]
            obs_state = batch[OBS_STATE]
            # Normalize xyz by subtracting scene center
            norm_center = self._pcd_norm_center.to(device=pcd.device, dtype=pcd.dtype)
            pcd = pcd.clone()
            pcd[..., :3] -= norm_center
            obs_tokens = self.pcd_encoder(pcd, obs_state)  # (B, T_obs, embed+state)
            return obs_tokens

        obs_state = batch[OBS_STATE]
        batch_size, n_obs_steps = obs_state.shape[:2]
        camera_features = None
        if self.num_cameras > 0:
            images = batch[OBS_IMAGES]
            if images.ndim == 5:
                images = images.unsqueeze(1)
            camera_features = self._encode_rgb_camera_features(images, batch_size, n_obs_steps)

        task = batch.get(TASK)

        if self._is_legacy_pdit:
            return self._encode_legacy_pdit_tokens(obs_state, camera_features, task)

        conditioning_feats = [obs_state.float()]
        if camera_features is not None:
            conditioning_feats.append(camera_features.flatten(start_dim=2).float())
        if task is not None:
            text_features = self.text_encoder(task)
            text_features = text_features.unsqueeze(1).expand(-1, n_obs_steps, -1)
            conditioning_feats.append(text_features)
        return torch.cat(conditioning_feats, dim=-1)

    def encode(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        return self.encode_tokens(batch).flatten(start_dim=1)

    def _encode_legacy_pdit_tokens(
        self,
        obs_state: Tensor,
        camera_features: Tensor | None,
        task: Tensor | list[str] | None,
    ) -> Tensor:
        state_tokens = self.state_token_proj(obs_state.float())
        if camera_features is not None and self.vision_token_proj is not None:
            vision_tokens = self.vision_token_proj(camera_features.float())
            per_step_tokens = torch.cat([state_tokens.unsqueeze(2), vision_tokens], dim=2)
        else:
            per_step_tokens = state_tokens.unsqueeze(2)
        cond_tokens = einops.rearrange(per_step_tokens, "b s n d -> b (s n) d")
        if task is not None:
            text_features = self.text_encoder(task)
            text_token = self.text_token_proj(text_features).unsqueeze(1)
            cond_tokens = torch.cat([cond_tokens, text_token], dim=1)
        return cond_tokens
