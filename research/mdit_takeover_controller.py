from __future__ import annotations

import json
import os
import shutil
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
import subprocess
import sys
import time
from typing import Any

from common.runtime import PROJECT_ROOT
from research.archive_writer import archive_directory_as_milestone, default_source_docs, write_task_index
from research.mdit_trial_runner import (
    TrialRequest,
    adopt_existing_mdit_autoresearch_run,
    finalize_mdit_autoresearch_trial,
)


DEFAULT_STALL_TIMEOUT_SEC = 60 * 45
DEFAULT_POLL_INTERVAL_SEC = 20
DEFAULT_MAX_RESUME_RETRIES = 2
FINAL_TAKEOVER_STATUSES = {
    "completed_with_fallback",
    "completed_without_fallback",
    "fallback_train_failed",
}


@dataclass(slots=True)
class TakeoverConfig:
    tag: str
    active_run_dir: Path
    incumbent_run_dir: Path
    incumbent_score: float
    fallback_stage_epochs: int = 500
    fallback_eval_episodes: int = 20
    device: str | None = None
    headless: bool = True
    show_progress: bool = True
    enable_wandb: bool = True
    audit_timeout_sec: int = 7200
    stall_timeout_sec: int = DEFAULT_STALL_TIMEOUT_SEC
    poll_interval_sec: int = DEFAULT_POLL_INTERVAL_SEC
    max_resume_retries: int = DEFAULT_MAX_RESUME_RETRIES


def _log(message: str) -> None:
    print(f"[{_timestamp()}] {message}", flush=True)


def _timestamp() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _slugify(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() else "_" for ch in str(value).strip().lower())
    cleaned = "_".join(part for part in cleaned.split("_") if part)
    return cleaned or "takeover"


def _record_dir() -> Path:
    path = PROJECT_ROOT / "autoresearch_records"
    path.mkdir(parents=True, exist_ok=True)
    (path / "logs").mkdir(parents=True, exist_ok=True)
    return path


def _state_path(tag: str) -> Path:
    return _record_dir() / f"mdit_takeover_state__{_slugify(tag)}.json"


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


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


