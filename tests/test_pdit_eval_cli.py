from __future__ import annotations

import argparse
from pathlib import Path
import unittest
from unittest import mock

import _bootstrap  # noqa: F401
from pdit.cli.eval_checkpoint import (
    _looks_like_mdit_checkpoint,
    _should_reexec_under_xvfb,
    build_episode_analysis,
)
from pdit.cli.shared import payload_cfg_to_experiment_cfg


class PDITEvalCliTest(unittest.TestCase):
    def test_should_reexec_under_xvfb_when_headless_without_display(self) -> None:
        args = argparse.Namespace(headless=True)
        with mock.patch.dict("os.environ", {}, clear=True), mock.patch(
            "pdit.cli.eval_checkpoint.shutil.which",
            return_value="/usr/bin/xvfb-run",
        ):
            self.assertTrue(_should_reexec_under_xvfb(args))

    def test_payload_cfg_to_experiment_cfg_accepts_legacy_horizon_and_unknown_keys(self) -> None:
        payload_cfg = {
            "run_name": "legacy",
            "task_name": "unplug_charger",
            "train_data_path": "/tmp/train",
            "valid_data_path": "/tmp/valid",
            "horizon": 100,
            "unknown_field_from_old_ckpt": "ignore-me",
        }

        cfg = payload_cfg_to_experiment_cfg(payload_cfg, ckpt_root=Path("/tmp/ckpt"), seed=7)

        self.assertEqual(cfg.n_pred_steps, 100)
        self.assertEqual(cfg.seed, 7)
        self.assertEqual(cfg.ckpt_root, Path("/tmp/ckpt"))

    def test_looks_like_mdit_checkpoint(self) -> None:
        payload = {
            "cfg": {"objective": {"name": "flow_matching"}},
            "model_state_dict": {"noise_predictor.time_mlp.1.weight": None},
        }
        self.assertTrue(_looks_like_mdit_checkpoint(payload))

    def test_build_episode_analysis_splits_planning_and_simulator_runtime_errors(self) -> None:
        result = {
            "num_episodes": 6,
            "success_rate": 1.0 / 6.0,
            "mean_steps": 61.0,
            "episode_records": [
                {"episode": 0, "success": False, "steps": 5, "error": "planning runtime error: The call failed on the V-REP side. Return value: -1"},
                {"episode": 1, "success": False, "steps": 12, "error": "The call failed on the V-REP side. Return value: -1"},
                {"episode": 2, "success": True, "steps": 80, "error": None},
                {"episode": 3, "success": False, "steps": 33, "error": "simulator runtime error: boom"},
                {"episode": 4, "success": False, "steps": 200, "error": None},
                {"episode": 5, "success": False, "steps": 40, "error": "invalid predicted action: nan"},
            ],
        }

        analysis = build_episode_analysis(result)

        self.assertEqual(analysis["num_successes"], 1)
        self.assertEqual(analysis["failure_error_buckets"]["planning_runtime_error"], 2)
        self.assertEqual(analysis["failure_error_buckets"]["simulator_runtime_error"], 1)
        self.assertEqual(analysis["failure_error_buckets"]["invalid_predicted_action"], 1)
        self.assertIn("planner_rejecting_many_predicted_actions", analysis["likely_causes"])


if __name__ == "__main__":
    unittest.main()
