from __future__ import annotations

import json
import tempfile
from pathlib import Path
import unittest
from unittest import mock

import torch

import _bootstrap  # noqa: F401
from autodl_unplug_charger_transformer_fm.config import ExperimentConfig
from autodl_unplug_charger_transformer_fm.research.trial_runner import (
    TrialRequest,
    _compute_collapse,
    _estimate_audit_timeout_sec,
    finalize_autoresearch_trial,
    run_autoresearch_trial,
    train_autoresearch_trial,
)


def _write_fake_checkpoint(
    path: Path,
    *,
    completed_epoch: int,
    train_loss: float,
    valid_loss: float,
) -> None:
    epoch_summaries = []
    for epoch in range(completed_epoch + 1):
        epoch_summaries.append(
            {
                "epoch": epoch,
                "train": {"loss_total": float(train_loss + epoch * 0.01)},
                "valid": {"loss_total": float(valid_loss + epoch * 0.02)},
                "sample": {"train_action_mse_error": float(0.5 - epoch * 0.05)},
            }
        )
    torch.save(
        {
            "completed_epoch": completed_epoch,
            "best_metric": float(valid_loss),
            "best_epoch": completed_epoch,
            "best_success_rate": None,
            "best_success_epoch": None,
            "train_loss_history": [row["train"]["loss_total"] for row in epoch_summaries],
            "valid_loss_history": [row["valid"]["loss_total"] for row in epoch_summaries],
            "epoch_summaries": epoch_summaries,
        },
        path,
    )


