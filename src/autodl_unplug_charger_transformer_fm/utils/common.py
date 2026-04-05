from __future__ import annotations

import random
from pathlib import Path

import numpy as np
import torch


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_ROOT = PROJECT_ROOT / "data"
CKPT_ROOT = PROJECT_ROOT / "ckpt"
_DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def default_device_str() -> str:
    return str(torch.device("cuda" if torch.cuda.is_available() else "cpu"))


def set_device(device: str | torch.device | None) -> torch.device:
    global _DEVICE
    _DEVICE = torch.device(default_device_str() if device is None else device)
    return _DEVICE


def get_device() -> torch.device:
    return _DEVICE


def set_seeds(seed: int) -> None:
    seed = int(seed)
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
