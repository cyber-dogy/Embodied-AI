from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Any

import h5py
import numpy as np
import torch
from PIL import Image
from torch.utils.data import Dataset

from .tokenizer import SimpleTokenizer


def _episode_sort_key(name: str) -> int:
    return int(name.split("_")[-1])


def infer_instruction_from_demo_name(path: Path) -> str:
    stem = path.stem
    if stem.endswith("_demo"):
        stem = stem[: -len("_demo")]
    return stem.replace("_", " ")


def build_libero_manifest(
    suite_dir: str | Path,
    train_ratio: float = 0.9,
    seed: int = 7,
    max_files: int | None = None,
    max_train_episodes: int | None = None,
    max_val_episodes: int | None = None,
) -> dict[str, Any]:
    if not (0.0 < train_ratio < 1.0):
        raise ValueError(f"train_ratio 必须在 (0, 1) 内，当前是 {train_ratio}")

    suite_path = Path(suite_dir).expanduser().resolve()
    if not any(suite_path.glob("*.hdf5")):
        nested_suite = suite_path / "libero_spatial"
        if nested_suite.exists() and any(nested_suite.glob("*.hdf5")):
            suite_path = nested_suite.resolve()

    demo_files = sorted(suite_path.rglob("*.hdf5"))
    if max_files is not None:
        demo_files = demo_files[:max_files]
    if not demo_files:
        raise FileNotFoundError(f"{suite_path} 下没有找到任何 .hdf5 demo 文件")

    rng = random.Random(seed)
    train_episodes: list[dict[str, Any]] = []
    val_episodes: list[dict[str, Any]] = []
    file_summaries: list[dict[str, Any]] = []
    available_cameras: list[str] | None = None
    action_dim: int | None = None
    proprio_dim: int | None = None

    for demo_path in demo_files:
        with h5py.File(demo_path, "r") as demo_file:
            if "data" not in demo_file:
                continue
            episode_keys = sorted(demo_file["data"].keys(), key=_episode_sort_key)
            if len(episode_keys) < 2:
                continue

            shuffled_keys = list(episode_keys)
            rng.shuffle(shuffled_keys)
            split_index = max(1, min(len(shuffled_keys) - 1, int(len(shuffled_keys) * train_ratio)))
            train_keys = sorted(shuffled_keys[:split_index], key=_episode_sort_key)
            val_keys = sorted(shuffled_keys[split_index:], key=_episode_sort_key)

            if max_train_episodes is not None:
                train_keys = train_keys[:max_train_episodes]
            if max_val_episodes is not None:
                val_keys = val_keys[:max_val_episodes]

            example_episode = demo_file["data"][episode_keys[0]]
            if action_dim is None:
                action_dim = int(example_episode["actions"].shape[-1])
            if proprio_dim is None:
                proprio_dim = int(_extract_proprio_array(example_episode).shape[-1])
            if available_cameras is None:
                available_cameras = [key for key in example_episode["obs"].keys() if key.endswith("_rgb")]

            instruction = infer_instruction_from_demo_name(demo_path)
            relpath = str(demo_path.relative_to(suite_path))

            for split_name, selected_keys, sink in (
                ("train", train_keys, train_episodes),
                ("val", val_keys, val_episodes),
            ):
                for episode_key in selected_keys:
                    episode = demo_file["data"][episode_key]
                    num_samples = int(episode.attrs.get("num_samples", episode["actions"].shape[0]))
                    sink.append(
                        {
                            "split": split_name,
                            "demo_relpath": relpath,
                            "episode_key": episode_key,
                            "instruction": instruction,
                            "num_samples": num_samples,
                        }
                    )

            file_summaries.append(
                {
                    "demo_relpath": relpath,
                    "instruction": instruction,
                    "num_total_episodes": len(episode_keys),
                    "num_train_episodes": len(train_keys),
                    "num_val_episodes": len(val_keys),
                }
            )

    if not train_episodes or not val_episodes:
        raise RuntimeError("manifest 构建失败，train/val 至少各需要一个 episode")

    return {
        "suite_dir": suite_path.name,
        "seed": seed,
        "train_ratio": train_ratio,
        "num_demo_files": len(file_summaries),
        "num_train_episodes": len(train_episodes),
        "num_val_episodes": len(val_episodes),
        "action_dim": action_dim,
        "proprio_dim": proprio_dim,
        "available_cameras": available_cameras or [],
        "train_episodes": train_episodes,
        "val_episodes": val_episodes,
        "files": file_summaries,
    }


def save_manifest(manifest: dict[str, Any], out_path: str | Path) -> Path:
    target = Path(out_path).expanduser().resolve()
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    return target


def load_manifest(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).expanduser().resolve().read_text())


def _extract_proprio_array(episode: h5py.Group) -> np.ndarray:
    if "robot_states" in episode:
        return np.asarray(episode["robot_states"], dtype=np.float32)
    obs_group = episode["obs"]
    chunks = []
    for key in ("ee_states", "gripper_states", "joint_states"):
        if key in obs_group:
            chunks.append(np.asarray(obs_group[key], dtype=np.float32))
    if not chunks:
        raise KeyError("没有找到可用的 proprio 输入，预期字段: robot_states 或 obs/{ee_states,gripper_states,joint_states}")
    return np.concatenate(chunks, axis=-1)


