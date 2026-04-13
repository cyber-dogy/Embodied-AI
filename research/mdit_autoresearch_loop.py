from __future__ import annotations

from dataclasses import asdict, dataclass
import json
import os
import signal
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

import torch

from common.runtime import PROJECT_ROOT
from research.mdit_trial_runner import (
    _enrich_record_with_checkpoint_stats,
    _materialize_best_success_checkpoint,
    _select_best_success_record,
)


@dataclass(slots=True)
class SearchSpec:
    name: str
    stage_epochs: int
    eval_episodes: int
    description: str
    overrides: dict[str, Any]


DEFAULT_BASELINE = SearchSpec(
    name="rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100",
    stage_epochs=100,
    eval_episodes=20,
    description="5RGB + text + last_block + shared encoder + obs2 + action16 + PDIT token path baseline",
    overrides={
        "camera_names": ["right_shoulder", "left_shoulder", "overhead", "front", "wrist"],
        "n_obs_steps": 2,
        "horizon": 32,
        "n_action_steps": 16,
        "use_amp": False,
        "transformer_variant": "pdit",
        "observation_encoder.vision.use_separate_encoder_per_camera": False,
        "observation_encoder.vision.train_mode": "last_block",
        "observation_encoder.vision.resize_shape": [224, 224],
        "batch_size": 8,
        "grad_accum_steps": 4,
        "num_workers": 8,
        "optimizer_lr": 2e-5,
        "optimizer_betas": [0.95, 0.999],
        "optimizer_weight_decay": 0.0,
        "objective.sigma_min": 0.0,
        "objective.num_integration_steps": 50,
        "objective.loss_weights": {"xyz": 1.0, "rot6d": 1.0, "grip": 1.0},
        "smooth_actions": False,
        "command_mode": "first",
        "position_alpha": 0.35,
        "rotation_alpha": 0.25,
        "max_position_step": 0.03,
        "gripper_open_threshold": 0.6,
        "gripper_close_threshold": 0.4,
        "pdit_backbone.final_layer_zero_init": True,
        "pdit_backbone.decoder_condition_mode": "mean_pool",
    },
)

DEFAULT_CANDIDATES: tuple[SearchSpec, ...] = ()

DEFAULT_WATCH_POLL_SEC = 60
DEFAULT_SWITCH_BATCH_SIZE = 144
DEFAULT_SWITCH_NUM_WORKERS = 8
DEFAULT_SWITCH_GRAD_ACCUM_STEPS = 1
DEFAULT_SWITCH_CAMERAS = ("front", "wrist", "overhead")


def _record_dir() -> Path:
    path = PROJECT_ROOT / "autoresearch_records"
    path.mkdir(parents=True, exist_ok=True)
    (path / "logs").mkdir(parents=True, exist_ok=True)
    return path


def _loop_summary_path(tag: str) -> Path:
    return _record_dir() / f"mdit_autoresearch_loop_{tag}.json"


def _trial_record_path(run_name: str) -> Path:
    return _record_dir() / f"{run_name}.json"


def _watch_summary_path(run_name: str) -> Path:
    return _record_dir() / f"mdit_watch_{run_name}.json"


def _write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _now_text() -> str:
    return time.strftime("%Y-%m-%d %H:%M:%S")


def _normalize_pid(pid: int | None) -> int | None:
    if pid is None:
        return None
    value = int(pid)
    return value if value > 0 else None


def _process_alive(pid: int | None) -> bool:
    normalized = _normalize_pid(pid)
    if normalized is None:
        return False
    try:
        os.kill(normalized, 0)
        return True
    except OSError:
        return False


def _find_train_pid_by_run_name(run_name: str) -> int | None:
    completed = subprocess.run(
        ["ps", "-eo", "pid=,args="],
        check=True,
        capture_output=True,
        text=True,
    )
    candidates: list[int] = []
    needle = str(run_name)
    for line in completed.stdout.splitlines():
        text = line.strip()
        if not text or needle not in text:
            continue
        if "run_mdit_autoresearch_trial.py" not in text:
            continue
        pid_text, _, args = text.partition(" ")
        if "--phase train-only" not in args:
            continue
        try:
            candidates.append(int(pid_text))
        except ValueError:
            continue
    if not candidates:
        return None
    return min(candidates)


def _discover_coppeliasim_root() -> Path | None:
    candidates = [
        os.environ.get("COPPELIASIM_ROOT"),
        str(Path.home() / "CoppeliaSim"),
        str(Path.home() / "tools" / "CoppeliaSim_Edu_V4_1_0_Ubuntu20_04"),
    ]
    for value in candidates:
        if not value:
            continue
        path = Path(value).expanduser().resolve()
        if path.exists():
            return path
    return None


def _build_eval_env() -> dict[str, str]:
    env = dict(os.environ)
    coppeliasim_root = _discover_coppeliasim_root()
    if coppeliasim_root is not None:
        root_text = str(coppeliasim_root)
        env["COPPELIASIM_ROOT"] = root_text
        ld_library_path = env.get("LD_LIBRARY_PATH", "")
        if not ld_library_path:
            env["LD_LIBRARY_PATH"] = root_text
        elif root_text not in ld_library_path.split(":"):
            env["LD_LIBRARY_PATH"] = f"{root_text}:{ld_library_path}"
        env["QT_QPA_PLATFORM_PLUGIN_PATH"] = root_text
    env.setdefault("QT_QPA_PLATFORM", "offscreen")
    return env


def _query_gpu_status() -> dict[str, Any] | None:
    cmd = [
        "nvidia-smi",
        "--query-gpu=name,memory.total,memory.used,memory.free,utilization.gpu,utilization.memory",
        "--format=csv,noheader,nounits",
    ]
    completed = subprocess.run(cmd, check=True, capture_output=True, text=True)
    first_line = next((line.strip() for line in completed.stdout.splitlines() if line.strip()), None)
    if first_line is None:
        return None
    parts = [part.strip() for part in first_line.split(",")]
    if len(parts) != 6:
        return {"raw": first_line}
    total_mib = float(parts[1])
    used_mib = float(parts[2])
    free_mib = float(parts[3])
    return {
        "name": parts[0],
        "memory_total_mib": total_mib,
        "memory_used_mib": used_mib,
        "memory_free_mib": free_mib,
        "memory_total_gb": round(total_mib / 1024.0, 2),
        "memory_used_gb": round(used_mib / 1024.0, 2),
        "memory_free_gb": round(free_mib / 1024.0, 2),
        "utilization_gpu_pct": float(parts[4]),
        "utilization_memory_pct": float(parts[5]),
    }


