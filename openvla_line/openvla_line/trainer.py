from __future__ import annotations

import json
import math
import random
from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np
import torch
import torch.nn.functional as F
from torch.nn.utils import clip_grad_norm_
from torch.optim import AdamW
from torch.optim.lr_scheduler import LambdaLR
from torch.utils.data import DataLoader
from tqdm import tqdm

from .config import ExperimentConfig, resolve_manifest_path, resolve_run_root, resolve_suite_dir
from .data import LiberoStepDataset, build_libero_manifest, collate_batch, compute_normalization_stats, save_manifest
from .model import OpenVLAStylePolicy
from .tokenizer import SimpleTokenizer


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def select_device(requested: str | None = None) -> torch.device:
    if requested is not None:
        return torch.device(requested)
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")


def _save_json(payload: dict[str, Any], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False))


def _build_scheduler(optimizer: AdamW, warmup_steps: int, total_steps: int) -> LambdaLR:
    def lr_lambda(step: int) -> float:
        if total_steps <= 0:
            return 1.0
        if warmup_steps > 0 and step < warmup_steps:
            return float(step + 1) / float(max(1, warmup_steps))
        progress = float(step - warmup_steps) / float(max(1, total_steps - warmup_steps))
        progress = min(max(progress, 0.0), 1.0)
        cosine = 0.5 * (1.0 + math.cos(math.pi * progress))
        return 0.1 + 0.9 * cosine

    return LambdaLR(optimizer, lr_lambda=lr_lambda)


