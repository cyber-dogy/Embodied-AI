from __future__ import annotations

import json
from typing import Any

import numpy as np
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader

from common.runtime import set_device
from common.rlbench_rollout import (
    make_progress_iter,
    run_success_rate_eval as run_shared_success_rate_eval,
)
from pdit.config import ExperimentConfig
from envs import RLBenchEnv
from .builders import build_policy, get_autocast_context, move_batch_to_device
from .action_postprocess import select_robot_state_from_prediction, smooth_robot_state_command


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
    heartbeat_every = int(cfg.eval_step_heartbeat_every) if cfg.eval_step_heartbeat_every else None

    def make_env() -> RLBenchEnv:
        return RLBenchEnv(
            task_name=cfg.task_name,
            voxel_size=0.01,
            n_points=int(cfg.n_points),
            use_pc_color=bool(cfg.use_pc_color),
            headless=headless,
            vis=False,
            obs_mode=cfg.obs_mode,
            responsive_ui=True,
        )

    def predict_command(obs: np.ndarray, robot_state: np.ndarray, _episode_context: Any) -> np.ndarray:
        prediction = model.predict_action(obs, robot_state)
        predicted_robot_state = select_robot_state_from_prediction(
            prediction,
            mode=cfg.command_mode,
            horizon_index=cfg.horizon_index,
            average_first_n=cfg.average_first_n,
        )
        return smooth_robot_state_command(
            robot_state,
            predicted_robot_state,
            enabled=cfg.smooth_actions,
            position_alpha=cfg.position_alpha,
            rotation_alpha=cfg.rotation_alpha,
            max_position_step=cfg.max_position_step,
            gripper_open_threshold=cfg.gripper_open_threshold,
            gripper_close_threshold=cfg.gripper_close_threshold,
        )

    return run_shared_success_rate_eval(
        make_env=make_env,
        model=model,
        num_episodes=num_episodes,
        max_steps=max_steps,
        reset_model=model.reset_obs,
        predict_command=predict_command,
        show_progress=show_progress,
        progress_desc=progress_desc,
        heartbeat_every=heartbeat_every,
    )


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
