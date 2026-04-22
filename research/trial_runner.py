from __future__ import annotations

from dataclasses import asdict, dataclass
import json
import os
from datetime import datetime
import shlex
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any

import torch

from common.runtime import PROJECT_ROOT
from pdit.config import ExperimentConfig, apply_config_overrides, load_config
from pdit.train.runner import train_experiment
from research.archive_writer import default_source_docs, solidify_run_archive, write_task_index


DEFAULT_COLLAPSE_THRESHOLDS: dict[int, float] = {
    100: 0.55,
    300: 0.65,
    500: 0.68,
}
DEFAULT_DROP_TOLERANCE = 0.10
RESULTS_TSV_HEADER = "experiment\tcommit\tmetric\tstatus\tdescription\n"
TRIAL_REQUEST_FILENAME = "trial_request.json"


@dataclass(slots=True)
class TrialRequest:
    config_path: Path
    strategy: str = "fm"
    config_overrides: dict[str, Any] | None = None
    stage_epochs: int = 500
    checkpoint_every: int = 100
    eval_episodes: int = 20
    eval_seed: int = 1234
    device: str | None = None
    ckpt_root: Path | None = None
    data_root: Path | None = None
    run_name: str | None = None
    experiment_name: str = "trial"
    description: str = ""
    max_steps: int = 200
    heartbeat_every: int = 50
    prefer_ema: bool = True
    headless: bool = True
    show_progress: bool = True
    cleanup_failed: bool = True
    enable_wandb: bool = False
    audit_timeout_sec: int = 1800
    collapse_thresholds: dict[int, float] | None = None
    collapse_drop_tolerance: float = DEFAULT_DROP_TOLERANCE


def _slugify(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() else "_" for ch in str(value).strip().lower())
    cleaned = "_".join(part for part in cleaned.split("_") if part)
    return cleaned or "trial"


def _is_relative_to(path: Path, parent: Path) -> bool:
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except Exception:
        return False


def _ensure_results_log(repo_root: Path) -> Path:
    results_path = repo_root / "results.tsv"
    if not results_path.exists():
        results_path.write_text(RESULTS_TSV_HEADER, encoding="utf-8")
    return results_path


def _append_results_row(
    repo_root: Path,
    *,
    experiment_name: str,
    metric: float | None,
    status: str,
    description: str,
) -> None:
    results_path = _ensure_results_log(repo_root)
    try:
        commit = (
            subprocess.run(
                ["git", "-C", str(repo_root), "rev-parse", "HEAD"],
                check=True,
                capture_output=True,
                text=True,
            )
            .stdout.strip()
        )
    except Exception:
        commit = "unknown"
    metric_text = "" if metric is None else f"{float(metric):.6f}"
    row = (
        f"{experiment_name}\t{commit}\t{metric_text}\t{status}\t"
        f"{description.replace(chr(9), ' ').replace(chr(10), ' ')}\n"
    )
    with results_path.open("a", encoding="utf-8") as handle:
        handle.write(row)


def _ensure_record_dir(repo_root: Path) -> Path:
    record_dir = repo_root / "autoresearch_records"
    record_dir.mkdir(parents=True, exist_ok=True)
    return record_dir


def _write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def _make_unique_run_name(base_name: str, experiment_name: str, stage_epochs: int) -> str:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{base_name}__{_slugify(experiment_name)}__e{int(stage_epochs):04d}__{timestamp}"


def _trial_request_path(run_dir: Path) -> Path:
    return run_dir / TRIAL_REQUEST_FILENAME


def _trial_request_to_dict(request: TrialRequest) -> dict[str, Any]:
    payload = asdict(request)
    for key in ("config_path", "ckpt_root", "data_root"):
        value = payload.get(key)
        if value is None:
            continue
        payload[key] = str(Path(value))
    return payload


