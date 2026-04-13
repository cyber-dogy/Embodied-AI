from __future__ import annotations

from dataclasses import asdict, dataclass
import json
import os
from datetime import datetime
import re
import shlex
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any

import torch

from common.runtime import PROJECT_ROOT
from mdit.config import MDITExperimentConfig, apply_config_overrides, config_to_dict, load_config
from mdit.train.runner import train_experiment


DEFAULT_COLLAPSE_THRESHOLDS: dict[int, float] = {
    100: 0.45,
    300: 0.55,
    500: 0.60,
}
DEFAULT_DROP_TOLERANCE = 0.10
RESULTS_TSV_HEADER = "experiment\tcommit\tmetric\tstatus\tdescription\n"
TRIAL_REQUEST_FILENAME = "mdit_trial_request.json"
EXPERIMENT_MANIFEST_FILENAME = "experiment_manifest.json"


@dataclass(slots=True)
class MDITTrialRequest:
    config_path: Path
    config_overrides: dict[str, Any] | None = None
    stage_epochs: int = 500
    checkpoint_every: int = 100
    eval_episodes: int = 20
    eval_seed: int = 1234
    device: str | None = None
    ckpt_root: Path | None = None
    data_root: Path | None = None
    run_name: str | None = None
    experiment_name: str = "mdit_trial"
    description: str = ""
    max_steps: int = 200
    heartbeat_every: int = 50
    headless: bool = True
    show_progress: bool = True
    cleanup_failed: bool = True
    audit_timeout_sec: int = 1800
    prefer_ema: bool = True
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


def _experiment_manifest_path(run_dir: Path) -> Path:
    return run_dir / EXPERIMENT_MANIFEST_FILENAME


def _trial_request_to_dict(request: MDITTrialRequest) -> dict[str, Any]:
    payload = asdict(request)
    for key in ("config_path", "ckpt_root", "data_root"):
        value = payload.get(key)
        if value is None:
            continue
        payload[key] = str(Path(value))
    return payload


def _trial_request_from_dict(payload: dict[str, Any]) -> MDITTrialRequest:
    payload_copy = dict(payload)
    for key in ("config_path", "ckpt_root", "data_root"):
        value = payload_copy.get(key)
        if value is None:
            continue
        payload_copy[key] = Path(value)
    return MDITTrialRequest(**payload_copy)


def _write_trial_request(run_dir: Path, request: MDITTrialRequest) -> Path:
    return _write_json(_trial_request_path(run_dir), _trial_request_to_dict(request))


def _current_commit(repo_root: Path) -> str:
    try:
        return (
            subprocess.run(
                ["git", "-C", str(repo_root), "rev-parse", "HEAD"],
                check=True,
                capture_output=True,
                text=True,
            )
            .stdout.strip()
        )
    except Exception:
        return "unknown"


def _config_diff(base_cfg: MDITExperimentConfig, resolved_cfg: MDITExperimentConfig) -> dict[str, dict[str, Any]]:
    base_payload = config_to_dict(base_cfg)
    resolved_payload = config_to_dict(resolved_cfg)
    diff: dict[str, dict[str, Any]] = {}
    for key, resolved_value in resolved_payload.items():
        base_value = base_payload.get(key)
        if base_value != resolved_value:
            diff[key] = {"from": base_value, "to": resolved_value}
    return diff


