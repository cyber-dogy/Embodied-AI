from __future__ import annotations

import json
import tempfile
from pathlib import Path
import unittest

import torch

import _bootstrap  # noqa: F401
from lelan.config import LeLaNExperimentConfig
from lelan.train.checkpoints import build_checkpoint_payload, load_resume_state, save_checkpoint
from research.lelan_trial_runner import (
    LeLaNTrialRequest,
    _materialize_best_success_checkpoint,
    _prepare_cfg,
    _select_best_success_record,
)


class LeLaNRuntimeAndTrialRunnerTest(unittest.TestCase):
    def test_prepare_cfg_disables_rlbench_runtime_when_success_eval_is_off(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            config_path = Path(tmp_dir) / "config.json"
            config_path.write_text(
                json.dumps(
                    {
                        "train_data_path": str(Path(tmp_dir)),
                        "valid_data_path": str(Path(tmp_dir)),
                        "enable_success_rate_eval": True,
                    }
                ),
                encoding="utf-8",
            )
            request = LeLaNTrialRequest(
                config_path=config_path,
                stage_epochs=100,
                checkpoint_every=100,
                eval_episodes=20,
                config_overrides={"enable_success_rate_eval": False},
            )

            cfg = _prepare_cfg(request)

        self.assertFalse(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.checkpoint_every_epochs, 0)
        self.assertEqual(cfg.offline_eval_ckpt_every_epochs, 100)
        self.assertEqual(cfg.success_selection_every_epochs, 0)
        self.assertEqual(cfg.success_selection_episodes, 0)
        self.assertTrue(cfg.save_latest_ckpt)
        self.assertEqual(cfg.checkpoint_payload_mode, "full")

    def test_lightweight_checkpoint_omits_resume_state(self) -> None:
        cfg = LeLaNExperimentConfig()
        model = torch.nn.Linear(4, 2)
        optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
        scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda=lambda _: 1.0)
        scaler = torch.cuda.amp.GradScaler(enabled=False)

        payload = build_checkpoint_payload(
            cfg=cfg,
            model=model,
            ema_model=None,
            optimizer=optimizer,
            scheduler=scheduler,
            scaler=scaler,
            dataset_stats={"action": {"min": [0.0], "max": [1.0]}},
            epoch=3,
            global_step=7,
            best_metric=0.2,
            best_epoch=3,
            best_success_rate=0.4,
            best_success_epoch=3,
            train_loss_history=[1.0, 0.5],
            valid_loss_history=[0.8, 0.4],
            epoch_summaries=[{"epoch": 3, "train": {"loss_total": 0.5}}],
            checkpoint_payload_mode="lightweight",
            wandb_run_id=None,
        )

        self.assertEqual(payload["checkpoint_payload_mode"], "lightweight")
        self.assertIn("epoch_summary", payload)
        self.assertNotIn("optimizer_state_dict", payload)
        self.assertNotIn("scheduler_state_dict", payload)
        self.assertNotIn("scaler_state_dict", payload)
        self.assertNotIn("train_loss_history", payload)
        self.assertNotIn("valid_loss_history", payload)
        self.assertNotIn("epoch_summaries", payload)

    def test_resume_rejects_lightweight_checkpoint(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            cfg = LeLaNExperimentConfig(
                ckpt_root=Path(tmp_dir),
                run_name="lightweight_resume_blocked",
                resume_from_latest=True,
            )
            model = torch.nn.Linear(4, 2)
            optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
            scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda=lambda _: 1.0)
            scaler = torch.cuda.amp.GradScaler(enabled=False)
            save_checkpoint(
                cfg.latest_ckpt_path,
                cfg=cfg,
                model=model,
                ema_model=None,
                optimizer=optimizer,
                scheduler=scheduler,
                scaler=scaler,
                dataset_stats={},
                epoch=0,
                global_step=0,
                best_metric=None,
                best_epoch=None,
                best_success_rate=None,
                best_success_epoch=None,
                train_loss_history=[],
                valid_loss_history=[],
                epoch_summaries=[],
                checkpoint_payload_mode="lightweight",
                wandb_run_id=None,
            )

            with self.assertRaisesRegex(ValueError, "lightweight LeLaN checkpoint"):
                load_resume_state(cfg, model, optimizer, scheduler, scaler)

    def test_full_checkpoint_resume_restores_wandb_run_id_and_histories(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            cfg = LeLaNExperimentConfig(
                ckpt_root=Path(tmp_dir),
                run_name="full_resume_restores_state",
                resume_from_latest=True,
            )
            model = torch.nn.Linear(4, 2)
            optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
            scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda=lambda _: 1.0)
            scaler = torch.cuda.amp.GradScaler(enabled=False)
            save_checkpoint(
                cfg.latest_ckpt_path,
                cfg=cfg,
                model=model,
                ema_model=None,
                optimizer=optimizer,
                scheduler=scheduler,
                scaler=scaler,
                dataset_stats={"action": {"min": [0.0], "max": [1.0]}},
                epoch=4,
                global_step=11,
                best_metric=0.2,
                best_epoch=3,
                best_success_rate=0.35,
                best_success_epoch=4,
                train_loss_history=[1.0, 0.5, 0.25],
                valid_loss_history=[0.8, 0.4, 0.3],
                epoch_summaries=[{"epoch": 4, "train": {"loss_total": 0.25}}],
                checkpoint_payload_mode="full",
                wandb_run_id="wandb-resume-id",
                success_eval_history=[{"epoch": 5, "success_rate": 0.35, "num_episodes": 20}],
            )

            restored = load_resume_state(cfg, model, optimizer, scheduler, scaler)

            self.assertTrue(restored["resumed"])
            self.assertEqual(restored["start_epoch"], 5)
            self.assertEqual(restored["global_step"], 11)
            self.assertEqual(restored["best_metric"], 0.2)
            self.assertEqual(restored["best_success_rate"], 0.35)
            self.assertEqual(restored["train_loss_history"], [1.0, 0.5, 0.25])
            self.assertEqual(restored["valid_loss_history"], [0.8, 0.4, 0.3])
            self.assertEqual(restored["epoch_summaries"], [{"epoch": 4, "train": {"loss_total": 0.25}}])
            self.assertEqual(
                restored["success_eval_history"],
                [{"epoch": 5, "success_rate": 0.35, "num_episodes": 20}],
            )
            self.assertEqual(restored["wandb_run_id"], "wandb-resume-id")

    def test_select_best_success_prefers_periodic_checkpoint_on_ties(self) -> None:
        periodic = {
            "label": "epoch_0100",
            "kind": "periodic",
            "path": "/tmp/epoch_0100.pt",
            "epoch": 100,
            "success_rate": 0.55,
            "valid_loss_at_epoch": 0.2,
        }
        special = {
            "label": "best_valid",
            "kind": "special",
            "path": "/tmp/best_valid.pt",
            "epoch": 100,
            "success_rate": 0.55,
            "valid_loss_at_epoch": 0.1,
        }

        best = _select_best_success_record([special, periodic])

        self.assertEqual(best["label"], "epoch_0100")

    def test_materialize_best_success_checkpoint_writes_best_success_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            run_dir = Path(tmp_dir)
            source = run_dir / "epochs" / "epoch_0100.pt"
            source.parent.mkdir(parents=True, exist_ok=True)
            torch.save({"completed_epoch": 99, "model_state_dict": {}}, source)

            path = _materialize_best_success_checkpoint(
                run_dir,
                {"path": str(source), "success_rate": 0.6, "epoch": 100},
            )

            self.assertIsNotNone(path)
            payload = torch.load(path, map_location="cpu")
            self.assertEqual(payload["best_success_rate"], 0.6)
            self.assertEqual(payload["best_success_epoch"], 99)


if __name__ == "__main__":
    unittest.main()
