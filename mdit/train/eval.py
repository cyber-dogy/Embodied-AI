from __future__ import annotations

import json
from typing import Any

import numpy as np
import torch
import torch.nn.functional as F  # noqa: N812
from torch.utils.data import DataLoader

from common.runtime import set_device
from mdit.config import MDITExperimentConfig
from mdit.model.model import MultiTaskDiTPolicy
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
    model: MultiTaskDiTPolicy,
    loader: DataLoader,
    cfg: MDITExperimentConfig,
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
    target_actions = batch["action"][:, model.config.n_obs_steps - 1 : model.config.n_obs_steps - 1 + model.config.n_action_steps]
    return float(F.mse_loss(pred_actions, target_actions).detach().cpu())
    return iterable


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

    env = RLBenchEnv(
        task_name=cfg.task_name,
        voxel_size=0.01,
        n_points=2048,
        use_pc_color=False,
        headless=headless,
        vis=False,
        obs_mode="rgb",
        responsive_ui=True,
    )
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
            try:
                descriptions = env.reset()
                instruction = env.get_task_instruction(
                    override_text=cfg.task_text_override if cfg.task_text_mode == "override" else None
                )
                success = False
                steps = 0
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


def write_summary_json(cfg: MDITExperimentConfig, summary: dict[str, Any]):
    path = cfg.summary_path
    path.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def load_model_for_eval(
    cfg: MDITExperimentConfig,
    ckpt_path,
    payload: dict[str, Any] | None = None,
):
    if payload is None:
        payload = torch.load(ckpt_path, map_location="cpu")
    device = set_device(cfg.device)
    model = build_policy(cfg, payload["dataset_stats"])
    model.load_state_dict(payload["model_state_dict"])
    model.to(device)
    model.eval()
    return model, payload
