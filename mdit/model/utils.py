from __future__ import annotations

import copy
from collections import deque
from enum import Enum
from typing import Any

import torch


class NormalizationMode(str, Enum):
    MIN_MAX = "MIN_MAX"
    MEAN_STD = "MEAN_STD"
    IDENTITY = "IDENTITY"


def _clone_value(value: Any) -> Any:
    if torch.is_tensor(value):
        return value.clone()
    if isinstance(value, list):
        return list(value)
    return copy.deepcopy(value)


def populate_queues(queues: dict[str, deque], batch: dict[str, Any]) -> dict[str, deque]:
    for key, value in batch.items():
        if key not in queues:
            continue
        queue = queues[key]
        if len(queue) == 0:
            while len(queue) < queue.maxlen:
                queue.append(_clone_value(value))
            continue
        queue.append(_clone_value(value))
    return queues


def normalize_tensor(
    tensor: torch.Tensor,
    stats: dict[str, torch.Tensor],
    mode: NormalizationMode,
    eps: float = 1e-6,
) -> torch.Tensor:
    if mode == NormalizationMode.IDENTITY:
        return tensor
    if mode == NormalizationMode.MIN_MAX:
        min_val = stats["min"]
        max_val = stats["max"]
        denom = (max_val - min_val).clamp_min(eps)
        return 2.0 * (tensor - min_val) / denom - 1.0
    if mode == NormalizationMode.MEAN_STD:
        mean = stats["mean"]
        std = stats["std"].clamp_min(eps)
        return (tensor - mean) / std
    raise ValueError(f"Unsupported normalization mode: {mode}")


def unnormalize_tensor(
    tensor: torch.Tensor,
    stats: dict[str, torch.Tensor],
    mode: NormalizationMode,
    eps: float = 1e-6,
) -> torch.Tensor:
    if mode == NormalizationMode.IDENTITY:
        return tensor
    if mode == NormalizationMode.MIN_MAX:
        min_val = stats["min"]
        max_val = stats["max"]
        denom = (max_val - min_val).clamp_min(eps)
        return (tensor + 1.0) * 0.5 * denom + min_val
    if mode == NormalizationMode.MEAN_STD:
        mean = stats["mean"]
        std = stats["std"].clamp_min(eps)
        return tensor * std + mean
    raise ValueError(f"Unsupported normalization mode: {mode}")


def move_to_device(
    data: Any,
    device: torch.device | str,
    *,
    non_blocking: bool | None = None,
) -> Any:
    if non_blocking is None:
        resolved = torch.device(device) if not isinstance(device, torch.device) else device
        non_blocking = resolved.type == "cuda"
    if torch.is_tensor(data):
        return data.to(device, non_blocking=bool(non_blocking))
    if isinstance(data, dict):
        return {
            key: move_to_device(value, device, non_blocking=non_blocking)
            for key, value in data.items()
        }
    if isinstance(data, list):
        return [move_to_device(item, device, non_blocking=non_blocking) for item in data]
    if isinstance(data, tuple):
        return tuple(move_to_device(item, device, non_blocking=non_blocking) for item in data)
    return data
