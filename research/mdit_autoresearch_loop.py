from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys
import time
from typing import Any

from common.runtime import PROJECT_ROOT
from mdit.config import load_config
from research.archive_writer import archive_directory_as_milestone, default_source_docs, write_task_index
from research.mdit_trial_runner import (
    TrialRequest,
    adopt_existing_mdit_autoresearch_run,
    finalize_mdit_autoresearch_trial,
)


@dataclass(slots=True)
class SearchSpec:
    name: str
    lane: str
    config_path: Path
    stage_epochs: int
    eval_episodes: int
    description: str
    overrides: dict[str, Any]


DEFAULT_TRAIN_STALL_TIMEOUT_SEC = 60 * 45
DEFAULT_POLL_INTERVAL_SEC = 20
DEFAULT_MAX_TRAIN_RETRIES = 2
DEFAULT_MAX_AUDIT_RETRIES = 1
CHAMPION_ALIAS_NAME = "mdit_best"
CHAMPION_ALIAS_JSON = "mdit_best.json"


def _slugify(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() else "_" for ch in str(value).strip().lower())
    cleaned = "_".join(part for part in cleaned.split("_") if part)
    return cleaned or "trial"


def _record_dir() -> Path:
    path = PROJECT_ROOT / "autoresearch_records"
    path.mkdir(parents=True, exist_ok=True)
    (path / "logs").mkdir(parents=True, exist_ok=True)
    return path


def _logs_dir() -> Path:
    return _record_dir() / "logs"


def _has_cached_hf_file(model_dir: str, filename: str) -> bool:
    snapshots_dir = Path.home() / ".cache" / "huggingface" / "hub" / model_dir / "snapshots"
    if not snapshots_dir.exists():
        return False
    return any(path.is_file() for path in snapshots_dir.glob(f"*/{filename}"))


def _child_process_env() -> dict[str, str]:
    env = dict(os.environ)
    # 这些模型已经在本机缓存过时，优先强制离线加载，避免 autoresearch 因外网握手超时中断。
    has_timm_clip = _has_cached_hf_file("models--timm--vit_base_patch16_clip_224.openai", "pytorch_model.bin")
    has_openai_clip = _has_cached_hf_file("models--openai--clip-vit-base-patch16", "model.safetensors")
    if has_timm_clip and has_openai_clip:
        env.setdefault("HF_HUB_OFFLINE", "1")
        env.setdefault("TRANSFORMERS_OFFLINE", "1")
        env.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
    return env


def _state_path(tag: str) -> Path:
    return _record_dir() / f"mdit_loop_state__{_slugify(tag)}.json"


def _write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(_json_safe(payload), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _timestamp() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _json_safe(value: Any) -> Any:
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, dict):
        return {str(key): _json_safe(val) for key, val in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)


def _make_unique_run_name(base_name: str, experiment_name: str, stage_epochs: int) -> str:
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{base_name}__{_slugify(experiment_name)}__e{int(stage_epochs):04d}__{stamp}"


def _spec_to_dict(spec: SearchSpec) -> dict[str, Any]:
    payload = asdict(spec)
    payload["config_path"] = str(Path(spec.config_path).expanduser().resolve())
    return payload


def _spec_from_dict(payload: dict[str, Any]) -> SearchSpec:
    data = dict(payload)
    data["config_path"] = Path(data["config_path"])
    return SearchSpec(**data)


def _candidate_key(spec: SearchSpec) -> tuple[str, int, int]:
    return (str(spec.name), int(spec.stage_epochs), int(spec.eval_episodes))


def _run_dir_for(run_name: str, ckpt_root: Path) -> Path:
    return ckpt_root / run_name


def _load_record_for_run(run_name: str) -> dict[str, Any] | None:
    path = _record_dir() / f"{run_name}.json"
    if not path.exists():
        return None
    return _load_json(path)


def _find_existing_trial_record(
    *,
    experiment_name: str,
    stage_epochs: int,
    eval_episodes: int,
) -> dict[str, Any] | None:
    candidates: list[tuple[float, Path]] = []
    for path in _record_dir().glob("*.json"):
        if path.name.startswith("mdit_loop_state__"):
            continue
        try:
            payload = _load_json(path)
        except Exception:
            continue
        if str(payload.get("line")) != "mdit":
            continue
        if str(payload.get("experiment_name")) != str(experiment_name):
            continue
        if int(payload.get("stage_epochs") or 0) != int(stage_epochs):
            continue
        if int(payload.get("eval_episodes") or 0) != int(eval_episodes):
            continue
        candidates.append((path.stat().st_mtime, path))
    if not candidates:
        return None
    candidates.sort(key=lambda item: item[0], reverse=True)
    return _load_json(candidates[0][1])


def _find_existing_result(rows: list[dict[str, Any]] | None, spec: SearchSpec) -> dict[str, Any] | None:
    if not rows:
        return None
    for row in rows:
        if _candidate_key(spec) == (
            str(row.get("experiment_name")),
            int(row.get("stage_epochs") or 0),
            int(row.get("eval_episodes") or 0),
        ):
            return row
    return None


def _is_completed_result(row: dict[str, Any] | None) -> bool:
    if not isinstance(row, dict):
        return False
    if row.get("pending_offline_audit") is True:
        return False
    return row.get("error_type") is None


def _score(result: dict[str, Any]) -> float:
    for key in ("confirmed_success_100", "success_500", "success_300", "success_100", "trial_score"):
        value = result.get(key)
        if value is None:
            continue
        try:
            return float(value)
        except Exception:
            continue
    return -1.0


def _checkpoint_every_for(stage_epochs: int) -> int:
    if int(stage_epochs) <= 100:
        return 50
    if int(stage_epochs) <= 300:
        return 100
    return 100


def _default_lane_a_spec(config_path: Path) -> SearchSpec:
    return SearchSpec(
        name="lane_a_mainline_100",
        lane="lane_a_mainline",
        config_path=config_path,
        stage_epochs=100,
        eval_episodes=20,
        description="Lane A mainline: 5RGB + text + CLIP last-block + PDIT FM/DiT semantics",
        overrides={"research_lane": "lane_a_mainline"},
    )


