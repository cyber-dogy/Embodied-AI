from __future__ import annotations

from dataclasses import dataclass

import torch
import torch.nn as nn
from diffusers.schedulers.scheduling_ddim import DDIMScheduler

from .base_policy import BasePolicy
from .common import DEVICE
from .se3_utils import init_random_traj_th


@dataclass
class DiffusionPolicyConfig:
    x_dim: int
    y_dim: int
    n_obs_steps: int
    n_pred_steps: int
    num_inference_steps: int = 100
    norm_pcd_center: tuple[float, float, float] = (0.4, 0.0, 1.4)
    noise_scale: float = 1.0
    train_diffusion_steps: int = 100
    eval_diffusion_steps: int = 100
    prediction_type: str = "epsilon"
    subs_factor: int = 1
    loss_type: str = "l2"


class DiffusionTransformerPolicy(nn.Module, BasePolicy):
    def __init__(
        self,
        cfg: DiffusionPolicyConfig,
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
        self.num_inference_steps = int(cfg.num_inference_steps)
        self.obs_encoder = obs_encoder
        self.backbone = backbone
        self.norm_pcd_center = tuple(float(v) for v in cfg.norm_pcd_center)
        self.noise_scale = float(cfg.noise_scale)
        self.prediction_type = str(cfg.prediction_type)
        if cfg.loss_type == "l1":
            self.loss_fun = nn.L1Loss()
        else:
            self.loss_fun = nn.MSELoss()
        self.scheduler = DDIMScheduler(
            num_train_timesteps=int(cfg.train_diffusion_steps),
            beta_start=0.0001,
            beta_end=0.02,
            beta_schedule="squaredcos_cap_v2",
            clip_sample=True,
            set_alpha_to_one=True,
            steps_offset=0,
            prediction_type=str(cfg.prediction_type),
        )

    def _norm_obs(self, pcd: torch.Tensor) -> torch.Tensor:
        pcd = pcd.clone()
        pcd[..., :3] -= torch.tensor(self.norm_pcd_center, device=pcd.device, dtype=pcd.dtype)
        return pcd

    def _norm_robot_state(self, robot_state: torch.Tensor) -> torch.Tensor:
        robot_state = robot_state.clone()
        robot_state[..., :3] -= torch.tensor(
            self.norm_pcd_center,
            device=robot_state.device,
            dtype=robot_state.dtype,
        )
        robot_state[..., 9] -= 0.5
        return robot_state

    def _denorm_robot_state(self, robot_state: torch.Tensor) -> torch.Tensor:
        robot_state = robot_state.clone()
        robot_state[..., :3] += torch.tensor(
            self.norm_pcd_center,
            device=robot_state.device,
            dtype=robot_state.dtype,
        )
        robot_state[..., 9] += 0.5
        return robot_state

    def _norm_data(self, batch: tuple[torch.Tensor, ...]) -> tuple[torch.Tensor, ...]:
        pcd, robot_state_obs, robot_state_pred = batch
        return (
            self._norm_obs(pcd),
            self._norm_robot_state(robot_state_obs),
            self._norm_robot_state(robot_state_pred),
        )

    def _encode_obs_tokens(self, pcd: torch.Tensor, robot_state_obs: torch.Tensor) -> torch.Tensor:
        cond_tokens = self.obs_encoder(pcd, robot_state_obs)
        if cond_tokens.ndim != 3:
            raise ValueError(
                "Expected obs encoder to return cond_tokens with shape (B, T_obs, cond_dim), "
                f"got {tuple(cond_tokens.shape)}"
            )
        return cond_tokens

    def compute_loss_dict(self, batch: tuple[torch.Tensor, ...]) -> dict[str, torch.Tensor]:
        pcd, robot_state_obs, robot_state_pred = self._norm_data(batch)
        cond_tokens = self._encode_obs_tokens(pcd, robot_state_obs)
        batch_size = robot_state_pred.shape[0]
        noise = torch.randn_like(robot_state_pred) * self.noise_scale
        timesteps = torch.randint(
            low=0,
            high=self.scheduler.config.num_train_timesteps,
            size=(batch_size,),
            device=robot_state_pred.device,
        ).long()
        noisy_actions = self.scheduler.add_noise(robot_state_pred, noise, timesteps)
        noise_pred = self.backbone(noisy_actions, timesteps, cond_tokens=cond_tokens)
        loss_xyz = self.loss_fun(noise_pred[..., :3], noise[..., :3])
        loss_rot6d = self.loss_fun(noise_pred[..., 3:9], noise[..., 3:9])
        loss_grip = self.loss_fun(noise_pred[..., 9], noise[..., 9])
        total_loss = loss_xyz + loss_rot6d + loss_grip
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
        sample = noise
        if sample is None:
            sample = torch.randn(
                (batch_size, self.n_pred_steps, self.y_dim),
                device=DEVICE,
                dtype=torch.float32,
            ) * self.noise_scale
        traj = [sample]
        self.scheduler.set_timesteps(self.num_inference_steps)
        self.scheduler.alphas_cumprod = self.scheduler.alphas_cumprod.to(device=DEVICE)
        for timestep in self.scheduler.timesteps:
            batched_timestep = timestep.unsqueeze(0).repeat(batch_size).to(DEVICE)
            noise_pred = self.backbone(sample, batched_timestep, cond_tokens=cond_tokens)
            sample = self.scheduler.step(
                model_output=noise_pred,
                timestep=timestep,
                sample=sample,
            ).prev_sample
            traj.append(sample)
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
