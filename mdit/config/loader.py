from __future__ import annotations

from dataclasses import asdict, fields, is_dataclass
import json
from pathlib import Path
from typing import Any, get_args, get_origin, get_type_hints

from common.runtime import PROJECT_ROOT
from .schema import ExperimentConfig


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
    if not isinstance(overrides, dict):
        raise TypeError(f"Expected 'overrides' to be a mapping in {config_path}")
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


def _normalize_legacy_aliases(payload: dict[str, Any]) -> dict[str, Any]:
    normalized = dict(payload)
    if "n_pred_steps" not in normalized:
        for legacy_key in ("horizon", "pred_horizon"):
            if legacy_key in normalized:
                normalized["n_pred_steps"] = normalized[legacy_key]
                break
    if "n_obs_steps" not in normalized and "obs_horizon" in normalized:
        normalized["n_obs_steps"] = normalized["obs_horizon"]
    if "y_dim" not in normalized and "action_dim" in normalized:
        normalized["y_dim"] = normalized["action_dim"]

    # Old checkpoints may store optimizer knobs under task-specific names.
    if "learning_rate" not in normalized and "optimizer_lr" in normalized:
        normalized["learning_rate"] = normalized["optimizer_lr"]
    if "betas" not in normalized and "optimizer_betas" in normalized:
        normalized["betas"] = normalized["optimizer_betas"]
    if "eps" not in normalized and "optimizer_eps" in normalized:
        normalized["eps"] = normalized["optimizer_eps"]
    if "transformer_weight_decay" not in normalized and "optimizer_weight_decay" in normalized:
        normalized["transformer_weight_decay"] = normalized["optimizer_weight_decay"]
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


def config_from_dict(payload: dict[str, Any]) -> ExperimentConfig:
    payload = _normalize_legacy_aliases(payload)
    type_hints = get_type_hints(ExperimentConfig)
    kwargs = {}
    for field in fields(ExperimentConfig):
        if field.name not in payload:
            continue
        field_type = type_hints.get(field.name, field.type)
        kwargs[field.name] = _coerce_dataclass(field_type, payload[field.name])
    return ExperimentConfig(**kwargs)


def config_to_dict(cfg: ExperimentConfig) -> dict[str, Any]:
    payload = asdict(cfg)
    for key, value in list(payload.items()):
        if isinstance(value, Path):
            payload[key] = str(value)
    return payload


def save_config(cfg: ExperimentConfig, path: Path | None = None) -> Path:
    config_path = cfg.ckpt_dir / "config.json" if path is None else Path(path)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(
        json.dumps(config_to_dict(cfg), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return config_path


def load_config(path: str | Path) -> ExperimentConfig:
    config_path = Path(path).expanduser().resolve()
    raw_payload = _json_load(config_path)
    payload = _compose_payload(config_path, raw_payload)
    payload = _normalize_payload_paths(payload)
    return config_from_dict(payload)


def apply_config_overrides(
    cfg: ExperimentConfig,
    overrides: dict[str, Any] | None,
) -> ExperimentConfig:
    if not overrides:
        return cfg
    payload = config_to_dict(cfg)
    unknown_keys = sorted(set(overrides) - set(payload))
    if unknown_keys:
        raise KeyError(f"Unknown config override keys: {', '.join(unknown_keys)}")
    payload.update(overrides)
    return config_from_dict(payload)
