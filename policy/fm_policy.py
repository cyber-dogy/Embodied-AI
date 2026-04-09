from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import torch
import torch.nn as nn

from .base import BasePolicy
from common.fm import get_timesteps
from common.runtime import get_device
from common.se3 import init_random_traj_th
from data.modalities.pcd import augment_pcd_data_with_params


@dataclass
class FMPolicyConfig:
    x_dim: int
    y_dim: int
    n_obs_steps: int
    n_pred_steps: int
    num_k_infer: int
    time_conditioning: bool
    norm_pcd_center: tuple[float, float, float] = (0.4, 0.0, 1.4)
    robot_state_mean: tuple[float, ...] | None = None
    robot_state_std: tuple[float, ...] | None = None
    augment_data: bool = False
    augment_translation_sigma: float = 0.02
    augment_rotation_sigma: float = 0.10
    noise_type: str = "gaussian"
    noise_scale: float = 1.0
    loss_type: str = "l2"
    flow_schedule: str = "linear"
    exp_scale: float | None = None
    snr_sampler: str = "uniform"
    subs_factor: int = 1
    pos_emb_scale: int = 20
    loss_weights: dict[str, float] | None = None


class FMTransformerPolicy(nn.Module, BasePolicy):
    def __init__(
        self,
        cfg: FMPolicyConfig,
        obs_encoder: nn.Module,
        backbone: nn.Module,
    ):
        nn.Module.__init__(self)
        BasePolicy.__init__(self, cfg.n_obs_steps, cfg.subs_factor)
        self.cfg = cfg
        self.x_dim = int(cfg.x_dim)
        self.y_dim = int(cfg.y_dim)
        self.n_obs_steps = int(cfg.n_obs_steps)
        self.n_pred_steps = int(cfg.n_pred_steps)
        self.num_k_infer = int(cfg.num_k_infer)
        self.time_conditioning = bool(cfg.time_conditioning)
        self.obs_encoder = obs_encoder
        self.backbone = backbone
        self.norm_pcd_center = tuple(float(v) for v in cfg.norm_pcd_center)
        self.robot_state_mean = (
            None if cfg.robot_state_mean is None else tuple(float(v) for v in cfg.robot_state_mean)
        )
        self.robot_state_std = (
            None if cfg.robot_state_std is None else tuple(float(v) for v in cfg.robot_state_std)
        )
        self.augment_data = bool(cfg.augment_data)
        self.augment_translation_sigma = float(cfg.augment_translation_sigma)
        self.augment_rotation_sigma = float(cfg.augment_rotation_sigma)
        self.noise_type = str(cfg.noise_type)
        self.noise_scale = float(cfg.noise_scale)
        self.flow_schedule = str(cfg.flow_schedule)
        self.exp_scale = cfg.exp_scale
        self.snr_sampler = str(cfg.snr_sampler)
        self.pos_emb_scale = int(cfg.pos_emb_scale)
        self.loss_weights = cfg.loss_weights or {"xyz": 1.0, "rot6d": 1.0, "grip": 1.0}
        self.ny_shape = (self.n_pred_steps, self.y_dim)
        if cfg.loss_type == "l1":
            self.loss_fun = nn.L1Loss()
        else:
            self.loss_fun = nn.MSELoss()
        self.register_buffer(
            "_norm_pcd_center_tensor",
            torch.tensor(self.norm_pcd_center, dtype=torch.float32),
            persistent=False,
        )
        if self.robot_state_mean is None or self.robot_state_std is None:
            self.register_buffer("_robot_state_mean_tensor", torch.empty(0), persistent=False)
            self.register_buffer("_robot_state_std_tensor", torch.empty(0), persistent=False)
        else:
            self.register_buffer(
                "_robot_state_mean_tensor",
                torch.tensor(self.robot_state_mean, dtype=torch.float32),
                persistent=False,
            )
            self.register_buffer(
                "_robot_state_std_tensor",
                torch.tensor(self.robot_state_std, dtype=torch.float32),
                persistent=False,
            )

    def _pcd_center_tensor(self, pcd: torch.Tensor) -> torch.Tensor:
        return self._norm_pcd_center_tensor.to(device=pcd.device, dtype=pcd.dtype)

    def _robot_state_stats(
        self,
        robot_state: torch.Tensor,
    ) -> tuple[torch.Tensor | None, torch.Tensor | None]:
        if self._robot_state_mean_tensor.numel() == 0 or self._robot_state_std_tensor.numel() == 0:
            return None, None
        mean = self._robot_state_mean_tensor.to(device=robot_state.device, dtype=robot_state.dtype)
        std = self._robot_state_std_tensor.to(device=robot_state.device, dtype=robot_state.dtype)
        return mean, std.clamp_min(1e-6)

    def set_num_k_infer(self, num_k_infer: int) -> None:
        self.num_k_infer = int(num_k_infer)

    def set_flow_schedule(self, flow_schedule: str, exp_scale: float | None) -> None:
        self.flow_schedule = str(flow_schedule)
        self.exp_scale = exp_scale

    def _norm_obs(self, pcd: torch.Tensor) -> torch.Tensor:
        pcd = pcd.clone()
        pcd[..., :3] -= self._pcd_center_tensor(pcd)
        return pcd

    def _norm_robot_state(self, robot_state: torch.Tensor) -> torch.Tensor:
        robot_state = robot_state.clone()
        mean, std = self._robot_state_stats(robot_state)
        if mean is not None and std is not None:
            robot_state = (robot_state - mean) / std
        else:
            robot_state[..., :3] -= self._pcd_center_tensor(robot_state)
            robot_state[..., 9] -= 0.5
        return robot_state

    def _denorm_robot_state(self, robot_state: torch.Tensor) -> torch.Tensor:
        robot_state = robot_state.clone()
        mean, std = self._robot_state_stats(robot_state)
        if mean is not None and std is not None:
            robot_state = robot_state * std + mean
        else:
            robot_state[..., :3] += self._pcd_center_tensor(robot_state)
            robot_state[..., 9] += 0.5
        return robot_state

    def _norm_data(self, batch: tuple[torch.Tensor, ...]) -> tuple[torch.Tensor, ...]:
        pcd, robot_state_obs, robot_state_pred = batch
        return (
            self._norm_obs(pcd),
            self._norm_robot_state(robot_state_obs),
            self._norm_robot_state(robot_state_pred),
        )

    def _init_noise(self, batch_size: int) -> torch.Tensor:
        device = get_device()
        if self.noise_type == "gaussian":
            noise = torch.randn((batch_size, *self.ny_shape), device=device)
            return noise * self.noise_scale
        if self.noise_type == "trajectory":
            return init_random_traj_th(batch_size, self.n_pred_steps, self.noise_scale)
        raise NotImplementedError(f"Unsupported noise_type: {self.noise_type}")

    def _sample_snr(self, batch_size: int) -> torch.Tensor:
        device = get_device()
        if self.snr_sampler == "uniform":
            return torch.rand((batch_size, 1, 1), device=device)
        if self.snr_sampler == "logit_normal":
            return torch.sigmoid(torch.randn((batch_size, 1, 1), device=device))
        raise NotImplementedError(f"Unsupported snr_sampler: {self.snr_sampler}")

    def _encode_obs_tokens(self, pcd: torch.Tensor, robot_state_obs: torch.Tensor) -> torch.Tensor:
        cond_tokens = self.obs_encoder(pcd, robot_state_obs)
        if cond_tokens.ndim != 3:
            raise ValueError(
                "Expected obs encoder to return cond_tokens with shape (B, T_obs, cond_dim), "
                f"got {tuple(cond_tokens.shape)}"
            )
        return cond_tokens

    def calculate_loss(
        self,
        pcd: torch.Tensor,
        robot_state_obs: torch.Tensor,
        robot_state_pred: torch.Tensor,
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        cond_tokens = self._encode_obs_tokens(pcd, robot_state_obs)
        target = robot_state_pred
        batch_size = target.shape[0]
        t = self._sample_snr(batch_size)
        z0 = self._init_noise(batch_size)
        z1 = target
        z_t = t * z1 + (1.0 - t) * z0
        target_vel = z1 - z0
        timesteps = t.squeeze(-1).squeeze(-1) * self.pos_emb_scale if self.time_conditioning else None
        pred_vel = self.backbone(z_t, timesteps, cond_tokens=cond_tokens)
        loss_xyz = self.loss_fun(pred_vel[..., :3], target_vel[..., :3])
        loss_rot6d = self.loss_fun(pred_vel[..., 3:9], target_vel[..., 3:9])
        loss_grip = self.loss_fun(pred_vel[..., 9], target_vel[..., 9])
        return loss_xyz, loss_rot6d, loss_grip

    def compute_loss_dict(self, batch: tuple[torch.Tensor, ...]) -> dict[str, torch.Tensor]:
        if self.training and self.augment_data:
            batch = augment_pcd_data_with_params(
                batch,
                sigma_transl=self.augment_translation_sigma,
                sigma_rot_rad=self.augment_rotation_sigma,
            )
        pcd, robot_state_obs, robot_state_pred = self._norm_data(batch)
        loss_xyz, loss_rot6d, loss_grip = self.calculate_loss(pcd, robot_state_obs, robot_state_pred)
        total_loss = (
            self.loss_weights["xyz"] * loss_xyz
            + self.loss_weights["rot6d"] * loss_rot6d
            + self.loss_weights["grip"] * loss_grip
        )
        return {
            "loss_total": total_loss,
            "loss_xyz": loss_xyz,
            "loss_rot6d": loss_rot6d,
            "loss_grip": loss_grip,
        }

    def infer_y(
        self,
        pcd: torch.Tensor,
        robot_state_obs: torch.Tensor,
        noise: torch.Tensor | None = None,
        return_traj: bool = False,
    ) -> torch.Tensor:
        cond_tokens = self._encode_obs_tokens(pcd, robot_state_obs)
        batch_size = cond_tokens.shape[0]
        z = self._init_noise(batch_size) if noise is None else noise
        traj = [z]
        t0, dt = get_timesteps(self.flow_schedule, self.num_k_infer, exp_scale=self.exp_scale)
        device = get_device()
        for step_idx in range(self.num_k_infer):
            timesteps = torch.ones((batch_size,), device=device) * t0[step_idx]
            timesteps *= self.pos_emb_scale
            vel_pred = self.backbone(z, timesteps, cond_tokens=cond_tokens)
            z = z.detach().clone() + vel_pred * dt[step_idx]
            traj.append(z)
        if return_traj:
            return torch.stack(traj)
        return traj[-1]

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
                },
            ],
            lr=float(learning_rate),
            betas=tuple(float(beta) for beta in betas),
            eps=float(eps),
        )
