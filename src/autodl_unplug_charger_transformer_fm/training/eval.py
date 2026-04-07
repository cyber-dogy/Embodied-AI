from __future__ import annotations

import json
from typing import Any

import numpy as np
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader

from ..config import ExperimentConfig
from ..utils.common import get_device, set_device
from .builders import build_policy, get_autocast_context, move_batch_to_device

try:
    from tqdm.auto import tqdm
except ImportError:  # pragma: no cover
    tqdm = None


def summarize_metrics(metrics: list[dict[str, float]]) -> dict[str, float]:
    summary = {}
    for key in metrics[0].keys():
        values = [float(row[key]) for row in metrics]
        summary[key] = float(np.mean(values))
    return summary


def evaluate_model_on_loader(
    model: torch.nn.Module,
    loader: DataLoader,
    cfg: ExperimentConfig,
    max_batches: int | None = None,
) -> dict[str, float] | None:
    model.eval()
    metrics_list: list[dict[str, float]] = []
    with torch.inference_mode():
        for batch_idx, batch_cpu in enumerate(loader):
            if max_batches is not None and batch_idx >= max_batches:
                break
            batch = move_batch_to_device(batch_cpu)
            with get_autocast_context(cfg.train_use_amp, cfg.train_amp_dtype):
                loss_dict = model.compute_loss_dict(batch)
                pcd, robot_state_obs, robot_state_pred = model._norm_data(batch)
                pred_y = model.infer_y(pcd, robot_state_obs)
                metrics = {
                    "loss_total": float(loss_dict["loss_total"].detach().cpu()),
                    "loss_xyz": float(loss_dict["loss_xyz"].detach().cpu()),
                    "loss_rot6d": float(loss_dict["loss_rot6d"].detach().cpu()),
                    "loss_grip": float(loss_dict["loss_grip"].detach().cpu()),
                    "mse_xyz": float(F.mse_loss(pred_y[..., :3], robot_state_pred[..., :3]).detach().cpu()),
                    "mse_rot6d": float(
                        F.mse_loss(pred_y[..., 3:9], robot_state_pred[..., 3:9]).detach().cpu()
                    ),
                    "mse_grip": float(F.mse_loss(pred_y[..., 9], robot_state_pred[..., 9]).detach().cpu()),
                }
            metrics_list.append(metrics)
    if not metrics_list:
        return None
    summary = summarize_metrics(metrics_list)
    summary["num_batches"] = len(metrics_list)
    return summary


def compute_sample_metric(model: torch.nn.Module, batch: tuple[Any, ...]) -> float:
    batch = move_batch_to_device(batch)
    pcd, robot_state_obs, robot_state_pred = model._norm_data(batch)
    with torch.inference_mode():
        pred_y = model.infer_y(pcd, robot_state_obs)
    return float(F.mse_loss(pred_y, robot_state_pred).detach().cpu())


def normalize_rot6d_np(rot6d: np.ndarray) -> np.ndarray:
    rot6d = np.asarray(rot6d, dtype=np.float32).reshape(6)
    a1 = rot6d[:3]
    a2 = rot6d[3:6]
    n1 = float(np.linalg.norm(a1))
    if not np.isfinite(n1) or n1 < 1e-8:
        a1 = np.array([1.0, 0.0, 0.0], dtype=np.float32)
        n1 = 1.0
    b1 = a1 / n1
    a2 = a2 - np.dot(b1, a2) * b1
    n2 = float(np.linalg.norm(a2))
    if not np.isfinite(n2) or n2 < 1e-8:
        ref = np.array([0.0, 1.0, 0.0], dtype=np.float32)
        if abs(float(np.dot(b1, ref))) > 0.9:
            ref = np.array([0.0, 0.0, 1.0], dtype=np.float32)
        a2 = ref - np.dot(b1, ref) * b1
        n2 = float(np.linalg.norm(a2))
    b2 = a2 / max(n2, 1e-8)
    return np.concatenate([b1, b2], axis=0).astype(np.float32)


def select_robot_state_from_prediction(
    prediction: np.ndarray,
    mode: str,
    horizon_index: int,
    average_first_n: int,
) -> np.ndarray:
    prediction = np.asarray(prediction, dtype=np.float32)
    final_horizon = prediction[-1]
    horizon_len = final_horizon.shape[0]
    mode = str(mode).lower()
    if mode == "first":
        selected = final_horizon[0]
    elif mode == "horizon_index":
        index = int(np.clip(horizon_index, 0, horizon_len - 1))
        selected = final_horizon[index]
    elif mode == "mean_first_n":
        count = int(np.clip(average_first_n, 1, horizon_len))
        chunk = final_horizon[:count]
        selected = chunk.mean(axis=0)
        selected[9] = 1.0 if float(np.mean(chunk[:, 9])) >= 0.5 else 0.0
    else:
        raise ValueError(f"Unsupported command selection mode: {mode}")
    selected = selected.astype(np.float32).copy()
    selected[3:9] = normalize_rot6d_np(selected[3:9])
    return selected


