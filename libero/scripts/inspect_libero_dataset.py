#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

import h5py


def _shape_of(node):
    return list(node.shape) if hasattr(node, "shape") else None


def _dtype_of(node):
    return str(node.dtype) if hasattr(node, "dtype") else None


def _summarize_group(group, depth=0, max_depth=2):
    summary = {}
    for key in sorted(group.keys()):
        value = group[key]
        if isinstance(value, h5py.Dataset):
            summary[key] = {
                "type": "dataset",
                "shape": _shape_of(value),
                "dtype": _dtype_of(value),
            }
        elif isinstance(value, h5py.Group):
            group_summary = {
                "type": "group",
                "keys": sorted(list(value.keys())),
            }
            if depth < max_depth:
                group_summary["children"] = _summarize_group(value, depth=depth + 1, max_depth=max_depth)
            summary[key] = group_summary
    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo-file", required=True, help="单任务 LIBERO demo hdf5 路径")
    parser.add_argument("--episode", type=int, default=0, help="想查看的 episode 索引")
    parser.add_argument("--max-depth", type=int, default=2, help="递归展示 group 结构的最大深度")
    parser.add_argument("--out", type=str, default=None, help="可选：把结构摘要写成 json")
    args = parser.parse_args()

    demo_path = Path(args.demo_file).expanduser().resolve()
    if not demo_path.exists():
        raise FileNotFoundError(f"没有找到 demo 文件: {demo_path}")

    with h5py.File(demo_path, "r") as demo_file:
        if "data" not in demo_file:
            raise KeyError(f"{demo_path} 缺少 data group")

        episode_keys = sorted(
            demo_file["data"].keys(),
            key=lambda key: int(key.split("_")[-1]),
        )
        if args.episode < 0 or args.episode >= len(episode_keys):
            raise IndexError(f"episode={args.episode} 超出范围 [0, {len(episode_keys)})")

        episode_key = episode_keys[args.episode]
        episode_group = demo_file["data"][episode_key]

        # 这里输出的是“当前任务数据长什么样”，方便后面决定 VLA / WM 该怎么转格式。
        summary = {
            "demo_file": str(demo_path),
            "root_keys": sorted(list(demo_file.keys())),
            "num_episodes": len(episode_keys),
            "selected_episode": episode_key,
            "episode_keys_preview": episode_keys[:10],
            "structure": _summarize_group(episode_group, max_depth=args.max_depth),
            "attrs": {key: str(value) for key, value in episode_group.attrs.items()},
        }

    print(f"demo_file={summary['demo_file']}")
    print(f"num_episodes={summary['num_episodes']}")
    print(f"selected_episode={summary['selected_episode']}")
    print("episode_keys_preview=", summary["episode_keys_preview"])
    print(json.dumps(summary["structure"], indent=2, ensure_ascii=False))

    if args.out is not None:
        out_path = Path(args.out).expanduser().resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False))
        print(f"summary_json={out_path}")


if __name__ == "__main__":
    main()
