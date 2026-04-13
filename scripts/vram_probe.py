#!/usr/bin/env python3
"""VRAM probe disabled for the current MDIT mainline."""

import sys


def main() -> int:
    print("VRAM 探测脚本已禁用。")
    print("当前 MDIT 主线固定 batch_size=8、grad_accum_steps=4，不允许下游 agent 做显存探测循环。")
    print("如需改 batch_size，只能由用户明确指定。")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