def smooth_robot_state_command(
    current_robot_state: np.ndarray,
    predicted_robot_state: np.ndarray,
    *,
    enabled: bool,
    position_alpha: float,
    rotation_alpha: float,
    max_position_step: float | None,
    gripper_open_threshold: float,
    gripper_close_threshold: float,
) -> np.ndarray:
    predicted = np.asarray(predicted_robot_state, dtype=np.float32).reshape(-1).copy()
    predicted[3:9] = normalize_rot6d_np(predicted[3:9])
    if not enabled:
        return predicted
    current = np.asarray(current_robot_state, dtype=np.float32).reshape(-1)
    current[3:9] = normalize_rot6d_np(current[3:9])
    smoothed = predicted.copy()
    smoothed[:3] = current[:3] + (predicted[:3] - current[:3]) * float(np.clip(position_alpha, 0.0, 1.0))
    if max_position_step is not None and float(max_position_step) > 0.0:
        delta = smoothed[:3] - current[:3]
        delta_norm = float(np.linalg.norm(delta))
        if np.isfinite(delta_norm) and delta_norm > float(max_position_step):
            smoothed[:3] = current[:3] + delta / delta_norm * float(max_position_step)
    blended_rot = current[3:9] * (1.0 - rotation_alpha) + predicted[3:9] * rotation_alpha
    smoothed[3:9] = normalize_rot6d_np(blended_rot)
    predicted_gripper = float(predicted[9])
    current_gripper = float(current[9])
    if predicted_gripper >= float(gripper_open_threshold):
        smoothed[9] = 1.0
    elif predicted_gripper <= float(gripper_close_threshold):
        smoothed[9] = 0.0
    else:
        smoothed[9] = 1.0 if current_gripper >= 0.5 else 0.0
    return smoothed.astype(np.float32)


def make_progress_iter(iterable, total=None, desc=None, enable=True):
    if enable and tqdm is not None:
        return tqdm(iterable, total=total, desc=desc, leave=False)
    return iterable


def run_success_rate_eval(
    model: torch.nn.Module,
    cfg: ExperimentConfig,
    *,
    num_episodes: int,
    max_steps: int,
    headless: bool = True,
    show_progress: bool = True,
    progress_desc: str = "eval",
) -> dict[str, Any]:
    try:
        from ..env import RLBenchEnv
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "RLBench evaluation requires optional RLBench/PyRep dependencies. "
            "Install them before enabling success selection or standard eval."
        ) from exc

    env = RLBenchEnv(
        task_name=cfg.task_name,
        voxel_size=0.01,
        n_points=int(cfg.n_points),
        use_pc_color=bool(cfg.use_pc_color),
        headless=headless,
        vis=False,
        obs_mode=cfg.obs_mode,
        responsive_ui=True,
    )
    model.eval()
    records = []
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
            model.reset_obs()
            descriptions = []
            if show_progress:
                print(f"{progress_desc}: episode={episode_idx} starting")
            try:
                descriptions = env.reset()
                success = False
                steps = 0
                for step in range(max_steps):
                    if show_progress and heartbeat_every is not None and step > 0 and step % heartbeat_every == 0:
                        print(f"{progress_desc}: episode={episode_idx} heartbeat step={step}")
                    robot_state, obs = env.get_obs()
                    with torch.inference_mode():
                        prediction = model.predict_action(obs, robot_state)
                    predicted_robot_state = select_robot_state_from_prediction(
                        prediction,
                        mode=cfg.command_mode,
                        horizon_index=cfg.horizon_index,
                        average_first_n=cfg.average_first_n,
                    )
                    next_robot_state = smooth_robot_state_command(
                        robot_state,
                        predicted_robot_state,
                        enabled=cfg.smooth_actions,
                        position_alpha=cfg.position_alpha,
                        rotation_alpha=cfg.rotation_alpha,
                        max_position_step=cfg.max_position_step,
                        gripper_open_threshold=cfg.gripper_open_threshold,
                        gripper_close_threshold=cfg.gripper_close_threshold,
                    )
                    reward, terminate = env.step(next_robot_state)
                    success = bool(reward)
                    steps = step + 1
                    if reward or terminate:
                        break
                error = env.last_step_error
            except Exception as exc:
                success = False
                steps = 0
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


def summarize_for_json(summary: dict[str, Any] | None) -> dict[str, Any] | None:
    if summary is None:
        return None
    slim = dict(summary)
    if "episode_records" in slim:
        slim["num_successes"] = int(sum(int(bool(row.get("success"))) for row in slim["episode_records"]))
        slim["episode_records"] = slim["episode_records"][:10]
    return slim


def write_summary_json(cfg: ExperimentConfig, summary: dict[str, Any]):
    path = cfg.summary_path
    path.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def load_model_for_eval(
    cfg: ExperimentConfig,
    strategy: str,
    ckpt_path,
    prefer_ema: bool = True,
    payload: dict[str, Any] | None = None,
):
    if payload is None:
        payload = torch.load(ckpt_path, map_location="cpu")
    device = set_device(cfg.device)
    model = build_policy(cfg, strategy)
    if prefer_ema and payload.get("ema_state_dict") is not None:
        model.load_state_dict(payload["ema_state_dict"])
    else:
        model.load_state_dict(payload["model_state_dict"])
    model.to(device)
    model.eval()
    return model, payload
