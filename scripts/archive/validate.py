from __future__ import annotations

import json
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from research.archive_writer import validate_archive_tree


def main() -> int:
    report = validate_archive_tree()
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if report["error_count"] > 0 else 0


if __name__ == "__main__":
    raise SystemExit(main())
