from __future__ import annotations

import argparse
import unittest
from unittest import mock

import _bootstrap  # noqa: F401
from mdit.cli.eval_checkpoint import _should_reexec_under_xvfb, build_episode_analysis


class MDITEvalCliTest(unittest.TestCase):
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
        self.assertIn("some_rollouts_exhaust_the_horizon_without_finishing", analysis["likely_causes"])


if __name__ == "__main__":
    unittest.main()
