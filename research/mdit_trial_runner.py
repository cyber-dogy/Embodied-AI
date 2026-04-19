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

try:
    import wandb
except ImportError:  # pragma: no cover
    wandb = None

from common.runtime import PROJECT_ROOT
from mdit.config import (
    ExperimentConfig,
    apply_config_overrides,
    config_to_dict,
    load_config,
    resolve_runtime_config,
)
from mdit.config.consistency import (
    build_experiment_manifest_payload,
    build_recipe_contract,
    experiment_manifest_path,
)
from mdit.train.runner import train_experiment


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
    enable_wandb: bool = True
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


def _infer_lane_name(cfg: ExperimentConfig) -> str:
    lane = str(getattr(cfg, "research_lane", "") or "").strip()
    if lane:
        return lane
    if str(cfg.encoder_name) == "clip_rgb_text_faithful":
        return "lane_b_faithful"
    return "lane_a_mainline"


def _write_experiment_manifest(
    run_dir: Path,
    *,
    request: TrialRequest,
    base_cfg: ExperimentConfig,
    resolved_cfg: ExperimentConfig,
    resolved_request: TrialRequest,
) -> Path:
    payload = build_experiment_manifest_payload(
        line="mdit",
        lane=_infer_lane_name(resolved_cfg),
        strategy=request.strategy,
        base_config_path=request.config_path,
        base_cfg=base_cfg,
        resolved_cfg=resolved_cfg,
        config_overrides=request.config_overrides,
        trial_request=_trial_request_to_dict(request),
        resolved_trial_request=_trial_request_to_dict(resolved_request),
    )
    payload["git_commit"] = _current_commit(PROJECT_ROOT)
    return _write_json(experiment_manifest_path(run_dir), payload)


def _docs_mdit_dir(repo_root: Path) -> Path:
    path = repo_root / "docs" / "mdit"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _research_journal_path(repo_root: Path) -> Path:
    return _docs_mdit_dir(repo_root) / "research_journal.md"


def _write_research_note(
    repo_root: Path,
    *,
    run_name: str,
    title: str,
    phase: str,
    result: dict[str, Any],
    audit_report: dict[str, Any] | None = None,
) -> Path:
    timestamp = datetime.now().astimezone()
    note_path = _research_journal_path(repo_root)
    phenomenon = (
        f"trial_score={result.get('trial_score')} | "
        f"best_success_rate={result.get('best_success_rate')} | "
        f"collapse={result.get('collapse_detected')}"
    )
    reasons = result.get("collapse_reasons") or []
    likely_causes = []
    if audit_report is not None:
        for row in audit_report.get("audit_records") or []:
            for cause in row.get("contract_issues") or []:
                likely_causes.append(cause)
    blocks: list[str] = []
    if not note_path.exists():
        blocks.extend(
            [
                "# MDIT Research Journal",
                "",
                "- This file is append-only and maintained by autoresearch.",
                "- Keep `best_path.md` and the execution manual as separate stable docs; run-by-run notes are consolidated here.",
                "",
            ]
        )
    blocks.extend(
        [
            f"## {timestamp.isoformat(timespec='seconds')} · {phase} · {run_name}",
            "",
            f"- Title: {title}",
            f"- Run: `{run_name}`",
            f"- Phase: `{phase}`",
            f"- Phenomenon: {phenomenon}",
            f"- Reasons: {'; '.join(str(item) for item in reasons) if reasons else 'none'}",
            f"- Result: best_success_rate={result.get('best_success_rate')} trial_score={result.get('trial_score')}",
            (
                f"- Audit report: `{result.get('audit_report_path')}`"
                if result.get("audit_report_path")
                else "- Audit report: none"
            ),
            (
                f"- Contract issues: {json.dumps(likely_causes[:5], ensure_ascii=False)}"
                if likely_causes
                else "- Contract issues: none"
            ),
            "",
        ]
    )
    with note_path.open("a", encoding="utf-8") as handle:
        handle.write("\n".join(blocks))
    return note_path


