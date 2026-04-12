from __future__ import annotations

from dataclasses import dataclass
import json
import time
from pathlib import Path
from typing import Any

from common.runtime import PROJECT_ROOT
from research.lelan_trial_runner import LeLaNTrialRequest, run_lelan_autoresearch_trial


@dataclass(slots=True)
class SearchSpec:
    name: str
    stage_epochs: int
    eval_episodes: int
    description: str
    overrides: dict[str, Any]


DEFAULT_BASELINE = SearchSpec(
    name="rgb5_obs3_a8_lr2e5_100",
    stage_epochs=100,
    eval_episodes=20,
    description="LeLaN baseline: 5RGB + obs3 + n_action_steps=8 + smooth_actions",
    overrides={
        "camera_names": ["right_shoulder", "left_shoulder", "overhead", "front", "wrist"],
        "n_obs_steps": 3,
        "horizon": 32,
        "n_action_steps": 8,
        "use_amp": True,
        "objective.sigma_min": 0.001,
        "objective.num_integration_steps": 25,
        "smooth_actions": True,
        "command_mode": "first",
        "position_alpha": 0.35,
        "rotation_alpha": 0.25,
        "max_position_step": 0.03,
        "gripper_open_threshold": 0.6,
        "gripper_close_threshold": 0.4,
    },
)

DEFAULT_CANDIDATES: tuple[SearchSpec, ...] = (
    SearchSpec(
        name="rgb5_obs3_a8_lr1p5e5_100",
        stage_epochs=100,
        eval_episodes=20,
        description="LeLaN lower-lr baseline",
        overrides={
            **DEFAULT_BASELINE.overrides,
            "optimizer_lr": 1.5e-5,
        },
    ),
    SearchSpec(
        name="rgb5_obs3_a8_fusion_dropout0_100",
        stage_epochs=100,
        eval_episodes=20,
        description="LeLaN baseline with fusion dropout=0.0",
        overrides={
            **DEFAULT_BASELINE.overrides,
            "fusion_transformer.dropout": 0.0,
        },
    ),
)


def _record_dir() -> Path:
    path = PROJECT_ROOT / "autoresearch_records"
    path.mkdir(parents=True, exist_ok=True)
    (path / "logs").mkdir(parents=True, exist_ok=True)
    return path


def _loop_summary_path(tag: str) -> Path:
    return _record_dir() / f"lelan_autoresearch_loop_{tag}.json"


def _write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _find_existing_trial_record(
    *,
    experiment_name: str,
    stage_epochs: int,
    eval_episodes: int,
) -> dict[str, Any] | None:
    candidates: list[tuple[float, Path]] = []
    for path in _record_dir().glob("*.json"):
        if path.name.startswith("lelan_autoresearch_loop_"):
            continue
        try:
            payload = _load_json(path)
        except Exception:
            continue
        if str(payload.get("line")) != "lelan":
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


def _persist_loop_summary(path: Path, payload: dict[str, Any]) -> dict[str, Any]:
    _write_json(path, payload)
    return payload


def _score(result: dict[str, Any]) -> float:
    try:
        return float(result.get("trial_score") or -1.0)
    except Exception:
        return -1.0


def _promote_spec(spec: SearchSpec, *, stage_epochs: int) -> SearchSpec:
    eval_episodes = 20 if int(stage_epochs) < 500 else 100
    suffix = "300" if int(stage_epochs) == 300 else "500"
    return SearchSpec(
        name=f"{spec.name.rsplit('_', 1)[0]}_{suffix}",
        stage_epochs=int(stage_epochs),
        eval_episodes=eval_episodes,
        description=f"{spec.description} promoted to {stage_epochs} epochs",
        overrides=dict(spec.overrides),
    )


