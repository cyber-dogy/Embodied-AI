from __future__ import annotations

from pathlib import Path
import unittest

import _bootstrap  # noqa: F401
from lelan.config import LeLaNExperimentConfig, config_from_dict, load_config


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class LeLaNConfigAlignmentTest(unittest.TestCase):
    def test_default_runtime_knobs_match_new_mainline(self) -> None:
        cfg = LeLaNExperimentConfig()
        self.assertEqual(cfg.n_action_steps, 8)
        self.assertEqual(cfg.encoder_name, "clip_rgb_history_token")
        self.assertEqual(cfg.backbone_name, "dit")
        self.assertEqual(cfg.vision_backbone_name, "vit_base_patch16_clip_224.openai")
        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.offline_eval_ckpt_every_epochs, 0)
        self.assertEqual(cfg.command_mode, "first")

    def test_baseline_config_loads_mdit_comparable_fields(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "lelan" / "baseline.json")
        self.assertEqual(cfg.n_action_steps, 8)
        self.assertEqual(cfg.encoder_name, "clip_rgb_history_token")
        self.assertEqual(cfg.backbone_name, "dit")
        self.assertEqual(cfg.n_pred_steps, 32)
        self.assertEqual(cfg.time_dim, 256)
        self.assertEqual(cfg.history_encoder.backbone, "efficientnet-b0")
        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.success_selection_every_epochs, 0)
        self.assertEqual(cfg.success_selection_episodes, 0)
        self.assertFalse(cfg.smooth_actions)

    def test_obs3_rgb5_a8_gate100_config_loads_expected_values(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "lelan" / "obs3_rgb5_a8_gate100.json")
        self.assertEqual(cfg.n_obs_steps, 3)
        self.assertEqual(cfg.n_pred_steps, 32)
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
        self.assertAlmostEqual(cfg.fm_sigma_min, 0.001)
        self.assertEqual(cfg.fm_num_integration_steps, 25)

    def test_legacy_payload_is_upgraded_to_mainline_comparable_fields(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "lelan" / "baseline.json")
        payload = {
            "train_data_path": str(cfg.train_data_path),
            "valid_data_path": str(cfg.valid_data_path),
            "horizon": 16,
            "robot_state_dim": 10,
            "action_dim": 10,
            "task_text_mode": "template",
            "text_encoder": {"model": "openai/clip-vit-base-patch16"},
            "transformer": {
                "hidden_dim": 384,
                "num_layers": 4,
                "num_heads": 6,
                "diffusion_step_embed_dim": 128,
                "use_rope": True,
                "rope_base": 20000.0
            },
            "objective": {
                "sigma_min": 0.01,
                "num_integration_steps": 12,
                "integration_method": "rk4",
                "timestep_sampling": {
                    "strategy_name": "uniform",
                    "s": 0.9,
                    "alpha": 1.1,
                    "beta": 1.2
                }
            }
        }

        upgraded = config_from_dict(payload)

        self.assertEqual(upgraded.n_pred_steps, 16)
        self.assertEqual(upgraded.y_dim, 10)
        self.assertEqual(upgraded.text_source, "task_template")
        self.assertEqual(upgraded.hidden_dim, 384)
        self.assertEqual(upgraded.num_blocks, 4)
        self.assertEqual(upgraded.nhead, 6)
        self.assertEqual(upgraded.time_dim, 128)
        self.assertTrue(upgraded.use_rope)
        self.assertAlmostEqual(upgraded.rope_base, 20000.0)
        self.assertAlmostEqual(upgraded.fm_sigma_min, 0.01)
        self.assertEqual(upgraded.fm_num_integration_steps, 12)
        self.assertEqual(upgraded.fm_integration_method, "rk4")
        self.assertEqual(upgraded.fm_timestep_sampling_strategy, "uniform")
        self.assertAlmostEqual(upgraded.fm_timestep_beta_s, 0.9)


if __name__ == "__main__":
    unittest.main()