def _append_fixes_entry(
    repo_root: Path,
    *,
    title: str,
    file_scope: str,
    background: str,
    action_text: str,
    result_text: str,
    dedupe_key: str | None = None,
) -> None:
    fixes_path = repo_root / "docs" / "fixes.md"
    marker = None if dedupe_key is None else f"<!-- dedupe:{dedupe_key} -->"
    if marker is not None and fixes_path.exists():
        existing = fixes_path.read_text(encoding="utf-8")
        if marker in existing:
            return
    timestamp = datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")
    # fixes.md 同时记录修复、训练、审计与接管事件，因此统一输出为“标题 + 范围 + 背景 + 处理 + 结果”。
    entry = (
        f"\n{marker}\n" if marker is not None else "\n"
    ) + (
        f"### {timestamp} · {title}\n"
        f"范围：`{file_scope}`\n\n"
        f"背景：{background}\n\n"
        f"处理：{action_text}\n\n"
        f"结果：{result_text}\n"
    )
    with fixes_path.open("a", encoding="utf-8") as handle:
        handle.write(entry)


def _format_metric(value: Any) -> str:
    metric = _maybe_float(value)
    if metric is None:
        return "未解析"
    return f"{metric:.3f}"


def _format_value(value: Any) -> str:
    return "未解析" if value is None else str(value)


def _summarize_recipe_drift(output: dict[str, Any]) -> str:
    details = output.get("recipe_drift_details") or []
    if not details:
        return "无"
    parts: list[str] = []
    for row in details[:5]:
        parts.append(f"{row.get('key')} {row.get('base_value')} -> {row.get('resolved_value')}")
    return "；".join(parts)


def _summarize_train_result(output: dict[str, Any]) -> str:
    summary = output.get("train_summary") or {}
    latest_epoch = summary.get("latest_epoch")
    completed_epochs = None
    if isinstance(latest_epoch, int) and latest_epoch >= 0:
        completed_epochs = latest_epoch + 1
    best_metric = summary.get("best_metric")
    kept_ckpts = [Path(path).name for path in output.get("kept_ckpt_paths") or []]
    parts = [
        f"run_dir={_format_value(output.get('run_dir'))}",
        (
            f"训练已完成 {completed_epochs} 个 epoch（latest_epoch={latest_epoch}）"
            if completed_epochs is not None
            else "训练完成轮次未解析"
        ),
        f"最佳验证指标 best_metric={_format_metric(best_metric)}，best_epoch={_format_value(summary.get('best_epoch'))}",
        (
            f"保留检查点={', '.join(kept_ckpts)}"
            if kept_ckpts
            else "保留检查点=未解析"
        ),
        f"待离线审计={_format_value(output.get('pending_offline_audit'))}",
        f"受控配方偏移={_summarize_recipe_drift(output)}",
    ]
    return "；".join(parts)


def _summarize_audit_result(output: dict[str, Any]) -> str:
    parts: list[str] = []
    for epoch in (50, 100, 300, 500):
        value = output.get(f"success_{epoch}")
        if value is None:
            continue
        parts.append(f"success@epoch_{epoch:04d}={_format_metric(value)}")
    parts.extend(
        [
            f"最佳成功率={_format_metric(output.get('best_success_rate'))}",
            f"最佳 checkpoint epoch={_format_value(output.get('best_success_epoch'))}",
            f"trial_score={_format_metric(output.get('trial_score'))}",
            f"是否 collapse={_format_value(output.get('collapse_detected'))}",
        ]
    )
    if output.get("collapse_reasons"):
        parts.append(f"collapse 原因={'; '.join(str(item) for item in output['collapse_reasons'])}")
    parts.append(f"受控配方偏移={_summarize_recipe_drift(output)}")
    if output.get("audit_report_path"):
        parts.append(f"audit_report={output['audit_report_path']}")
    return "；".join(parts)


def _build_offline_audit_command(run_dir: Path) -> str:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "run_autoresearch_trial.py"),
        "--line", "mdit",
        "--phase",
        "audit-only",
        "--run-dir",
        str(run_dir),
    ]
    return " ".join(shlex.quote(part) for part in cmd)


