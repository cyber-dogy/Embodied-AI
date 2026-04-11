from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import numpy as np
import zarr

from lelan.constants import ACTION, OBS_STATE


def _array_stats(array: np.ndarray) -> dict[str, list[float]]:
    array = np.asarray(array, dtype=np.float32)
    return {
        "mean": np.mean(array, axis=0).astype(np.float32).tolist(),
        "std": np.std(array, axis=0).astype(np.float32).tolist(),
        "min": np.min(array, axis=0).astype(np.float32).tolist(),
        "max": np.max(array, axis=0).astype(np.float32).tolist(),
    }


def compute_dataset_stats(data_path: str | Path) -> dict[str, dict[str, list[float]]]:
    root = zarr.open_group(str(Path(data_path)), mode="r")
    robot_state = np.asarray(root["data"]["robot_state"], dtype=np.float32)
    stats = _array_stats(robot_state)
    return {
        OBS_STATE: dict(stats),
        ACTION: dict(stats),
    }


def save_stats(stats: dict[str, Any], path: str | Path) -> Path:
    out_path = Path(path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(stats, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return out_path


def load_stats(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))
