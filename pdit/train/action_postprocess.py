from __future__ import annotations

import numpy as np


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
