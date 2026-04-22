#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

from _bootstrap import ensure_local_package_root

project_root = ensure_local_package_root()

from openvla_line.config import load_experiment_config
from openvla_line.trainer import train_model


def main() -> None:
    config_path = project_root / "configs" / "libero_spatial_smoke.json"
    config = load_experiment_config(config_path)
    summary = train_model(config=config, config_path=config_path)
    print(json.dumps(summary, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()

