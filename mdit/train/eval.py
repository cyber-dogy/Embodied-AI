from __future__ import annotations

import json
import logging
from pathlib import Path
import subprocess
import sys
import tempfile
from typing import Any

import numpy as np
import torch
import torch.nn.functional as F  # noqa: N812
from torch.utils.data import DataLoader

from common.runtime import PROJECT_ROOT, set_device
from mdit.config import MDITExperimentConfig
from mdit.model.model import MultiTaskDiTPolicy
from .builders import build_policy, get_autocast_context, move_batch_to_device

try:
    from tqdm.auto import tqdm
except ImportError:  # pragma: no cover
    tqdm = None

LOGGER = logging.getLogger(__name__)


def summarize_metrics(metrics: list[dict[str, float]]) -> dict[str, float]:
    summary = {}
    for key in metrics[0].keys():
        values = [float(row[key]) for row in metrics]
        summary[key] = float(np.mean(values))
    return summary


def compute_grip_diagnostics_from_actions(
    pred_actions: torch.Tensor,
    target_actions: torch.Tensor,
    cfg: MDITExperimentConfig,
) -> dict[str, float]:
    pred_grip = pred_actions[..., 9]
    target_grip = target_actions[..., 9]
    pred_binary = pred_grip >= 0.5
    target_binary = target_grip >= 0.5
    transition_mask = torch.zeros_like(target_binary, dtype=torch.bool)
    if target_binary.shape[-1] > 1:
        transition_mask[..., 1:] = target_binary[..., 1:] != target_binary[..., :-1]

    transition_frames = int(transition_mask.sum().detach().cpu())
    if transition_frames > 0:
        transition_acc = float((pred_binary[transition_mask] == target_binary[transition_mask]).float().mean().cpu())
    else:
        transition_acc = 0.0

    deadband_ratio = (
        (pred_grip > float(cfg.gripper_close_threshold)) & (pred_grip < float(cfg.gripper_open_threshold))
    ).float().mean()

    return {
        "grip_mean_pred": float(pred_grip.mean().detach().cpu()),
        "grip_mean_target": float(target_grip.mean().detach().cpu()),
        "grip_deadband_ratio": float(deadband_ratio.detach().cpu()),
        "grip_binary_acc": float((pred_binary == target_binary).float().mean().detach().cpu()),
        "grip_transition_acc": float(transition_acc),
        "grip_transition_frames": float(transition_frames),
    }


def evaluate_model_on_loader(
    model: MultiTaskDiTPolicy,
    loader: DataLoader,
    cfg: MDITExperimentConfig,
    max_batches: int | None = None,
) -> dict[str, float] | None:
    model.eval()
    metrics_list: list[dict[str, float]] = []
    grip_diag_rows: list[dict[str, float]] = []
    with torch.inference_mode():
        for batch_idx, batch_cpu in enumerate(loader):
            if max_batches is not None and batch_idx >= max_batches:
                break
            batch = move_batch_to_device(batch_cpu)
            with get_autocast_context(cfg.use_amp):
                loss, loss_dict = model(batch)
            row = {"loss_total": float(loss.detach().cpu())}
            if loss_dict is not None:
                for key, value in loss_dict.items():
                    row[key] = float(value.detach().cpu())
            metrics_list.append(row)
            if batch_idx < 8:
                with get_autocast_context(cfg.use_amp):
                    pred_actions = model._generate_action_chunk(batch)
                pred_actions = model.unnormalize_action(pred_actions)
                target_actions = batch["action"][
                    :, model.config.n_obs_steps - 1 : model.config.n_obs_steps - 1 + model.config.n_action_steps
                ]
                grip_diag_rows.append(compute_grip_diagnostics_from_actions(pred_actions, target_actions, cfg))
    if not metrics_list:
        return None
    summary = summarize_metrics(metrics_list)
    if grip_diag_rows:
        summary.update(summarize_metrics(grip_diag_rows))
    summary["num_batches"] = len(metrics_list)
    return summary


def make_progress_iter(iterable, total=None, desc=None, enable=True):
    if enable and tqdm is not None:
        return tqdm(iterable, total=total, desc=desc, leave=False)
    return iterable


def compute_sample_metric(
    model: MultiTaskDiTPolicy,
    batch_cpu: dict[str, Any],
    cfg: MDITExperimentConfig,
) -> float:
    batch = move_batch_to_device(batch_cpu)
    model.eval()
    with torch.inference_mode(), get_autocast_context(cfg.use_amp):
        pred_actions = model._generate_action_chunk(batch)
    pred_actions = model.unnormalize_action(pred_actions)
    target_actions = batch["action"][:, model.config.n_obs_steps - 1 : model.config.n_obs_steps - 1 + model.config.n_action_steps]
    return float(F.mse_loss(pred_actions, target_actions).detach().cpu())


