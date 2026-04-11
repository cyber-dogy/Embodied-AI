from __future__ import annotations

import time
from typing import Any

import numpy as np
import torch

from common.runtime import set_device, set_seeds
from mdit.config import MDITExperimentConfig, config_to_dict, save_config
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
from .checkpoints import load_resume_state, save_checkpoint
from .checkpoints import finish_wandb_run, init_wandb_run
from .eval import evaluate_model_on_loader, compute_sample_metric, make_progress_iter, summarize_for_json, write_summary_json


def train_experiment(cfg: MDITExperimentConfig) -> dict[str, Any]:
    cfg.validate()
    set_device(cfg.device)
    set_seeds(cfg.seed)
    cfg.ckpt_dir.mkdir(parents=True, exist_ok=True)
    cfg.periodic_ckpt_dir.mkdir(parents=True, exist_ok=True)
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
            if ((epoch + 1) % max(1, cfg.val_every_epochs)) == 0:
                valid_summary = evaluate_model_on_loader(model, dataloader_valid, cfg)
            valid_loss_history.append(None if valid_summary is None else valid_summary["loss_total"])

            sample_summary = None
            if valid_summary is not None:
                try:
                    sample_summary = {
                        "train_action_mse_error": compute_sample_metric(model, sample_batch_cpu, cfg),
                    }
                except Exception:
                    pass

            epoch_row = {
                "epoch": int(epoch),
                "train": train_summary,
                "valid": valid_summary,
                "sample": sample_summary,
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
                )

            if cfg.save_best_valid_ckpt and best_epoch == epoch:
                save_checkpoint(
                    cfg.best_ckpt_path,
                    cfg=cfg,
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
                    checkpoint_payload_mode=cfg.checkpoint_payload_mode,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                )

            if int(cfg.checkpoint_every_epochs) > 0 and ((epoch + 1) % int(cfg.checkpoint_every_epochs)) == 0:
                periodic_path = cfg.periodic_ckpt_dir / f"epoch_{epoch + 1:04d}.pt"
                save_checkpoint(
                    periodic_path,
                    cfg=cfg,
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
                    checkpoint_payload_mode=cfg.checkpoint_payload_mode,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
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
                wandb_run.log(payload, step=global_step)
                wandb_run.summary["best_metric"] = best_metric
                wandb_run.summary["best_epoch"] = best_epoch
                wandb_run.summary["best_success_rate"] = best_success_rate
                wandb_run.summary["best_success_epoch"] = best_success_epoch

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
            "final_standard_eval": summarize_for_json(None),
            "wall_clock_hours": wall_clock_hours,
            "dataset_sizes": {
                "train": len(dataset_train),
                "valid": len(dataset_valid),
            },
        }
        write_summary_json(cfg, summary)
        return summary
    finally:
        finish_wandb_run(wandb_run)