def _write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(_json_safe(payload), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def _persist_state(path: Path, state: dict[str, Any]) -> dict[str, Any]:
    state["updated_at"] = _timestamp()
    _write_json(path, state)
    return state


def _read_trial_request(run_dir: Path) -> TrialRequest:
    payload = _load_json(run_dir / "trial_request.json")
    for key in ("config_path", "ckpt_root", "data_root"):
        value = payload.get(key)
        if value is not None:
            payload[key] = Path(value)
    return TrialRequest(**payload)


def _fallback_run_dir_from_state(state: dict[str, Any]) -> Path | None:
    value = state.get("fallback_run_dir")
    if not value:
        return None
    return Path(value)


def _result_record_path(run_name: str) -> Path:
    return _record_dir() / f"{run_name}.json"


def _sync_frozen_milestone(snapshot_dir: Path, *, metadata: dict[str, Any]) -> None:
    # frozen_best 是后续 best-path 与 homepage 的稳定锚点，归档应当跟快照同步更新。
    try:
        archive_directory_as_milestone(
            task_id="mdit",
            source_dir=snapshot_dir,
            milestone_name=snapshot_dir.name,
            metadata=metadata,
            source_docs=default_source_docs("mdit"),
            event_type="milestone",
        )
        write_task_index()
    except Exception as exc:
        print(f"[archive] mdit takeover milestone sync failed for {snapshot_dir.name}: {exc}", file=sys.stderr)


def _load_result_record(run_name: str) -> dict[str, Any] | None:
    path = _result_record_path(run_name)
    if not path.exists():
        return None
    return _load_json(path)


def _checkpoint_every_for(stage_epochs: int) -> int:
    if int(stage_epochs) <= 100:
        return 50
    return 100


def _append_fixes_entry(
    *,
    title: str,
    file_scope: str,
    background: str,
    action_text: str,
    result_text: str,
) -> None:
    fixes_path = PROJECT_ROOT / "docs" / "fixes.md"
    timestamp = datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")
    entry = (
        f"\n### {timestamp} · {title}\n"
        f"范围：`{file_scope}`\n\n"
        f"背景：{background}\n\n"
        f"处理：{action_text}\n\n"
        f"结果：{result_text}\n"
    )
    with fixes_path.open("a", encoding="utf-8") as handle:
        handle.write(entry)


def _append_journal_entry(title: str, body_lines: list[str]) -> None:
    journal_path = PROJECT_ROOT / "docs" / "mdit" / "research_journal.md"
    blocks = [
        f"## {_timestamp()} · takeover · {title}",
        "",
        *body_lines,
        "",
    ]
    with journal_path.open("a", encoding="utf-8") as handle:
        handle.write("\n".join(blocks))


def _has_active_process(keyword: str) -> bool:
    try:
        result = subprocess.run(
            ["pgrep", "-af", keyword],
            check=False,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError:
        return False
    if result.returncode != 0:
        return False
    current_pid = str(os.getpid())
    for line in result.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        pid, _, cmdline = line.partition(" ")
        if not pid or pid == current_pid:
            continue
        if "python" not in cmdline:
            continue
        return True
    return False


def _resume_active_run(
    *,
    run_dir: Path,
    request: TrialRequest,
    enable_wandb: bool,
) -> subprocess.Popen[str]:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "train.py"),
        "--line",
        "mdit",
        "--config",
        str(run_dir / "config.json"),
        "--strategy",
        str(request.strategy),
        "--resume",
        "--run-name",
        str(run_dir.name),
        "--set",
        f"train_epochs={int(request.stage_epochs)}",
        "--set",
        f"checkpoint_every_epochs={int(_checkpoint_every_for(request.stage_epochs))}",
        "--set",
        f"wandb_enable={json.dumps(bool(enable_wandb))}",
        "--set",
        f"wandb_resume={json.dumps(bool(enable_wandb))}",
    ]
    if request.device is not None:
        cmd.extend(["--device", str(request.device)])
    log_path = _record_dir() / "logs" / f"{run_dir.name}__takeover_resume.log"
    handle = log_path.open("a", encoding="utf-8")
    handle.write(f"\n[{_timestamp()}] CMD: {' '.join(cmd)}\n")
    handle.flush()
    _log(f"resume active run: {run_dir.name}")
    return subprocess.Popen(
        cmd,
        cwd=PROJECT_ROOT,
        stdout=handle,
        stderr=subprocess.STDOUT,
        text=True,
    )


def _wait_for_train_only_completion(
    *,
    run_dir: Path,
    request: TrialRequest,
    stall_timeout_sec: int,
    poll_interval_sec: int,
    max_resume_retries: int,
    enable_wandb: bool,
    state: dict[str, Any],
    state_path: Path,
    resume_counter_key: str = "resume_attempts",
    run_label: str = "active run",
) -> dict[str, Any]:
    run_name = run_dir.name
    heartbeat_path = run_dir / "train_heartbeat.json"
    target_ckpt = run_dir / "epochs" / f"epoch_{int(request.stage_epochs):04d}.pt"
    last_progress = 0.0
    resume_attempts = int(state.get(resume_counter_key) or 0)

    while True:
        record = _load_result_record(run_name)
        if isinstance(record, dict) and str(record.get("phase")) == "train_only":
            _log(f"train-only record detected for {run_label}: {run_name}")
            return record

        if heartbeat_path.exists():
            last_progress = float(heartbeat_path.stat().st_mtime)
            heartbeat = _load_json(heartbeat_path)
            if str(heartbeat.get("status")) == "completed" and target_ckpt.exists():
                _log(f"{run_label} reached target checkpoint: {target_ckpt.name}")
                # 训练器已经写完 checkpoint，但记录文件可能还没来得及落盘。
                # 这里给它一点时间，再转入 finalize。
                grace_deadline = time.time() + max(20, int(poll_interval_sec) * 2)
                while time.time() < grace_deadline:
                    record = _load_result_record(run_name)
                    if isinstance(record, dict) and str(record.get("phase")) == "train_only":
                        _log(f"train-only record landed after grace wait for {run_label}: {run_name}")
                        return record
                    time.sleep(2)
                _log(f"promoting completed {run_label} to audit without train-only record: {run_name}")
                return {
                    "line": "mdit",
                    "phase": "train_only",
                    "experiment_name": request.experiment_name,
                    "description": request.description,
                    "stage_epochs": int(request.stage_epochs),
                    "eval_episodes": int(request.eval_episodes),
                    "run_name": run_name,
                    "run_dir": str(run_dir),
                    "pending_offline_audit": True,
                    "error_type": None,
                }
        elif last_progress == 0.0:
            last_progress = time.time()

        if time.time() - last_progress > int(stall_timeout_sec):
            if _has_active_process(run_name):
                raise TimeoutError(f"{run_label} stalled with live process: {run_name}")
            if resume_attempts >= int(max_resume_retries):
                raise TimeoutError(f"{run_label} stalled and resume budget exhausted: {run_name}")
            if not (run_dir / "latest.pt").exists():
                raise FileNotFoundError(f"cannot resume stalled {run_label} without latest.pt: {run_dir / 'latest.pt'}")
            resume_attempts += 1
            state[resume_counter_key] = resume_attempts
            state["last_resume_at"] = _timestamp()
            _persist_state(state_path, state)
            _resume_active_run(run_dir=run_dir, request=request, enable_wandb=enable_wandb)
            last_progress = time.time()

        time.sleep(max(1, int(poll_interval_sec)))