def _read_checkpoint_meta(ckpt_path: Path) -> dict[str, Any] | None:
    if not ckpt_path.exists():
        return None
    payload = torch.load(ckpt_path, map_location="cpu")
    epoch_row = payload.get("epoch_summary")
    train_summary = {} if epoch_row is None else dict(epoch_row.get("train") or {})
    valid_summary = {} if epoch_row is None else dict(epoch_row.get("valid") or {})
    return {
        "checkpoint_path": str(ckpt_path.resolve()),
        "completed_epoch": int(payload.get("completed_epoch", -1)),
        "global_step": payload.get("global_step"),
        "best_metric": payload.get("best_metric"),
        "best_epoch": payload.get("best_epoch"),
        "best_success_rate": payload.get("best_success_rate"),
        "best_success_epoch": payload.get("best_success_epoch"),
        "wandb_run_id": payload.get("wandb_run_id"),
        "train_loss_at_epoch": train_summary.get("loss_total"),
        "valid_loss_at_epoch": valid_summary.get("loss_total"),
    }


def _periodic_checkpoint_path(run_dir: Path, epoch: int) -> Path:
    return run_dir / "epochs" / f"epoch_{int(epoch):04d}.pt"


def _audit_results_path(run_dir: Path) -> Path:
    return run_dir / "audit_raw_results.json"


def _audit_status_latest_path(run_dir: Path) -> Path:
    return run_dir / "audit_status_latest.json"


def _audit_status_epoch_path(run_dir: Path, epoch: int, episodes: int) -> Path:
    return run_dir / "audit_status" / f"epoch_{int(epoch):04d}__episodes={int(episodes)}.json"


def _eval_output_json_path(ckpt_path: Path, *, episodes: int, max_steps: int, seed: int) -> Path:
    return (
        ckpt_path.resolve().parents[1]
        / "eval_results"
        / f"{ckpt_path.stem}__episodes={int(episodes)}__max_steps={int(max_steps)}__seed={int(seed)}.json"
    )


def _load_watch_audit_payload(run_dir: Path) -> dict[str, Any]:
    path = _audit_results_path(run_dir)
    if not path.exists():
        return {"records": []}
    payload = _load_json(path)
    if isinstance(payload, dict) and isinstance(payload.get("records"), list):
        return payload
    if isinstance(payload, dict):
        return {"records": list(payload.values())}
    if isinstance(payload, list):
        return {"records": payload}
    return {"records": []}


def _save_watch_audit_payload(run_dir: Path, records: list[dict[str, Any]]) -> Path:
    payload = {
        "run_name": run_dir.name,
        "updated_at": _now_text(),
        "records": records,
    }
    return _write_json(_audit_results_path(run_dir), payload)


def _upsert_watch_audit_record(run_dir: Path, row: dict[str, Any]) -> list[dict[str, Any]]:
    payload = _load_watch_audit_payload(run_dir)
    records = [dict(item) for item in payload.get("records", [])]
    key = (
        str(row.get("checkpoint_path")),
        int(row.get("epoch") or 0),
        int(row.get("episodes") or 0),
        str(row.get("kind") or "periodic"),
    )
    replaced = False
    for index, existing in enumerate(records):
        existing_key = (
            str(existing.get("checkpoint_path")),
            int(existing.get("epoch") or 0),
            int(existing.get("episodes") or 0),
            str(existing.get("kind") or "periodic"),
        )
        if existing_key == key:
            records[index] = dict(row)
            replaced = True
            break
    if not replaced:
        records.append(dict(row))
    records.sort(key=lambda item: (int(item.get("epoch") or 0), int(item.get("episodes") or 0)))
    _save_watch_audit_payload(run_dir, records)
    return records


def _successful_periodic_audits(
    records: list[dict[str, Any]],
    *,
    run_name: str,
    episodes: int,
) -> list[dict[str, Any]]:
    filtered = [
        dict(row)
        for row in records
        if str(row.get("run_name")) == str(run_name)
        and str(row.get("status")) == "ok"
        and str(row.get("kind") or "periodic") == "periodic"
        and int(row.get("episodes") or 0) == int(episodes)
        and row.get("success_rate") is not None
    ]
    filtered.sort(key=lambda item: int(item.get("epoch") or 0))
    return filtered


def _read_last_json_line(path: Path) -> dict[str, Any]:
    last_json = None
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        text = line.strip()
        if not text.startswith("{") or not text.endswith("}"):
            continue
        last_json = json.loads(text)
    if last_json is None:
        raise RuntimeError(f"Could not find JSON result line in {path}")
    return last_json


def _score_key(result: dict[str, Any]) -> tuple[float, float, float]:
    trial_score = float(result.get("trial_score") or -1.0)
    best_success = float(result.get("best_success_rate") or -1.0)
    best_epoch = float(result.get("best_success_epoch") or 0.0)
    return (trial_score, best_success, -best_epoch)


def _simpler_spec_key(spec: SearchSpec) -> tuple[int, int]:
    return (len(spec.overrides), sum(len(key) for key in spec.overrides))


def _choose_top_specs(results: list[dict[str, Any]], limit: int = 2) -> list[dict[str, Any]]:
    ranked = sorted(
        results,
        key=lambda row: (
            _score_key(row),
            tuple(-value for value in _simpler_spec_key(SearchSpec(
                name=str(row["experiment_name"]),
                stage_epochs=int(row["stage_epochs"]),
                eval_episodes=int(row["eval_episodes"]),
                description=str(row.get("description", "")),
                overrides=dict(row.get("overrides", {})),
            ))),
        ),
        reverse=True,
    )
    return ranked[:limit]


def _find_existing_result(
    rows: list[dict[str, Any]] | None,
    *,
    experiment_name: str,
    stage_epochs: int,
    eval_episodes: int,
) -> dict[str, Any] | None:
    if not rows:
        return None
    for row in rows:
        if (
            str(row.get("experiment_name")) == str(experiment_name)
            and int(row.get("stage_epochs", 0)) == int(stage_epochs)
            and int(row.get("eval_episodes", 0)) == int(eval_episodes)
        ):
            return row
    return None


