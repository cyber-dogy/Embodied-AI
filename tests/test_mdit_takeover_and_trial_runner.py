from __future__ import annotations

import json
import tempfile
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest import mock

import torch

import _bootstrap  # noqa: F401
from research.mdit_takeover_controller import _freeze_best_snapshot
from research.mdit_trial_runner import TrialRequest, _write_trial_request, finalize_mdit_autoresearch_trial


def _write_fake_checkpoint(path: Path, *, completed_epoch: int, wandb_run_id: str | None = None) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    epoch_summaries = []
    for epoch in range(completed_epoch + 1):
        epoch_summaries.append(
            {
                "epoch": epoch,
                "train": {"loss_total": 0.2},
                "valid": {
                    "loss_total": 0.1,
                    "loss_xyz": 0.01,
                    "loss_rot6d": 0.02,
                    "loss_grip": 0.03,
                    "mse_xyz": 0.11,
                    "mse_rot6d": 0.12,
                    "mse_grip": 0.13,
                },
                "sample": {"train_action_mse_error": 0.05},
            }
        )
    torch.save(
        {
            "completed_epoch": completed_epoch,
            "best_metric": 0.1,
            "best_epoch": completed_epoch,
            "best_success_rate": None,
            "best_success_epoch": None,
            "train_loss_history": [0.2],
            "valid_loss_history": [0.1],
            "epoch_summaries": epoch_summaries,
            "wandb_run_id": wandb_run_id,
        },
        path,
    )


