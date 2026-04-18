#!/usr/bin/env python3

from __future__ import annotations

import _bootstrap  # noqa: F401

import argparse
import json
import os
from pathlib import Path
import shutil
import tempfile

import torch


REQUIRED_PAYLOAD_KEYS = (
    "strategy",
    "model_state_dict",
    "optimizer_state_dict",
    "scheduler_state_dict",
    "scaler_state_dict",
    "completed_epoch",
    "global_step",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Patch a resumable latest.pt from an existing full training checkpoint.",
    )
    parser.add_argument(
        "--run-dir",
        type=Path,
        required=True,
        help="MDIT run directory that contains config.json and epochs/.",
    )
    source_group = parser.add_mutually_exclusive_group(required=False)
    source_group.add_argument(
        "--epoch",
        type=int,
        default=100,
        help="Periodic epoch checkpoint to promote into latest.pt. Default: 100.",
    )
    source_group.add_argument(
        "--source-ckpt",
        type=Path,
        default=None,
        help="Explicit checkpoint path to patch into latest.pt.",
    )
    parser.add_argument(
        "--force",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Overwrite existing latest.pt. Default: false.",
    )
    return parser.parse_args()


def _resolve_source_checkpoint(run_dir: Path, *, epoch: int, source_ckpt: Path | None) -> Path:
    if source_ckpt is not None:
        return source_ckpt.expanduser().resolve()
    return (run_dir / "epochs" / f"epoch_{int(epoch):04d}.pt").resolve()


def _validate_training_checkpoint(payload: dict) -> None:
    missing = [key for key in REQUIRED_PAYLOAD_KEYS if key not in payload]
    if missing:
        raise ValueError(f"checkpoint is not resumable; missing keys: {missing}")
    completed_epoch = payload.get("completed_epoch")
    if not isinstance(completed_epoch, int):
        raise ValueError(f"invalid completed_epoch in checkpoint: {completed_epoch!r}")


def _atomic_copy(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(
        dir=str(dst.parent),
        prefix=f".{dst.name}.tmp.",
        suffix=".pt",
    )
    os.close(fd)
    tmp = Path(tmp_path)
    try:
        # 先拷到临时文件再替换，避免 latest.pt 写到一半被中断。
        shutil.copy2(src, tmp)
        os.replace(tmp, dst)
    finally:
        if tmp.exists():
            tmp.unlink()


def main() -> int:
    args = parse_args()
    run_dir = args.run_dir.expanduser().resolve()
    if not run_dir.exists():
        raise FileNotFoundError(f"run dir not found: {run_dir}")
    if not (run_dir / "config.json").exists():
        raise FileNotFoundError(f"run dir is missing config.json: {run_dir / 'config.json'}")

    source_ckpt = _resolve_source_checkpoint(
        run_dir,
        epoch=int(args.epoch),
        source_ckpt=args.source_ckpt,
    )
    if not source_ckpt.exists():
        raise FileNotFoundError(f"source checkpoint not found: {source_ckpt}")

    latest_ckpt = run_dir / "latest.pt"
    if latest_ckpt.exists() and not bool(args.force):
        raise FileExistsError(f"latest.pt already exists: {latest_ckpt}")

    # 这里只接受完整训练态 checkpoint，避免把纯推理权重误补成 latest。
    payload = torch.load(source_ckpt, map_location="cpu")
    _validate_training_checkpoint(payload)

    _atomic_copy(source_ckpt, latest_ckpt)

    result = {
        "run_dir": str(run_dir),
        "source_ckpt": str(source_ckpt),
        "latest_ckpt": str(latest_ckpt),
        "strategy": payload.get("strategy"),
        "completed_epoch": int(payload["completed_epoch"]),
        "global_step": int(payload["global_step"]),
        "force": bool(args.force),
    }
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
