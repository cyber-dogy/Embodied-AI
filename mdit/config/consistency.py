from __future__ import annotations

from dataclasses import asdict
from datetime import datetime
import json
from pathlib import Path
from typing import Any, Iterable

from common.task_text import build_task_text_contract

from .loader import config_to_dict
from .schema import ExperimentConfig


EXPERIMENT_MANIFEST_FILENAME = "experiment_manifest.json"
EVAL_MANIFEST_DIRNAME = "eval_manifests"
TRAIN_HEARTBEAT_FILENAME = "train_heartbeat.json"
EVAL_OVERRIDE_KEYS = {"seed", "device", "eval_step_heartbeat_every"}
EVAL_CONTRACT_KEYS = (
    "task_name",
    "obs_mode",
    "encoder_name",
    "backbone_name",
    "n_obs_steps",
    "n_pred_steps",
    "subs_factor",
    "obs_features_dim",
    "y_dim",
    "camera_names",
    "text_source",
    "task_text_override",
    "effective_task_text",
    "vision_backbone_name",
    "vision_train_mode",
    "vision_num_unfreeze_blocks",
    "text_model_name",
    "text_projection_dim",
    "token_fusion_mode",
    "learning_rate",
    "betas",
    "train_use_amp",
    "ema_enable",
    "hidden_dim",
    "time_dim",
    "num_blocks",
    "nhead",
    "dim_feedforward",
    "dropout",
    "decoder_condition_mode",
    "robot_state_mean",
    "robot_state_std",
    "fm_num_k_infer",
    "fm_flow_schedule",
    "fm_exp_scale",
    "command_mode",
    "horizon_index",
    "average_first_n",
    "smooth_actions",
    "position_alpha",
    "rotation_alpha",
    "max_position_step",
    "gripper_open_threshold",
    "gripper_close_threshold",
)
RECIPE_DRIFT_KEYS = EVAL_CONTRACT_KEYS + (
    "batch_size",
    "grad_accum_steps",
    "checkpoint_every_epochs",
    "train_epochs",
)


def _normalize_json_value(value: Any) -> Any:
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, tuple):
        return [_normalize_json_value(item) for item in value]
    if isinstance(value, list):
        return [_normalize_json_value(item) for item in value]
    if isinstance(value, dict):
        return {
            str(key): _normalize_json_value(val)
            for key, val in sorted(value.items(), key=lambda item: str(item[0]))
        }
    return value


def _cfg_payload(cfg: ExperimentConfig | dict[str, Any]) -> dict[str, Any]:
    if isinstance(cfg, ExperimentConfig):
        payload = config_to_dict(cfg)
    else:
        payload = dict(cfg)
    return {str(key): _normalize_json_value(value) for key, value in payload.items()}


def effective_task_text_from_cfg(
    cfg: ExperimentConfig | dict[str, Any],
    *,
    descriptions: Iterable[str] | None = None,
) -> str:
    payload = _cfg_payload(cfg)
    return str(
        build_task_text_contract(
            str(payload["task_name"]),
            text_source=str(payload.get("text_source") or "task_template"),
            descriptions=descriptions,
            override_text=payload.get("task_text_override"),
        )["effective_task_text"]
    )