def compute_normalization_stats(
    manifest: dict[str, Any],
    suite_dir: str | Path,
    split: str = "train",
) -> dict[str, Any]:
    entries = manifest[f"{split}_episodes"]
    suite_path = Path(suite_dir).expanduser().resolve()

    action_sum = None
    action_sq_sum = None
    state_sum = None
    state_sq_sum = None
    num_rows = 0

    for entry in entries:
        demo_path = suite_path / entry["demo_relpath"]
        with h5py.File(demo_path, "r") as demo_file:
            episode = demo_file["data"][entry["episode_key"]]
            actions = np.asarray(episode["actions"], dtype=np.float32)
            proprio = _extract_proprio_array(episode)

        if action_sum is None:
            action_sum = np.zeros(actions.shape[-1], dtype=np.float64)
            action_sq_sum = np.zeros(actions.shape[-1], dtype=np.float64)
            state_sum = np.zeros(proprio.shape[-1], dtype=np.float64)
            state_sq_sum = np.zeros(proprio.shape[-1], dtype=np.float64)

        action_sum += actions.sum(axis=0)
        action_sq_sum += np.square(actions).sum(axis=0)
        state_sum += proprio.sum(axis=0)
        state_sq_sum += np.square(proprio).sum(axis=0)
        num_rows += int(actions.shape[0])

    if num_rows == 0:
        raise RuntimeError("无法计算归一化统计量，因为没有可用样本")

    action_mean = action_sum / num_rows
    action_var = np.maximum(action_sq_sum / num_rows - np.square(action_mean), 1e-6)
    state_mean = state_sum / num_rows
    state_var = np.maximum(state_sq_sum / num_rows - np.square(state_mean), 1e-6)

    return {
        "num_rows": num_rows,
        "action_mean": action_mean.astype(np.float32).tolist(),
        "action_std": np.sqrt(action_var).astype(np.float32).tolist(),
        "state_mean": state_mean.astype(np.float32).tolist(),
        "state_std": np.sqrt(state_var).astype(np.float32).tolist(),
    }


def _resize_image(image: np.ndarray, image_size: int) -> torch.Tensor:
    pil = Image.fromarray(image)
    pil = pil.resize((image_size, image_size), Image.Resampling.BILINEAR)
    arr = np.asarray(pil, dtype=np.float32) / 255.0
    arr = (arr - 0.5) / 0.5
    return torch.from_numpy(np.transpose(arr, (2, 0, 1)))


class LiberoStepDataset(Dataset):
    def __init__(
        self,
        manifest: dict[str, Any],
        suite_dir: str | Path,
        split: str,
        tokenizer: SimpleTokenizer,
        camera_names: list[str],
        image_size: int,
        max_text_tokens: int,
        sample_stride: int = 1,
        max_samples: int | None = None,
        stats: dict[str, Any] | None = None,
    ) -> None:
        super().__init__()
        self.manifest = manifest
        self.suite_dir = Path(suite_dir).expanduser().resolve()
        self.split = split
        self.tokenizer = tokenizer
        self.camera_names = camera_names
        self.image_size = image_size
        self.max_text_tokens = max_text_tokens
        self.sample_stride = max(1, sample_stride)
        self.max_samples = max_samples

        self.action_mean = None if not stats else np.asarray(stats["action_mean"], dtype=np.float32)
        self.action_std = None if not stats else np.asarray(stats["action_std"], dtype=np.float32)
        self.state_mean = None if not stats else np.asarray(stats["state_mean"], dtype=np.float32)
        self.state_std = None if not stats else np.asarray(stats["state_std"], dtype=np.float32)

        self.sample_index: list[dict[str, Any]] = []
        for entry in manifest[f"{split}_episodes"]:
            for timestep in range(0, int(entry["num_samples"]), self.sample_stride):
                self.sample_index.append(
                    {
                        "demo_relpath": entry["demo_relpath"],
                        "episode_key": entry["episode_key"],
                        "instruction": entry["instruction"],
                        "timestep": timestep,
                    }
                )
        if self.max_samples is not None:
            self.sample_index = self.sample_index[: self.max_samples]

    def __len__(self) -> int:
        return len(self.sample_index)

    def __getitem__(self, index: int) -> dict[str, Any]:
        record = self.sample_index[index]
        demo_path = self.suite_dir / record["demo_relpath"]
        with h5py.File(demo_path, "r") as demo_file:
            episode = demo_file["data"][record["episode_key"]]
            obs_group = episode["obs"]
            images = []
            for camera_name in self.camera_names:
                if camera_name not in obs_group:
                    raise KeyError(f"{demo_path.name}:{record['episode_key']} 缺少相机字段 {camera_name}")
                images.append(_resize_image(obs_group[camera_name][record["timestep"]], self.image_size))
            proprio = _extract_proprio_array(episode)[record["timestep"]]
            action = np.asarray(episode["actions"][record["timestep"]], dtype=np.float32)

        if self.state_mean is not None and self.state_std is not None:
            proprio = (proprio - self.state_mean) / self.state_std
        if self.action_mean is not None and self.action_std is not None:
            action = (action - self.action_mean) / self.action_std

        encoded = self.tokenizer.encode(record["instruction"], max_length=self.max_text_tokens)
        return {
            "images": torch.stack(images, dim=0),
            "proprio": torch.tensor(proprio, dtype=torch.float32),
            "action": torch.tensor(action, dtype=torch.float32),
            "input_ids": encoded.input_ids,
            "attention_mask": encoded.attention_mask,
            "instruction": record["instruction"],
        }


def collate_batch(batch: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "images": torch.stack([item["images"] for item in batch], dim=0),
        "proprio": torch.stack([item["proprio"] for item in batch], dim=0),
        "action": torch.stack([item["action"] for item in batch], dim=0),
        "input_ids": torch.stack([item["input_ids"] for item in batch], dim=0),
        "attention_mask": torch.stack([item["attention_mask"] for item in batch], dim=0),
        "instructions": [item["instruction"] for item in batch],
    }
