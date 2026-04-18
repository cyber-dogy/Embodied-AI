from __future__ import annotations

from datetime import datetime
import json
import shutil
import time
from dataclasses import replace
from typing import Any

import numpy as np
import torch

from common.runtime import set_device, set_seeds
from mdit.config import ExperimentConfig, config_to_dict, resolve_runtime_config, save_config
from .builders import (
    build_dataloaders,
    build_grad_scaler,
    build_optimizer,
    build_policy,
    build_scheduler,
    get_autocast_context,
    move_batch_to_device,
)
from .checkpoints import (
    build_ema_model,
    finish_wandb_run,
    init_wandb_run,
    load_resume_state,
    maybe_empty_cuda_cache,
    save_checkpoint,
    update_ema_model,
)
from .eval import (
    compute_sample_metric,
    evaluate_model_on_loader,
    make_progress_iter,
    run_success_rate_eval,
    summarize_for_json,
    write_summary_json,
)


def _is_oom_error(exc: BaseException) -> bool:
    text = str(exc).lower()
    return (
        "out of memory" in text
        or "cuda error: out of memory" in text
        or "cudnn_status_not_supported" in text
    )


def _cleanup_run_dir(cfg: ExperimentConfig) -> None:
    if cfg.ckpt_dir.exists():
        shutil.rmtree(cfg.ckpt_dir)


def _normalize_fallback_tiers(cfg: ExperimentConfig) -> list[tuple[int, int]]:
    tiers = [(int(bs), int(acc)) for bs, acc in cfg.batch_fallback_tiers]
    current = (int(cfg.batch_size), int(cfg.grad_accum_steps))
    if current in tiers:
        tiers = [current] + [tier for tier in tiers if tier != current]
    else:
        tiers = [current, *tiers]
    deduped: list[tuple[int, int]] = []
    seen: set[tuple[int, int]] = set()
    for tier in tiers:
        if tier in seen:
            continue
        seen.add(tier)
        deduped.append(tier)
    return deduped


