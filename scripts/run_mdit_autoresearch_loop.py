#!/usr/bin/env python3

from __future__ import annotations

import _bootstrap  # noqa: F401

import argparse
import json
from pathlib import Path

from common.runtime import PROJECT_ROOT
from research.mdit_autoresearch_loop import run_mdit_attached_watch, run_mdit_autoresearch_loop


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the full faithful-MDIT autoresearch loop.")
    parser.add_argument("--tag", type=str, default="default", help="Short label for the loop summary file.")
    parser.add_argument(
        "--config",
        type=Path,
        default=PROJECT_ROOT / "configs" / "mdit" / "obs3_rgb5_sep_lastblock_a8_gate100.json",
        help="Base config JSON path.",
    )
    parser.add_argument(
        "--baseline-run-dir",
        type=Path,
        default=None,
        help="Optional existing faithful-baseline run dir to reuse instead of rerunning experiment 0.",
    )
    parser.add_argument(
        "--wait-for-baseline",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Wait for --baseline-run-dir to finish if it is still running.",
    )
    parser.add_argument("--device", type=str, default=None, help="Optional runtime device override.")
    parser.add_argument("--ckpt-root", type=Path, default=None, help="Optional checkpoint root override.")
    parser.add_argument("--data-root", type=Path, default=None, help="Optional data root override.")
    parser.add_argument(
        "--attach-run-dir",
        type=Path,
        default=None,
        help="Attach to an existing train-only run dir and monitor/audit it instead of launching a new loop.",
    )
    parser.add_argument("--train-pid", type=int, default=None, help="Optional PID for the attached training process.")
    parser.add_argument("--checkpoint-every", type=int, default=100, help="Checkpoint cadence for attached watch mode.")
    parser.add_argument("--expected-epochs", type=int, default=500, help="Expected total epochs for attached watch mode.")
    parser.add_argument(
        "--intermediate-eval-episodes",
        type=int,
        default=20,
        help="Episodes for 100/200/300/400 epoch attached audits.",
    )
    parser.add_argument(
        "--final-eval-episodes",
        type=int,
        default=100,
        help="Episodes for the final epoch attached audit.",
    )
    parser.add_argument("--poll-sec", type=int, default=60, help="Polling interval for attached watch mode.")
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
    if args.attach_run_dir is not None:
        result = run_mdit_attached_watch(
            run_dir=args.attach_run_dir.expanduser().resolve(),
            train_pid=args.train_pid,
            config_path=args.config.expanduser().resolve(),
            checkpoint_every=int(args.checkpoint_every),
            expected_epochs=int(args.expected_epochs),
            intermediate_eval_episodes=int(args.intermediate_eval_episodes),
            final_eval_episodes=int(args.final_eval_episodes),
            device=args.device,
            headless=bool(args.headless),
            show_progress=bool(args.show_progress),
            cleanup_failed=bool(args.cleanup_failed),
            audit_timeout_sec=int(args.audit_timeout_sec),
            ckpt_root=None if args.ckpt_root is None else args.ckpt_root.expanduser().resolve(),
            data_root=None if args.data_root is None else args.data_root.expanduser().resolve(),
            poll_sec=int(args.poll_sec),
        )
    else:
        result = run_mdit_autoresearch_loop(
            tag=args.tag,
            config_path=args.config.expanduser().resolve(),
            baseline_run_dir=None if args.baseline_run_dir is None else args.baseline_run_dir.expanduser().resolve(),
            wait_for_baseline=bool(args.wait_for_baseline),
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
