from __future__ import annotations

import json
import tempfile
from pathlib import Path
import unittest
from unittest import mock

import _bootstrap  # noqa: F401
from research.lelan_autoresearch_loop import SearchSpec, run_lelan_autoresearch_loop


class LeLaNAutoresearchLoopTest(unittest.TestCase):
    def test_resume_skips_existing_summary_and_record_entries(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "autoresearch_records" / "logs").mkdir(parents=True, exist_ok=True)
            config_path = repo_root / "configs" / "lelan.json"
            config_path.parent.mkdir(parents=True, exist_ok=True)
            config_path.write_text("{}", encoding="utf-8")

            summary_path = repo_root / "autoresearch_records" / "lelan_autoresearch_loop_resume.json"
            summary_path.write_text(
                json.dumps(
                    {
                        "tag": "resume",
                        "line": "lelan",
                        "config_path": str(config_path),
                        "screening": [
                            {
                                "experiment_name": "baseline_100",
                                "stage_epochs": 100,
                                "eval_episodes": 20,
                                "trial_score": 0.40,
                                "success_20": 0.40,
                            }
                        ],
                        "promoted_300": [],
                        "deep_runs_500": [],
                        "winner": None,
                    },
                    indent=2,
                ),
                encoding="utf-8",
            )
            (repo_root / "autoresearch_records" / "cand.json").write_text(
                json.dumps(
                    {
                        "line": "lelan",
                        "experiment_name": "candidate_100",
                        "stage_epochs": 100,
                        "eval_episodes": 20,
                        "trial_score": 0.44,
                        "success_20": 0.44,
                    },
                    indent=2,
                ),
                encoding="utf-8",
            )

            specs = (
                SearchSpec("candidate_100", 100, 20, "candidate", {"optimizer_lr": 1e-5}),
            )

            def fake_run(spec: SearchSpec, **_: object) -> dict[str, object]:
                return {
                    "line": "lelan",
                    "experiment_name": spec.name,
                    "stage_epochs": spec.stage_epochs,
                    "eval_episodes": spec.eval_episodes,
                    "trial_score": 0.5,
                    "success_20": 0.5,
                }

            with mock.patch("research.lelan_autoresearch_loop.PROJECT_ROOT", repo_root), \
                mock.patch("research.lelan_autoresearch_loop.DEFAULT_BASELINE", SearchSpec("baseline_100", 100, 20, "baseline", {})), \
                mock.patch("research.lelan_autoresearch_loop.DEFAULT_CANDIDATES", specs), \
                mock.patch("research.lelan_autoresearch_loop._run_search_spec", side_effect=fake_run) as mocked_run:
                result = run_lelan_autoresearch_loop(
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
            self.assertEqual(len(result["screening"]), 2)

    def test_gate_promotes_successful_spec_to_300_and_500(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "autoresearch_records" / "logs").mkdir(parents=True, exist_ok=True)
            config_path = repo_root / "configs" / "lelan.json"
            config_path.parent.mkdir(parents=True, exist_ok=True)
            config_path.write_text("{}", encoding="utf-8")

            baseline = SearchSpec("baseline_100", 100, 20, "baseline", {})

            def fake_run(spec: SearchSpec, **_: object) -> dict[str, object]:
                success = {
                    100: 0.50,
                    300: 0.57,
                    500: 0.62,
                }[spec.stage_epochs]
                return {
                    "line": "lelan",
                    "experiment_name": spec.name,
                    "stage_epochs": spec.stage_epochs,
                    "eval_episodes": spec.eval_episodes,
                    "trial_score": success,
                    "success_20": success,
                    "success_100": success if spec.eval_episodes >= 100 else None,
                }

            with mock.patch("research.lelan_autoresearch_loop.PROJECT_ROOT", repo_root), \
                mock.patch("research.lelan_autoresearch_loop.DEFAULT_BASELINE", baseline), \
                mock.patch("research.lelan_autoresearch_loop.DEFAULT_CANDIDATES", ()), \
                mock.patch("research.lelan_autoresearch_loop._run_search_spec", side_effect=fake_run):
                result = run_lelan_autoresearch_loop(
                    tag="promote",
                    config_path=config_path,
                    device=None,
                    headless=True,
                    show_progress=False,
                    cleanup_failed=True,
                    audit_timeout_sec=60,
                    ckpt_root=None,
                    data_root=None,
                )

            self.assertEqual(len(result["screening"]), 1)
            self.assertEqual(len(result["promoted_300"]), 1)
            self.assertEqual(len(result["deep_runs_500"]), 1)
            self.assertEqual(result["winner"]["stage_epochs"], 500)
            self.assertAlmostEqual(result["winner"]["trial_score"], 0.62)


if __name__ == "__main__":
    unittest.main()
