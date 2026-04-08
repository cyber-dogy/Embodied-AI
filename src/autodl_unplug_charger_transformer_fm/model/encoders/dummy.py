from __future__ import annotations

import torch
import torch.nn as nn


class DummyObsEncoder(nn.Module):
    """
    Tiny encoder used for replaceability tests and smoke checks.

    It ignores the raw observation tensor and projects robot_state tokens
    directly into the backbone conditioning space.
    """

    def __init__(self, embed_dim: int, robot_state_dim: int = 10) -> None:
        super().__init__()
        self.embed_dim = int(embed_dim)
        self.robot_state_dim = int(robot_state_dim)
        self.proj = nn.Linear(int(robot_state_dim), int(embed_dim))

    def forward(self, obs: torch.Tensor, robot_state_obs: torch.Tensor) -> torch.Tensor:
        del obs
        projected = self.proj(robot_state_obs.float())
        return torch.cat([projected, robot_state_obs.float()], dim=-1)
