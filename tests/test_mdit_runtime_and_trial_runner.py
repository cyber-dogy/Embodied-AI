from __future__ import annotations

import tempfile
from pathlib import Path
import subprocess
import unittest
from unittest import mock
import json
import types

import numpy as np
import torch

import _bootstrap  # noqa: F401
from envs.rlbench_env import RLBenchEnv
from mdit.config import FlowMatchingConfig, MDITExperimentConfig
from mdit.model.model import MultiTaskDiTPolicy
from mdit.model.objectives import FlowMatchingObjective
from mdit.constants import ACTION, OBS_IMAGES, OBS_STATE, TASK
from mdit.train.checkpoints import build_checkpoint_payload, load_resume_state, save_checkpoint
from mdit.train.eval import build_rlbench_env_kwargs, run_success_rate_eval_subprocess
from research.mdit_trial_runner import (
    MDITTrialRequest,
    _load_trial_request,
    _resolved_request,
    _materialize_best_success_checkpoint,
    _write_experiment_manifest,
    _prepare_cfg,
    _select_best_success_record,
)


class MDITRuntimeAndTrialRunnerTest(unittest.TestCase):
    def test_build_rlbench_env_kwargs_respects_disable_task_validation_config(self) -> None:
        cfg = MDITExperimentConfig(
            rlbench_disable_task_validation=True,
            eval_step_heartbeat_every=0,
            use_pcd=False,
        )
        env_kwargs = build_rlbench_env_kwargs(cfg, headless=True)

        self.assertIn("disable_task_validation", env_kwargs)
        self.assertTrue(bool(env_kwargs["disable_task_validation"]))
        self.assertEqual(env_kwargs["obs_mode"], "rgb")

    def test_rlbench_env_reset_retries_once_without_task_validation(self) -> None:
        env = RLBenchEnv.__new__(RLBenchEnv)
        env.last_descriptions = []
        env.disable_task_validation = False
        env._task_validation_disabled = False
        task_impl = types.SimpleNamespace(validate=lambda: None)
        reset_calls = {"count": 0}

        def _reset():
            reset_calls["count"] += 1
            if reset_calls["count"] == 1:
                raise RuntimeError("The call failed on the V-REP side. Return value: -1")
            return ["unplug the charger"], None

        env.task = types.SimpleNamespace(reset=_reset, _task=task_impl)

        descriptions = RLBenchEnv.reset(env)

        self.assertEqual(reset_calls["count"], 2)
        self.assertTrue(env._task_validation_disabled)
        self.assertEqual(descriptions, ["unplug the charger"])

    def test_experiment_manifest_marks_recipe_drift_when_locked_fields_are_overridden(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            tmp_path = Path(tmp_dir)
            config_path = tmp_path / "config.json"
            config_path.write_text(
                json.dumps(
                    {
                        "train_data_path": str(tmp_path),
                        "valid_data_path": str(tmp_path),
                        "run_name": "base_run",
                    }
                ),
                encoding="utf-8",
            )
            request = MDITTrialRequest(
                config_path=config_path,
                stage_epochs=100,
                checkpoint_every=100,
                eval_episodes=20,
                ckpt_root=tmp_path / "ckpt",
                config_overrides={
                    "batch_size": 16,
                    "observation_encoder.vision.train_mode": "last_block",
                },
            )

            base_cfg = MDITExperimentConfig(
                train_data_path=tmp_path,
                valid_data_path=tmp_path,
            )
            resolved_cfg = _prepare_cfg(request)
            resolved_request = _resolved_request(request, resolved_cfg)
            run_dir = resolved_cfg.ckpt_dir
            run_dir.mkdir(parents=True, exist_ok=True)

            manifest_path = _write_experiment_manifest(
                run_dir,
                request=request,
                base_cfg=base_cfg,
                resolved_cfg=resolved_cfg,
                resolved_request=resolved_request,
            )
            payload = json.loads(manifest_path.read_text(encoding="utf-8"))

        self.assertTrue(bool(payload.get("recipe_drift")))
        drift_keys = [row["key"] for row in payload.get("recipe_drift_details", [])]
        self.assertIn("batch_size", drift_keys)
        self.assertIn("observation_encoder.vision.train_mode", drift_keys)
        self.assertTrue(
            any("recipe drift detected via overrides" in row for row in payload.get("change_summary", []))
        )

    def test_rlbench_env_treats_vrep_runtime_errors_as_simulator_runtime_errors(self) -> None:
        env = RLBenchEnv.__new__(RLBenchEnv)
        env.log_invalid_action_errors = False
        env.last_obs = types.SimpleNamespace(
            gripper_pose=np.array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0], dtype=np.float32)
        )
        env.last_step_error = None
        call_actions: list[np.ndarray] = []

        def _task_step(action):
            call_actions.append(np.asarray(action, dtype=np.float32))
            if len(call_actions) == 1:
                raise RuntimeError("The call failed on the V-REP side. Return value: -1")
            return None, 0.0, False

        env.task = types.SimpleNamespace(step=_task_step)

        reward, terminate = RLBenchEnv._step_safe(
            env,
            np.array([0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0], dtype=np.float32),
        )

        self.assertEqual(len(call_actions), 1)
        self.assertEqual(reward, 0.0)
        self.assertTrue(terminate)
        self.assertEqual(
            env.last_step_error,
            "simulator runtime error: The call failed on the V-REP side. Return value: -1",
        )

    def test_flow_matching_total_loss_uses_component_weights(self) -> None:
        objective = FlowMatchingObjective(
            FlowMatchingConfig(loss_weights={"xyz": 1.0, "rot6d": 2.0, "grip": 3.0}),
            action_dim=10,
            horizon=4,
        )

        class _ZeroModel(torch.nn.Module):
            def forward(self, x_t, t, conditioning_vec):
                del t, conditioning_vec
                return torch.zeros_like(x_t)

        batch = {
            "action": torch.ones(2, 4, 10, dtype=torch.float32),
        }

        with mock.patch.object(objective, "_sample_timesteps", return_value=torch.zeros(2)), mock.patch(
            "mdit.model.objectives.torch.randn_like",
            return_value=torch.zeros_like(batch["action"]),
        ):
            loss, loss_dict = objective.compute_loss(
                _ZeroModel(),
                batch,
                conditioning_vec=torch.zeros(2, 8),
            )

        expected = loss_dict["loss_xyz"] + 2.0 * loss_dict["loss_rot6d"] + 3.0 * loss_dict["loss_grip"]
        self.assertTrue(torch.allclose(loss, expected))

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
            request = MDITTrialRequest(
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

    def test_prepare_cfg_forces_mainline_online_wandb(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            config_path = Path(tmp_dir) / "config.json"
            config_path.write_text(
                json.dumps(
                    {
                        "train_data_path": str(Path(tmp_dir)),
                        "valid_data_path": str(Path(tmp_dir)),
                        "wandb_enable": False,
                        "wandb_mode": "disabled",
                        "ema_enable": False,
                    }
                ),
                encoding="utf-8",
            )
            request = MDITTrialRequest(config_path=config_path, stage_epochs=100, checkpoint_every=20)

            cfg = _prepare_cfg(request)

        self.assertTrue(cfg.wandb_enable)
        self.assertEqual(cfg.wandb_mode, "online")
        self.assertTrue(cfg.wandb_resume)

    def test_lightweight_checkpoint_omits_resume_state(self) -> None:
        cfg = MDITExperimentConfig()
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
        self.assertNotIn("ema_state_dict", payload)
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

            with self.assertRaisesRegex(ValueError, "lightweight MDIT checkpoint"):
                load_resume_state(cfg, model, optimizer, scheduler, scaler)

    def test_full_checkpoint_resume_restores_wandb_run_id_and_histories(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            cfg = MDITExperimentConfig(
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

    def test_success_eval_subprocess_reads_output_json(self) -> None:
        cfg = MDITExperimentConfig(device="cpu", eval_step_heartbeat_every=17)

        def _fake_run(cmd, cwd, check, capture_output, text, timeout):
            self.assertTrue(check)
            self.assertTrue(capture_output)
            self.assertTrue(text)
            self.assertEqual(timeout, 321)
            self.assertIn("eval_mdit_checkpoint.py", str(cmd[1]))
            self.assertIn("--no-prefer-ema", cmd)
            output_json = Path(cmd[cmd.index("--output-json") + 1])
            output_json.write_text(
                json.dumps(
                    {
                        "success_rate": 0.45,
                        "mean_steps": 12.0,
                        "num_episodes": 20,
                        "episode_records": [],
                    }
                ),
                encoding="utf-8",
            )
            return mock.Mock(stdout="eval summary\n", stderr="", returncode=0)

        with mock.patch("mdit.train.eval.subprocess.run", side_effect=_fake_run):
            result = run_success_rate_eval_subprocess(
                "/tmp/epoch_0100.pt",
                cfg,
                num_episodes=20,
                max_steps=200,
                timeout_sec=321,
                show_progress=False,
            )

        self.assertEqual(result["success_rate"], 0.45)
        self.assertEqual(result["num_episodes"], 20)
        self.assertEqual(result["device_used"], "cpu")
        self.assertFalse(result["cpu_fallback"])

    def test_success_eval_subprocess_retries_on_cpu_after_cuda_oom(self) -> None:
        cfg = MDITExperimentConfig(device="cuda", eval_step_heartbeat_every=17)
        seen_devices: list[str] = []

        def _fake_run(cmd, cwd, check, capture_output, text, timeout):
            del cwd, check, capture_output, text, timeout
            device = cmd[cmd.index("--device") + 1]
            seen_devices.append(device)
            self.assertIn("--no-prefer-ema", cmd)
            if device == "cuda":
                raise subprocess.CalledProcessError(
                    1,
                    cmd,
                    output="torch.cuda.OutOfMemoryError: CUDA out of memory",
                    stderr="",
                )
            output_json = Path(cmd[cmd.index("--output-json") + 1])
            output_json.write_text(
                json.dumps(
                    {
                        "success_rate": 0.55,
                        "mean_steps": 18.0,
                        "num_episodes": 20,
                        "episode_records": [],
                    }
                ),
                encoding="utf-8",
            )
            return mock.Mock(stdout="cpu eval summary\n", stderr="", returncode=0)

        with mock.patch("mdit.train.eval.subprocess.run", side_effect=_fake_run), mock.patch(
            "mdit.train.eval.torch.cuda.is_available",
            return_value=False,
        ):
            result = run_success_rate_eval_subprocess(
                "/tmp/epoch_0100.pt",
                cfg,
                num_episodes=20,
                max_steps=200,
                timeout_sec=321,
                show_progress=False,
            )

        self.assertEqual(seen_devices, ["cuda", "cpu"])
        self.assertEqual(result["success_rate"], 0.55)
        self.assertEqual(result["device_used"], "cpu")
        self.assertTrue(result["cpu_fallback"])
        self.assertEqual(result["initial_device"], "cuda")

    def test_success_eval_subprocess_surfaces_subprocess_failure(self) -> None:
        cfg = MDITExperimentConfig(device="cpu")
        error = subprocess.CalledProcessError(
            139,
            ["python", "eval_mdit_checkpoint.py"],
            output="Error: signal 11\nQMutex: destroying locked mutex\n",
            stderr="",
        )

        with mock.patch("mdit.train.eval.subprocess.run", side_effect=error):
            with self.assertRaisesRegex(RuntimeError, "exit code 139"):
                run_success_rate_eval_subprocess(
                    "/tmp/epoch_0100.pt",
                    cfg,
                    num_episodes=20,
                    max_steps=200,
                    show_progress=False,
                )

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

    def test_generate_action_chunk_uses_first_command_step_when_n_action_steps_is_one(self) -> None:
        policy = MultiTaskDiTPolicy.__new__(MultiTaskDiTPolicy)
        policy.config = MDITExperimentConfig(n_obs_steps=3, n_action_steps=1)
        policy.dataset_stats = {
            OBS_STATE: {
                "min": [0.0] * 10,
                "max": [1.0] * 10,
            }
        }

        class _DummyEncoder:
            def encode(self, batch):
                return torch.zeros(1, 16)

        class _DummyObjective:
            def conditional_sample(self, noise_predictor, batch_size, conditioning_vec):
                del noise_predictor, batch_size, conditioning_vec
                return torch.arange(32 * 10, dtype=torch.float32).reshape(1, 32, 10)

        policy.observation_encoder = _DummyEncoder()
        policy.objective = _DummyObjective()
        policy.noise_predictor = object()

        chunk = policy._generate_action_chunk(
            {
                OBS_STATE: torch.zeros(1, 3, 10),
                OBS_IMAGES: torch.zeros(1, 3, 5, 3, 4, 4),
                TASK: ["demo"],
            }
        )

        self.assertEqual(tuple(chunk.shape), (1, 1, 10))
        self.assertTrue(torch.equal(chunk[0, 0], torch.arange(20, 30, dtype=torch.float32)))

    def test_select_action_replans_each_step_when_n_action_steps_is_one(self) -> None:
        policy = MultiTaskDiTPolicy.__new__(MultiTaskDiTPolicy)
        policy.config = MDITExperimentConfig(n_obs_steps=3, n_action_steps=1)
        policy.reset()
        call_values: list[int] = []

        def _predict_action_chunk(batch):
            del batch
            next_value = len(call_values) + 1
            call_values.append(next_value)
            return torch.full((1, 1, 10), float(next_value))

        policy.predict_action_chunk = _predict_action_chunk

        batch = {
            OBS_STATE: torch.zeros(1, 10),
            OBS_IMAGES: torch.zeros(1, 5, 3, 4, 4),
            TASK: ["demo"],
        }

        first = policy.select_action(batch)
        second = policy.select_action(batch)

        self.assertEqual(call_values, [1, 2])
        self.assertEqual(tuple(first.shape), (1, 10))
        self.assertEqual(tuple(second.shape), (1, 10))
        self.assertTrue(torch.all(first == 1.0))
        self.assertTrue(torch.all(second == 2.0))
        self.assertEqual(len(policy._queues[ACTION]), 0)

    def test_select_action_uses_mean_first_n_without_queueing_full_chunk(self) -> None:
        policy = MultiTaskDiTPolicy.__new__(MultiTaskDiTPolicy)
        policy.config = MDITExperimentConfig(
            n_obs_steps=3,
            n_action_steps=4,
            command_mode="mean_first_n",
            average_first_n=2,
        )
        policy.reset()
        call_values: list[int] = []

        def _predict_action_chunk(batch):
            del batch
            call_values.append(len(call_values) + 1)
            chunk = torch.zeros(1, 4, 10)
            chunk[:, 0] = 1.0
            chunk[:, 1] = 3.0
            chunk[:, 0, 9] = 0.2
            chunk[:, 1, 9] = 0.8
            return chunk

        policy.predict_action_chunk = _predict_action_chunk
        batch = {
            OBS_STATE: torch.zeros(1, 10),
            OBS_IMAGES: torch.zeros(1, 5, 3, 4, 4),
            TASK: ["demo"],
        }

        first = policy.select_action(batch)
        second = policy.select_action(batch)

        self.assertEqual(call_values, [1, 2])
        self.assertEqual(tuple(first.shape), (1, 10))
        self.assertEqual(float(first[0, 0]), 2.0)
        self.assertEqual(float(first[0, 9]), 1.0)
        self.assertEqual(float(second[0, 0]), 2.0)
        self.assertEqual(len(policy._queues[ACTION]), 0)

    def test_predict_action_postprocesses_rotation_and_keeps_raw_gripper_when_smoothing_is_disabled(self) -> None:
        policy = MultiTaskDiTPolicy.__new__(MultiTaskDiTPolicy)
        policy.config = MDITExperimentConfig(
            camera_names=("front", "wrist", "overhead"),
            smooth_actions=False,
            gripper_open_threshold=0.6,
            gripper_close_threshold=0.4,
        )
        policy.select_action = lambda batch: torch.tensor([[0.1, 0.2, 0.3, 2.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.5]])
        policy.unnormalize_action = lambda action: action

        obs = torch.zeros(5, 4, 4, 3, dtype=torch.uint8)
        robot_state = np.array([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0], dtype=np.float32)

        with mock.patch("mdit.model.model.get_device", return_value=torch.device("cpu")):
            action = policy.predict_action(obs.numpy(), robot_state, task_text="demo")

        self.assertEqual(tuple(action.shape), (10,))
        self.assertAlmostEqual(float(np.linalg.norm(action[3:6])), 1.0, places=5)
        self.assertAlmostEqual(float(np.linalg.norm(action[6:9])), 1.0, places=5)
        self.assertAlmostEqual(float(np.dot(action[3:6], action[6:9])), 0.0, places=5)
        self.assertEqual(float(action[9]), 0.5)

    def test_predict_action_postprocesses_gripper_hysteresis_when_smoothing_enabled(self) -> None:
        policy = MultiTaskDiTPolicy.__new__(MultiTaskDiTPolicy)
        policy.config = MDITExperimentConfig(
            camera_names=("front", "wrist", "overhead"),
            smooth_actions=True,
            gripper_open_threshold=0.6,
            gripper_close_threshold=0.4,
        )
        policy.select_action = lambda batch: torch.tensor([[0.1, 0.2, 0.3, 2.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.5]])
        policy.unnormalize_action = lambda action: action

        obs = torch.zeros(5, 4, 4, 3, dtype=torch.uint8)
        robot_state = np.array([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0], dtype=np.float32)

        with mock.patch("mdit.model.model.get_device", return_value=torch.device("cpu")):
            action = policy.predict_action(obs.numpy(), robot_state, task_text="demo")

        self.assertEqual(float(action[9]), 0.0)

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

    def test_load_trial_request_falls_back_to_legacy_run_dir_config(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            run_dir = Path(tmp_dir) / "unplug_charger_mdit_rgb5_sep_all_500"
            epochs_dir = run_dir / "epochs"
            epochs_dir.mkdir(parents=True)
            (run_dir / "config.json").write_text(
                json.dumps(
                    {
                        "run_name": "unplug_charger_mdit_rgb5_sep_all_500",
                        "ckpt_root": str(run_dir.parent),
                        "device": "cuda",
                        "seed": 1234,
                        "train_epochs": 100,
                        "checkpoint_every_epochs": 100,
                        "success_max_steps": 200,
                        "eval_step_heartbeat_every": 50,
                    }
                ),
                encoding="utf-8",
            )
            torch.save({"completed_epoch": 299}, epochs_dir / "epoch_0300.pt")

            request = _load_trial_request(run_dir)

            self.assertEqual(request.run_name, "unplug_charger_mdit_rgb5_sep_all_500")
            self.assertEqual(request.stage_epochs, 500)
            self.assertEqual(request.checkpoint_every, 100)
            self.assertEqual(request.eval_episodes, 20)
            self.assertEqual(request.device, "cuda")
            self.assertFalse(request.cleanup_failed)


if __name__ == "__main__":
    unittest.main()
