#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

import h5py

from _bootstrap import ensure_local_package_root

ensure_local_package_root()


def _shape(node):
    return list(node.shape) if hasattr(node, "shape") else None


def _dtype(node):
    return str(node.dtype) if hasattr(node, "dtype") else None


def _summarize_group(group: h5py.Group, depth: int = 0, max_depth: int = 2) -> dict:
    summary = {}
    for key in sorted(group.keys()):
        value = group[key]
        if isinstance(value, h5py.Dataset):
            summary[key] = {"type": "dataset", "shape": _shape(value), "dtype": _dtype(value)}
        elif isinstance(value, h5py.Group):
            item = {"type": "group", "keys": sorted(list(value.keys()))}
            if depth < max_depth:
                item["children"] = _summarize_group(value, depth=depth + 1, max_depth=max_depth)
            summary[key] = item
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo-file", required=True, help="单任务 LIBERO demo hdf5 路径")
    parser.add_argument("--episode", type=int, default=0)
    parser.add_argument("--max-depth", type=int, default=3)
    parser.add_argument("--out", type=str, default=None)
    args = parser.parse_args()

    demo_file = Path(args.demo_file).expanduser().resolve()
    if not demo_file.exists():
        raise FileNotFoundError(f"没有找到 demo 文件: {demo_file}")

    with h5py.File(demo_file, "r") as demo:
        episode_keys = sorted(demo["data"].keys(), key=lambda key: int(key.split("_")[-1]))
        episode_key = episode_keys[args.episode]
        episode = demo["data"][episode_key]
        summary = {
            "demo_file": str(demo_file),
            "num_episodes": len(episode_keys),
            "selected_episode": episode_key,
            "episode_keys_preview": episode_keys[:10],
            "structure": _summarize_group(episode, max_depth=args.max_depth),
            "attrs": {key: str(value) for key, value in episode.attrs.items()},
        }

    print(f"demo_file={summary['demo_file']}")
    print(f"num_episodes={summary['num_episodes']}")
    print(f"selected_episode={summary['selected_episode']}")
    print(json.dumps(summary["structure"], indent=2, ensure_ascii=False))

    if args.out:
        out_path = Path(args.out).expanduser().resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False))
        print(f"summary_json={out_path}")


if __name__ == "__main__":
    main()

