from __future__ import annotations

from collections.abc import Sequence
from typing import Any

import numpy as np
import torch

from common.runtime import get_device
from lelan.config import LeLaNExperimentConfig
from lelan.constants import ACTION, CAMERA_NAME_TO_INDEX, OBS_IMAGES, OBS_STATE, TASK
from mdit.model.backbones.dit import DiTTrajectoryBackbone
from mdit.policy.fm_policy import FMPolicyConfig, FMTransformerPolicy
from .observation_encoder import ObservationEncoder


class LeLaNPolicy(FMTransformerPolicy):
    """LeLaN policy rebased onto reconstructed MDIT FM policy + history encoder."""

    name = "lelan"

    def __init__(self, config: LeLaNExperimentConfig, dataset_stats: dict[str, dict[str, Any]]) -> None:
        self.config = config
        self.cfg = config
        self.dataset_stats = dataset_stats

        obs_encoder = ObservationEncoder(config)
        backbone = DiTTrajectoryBackbone(
            input_dim=int(config.y_dim),
            output_dim=int(config.y_dim),
            cond_dim=int(config.x_dim),
            horizon=int(config.n_pred_steps),
            time_dim=int(config.time_dim),
            hidden_dim=int(config.hidden_dim),
            num_blocks=int(config.num_blocks),
            dropout=float(config.dropout),
            dim_feedforward=int(config.dim_feedforward),
            nhead=int(config.nhead),
            activation=str(config.activation),
            debug_finiteness=bool(config.debug_finiteness),
            final_layer_zero_init=bool(config.final_layer_zero_init),
            decoder_condition_mode=str(config.decoder_condition_mode),
        )
        policy_cfg = FMPolicyConfig(
            x_dim=int(config.x_dim),
            y_dim=int(config.y_dim),
            n_obs_steps=int(config.n_obs_steps),
            n_pred_steps=int(config.n_pred_steps),
            num_k_infer=int(config.fm_num_k_infer),
            time_conditioning=bool(config.fm_time_conditioning),
            default_task_text=str(config.effective_task_text),
            norm_pcd_center=tuple(float(v) for v in config.norm_pcd_center),
            robot_state_mean=config.robot_state_mean,
            robot_state_std=config.robot_state_std,
            augment_data=False,
            augment_translation_sigma=0.0,
            augment_rotation_sigma=0.0,
            noise_type=str(config.fm_noise_type),
            noise_scale=float(config.fm_noise_scale),
            loss_type=str(config.loss_type),
            flow_schedule=str(config.fm_flow_schedule),
            exp_scale=config.fm_exp_scale,
            snr_sampler=str(config.fm_snr_sampler),
            subs_factor=int(config.subs_factor),
            pos_emb_scale=20,
            loss_weights=config.fm_loss_weights or {"xyz": 1.0, "rot6d": 1.0, "grip": 1.0},
        )
        super().__init__(policy_cfg, obs_encoder=obs_encoder, backbone=backbone)

    def _minmax_normalize(
        self,
        tensor: torch.Tensor,
        min_values: tuple[float, ...] | None,
        max_values: tuple[float, ...] | None,
    ) -> torch.Tensor:
        if min_values is None or max_values is None:
            raise ValueError("mtdp_strict normalization requires explicit min/max stats.")
        min_th = torch.tensor(min_values, device=tensor.device, dtype=tensor.dtype)
        max_th = torch.tensor(max_values, device=tensor.device, dtype=tensor.dtype)
        denom = (max_th - min_th).clamp_min(1e-6)
        return 2.0 * (tensor - min_th) / denom - 1.0

    def _minmax_unnormalize(
        self,
        tensor: torch.Tensor,
        min_values: tuple[float, ...] | None,
        max_values: tuple[float, ...] | None,
    ) -> torch.Tensor:
        if min_values is None or max_values is None:
            raise ValueError("mtdp_strict normalization requires explicit min/max stats.")
        min_th = torch.tensor(min_values, device=tensor.device, dtype=tensor.dtype)
        max_th = torch.tensor(max_values, device=tensor.device, dtype=tensor.dtype)
        denom = (max_th - min_th).clamp_min(1e-6)
        return (tensor + 1.0) * 0.5 * denom + min_th

    def _norm_state_tensor(self, robot_state: torch.Tensor) -> torch.Tensor:
        if str(self.config.normalization_profile) == "mtdp_strict":
            return self._minmax_normalize(robot_state, self.config.state_min, self.config.state_max)
        return super()._norm_robot_state(robot_state)

    def _norm_action_tensor(self, robot_state: torch.Tensor) -> torch.Tensor:
        if str(self.config.normalization_profile) == "mtdp_strict":
            action_min = self.config.action_min if self.config.action_min is not None else self.config.state_min
            action_max = self.config.action_max if self.config.action_max is not None else self.config.state_max
            return self._minmax_normalize(robot_state, action_min, action_max)
        return super()._norm_robot_state(robot_state)

    def _norm_robot_state(self, robot_state: torch.Tensor) -> torch.Tensor:
        return self._norm_state_tensor(robot_state)

    def _denorm_robot_state(self, robot_state: torch.Tensor) -> torch.Tensor:
        if str(self.config.normalization_profile) == "mtdp_strict":
            action_min = self.config.action_min if self.config.action_min is not None else self.config.state_min
            action_max = self.config.action_max if self.config.action_max is not None else self.config.state_max
            return self._minmax_unnormalize(robot_state, action_min, action_max)
        return super()._denorm_robot_state(robot_state)

    def _norm_data(self, batch: tuple[torch.Tensor, ...]):
        if len(batch) == 4:
            obs, robot_state_obs, robot_state_pred, task_text = batch
            return (
                self._norm_obs(obs),
                self._norm_state_tensor(robot_state_obs),
                self._norm_action_tensor(robot_state_pred),
                task_text,
            )
        if len(batch) == 3:
            obs, robot_state_obs, robot_state_pred = batch
            return (
                self._norm_obs(obs),
                self._norm_state_tensor(robot_state_obs),
                self._norm_action_tensor(robot_state_pred),
            )
        raise ValueError(f"Unexpected batch structure (len={len(batch)}).")

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

    def _images_to_channel_last(self, images: torch.Tensor) -> torch.Tensor:
        if images.ndim != 6:
            raise ValueError(
                "Expected observation images with shape (B, T_obs, N_cam, H, W, C) "
                f"or (B, T_obs, N_cam, C, H, W), got {tuple(images.shape)}"
            )
        if images.shape[-1] == 3:
            return images
        if images.shape[3] == 3:
            return images.permute(0, 1, 2, 4, 5, 3)
        raise ValueError(f"Could not identify channel dimension in {tuple(images.shape)}")

    def _batch_to_policy_tuple(
        self,
        batch: dict[str, torch.Tensor | Sequence[str]],
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor, str | Sequence[str] | None]:
        obs = self._images_to_channel_last(batch[OBS_IMAGES])
        robot_state_obs = batch[OBS_STATE]
        robot_state_pred = batch[ACTION]
        task_text = batch.get(TASK)
        return obs, robot_state_obs, robot_state_pred, task_text

    def forward(
        self,
        batch: dict[str, torch.Tensor | Sequence[str]],
    ) -> tuple[torch.Tensor, dict[str, torch.Tensor]]:
        loss_dict = self.compute_loss_dict(self._batch_to_policy_tuple(batch))
        return loss_dict["loss_total"], loss_dict

    def infer_from_np(
        self,
        obs: np.ndarray,
        robot_state: np.ndarray,
        task_text: str | Sequence[str] | None = None,
    ) -> np.ndarray:
        device = get_device()
        obs_th = torch.tensor(obs, device=device).unsqueeze(0)
        robot_state_th = torch.tensor(robot_state, device=device).unsqueeze(0)
        obs_th = self._norm_obs(obs_th)
        robot_state_th = self._norm_robot_state(robot_state_th)
        ny = self.infer_y(
            obs_th,
            robot_state_th,
            task_text=[self.default_task_text] if task_text is None else task_text,
            return_traj=True,
        )
        ny = self._denorm_robot_state(ny)
        return ny.squeeze().detach().cpu().numpy()

    def predict_action(
        self,
        obs: np.ndarray,
        robot_state: np.ndarray,
        task_text: str | None = None,
    ) -> np.ndarray:
        obs_th = torch.from_numpy(np.asarray(obs))
        obs_th = self._select_runtime_cameras(obs_th)
        obs_arr = obs_th.detach().cpu().numpy()
        robot_state_arr = np.asarray(robot_state, dtype=np.float32)
        self.update_obs_lists(obs_arr, robot_state_arr)
        obs_stacked, robot_state_stacked = self.sample_stacked_obs()
        return self.infer_from_np(obs_stacked, robot_state_stacked, task_text=task_text)

    def get_optimizer(
        self,
        learning_rate: float,
        betas: tuple[float, float],
        eps: float,
        transformer_weight_decay: float,
        obs_encoder_weight_decay: float,
    ) -> torch.optim.Optimizer:
        return torch.optim.AdamW(
            [
                {
                    "params": list(self.backbone.parameters()),
                    "weight_decay": float(transformer_weight_decay),
                },
                {
                    "params": list(self.obs_encoder.parameters()),
                    "weight_decay": float(obs_encoder_weight_decay),
                    "lr": float(learning_rate) * float(self.config.vision_lr_multiplier),
                },
            ],
            lr=float(learning_rate),
            betas=tuple(float(beta) for beta in betas),
            eps=float(eps),
        )

    def reset(self) -> None:
        self.reset_obs()
