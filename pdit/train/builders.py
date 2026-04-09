from __future__ import annotations

import contextlib
import math
from typing import Any

import torch
from torch.optim.lr_scheduler import LambdaLR
from torch.utils.data import DataLoader

from common.runtime import get_device, set_device
from pdit.config import ExperimentConfig
from pdit.data.registry import build_dataset as build_dataset_from_registry
from pdit.model.registry import build_backbone as build_backbone_from_registry
from pdit.model.registry import build_obs_encoder as build_obs_encoder_from_registry
from pdit.policy.registry import build_policy as build_policy_from_registry


def build_dataset(path: str, cfg: ExperimentConfig):
    return build_dataset_from_registry(str(path), cfg)


def build_dataloaders(cfg: ExperimentConfig):
    dataset_train = build_dataset(str(cfg.train_data_path), cfg)
    dataset_valid = build_dataset(str(cfg.valid_data_path), cfg)
    dataloader_train = DataLoader(
        dataset_train,
        shuffle=True,
        batch_size=cfg.batch_size,
        num_workers=cfg.num_workers,
        persistent_workers=bool(cfg.num_workers > 0),
    )
    dataloader_valid = DataLoader(
        dataset_valid,
        shuffle=False,
        batch_size=cfg.batch_size,
        num_workers=cfg.num_workers,
        persistent_workers=bool(cfg.num_workers > 0),
    )
    return dataset_train, dataset_valid, dataloader_train, dataloader_valid


def build_obs_encoder(cfg: ExperimentConfig):
    return build_obs_encoder_from_registry(cfg)


def build_backbone(cfg: ExperimentConfig):
    return build_backbone_from_registry(cfg)


def build_policy(cfg: ExperimentConfig, strategy: str):
    device = set_device(cfg.device)
    obs_encoder = build_obs_encoder(cfg)
    backbone = build_backbone(cfg)
    policy = build_policy_from_registry(strategy, cfg, obs_encoder, backbone)
    policy.to(device)
    return policy


def build_optimizer(policy, cfg: ExperimentConfig) -> torch.optim.Optimizer:
    return policy.get_optimizer(
        learning_rate=cfg.learning_rate,
        betas=cfg.betas,
        eps=cfg.eps,
        transformer_weight_decay=cfg.transformer_weight_decay,
        obs_encoder_weight_decay=cfg.obs_encoder_weight_decay,
    )


def build_scheduler(optimizer: torch.optim.Optimizer, cfg: ExperimentConfig, train_loader_len: int):
    total_training_steps = max(
        1,
        (train_loader_len * cfg.train_epochs) // max(1, cfg.grad_accum_steps),
    )

    def lr_lambda(current_step: int) -> float:
        if current_step < cfg.lr_warmup_steps:
            return float(current_step) / float(max(1, cfg.lr_warmup_steps))
        progress = float(current_step - cfg.lr_warmup_steps) / float(
            max(1, total_training_steps - cfg.lr_warmup_steps)
        )
        progress = min(max(progress, 0.0), 1.0)
        return max(0.0, 0.5 * (1.0 + math.cos(math.pi * progress)))

    if cfg.lr_scheduler_name != "cosine":
        raise ValueError(f"Unsupported scheduler: {cfg.lr_scheduler_name}")
    return LambdaLR(optimizer, lr_lambda=lr_lambda)


def resolve_amp_dtype(amp_dtype: str = "float16"):
    if amp_dtype == "bfloat16":
        if torch.cuda.is_available() and hasattr(torch.cuda, "is_bf16_supported"):
            if torch.cuda.is_bf16_supported():
                return torch.bfloat16
    return torch.float16


def amp_enabled(enabled: bool = False) -> bool:
    device = get_device()
    return bool(enabled and torch.cuda.is_available() and device.type == "cuda")


def get_autocast_context(enabled: bool = False, amp_dtype: str = "float16"):
    if not amp_enabled(enabled):
        return contextlib.nullcontext()
    return torch.autocast(device_type="cuda", dtype=resolve_amp_dtype(amp_dtype))


def build_grad_scaler(enabled: bool = False, amp_dtype: str = "float16"):
    scaler_enabled = amp_enabled(enabled) and resolve_amp_dtype(amp_dtype) == torch.float16
    return torch.cuda.amp.GradScaler(enabled=scaler_enabled)


def move_batch_to_device(batch: tuple[Any, ...]) -> tuple[Any, ...]:
    device = get_device()
    moved = []
    for value in batch:
        if torch.is_tensor(value):
            moved.append(value.to(device))
        else:
            moved.append(value)
    return tuple(moved)
