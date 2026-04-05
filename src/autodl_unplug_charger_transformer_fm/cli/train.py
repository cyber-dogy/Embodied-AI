from __future__ import annotations

import argparse
import json
from pathlib import Path

from ..config import ExperimentConfig, load_config
from ..utils.common import PROJECT_ROOT


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train the unplug_charger policy from a JSON config.")
    parser.add_argument(
        "--config",
        type=Path,
        default=PROJECT_ROOT / "configs" / "fm_autodl_lab.json",
        help="Path to a training config JSON file.",
    )
    parser.add_argument("--strategy", type=str, default="fm", help="Policy strategy name.")
    parser.add_argument("--run-name", type=str, default=None, help="Override run_name.")
    parser.add_argument(
        "--data-root",
        type=Path,
        default=None,
        help="Override the data root. Train/valid paths become <data_root>/<task_name>/(train|valid).",
    )
    parser.add_argument("--ckpt-root", type=Path, default=None, help="Override checkpoint root.")
    parser.add_argument("--device", type=str, default=None, help="Override runtime device, e.g. cuda or cpu.")
    parser.add_argument(
        "--resume",
        action=argparse.BooleanOptionalAction,
        default=None,
        help="Override resume_from_latest in the config.",
    )
    return parser.parse_args()


def apply_train_overrides(cfg: ExperimentConfig, args: argparse.Namespace) -> ExperimentConfig:
    if args.run_name:
        cfg.run_name = str(args.run_name)
    if args.data_root is not None:
        task_root = args.data_root.expanduser().resolve() / cfg.task_name
        cfg.train_data_path = task_root / "train"
        cfg.valid_data_path = task_root / "valid"
    if args.ckpt_root is not None:
        cfg.ckpt_root = args.ckpt_root.expanduser().resolve()
    if args.device is not None:
        cfg.device = str(args.device)
    if args.resume is not None:
        cfg.resume_from_latest = bool(args.resume)
    return cfg


def main() -> int:
    args = parse_args()
    from ..training.runner import train_experiment

    cfg = apply_train_overrides(load_config(args.config), args)
    summary = train_experiment(cfg, strategy=args.strategy)
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
