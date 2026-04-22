#!/usr/bin/env python3

from __future__ import annotations

import _bootstrap  # noqa: F401

import argparse
from datetime import datetime
import json
import os
from pathlib import Path
import shutil
import tempfile
from typing import Any

import torch

from mdit.config import apply_config_overrides, config_to_dict, load_config, save_config
from mdit.config.consistency import build_eval_contract, build_recipe_contract, effective_task_text_from_cfg


REQUIRED_PAYLOAD_KEYS = (
    "strategy",
    "model_state_dict",
    "optimizer_state_dict",
    "scheduler_state_dict",
    "scaler_state_dict",
    "completed_epoch",
    "global_step",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prepare a fresh 500-epoch MDIT resume run from a periodic source checkpoint.",
    )
    parser.add_argument(
        "--source-run-dir",
        type=Path,
        required=True,
        help="Source run directory that contains config.json and epochs/.",
    )
    parser.add_argument(
        "--source-epoch",
        type=int,
        default=100,
        help="Source periodic checkpoint epoch. Default: 100.",
    )
    parser.add_argument(
        "--target-run-name",
        type=str,
        default=None,
        help="New prepared run name. Default: <source>__resume_to_e0500.",
    )
    parser.add_argument(
        "--target-train-epochs",
        type=int,
        default=500,
        help="Total train_epochs for the prepared run. Default: 500.",
    )
    parser.add_argument(
        "--checkpoint-every",
        type=int,
        default=100,
        help="Periodic checkpoint cadence for the resumed run. Default: 100.",
    )
    parser.add_argument(
        "--success-every",
        type=int,
        default=100,
        help="Success selection cadence. Default: 100.",
    )
    parser.add_argument(
        "--success-episodes",
        type=int,
        default=20,
        help="Number of success-selection episodes. Default: 20.",
    )
    parser.add_argument(
        "--target-success-rate",
        type=float,
        default=0.75,
        help="Pause training once success rate reaches this threshold. Default: 0.75.",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=None,
        help="Optional override for target run batch_size.",
    )
    parser.add_argument(
        "--grad-accum-steps",
        type=int,
        default=None,
        help="Optional override for target run grad_accum_steps.",
    )
    parser.add_argument(
        "--batch-fallback-tiers",
        type=str,
        default=None,
        help='Optional JSON override for target run batch_fallback_tiers, e.g. "[[64,2],[32,4]]".',
    )
    parser.add_argument(
        "--force",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Overwrite target run dir if it already exists.",
    )
    return parser.parse_args()