def _build_change_summary(base_cfg: MDITExperimentConfig, resolved_cfg: MDITExperimentConfig) -> list[str]:
    summary: list[str] = []
    if str(base_cfg.transformer_variant) != str(resolved_cfg.transformer_variant):
        summary.append(f"transformer_variant: {base_cfg.transformer_variant} -> {resolved_cfg.transformer_variant}")
    if base_cfg.observation_encoder.vision.train_mode != resolved_cfg.observation_encoder.vision.train_mode:
        summary.append(
            "vision train_mode: "
            f"{base_cfg.observation_encoder.vision.train_mode} -> "
            f"{resolved_cfg.observation_encoder.vision.train_mode}"
        )
    if int(base_cfg.n_action_steps) != int(resolved_cfg.n_action_steps):
        summary.append(f"n_action_steps: {int(base_cfg.n_action_steps)} -> {int(resolved_cfg.n_action_steps)}")
    if bool(base_cfg.enable_success_rate_eval) != bool(resolved_cfg.enable_success_rate_eval):
        if bool(resolved_cfg.enable_success_rate_eval):
            summary.append("success eval: disabled -> enabled in-train")
        else:
            summary.append(
                "success eval: enabled in-train -> disabled in-train, "
                f"save eval_ckpt every {int(resolved_cfg.offline_eval_ckpt_every_epochs)} epochs"
            )
    elif not bool(resolved_cfg.enable_success_rate_eval) and int(resolved_cfg.offline_eval_ckpt_every_epochs) > 0:
        summary.append(
            f"success eval: disabled in-train, save eval_ckpt every {int(resolved_cfg.offline_eval_ckpt_every_epochs)} epochs"
        )
    if bool(base_cfg.observation_encoder.vision.use_separate_encoder_per_camera) != bool(
        resolved_cfg.observation_encoder.vision.use_separate_encoder_per_camera
    ):
        summary.append(
            "separate vision encoders: "
            f"{bool(base_cfg.observation_encoder.vision.use_separate_encoder_per_camera)} -> "
            f"{bool(resolved_cfg.observation_encoder.vision.use_separate_encoder_per_camera)}"
        )
    if tuple(base_cfg.camera_names) != tuple(resolved_cfg.camera_names):
        summary.append(f"camera_names: {list(base_cfg.camera_names)} -> {list(resolved_cfg.camera_names)}")
    if float(base_cfg.optimizer_lr) != float(resolved_cfg.optimizer_lr):
        summary.append(f"optimizer_lr: {base_cfg.optimizer_lr} -> {resolved_cfg.optimizer_lr}")
    if float(base_cfg.transformer.dropout) != float(resolved_cfg.transformer.dropout):
        summary.append(f"transformer.dropout: {base_cfg.transformer.dropout} -> {resolved_cfg.transformer.dropout}")
    return summary


def _write_experiment_manifest(
    run_dir: Path,
    *,
    request: MDITTrialRequest,
    base_cfg: MDITExperimentConfig,
    resolved_cfg: MDITExperimentConfig,
    resolved_request: MDITTrialRequest,
) -> Path:
    payload = {
        "line": "mdit",
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "git_commit": _current_commit(PROJECT_ROOT),
        "base_config_path": str(Path(request.config_path).expanduser().resolve()),
        "base_config": config_to_dict(base_cfg),
        "resolved_config": config_to_dict(resolved_cfg),
        "config_overrides": dict(request.config_overrides or {}),
        "config_diff": _config_diff(base_cfg, resolved_cfg),
        "trial_request": _trial_request_to_dict(resolved_request),
        "enable_success_rate_eval": bool(resolved_cfg.enable_success_rate_eval),
        "save_offline_eval_ckpt": int(resolved_cfg.offline_eval_ckpt_every_epochs) > 0,
        "offline_eval_ckpt_every_epochs": int(resolved_cfg.offline_eval_ckpt_every_epochs),
        "change_summary": _build_change_summary(base_cfg, resolved_cfg),
    }
    return _write_json(_experiment_manifest_path(run_dir), payload)


def _load_trial_request(run_dir: Path) -> MDITTrialRequest:
    path = _trial_request_path(run_dir)
    if path.exists():
        return _trial_request_from_dict(json.loads(path.read_text(encoding="utf-8")))
    return _infer_legacy_trial_request(run_dir)


def _infer_stage_epochs_from_run_dir_name(run_dir: Path) -> int | None:
    match = re.search(r"_(\d+)$", run_dir.name)
    if match is None:
        return None
    try:
        value = int(match.group(1))
    except ValueError:
        return None
    return value if value > 0 else None


