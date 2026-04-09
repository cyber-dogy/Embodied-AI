from __future__ import annotations

import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
filtered = []
for entry in sys.path:
    try:
        if Path(entry or ".").resolve() == REPO_ROOT:
            continue
    except Exception:
        pass
    filtered.append(entry)
sys.path[:] = [str(REPO_ROOT)] + filtered

for name in list(sys.modules):
    root_name = name.split(".", 1)[0]
    if root_name not in {"common", "envs", "mdit", "pdit", "research"}:
        continue
    module = sys.modules.get(name)
    module_file = getattr(module, "__file__", None)
    if module_file is None:
        continue
    try:
        module_path = Path(module_file).resolve()
    except Exception:
        continue
    if REPO_ROOT in module_path.parents or module_path == REPO_ROOT:
        continue
    sys.modules.pop(name, None)
