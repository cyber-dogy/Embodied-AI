from __future__ import annotations

import contextlib
import math
from typing import Any

import torch
from torch.optim.lr_scheduler import LambdaLR
from torch.utils.data import DataLoader

from common.runtime import get_device, set_device
from lelan.config import LeLaNExperimentConfig
from lelan.data import build_dataset
from lelan.model.model import LeLaNPolicy
from lelan.model.utils import move_to_device


def build_datasets(cfg: LeLaNExperimentConfig):
    train_dataset = build_dataset(cfg.train_data_path, cfg)
    valid_dataset = build_dataset(cfg.valid_data_path, cfg)
    return train_dataset, valid_dataset


def build_dataloaders(cfg: LeLaNExperimentConfig):
    dataset_train, dataset_valid = build_datasets(cfg)
    train_loader = DataLoader(
        dataset_train,
        shuffle=True,
        batch_size=cfg.batch_size,
        num_workers=cfg.num_workers,
        persistent_workers=bool(cfg.num_workers > 0),
    )
    valid_loader = DataLoader(
        dataset_valid,
        shuffle=False,
        batch_size=cfg.batch_size,
        num_workers=cfg.num_workers,
        persistent_workers=bool(cfg.num_workers > 0),
    )
    return dataset_train, dataset_valid, train_loader, valid_loader


def build_policy(cfg: LeLaNExperimentConfig, dataset_stats: dict[str, Any]) -> LeLaNPolicy:
    device = set_device(cfg.device)
    policy = LeLaNPolicy(cfg, dataset_stats)
    policy.to(device)
    return policy


def build_optimizer(policy: LeLaNPolicy, cfg: LeLaNExperimentConfig) -> torch.optim.Optimizer:
    return torch.optim.AdamW(
        policy.get_optim_params(),
        lr=cfg.optimizer_lr,
        betas=cfg.optimizer_betas,
        eps=cfg.optimizer_eps,
        weight_decay=cfg.optimizer_weight_decay,
    )


def build_scheduler(optimizer: torch.optim.Optimizer, cfg: LeLaNExperimentConfig, train_loader_len: int):
    total_training_steps = max(1, (train_loader_len * cfg.train_epochs) // max(1, cfg.grad_accum_steps))

    def lr_lambda(current_step: int) -> float:
        if cfg.lr_scheduler_name == "constant":
            return 1.0
        if current_step < cfg.lr_warmup_steps:
            return float(current_step) / float(max(1, cfg.lr_warmup_steps))
        progress = float(current_step - cfg.lr_warmup_steps) / float(
            max(1, total_training_steps - cfg.lr_warmup_steps)
        )
        progress = min(max(progress, 0.0), 1.0)
        return max(0.0, 0.5 * (1.0 + math.cos(math.pi * progress)))

    if cfg.lr_scheduler_name not in {"cosine", "constant"}:
        raise ValueError(f"Unsupported scheduler: {cfg.lr_scheduler_name}")
    return LambdaLR(optimizer, lr_lambda=lr_lambda)


def resolve_amp_dtype():
    if torch.cuda.is_available() and hasattr(torch.cuda, "is_bf16_supported") and torch.cuda.is_bf16_supported():
        return torch.bfloat16
    return torch.float16


def amp_enabled(enabled: bool = False) -> bool:
    device = get_device()
    return bool(enabled and torch.cuda.is_available() and device.type == "cuda")


def get_autocast_context(enabled: bool = False):
    if not amp_enabled(enabled):
        return contextlib.nullcontext()
    return torch.autocast(device_type="cuda", dtype=resolve_amp_dtype())


def build_grad_scaler(enabled: bool = False):
    scaler_enabled = amp_enabled(enabled) and resolve_amp_dtype() == torch.float16
    return torch.cuda.amp.GradScaler(enabled=scaler_enabled)


def move_batch_to_device(batch: dict[str, Any]) -> dict[str, Any]:
    return move_to_device(batch, get_device())
