from __future__ import annotations

import time
from typing import Any, Callable

import numpy as np
import torch

try:
    from tqdm.auto import tqdm
except ImportError:  # pragma: no cover
    tqdm = None


EpisodeContextFactory = Callable[[Any, list[str]], Any]
PredictCommandFn = Callable[[np.ndarray, np.ndarray, Any], np.ndarray]
ResetModelFn = Callable[[], None]


def make_progress_iter(iterable, total=None, desc=None, enable: bool = True):
    if enable and tqdm is not None:
        return tqdm(iterable, total=total, desc=desc, leave=False)
    return iterable


def run_success_rate_eval(
    *,
    make_env: Callable[[], Any],
    model: Any,
    num_episodes: int,
    max_steps: int,
    reset_model: ResetModelFn,
    predict_command: PredictCommandFn,
    on_episode_start: EpisodeContextFactory | None = None,
    show_progress: bool = True,
    progress_desc: str = "eval",
    heartbeat_every: int | None = 50,
) -> dict[str, Any]:
    env = make_env()
    model.eval()
    records: list[dict[str, Any]] = []
    success_count = 0
    episode_iter = make_progress_iter(
        range(num_episodes),
        total=num_episodes,
        desc=progress_desc,
        enable=show_progress,
    )
    use_tqdm_progress = show_progress and tqdm is not None and hasattr(episode_iter, "set_postfix")
    if show_progress and not use_tqdm_progress:
        print(f"{progress_desc}: starting {num_episodes} episodes (max_steps={max_steps})")

    try:
        for episode_idx in episode_iter:
            episode_start = time.perf_counter()
            reset_model()
            descriptions: list[str] = []
            if show_progress:
                print(f"{progress_desc}: episode={episode_idx} starting")
            try:
                descriptions = list(env.reset() or [])
                episode_context = (
                    on_episode_start(env, descriptions) if on_episode_start is not None else None
                )
                success = False
                steps = 0
                for step in range(max_steps):
                    if show_progress and heartbeat_every is not None and step > 0 and step % heartbeat_every == 0:
                        print(f"{progress_desc}: episode={episode_idx} heartbeat step={step}")
                    robot_state, obs = env.get_obs()
                    with torch.inference_mode():
                        next_robot_state = predict_command(obs, robot_state, episode_context)
                    reward, terminate = env.step(np.asarray(next_robot_state, dtype=np.float32))
                    success = bool(reward)
                    steps = step + 1
                    if reward or terminate:
                        break
                episode_record = {
                    "episode": int(episode_idx),
                    "success": bool(success),
                    "steps": int(steps),
                    "duration_sec": float(time.perf_counter() - episode_start),
                    "descriptions": descriptions,
                    "error": env.last_step_error,
                }
            except Exception as exc:  # pragma: no cover - depends on runtime simulator state
                episode_record = {
                    "episode": int(episode_idx),
                    "success": False,
                    "steps": 0,
                    "duration_sec": float(time.perf_counter() - episode_start),
                    "descriptions": descriptions,
                    "error": str(exc),
                }
            records.append(episode_record)
            success_count += int(bool(episode_record["success"]))
            if use_tqdm_progress:
                episode_iter.set_postfix(success=f"{success_count}/{len(records)}")
            elif show_progress:
                print(
                    f"{progress_desc}: episode={episode_idx} done "
                    f"success={episode_record['success']} steps={episode_record['steps']}"
                )
    finally:
        env.close()

    mean_steps = float(np.mean([row["steps"] for row in records])) if records else float("nan")
    success_rate = float(success_count / max(1, len(records)))
    return {
        "success_rate": success_rate,
        "mean_steps": mean_steps,
        "num_episodes": int(len(records)),
        "num_successes": int(success_count),
        "episode_records": records,
    }