def build_eval_contract(
    cfg: ExperimentConfig | dict[str, Any],
    *,
    descriptions: Iterable[str] | None = None,
) -> dict[str, Any]:
    payload = _cfg_payload(cfg)
    text_contract = build_task_text_contract(
        str(payload["task_name"]),
        text_source=str(payload.get("text_source") or "task_template"),
        descriptions=descriptions,
        override_text=payload.get("task_text_override"),
    )
    contract = {
        "task_name": str(payload["task_name"]),
        "obs_mode": str(payload["obs_mode"]),
        "encoder_name": str(payload["encoder_name"]),
        "backbone_name": str(payload["backbone_name"]),
        "n_obs_steps": int(payload["n_obs_steps"]),
        "n_pred_steps": int(payload["n_pred_steps"]),
        "subs_factor": int(payload["subs_factor"]),
        "obs_features_dim": int(payload["obs_features_dim"]),
        "y_dim": int(payload["y_dim"]),
        "camera_names": list(payload["camera_names"]),
        "vision_backbone_name": str(payload["vision_backbone_name"]),
        "vision_train_mode": str(payload["vision_train_mode"]),
        "vision_num_unfreeze_blocks": int(payload["vision_num_unfreeze_blocks"]),
        "text_model_name": str(payload["text_model_name"]),
        "text_projection_dim": int(payload["text_projection_dim"]),
        "token_fusion_mode": str(payload["token_fusion_mode"]),
        "learning_rate": float(payload["learning_rate"]),
        "betas": [float(beta) for beta in payload["betas"]],
        "train_use_amp": bool(payload["train_use_amp"]),
        "ema_enable": bool(payload["ema_enable"]),
        "hidden_dim": int(payload["hidden_dim"]),
        "time_dim": int(payload["time_dim"]),
        "num_blocks": int(payload["num_blocks"]),
        "nhead": int(payload["nhead"]),
        "dim_feedforward": int(payload["dim_feedforward"]),
        "dropout": float(payload["dropout"]),
        "decoder_condition_mode": str(payload["decoder_condition_mode"]),
        "robot_state_mean": payload.get("robot_state_mean"),
        "robot_state_std": payload.get("robot_state_std"),
        "fm_num_k_infer": int(payload["fm_num_k_infer"]),
        "fm_flow_schedule": str(payload["fm_flow_schedule"]),
        "fm_exp_scale": float(payload["fm_exp_scale"]),
        "command_mode": str(payload["command_mode"]),
        "horizon_index": int(payload["horizon_index"]),
        "average_first_n": int(payload["average_first_n"]),
        "smooth_actions": bool(payload["smooth_actions"]),
        "position_alpha": float(payload["position_alpha"]),
        "rotation_alpha": float(payload["rotation_alpha"]),
        "max_position_step": float(payload["max_position_step"]),
        "gripper_open_threshold": float(payload["gripper_open_threshold"]),
        "gripper_close_threshold": float(payload["gripper_close_threshold"]),
    }
    contract.update(text_contract)
    return {str(key): _normalize_json_value(value) for key, value in contract.items()}


def build_recipe_contract(
    cfg: ExperimentConfig | dict[str, Any],
    *,
    descriptions: Iterable[str] | None = None,
) -> dict[str, Any]:
    payload = _cfg_payload(cfg)
    contract = build_eval_contract(payload, descriptions=descriptions)
    contract.update(
        {
            "batch_size": int(payload["batch_size"]),
            "grad_accum_steps": int(payload["grad_accum_steps"]),
            "checkpoint_every_epochs": int(payload["checkpoint_every_epochs"]),
            "train_epochs": int(payload["train_epochs"]),
        }
    )
    return contract


def build_contract_diff(
    base_contract: dict[str, Any],
    resolved_contract: dict[str, Any],
    *,
    keys: Iterable[str],
) -> list[dict[str, Any]]:
    diff: list[dict[str, Any]] = []
    for key in keys:
        base_value = _normalize_json_value(base_contract.get(key))
        resolved_value = _normalize_json_value(resolved_contract.get(key))
        if base_value == resolved_value:
            continue
        diff.append(
            {
                "key": str(key),
                "base_value": base_value,
                "resolved_value": resolved_value,
            }
        )
    return diff


def compare_eval_contract(
    training_contract: dict[str, Any],
    eval_contract: dict[str, Any],
) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    for key in EVAL_CONTRACT_KEYS:
        training_value = _normalize_json_value(training_contract.get(key))
        eval_value = _normalize_json_value(eval_contract.get(key))
        if training_value == eval_value:
            continue
        issues.append(
            {
                "key": str(key),
                "training_value": training_value,
                "eval_value": eval_value,
            }
        )
    return issues


def experiment_manifest_path(run_dir: Path) -> Path:
    return Path(run_dir) / EXPERIMENT_MANIFEST_FILENAME


def infer_run_dir_from_ckpt(ckpt_path: Path) -> Path:
    ckpt_path = Path(ckpt_path).expanduser().resolve()
    if ckpt_path.parent.name == "epochs":
        return ckpt_path.parent.parent
    return ckpt_path.parent


