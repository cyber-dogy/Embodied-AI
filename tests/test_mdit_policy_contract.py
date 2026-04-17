from __future__ import annotations

import unittest

import numpy as np
import torch
import torch.nn as nn

import _bootstrap  # noqa: F401
from common.runtime import set_device
from mdit.model.backbones.dit import DiTTrajectoryBackbone
from mdit.policy.fm_policy import FMPolicyConfig, FMTransformerPolicy


class _StubObsEncoder(nn.Module):
    def __init__(self, obs_features_dim: int, robot_state_dim: int):
        super().__init__()
        self.proj = nn.Linear(robot_state_dim, obs_features_dim)

    def forward(self, obs: torch.Tensor, robot_state_obs: torch.Tensor, task_text=None) -> torch.Tensor:
        del obs, task_text
        obs_feat = self.proj(robot_state_obs.float())
        return torch.cat([obs_feat, robot_state_obs.float()], dim=-1)


class MDITPolicyContractTest(unittest.TestCase):
    def test_fm_policy_rgb_text_batch_contract(self) -> None:
        set_device("cpu")
        cfg = FMPolicyConfig(
            x_dim=266,
            y_dim=10,
            n_obs_steps=3,
            n_pred_steps=32,
            num_k_infer=10,
            time_conditioning=True,
            default_task_text="unplug the charger cable",
            subs_factor=3,
            loss_weights={"xyz": 1.0, "rot6d": 1.0, "grip": 1.0},
        )
        obs_encoder = _StubObsEncoder(obs_features_dim=256, robot_state_dim=10)
        backbone = DiTTrajectoryBackbone(
            input_dim=10,
            output_dim=10,
            cond_dim=266,
            horizon=32,
            time_dim=64,
            hidden_dim=128,
            num_blocks=2,
            dropout=0.0,
            dim_feedforward=256,
            nhead=4,
            activation="gelu",
            debug_finiteness=False,
            final_layer_zero_init=False,
            decoder_condition_mode="mean_pool",
        )
        policy = FMTransformerPolicy(cfg, obs_encoder=obs_encoder, backbone=backbone)

        batch = (
            torch.rand(2, 3, 5, 16, 16, 3),
            torch.rand(2, 3, 10),
            torch.rand(2, 32, 10),
            ["unplug the charger cable", "unplug the charger cable"],
        )
        loss_dict = policy.compute_loss_dict(batch)
        self.assertIn("loss_total", loss_dict)

        normed = policy._norm_data(batch)
        obs, robot_state_obs, _, task_text = normed
        pred = policy.infer_y(obs, robot_state_obs, task_text=task_text)
        self.assertEqual(pred.shape, (2, 32, 10))

        obs_np = np.random.randint(0, 255, size=(5, 16, 16, 3), dtype=np.uint8)
        robot_state_np = np.zeros((10,), dtype=np.float32)
        action = policy.predict_action(obs_np, robot_state_np)
        self.assertEqual(action.shape[-1], 10)


if __name__ == "__main__":
    unittest.main()
