from __future__ import annotations

import argparse
import json
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def _timestamp() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def _safe_remove(path: Path, parent: Path) -> None:
    try:
        path.absolute().relative_to(parent.resolve())
    except Exception as exc:
        raise ValueError(f"Refusing to remove path outside parent: {path}") from exc
    if not path.exists() and not path.is_symlink():
        return
    if path.is_symlink() or path.is_file():
        path.unlink()
    else:
        shutil.rmtree(path)


def _link_or_copy(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        dst.unlink()
    try:
        os.link(src, dst)
    except OSError:
        shutil.copy2(src, dst)


def _repair_mdit_best(anchor_dir: Path, ckpt_root: Path) -> None:
    alias_path = ckpt_root / "mdit_best"
    alias_json = ckpt_root / "mdit_best.json"
    if alias_path.exists() or alias_path.is_symlink():
        _safe_remove(alias_path, ckpt_root)
    alias_path.symlink_to(anchor_dir, target_is_directory=True)
    _write_json(
        alias_json,
        {
            "updated_at": _timestamp(),
            "artifact_role": "deployable_ckpt_anchor",
            "run_dir": str(anchor_dir),
            "best_ckpt_path": str(anchor_dir / "best_success.pt"),
            "best_success_rate": 0.55,
            "best_success_epoch": 100,
            "note": "当前可用的实际 MDIT ckpt 锚点；0.75 结果仅保留为方法参考线。",
        },
    )


def _build_reference_recipe(
    *,
    anchor_manifest: dict[str, Any],
    source_record: dict[str, Any],
    source_record_path: Path,
) -> dict[str, Any]:
    base_config = dict(anchor_manifest.get("base_config") or {})
    resolved_config = dict(anchor_manifest.get("resolved_config") or {})
    # 这里固化的是“0.75 方法线”，不是伪造原始 checkpoint。
    # 因此只把真正有证据的 recipe 与训练日程抽出来保存。
    reference_config = dict(resolved_config)
    reference_config["train_epochs"] = 500
    reference_config["checkpoint_every_epochs"] = 100
    reference_config["run_name"] = "mdit_reference_line_lane_a_mainline_500"

    return {
        "updated_at": _timestamp(),
        "artifact_role": "reference_method_line",
        "line": "mdit",
        "lane": "lane_a_mainline",
        "reference_label": "0.75@300/500 RGB+text mainline",
        "checkpoint_status": "missing_original_ckpt",
        "base_config_path": anchor_manifest.get("base_config_path"),
        "base_config": base_config,
        "resolved_config_100_anchor": resolved_config,
        "reference_config_500_recipe": reference_config,
        "source_record_path": str(source_record_path),
        "source_run_name": source_record.get("run_name"),
        "source_run_dir": source_record.get("run_dir"),
        "success_300": source_record.get("success_300"),
        "success_500": source_record.get("success_500"),
        "best_success_rate": source_record.get("best_success_rate"),
        "best_success_epoch": source_record.get("best_success_epoch"),
        "trial_score": source_record.get("trial_score"),
        "collapse_detected": source_record.get("collapse_detected"),
        "collapse_reasons": source_record.get("collapse_reasons"),
    }


def _write_reference_readme(
    path: Path,
    *,
    source_record: dict[str, Any],
    anchor_dir: Path,
) -> None:
    text = f"""# MDIT Reference Line

这不是一份可直接部署的冠军 ckpt，而是一份稳定保存下来的 `0.75@300/500` 方法参考线。

## 角色

- 参考线类型：`reference_method_line`
- 线路：`lane_a_mainline`
- 任务：`unplug_charger`
- 证据来源：`{source_record.get('run_name')}`

## 已确认结果

- `success@epoch_0300 = {source_record.get('success_300')}`
- `success@epoch_0500 = {source_record.get('success_500')}`
- `best_success_rate = {source_record.get('best_success_rate')}`
- `best_success_epoch = {source_record.get('best_success_epoch')}`

## 重要说明

- 原始 `0.75` 长训 ckpt 目录已经因历史清理漏洞丢失。
- 这里固化的是“方法和证据”，不是原始 `epoch_0300.pt / epoch_0500.pt` 权重本体。
- 当前仍可直接使用的实际 ckpt 锚点在：`{anchor_dir}`

## 推荐用途

- 作为后续 MDIT 复训的参考 recipe
- 作为 autoresearch 的 incumbent 方法线
- 作为复盘 `0.55@100 -> 0.75@300/500` 提升路径的稳定证据
"""
    path.write_text(text, encoding="utf-8")


def build_reference_line(
    *,
    source_record_path: Path,
    anchor_dir: Path,
    output_dir: Path,
) -> None:
    source_record = _load_json(source_record_path)
    anchor_manifest = _load_json(anchor_dir / "experiment_manifest.json")

    if output_dir.exists():
        _safe_remove(output_dir, output_dir.parent)
    output_dir.mkdir(parents=True, exist_ok=True)

    reference_recipe = _build_reference_recipe(
        anchor_manifest=anchor_manifest,
        source_record=source_record,
        source_record_path=source_record_path,
    )
    _write_json(output_dir / "reference_line.json", reference_recipe)
    _write_json(output_dir / "reference_audit_report.json", source_record.get("audit_report") or {})
    _write_json(
        output_dir / "reference_sources.json",
        {
            "updated_at": _timestamp(),
            "source_record_path": str(source_record_path),
            "actual_ckpt_anchor_dir": str(anchor_dir),
            "actual_ckpt_anchor_best": str(anchor_dir / "best_success.pt"),
            "actual_ckpt_anchor_audit": str(anchor_dir / "audit_report.json"),
        },
    )
    if (anchor_dir / "trial_request.json").exists():
        _link_or_copy(anchor_dir / "trial_request.json", output_dir / "anchor_trial_request.json")
    if (anchor_dir / "experiment_manifest.json").exists():
        _link_or_copy(anchor_dir / "experiment_manifest.json", output_dir / "anchor_experiment_manifest.json")
    if (anchor_dir / "config.json").exists():
        _link_or_copy(anchor_dir / "config.json", output_dir / "anchor_config.json")
    _write_reference_readme(output_dir / "README.md", source_record=source_record, anchor_dir=anchor_dir)

    _write_json(
        output_dir.parent / "mdit_reference_line.json",
        {
            "updated_at": _timestamp(),
            "artifact_role": "reference_method_line",
            "reference_dir": str(output_dir),
            "source_record_path": str(source_record_path),
            "best_success_rate": source_record.get("best_success_rate"),
            "best_success_epoch": source_record.get("best_success_epoch"),
            "actual_ckpt_anchor_dir": str(anchor_dir),
        },
    )


SOURCE_RECORD_PATH = PROJECT_ROOT / "autoresearch_records" / (
    "unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__"
    "e0500__20260418_005723.json"
)
ANCHOR_DIR = PROJECT_ROOT / "autoresearch_records" / "frozen_best" / "current_provisional_best"
CKPT_ROOT = PROJECT_ROOT / "ckpt"
REFERENCE_DIR = CKPT_ROOT / "mdit_reference_line"


def main() -> int:
    parser = argparse.ArgumentParser(description="固化 MDIT 参考线与可用 ckpt 锚点")
    parser.add_argument("--source-record", type=Path, default=SOURCE_RECORD_PATH)
    parser.add_argument("--anchor-dir", type=Path, default=ANCHOR_DIR)
    parser.add_argument("--output-dir", type=Path, default=REFERENCE_DIR)
    args = parser.parse_args()

    source_record_path = args.source_record.expanduser().resolve()
    anchor_dir = args.anchor_dir.expanduser().resolve()
    output_dir = args.output_dir.expanduser().resolve()

    if not source_record_path.exists():
        raise FileNotFoundError(f"source record not found: {source_record_path}")
    if not anchor_dir.exists():
        raise FileNotFoundError(f"anchor dir not found: {anchor_dir}")

    build_reference_line(
        source_record_path=source_record_path,
        anchor_dir=anchor_dir,
        output_dir=output_dir,
    )
    _repair_mdit_best(anchor_dir, CKPT_ROOT)
    print(f"mdit_best repaired -> {anchor_dir}")
    print(f"mdit_reference_line created -> {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
