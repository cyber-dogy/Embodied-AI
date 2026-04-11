from __future__ import annotations

from dataclasses import asdict, fields, is_dataclass
from enum import Enum
import json
from pathlib import Path
from typing import Any, get_args, get_origin, get_type_hints

from common.runtime import PROJECT_ROOT
from .schema import LeLaNExperimentConfig


def _json_load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _resolve_config_fragment_path(config_path: Path, section: str, value: str) -> Path:
    candidate = Path(value)
    if candidate.suffix != ".json":
        candidate = candidate.with_suffix(".json")
    if candidate.is_absolute():
        return candidate
    if len(candidate.parts) > 1:
        search_roots = [config_path.parent, PROJECT_ROOT / "configs", config_path.parent.parent]
        for root in search_roots:
            resolved = (root / candidate).resolve()
            if resolved.exists():
                return resolved
        return (config_path.parent / candidate).resolve()
    search_roots = [config_path.parent, PROJECT_ROOT / "configs", config_path.parent.parent]
    for root in search_roots:
        resolved = (root / section / candidate.name).resolve()
        if resolved.exists():
            return resolved
    return (config_path.parent / section / candidate.name).resolve()


def _deep_merge(base: dict[str, Any], update: dict[str, Any]) -> dict[str, Any]:
    merged = dict(base)
    for key, value in update.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def _compose_payload(config_path: Path, payload: dict[str, Any]) -> dict[str, Any]:
    if "extends" in payload:
        base_path = _resolve_config_fragment_path(config_path, "", str(payload["extends"]))
        base_payload = _compose_payload(base_path, _json_load(base_path))
        payload = dict(payload)
        payload.pop("extends")
        return _deep_merge(base_payload, payload)
    defaults = payload.get("defaults")
    if not isinstance(defaults, dict):
        return payload
    composed: dict[str, Any] = {}
    for section, name in defaults.items():
        if name is None:
            continue
        fragment_path = _resolve_config_fragment_path(config_path, str(section), str(name))
        fragment_payload = _compose_payload(fragment_path, _json_load(fragment_path))
        composed = _deep_merge(composed, fragment_payload)
    overrides = payload.get("overrides") or {}
    return _deep_merge(composed, overrides)


def _normalize_payload_paths(payload: dict[str, Any]) -> dict[str, Any]:
    normalized = dict(payload)
    for key in ("train_data_path", "valid_data_path", "ckpt_root"):
        value = normalized.get(key)
        if value is None:
            continue
        value_path = Path(value)
        if not value_path.is_absolute():
            normalized[key] = str((PROJECT_ROOT / value_path).resolve())
    return normalized


def _coerce_dataclass(field_type: Any, value: Any) -> Any:
    if value is None:
        return None
    origin = get_origin(field_type)
    if origin is not None:
        args = [arg for arg in get_args(field_type) if arg is not type(None)]
        if len(args) == 1:
            return _coerce_dataclass(args[0], value)
    if is_dataclass(field_type) and isinstance(value, dict):
        nested_type_hints = get_type_hints(field_type)
        kwargs = {}
        for field in fields(field_type):
            if field.name not in value:
                continue
            nested_field_type = nested_type_hints.get(field.name, field.type)
            kwargs[field.name] = _coerce_dataclass(nested_field_type, value[field.name])
        return field_type(**kwargs)
    return value


def config_to_dict(cfg: LeLaNExperimentConfig) -> dict[str, Any]:
    def convert(value: Any) -> Any:
        if isinstance(value, Path):
            return str(value)
        if isinstance(value, Enum):
            return value.value
        if isinstance(value, dict):
            return {key: convert(item) for key, item in value.items()}
        if isinstance(value, (list, tuple)):
            return [convert(item) for item in value]
        return value

    return convert(asdict(cfg))


def save_config(cfg: LeLaNExperimentConfig, path: Path | None = None) -> Path:
    config_path = cfg.ckpt_dir / "config.json" if path is None else Path(path)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(
        json.dumps(config_to_dict(cfg), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return config_path


def config_from_dict(payload: dict[str, Any]) -> LeLaNExperimentConfig:
    type_hints = get_type_hints(LeLaNExperimentConfig)
    kwargs = {}
    for field in fields(LeLaNExperimentConfig):
        if field.name not in payload:
            continue
        field_type = type_hints.get(field.name, field.type)
        kwargs[field.name] = _coerce_dataclass(field_type, payload[field.name])
    return LeLaNExperimentConfig(**kwargs)


def load_config(path: str | Path) -> LeLaNExperimentConfig:
    config_path = Path(path).expanduser().resolve()
    payload = _compose_payload(config_path, _json_load(config_path))
    payload = _normalize_payload_paths(payload)
    return config_from_dict(payload)


def apply_config_overrides(
    cfg: LeLaNExperimentConfig,
    overrides: dict[str, Any] | None,
) -> LeLaNExperimentConfig:
    if not overrides:
        return cfg

    payload = config_to_dict(cfg)

    for key, value in overrides.items():
        cursor = payload
        parts = str(key).split(".")
        for part in parts[:-1]:
            if part not in cursor or not isinstance(cursor[part], dict):
                raise KeyError(f"Unknown nested config override key: {key}")
            cursor = cursor[part]
        leaf = parts[-1]
        if leaf not in cursor:
            raise KeyError(f"Unknown config override key: {key}")
        cursor[leaf] = value

    return config_from_dict(payload)
