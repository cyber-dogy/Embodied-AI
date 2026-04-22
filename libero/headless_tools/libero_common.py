from __future__ import annotations

from pathlib import Path
import json

import cv2
import h5py
import imageio
import numpy as np
from libero.libero import benchmark, get_libero_path
from libero.libero.envs import OffScreenRenderEnv


TOOLS_ROOT = Path(__file__).resolve().parent
DEFAULT_OUTPUT_DIR = TOOLS_ROOT / "output"


def get_task_suite_and_task(suite_name: str, task_id: int):
    benchmark_dict = benchmark.get_benchmark_dict()
    if suite_name not in benchmark_dict:
        raise KeyError(f"未知 benchmark: {suite_name}")

    task_suite = benchmark_dict[suite_name]()
    if task_id < 0 or task_id >= task_suite.get_num_tasks():
        raise IndexError(f"task_id={task_id} 超出范围 [0, {task_suite.get_num_tasks()})")

    return task_suite, task_suite.get_task(task_id)


def build_env(task_suite, task_id: int, camera_size: int) -> OffScreenRenderEnv:
    return OffScreenRenderEnv(
        bddl_file_name=task_suite.get_task_bddl_file_path(task_id),
        camera_heights=camera_size,
        camera_widths=camera_size,
    )


def prepare_frame(obs: dict, include_wrist: bool) -> np.ndarray:
    # LIBERO / robosuite 返回的图像是倒置的，保存视频前要先上下翻转。
    agent = np.ascontiguousarray(obs["agentview_image"][::-1])
    if not include_wrist:
        return agent

    if "robot0_eye_in_hand_image" not in obs:
        raise KeyError("当前观测里不存在 robot0_eye_in_hand_image，无法拼接 wrist 视角")

    wrist = np.ascontiguousarray(obs["robot0_eye_in_hand_image"][::-1])
    if wrist.shape[:2] != agent.shape[:2]:
        wrist = cv2.resize(wrist, (agent.shape[1], agent.shape[0]))
    return np.hstack([agent, wrist])


def save_video(frames: list[np.ndarray], out_path: Path, fps: int) -> None:
    if not frames:
        raise ValueError("frames 为空，无法保存视频")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    imageio.mimsave(out_path, frames, fps=fps)


def default_video_path(prefix: str, suite_name: str, task_id: int) -> Path:
    DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    return DEFAULT_OUTPUT_DIR / f"{prefix}_{suite_name}_task{task_id}.mp4"


def resolve_demo_file(task_suite, task_id: int, demo_file: str | None) -> Path:
    if demo_file is not None:
        resolved_path = Path(demo_file).expanduser().resolve()
    else:
        resolved_path = Path(get_libero_path("datasets")) / task_suite.get_task_demonstration(task_id)

    if not resolved_path.exists():
        raise FileNotFoundError(
            f"没有找到 demo 文件: {resolved_path}\n"
            "请先运行 libero_headless_tools/download_libero_datasets.sh 下载对应 suite 的 demonstrations。"
        )
    return resolved_path


def load_demo_states(demo_path: Path, episode_index: int):
    with h5py.File(demo_path, "r") as demo_file:
        if "data" not in demo_file:
            raise KeyError(f"{demo_path} 缺少 data group")

        episode_keys = sorted(
            demo_file["data"].keys(),
            key=lambda key: int(key.split("_")[-1]),
        )
        if episode_index < 0 or episode_index >= len(episode_keys):
            raise IndexError(f"episode={episode_index} 超出范围 [0, {len(episode_keys)})")

        episode_key = episode_keys[episode_index]
        episode_group = demo_file["data"][episode_key]
        if "states" not in episode_group:
            raise KeyError(f"{demo_path}:{episode_key} 缺少 states")

        states = episode_group["states"][()]
        actions = episode_group["actions"][()] if "actions" in episode_group else None

    return episode_key, states, actions


def load_action_trace(action_file: str) -> np.ndarray:
    action_path = Path(action_file).expanduser().resolve()
    if not action_path.exists():
        raise FileNotFoundError(f"没有找到 action 文件: {action_path}")

    if action_path.suffix == ".npy":
        actions = np.load(action_path)
    elif action_path.suffix == ".npz":
        action_dict = np.load(action_path)
        if "actions" not in action_dict:
            raise KeyError(f"{action_path} 里缺少 actions key")
        actions = action_dict["actions"]
    else:
        raise ValueError(f"不支持的 action 文件格式: {action_path.suffix}")

    if actions.ndim != 2:
        raise ValueError(f"actions 需要是二维数组 [T, action_dim]，当前 shape={actions.shape}")
    return np.asarray(actions, dtype=np.float32)


def load_action_trace_bundle(action_file: str):
    action_path = Path(action_file).expanduser().resolve()
    if not action_path.exists():
        raise FileNotFoundError(f"没有找到 action 文件: {action_path}")

    metadata = {}
    initial_state = None
    if action_path.suffix == ".npy":
        actions = np.load(action_path)
    elif action_path.suffix == ".npz":
        action_dict = np.load(action_path)
        if "actions" not in action_dict:
            raise KeyError(f"{action_path} 里缺少 actions key")
        actions = action_dict["actions"]

        if "initial_state" in action_dict:
            loaded_initial_state = np.asarray(action_dict["initial_state"])
            if loaded_initial_state.size > 0:
                initial_state = loaded_initial_state

        if "metadata" in action_dict:
            raw_metadata = action_dict["metadata"]
            if isinstance(raw_metadata, np.ndarray):
                raw_metadata = raw_metadata.item()
            metadata = json.loads(raw_metadata)
    else:
        raise ValueError(f"不支持的 action 文件格式: {action_path.suffix}")

    if actions.ndim != 2:
        raise ValueError(f"actions 需要是二维数组 [T, action_dim]，当前 shape={actions.shape}")
    return np.asarray(actions, dtype=np.float32), initial_state, metadata
