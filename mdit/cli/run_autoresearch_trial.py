from __future__ import annotations

from ._bootstrap import bootstrap_local_cli_imports

bootstrap_local_cli_imports()

import argparse
import json
from pathlib import Path

from common.runtime import PROJECT_ROOT
from research import (
    finalize_mdit_autoresearch_trial,
    run_mdit_autoresearch_trial,
    train_mdit_autoresearch_trial,
)
from research.mdit_trial_runner import MDITTrialRequest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run one clean faithful-MDIT trial in full, train-only, or audit-only mode."
    )
    parser.add_argument(
        "--phase",
        type=str,
        choices=["full", "train-only", "audit-only"],
        default="full",
        help="`train-only` avoids RLBench entirely; `audit-only` evaluates an already-trained run offline.",
    )
    parser.add_argument(
        "--config",
        type=Path,
        default=PROJECT_ROOT / "configs" / "mdit" / "faithful_baseline.json",
        help="Base config JSON path.",
    )
    parser.add_argument("--stage-epochs", type=int, default=None, help="Training length for this trial.")
    parser.add_argument("--checkpoint-every", type=int, default=None, help="Periodic checkpoint interval.")
    parser.add_argument("--eval-episodes", type=int, default=None, help="Audit episodes per checkpoint.")
    parser.add_argument("--eval-seed", type=int, default=None, help="Audit seed.")
    parser.add_argument("--device", type=str, default=None, help="Optional runtime device override.")
    parser.add_argument("--ckpt-root", type=Path, default=None, help="Optional checkpoint root override.")
    parser.add_argument("--data-root", type=Path, default=None, help="Optional data root override.")
    parser.add_argument("--run-name", type=str, default=None, help="Explicit run name. Default is unique.")
    parser.add_argument("--run-dir", type=Path, default=None, help="Existing run dir for `audit-only` mode.")
    parser.add_argument("--experiment-name", type=str, default="mdit_trial", help="Short trial label for logs.")
    parser.add_argument("--description", type=str, default="", help="Free-form row text for results.tsv.")
    parser.add_argument("--max-steps", type=int, default=None, help="Max simulator steps per episode.")
    parser.add_argument("--heartbeat-every", type=int, default=None, help="Rollout heartbeat interval.")
    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=None,
        help="Run RLBench headless during checkpoint audit.",
    )
    parser.add_argument(
        "--show-progress",
        action=argparse.BooleanOptionalAction,
        default=None,
        help="Show per-episode progress during checkpoint audit.",
    )
    parser.add_argument(
        "--cleanup-failed",
        action=argparse.BooleanOptionalAction,
        default=None,
        help="Delete the whole run directory when collapse is detected.",
    )
    parser.add_argument("--audit-timeout-sec", type=int, default=None, help="Timeout for checkpoint audit.")
    parser.add_argument(
        "--set",
        dest="config_overrides",
        action="append",
        default=None,
        metavar="KEY=VALUE",
        help="Override a config field using JSON-parsed VALUE, e.g. --set transformer.dropout=0.0.",
    )
    parser.add_argument(
        "--pcd-transformer-variant",
        type=str,
        choices=["mdit", "pdit"],
        default=None,
        help="When use_pcd=true, choose MDIT transformer or PDIT DiT backbone implementation.",
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


def main() -> int:
    args = parse_args()
    if args.phase in {"full", "train-only"} and args.stage_epochs is None:
        raise SystemExit("--stage-epochs is required for full/train-only mode.")
    if args.phase == "audit-only" and args.run_dir is None:
        raise SystemExit("--run-dir is required for audit-only mode.")

    config_overrides = _parse_config_overrides(args.config_overrides)
    if args.pcd_transformer_variant is not None:
        if config_overrides is None:
            config_overrides = {}
        config_overrides["pcd_transformer_variant"] = str(args.pcd_transformer_variant)

    request_kwargs = {
        "config_path": args.config.expanduser().resolve(),
        "experiment_name": args.experiment_name,
        "description": args.description,
        "config_overrides": config_overrides,
    }
    optional_fields = {
        "stage_epochs": args.stage_epochs,
        "checkpoint_every": args.checkpoint_every,
        "eval_episodes": args.eval_episodes,
        "eval_seed": args.eval_seed,
        "device": args.device,
        "ckpt_root": None if args.ckpt_root is None else args.ckpt_root.expanduser().resolve(),
        "data_root": None if args.data_root is None else args.data_root.expanduser().resolve(),
        "run_name": args.run_name,
        "max_steps": args.max_steps,
        "heartbeat_every": args.heartbeat_every,
        "headless": args.headless,
        "show_progress": args.show_progress,
        "cleanup_failed": args.cleanup_failed,
        "audit_timeout_sec": args.audit_timeout_sec,
    }
    for key, value in optional_fields.items():
        if value is not None:
            request_kwargs[key] = value

    request = MDITTrialRequest(**request_kwargs)
    if args.phase == "full":
        result = run_mdit_autoresearch_trial(request)
    elif args.phase == "train-only":
        result = train_mdit_autoresearch_trial(request)
    else:
        audit_override_kwargs = {}
        for key, value in optional_fields.items():
            if value is not None:
                audit_override_kwargs[key] = value
        result = finalize_mdit_autoresearch_trial(
            args.run_dir.expanduser().resolve(),
            request_overrides=audit_override_kwargs,
        )
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
