from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import torch

import _bootstrap  # noqa: F401
from mdit.config import ExperimentConfig, config_to_dict, save_config


class PrepareMDITResumeRunTest(unittest.TestCase):
    def test_prepare_resume_run_clears_wandb_and_builds_target_latest(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            root = Path(tmp_dir)
            data_root = root / "data" / "unplug_charger"
            (data_root / "train").mkdir(parents=True, exist_ok=True)
            (data_root / "valid").mkdir(parents=True, exist_ok=True)

            source_cfg = ExperimentConfig(
                run_name="unplug_source_100",
                task_name="unplug_charger",
                train_data_path=data_root / "train",
                valid_data_path=data_root / "valid",
                ckpt_root=root / "ckpt",
                train_epochs=100,
                checkpoint_every_epochs=50,
                wandb_resume=False,
            )
            source_run_dir = source_cfg.ckpt_dir
            source_run_dir.mkdir(parents=True, exist_ok=True)
            source_cfg.periodic_ckpt_dir.mkdir(parents=True, exist_ok=True)
            save_config(source_cfg, source_run_dir / "config.json")

            payload = {
                "cfg": config_to_dict(source_cfg),
                "effective_task_text": source_cfg.effective_task_text,
                "eval_contract": {"task_name": "unplug_charger"},
                "recipe_contract": {"task_name": "unplug_charger"},
                "strategy": "fm",
                "model_state_dict": {},
                "ema_state_dict": {},
                "optimizer_state_dict": {"state": {}, "param_groups": []},
                "scheduler_state_dict": {},
                "scaler_state_dict": {},
                "completed_epoch": 99,
                "global_step": 8300,
                "best_metric": 0.123,
                "best_epoch": 99,
                "best_success_rate": 0.55,
                "best_success_epoch": 99,
                "train_loss_history": [0.2],
                "valid_loss_history": [0.1],
                "epoch_summaries": [{"epoch": 99, "train": {"loss_total": 0.2}, "valid": {"loss_total": 0.1}}],
                "wandb_run_id": "old-wandb-run",
            }
            torch.save(payload, source_run_dir / "epochs" / "epoch_0100.pt")
            torch.save(payload, source_run_dir / "best_valid.pt")
            torch.save(payload, source_run_dir / "best_success.pt")
            (source_run_dir / "audit_report.json").write_text("{}", encoding="utf-8")

            script_path = (
                Path(__file__).resolve().parents[1]
                / "scripts"
                / "prepare_mdit_resume_run.py"
            )
            target_run_name = "unplug_source_500_resume"
            result = subprocess.run(
                [
                    sys.executable,
                    str(script_path),
                    "--source-run-dir",
                    str(source_run_dir),
                    "--source-epoch",
                    "100",
                    "--target-run-name",
                    target_run_name,
                    "--target-train-epochs",
                    "500",
                    "--checkpoint-every",
                    "100",
                    "--success-every",
                    "100",
                    "--success-episodes",
                    "20",
                    "--target-success-rate",
                    "0.75",
                ],
                check=True,
                capture_output=True,
                text=True,
            )

            output = json.loads(result.stdout)
            target_run_dir = Path(output["target_run_dir"])
            self.assertTrue(target_run_dir.exists())

            target_cfg = json.loads((target_run_dir / "config.json").read_text(encoding="utf-8"))
            self.assertEqual(target_cfg["run_name"], target_run_name)
            self.assertEqual(target_cfg["train_epochs"], 500)
            self.assertEqual(target_cfg["checkpoint_every_epochs"], 100)
            self.assertEqual(target_cfg["success_selection_every_epochs"], 100)
            self.assertEqual(target_cfg["success_selection_episodes"], 20)
            self.assertTrue(target_cfg["stop_on_target_success"])
            self.assertEqual(target_cfg["target_success_rate"], 0.75)
            self.assertTrue(target_cfg["wandb_resume"])
            self.assertTrue(target_cfg["resume_from_latest"])

            latest_payload = torch.load(target_run_dir / "latest.pt", map_location="cpu")
            self.assertEqual(latest_payload["completed_epoch"], 99)
            self.assertEqual(latest_payload["cfg"]["run_name"], target_run_name)
            self.assertIsNone(latest_payload["wandb_run_id"])

            self.assertTrue((target_run_dir / "epochs" / "epoch_0100.pt").exists())
            self.assertTrue((target_run_dir / "best_valid.pt").exists())
            self.assertTrue((target_run_dir / "best_success.pt").exists())


if __name__ == "__main__":
    unittest.main()
