from __future__ import annotations

import tempfile
from pathlib import Path
import unittest
from unittest import mock

import torch

import _bootstrap  # noqa: F401
from mdit.config import MDITExperimentConfig
from mdit.model.model import MultiTaskDiTPolicy
from mdit.constants import OBS_IMAGES, OBS_STATE, TASK
from mdit.train.checkpoints import build_checkpoint_payload, load_resume_state, save_checkpoint
from research.mdit_trial_runner import _materialize_best_success_checkpoint, _select_best_success_record


class MDITRuntimeAndTrialRunnerTest(unittest.TestCase):
    def test_lightweight_checkpoint_omits_resume_state(self) -> None:
        cfg = MDITExperimentConfig()
        model = torch.nn.Linear(4, 2)
        optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
        scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda=lambda _: 1.0)
        scaler = torch.cuda.amp.GradScaler(enabled=False)

        payload = build_checkpoint_payload(
            cfg=cfg,
            model=model,
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
            cfg = MDITExperimentConfig(
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
            )

            with self.assertRaisesRegex(ValueError, "lightweight MDIT checkpoint"):
                load_resume_state(cfg, model, optimizer, scheduler, scaler)

    def test_predict_action_selects_configured_camera_subset(self) -> None:
        policy = MultiTaskDiTPolicy.__new__(MultiTaskDiTPolicy)
        policy.config = MDITExperimentConfig(camera_names=("front", "wrist", "overhead"))
        captured: dict[str, object] = {}
        def _select_action(batch):
            captured["batch"] = batch
            return torch.zeros(1, 10)

        policy.select_action = _select_action
        policy.unnormalize_action = lambda action: action

        obs = torch.zeros(5, 4, 4, 3, dtype=torch.uint8)
        for cam_idx, value in enumerate((10, 20, 30, 40, 50)):
            obs[cam_idx].fill_(value)
        robot_state = torch.arange(10, dtype=torch.float32).numpy()

        with mock.patch("mdit.model.model.get_device", return_value=torch.device("cpu")):
            action = policy.predict_action(obs.numpy(), robot_state, task_text="demo")

        self.assertEqual(tuple(action.shape), (10,))
        batch = captured["batch"]
        images = batch[OBS_IMAGES]
        state = batch[OBS_STATE]
        task = batch[TASK]

        self.assertEqual(tuple(images.shape), (1, 3, 3, 4, 4))
        self.assertEqual(tuple(state.shape), (1, 10))
        self.assertEqual(task, ["demo"])
        # RLBench camera order is right, left, overhead, front, wrist.
        selected_values = [float(images[0, idx, 0, 0, 0]) for idx in range(3)]
        self.assertEqual(selected_values, [40.0, 50.0, 30.0])

    def test_select_best_success_prefers_periodic_checkpoint_on_ties(self) -> None:
        periodic = {
            "label": "epoch_0100",
            "kind": "periodic",
            "path": "/tmp/epoch_0100.pt",
            "epoch": 100,
            "success_rate": 0.0,
            "valid_loss_at_epoch": 0.5,
        }
        special = {
            "label": "best_valid",
            "kind": "special",
            "path": "/tmp/best_valid.pt",
            "epoch": None,
            "success_rate": 0.0,
            "valid_loss_at_epoch": 0.1,
        }

        best = _select_best_success_record([special, periodic])

        self.assertEqual(best["kind"], "periodic")
        self.assertEqual(best["epoch"], 100)

    def test_materialize_best_success_checkpoint_handles_special_record_without_epoch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            run_dir = Path(tmp_dir)
            ckpt_path = run_dir / "best_valid.pt"
            torch.save(
                {
                    "completed_epoch": 11,
                    "best_success_rate": None,
                    "best_success_epoch": None,
                },
                ckpt_path,
            )
            out_path = _materialize_best_success_checkpoint(
                run_dir,
                {
                    "path": str(ckpt_path),
                    "success_rate": 0.25,
                    "epoch": None,
                },
            )

            self.assertIsNotNone(out_path)
            payload = torch.load(out_path, map_location="cpu")
            self.assertEqual(payload["best_success_rate"], 0.25)
            self.assertEqual(payload["best_success_epoch"], 11)


if __name__ == "__main__":
    unittest.main()
