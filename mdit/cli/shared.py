from __future__ import annotations

from ._bootstrap import bootstrap_local_cli_imports

bootstrap_local_cli_imports()

from pathlib import Path
from typing import Any

from mdit.config import ExperimentConfig, apply_config_overrides, config_from_dict
from mdit.config.consistency import (
    attach_manifest_path,
    build_eval_contract,
    build_eval_manifest_payload,
    compare_eval_contract,
    eval_manifest_path,
    experiment_manifest_path,
    infer_run_dir_from_ckpt,
    load_experiment_manifest,
    write_json,
)


def payload_cfg_to_experiment_cfg(
    payload_cfg: dict[str, Any],
    *,
    seed: int | None = None,
    ckpt_root: Path | None = None,
    heartbeat_every: int | None = None,
    device: str | None = None,
    config_overrides: dict[str, Any] | None = None,
) -> ExperimentConfig:
    cfg_dict = dict(payload_cfg)
    cfg_dict.update(
        {
            "wandb_enable": False,
            "wandb_mode": "disabled",
            "success_selection_every_epochs": 0,
            "success_selection_episodes": 0,
            "standard_eval_episodes": 0,
            "resume_from_latest": False,
        }
    )
    if seed is not None:
        cfg_dict["seed"] = int(seed)
    if ckpt_root is not None:
        cfg_dict["ckpt_root"] = Path(ckpt_root)
    if heartbeat_every is not None:
        cfg_dict["eval_step_heartbeat_every"] = int(heartbeat_every)
    if device is not None:
        cfg_dict["device"] = str(device)
    cfg = config_from_dict(cfg_dict)
    return apply_config_overrides(cfg, config_overrides)


def prepare_eval_manifest(
    *,
    ckpt_path: Path,
    payload: dict[str, Any],
    cfg: ExperimentConfig,
    strategy: str,
    seed: int,
    episodes: int,
    max_steps: int,
    headless: bool,
    show_progress: bool,
    prefer_ema: bool,
    heartbeat_every: int | None,
    fail_on_recipe_drift: bool = True,
) -> tuple[dict[str, Any], Path]:
    run_dir = infer_run_dir_from_ckpt(ckpt_path)
    manifest_path = experiment_manifest_path(run_dir)
    training_manifest = attach_manifest_path(
        load_experiment_manifest(run_dir),
        manifest_path if manifest_path.exists() else None,
    )
    if training_manifest is None:
        training_manifest = {
            "manifest_path": None,
            "recipe_drift": False,
            "eval_contract": dict(payload.get("eval_contract") or {}),
        }
    eval_contract = build_eval_contract(cfg)
    training_contract = dict(training_manifest.get("eval_contract") or {})
    contract_issues = [] if not training_contract else compare_eval_contract(training_contract, eval_contract)
    runtime_overrides = {
        "seed": int(seed),
        "device": str(cfg.device),
        "eval_step_heartbeat_every": None if heartbeat_every is None else int(heartbeat_every),
    }
    eval_manifest = build_eval_manifest_payload(
        ckpt_path=ckpt_path,
        strategy=str(strategy),
        seed=seed,
        episodes=episodes,
        max_steps=max_steps,
        headless=headless,
        show_progress=show_progress,
        prefer_ema=prefer_ema,
        heartbeat_every=heartbeat_every,
        runtime_overrides=runtime_overrides,
        training_manifest=training_manifest,
        eval_cfg=cfg,
        contract_issues=contract_issues,
    )
    path = eval_manifest_path(
        run_dir,
        ckpt_path=ckpt_path,
        seed=seed,
        episodes=episodes,
        max_steps=max_steps,
        prefer_ema=prefer_ema,
    )
    write_json(path, eval_manifest)
    if fail_on_recipe_drift and eval_manifest["contract_issues"]:
        raise ValueError(
            "Evaluation contract drift detected between training and checkpoint payload: "
            + "; ".join(
                f"{row['key']}={row['training_value']} -> {row['eval_value']}"
                for row in eval_manifest["contract_issues"]
            )
        )
    return eval_manifest, path