def _write_train_heartbeat(
    cfg: ExperimentConfig,
    *,
    status: str,
    epoch: int,
    batch_idx: int | None,
    global_step: int,
    payload: dict[str, Any] | None = None,
) -> None:
    heartbeat = {
        "updated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "status": str(status),
        "run_name": str(cfg.run_name),
        "run_dir": str(cfg.ckpt_dir),
        "epoch": int(epoch),
        "batch_idx": None if batch_idx is None else int(batch_idx),
        "global_step": int(global_step),
    }
    if payload:
        heartbeat.update(payload)
    cfg.train_heartbeat_path.parent.mkdir(parents=True, exist_ok=True)
    cfg.train_heartbeat_path.write_text(
        json.dumps(heartbeat, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def _train_experiment_once(cfg: ExperimentConfig, strategy: str = "fm") -> dict[str, Any]:
    cfg = resolve_runtime_config(cfg)
    cfg.validate()
    set_device(cfg.device)
    cfg.ckpt_dir.mkdir(parents=True, exist_ok=True)
    cfg.periodic_ckpt_dir.mkdir(parents=True, exist_ok=True)
    save_config(cfg)
    set_seeds(cfg.seed)

    dataset_train, dataset_valid, dataloader_train, dataloader_valid = build_dataloaders(cfg)
    model = build_policy(cfg, strategy)
    optimizer = build_optimizer(model, cfg)
    scheduler = build_scheduler(optimizer, cfg, len(dataloader_train))
    scaler = build_grad_scaler(cfg.train_use_amp, cfg.train_amp_dtype)
    ema_model = build_ema_model(model, cfg.ema_enable)
    resume_state = load_resume_state(cfg, strategy, model, ema_model, optimizer, scheduler, scaler)
    wandb_run = init_wandb_run(cfg, strategy=strategy, resume_run_id=resume_state["wandb_run_id"])

    train_loss_history = resume_state["train_loss_history"]
    valid_loss_history = resume_state["valid_loss_history"]
    epoch_summaries = resume_state["epoch_summaries"]
    best_metric = resume_state["best_metric"]
    best_epoch = resume_state["best_epoch"]
    best_success_rate = resume_state["best_success_rate"]
    best_success_epoch = resume_state["best_success_epoch"]
    global_step = int(resume_state["global_step"])
    start_epoch = int(resume_state["start_epoch"])
    bootstrap_epoch = int(start_epoch) - 1
    resume_notes = list(resume_state.get("resume_notes") or [])

    for note in resume_notes:
        print(f"[resume] {note}", flush=True)

    if not cfg.latest_ckpt_path.exists():
        save_checkpoint(
            cfg.latest_ckpt_path,
            cfg=cfg,
            strategy=strategy,
            model=model,
            ema_model=ema_model,
            optimizer=optimizer,
            scheduler=scheduler,
            scaler=scaler,
            epoch=bootstrap_epoch,
            global_step=global_step,
            best_metric=best_metric,
            best_epoch=best_epoch,
            best_success_rate=best_success_rate,
            best_success_epoch=best_success_epoch,
            train_loss_history=train_loss_history,
            valid_loss_history=valid_loss_history,
            epoch_summaries=epoch_summaries,
            wandb_run_id=None if wandb_run is None else wandb_run.id,
        )

    sample_batch_cpu = next(iter(dataloader_train))
    run_started_at = time.perf_counter()
    _write_train_heartbeat(
        cfg,
        status="running",
        epoch=start_epoch,
        batch_idx=None,
        global_step=global_step,
        payload={
            "start_epoch": int(start_epoch),
            "resume_notes": resume_notes,
        },
    )

    for epoch in range(start_epoch, cfg.train_epochs):
        model.train()
        epoch_losses: list[float] = []
        optimizer.zero_grad(set_to_none=True)
        train_iter = make_progress_iter(
            enumerate(dataloader_train),
            total=len(dataloader_train),
            desc=f"train epoch {epoch}",
            enable=True,
        )
        for batch_idx, batch_cpu in train_iter:
            batch = move_batch_to_device(batch_cpu)
            with get_autocast_context(cfg.train_use_amp, cfg.train_amp_dtype):
                loss_dict = model.compute_loss_dict(batch)
                loss = loss_dict["loss_total"] / max(1, cfg.grad_accum_steps)
            scaler.scale(loss).backward()

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
                update_ema_model(ema_model, model, cfg.ema_decay)
                global_step += 1

            raw_loss = float(loss_dict["loss_total"].detach().cpu())
            epoch_losses.append(raw_loss)
            if (batch_idx % max(1, int(cfg.train_heartbeat_every_steps))) == 0:
                _write_train_heartbeat(
                    cfg,
                    status="running",
                    epoch=epoch,
                    batch_idx=batch_idx,
                    global_step=global_step,
                    payload={"loss_total": raw_loss},
                )
            if hasattr(train_iter, "set_postfix"):
                train_iter.set_postfix(loss=f"{raw_loss:.4f}", lr=f"{scheduler.get_last_lr()[0]:.2e}")

            if wandb_run is not None and (batch_idx % max(1, cfg.print_every) == 0):
                wandb_run.log(
                    {
                        "train/loss_total": raw_loss,
                        "train/loss_xyz": float(loss_dict["loss_xyz"].detach().cpu()),
                        "train/loss_rot6d": float(loss_dict["loss_rot6d"].detach().cpu()),
                        "train/loss_grip": float(loss_dict["loss_grip"].detach().cpu()),
                        "train/lr": float(scheduler.get_last_lr()[0]),
                        "epoch": epoch,
                    },
                    step=global_step,
                )

        train_summary = {
            "loss_total": float(np.mean(epoch_losses)) if epoch_losses else float("nan"),
            "num_batches": len(epoch_losses),
            "lr": float(scheduler.get_last_lr()[0]),
        }
        train_loss_history.append(train_summary["loss_total"])

        valid_summary = None
        eval_model = ema_model if ema_model is not None else model
        if ((epoch + 1) % max(1, cfg.val_every_epochs)) == 0:
            valid_summary = evaluate_model_on_loader(eval_model, dataloader_valid, cfg)
        valid_loss_history.append(None if valid_summary is None else valid_summary["loss_total"])

        sample_summary = None
        if int(cfg.sample_every_epochs) > 0 and ((epoch + 1) % int(cfg.sample_every_epochs)) == 0:
            sample_summary = {
                "train_action_mse_error": compute_sample_metric(
                    eval_model,
                    sample_batch_cpu,
                )
            }

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

        save_checkpoint(
            cfg.latest_ckpt_path,
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
            wandb_run_id=None if wandb_run is None else wandb_run.id,
        )

        if best_epoch == epoch:
            save_checkpoint(
                cfg.best_ckpt_path,
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
                wandb_run_id=None if wandb_run is None else wandb_run.id,
            )

        if int(cfg.checkpoint_every_epochs) > 0 and ((epoch + 1) % int(cfg.checkpoint_every_epochs)) == 0:
            periodic_path = cfg.periodic_ckpt_dir / f"epoch_{epoch + 1:04d}.pt"
            save_checkpoint(
                periodic_path,
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
                wandb_run_id=None if wandb_run is None else wandb_run.id,
            )

        success_summary = None
        if (
            int(cfg.success_selection_every_epochs) > 0
            and int(cfg.success_selection_episodes) > 0
            and ((epoch + 1) % int(cfg.success_selection_every_epochs)) == 0
        ):
            success_summary = run_success_rate_eval(
                eval_model,
                cfg,
                num_episodes=int(cfg.success_selection_episodes),
                max_steps=int(cfg.success_max_steps),
                headless=True,
                show_progress=True,
                progress_desc=f"select epoch {epoch + 1}",
            )
            success_rate = float(success_summary["success_rate"])
            if best_success_rate is None or success_rate > best_success_rate:
                best_success_rate = success_rate
                best_success_epoch = int(epoch)
                save_checkpoint(
                    cfg.best_success_ckpt_path,
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
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                )

        if wandb_run is not None:
            payload = {
                "epoch": epoch,
                "summary/train_loss_total": train_summary["loss_total"],
                "summary/lr": train_summary["lr"],
                "train/batch_size": int(cfg.batch_size),
                "train/grad_accum_steps": int(cfg.grad_accum_steps),
                "train/global_batch": int(cfg.batch_size) * int(cfg.grad_accum_steps),
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
            wandb_run.log(payload, step=global_step)
            wandb_run.summary["best_metric"] = best_metric
            wandb_run.summary["best_epoch"] = best_epoch
            wandb_run.summary["best_success_rate"] = best_success_rate
            wandb_run.summary["best_success_epoch"] = best_success_epoch
            wandb_run.summary["strategy"] = strategy

        maybe_empty_cuda_cache(cfg.empty_cuda_cache)
        _write_train_heartbeat(
            cfg,
            status="running",
            epoch=epoch,
            batch_idx=len(dataloader_train) - 1,
            global_step=global_step,
            payload={
                "train_loss_total": train_summary["loss_total"],
                "valid_loss_total": None if valid_summary is None else valid_summary["loss_total"],
                "best_metric": best_metric,
                "best_success_rate": best_success_rate,
            },
        )

    final_eval = None
    if cfg.standard_eval_episodes and int(cfg.standard_eval_episodes) > 0:
        final_eval = run_success_rate_eval(
            ema_model if ema_model is not None else model,
            cfg,
            num_episodes=int(cfg.standard_eval_episodes),
            max_steps=int(cfg.success_max_steps),
            headless=True,
            show_progress=True,
            progress_desc="standard eval",
        )

    wall_clock_hours = (time.perf_counter() - run_started_at) / 3600.0
    summary = {
        "run_name": cfg.run_name,
        "strategy": strategy,
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
        "final_standard_eval": summarize_for_json(final_eval),
        "wall_clock_hours": wall_clock_hours,
        "dataset_sizes": {
            "train": len(dataset_train),
            "valid": len(dataset_valid),
        },
    }
    write_summary_json(cfg, summary)
    _write_train_heartbeat(
        cfg,
        status="completed",
        epoch=cfg.train_epochs - 1,
        batch_idx=None,
        global_step=global_step,
        payload={
            "best_metric": best_metric,
            "best_success_rate": best_success_rate,
            "summary_path": str(cfg.summary_path),
        },
    )
    finish_wandb_run(wandb_run)
    return summary


def train_experiment(cfg: ExperimentConfig, strategy: str = "fm") -> dict[str, Any]:
    cfg = resolve_runtime_config(cfg)
    tiers = _normalize_fallback_tiers(cfg)
    if not cfg.auto_batch_fallback or len(tiers) <= 1:
        return _train_experiment_once(cfg, strategy)

    last_exception: BaseException | None = None
    for attempt_idx, (batch_size, grad_accum_steps) in enumerate(tiers, start=1):
        local_cfg = replace(
            cfg,
            batch_size=int(batch_size),
            grad_accum_steps=int(grad_accum_steps),
            resume_from_latest=False if attempt_idx > 1 else bool(cfg.resume_from_latest),
        )
        try:
            if attempt_idx > 1:
                print(
                    f"[mdit][oom-fallback] retry attempt {attempt_idx}/{len(tiers)} "
                    f"with batch_size={batch_size}, grad_accum_steps={grad_accum_steps}",
                    flush=True,
                )
                _cleanup_run_dir(local_cfg)
            return _train_experiment_once(local_cfg, strategy)
        except RuntimeError as exc:
            if not _is_oom_error(exc):
                raise
            last_exception = exc
            if attempt_idx >= len(tiers):
                break
            print(
                f"[mdit][oom-fallback] OOM with batch_size={batch_size}, grad_accum_steps={grad_accum_steps}; "
                "trying next tier...",
                flush=True,
            )
            if torch.cuda.is_available():
                torch.cuda.empty_cache()

    if last_exception is not None:
        raise last_exception
    return _train_experiment_once(cfg, strategy)