def _find_existing_trial_record(
    *,
    experiment_name: str,
    stage_epochs: int,
    eval_episodes: int,
) -> dict[str, Any] | None:
    candidates: list[tuple[float, Path]] = []
    for path in _record_dir().glob("*.json"):
        if path.name.startswith("mdit_autoresearch_loop_"):
            continue
        try:
            payload = _load_json(path)
        except Exception:
            continue
        if str(payload.get("line")) != "mdit":
            continue
        if str(payload.get("experiment_name")) != str(experiment_name):
            continue
        payload_stage_epochs = payload.get("stage_epochs")
        if payload_stage_epochs is not None and int(payload_stage_epochs) != int(stage_epochs):
            continue
        payload_eval_episodes = payload.get("eval_episodes")
        if payload_eval_episodes is not None and int(payload_eval_episodes) != int(eval_episodes):
            continue
        candidates.append((path.stat().st_mtime, path))
    if not candidates:
        return None
    candidates.sort(key=lambda item: item[0], reverse=True)
    return _load_json(candidates[0][1])


def wait_for_existing_result(
    *,
    run_dir: Path,
    poll_sec: int = 60,
    timeout_sec: int | None = None,
) -> dict[str, Any]:
    deadline = None if timeout_sec is None else time.monotonic() + max(1, int(timeout_sec))
    record_path = _trial_record_path(run_dir.name)
    audit_report_path = run_dir / "audit_report.json"
    while True:
        if record_path.exists():
            payload = _load_json(record_path)
            if not payload.get("pending_offline_audit", False):
                return payload
        if audit_report_path.exists():
            payload = _load_json(audit_report_path)
            best_record = payload.get("best_record")
            return {
                "line": "mdit",
                "phase": "audit_only",
                "experiment_name": payload.get("experiment_name"),
                "description": payload.get("description", ""),
                "trial_score": -1.0 if payload.get("collapse_detected") else float(best_record["success_rate"]) if best_record else -1.0,
                "success_20": float(best_record["success_rate"]) if best_record and int(payload.get("eval_episodes", 0)) >= 20 else None,
                "success_100": float(best_record["success_rate"]) if best_record and int(payload.get("eval_episodes", 0)) >= 100 else None,
                "collapse_detected": bool(payload.get("collapse_detected")),
                "collapse_reasons": payload.get("collapse_reasons", []),
                "best_ckpt_path": None
                if best_record is None or not (run_dir / "best_success.pt").exists()
                else str(run_dir / "best_success.pt"),
                "best_success_rate": None if best_record is None else float(best_record["success_rate"]),
                "best_success_epoch": None if best_record is None else int(best_record.get("epoch") or 0),
                "run_name": run_dir.name,
                "run_dir": str(run_dir),
                "audit_report_path": str(audit_report_path),
            }
        if deadline is not None and time.monotonic() > deadline:
            raise TimeoutError(f"Timed out waiting for finished trial result in {run_dir}")
        time.sleep(max(1, int(poll_sec)))


def _evaluate_checkpoint_once(
    *,
    ckpt_path: Path,
    epoch: int,
    kind: str,
    episodes: int,
    seed: int,
    device: str | None,
    max_steps: int,
    heartbeat_every: int,
    headless: bool,
    show_progress: bool,
    timeout_sec: int,
    env: dict[str, str] | None,
) -> dict[str, Any]:
    output_json = _eval_output_json_path(ckpt_path, episodes=episodes, max_steps=max_steps, seed=seed)
    output_json.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "eval_mdit_checkpoint.py"),
        "--ckpt-path",
        str(ckpt_path),
        "--episodes",
        str(int(episodes)),
        "--seed",
        str(int(seed)),
        "--max-steps",
        str(int(max_steps)),
        "--heartbeat-every",
        str(int(heartbeat_every)),
        "--output-json",
        str(output_json),
        "--headless" if headless else "--no-headless",
        "--show-progress" if show_progress else "--no-show-progress",
    ]
    if device:
        cmd.extend(["--device", str(device)])
    subprocess.run(
        cmd,
        cwd=PROJECT_ROOT,
        env=env,
        check=True,
        timeout=max(1, int(timeout_sec)),
    )
    result = _load_json(output_json)
    return {
        "checkpoint_path": str(ckpt_path.resolve()),
        "epoch": int(epoch),
        "kind": str(kind),
        "episodes": int(episodes),
        "seed": int(seed),
        "max_steps": int(max_steps),
        "status": "ok",
        "success_rate": float(result["success_rate"]),
        "mean_steps": float(result["mean_steps"]),
        "num_episodes": int(result["num_episodes"]),
        "duration_sec": float(result["duration_sec"]),
        "result_json": str(output_json),
        "infra_failure": False,
    }


def _audit_checkpoint_with_retry(
    *,
    run_dir: Path,
    ckpt_path: Path,
    epoch: int,
    kind: str,
    episodes: int,
    seed: int,
    device: str | None,
    max_steps: int,
    heartbeat_every: int,
    headless: bool,
    show_progress: bool,
    timeout_sec: int,
) -> dict[str, Any]:
    started_at = time.perf_counter()
    errors: list[str] = []
    for attempt, env in enumerate((None, _build_eval_env()), start=1):
        try:
            row = _evaluate_checkpoint_once(
                ckpt_path=ckpt_path,
                epoch=epoch,
                kind=kind,
                episodes=episodes,
                seed=seed,
                device=device,
                max_steps=max_steps,
                heartbeat_every=heartbeat_every,
                headless=headless,
                show_progress=show_progress,
                timeout_sec=timeout_sec,
                env=env,
            )
            row["attempt"] = int(attempt)
            row["repair_applied"] = bool(attempt > 1)
            row["audited_at"] = _now_text()
            row["elapsed_sec"] = float(time.perf_counter() - started_at)
            return row
        except Exception as exc:
            errors.append(f"attempt {attempt}: {exc}")
    row = {
        "checkpoint_path": str(ckpt_path.resolve()),
        "epoch": int(epoch),
        "kind": str(kind),
        "episodes": int(episodes),
        "seed": int(seed),
        "max_steps": int(max_steps),
        "status": "infra_failure",
        "success_rate": None,
        "mean_steps": None,
        "num_episodes": int(episodes),
        "duration_sec": None,
        "result_json": None,
        "infra_failure": True,
        "repair_applied": True,
        "attempt": 2,
        "audited_at": _now_text(),
        "elapsed_sec": float(time.perf_counter() - started_at),
        "error": " | ".join(errors),
    }
    return row


