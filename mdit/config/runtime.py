from __future__ import annotations

from dataclasses import replace

import numpy as np

from .schema import ExperimentConfig


def _compute_min_max_stats(data_path, dim: int) -> tuple[tuple[float, ...], tuple[float, ...]]:
    from mdit.data.replay_buffer import RobotReplayBuffer

    replay_buffer = RobotReplayBuffer.create_from_path(str(data_path), mode="r")
    robot_state = np.asarray(replay_buffer["robot_state"], dtype=np.float32)
    if robot_state.ndim != 2 or robot_state.shape[-1] != int(dim):
        raise ValueError(
            f"Expected robot_state with shape (T, {int(dim)}), got {tuple(robot_state.shape)}"
        )
    min_vals = np.min(robot_state, axis=0).astype(np.float32)
    max_vals = np.max(robot_state, axis=0).astype(np.float32)
    return tuple(float(v) for v in min_vals), tuple(float(v) for v in max_vals)


def resolve_runtime_config(cfg: ExperimentConfig) -> ExperimentConfig:
    if str(cfg.normalization_profile) != "mtdp_strict":
        return cfg

    if all(
        value is not None
        for value in (cfg.state_min, cfg.state_max, cfg.action_min, cfg.action_max)
    ):
        return cfg

    # 这里的数据集只有 robot_state，没有单独 action 键；
    # 对当前机器人控制任务来说，训练目标与 rollout 命令都落在同一个 10 维 robot_state 空间，
    # 因此严格线用同一组 min-max 统计量分别显式写入 state/action 字段，避免训练和评估各自猜测。
    state_min, state_max = _compute_min_max_stats(cfg.train_data_path, cfg.y_dim)
    return replace(
        cfg,
        state_min=state_min if cfg.state_min is None else cfg.state_min,
        state_max=state_max if cfg.state_max is None else cfg.state_max,
        action_min=state_min if cfg.action_min is None else cfg.action_min,
        action_max=state_max if cfg.action_max is None else cfg.action_max,
    )
