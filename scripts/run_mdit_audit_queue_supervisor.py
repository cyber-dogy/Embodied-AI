#!/usr/bin/env python3

from __future__ import annotations

import _bootstrap  # noqa: F401

import argparse
from dataclasses import asdict, dataclass
from datetime import datetime
import json
from pathlib import Path
import subprocess
import sys
import time


PROJECT_ROOT = Path(__file__).resolve().parents[1]
FINAL_HEARTBEAT_STATUSES = {"completed", "paused_on_target_success"}


@dataclass
class AuditQueueConfig:
    tag: str
    run_dirs: list[Path]
    poll_interval_sec: int = 60
    retry_delay_sec: int = 30


def _timestamp() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _slugify(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() else "_" for ch in str(value).strip().lower())
    cleaned = "_".join(part for part in cleaned.split("_") if part)
    return cleaned or "audit_queue"


def _state_path(tag: str) -> Path:
    return PROJECT_ROOT / "autoresearch_records" / f"mdit_audit_queue_state__{_slugify(tag)}.json"


def _log_path(tag: str) -> Path:
    path = PROJECT_ROOT / "autoresearch_records" / "logs"
    path.mkdir(parents=True, exist_ok=True)
    return path / f"{_slugify(tag)}__audit_queue.log"


def _append_log(path: Path, message: str) -> None:
    with path.open("a", encoding="utf-8") as handle:
        handle.write(f"[{_timestamp()}] {message}\n")


def _write_state(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def _run_shell(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=False, capture_output=True, text=True)


def _load_heartbeat(run_dir: Path) -> dict[str, object]:
    heartbeat_path = run_dir / "train_heartbeat.json"
    if not heartbeat_path.exists():
        return {}
    return json.loads(heartbeat_path.read_text(encoding="utf-8"))


def _heartbeat_status(run_dir: Path) -> str | None:
    payload = _load_heartbeat(run_dir)
    status = payload.get("status")
    return None if status is None else str(status)


def _audit_report_path(run_dir: Path) -> Path:
    return run_dir / "audit_report.json"


def _audit_ready(run_dir: Path) -> bool:
    return _heartbeat_status(run_dir) in FINAL_HEARTBEAT_STATUSES


def _audit_done(run_dir: Path) -> bool:
    return _audit_report_path(run_dir).exists()


def _find_active_train_processes() -> list[dict[str, str]]:
    result = _run_shell(["ps", "-eo", "pid,args"])
    matches: list[dict[str, str]] = []
    for line in result.stdout.splitlines():
        if "python" not in line:
            continue
        if "scripts/train.py --line mdit" not in line and "scripts/run_autoresearch_trial.py --line mdit" not in line:
            continue
        if "--phase audit-only" in line:
            continue
        pid, _, args = line.strip().partition(" ")
        matches.append({"pid": pid, "args": args})
    return matches


def _build_audit_command(run_dir: Path) -> list[str]:
    return [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "run_autoresearch_trial.py"),
        "--line",
        "mdit",
        "--phase",
        "audit-only",
        "--run-dir",
        str(run_dir),
    ]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Queue offline audits for completed MDIT runs without competing with active training.",
    )
    parser.add_argument("--tag", type=str, default="close_door_then_put_books_audits")
    parser.add_argument(
        "--run-dir",
        dest="run_dirs",
        type=Path,
        action="append",
        default=None,
        help="Run dir to audit when training is completed. Can be passed multiple times.",
    )
    parser.add_argument("--poll-interval-sec", type=int, default=60)
    parser.add_argument("--retry-delay-sec", type=int, default=30)
    return parser.parse_args()


def _build_config(args: argparse.Namespace) -> AuditQueueConfig:
    run_dirs = (
        [path.expanduser().resolve() for path in args.run_dirs]
        if args.run_dirs
        else [
            PROJECT_ROOT / "ckpt" / "close_door_mdit_rgb_text_3token_500",
            PROJECT_ROOT / "ckpt" / "put_books_on_bookshelf_mdit_rgb_text_3token_500",
        ]
    )
    return AuditQueueConfig(
        tag=str(args.tag),
        run_dirs=run_dirs,
        poll_interval_sec=int(args.poll_interval_sec),
        retry_delay_sec=int(args.retry_delay_sec),
    )


def main() -> int:
    args = parse_args()
    config = _build_config(args)
    state_path = _state_path(config.tag)
    log_path = _log_path(config.tag)
    _append_log(
        log_path,
        "audit queue supervisor started: " + ", ".join(run_dir.name for run_dir in config.run_dirs),
    )

    while True:
        active_trains = _find_active_train_processes()
        queue_status: list[dict[str, object]] = []
        next_run_dir: Path | None = None
        for run_dir in config.run_dirs:
            status = _heartbeat_status(run_dir)
            audited = _audit_done(run_dir)
            ready = _audit_ready(run_dir)
            row = {
                "run_name": run_dir.name,
                "run_dir": str(run_dir),
                "status": status,
                "audit_ready": ready,
                "audit_done": audited,
                "audit_report_path": str(_audit_report_path(run_dir)) if audited else None,
            }
            queue_status.append(row)
            if next_run_dir is None and ready and not audited:
                next_run_dir = run_dir

        phase = "wait_training" if active_trains else "idle"
        if next_run_dir is not None and not active_trains:
            phase = "run_audit"

        _write_state(
            state_path,
            {
                "updated_at": _timestamp(),
                "tag": config.tag,
                "phase": phase,
                "active_train_process_count": len(active_trains),
                "next_run_dir": None if next_run_dir is None else str(next_run_dir),
                "queue": queue_status,
                "config": {
                    key: [str(item) for item in value] if key == "run_dirs" else value
                    for key, value in asdict(config).items()
                },
            },
        )

        if next_run_dir is None:
            time.sleep(max(1, config.poll_interval_sec))
            continue

        if active_trains:
            time.sleep(max(1, config.poll_interval_sec))
            continue

        cmd = _build_audit_command(next_run_dir)
        _append_log(log_path, f"start audit: run={next_run_dir.name}")
        result = subprocess.run(cmd, cwd=PROJECT_ROOT, check=False)
        if result.returncode == 0 and _audit_done(next_run_dir):
            _append_log(log_path, f"audit completed: run={next_run_dir.name}")
            time.sleep(1)
            continue

        _append_log(
            log_path,
            f"audit failed or incomplete: run={next_run_dir.name} rc={result.returncode}; retry after {config.retry_delay_sec}s",
        )
        time.sleep(max(1, config.retry_delay_sec))


if __name__ == "__main__":
    raise SystemExit(main())