def _default_lane_a_stabilized_spec(config_path: Path) -> SearchSpec:
    return SearchSpec(
        name="lane_a_stabilized_100",
        lane="lane_a_mainline",
        config_path=config_path,
        stage_epochs=100,
        eval_episodes=20,
        description="Lane A stabilized audit recipe: mean_first_n + smooth_actions",
        overrides={
            "research_lane": "lane_a_mainline",
            "command_mode": "mean_first_n",
            "average_first_n": 2,
            "smooth_actions": True,
        },
    )


def _default_lane_b_spec(config_path: Path) -> SearchSpec:
    return SearchSpec(
        name="lane_b_faithful_100",
        lane="lane_b_faithful",
        config_path=config_path,
        stage_epochs=100,
        eval_episodes=20,
        description="Lane B faithful challenger: multitask-style concat conditioning + shared audit chain",
        overrides={"research_lane": "lane_b_faithful"},
    )


def _default_lane_c_spec(config_path: Path) -> SearchSpec:
    return SearchSpec(
        name="lane_c_mtdp_strict_100",
        lane="lane_c_mtdp_strict",
        config_path=config_path,
        stage_epochs=100,
        eval_episodes=20,
        description="Lane C strict MTDP challenger: global conditioning + RoPE + beta timestep sampling",
        overrides={"research_lane": "lane_c_mtdp_strict"},
    )


def _promote_spec(spec: SearchSpec, *, stage_epochs: int) -> SearchSpec:
    eval_episodes = 20 if int(stage_epochs) < 500 else 100
    return SearchSpec(
        name=f"{spec.name.rsplit('_', 1)[0]}_{stage_epochs}",
        lane=spec.lane,
        config_path=spec.config_path,
        stage_epochs=int(stage_epochs),
        eval_episodes=eval_episodes,
        description=f"{spec.description} promoted to {stage_epochs} epochs",
        overrides=dict(spec.overrides),
    )


def _build_train_only_cmd(
    *,
    spec: SearchSpec,
    run_name: str,
    device: str | None,
    ckpt_root: Path | None,
    data_root: Path | None,
    enable_wandb: bool,
) -> list[str]:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "run_autoresearch_trial.py"),
        "--line",
        "mdit",
        "--phase",
        "train-only",
        "--config",
        str(Path(spec.config_path).expanduser().resolve()),
        "--stage-epochs",
        str(int(spec.stage_epochs)),
        "--checkpoint-every",
        str(_checkpoint_every_for(spec.stage_epochs)),
        "--eval-episodes",
        str(int(spec.eval_episodes)),
        "--run-name",
        str(run_name),
        "--experiment-name",
        str(spec.name),
        "--description",
        str(spec.description),
        "--enable-wandb" if enable_wandb else "--no-enable-wandb",
    ]
    if device is not None:
        cmd.extend(["--device", str(device)])
    if ckpt_root is not None:
        cmd.extend(["--ckpt-root", str(ckpt_root)])
    if data_root is not None:
        cmd.extend(["--data-root", str(data_root)])
    for key, value in sorted(spec.overrides.items()):
        cmd.extend(["--set", f"{key}={json.dumps(value, ensure_ascii=False)}"])
    return cmd


def _build_resume_cmd(
    *,
    run_dir: Path,
    strategy: str,
    device: str | None,
    enable_wandb: bool,
) -> list[str]:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "train.py"),
        "--line",
        "mdit",
        "--config",
        str(run_dir / "config.json"),
        "--strategy",
        str(strategy),
        "--resume",
        "--run-name",
        str(run_dir.name),
        "--set",
        f"wandb_enable={json.dumps(bool(enable_wandb))}",
        "--set",
        f"wandb_resume={json.dumps(bool(enable_wandb))}",
    ]
    if device is not None:
        cmd.extend(["--device", str(device)])
    return cmd


def _build_audit_cmd(
    *,
    run_dir: Path,
    eval_episodes: int,
    device: str | None,
    audit_timeout_sec: int,
    headless: bool,
    show_progress: bool,
) -> list[str]:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "run_autoresearch_trial.py"),
        "--line",
        "mdit",
        "--phase",
        "audit-only",
        "--run-dir",
        str(run_dir),
        "--eval-episodes",
        str(int(eval_episodes)),
        "--audit-timeout-sec",
        str(int(audit_timeout_sec)),
        "--headless" if headless else "--no-headless",
        "--show-progress" if show_progress else "--no-show-progress",
    ]
    if device is not None:
        cmd.extend(["--device", str(device)])
    return cmd


def _build_confirm_cmd(
    *,
    ckpt_path: Path,
    device: str | None,
    headless: bool,
    show_progress: bool,
) -> list[str]:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "eval_checkpoint.py"),
        "--line",
        "mdit",
        "--ckpt-path",
        str(ckpt_path),
        "--episodes",
        "100",
        "--max-steps",
        "200",
        "--prefer-ema",
        "--headless" if headless else "--no-headless",
        "--show-progress" if show_progress else "--no-show-progress",
    ]
    if device is not None:
        cmd.extend(["--device", str(device)])
    return cmd


def _existing_target_ckpt(run_dir: Path, stage_epochs: int) -> Path:
    return run_dir / "epochs" / f"epoch_{int(stage_epochs):04d}.pt"


def _existing_log_path(run_dir: Path) -> Path | None:
    pointer = run_dir / "logs" / ".latest_resume_log"
    if pointer.exists():
        try:
            candidate = Path(pointer.read_text(encoding="utf-8").strip()).expanduser().resolve()
            if candidate.exists():
                return candidate
        except Exception:
            pass
    logs_dir = run_dir / "logs"
    if not logs_dir.exists():
        return None
    candidates = sorted(logs_dir.glob("*.log"), key=lambda item: item.stat().st_mtime, reverse=True)
    return candidates[0] if candidates else None


def _existing_progress_paths(run_dir: Path) -> list[Path]:
    paths: list[Path] = []
    for candidate in (run_dir / "latest.pt", run_dir / "best_valid.pt", _existing_log_path(run_dir)):
        if candidate is None:
            continue
        if candidate.exists():
            paths.append(candidate)
    return paths


