from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from typing import Any

import numpy as np
import torch

from common.runtime import set_device, set_seeds
from mdit.config import MDITExperimentConfig, config_to_dict, ensure_ablation_train_config, ensure_mainline_train_config, save_config
from mdit.data import compute_dataset_stats, save_stats
from .builders import (
    build_dataloaders,
    build_grad_scaler,
    build_optimizer,
    build_policy,
    build_scheduler,
    get_autocast_context,
    move_batch_to_device,
)
from .checkpoints import finish_wandb_run, init_wandb_run, load_resume_state, save_checkpoint
from .eval import (
    compute_sample_metric,
    evaluate_model_on_loader,
    make_progress_iter,
    run_success_rate_eval_subprocess,
    summarize_for_json,
    write_summary_json,
)


LOGGER = logging.getLogger(__name__)


def _write_success_eval_history(cfg: MDITExperimentConfig, history: list[dict[str, Any]]) -> None:
    cfg.success_eval_path.write_text(
        json.dumps(history, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def _save_temporary_success_eval_checkpoint(
    cfg: MDITExperimentConfig,
    *,
    model: torch.nn.Module,
    optimizer: torch.optim.Optimizer,
    scheduler,
    scaler,
    dataset_stats: dict[str, Any],
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
    success_eval_history: list[dict[str, Any]],
) -> Path:
    temp_path = cfg.ckpt_dir / f".success_eval_epoch_{epoch + 1:04d}.pt"
    save_checkpoint(
        temp_path,
        cfg=cfg,
        model=model,
        ema_model=None,
        optimizer=optimizer,
        scheduler=scheduler,
        scaler=scaler,
        dataset_stats=dataset_stats,
        epoch=epoch,
        global_step=global_step,
        best_metric=best_metric,
        best_epoch=best_epoch,
        best_success_rate=best_success_rate,
        best_success_epoch=best_success_epoch,
        train_loss_history=train_loss_history,
        valid_loss_history=valid_loss_history,
        epoch_summaries=epoch_summaries,
        checkpoint_payload_mode="lightweight",
        wandb_run_id=wandb_run_id,
        success_eval_history=success_eval_history,
    )
    return temp_path


def train_experiment(cfg: MDITExperimentConfig) -> dict[str, Any]:
    _is_ablation = bool(cfg.use_pcd) or str(cfg.transformer_variant).lower() != "mdit"
    if _is_ablation:
        ensure_ablation_train_config(cfg)
    else:
        ensure_mainline_train_config(cfg)
    set_device(cfg.device)
    set_seeds(cfg.seed)
    cfg.ckpt_dir.mkdir(parents=True, exist_ok=True)
    cfg.periodic_ckpt_dir.mkdir(parents=True, exist_ok=True)
    if int(cfg.offline_eval_ckpt_every_epochs) > 0:
        cfg.offline_eval_ckpt_dir.mkdir(parents=True, exist_ok=True)
    save_config(cfg)

    dataset_train, dataset_valid, dataloader_train, dataloader_valid = build_dataloaders(cfg)
    dataset_stats = compute_dataset_stats(cfg.train_data_path)
    save_stats(dataset_stats, cfg.dataset_stats_path)

    model = build_policy(cfg, dataset_stats)
    optimizer = build_optimizer(model, cfg)
    scheduler = build_scheduler(optimizer, cfg, len(dataloader_train))
    scaler = build_grad_scaler(cfg.use_amp)
    resume_state = load_resume_state(cfg, model, optimizer, scheduler, scaler)
    wandb_run = init_wandb_run(cfg, resume_run_id=resume_state["wandb_run_id"])

    if resume_state["dataset_stats"] is not None:
        dataset_stats = resume_state["dataset_stats"]

    train_loss_history = resume_state["train_loss_history"]
    valid_loss_history = resume_state["valid_loss_history"]
    epoch_summaries = resume_state["epoch_summaries"]
    success_eval_history = resume_state["success_eval_history"]
    best_metric = resume_state["best_metric"]
    best_epoch = resume_state["best_epoch"]
    best_success_rate = resume_state["best_success_rate"]
    best_success_epoch = resume_state["best_success_epoch"]
    global_step = int(resume_state["global_step"])
    start_epoch = int(resume_state["start_epoch"])
    run_started_at = time.perf_counter()

    sample_batch_cpu = next(iter(dataloader_train))

    try:
        for epoch in range(start_epoch, cfg.train_epochs):
            model.train()
            epoch_losses: list[float] = []
            optimizer.zero_grad(set_to_none=True)
            train_iter = make_progress_iter(
                enumerate(dataloader_train),
                total=len(dataloader_train),
                desc=f"mdit train epoch {epoch}",
                enable=True,
            )
            for batch_idx, batch_cpu in train_iter:
                batch = move_batch_to_device(batch_cpu)
                with get_autocast_context(cfg.use_amp):
                    loss, loss_dict = model(batch)
                    scaled_loss = loss / max(1, cfg.grad_accum_steps)
                scaler.scale(scaled_loss).backward()

                should_step = ((batch_idx + 1) % max(1, cfg.grad_accum_steps) == 0) or (
                    batch_idx == len(dataloader_train) - 1
                )
                if should_step:
                    if cfg.grad_clip_norm is not None:
                        scaler.unscale_(optimizer)
                        torch.nn.utils.clip_grad_norm_(model.parameters(), float(cfg.grad_clip_norm))
                    scaler.step(optimizer)
                    scaler.update()
                    optimizer.zero_grad(set_to_none=True)
                    scheduler.step()
                    global_step += 1

                raw_loss = float(loss.detach().cpu())
                epoch_losses.append(raw_loss)
                if hasattr(train_iter, "set_postfix"):
                    train_iter.set_postfix(loss=f"{raw_loss:.4f}", lr=f"{scheduler.get_last_lr()[0]:.2e}")
                if wandb_run is not None and (batch_idx % max(1, cfg.print_every) == 0):
                    wandb_payload = {
                        "train/loss_total": raw_loss,
                        "train/lr": float(scheduler.get_last_lr()[0]),
                        "epoch": epoch,
                    }
                    if loss_dict is not None:
                        for key, value in loss_dict.items():
                            wandb_payload[f"train/{key}"] = float(value.detach().cpu())
                    wandb_run.log(wandb_payload, step=global_step)

            train_summary = {
                "loss_total": float(np.mean(epoch_losses)) if epoch_losses else float("nan"),
                "num_batches": len(epoch_losses),
                "lr": float(scheduler.get_last_lr()[0]),
            }
            train_loss_history.append(train_summary["loss_total"])

            valid_summary = None
            eval_model = model
            if ((epoch + 1) % max(1, cfg.val_every_epochs)) == 0:
                valid_summary = evaluate_model_on_loader(eval_model, dataloader_valid, cfg)
            valid_loss_history.append(None if valid_summary is None else valid_summary["loss_total"])

            sample_summary = None
            if valid_summary is not None:
                try:
                    sample_summary = {
                        "train_action_mse_error": compute_sample_metric(eval_model, sample_batch_cpu, cfg),
                    }
                except Exception as exc:
                    LOGGER.warning("compute_sample_metric failed: %s", exc)

            success_summary = None
            success_record = None
            should_run_success_eval = (
                bool(cfg.enable_success_rate_eval)
                and
                int(cfg.success_selection_every_epochs) > 0
                and int(cfg.success_selection_episodes) > 0
                and ((epoch + 1) % int(cfg.success_selection_every_epochs)) == 0
            )
            if should_run_success_eval:
                success_eval_ckpt_path = _save_temporary_success_eval_checkpoint(
                    cfg,
                    model=model,
                    optimizer=optimizer,
                    scheduler=scheduler,
                    scaler=scaler,
                    dataset_stats=dataset_stats,
                    epoch=epoch,
                    global_step=global_step,
                    best_metric=best_metric,
                    best_epoch=best_epoch,
                    best_success_rate=best_success_rate,
                    best_success_epoch=best_success_epoch,
                    train_loss_history=train_loss_history,
                    valid_loss_history=valid_loss_history,
                    epoch_summaries=epoch_summaries,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                    success_eval_history=success_eval_history,
                )
                try:
                    if str(cfg.device).startswith("cuda") and torch.cuda.is_available():
                        torch.cuda.empty_cache()
                    success_summary = run_success_rate_eval_subprocess(
                        success_eval_ckpt_path,
                        cfg,
                        num_episodes=int(cfg.success_selection_episodes),
                        max_steps=int(cfg.success_max_steps),
                        headless=True,
                        show_progress=True,
                        progress_desc=f"mdit success epoch {epoch + 1}",
                        timeout_sec=int(cfg.success_eval_timeout_sec),
                    )
                    if str(cfg.device).startswith("cuda") and torch.cuda.is_available():
                        torch.cuda.empty_cache()
                    success_rate = float(success_summary["success_rate"])
                    if best_success_rate is None or success_rate > best_success_rate:
                        best_success_rate = success_rate
                        best_success_epoch = int(epoch)
                except Exception as exc:  # pragma: no cover - RLBench runtime issues
                    LOGGER.warning("success-rate eval failed at epoch %s: %s", epoch + 1, exc)
                    success_summary = None
                    success_record = {
                        "epoch": int(epoch + 1),
                        "success_rate": None,
                        "mean_steps": None,
                        "num_episodes": int(cfg.success_selection_episodes),
                        "checkpoint_path": None,
                        "device_used": None,
                        "cpu_fallback": "cpu fallback" in str(exc).lower(),
                        "initial_device": str(cfg.device),
                        "error": str(exc),
                        "deleted_periodic_ckpt": False,
                    }
                finally:
                    if str(cfg.device).startswith("cuda") and torch.cuda.is_available():
                        torch.cuda.empty_cache()
                    if success_eval_ckpt_path.exists():
                        success_eval_ckpt_path.unlink()
            elif (
                int(cfg.success_selection_every_epochs) > 0
                and int(cfg.success_selection_episodes) > 0
                and ((epoch + 1) % int(cfg.success_selection_every_epochs)) == 0
            ):
                LOGGER.debug(
                    "Skipping success-rate eval at epoch %s because enable_success_rate_eval=%s.",
                    epoch + 1,
                    cfg.enable_success_rate_eval,
                )

            epoch_row = {
                "epoch": int(epoch),
                "train": train_summary,
                "valid": valid_summary,
                "sample": sample_summary,
                "success_eval": summarize_for_json(success_summary),
            }
            epoch_summaries.append(epoch_row)

            if valid_summary is not None:
                metric = float(valid_summary["loss_total"])
                if best_metric is None or metric < best_metric:
                    best_metric = metric
                    best_epoch = int(epoch)

            if cfg.save_latest_ckpt:
                save_checkpoint(
                    cfg.latest_ckpt_path,
                    cfg=cfg,
                    model=model,
                    ema_model=None,
                    optimizer=optimizer,
                    scheduler=scheduler,
                    scaler=scaler,
                    dataset_stats=dataset_stats,
                    epoch=epoch,
                    global_step=global_step,
                    best_metric=best_metric,
                    best_epoch=best_epoch,
                    best_success_rate=best_success_rate,
                    best_success_epoch=best_success_epoch,
                    train_loss_history=train_loss_history,
                    valid_loss_history=valid_loss_history,
                    epoch_summaries=epoch_summaries,
                    checkpoint_payload_mode=cfg.checkpoint_payload_mode,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                    success_eval_history=success_eval_history,
                )

            if cfg.save_best_valid_ckpt and best_epoch == epoch:
                save_checkpoint(
                    cfg.best_ckpt_path,
                    cfg=cfg,
                    model=model,
                    ema_model=None,
                    optimizer=optimizer,
                    scheduler=scheduler,
                    scaler=scaler,
                    dataset_stats=dataset_stats,
                    epoch=epoch,
                    global_step=global_step,
                    best_metric=best_metric,
                    best_epoch=best_epoch,
                    best_success_rate=best_success_rate,
                    best_success_epoch=best_success_epoch,
                    train_loss_history=train_loss_history,
                    valid_loss_history=valid_loss_history,
                    epoch_summaries=epoch_summaries,
                    checkpoint_payload_mode=cfg.checkpoint_payload_mode,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                    success_eval_history=success_eval_history,
                )

            periodic_path = None
            if int(cfg.checkpoint_every_epochs) > 0 and ((epoch + 1) % int(cfg.checkpoint_every_epochs)) == 0:
                periodic_path = cfg.periodic_ckpt_dir / f"epoch_{epoch + 1:04d}.pt"
                save_checkpoint(
                    periodic_path,
                    cfg=cfg,
                    model=model,
                    ema_model=None,
                    optimizer=optimizer,
                    scheduler=scheduler,
                    scaler=scaler,
                    dataset_stats=dataset_stats,
                    epoch=epoch,
                    global_step=global_step,
                    best_metric=best_metric,
                    best_epoch=best_epoch,
                    best_success_rate=best_success_rate,
                    best_success_epoch=best_success_epoch,
                    train_loss_history=train_loss_history,
                    valid_loss_history=valid_loss_history,
                    epoch_summaries=epoch_summaries,
                    checkpoint_payload_mode=cfg.checkpoint_payload_mode,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                    success_eval_history=success_eval_history,
                )

            offline_eval_path = None
            should_save_offline_eval_ckpt = (
                not bool(cfg.enable_success_rate_eval)
                and int(cfg.offline_eval_ckpt_every_epochs) > 0
                and ((epoch + 1) % int(cfg.offline_eval_ckpt_every_epochs)) == 0
            )
            if should_save_offline_eval_ckpt:
                offline_eval_path = cfg.offline_eval_ckpt_dir / f"epoch_{epoch + 1:04d}.pt"
                save_checkpoint(
                    offline_eval_path,
                    cfg=cfg,
                    model=model,
                    ema_model=None,
                    optimizer=optimizer,
                    scheduler=scheduler,
                    scaler=scaler,
                    dataset_stats=dataset_stats,
                    epoch=epoch,
                    global_step=global_step,
                    best_metric=best_metric,
                    best_epoch=best_epoch,
                    best_success_rate=best_success_rate,
                    best_success_epoch=best_success_epoch,
                    train_loss_history=train_loss_history,
                    valid_loss_history=valid_loss_history,
                    epoch_summaries=epoch_summaries,
                    checkpoint_payload_mode=cfg.offline_eval_ckpt_payload_mode,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                    success_eval_history=success_eval_history,
                )

            if success_summary is not None:
                success_record = {
                    "epoch": int(epoch + 1),
                    "success_rate": float(success_summary["success_rate"]),
                    "mean_steps": float(success_summary["mean_steps"]),
                    "num_episodes": int(success_summary["num_episodes"]),
                    "checkpoint_path": None if periodic_path is None else str(periodic_path),
                    "device_used": success_summary.get("device_used"),
                    "cpu_fallback": bool(success_summary.get("cpu_fallback", False)),
                    "initial_device": success_summary.get("initial_device"),
                    "error": None,
                    "deleted_periodic_ckpt": False,
                }
                success_eval_history.append(success_record)
                _write_success_eval_history(cfg, success_eval_history)
                if best_success_epoch == epoch:
                    save_checkpoint(
                        cfg.best_success_ckpt_path,
                        cfg=cfg,
                        model=model,
                        ema_model=None,
                        optimizer=optimizer,
                        scheduler=scheduler,
                        scaler=scaler,
                        dataset_stats=dataset_stats,
                        epoch=epoch,
                        global_step=global_step,
                        best_metric=best_metric,
                        best_epoch=best_epoch,
                        best_success_rate=best_success_rate,
                        best_success_epoch=best_success_epoch,
                        train_loss_history=train_loss_history,
                        valid_loss_history=valid_loss_history,
                        epoch_summaries=epoch_summaries,
                        checkpoint_payload_mode=cfg.checkpoint_payload_mode,
                        wandb_run_id=None if wandb_run is None else wandb_run.id,
                        success_eval_history=success_eval_history,
                    )
                if (
                    periodic_path is not None
                    and cfg.delete_periodic_ckpts_after_success_eval
                    and periodic_path.exists()
                ):
                    periodic_path.unlink()
                    success_record["deleted_periodic_ckpt"] = True
                    _write_success_eval_history(cfg, success_eval_history)
            elif success_record is not None:
                success_eval_history.append(success_record)
                _write_success_eval_history(cfg, success_eval_history)

            if success_record is not None and cfg.save_latest_ckpt:
                save_checkpoint(
                    cfg.latest_ckpt_path,
                    cfg=cfg,
                    model=model,
                    ema_model=None,
                    optimizer=optimizer,
                    scheduler=scheduler,
                    scaler=scaler,
                    dataset_stats=dataset_stats,
                    epoch=epoch,
                    global_step=global_step,
                    best_metric=best_metric,
                    best_epoch=best_epoch,
                    best_success_rate=best_success_rate,
                    best_success_epoch=best_success_epoch,
                    train_loss_history=train_loss_history,
                    valid_loss_history=valid_loss_history,
                    epoch_summaries=epoch_summaries,
                    checkpoint_payload_mode=cfg.checkpoint_payload_mode,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                    success_eval_history=success_eval_history,
                )

            if wandb_run is not None:
                payload = {
                    "epoch": epoch,
                    "summary/train_loss_total": train_summary["loss_total"],
                    "summary/lr": train_summary["lr"],
                }
                if valid_summary is not None:
                    for key, value in valid_summary.items():
                        payload[f"valid/{key}"] = value
                if sample_summary is not None:
                    payload.update({f"sample/{key}": value for key, value in sample_summary.items()})
                if success_summary is not None:
                    payload["success_select/success_rate"] = float(success_summary["success_rate"])
                    payload["success_select/mean_steps"] = float(success_summary["mean_steps"])
                    payload["success_select/num_episodes"] = int(success_summary["num_episodes"])
                    payload["success_select/cpu_fallback"] = float(bool(success_summary.get("cpu_fallback", False)))
                wandb_run.log(payload, step=global_step)
                wandb_run.summary["best_metric"] = best_metric
                wandb_run.summary["best_epoch"] = best_epoch
                wandb_run.summary["best_success_rate"] = best_success_rate
                wandb_run.summary["best_success_epoch"] = best_success_epoch

        final_eval = None
        if (not bool(cfg.enable_success_rate_eval)) and int(cfg.standard_eval_episodes) > 0:
            LOGGER.warning(
                "Skipping standard eval because enable_success_rate_eval is disabled. "
                "Set enable_success_rate_eval=true to run RLBench evaluation during training."
            )
        elif int(cfg.standard_eval_episodes) > 0:
            final_eval_ckpt_path = (
                cfg.latest_ckpt_path if cfg.save_latest_ckpt and cfg.latest_ckpt_path.exists() else None
            )
            created_temp_final_eval_ckpt = False
            if final_eval_ckpt_path is None:
                final_eval_ckpt_path = _save_temporary_success_eval_checkpoint(
                    cfg,
                    model=model,
                    optimizer=optimizer,
                    scheduler=scheduler,
                    scaler=scaler,
                    dataset_stats=dataset_stats,
                    epoch=cfg.train_epochs - 1,
                    global_step=global_step,
                    best_metric=best_metric,
                    best_epoch=best_epoch,
                    best_success_rate=best_success_rate,
                    best_success_epoch=best_success_epoch,
                    train_loss_history=train_loss_history,
                    valid_loss_history=valid_loss_history,
                    epoch_summaries=epoch_summaries,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                    success_eval_history=success_eval_history,
                )
                created_temp_final_eval_ckpt = True
            try:
                final_eval = run_success_rate_eval_subprocess(
                    final_eval_ckpt_path,
                    cfg,
                    num_episodes=int(cfg.standard_eval_episodes),
                    max_steps=int(cfg.success_max_steps),
                    headless=True,
                    show_progress=True,
                    progress_desc="mdit standard eval",
                    timeout_sec=int(cfg.success_eval_timeout_sec),
                )
            except Exception as exc:  # pragma: no cover - RLBench runtime issues
                LOGGER.warning("final standard eval failed: %s", exc)
                final_eval = None
            finally:
                if created_temp_final_eval_ckpt and final_eval_ckpt_path.exists():
                    final_eval_ckpt_path.unlink()

        wall_clock_hours = (time.perf_counter() - run_started_at) / 3600.0
        summary = {
            "run_name": cfg.run_name,
            "line": "mdit",
            "run_dir": str(cfg.ckpt_dir),
            "wandb_run_id": None if wandb_run is None else wandb_run.id,
            "wandb_run_url": None if wandb_run is None else wandb_run.get_url(),
            "config": config_to_dict(cfg),
            "best_metric": best_metric,
            "best_epoch": best_epoch,
            "best_success_rate": best_success_rate,
            "best_success_epoch": best_success_epoch,
            "latest_epoch": cfg.train_epochs - 1,
            "train_loss_last": train_loss_history[-1] if train_loss_history else None,
            "valid_loss_last": valid_loss_history[-1] if valid_loss_history else None,
            "epoch_summaries": epoch_summaries[-5:],
            "success_eval_history": success_eval_history[-10:],
            "final_standard_eval": summarize_for_json(final_eval),
            "wall_clock_hours": wall_clock_hours,
            "dataset_sizes": {
                "train": len(dataset_train),
                "valid": len(dataset_valid),
            },
        }
        _write_success_eval_history(cfg, success_eval_history)
        write_summary_json(cfg, summary)
        return summary
    finally:
        finish_wandb_run(wandb_run)
