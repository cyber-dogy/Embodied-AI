from __future__ import annotations

import json
from pathlib import Path

import numpy as np


TOOLS_ROOT = Path(__file__).resolve().parent
DEFAULT_EVAL_OUTPUT_ROOT = TOOLS_ROOT / "output" / "evals"


def sanitize_fragment(text: str) -> str:
    sanitized = text.strip().lower().replace(" ", "_").replace("/", "_")
    sanitized = "".join(char for char in sanitized if char.isalnum() or char in {"_", "-"})
    return sanitized[:80] if sanitized else "unnamed_task"


def build_eval_artifact_paths(
    model_tag: str,
    suite_name: str,
    task_id: int,
    episode_idx: int,
    success: bool,
    task_name: str,
    output_root: str | Path | None = None,
) -> tuple[Path, Path]:
    # 所有评测器统一往这套目录结构里落产物，方便后续批量筛视频和重放 action trace。
    root = Path(output_root).expanduser().resolve() if output_root else DEFAULT_EVAL_OUTPUT_ROOT / model_tag
    task_dir = root / suite_name / f"{task_id:02d}_{sanitize_fragment(task_name)}"
    task_dir.mkdir(parents=True, exist_ok=True)

    success_flag = 1 if success else 0
    file_stem = f"ep{episode_idx:03d}_success{success_flag}"
    return task_dir / f"{file_stem}.npz", task_dir / f"{file_stem}.mp4"


def save_action_trace_artifact(
    artifact_path: str | Path,
    actions,
    *,
    initial_state=None,
    metadata: dict | None = None,
) -> Path:
    action_array = np.asarray(actions, dtype=np.float32)
    if action_array.ndim != 2:
        raise ValueError(f"actions 必须是二维数组 [T, action_dim]，当前 shape={action_array.shape}")

    payload = {"actions": action_array}
    if initial_state is not None:
        payload["initial_state"] = np.asarray(initial_state, dtype=np.float64)
    if metadata is not None:
        payload["metadata"] = np.asarray(json.dumps(metadata, ensure_ascii=False))

    artifact_path = Path(artifact_path).expanduser().resolve()
    artifact_path.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(artifact_path, **payload)
    return artifact_path
