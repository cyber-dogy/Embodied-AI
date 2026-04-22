#!/usr/bin/env python3

from __future__ import annotations

import _bootstrap  # noqa: F401

import argparse
from dataclasses import asdict, dataclass
from datetime import datetime
import json
import subprocess
import time
from pathlib import Path

FINAL_HEARTBEAT_STATUSES = {"completed", "paused_on_target_success"}
PROJECT_ROOT = Path(__file__).resolve().parents[1]


@dataclass
class SequenceConfig:
    tag: str
    primary_session: str
    primary_run_dir: Path
    primary_launch_script: Path
    secondary_session: str
    secondary_run_dir: Path
    secondary_launch_script: Path
    poll_interval_sec: int = 30
    restart_delay_sec: int = 10


def _timestamp() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _slugify(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() else "_" for ch in str(value).strip().lower())
    cleaned = "_".join(part for part in cleaned.split("_") if part)
    return cleaned or "sequence"


def _state_path(tag: str) -> Path:
    return PROJECT_ROOT / "autoresearch_records" / f"mdit_sequence_state__{_slugify(tag)}.json"


def _log_path(tag: str) -> Path:
    path = PROJECT_ROOT / "autoresearch_records" / "logs"
    path.mkdir(parents=True, exist_ok=True)
    return path / f"{_slugify(tag)}__sequence_supervisor.log"


def _append_log(path: Path, message: str) -> None:
    with path.open("a", encoding="utf-8") as handle:
        handle.write(f"[{_timestamp()}] {message}\n")


def _run_shell(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=False, capture_output=True, text=True)


def _session_exists(session_name: str) -> bool:
    result = _run_shell(["tmux", "has-session", "-t", session_name])
    return result.returncode == 0


def _kill_session_if_exists(session_name: str) -> None:
    if _session_exists(session_name):
        _run_shell(["tmux", "kill-session", "-t", session_name])


def _launch_session(session_name: str, repo_root: Path, launch_script: Path) -> None:
    cmd = f"cd {repo_root} && {launch_script}"
    _run_shell(["tmux", "new-session", "-d", "-s", session_name, cmd])


def _find_train_processes(config_path: Path) -> list[dict[str, str]]:
    # 这里只匹配主训练入口，避免把 tmux/bash 自己误判成训练仍在运行。
    result = _run_shell(["ps", "-eo", "pid,args"])
    matches: list[dict[str, str]] = []
    needle = f"--config {config_path}"
    for line in result.stdout.splitlines():
        if "python" not in line or "scripts/train.py --line mdit" not in line:
            continue
        if needle not in line:
            continue
        pid, _, args = line.strip().partition(" ")
        matches.append({"pid": pid, "args": args})
    return matches


def _load_heartbeat(run_dir: Path) -> dict[str, object]:
    heartbeat_path = run_dir / "train_heartbeat.json"
    if not heartbeat_path.exists():
        return {}
    return json.loads(heartbeat_path.read_text(encoding="utf-8"))


def _heartbeat_status(run_dir: Path) -> str | None:
    payload = _load_heartbeat(run_dir)
    status = payload.get("status")
    return None if status is None else str(status)


