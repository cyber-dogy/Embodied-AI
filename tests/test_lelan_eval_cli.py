from __future__ import annotations

import argparse
import tempfile
from pathlib import Path
import unittest
from unittest import mock

import _bootstrap  # noqa: F401
from lelan.cli.eval_all_checkpoints import discover_checkpoints
from lelan.cli.eval_checkpoint import _should_reexec_under_xvfb, build_episode_analysis
from lelan.cli.shared import payload_cfg_to_experiment_cfg


class LeLaNEvalCliTest(unittest.TestCase):
    def test_should_reexec_under_xvfb_when_headless_without_display(self) -> None:
        args = argparse.Namespace(headless=True)
        with mock.patch.dict("os.environ", {}, clear=True), mock.patch(
            "lelan.cli.eval_checkpoint.shutil.which",
            return_value="/usr/bin/xvfb-run",
        ):
            self.assertTrue(_should_reexec_under_xvfb(args))

    def test_should_not_reexec_when_display_exists(self) -> None:
        args = argparse.Namespace(headless=True)
        with mock.patch.dict("os.environ", {"DISPLAY": ":99"}, clear=True), mock.patch(
            "lelan.cli.eval_checkpoint.shutil.which",
            return_value="/usr/bin/xvfb-run",
        ):
            self.assertFalse(_should_reexec_under_xvfb(args))

    def test_build_episode_analysis_surfaces_failure_patterns(self) -> None:
        result = {
            "num_episodes": 5,
            "success_rate": 0.2,
            "mean_steps": 37.0,
            "episode_records": [
                {"episode": 0, "success": False, "steps": 5, "error": "simulator runtime error: boom"},
                {"episode": 1, "success": False, "steps": 12, "error": "simulator runtime error: boom"},
                {"episode": 2, "success": True, "steps": 80, "error": None},
                {"episode": 3, "success": False, "steps": 200, "error": None},
                {"episode": 4, "success": False, "steps": 40, "error": "invalid predicted action: nan"},
            ],
        }

        analysis = build_episode_analysis(result)

        self.assertEqual(analysis["num_successes"], 1)
        self.assertEqual(analysis["failure_error_buckets"]["simulator_runtime_error"], 2)
        self.assertEqual(analysis["failure_error_buckets"]["invalid_predicted_action"], 1)
        self.assertEqual(analysis["failure_step_buckets"]["lt_20"], 2)
        self.assertEqual(analysis["failure_step_buckets"]["at_horizon"], 1)
        self.assertIn("planner_or_simulator_rejecting_many_predicted_actions", analysis["likely_causes"])

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

        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.offline_eval_ckpt_every_epochs, 0)
        self.assertEqual(cfg.offline_eval_ckpt_payload_mode, "lightweight")
        self.assertEqual(cfg.command_mode, "first")


if __name__ == "__main__":
    unittest.main()
