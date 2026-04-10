from __future__ import annotations

from dataclasses import asdict, dataclass
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

from common.runtime import PROJECT_ROOT


@dataclass(slots=True)
class SearchSpec:
    name: str
    stage_epochs: int
    eval_episodes: int
    description: str
    overrides: dict[str, Any]


DEFAULT_BASELINE = SearchSpec(
    name="mdit_faithful_baseline_100",
    stage_epochs=100,
    eval_episodes=20,
    description="faithful baseline",
    overrides={},
)

DEFAULT_CANDIDATES: tuple[SearchSpec, ...] = (
    SearchSpec(
        name="cam_front_wrist_100",
        stage_epochs=100,
        eval_episodes=20,
        description="2-camera subset front+wrist",
        overrides={"camera_names": ["front", "wrist"]},
    ),
    SearchSpec(
        name="cam_all5_100",
        stage_epochs=100,
        eval_episodes=20,
        description="all available cameras",
        overrides={"camera_names": ["front", "left_shoulder", "right_shoulder", "wrist", "overhead"]},
    ),
    SearchSpec(
        name="obs3_100",
        stage_epochs=100,
        eval_episodes=20,
        description="increase observation steps to 3",
        overrides={"n_obs_steps": 3},
    ),
    SearchSpec(
        name="dropout0_100",
        stage_epochs=100,
        eval_episodes=20,
        description="remove transformer dropout",
        overrides={"transformer.dropout": 0.0},
    ),
    SearchSpec(
        name="layers8_100",
        stage_epochs=100,
        eval_episodes=20,
        description="deeper transformer",
        overrides={"transformer.num_layers": 8},
    ),
    SearchSpec(
        name="rope_100",
        stage_epochs=100,
        eval_episodes=20,
        description="enable rotary position encoding",
        overrides={"transformer.use_rope": True},
    ),
    SearchSpec(
        name="uniform_t_100",
        stage_epochs=100,
        eval_episodes=20,
        description="uniform timestep sampling",
        overrides={"objective.timestep_sampling.strategy_name": "uniform"},
    ),
    SearchSpec(
        name="vision_last_block_100",
        stage_epochs=100,
        eval_episodes=20,
        description="unfreeze last vision block",
        overrides={"observation_encoder.vision.train_mode": "last_block"},
    ),
)


def _record_dir() -> Path:
    path = PROJECT_ROOT / "autoresearch_records"
    path.mkdir(parents=True, exist_ok=True)
    (path / "logs").mkdir(parents=True, exist_ok=True)
    return path


def _loop_summary_path(tag: str) -> Path:
    return _record_dir() / f"mdit_autoresearch_loop_{tag}.json"


def _trial_record_path(run_name: str) -> Path:
    return _record_dir() / f"{run_name}.json"


def _write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


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
        if int(payload.get("stage_epochs", 0)) != int(stage_epochs):
            continue
        if int(payload.get("eval_episodes", 0)) != int(eval_episodes):
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
                "best_ckpt_path": None if best_record is None else str(run_dir / "best_success.pt"),
                "best_success_rate": None if best_record is None else float(best_record["success_rate"]),
                "best_success_epoch": None if best_record is None else int(best_record.get("epoch") or 0),
                "run_name": run_dir.name,
                "run_dir": str(run_dir),
                "audit_report_path": str(audit_report_path),
            }
        if deadline is not None and time.monotonic() > deadline:
            raise TimeoutError(f"Timed out waiting for finished trial result in {run_dir}")
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

    promoted = _choose_top_specs(candidate_results, limit=2)
    summary["promoted"] = promoted
    _write_json(summary_path, summary)

    deep_results: list[dict[str, Any]] = []
    for row in promoted:
        spec = SearchSpec(
            name=f"{row['experiment_name']}_deep500",
            stage_epochs=500,
            eval_episodes=100,
            description=f"deep run from {row['experiment_name']}",
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
    elif candidate_results:
        summary["winner"] = max(candidate_results, key=_score_key)
    else:
        summary["winner"] = baseline_result
    summary["finished_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
    _write_json(summary_path, summary)
    return summary
