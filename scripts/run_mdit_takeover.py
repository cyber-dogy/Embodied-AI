from __future__ import annotations

from pathlib import Path
import argparse
import json

import _bootstrap  # noqa: F401

from common.runtime import PROJECT_ROOT
from research.mdit_takeover_controller import TakeoverConfig, run_mdit_takeover_controller


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Watch an active MDIT run and fallback to the incumbent best route.")
    parser.add_argument("--tag", type=str, default="mdit_takeover", help="State file tag.")
    parser.add_argument("--active-run-dir", type=Path, required=True, help="Active challenger run dir.")
    parser.add_argument(
        "--incumbent-run-dir",
        type=Path,
        default=PROJECT_ROOT / "ckpt" / "unplug_charger_mdit_rgb_text_3token_100",
        help="Locked incumbent best run dir.",
    )
    parser.add_argument("--incumbent-score", type=float, default=0.55, help="Locked incumbent best success rate.")
    parser.add_argument("--fallback-stage-epochs", type=int, default=500, help="Fallback best-route stage epochs.")
    parser.add_argument("--fallback-eval-episodes", type=int, default=20, help="Fallback audit episodes.")
    parser.add_argument("--device", type=str, default=None, help="Runtime device override.")
    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Run RLBench headless during audit stages.",
    )
    parser.add_argument(
        "--show-progress",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Show per-episode audit progress.",
    )
    parser.add_argument(
        "--enable-wandb",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Enable wandb in fallback training.",
    )
    parser.add_argument("--audit-timeout-sec", type=int, default=7200, help="Audit timeout budget.")
    parser.add_argument("--stall-timeout-sec", type=int, default=2700, help="Heartbeat stall timeout.")
    parser.add_argument("--poll-interval-sec", type=int, default=20, help="Polling interval.")
    parser.add_argument("--max-resume-retries", type=int, default=2, help="Resume retries for the active run.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    config = TakeoverConfig(
        tag=str(args.tag),
        active_run_dir=args.active_run_dir.expanduser().resolve(),
        incumbent_run_dir=args.incumbent_run_dir.expanduser().resolve(),
        incumbent_score=float(args.incumbent_score),
        fallback_stage_epochs=int(args.fallback_stage_epochs),
        fallback_eval_episodes=int(args.fallback_eval_episodes),
        device=args.device,
        headless=bool(args.headless),
        show_progress=bool(args.show_progress),
        enable_wandb=bool(args.enable_wandb),
        audit_timeout_sec=int(args.audit_timeout_sec),
        stall_timeout_sec=int(args.stall_timeout_sec),
        poll_interval_sec=int(args.poll_interval_sec),
        max_resume_retries=int(args.max_resume_retries),
    )
    result = run_mdit_takeover_controller(config)
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