def _run_search_spec(
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
    request = LeLaNTrialRequest(
        config_path=config_path,
        stage_epochs=spec.stage_epochs,
        checkpoint_every=100,
        eval_episodes=spec.eval_episodes,
        device=device,
        ckpt_root=ckpt_root,
        data_root=data_root,
        experiment_name=spec.name,
        description=spec.description,
        headless=headless,
        show_progress=show_progress,
        cleanup_failed=cleanup_failed,
        audit_timeout_sec=audit_timeout_sec,
        config_overrides=dict(spec.overrides),
    )
    result = run_lelan_autoresearch_trial(request, log_results=True)
    result["stage_epochs"] = int(spec.stage_epochs)
    result["eval_episodes"] = int(spec.eval_episodes)
    result["overrides"] = dict(spec.overrides)
    return result


def _passed_gate(result: dict[str, Any], threshold: float) -> bool:
    success_20 = result.get("success_20")
    if success_20 is None:
        return False
    try:
        return float(success_20) >= float(threshold)
    except Exception:
        return False


def run_lelan_autoresearch_loop(
    *,
    tag: str,
    config_path: Path,
    device: str | None,
    headless: bool,
    show_progress: bool,
    cleanup_failed: bool,
    audit_timeout_sec: int,
    ckpt_root: Path | None,
    data_root: Path | None,
) -> dict[str, Any]:
    summary_path = _loop_summary_path(tag)
    if summary_path.exists():
        summary = _load_json(summary_path)
    else:
        summary = {
            "tag": tag,
            "started_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "line": "lelan",
            "config_path": str(config_path),
            "screening": [],
            "promoted_300": [],
            "deep_runs_500": [],
            "winner": None,
        }

    screening_specs = (DEFAULT_BASELINE, *DEFAULT_CANDIDATES)
    screening_results = list(summary.get("screening") or [])
    for spec in screening_specs:
        existing = _find_existing_result(
            screening_results,
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        ) or _find_existing_trial_record(
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        )
        if existing is None:
            existing = _run_search_spec(
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
        screening_results = [
            row for row in screening_results if str(row.get("experiment_name")) != str(spec.name)
        ]
        screening_results.append(existing)
        screening_results.sort(key=lambda row: str(row.get("experiment_name")))
        summary["screening"] = screening_results
        _persist_loop_summary(summary_path, summary)

    screening_by_name = {str(row.get("experiment_name")): row for row in screening_results}
    promoted_specs = [
        _promote_spec(spec, stage_epochs=300)
        for spec in screening_specs
        if _passed_gate(screening_by_name.get(spec.name, {}), 0.45)
    ]
    promoted_results = list(summary.get("promoted_300") or [])
    for spec in promoted_specs:
        existing = _find_existing_result(
            promoted_results,
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        ) or _find_existing_trial_record(
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        )
        if existing is None:
            existing = _run_search_spec(
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
        promoted_results = [
            row for row in promoted_results if str(row.get("experiment_name")) != str(spec.name)
        ]
        promoted_results.append(existing)
        promoted_results.sort(key=lambda row: str(row.get("experiment_name")))
        summary["promoted_300"] = promoted_results
        _persist_loop_summary(summary_path, summary)

    original_specs = {spec.name: spec for spec in screening_specs}
    deep_specs: list[SearchSpec] = []
    for result in promoted_results:
        if not _passed_gate(result, 0.55):
            continue
        experiment_name = str(result.get("experiment_name", ""))
        original_name = f"{experiment_name.rsplit('_', 1)[0]}_100"
        original_spec = original_specs.get(original_name)
        if original_spec is None:
            continue
        deep_specs.append(_promote_spec(original_spec, stage_epochs=500))
    deep_results = list(summary.get("deep_runs_500") or [])
    for spec in deep_specs:
        existing = _find_existing_result(
            deep_results,
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        ) or _find_existing_trial_record(
            experiment_name=spec.name,
            stage_epochs=spec.stage_epochs,
            eval_episodes=spec.eval_episodes,
        )
        if existing is None:
            existing = _run_search_spec(
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
        deep_results = [
            row for row in deep_results if str(row.get("experiment_name")) != str(spec.name)
        ]
        deep_results.append(existing)
        deep_results.sort(key=lambda row: str(row.get("experiment_name")))
        summary["deep_runs_500"] = deep_results
        _persist_loop_summary(summary_path, summary)

    final_pool = list(deep_results or promoted_results or screening_results)
    summary["winner"] = max(final_pool, key=_score) if final_pool else None
    summary["finished_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
    _persist_loop_summary(summary_path, summary)
    return summary