def _action_loss(prediction: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
    per_dim = F.smooth_l1_loss(prediction, target, reduction="none")
    weights = torch.ones(target.shape[-1], device=target.device)
    weights[-1] = 2.0
    return (per_dim * weights).mean()


def _move_batch(batch: dict[str, Any], device: torch.device) -> dict[str, Any]:
    moved = {}
    for key, value in batch.items():
        if torch.is_tensor(value):
            moved[key] = value.to(device, non_blocking=True)
        else:
            moved[key] = value
    return moved


def _run_epoch(
    model: OpenVLAStylePolicy,
    loader: DataLoader,
    optimizer: AdamW | None,
    scaler: torch.cuda.amp.GradScaler,
    scheduler: LambdaLR | None,
    device: torch.device,
    max_steps: int | None,
    grad_clip_norm: float,
    use_amp: bool,
    log_every: int,
    description: str,
) -> dict[str, float]:
    is_train = optimizer is not None
    model.train(is_train)

    loss_sum = 0.0
    mae_sum = 0.0
    steps = 0
    iterator = tqdm(loader, desc=description, leave=False)
    autocast_enabled = use_amp and device.type == "cuda"

    for step_index, batch in enumerate(iterator, start=1):
        if max_steps is not None and step_index > max_steps:
            break
        batch = _move_batch(batch, device)

        if is_train:
            optimizer.zero_grad(set_to_none=True)

        with torch.autocast(device_type=device.type, enabled=autocast_enabled):
            prediction = model(
                images=batch["images"],
                proprio=batch["proprio"],
                input_ids=batch["input_ids"],
                attention_mask=batch["attention_mask"],
            )
            loss = _action_loss(prediction, batch["action"])

        if is_train:
            scaler.scale(loss).backward()
            scaler.unscale_(optimizer)
            clip_grad_norm_(model.parameters(), max_norm=grad_clip_norm)
            scaler.step(optimizer)
            scaler.update()
            if scheduler is not None:
                scheduler.step()

        with torch.no_grad():
            mae = (prediction - batch["action"]).abs().mean()

        steps += 1
        loss_sum += float(loss.item())
        mae_sum += float(mae.item())
        if steps % max(1, log_every) == 0:
            iterator.set_postfix(loss=loss_sum / steps, mae=mae_sum / steps)

    if steps == 0:
        raise RuntimeError(f"{description} 没有跑到任何 step，请检查 dataloader 或 max_steps 配置")
    return {"loss": loss_sum / steps, "mae": mae_sum / steps, "steps": float(steps)}


def train_model(
    config: ExperimentConfig,
    config_path: str | Path | None = None,
    data_root_override: str | Path | None = None,
    run_name_override: str | None = None,
    device_override: str | None = None,
) -> dict[str, Any]:
    set_seed(config.data.seed)

    device = select_device(device_override)
    suite_dir = resolve_suite_dir(config, override=data_root_override)
    manifest = build_libero_manifest(
        suite_dir=suite_dir,
        train_ratio=config.data.train_ratio,
        seed=config.data.seed,
        max_files=config.data.max_files,
        max_train_episodes=config.data.max_train_episodes,
        max_val_episodes=config.data.max_val_episodes,
    )

    manifest_path = resolve_manifest_path(config, suite_dir)
    save_manifest(manifest, manifest_path)

    run_root = resolve_run_root(config)
    run_name = run_name_override or config.run.run_name or f"openvla_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    run_dir = run_root / run_name
    run_dir.mkdir(parents=True, exist_ok=True)

    tokenizer = SimpleTokenizer.build_from_texts(
        [entry["instruction"] for entry in manifest["train_episodes"] + manifest["val_episodes"]]
    )
    tokenizer.save(run_dir / "vocab.json")

    stats = compute_normalization_stats(manifest, suite_dir=suite_dir, split="train")
    _save_json(stats, run_dir / "stats.json")

    train_dataset = LiberoStepDataset(
        manifest=manifest,
        suite_dir=suite_dir,
        split="train",
        tokenizer=tokenizer,
        camera_names=config.data.camera_names,
        image_size=config.data.image_size,
        max_text_tokens=config.data.max_text_tokens,
        sample_stride=config.data.sample_stride,
        max_samples=config.data.max_train_samples,
        stats=stats,
    )
    val_dataset = LiberoStepDataset(
        manifest=manifest,
        suite_dir=suite_dir,
        split="val",
        tokenizer=tokenizer,
        camera_names=config.data.camera_names,
        image_size=config.data.image_size,
        max_text_tokens=config.data.max_text_tokens,
        sample_stride=config.data.sample_stride,
        max_samples=config.data.max_val_samples,
        stats=stats,
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=config.train.batch_size,
        shuffle=True,
        num_workers=config.train.num_workers,
        collate_fn=collate_batch,
        pin_memory=device.type == "cuda",
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=config.train.batch_size,
        shuffle=False,
        num_workers=config.train.num_workers,
        collate_fn=collate_batch,
        pin_memory=device.type == "cuda",
    )

    sample_batch = next(iter(train_loader))
    proprio_dim = int(sample_batch["proprio"].shape[-1])
    action_dim = int(sample_batch["action"].shape[-1])

    model = OpenVLAStylePolicy(
        vocab_size=tokenizer.vocab_size,
        proprio_dim=proprio_dim,
        action_dim=action_dim,
        num_cameras=len(config.data.camera_names),
        hidden_dim=config.model.hidden_dim,
        num_heads=config.model.num_heads,
        depth=config.model.depth,
        mlp_ratio=config.model.mlp_ratio,
        dropout=config.model.dropout,
    ).to(device)

    optimizer = AdamW(model.parameters(), lr=config.train.lr, weight_decay=config.train.weight_decay)
    steps_per_epoch = config.train.max_train_steps_per_epoch or len(train_loader)
    total_steps = steps_per_epoch * config.train.epochs
    scheduler = _build_scheduler(optimizer, warmup_steps=config.train.warmup_steps, total_steps=total_steps)
    scaler = torch.amp.GradScaler(device.type, enabled=config.train.use_amp and device.type == "cuda")

    best_val_loss = float("inf")
    history: list[dict[str, Any]] = []

    for epoch in range(1, config.train.epochs + 1):
        train_metrics = _run_epoch(
            model=model,
            loader=train_loader,
            optimizer=optimizer,
            scaler=scaler,
            scheduler=scheduler,
            device=device,
            max_steps=config.train.max_train_steps_per_epoch,
            grad_clip_norm=config.train.grad_clip_norm,
            use_amp=config.train.use_amp,
            log_every=config.train.log_every,
            description=f"train e{epoch}",
        )
        val_metrics = _run_epoch(
            model=model,
            loader=val_loader,
            optimizer=None,
            scaler=scaler,
            scheduler=None,
            device=device,
            max_steps=config.train.max_val_steps,
            grad_clip_norm=config.train.grad_clip_norm,
            use_amp=config.train.use_amp,
            log_every=config.train.log_every,
            description=f"val e{epoch}",
        )

        epoch_record = {
            "epoch": epoch,
            "train_loss": train_metrics["loss"],
            "train_mae": train_metrics["mae"],
            "val_loss": val_metrics["loss"],
            "val_mae": val_metrics["mae"],
        }
        history.append(epoch_record)

        checkpoint = {
            "model_state_dict": model.state_dict(),
            "optimizer_state_dict": optimizer.state_dict(),
            "config": asdict(config),
            "stats": stats,
            "tokenizer_vocab": tokenizer.vocab,
            "manifest": manifest,
            "history": history,
            "suite_dir": str(suite_dir),
        }
        torch.save(checkpoint, run_dir / "last.pt")
        if val_metrics["loss"] <= best_val_loss:
            best_val_loss = val_metrics["loss"]
            torch.save(checkpoint, run_dir / "best.pt")

    summary = {
        "config_path": None if config_path is None else str(Path(config_path).expanduser().resolve()),
        "suite_dir": str(suite_dir),
        "manifest_path": str(manifest_path),
        "run_dir": str(run_dir),
        "device": str(device),
        "train_dataset_size": len(train_dataset),
        "val_dataset_size": len(val_dataset),
        "best_val_loss": best_val_loss,
        "history": history,
    }
    _save_json(summary, run_dir / "training_summary.json")
    return summary
