from __future__ import annotations

from ._bootstrap import bootstrap_local_cli_imports

bootstrap_local_cli_imports()

import argparse
import json
from pathlib import Path

from config import ExperimentConfig, apply_config_overrides, load_config
from common.runtime import PROJECT_ROOT


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
    parser.add_argument(
        "--set",
        dest="config_overrides",
        action="append",
        default=None,
        metavar="KEY=VALUE",
        help="Override a config field using JSON-parsed VALUE, e.g. --set dropout=0.0.",
    )
    return parser.parse_args()


def _parse_override_value(raw: str):
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        lowered = raw.strip().lower()
        if lowered == "true":
            return True
        if lowered == "false":
            return False
        return raw


def _parse_config_overrides(items: list[str] | None) -> dict[str, object] | None:
    if not items:
        return None
    overrides: dict[str, object] = {}
    for item in items:
        key, sep, value = item.partition("=")
        if not sep:
            raise SystemExit(f"Invalid --set override {item!r}. Expected KEY=VALUE.")
        key = key.strip()
        if not key:
            raise SystemExit(f"Invalid --set override {item!r}. Empty key.")
        overrides[key] = _parse_override_value(value)
    return overrides


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
    cfg = apply_config_overrides(cfg, _parse_config_overrides(args.config_overrides))
    return cfg


def main() -> int:
    args = parse_args()
    from train.runner import train_experiment

    cfg = apply_train_overrides(load_config(args.config), args)
    summary = train_experiment(cfg, strategy=args.strategy)
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