def _infer_legacy_trial_request(run_dir: Path) -> MDITTrialRequest:
    config_path = run_dir / "config.json"
    if not config_path.exists():
        raise FileNotFoundError(
            f"MDIT trial request manifest not found: {_trial_request_path(run_dir)} "
            f"and legacy config.json is also missing: {config_path}"
        )

    payload = json.loads(config_path.read_text(encoding="utf-8"))
    epoch_paths = _collect_periodic_ckpts(run_dir) + _collect_offline_eval_ckpts(run_dir)
    periodic_epochs = sorted(
        int(path.stem.split("_")[-1])
        for path in epoch_paths
        if path.stem.startswith("epoch_") and path.stem.split("_")[-1].isdigit()
    )
    inferred_stage_epochs = max(
        [
            int(payload.get("train_epochs") or 0),
            int(payload.get("checkpoint_every_epochs") or 0),
            max(periodic_epochs, default=0),
            _infer_stage_epochs_from_run_dir_name(run_dir) or 0,
        ]
    )
    checkpoint_every = int(payload.get("checkpoint_every_epochs") or 100)
    max_steps = int(payload.get("success_max_steps") or 200)
    heartbeat_every = int(payload.get("eval_step_heartbeat_every") or 50)

    return MDITTrialRequest(
        config_path=PROJECT_ROOT / "configs" / "mdit" / "faithful_baseline.json",
        stage_epochs=max(1, inferred_stage_epochs),
        checkpoint_every=max(1, checkpoint_every),
        eval_episodes=20,
        eval_seed=int(payload.get("seed") or 1234),
        device=payload.get("device"),
        ckpt_root=Path(payload["ckpt_root"]).expanduser().resolve() if payload.get("ckpt_root") else run_dir.parent,
        data_root=None,
        run_name=str(payload.get("run_name") or run_dir.name),
        experiment_name="legacy_audit_only",
        description="Legacy audit-only request inferred from run_dir/config.json.",
        max_steps=max(1, max_steps),
        heartbeat_every=max(1, heartbeat_every),
        headless=True,
        show_progress=True,
        cleanup_failed=False,
    )


def _build_offline_audit_command(run_dir: Path) -> str:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "run_mdit_autoresearch_trial.py"),
        "--phase",
        "audit-only",
        "--run-dir",
        str(run_dir),
    ]
    return " ".join(shlex.quote(part) for part in cmd)


def _prepare_cfg(request: MDITTrialRequest) -> MDITExperimentConfig:
    cfg = load_config(request.config_path)
    cfg = apply_config_overrides(cfg, request.config_overrides)
    overrides = request.config_overrides or {}
    if request.data_root is not None:
        task_root = request.data_root.expanduser().resolve() / cfg.task_name
        cfg.train_data_path = task_root / "train"
        cfg.valid_data_path = task_root / "valid"
    if request.ckpt_root is not None:
        cfg.ckpt_root = request.ckpt_root.expanduser().resolve()
    if request.device is not None:
        cfg.device = str(request.device)
    cfg.train_epochs = int(request.stage_epochs)
    if "checkpoint_every_epochs" not in overrides:
        cfg.checkpoint_every_epochs = int(request.checkpoint_every) if bool(cfg.enable_success_rate_eval) else 0
    if "resume_from_latest" not in overrides:
        cfg.resume_from_latest = False
    if "save_latest_ckpt" not in overrides:
        cfg.save_latest_ckpt = True
    if "save_best_valid_ckpt" not in overrides:
        cfg.save_best_valid_ckpt = False
    if "checkpoint_payload_mode" not in overrides:
        cfg.checkpoint_payload_mode = "full"
    if "offline_eval_ckpt_payload_mode" not in overrides:
        cfg.offline_eval_ckpt_payload_mode = "lightweight"
    if bool(cfg.enable_success_rate_eval):
        if "success_selection_every_epochs" not in overrides:
            cfg.success_selection_every_epochs = int(request.checkpoint_every)
        if "success_selection_episodes" not in overrides:
            cfg.success_selection_episodes = int(request.eval_episodes)
        if "offline_eval_ckpt_every_epochs" not in overrides:
            cfg.offline_eval_ckpt_every_epochs = 0
    else:
        if "success_selection_every_epochs" not in overrides:
            cfg.success_selection_every_epochs = 0
        if "success_selection_episodes" not in overrides:
            cfg.success_selection_episodes = 0
        if "offline_eval_ckpt_every_epochs" not in overrides:
            cfg.offline_eval_ckpt_every_epochs = int(request.checkpoint_every)
    if "standard_eval_episodes" not in overrides:
        cfg.standard_eval_episodes = 0
    cfg.audit_include_special_ckpts = False
    cfg.delete_screening_ckpts_after_audit = int(request.stage_epochs) < 500
    if request.run_name:
        cfg.run_name = str(request.run_name)
    else:
        cfg.run_name = _make_unique_run_name(cfg.run_name, request.experiment_name, request.stage_epochs)
    return cfg