def _refresh_best_success_checkpoint(run_dir: Path, records: list[dict[str, Any]], *, run_name: str) -> Path | None:
    periodic = _successful_periodic_audits(records, run_name=run_name, episodes=20)
    if not periodic:
        return None
    enriched: list[dict[str, Any]] = []
    for row in periodic:
        enriched.append(
            _enrich_record_with_checkpoint_stats(
                {
                    "label": f"epoch_{int(row['epoch']):04d}",
                    "kind": "periodic",
                    "path": row["checkpoint_path"],
                    "epoch": int(row["epoch"]),
                    "success_rate": float(row["success_rate"]),
                }
            )
        )
    best = _select_best_success_record(enriched)
    return _materialize_best_success_checkpoint(run_dir, best)


def _decide_watch_action(
    *,
    records: list[dict[str, Any]],
    run_name: str,
    prior_state: str | None,
    max_steps: int,
) -> dict[str, Any]:
    periodic = _successful_periodic_audits(records, run_name=run_name, episodes=20)
    if not periodic:
        return {
            "decision_state": "continue",
            "decision_reason": "Waiting for the first success@20 audit checkpoint.",
        }

    latest = periodic[-1]
    latest_epoch = int(latest["epoch"])
    latest_success = float(latest["success_rate"])
    latest_mean_steps = None if latest.get("mean_steps") is None else float(latest["mean_steps"])

    if latest_success <= 0.0 and latest_mean_steps is not None and latest_mean_steps >= float(max_steps) - 1.0:
        return {
            "decision_state": "switch",
            "decision_reason": (
                f"epoch {latest_epoch} stayed at success@20={latest_success:.3f} with mean_steps={latest_mean_steps:.1f}"
            ),
        }

    if len(periodic) >= 2:
        previous = periodic[-2]
        previous_success = float(previous["success_rate"])
        drop = previous_success - latest_success
        if drop > 0.05:
            if str(prior_state) == "investigate":
                return {
                    "decision_state": "switch",
                    "decision_reason": (
                        f"success@20 dropped twice in a row ({previous_success:.3f} -> {latest_success:.3f})."
                    ),
                }
            return {
                "decision_state": "investigate",
                "decision_reason": f"success@20 dropped from {previous_success:.3f} to {latest_success:.3f}.",
            }

    success_by_epoch = {int(row["epoch"]): float(row["success_rate"]) for row in periodic}
    success_100 = success_by_epoch.get(100)
    success_200 = success_by_epoch.get(200)

    if success_100 is not None and success_100 < 0.45:
        return {
            "decision_state": "switch",
            "decision_reason": f"epoch 100 success@20={success_100:.3f} is below the 0.45 gate.",
        }
    if success_100 is not None and success_100 < 0.55 and latest_epoch < 300:
        return {
            "decision_state": "investigate",
            "decision_reason": f"epoch 100 success@20={success_100:.3f}; continue to epoch 300 and require >= 0.55.",
        }
    success_300 = success_by_epoch.get(300)
    if success_300 is not None and success_300 < 0.55:
        return {
            "decision_state": "switch",
            "decision_reason": f"epoch 300 success@20={success_300:.3f} is below the 0.55 gate.",
        }
    if success_200 is not None and latest_epoch < 300:
        best_first_two = max(value for value in (success_100, success_200) if value is not None)
        if best_first_two < 0.45:
            return {
                "decision_state": "investigate",
                "decision_reason": f"best(success@20@100, success@20@200)={best_first_two:.3f}; wait for epoch 300 gate.",
            }

    best_success = max(float(row["success_rate"]) for row in periodic)
    return {
        "decision_state": "continue",
        "decision_reason": f"Best success@20 so far is {best_success:.3f} at epoch {latest_epoch}.",
    }


def _stop_training_process(pid: int | None) -> None:
    normalized = _normalize_pid(pid)
    if normalized is None or not _process_alive(normalized):
        return
    os.kill(normalized, signal.SIGTERM)


def _launch_obs3_switch_run(
    *,
    config_path: Path,
    device: str | None,
    ckpt_root: Path | None,
    data_root: Path | None,
    expected_epochs: int,
    checkpoint_every: int,
    description_suffix: str,
) -> dict[str, Any]:
    base_run_name = DEFAULT_BASELINE.name.replace("_100", "_500")
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    run_name = f"unplug_charger_mdit_faithful_v1__{base_run_name}__e{int(expected_epochs):04d}__{timestamp}"
    experiment_name = "obs3_amp_baseline_500"
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "run_mdit_autoresearch_trial.py"),
        "--phase",
        "train-only",
        "--config",
        str(config_path),
        "--stage-epochs",
        str(int(expected_epochs)),
        "--checkpoint-every",
        str(int(checkpoint_every)),
        "--experiment-name",
        experiment_name,
        "--run-name",
        run_name,
        "--description",
        f"obs3 + amp baseline + autoresearch watch switch ({description_suffix})",
    ]
    if device:
        cmd.extend(["--device", str(device)])
    if ckpt_root is not None:
        cmd.extend(["--ckpt-root", str(ckpt_root)])
    if data_root is not None:
        cmd.extend(["--data-root", str(data_root)])
    overrides = {
        "n_obs_steps": 3,
        "use_amp": True,
        "batch_size": DEFAULT_SWITCH_BATCH_SIZE,
        "num_workers": DEFAULT_SWITCH_NUM_WORKERS,
        "grad_accum_steps": DEFAULT_SWITCH_GRAD_ACCUM_STEPS,
        "camera_names": list(DEFAULT_SWITCH_CAMERAS),
        "save_latest_ckpt": True,
        "save_best_valid_ckpt": True,
        "checkpoint_payload_mode": "full",
        "resume_from_latest": False,
    }
    for key, value in overrides.items():
        cmd.extend(["--set", f"{key}={json.dumps(value)}"])
    launched = subprocess.Popen(
        cmd,
        cwd=PROJECT_ROOT,
        env=_build_eval_env(),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True,
    )
    resolved_ckpt_root = (ckpt_root or PROJECT_ROOT / "ckpt").expanduser().resolve() if ckpt_root else (PROJECT_ROOT / "ckpt").resolve()
    return {
        "run_name": run_name,
        "run_dir": str((resolved_ckpt_root / run_name).resolve()),
        "train_pid": int(launched.pid),
        "experiment_name": experiment_name,
    }


