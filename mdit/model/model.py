from __future__ import annotations

from collections import deque
from typing import Any

import numpy as np
import torch
import torch.nn as nn
from torch import Tensor

from common.runtime import get_device
from mdit.config import MDITExperimentConfig
from mdit.constants import ACTION, CAMERA_NAME_TO_INDEX, OBS_IMAGES, OBS_PCD, OBS_STATE, TASK
from .action_postprocess import postprocess_robot_state_command
from .objectives import FlowMatchingObjective
from .observation_encoder import ObservationEncoder
from .transformer import DiffusionTransformer, PDITDiffusionTransformer
from .utils import NormalizationMode, normalize_tensor, populate_queues, unnormalize_tensor


class MultiTaskDiTPolicy(nn.Module):
    name = "mdit_faithful"

    def __init__(self, config: MDITExperimentConfig, dataset_stats: dict[str, dict[str, Any]]):
        super().__init__()
        self.config = config
        self.dataset_stats = dataset_stats
        self.observation_encoder = ObservationEncoder(config)
        self._pcd_transformer_variant = str(getattr(config, "pcd_transformer_variant", "mdit")).lower()
        if self._pcd_transformer_variant == "pdit":
            if not bool(config.use_pcd):
                raise ValueError("pcd_transformer_variant='pdit' requires use_pcd=true.")
            self.noise_predictor = PDITDiffusionTransformer(
                config,
                cond_token_dim=int(self.observation_encoder.token_dim),
            )
        else:
            conditioning_dim = self.observation_encoder.conditioning_dim
            self.noise_predictor = DiffusionTransformer(config, conditioning_dim=conditioning_dim)
        self.objective = FlowMatchingObjective(
            config.objective,
            action_dim=int(config.action_dim),
            horizon=int(config.horizon),
            do_mask_loss_for_padding=False,
        )
        self._queues: dict[str, deque] | None = None
        self.reset()

    def _stat_tensors(self, key: str, device: torch.device, dtype: torch.dtype) -> dict[str, Tensor]:
        stats = self.dataset_stats[key]
        return {
            name: torch.as_tensor(value, device=device, dtype=dtype)
            for name, value in stats.items()
        }

    def normalize_state(self, state: Tensor) -> Tensor:
        return normalize_tensor(
            state,
            self._stat_tensors(OBS_STATE, state.device, state.dtype),
            self.config.normalization_mode,
        )

    def _normalize_conditioning_state(self, state: Tensor) -> Tensor:
        if not self.config.use_pcd:
            return self.normalize_state(state)
        normalized = state.clone()
        norm_center = torch.as_tensor(
            self.config.observation_encoder.pcd.norm_center,
            device=state.device,
            dtype=state.dtype,
        )
        normalized[..., :3] -= norm_center
        normalized[..., 9] -= 0.5
        return normalized

    def unnormalize_action(self, action: Tensor) -> Tensor:
        return unnormalize_tensor(
            action,
            self._stat_tensors(ACTION, action.device, action.dtype),
            self.config.normalization_mode,
        )

    def get_optim_params(self) -> list[dict[str, Any]]:
        non_vision_params = []
        vision_encoder_params = []
        for name, param in self.named_parameters():
            if not param.requires_grad:
                continue
            if "observation_encoder.vision_encoder" in name or "observation_encoder.vision_encoders" in name:
                vision_encoder_params.append(param)
            else:
                non_vision_params.append(param)
        params = [{"params": non_vision_params}]
        if vision_encoder_params:
            params.append(
                {
                    "params": vision_encoder_params,
                    "lr": self.config.optimizer_lr * self.config.observation_encoder.vision.lr_multiplier,
                }
            )
        return params

    def reset(self) -> None:
        if self.config.use_pcd:
            self._queues = {
                OBS_STATE: deque(maxlen=self.config.n_obs_steps),
                OBS_PCD: deque(maxlen=self.config.n_obs_steps),
                ACTION: deque(maxlen=self.config.n_action_steps),
            }
        else:
            self._queues = {
                OBS_STATE: deque(maxlen=self.config.n_obs_steps),
                OBS_IMAGES: deque(maxlen=self.config.n_obs_steps),
                TASK: deque(maxlen=self.config.n_obs_steps),
                ACTION: deque(maxlen=self.config.n_action_steps),
            }

    def _select_runtime_cameras(self, images: torch.Tensor) -> torch.Tensor:
        if images.ndim != 4:
            raise ValueError(f"Expected RGB observations with shape (N,H,W,C) or (N,C,H,W), got {tuple(images.shape)}")

        num_expected = len(self.config.camera_names)
        num_available = int(images.shape[0])
        if num_available == num_expected:
            return images

        all_camera_count = len(CAMERA_NAME_TO_INDEX)
        if num_available != all_camera_count:
            raise ValueError(
                f"Expected either {num_expected} selected cameras or all {all_camera_count} RLBench cameras, "
                f"got {num_available}."
            )

        selected_indices = [CAMERA_NAME_TO_INDEX[name] for name in self.config.camera_names]
        return images[selected_indices]

    def _normalize_batch(self, batch: dict[str, Tensor | list[str]]) -> dict[str, Tensor | list[str]]:
        normalized = dict(batch)
        normalized[OBS_STATE] = self._normalize_conditioning_state(batch[OBS_STATE])
        normalized[ACTION] = normalize_tensor(
            batch[ACTION],
            self._stat_tensors(ACTION, batch[ACTION].device, batch[ACTION].dtype),
            self.config.normalization_mode,
        )
        return normalized

    def _encode_conditioning(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        if str(getattr(self, "_pcd_transformer_variant", "mdit")).lower() == "pdit":
            return self.observation_encoder.encode_tokens(batch)
        return self.observation_encoder.encode(batch)

    def forward(self, batch: dict[str, Tensor | list[str]]) -> tuple[Tensor, dict[str, Tensor]]:
        normalized_batch = self._normalize_batch(batch)
        conditioning_vec = self._encode_conditioning(normalized_batch)
        loss, loss_dict = self.objective.compute_loss(self.noise_predictor, normalized_batch, conditioning_vec)
        return loss, loss_dict

    def _generate_action_chunk(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        batch_size = int(batch[OBS_STATE].shape[0])
        normalized_batch = dict(batch)
        normalized_batch[OBS_STATE] = self._normalize_conditioning_state(batch[OBS_STATE])
        conditioning_vec = self._encode_conditioning(normalized_batch)
        actions = self.objective.conditional_sample(self.noise_predictor, batch_size, conditioning_vec)
        start_idx = self.config.n_obs_steps - 1
        end_idx = start_idx + self.config.n_action_steps
        return actions[:, start_idx:end_idx]

    def predict_action_chunk(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        self.eval()
        if self._queues is None:
            self.reset()
        stacked: dict[str, Tensor | list[str]] = {}
        for key, queue in self._queues.items():
            if key == ACTION or len(queue) == 0:
                continue
            if key == TASK:
                latest_task = queue[-1]
                if isinstance(latest_task, list):
                    stacked[key] = list(latest_task)
                else:
                    stacked[key] = [latest_task]
            else:
                stacked[key] = torch.stack(list(queue), dim=1)
        return self._generate_action_chunk(stacked)

    def select_action(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        if self._queues is None:
            self.reset()
        self._queues = populate_queues(self._queues, batch)
        if len(self._queues[ACTION]) == 0:
            action_chunk = self.predict_action_chunk(batch)
            if str(self.config.command_mode) == "first":
                self._queues[ACTION].extend(action_chunk.transpose(0, 1))
            else:
                self._queues[ACTION].append(self._select_runtime_action_from_chunk(action_chunk))
        return self._queues[ACTION].popleft()

    def _select_runtime_action_from_chunk(self, action_chunk: Tensor) -> Tensor:
        if action_chunk.ndim != 3:
            raise ValueError(f"Expected action chunk with shape (B,T,D), got {tuple(action_chunk.shape)}")
        horizon_len = int(action_chunk.shape[1])
        mode = str(self.config.command_mode).lower()
        if mode == "first":
            return action_chunk[:, 0]
        if mode == "horizon_index":
            index = int(np.clip(int(self.config.horizon_index), 0, max(0, horizon_len - 1)))
            return action_chunk[:, index]
        if mode == "mean_first_n":
            count = int(np.clip(int(self.config.average_first_n), 1, horizon_len))
            reduced = action_chunk[:, :count].mean(dim=1)
            reduced[..., 9] = (action_chunk[:, :count, 9].mean(dim=1) >= 0.5).to(reduced.dtype)
            return reduced
        raise ValueError(f"Unsupported command_mode: {self.config.command_mode}")

    def predict_action(
        self,
        obs: np.ndarray,
        robot_state: np.ndarray,
        task_text: str | None = None,
    ) -> np.ndarray:
        device = get_device()
        state = torch.from_numpy(np.asarray(robot_state, dtype=np.float32)).to(device=device).unsqueeze(0)
        if self.config.use_pcd:
            pcd = np.asarray(obs, dtype=np.float32)  # (P_all, C)
            n_points = int(self.config.observation_encoder.pcd.n_points)
            if pcd.shape[0] > n_points:
                idx = np.random.choice(pcd.shape[0], n_points, replace=False)
                pcd = pcd[idx]
            # Shape: (1, P, C) — batch=1; queue stacks T_obs steps → (1, T_obs, P, C)
            pcd_tensor = torch.from_numpy(pcd).to(device=device, dtype=torch.float32).unsqueeze(0)
            action = self.select_action(
                {
                    OBS_PCD: pcd_tensor,
                    OBS_STATE: state,
                }
            )
        else:
            images = torch.from_numpy(np.asarray(obs))
            images = self._select_runtime_cameras(images)
            if images.shape[-1] == 3:
                images = images.permute(0, 3, 1, 2)
            images = images.to(device=device, dtype=torch.float32).unsqueeze(0)
            action = self.select_action(
                {
                    OBS_IMAGES: images,
                    OBS_STATE: state,
                    TASK: [task_text or self.config.task_name],
                }
            )
        action = self.unnormalize_action(action)
        action_np = action.squeeze(0).detach().cpu().numpy().astype(np.float32, copy=False)
        return postprocess_robot_state_command(
            np.asarray(robot_state, dtype=np.float32),
            action_np,
            enabled=bool(self.config.smooth_actions),
            position_alpha=float(self.config.position_alpha),
            rotation_alpha=float(self.config.rotation_alpha),
            max_position_step=self.config.max_position_step,
            gripper_open_threshold=float(self.config.gripper_open_threshold),
            gripper_close_threshold=float(self.config.gripper_close_threshold),
        )
