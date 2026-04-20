from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from research.archive_writer import TASKS_ROOT, load_archive_layout, render_report_assets_for_layout, write_task_index


def _target_roots(task_id: str | None, bucket: str | None, slug: str | None) -> list[Path]:
    if task_id is not None and bucket is not None and slug is not None:
        return [TASKS_ROOT / task_id / bucket / slug]
    roots: list[Path] = []
    task_dirs = [TASKS_ROOT / task_id] if task_id is not None else [path for path in TASKS_ROOT.iterdir() if path.is_dir()]
    for task_dir in task_dirs:
        bucket_names = [bucket] if bucket is not None else ["runs", "milestones", "records"]
        for bucket_name in bucket_names:
            bucket_root = task_dir / bucket_name
            if not bucket_root.exists():
                continue
            roots.extend(path for path in bucket_root.iterdir() if path.is_dir())
    return sorted(roots)


def main() -> int:
    parser = argparse.ArgumentParser(description="为 research_archive 补 report 级静态图。")
    parser.add_argument("--task-id", choices=("pdit", "mdit", "lelan", "infra"))
    parser.add_argument("--bucket", choices=("runs", "milestones", "records"))
    parser.add_argument("--slug")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    entries = []
    for root in _target_roots(args.task_id, args.bucket, args.slug):
        layout = load_archive_layout(root)
        assets = render_report_assets_for_layout(layout, dry_run=bool(args.dry_run))
        entries.append({"archive_root": str(root), "assets": assets})
    if not args.dry_run:
        write_task_index()
    print(json.dumps({"entries": entries}, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