def _resolved_request(request: MDITTrialRequest, cfg: MDITExperimentConfig) -> MDITTrialRequest:
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


def _collect_periodic_ckpts(run_dir: Path) -> list[Path]:
    return sorted((run_dir / "epochs").glob("epoch_*.pt"))


def _collect_offline_eval_ckpts(run_dir: Path) -> list[Path]:
    return sorted((run_dir / "eval_ckpts").glob("epoch_*.pt"))


def _resolve_audit_checkpoint_dir(run_dir: Path) -> Path:
    epochs_dir = run_dir / "epochs"
    eval_ckpt_dir = run_dir / "eval_ckpts"
    if any(epochs_dir.glob("epoch_*.pt")):
        return epochs_dir
    if any(eval_ckpt_dir.glob("epoch_*.pt")):
        return eval_ckpt_dir
    if epochs_dir.exists():
        return epochs_dir
    return eval_ckpt_dir


def _estimate_audit_timeout_sec(
    *,
    run_dir: Path,
    stage_epochs: int,
    checkpoint_every: int,
    requested_timeout_sec: int,
) -> int:
    periodic_ckpts = len(_collect_periodic_ckpts(run_dir))
    if periodic_ckpts <= 0:
        periodic_ckpts = len(_collect_offline_eval_ckpts(run_dir))
    if periodic_ckpts <= 0:
        periodic_ckpts = max(1, int(stage_epochs) // max(1, int(checkpoint_every)))
    estimated_timeout = periodic_ckpts * 900 + 300
    return max(int(requested_timeout_sec), int(estimated_timeout))


def _run_checkpoint_audit(
    *,
    run_dir: Path,
    episodes: int,
    seed: int,
    device: str | None,
    max_steps: int,
    heartbeat_every: int,
    headless: bool,
    show_progress: bool,
    timeout_sec: int,
    include_special: bool,
    prefer_ema: bool = True,
) -> Path:
    results_json = run_dir / "audit_raw_results.json"
    plot_path = run_dir / "audit_success_rate.png"
    ckpt_dir = _resolve_audit_checkpoint_dir(run_dir)
    if results_json.exists():
        results_json.unlink()
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "eval_mdit_all_checkpoints.py"),
        "--ckpt-epochs-dir",
        str(ckpt_dir),
        "--results-json",
        str(results_json),
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
        "--include-special" if include_special else "--no-include-special",
        "--headless" if headless else "--no-headless",
        "--show-progress" if show_progress else "--no-show-progress",
        "--prefer-ema" if prefer_ema else "--no-prefer-ema",
    ]
    if device is not None:
        cmd.extend(["--device", str(device)])
    subprocess.run(cmd, cwd=PROJECT_ROOT, check=True, timeout=max(1, int(timeout_sec)))
    return results_json


def _load_eval_records(results_json: Path) -> list[dict[str, Any]]:
    if not results_json.exists():
        raise FileNotFoundError(f"Audit results JSON not found: {results_json}")
    payload = json.loads(results_json.read_text(encoding="utf-8"))
    records: list[dict[str, Any]] = []
    seen_paths: set[str] = set()
    for row in payload.values():
        path = Path(row["path"]).resolve()
        key = str(path)
        if key in seen_paths:
            continue
        seen_paths.add(key)
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
    epoch_row = payload.get("epoch_summary")
    if epoch_row is None and 0 <= completed_epoch < len(epoch_summaries):
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
        enriched["train_loss_at_epoch"] = _maybe_float(train_summary.get("loss_total"))
        enriched["valid_loss_at_epoch"] = _maybe_float(valid_summary.get("loss_total"))
    else:
        enriched["train_loss_at_epoch"] = None
        enriched["valid_loss_at_epoch"] = None
    return enriched


