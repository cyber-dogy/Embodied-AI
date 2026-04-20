from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from research.archive_writer import (
    archive_document_record,
    infer_task_id,
    read_json_if_exists,
    solidify_run_archive,
    write_task_index,
)


def main() -> int:
    parser = argparse.ArgumentParser(description="固化单条 run 或文档到 research_archive。")
    parser.add_argument("--task-id", choices=("pdit", "mdit", "lelan", "infra"), help="显式指定任务线。")
    parser.add_argument("--run-dir", type=Path, help="run_dir 路径。")
    parser.add_argument("--trial-record", type=Path, help="autoresearch_records 下的记录文件。")
    parser.add_argument("--source-doc", action="append", type=Path, default=[], help="附带复制到 notes 的文档。")
    parser.add_argument("--extra-path", action="append", type=Path, default=[], help="附带复制或索引的额外文件。")
    parser.add_argument("--dry-run", action="store_true", help="只预览，不真正写入。")
    args = parser.parse_args()

    task_id = args.task_id
    if task_id is None:
        record = read_json_if_exists(args.trial_record.expanduser().resolve()) if args.trial_record else None
        task_id = infer_task_id(
            None if record is None else record.get("line"),
            args.run_dir,
            args.trial_record,
            *(args.source_doc or []),
        )

    if args.run_dir is None and args.trial_record is None:
        if len(args.source_doc) != 1:
            raise ValueError("仅做文档归档时，必须且只能传一个 --source-doc。")
        result = archive_document_record(
            task_id=task_id,
            source_doc=args.source_doc[0].expanduser().resolve(),
            extra_paths=[path.expanduser().resolve() for path in args.extra_path],
            dry_run=bool(args.dry_run),
        )
    else:
        result = solidify_run_archive(
            task_id=task_id,
            run_dir=None if args.run_dir is None else args.run_dir.expanduser().resolve(),
            trial_record_path=None if args.trial_record is None else args.trial_record.expanduser().resolve(),
            source_docs=[path.expanduser().resolve() for path in args.source_doc],
            extra_paths=[path.expanduser().resolve() for path in args.extra_path],
            event_type="solidify",
            dry_run=bool(args.dry_run),
        )
    if not args.dry_run:
        write_task_index()
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