def _load_experiment_manifest(run_dir: Path) -> dict[str, Any] | None:
    path = experiment_manifest_path(run_dir)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


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
    return resolve_runtime_config(cfg)


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
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "eval_mdit_all_checkpoints.py"),
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
        "--no-include-special",
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
        enriched["valid_loss_xyz_at_epoch"] = _maybe_float(valid_summary.get("loss_xyz"))
        enriched["valid_loss_rot6d_at_epoch"] = _maybe_float(valid_summary.get("loss_rot6d"))
        enriched["valid_loss_grip_at_epoch"] = _maybe_float(valid_summary.get("loss_grip"))
        enriched["valid_mse_xyz_at_epoch"] = _maybe_float(valid_summary.get("mse_xyz"))
        enriched["valid_mse_rot6d_at_epoch"] = _maybe_float(valid_summary.get("mse_rot6d"))
        enriched["valid_mse_grip_at_epoch"] = _maybe_float(valid_summary.get("mse_grip"))
        enriched["sample_mse_at_epoch"] = _maybe_float(sample_summary.get("train_action_mse_error"))
    else:
        enriched["train_loss_at_epoch"] = None
        enriched["valid_loss_at_epoch"] = None
        enriched["valid_loss_xyz_at_epoch"] = None
        enriched["valid_loss_rot6d_at_epoch"] = None
        enriched["valid_loss_grip_at_epoch"] = None
        enriched["valid_mse_xyz_at_epoch"] = None
        enriched["valid_mse_rot6d_at_epoch"] = None
        enriched["valid_mse_grip_at_epoch"] = None
        enriched["sample_mse_at_epoch"] = None
    return enriched


def _epoch_metric_value(records: list[dict[str, Any]], epoch: int, key: str) -> float | int | None:
    for row in records:
        if row.get("epoch") is None or int(row["epoch"]) != int(epoch):
            continue
        value = row.get(key)
        if isinstance(value, bool):
            return int(value)
        if isinstance(value, int):
            return value
        return _maybe_float(value)
    return None


def _log_audit_metrics_to_wandb(
    *,
    cfg: ExperimentConfig,
    request: TrialRequest,
    run_dir: Path,
    final_payload: dict[str, Any] | None,
    periodic_records: list[dict[str, Any]],
    output: dict[str, Any],
) -> None:
    if not cfg.wandb_enable:
        return
    if cfg.wandb_mode == "disabled":
        return
    if wandb is None:
        raise ImportError("wandb is not installed.")
    if final_payload is None:
        return

    wandb_run_id = final_payload.get("wandb_run_id")
    if not wandb_run_id:
        return

    wandb_run = wandb.init(
        project=cfg.wandb_project,
        entity=cfg.wandb_entity,
        mode=cfg.wandb_mode,
        name=f"{cfg.run_name}_{request.strategy}",
        dir=str(run_dir),
        resume="allow",
        id=str(wandb_run_id),
    )
    try:
        payload: dict[str, float | int] = {
            "audit/trial_score": float(output["trial_score"]),
            "audit/collapse_detected": int(bool(output["collapse_detected"])),
            "audit/recipe_drift": int(bool(output["recipe_drift"])),
        }
        best_success_rate = output.get("best_success_rate")
        if best_success_rate is not None:
            payload["audit/best_success_rate"] = float(best_success_rate)
        best_success_epoch = output.get("best_success_epoch")
        if best_success_epoch is not None:
            payload["audit/best_success_epoch"] = int(best_success_epoch)

        # 审计指标按 checkpoint epoch 展开，方便直接在 W&B 面板对照 50/100/300/500。
        metric_keys = {
            "success_rate": "success_rate",
            "mean_steps": "mean_steps",
            "num_successes": "num_successes",
            "num_episodes": "num_episodes",
            "valid_loss_at_epoch": "valid_loss_total",
            "valid_loss_xyz_at_epoch": "valid_loss_xyz",
            "valid_loss_rot6d_at_epoch": "valid_loss_rot6d",
            "valid_loss_grip_at_epoch": "valid_loss_grip",
            "valid_mse_xyz_at_epoch": "valid_mse_xyz",
            "valid_mse_rot6d_at_epoch": "valid_mse_rot6d",
            "valid_mse_grip_at_epoch": "valid_mse_grip",
        }
        audit_epochs = sorted(
            {
                int(row["epoch"])
                for row in periodic_records
                if row.get("epoch") is not None and row.get("success_rate") is not None
            }
        )
        for epoch in audit_epochs:
            for record_key, wandb_suffix in metric_keys.items():
                value = _epoch_metric_value(periodic_records, epoch, record_key)
                if value is None:
                    continue
                payload[f"audit/{wandb_suffix}_epoch_{int(epoch):04d}"] = value

        step = int(final_payload.get("global_step", 0))
        wandb_run.log(payload, step=step)
        for key, value in payload.items():
            if not key.startswith("audit/"):
                continue
            summary_key = key.replace("/", "_")
            wandb_run.summary[summary_key] = value
    finally:
        wandb_run.finish()


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
        # latest.pt 是续训入口，不能在 train-only / audit-only 清理时丢掉。
        run_dir / "latest.pt",
        cfg.summary_path,
        cfg.experiment_manifest_path,
        cfg.train_heartbeat_path,
        _trial_request_path(run_dir),
        cfg.best_ckpt_path,
        # 如果训练阶段启用了 success selection，best_success.pt 也属于强保留产物。
        cfg.best_success_ckpt_path,
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


