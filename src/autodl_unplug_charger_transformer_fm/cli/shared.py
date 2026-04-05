from __future__ import annotations

from pathlib import Path
from typing import Any

from ..config import ExperimentConfig


def payload_cfg_to_experiment_cfg(
    payload_cfg: dict[str, Any],
    *,
    seed: int | None = None,
    ckpt_root: Path | None = None,
    heartbeat_every: int | None = None,
    device: str | None = None,
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
    return ExperimentConfig(**cfg_dict)