class TrialRunnerTest(unittest.TestCase):
    def test_estimate_audit_timeout_scales_with_checkpoint_count(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            run_dir = Path(tmp_dir)
            epochs_dir = run_dir / "epochs"
            epochs_dir.mkdir(parents=True)
            for idx in (100, 200, 300, 400, 500):
                (epochs_dir / f"epoch_{idx:04d}.pt").write_bytes(b"pt")
            timeout_sec = _estimate_audit_timeout_sec(
                run_dir=run_dir,
                stage_epochs=500,
                checkpoint_every=100,
                requested_timeout_sec=1800,
            )
            self.assertEqual(timeout_sec, 4800)

    def test_compute_collapse_detects_drop_and_threshold_failure(self) -> None:
        records = [
            {"epoch": 100, "success_rate": 0.60},
            {"epoch": 200, "success_rate": 0.78},
            {"epoch": 300, "success_rate": 0.64},
        ]
        collapsed, reasons, checks = _compute_collapse(
            records,
            stage_epochs=300,
            thresholds={100: 0.55, 300: 0.65},
            tolerance=0.10,
        )
        self.assertTrue(collapsed)
        self.assertTrue(any("below threshold" in reason for reason in reasons))
        self.assertTrue(any(check["type"] == "drop_from_best" and not check["passed"] for check in checks))

    def test_run_autoresearch_trial_smoke_flow(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "configs").mkdir(parents=True)
            (repo_root / "data" / "unplug_charger" / "train").mkdir(parents=True)
            (repo_root / "data" / "unplug_charger" / "valid").mkdir(parents=True)
            config_path = repo_root / "configs" / "trial.json"
            config_path.write_text("{}", encoding="utf-8")

            ckpt_root = repo_root / "ckpt"
            cfg = ExperimentConfig(
                train_data_path=repo_root / "data" / "unplug_charger" / "train",
                valid_data_path=repo_root / "data" / "unplug_charger" / "valid",
                ckpt_root=ckpt_root,
                train_epochs=2,
                checkpoint_every_epochs=1,
                wandb_enable=False,
            )

            def fake_load_config(_path: Path) -> ExperimentConfig:
                return ExperimentConfig(**cfg.__dict__)

            def fake_train_experiment(local_cfg: ExperimentConfig, strategy: str = "fm") -> dict[str, object]:
                run_dir = local_cfg.ckpt_dir
                epochs_dir = run_dir / "epochs"
                epochs_dir.mkdir(parents=True, exist_ok=True)
                (run_dir / "config.json").write_text("{}", encoding="utf-8")
                (run_dir / "summary.json").write_text('{"ok": true}\n', encoding="utf-8")
                _write_fake_checkpoint(run_dir / "latest.pt", completed_epoch=1, train_loss=0.10, valid_loss=0.20)
                _write_fake_checkpoint(run_dir / "best_valid.pt", completed_epoch=1, train_loss=0.10, valid_loss=0.20)
                _write_fake_checkpoint(epochs_dir / "epoch_0001.pt", completed_epoch=0, train_loss=0.30, valid_loss=0.40)
                _write_fake_checkpoint(epochs_dir / "epoch_0002.pt", completed_epoch=1, train_loss=0.10, valid_loss=0.20)
                return {"run_name": local_cfg.run_name, "run_dir": str(run_dir)}

            def fake_run_checkpoint_audit(**kwargs) -> Path:
                run_dir = kwargs["run_dir"]
                results_path = run_dir / "audit_raw_results.json"
                payload = {
                    "epoch1": {
                        "label": "epoch_0001",
                        "kind": "periodic",
                        "path": str((run_dir / "epochs" / "epoch_0001.pt").resolve()),
                        "epoch": 1,
                        "success_rate": 0.50,
                        "mean_steps": 20.0,
                        "num_successes": 1,
                        "num_episodes": 2,
                    },
                    "epoch2": {
                        "label": "epoch_0002",
                        "kind": "periodic",
                        "path": str((run_dir / "epochs" / "epoch_0002.pt").resolve()),
                        "epoch": 2,
                        "success_rate": 0.80,
                        "mean_steps": 10.0,
                        "num_successes": 2,
                        "num_episodes": 2,
                    },
                }
                results_path.write_text(json.dumps(payload), encoding="utf-8")
                (run_dir / "audit_success_rate.png").write_bytes(b"png")
                return results_path

            with mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.PROJECT_ROOT", repo_root), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.load_config", side_effect=fake_load_config), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.train_experiment", side_effect=fake_train_experiment), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner._run_checkpoint_audit", side_effect=fake_run_checkpoint_audit):
                result = run_autoresearch_trial(
                    TrialRequest(
                        config_path=config_path,
                        stage_epochs=2,
                        checkpoint_every=1,
                        eval_episodes=2,
                        cleanup_failed=False,
                        experiment_name="smoke",
                    )
                )

            run_dir = Path(result["run_dir"])
            self.assertEqual(result["trial_score"], 0.8)
            self.assertFalse(result["collapse_detected"])
            self.assertTrue((run_dir / "audit_report.json").exists())
            self.assertTrue((run_dir / "best_success.pt").exists())
            self.assertTrue((repo_root / "autoresearch_records").exists())
            self.assertTrue((repo_root / "results.tsv").exists())

    def test_train_only_then_audit_only_flow(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "configs").mkdir(parents=True)
            (repo_root / "data" / "unplug_charger" / "train").mkdir(parents=True)
            (repo_root / "data" / "unplug_charger" / "valid").mkdir(parents=True)
            config_path = repo_root / "configs" / "trial.json"
            config_path.write_text("{}", encoding="utf-8")
            cfg = ExperimentConfig(
                train_data_path=repo_root / "data" / "unplug_charger" / "train",
                valid_data_path=repo_root / "data" / "unplug_charger" / "valid",
                ckpt_root=repo_root / "ckpt",
                train_epochs=2,
                checkpoint_every_epochs=1,
                wandb_enable=False,
            )

            def fake_load_config(_path: Path) -> ExperimentConfig:
                return ExperimentConfig(**cfg.__dict__)

            def fake_train_experiment(local_cfg: ExperimentConfig, strategy: str = "fm") -> dict[str, object]:
                run_dir = local_cfg.ckpt_dir
                epochs_dir = run_dir / "epochs"
                epochs_dir.mkdir(parents=True, exist_ok=True)
                (run_dir / "config.json").write_text("{}", encoding="utf-8")
                (run_dir / "summary.json").write_text('{"ok": true}\n', encoding="utf-8")
                _write_fake_checkpoint(run_dir / "latest.pt", completed_epoch=1, train_loss=0.10, valid_loss=0.20)
                _write_fake_checkpoint(run_dir / "best_valid.pt", completed_epoch=1, train_loss=0.10, valid_loss=0.20)
                _write_fake_checkpoint(epochs_dir / "epoch_0001.pt", completed_epoch=0, train_loss=0.10, valid_loss=0.20)
                _write_fake_checkpoint(epochs_dir / "epoch_0002.pt", completed_epoch=1, train_loss=0.05, valid_loss=0.10)
                return {"run_name": local_cfg.run_name, "run_dir": str(run_dir)}

            def fake_run_checkpoint_audit(**kwargs) -> Path:
                run_dir = kwargs["run_dir"]
                results_path = run_dir / "audit_raw_results.json"
                payload = {
                    "epoch1": {
                        "label": "epoch_0001",
                        "kind": "periodic",
                        "path": str((run_dir / "epochs" / "epoch_0001.pt").resolve()),
                        "epoch": 1,
                        "success_rate": 0.50,
                        "mean_steps": 20.0,
                        "num_successes": 1,
                        "num_episodes": 2,
                    },
                    "epoch2": {
                        "label": "epoch_0002",
                        "kind": "periodic",
                        "path": str((run_dir / "epochs" / "epoch_0002.pt").resolve()),
                        "epoch": 2,
                        "success_rate": 0.80,
                        "mean_steps": 10.0,
                        "num_successes": 2,
                        "num_episodes": 2,
                    },
                }
                results_path.write_text(json.dumps(payload), encoding="utf-8")
                return results_path

            with mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.PROJECT_ROOT", repo_root), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.load_config", side_effect=fake_load_config), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.train_experiment", side_effect=fake_train_experiment), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner._run_checkpoint_audit", side_effect=fake_run_checkpoint_audit):
                train_result = train_autoresearch_trial(
                    TrialRequest(
                        config_path=config_path,
                        stage_epochs=2,
                        checkpoint_every=1,
                        eval_episodes=2,
                        cleanup_failed=False,
                        experiment_name="two_phase",
                    )
                )
                audit_result = finalize_autoresearch_trial(Path(train_result["run_dir"]))

            run_dir = Path(train_result["run_dir"])
            self.assertTrue(train_result["pending_offline_audit"])
            self.assertTrue((run_dir / "trial_request.json").exists())
            self.assertFalse((run_dir / "latest.pt").exists())
            self.assertEqual(audit_result["trial_score"], 0.8)
            self.assertFalse(audit_result["pending_offline_audit"])
            self.assertTrue((run_dir / "audit_report.json").exists())
            self.assertTrue((run_dir / "best_success.pt").exists())

    def test_audit_keeps_special_best_success_but_scores_stage_with_periodic(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "configs").mkdir(parents=True)
            (repo_root / "data" / "unplug_charger" / "train").mkdir(parents=True)
            (repo_root / "data" / "unplug_charger" / "valid").mkdir(parents=True)
            config_path = repo_root / "configs" / "trial.json"
            config_path.write_text("{}", encoding="utf-8")
            cfg = ExperimentConfig(
                train_data_path=repo_root / "data" / "unplug_charger" / "train",
                valid_data_path=repo_root / "data" / "unplug_charger" / "valid",
                ckpt_root=repo_root / "ckpt",
                train_epochs=2,
                checkpoint_every_epochs=1,
                wandb_enable=False,
            )

            def fake_load_config(_path: Path) -> ExperimentConfig:
                return ExperimentConfig(**cfg.__dict__)

            def fake_train_experiment(local_cfg: ExperimentConfig, strategy: str = "fm") -> dict[str, object]:
                run_dir = local_cfg.ckpt_dir
                epochs_dir = run_dir / "epochs"
                epochs_dir.mkdir(parents=True, exist_ok=True)
                (run_dir / "config.json").write_text("{}", encoding="utf-8")
                (run_dir / "summary.json").write_text('{"ok": true}\n', encoding="utf-8")
                _write_fake_checkpoint(run_dir / "latest.pt", completed_epoch=1, train_loss=0.10, valid_loss=0.20)
                _write_fake_checkpoint(run_dir / "best_valid.pt", completed_epoch=0, train_loss=0.20, valid_loss=0.15)
                _write_fake_checkpoint(epochs_dir / "epoch_0001.pt", completed_epoch=0, train_loss=0.30, valid_loss=0.40)
                _write_fake_checkpoint(epochs_dir / "epoch_0002.pt", completed_epoch=1, train_loss=0.10, valid_loss=0.20)
                return {"run_name": local_cfg.run_name, "run_dir": str(run_dir)}

            def fake_run_checkpoint_audit(**kwargs) -> Path:
                run_dir = kwargs["run_dir"]
                results_path = run_dir / "audit_raw_results.json"
                payload = {
                    "epoch1": {
                        "label": "epoch_0001",
                        "kind": "periodic",
                        "path": str((run_dir / "epochs" / "epoch_0001.pt").resolve()),
                        "epoch": 1,
                        "success_rate": 0.50,
                        "mean_steps": 20.0,
                        "num_successes": 1,
                        "num_episodes": 2,
                    },
                    "epoch2": {
                        "label": "epoch_0002",
                        "kind": "periodic",
                        "path": str((run_dir / "epochs" / "epoch_0002.pt").resolve()),
                        "epoch": 2,
                        "success_rate": 0.80,
                        "mean_steps": 10.0,
                        "num_successes": 2,
                        "num_episodes": 2,
                    },
                    "best_valid": {
                        "label": "best_valid",
                        "kind": "special",
                        "path": str((run_dir / "best_valid.pt").resolve()),
                        "epoch": 1,
                        "success_rate": 0.95,
                        "mean_steps": 8.0,
                        "num_successes": 2,
                        "num_episodes": 2,
                    },
                }
                results_path.write_text(json.dumps(payload), encoding="utf-8")
                return results_path

            with mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.PROJECT_ROOT", repo_root), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.load_config", side_effect=fake_load_config), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.train_experiment", side_effect=fake_train_experiment), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner._run_checkpoint_audit", side_effect=fake_run_checkpoint_audit):
                train_result = train_autoresearch_trial(
                    TrialRequest(
                        config_path=config_path,
                        stage_epochs=2,
                        checkpoint_every=1,
                        eval_episodes=2,
                        cleanup_failed=False,
                        experiment_name="special_best",
                    )
                )
                audit_result = finalize_autoresearch_trial(Path(train_result["run_dir"]))

            run_dir = Path(train_result["run_dir"])
            self.assertEqual(audit_result["trial_score"], 0.8)
            self.assertEqual(audit_result["success_100"], None)
            self.assertTrue((run_dir / "best_success.pt").exists())
            report = json.loads((run_dir / "audit_report.json").read_text(encoding="utf-8"))
            self.assertEqual(report["best_success_rate"], 0.95)
            self.assertEqual(Path(report["best_success_ckpt_path"]).name, "best_success.pt")

    def test_audit_only_cli_style_overrides_do_not_clobber_stage_epochs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            run_dir = repo_root / "ckpt" / "demo_run"
            epochs_dir = run_dir / "epochs"
            epochs_dir.mkdir(parents=True)
            (run_dir / "config.json").write_text("{}", encoding="utf-8")
            (run_dir / "summary.json").write_text('{"ok": true}\n', encoding="utf-8")
            (run_dir / "trial_request.json").write_text(
                json.dumps(
                    {
                        "config_path": str(repo_root / "configs" / "trial.json"),
                        "stage_epochs": 100,
                        "checkpoint_every": 100,
                        "experiment_name": "baseline_100",
                        "description": "baseline",
                    }
                ),
                encoding="utf-8",
            )
            _write_fake_checkpoint(epochs_dir / "epoch_0100.pt", completed_epoch=99, train_loss=0.1, valid_loss=0.2)

            cfg = ExperimentConfig(
                train_data_path=repo_root / "data" / "unplug_charger" / "train",
                valid_data_path=repo_root / "data" / "unplug_charger" / "valid",
                ckpt_root=repo_root / "ckpt",
                train_epochs=100,
                checkpoint_every_epochs=100,
                wandb_enable=False,
            )

            def fake_load_config(_path: Path) -> ExperimentConfig:
                local_cfg = ExperimentConfig(**cfg.__dict__)
                local_cfg.run_name = run_dir.name
                return local_cfg

            def fake_run_checkpoint_audit(**kwargs) -> Path:
                results_path = run_dir / "audit_raw_results.json"
                payload = {
                    "epoch100": {
                        "label": "epoch_0100",
                        "kind": "periodic",
                        "path": str((epochs_dir / "epoch_0100.pt").resolve()),
                        "epoch": 100,
                        "success_rate": 0.90,
                        "mean_steps": 80.0,
                        "num_successes": 18,
                        "num_episodes": 20,
                    }
                }
                results_path.write_text(json.dumps(payload), encoding="utf-8")
                return results_path

            with mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.PROJECT_ROOT", repo_root), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.load_config", side_effect=fake_load_config), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner._run_checkpoint_audit", side_effect=fake_run_checkpoint_audit):
                audit_result = finalize_autoresearch_trial(
                    run_dir,
                    request_overrides=TrialRequest(config_path=repo_root / "configs" / "trial.json"),
                )

            self.assertEqual(audit_result["success_100"], 0.9)
            self.assertFalse(audit_result["collapse_detected"])

    def test_run_autoresearch_trial_returns_retryable_result_on_audit_failure(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            (repo_root / "data" / "unplug_charger" / "train").mkdir(parents=True)
            (repo_root / "data" / "unplug_charger" / "valid").mkdir(parents=True)
            cfg = ExperimentConfig(
                train_data_path=repo_root / "data" / "unplug_charger" / "train",
                valid_data_path=repo_root / "data" / "unplug_charger" / "valid",
                ckpt_root=repo_root / "ckpt",
                train_epochs=1,
                checkpoint_every_epochs=1,
                wandb_enable=False,
            )

            def fake_load_config(_path: Path) -> ExperimentConfig:
                return ExperimentConfig(**cfg.__dict__)

            def fake_train_experiment(local_cfg: ExperimentConfig, strategy: str = "fm") -> dict[str, object]:
                run_dir = local_cfg.ckpt_dir
                epochs_dir = run_dir / "epochs"
                epochs_dir.mkdir(parents=True, exist_ok=True)
                (run_dir / "config.json").write_text("{}", encoding="utf-8")
                (run_dir / "summary.json").write_text('{"ok": true}\n', encoding="utf-8")
                _write_fake_checkpoint(run_dir / "latest.pt", completed_epoch=0, train_loss=0.10, valid_loss=0.20)
                _write_fake_checkpoint(run_dir / "best_valid.pt", completed_epoch=0, train_loss=0.10, valid_loss=0.20)
                _write_fake_checkpoint(epochs_dir / "epoch_0001.pt", completed_epoch=0, train_loss=0.10, valid_loss=0.20)
                return {"run_name": local_cfg.run_name, "run_dir": str(run_dir)}

            with mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.PROJECT_ROOT", repo_root), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.load_config", side_effect=fake_load_config), \
                mock.patch("autodl_unplug_charger_transformer_fm.research.trial_runner.train_experiment", side_effect=fake_train_experiment), \
                mock.patch(
                    "autodl_unplug_charger_transformer_fm.research.trial_runner._run_checkpoint_audit",
                    side_effect=RuntimeError("audit timeout"),
                ):
                result = run_autoresearch_trial(
                    TrialRequest(
                        config_path=repo_root / "config.json",
                        stage_epochs=1,
                        checkpoint_every=1,
                        cleanup_failed=True,
                        experiment_name="audit_fail",
                    )
                )

            self.assertEqual(result["trial_score"], -1.0)
            self.assertTrue(result["collapse_detected"])
            self.assertEqual(result["error_type"], "RuntimeError")
            self.assertTrue(result["pending_offline_audit"])
            self.assertTrue(Path(result["run_dir"]).exists())


if __name__ == "__main__":
    unittest.main()
