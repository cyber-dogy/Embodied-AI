from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

import numpy as np
import torch
import torch.nn as nn

from common.runtime import get_device

from .base import BasePolicy


@dataclass
class MTDPFMPolicyConfig:
    y_dim: int
    n_obs_steps: int
    n_pred_steps: int
    default_task_text: str
    subs_factor: int = 1
    sigma_min: float = 0.0
    num_integration_steps: int = 100
    integration_method: str = "euler"
    timestep_sampling_strategy: str = "beta"
    timestep_beta_alpha: float = 1.5
    timestep_beta_beta: float = 1.0
    timestep_beta_s: float = 0.999
    vision_lr_multiplier: float = 1.0
    loss_weights: dict[str, float] | None = None
    state_min: tuple[float, ...] | None = None
    state_max: tuple[float, ...] | None = None
    action_min: tuple[float, ...] | None = None
    action_max: tuple[float, ...] | None = None


class MTDPFMPolicy(nn.Module, BasePolicy):
    def __init__(
        self,
        cfg: MTDPFMPolicyConfig,
        obs_encoder: nn.Module,
        backbone: nn.Module,
    ):
        nn.Module.__init__(self)
        BasePolicy.__init__(self, cfg.n_obs_steps, cfg.subs_factor)
        self.cfg = cfg
        self.y_dim = int(cfg.y_dim)
        self.n_obs_steps = int(cfg.n_obs_steps)
        self.n_pred_steps = int(cfg.n_pred_steps)
        self.default_task_text = str(cfg.default_task_text)
        self.sigma_min = float(cfg.sigma_min)
        self.num_integration_steps = int(cfg.num_integration_steps)
        self.integration_method = str(cfg.integration_method)
        self.timestep_sampling_strategy = str(cfg.timestep_sampling_strategy)
        self.timestep_beta_alpha = float(cfg.timestep_beta_alpha)
        self.timestep_beta_beta = float(cfg.timestep_beta_beta)
        self.timestep_beta_s = float(cfg.timestep_beta_s)
        self.vision_lr_multiplier = float(cfg.vision_lr_multiplier)
        self.loss_weights = cfg.loss_weights or {"xyz": 1.0, "rot6d": 1.0, "grip": 1.0}
        self.obs_encoder = obs_encoder
        self.backbone = backbone

        if cfg.state_min is None or cfg.state_max is None:
            raise ValueError("mtdp_strict requires state_min/state_max to be resolved before training.")
        if cfg.action_min is None or cfg.action_max is None:
            raise ValueError("mtdp_strict requires action_min/action_max to be resolved before training.")

        self.register_buffer(
            "_state_min",
            torch.tensor(cfg.state_min, dtype=torch.float32),
            persistent=False,
        )
        self.register_buffer(
            "_state_max",
            torch.tensor(cfg.state_max, dtype=torch.float32),
            persistent=False,
        )
        self.register_buffer(
            "_action_min",
            torch.tensor(cfg.action_min, dtype=torch.float32),
            persistent=False,
        )
        self.register_buffer(
            "_action_max",
            torch.tensor(cfg.action_max, dtype=torch.float32),
            persistent=False,
        )

    @staticmethod
    def _normalize_min_max(tensor: torch.Tensor, min_val: torch.Tensor, max_val: torch.Tensor) -> torch.Tensor:
        denom = max_val - min_val
        denom = torch.where(
            denom == 0,
            torch.full_like(denom, 1e-8),
            denom,
        )
        return 2.0 * (tensor - min_val) / denom - 1.0

    @staticmethod
    def _denormalize_min_max(tensor: torch.Tensor, min_val: torch.Tensor, max_val: torch.Tensor) -> torch.Tensor:
        denom = max_val - min_val
        denom = torch.where(
            denom == 0,
            torch.full_like(denom, 1e-8),
            denom,
        )
        return (tensor + 1.0) / 2.0 * denom + min_val

    def _norm_obs(self, obs: torch.Tensor) -> torch.Tensor:
        normed = obs.clone().float()
        if normed.ndim != 6:
            raise ValueError(f"Unsupported observation shape for normalization: {tuple(normed.shape)}")
        if normed.max() > 1.0:
            normed = normed / 255.0
        return normed

    def _norm_robot_state(self, robot_state: torch.Tensor) -> torch.Tensor:
        min_val = self._state_min.to(device=robot_state.device, dtype=robot_state.dtype)
        max_val = self._state_max.to(device=robot_state.device, dtype=robot_state.dtype)
        return self._normalize_min_max(robot_state.clone().float(), min_val, max_val)

    def _norm_action(self, action: torch.Tensor) -> torch.Tensor:
        min_val = self._action_min.to(device=action.device, dtype=action.dtype)
        max_val = self._action_max.to(device=action.device, dtype=action.dtype)
        return self._normalize_min_max(action.clone().float(), min_val, max_val)

    def _denorm_robot_state(self, robot_state: torch.Tensor) -> torch.Tensor:
        # BasePolicy 的推理接口会把预测动作交给这个函数反归一化，因此这里按 action 统计量还原。
        min_val = self._action_min.to(device=robot_state.device, dtype=robot_state.dtype)
        max_val = self._action_max.to(device=robot_state.device, dtype=robot_state.dtype)
        return self._denormalize_min_max(robot_state.clone().float(), min_val, max_val)

    def _norm_data(self, batch: tuple[torch.Tensor, ...]):
        if len(batch) == 4:
            obs, robot_state_obs, robot_state_pred, task_text = batch
            return (
                self._norm_obs(obs),
                self._norm_robot_state(robot_state_obs),
                self._norm_action(robot_state_pred),
                task_text,
            )
        raise ValueError(f"Unexpected batch structure (len={len(batch)}).")

    def _sample_timesteps(self, batch_size: int, device: torch.device, dtype: torch.dtype) -> torch.Tensor:
        if self.timestep_sampling_strategy == "uniform":
            return torch.rand(batch_size, device=device, dtype=dtype)
        if self.timestep_sampling_strategy == "beta":
            beta_dist = torch.distributions.Beta(self.timestep_beta_alpha, self.timestep_beta_beta)
            u = beta_dist.sample((batch_size,)).to(device=device, dtype=dtype)
            return self.timestep_beta_s * (1.0 - u)
        raise ValueError(f"Unsupported timestep_sampling_strategy={self.timestep_sampling_strategy!r}")

    def _encode_conditioning(
        self,
        obs: torch.Tensor,
        robot_state_obs: torch.Tensor,
        task_text: str | Sequence[str] | None = None,
    ) -> torch.Tensor:
        conditioning_vec = self.obs_encoder(obs, robot_state_obs, task_text)
        if conditioning_vec.ndim != 2:
            raise ValueError(
                "Expected obs encoder to return conditioning_vec with shape (B, cond_dim), "
                f"got {tuple(conditioning_vec.shape)}"
            )
        return conditioning_vec

    def calculate_loss(
        self,
        obs: torch.Tensor,
        robot_state_obs: torch.Tensor,
        robot_state_pred: torch.Tensor,
        task_text: str | Sequence[str] | None = None,
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        conditioning_vec = self._encode_conditioning(obs, robot_state_obs, task_text)
        data = robot_state_pred
        batch_size = data.shape[0]
        device = data.device
        noise = torch.randn_like(data)
        t = self._sample_timesteps(batch_size, device, data.dtype)
        t_expanded = t.view(-1, 1, 1)
        x_t = t_expanded * data + (1.0 - (1.0 - self.sigma_min) * t_expanded) * noise
        target_velocity = data - (1.0 - self.sigma_min) * noise
        predicted_velocity = self.backbone(x_t, t, conditioning_vec=conditioning_vec)
        loss_xyz = torch.nn.functional.mse_loss(predicted_velocity[..., :3], target_velocity[..., :3])
        loss_rot6d = torch.nn.functional.mse_loss(predicted_velocity[..., 3:9], target_velocity[..., 3:9])
        loss_grip = torch.nn.functional.mse_loss(predicted_velocity[..., 9], target_velocity[..., 9])
        return loss_xyz, loss_rot6d, loss_grip

    def compute_loss_dict(self, batch: tuple[torch.Tensor, ...]) -> dict[str, torch.Tensor]:
        obs, robot_state_obs, robot_state_pred, task_text = self._norm_data(batch)
        loss_xyz, loss_rot6d, loss_grip = self.calculate_loss(
            obs,
            robot_state_obs,
            robot_state_pred,
            task_text,
        )
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

    def _euler_integrate(self, x: torch.Tensor, conditioning_vec: torch.Tensor) -> torch.Tensor:
        traj = [x]
        time_grid = torch.linspace(0.0, 1.0, self.num_integration_steps + 1, device=x.device, dtype=x.dtype)
        for idx in range(len(time_grid) - 1):
            t_scalar = time_grid[idx]
            dt = time_grid[idx + 1] - time_grid[idx]
            t_batch = torch.full((x.shape[0],), float(t_scalar.item()), device=x.device, dtype=x.dtype)
            velocity = self.backbone(x, t_batch, conditioning_vec=conditioning_vec)
            x = x + dt * velocity
            traj.append(x)
        return torch.stack(traj)

    def _rk4_integrate(self, x: torch.Tensor, conditioning_vec: torch.Tensor) -> torch.Tensor:
        traj = [x]
        time_grid = torch.linspace(0.0, 1.0, self.num_integration_steps + 1, device=x.device, dtype=x.dtype)
        for idx in range(len(time_grid) - 1):
            t0 = float(time_grid[idx].item())
            dt = float((time_grid[idx + 1] - time_grid[idx]).item())

            def velocity(x_val: torch.Tensor, t_scalar: float) -> torch.Tensor:
                t_batch = torch.full((x.shape[0],), t_scalar, device=x.device, dtype=x.dtype)
                return self.backbone(x_val, t_batch, conditioning_vec=conditioning_vec)

            k1 = velocity(x, t0)
            k2 = velocity(x + 0.5 * dt * k1, t0 + 0.5 * dt)
            k3 = velocity(x + 0.5 * dt * k2, t0 + 0.5 * dt)
            k4 = velocity(x + dt * k3, t0 + dt)
            x = x + (dt / 6.0) * (k1 + 2 * k2 + 2 * k3 + k4)
            traj.append(x)
        return torch.stack(traj)

    def infer_y(
        self,
        obs: torch.Tensor,
        robot_state_obs: torch.Tensor,
        task_text: str | Sequence[str] | None = None,
        noise: torch.Tensor | None = None,
        return_traj: bool = False,
    ) -> torch.Tensor:
        conditioning_vec = self._encode_conditioning(obs, robot_state_obs, task_text)
        batch_size = conditioning_vec.shape[0]
        device = get_device()
        z = torch.randn((batch_size, self.n_pred_steps, self.y_dim), device=device, dtype=obs.dtype)
        if noise is not None:
            z = noise
        if self.integration_method == "euler":
            traj = self._euler_integrate(z, conditioning_vec)
        elif self.integration_method == "rk4":
            traj = self._rk4_integrate(z, conditioning_vec)
        else:
            raise ValueError(f"Unsupported integration_method={self.integration_method!r}")
        if return_traj:
            return traj
        return traj[-1]

    def infer_from_np(self, obs: np.ndarray, robot_state: np.ndarray) -> np.ndarray:
        device = get_device()
        obs_th = torch.tensor(obs, device=device).unsqueeze(0)
        robot_state_th = torch.tensor(robot_state, device=device).unsqueeze(0)
        obs_th = self._norm_obs(obs_th)
        robot_state_th = self._norm_robot_state(robot_state_th)
        action_traj = self.infer_y(
            obs_th,
            robot_state_th,
            task_text=[self.default_task_text],
            return_traj=True,
        )
        action_traj = self._denorm_robot_state(action_traj)
        return action_traj.squeeze().detach().cpu().numpy()

    def get_optimizer(
        self,
        learning_rate: float,
        betas: tuple[float, float],
        eps: float,
        transformer_weight_decay: float,
        obs_encoder_weight_decay: float,
    ) -> torch.optim.Optimizer:
        param_groups: list[dict[str, object]] = [
            {
                "params": [param for param in self.backbone.parameters() if param.requires_grad],
                "weight_decay": float(transformer_weight_decay),
                "lr": float(learning_rate),
            },
            {
                "params": self.obs_encoder.non_vision_parameters(),
                "weight_decay": float(obs_encoder_weight_decay),
                "lr": float(learning_rate),
            },
            {
                "params": self.obs_encoder.vision_parameters(),
                "weight_decay": float(obs_encoder_weight_decay),
                "lr": float(learning_rate) * float(self.vision_lr_multiplier),
            },
        ]
        param_groups = [group for group in param_groups if group["params"]]
        return torch.optim.AdamW(
            param_groups,
            lr=float(learning_rate),
            betas=tuple(float(beta) for beta in betas),
            eps=float(eps),
        )
