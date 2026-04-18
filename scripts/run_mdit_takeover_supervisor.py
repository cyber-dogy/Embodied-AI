#!/usr/bin/env python3

from __future__ import annotations

import _bootstrap  # noqa: F401

import argparse
import json
import time
import traceback
from pathlib import Path

from common.runtime import PROJECT_ROOT
from research.mdit_takeover_controller import FINAL_TAKEOVER_STATUSES
from research.mdit_takeover_controller import TakeoverConfig, run_mdit_takeover_controller


def _timestamp() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%S%z")


def _slugify(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() else "_" for ch in str(value).strip().lower())
    cleaned = "_".join(part for part in cleaned.split("_") if part)
    return cleaned or "takeover"


def _state_path(tag: str) -> Path:
    return PROJECT_ROOT / "autoresearch_records" / f"mdit_takeover_state__{_slugify(tag)}.json"


def _supervisor_log_path(tag: str) -> Path:
    path = PROJECT_ROOT / "autoresearch_records" / "logs"
    path.mkdir(parents=True, exist_ok=True)
    return path / f"{_slugify(tag)}__supervisor.log"


def _append_log(log_path: Path, message: str) -> None:
    with log_path.open("a", encoding="utf-8") as handle:
        handle.write(f"[{_timestamp()}] {message}\n")


def _load_state_status(path: Path) -> str | None:
    if not path.exists():
        return None
    payload = json.loads(path.read_text(encoding="utf-8"))
    status = payload.get("status")
    return None if status is None else str(status)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Supervisor for the MDIT takeover controller.")
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
    parser.add_argument("--restart-delay-sec", type=int, default=20, help="Delay before restarting the controller.")
    return parser.parse_args()


def _build_config(args: argparse.Namespace) -> TakeoverConfig:
    return TakeoverConfig(
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


def main() -> int:
    args = parse_args()
    config = _build_config(args)
    state_path = _state_path(str(config.tag))
    log_path = _supervisor_log_path(str(config.tag))

    while True:
        status = _load_state_status(state_path)
        if status in FINAL_TAKEOVER_STATUSES:
            _append_log(log_path, f"supervisor exits on final status={status}")
            return 0
        try:
            _append_log(log_path, f"launch controller with status={status}")
            result = run_mdit_takeover_controller(config)
            final_status = str(result.get("status"))
            _append_log(log_path, f"controller returned status={final_status}")
            if final_status in FINAL_TAKEOVER_STATUSES:
                return 0
        except Exception as exc:  # noqa: BLE001
            _append_log(log_path, f"controller crashed: {exc}")
            _append_log(log_path, traceback.format_exc())
        time.sleep(max(1, int(args.restart_delay_sec)))


if __name__ == "__main__":
    raise SystemExit(main())
