from __future__ import annotations

from pathlib import Path
import unittest

import _bootstrap  # noqa: F401
from lelan.config import LeLaNExperimentConfig, load_config


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class LeLaNConfigAlignmentTest(unittest.TestCase):
    def test_default_runtime_knobs_match_new_mainline(self) -> None:
        cfg = LeLaNExperimentConfig()
        self.assertEqual(cfg.n_action_steps, 8)
        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.offline_eval_ckpt_every_epochs, 0)
        self.assertEqual(cfg.command_mode, "first")

    def test_baseline_config_loads_new_eval_and_postprocess_fields(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "lelan" / "baseline.json")
        self.assertEqual(cfg.n_action_steps, 8)
        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.success_selection_every_epochs, 0)
        self.assertEqual(cfg.success_selection_episodes, 0)
        self.assertFalse(cfg.smooth_actions)

    def test_obs3_rgb5_a8_gate100_config_loads_expected_values(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "lelan" / "obs3_rgb5_a8_gate100.json")
        self.assertEqual(cfg.n_obs_steps, 3)
        self.assertEqual(cfg.horizon, 32)
        self.assertEqual(cfg.n_action_steps, 8)
        self.assertEqual(
            cfg.camera_names,
            ("right_shoulder", "left_shoulder", "overhead", "front", "wrist"),
        )
        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.success_selection_every_epochs, 100)
        self.assertEqual(cfg.success_selection_episodes, 20)
        self.assertTrue(cfg.smooth_actions)
        self.assertEqual(cfg.command_mode, "first")
        self.assertAlmostEqual(cfg.position_alpha, 0.35)
        self.assertAlmostEqual(cfg.rotation_alpha, 0.25)
        self.assertAlmostEqual(cfg.objective.sigma_min, 0.001)
        self.assertEqual(cfg.objective.num_integration_steps, 25)


if __name__ == "__main__":
    unittest.main()
