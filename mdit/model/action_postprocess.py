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


def postprocess_robot_state_command(
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
    current = np.asarray(current_robot_state, dtype=np.float32).reshape(-1).copy()
    predicted = np.asarray(predicted_robot_state, dtype=np.float32).reshape(-1).copy()
    current[3:9] = normalize_rot6d_np(current[3:9])
    predicted[3:9] = normalize_rot6d_np(predicted[3:9])

    command = predicted.copy()
    if enabled:
        command[:3] = current[:3] + (predicted[:3] - current[:3]) * float(np.clip(position_alpha, 0.0, 1.0))
        if max_position_step is not None and float(max_position_step) > 0.0:
            delta = command[:3] - current[:3]
            delta_norm = float(np.linalg.norm(delta))
            if np.isfinite(delta_norm) and delta_norm > float(max_position_step):
                command[:3] = current[:3] + delta / max(delta_norm, 1e-8) * float(max_position_step)
        blended_rot = current[3:9] * (1.0 - float(rotation_alpha)) + predicted[3:9] * float(rotation_alpha)
        command[3:9] = normalize_rot6d_np(blended_rot)

    predicted_gripper = float(predicted[9])
    current_gripper = float(current[9])
    if predicted_gripper >= float(gripper_open_threshold):
        command[9] = 1.0
    elif predicted_gripper <= float(gripper_close_threshold):
        command[9] = 0.0
    else:
        command[9] = 1.0 if current_gripper >= 0.5 else 0.0
    return command.astype(np.float32)
