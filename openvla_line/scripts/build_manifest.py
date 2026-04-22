#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from _bootstrap import ensure_local_package_root

project_root = ensure_local_package_root()

from openvla_line.data import build_libero_manifest, save_manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", required=True, help="LIBERO suite 目录，或包含该 suite 的上级目录")
    parser.add_argument("--train-ratio", type=float, default=0.9)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--max-files", type=int, default=None)
    parser.add_argument("--max-train-episodes", type=int, default=None)
    parser.add_argument("--max-val-episodes", type=int, default=None)
    parser.add_argument(
        "--out",
        default=str(project_root / "artifacts" / "manifests" / "libero_spatial_manifest.json"),
        help="输出 manifest json 路径",
    )
    args = parser.parse_args()

    manifest = build_libero_manifest(
        suite_dir=args.data_root,
        train_ratio=args.train_ratio,
        seed=args.seed,
        max_files=args.max_files,
        max_train_episodes=args.max_train_episodes,
        max_val_episodes=args.max_val_episodes,
    )
    target = save_manifest(manifest, args.out)
    print(f"manifest={target}")
    print(f"num_demo_files={manifest['num_demo_files']}")
    print(f"num_train_episodes={manifest['num_train_episodes']}")
    print(f"num_val_episodes={manifest['num_val_episodes']}")
    print(f"action_dim={manifest['action_dim']}")
    print(f"proprio_dim={manifest['proprio_dim']}")


if __name__ == "__main__":
    main()