def _write_state(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def _ensure_session_running(
    *,
    session_name: str,
    run_dir: Path,
    launch_script: Path,
    log_path: Path,
    repo_root: Path,
) -> list[dict[str, str]]:
    config_path = run_dir / "config.json"
    processes = _find_train_processes(config_path)
    if processes:
        return processes

    # 这里把“tmux 会话仍在，但训练进程暂时还没出现”的状态视为可接受。
    # 典型场景是后续任务正在等待数据集到位，或者 guard 正在做启动前检查，
    # 这时不应每个轮询周期都把会话杀掉重拉。
    if _session_exists(session_name):
        return []

    # 训练如果还没结束，但 tmux 会话已经空了，就在这里自动接管重拉。
    _append_log(
        log_path,
        f"no active train process for {run_dir.name}; relaunch session={session_name}",
    )
    _kill_session_if_exists(session_name)
    _launch_session(session_name, repo_root, launch_script)
    time.sleep(3)
    return _find_train_processes(config_path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sequence supervisor: finish current MDIT run, then automatically start the next resume run.",
    )
    parser.add_argument("--tag", type=str, default="close_door_then_put_books_on_bookshelf")
    parser.add_argument("--primary-session", type=str, default="mdit_close_door_500")
    parser.add_argument(
        "--primary-run-dir",
        type=Path,
        default=PROJECT_ROOT / "ckpt" / "close_door_mdit_rgb_text_3token_500",
    )
    parser.add_argument(
        "--primary-launch-script",
        type=Path,
        default=PROJECT_ROOT / "scripts" / "run_mdit_train_guard.sh",
    )
    parser.add_argument("--secondary-session", type=str, default="mdit_put_books_on_bookshelf_500")
    parser.add_argument(
        "--secondary-run-dir",
        type=Path,
        default=PROJECT_ROOT / "ckpt" / "put_books_on_bookshelf_mdit_rgb_text_3token_500",
    )
    parser.add_argument(
        "--secondary-launch-script",
        type=Path,
        default=PROJECT_ROOT / "scripts" / "run_put_books_on_bookshelf_mdit_mainline_500.sh",
    )
    parser.add_argument("--poll-interval-sec", type=int, default=30)
    parser.add_argument("--restart-delay-sec", type=int, default=10)
    return parser.parse_args()


def _build_config(args: argparse.Namespace) -> SequenceConfig:
    return SequenceConfig(
        tag=str(args.tag),
        primary_session=str(args.primary_session),
        primary_run_dir=args.primary_run_dir.expanduser().resolve(),
        primary_launch_script=args.primary_launch_script.expanduser().resolve(),
        secondary_session=str(args.secondary_session),
        secondary_run_dir=args.secondary_run_dir.expanduser().resolve(),
        secondary_launch_script=args.secondary_launch_script.expanduser().resolve(),
        poll_interval_sec=int(args.poll_interval_sec),
        restart_delay_sec=int(args.restart_delay_sec),
    )


def main() -> int:
    args = parse_args()
    config = _build_config(args)
    repo_root = PROJECT_ROOT
    state_path = _state_path(config.tag)
    log_path = _log_path(config.tag)
    _append_log(
        log_path,
        (
            "sequence supervisor started: "
            f"primary={config.primary_run_dir.name} -> secondary={config.secondary_run_dir.name}"
        ),
    )

    phase = "wait_primary"
    while True:
        primary_status = _heartbeat_status(config.primary_run_dir)
        secondary_status = _heartbeat_status(config.secondary_run_dir)
        primary_processes = _find_train_processes(config.primary_run_dir / "config.json")
        secondary_processes = _find_train_processes(config.secondary_run_dir / "config.json")

        state_payload = {
            "updated_at": _timestamp(),
            "tag": config.tag,
            "phase": phase,
            "primary_session": config.primary_session,
            "primary_run_dir": str(config.primary_run_dir),
            "primary_status": primary_status,
            "primary_process_count": len(primary_processes),
            "secondary_session": config.secondary_session,
            "secondary_run_dir": str(config.secondary_run_dir),
            "secondary_status": secondary_status,
            "secondary_process_count": len(secondary_processes),
            "config": {
                key: str(value) if isinstance(value, Path) else value
                for key, value in asdict(config).items()
            },
        }
        _write_state(state_path, state_payload)

        if phase == "wait_primary":
            if primary_status in FINAL_HEARTBEAT_STATUSES and not primary_processes:
                _append_log(
                    log_path,
                    f"primary finished with status={primary_status}; switch to secondary",
                )
                phase = "run_secondary"
                time.sleep(1)
                continue

            if primary_status not in FINAL_HEARTBEAT_STATUSES:
                primary_processes = _ensure_session_running(
                    session_name=config.primary_session,
                    run_dir=config.primary_run_dir,
                    launch_script=config.primary_launch_script,
                    log_path=log_path,
                    repo_root=repo_root,
                )
                if not primary_processes:
                    _append_log(
                        log_path,
                        "primary relaunch did not produce a visible train process yet",
                    )

        if phase == "run_secondary":
            if secondary_status in FINAL_HEARTBEAT_STATUSES and not secondary_processes:
                _append_log(
                    log_path,
                    f"secondary finished with status={secondary_status}; supervisor exits",
                )
                return 0

            secondary_processes = _ensure_session_running(
                session_name=config.secondary_session,
                run_dir=config.secondary_run_dir,
                launch_script=config.secondary_launch_script,
                log_path=log_path,
                repo_root=repo_root,
            )
            if not secondary_processes:
                _append_log(
                    log_path,
                    "secondary relaunch did not produce a visible train process yet",
                )

        time.sleep(max(1, config.poll_interval_sec))


if __name__ == "__main__":
    raise SystemExit(main())