def _print_audit_console_summary(output: dict[str, Any]) -> None:
    print()
    print("trial_audit_summary:")
    print(f"  run_name = {output.get('run_name')}")
    print(f"  experiment = {output.get('experiment_name')}")
    print(f"  stage_epochs = {output.get('stage_epochs')}")
    print(f"  eval_episodes = {output.get('eval_episodes')}")
    for epoch in (50, 100, 300, 500):
        value = output.get(f"success_{epoch}")
        if value is None:
            continue
        print(f"  success@epoch_{int(epoch):04d} = {float(value):.3f}")
    best_success_rate = output.get("best_success_rate")
    if best_success_rate is None:
        print("  best_success = unavailable")
    else:
        print(
            f"  best_success = {float(best_success_rate):.3f} "
            f"[epoch={output.get('best_success_epoch')}, ckpt={output.get('best_ckpt_path')}]"
        )
    print(f"  trial_score = {output.get('trial_score')}")
    print(f"  collapse_detected = {bool(output.get('collapse_detected'))}")
    print(f"  recipe_drift = {bool(output.get('recipe_drift'))}")
    if output.get("collapse_reasons"):
        print(f"  collapse_reasons = {' | '.join(str(item) for item in output['collapse_reasons'])}")
    if output.get("audit_report_path"):
        print(f"  audit_report = {output['audit_report_path']}")
    print()


