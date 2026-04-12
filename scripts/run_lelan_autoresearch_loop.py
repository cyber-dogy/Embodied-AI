#!/usr/bin/env python3

from __future__ import annotations

import _bootstrap  # noqa: F401

import argparse
import json
from pathlib import Path

from common.runtime import PROJECT_ROOT
from research.lelan_autoresearch_loop import run_lelan_autoresearch_loop


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the full LeLaN autoresearch loop.")
    parser.add_argument("--tag", type=str, default="default", help="Short label for the loop summary file.")
    parser.add_argument(
        "--config",
        type=Path,
        default=PROJECT_ROOT / "configs" / "lelan" / "obs3_rgb5_a8_gate100.json",
        help="Base config JSON path.",
    )
    parser.add_argument("--device", type=str, default=None, help="Optional runtime device override.")
    parser.add_argument("--ckpt-root", type=Path, default=None, help="Optional checkpoint root override.")
    parser.add_argument("--data-root", type=Path, default=None, help="Optional data root override.")
    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Run RLBench headless during checkpoint audits.",
    )
    parser.add_argument(
        "--show-progress",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Show per-episode progress during checkpoint audits.",
    )
    parser.add_argument(
        "--cleanup-failed",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Delete failed trial directories when collapse is detected.",
    )
    parser.add_argument("--audit-timeout-sec", type=int, default=7200, help="Per-trial audit timeout.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    result = run_lelan_autoresearch_loop(
        tag=args.tag,
        config_path=args.config.expanduser().resolve(),
        device=args.device,
        headless=bool(args.headless),
        show_progress=bool(args.show_progress),
        cleanup_failed=bool(args.cleanup_failed),
        audit_timeout_sec=int(args.audit_timeout_sec),
        ckpt_root=None if args.ckpt_root is None else args.ckpt_root.expanduser().resolve(),
        data_root=None if args.data_root is None else args.data_root.expanduser().resolve(),
    )
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
