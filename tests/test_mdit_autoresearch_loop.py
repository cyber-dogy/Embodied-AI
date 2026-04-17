from __future__ import annotations

import json
import tempfile
from pathlib import Path
import unittest
from unittest import mock

import _bootstrap  # noqa: F401
from research.mdit_autoresearch_loop import SearchSpec, run_mdit_autoresearch_loop


class MDITAutoresearchLoopTest(unittest.TestCase):
    def test_resume_skips_existing_results(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "autoresearch_records" / "logs").mkdir(parents=True, exist_ok=True)
            lane_a = repo_root / "configs" / "lane_a.json"
            lane_b = repo_root / "configs" / "lane_b.json"
            lane_a.parent.mkdir(parents=True, exist_ok=True)
            lane_a.write_text("{}", encoding="utf-8")
            lane_b.write_text("{}", encoding="utf-8")

            state_path = repo_root / "autoresearch_records" / "mdit_loop_state__resume.json"
            state_path.write_text(
                json.dumps(
                    {
                        "tag": "resume",
                        "line": "mdit",
                        "screening": [
                            {
                                "line": "mdit",
                                "experiment_name": "lane_a_mainline_100",
                                "stage_epochs": 100,
                                "eval_episodes": 20,
                                "trial_score": 0.61,
                                "success_100": 0.61,
                            },
                            {
                                "line": "mdit",
                                "experiment_name": "lane_a_stabilized_100",
                                "stage_epochs": 100,
                                "eval_episodes": 20,
                                "trial_score": 0.58,
                                "success_100": 0.58,
                            },
                            {
                                "line": "mdit",
                                "experiment_name": "lane_b_faithful_100",
                                "stage_epochs": 100,
                                "eval_episodes": 20,
                                "trial_score": 0.62,
                                "success_100": 0.62,
                            },
                        ],
                        "promoted_300": [],
                        "deep_runs_500": [],
                        "winner": {
                            "line": "mdit",
                            "experiment_name": "previous_winner_500",
                            "stage_epochs": 500,
                            "eval_episodes": 100,
                            "trial_score": 0.9,
                            "confirmed_success_100": 0.9,
                            "run_name": "previous_winner_500",
                            "run_dir": str(repo_root / "ckpt" / "previous_winner_500"),
                            "best_ckpt_path": str(repo_root / "ckpt" / "previous_winner_500" / "best_success.pt"),
                            "audit_report_path": str(repo_root / "ckpt" / "previous_winner_500" / "audit_report.json"),
                            "experiment_manifest_path": str(repo_root / "ckpt" / "previous_winner_500" / "experiment_manifest.json"),
                            "lane": "lane_a_mainline",
                        },
                        "current_candidate": None,
                        "loop_status": "initialized",
                    },
                    indent=2,
                ),
                encoding="utf-8",
            )

            def _fake_config(path: Path):
                return mock.Mock(ckpt_root=repo_root / "ckpt", run_name=f"base_{path.stem}")

            with mock.patch("research.mdit_autoresearch_loop.PROJECT_ROOT", repo_root), \
                mock.patch("research.mdit_autoresearch_loop.load_config", side_effect=_fake_config), \
                mock.patch("research.mdit_autoresearch_loop._run_search_spec") as mocked_run, \
                mock.patch("research.mdit_autoresearch_loop._confirm_candidate", return_value=None), \
                mock.patch("research.mdit_autoresearch_loop._refresh_champion_alias"), \
                mock.patch("research.mdit_autoresearch_loop._write_best_path_doc", return_value=repo_root / "docs" / "mdit" / "best_path.md"), \
                mock.patch("research.mdit_autoresearch_loop._prune_non_winner_runs"):
                result = run_mdit_autoresearch_loop(
                    tag="resume",
                    lane_a_config=lane_a,
                    lane_b_config=lane_b,
                    strategy="fm",
                    device=None,
                    headless=True,
                    show_progress=False,
                    cleanup_failed=True,
                    audit_timeout_sec=60,
                    ckpt_root=None,
                    data_root=None,
                )

            mocked_run.assert_not_called()
            self.assertEqual(len(result["screening"]), 3)
            self.assertIsNotNone(result["winner"])

    def test_gate_promotes_to_300_and_500(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "autoresearch_records" / "logs").mkdir(parents=True, exist_ok=True)
            lane_a = repo_root / "configs" / "lane_a.json"
            lane_b = repo_root / "configs" / "lane_b.json"
            lane_a.parent.mkdir(parents=True, exist_ok=True)
            lane_a.write_text("{}", encoding="utf-8")
            lane_b.write_text("{}", encoding="utf-8")

            def _fake_config(path: Path):
                return mock.Mock(ckpt_root=repo_root / "ckpt", run_name=f"base_{path.stem}")

            def _fake_run(spec: SearchSpec, **_: object) -> dict[str, object]:
                if spec.stage_epochs == 100:
                    if spec.name == "lane_a_mainline_100":
                        stage_score = 0.68
                    elif spec.name == "lane_a_stabilized_100":
                        stage_score = 0.52
                    else:
                        stage_score = 0.54
                elif spec.stage_epochs == 300:
                    stage_score = 0.79
                else:
                    stage_score = 0.84
                run_dir = repo_root / "ckpt" / spec.name
                return {
                    "line": "mdit",
                    "experiment_name": spec.name,
                    "stage_epochs": spec.stage_epochs,
                    "eval_episodes": spec.eval_episodes,
                    "trial_score": stage_score,
                    "success_100": stage_score if spec.stage_epochs == 100 else None,
                    "success_300": stage_score if spec.stage_epochs == 300 else None,
                    "success_500": stage_score if spec.stage_epochs == 500 else None,
                    "run_name": spec.name,
                    "run_dir": str(run_dir),
                    "best_ckpt_path": str(run_dir / "best_success.pt"),
                    "audit_report_path": str(run_dir / "audit_report.json"),
                    "experiment_manifest_path": str(run_dir / "experiment_manifest.json"),
                    "recipe_drift": False,
                    "error_type": None,
                    "lane": spec.lane,
                }

            with mock.patch("research.mdit_autoresearch_loop.PROJECT_ROOT", repo_root), \
                mock.patch("research.mdit_autoresearch_loop.load_config", side_effect=_fake_config), \
                mock.patch("research.mdit_autoresearch_loop._run_search_spec", side_effect=_fake_run), \
                mock.patch(
                    "research.mdit_autoresearch_loop._confirm_candidate",
                    return_value={"success_rate": 0.86, "eval_manifest_path": str(repo_root / "confirm.json")},
                ), \
                mock.patch("research.mdit_autoresearch_loop._refresh_champion_alias"), \
                mock.patch("research.mdit_autoresearch_loop._write_best_path_doc", return_value=repo_root / "docs" / "mdit" / "best_path.md"), \
                mock.patch("research.mdit_autoresearch_loop._prune_non_winner_runs"):
                result = run_mdit_autoresearch_loop(
                    tag="promote",
                    lane_a_config=lane_a,
                    lane_b_config=lane_b,
                    strategy="fm",
                    device=None,
                    headless=True,
                    show_progress=False,
                    cleanup_failed=True,
                    audit_timeout_sec=60,
                    ckpt_root=None,
                    data_root=None,
                )

            self.assertEqual(len(result["screening"]), 3)
            self.assertEqual(len(result["promoted_300"]), 1)
            self.assertEqual(len(result["deep_runs_500"]), 1)
            self.assertAlmostEqual(result["winner"]["confirmed_success_100"], 0.86)

    def test_existing_lane_a_run_is_adopted_before_new_candidates(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "autoresearch_records" / "logs").mkdir(parents=True, exist_ok=True)
            lane_a = repo_root / "configs" / "lane_a.json"
            lane_b = repo_root / "configs" / "lane_b.json"
            lane_a.parent.mkdir(parents=True, exist_ok=True)
            lane_a.write_text("{}", encoding="utf-8")
            lane_b.write_text("{}", encoding="utf-8")
            existing_run_dir = repo_root / "ckpt" / "existing_lane_a"
            existing_run_dir.mkdir(parents=True, exist_ok=True)

            def _fake_config(path: Path):
                return mock.Mock(ckpt_root=repo_root / "ckpt", run_name=f"base_{path.stem}")

            def _fake_run(spec: SearchSpec, **_: object) -> dict[str, object]:
                score = 0.42 if spec.name == "lane_a_stabilized_100" else 0.41
                run_dir = repo_root / "ckpt" / spec.name
                return {
                    "line": "mdit",
                    "experiment_name": spec.name,
                    "stage_epochs": spec.stage_epochs,
                    "eval_episodes": spec.eval_episodes,
                    "trial_score": score,
                    "success_100": score if spec.stage_epochs == 100 else None,
                    "run_name": spec.name,
                    "run_dir": str(run_dir),
                    "best_ckpt_path": str(run_dir / "best_success.pt"),
                    "audit_report_path": str(run_dir / "audit_report.json"),
                    "experiment_manifest_path": str(run_dir / "experiment_manifest.json"),
                    "recipe_drift": False,
                    "error_type": None,
                    "lane": spec.lane,
                }

            adopted_result = {
                "line": "mdit",
                "experiment_name": "lane_a_mainline_100",
                "stage_epochs": 100,
                "eval_episodes": 20,
                "trial_score": 0.63,
                "success_100": 0.63,
                "run_name": "existing_lane_a",
                "run_dir": str(existing_run_dir),
                "best_ckpt_path": str(existing_run_dir / "best_success.pt"),
                "audit_report_path": str(existing_run_dir / "audit_report.json"),
                "experiment_manifest_path": str(existing_run_dir / "experiment_manifest.json"),
                "recipe_drift": False,
                "error_type": None,
                "lane": "lane_a_mainline",
            }

            with mock.patch("research.mdit_autoresearch_loop.PROJECT_ROOT", repo_root), \
                mock.patch("research.mdit_autoresearch_loop.load_config", side_effect=_fake_config), \
                mock.patch("research.mdit_autoresearch_loop._run_existing_lane_a_screening", return_value=adopted_result) as mocked_adopt, \
                mock.patch("research.mdit_autoresearch_loop._run_search_spec", side_effect=_fake_run), \
                mock.patch("research.mdit_autoresearch_loop._confirm_candidate", return_value=None), \
                mock.patch("research.mdit_autoresearch_loop._refresh_champion_alias"), \
                mock.patch("research.mdit_autoresearch_loop._write_best_path_doc", return_value=repo_root / "docs" / "mdit" / "best_path.md"), \
                mock.patch("research.mdit_autoresearch_loop._prune_non_winner_runs"):
                result = run_mdit_autoresearch_loop(
                    tag="adopt",
                    lane_a_config=lane_a,
                    lane_b_config=lane_b,
                    existing_lane_a_run_dir=existing_run_dir,
                    strategy="fm",
                    device=None,
                    headless=True,
                    show_progress=False,
                    cleanup_failed=True,
                    audit_timeout_sec=60,
                    ckpt_root=None,
                    data_root=None,
                )

            mocked_adopt.assert_called_once()
            self.assertEqual(result["screening"][0]["run_name"], "existing_lane_a")
            self.assertEqual(result["screening"][0]["experiment_name"], "lane_a_mainline_100")


if __name__ == "__main__":
    unittest.main()
