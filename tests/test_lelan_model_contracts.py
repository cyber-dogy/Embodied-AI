from __future__ import annotations

import unittest

import torch
import torch.nn as nn

import _bootstrap  # noqa: F401
from lelan.config.schema import FlowMatchingConfig, LeLaNExperimentConfig, TimestepSamplingConfig
from lelan.model.objectives import FlowMatchingObjective
from lelan.model.transformer import DiffusionTransformer


class _GripOnlyErrorPredictor(nn.Module):
    def forward(
        self,
        x_t: torch.Tensor,
        timestep: torch.Tensor,
        conditioning_vec: torch.Tensor,
    ) -> torch.Tensor:
        del conditioning_vec
        denom = (1.0 - timestep).view(-1, 1, 1).clamp_min(1e-6)
        target_velocity = -(x_t / denom)
        predicted = target_velocity.clone()
        predicted[..., 9] = 0.0
        return predicted


class LeLaNModelContractsTest(unittest.TestCase):
    def test_diffusion_transformer_zero_initializes_output_projection(self) -> None:
        cfg = LeLaNExperimentConfig()
        model = DiffusionTransformer(cfg, conditioning_dim=4)

        self.assertTrue(torch.allclose(model.output_proj.weight, torch.zeros_like(model.output_proj.weight)))
        self.assertTrue(torch.allclose(model.output_proj.bias, torch.zeros_like(model.output_proj.bias)))

        sample = torch.randn(2, cfg.horizon, cfg.action_dim)
        timestep = torch.rand(2)
        conditioning = torch.randn(2, 4)
        output = model(sample, timestep, conditioning)

        self.assertTrue(torch.allclose(output, torch.zeros_like(output)))

    def test_flow_matching_loss_uses_component_aggregation(self) -> None:
        config = FlowMatchingConfig(
            sigma_min=0.0,
            num_integration_steps=2,
            timestep_sampling=TimestepSamplingConfig(strategy_name="uniform"),
        )
        objective = FlowMatchingObjective(config, action_dim=10, horizon=4)
        batch = {"action": torch.zeros(2, 4, 10)}

        torch.manual_seed(0)
        loss, loss_dict = objective.compute_loss(
            _GripOnlyErrorPredictor(),
            batch,
            conditioning_vec=torch.zeros(2, 3),
        )

        old_mean = loss_dict["loss_grip"] / 10.0
        self.assertAlmostEqual(float(loss), float(loss_dict["loss_grip"]), places=6)
        self.assertAlmostEqual(float(loss_dict["loss_xyz"]), 0.0, places=6)
        self.assertAlmostEqual(float(loss_dict["loss_rot6d"]), 0.0, places=6)
        self.assertGreater(float(loss), float(old_mean) * 5.0)

    def test_flow_matching_loss_weights_override_total_loss(self) -> None:
        config = FlowMatchingConfig(
            sigma_min=0.0,
            num_integration_steps=2,
            timestep_sampling=TimestepSamplingConfig(strategy_name="uniform"),
            loss_weights={"xyz": 0.0, "rot6d": 0.0, "grip": 2.5},
        )
        objective = FlowMatchingObjective(config, action_dim=10, horizon=4)
        batch = {"action": torch.zeros(2, 4, 10)}

        torch.manual_seed(0)
        loss, loss_dict = objective.compute_loss(
            _GripOnlyErrorPredictor(),
            batch,
            conditioning_vec=torch.zeros(2, 3),
        )

        self.assertAlmostEqual(float(loss), float(loss_dict["loss_grip"]) * 2.5, places=6)
if __name__ == "__main__":
    unittest.main()
