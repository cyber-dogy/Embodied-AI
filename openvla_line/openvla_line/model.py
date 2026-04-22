from __future__ import annotations

import math

import torch
from torch import nn


def sinusoidal_position_encoding(length: int, dim: int, device: torch.device) -> torch.Tensor:
    positions = torch.arange(length, device=device, dtype=torch.float32).unsqueeze(1)
    div_term = torch.exp(torch.arange(0, dim, 2, device=device, dtype=torch.float32) * (-math.log(10000.0) / dim))
    encoding = torch.zeros(length, dim, device=device, dtype=torch.float32)
    encoding[:, 0::2] = torch.sin(positions * div_term)
    encoding[:, 1::2] = torch.cos(positions * div_term)
    return encoding


class VisionTokenizer(nn.Module):
    def __init__(self, hidden_dim: int) -> None:
        super().__init__()
        inner = max(hidden_dim // 4, 32)
        self.encoder = nn.Sequential(
            nn.Conv2d(3, inner, kernel_size=4, stride=2, padding=1),
            nn.GELU(),
            nn.Conv2d(inner, inner * 2, kernel_size=4, stride=2, padding=1),
            nn.GELU(),
            nn.Conv2d(inner * 2, hidden_dim, kernel_size=4, stride=2, padding=1),
            nn.GELU(),
            nn.Conv2d(hidden_dim, hidden_dim, kernel_size=4, stride=2, padding=1),
            nn.GELU(),
        )
        self.norm = nn.LayerNorm(hidden_dim)

    def forward(self, image: torch.Tensor) -> torch.Tensor:
        features = self.encoder(image)
        tokens = features.flatten(2).transpose(1, 2)
        return self.norm(tokens)


class OpenVLAStylePolicy(nn.Module):
    def __init__(
        self,
        vocab_size: int,
        proprio_dim: int,
        action_dim: int,
        num_cameras: int,
        hidden_dim: int = 256,
        num_heads: int = 8,
        depth: int = 6,
        mlp_ratio: float = 4.0,
        dropout: float = 0.1,
    ) -> None:
        super().__init__()
        self.hidden_dim = hidden_dim
        self.num_cameras = num_cameras

        self.vision = VisionTokenizer(hidden_dim)
        self.text_embedding = nn.Embedding(vocab_size, hidden_dim)
        self.text_norm = nn.LayerNorm(hidden_dim)
        self.proprio_proj = nn.Sequential(
            nn.Linear(proprio_dim, hidden_dim),
            nn.GELU(),
            nn.LayerNorm(hidden_dim),
        )

        self.modality_embeddings = nn.Embedding(4, hidden_dim)
        self.camera_embeddings = nn.Embedding(max(1, num_cameras), hidden_dim)
        self.action_query = nn.Parameter(torch.zeros(1, 1, hidden_dim))

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=hidden_dim,
            nhead=num_heads,
            dim_feedforward=int(hidden_dim * mlp_ratio),
            dropout=dropout,
            activation="gelu",
            batch_first=True,
            norm_first=False,
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=depth)
        self.head = nn.Sequential(
            nn.LayerNorm(hidden_dim),
            nn.Linear(hidden_dim, hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, action_dim),
        )

        nn.init.normal_(self.action_query, std=0.02)

    def forward(
        self,
        images: torch.Tensor,
        proprio: torch.Tensor,
        input_ids: torch.Tensor,
        attention_mask: torch.Tensor,
    ) -> torch.Tensor:
        batch_size, num_cameras = images.shape[:2]
        if num_cameras != self.num_cameras:
            raise ValueError(f"期望 {self.num_cameras} 路相机，实际拿到 {num_cameras}")

        image_tokens = []
        modality_image = self.modality_embeddings.weight[2].view(1, 1, -1)
        for camera_index in range(num_cameras):
            camera_tokens = self.vision(images[:, camera_index])
            camera_tokens = camera_tokens + modality_image + self.camera_embeddings.weight[camera_index].view(1, 1, -1)
            camera_tokens = camera_tokens + sinusoidal_position_encoding(
                camera_tokens.shape[1], self.hidden_dim, camera_tokens.device
            ).unsqueeze(0)
            image_tokens.append(camera_tokens)
        image_tokens = torch.cat(image_tokens, dim=1)

        text_tokens = self.text_embedding(input_ids)
        text_tokens = self.text_norm(text_tokens)
        text_tokens = text_tokens + self.modality_embeddings.weight[3].view(1, 1, -1)
        text_tokens = text_tokens + sinusoidal_position_encoding(text_tokens.shape[1], self.hidden_dim, text_tokens.device).unsqueeze(0)

        proprio_token = self.proprio_proj(proprio).unsqueeze(1)
        proprio_token = proprio_token + self.modality_embeddings.weight[1].view(1, 1, -1)

        action_query = self.action_query.expand(batch_size, -1, -1)
        action_query = action_query + self.modality_embeddings.weight[0].view(1, 1, -1)

        tokens = torch.cat([action_query, proprio_token, image_tokens, text_tokens], dim=1)
        prefix_mask = torch.zeros(
            batch_size,
            2 + image_tokens.shape[1],
            device=attention_mask.device,
            dtype=torch.bool,
        )
        text_padding_mask = attention_mask == 0
        key_padding_mask = torch.cat([prefix_mask, text_padding_mask], dim=1)

        fused = self.transformer(tokens, src_key_padding_mask=key_padding_mask)
        return self.head(fused[:, 0])
