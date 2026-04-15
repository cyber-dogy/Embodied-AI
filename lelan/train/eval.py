from __future__ import annotations

import json
from typing import Any

import numpy as np
import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader

from common.rlbench_rollout import (
    make_progress_iter,
    run_success_rate_eval as run_shared_success_rate_eval,
)
from common.runtime import set_device
from lelan.config import LeLaNExperimentConfig
from lelan.model.model import LeLaNPolicy
from .builders import build_policy, get_autocast_context, move_batch_to_device


def summarize_metrics(metrics: list[dict[str, float]]) -> dict[str, float]:
    summary = {}
    for key in metrics[0].keys():
        values = [float(row[key]) for row in metrics]
        summary[key] = float(np.mean(values))
    return summary


def evaluate_model_on_loader(
    model: LeLaNPolicy,
    loader: DataLoader,
    cfg: LeLaNExperimentConfig,
    max_batches: int | None = None,
) -> dict[str, float] | None:
    model.eval()
    metrics_list: list[dict[str, float]] = []
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
    if not metrics_list:
        return None
    summary = summarize_metrics(metrics_list)
    summary["num_batches"] = len(metrics_list)
    return summary


def compute_sample_metric(
    model: LeLaNPolicy,
    batch_cpu: dict[str, Any],
    cfg: LeLaNExperimentConfig,
) -> float:
    batch = move_batch_to_device(batch_cpu)
    model.eval()
    with torch.inference_mode(), get_autocast_context(cfg.use_amp):
        pred_actions = model._generate_action_chunk(batch)
    pred_actions = model.unnormalize_action(pred_actions)
    target_actions = batch["action"][:, model.config.n_obs_steps - 1 : model.config.n_obs_steps - 1 + model.config.n_action_steps]
    return float(F.mse_loss(pred_actions, target_actions).detach().cpu())


def run_success_rate_eval(
    model: LeLaNPolicy,
    cfg: LeLaNExperimentConfig,
    *,
    num_episodes: int,
    max_steps: int,
    headless: bool = True,
    show_progress: bool = True,
    progress_desc: str = "lelan-eval",
) -> dict[str, Any]:
    from envs import RLBenchEnv

    heartbeat_every = int(cfg.eval_step_heartbeat_every) if cfg.eval_step_heartbeat_every else None

    def make_env() -> RLBenchEnv:
        return RLBenchEnv(
            task_name=cfg.task_name,
            voxel_size=0.01,
            n_points=2048,
            use_pc_color=False,
            headless=headless,
            vis=False,
            obs_mode="rgb",
            responsive_ui=True,
        )

    def on_episode_start(env: RLBenchEnv, _descriptions: list[str]) -> str:
        return env.get_task_instruction(
            override_text=cfg.task_text_override if cfg.task_text_mode == "override" else None,
            use_env_descriptions=cfg.task_text_mode != "template",
        )

    def predict_command(obs: np.ndarray, robot_state: np.ndarray, instruction: str) -> np.ndarray:
        return model.predict_action(obs, robot_state, task_text=instruction)

    return run_shared_success_rate_eval(
        make_env=make_env,
        model=model,
        num_episodes=num_episodes,
        max_steps=max_steps,
        reset_model=model.reset,
        predict_command=predict_command,
        on_episode_start=on_episode_start,
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


def write_summary_json(cfg: LeLaNExperimentConfig, summary: dict[str, Any]):
    path = cfg.summary_path
    path.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def load_model_for_eval(
    cfg: LeLaNExperimentConfig,
    ckpt_path,
    payload: dict[str, Any] | None = None,
    prefer_ema: bool = True,
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
