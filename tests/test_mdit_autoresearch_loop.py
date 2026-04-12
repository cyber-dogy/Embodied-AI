from __future__ import annotations

import json
import tempfile
from pathlib import Path
import unittest
from unittest import mock

import _bootstrap  # noqa: F401
from research.mdit_autoresearch_loop import (
    SearchSpec,
    _decide_watch_action,
    run_mdit_autoresearch_loop,
)


class MDITAutoresearchLoopTest(unittest.TestCase):
    def test_resume_skips_existing_baseline_and_candidates(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            records_dir = repo_root / "autoresearch_records" / "logs"
            records_dir.mkdir(parents=True, exist_ok=True)
            config_path = repo_root / "configs" / "mdit.json"
            config_path.parent.mkdir(parents=True, exist_ok=True)
            config_path.write_text("{}", encoding="utf-8")

            summary_path = repo_root / "autoresearch_records" / "mdit_autoresearch_loop_resume.json"
            summary_path.write_text(
                json.dumps(
                    {
                        "tag": "resume",
                        "started_at": "2026-04-10 00:00:00",
                        "config_path": str(config_path),
                        "baseline": {
                            "experiment_name": "mdit_faithful_baseline_100",
                            "stage_epochs": 100,
                            "eval_episodes": 20,
                            "trial_score": -1.0,
                        },
                        "candidates": [
                            {
                                "experiment_name": "cam_front_wrist_100",
                                "stage_epochs": 100,
                                "eval_episodes": 20,
                                "trial_score": -1.0,
                                "success_20": 0.35,
                                "overrides": {"camera_names": ["front", "wrist"]},
                            }
                        ],
                        "promoted": [],
                        "deep_runs": [],
                        "winner": None,
                    },
                    indent=2,
                ),
                encoding="utf-8",
            )

            specs = (
                SearchSpec(
                    name="cam_front_wrist_100",
                    stage_epochs=100,
                    eval_episodes=20,
                    description="existing result",
                    overrides={"camera_names": ["front", "wrist"]},
                ),
                SearchSpec(
                    name="obs3_100",
                    stage_epochs=100,
                    eval_episodes=20,
                    description="new result",
                    overrides={"n_obs_steps": 3},
                ),
            )

            def fake_run_search_spec(spec: SearchSpec, **_: object) -> dict[str, object]:
                return {
                    "experiment_name": spec.name,
                    "stage_epochs": spec.stage_epochs,
                    "eval_episodes": spec.eval_episodes,
                    "trial_score": 0.5,
                    "success_20": 0.5,
                    "overrides": dict(spec.overrides),
                }

            with mock.patch("research.mdit_autoresearch_loop.PROJECT_ROOT", repo_root), \
                mock.patch("research.mdit_autoresearch_loop.DEFAULT_CANDIDATES", specs), \
                mock.patch("research.mdit_autoresearch_loop.run_search_spec", side_effect=fake_run_search_spec) as mocked_run, \
                mock.patch("research.mdit_autoresearch_loop._choose_top_specs", return_value=[]):
                result = run_mdit_autoresearch_loop(
                    tag="resume",
                    config_path=config_path,
                    device=None,
                    headless=True,
                    show_progress=False,
                    cleanup_failed=True,
                    audit_timeout_sec=60,
                    ckpt_root=None,
                    data_root=None,
                )

            self.assertEqual(mocked_run.call_count, 1)
            self.assertEqual(mocked_run.call_args.args[0].name, "obs3_100")
            self.assertEqual(result["baseline"]["experiment_name"], "mdit_faithful_baseline_100")
            self.assertEqual(len(result["candidates"]), 2)
            self.assertEqual(result["candidates"][0]["experiment_name"], "cam_front_wrist_100")
            self.assertEqual(result["candidates"][1]["experiment_name"], "obs3_100")

    def test_resume_can_reuse_trial_record_even_if_summary_is_missing_it(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            records_dir = repo_root / "autoresearch_records"
            (records_dir / "logs").mkdir(parents=True, exist_ok=True)
            config_path = repo_root / "configs" / "mdit.json"
            config_path.parent.mkdir(parents=True, exist_ok=True)
            config_path.write_text("{}", encoding="utf-8")

            summary_path = records_dir / "mdit_autoresearch_loop_resume.json"
            summary_path.write_text(
                json.dumps(
                    {
                        "tag": "resume",
                        "started_at": "2026-04-10 00:00:00",
                        "config_path": str(config_path),
                        "baseline": {
                            "experiment_name": "mdit_faithful_baseline_100",
                            "stage_epochs": 100,
                            "eval_episodes": 20,
                            "trial_score": -1.0,
                        },
                        "candidates": [],
                        "promoted": [],
                        "deep_runs": [],
                        "winner": None,
                    },
                    indent=2,
                ),
                encoding="utf-8",
            )
            (records_dir / "trial_cam.json").write_text(
                json.dumps(
                    {
                        "line": "mdit",
                        "experiment_name": "cam_all5_100",
                        "stage_epochs": None,
                        "eval_episodes": None,
                        "trial_score": -1.0,
                        "success_20": 0.0,
                        "overrides": {
                            "camera_names": ["front", "left_shoulder", "right_shoulder", "wrist", "overhead"]
                        },
                    },
                    indent=2,
                ),
                encoding="utf-8",
            )

            specs = (
                SearchSpec(
                    name="cam_all5_100",
                    stage_epochs=100,
                    eval_episodes=20,
                    description="existing record",
                    overrides={"camera_names": ["front", "left_shoulder", "right_shoulder", "wrist", "overhead"]},
                ),
            )

            with mock.patch("research.mdit_autoresearch_loop.PROJECT_ROOT", repo_root), \
                mock.patch("research.mdit_autoresearch_loop.DEFAULT_CANDIDATES", specs), \
                mock.patch("research.mdit_autoresearch_loop.run_search_spec") as mocked_run, \
                mock.patch("research.mdit_autoresearch_loop._choose_top_specs", return_value=[]):
                result = run_mdit_autoresearch_loop(
                    tag="resume",
                    config_path=config_path,
                    device=None,
                    headless=True,
                    show_progress=False,
                    cleanup_failed=True,
                    audit_timeout_sec=60,
                    ckpt_root=None,
                    data_root=None,
                )

            mocked_run.assert_not_called()
            self.assertEqual(len(result["candidates"]), 1)
            self.assertEqual(result["candidates"][0]["experiment_name"], "cam_all5_100")

    def test_watch_switches_after_bad_epoch_100(self) -> None:
        decision = _decide_watch_action(
            records=[
                {
                    "run_name": "cam5",
                    "epoch": 100,
                    "episodes": 20,
                    "kind": "periodic",
                    "status": "ok",
                    "success_rate": 0.20,
                    "mean_steps": 180.0,
                }
            ],
            run_name="cam5",
            prior_state="continue",
            max_steps=200,
        )

        self.assertEqual(decision["decision_state"], "switch")
        self.assertIn("0.45", decision["decision_reason"])

    def test_watch_investigates_midrange_epoch_100(self) -> None:
        decision = _decide_watch_action(
            records=[
                {
                    "run_name": "cam5",
                    "epoch": 100,
                    "episodes": 20,
                    "kind": "periodic",
                    "status": "ok",
                    "success_rate": 0.48,
                    "mean_steps": 170.0,
                }
            ],
            run_name="cam5",
            prior_state="continue",
            max_steps=200,
        )

        self.assertEqual(decision["decision_state"], "investigate")
        self.assertIn("epoch 100", decision["decision_reason"])

    def test_watch_switches_after_second_success_drop(self) -> None:
        decision = _decide_watch_action(
            records=[
                {
                    "run_name": "cam5",
                    "epoch": 100,
                    "episodes": 20,
                    "kind": "periodic",
                    "status": "ok",
                    "success_rate": 0.46,
                    "mean_steps": 150.0,
                },
                {
                    "run_name": "cam5",
                    "epoch": 200,
                    "episodes": 20,
                    "kind": "periodic",
                    "status": "ok",
                    "success_rate": 0.38,
                    "mean_steps": 170.0,
                },
            ],
            run_name="cam5",
            prior_state="investigate",
            max_steps=200,
        )

        self.assertEqual(decision["decision_state"], "switch")
        self.assertIn("dropped twice", decision["decision_reason"])


if __name__ == "__main__":
    unittest.main()
