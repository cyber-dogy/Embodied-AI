from __future__ import annotations

import numpy as np
import torch

from common.task_text import resolve_task_text
from ..replay_buffer import RobotReplayBuffer
from ..sequence_sampler import SequenceSampler


_CANONICAL_CAMERA_ORDER = (
    "right_shoulder",
    "left_shoulder",
    "overhead",
    "front",
    "wrist",
)
_CAMERA_TO_INDEX = {name: idx for idx, name in enumerate(_CANONICAL_CAMERA_ORDER)}


class RobotDatasetRgbText(torch.utils.data.Dataset):
    def __init__(
        self,
        *,
        data_path: str,
        task_name: str,
        n_obs_steps: int,
        n_pred_steps: int,
        subs_factor: int,
        camera_names: tuple[str, ...],
        text_source: str,
        task_text_override: str | None,
    ) -> None:
        replay_buffer = RobotReplayBuffer.create_from_path(data_path, mode="r")
        data_keys = ["robot_state", "images"]
        self.sampler = SequenceSampler(
            replay_buffer=replay_buffer,
            sequence_length=(n_obs_steps + n_pred_steps) * subs_factor - (subs_factor - 1),
            pad_before=(n_obs_steps - 1) * subs_factor,
            pad_after=(n_pred_steps - 1) * subs_factor + (subs_factor - 1),
            keys=data_keys,
            key_first_k={},
        )
        self.n_obs_steps = int(n_obs_steps)
        self.n_pred_steps = int(n_pred_steps)
        self.subs_factor = int(subs_factor)
        self.camera_names = tuple(str(name) for name in camera_names)
        self.camera_indices = self._resolve_camera_indices(self.camera_names)
        self.task_text = self._build_task_text(
            task_name=str(task_name),
            text_source=str(text_source),
            task_text_override=task_text_override,
        )

    @staticmethod
    def _resolve_camera_indices(camera_names: tuple[str, ...]) -> tuple[int, ...]:
        indices: list[int] = []
        for name in camera_names:
            if name not in _CAMERA_TO_INDEX:
                raise ValueError(
                    f"Unsupported camera name {name!r}. Supported: {list(_CAMERA_TO_INDEX)}"
                )
            indices.append(int(_CAMERA_TO_INDEX[name]))
        return tuple(indices)

    @staticmethod
    def _build_task_text(
        *,
        task_name: str,
        text_source: str,
        task_text_override: str | None,
    ) -> str:
        # Current dataset has no per-step language field, so descriptions stay empty.
        return resolve_task_text(
            task_name=task_name,
            text_source=text_source,
            descriptions=None,
            override_text=task_text_override,
        )

    def __len__(self) -> int:
        return len(self.sampler)

    def __getitem__(self, idx: int) -> tuple[np.ndarray, np.ndarray, np.ndarray, str]:
        sample: dict[str, np.ndarray] = self.sampler.sample_sequence(int(idx))
        cur_step_i = self.n_obs_steps * self.subs_factor

        images = sample["images"][:cur_step_i : self.subs_factor].astype(np.float32) / 255.0
        images = images[:, self.camera_indices]

        robot_state_obs = sample["robot_state"][:cur_step_i : self.subs_factor].astype(np.float32)
        robot_state_pred = sample["robot_state"][cur_step_i :: self.subs_factor].astype(np.float32)
        return images, robot_state_obs, robot_state_pred, self.task_text



def build_rgb_dataset(data_path: str, cfg):
    return RobotDatasetRgbText(
        data_path=str(data_path),
        task_name=str(cfg.task_name),
        n_obs_steps=int(cfg.n_obs_steps),
        n_pred_steps=int(cfg.n_pred_steps),
        subs_factor=int(cfg.subs_factor),
        camera_names=tuple(cfg.camera_names),
        text_source=str(cfg.text_source),
        task_text_override=cfg.task_text_override,
    )