def run_mdit_attached_watch(
    *,
    run_dir: Path,
    train_pid: int | None,
    config_path: Path,
    checkpoint_every: int,
    expected_epochs: int,
    intermediate_eval_episodes: int,
    final_eval_episodes: int,
    device: str | None = None,
    headless: bool = True,
    show_progress: bool = True,
    cleanup_failed: bool = True,
    audit_timeout_sec: int = 7200,
    ckpt_root: Path | None = None,
    data_root: Path | None = None,
    poll_sec: int = DEFAULT_WATCH_POLL_SEC,
    eval_seed: int = 1234,
    max_steps: int = 200,
    heartbeat_every: int = 50,
) -> dict[str, Any]:
    root_run_dir = run_dir.expanduser().resolve()
    active_run_dir = root_run_dir
    active_run_name = active_run_dir.name
    root_run_name = active_run_name
    active_train_pid = _normalize_pid(train_pid) or _find_train_pid_by_run_name(active_run_name)
    watch_path = _watch_summary_path(root_run_name)
    if watch_path.exists():
        state = _load_json(watch_path)
    else:
        state = {
            "mode": "mdit_attached_watch",
            "root_run_name": root_run_name,
            "root_run_dir": str(root_run_dir),
            "started_at": _now_text(),
            "runs": [],
            "audits": [],
            "switch_count": 0,
        }
    state["config_path"] = str(config_path)
    state["checkpoint_every"] = int(checkpoint_every)
    state["expected_epochs"] = int(expected_epochs)
    state["intermediate_eval_episodes"] = int(intermediate_eval_episodes)
    state["final_eval_episodes"] = int(final_eval_episodes)
    state["investigation_priorities"] = [
        "Compare horizon=32 and n_action_steps=8 against the original multitask_dit_policy defaults (~100 / ~24).",
        "Verify the 5-camera ordering and tensor layout match RLBenchEnv output ordering.",
        "Verify n_obs_steps=3 observation flattening and text conditioning stay aligned between train and eval.",
        "Check predict_action / action-chunk slicing against the training target window.",
        "Check MIN_MAX normalization, unnormalization, and action clipping against the original implementation.",
        "If obs3 also underperforms, compare flow-matching objective choices against the original diffusion-heavy recipe.",
    ]
    state["baseline_comparison_notes"] = [
        "Original multitask_dit_policy enables pin_memory, prefetch_factor=2, and non_blocking GPU copies.",
        "Original multitask_dit_policy typically runs with a longer horizon and n_action_steps.",
        "The current 5-camera run is treated as a high-risk validation branch because cam_all5_100 previously failed.",
    ]
    state["current_run_name"] = active_run_name
    state["current_run_dir"] = str(active_run_dir)
    state["current_train_pid"] = active_train_pid
    state.setdefault("decision_state", "continue")
    state.setdefault("decision_reason", "Watcher initialized.")
    state["cleanup_failed"] = bool(cleanup_failed)
    state["poll_sec"] = int(poll_sec)
    state.setdefault("last_updated_at", _now_text())

    runs = list(state.get("runs", []))
    if not any(str(row.get("run_name")) == active_run_name for row in runs):
        runs.append(
            {
                "run_name": active_run_name,
                "run_dir": str(active_run_dir),
                "train_pid": active_train_pid,
                "started_at": _now_text(),
                "source": "attached_existing_run",
            }
        )
    state["runs"] = runs
    _write_json(watch_path, state)
    print(
        json.dumps(
            {
                "event": "watch_attached",
                "run_name": active_run_name,
                "train_pid": active_train_pid,
                "expected_epochs": int(expected_epochs),
                "checkpoint_every": int(checkpoint_every),
            },
            ensure_ascii=False,
        ),
        flush=True,
    )

    milestones = [epoch for epoch in range(checkpoint_every, expected_epochs + 1, checkpoint_every)]
    intermediate_milestones = [epoch for epoch in milestones if int(epoch) < int(expected_epochs)]

    while True:
        state["current_run_name"] = active_run_name
        state["current_run_dir"] = str(active_run_dir)
        state["current_train_pid"] = active_train_pid
        state["train_process_alive"] = _process_alive(active_train_pid)
        state["gpu"] = _query_gpu_status()
        latest_meta = _read_checkpoint_meta(active_run_dir / "latest.pt")
        state["latest_checkpoint"] = latest_meta

        audits = list(state.get("audits", []))
        run_audits = [dict(row) for row in audits if str(row.get("run_name")) == active_run_name]
        audited_keys = {
            (int(row.get("epoch") or 0), int(row.get("episodes") or 0), str(row.get("kind") or "periodic"))
            for row in run_audits
            if str(row.get("status")) == "ok"
        }
        final_audited = False
        switch_triggered = False

        for epoch in intermediate_milestones:
            ckpt_path = _periodic_checkpoint_path(active_run_dir, epoch)
            audit_key = (int(epoch), int(intermediate_eval_episodes), "periodic")
            if audit_key in audited_keys or not ckpt_path.exists():
                continue
            row = _audit_checkpoint_with_retry(
                run_dir=active_run_dir,
                ckpt_path=ckpt_path,
                epoch=epoch,
                kind="periodic",
                episodes=intermediate_eval_episodes,
                seed=eval_seed,
                device=device,
                max_steps=max_steps,
                heartbeat_every=heartbeat_every,
                headless=headless,
                show_progress=show_progress,
                timeout_sec=audit_timeout_sec,
            )
            row["run_name"] = active_run_name
            row["run_dir"] = str(active_run_dir)
            records = _upsert_watch_audit_record(active_run_dir, row)
            _write_json(_audit_status_epoch_path(active_run_dir, epoch, intermediate_eval_episodes), row)
            best_success_path = _refresh_best_success_checkpoint(active_run_dir, records, run_name=active_run_name)
            if best_success_path is not None:
                row["best_success_ckpt_path"] = str(best_success_path)
            audits = [entry for entry in audits if not (
                str(entry.get("run_name")) == active_run_name
                and int(entry.get("epoch") or 0) == int(epoch)
                and int(entry.get("episodes") or 0) == int(intermediate_eval_episodes)
                and str(entry.get("kind") or "periodic") == "periodic"
            )]
            audits.append(row)
            audits.sort(key=lambda item: (str(item.get("run_name")), int(item.get("epoch") or 0), int(item.get("episodes") or 0)))
            state["audits"] = audits
            print(
                json.dumps(
                    {
                        "event": "audit_completed",
                        "run_name": active_run_name,
                        "epoch": int(epoch),
                        "episodes": int(intermediate_eval_episodes),
                        "status": row["status"],
                        "success_rate": row.get("success_rate"),
                        "mean_steps": row.get("mean_steps"),
                    },
                    ensure_ascii=False,
                ),
                flush=True,
            )

            decision = _decide_watch_action(
                records=audits,
                run_name=active_run_name,
                prior_state=state.get("decision_state"),
                max_steps=max_steps,
            )
            state["decision_state"] = decision["decision_state"]
            state["decision_reason"] = decision["decision_reason"]
            state["last_audited_checkpoint"] = {
                "epoch": int(epoch),
                "episodes": int(intermediate_eval_episodes),
                "path": str(ckpt_path),
                "status": row["status"],
                "success_rate": row.get("success_rate"),
            }
            if (
                decision["decision_state"] == "switch"
                and int(state.get("switch_count", 0)) < 1
            ):
                _stop_training_process(active_train_pid)
                switch_run = _launch_obs3_switch_run(
                    config_path=config_path,
                    device=device,
                    ckpt_root=ckpt_root,
                    data_root=data_root,
                    expected_epochs=expected_epochs,
                    checkpoint_every=checkpoint_every,
                    description_suffix=decision["decision_reason"],
                )
                state["switch_count"] = int(state.get("switch_count", 0)) + 1
                state.setdefault("switch_history", []).append(
                    {
                        "from_run_name": active_run_name,
                        "from_run_dir": str(active_run_dir),
                        "from_pid": active_train_pid,
                        "reason": decision["decision_reason"],
                        "switched_at": _now_text(),
                        "to_run_name": switch_run["run_name"],
                        "to_run_dir": switch_run["run_dir"],
                        "to_pid": switch_run["train_pid"],
                    }
                )
                active_run_name = str(switch_run["run_name"])
                active_run_dir = Path(str(switch_run["run_dir"])).expanduser().resolve()
                active_train_pid = int(switch_run["train_pid"])
                state["current_run_name"] = active_run_name
                state["current_run_dir"] = str(active_run_dir)
                state["current_train_pid"] = active_train_pid
                state["decision_state"] = "continue"
                state["decision_reason"] = "Switched to obs3 3-camera baseline after underperforming 5-camera audit."
                state["runs"].append(
                    {
                        "run_name": active_run_name,
                        "run_dir": str(active_run_dir),
                        "train_pid": active_train_pid,
                        "started_at": _now_text(),
                        "source": "watch_auto_switch",
                    }
                )
                print(
                    json.dumps(
                        {
                            "event": "watch_switched",
                            "reason": decision["decision_reason"],
                            "new_run_name": active_run_name,
                            "new_train_pid": active_train_pid,
                        },
                        ensure_ascii=False,
                    ),
                    flush=True,
                )
                switch_triggered = True
                break
            if decision["decision_state"] == "switch":
                state["decision_state"] = "investigate"
                state["decision_reason"] = f"{decision['decision_reason']} Auto-switch already used; continuing to monitor."

        if switch_triggered:
            state["last_updated_at"] = _now_text()
            _write_json(_audit_status_latest_path(root_run_dir), state)
            _write_json(watch_path, state)
            time.sleep(max(1, int(poll_sec)))
            continue

        final_epoch_path = _periodic_checkpoint_path(active_run_dir, expected_epochs)
        final_epoch_key = (int(expected_epochs), int(final_eval_episodes), "periodic")
        if final_epoch_path.exists() and final_epoch_key not in audited_keys:
            final_row = _audit_checkpoint_with_retry(
                run_dir=active_run_dir,
                ckpt_path=final_epoch_path,
                epoch=expected_epochs,
                kind="periodic",
                episodes=final_eval_episodes,
                seed=eval_seed,
                device=device,
                max_steps=max_steps,
                heartbeat_every=heartbeat_every,
                headless=headless,
                show_progress=show_progress,
                timeout_sec=max(int(audit_timeout_sec), 21600),
            )
            final_row["run_name"] = active_run_name
            final_row["run_dir"] = str(active_run_dir)
            _upsert_watch_audit_record(active_run_dir, final_row)
            _write_json(_audit_status_epoch_path(active_run_dir, expected_epochs, final_eval_episodes), final_row)
            audits = [
                entry
                for entry in audits
                if not (
                    str(entry.get("run_name")) == active_run_name
                    and int(entry.get("epoch") or 0) == int(expected_epochs)
                    and int(entry.get("episodes") or 0) == int(final_eval_episodes)
                    and str(entry.get("kind") or "periodic") == "periodic"
                )
            ]
            audits.append(final_row)
            state["audits"] = sorted(
                audits,
                key=lambda item: (str(item.get("run_name")), int(item.get("epoch") or 0), int(item.get("episodes") or 0)),
            )
            final_audited = True
            print(
                json.dumps(
                    {
                        "event": "audit_completed",
                        "run_name": active_run_name,
                        "epoch": int(expected_epochs),
                        "episodes": int(final_eval_episodes),
                        "status": final_row["status"],
                        "success_rate": final_row.get("success_rate"),
                        "kind": "periodic",
                    },
                    ensure_ascii=False,
                ),
                flush=True,
            )

        best_success_path = active_run_dir / "best_success.pt"
        best_success_key = (int(expected_epochs), int(final_eval_episodes), "best_success")
        if best_success_path.exists() and best_success_key not in audited_keys:
            final_best_row = _audit_checkpoint_with_retry(
                run_dir=active_run_dir,
                ckpt_path=best_success_path,
                epoch=expected_epochs,
                kind="best_success",
                episodes=final_eval_episodes,
                seed=eval_seed,
                device=device,
                max_steps=max_steps,
                heartbeat_every=heartbeat_every,
                headless=headless,
                show_progress=show_progress,
                timeout_sec=max(int(audit_timeout_sec), 21600),
            )
            final_best_row["run_name"] = active_run_name
            final_best_row["run_dir"] = str(active_run_dir)
            _upsert_watch_audit_record(active_run_dir, final_best_row)
            audits = [
                entry
                for entry in state.get("audits", [])
                if not (
                    str(entry.get("run_name")) == active_run_name
                    and int(entry.get("epoch") or 0) == int(expected_epochs)
                    and int(entry.get("episodes") or 0) == int(final_eval_episodes)
                    and str(entry.get("kind") or "periodic") == "best_success"
                )
            ]
            audits.append(final_best_row)
            state["audits"] = sorted(
                audits,
                key=lambda item: (str(item.get("run_name")), int(item.get("epoch") or 0), int(item.get("episodes") or 0)),
            )
            final_audited = True
            print(
                json.dumps(
                    {
                        "event": "audit_completed",
                        "run_name": active_run_name,
                        "epoch": int(expected_epochs),
                        "episodes": int(final_eval_episodes),
                        "status": final_best_row["status"],
                        "success_rate": final_best_row.get("success_rate"),
                        "kind": "best_success",
                    },
                    ensure_ascii=False,
                ),
                flush=True,
            )

        current_run_records = _load_watch_audit_payload(active_run_dir).get("records", [])
        current_final_records = [
            dict(row)
            for row in current_run_records
            if str(row.get("status")) == "ok" and int(row.get("episodes") or 0) == int(final_eval_episodes)
        ]
        if current_final_records:
            best_final = max(current_final_records, key=lambda row: float(row.get("success_rate") or -1.0))
            report = {
                "run_name": active_run_name,
                "run_dir": str(active_run_dir),
                "eval_episodes": int(final_eval_episodes),
                "best_record": best_final,
                "records": current_final_records,
                "finished_at": _now_text(),
            }
            _write_json(active_run_dir / "audit_report.json", report)
            state["final_best_record"] = best_final

        next_epoch = next(
            (
                epoch
                for epoch in intermediate_milestones
                if _periodic_checkpoint_path(active_run_dir, epoch).exists()
                is False
            ),
            None,
        )
        state["next_audit_epoch"] = next_epoch if next_epoch is not None else int(expected_epochs)
        state["next_audit_episodes"] = (
            int(intermediate_eval_episodes) if next_epoch is not None else int(final_eval_episodes)
        )
        state["status"] = "running"
        state["last_updated_at"] = _now_text()
        _write_json(_audit_status_latest_path(active_run_dir), state)
        _write_json(watch_path, state)
        print(
            json.dumps(
                {
                    "event": "watch_heartbeat",
                    "run_name": active_run_name,
                    "train_pid": active_train_pid,
                    "completed_epoch": None if latest_meta is None else int(latest_meta["completed_epoch"]),
                    "next_audit_epoch": state["next_audit_epoch"],
                    "decision_state": state["decision_state"],
                    "gpu_used_gb": None if state["gpu"] is None else state["gpu"].get("memory_used_gb"),
                    "gpu_util_pct": None if state["gpu"] is None else state["gpu"].get("utilization_gpu_pct"),
                },
                ensure_ascii=False,
            ),
            flush=True,
        )

        final_periodic_done = any(
            str(row.get("run_name")) == active_run_name
            and int(row.get("epoch") or 0) == int(expected_epochs)
            and int(row.get("episodes") or 0) == int(final_eval_episodes)
            and str(row.get("kind") or "periodic") == "periodic"
            for row in state.get("audits", [])
        )
        if final_periodic_done and (not _process_alive(active_train_pid) or final_audited):
            state["status"] = "finished"
            state["finished_at"] = _now_text()
            _write_json(_audit_status_latest_path(active_run_dir), state)
            _write_json(watch_path, state)
            return state

        time.sleep(max(1, int(poll_sec)))


