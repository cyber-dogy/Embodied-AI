from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
import torch
import zarr

from common.task_text import choose_instruction
from mdit.config import MDITExperimentConfig
from mdit.constants import ACTION, CAMERA_NAME_TO_INDEX, OBS_IMAGES, OBS_PCD, OBS_STATE, TASK


@dataclass(frozen=True)
class EpisodeSampleIndex:
    episode_start_idx: int
    episode_end_idx: int
    anchor_idx: int


def _build_episode_sample_indices(
    episode_ends: np.ndarray,
    *,
    drop_n_last_frames: int,
) -> list[EpisodeSampleIndex]:
    indices: list[EpisodeSampleIndex] = []
    start_idx = 0
    for episode_end in np.asarray(episode_ends, dtype=np.int64):
        episode_end = int(episode_end)
        episode_length = episode_end - start_idx
        usable_length = max(0, episode_length - int(drop_n_last_frames))
        for offset in range(usable_length):
            indices.append(
                EpisodeSampleIndex(
                    episode_start_idx=int(start_idx),
                    episode_end_idx=int(episode_end),
                    anchor_idx=int(start_idx + offset),
                )
            )
        start_idx = episode_end
    return indices


def _gather_episode_delta_sequence(
    array,
    sample_index: EpisodeSampleIndex,
    delta_indices: np.ndarray,
) -> np.ndarray:
    episode_start = int(sample_index.episode_start_idx)
    episode_end = int(sample_index.episode_end_idx)
    episode_length = episode_end - episode_start
    if episode_length <= 0:
        raise ValueError(f"Invalid empty episode slice: start={episode_start}, end={episode_end}")

    anchor_offset = int(sample_index.anchor_idx) - episode_start
    rel_indices = anchor_offset + np.asarray(delta_indices, dtype=np.int64)
    rel_indices = np.clip(rel_indices, 0, episode_length - 1)
    abs_indices = rel_indices + episode_start
    return np.asarray(array[abs_indices])


class MDITRLBenchDataset(torch.utils.data.Dataset):
    def __init__(self, data_path: str | Path, cfg: MDITExperimentConfig) -> None:
        super().__init__()
        self.cfg = cfg
        self.data_path = Path(data_path)
        root = zarr.open_group(str(self.data_path), mode="r")
        self.robot_state = root["data"]["robot_state"]
        self.episode_ends = np.asarray(root["meta"]["episode_ends"], dtype=np.int64)
        self.obs_delta_indices = np.asarray(cfg.observation_delta_indices, dtype=np.int64)
        self.action_delta_indices = np.asarray(cfg.action_delta_indices, dtype=np.int64)
        self.indices = _build_episode_sample_indices(
            self.episode_ends,
            drop_n_last_frames=int(cfg.drop_n_last_frames),
        )

        if cfg.use_pcd:
            self.pcd_xyz = root["data"]["pcd_xyz"]
            self.pcd_color = root["data"]["pcd_color"] if cfg.observation_encoder.pcd.use_color else None
            self.images = None
            self.camera_indices = None
            self.task_text = None
        else:
            self.images = root["data"]["images"]
            self.camera_indices = np.asarray(
                [CAMERA_NAME_TO_INDEX[name] for name in cfg.camera_names],
                dtype=np.int64,
            )
            self.task_text = choose_instruction(
                task_name=cfg.task_name,
                descriptions=None,
                override_text=cfg.task_text_override,
            )
            self.pcd_xyz = None
            self.pcd_color = None

    def __len__(self) -> int:
        return len(self.indices)

    def __getitem__(self, idx: int) -> dict[str, torch.Tensor | str]:
        index = self.indices[int(idx)]
        obs_state = np.asarray(
            _gather_episode_delta_sequence(self.robot_state, index, self.obs_delta_indices),
            dtype=np.float32,
        )
        robot_state = np.asarray(
            _gather_episode_delta_sequence(self.robot_state, index, self.action_delta_indices),
            dtype=np.float32,
        )

        if self.cfg.use_pcd:
            n_points = int(self.cfg.observation_encoder.pcd.n_points)
            pcd = np.asarray(
                _gather_episode_delta_sequence(self.pcd_xyz, index, self.obs_delta_indices),
                dtype=np.float32,
            )
            point_indices = slice(None)
            if pcd.shape[1] > n_points:
                point_indices = np.random.choice(pcd.shape[1], n_points, replace=False)
            pcd = pcd[:, point_indices, :]
            if self.pcd_color is not None:
                color = np.asarray(
                    _gather_episode_delta_sequence(self.pcd_color, index, self.obs_delta_indices),
                    dtype=np.float32,
                )
                color = color[:, point_indices, :] / 255.0
                pcd = np.concatenate([pcd, color], axis=-1)
            return {
                OBS_STATE: torch.from_numpy(obs_state.copy()),
                OBS_PCD: torch.from_numpy(pcd.copy()),
                ACTION: torch.from_numpy(robot_state.copy()),
            }
        else:
            images = np.asarray(
                _gather_episode_delta_sequence(self.images, index, self.obs_delta_indices),
                dtype=np.uint8,
            )
            images = images[:, self.camera_indices]
            obs_images = images.transpose(0, 1, 4, 2, 3)
            return {
                OBS_STATE: torch.from_numpy(obs_state.copy()),
                OBS_IMAGES: torch.from_numpy(obs_images.copy()),
                ACTION: torch.from_numpy(robot_state.copy()),
                TASK: self.task_text,
            }


def build_dataset(data_path: str | Path, cfg: MDITExperimentConfig) -> MDITRLBenchDataset:
    return MDITRLBenchDataset(data_path, cfg)
