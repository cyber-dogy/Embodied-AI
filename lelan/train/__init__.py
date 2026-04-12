from __future__ import annotations

__all__ = ["train_experiment"]


def train_experiment(*args, **kwargs):
    from .runner import train_experiment as _train_experiment

    return _train_experiment(*args, **kwargs)