def _atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(
        dir=str(path.parent),
        prefix=f".{path.name}.tmp.",
        suffix=".json",
    )
    os.close(fd)
    tmp = Path(tmp_path)
    try:
        tmp.write_text(
            json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        os.replace(tmp, path)
    finally:
        if tmp.exists():
            tmp.unlink()


def _atomic_save_payload(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(
        dir=str(path.parent),
        prefix=f".{path.name}.tmp.",
        suffix=".pt",
    )
    try:
        with os.fdopen(fd, "wb") as handle:
            torch.save(payload, handle)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp_path, path)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def _validate_source_payload(payload: dict[str, Any]) -> None:
    missing = [key for key in REQUIRED_PAYLOAD_KEYS if key not in payload]
    if missing:
        raise ValueError(f"source checkpoint is not resumable; missing keys: {missing}")


def _hardlink_file(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        dst.unlink()
    os.link(src, dst)


def _build_target_run_name(source_run_name: str, target_train_epochs: int) -> str:
    return f"{source_run_name}__resume_to_e{int(target_train_epochs):04d}"


def _load_json_if_exists(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    args = parse_args()
    source_run_dir = args.source_run_dir.expanduser().resolve()
    if not source_run_dir.exists():
        raise FileNotFoundError(f"source run dir not found: {source_run_dir}")

    source_config_path = source_run_dir / "config.json"
    if not source_config_path.exists():
        raise FileNotFoundError(f"source config missing: {source_config_path}")

    source_epoch_ckpt = source_run_dir / "epochs" / f"epoch_{int(args.source_epoch):04d}.pt"
    if not source_epoch_ckpt.exists():
        raise FileNotFoundError(f"source epoch checkpoint missing: {source_epoch_ckpt}")

    source_cfg = load_config(source_config_path)
    target_run_name = args.target_run_name or _build_target_run_name(
        source_cfg.run_name,
        int(args.target_train_epochs),
    )
    target_run_dir = source_cfg.ckpt_root / target_run_name

    if target_run_dir.exists():
        if not bool(args.force):
            raise FileExistsError(f"target run dir already exists: {target_run_dir}")
        shutil.rmtree(target_run_dir)

    overrides = {
        "run_name": target_run_name,
        "resume_from_latest": True,
        "train_epochs": int(args.target_train_epochs),
        "checkpoint_every_epochs": int(args.checkpoint_every),
        "success_selection_every_epochs": int(args.success_every),
        "success_selection_episodes": int(args.success_episodes),
        "stop_on_target_success": True,
        "target_success_rate": float(args.target_success_rate),
        "standard_eval_episodes": 0,
        # 这里明确开启 wandb resume 语义，但首次 latest 里不带 run_id，
        # 因此第一次启动会创建新 run，后续中断再接回同一个新 run。
        "wandb_resume": True,
    }
    if args.batch_size is not None:
        overrides["batch_size"] = int(args.batch_size)
    if args.grad_accum_steps is not None:
        overrides["grad_accum_steps"] = int(args.grad_accum_steps)
    if args.batch_fallback_tiers is not None:
        overrides["batch_fallback_tiers"] = json.loads(args.batch_fallback_tiers)
    target_cfg = apply_config_overrides(source_cfg, overrides)
    target_run_dir.mkdir(parents=True, exist_ok=True)
    save_config(target_cfg)

    payload = torch.load(source_epoch_ckpt, map_location="cpu")
    _validate_source_payload(payload)
    payload["cfg"] = config_to_dict(target_cfg)
    payload["effective_task_text"] = effective_task_text_from_cfg(target_cfg)
    payload["eval_contract"] = build_eval_contract(target_cfg)
    payload["recipe_contract"] = build_recipe_contract(target_cfg)
    payload["wandb_run_id"] = None
    _atomic_save_payload(target_cfg.latest_ckpt_path, payload)

    # 这里保留起始 100 epoch 周期点，后续 200/300/400/500 会继续写到同一目录。
    _hardlink_file(source_epoch_ckpt, target_cfg.periodic_ckpt_dir / f"epoch_{int(args.source_epoch):04d}.pt")

    source_best_valid = source_run_dir / "best_valid.pt"
    if source_best_valid.exists():
        _hardlink_file(source_best_valid, target_cfg.best_ckpt_path)
    source_best_success = source_run_dir / "best_success.pt"
    if source_best_success.exists():
        _hardlink_file(source_best_success, target_cfg.best_success_ckpt_path)

    source_audit_report = source_run_dir / "audit_report.json"
    source_audit_payload = _load_json_if_exists(source_audit_report)
    if source_audit_report.exists():
        shutil.copy2(source_audit_report, target_run_dir / "source_audit_report.json")

    source_best_success_rate = payload.get("best_success_rate")
    source_best_success_epoch = payload.get("best_success_epoch")
    if source_audit_payload is not None:
        if source_best_success_rate is None:
            source_best_success_rate = source_audit_payload.get("best_success_rate")
        if source_best_success_epoch is None:
            source_best_success_epoch = source_audit_payload.get("best_success_epoch")

    prepared_at = datetime.now().astimezone().isoformat(timespec="seconds")
    resume_manifest = {
        "prepared_at": prepared_at,
        "source_run_dir": str(source_run_dir),
        "source_epoch_checkpoint": str(source_epoch_ckpt),
        "source_completed_epoch": int(payload["completed_epoch"]),
        "source_global_step": int(payload["global_step"]),
        "source_best_metric": payload.get("best_metric"),
        "source_best_epoch": payload.get("best_epoch"),
        "source_best_success_rate": source_best_success_rate,
        "source_best_success_epoch": source_best_success_epoch,
        "source_wandb_run_id": payload.get("wandb_run_id"),
        "target_run_dir": str(target_run_dir),
        "target_run_name": str(target_cfg.run_name),
        "target_train_epochs": int(target_cfg.train_epochs),
        "checkpoint_every_epochs": int(target_cfg.checkpoint_every_epochs),
        "success_selection_every_epochs": int(target_cfg.success_selection_every_epochs),
        "success_selection_episodes": int(target_cfg.success_selection_episodes),
        "target_success_rate": float(args.target_success_rate),
        "batch_size": int(target_cfg.batch_size),
        "grad_accum_steps": int(target_cfg.grad_accum_steps),
        "batch_fallback_tiers": target_cfg.batch_fallback_tiers,
        "wandb_resume": bool(target_cfg.wandb_resume),
        "wandb_policy": {
            "first_launch": "new_run",
            "later_restarts": "resume_same_new_run",
        },
        "effective_task_text": target_cfg.effective_task_text,
        "eval_contract": build_eval_contract(target_cfg),
        "recipe_contract": build_recipe_contract(target_cfg),
    }
    _atomic_write_json(target_run_dir / "resume_plan.json", resume_manifest)
    _atomic_write_json(target_cfg.experiment_manifest_path, resume_manifest)
    _atomic_write_json(
        target_cfg.train_heartbeat_path,
        {
            "updated_at": prepared_at,
            "status": "prepared",
            "run_name": str(target_cfg.run_name),
            "run_dir": str(target_run_dir),
            "epoch": int(payload["completed_epoch"]),
            "batch_idx": None,
            "global_step": int(payload["global_step"]),
            "resume_source": str(source_epoch_ckpt),
            "target_success_rate": float(args.target_success_rate),
        },
    )

    result = {
        "source_run_dir": str(source_run_dir),
        "source_epoch_checkpoint": str(source_epoch_ckpt),
        "target_run_dir": str(target_run_dir),
        "target_config_path": str(target_run_dir / "config.json"),
        "target_latest_ckpt": str(target_cfg.latest_ckpt_path),
        "target_periodic_seed_ckpt": str(target_cfg.periodic_ckpt_dir / f"epoch_{int(args.source_epoch):04d}.pt"),
        "prepared_at": prepared_at,
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
