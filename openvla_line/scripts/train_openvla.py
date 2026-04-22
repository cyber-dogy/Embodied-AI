#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from _bootstrap import ensure_local_package_root

project_root = ensure_local_package_root()

from openvla_line.config import load_experiment_config
from openvla_line.trainer import train_model


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--config",
        default=str(project_root / "configs" / "libero_spatial_small.json"),
        help="训练配置 json 路径",
    )
    parser.add_argument("--data-root", default=None, help="可选：覆盖配置里的 LIBERO 数据目录")
    parser.add_argument("--run-name", default=None, help="可选：覆盖配置里的 run_name")
    parser.add_argument("--device", default=None, help="可选：例如 cuda / cpu / cuda:0")
    parser.add_argument("--summary-out", default=None, help="可选：把训练 summary 额外写到这个 json")
    args = parser.parse_args()

    config_path = Path(args.config).expanduser().resolve()
    config = load_experiment_config(config_path)
    summary = train_model(
        config=config,
        config_path=config_path,
        data_root_override=args.data_root,
        run_name_override=args.run_name,
        device_override=args.device,
    )

    print(json.dumps(summary, indent=2, ensure_ascii=False))
    if args.summary_out:
        target = Path(args.summary_out).expanduser().resolve()
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(summary, indent=2, ensure_ascii=False))
        print(f"summary_json={target}")


if __name__ == "__main__":
    main()

