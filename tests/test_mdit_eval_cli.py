from __future__ import annotations

import argparse
import tempfile
from pathlib import Path
import unittest
from unittest import mock

import torch

import _bootstrap  # noqa: F401
from mdit.cli.eval_all_checkpoints import discover_checkpoints
from mdit.cli.eval_checkpoint import _should_reexec_under_xvfb, build_episode_analysis
from mdit.cli.shared import payload_cfg_to_experiment_cfg
from mdit.config import MDITExperimentConfig
from mdit.model.action_postprocess import postprocess_robot_state_command
from mdit.train.eval import compute_grip_diagnostics_from_actions, evaluate_model_on_loader


class MDITEvalCliTest(unittest.TestCase):
    def test_postprocess_keeps_raw_gripper_when_smoothing_is_disabled(self) -> None:
        current = torch.zeros(10, dtype=torch.float32).numpy()
        predicted = torch.zeros(10, dtype=torch.float32).numpy()
        predicted[3:9] = torch.tensor([1.0, 0.2, 0.0, 0.0, 1.0, 0.2], dtype=torch.float32).numpy()
        predicted[9] = 0.55

        command = postprocess_robot_state_command(
            current,
            predicted,
            enabled=False,
            position_alpha=0.35,
            rotation_alpha=0.25,
            max_position_step=0.03,
            gripper_open_threshold=0.6,
            gripper_close_threshold=0.4,
        )

        self.assertAlmostEqual(float(command[9]), 0.55, places=6)

    def test_compute_grip_diagnostics_from_actions_reports_deadband_and_transition_metrics(self) -> None:
        cfg = MDITExperimentConfig()
        pred_actions = torch.zeros(1, 4, 10, dtype=torch.float32)
        target_actions = torch.zeros(1, 4, 10, dtype=torch.float32)
        pred_actions[0, :, 9] = torch.tensor([0.2, 0.5, 0.8, 0.9])
        target_actions[0, :, 9] = torch.tensor([0.0, 0.0, 1.0, 1.0])

        metrics = compute_grip_diagnostics_from_actions(pred_actions, target_actions, cfg)

        self.assertAlmostEqual(metrics["grip_mean_pred"], 0.6, places=5)
        self.assertAlmostEqual(metrics["grip_mean_target"], 0.5, places=5)
        self.assertAlmostEqual(metrics["grip_deadband_ratio"], 0.25, places=5)
        self.assertAlmostEqual(metrics["grip_binary_acc"], 0.75, places=5)
        self.assertAlmostEqual(metrics["grip_transition_acc"], 1.0, places=5)
        self.assertEqual(metrics["grip_transition_frames"], 1.0)

    def test_evaluate_model_on_loader_includes_grip_diagnostics(self) -> None:
        cfg = MDITExperimentConfig(n_obs_steps=2, n_action_steps=2)
        batch = {
            "action": torch.tensor(
                [[[0.0] * 9 + [0.0], [0.0] * 9 + [0.0], [0.0] * 9 + [1.0]]],
                dtype=torch.float32,
            )
        }

        class _DummyModel:
            def __init__(self, cfg):
                self.config = cfg

            def eval(self):
                return self

            def __call__(self, batch):
                del batch
                return torch.tensor(0.25), {
                    "loss_xyz": torch.tensor(0.1),
                    "loss_rot6d": torch.tensor(0.2),
                    "loss_grip": torch.tensor(0.3),
                }

            def _generate_action_chunk(self, batch):
                del batch
                pred = torch.zeros(1, 2, 10, dtype=torch.float32)
                pred[0, :, 9] = torch.tensor([0.5, 0.9])
                return pred

            def unnormalize_action(self, action):
                return action

        summary = evaluate_model_on_loader(_DummyModel(cfg), [batch], cfg)

        self.assertIsNotNone(summary)
        assert summary is not None
        self.assertIn("grip_mean_pred", summary)
        self.assertIn("grip_deadband_ratio", summary)
        self.assertIn("grip_transition_acc", summary)

    def test_should_reexec_under_xvfb_when_headless_without_display(self) -> None:
        args = argparse.Namespace(headless=True)
        with mock.patch.dict("os.environ", {}, clear=True), mock.patch(
            "mdit.cli.eval_checkpoint.shutil.which",
            return_value="/usr/bin/xvfb-run",
        ):
            self.assertTrue(_should_reexec_under_xvfb(args))

    def test_should_not_reexec_when_display_exists(self) -> None:
        args = argparse.Namespace(headless=True)
        with mock.patch.dict("os.environ", {"DISPLAY": ":99"}, clear=True), mock.patch(
            "mdit.cli.eval_checkpoint.shutil.which",
            return_value="/usr/bin/xvfb-run",
        ):
            self.assertFalse(_should_reexec_under_xvfb(args))

    def test_build_episode_analysis_surfaces_failure_patterns(self) -> None:
        result = {
            "num_episodes": 5,
            "success_rate": 0.2,
            "mean_steps": 37.0,
            "episode_records": [
                {"episode": 0, "success": False, "steps": 5, "error": "planning runtime error: The call failed on the V-REP side. Return value: -1"},
                {"episode": 1, "success": False, "steps": 12, "error": "simulator runtime error: boom"},
                {"episode": 2, "success": True, "steps": 80, "error": None},
                {"episode": 3, "success": False, "steps": 200, "error": None},
                {"episode": 4, "success": False, "steps": 40, "error": "invalid predicted action: nan"},
            ],
        }

        analysis = build_episode_analysis(result)

        self.assertEqual(analysis["num_successes"], 1)
        self.assertEqual(analysis["failure_error_buckets"]["planning_runtime_error"], 1)
        self.assertEqual(analysis["failure_error_buckets"]["simulator_runtime_error"], 1)
        self.assertEqual(analysis["failure_error_buckets"]["invalid_predicted_action"], 1)
        self.assertEqual(analysis["failure_step_buckets"]["lt_20"], 2)
        self.assertEqual(analysis["failure_step_buckets"]["at_horizon"], 1)
        self.assertIn("planner_rejecting_many_predicted_actions", analysis["likely_causes"])
        self.assertIn("some_rollouts_exhaust_the_horizon_without_finishing", analysis["likely_causes"])

    def test_discover_checkpoints_falls_back_to_eval_ckpts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            run_dir = Path(tmp_dir) / "run"
            eval_dir = run_dir / "eval_ckpts"
            eval_dir.mkdir(parents=True, exist_ok=True)
            (eval_dir / "epoch_0100.pt").write_bytes(b"stub")

            records = discover_checkpoints(run_dir / "epochs", include_special=False)

        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]["label"], "epoch_0100")
        self.assertEqual(records[0]["epoch"], 100)

    def test_payload_cfg_to_experiment_cfg_restores_new_defaults_for_old_payloads(self) -> None:
        payload_cfg = {
            "run_name": "legacy",
            "task_name": "unplug_charger",
            "train_data_path": "/tmp/train",
            "valid_data_path": "/tmp/valid",
            "n_action_steps": 1,
        }

        cfg = payload_cfg_to_experiment_cfg(payload_cfg, ckpt_root=Path("/tmp/ckpt"))

        self.assertEqual(cfg.n_obs_steps, 2)
        self.assertEqual(cfg.horizon, 100)
        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.offline_eval_ckpt_every_epochs, 0)
        self.assertEqual(cfg.offline_eval_ckpt_payload_mode, "lightweight")
        self.assertFalse(cfg.rlbench_disable_task_validation)
        self.assertFalse(cfg.ema_enable)

    def test_payload_cfg_to_experiment_cfg_maps_legacy_transformer_alias(self) -> None:
        payload_cfg = {
            "run_name": "legacy-pcd",
            "task_name": "unplug_charger",
            "train_data_path": "/tmp/train",
            "valid_data_path": "/tmp/valid",
            "use_pcd": True,
            "pcd_transformer_variant": "pdit",
        }

        cfg = payload_cfg_to_experiment_cfg(payload_cfg, ckpt_root=Path("/tmp/ckpt"))

        self.assertTrue(cfg.use_pcd)
        self.assertEqual(cfg.transformer_variant, "pdit")

    def test_payload_cfg_to_experiment_cfg_rejects_conflicting_transformer_fields(self) -> None:
        payload_cfg = {
            "run_name": "legacy-conflict",
            "task_name": "unplug_charger",
            "train_data_path": "/tmp/train",
            "valid_data_path": "/tmp/valid",
            "transformer_variant": "mdit",
            "pcd_transformer_variant": "pdit",
        }

        with self.assertRaisesRegex(ValueError, "conflicting transformer variant fields"):
            payload_cfg_to_experiment_cfg(payload_cfg, ckpt_root=Path("/tmp/ckpt"))


if __name__ == "__main__":
    unittest.main()