def build_rlbench_env_kwargs(cfg: MDITExperimentConfig, *, headless: bool) -> dict[str, Any]:
    return {
        "task_name": cfg.task_name,
        "voxel_size": 0.01,
        "n_points": int(cfg.observation_encoder.pcd.n_points) if cfg.use_pcd else 2048,
        "use_pc_color": bool(cfg.observation_encoder.pcd.use_color) if cfg.use_pcd else False,
        "headless": bool(headless),
        "vis": False,
        "obs_mode": "pcd" if cfg.use_pcd else "rgb",
        "responsive_ui": True,
        "disable_task_validation": bool(cfg.rlbench_disable_task_validation),
    }


def run_success_rate_eval(
    model: MultiTaskDiTPolicy,
    cfg: MDITExperimentConfig,
    *,
    num_episodes: int,
    max_steps: int,
    headless: bool = True,
    show_progress: bool = True,
    progress_desc: str = "mdit-eval",
) -> dict[str, Any]:
    from envs import RLBenchEnv

    env = RLBenchEnv(**build_rlbench_env_kwargs(cfg, headless=headless))
    model.eval()
    records: list[dict[str, Any]] = []
    success_count = 0
    heartbeat_every = int(cfg.eval_step_heartbeat_every) if cfg.eval_step_heartbeat_every else None
    episode_iter = make_progress_iter(
        range(num_episodes),
        total=num_episodes,
        desc=progress_desc,
        enable=show_progress,
    )
    use_tqdm_progress = show_progress and tqdm is not None and hasattr(episode_iter, "set_postfix")
    try:
        for episode_idx in episode_iter:
            model.reset()
            descriptions = []
            if show_progress:
                print(f"{progress_desc}: episode={episode_idx} starting")
            # Initialize before try so except never risks NameError even if
            # env.last_step_error itself raises (edge case).
            error: str | None = None
            success = False
            steps = 0
            try:
                descriptions = env.reset()
                instruction = env.get_task_instruction(
                    override_text=cfg.task_text_override if cfg.task_text_mode == "override" else None,
                    use_env_descriptions=cfg.task_text_mode != "template",
                )
                for step in range(max_steps):
                    if show_progress and heartbeat_every is not None and step > 0 and step % heartbeat_every == 0:
                        print(f"{progress_desc}: episode={episode_idx} heartbeat step={step}")
                    robot_state, obs = env.get_obs()
                    with torch.inference_mode():
                        action = model.predict_action(obs, robot_state, task_text=instruction)
                    reward, terminate = env.step(action)
                    success = bool(reward)
                    steps = step + 1
                    if reward or terminate:
                        break
                error = env.last_step_error
            except Exception as exc:  # pragma: no cover - runtime env issues
                success = False
                # Intentionally do NOT reset `steps` here: preserve the actual step
                # count reached before the exception so analysis buckets (lt_20,
                # at_horizon, etc.) remain meaningful.
                error = str(exc)
            success_count += int(success)
            record = {
                "episode": int(episode_idx),
                "success": bool(success),
                "steps": int(steps),
                "descriptions": descriptions,
                "error": error,
            }
            records.append(record)
            running_success = success_count / len(records)
            if use_tqdm_progress:
                episode_iter.set_postfix(
                    success_rate=f"{running_success:.2f}",
                    steps=steps,
                    error="yes" if error else "no",
                )
            elif show_progress:
                print(
                    f"{progress_desc}: episode={episode_idx} success={success} "
                    f"steps={steps} running_success_rate={running_success:.2f} error={error}"
                )
    finally:
        env.close()

    return {
        "success_rate": success_count / max(1, num_episodes),
        "mean_steps": float(np.mean([row["steps"] for row in records])) if records else 0.0,
        "num_episodes": len(records),
        "episode_records": records,
    }


def _build_success_eval_subprocess_cmd(
    ckpt_path: Path,
    *,
    device: str,
    heartbeat_every: int,
    num_episodes: int,
    max_steps: int,
    headless: bool,
    show_progress: bool,
    output_json_path: Path,
) -> list[str]:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "eval_mdit_checkpoint.py"),
        "--ckpt-path",
        str(Path(ckpt_path).expanduser().resolve()),
        "--episodes",
        str(int(num_episodes)),
        "--max-steps",
        str(int(max_steps)),
        "--output-json",
        str(Path(output_json_path).expanduser().resolve()),
        "--device",
        str(device),
        "--heartbeat-every",
        str(int(heartbeat_every)),
        "--no-prefer-ema",
    ]
    cmd.append("--headless" if bool(headless) else "--no-headless")
    cmd.append("--show-progress" if bool(show_progress) else "--no-show-progress")
    return cmd


def _is_cuda_oom_error(error_text: str) -> bool:
    lowered = str(error_text).lower()
    return "out of memory" in lowered or "cudaerrormemoryallocation" in lowered


