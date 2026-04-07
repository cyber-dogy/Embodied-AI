from __future__ import annotations

import unittest

import torch
import torch.nn as nn

import _bootstrap  # noqa: F401
from autodl_unplug_charger_transformer_fm.models.dit_backbone import DiTTrajectoryBackbone
from autodl_unplug_charger_transformer_fm.policies.fm_policy import FMPolicyConfig, FMTransformerPolicy


class _DummyObsEncoder(nn.Module):
    def __init__(self, cond_dim: int) -> None:
        super().__init__()
        self.cond_dim = int(cond_dim)

    def forward(self, pcd: torch.Tensor, robot_state_obs: torch.Tensor) -> torch.Tensor:
        batch_size, n_obs_steps = robot_state_obs.shape[:2]
        return torch.zeros(
            batch_size,
            n_obs_steps,
            self.cond_dim,
            device=robot_state_obs.device,
            dtype=robot_state_obs.dtype,
        )


class _DummyBackbone(nn.Module):
    def forward(
        self,
        sample: torch.Tensor,
        timestep: torch.Tensor | float | int,
        cond_tokens: torch.Tensor,
    ) -> torch.Tensor:
        return torch.zeros_like(sample)


class ModelExperimentKnobsTest(unittest.TestCase):
    def test_dit_backbone_supports_cross_attention_conditioning(self) -> None:
        model = DiTTrajectoryBackbone(
            input_dim=10,
            output_dim=10,
            cond_dim=266,
            horizon=32,
            hidden_dim=128,
            time_dim=64,
            num_blocks=2,
            nhead=4,
            dim_feedforward=256,
            dropout=0.0,
            final_layer_zero_init=True,
            decoder_condition_mode="cross_attn",
        )
        sample = torch.randn(2, 32, 10)
        timesteps = torch.rand(2)
        cond_tokens = torch.randn(2, 3, 266)

        output = model(sample, timesteps, cond_tokens)

        self.assertEqual(tuple(output.shape), (2, 32, 10))
        self.assertTrue(torch.allclose(model.output_head.linear.weight, torch.zeros_like(model.output_head.linear.weight)))
        self.assertTrue(torch.allclose(model.output_head.linear.bias, torch.zeros_like(model.output_head.linear.bias)))

    def test_fm_policy_roundtrip_robot_state_stats(self) -> None:
        mean = tuple(float(v) for v in range(10))
        std = tuple(float(v + 1) for v in range(10))
        cfg = FMPolicyConfig(
            x_dim=266,
            y_dim=10,
            n_obs_steps=3,
            n_pred_steps=4,
            num_k_infer=2,
            time_conditioning=True,
            robot_state_mean=mean,
            robot_state_std=std,
        )
        policy = FMTransformerPolicy(
            cfg,
            obs_encoder=_DummyObsEncoder(cond_dim=266),
            backbone=_DummyBackbone(),
        )

        robot_state = torch.randn(2, 3, 10)
        normalized = policy._norm_robot_state(robot_state)
        restored = policy._denorm_robot_state(normalized)

        self.assertTrue(torch.allclose(restored, robot_state, atol=1e-5, rtol=1e-5))


if __name__ == "__main__":
    unittest.main()
