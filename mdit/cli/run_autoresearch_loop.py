from __future__ import annotations

from ._bootstrap import bootstrap_local_cli_imports

bootstrap_local_cli_imports()

import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys

from common.runtime import PROJECT_ROOT
from research.mdit_autoresearch_loop import (
    DEFAULT_MAX_AUDIT_RETRIES,
    DEFAULT_MAX_TRAIN_RETRIES,
    DEFAULT_POLL_INTERVAL_SEC,
    DEFAULT_TRAIN_STALL_TIMEOUT_SEC,
    run_mdit_autoresearch_loop,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the full MDIT autoresearch loop with watchdog state.")
    parser.add_argument("--tag", type=str, default="default", help="Short label for the loop state file.")
    parser.add_argument(
        "--lane-a-config",
        type=Path,
        default=PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lab.json",
        help="Lane A mainline config.",
    )
    parser.add_argument(
        "--lane-b-config",
        type=Path,
        default=PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lane_b.json",
        help="Lane B faithful challenger config.",
    )
    parser.add_argument(
        "--lane-c-config",
        type=Path,
        default=PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lane_c_mtdp_strict.json",
        help="Lane C strict MTDP challenger config.",
    )
    parser.add_argument(
        "--existing-lane-a-run-dir",
        type=Path,
        default=None,
        help="Optional existing Lane A run dir to adopt before launching fresh candidates.",
    )
    parser.add_argument("--strategy", type=str, default="fm", help="Policy strategy name.")
    parser.add_argument("--device", type=str, default=None, help="Optional runtime device override.")
    parser.add_argument("--ckpt-root", type=Path, default=None, help="Optional checkpoint root override.")
    parser.add_argument("--data-root", type=Path, default=None, help="Optional data root override.")
    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Run RLBench headless during audits.",
    )
    parser.add_argument(
        "--show-progress",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Show per-episode progress during audits.",
    )
    parser.add_argument(
        "--enable-wandb",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Enable wandb during training stages.",
    )
    parser.add_argument("--audit-timeout-sec", type=int, default=7200, help="Per-audit timeout budget.")
    parser.add_argument(
        "--train-stall-timeout-sec",
        type=int,
        default=DEFAULT_TRAIN_STALL_TIMEOUT_SEC,
        help="Restart training if the heartbeat file stops moving for this many seconds.",
    )
    parser.add_argument(
        "--poll-interval-sec",
        type=int,
        default=DEFAULT_POLL_INTERVAL_SEC,
        help="Watchdog polling interval while child training is running.",
    )
    parser.add_argument(
        "--max-train-retries",
        type=int,
        default=DEFAULT_MAX_TRAIN_RETRIES,
        help="Maximum watchdog restarts for a single training stage.",
    )
    parser.add_argument(
        "--max-audit-retries",
        type=int,
        default=DEFAULT_MAX_AUDIT_RETRIES,
        help="Maximum watchdog retries for a single audit stage.",
    )
    parser.add_argument(
        "--tmux-session",
        type=str,
        default=None,
        help="Optional tmux session name. When set, this command relaunches itself detached inside tmux.",
    )
    return parser.parse_args()


def _spawn_tmux_session(args: argparse.Namespace) -> int:
    if shutil.which("tmux") is None:
        raise SystemExit("tmux is not installed or not in PATH.")
    session_name = str(args.tmux_session).strip()
    if not session_name:
        raise SystemExit("--tmux-session cannot be empty.")
    has_session = subprocess.run(["tmux", "has-session", "-t", session_name], capture_output=True)
    if has_session.returncode == 0:
        raise SystemExit(f"tmux session already exists: {session_name}")

    forwarded_args: list[str] = []
    argv = sys.argv[1:]
    skip_next = False
    for idx, item in enumerate(argv):
        if skip_next:
            skip_next = False
            continue
        if item == "--tmux-session":
            skip_next = True
            continue
        if item.startswith("--tmux-session="):
            continue
        forwarded_args.append(item)

    command = [sys.executable, str(PROJECT_ROOT / "scripts" / "run_mdit_autoresearch_loop.py"), *forwarded_args]
    subprocess.run(["tmux", "new-session", "-d", "-s", session_name, *command], check=True)
    print(
        json.dumps(
            {
                "tmux_session": session_name,
                "launched_command": command,
            },
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    return 0


def main() -> int:
    args = parse_args()
    if args.tmux_session is not None:
        return _spawn_tmux_session(args)

    result = run_mdit_autoresearch_loop(
        tag=args.tag,
        lane_a_config=args.lane_a_config.expanduser().resolve(),
        lane_b_config=args.lane_b_config.expanduser().resolve(),
        lane_c_config=args.lane_c_config.expanduser().resolve(),
        existing_lane_a_run_dir=(
            None if args.existing_lane_a_run_dir is None else args.existing_lane_a_run_dir.expanduser().resolve()
        ),
        strategy=args.strategy,
        device=args.device,
        headless=bool(args.headless),
        show_progress=bool(args.show_progress),
        cleanup_failed=True,
        audit_timeout_sec=int(args.audit_timeout_sec),
        ckpt_root=None if args.ckpt_root is None else args.ckpt_root.expanduser().resolve(),
        data_root=None if args.data_root is None else args.data_root.expanduser().resolve(),
        enable_wandb=bool(args.enable_wandb),
        stall_timeout_sec=int(args.train_stall_timeout_sec),
        poll_interval_sec=int(args.poll_interval_sec),
        max_train_retries=int(args.max_train_retries),
        max_audit_retries=int(args.max_audit_retries),
    )
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