def _run_success_rate_eval_subprocess_once(
    ckpt_path: Path,
    cfg: MDITExperimentConfig,
    *,
    device: str,
    num_episodes: int,
    max_steps: int,
    headless: bool,
    show_progress: bool,
    progress_desc: str,
    timeout_sec: int | None,
) -> dict[str, Any]:
    with tempfile.TemporaryDirectory(prefix="mdit_success_eval_") as tmp_dir:
        output_json_path = Path(tmp_dir) / "result.json"
        cmd = _build_success_eval_subprocess_cmd(
            ckpt_path,
            device=device,
            heartbeat_every=int(cfg.eval_step_heartbeat_every),
            num_episodes=num_episodes,
            max_steps=max_steps,
            headless=headless,
            show_progress=show_progress,
            output_json_path=output_json_path,
        )
        LOGGER.info(
            "Starting isolated MDIT success eval subprocess for %s using checkpoint %s on %s",
            progress_desc,
            ckpt_path,
            device,
        )
        try:
            completed = subprocess.run(
                cmd,
                cwd=PROJECT_ROOT,
                check=True,
                capture_output=True,
                text=True,
                timeout=None if timeout_sec in (None, 0) else int(timeout_sec),
            )
        except subprocess.TimeoutExpired as exc:
            tail = _tail_subprocess_output(exc.stdout, exc.stderr)
            detail = (
                f"Timed out after {int(timeout_sec)}s while running isolated success eval"
                if timeout_sec not in (None, 0)
                else "Timed out while running isolated success eval"
            )
            if tail:
                detail = f"{detail}. Tail:\n{tail}"
            raise RuntimeError(detail) from exc
        except subprocess.CalledProcessError as exc:
            tail = _tail_subprocess_output(exc.stdout, exc.stderr)
            detail = f"Isolated success eval subprocess failed with exit code {exc.returncode}"
            if tail:
                detail = f"{detail}. Tail:\n{tail}"
            raise RuntimeError(detail) from exc

        if show_progress and completed.stdout:
            print(completed.stdout, end="" if completed.stdout.endswith("\n") else "\n")
        if not output_json_path.exists():
            raise RuntimeError(
                f"Isolated success eval finished without producing output JSON: {output_json_path}"
            )
        payload = json.loads(output_json_path.read_text(encoding="utf-8"))
        payload["device_used"] = str(device)
        payload["cpu_fallback"] = False
        return payload


def _tail_subprocess_output(stdout: str | None, stderr: str | None, *, max_lines: int = 40) -> str:
    lines: list[str] = []
    for chunk in (stdout, stderr):
        if not chunk:
            continue
        lines.extend(str(chunk).splitlines())
    if not lines:
        return ""
    tail = lines[-max_lines:]
    return "\n".join(tail)


def run_success_rate_eval_subprocess(
    ckpt_path,
    cfg: MDITExperimentConfig,
    *,
    num_episodes: int,
    max_steps: int,
    headless: bool = True,
    show_progress: bool = True,
    progress_desc: str = "mdit-eval",
    timeout_sec: int | None = None,
) -> dict[str, Any]:
    ckpt_path = Path(ckpt_path).expanduser().resolve()
    requested_device = str(cfg.device)
    try:
        return _run_success_rate_eval_subprocess_once(
            ckpt_path,
            cfg,
            device=requested_device,
            num_episodes=num_episodes,
            max_steps=max_steps,
            headless=headless,
            show_progress=show_progress,
            progress_desc=progress_desc,
            timeout_sec=timeout_sec,
        )
    except RuntimeError as exc:
        if requested_device.startswith("cuda") and _is_cuda_oom_error(str(exc)):
            LOGGER.warning(
                "MDIT success eval hit CUDA OOM on %s for %s; retrying once on cpu.",
                requested_device,
                progress_desc,
            )
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            try:
                retry_result = _run_success_rate_eval_subprocess_once(
                    ckpt_path,
                    cfg,
                    device="cpu",
                    num_episodes=num_episodes,
                    max_steps=max_steps,
                    headless=headless,
                    show_progress=show_progress,
                    progress_desc=f"{progress_desc} (cpu fallback)",
                    timeout_sec=timeout_sec,
                )
            except RuntimeError as retry_exc:
                raise RuntimeError(
                    f"MDIT success eval failed on {requested_device} with CUDA OOM, "
                    f"then cpu fallback also failed: {retry_exc}"
                ) from retry_exc
            retry_result["cpu_fallback"] = True
            retry_result["initial_device"] = requested_device
            return retry_result
        raise


def summarize_for_json(summary: dict[str, Any] | None) -> dict[str, Any] | None:
    if summary is None:
        return None
    slim = dict(summary)
    if "episode_records" in slim:
        slim["num_successes"] = int(sum(int(bool(row.get("success"))) for row in slim["episode_records"]))
        slim["episode_records"] = slim["episode_records"][:10]
    return slim


def write_summary_json(cfg: MDITExperimentConfig, summary: dict[str, Any]):
    path = cfg.summary_path
    path.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def load_model_for_eval(
    cfg: MDITExperimentConfig,
    ckpt_path,
    payload: dict[str, Any] | None = None,
    prefer_ema: bool = False,
):
    if payload is None:
        payload = torch.load(ckpt_path, map_location="cpu")
    device = set_device(cfg.device)
    model = build_policy(cfg, payload["dataset_stats"])
    if prefer_ema and payload.get("ema_state_dict") is not None:
        model.load_state_dict(payload["ema_state_dict"])
    else:
        model.load_state_dict(payload["model_state_dict"])
    model.to(device)
    model.eval()
    return model, payload
