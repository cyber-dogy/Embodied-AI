from __future__ import annotations

import json
from typing import Any

import numpy as np
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader

from common.runtime import set_device
from pdit.config import ExperimentConfig
from envs import RLBenchEnv
from .builders import build_policy, get_autocast_context, move_batch_to_device
from .action_postprocess import select_robot_state_from_prediction, smooth_robot_state_command

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