def _should_fallback(challenger: dict[str, Any], incumbent_score: float) -> tuple[bool, str]:
    if challenger.get("error_type") is not None:
        return True, f"challenger error_type={challenger.get('error_type')}"
    if bool(challenger.get("recipe_drift")):
        return True, "challenger audit reported recipe drift"
    if bool(challenger.get("collapse_detected")):
        return True, "challenger audit collapsed"
    best_success = challenger.get("best_success_rate")
    if best_success is None:
        return True, "challenger missing best_success_rate"
    if float(best_success) <= float(incumbent_score):
        return True, f"challenger best_success_rate={float(best_success):.3f} <= incumbent={float(incumbent_score):.3f}"
    return False, f"challenger improved to {float(best_success):.3f}"


def _build_fallback_request(
    *,
    incumbent_request: TrialRequest,
    incumbent_run_dir: Path,
    config: TakeoverConfig,
) -> TrialRequest:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    run_name = (
        f"{incumbent_run_dir.name}__lane_a_mainline_500_resume__"
        f"e{int(config.fallback_stage_epochs):04d}__{timestamp}"
    )
    return TrialRequest(
        config_path=incumbent_request.config_path,
        strategy=incumbent_request.strategy,
        config_overrides=dict(incumbent_request.config_overrides or {}),
        stage_epochs=int(config.fallback_stage_epochs),
        checkpoint_every=_checkpoint_every_for(config.fallback_stage_epochs),
        eval_episodes=int(config.fallback_eval_episodes),
        device=config.device,
        ckpt_root=incumbent_request.ckpt_root,
        data_root=incumbent_request.data_root,
        run_name=run_name,
        experiment_name="lane_a_mainline_500_resume",
        description=(
            "Fallback to incumbent best RGB+text mainline by resuming epoch_0100 toward 500 epochs"
        ),
        headless=bool(config.headless),
        show_progress=bool(config.show_progress),
        enable_wandb=bool(config.enable_wandb),
        audit_timeout_sec=int(config.audit_timeout_sec),
    )


