"""FiLM (Feature-wise Linear Modulation) vision encoder.

Adapted from LeLaN's lelan_comp.py. Processes the current observation frame
conditioned on language features via affine modulation of visual features.

Key differences from MDIT's CLIP ViT approach:
- MDIT uses a frozen CLIP ViT backbone extracting CLS tokens
- LeLaN uses a custom CNN with FiLM conditioning (gamma * x + beta) at each
  residual block, where gamma/beta are generated from the CLIP text embedding

Architecture:
  InitialFeatureExtractor (3 conv layers, 8x spatial downsample)
  -> N FiLM-conditioned ResidualBlocks (with CoordConv)
  -> IntermediateFeatureExtractor (4 conv layers)
  -> flatten
"""
from __future__ import annotations

import torch
import torch.nn as nn
from torch import Tensor


def _create_conv_layer(in_channels: int, out_channels: int, kernel_size: int, stride: int, padding: int) -> nn.Sequential:
    return nn.Sequential(
        nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding),
        nn.ReLU(inplace=True),
        nn.GroupNorm(num_groups=out_channels // 16, num_channels=out_channels),
    )


class InitialFeatureExtractor(nn.Module):
    """3 conv layers: RGB (3ch) -> 128ch, 8x spatial downsample."""

    def __init__(self) -> None:
        super().__init__()
        self.layers = nn.Sequential(
            _create_conv_layer(3, 128, 5, 2, 2),
            _create_conv_layer(128, 128, 3, 2, 1),
            _create_conv_layer(128, 128, 3, 2, 1),
        )

    def forward(self, x: Tensor) -> Tensor:
        return self.layers(x)


class IntermediateFeatureExtractor(nn.Module):
    """4 conv layers: 128 -> 256 -> 512 -> 1024 -> 1024."""

    def __init__(self) -> None:
        super().__init__()
        self.layers = nn.Sequential(
            _create_conv_layer(128, 256, 3, 2, 1),
            _create_conv_layer(256, 512, 3, 2, 1),
            _create_conv_layer(512, 1024, 3, 2, 1),
            _create_conv_layer(1024, 1024, 3, 2, 1),
        )

    def forward(self, x: Tensor) -> Tensor:
        return self.layers(x)


class FiLMTransform(nn.Module):
    """Applies Feature-wise Linear Modulation: gamma * x + beta."""

    def forward(self, x: Tensor, gamma: Tensor, beta: Tensor) -> Tensor:
        beta = beta.view(x.size(0), x.size(1), 1, 1)
        gamma = gamma.view(x.size(0), x.size(1), 1, 1)
        return gamma * x + beta


class ResidualBlock(nn.Module):
    """FiLM-conditioned residual block with CoordConv input.

    Conv1x1(in_ch -> out_ch) -> ReLU -> [identity]
    Conv3x3 -> GroupNorm -> FiLM(gamma, beta) -> ReLU -> + identity
    """

    def __init__(self, in_channels: int, out_channels: int) -> None:
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, 1, 1, 0)
        self.relu1 = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(out_channels, out_channels, 3, 1, 1)
        self.norm2 = nn.GroupNorm(num_groups=out_channels // 16, num_channels=out_channels)
        self.film_transform = FiLMTransform()
        self.relu2 = nn.ReLU(inplace=True)

    def forward(self, x: Tensor, beta: Tensor, gamma: Tensor) -> Tensor:
        x = self.conv1(x)
        x = self.relu1(x)
        identity = x
        x = self.conv2(x)
        x = self.norm2(x)
        x = self.film_transform(x, gamma, beta)
        x = self.relu2(x)
        return x + identity


class FiLMNetwork(nn.Module):
    """Full FiLM vision encoder.

    Text features -> Linear -> per-block (gamma, beta)
    Image -> InitialFeatureExtractor -> N ResidualBlocks (with CoordConv + FiLM)
    -> IntermediateFeatureExtractor -> flatten

    Args:
        num_res_blocks: Number of FiLM-conditioned residual blocks.
        num_channels: Channel width of residual blocks.
        text_dim: Dimension of the input text feature vector.
        use_coord_conv: Whether to concatenate 2D coordinate channels.
    """

    def __init__(
        self,
        num_res_blocks: int = 8,
        num_channels: int = 128,
        text_dim: int = 512,
        use_coord_conv: bool = True,
    ) -> None:
        super().__init__()
        self.num_res_blocks = num_res_blocks
        self.num_channels = num_channels
        self.use_coord_conv = use_coord_conv

        self.film_param_generator = nn.Linear(text_dim, 2 * num_res_blocks * num_channels)
        self.initial_feature_extractor = InitialFeatureExtractor()

        in_ch = num_channels + 2 if use_coord_conv else num_channels
        self.residual_blocks = nn.ModuleList(
            [ResidualBlock(in_ch, num_channels) for _ in range(num_res_blocks)]
        )
        self.intermediate_feature_extractor = IntermediateFeatureExtractor()

    def forward(self, x: Tensor, text_features: Tensor) -> Tensor:
        """
        Args:
            x: Image tensor (B, 3, H, W).
            text_features: Text embedding (B, text_dim).

        Returns:
            Flattened visual features (B, feature_dim).
        """
        batch_size = x.size(0)
        device = x.device

        x = self.initial_feature_extractor(x)

        film_params = self.film_param_generator(text_features).view(
            batch_size, self.num_res_blocks, 2, self.num_channels
        )

        if self.use_coord_conv:
            d = x.size(2)
            coords = torch.linspace(-1, 1, d, device=device)
            coord_x = coords.view(1, 1, 1, d).expand(batch_size, 1, d, d)
            coord_y = coords.view(1, 1, d, 1).expand(batch_size, 1, d, d)

        for i, res_block in enumerate(self.residual_blocks):
            beta = film_params[:, i, 0, :]
            gamma = film_params[:, i, 1, :]
            if self.use_coord_conv:
                x = torch.cat([x, coord_x, coord_y], dim=1)
            x = res_block(x, beta, gamma)

        features = self.intermediate_feature_extractor(x)
        return features.flatten(start_dim=1)
