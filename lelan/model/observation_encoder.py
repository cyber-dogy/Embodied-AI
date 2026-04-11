"""Full observation encoder assembling FiLM + HistoryEncoder + Text + Transformer fusion.

This is the core architectural distinction from MDIT:
- MDIT: frozen CLIP ViT per camera -> flat concatenation across obs steps -> conditioning vec
- LeLaN: FiLM(current frame, text) + EfficientNet(all frames) -> Transformer self-attention fusion

Key differences:
- Condition injection: FiLM (feature-level affine) vs MDIT's AdaLN-Zero (norm-level modulation)
- Temporal fusion: Transformer encoder with sinusoidal PE vs MDIT's flat concatenation
- Positional encoding: Sinusoidal (fixed) vs MDIT's learned absolute or RoPE
"""
from __future__ import annotations

import math

import einops
import torch
import torch.nn as nn
import torchvision
from torch import Tensor

from lelan.constants import OBS_IMAGES, OBS_STATE, TASK
from .film_encoder import FiLMNetwork
from .history_encoder import HistoryEncoder
from .text_encoder import CLIPTextEncoder


class SinusoidalPositionalEncoding(nn.Module):
    """Fixed sinusoidal positional encoding (no learnable params, no RoPE)."""

    def __init__(self, d_model: int, max_seq_len: int = 64) -> None:
        super().__init__()
        pos_enc = torch.zeros(max_seq_len, d_model)
        pos = torch.arange(0, max_seq_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pos_enc[:, 0::2] = torch.sin(pos * div_term)
        pos_enc[:, 1::2] = torch.cos(pos * div_term)
        self.register_buffer("pos_enc", pos_enc.unsqueeze(0))

    def forward(self, x: Tensor) -> Tensor:
        return x + self.pos_enc[:, : x.size(1), :]


class ObservationEncoder(nn.Module):
    """Encodes multi-camera observations with FiLM + history + Transformer fusion.

    Per camera:
      1. Current frame (last obs step) -> FiLMNetwork(text) -> compress -> 1 token
      2. All obs steps -> HistoryEncoder(EfficientNet) -> n_obs_steps tokens
      3. Total: (n_obs_steps + 1) tokens per camera

    All camera tokens -> Sinusoidal PE -> TransformerEncoder -> mean pool
    Concatenated with robot_state -> flat conditioning vector
    """

    def __init__(self, config) -> None:
        super().__init__()
        self.config = config
        self.camera_names = list(config.camera_names)
        self.num_cameras = len(self.camera_names)
        self.robot_state_dim = int(config.robot_state_dim)
        self.n_obs_steps = int(config.n_obs_steps)

        fusion_dim = int(config.fusion_transformer.hidden_dim)
        self.fusion_dim = fusion_dim

        # Text encoder (frozen CLIP)
        text_model = str(config.text_encoder.model)
        self.text_encoder = CLIPTextEncoder(model_name=text_model, projection_dim=fusion_dim)
        text_raw_dim = self.text_encoder.text_embed_dim

        # FiLM vision encoder for current frame (conditioned on raw CLIP text features)
        self.film_encoder = FiLMNetwork(
            num_res_blocks=int(config.film.num_res_blocks),
            num_channels=int(config.film.num_channels),
            text_dim=text_raw_dim,
            use_coord_conv=bool(config.film.use_coord_conv),
        )

        # Compute FiLM output dim by running a dummy forward pass
        with torch.no_grad():
            dummy_img = torch.zeros(1, 3, 224, 224)
            dummy_text = torch.zeros(1, text_raw_dim)
            film_out = self.film_encoder(dummy_img, dummy_text)
            self._film_feature_dim = film_out.shape[1]
        self.film_compress = nn.Linear(self._film_feature_dim, fusion_dim)

        # History encoder (EfficientNet for all obs frames)
        self.history_encoder = HistoryEncoder(
            backbone=str(config.history_encoder.backbone),
            encoding_dim=fusion_dim,
            features_per_group=int(config.history_encoder.features_per_group),
        )

        # Image preprocessing
        self._setup_preprocessing()

        # Transformer fusion (sinusoidal PE, standard self-attention — no AdaLN-Zero, no RoPE)
        max_seq_len = (self.n_obs_steps + 1) * self.num_cameras
        self.positional_encoding = SinusoidalPositionalEncoding(fusion_dim, max_seq_len=max(max_seq_len, 64))
        sa_layer = nn.TransformerEncoderLayer(
            d_model=fusion_dim,
            nhead=int(config.fusion_transformer.num_heads),
            dim_feedforward=int(config.fusion_transformer.ff_dim_factor) * fusion_dim,
            activation="gelu",
            batch_first=True,
            norm_first=True,
            dropout=float(config.fusion_transformer.dropout),
        )
        self.fusion_transformer = nn.TransformerEncoder(sa_layer, num_layers=int(config.fusion_transformer.num_layers))

        # Conditioning dim = transformer_output + robot_state
        self.conditioning_dim = fusion_dim + self.robot_state_dim * self.n_obs_steps

    def _setup_preprocessing(self) -> None:
        self.resize = torchvision.transforms.Resize(
            size=(224, 224),
            interpolation=torchvision.transforms.InterpolationMode.BILINEAR,
            antialias=True,
        )
        clip_mean = (0.48145466, 0.4578275, 0.40821073)
        clip_std = (0.26862954, 0.26130258, 0.27577711)
        self.register_buffer("_img_mean", torch.tensor(clip_mean).view(1, 3, 1, 1), persistent=False)
        self.register_buffer("_img_std", torch.tensor(clip_std).view(1, 3, 1, 1), persistent=False)

    def _preprocess_images(self, images: Tensor) -> Tensor:
        """Normalize images to CLIP-compatible range."""
        images = images.to(dtype=torch.float32)
        if images.max() > 1.0:
            images = images / 255.0
        images = self.resize(images)
        mean = self._img_mean.to(device=images.device, dtype=images.dtype)
        std = self._img_std.to(device=images.device, dtype=images.dtype)
        return (images - mean) / std

    def _get_raw_text_features(self, text: str | list[str]) -> Tensor:
        """Get raw CLIP text features (before projection) for FiLM conditioning."""
        if isinstance(text, str):
            text = [text]
        tokenized = self.text_encoder.tokenizer(text, padding=True, truncation=True, return_tensors="pt")
        tokenized = {k: v.to(next(self.parameters()).device) for k, v in tokenized.items()}
        with torch.no_grad():
            outputs = self.text_encoder.text_encoder(**tokenized)
        return outputs.pooler_output

    def encode(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        """Encode observations into a flat conditioning vector.

        Args:
            batch: Dict with OBS_STATE (B, n_obs, state_dim), OBS_IMAGES (B, n_obs, n_cam, C, H, W), TASK.

        Returns:
            (B, conditioning_dim) flat conditioning vector.
        """
        obs_state = batch[OBS_STATE]
        batch_size = obs_state.shape[0]
        images = batch[OBS_IMAGES]
        if images.ndim == 5:
            images = images.unsqueeze(1)

        task = batch.get(TASK)
        raw_text_feat = self._get_raw_text_features(task)

        all_tokens = []

        for cam_idx in range(self.num_cameras):
            cam_images = images[:, :, cam_idx]  # (B, n_obs, C, H, W)

            # --- History tokens: all obs steps through EfficientNet ---
            history_flat = einops.rearrange(cam_images, "b s c h w -> (b s) c h w")
            history_flat = self._preprocess_images(history_flat)
            history_tokens = self.history_encoder(history_flat)
            history_tokens = einops.rearrange(
                history_tokens, "(b s) d -> b s d", b=batch_size, s=self.n_obs_steps
            )
            all_tokens.append(history_tokens)

            # --- FiLM token: current frame (last obs step) conditioned on text ---
            current_frame = cam_images[:, -1]  # (B, C, H, W)
            current_frame = self._preprocess_images(current_frame)
            film_feat = self.film_encoder(current_frame, raw_text_feat)
            film_token = self.film_compress(film_feat).unsqueeze(1)  # (B, 1, fusion_dim)
            all_tokens.append(film_token)

        # (B, total_tokens, fusion_dim)
        token_seq = torch.cat(all_tokens, dim=1)

        # Transformer fusion with sinusoidal positional encoding
        token_seq = self.positional_encoding(token_seq)
        fused = self.fusion_transformer(token_seq)
        fused_pooled = fused.mean(dim=1)  # (B, fusion_dim)

        # Concatenate with robot state
        flat_state = obs_state.flatten(start_dim=1)  # (B, n_obs * state_dim)
        return torch.cat([fused_pooled, flat_state], dim=-1)
