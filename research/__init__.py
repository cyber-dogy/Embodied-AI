from __future__ import annotations

from importlib import import_module
from typing import Any


_EXPORT_MAP = {
    "finalize_autoresearch_trial": (".trial_runner", "finalize_autoresearch_trial"),
    "run_autoresearch_trial": (".trial_runner", "run_autoresearch_trial"),
    "train_autoresearch_trial": (".trial_runner", "train_autoresearch_trial"),
    "adopt_existing_mdit_autoresearch_run": (".mdit_trial_runner", "adopt_existing_mdit_autoresearch_run"),
    "finalize_mdit_autoresearch_trial": (".mdit_trial_runner", "finalize_mdit_autoresearch_trial"),
    "run_mdit_autoresearch_trial": (".mdit_trial_runner", "run_mdit_autoresearch_trial"),
    "train_mdit_autoresearch_trial": (".mdit_trial_runner", "train_mdit_autoresearch_trial"),
    "run_mdit_attached_watch": (".mdit_autoresearch_loop", "run_mdit_attached_watch"),
    "run_mdit_autoresearch_loop": (".mdit_autoresearch_loop", "run_mdit_autoresearch_loop"),
    "finalize_lelan_autoresearch_trial": (".lelan_trial_runner", "finalize_lelan_autoresearch_trial"),
    "run_lelan_autoresearch_trial": (".lelan_trial_runner", "run_lelan_autoresearch_trial"),
    "train_lelan_autoresearch_trial": (".lelan_trial_runner", "train_lelan_autoresearch_trial"),
    "run_lelan_autoresearch_loop": (".lelan_autoresearch_loop", "run_lelan_autoresearch_loop"),
}

__all__ = sorted(_EXPORT_MAP)


def __getattr__(name: str) -> Any:
    if name not in _EXPORT_MAP:
        raise AttributeError(name)
    module_name, attr_name = _EXPORT_MAP[name]
    module = import_module(module_name, __name__)
    value = getattr(module, attr_name)
    globals()[name] = value
    return value