def _wait_for_existing_run_completion(
    *,
    run_dir: Path,
    stage_epochs: int,
    stall_timeout_sec: int,
    poll_interval_sec: int,
) -> tuple[bool, str | None]:
    target_ckpt = _existing_target_ckpt(run_dir, stage_epochs)
    started_at = time.time()
    last_progress = started_at
    while True:
        if target_ckpt.exists():
            return True, None
        progress_paths = _existing_progress_paths(run_dir)
        if progress_paths:
            last_progress = max(last_progress, max(path.stat().st_mtime for path in progress_paths))
        if (time.time() - started_at) > max(300, int(stall_timeout_sec) // 4):
            if time.time() - last_progress > int(stall_timeout_sec):
                return False, "existing_run_stalled"
        time.sleep(max(1, int(poll_interval_sec)))


def _build_existing_request(
    *,
    spec: SearchSpec,
    run_dir: Path,
    strategy: str,
    device: str | None,
    ckpt_root: Path | None,
    data_root: Path | None,
    enable_wandb: bool,
    headless: bool,
    show_progress: bool,
) -> TrialRequest:
    return TrialRequest(
        config_path=Path(spec.config_path).expanduser().resolve(),
        strategy=strategy,
        config_overrides=dict(spec.overrides),
        stage_epochs=int(spec.stage_epochs),
        checkpoint_every=int(_checkpoint_every_for(spec.stage_epochs)),
        eval_episodes=int(spec.eval_episodes),
        device=device,
        ckpt_root=ckpt_root,
        data_root=data_root,
        run_name=run_dir.name,
        experiment_name=spec.name,
        description=spec.description,
        headless=headless,
        show_progress=show_progress,
        cleanup_failed=True,
        enable_wandb=enable_wandb,
    )


def _resume_existing_run_with_watchdog(
    *,
    run_dir: Path,
    stage_epochs: int,
    strategy: str,
    device: str | None,
    enable_wandb: bool,
    stall_timeout_sec: int,
    poll_interval_sec: int,
    max_train_retries: int,
) -> tuple[bool, str | None, str]:
    resume_log = _logs_dir() / f"{run_dir.name}__adopt_resume.log"
    attempts = 0
    last_reason = None
    while attempts <= int(max_train_retries):
        attempts += 1
        cmd = _build_resume_cmd(
            run_dir=run_dir,
            strategy=strategy,
            device=device,
            enable_wandb=enable_wandb,
        )
        process, log_handle = _spawn_logged_process(cmd, resume_log)
        try:
            rc, reason = _monitor_training_process(
                process=process,
                heartbeat_path=run_dir / "train_heartbeat.json",
                log_handle=log_handle,
                stall_timeout_sec=stall_timeout_sec,
                poll_interval_sec=poll_interval_sec,
            )
        finally:
            log_handle.close()
        last_reason = reason
        if rc == 0 and _existing_target_ckpt(run_dir, stage_epochs).exists():
            return True, None, str(resume_log)
        if attempts > int(max_train_retries):
            break
    return False, last_reason or "resume_failed", str(resume_log)


def _run_existing_lane_a_screening(
    *,
    spec: SearchSpec,
    run_dir: Path,
    strategy: str,
    device: str | None,
    headless: bool,
    show_progress: bool,
    ckpt_root: Path | None,
    data_root: Path | None,
    enable_wandb: bool,
    stall_timeout_sec: int,
    poll_interval_sec: int,
    max_train_retries: int,
) -> dict[str, Any]:
    request = _build_existing_request(
        spec=spec,
        run_dir=run_dir,
        strategy=strategy,
        device=device,
        ckpt_root=ckpt_root,
        data_root=data_root,
        enable_wandb=enable_wandb,
        headless=headless,
        show_progress=show_progress,
    )
    existing_record = _load_record_for_run(run_dir.name)
    if (
        existing_record is not None
        and str(existing_record.get("experiment_name")) == str(spec.name)
        and int(existing_record.get("stage_epochs") or 0) == int(spec.stage_epochs)
        and int(existing_record.get("eval_episodes") or 0) == int(spec.eval_episodes)
        and _is_completed_result(existing_record)
    ):
        existing_record["lane"] = spec.lane
        existing_record["stage_epochs"] = int(spec.stage_epochs)
        existing_record["eval_episodes"] = int(spec.eval_episodes)
        existing_record["overrides"] = dict(spec.overrides)
        return existing_record

    adopt_existing_mdit_autoresearch_run(run_dir, request_overrides=request)
    if not _existing_target_ckpt(run_dir, spec.stage_epochs).exists():
        completed, wait_reason = _wait_for_existing_run_completion(
            run_dir=run_dir,
            stage_epochs=spec.stage_epochs,
            stall_timeout_sec=stall_timeout_sec,
            poll_interval_sec=poll_interval_sec,
        )
        if not completed:
            resumed, resume_reason, resume_log = _resume_existing_run_with_watchdog(
                run_dir=run_dir,
                stage_epochs=spec.stage_epochs,
                strategy=strategy,
                device=device,
                enable_wandb=enable_wandb,
                stall_timeout_sec=stall_timeout_sec,
                poll_interval_sec=poll_interval_sec,
                max_train_retries=max_train_retries,
            )
            if not resumed:
                return {
                    "line": "mdit",
                    "phase": "adopt_existing",
                    "experiment_name": spec.name,
                    "description": spec.description,
                    "stage_epochs": int(spec.stage_epochs),
                    "eval_episodes": int(spec.eval_episodes),
                    "run_name": run_dir.name,
                    "run_dir": str(run_dir),
                    "error_type": "ExistingRunAdoptFailure",
                    "collapse_detected": True,
                    "collapse_reasons": [
                        f"existing run did not complete and resume failed (wait_reason={wait_reason}, resume_reason={resume_reason})"
                    ],
                    "trial_score": -1.0,
                    "resume_log_path": resume_log,
                }

    audit_result = finalize_mdit_autoresearch_trial(
        run_dir,
        request_overrides=request,
        log_results=True,
    )
    audit_result["lane"] = spec.lane
    audit_result["stage_epochs"] = int(spec.stage_epochs)
    audit_result["eval_episodes"] = int(spec.eval_episodes)
    audit_result["overrides"] = dict(spec.overrides)
    return audit_result


def _spawn_logged_process(cmd: list[str], log_path: Path) -> tuple[subprocess.Popen[str], Any]:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    handle = log_path.open("a", encoding="utf-8")
    handle.write(f"\n[{_timestamp()}] CMD: {' '.join(shlex.quote(part) for part in cmd)}\n")
    child_env = _child_process_env()
    if child_env.get("HF_HUB_OFFLINE") == "1":
        handle.write(f"[{_timestamp()}] ENV: HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1\n")
    handle.flush()
    process = subprocess.Popen(
        cmd,
        cwd=PROJECT_ROOT,
        stdout=handle,
        stderr=subprocess.STDOUT,
        text=True,
        env=child_env,
    )
    return process, handle


def _terminate_process(process: subprocess.Popen[str]) -> None:
    if process.poll() is not None:
        return
    process.terminate()
    try:
        process.wait(timeout=20)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=20)


