from __future__ import annotations

import copy
import os
import tempfile
from typing import Any

import torch
from torch.optim.lr_scheduler import LambdaLR

from ..common.runtime import get_device
from ..config import ExperimentConfig, config_to_dict

try:
    import wandb
except ImportError:  # pragma: no cover
    wandb = None


def maybe_empty_cuda_cache(enabled: bool = True) -> None:
    if enabled and torch.cuda.is_available():
        torch.cuda.empty_cache()


def build_ema_model(model: torch.nn.Module, enabled: bool) -> torch.nn.Module | None:
    if not enabled:
        return None
    ema_model = copy.deepcopy(model)
    ema_model.to(get_device())
    ema_model.eval()
    for param in ema_model.parameters():
        param.requires_grad_(False)
    return ema_model


@torch.no_grad()
def update_ema_model(ema_model: torch.nn.Module | None, model: torch.nn.Module, decay: float) -> None:
    if ema_model is None:
        return
    decay = float(decay)
    ema_state = ema_model.state_dict()
    model_state = model.state_dict()
    for key, ema_value in ema_state.items():
        model_value = model_state[key].to(device=ema_value.device, dtype=ema_value.dtype)
        if torch.is_floating_point(ema_value):
            ema_value.lerp_(model_value, 1.0 - decay)
        else:
            ema_value.copy_(model_value)


def _save_payload(path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(
        dir=path.parent,
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


def build_checkpoint_payload(
    *,
    cfg: ExperimentConfig,
    strategy: str,
    model: torch.nn.Module,
    ema_model: torch.nn.Module | None,
    optimizer: torch.optim.Optimizer,
    scheduler: LambdaLR,
    scaler: torch.cuda.amp.GradScaler,
    epoch: int,
    global_step: int,
    best_metric: float | None,
    best_epoch: int | None,
    best_success_rate: float | None,
    best_success_epoch: int | None,
    train_loss_history: list[float],
    valid_loss_history: list[float | None],
    epoch_summaries: list[dict[str, Any]],
    wandb_run_id: str | None,
) -> dict[str, Any]:
    return {
        "cfg": config_to_dict(cfg),
        "strategy": str(strategy),
        "model_state_dict": model.state_dict(),
        "ema_state_dict": None if ema_model is None else ema_model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "scheduler_state_dict": scheduler.state_dict(),
        "scaler_state_dict": scaler.state_dict(),
        "completed_epoch": int(epoch),
        "global_step": int(global_step),
        "best_metric": best_metric,
        "best_epoch": best_epoch,
        "best_success_rate": best_success_rate,
        "best_success_epoch": best_success_epoch,
        "train_loss_history": list(train_loss_history),
        "valid_loss_history": list(valid_loss_history),
        "epoch_summaries": list(epoch_summaries),
        "wandb_run_id": wandb_run_id,
    }


def save_checkpoint(
    path,
    *,
    cfg: ExperimentConfig,
    strategy: str,
    model: torch.nn.Module,
    ema_model: torch.nn.Module | None,
    optimizer: torch.optim.Optimizer,
    scheduler: LambdaLR,
    scaler: torch.cuda.amp.GradScaler,
    epoch: int,
    global_step: int,
    best_metric: float | None,
    best_epoch: int | None,
    best_success_rate: float | None,
    best_success_epoch: int | None,
    train_loss_history: list[float],
    valid_loss_history: list[float | None],
    epoch_summaries: list[dict[str, Any]],
    wandb_run_id: str | None,
) -> None:
    payload = build_checkpoint_payload(
        cfg=cfg,
        strategy=strategy,
        model=model,
        ema_model=ema_model,
        optimizer=optimizer,
        scheduler=scheduler,
        scaler=scaler,
        epoch=epoch,
        global_step=global_step,
        best_metric=best_metric,
        best_epoch=best_epoch,
        best_success_rate=best_success_rate,
        best_success_epoch=best_success_epoch,
        train_loss_history=train_loss_history,
        valid_loss_history=valid_loss_history,
        epoch_summaries=epoch_summaries,
        wandb_run_id=wandb_run_id,
    )
    _save_payload(path, payload)


def load_resume_state(
    cfg: ExperimentConfig,
    strategy: str,
    model: torch.nn.Module,
    ema_model: torch.nn.Module | None,
    optimizer: torch.optim.Optimizer,
    scheduler: LambdaLR,
    scaler: torch.cuda.amp.GradScaler,
) -> dict[str, Any]:
    if (not cfg.resume_from_latest) or (not cfg.latest_ckpt_path.exists()):
        return {
            "resumed": False,
            "start_epoch": 0,
            "global_step": 0,
            "best_metric": None,
            "best_epoch": None,
            "best_success_rate": None,
            "best_success_epoch": None,
            "train_loss_history": [],
            "valid_loss_history": [],
            "epoch_summaries": [],
            "wandb_run_id": None,
        }

    payload = torch.load(cfg.latest_ckpt_path, map_location="cpu")
    if payload.get("strategy") != strategy:
        raise ValueError(
            f"Resume checkpoint strategy mismatch: expected {strategy}, got {payload.get('strategy')}"
        )
    model.load_state_dict(payload["model_state_dict"])
    if ema_model is not None and payload.get("ema_state_dict") is not None:
        ema_model.load_state_dict(payload["ema_state_dict"])
    optimizer.load_state_dict(payload["optimizer_state_dict"])
    scheduler.load_state_dict(payload["scheduler_state_dict"])
    scaler_state = payload.get("scaler_state_dict")
    if scaler_state:
        scaler.load_state_dict(scaler_state)
    completed_epoch = int(payload.get("completed_epoch", -1))
    return {
        "resumed": True,
        "start_epoch": completed_epoch + 1,
        "global_step": int(payload.get("global_step", 0)),
        "best_metric": payload.get("best_metric"),
        "best_epoch": payload.get("best_epoch"),
        "best_success_rate": payload.get("best_success_rate"),
        "best_success_epoch": payload.get("best_success_epoch"),
        "train_loss_history": list(payload.get("train_loss_history") or []),
        "valid_loss_history": list(payload.get("valid_loss_history") or []),
        "epoch_summaries": list(payload.get("epoch_summaries") or []),
        "wandb_run_id": payload.get("wandb_run_id"),
    }


def init_wandb_run(cfg: ExperimentConfig, *, strategy: str, resume_run_id: str | None = None):
    if not cfg.wandb_enable:
        return None
    if wandb is None:
        raise ImportError("wandb is not installed.")
    run = wandb.init(
        project=cfg.wandb_project,
        entity=cfg.wandb_entity,
        mode=cfg.wandb_mode,
        name=f"{cfg.run_name}_{strategy}",
        dir=str(cfg.ckpt_dir),
        config={"strategy": strategy, **config_to_dict(cfg)},
        resume="allow" if cfg.wandb_resume else None,
        id=resume_run_id if cfg.wandb_resume else None,
    )
    return run


def finish_wandb_run(run) -> None:
    if run is not None:
        run.finish()
