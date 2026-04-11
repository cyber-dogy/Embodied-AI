from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
import torch
import zarr

from common.task_text import choose_instruction
from lelan.config import LeLaNExperimentConfig
from lelan.constants import ACTION, CAMERA_NAME_TO_INDEX, OBS_IMAGES, OBS_STATE, TASK


@dataclass(frozen=True)
class SequenceIndex:
    buffer_start_idx: int
    buffer_end_idx: int
    sample_start_idx: int
    sample_end_idx: int


def _create_indices(
    episode_ends: np.ndarray,
    *,
    sequence_length: int,
    pad_before: int,
    pad_after: int = 0,
) -> list[SequenceIndex]:
    indices: list[SequenceIndex] = []
    pad_before = min(max(int(pad_before), 0), sequence_length - 1)
    pad_after = min(max(int(pad_after), 0), sequence_length - 1)

    start_idx = 0
    for episode_end in episode_ends:
        episode_end = int(episode_end)
        episode_length = episode_end - start_idx
        min_start = -pad_before
        max_start = episode_length - sequence_length + pad_after
        for idx in range(min_start, max_start + 1):
            buffer_start_idx = max(idx, 0) + start_idx
            buffer_end_idx = min(idx + sequence_length, episode_length) + start_idx
            start_offset = buffer_start_idx - (idx + start_idx)
            end_offset = (idx + sequence_length + start_idx) - buffer_end_idx
            sample_start_idx = start_offset
            sample_end_idx = sequence_length - end_offset
            indices.append(
                SequenceIndex(
                    buffer_start_idx=int(buffer_start_idx),
                    buffer_end_idx=int(buffer_end_idx),
                    sample_start_idx=int(sample_start_idx),
                    sample_end_idx=int(sample_end_idx),
                )
            )
        start_idx = episode_end
    return indices


def _pad_sequence(sample: np.ndarray, sequence_length: int, index: SequenceIndex) -> np.ndarray:
    if index.sample_start_idx == 0 and index.sample_end_idx == sequence_length:
        return sample

    data = np.zeros((sequence_length,) + sample.shape[1:], dtype=sample.dtype)
    if index.sample_start_idx > 0:
        data[: index.sample_start_idx] = sample[0]
    if index.sample_end_idx < sequence_length:
        data[index.sample_end_idx :] = sample[-1]
    data[index.sample_start_idx : index.sample_end_idx] = sample
    return data


class LeLaNRLBenchDataset(torch.utils.data.Dataset):
    def __init__(self, data_path: str | Path, cfg: LeLaNExperimentConfig) -> None:
        super().__init__()
        self.cfg = cfg
        self.data_path = Path(data_path)
        root = zarr.open_group(str(self.data_path), mode="r")
        self.images = root["data"]["images"]
        self.robot_state = root["data"]["robot_state"]
        self.episode_ends = np.asarray(root["meta"]["episode_ends"], dtype=np.int64)
        self.camera_indices = np.asarray(
            [CAMERA_NAME_TO_INDEX[name] for name in cfg.camera_names],
            dtype=np.int64,
        )
        self.indices = _create_indices(
            self.episode_ends,
            sequence_length=int(cfg.horizon),
            pad_before=int(cfg.n_obs_steps) - 1,
            pad_after=0,
        )
        self.task_text = choose_instruction(
            task_name=cfg.task_name,
            descriptions=None,
            override_text=cfg.task_text_override,
        )

    def __len__(self) -> int:
        return len(self.indices)

    def __getitem__(self, idx: int) -> dict[str, torch.Tensor | str]:
        index = self.indices[int(idx)]
        robot_state = np.asarray(
            self.robot_state[index.buffer_start_idx : index.buffer_end_idx],
            dtype=np.float32,
        )
        images = np.asarray(
            self.images[index.buffer_start_idx : index.buffer_end_idx],
            dtype=np.uint8,
        )

        robot_state = _pad_sequence(robot_state, int(self.cfg.horizon), index)
        images = _pad_sequence(images, int(self.cfg.horizon), index)
        images = images[:, self.camera_indices]

        obs_state = robot_state[: int(self.cfg.n_obs_steps)]
        obs_images = images[: int(self.cfg.n_obs_steps)].transpose(0, 1, 4, 2, 3)

        return {
            OBS_STATE: torch.from_numpy(obs_state.copy()),
            OBS_IMAGES: torch.from_numpy(obs_images.copy()),
            ACTION: torch.from_numpy(robot_state.copy()),
            TASK: self.task_text,
        }


def build_dataset(data_path: str | Path, cfg: LeLaNExperimentConfig) -> LeLaNRLBenchDataset:
    return LeLaNRLBenchDataset(data_path, cfg)