def _training_error_output(
    *,
    request: TrialRequest,
    run_dir: Path,
    exc: Exception,
) -> dict[str, Any]:
    manifest = _load_experiment_manifest(run_dir)
    return {
        "line": "mdit",
        "phase": "train_only",
        "experiment_name": request.experiment_name,
        "description": request.description,
        "stage_epochs": int(request.stage_epochs),
        "eval_episodes": int(request.eval_episodes),
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
        "experiment_manifest_path": (
            str(experiment_manifest_path(run_dir)) if experiment_manifest_path(run_dir).exists() else None
        ),
        "recipe_drift": None if manifest is None else bool(manifest.get("recipe_drift")),
        "recipe_drift_details": [] if manifest is None else list(manifest.get("recipe_drift_details") or []),
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
    base_cfg = load_config(request.config_path)
    cfg = _prepare_cfg(request)
    resolved_request = _resolved_request(request, cfg)
    ckpt_root = cfg.ckpt_root.resolve()
    run_dir = cfg.ckpt_dir.resolve()

    try:
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
        summary = train_experiment(cfg, strategy=request.strategy)
        manifest = _load_experiment_manifest(run_dir)
        keep_paths = _build_train_keep_paths(run_dir, cfg)
        _prune_run_dir(run_dir, keep_paths)
        output = {
            "line": "mdit",
            "phase": "train_only",
            "experiment_name": request.experiment_name,
            "description": request.description,
            "stage_epochs": int(request.stage_epochs),
            "eval_episodes": int(request.eval_episodes),
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
            "experiment_manifest_path": (
                str(cfg.experiment_manifest_path) if cfg.experiment_manifest_path.exists() else None
            ),
            "recipe_drift": None if manifest is None else bool(manifest.get("recipe_drift")),
            "recipe_drift_details": [] if manifest is None else list(manifest.get("recipe_drift_details") or []),
            "audit_report_path": None,
            "summary_path": str(cfg.summary_path) if cfg.summary_path.exists() else None,
            "error_type": None,
            "train_summary": summary,
        }
        _record_trial_output(repo_root, run_name=cfg.run_name, output=output)
        _write_research_note(
            repo_root,
            run_name=cfg.run_name,
            title=f"MDIT Train Note · {cfg.run_name}",
            phase="train_only",
            result=output,
        )
        _append_fixes_entry(
            repo_root,
            title=f"训练完成并进入待审计状态 · {cfg.run_name}",
            file_scope="research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md",
            background=(
                f"候选 run `{cfg.run_name}` 已完成训练阶段，需要保留关键产物并转入共享离线审计。"
            ),
            action_text=(
                f"写出 trial record、summary、experiment_manifest，并保留关键 checkpoint；"
                f"stage_epochs={request.stage_epochs}，checkpoint_every={request.checkpoint_every}。"
            ),
            result_text=_summarize_train_result(output),
        )
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
        output = _training_error_output(request=request, run_dir=run_dir, exc=exc)
        if request.cleanup_failed and run_dir.exists():
            shutil.rmtree(run_dir)
        _record_trial_output(repo_root, run_name=run_dir.name, output=output)
        _write_research_note(
            repo_root,
            run_name=run_dir.name,
            title=f"MDIT Train Failure · {run_dir.name}",
            phase="train_only",
            result=output,
        )
        _append_fixes_entry(
            repo_root,
            title=f"训练失败，保留现场等待重试 · {run_dir.name}",
            file_scope="research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md",
            background=f"候选 run `{run_dir.name}` 在训练阶段异常退出：{exc}",
            action_text="保留失败 run 的 trial record、manifest 与日志线索，不清理现场，等待 watchdog 重试或人工诊断。",
            result_text=f"error_type={type(exc).__name__}；run_dir={run_dir}",
        )
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
    manifest = _load_experiment_manifest(run_dir)
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
            "experiment_manifest_path": (
                str(experiment_manifest_path(run_dir)) if experiment_manifest_path(run_dir).exists() else None
            ),
            "recipe_drift": None if manifest is None else bool(manifest.get("recipe_drift")),
            "recipe_drift_details": [] if manifest is None else list(manifest.get("recipe_drift_details") or []),
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

        # 审计已经拿到了真实 rollout 结果后，即便被规则标成 collapse，也不能再删除整条 run。
        # 否则会把后续还能复核/续训/回溯的 checkpoint 一起删掉。
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
        kept_ckpt_paths: list[str] = _collect_kept_ckpt_paths(keep_paths)

        best_success_path_out = (
            None if best_success_path is None or (not Path(best_success_path).exists()) else str(best_success_path)
        )
        best_valid_path_out = str(cfg.best_ckpt_path) if cfg.best_ckpt_path.exists() else None
        audit_report_path_out = str(cfg.audit_report_path) if cfg.audit_report_path.exists() else None
        summary_path_out = str(cfg.summary_path) if cfg.summary_path.exists() else None

        output = {
            "line": "mdit",
            "phase": "audit_only",
            "experiment_name": request.experiment_name,
            "description": request.description,
            "stage_epochs": int(request.stage_epochs),
            "eval_episodes": int(request.eval_episodes),
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
            "experiment_manifest_path": (
                str(experiment_manifest_path(run_dir)) if experiment_manifest_path(run_dir).exists() else None
            ),
            "recipe_drift": None if manifest is None else bool(manifest.get("recipe_drift")),
            "recipe_drift_details": [] if manifest is None else list(manifest.get("recipe_drift_details") or []),
            "audit_report_path": audit_report_path_out,
            "summary_path": summary_path_out,
            "error_type": None,
        }
        _log_audit_metrics_to_wandb(
            cfg=cfg,
            request=request,
            run_dir=run_dir,
            final_payload=final_payload,
            periodic_records=periodic_records,
            output=output,
        )
        _record_trial_output(repo_root, run_name=cfg.run_name, output=output, audit_report=audit_report)
        _write_research_note(
            repo_root,
            run_name=cfg.run_name,
            title=f"MDIT Audit Note · {cfg.run_name}",
            phase="audit_only",
            result=output,
            audit_report=audit_report,
        )
        _append_fixes_entry(
            repo_root,
            title=f"离线审计完成 · {cfg.run_name}",
            file_scope="research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md",
            background=(
                f"候选 run `{cfg.run_name}` 已完成共享离线审计，需要固化关键成功率与后续筛选依据。"
            ),
            action_text=(
                f"统一使用共享 audit chain 执行评估；episodes={request.eval_episodes}，"
                f"stage_epochs={request.stage_epochs}。"
            ),
            result_text=_summarize_audit_result(output),
        )
        if log_results:
            _append_results_row(
                repo_root,
                experiment_name=request.experiment_name,
                metric=trial_score,
                status="collapsed" if collapse_detected else "measured",
                description=request.description or cfg.run_name,
            )
        _print_audit_console_summary(output)
        return output
    except Exception as exc:
        if run_dir.exists():
            keep_paths = [path for path in training_keep_paths if path.exists()]
            _prune_run_dir(run_dir, keep_paths)
        output = {
            "line": "mdit",
            "phase": "audit_only",
            "experiment_name": request.experiment_name,
            "description": request.description,
            "stage_epochs": int(request.stage_epochs),
            "eval_episodes": int(request.eval_episodes),
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
            "experiment_manifest_path": (
                str(experiment_manifest_path(run_dir)) if experiment_manifest_path(run_dir).exists() else None
            ),
            "recipe_drift": None if manifest is None else bool(manifest.get("recipe_drift")),
            "recipe_drift_details": [] if manifest is None else list(manifest.get("recipe_drift_details") or []),
            "audit_report_path": None,
            "summary_path": str(cfg.summary_path) if cfg.summary_path.exists() else None,
            "error_type": type(exc).__name__,
        }
        _record_trial_output(repo_root, run_name=cfg.run_name, output=output)
        _write_research_note(
            repo_root,
            run_name=cfg.run_name,
            title=f"MDIT Audit Failure · {cfg.run_name}",
            phase="audit_only",
            result=output,
        )
        _append_fixes_entry(
            repo_root,
            title=f"离线审计失败，保留产物等待重试 · {cfg.run_name}",
            file_scope="research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md",
            background=f"候选 run `{cfg.run_name}` 在共享离线审计阶段异常退出：{exc}",
            action_text="保留训练产物、manifest 与 audit 命令线索，等待 watchdog 重试或人工对照 PDIT/faithful 挑战者诊断。",
            result_text=f"error_type={type(exc).__name__}；pending_offline_audit=true；run_dir={run_dir}",
        )
        if log_results:
            _append_results_row(
                repo_root,
                experiment_name=request.experiment_name,
                metric=-1.0,
                status="audit_error",
                description=f"{request.description or cfg.run_name}: {exc}",
            )
        _print_audit_console_summary(output)
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


def train_mdit_autoresearch_trial(request: TrialRequest, *, log_results: bool = True) -> dict[str, Any]:
    return train_autoresearch_trial(request, log_results=log_results)


def finalize_mdit_autoresearch_trial(
    run_dir: Path,
    *,
    request_overrides: TrialRequest | None = None,
    log_results: bool = True,
) -> dict[str, Any]:
    return finalize_autoresearch_trial(
        run_dir,
        request_overrides=request_overrides,
        log_results=log_results,
    )


def run_mdit_autoresearch_trial(request: TrialRequest) -> dict[str, Any]:
    return run_autoresearch_trial(request)


def adopt_existing_mdit_autoresearch_run(
    run_dir: Path,
    *,
    request_overrides: TrialRequest,
) -> dict[str, Any]:
    repo_root = PROJECT_ROOT
    run_dir = run_dir.expanduser().resolve()
    if not run_dir.exists():
        raise FileNotFoundError(f"Existing MDIT run dir not found: {run_dir}")
    config_path = run_dir / "config.json"
    if not config_path.exists():
        raise FileNotFoundError(f"Existing MDIT run is missing config.json: {config_path}")

    base_cfg = load_config(request_overrides.config_path)
    resolved_cfg = load_config(config_path)
    resolved_cfg.run_name = run_dir.name

    payload = _trial_request_to_dict(request_overrides)
    payload["run_name"] = run_dir.name
    payload["device"] = resolved_cfg.device
    payload["ckpt_root"] = str(resolved_cfg.ckpt_root)
    resolved_request = _trial_request_from_dict(payload)

    trial_request_path = _write_trial_request(run_dir, resolved_request)
    manifest_path = _write_experiment_manifest(
        run_dir,
        request=request_overrides,
        base_cfg=base_cfg,
        resolved_cfg=resolved_cfg,
        resolved_request=resolved_request,
    )
    keep_paths = _build_train_keep_paths(run_dir, resolved_cfg)

    output = {
        "line": "mdit",
        "phase": "adopt_existing",
        "experiment_name": request_overrides.experiment_name,
        "description": request_overrides.description,
        "stage_epochs": int(request_overrides.stage_epochs),
        "eval_episodes": int(request_overrides.eval_episodes),
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
        "best_valid_ckpt_path": str(resolved_cfg.best_ckpt_path) if resolved_cfg.best_ckpt_path.exists() else None,
        "kept_ckpt_paths": _collect_kept_ckpt_paths(keep_paths),
        "run_name": run_dir.name,
        "run_dir": str(run_dir),
        "trial_request_path": str(trial_request_path),
        "experiment_manifest_path": str(manifest_path),
        "recipe_drift": False,
        "recipe_drift_details": [],
        "audit_report_path": None,
        "summary_path": str(resolved_cfg.summary_path) if resolved_cfg.summary_path.exists() else None,
        "error_type": None,
    }
    _record_trial_output(repo_root, run_name=run_dir.name, output=output)
    _write_research_note(
        repo_root,
        run_name=run_dir.name,
        title=f"MDIT Adopt Existing Run · {run_dir.name}",
        phase="adopt_existing",
        result=output,
    )
    _append_fixes_entry(
        repo_root,
        title=f"接管已有 run 并补齐元数据 · {run_dir.name}",
        file_scope="research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md",
        background=f"现有 run `{run_dir.name}` 需要纳入 autoresearch 守护链，供后续统一训练/审计/筛选。",
        action_text=(
            f"补写 trial_request/experiment_manifest，experiment_name={request_overrides.experiment_name}，"
            f"stage_epochs={request_overrides.stage_epochs}。"
        ),
        result_text=f"run_dir={run_dir}；pending_offline_audit=true",
        dedupe_key=(
            f"adopt_existing:{run_dir.name}:{request_overrides.experiment_name}:{int(request_overrides.stage_epochs)}"
        ),
    )
    return output


__all__ = [
    "TrialRequest",
    "adopt_existing_mdit_autoresearch_run",
    "finalize_autoresearch_trial",
    "finalize_mdit_autoresearch_trial",
    "run_autoresearch_trial",
    "run_mdit_autoresearch_trial",
    "train_autoresearch_trial",
    "train_mdit_autoresearch_trial",
]
