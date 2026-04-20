from __future__ import annotations

import argparse
import json
from pathlib import Path
import shutil
import sys
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from research.archive_writer import (
    archive_directory_as_milestone,
    archive_document_record,
    build_task_index,
    default_source_docs,
    ensure_task_media_layout,
    infer_task_id,
    read_json,
    solidify_run_archive,
    write_migration_report,
    write_task_index,
)

DOCS_ROOT = REPO_ROOT / "docs"
RECORD_ROOT = REPO_ROOT / "autoresearch_records"
HOMEPAGE_MEDIA_ROOT = REPO_ROOT / "homepage" / "media"

def _record_task_id(record_path: Path) -> str:
    payload = read_json(record_path)
    merged = " ".join(
        str(value)
        for value in (
            payload.get("line"),
            payload.get("experiment_name"),
            payload.get("run_name"),
            payload.get("description"),
            record_path.name,
        )
        if value is not None
    ).lower()
    if any(token in merged for token in ("vram_probe", "loop_state", "takeover_state", "dummy_smoke", "smoke_")):
        return "infra"
    if "unplug_charger_mdit" in merged or "lane_a" in merged or "lane_b" in merged or "lane_c" in merged:
        return "mdit"
    if "pdit" in merged or "baseline" in merged or "h1_" in merged or "h2_" in merged:
        return "pdit"
    if "lelan" in merged:
        return "lelan"
    if "mdit" in merged or "lane_" in merged:
        return "mdit"
    return infer_task_id(
        payload.get("line"),
        payload.get("experiment_name"),
        payload.get("run_name"),
        payload.get("description"),
        record_path.name,
    )


def _migrate_record(record_path: Path, *, dry_run: bool) -> dict[str, Any]:
    task_id = _record_task_id(record_path)
    result = solidify_run_archive(
        task_id=task_id,
        trial_record_path=record_path,
        source_docs=default_source_docs(task_id),
        event_type="migration",
        bucket="records" if task_id == "infra" else "runs",
        dry_run=dry_run,
    )
    return {
        "kind": "run",
        "task_id": task_id,
        "source": str(record_path),
        "archive_root": result["archive_root"],
        "status": result["status"],
        "missing_items": result["missing_items"],
    }


def _migrate_infra_doc(source_doc: Path, *, dry_run: bool) -> dict[str, Any]:
    result = archive_document_record(
        task_id="infra",
        source_doc=source_doc,
        record_name=source_doc.stem,
        metadata={"category": "infra_doc"},
        event_type="migration",
        dry_run=dry_run,
    )
    return {
        "kind": "record",
        "task_id": "infra",
        "source": str(source_doc),
        "archive_root": result["archive_root"],
        "status": "complete",
    }


def _has_real_media_files(media_dir: Path) -> bool:
    for file_path in media_dir.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.name == ".gitkeep":
            continue
        return True
    return False


def _migrate_homepage_media(media_dir: Path, *, dry_run: bool) -> dict[str, Any]:
    result = archive_document_record(
        task_id="infra",
        source_doc=HOMEPAGE_MEDIA_ROOT / "README.md",
        record_name=f"homepage_media__{media_dir.name}",
        extra_paths=[media_dir],
        metadata={"category": "homepage_media", "media_task": media_dir.name},
        event_type="migration",
        dry_run=dry_run,
    )
    _promote_homepage_media_to_task_media(media_dir, dry_run=dry_run)
    return {
        "kind": "record",
        "task_id": "infra",
        "source": str(media_dir),
        "archive_root": result["archive_root"],
        "status": "complete",
    }


