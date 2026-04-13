#!/bin/bash
echo "VRAM 探测脚本已禁用。"
echo "当前 MDIT 主线固定 batch_size=8、grad_accum_steps=4，不允许下游 agent 做显存探测循环。"
echo "如需改 batch_size，只能由用户明确指定。"
exit 1