def eval_manifest_dir(run_dir: Path) -> Path:
    return Path(run_dir) / EVAL_MANIFEST_DIRNAME


def eval_manifest_path(
    run_dir: Path,
    *,
    ckpt_path: Path,
    seed: int,
    episodes: int,
    max_steps: int,
    prefer_ema: bool,
) -> Path:
    ckpt_label = Path(ckpt_path).stem
    file_name = (
        f"{ckpt_label}__seed={int(seed)}__episodes={int(episodes)}__max_steps={int(max_steps)}"
        f"__ema={int(bool(prefer_ema))}.json"
    )
    return eval_manifest_dir(run_dir) / file_name


def train_heartbeat_path(run_dir: Path) -> Path:
    return Path(run_dir) / TRAIN_HEARTBEAT_FILENAME


def write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def load_experiment_manifest(run_dir: Path) -> dict[str, Any] | None:
    path = experiment_manifest_path(run_dir)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def build_experiment_manifest_payload(
    *,
    line: str,
    lane: str,
    strategy: str,
    base_config_path: Path,
    base_cfg: ExperimentConfig,
    resolved_cfg: ExperimentConfig,
    config_overrides: dict[str, Any] | None,
    trial_request: dict[str, Any],
    resolved_trial_request: dict[str, Any],
) -> dict[str, Any]:
    base_payload = _cfg_payload(base_cfg)
    resolved_payload = _cfg_payload(resolved_cfg)
    base_recipe = build_recipe_contract(base_cfg)
    resolved_recipe = build_recipe_contract(resolved_cfg)
    recipe_drift_details = build_contract_diff(
        base_recipe,
        resolved_recipe,
        keys=RECIPE_DRIFT_KEYS,
    )
    return {
        "line": str(line),
        "lane": str(lane),
        "created_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "base_config_path": str(Path(base_config_path).expanduser().resolve()),
        "base_config": base_payload,
        "resolved_config": resolved_payload,
        "config_overrides": dict(config_overrides or {}),
        "trial_request": dict(trial_request),
        "resolved_trial_request": dict(resolved_trial_request),
        "strategy": str(strategy),
        "effective_task_text": effective_task_text_from_cfg(resolved_cfg),
        "eval_contract": build_eval_contract(resolved_cfg),
        "recipe_contract": resolved_recipe,
        "recipe_drift": bool(recipe_drift_details),
        "recipe_drift_details": recipe_drift_details,
    }


def build_eval_manifest_payload(
    *,
    ckpt_path: Path,
    strategy: str,
    seed: int,
    episodes: int,
    max_steps: int,
    headless: bool,
    show_progress: bool,
    prefer_ema: bool,
    heartbeat_every: int | None,
    runtime_overrides: dict[str, Any],
    training_manifest: dict[str, Any] | None,
    eval_cfg: ExperimentConfig,
    contract_issues: list[dict[str, Any]],
) -> dict[str, Any]:
    training_contract = None if training_manifest is None else dict(training_manifest.get("eval_contract") or {})
    return {
        "created_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "ckpt_path": str(Path(ckpt_path).expanduser().resolve()),
        "strategy": str(strategy),
        "seed": int(seed),
        "episodes": int(episodes),
        "max_steps": int(max_steps),
        "headless": bool(headless),
        "show_progress": bool(show_progress),
        "prefer_ema": bool(prefer_ema),
        "heartbeat_every": None if heartbeat_every is None else int(heartbeat_every),
        "runtime_overrides": {str(key): _normalize_json_value(value) for key, value in runtime_overrides.items()},
        "training_manifest_path": None if training_manifest is None else training_manifest.get("manifest_path"),
        "training_recipe_drift": None if training_manifest is None else bool(training_manifest.get("recipe_drift")),
        "training_contract": training_contract,
        "eval_contract": build_eval_contract(eval_cfg),
        "contract_issues": contract_issues,
        "recipe_drift": bool(contract_issues),
    }


def attach_manifest_path(manifest: dict[str, Any] | None, manifest_path: Path | None) -> dict[str, Any] | None:
    if manifest is None:
        return None
    payload = dict(manifest)
    payload["manifest_path"] = None if manifest_path is None else str(Path(manifest_path).resolve())
    return payload