def _promote_homepage_media_to_task_media(media_dir: Path, *, dry_run: bool) -> None:
    task_media = ensure_task_media_layout("infra", create=not dry_run)
    subdir_name = media_dir.name
    path_pairs = (
        (media_dir / "images", task_media.demo_images_dir / subdir_name),
        (media_dir / "videos", task_media.demo_videos_dir / subdir_name),
    )
    for source_root, target_root in path_pairs:
        if not source_root.exists():
            continue
        for file_path in sorted(source_root.rglob("*")):
            if not file_path.is_file() or file_path.name.startswith("."):
                continue
            target_path = target_root / file_path.relative_to(source_root)
            if dry_run:
                continue
            target_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file_path.resolve(), target_path)

    captions_path = media_dir / "captions.json"
    if captions_path.exists() and not dry_run:
        task_captions_path = task_media.root / "captions.json"
        payload = json.loads(task_captions_path.read_text(encoding="utf-8")) if task_captions_path.exists() else {}
        source_payload = json.loads(captions_path.read_text(encoding="utf-8"))
        for key, value in source_payload.items():
            if key.startswith("images/"):
                payload[f"demo/images/{subdir_name}/{key.removeprefix('images/')}"] = value
            elif key.startswith("videos/"):
                payload[f"demo/videos/{subdir_name}/{key.removeprefix('videos/')}"] = value
        task_captions_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def _migrate_snapshot(snapshot_dir: Path, *, dry_run: bool) -> dict[str, Any]:
    result = archive_directory_as_milestone(
        task_id="mdit",
        source_dir=snapshot_dir,
        milestone_name=snapshot_dir.name,
        metadata={"category": "frozen_best_snapshot"},
        source_docs=[DOCS_ROOT / "mdit" / "best_path.md", DOCS_ROOT / "research_desk.md"],
        event_type="migration",
        dry_run=dry_run,
    )
    return {
        "kind": "milestone",
        "task_id": "mdit",
        "source": str(snapshot_dir),
        "archive_root": result["archive_root"],
        "status": "complete",
    }


def _migrate_reference_line(reference_dir: Path, *, dry_run: bool) -> dict[str, Any]:
    result = archive_directory_as_milestone(
        task_id="mdit",
        source_dir=reference_dir,
        milestone_name=reference_dir.name,
        metadata={"category": "reference_line"},
        source_docs=[DOCS_ROOT / "mdit" / "best_path.md", DOCS_ROOT / "research_desk.md"],
        event_type="migration",
        dry_run=dry_run,
    )
    return {
        "kind": "milestone",
        "task_id": "mdit",
        "source": str(reference_dir),
        "archive_root": result["archive_root"],
        "status": "complete",
    }


def run_migration(*, dry_run: bool) -> dict[str, Any]:
    entries: list[dict[str, Any]] = []

    for record_path in sorted(RECORD_ROOT.glob("*.json")):
        entries.append(_migrate_record(record_path, dry_run=dry_run))

    for snapshot_dir in sorted(path for path in (RECORD_ROOT / "frozen_best").glob("*") if path.is_dir()):
        entries.append(_migrate_snapshot(snapshot_dir, dry_run=dry_run))

    reference_dir = REPO_ROOT / "ckpt" / "mdit_reference_line"
    if reference_dir.exists():
        entries.append(_migrate_reference_line(reference_dir, dry_run=dry_run))

    infra_docs = [
        DOCS_ROOT / "research_desk.md",
        DOCS_ROOT / "fixes.md",
        DOCS_ROOT / "code-structure.md",
        DOCS_ROOT / "code-structure-zh.md",
        DOCS_ROOT / "job" / "pdit_job_packaging.md",
    ]
    for source_doc in infra_docs:
        if source_doc.exists():
            entries.append(_migrate_infra_doc(source_doc, dry_run=dry_run))

    media_tasks_root = HOMEPAGE_MEDIA_ROOT / "tasks"
    if media_tasks_root.exists():
        for media_dir in sorted(path for path in media_tasks_root.iterdir() if path.is_dir()):
            if _has_real_media_files(media_dir):
                entries.append(_migrate_homepage_media(media_dir, dry_run=dry_run))

    payload = {
        "schema_version": 1,
        "dry_run": dry_run,
        "entry_count": len(entries),
        "entries": entries,
    }
    if not dry_run:
        write_task_index()
        write_migration_report(entries, dry_run=False)
        payload["task_index"] = build_task_index()
    return payload


def main() -> int:
    parser = argparse.ArgumentParser(description="迁移现有训练证据到 research_archive。")
    parser.add_argument("--dry-run", action="store_true", help="只打印拟迁移结果，不真正写入 archive。")
    args = parser.parse_args()
    payload = run_migration(dry_run=bool(args.dry_run))
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