class MDITTakeoverAndTrialRunnerTest(unittest.TestCase):
    def test_finalize_audit_keeps_run_dir_even_if_collapse_detected(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            run_dir = repo_root / "ckpt" / "collapse_run"
            epochs_dir = run_dir / "epochs"
            epochs_dir.mkdir(parents=True, exist_ok=True)
            (repo_root / "docs" / "mdit").mkdir(parents=True, exist_ok=True)
            (repo_root / "docs" / "fixes.md").write_text("", encoding="utf-8")
            (run_dir / "config.json").write_text("{}", encoding="utf-8")
            (run_dir / "summary.json").write_text('{"ok": true}\n', encoding="utf-8")
            (run_dir / "experiment_manifest.json").write_text(
                json.dumps({"recipe_drift": False, "recipe_drift_details": []}),
                encoding="utf-8",
            )
            (run_dir / "train_heartbeat.json").write_text(
                json.dumps({"status": "completed"}),
                encoding="utf-8",
            )
            _write_fake_checkpoint(run_dir / "latest.pt", completed_epoch=499)
            _write_fake_checkpoint(run_dir / "best_valid.pt", completed_epoch=499)
            _write_fake_checkpoint(epochs_dir / "epoch_0300.pt", completed_epoch=299)
            _write_fake_checkpoint(epochs_dir / "epoch_0500.pt", completed_epoch=499)

            request = TrialRequest(
                config_path=repo_root / "configs" / "mdit.json",
                stage_epochs=500,
                checkpoint_every=100,
                eval_episodes=20,
                cleanup_failed=True,
                experiment_name="collapse_run",
            )
            request.config_path.parent.mkdir(parents=True, exist_ok=True)
            request.config_path.write_text("{}", encoding="utf-8")
            _write_trial_request(run_dir, request)

            results_path = run_dir / "audit_raw_results.json"
            results_path.write_text(
                json.dumps(
                    {
                        "epoch300": {
                            "label": "epoch_0300",
                            "kind": "periodic",
                            "path": str((epochs_dir / "epoch_0300.pt").resolve()),
                            "epoch": 300,
                            "success_rate": 0.75,
                            "mean_steps": 80.0,
                            "num_successes": 15,
                            "num_episodes": 20,
                        },
                        "epoch500": {
                            "label": "epoch_0500",
                            "kind": "periodic",
                            "path": str((epochs_dir / "epoch_0500.pt").resolve()),
                            "epoch": 500,
                            "success_rate": 0.75,
                            "mean_steps": 82.0,
                            "num_successes": 15,
                            "num_episodes": 20,
                        },
                    }
                ),
                encoding="utf-8",
            )

            fake_cfg = SimpleNamespace(
                run_name=run_dir.name,
                device="cpu",
                wandb_enable=False,
                wandb_mode="disabled",
                wandb_project="proj",
                wandb_entity="entity",
                best_ckpt_path=run_dir / "best_valid.pt",
                best_success_ckpt_path=run_dir / "best_success.pt",
                audit_report_path=run_dir / "audit_report.json",
                summary_path=run_dir / "summary.json",
                experiment_manifest_path=run_dir / "experiment_manifest.json",
                train_heartbeat_path=run_dir / "train_heartbeat.json",
            )

            with mock.patch("research.mdit_trial_runner.PROJECT_ROOT", repo_root), mock.patch(
                "research.mdit_trial_runner.load_config",
                return_value=fake_cfg,
            ), mock.patch(
                "research.mdit_trial_runner._run_checkpoint_audit",
                return_value=results_path,
            ):
                result = finalize_mdit_autoresearch_trial(run_dir)

            self.assertTrue(result["collapse_detected"])
            self.assertTrue(run_dir.exists())
            self.assertTrue((run_dir / "latest.pt").exists())
            self.assertTrue((run_dir / "best_success.pt").exists())
            self.assertTrue((run_dir / "epochs" / "epoch_0300.pt").exists())
            self.assertTrue((run_dir / "epochs" / "epoch_0500.pt").exists())

    def test_finalize_audit_logs_success_and_fit_metrics_to_wandb(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            run_dir = repo_root / "ckpt" / "audit_wandb_run"
            epochs_dir = run_dir / "epochs"
            epochs_dir.mkdir(parents=True, exist_ok=True)
            (repo_root / "docs" / "mdit").mkdir(parents=True, exist_ok=True)
            (repo_root / "docs" / "fixes.md").write_text("", encoding="utf-8")
            (run_dir / "config.json").write_text("{}", encoding="utf-8")
            (run_dir / "summary.json").write_text('{"ok": true}\n', encoding="utf-8")
            (run_dir / "experiment_manifest.json").write_text(
                json.dumps({"recipe_drift": False, "recipe_drift_details": []}),
                encoding="utf-8",
            )
            (run_dir / "train_heartbeat.json").write_text(
                json.dumps({"status": "completed"}),
                encoding="utf-8",
            )
            _write_fake_checkpoint(run_dir / "latest.pt", completed_epoch=99, wandb_run_id="wandb-run-123")
            _write_fake_checkpoint(run_dir / "best_valid.pt", completed_epoch=99)
            _write_fake_checkpoint(epochs_dir / "epoch_0100.pt", completed_epoch=99)

            request = TrialRequest(
                config_path=repo_root / "configs" / "mdit.json",
                stage_epochs=100,
                checkpoint_every=100,
                eval_episodes=20,
                cleanup_failed=True,
                experiment_name="audit_wandb_run",
            )
            request.config_path.parent.mkdir(parents=True, exist_ok=True)
            request.config_path.write_text("{}", encoding="utf-8")
            _write_trial_request(run_dir, request)

            results_path = run_dir / "audit_raw_results.json"
            results_path.write_text(
                json.dumps(
                    {
                        "epoch100": {
                            "label": "epoch_0100",
                            "kind": "periodic",
                            "path": str((epochs_dir / "epoch_0100.pt").resolve()),
                            "epoch": 100,
                            "success_rate": 0.60,
                            "mean_steps": 98.0,
                            "num_successes": 12,
                            "num_episodes": 20,
                        },
                    }
                ),
                encoding="utf-8",
            )

            fake_cfg = SimpleNamespace(
                run_name=run_dir.name,
                device="cpu",
                wandb_enable=True,
                wandb_mode="online",
                wandb_project="proj",
                wandb_entity="entity",
                best_ckpt_path=run_dir / "best_valid.pt",
                best_success_ckpt_path=run_dir / "best_success.pt",
                audit_report_path=run_dir / "audit_report.json",
                summary_path=run_dir / "summary.json",
                experiment_manifest_path=run_dir / "experiment_manifest.json",
                train_heartbeat_path=run_dir / "train_heartbeat.json",
            )

            class FakeWandbRun:
                def __init__(self) -> None:
                    self.logged: list[tuple[dict[str, float | int], int | None]] = []
                    self.summary: dict[str, float | int] = {}

                def log(self, payload: dict[str, float | int], step: int | None = None) -> None:
                    self.logged.append((dict(payload), step))

                def finish(self) -> None:
                    return None

            fake_run = FakeWandbRun()
            fake_wandb = SimpleNamespace(init=mock.Mock(return_value=fake_run))

            with mock.patch("research.mdit_trial_runner.PROJECT_ROOT", repo_root), mock.patch(
                "research.mdit_trial_runner.load_config",
                return_value=fake_cfg,
            ), mock.patch(
                "research.mdit_trial_runner._run_checkpoint_audit",
                return_value=results_path,
            ), mock.patch(
                "research.mdit_trial_runner.wandb",
                fake_wandb,
            ):
                result = finalize_mdit_autoresearch_trial(run_dir)

            self.assertEqual(result["success_100"], 0.60)
            fake_wandb.init.assert_called_once()
            self.assertEqual(len(fake_run.logged), 1)
            logged_payload, logged_step = fake_run.logged[0]
            self.assertEqual(logged_step, 0)
            self.assertEqual(logged_payload["audit/valid_loss_rot6d_epoch_0100"], 0.02)
            self.assertEqual(logged_payload["audit/valid_mse_grip_epoch_0100"], 0.13)
            self.assertEqual(logged_payload["audit/success_rate_epoch_0100"], 0.60)
            self.assertEqual(logged_payload["audit/valid_loss_xyz_epoch_0100"], 0.01)
            self.assertEqual(fake_run.summary["audit_best_success_rate"], 0.6)

    def test_freeze_best_snapshot_survives_source_run_deletion(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            repo_root = Path(tmp_dir)
            run_dir = repo_root / "ckpt" / "winner_run"
            epochs_dir = run_dir / "epochs"
            epochs_dir.mkdir(parents=True, exist_ok=True)
            (repo_root / "autoresearch_records" / "logs").mkdir(parents=True, exist_ok=True)
            (run_dir / "config.json").write_text("{}", encoding="utf-8")
            (run_dir / "experiment_manifest.json").write_text("{}", encoding="utf-8")
            (run_dir / "trial_request.json").write_text("{}", encoding="utf-8")
            (run_dir / "summary.json").write_text("{}", encoding="utf-8")
            (run_dir / "audit_report.json").write_text("{}", encoding="utf-8")
            _write_fake_checkpoint(run_dir / "latest.pt", completed_epoch=499)
            _write_fake_checkpoint(run_dir / "best_valid.pt", completed_epoch=499)
            _write_fake_checkpoint(run_dir / "best_success.pt", completed_epoch=299)
            _write_fake_checkpoint(epochs_dir / "epoch_0300.pt", completed_epoch=299)
            _write_fake_checkpoint(epochs_dir / "epoch_0500.pt", completed_epoch=499)

            audit_result = {
                "best_success_rate": 0.75,
                "best_success_epoch": 300,
                "best_ckpt_path": str(run_dir / "best_success.pt"),
                "kept_ckpt_paths": [
                    str(run_dir / "latest.pt"),
                    str(run_dir / "best_valid.pt"),
                    str(run_dir / "epochs" / "epoch_0300.pt"),
                    str(run_dir / "epochs" / "epoch_0500.pt"),
                ],
                "trial_score": -1.0,
                "collapse_detected": True,
            }

            with mock.patch("research.mdit_takeover_controller.PROJECT_ROOT", repo_root):
                freeze_result = _freeze_best_snapshot(
                    run_dir=run_dir,
                    audit_result=audit_result,
                    minimum_score=0.55,
                )

            self.assertIsNotNone(freeze_result)
            snapshot_dir = Path(freeze_result["snapshot_dir"])
            self.assertTrue(snapshot_dir.exists())
            self.assertTrue((snapshot_dir / "best_success.pt").exists())
            self.assertTrue((snapshot_dir / "epochs" / "epoch_0300.pt").exists())

            alias_path = repo_root / "ckpt" / "mdit_best"
            self.assertTrue(alias_path.is_symlink())
            self.assertEqual(alias_path.resolve(), snapshot_dir.resolve())

            # 删除源 run 后，冻结快照仍然要能单独存活。
            for path in sorted(run_dir.rglob("*"), key=lambda item: (item.is_file(), len(item.parts)), reverse=True):
                if path.is_file() or path.is_symlink():
                    path.unlink()
                elif path.is_dir():
                    try:
                        path.rmdir()
                    except OSError:
                        pass
            run_dir.rmdir()

            self.assertTrue((snapshot_dir / "best_success.pt").exists())
            self.assertTrue((snapshot_dir / "epochs" / "epoch_0500.pt").exists())


if __name__ == "__main__":
    unittest.main()