def _link_or_copy_file(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        dst.unlink()
    try:
        os.link(src, dst)
    except OSError:
        shutil.copy2(src, dst)


def _safe_remove_within(path: Path, parent: Path) -> None:
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


def _freeze_best_snapshot(
    *,
    run_dir: Path,
    audit_result: dict[str, Any],
    minimum_score: float,
) -> dict[str, str] | None:
    best_success_rate = audit_result.get("best_success_rate")
    best_ckpt_value = audit_result.get("best_ckpt_path")
    if best_success_rate is None or float(best_success_rate) < float(minimum_score) or not best_ckpt_value:
        return None

    best_ckpt_path = Path(str(best_ckpt_value)).expanduser().resolve()
    if not best_ckpt_path.exists():
        return None

    frozen_root = _record_dir() / "frozen_best"
    frozen_root.mkdir(parents=True, exist_ok=True)
    score_tag = str(f"{float(best_success_rate):.3f}").replace(".", "")
    snapshot_dir = frozen_root / f"{datetime.now().strftime('%Y-%m-%d-%H%M%S')}__{_slugify(run_dir.name)}__s{score_tag}"
    snapshot_dir.mkdir(parents=True, exist_ok=False)

    # 这里用硬链接优先，把“当前最优”从源 run 中独立出来，避免后续清理把冠军产物一起带走。
    keep_paths: list[Path] = []
    for value in audit_result.get("kept_ckpt_paths") or []:
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
            "best_success_rate": float(best_success_rate),
            "best_success_epoch": audit_result.get("best_success_epoch"),
            "best_ckpt_path": str(best_ckpt_path),
        },
    )

    current_alias = frozen_root / "current_provisional_best"
    if current_alias.exists() or current_alias.is_symlink():
        _safe_remove_within(current_alias, frozen_root)
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
            "best_success_rate": float(best_success_rate),
            "best_success_epoch": audit_result.get("best_success_epoch"),
            "best_ckpt_path": str(snapshot_best_ckpt),
        },
    )

    ckpt_root = PROJECT_ROOT / "ckpt"
    ckpt_root.mkdir(parents=True, exist_ok=True)
    alias_path = ckpt_root / "mdit_best"
    alias_json = ckpt_root / "mdit_best.json"
    if alias_path.exists() or alias_path.is_symlink():
        _safe_remove_within(alias_path, ckpt_root)
    try:
        alias_path.symlink_to(snapshot_dir, target_is_directory=True)
    except OSError:
        pass
    _write_json(
        alias_json,
        {
            "updated_at": _timestamp(),
            "snapshot_dir": str(snapshot_dir),
            "source_run_dir": str(run_dir),
            "best_success_rate": float(best_success_rate),
            "best_success_epoch": audit_result.get("best_success_epoch"),
            "best_ckpt_path": str(snapshot_best_ckpt),
            "trial_score": audit_result.get("trial_score"),
            "collapse_detected": bool(audit_result.get("collapse_detected")),
        },
    )
    return {
        "snapshot_dir": str(snapshot_dir),
        "best_ckpt_path": str(snapshot_best_ckpt),
        "alias_path": str(alias_path),
    }


def _prepare_fallback_resume_run(
    *,
    incumbent_run_dir: Path,
    fallback_request: TrialRequest,
) -> Path:
    fallback_ckpt_root = (
        fallback_request.ckpt_root.expanduser().resolve()
        if fallback_request.ckpt_root is not None
        else incumbent_run_dir.parent.resolve()
    )
    fallback_run_dir = fallback_ckpt_root / str(fallback_request.run_name)
    if fallback_run_dir.exists():
        if not (fallback_run_dir / "trial_request.json").exists():
            raise FileExistsError(f"fallback run dir already exists but is incomplete: {fallback_run_dir}")
        return fallback_run_dir

    fallback_run_dir.mkdir(parents=True, exist_ok=True)
    _link_or_copy_file(incumbent_run_dir / "config.json", fallback_run_dir / "config.json")
    _link_or_copy_file(incumbent_run_dir / "latest.pt", fallback_run_dir / "latest.pt")

    # 复制 50/100 checkpoint，保证后续 500 epoch 审计时能同时保留最佳路线的起点基线。
    for candidate in (
        incumbent_run_dir / "epochs" / "epoch_0050.pt",
        incumbent_run_dir / "epochs" / "epoch_0100.pt",
        incumbent_run_dir / "best_valid.pt",
        incumbent_run_dir / "best_success.pt",
    ):
        if not candidate.exists():
            continue
        target = fallback_run_dir / candidate.relative_to(incumbent_run_dir)
        _link_or_copy_file(candidate, target)

    adopt_existing_mdit_autoresearch_run(fallback_run_dir, request_overrides=fallback_request)
    return fallback_run_dir


