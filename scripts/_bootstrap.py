from __future__ import annotations

import sys
from pathlib import Path


_LOCAL_MODULE_NAMES = [
    "common",
    "envs",
    "mdit",
    "pdit",
    "research",
]


def _purge_foreign_local_modules(repo_root: Path) -> None:
    repo_root = repo_root.resolve()
    for name in list(sys.modules):
        root_name = name.split(".", 1)[0]
        if root_name not in _LOCAL_MODULE_NAMES:
            continue
        module = sys.modules.get(name)
        module_file = getattr(module, "__file__", None)
        if module_file is None:
            continue
        try:
            module_path = Path(module_file).resolve()
        except Exception:
            continue
        if repo_root in module_path.parents or module_path == repo_root:
            continue
        sys.modules.pop(name, None)


def bootstrap_repo_root() -> Path:
    repo_root = Path(__file__).resolve().parents[1]
    script_root = Path(__file__).resolve().parent
    filtered = []
    for entry in sys.path:
        try:
            resolved = Path(entry or ".").resolve()
            if resolved == script_root:
                continue
            if resolved == repo_root:
                continue
        except Exception:
            pass
        filtered.append(entry)
    sys.path[:] = [str(repo_root)] + filtered
    _purge_foreign_local_modules(repo_root)
    return repo_root


bootstrap_repo_root()
