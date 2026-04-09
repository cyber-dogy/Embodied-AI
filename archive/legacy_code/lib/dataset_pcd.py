from __future__ import annotations
import numpy as np
import torch

from .dp_sampler import SequenceSampler
from .replay_buffer import RobotReplayBuffer
from .se3_utils import transform_th


def rand_range(low: float, high: float, size: tuple[int], device) -> torch.Tensor:
    return torch.rand(size, device=device) * (high - low) + low


def _random_se3_matrix(
    sigma_transl: float,
    sigma_rot_rad: float,
    device: torch.device,
    dtype: torch.dtype,
) -> torch.Tensor:
    """Sample a small random SE(3) transform using pure torch."""
    axis = torch.randn(3, device=device, dtype=dtype)
    axis = axis / axis.norm().clamp_min(1e-8)
    angle = torch.randn((), device=device, dtype=dtype) * sigma_rot_rad
    kx, ky, kz = axis.unbind()
    skew = torch.tensor(
        [[0.0, -kz, ky], [kz, 0.0, -kx], [-ky, kx, 0.0]],
        device=device,
        dtype=dtype,
    )
    eye = torch.eye(3, device=device, dtype=dtype)
    rot = eye + torch.sin(angle) * skew + (1.0 - torch.cos(angle)) * (skew @ skew)
    transl = torch.randn(3, device=device, dtype=dtype) * sigma_transl
    transform = torch.eye(4, device=device, dtype=dtype)
    transform[:3, :3] = rot
    transform[:3, 3] = transl
    return transform


def augment_pcd_data(batch: tuple[torch.Tensor, ...]) -> tuple[torch.Tensor, ...]:
    pcd, robot_state_obs, robot_state_pred = batch
    BT_robot_obs = robot_state_obs.shape[:-1]
    BT_robot_pred = robot_state_pred.shape[:-1]

    # sigma=(sigma_transl, sigma_rot_rad)
    transform = _random_se3_matrix(
        sigma_transl=0.1,
        sigma_rot_rad=0.2,
        device=pcd.device,
        dtype=pcd.dtype,
    )

    pcd[..., :3] = transform_th(transform, pcd[..., :3])
    robot_obs_pseudoposes = robot_state_obs[..., :9].reshape(*BT_robot_obs, 3, 3)
    robot_pred_pseudoposes = robot_state_pred[..., :9].reshape(*BT_robot_pred, 3, 3)
    robot_obs_pseudoposes = transform_th(transform, robot_obs_pseudoposes)
    robot_pred_pseudoposes = transform_th(transform, robot_pred_pseudoposes)
    robot_state_obs[..., :9] = robot_obs_pseudoposes.reshape(*BT_robot_obs, 9)
    robot_state_pred[..., :9] = robot_pred_pseudoposes.reshape(*BT_robot_pred, 9)

    # We shuffle the points, i.e. shuffle pcd along dim=2 (B, T, P, 3)
    idx = torch.randperm(pcd.shape[2])
    pcd = pcd[:, :, idx, :]
    return pcd, robot_state_obs, robot_state_pred


class RobotDatasetPcd(torch.utils.data.Dataset):
    def __init__(
        self,
        data_path: str,
        n_obs_steps: int,
        n_pred_steps: int,
        use_pc_color: bool,
        n_points: int,
        subs_factor: int = 1,  # 1 means no subsampling
    ) -> None:
        """
        To me it makes sense that sequence_length == n_obs_steps + n_prediction_steps
        """
        replay_buffer = RobotReplayBuffer.create_from_path(data_path, mode="r")
        data_keys = ["robot_state", "pcd_xyz"]
        data_key_first_k = {"pcd_xyz": n_obs_steps * subs_factor}
        if use_pc_color:
            data_keys.append("pcd_color")
            data_key_first_k["pcd_color"] = n_obs_steps * subs_factor
        self.sampler = SequenceSampler(
            replay_buffer=replay_buffer,
            sequence_length=(n_obs_steps + n_pred_steps) * subs_factor - (subs_factor - 1),
            pad_before=(n_obs_steps - 1) * subs_factor,
            pad_after=(n_pred_steps - 1) * subs_factor + (subs_factor - 1),
            keys=data_keys,
            key_first_k=data_key_first_k,
        )
        self.n_obs_steps = n_obs_steps
        self.n_prediction_steps = n_pred_steps
        self.subs_factor = subs_factor
        self.use_pc_color = use_pc_color
        self.n_points = n_points
        self.rng = np.random.default_rng()
        return

    def __len__(self) -> int:
        return len(self.sampler)

    def __getitem__(self, idx: int) -> tuple[torch.Tensor, ...]:
        sample: dict[str, np.ndarray] = self.sampler.sample_sequence(idx)
        cur_step_i = self.n_obs_steps * self.subs_factor
        pcd = sample["pcd_xyz"][: cur_step_i : self.subs_factor]
        if self.use_pc_color:
            pcd_color = sample["pcd_color"][: cur_step_i : self.subs_factor]
            pcd_color = pcd_color.astype(np.float32) / 255.0
            pcd = np.concatenate([pcd, pcd_color], axis=-1)
        robot_state_obs = sample["robot_state"][: cur_step_i : self.subs_factor].astype(np.float32)
        robot_state_pred = sample["robot_state"][cur_step_i :: self.subs_factor].astype(np.float32)
        # Random sample pcd points
        if pcd.shape[1] > self.n_points:
            random_indices = np.random.choice(pcd.shape[1], self.n_points, replace=False)
            pcd = pcd[:, random_indices]
        return pcd, robot_state_obs, robot_state_pred


if __name__ == "__main__":
    raise SystemExit("Use this module from the AutoDL notebooks.")