def _select_best_success_record(records: list[dict[str, Any]]) -> dict[str, Any] | None:
    valid_records = [row for row in records if row.get("success_rate") is not None]
    if not valid_records:
        return None
    return max(
        valid_records,
        key=lambda row: (
            float(row["success_rate"]),
            1 if str(row.get("kind")) == "periodic" else 0,
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
    record_epoch = best_record.get("epoch")
    if record_epoch is None:
        completed_epoch = payload.get("completed_epoch")
        payload["best_success_epoch"] = None if completed_epoch is None else int(completed_epoch)
    else:
        payload["best_success_epoch"] = int(record_epoch) - 1
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


def _trial_score(
    best_record: dict[str, Any] | None,
    *,
    stage_epochs: int,
    collapse_detected: bool,
    eval_episodes: int,
) -> float:
    if collapse_detected or best_record is None:
        return -1.0
    if int(eval_episodes) < 20:
        return -1.0
    return float(best_record["success_rate"])


def _keep_epoch_paths(records: list[dict[str, Any]]) -> list[Path]:
    paths: list[Path] = []
    for row in records:
        path = Path(row["path"]).resolve()
        if path.exists():
            paths.append(path)
    return paths


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


def _build_train_keep_paths(run_dir: Path, cfg: MDITExperimentConfig) -> list[Path]:
    keep_paths = [
        run_dir / "config.json",
        cfg.summary_path,
        cfg.dataset_stats_path,
        _trial_request_path(run_dir),
        _experiment_manifest_path(run_dir),
        cfg.success_eval_path,
        *_collect_periodic_ckpts(run_dir),
        *_collect_offline_eval_ckpts(run_dir),
    ]
    if cfg.save_latest_ckpt:
        keep_paths.append(cfg.latest_ckpt_path)
    if cfg.save_best_valid_ckpt:
        keep_paths.append(cfg.best_ckpt_path)
    if cfg.best_success_ckpt_path.exists():
        keep_paths.append(cfg.best_success_ckpt_path)
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


def _training_error_output(
    *,
    request: MDITTrialRequest,
    run_dir: Path,
    exc: Exception,
) -> dict[str, Any]:
    return {
        "line": "mdit",
        "phase": "train_only",
        "experiment_name": request.experiment_name,
        "description": request.description,
        "trial_score": -1.0,
        "pending_offline_audit": False,
        "offline_audit_command": None,
        "success_20": None,
        "success_100": None,
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


def train_mdit_autoresearch_trial(request: MDITTrialRequest, *, log_results: bool = True) -> dict[str, Any]:
    if int(request.stage_epochs) <= 0:
        raise ValueError("stage_epochs must be positive.")
    if int(request.checkpoint_every) <= 0:
        raise ValueError("checkpoint_every must be positive.")
    if int(request.stage_epochs) < int(request.checkpoint_every):
        raise ValueError("stage_epochs must be >= checkpoint_every.")

    repo_root = PROJECT_ROOT
    base_cfg = load_config(request.config_path)
    cfg = _prepare_cfg(request)
    resolved_request = _resolved_request(request, cfg)
    ckpt_root = cfg.ckpt_root.resolve()
    run_dir = cfg.ckpt_dir.resolve()

    try:
        if not cfg.resume_from_latest:
            _clean_existing_run_dir(run_dir, ckpt_root)
        run_dir.mkdir(parents=True, exist_ok=True)
        _write_trial_request(run_dir, resolved_request)
        _write_experiment_manifest(
            run_dir,
            request=request,
            base_cfg=base_cfg,
            resolved_cfg=cfg,
            resolved_request=resolved_request,
        )
        summary = train_experiment(cfg)
        keep_paths = _build_train_keep_paths(run_dir, cfg)
        _prune_run_dir(run_dir, keep_paths)
        skip_offline_audit = bool(cfg.enable_success_rate_eval and cfg.delete_periodic_ckpts_after_success_eval)
        best_success_rate = summary.get("best_success_rate")
        best_success_epoch = summary.get("best_success_epoch")
        best_success_path = cfg.best_success_ckpt_path if cfg.best_success_ckpt_path.exists() else None
        output = {
            "line": "mdit",
            "phase": "train_only",
            "experiment_name": request.experiment_name,
            "description": request.description,
            "trial_score": None if best_success_rate is None else float(best_success_rate),
            "pending_offline_audit": not skip_offline_audit,
            "offline_audit_command": None if skip_offline_audit else _build_offline_audit_command(run_dir),
            "success_20": (
                None
                if best_success_rate is None or int(request.eval_episodes) < 20
                else float(best_success_rate)
            ),
            "success_100": (
                None
                if best_success_rate is None or int(request.eval_episodes) < 100
                else float(best_success_rate)
            ),
            "collapse_detected": False,
            "collapse_reasons": [],
            "best_ckpt_path": None if best_success_path is None else str(best_success_path),
            "best_success_rate": None if best_success_rate is None else float(best_success_rate),
            "best_success_epoch": None if best_success_epoch is None else int(best_success_epoch),
            "best_valid_ckpt_path": None,
            "kept_ckpt_paths": _collect_kept_ckpt_paths(keep_paths),
            "run_name": cfg.run_name,
            "run_dir": str(run_dir),
            "audit_report_path": None,
            "experiment_manifest_path": (
                str(_experiment_manifest_path(run_dir)) if _experiment_manifest_path(run_dir).exists() else None
            ),
            "summary_path": str(cfg.summary_path) if cfg.summary_path.exists() else None,
            "error_type": None,
            "train_summary": summary,
        }
        _record_trial_output(repo_root, run_name=cfg.run_name, output=output)
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
        if log_results:
            _append_results_row(
                repo_root,
                experiment_name=request.experiment_name,
                metric=-1.0,
                status="train_error",
                description=f"{request.description or run_dir.name}: {exc}",
            )
        return output


def finalize_mdit_autoresearch_trial(
    run_dir: str | Path,
    *,
    request_overrides: MDITTrialRequest | dict[str, Any] | None = None,
    log_results: bool = True,
) -> dict[str, Any]:
    repo_root = PROJECT_ROOT
    run_dir = Path(run_dir).expanduser().resolve()
    if not run_dir.exists():
        raise FileNotFoundError(f"Run dir does not exist: {run_dir}")

    request = _load_trial_request(run_dir)
    if request_overrides is not None:
        merged = _trial_request_to_dict(request)
        override_payload = (
            _trial_request_to_dict(request_overrides)
            if isinstance(request_overrides, MDITTrialRequest)
            else dict(request_overrides)
        )
        for key, value in override_payload.items():
            if value is not None:
                merged[key] = value
        request = _trial_request_from_dict(merged)

    timeout_sec = _estimate_audit_timeout_sec(
        run_dir=run_dir,
        stage_epochs=int(request.stage_epochs),
        checkpoint_every=int(request.checkpoint_every),
        requested_timeout_sec=int(request.audit_timeout_sec),
    )
    audit_json = _run_checkpoint_audit(
        run_dir=run_dir,
        episodes=int(request.eval_episodes),
        seed=int(request.eval_seed),
        device=request.device,
        max_steps=int(request.max_steps),
        heartbeat_every=int(request.heartbeat_every),
        headless=bool(request.headless),
        show_progress=bool(request.show_progress),
        timeout_sec=timeout_sec,
        include_special=False,
        prefer_ema=bool(request.prefer_ema),
    )
    records = [_enrich_record_with_checkpoint_stats(row) for row in _load_eval_records(audit_json)]
    periodic_records = _filter_periodic_records(records)
    thresholds = request.collapse_thresholds or DEFAULT_COLLAPSE_THRESHOLDS
    if int(request.stage_epochs) >= 500:
        collapse_detected, collapse_reasons, collapse_checks = _compute_collapse(
            periodic_records,
            stage_epochs=int(request.stage_epochs),
            thresholds={int(key): float(value) for key, value in thresholds.items()},
            tolerance=float(request.collapse_drop_tolerance),
        )
    else:
        collapse_detected, collapse_reasons, collapse_checks = False, [], []
    best_record = _select_best_success_record(records)
    best_ckpt_path = None
    if best_record is not None:
        best_ckpt_path = _materialize_best_success_checkpoint(run_dir, best_record)
    score = _trial_score(
        best_record,
        stage_epochs=int(request.stage_epochs),
        collapse_detected=collapse_detected,
        eval_episodes=int(request.eval_episodes),
    )

    success_20 = None
    success_100 = None
    if best_record is not None:
        if int(request.eval_episodes) >= 20:
            success_20 = float(best_record["success_rate"])
        if int(request.eval_episodes) >= 100:
            success_100 = float(best_record["success_rate"])

    audit_report = {
        "line": "mdit",
        "experiment_name": request.experiment_name,
        "description": request.description,
        "run_name": run_dir.name,
        "run_dir": str(run_dir),
        "stage_epochs": int(request.stage_epochs),
        "eval_episodes": int(request.eval_episodes),
        "records": records,
        "periodic_records": periodic_records,
        "best_record": best_record,
        "collapse_detected": collapse_detected,
        "collapse_reasons": collapse_reasons,
        "collapse_checks": collapse_checks,
    }
    _write_json(run_dir / "audit_report.json", audit_report)

    keep_paths = [
        run_dir / "config.json",
        run_dir / "summary.json",
        run_dir / "dataset_stats.json",
        run_dir / "audit_report.json",
        _trial_request_path(run_dir),
        _experiment_manifest_path(run_dir),
        run_dir / "success_eval_history.json",
    ]
    keep_paths.extend(_keep_epoch_paths(periodic_records))
    keep_paths.extend(_collect_offline_eval_ckpts(run_dir))
    if (run_dir / "best_success.pt").exists():
        keep_paths.append(run_dir / "best_success.pt")
    keep_paths = [path for path in keep_paths if path.exists()]

    if collapse_detected and request.cleanup_failed:
        shutil.rmtree(run_dir)
        keep_paths = []
    else:
        _prune_run_dir(run_dir, keep_paths)

    output = {
        "line": "mdit",
        "phase": "audit_only",
        "experiment_name": request.experiment_name,
        "description": request.description,
        "trial_score": float(score),
        "pending_offline_audit": False,
        "offline_audit_command": None,
        "success_20": success_20,
        "success_100": success_100,
        "collapse_detected": bool(collapse_detected),
        "collapse_reasons": collapse_reasons,
        "best_ckpt_path": None if best_ckpt_path is None else str(best_ckpt_path),
        "best_success_rate": None if best_record is None else float(best_record["success_rate"]),
        "best_success_epoch": None if best_record is None else int(best_record.get("epoch") or 0),
        "best_valid_ckpt_path": None,
        "kept_ckpt_paths": _collect_kept_ckpt_paths(keep_paths),
        "run_name": run_dir.name,
        "run_dir": str(run_dir),
        "audit_report_path": str(run_dir / "audit_report.json") if (run_dir / "audit_report.json").exists() else None,
        "experiment_manifest_path": (
            str(_experiment_manifest_path(run_dir)) if _experiment_manifest_path(run_dir).exists() else None
        ),
        "summary_path": str(run_dir / "summary.json") if (run_dir / "summary.json").exists() else None,
        "error_type": None,
    }
    _record_trial_output(repo_root, run_name=run_dir.name, output=output, audit_report=audit_report)
    if log_results:
        _append_results_row(
            repo_root,
            experiment_name=request.experiment_name,
            metric=score,
            status="collapse" if collapse_detected else "keep",
            description=request.description or run_dir.name,
        )
    return output


def run_mdit_autoresearch_trial(request: MDITTrialRequest, *, log_results: bool = True) -> dict[str, Any]:
    train_output = train_mdit_autoresearch_trial(request, log_results=log_results)
    if not train_output.get("pending_offline_audit"):
        return train_output
    return finalize_mdit_autoresearch_trial(
        train_output["run_dir"],
        request_overrides=request,
        log_results=log_results,
    )