def _trial_request_from_dict(payload: dict[str, Any]) -> TrialRequest:
    payload_copy = dict(payload)
    for key in ("config_path", "ckpt_root", "data_root"):
        value = payload_copy.get(key)
        if value is None:
            continue
        payload_copy[key] = Path(value)
    return TrialRequest(**payload_copy)


def _write_trial_request(run_dir: Path, request: TrialRequest) -> Path:
    return _write_json(_trial_request_path(run_dir), _trial_request_to_dict(request))


def _load_trial_request(run_dir: Path) -> TrialRequest:
    path = _trial_request_path(run_dir)
    if not path.exists():
        raise FileNotFoundError(f"Trial request manifest not found: {path}")
    return _trial_request_from_dict(json.loads(path.read_text(encoding="utf-8")))


def _build_offline_audit_command(run_dir: Path) -> str:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "run_autoresearch_trial.py"),
        "--line",
        "pdit",
        "--phase",
        "audit-only",
        "--run-dir",
        str(run_dir),
    ]
    return " ".join(shlex.quote(part) for part in cmd)


def _prepare_cfg(request: TrialRequest) -> ExperimentConfig:
    cfg = load_config(request.config_path)
    cfg = apply_config_overrides(cfg, request.config_overrides)
    if request.data_root is not None:
        task_root = request.data_root.expanduser().resolve() / cfg.task_name
        cfg.train_data_path = task_root / "train"
        cfg.valid_data_path = task_root / "valid"
    if request.ckpt_root is not None:
        cfg.ckpt_root = request.ckpt_root.expanduser().resolve()
    if request.device is not None:
        cfg.device = str(request.device)
    cfg.resume_from_latest = False
    cfg.wandb_enable = bool(request.enable_wandb)
    cfg.wandb_mode = cfg.wandb_mode if request.enable_wandb else "disabled"
    cfg.wandb_resume = False
    cfg.train_epochs = int(request.stage_epochs)
    cfg.checkpoint_every_epochs = int(request.checkpoint_every)
    cfg.success_selection_every_epochs = 0
    cfg.success_selection_episodes = 0
    cfg.standard_eval_episodes = 0
    if request.run_name:
        cfg.run_name = str(request.run_name)
    else:
        cfg.run_name = _make_unique_run_name(cfg.run_name, request.experiment_name, request.stage_epochs)
    return cfg


def _resolved_request(request: TrialRequest, cfg: ExperimentConfig) -> TrialRequest:
    payload = _trial_request_to_dict(request)
    payload["run_name"] = cfg.run_name
    payload["device"] = cfg.device
    payload["ckpt_root"] = str(cfg.ckpt_root)
    return _trial_request_from_dict(payload)


def _clean_existing_run_dir(run_dir: Path, ckpt_root: Path) -> None:
    if not run_dir.exists():
        return
    if not _is_relative_to(run_dir, ckpt_root):
        raise ValueError(f"Refusing to delete run dir outside ckpt root: {run_dir}")
    shutil.rmtree(run_dir)


def _run_checkpoint_audit(
    *,
    run_dir: Path,
    strategy: str,
    episodes: int,
    seed: int,
    device: str | None,
    max_steps: int,
    heartbeat_every: int,
    prefer_ema: bool,
    headless: bool,
    show_progress: bool,
    timeout_sec: int,
) -> Path:
    results_json = run_dir / "audit_raw_results.json"
    plot_path = run_dir / "audit_success_rate.png"
    if results_json.exists():
        results_json.unlink()
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "eval_pdit_all_checkpoints.py"),
        "--ckpt-epochs-dir",
        str(run_dir / "epochs"),
        "--results-json",
        str(results_json),
        "--strategy",
        str(strategy),
        "--episodes",
        str(int(episodes)),
        "--seed",
        str(int(seed)),
        "--max-steps",
        str(int(max_steps)),
        "--heartbeat-every",
        str(int(heartbeat_every)),
        "--plot-path",
        str(plot_path),
        "--include-special",
        "--headless" if headless else "--no-headless",
        "--show-progress" if show_progress else "--no-show-progress",
        "--prefer-ema" if prefer_ema else "--no-prefer-ema",
    ]
    if device is not None:
        cmd.extend(["--device", str(device)])
    try:
        subprocess.run(cmd, cwd=PROJECT_ROOT, check=True, timeout=max(1, int(timeout_sec)))
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(f"checkpoint audit timed out after {int(timeout_sec)} seconds") from exc
    return results_json