def run_search_spec(
    spec: SearchSpec,
    *,
    config_path: Path,
    device: str | None,
    headless: bool,
    show_progress: bool,
    cleanup_failed: bool,
    audit_timeout_sec: int,
    ckpt_root: Path | None,
    data_root: Path | None,
) -> dict[str, Any]:
    log_path = _record_dir() / "logs" / f"{spec.name}.log"
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "run_mdit_autoresearch_trial.py"),
        "--phase",
        "full",
        "--config",
        str(config_path),
        "--stage-epochs",
        str(int(spec.stage_epochs)),
        "--checkpoint-every",
        "100",
        "--eval-episodes",
        str(int(spec.eval_episodes)),
        "--experiment-name",
        spec.name,
        "--description",
        spec.description,
        "--audit-timeout-sec",
        str(int(audit_timeout_sec)),
        "--headless" if headless else "--no-headless",
        "--show-progress" if show_progress else "--no-show-progress",
        "--cleanup-failed" if cleanup_failed else "--no-cleanup-failed",
    ]
    if device:
        cmd.extend(["--device", device])
    if ckpt_root is not None:
        cmd.extend(["--ckpt-root", str(ckpt_root)])
    if data_root is not None:
        cmd.extend(["--data-root", str(data_root)])
    for key, value in spec.overrides.items():
        cmd.extend(["--set", f"{key}={json.dumps(value)}"])

    with log_path.open("w", encoding="utf-8") as handle:
        completed = subprocess.run(cmd, cwd=PROJECT_ROOT, stdout=handle, stderr=subprocess.STDOUT, text=True)
    if completed.returncode != 0:
        raise RuntimeError(f"Trial {spec.name} failed. See {log_path}")
    result = _read_last_json_line(log_path)
    result["stage_epochs"] = int(spec.stage_epochs)
    result["eval_episodes"] = int(spec.eval_episodes)
    result["overrides"] = dict(spec.overrides)
    result["log_path"] = str(log_path)
    return result


