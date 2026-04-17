from __future__ import annotations

from ..replay_buffer import RobotReplayBuffer
from .dummy import DummySequenceDataset, build_dummy_dataset
from .pcd import RobotDatasetPcd, augment_pcd_data, augment_pcd_data_with_params
from .rgb import RobotDatasetRgbText, build_rgb_dataset


def build_dataset_for_obs_mode(obs_mode: str, data_path: str, cfg):
    obs_mode = str(obs_mode).lower()
    builders = {
        "dummy": lambda path, local_cfg: build_dummy_dataset(path, local_cfg),
        "rgb": lambda path, local_cfg: build_rgb_dataset(path, local_cfg),
        # Keep pcd path available for controlled ablation/debug only.
        "pcd": lambda path, local_cfg: RobotDatasetPcd(
            data_path=str(path),
            n_obs_steps=local_cfg.n_obs_steps,
            n_pred_steps=local_cfg.n_pred_steps,
            use_pc_color=local_cfg.use_pc_color,
            n_points=local_cfg.n_points,
            subs_factor=local_cfg.subs_factor,
        ),
    }
    try:
        builder = builders[obs_mode]
    except KeyError as exc:
        raise ValueError(f"Unsupported obs_mode dataset builder: {obs_mode}") from exc
    return builder(str(data_path), cfg)


def list_modalities() -> list[str]:
    return ["dummy", "pcd", "rgb"]


__all__ = [
    "DummySequenceDataset",
    "RobotDatasetPcd",
    "RobotDatasetRgbText",
    "RobotReplayBuffer",
    "augment_pcd_data",
    "augment_pcd_data_with_params",
    "build_dataset_for_obs_mode",
    "build_dummy_dataset",
    "build_rgb_dataset",
    "list_modalities",
]
