from __future__ import annotations

import sys
from pathlib import Path


def bootstrap_local_src() -> Path:
    repo_root = Path(__file__).resolve().parents[1]
    src_root = repo_root / "src"
    src_str = str(src_root)
    if src_str not in sys.path:
        sys.path.insert(0, src_str)
    return src_root


bootstrap_local_src()