def _estimate_audit_timeout_sec(
    *,
    run_dir: Path,
    stage_epochs: int,
    checkpoint_every: int,
    requested_timeout_sec: int,
) -> int:
    periodic_ckpts = len(_collect_periodic_ckpts(run_dir))
    if periodic_ckpts <= 0:
        periodic_ckpts = max(1, int(stage_epochs) // max(1, int(checkpoint_every)))
    # RLBench evaluation time varies a lot across checkpoints and seeds.
    # Use a generous per-checkpoint budget so long sweeps do not get marked as false collapses.
    estimated_timeout = periodic_ckpts * 900 + 300
    return max(int(requested_timeout_sec), int(estimated_timeout))


def _load_eval_records(results_json: Path) -> list[dict[str, Any]]:
    if not results_json.exists():
        raise FileNotFoundError(f"Audit results JSON not found: {results_json}")
    payload = json.loads(results_json.read_text(encoding="utf-8"))
    records: list[dict[str, Any]] = []
    seen_paths: set[str] = set()
    for row in payload.values():
        path = Path(row["path"]).resolve()
        path_key = str(path)
        if path_key in seen_paths:
            continue
        seen_paths.add(path_key)
        records.append(dict(row))
    records.sort(key=lambda row: (int(row.get("epoch") or 0), row.get("label", "")))
    return records


def _filter_periodic_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [row for row in records if str(row.get("kind")) == "periodic"]


def _maybe_float(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except Exception:
        return None


def _enrich_record_with_checkpoint_stats(record: dict[str, Any]) -> dict[str, Any]:
    ckpt_path = Path(record["path"]).resolve()
    payload = torch.load(ckpt_path, map_location="cpu")
    completed_epoch = int(payload.get("completed_epoch", -1))
    epoch_summaries = payload.get("epoch_summaries") or []
    epoch_row = None
    if 0 <= completed_epoch < len(epoch_summaries):
        epoch_row = epoch_summaries[completed_epoch]
    enriched = dict(record)
    enriched["completed_epoch"] = completed_epoch
    enriched["best_metric"] = _maybe_float(payload.get("best_metric"))
    enriched["best_epoch"] = payload.get("best_epoch")
    enriched["best_success_rate"] = _maybe_float(payload.get("best_success_rate"))
    enriched["best_success_epoch"] = payload.get("best_success_epoch")
    if epoch_row is not None:
        train_summary = epoch_row.get("train") or {}
        valid_summary = epoch_row.get("valid") or {}
        sample_summary = epoch_row.get("sample") or {}
        enriched["train_loss_at_epoch"] = _maybe_float(train_summary.get("loss_total"))
        enriched["valid_loss_at_epoch"] = _maybe_float(valid_summary.get("loss_total"))
        enriched["sample_mse_at_epoch"] = _maybe_float(sample_summary.get("train_action_mse_error"))
    else:
        enriched["train_loss_at_epoch"] = None
        enriched["valid_loss_at_epoch"] = None
        enriched["sample_mse_at_epoch"] = None
    return enriched


def _load_final_payload(run_dir: Path) -> dict[str, Any] | None:
    latest_path = run_dir / "latest.pt"
    if latest_path.exists():
        return torch.load(latest_path, map_location="cpu")
    periodic_ckpts = sorted((run_dir / "epochs").glob("epoch_*.pt"))
    if not periodic_ckpts:
        return None
    return torch.load(periodic_ckpts[-1], map_location="cpu")


def _select_best_success_record(records: list[dict[str, Any]]) -> dict[str, Any] | None:
    valid_records = [row for row in records if row.get("success_rate") is not None]
    if not valid_records:
        return None
    return max(
        valid_records,
        key=lambda row: (
            float(row["success_rate"]),
            -float(row["valid_loss_at_epoch"]) if row.get("valid_loss_at_epoch") is not None else float("-inf"),
            -int(row.get("epoch") or 0),
        ),
    )


def _atomic_torch_save(path: Path, payload: dict[str, Any]) -> None:
    import tempfile

    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(dir=path.parent, prefix=f".{path.name}.tmp.", suffix=".pt")
    try:
        with os.fdopen(fd, "wb") as handle:
            torch.save(payload, handle)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp_path, path)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def _materialize_best_success_checkpoint(run_dir: Path, best_record: dict[str, Any] | None) -> Path | None:
    if best_record is None:
        return None
    payload = torch.load(best_record["path"], map_location="cpu")
    payload["best_success_rate"] = float(best_record["success_rate"])
    payload["best_success_epoch"] = int(best_record["epoch"]) - 1
    path = run_dir / "best_success.pt"
    _atomic_torch_save(path, payload)
    return path


def _build_threshold_checks(
    records: list[dict[str, Any]],
    *,
    stage_epochs: int,
    thresholds: dict[int, float],
) -> list[dict[str, Any]]:
    by_epoch = {int(row["epoch"]): row for row in records if row.get("epoch") is not None}
    checks: list[dict[str, Any]] = []
    for epoch, threshold in sorted(thresholds.items()):
        if int(epoch) > int(stage_epochs):
            continue
        row = by_epoch.get(int(epoch))
        value = None if row is None else _maybe_float(row.get("success_rate"))
        passed = value is not None and float(value) >= float(threshold)
        checks.append(
            {
                "type": "threshold",
                "epoch": int(epoch),
                "threshold": float(threshold),
                "value": value,
                "passed": bool(passed),
            }
        )
    return checks


def _build_drop_checks(
    records: list[dict[str, Any]],
    *,
    tolerance: float,
) -> list[dict[str, Any]]:
    checks: list[dict[str, Any]] = []
    best_so_far = None
    best_epoch = None
    for row in sorted(records, key=lambda item: int(item.get("epoch") or 0)):
        success_rate = _maybe_float(row.get("success_rate"))
        if success_rate is None:
            continue
        epoch = int(row.get("epoch") or 0)
        if best_so_far is None or success_rate > best_so_far:
            best_so_far = success_rate
            best_epoch = epoch
            continue
        drop = float(best_so_far - success_rate)
        checks.append(
            {
                "type": "drop_from_best",
                "epoch": epoch,
                "value": success_rate,
                "best_so_far": best_so_far,
                "best_epoch": best_epoch,
                "drop": drop,
                "tolerance": float(tolerance),
                "passed": bool(drop <= float(tolerance)),
            }
        )
    return checks


def _compute_collapse(
    records: list[dict[str, Any]],
    *,
    stage_epochs: int,
    thresholds: dict[int, float],
    tolerance: float,
) -> tuple[bool, list[str], list[dict[str, Any]]]:
    checks = _build_threshold_checks(records, stage_epochs=stage_epochs, thresholds=thresholds)
    checks.extend(_build_drop_checks(records, tolerance=tolerance))
    reasons: list[str] = []
    for check in checks:
        if check.get("passed", True):
            continue
        if check["type"] == "threshold":
            reasons.append(
                f"epoch {check['epoch']} success {check['value']} below threshold {check['threshold']}"
            )
        else:
            reasons.append(
                f"epoch {check['epoch']} success dropped {check['drop']:.3f} from best epoch {check['best_epoch']}"
            )
    return bool(reasons), reasons, checks


def _trial_score(records: list[dict[str, Any]], *, stage_epochs: int, collapse_detected: bool) -> float:
    if collapse_detected:
        return -1.0
    by_epoch = {int(row["epoch"]): row for row in records if row.get("epoch") is not None}
    row = by_epoch.get(int(stage_epochs))
    if row is None or row.get("success_rate") is None:
        return -1.0
    return float(row["success_rate"])


def _keep_epoch_paths(records: list[dict[str, Any]]) -> list[Path]:
    paths: list[Path] = []
    for row in records:
        path = Path(row["path"]).resolve()
        if path.exists():
            paths.append(path)
    return paths


def _collect_periodic_ckpts(run_dir: Path) -> list[Path]:
    return sorted((run_dir / "epochs").glob("epoch_*.pt"))


def _collect_kept_ckpt_paths(paths: list[Path]) -> list[str]:
    return [str(path) for path in paths if path.exists() and path.suffix == ".pt"]


def _prune_run_dir(run_dir: Path, keep_paths: list[Path]) -> None:
    keep_resolved = {path.resolve() for path in keep_paths if path.exists()}
    for path in sorted(run_dir.rglob("*"), key=lambda item: (item.is_file(), len(item.parts)), reverse=True):
        resolved = path.resolve()
        if resolved in keep_resolved:
            continue
        if path.is_file() or path.is_symlink():
            path.unlink()
        elif path.is_dir():
            try:
                path.rmdir()
            except OSError:
                pass


def _build_train_keep_paths(run_dir: Path, cfg: ExperimentConfig) -> list[Path]:
    keep_paths = [
        run_dir / "config.json",
        cfg.summary_path,
        _trial_request_path(run_dir),
        cfg.best_ckpt_path,
        *_collect_periodic_ckpts(run_dir),
    ]
    return [path for path in keep_paths if path.exists()]


def _record_trial_output(
    repo_root: Path,
    *,
    run_name: str,
    output: dict[str, Any],
    audit_report: dict[str, Any] | None = None,
) -> Path:
    record_dir = _ensure_record_dir(repo_root)
    payload = dict(output)
    if audit_report is not None:
        payload["audit_report"] = audit_report
    return _write_json(record_dir / f"{run_name}.json", payload)


def _sync_pdit_archive(
    *,
    run_dir: Path,
    run_name: str,
    event_type: str,
) -> None:
    # 归档层是训练证据的补充入口，不能反过来阻塞主训练链。
    try:
        solidify_run_archive(
            task_id="pdit",
            run_dir=run_dir,
            trial_record_path=(PROJECT_ROOT / "autoresearch_records" / f"{run_name}.json"),
            source_docs=default_source_docs("pdit"),
            event_type=event_type,
        )
        write_task_index()
    except Exception as exc:
        print(f"[archive] pdit archive sync failed for {run_name}: {exc}", file=sys.stderr)


def _training_error_output(
    *,
    request: TrialRequest,
    run_dir: Path,
    exc: Exception,
) -> dict[str, Any]:
    return {
        "phase": "train_only",
        "experiment_name": request.experiment_name,
        "description": request.description,
        "trial_score": -1.0,
        "pending_offline_audit": False,
        "offline_audit_command": None,
        "success_100": None,
        "success_300": None,
        "success_500": None,
        "collapse_detected": True,
        "collapse_reasons": [str(exc)],
        "best_ckpt_path": None,
        "best_success_rate": None,
        "best_success_epoch": None,
        "best_valid_ckpt_path": None,
        "kept_ckpt_paths": [],
        "run_name": run_dir.name,
        "run_dir": str(run_dir),
        "audit_report_path": None,
        "summary_path": None,
        "error_type": type(exc).__name__,
    }


def train_autoresearch_trial(request: TrialRequest, *, log_results: bool = True) -> dict[str, Any]:
    if int(request.stage_epochs) <= 0:
        raise ValueError("stage_epochs must be positive.")
    if int(request.checkpoint_every) <= 0:
        raise ValueError("checkpoint_every must be positive.")
    if int(request.stage_epochs) < int(request.checkpoint_every):
        raise ValueError("stage_epochs must be >= checkpoint_every so the run produces periodic checkpoints.")

    repo_root = PROJECT_ROOT
    cfg = _prepare_cfg(request)
    resolved_request = _resolved_request(request, cfg)
    ckpt_root = cfg.ckpt_root.resolve()
    run_dir = cfg.ckpt_dir.resolve()

    try:
        _clean_existing_run_dir(run_dir, ckpt_root)
        run_dir.mkdir(parents=True, exist_ok=True)
        _write_trial_request(run_dir, resolved_request)
        _sync_pdit_archive(run_dir=run_dir, run_name=cfg.run_name, event_type="start")
        summary = train_experiment(cfg, strategy=request.strategy)
        keep_paths = _build_train_keep_paths(run_dir, cfg)
        _prune_run_dir(run_dir, keep_paths)
        output = {
            "phase": "train_only",
            "experiment_name": request.experiment_name,
            "description": request.description,
            "trial_score": None,
            "pending_offline_audit": True,
            "offline_audit_command": _build_offline_audit_command(run_dir),
            "success_100": None,
            "success_300": None,
            "success_500": None,
            "collapse_detected": False,
            "collapse_reasons": [],
            "best_ckpt_path": None,
            "best_success_rate": None,
            "best_success_epoch": None,
            "best_valid_ckpt_path": str(cfg.best_ckpt_path) if cfg.best_ckpt_path.exists() else None,
            "kept_ckpt_paths": _collect_kept_ckpt_paths(keep_paths),
            "run_name": cfg.run_name,
            "run_dir": str(run_dir),
            "audit_report_path": None,
            "summary_path": str(cfg.summary_path) if cfg.summary_path.exists() else None,
            "error_type": None,
            "train_summary": summary,
        }
        _record_trial_output(repo_root, run_name=cfg.run_name, output=output)
        _sync_pdit_archive(run_dir=run_dir, run_name=cfg.run_name, event_type="train_only")
        if log_results:
            _append_results_row(
                repo_root,
                experiment_name=request.experiment_name,
                metric=None,
                status="trained_pending_audit",
                description=request.description or cfg.run_name,
            )
        return output
    except Exception as exc:
        if request.cleanup_failed and run_dir.exists():
            shutil.rmtree(run_dir)
        output = _training_error_output(request=request, run_dir=run_dir, exc=exc)
        _record_trial_output(repo_root, run_name=run_dir.name, output=output)
        _sync_pdit_archive(run_dir=run_dir, run_name=run_dir.name, event_type="train_error")
        if log_results:
            _append_results_row(
                repo_root,
                experiment_name=request.experiment_name,
                metric=-1.0,
                status="train_error",
                description=f"{request.description or run_dir.name}: {exc}",
            )
        return output


def finalize_autoresearch_trial(
    run_dir: Path,
    *,
    request_overrides: TrialRequest | None = None,
    log_results: bool = True,
) -> dict[str, Any]:
    repo_root = PROJECT_ROOT
    run_dir = run_dir.expanduser().resolve()
    stored_request = _load_trial_request(run_dir)
    if request_overrides is not None:
        override_payload = _trial_request_to_dict(request_overrides)
        base_payload = _trial_request_to_dict(stored_request)
        default_payload = _trial_request_to_dict(TrialRequest(config_path=stored_request.config_path))
        for key, value in override_payload.items():
            if key == "config_path":
                continue
            if value is None:
                continue
            if key in default_payload and value == default_payload[key]:
                continue
            base_payload[key] = value
        request = _trial_request_from_dict(base_payload)
    else:
        request = stored_request

    cfg = load_config(run_dir / "config.json")
    cfg.run_name = run_dir.name
    thresholds = dict(DEFAULT_COLLAPSE_THRESHOLDS if request.collapse_thresholds is None else request.collapse_thresholds)
    training_keep_paths = _build_train_keep_paths(run_dir, cfg)
    offline_audit_command = _build_offline_audit_command(run_dir)

    try:
        effective_timeout_sec = _estimate_audit_timeout_sec(
            run_dir=run_dir,
            stage_epochs=int(request.stage_epochs),
            checkpoint_every=int(request.checkpoint_every),
            requested_timeout_sec=int(request.audit_timeout_sec),
        )
        audit_results_path = _run_checkpoint_audit(
            run_dir=run_dir,
            strategy=request.strategy,
            episodes=request.eval_episodes,
            seed=request.eval_seed,
            device=request.device if request.device is not None else cfg.device,
            max_steps=request.max_steps,
            heartbeat_every=request.heartbeat_every,
            prefer_ema=request.prefer_ema,
            headless=request.headless,
            show_progress=request.show_progress,
            timeout_sec=effective_timeout_sec,
        )
        raw_records = _load_eval_records(audit_results_path)
        records = [_enrich_record_with_checkpoint_stats(row) for row in raw_records]
        periodic_records = _filter_periodic_records(records)
        best_success_record = _select_best_success_record(records)
        best_success_path = _materialize_best_success_checkpoint(run_dir, best_success_record)
        collapse_detected, collapse_reasons, collapse_checks = _compute_collapse(
            periodic_records,
            stage_epochs=request.stage_epochs,
            thresholds=thresholds,
            tolerance=request.collapse_drop_tolerance,
        )
        final_payload = _load_final_payload(run_dir)
        trial_score = _trial_score(
            periodic_records,
            stage_epochs=request.stage_epochs,
            collapse_detected=collapse_detected,
        )
        score_by_epoch = {
            int(row["epoch"]): float(row["success_rate"])
            for row in periodic_records
            if row.get("epoch") is not None and row.get("success_rate") is not None
        }

        audit_report = {
            "experiment_name": request.experiment_name,
            "description": request.description,
            "run_name": cfg.run_name,
            "strategy": request.strategy,
            "run_dir": str(run_dir),
            "config_path": str(request.config_path),
            "stage_epochs": int(request.stage_epochs),
            "checkpoint_every": int(request.checkpoint_every),
            "eval_episodes": int(request.eval_episodes),
            "eval_seed": int(request.eval_seed),
            "trial_score": float(trial_score),
            "collapse_detected": bool(collapse_detected),
            "collapse_reasons": collapse_reasons,
            "collapse_checks": collapse_checks,
            "thresholds": {str(key): float(value) for key, value in sorted(thresholds.items())},
            "success_by_epoch": {str(key): value for key, value in sorted(score_by_epoch.items())},
            "audit_records": records,
            "best_success_epoch": None if best_success_record is None else int(best_success_record["epoch"]),
            "best_success_rate": None if best_success_record is None else float(best_success_record["success_rate"]),
            "best_success_ckpt_path": None if best_success_path is None else str(best_success_path),
            "best_valid_ckpt_path": str(cfg.best_ckpt_path) if cfg.best_ckpt_path.exists() else None,
            "train_summary": json.loads(cfg.summary_path.read_text(encoding="utf-8")) if cfg.summary_path.exists() else None,
            "train_loss_history": None if final_payload is None else list(final_payload.get("train_loss_history") or []),
            "valid_loss_history": None if final_payload is None else list(final_payload.get("valid_loss_history") or []),
        }
        _write_json(cfg.audit_report_path, audit_report)

        kept_ckpt_paths: list[str] = []
        if collapse_detected and request.cleanup_failed:
            shutil.rmtree(run_dir)
        else:
            keep_paths = [
                path
                for path in [
                    *training_keep_paths,
                    cfg.audit_report_path,
                    best_success_path,
                    *_keep_epoch_paths(records),
                ]
                if path is not None and Path(path).exists()
            ]
            _prune_run_dir(run_dir, keep_paths)
            kept_ckpt_paths = _collect_kept_ckpt_paths(keep_paths)

        best_success_path_out = (
            None if best_success_path is None or (not Path(best_success_path).exists()) else str(best_success_path)
        )
        best_valid_path_out = str(cfg.best_ckpt_path) if cfg.best_ckpt_path.exists() else None
        audit_report_path_out = str(cfg.audit_report_path) if cfg.audit_report_path.exists() else None
        summary_path_out = str(cfg.summary_path) if cfg.summary_path.exists() else None

        output = {
            "phase": "audit_only",
            "experiment_name": request.experiment_name,
            "description": request.description,
            "trial_score": float(trial_score),
            "pending_offline_audit": False,
            "offline_audit_command": offline_audit_command,
            "success_100": score_by_epoch.get(100),
            "success_300": score_by_epoch.get(300),
            "success_500": score_by_epoch.get(500),
            "collapse_detected": bool(collapse_detected),
            "collapse_reasons": collapse_reasons,
            "best_ckpt_path": best_success_path_out,
            "best_success_rate": None if best_success_record is None else float(best_success_record["success_rate"]),
            "best_success_epoch": None if best_success_record is None else int(best_success_record["epoch"]),
            "best_valid_ckpt_path": best_valid_path_out,
            "kept_ckpt_paths": kept_ckpt_paths,
            "run_name": cfg.run_name,
            "run_dir": str(run_dir),
            "audit_report_path": audit_report_path_out,
            "summary_path": summary_path_out,
            "error_type": None,
        }
        _record_trial_output(repo_root, run_name=cfg.run_name, output=output, audit_report=audit_report)
        _sync_pdit_archive(run_dir=run_dir, run_name=cfg.run_name, event_type="audit_only")
        if log_results:
            _append_results_row(
                repo_root,
                experiment_name=request.experiment_name,
                metric=trial_score,
                status="collapsed" if collapse_detected else "measured",
                description=request.description or cfg.run_name,
            )
        return output
    except Exception as exc:
        if run_dir.exists():
            keep_paths = [path for path in training_keep_paths if path.exists()]
            _prune_run_dir(run_dir, keep_paths)
        output = {
            "phase": "audit_only",
            "experiment_name": request.experiment_name,
            "description": request.description,
            "trial_score": -1.0,
            "pending_offline_audit": True,
            "offline_audit_command": offline_audit_command,
            "success_100": None,
            "success_300": None,
            "success_500": None,
            "collapse_detected": True,
            "collapse_reasons": [str(exc)],
            "best_ckpt_path": None,
            "best_success_rate": None,
            "best_success_epoch": None,
            "best_valid_ckpt_path": str(cfg.best_ckpt_path) if cfg.best_ckpt_path.exists() else None,
            "kept_ckpt_paths": _collect_kept_ckpt_paths(training_keep_paths),
            "run_name": cfg.run_name,
            "run_dir": str(run_dir),
            "audit_report_path": None,
            "summary_path": str(cfg.summary_path) if cfg.summary_path.exists() else None,
            "error_type": type(exc).__name__,
        }
        _record_trial_output(repo_root, run_name=cfg.run_name, output=output)
        _sync_pdit_archive(run_dir=run_dir, run_name=cfg.run_name, event_type="audit_error")
        if log_results:
            _append_results_row(
                repo_root,
                experiment_name=request.experiment_name,
                metric=-1.0,
                status="audit_error",
                description=f"{request.description or cfg.run_name}: {exc}",
            )
        return output


def run_autoresearch_trial(request: TrialRequest) -> dict[str, Any]:
    train_output = train_autoresearch_trial(request, log_results=False)
    if train_output.get("error_type") is not None:
        _append_results_row(
            PROJECT_ROOT,
            experiment_name=request.experiment_name,
            metric=-1.0,
            status="train_error",
            description=f"{request.description or train_output['run_name']}: {train_output['collapse_reasons'][0]}",
        )
        return train_output
    audit_output = finalize_autoresearch_trial(
        Path(train_output["run_dir"]),
        request_overrides=request,
        log_results=True,
    )
    audit_output["phase"] = "full"
    return audit_output