def run_mdit_takeover_controller(config: TakeoverConfig) -> dict[str, Any]:
    state_path = _state_path(config.tag)
    if state_path.exists():
        state = _load_json(state_path)
    else:
        state = {
            "tag": config.tag,
            "started_at": _timestamp(),
            "updated_at": _timestamp(),
            "status": "initialized",
            "resume_attempts": 0,
            "fallback_resume_attempts": 0,
            "config": asdict(config),
            "active_train_result": None,
            "active_audit_result": None,
            "fallback_triggered": False,
            "fallback_reason": None,
            "fallback_run_dir": None,
            "fallback_train_result": None,
            "fallback_audit_result": None,
        }
        _persist_state(state_path, state)

    if str(state.get("status")) in FINAL_TAKEOVER_STATUSES:
        _log(f"takeover already finished: status={state.get('status')}")
        return state

    if state.get("active_train_result") is None:
        active_request = _read_trial_request(config.active_run_dir)
        _log(
            f"watch active run {config.active_run_dir.name}; incumbent={config.incumbent_run_dir.name} "
            f"score={config.incumbent_score:.3f}; fallback_stage={config.fallback_stage_epochs}"
        )
        state["status"] = "watch_active_training"
        _persist_state(state_path, state)
        active_train_result = _wait_for_train_only_completion(
            run_dir=config.active_run_dir,
            request=active_request,
            stall_timeout_sec=config.stall_timeout_sec,
            poll_interval_sec=config.poll_interval_sec,
            max_resume_retries=config.max_resume_retries,
            enable_wandb=config.enable_wandb,
            state=state,
            state_path=state_path,
            resume_counter_key="resume_attempts",
            run_label="active run",
        )
        state["active_train_result"] = active_train_result
        _persist_state(state_path, state)
    else:
        active_train_result = dict(state["active_train_result"])
        _log(f"reuse cached active train result: {config.active_run_dir.name}")

    if state.get("active_audit_result") is None:
        active_request = _read_trial_request(config.active_run_dir)
        state["status"] = "audit_active_run"
        _persist_state(state_path, state)
        _log(f"start shared audit for active run: {config.active_run_dir.name}")
        active_audit_result = finalize_mdit_autoresearch_trial(
            config.active_run_dir,
            request_overrides=active_request,
            log_results=True,
        )
        state["active_audit_result"] = active_audit_result
        should_fallback, fallback_reason = _should_fallback(active_audit_result, config.incumbent_score)
        _log(
            f"active run audited: best_success_rate={active_audit_result.get('best_success_rate')} "
            f"fallback={should_fallback} reason={fallback_reason}"
        )
        state["fallback_triggered"] = bool(should_fallback)
        state["fallback_reason"] = str(fallback_reason)
        freeze_result = _freeze_best_snapshot(
            run_dir=config.active_run_dir,
            audit_result=active_audit_result,
            minimum_score=config.incumbent_score,
        )
        if freeze_result is not None:
            state["frozen_best_snapshot"] = freeze_result
            _sync_frozen_milestone(
                Path(freeze_result["snapshot_dir"]),
                metadata={
                    "source": "active_run",
                    "run_dir": str(config.active_run_dir),
                    "best_success_rate": active_audit_result.get("best_success_rate"),
                    "best_success_epoch": active_audit_result.get("best_success_epoch"),
                },
            )
        _persist_state(state_path, state)
    else:
        active_audit_result = dict(state["active_audit_result"])
        should_fallback = bool(state.get("fallback_triggered"))
        fallback_reason = str(state.get("fallback_reason") or "")
        _log(
            "reuse cached active audit result: "
            f"{config.active_run_dir.name} best_success_rate={active_audit_result.get('best_success_rate')}"
        )

    if not should_fallback:
        state["status"] = "completed_without_fallback"
        _persist_state(state_path, state)
        _log("takeover completed without fallback")
        _append_fixes_entry(
            title="接管器完成：MTDP strict 已超过当前最优锚点",
            file_scope="research/mdit_takeover_controller.py + docs/fixes.md + docs/mdit/research_journal.md",
            background=(
                f"接管器盯住的严格挑战线 `{config.active_run_dir.name}` 已完成训练与审计，需要决定是否继续触发主线 fallback。"
            ),
            action_text="比较 challenger 的共享审计结果与当前锁定最优锚点；只有在未超过锚点时才触发 500 epoch fallback。",
            result_text=f"本次不触发 fallback；原因：{fallback_reason}",
        )
        _append_journal_entry(
            "takeover_completed_without_fallback",
            [
                f"- Active run: `{config.active_run_dir.name}`",
                f"- Decision: no fallback",
                f"- Reason: {fallback_reason}",
            ],
        )
        return state

    incumbent_request = _read_trial_request(config.incumbent_run_dir)
    state["status"] = "train_fallback_best_500"
    _persist_state(state_path, state)
    fallback_run_dir = _fallback_run_dir_from_state(state)
    if fallback_run_dir is None:
        fallback_request = _build_fallback_request(
            incumbent_request=incumbent_request,
            incumbent_run_dir=config.incumbent_run_dir,
            config=config,
        )
        _log(
            f"trigger fallback best-route resume: source={config.incumbent_run_dir.name} "
            f"target_run={fallback_request.run_name} stage_epochs={fallback_request.stage_epochs}"
        )
        _append_fixes_entry(
            title="接管器触发 500 epoch 最优路线 fallback",
            file_scope="research/mdit_takeover_controller.py + docs/fixes.md + docs/mdit/research_journal.md",
            background=(
                f"严格挑战线 `{config.active_run_dir.name}` 已完成共享审计，但没有超过当前锁定最优锚点 `{config.incumbent_score:.3f}`。"
            ),
            action_text=(
                "按照当前最优主线的已锁定 recipe 新开一条 500 epoch run，继续使用共享评估链，不覆盖原有 best snapshot。"
            ),
            result_text=f"触发原因：{fallback_reason}",
        )
        _append_journal_entry(
            "takeover_triggered_fallback_best500",
            [
                f"- Active run: `{config.active_run_dir.name}`",
                f"- Incumbent run: `{config.incumbent_run_dir.name}`",
                f"- Decision: trigger best-route 500 fallback",
                f"- Reason: {fallback_reason}",
            ],
        )
        fallback_run_dir = _prepare_fallback_resume_run(
            incumbent_run_dir=config.incumbent_run_dir,
            fallback_request=fallback_request,
        )
        state["fallback_run_dir"] = str(fallback_run_dir)
        _persist_state(state_path, state)
    else:
        _log(f"reuse existing fallback run dir: {fallback_run_dir.name}")

    fallback_request = _read_trial_request(fallback_run_dir)
    if state.get("fallback_train_result") is None:
        if not _has_active_process(fallback_run_dir.name):
            _resume_active_run(
                run_dir=fallback_run_dir,
                request=fallback_request,
                enable_wandb=config.enable_wandb,
            )
        fallback_train_result = _wait_for_train_only_completion(
            run_dir=fallback_run_dir,
            request=fallback_request,
            stall_timeout_sec=config.stall_timeout_sec,
            poll_interval_sec=config.poll_interval_sec,
            max_resume_retries=config.max_resume_retries,
            enable_wandb=config.enable_wandb,
            state=state,
            state_path=state_path,
            resume_counter_key="fallback_resume_attempts",
            run_label="fallback best run",
        )
        state["fallback_train_result"] = fallback_train_result
        _persist_state(state_path, state)
    else:
        fallback_train_result = dict(state["fallback_train_result"])
        _log(f"reuse cached fallback train result: {fallback_run_dir.name}")

    if fallback_train_result.get("error_type") is not None:
        state["status"] = "fallback_train_failed"
        _persist_state(state_path, state)
        _log(f"fallback training failed: {fallback_train_result.get('error_type')}")
        return state

    if state.get("fallback_audit_result") is None:
        state["status"] = "audit_fallback_best_500"
        _persist_state(state_path, state)
        _log(f"start shared audit for fallback run: {fallback_run_dir.name}")
        fallback_audit_result = finalize_mdit_autoresearch_trial(
            fallback_run_dir,
            request_overrides=fallback_request,
            log_results=True,
        )
        state["fallback_audit_result"] = fallback_audit_result
    else:
        fallback_audit_result = dict(state["fallback_audit_result"])
        _log(f"reuse cached fallback audit result: {fallback_run_dir.name}")

    freeze_result = _freeze_best_snapshot(
        run_dir=fallback_run_dir,
        audit_result=fallback_audit_result,
        minimum_score=config.incumbent_score,
    )
    if freeze_result is not None:
        state["frozen_best_snapshot"] = freeze_result
        _sync_frozen_milestone(
            Path(freeze_result["snapshot_dir"]),
            metadata={
                "source": "fallback_run",
                "run_dir": str(fallback_run_dir),
                "best_success_rate": fallback_audit_result.get("best_success_rate"),
                "best_success_epoch": fallback_audit_result.get("best_success_epoch"),
            },
        )

    state["status"] = "completed_with_fallback"
    state["finished_at"] = _timestamp()
    _persist_state(state_path, state)
    _log(
        f"fallback completed: run={fallback_train_result.get('run_name')} "
        f"best_success_rate={fallback_audit_result.get('best_success_rate')}"
    )
    return state


__all__ = [
    "TakeoverConfig",
    "run_mdit_takeover_controller",
]
