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


def _normalize_text_source(value: Any) -> str:
    text = str(value or "task_template").strip().lower().replace("-", "_").replace(" ", "_")
    if text == "template":
        return "task_template"
    if text == "override":
        return "task_template"
    return text


def _upgrade_legacy_payload(payload: dict[str, Any]) -> dict[str, Any]:
    upgraded = dict(payload)

    if "horizon" in upgraded and "n_pred_steps" not in upgraded:
        upgraded["n_pred_steps"] = upgraded.pop("horizon")
    else:
        upgraded.pop("horizon", None)

    robot_state_dim = upgraded.pop("robot_state_dim", None)
    action_dim = upgraded.pop("action_dim", None)
    if "y_dim" not in upgraded:
        if robot_state_dim is not None:
            upgraded["y_dim"] = robot_state_dim
        elif action_dim is not None:
            upgraded["y_dim"] = action_dim

    if "task_text_mode" in upgraded and "text_source" not in upgraded:
        upgraded["text_source"] = _normalize_text_source(upgraded.pop("task_text_mode"))
    elif "text_source" in upgraded:
        upgraded["text_source"] = _normalize_text_source(upgraded["text_source"])

    if "use_amp" in upgraded and "train_use_amp" not in upgraded:
        upgraded["train_use_amp"] = upgraded.pop("use_amp")
    else:
        upgraded.pop("use_amp", None)

    if "optimizer_lr" in upgraded and "learning_rate" not in upgraded:
        upgraded["learning_rate"] = upgraded.pop("optimizer_lr")
    else:
        upgraded.pop("optimizer_lr", None)

    if "optimizer_betas" in upgraded and "betas" not in upgraded:
        upgraded["betas"] = upgraded.pop("optimizer_betas")
    else:
        upgraded.pop("optimizer_betas", None)

    if "optimizer_eps" in upgraded and "eps" not in upgraded:
        upgraded["eps"] = upgraded.pop("optimizer_eps")
    else:
        upgraded.pop("optimizer_eps", None)

    optimizer_weight_decay = upgraded.pop("optimizer_weight_decay", None)
    if optimizer_weight_decay is not None:
        upgraded.setdefault("transformer_weight_decay", optimizer_weight_decay)
        upgraded.setdefault("obs_encoder_weight_decay", optimizer_weight_decay)

    if "use_ema" in upgraded and "ema_enable" not in upgraded:
        upgraded["ema_enable"] = upgraded.pop("use_ema")
    else:
        upgraded.pop("use_ema", None)

    if "task_text_override" in upgraded:
        upgraded["task_text_override"] = upgraded["task_text_override"]

    text_encoder = upgraded.pop("text_encoder", None)
    if isinstance(text_encoder, dict):
        if "text_model_name" not in upgraded and text_encoder.get("model") is not None:
            upgraded["text_model_name"] = text_encoder["model"]

    history_encoder = upgraded.get("history_encoder")
    if isinstance(history_encoder, dict) and "pretrained" not in history_encoder:
        history_encoder = dict(history_encoder)
        history_encoder["pretrained"] = False
        upgraded["history_encoder"] = history_encoder

    transformer = upgraded.pop("transformer", None)
    if isinstance(transformer, dict):
        transformer_mapping = {
            "hidden_dim": "hidden_dim",
            "num_layers": "num_blocks",
            "num_heads": "nhead",
            "dropout": "dropout",
            "use_positional_encoding": "use_positional_encoding",
            "diffusion_step_embed_dim": "time_dim",
            "use_rope": "use_rope",
            "rope_base": "rope_base",
        }
        for source_key, target_key in transformer_mapping.items():
            if target_key not in upgraded and source_key in transformer:
                upgraded[target_key] = transformer[source_key]

    objective = upgraded.pop("objective", None)
    if isinstance(objective, dict):
        if "fm_sigma_min" not in upgraded and objective.get("sigma_min") is not None:
            upgraded["fm_sigma_min"] = objective["sigma_min"]
        if "fm_num_integration_steps" not in upgraded and objective.get("num_integration_steps") is not None:
            upgraded["fm_num_integration_steps"] = objective["num_integration_steps"]
        if "fm_integration_method" not in upgraded and objective.get("integration_method") is not None:
            upgraded["fm_integration_method"] = objective["integration_method"]
        if "fm_loss_weights" not in upgraded and objective.get("loss_weights") is not None:
            upgraded["fm_loss_weights"] = objective["loss_weights"]
        timestep_sampling = objective.get("timestep_sampling")
        if isinstance(timestep_sampling, dict):
            if "fm_timestep_sampling_strategy" not in upgraded and timestep_sampling.get("strategy_name") is not None:
                upgraded["fm_timestep_sampling_strategy"] = timestep_sampling["strategy_name"]
            if "fm_timestep_beta_s" not in upgraded and timestep_sampling.get("s") is not None:
                upgraded["fm_timestep_beta_s"] = timestep_sampling["s"]
            if "fm_timestep_beta_alpha" not in upgraded and timestep_sampling.get("alpha") is not None:
                upgraded["fm_timestep_beta_alpha"] = timestep_sampling["alpha"]
            if "fm_timestep_beta_beta" not in upgraded and timestep_sampling.get("beta") is not None:
                upgraded["fm_timestep_beta_beta"] = timestep_sampling["beta"]

    upgraded.pop("film", None)
    upgraded.pop("fusion_transformer", None)
    upgraded.pop("normalization_mode", None)

    upgraded.setdefault("obs_mode", "rgb")
    upgraded.setdefault("encoder_name", "clip_rgb_history_token")
    upgraded.setdefault("backbone_name", "dit")
    upgraded.setdefault("fm_variant", "standard")
    upgraded.setdefault("text_source", "task_template")
    upgraded.setdefault("vision_backbone_name", "vit_base_patch16_clip_224.openai")
    upgraded.setdefault("vision_pretrained", True)
    upgraded.setdefault("vision_image_size", [224, 224])
    upgraded.setdefault("vision_train_mode", "last_block")
    upgraded.setdefault("vision_num_unfreeze_blocks", 1)
    upgraded.setdefault("text_model_name", "openai/clip-vit-base-patch16")
    upgraded.setdefault("text_projection_dim", 256)
    upgraded.setdefault("token_fusion_mode", "3_token")
    upgraded.setdefault("obs_features_dim", 256)
    upgraded.setdefault("hidden_dim", 512)
    upgraded.setdefault("time_dim", 256)
    upgraded.setdefault("num_blocks", 6)
    upgraded.setdefault("nhead", 8)
    upgraded.setdefault("dim_feedforward", 2048)
    upgraded.setdefault("dropout", 0.1)
    upgraded.setdefault("learning_rate", 2.0e-5)
    upgraded.setdefault("betas", [0.95, 0.999])
    upgraded.setdefault("eps", 1.0e-8)
    upgraded.setdefault("transformer_weight_decay", 0.0)
    upgraded.setdefault("obs_encoder_weight_decay", 0.0)
    upgraded.setdefault("train_use_amp", True)
    upgraded.setdefault("train_amp_dtype", "bfloat16")
    upgraded.setdefault("ema_enable", True)
    upgraded.setdefault(
        "history_encoder",
        {
            "backbone": "efficientnet-b0",
            "pretrained": False,
            "features_per_group": 16,
        },
    )
    return upgraded


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
    payload = _upgrade_legacy_payload(payload)
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
    alias_map = {
        "horizon": "n_pred_steps",
        "robot_state_dim": "y_dim",
        "action_dim": "y_dim",
        "task_text_mode": "text_source",
        "use_amp": "train_use_amp",
        "optimizer_lr": "learning_rate",
        "optimizer_betas": "betas",
        "optimizer_eps": "eps",
        "optimizer_weight_decay": "transformer_weight_decay",
        "use_ema": "ema_enable",
        "text_encoder.model": "text_model_name",
        "transformer.hidden_dim": "hidden_dim",
        "transformer.num_layers": "num_blocks",
        "transformer.num_heads": "nhead",
        "transformer.dropout": "dropout",
        "transformer.use_positional_encoding": "use_positional_encoding",
        "transformer.diffusion_step_embed_dim": "time_dim",
        "transformer.use_rope": "use_rope",
        "transformer.rope_base": "rope_base",
        "objective.sigma_min": "fm_sigma_min",
        "objective.num_integration_steps": "fm_num_integration_steps",
        "objective.integration_method": "fm_integration_method",
        "objective.loss_weights": "fm_loss_weights",
        "objective.timestep_sampling.strategy_name": "fm_timestep_sampling_strategy",
        "objective.timestep_sampling.s": "fm_timestep_beta_s",
        "objective.timestep_sampling.alpha": "fm_timestep_beta_alpha",
        "objective.timestep_sampling.beta": "fm_timestep_beta_beta",
    }

    for key, value in overrides.items():
        key = alias_map.get(str(key), str(key))
        cursor = payload
        parts = key.split(".")
        for part in parts[:-1]:
            if part not in cursor or not isinstance(cursor[part], dict):
                raise KeyError(f"Unknown nested config override key: {key}")
            cursor = cursor[part]
        leaf = parts[-1]
        if leaf not in cursor:
            raise KeyError(f"Unknown config override key: {key}")
        cursor[leaf] = value

        if key == "transformer_weight_decay":
            payload["obs_encoder_weight_decay"] = value

    return config_from_dict(payload)
