from __future__ import annotations

from config import ExperimentConfig
from .modalities import build_dataset_for_obs_mode, list_modalities


def build_dataset(data_path: str, cfg: ExperimentConfig):
    return build_dataset_for_obs_mode(cfg.obs_mode, data_path, cfg)


__all__ = ["build_dataset", "list_modalities"]
