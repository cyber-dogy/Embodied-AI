from __future__ import annotations

from abc import ABC, abstractmethod

import einops
import torch
import torch.nn as nn
import torchvision
from torch import Tensor

from mdit.constants import OBS_IMAGES, OBS_STATE, TASK


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
        self._configure_train_mode(str(getattr(config, "train_mode", "frozen")).lower())

    def _configure_train_mode(self, train_mode: str) -> None:
        for param in self.model.parameters():
            param.requires_grad_(False)

        if train_mode == "frozen":
            return
        if train_mode == "all":
            for param in self.model.parameters():
                param.requires_grad_(True)
            return
        if train_mode != "last_block":
            raise ValueError(f"Unsupported vision train_mode: {train_mode}")

        blocks = getattr(self.model, "blocks", None)
        if isinstance(blocks, (list, nn.ModuleList)) and len(blocks) > 0:
            for param in blocks[-1].parameters():
                param.requires_grad_(True)
            norm = getattr(self.model, "norm", None)
            if isinstance(norm, nn.Module):
                for param in norm.parameters():
                    param.requires_grad_(True)
            return

        layers = getattr(self.model, "layers", None)
        if isinstance(layers, (list, nn.ModuleList)) and len(layers) > 0:
            last_layer = layers[-1]
            if isinstance(last_layer, nn.Module):
                for param in last_layer.parameters():
                    param.requires_grad_(True)
            return

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
        vision_config = config.observation_encoder.vision
        self.camera_names = list(config.camera_names)
        self.num_cameras = len(self.camera_names)
        self.robot_state_dim = int(config.robot_state_dim)
        self.text_dim = int(config.transformer.hidden_dim)

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
        per_step_dim = self.robot_state_dim + self.text_dim + self.visual_feature_dim * self.num_cameras
        return int(per_step_dim * int(self.config.n_obs_steps))

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

    def encode(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        obs_state = batch[OBS_STATE]
        batch_size, n_obs_steps = obs_state.shape[:2]
        conditioning_feats = [obs_state]

        if self.num_cameras > 0:
            images = batch[OBS_IMAGES]
            if images.ndim == 5:
                images = images.unsqueeze(1)

            if self.vision_encoders is not None:
                camera_features = []
                for cam_idx in range(self.num_cameras):
                    cam_images = images[:, :, cam_idx]
                    cam_images = einops.rearrange(cam_images, "b s c h w -> (b s) c h w")
                    cam_images = self._apply_preprocessing(cam_images)
                    cam_features = self.vision_encoders[cam_idx](cam_images).flatten(start_dim=1)
                    cam_features = einops.rearrange(cam_features, "(b s) f -> b s f", b=batch_size, s=n_obs_steps)
                    camera_features.append(cam_features)
                conditioning_feats.append(torch.cat(camera_features, dim=-1))
            else:
                flat_images = einops.rearrange(images, "b s n c h w -> (b s n) c h w")
                flat_images = self._apply_preprocessing(flat_images)
                flat_features = self.vision_encoder(flat_images).flatten(start_dim=1)
                img_features = einops.rearrange(
                    flat_features,
                    "(b s n) f -> b s (n f)",
                    b=batch_size,
                    s=n_obs_steps,
                    n=self.num_cameras,
                )
                conditioning_feats.append(img_features)

        task = batch.get(TASK)
        if task is not None:
            text_features = self.text_encoder(task)
            text_features = text_features.unsqueeze(1).expand(-1, n_obs_steps, -1)
            conditioning_feats.append(text_features)

        combined = torch.cat(conditioning_feats, dim=-1)
        return combined.flatten(start_dim=1)
