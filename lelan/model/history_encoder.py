"""History encoder using EfficientNet-B0 for temporal context frames.

Adapted from LeLaN's LeLaN_clip_FiLM_temp. Encodes past observation frames
independently through a shared EfficientNet backbone, producing one token per frame.

Key differences from MDIT:
- MDIT simply concatenates obs features across n_obs_steps and flattens
- LeLaN explicitly encodes history frames through EfficientNet, then fuses
  with the FiLM-encoded current frame via Transformer self-attention
"""
from __future__ import annotations

import torch.nn as nn
from torch import Tensor

from efficientnet_pytorch import EfficientNet


def _replace_bn_with_gn(module: nn.Module, features_per_group: int = 16) -> nn.Module:
    """Replace all BatchNorm2d layers with GroupNorm in-place."""
    bn_list = [
        k.split(".")
        for k, m in module.named_modules(remove_duplicate=True)
        if isinstance(m, nn.BatchNorm2d)
    ]
    for *parent, k in bn_list:
        parent_module = module
        if len(parent) > 0:
            parent_module = module.get_submodule(".".join(parent))
        src = parent_module[int(k)] if isinstance(parent_module, nn.Sequential) else getattr(parent_module, k)
        tgt = nn.GroupNorm(num_groups=src.num_features // features_per_group, num_channels=src.num_features)
        if isinstance(parent_module, nn.Sequential):
            parent_module[int(k)] = tgt
        else:
            setattr(parent_module, k, tgt)
    return module


class HistoryEncoder(nn.Module):
    """Encodes observation history frames via EfficientNet-B0.

    Each frame is independently passed through:
      EfficientNet.extract_features -> avg_pool -> compress_linear

    Args:
        backbone: EfficientNet variant name (e.g., "efficientnet-b0").
        encoding_dim: Output dimension per frame.
        features_per_group: GroupNorm group size for BN replacement.
    """

    def __init__(
        self,
        backbone: str = "efficientnet-b0",
        encoding_dim: int = 512,
        features_per_group: int = 16,
        pretrained: bool = False,
    ) -> None:
        super().__init__()
        self.encoding_dim = encoding_dim

        if pretrained:
            self.encoder = EfficientNet.from_pretrained(backbone, in_channels=3)
        else:
            self.encoder = EfficientNet.from_name(backbone, in_channels=3)
        _replace_bn_with_gn(self.encoder, features_per_group)

        self.num_features = self.encoder._fc.in_features
        self.compress = nn.Linear(self.num_features, encoding_dim) if self.num_features != encoding_dim else nn.Identity()

    def forward(self, images: Tensor) -> Tensor:
        """Encode a batch of history frames.

        Args:
            images: (B * n_frames, 3, H, W) — all history frames flattened into batch dim.

        Returns:
            (B * n_frames, encoding_dim)
        """
        features = self.encoder.extract_features(images)
        features = self.encoder._avg_pooling(features)
        features = features.flatten(start_dim=1)
        return self.compress(features)
