from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any


def package_root() -> Path:
    return Path(__file__).resolve().parents[1]


@dataclass
class DataConfig:
    data_root: str | None = None
    manifest_path: str | None = None
    train_ratio: float = 0.9
    seed: int = 7
    max_files: int | None = None
    camera_names: list[str] = field(default_factory=lambda: ["agentview_rgb", "eye_in_hand_rgb"])
    image_size: int = 96
    max_text_tokens: int = 24
    sample_stride: int = 2
    max_train_episodes: int | None = None
    max_val_episodes: int | None = None
    max_train_samples: int | None = None
    max_val_samples: int | None = None


@dataclass
class ModelConfig:
    hidden_dim: int = 256
    num_heads: int = 8
    depth: int = 6
    mlp_ratio: float = 4.0
    dropout: float = 0.1


@dataclass
class TrainConfig:
    batch_size: int = 16
    num_workers: int = 0
    epochs: int = 20
    lr: float = 2e-4
    weight_decay: float = 1e-4
    warmup_steps: int = 200
    grad_clip_norm: float = 1.0
    use_amp: bool = True
    log_every: int = 25
    max_train_steps_per_epoch: int | None = None
    max_val_steps: int | None = None


@dataclass
class RunConfig:
    run_root: str | None = None
    run_name: str = "openvla_libero_run"


@dataclass
class ExperimentConfig:
    data: DataConfig = field(default_factory=DataConfig)
    model: ModelConfig = field(default_factory=ModelConfig)
    train: TrainConfig = field(default_factory=TrainConfig)
    run: RunConfig = field(default_factory=RunConfig)


def _deep_merge(base: dict[str, Any], update: dict[str, Any]) -> dict[str, Any]:
    merged = dict(base)
    for key, value in update.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def asdict_config(config: ExperimentConfig) -> dict[str, Any]:
    return asdict(config)


def load_experiment_config(config_path: str | Path | None = None) -> ExperimentConfig:
    payload = asdict(ExperimentConfig())
    if config_path is not None:
        path = Path(config_path).expanduser().resolve()
        user_payload = json.loads(path.read_text())
        payload = _deep_merge(payload, user_payload)
    return ExperimentConfig(
        data=DataConfig(**payload["data"]),
        model=ModelConfig(**payload["model"]),
        train=TrainConfig(**payload["train"]),
        run=RunConfig(**payload["run"]),
    )


def resolve_suite_dir(config: ExperimentConfig, override: str | Path | None = None) -> Path:
    candidates: list[Path] = []
    if override is not None:
        candidates.append(Path(override).expanduser())
    if config.data.data_root:
        candidates.append(Path(config.data.data_root).expanduser())
    env_root = os.getenv("OPENVLA_LIBERO_DATA_ROOT")
    if env_root:
        candidates.append(Path(env_root).expanduser())

    repo_default = package_root().parent / "libero" / "headless_tools" / "data" / "libero_datasets" / "libero_spatial"
    candidates.append(repo_default)

    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved.exists():
            if any(resolved.glob("*.hdf5")):
                return resolved
            suite_dir = resolved / "libero_spatial"
            if suite_dir.exists() and any(suite_dir.glob("*.hdf5")):
                return suite_dir.resolve()

    checked = "\n".join(str(candidate.resolve()) for candidate in candidates)
    raise FileNotFoundError(
        "没有找到 LIBERO suite 数据目录。请通过 config.data.data_root、"
        "OPENVLA_LIBERO_DATA_ROOT 或 --data-root 显式指定。\n"
        f"已检查路径:\n{checked}"
    )


def resolve_manifest_path(config: ExperimentConfig, suite_dir: Path) -> Path:
    if config.data.manifest_path:
        return Path(config.data.manifest_path).expanduser().resolve()
    return package_root() / "artifacts" / "manifests" / f"{suite_dir.name}_manifest.json"


def resolve_run_root(config: ExperimentConfig) -> Path:
    if config.run.run_root:
        return Path(config.run.run_root).expanduser().resolve()
    return package_root() / "artifacts" / "runs"

