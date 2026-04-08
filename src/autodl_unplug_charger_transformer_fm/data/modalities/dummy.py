from __future__ import annotations

import torch
from torch.utils.data import Dataset


class DummySequenceDataset(Dataset):
    """
    Small synthetic dataset for registry and train-loop smoke tests.
    """

    def __init__(
        self,
        *,
        n_obs_steps: int,
        n_pred_steps: int,
        y_dim: int,
        length: int = 8,
        n_points: int = 16,
        obs_channels: int = 3,
    ) -> None:
        self.n_obs_steps = int(n_obs_steps)
        self.n_pred_steps = int(n_pred_steps)
        self.y_dim = int(y_dim)
        self.length = int(length)
        self.n_points = int(n_points)
        self.obs_channels = int(obs_channels)

    def __len__(self) -> int:
        return self.length

    def __getitem__(self, index: int):
        scale = float(index + 1) / float(max(1, self.length))
        obs = torch.zeros(self.n_obs_steps, self.n_points, self.obs_channels, dtype=torch.float32)
        obs[..., 0] = scale
        robot_state_obs = torch.full(
            (self.n_obs_steps, self.y_dim),
            fill_value=scale,
            dtype=torch.float32,
        )
        robot_state_pred = torch.full(
            (self.n_pred_steps, self.y_dim),
            fill_value=scale,
            dtype=torch.float32,
        )
        return obs, robot_state_obs, robot_state_pred


def build_dummy_dataset(data_path: str, cfg) -> DummySequenceDataset:
    del data_path
    return DummySequenceDataset(
        n_obs_steps=cfg.n_obs_steps,
        n_pred_steps=cfg.n_pred_steps,
        y_dim=cfg.y_dim,
        length=8,
        n_points=min(int(cfg.n_points), 16),
        obs_channels=6 if cfg.use_pc_color else 3,
    )
