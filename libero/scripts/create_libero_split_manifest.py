#!/usr/bin/env python3
import argparse
import json
import random
from pathlib import Path

import h5py


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo-file", required=True, help="单任务 LIBERO demo hdf5 路径")
    parser.add_argument("--train-ratio", type=float, default=0.9, help="train 集比例")
    parser.add_argument("--seed", type=int, default=7, help="随机切分 seed")
    parser.add_argument("--out", required=True, help="输出 manifest json 路径")
    args = parser.parse_args()

    if not (0.0 < args.train_ratio < 1.0):
        raise ValueError(f"train-ratio 必须在 (0, 1) 内，当前是 {args.train_ratio}")

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

    if len(episode_keys) < 2:
        raise ValueError("episode 数量太少，无法稳定切 train / val")

    shuffled_episode_keys = list(episode_keys)
    random.Random(args.seed).shuffle(shuffled_episode_keys)

    split_index = max(1, min(len(shuffled_episode_keys) - 1, int(len(shuffled_episode_keys) * args.train_ratio)))
    train_episodes = sorted(shuffled_episode_keys[:split_index], key=lambda key: int(key.split("_")[-1]))
    val_episodes = sorted(shuffled_episode_keys[split_index:], key=lambda key: int(key.split("_")[-1]))

    # 这里故意只生成 manifest，不复制原始 hdf5，避免数据冗余和路径混乱。
    manifest = {
        "demo_file": str(demo_path),
        "seed": args.seed,
        "train_ratio": args.train_ratio,
        "num_total": len(episode_keys),
        "num_train": len(train_episodes),
        "num_val": len(val_episodes),
        "train_episodes": train_episodes,
        "val_episodes": val_episodes,
    }

    out_path = Path(args.out).expanduser().resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))

    print(f"demo_file={demo_path}")
    print(f"num_total={manifest['num_total']}")
    print(f"num_train={manifest['num_train']}")
    print(f"num_val={manifest['num_val']}")
    print(f"manifest={out_path}")


if __name__ == "__main__":
    main()
