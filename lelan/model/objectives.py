"""Objective classes for LeLaN policy (DiT + Flow Matching action generation).

Copied from mdit/model/objectives.py — FlowMatchingObjective for training and
ODE-based sampling at inference.
"""

from abc import ABC, abstractmethod

import torch
import torch.nn as nn
import torch.nn.functional as F  # noqa: N812
from torch import Tensor


class BaseObjective(ABC):
    def __init__(self, config, action_dim: int, horizon: int):
        self.config = config
        self.action_dim = action_dim
        self.horizon = horizon

    @abstractmethod
    def compute_loss(
        self, model: nn.Module, batch: dict[str, Tensor], conditioning_vec: Tensor
    ) -> tuple[Tensor, dict[str, Tensor]]:
        pass

    @abstractmethod
    def conditional_sample(self, model: nn.Module, batch_size: int, conditioning_vec: Tensor) -> Tensor:
        pass


class FlowMatchingObjective(BaseObjective):
    """Flow matching objective: trains a model to predict velocity fields v_theta(x, t)."""

    def __init__(self, config, action_dim: int, horizon: int, do_mask_loss_for_padding: bool = False):
        super().__init__(config, action_dim, horizon)
        self.do_mask_loss_for_padding = do_mask_loss_for_padding

    def _sample_timesteps(self, batch_size: int, device: torch.device) -> Tensor:
        if self.config.timestep_sampling.strategy_name == "uniform":
            return torch.rand(batch_size, device=device)
        elif self.config.timestep_sampling.strategy_name == "beta":
            beta_dist = torch.distributions.Beta(
                self.config.timestep_sampling.alpha, self.config.timestep_sampling.beta
            )
            u = beta_dist.sample((batch_size,)).to(device)
            return self.config.timestep_sampling.s * (1.0 - u)
        else:
            raise ValueError(f"Unknown timestep strategy: {self.config.timestep_sampling.strategy_name}")

    def compute_loss(
        self, model: nn.Module, batch: dict[str, Tensor], conditioning_vec: Tensor
    ) -> tuple[Tensor, dict[str, Tensor]]:
        data = batch["action"]
        batch_size = data.shape[0]
        device = data.device
        noise = torch.randn_like(data)
        t = self._sample_timesteps(batch_size, device)
        t_expanded = t.view(-1, 1, 1)
        x_t = t_expanded * data + (1 - (1 - self.config.sigma_min) * t_expanded) * noise
        target_velocity = data - (1 - self.config.sigma_min) * noise
        predicted_velocity = model(x_t, t, conditioning_vec=conditioning_vec)
        loss = F.mse_loss(predicted_velocity, target_velocity, reduction="none")
        if self.do_mask_loss_for_padding and "action_is_pad" in batch:
            valid_mask = ~batch["action_is_pad"]
            loss = loss * valid_mask.unsqueeze(-1)
        loss_dict = {
            "loss_xyz": loss[..., :3].mean(),
            "loss_rot6d": loss[..., 3:9].mean(),
            "loss_grip": loss[..., 9:].mean(),
        }
        return loss.mean(), loss_dict

    def conditional_sample(self, model: nn.Module, batch_size: int, conditioning_vec: Tensor) -> Tensor:
        device = next(model.parameters()).device
        dtype = next(model.parameters()).dtype
        x = torch.randn((batch_size, self.horizon, self.action_dim), dtype=dtype, device=device)
        num_steps = self.config.num_integration_steps
        time_grid = torch.linspace(0, 1, num_steps + 1, device=device)
        if self.config.integration_method == "euler":
            x = self._euler_integrate(model, x, time_grid, conditioning_vec)
        elif self.config.integration_method == "rk4":
            x = self._rk4_integrate(model, x, time_grid, conditioning_vec)
        else:
            raise ValueError(f"Unknown integration method: {self.config.integration_method}")
        return x

    def _euler_integrate(self, model: nn.Module, x_init: Tensor, time_grid: Tensor, conditioning_vec: Tensor) -> Tensor:
        x = x_init
        for i in range(len(time_grid) - 1):
            t_scalar = time_grid[i].item()
            dt = (time_grid[i + 1] - time_grid[i]).item()
            t_batch = torch.full((x.shape[0],), t_scalar, dtype=x.dtype, device=x.device)
            with torch.no_grad():
                velocity = model(x, t_batch, conditioning_vec=conditioning_vec)
            x = x + dt * velocity
        return x

    def _rk4_integrate(self, model: nn.Module, x_init: Tensor, time_grid: Tensor, conditioning_vec: Tensor) -> Tensor:
        x = x_init

        def dynamics(x_val: Tensor, t_scalar: float) -> Tensor:
            t_batch = torch.full((x_val.shape[0],), t_scalar, dtype=x_val.dtype, device=x_val.device)
            with torch.no_grad():
                return model(x_val, t_batch, conditioning_vec=conditioning_vec)

        for i in range(len(time_grid) - 1):
            t = time_grid[i].item()
            dt = (time_grid[i + 1] - time_grid[i]).item()
            k1 = dynamics(x, t)
            k2 = dynamics(x + dt * k1 / 2, t + dt / 2)
            k3 = dynamics(x + dt * k2 / 2, t + dt / 2)
            k4 = dynamics(x + dt * k3, t + dt)
            x = x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
        return x
