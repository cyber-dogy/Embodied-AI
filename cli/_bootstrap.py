from __future__ import annotations

import importlib
import sys
from pathlib import Path


_LOCAL_MODULE_NAMES = [
    "cli",
    "common",
    "config",
    "data",
    "envs",
    "model",
    "policy",
    "research",
    "train",
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


def _prioritize_repo_root(repo_root: Path) -> None:
    filtered: list[str] = []
    for entry in sys.path:
        try:
            resolved = Path(entry or ".").resolve()
        except Exception:
            filtered.append(entry)
            continue
        if resolved == repo_root:
            continue
        filtered.append(entry)
    sys.path[:] = [str(repo_root)] + filtered


def bootstrap_local_cli_imports() -> Path:
    repo_root = Path(__file__).resolve().parents[1]
    _prioritize_repo_root(repo_root)
    _purge_foreign_local_modules(repo_root)
    for name in ("common", "config", "data", "envs", "model", "policy", "train", "research"):
        importlib.import_module(name)
    return repo_root