def _monitor_training_process(
    *,
    process: subprocess.Popen[str],
    heartbeat_path: Path,
    log_handle: Any,
    stall_timeout_sec: int,
    poll_interval_sec: int,
) -> tuple[int | None, str | None]:
    started_at = time.time()
    last_progress = started_at
    while True:
        rc = process.poll()
        if rc is not None:
            log_handle.flush()
            return rc, None
        if heartbeat_path.exists():
            last_progress = max(last_progress, heartbeat_path.stat().st_mtime)
        if (time.time() - started_at) > max(300, int(stall_timeout_sec) // 4):
            if time.time() - last_progress > int(stall_timeout_sec):
                log_handle.write(
                    f"[{_timestamp()}] WATCHDOG: heartbeat stalled for > {int(stall_timeout_sec)} sec, restarting.\n"
                )
                log_handle.flush()
                _terminate_process(process)
                return None, "heartbeat_stalled"
        time.sleep(max(1, int(poll_interval_sec)))


def _try_parse_last_json(log_path: Path) -> dict[str, Any] | None:
    if not log_path.exists():
        return None
    lines = log_path.read_text(encoding="utf-8", errors="ignore").splitlines()
    for line in reversed(lines):
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            return json.loads(line)
        except Exception:
            continue
    return None


def _run_train_with_watchdog(
    *,
    spec: SearchSpec,
    strategy: str,
    device: str | None,
    ckpt_root: Path | None,
    data_root: Path | None,
    enable_wandb: bool,
    stall_timeout_sec: int,
    poll_interval_sec: int,
    max_train_retries: int,
) -> dict[str, Any]:
    base_cfg = load_config(spec.config_path)
    effective_ckpt_root = Path(ckpt_root).expanduser().resolve() if ckpt_root is not None else base_cfg.ckpt_root.resolve()
    run_name = _make_unique_run_name(base_cfg.run_name, spec.name, spec.stage_epochs)
    run_dir = _run_dir_for(run_name, effective_ckpt_root)
    train_log = _logs_dir() / f"{run_name}__train.log"
    initial_cmd = _build_train_only_cmd(
        spec=spec,
        run_name=run_name,
        device=device,
        ckpt_root=effective_ckpt_root,
        data_root=data_root,
        enable_wandb=enable_wandb,
    )
    latest_cmd = list(initial_cmd)

    attempts = 0
    last_reason = None
    while attempts <= int(max_train_retries):
        attempts += 1
        process, log_handle = _spawn_logged_process(latest_cmd, train_log)
        try:
            rc, reason = _monitor_training_process(
                process=process,
                heartbeat_path=run_dir / "train_heartbeat.json",
                log_handle=log_handle,
                stall_timeout_sec=stall_timeout_sec,
                poll_interval_sec=poll_interval_sec,
            )
        finally:
            log_handle.close()
        last_reason = reason
        if rc == 0:
            result = _load_record_for_run(run_name) or _try_parse_last_json(train_log) or {}
            result.setdefault("run_name", run_name)
            result.setdefault("run_dir", str(run_dir))
            result["train_log_path"] = str(train_log)
            result["train_attempts"] = attempts
            return result

        if attempts > int(max_train_retries):
            break

        if (run_dir / "latest.pt").exists() and (run_dir / "config.json").exists():
            latest_cmd = _build_resume_cmd(
                run_dir=run_dir,
                strategy=strategy,
                device=device,
                enable_wandb=enable_wandb,
            )
        else:
            latest_cmd = list(initial_cmd)

    return {
        "line": "mdit",
        "phase": "train_only",
        "experiment_name": spec.name,
        "description": spec.description,
        "stage_epochs": int(spec.stage_epochs),
        "eval_episodes": int(spec.eval_episodes),
        "run_name": run_name,
        "run_dir": str(run_dir),
        "train_log_path": str(train_log),
        "error_type": "WatchdogTrainFailure",
        "collapse_detected": True,
        "collapse_reasons": [f"training failed after watchdog retries (last_reason={last_reason})"],
        "trial_score": -1.0,
    }


def _run_audit_with_retries(
    *,
    spec: SearchSpec,
    run_dir: Path,
    device: str | None,
    audit_timeout_sec: int,
    headless: bool,
    show_progress: bool,
    max_audit_retries: int,
) -> dict[str, Any]:
    audit_log = _logs_dir() / f"{run_dir.name}__audit.log"
    cmd = _build_audit_cmd(
        run_dir=run_dir,
        eval_episodes=spec.eval_episodes,
        device=device,
        audit_timeout_sec=audit_timeout_sec,
        headless=headless,
        show_progress=show_progress,
    )
    for attempt in range(1, int(max_audit_retries) + 2):
        process, handle = _spawn_logged_process(cmd, audit_log)
        try:
            rc = process.wait(timeout=max(300, int(audit_timeout_sec) + 60))
        except subprocess.TimeoutExpired:
            handle.write(f"[{_timestamp()}] WATCHDOG: audit timeout, terminating.\n")
            handle.flush()
            _terminate_process(process)
            rc = None
        finally:
            handle.close()
        if rc == 0:
            result = _load_record_for_run(run_dir.name) or _try_parse_last_json(audit_log) or {}
            result.setdefault("run_name", run_dir.name)
            result.setdefault("run_dir", str(run_dir))
            result["audit_log_path"] = str(audit_log)
            result["audit_attempts"] = attempt
            return result
    return {
        "line": "mdit",
        "phase": "audit_only",
        "experiment_name": spec.name,
        "description": spec.description,
        "stage_epochs": int(spec.stage_epochs),
        "eval_episodes": int(spec.eval_episodes),
        "run_name": run_dir.name,
        "run_dir": str(run_dir),
        "audit_log_path": str(audit_log),
        "error_type": "WatchdogAuditFailure",
        "collapse_detected": True,
        "collapse_reasons": ["audit failed after watchdog retries"],
        "trial_score": -1.0,
    }


def _run_search_spec(
    spec: SearchSpec,
    *,
    strategy: str,
    device: str | None,
    headless: bool,
    show_progress: bool,
    ckpt_root: Path | None,
    data_root: Path | None,
    enable_wandb: bool,
    audit_timeout_sec: int,
    stall_timeout_sec: int,
    poll_interval_sec: int,
    max_train_retries: int,
    max_audit_retries: int,
) -> dict[str, Any]:
    existing = _find_existing_trial_record(
        experiment_name=spec.name,
        stage_epochs=spec.stage_epochs,
        eval_episodes=spec.eval_episodes,
    )
    if _is_completed_result(existing):
        existing["lane"] = spec.lane
        existing["stage_epochs"] = int(spec.stage_epochs)
        existing["eval_episodes"] = int(spec.eval_episodes)
        existing["overrides"] = dict(spec.overrides)
        return existing

    train_result = _run_train_with_watchdog(
        spec=spec,
        strategy=strategy,
        device=device,
        ckpt_root=ckpt_root,
        data_root=data_root,
        enable_wandb=enable_wandb,
        stall_timeout_sec=stall_timeout_sec,
        poll_interval_sec=poll_interval_sec,
        max_train_retries=max_train_retries,
    )
    if train_result.get("error_type") is not None:
        train_result["lane"] = spec.lane
        train_result["stage_epochs"] = int(spec.stage_epochs)
        train_result["eval_episodes"] = int(spec.eval_episodes)
        train_result["overrides"] = dict(spec.overrides)
        return train_result

    run_dir = Path(train_result["run_dir"]).expanduser().resolve()
    audit_result = _run_audit_with_retries(
        spec=spec,
        run_dir=run_dir,
        device=device,
        audit_timeout_sec=audit_timeout_sec,
        headless=headless,
        show_progress=show_progress,
        max_audit_retries=max_audit_retries,
    )
    audit_result["lane"] = spec.lane
    audit_result["stage_epochs"] = int(spec.stage_epochs)
    audit_result["eval_episodes"] = int(spec.eval_episodes)
    audit_result["overrides"] = dict(spec.overrides)
    return audit_result


def _replace_result(rows: list[dict[str, Any]], result: dict[str, Any]) -> list[dict[str, Any]]:
    key = (
        str(result.get("experiment_name")),
        int(result.get("stage_epochs") or 0),
        int(result.get("eval_episodes") or 0),
    )
    filtered = [
        row
        for row in rows
        if (
            str(row.get("experiment_name")),
            int(row.get("stage_epochs") or 0),
            int(row.get("eval_episodes") or 0),
        )
        != key
    ]
    filtered.append(result)
    filtered.sort(key=lambda row: (str(row.get("experiment_name")), int(row.get("stage_epochs") or 0)))
    return filtered


def _success_for_stage(result: dict[str, Any], stage_epochs: int) -> float | None:
    key = f"success_{int(stage_epochs)}"
    value = result.get(key)
    if value is not None:
        return float(value)
    if int(stage_epochs) == int(result.get("stage_epochs") or 0):
        trial_score = result.get("trial_score")
        return None if trial_score is None else float(trial_score)
    return None


def _current_best_score(results: list[dict[str, Any]]) -> float:
    scores = [_score(row) for row in results if row.get("error_type") is None]
    return max(scores, default=0.0)


def _incumbent_best_score(state: dict[str, Any]) -> float:
    winner = state.get("winner")
    if not isinstance(winner, dict):
        return 0.0
    return max(0.0, _score(winner))


def _should_promote_from_100(result: dict[str, Any], current_best: float) -> bool:
    value = _success_for_stage(result, 100)
    if value is None:
        return False
    if result.get("error_type") is not None or bool(result.get("recipe_drift")):
        return False
    if bool(result.get("collapse_detected")):
        return False
    if value < 0.45:
        return False
    return value >= max(float(current_best) + 0.05, 0.60)


def _should_promote_from_300(result: dict[str, Any], current_best: float) -> bool:
    value = _success_for_stage(result, 300)
    if value is None:
        return False
    if result.get("error_type") is not None or bool(result.get("recipe_drift")):
        return False
    if bool(result.get("collapse_detected")):
        return False
    return value >= max(float(current_best) + 0.03, 0.75)


def _confirm_candidate(
    result: dict[str, Any],
    *,
    device: str | None,
    headless: bool,
    show_progress: bool,
) -> dict[str, Any] | None:
    ckpt_path = result.get("best_ckpt_path")
    if not ckpt_path:
        return None
    confirm_log = _logs_dir() / f"{Path(ckpt_path).stem}__confirm100.log"
    cmd = _build_confirm_cmd(
        ckpt_path=Path(ckpt_path),
        device=device,
        headless=headless,
        show_progress=show_progress,
    )
    process, handle = _spawn_logged_process(cmd, confirm_log)
    try:
        rc = process.wait(timeout=4 * 3600)
    except subprocess.TimeoutExpired:
        handle.write(f"[{_timestamp()}] WATCHDOG: confirm100 timeout, terminating.\n")
        handle.flush()
        _terminate_process(process)
        return None
    finally:
        handle.close()
    if rc != 0:
        return None
    return _try_parse_last_json(confirm_log)


def _winner_from_pool(pool: list[dict[str, Any]]) -> dict[str, Any] | None:
    candidates = [row for row in pool if row.get("error_type") is None and not bool(row.get("recipe_drift"))]
    if not candidates:
        return None
    return max(candidates, key=_score)


def _safe_remove_path(path: Path, parent: Path) -> None:
    try:
        path.resolve().relative_to(parent.resolve())
    except Exception as exc:
        raise ValueError(f"Refusing to remove path outside parent: {path}") from exc
    if not path.exists() and not path.is_symlink():
        return
    if path.is_symlink() or path.is_file():
        path.unlink()
    else:
        shutil.rmtree(path)


def _link_or_copy_file(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        dst.unlink()
    try:
        os.link(src, dst)
    except OSError:
        shutil.copy2(src, dst)


def _freeze_winner_snapshot(winner: dict[str, Any]) -> dict[str, str] | None:
    run_dir_value = winner.get("run_dir")
    if not run_dir_value:
        return None
    run_dir = Path(str(run_dir_value)).expanduser().resolve()
    best_ckpt_value = winner.get("best_ckpt_path")
    if not best_ckpt_value:
        return None
    best_ckpt_path = Path(str(best_ckpt_value)).expanduser().resolve()
    if not run_dir.exists() or not best_ckpt_path.exists():
        return None

    frozen_root = _record_dir() / "frozen_best"
    frozen_root.mkdir(parents=True, exist_ok=True)
    success_value = winner.get("confirmed_success_100", winner.get("trial_score"))
    score_tag = "na" if success_value is None else str(f"{float(success_value):.3f}").replace(".", "")
    snapshot_dir = frozen_root / f"{datetime.now().strftime('%Y-%m-%d-%H%M%S')}__{_slugify(run_dir.name)}__s{score_tag}"
    snapshot_dir.mkdir(parents=True, exist_ok=False)

    keep_paths: list[Path] = []
    for value in winner.get("kept_ckpt_paths") or []:
        path = Path(str(value)).expanduser().resolve()
        if path.exists():
            keep_paths.append(path)

    for candidate in (
        run_dir / "config.json",
        run_dir / "experiment_manifest.json",
        run_dir / "trial_request.json",
        run_dir / "summary.json",
        run_dir / "audit_report.json",
        run_dir / "latest.pt",
        run_dir / "best_valid.pt",
        best_ckpt_path,
        *keep_paths,
    ):
        if not candidate.exists():
            continue
        try:
            relative = candidate.relative_to(run_dir)
        except ValueError:
            relative = Path(candidate.name)
        _link_or_copy_file(candidate, snapshot_dir / relative)

    meta_dir = snapshot_dir / "meta"
    meta_dir.mkdir(parents=True, exist_ok=True)
    (meta_dir / "source_run_dir.txt").write_text(str(run_dir) + "\n", encoding="utf-8")
    _write_json(
        meta_dir / "snapshot.json",
        {
            "created_at": _timestamp(),
            "source_run_dir": str(run_dir),
            "best_success_rate": winner.get("best_success_rate"),
            "best_success_epoch": winner.get("best_success_epoch"),
            "best_ckpt_path": str(best_ckpt_path),
        },
    )

    current_alias = frozen_root / "current_provisional_best"
    if current_alias.exists() or current_alias.is_symlink():
        _safe_remove_path(current_alias, frozen_root)
    try:
        current_alias.symlink_to(snapshot_dir, target_is_directory=True)
    except OSError:
        pass
    snapshot_best_ckpt = snapshot_dir / best_ckpt_path.relative_to(run_dir)
    _write_json(
        frozen_root / "current_provisional_best.json",
        {
            "updated_at": _timestamp(),
            "snapshot_dir": str(snapshot_dir),
            "source_run_dir": str(run_dir),
            "best_success_rate": winner.get("best_success_rate"),
            "best_success_epoch": winner.get("best_success_epoch"),
            "best_ckpt_path": str(snapshot_best_ckpt),
            "trial_score": winner.get("trial_score"),
            "confirmed_success_100": winner.get("confirmed_success_100"),
        },
    )
    return {
        "snapshot_dir": str(snapshot_dir),
        "best_ckpt_path": str(snapshot_best_ckpt),
    }


def _refresh_champion_alias(winner: dict[str, Any]) -> None:
    alias_run_dir_value = winner.get("frozen_snapshot_dir", winner["run_dir"])
    run_dir = Path(str(alias_run_dir_value)).expanduser().resolve()
    ckpt_root = PROJECT_ROOT / "ckpt"
    alias_path = ckpt_root / CHAMPION_ALIAS_NAME
    alias_json = ckpt_root / CHAMPION_ALIAS_JSON
    if alias_path.exists() or alias_path.is_symlink():
        _safe_remove_path(alias_path, ckpt_root)
    try:
        alias_path.symlink_to(run_dir, target_is_directory=True)
    except OSError:
        pass
    _write_json(
        alias_json,
        {
            "updated_at": _timestamp(),
            "run_name": winner.get("run_name"),
            "run_dir": str(run_dir),
            "source_run_dir": winner.get("run_dir"),
            "best_ckpt_path": winner.get("frozen_best_ckpt_path", winner.get("best_ckpt_path")),
            "trial_score": winner.get("trial_score"),
            "confirmed_success_100": winner.get("confirmed_success_100"),
        },
    )


def _write_best_path_doc(winner: dict[str, Any]) -> Path:
    docs_dir = PROJECT_ROOT / "docs" / "mdit"
    docs_dir.mkdir(parents=True, exist_ok=True)
    path = docs_dir / "best_path.md"
    ckpt_root = PROJECT_ROOT / "ckpt"
    actual_alias = ckpt_root / "mdit_best"
    actual_alias_json = ckpt_root / "mdit_best.json"
    reference_dir = ckpt_root / "mdit_reference_line"
    reference_json = ckpt_root / "mdit_reference_line.json"
    lines = [
        "# MDIT Stable Artifacts",
        "",
        f"- Updated: {_timestamp()}",
        "",
        "## Current Winner",
        "",
        f"- Experiment: `{winner.get('experiment_name')}`",
        f"- Lane: `{winner.get('lane')}`",
        f"- Run: `{winner.get('run_name')}`",
        f"- Source run dir: `{winner.get('run_dir')}`",
        f"- Frozen snapshot dir: `{winner.get('frozen_snapshot_dir', '')}`",
        f"- Best checkpoint: `{winner.get('frozen_best_ckpt_path', winner.get('best_ckpt_path'))}`",
        f"- success@stage: `{winner.get('trial_score')}`",
        f"- success@100confirm: `{winner.get('confirmed_success_100')}`",
        f"- Audit report: `{winner.get('audit_report_path')}`",
        f"- Manifest: `{winner.get('experiment_manifest_path')}`",
        f"- WandB: `{winner.get('wandb_run_url') if winner.get('wandb_run_url') else ''}`",
        "",
    ]
    if actual_alias.exists() or actual_alias.is_symlink():
        lines.extend(
            [
                "## Actual CKPT Anchor",
                "",
                f"- Alias: `{actual_alias}`",
                f"- Target: `{actual_alias.resolve()}`",
                f"- Metadata: `{actual_alias_json}`",
                "",
            ]
        )
    if reference_dir.exists():
        lines.extend(
            [
                "## Reference Method Line",
                "",
                f"- Reference dir: `{reference_dir}`",
                f"- Metadata: `{reference_json}`",
                "- Note: `0.75@300/500` 当前只固化为方法参考线，原始长训 ckpt 已在历史漏洞中丢失。",
                "",
            ]
        )
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def _sync_frozen_milestone(
    *,
    snapshot_dir: Path,
    winner: dict[str, Any],
    best_path_doc: Path | None = None,
) -> None:
    # 自回路里最终保留下来的 frozen snapshot 是长期主线锚点，需要同步进入 milestones。
    try:
        source_docs = default_source_docs("mdit")
        if best_path_doc is not None and best_path_doc.exists():
            source_docs = [best_path_doc, *source_docs]
        archive_directory_as_milestone(
            task_id="mdit",
            source_dir=snapshot_dir,
            milestone_name=snapshot_dir.name,
            metadata={
                "winner_run_name": winner.get("run_name"),
                "winner_experiment_name": winner.get("experiment_name"),
                "winner_lane": winner.get("lane"),
                "best_success_rate": winner.get("best_success_rate"),
                "best_success_epoch": winner.get("best_success_epoch"),
                "confirmed_success_100": winner.get("confirmed_success_100"),
                "best_path_doc": None if best_path_doc is None else str(best_path_doc),
            },
            source_docs=source_docs,
            event_type="milestone",
        )
        write_task_index()
    except Exception as exc:
        print(f"[archive] mdit loop milestone sync failed for {snapshot_dir.name}: {exc}", file=sys.stderr)


def _prune_non_winner_runs(state: dict[str, Any], winner: dict[str, Any] | None) -> None:
    if winner is None:
        return
    winner_run_dir = Path(winner["run_dir"]).expanduser().resolve()
    ckpt_root = winner_run_dir.parent
    all_rows: list[dict[str, Any]] = []
    for key in ("screening", "promoted_300", "deep_runs_500"):
        all_rows.extend(list(state.get(key) or []))
    for row in all_rows:
        run_dir = row.get("run_dir")
        if not run_dir:
            continue
        path = Path(run_dir).expanduser().resolve()
        if path == winner_run_dir:
            continue
        if not path.exists():
            continue
        _safe_remove_path(path, ckpt_root)


def _persist_state(path: Path, state: dict[str, Any]) -> dict[str, Any]:
    state["updated_at"] = _timestamp()
    _write_json(path, state)
    return state


def _maybe_init_state(
    *,
    tag: str,
    lane_a_config: Path,
    lane_b_config: Path,
    lane_c_config: Path | None,
    existing_lane_a_run_dir: Path | None,
    strategy: str,
) -> dict[str, Any]:
    return {
        "tag": str(tag),
        "line": "mdit",
        "started_at": _timestamp(),
        "updated_at": _timestamp(),
        "strategy": str(strategy),
        "lane_a_config": str(lane_a_config),
        "lane_b_config": str(lane_b_config),
        "lane_c_config": None if lane_c_config is None else str(lane_c_config),
        "existing_lane_a_run_dir": None if existing_lane_a_run_dir is None else str(existing_lane_a_run_dir),
        "screening": [],
        "promoted_300": [],
        "deep_runs_500": [],
        "winner": None,
        "current_candidate": None,
        "loop_status": "initialized",
    }


def run_mdit_autoresearch_loop(
    *,
    tag: str,
    lane_a_config: Path,
    lane_b_config: Path,
    lane_c_config: Path | None = None,
    existing_lane_a_run_dir: Path | None = None,
    strategy: str = "fm",
    device: str | None,
    headless: bool,
    show_progress: bool,
    cleanup_failed: bool,
    audit_timeout_sec: int,
    ckpt_root: Path | None,
    data_root: Path | None,
    enable_wandb: bool = True,
    stall_timeout_sec: int = DEFAULT_TRAIN_STALL_TIMEOUT_SEC,
    poll_interval_sec: int = DEFAULT_POLL_INTERVAL_SEC,
    max_train_retries: int = DEFAULT_MAX_TRAIN_RETRIES,
    max_audit_retries: int = DEFAULT_MAX_AUDIT_RETRIES,
) -> dict[str, Any]:
    del cleanup_failed
    summary_path = _state_path(tag)
    if summary_path.exists():
        state = _load_json(summary_path)
    else:
        state = _maybe_init_state(
            tag=tag,
            lane_a_config=lane_a_config,
            lane_b_config=lane_b_config,
            lane_c_config=lane_c_config,
            existing_lane_a_run_dir=existing_lane_a_run_dir,
            strategy=strategy,
        )
        _persist_state(summary_path, state)

    screening_specs = [
        _default_lane_a_spec(lane_a_config),
        _default_lane_a_stabilized_spec(lane_a_config),
        _default_lane_b_spec(lane_b_config),
    ]
    if lane_c_config is not None:
        screening_specs.append(_default_lane_c_spec(lane_c_config))

    screening_results = list(state.get("screening") or [])
    for spec in screening_specs:
        existing = _find_existing_result(screening_results, spec)
        if not _is_completed_result(existing):
            existing = _find_existing_trial_record(
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
            )
            if not _is_completed_result(existing):
                existing = None
        if existing is None:
            state["current_candidate"] = _spec_to_dict(spec)
            state["loop_status"] = "screening"
            _persist_state(summary_path, state)
            if existing_lane_a_run_dir is not None and spec.name == "lane_a_mainline_100":
                existing = _run_existing_lane_a_screening(
                    spec=spec,
                    run_dir=Path(existing_lane_a_run_dir).expanduser().resolve(),
                    strategy=strategy,
                    device=device,
                    headless=headless,
                    show_progress=show_progress,
                    ckpt_root=ckpt_root,
                    data_root=data_root,
                    enable_wandb=enable_wandb,
                    stall_timeout_sec=stall_timeout_sec,
                    poll_interval_sec=poll_interval_sec,
                    max_train_retries=max_train_retries,
                )
            else:
                existing = _run_search_spec(
                    spec,
                    strategy=strategy,
                    device=device,
                    headless=headless,
                    show_progress=show_progress,
                    ckpt_root=ckpt_root,
                    data_root=data_root,
                    enable_wandb=enable_wandb,
                    audit_timeout_sec=audit_timeout_sec,
                    stall_timeout_sec=stall_timeout_sec,
                    poll_interval_sec=poll_interval_sec,
                    max_train_retries=max_train_retries,
                    max_audit_retries=max_audit_retries,
                )
        screening_results = _replace_result(screening_results, existing)
        state["screening"] = screening_results
        _persist_state(summary_path, state)

    current_best = _incumbent_best_score(state)
    promoted_specs = [
        _promote_spec(spec, stage_epochs=300)
        for spec in screening_specs
        if _should_promote_from_100(
            _find_existing_result(screening_results, spec) or {},
            current_best=current_best,
        )
    ]

    promoted_results = list(state.get("promoted_300") or [])
    for spec in promoted_specs:
        existing = _find_existing_result(promoted_results, spec)
        if not _is_completed_result(existing):
            existing = _find_existing_trial_record(
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
            )
            if not _is_completed_result(existing):
                existing = None
        if existing is None:
            state["current_candidate"] = _spec_to_dict(spec)
            state["loop_status"] = "promoted_300"
            _persist_state(summary_path, state)
            existing = _run_search_spec(
                spec,
                strategy=strategy,
                device=device,
                headless=headless,
                show_progress=show_progress,
                ckpt_root=ckpt_root,
                data_root=data_root,
                enable_wandb=enable_wandb,
                audit_timeout_sec=audit_timeout_sec,
                stall_timeout_sec=stall_timeout_sec,
                poll_interval_sec=poll_interval_sec,
                max_train_retries=max_train_retries,
                max_audit_retries=max_audit_retries,
            )
        promoted_results = _replace_result(promoted_results, existing)
        state["promoted_300"] = promoted_results
        _persist_state(summary_path, state)

    current_best = _incumbent_best_score(state)
    original_specs = {spec.name: spec for spec in screening_specs}
    deep_specs: list[SearchSpec] = []
    for result in promoted_results:
        if not _should_promote_from_300(result, current_best=current_best):
            continue
        experiment_name = str(result.get("experiment_name") or "")
        original_name = f"{experiment_name.rsplit('_', 1)[0]}_100"
        original_spec = original_specs.get(original_name)
        if original_spec is None:
            continue
        deep_specs.append(_promote_spec(original_spec, stage_epochs=500))

    deep_results = list(state.get("deep_runs_500") or [])
    for spec in deep_specs:
        existing = _find_existing_result(deep_results, spec)
        if not _is_completed_result(existing):
            existing = _find_existing_trial_record(
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
            )
            if not _is_completed_result(existing):
                existing = None
        if existing is None:
            state["current_candidate"] = _spec_to_dict(spec)
            state["loop_status"] = "deep_runs_500"
            _persist_state(summary_path, state)
            existing = _run_search_spec(
                spec,
                strategy=strategy,
                device=device,
                headless=headless,
                show_progress=show_progress,
                ckpt_root=ckpt_root,
                data_root=data_root,
                enable_wandb=enable_wandb,
                audit_timeout_sec=audit_timeout_sec,
                stall_timeout_sec=stall_timeout_sec,
                poll_interval_sec=poll_interval_sec,
                max_train_retries=max_train_retries,
                max_audit_retries=max_audit_retries,
            )
        deep_results = _replace_result(deep_results, existing)
        state["deep_runs_500"] = deep_results
        _persist_state(summary_path, state)

    final_pool = list(deep_results or promoted_results or screening_results)
    winner = _winner_from_pool(final_pool)
    if winner is not None and winner.get("best_ckpt_path"):
        confirm_result = _confirm_candidate(
            winner,
            device=device,
            headless=headless,
            show_progress=show_progress,
        )
        if confirm_result is not None:
            winner = dict(winner)
            winner["confirmed_success_100"] = float(confirm_result.get("success_rate"))
            winner["confirmed_eval_path"] = str(confirm_result.get("eval_manifest_path") or "")
    state["winner"] = winner
    state["current_candidate"] = None
    state["loop_status"] = "completed"
    state["finished_at"] = _timestamp()
    _persist_state(summary_path, state)

    if winner is not None:
        freeze_result = _freeze_winner_snapshot(winner)
        if freeze_result is not None:
            winner = dict(winner)
            winner["frozen_snapshot_dir"] = freeze_result["snapshot_dir"]
            winner["frozen_best_ckpt_path"] = freeze_result["best_ckpt_path"]
        _refresh_champion_alias(winner)
        best_path = _write_best_path_doc(winner)
        winner["best_path_doc"] = str(best_path)
        if freeze_result is not None:
            _sync_frozen_milestone(
                snapshot_dir=Path(freeze_result["snapshot_dir"]),
                winner=winner,
                best_path_doc=best_path,
            )
        state["winner"] = winner
        _persist_state(summary_path, state)
        _prune_non_winner_runs(state, winner)
        _persist_state(summary_path, state)

    return state


def run_mdit_attached_watch(**kwargs) -> dict[str, Any]:
    return run_mdit_autoresearch_loop(**kwargs)


__all__ = [
    "SearchSpec",
    "run_mdit_attached_watch",
    "run_mdit_autoresearch_loop",
]
