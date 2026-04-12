from __future__ import annotations

from collections import deque
from typing import Any

import numpy as np
import torch
import torch.nn as nn
from torch import Tensor

from common.runtime import get_device
from lelan.config import LeLaNExperimentConfig
from lelan.constants import ACTION, CAMERA_NAME_TO_INDEX, OBS_IMAGES, OBS_STATE, TASK
from .objectives import FlowMatchingObjective
from .observation_encoder import ObservationEncoder
from .transformer import DiffusionTransformer
from .utils import NormalizationMode, normalize_tensor, populate_queues, unnormalize_tensor


class EMA:
    """Exponential Moving Average of model parameters."""

    def __init__(self, model: nn.Module, decay: float = 0.999) -> None:
        self.decay = decay
        self.shadow = {name: param.data.clone() for name, param in model.named_parameters() if param.requires_grad}

    @torch.no_grad()
    def update(self, model: nn.Module) -> None:
        for name, param in model.named_parameters():
            if param.requires_grad and name in self.shadow:
                self.shadow[name].mul_(self.decay).add_(param.data, alpha=1 - self.decay)

    def apply(self, model: nn.Module) -> dict[str, Tensor]:
        """Apply EMA weights and return backup of original weights."""
        backup = {}
        for name, param in model.named_parameters():
            if param.requires_grad and name in self.shadow:
                backup[name] = param.data.clone()
                param.data.copy_(self.shadow[name])
        return backup

    def restore(self, model: nn.Module, backup: dict[str, Tensor]) -> None:
        """Restore original weights from backup."""
        for name, param in model.named_parameters():
            if name in backup:
                param.data.copy_(backup[name])


class LeLaNPolicy(nn.Module):
    """LeLaN policy: FiLM vision + EfficientNet history encoder + DiT + Flow Matching.

    Observation encoding: LeLaN's FiLM conditioning + EfficientNet temporal
    history encoder + Transformer fusion with sinusoidal PE.
    Action generation: DiT + Flow Matching (same as MDIT).

    This combines LeLaN's core encoder innovation (the key differentiator)
    with MDIT's proven DiT action decoder.
    """

    name = "lelan"

    def __init__(self, config: LeLaNExperimentConfig, dataset_stats: dict[str, dict[str, Any]]) -> None:
        super().__init__()
        self.config = config
        self.dataset_stats = dataset_stats

        self.observation_encoder = ObservationEncoder(config)
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

    def unnormalize_action(self, action: Tensor) -> Tensor:
        return unnormalize_tensor(
            action,
            self._stat_tensors(ACTION, action.device, action.dtype),
            self.config.normalization_mode,
        )

    def get_optim_params(self) -> list[dict[str, Any]]:
        """Separate parameters into groups with different learning rates.

        Per-camera vision encoders (FiLM, EfficientNet, compress projections)
        get 0.1x LR. Everything else (DiT, fusion transformer, text projection)
        at full LR.
        """
        non_vision_params = []
        vision_params = []
        for name, param in self.named_parameters():
            if not param.requires_grad:
                continue
            if "film_encoder" in name or "history_encoder" in name or "film_compress" in name:
                vision_params.append(param)
            else:
                non_vision_params.append(param)
        params = [{"params": non_vision_params}]
        if vision_params:
            params.append({"params": vision_params, "lr": self.config.optimizer_lr * 0.1})
        return params

    def reset(self) -> None:
        self._queues = {
            OBS_STATE: deque(maxlen=self.config.n_obs_steps),
            OBS_IMAGES: deque(maxlen=self.config.n_obs_steps),
            TASK: deque(maxlen=self.config.n_obs_steps),
            ACTION: deque(maxlen=self.config.n_action_steps),
        }

    def _select_runtime_cameras(self, images: torch.Tensor) -> torch.Tensor:
        if images.ndim != 4:
            raise ValueError(f"Expected (N,H,W,C) or (N,C,H,W), got {tuple(images.shape)}")
        num_expected = len(self.config.camera_names)
        num_available = int(images.shape[0])
        if num_available == num_expected:
            return images
        all_camera_count = len(CAMERA_NAME_TO_INDEX)
        if num_available != all_camera_count:
            raise ValueError(
                f"Expected {num_expected} selected or {all_camera_count} total cameras, got {num_available}."
            )
        selected_indices = [CAMERA_NAME_TO_INDEX[name] for name in self.config.camera_names]
        return images[selected_indices]

    def _normalize_batch(self, batch: dict[str, Tensor | list[str]]) -> dict[str, Tensor | list[str]]:
        normalized = dict(batch)
        normalized[OBS_STATE] = normalize_tensor(
            batch[OBS_STATE],
            self._stat_tensors(OBS_STATE, batch[OBS_STATE].device, batch[OBS_STATE].dtype),
            self.config.normalization_mode,
        )
        normalized[ACTION] = normalize_tensor(
            batch[ACTION],
            self._stat_tensors(ACTION, batch[ACTION].device, batch[ACTION].dtype),
            self.config.normalization_mode,
        )
        return normalized

    def forward(self, batch: dict[str, Tensor | list[str]]) -> tuple[Tensor, dict[str, Tensor]]:
        """Training forward: encode observations + compute flow matching loss."""
        normalized_batch = self._normalize_batch(batch)
        conditioning_vec = self.observation_encoder.encode(normalized_batch)
        loss, loss_dict = self.objective.compute_loss(self.noise_predictor, normalized_batch, conditioning_vec)
        return loss, loss_dict

    def _generate_action_chunk(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        """Generate action chunk via ODE integration (flow matching sampling)."""
        batch_size = int(batch[OBS_STATE].shape[0])
        normalized_batch = dict(batch)
        normalized_batch[OBS_STATE] = normalize_tensor(
            batch[OBS_STATE],
            self._stat_tensors(OBS_STATE, batch[OBS_STATE].device, batch[OBS_STATE].dtype),
            self.config.normalization_mode,
        )
        conditioning_vec = self.observation_encoder.encode(normalized_batch)
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
                stacked[key] = list(latest_task) if isinstance(latest_task, list) else [latest_task]
            else:
                stacked[key] = torch.stack(list(queue), dim=1)
        return self._generate_action_chunk(stacked)

    def select_action(self, batch: dict[str, Tensor | list[str]]) -> Tensor:
        if self._queues is None:
            self.reset()
        self._queues = populate_queues(self._queues, batch)
        if len(self._queues[ACTION]) == 0:
            action_chunk = self.predict_action_chunk(batch)
            self._queues[ACTION].extend(action_chunk.transpose(0, 1))
        return self._queues[ACTION].popleft()

    def predict_action(
        self,
        obs: np.ndarray,
        robot_state: np.ndarray,
        task_text: str | None = None,
    ) -> np.ndarray:
        device = get_device()
        images = torch.from_numpy(np.asarray(obs))
        images = self._select_runtime_cameras(images)
        if images.shape[-1] == 3:
            images = images.permute(0, 3, 1, 2)
        images = images.to(device=device, dtype=torch.float32).unsqueeze(0)
        state = torch.from_numpy(np.asarray(robot_state, dtype=np.float32)).to(device=device).unsqueeze(0)
        action = self.select_action(
            {
                OBS_IMAGES: images,
                OBS_STATE: state,
                TASK: [task_text or self.config.task_name],
            }
        )
        action = self.unnormalize_action(action)
        return action.squeeze(0).detach().cpu().numpy()