def run_mdit_autoresearch_loop(
    *,
    tag: str,
    config_path: Path,
    baseline_run_dir: Path | None = None,
    wait_for_baseline: bool = False,
    device: str | None = None,
    headless: bool = True,
    show_progress: bool = True,
    cleanup_failed: bool = True,
    audit_timeout_sec: int = 7200,
    ckpt_root: Path | None = None,
    data_root: Path | None = None,
) -> dict[str, Any]:
    summary_path = _loop_summary_path(tag)
    if summary_path.exists():
        summary = _load_json(summary_path)
        summary["tag"] = tag
        summary["config_path"] = str(config_path)
        summary.setdefault("started_at", time.strftime("%Y-%m-%d %H:%M:%S"))
        summary["resumed_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
        summary.setdefault("baseline", None)
        summary.setdefault("candidates", [])
        summary.setdefault("promoted", [])
        summary.setdefault("mid_runs", [])
        summary.setdefault("deep_runs", [])
        summary.setdefault("winner", None)
    else:
        summary = {
            "tag": tag,
            "started_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "config_path": str(config_path),
            "baseline": None,
            "candidates": [],
            "promoted": [],
            "mid_runs": [],
            "deep_runs": [],
            "winner": None,
        }
    _write_json(summary_path, summary)

    if baseline_run_dir is not None:
        baseline_result = wait_for_existing_result(
            run_dir=baseline_run_dir.expanduser().resolve(),
            poll_sec=60,
            timeout_sec=None if wait_for_baseline else 1,
        )
        baseline_result["stage_epochs"] = 100
        baseline_result["eval_episodes"] = 20
        baseline_result["overrides"] = {}
        baseline_result["log_path"] = None
    elif summary.get("baseline") is not None:
        baseline_result = dict(summary["baseline"])
    else:
        baseline_result = run_search_spec(
            DEFAULT_BASELINE,
            config_path=config_path,
            device=device,
            headless=headless,
            show_progress=show_progress,
            cleanup_failed=cleanup_failed,
            audit_timeout_sec=audit_timeout_sec,
            ckpt_root=ckpt_root,
            data_root=data_root,
        )
    summary["baseline"] = baseline_result
    _write_json(summary_path, summary)

    candidate_results: list[dict[str, Any]] = []
    for spec in DEFAULT_CANDIDATES:
        existing_result = _find_existing_result(
            summary.get("candidates"),
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        )
        if existing_result is None:
            existing_result = _find_existing_trial_record(
                experiment_name=spec.name,
                stage_epochs=spec.stage_epochs,
                eval_episodes=spec.eval_episodes,
            )
        if existing_result is not None:
            result = dict(existing_result)
        else:
            result = run_search_spec(
                spec,
                config_path=config_path,
                device=device,
                headless=headless,
                show_progress=show_progress,
                cleanup_failed=cleanup_failed,
                audit_timeout_sec=audit_timeout_sec,
                ckpt_root=ckpt_root,
                data_root=data_root,
            )
        candidate_results.append(result)
        summary["candidates"] = candidate_results
        _write_json(summary_path, summary)

    screening_results = [baseline_result, *candidate_results]
    gate_100_pass = [
        row
        for row in screening_results
        if row.get("success_20") is not None and float(row["success_20"]) >= 0.45
    ]
    promoted = _choose_top_specs(gate_100_pass, limit=2) if gate_100_pass else []
    summary["promoted"] = promoted
    _write_json(summary_path, summary)

    mid_results: list[dict[str, Any]] = []
    for row in promoted:
        spec = SearchSpec(
            name=f"{row['experiment_name']}_mid300",
            stage_epochs=300,
            eval_episodes=20,
            description=f"300-epoch gate run from {row['experiment_name']}",
            overrides=dict(row.get("overrides", {})),
        )
        existing_result = _find_existing_result(
            summary.get("mid_runs"),
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        )
        if existing_result is None:
            existing_result = _find_existing_trial_record(
                experiment_name=spec.name,
                stage_epochs=spec.stage_epochs,
                eval_episodes=spec.eval_episodes,
            )
        if existing_result is not None:
            result = dict(existing_result)
        else:
            result = run_search_spec(
                spec,
                config_path=config_path,
                device=device,
                headless=headless,
                show_progress=show_progress,
                cleanup_failed=cleanup_failed,
                audit_timeout_sec=max(int(audit_timeout_sec), 10800),
                ckpt_root=ckpt_root,
                data_root=data_root,
            )
        mid_results.append(result)
        summary["mid_runs"] = mid_results
        _write_json(summary_path, summary)

    deep_seeds = [
        row for row in mid_results if row.get("success_20") is not None and float(row["success_20"]) >= 0.55
    ]
    deep_results: list[dict[str, Any]] = []
    for row in deep_seeds:
        spec = SearchSpec(
            name=f"{row['experiment_name']}_deep500",
            stage_epochs=500,
            eval_episodes=20,
            description=f"500-epoch gate run from {row['experiment_name']}",
            overrides=dict(row.get("overrides", {})),
        )
        existing_result = _find_existing_result(
            summary.get("deep_runs"),
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        )
        if existing_result is None:
            existing_result = _find_existing_trial_record(
                experiment_name=spec.name,
                stage_epochs=spec.stage_epochs,
                eval_episodes=spec.eval_episodes,
            )
        if existing_result is not None:
            result = dict(existing_result)
        else:
            result = run_search_spec(
                spec,
                config_path=config_path,
                device=device,
                headless=headless,
                show_progress=show_progress,
                cleanup_failed=cleanup_failed,
                audit_timeout_sec=max(int(audit_timeout_sec), 21600),
                ckpt_root=ckpt_root,
                data_root=data_root,
            )
        deep_results.append(result)
        summary["deep_runs"] = deep_results
        best_so_far = max(deep_results, key=_score_key)
        summary["winner"] = best_so_far
        _write_json(summary_path, summary)

    if deep_results:
        summary["winner"] = max(deep_results, key=_score_key)
    elif mid_results:
        summary["winner"] = max(mid_results, key=_score_key)
    elif candidate_results:
        summary["winner"] = max(screening_results, key=_score_key)
    else:
        summary["winner"] = baseline_result
    summary["finished_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
    _write_json(summary_path, summary)
    return summary
