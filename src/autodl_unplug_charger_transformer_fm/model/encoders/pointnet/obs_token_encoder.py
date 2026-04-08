from __future__ import annotations

import contextlib

import torch
import torch.nn as nn

from ....common.torch_utils import replace_submodules
from .pointnet import PointNetfeat


class PointNetObsTokenEncoder(nn.Module):
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

    def forward(self, pcd: torch.Tensor, robot_state_obs: torch.Tensor | None = None) -> torch.Tensor:
        if robot_state_obs is None:
            raise ValueError("robot_state_obs is required for PointNetObsTokenEncoder.")
        if pcd.ndim != 4:
            raise ValueError(f"Expected pcd to have shape (B, T_obs, P, C), got {tuple(pcd.shape)}")
        if robot_state_obs.ndim != 3:
            raise ValueError(
                "Expected robot_state_obs to have shape "
                f"(B, T_obs, state_dim), got {tuple(robot_state_obs.shape)}"
            )

        batch_size, n_obs_steps, n_points, channels = pcd.shape
        flat_pcd = pcd.float().reshape(batch_size * n_obs_steps, n_points, channels).permute(0, 2, 1)
        flat_robot_state = robot_state_obs.float().reshape(batch_size * n_obs_steps, -1)

        # PointNet's Conv1d + BatchNorm path is prone to non-finite outputs under CUDA fp16 autocast.
        autocast_off = (
            torch.autocast(device_type=flat_pcd.device.type, enabled=False)
            if flat_pcd.device.type in {"cuda", "cpu"}
            else contextlib.nullcontext()
        )
        with autocast_off:
            encoded_pcd = self.backbone(flat_pcd)
        obs_tokens = torch.cat([encoded_pcd, flat_robot_state], dim=-1)
        return obs_tokens.reshape(batch_size, n_obs_steps, -1)
