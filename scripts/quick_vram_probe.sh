#!/bin/bash
# 快速显存探测脚本
set -e

cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

CONFIG="configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json"
RESULTS_FILE="vram_probe_results.txt"

echo "MDIT VRAM 探测" > $RESULTS_FILE
echo "时间: $(date)" >> $RESULTS_FILE
echo "GPU: $(nvidia-smi --query-gpu=name --format=csv,noheader)" >> $RESULTS_FILE
echo "================================" >> $RESULTS_FILE

# 测试序列
for BS in 12 16 20 24 28 32; do
    echo ""
    echo "🧪 测试 batch_size=$BS"
    
    # 清理 GPU 缓存
    python -c "import torch; torch.cuda.empty_cache()"
    
    # 获取测试前显存
    VRAM_BEFORE=$(nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits)
    
    # 运行 1 epoch 训练
    RUN_NAME="vram_probe_bs${BS}_$(date +%s)"
    
    timeout 120 python scripts/run_mdit_autoresearch_trial.py \
        --phase train-only \
        --config $CONFIG \
        --stage-epochs 1 \
        --checkpoint-every 1 \
        --device cuda \
        --experiment-name "vram_probe_bs${BS}" \
        --run-name "$RUN_NAME" \
        --description "VRAM probe for batch_size=$BS" \
        --set batch_size=$BS \
        --set grad_accum_steps=1 \
        --set wandb_enable=false \
        --set enable_success_rate_eval=false 2>&1 | tail -n 5
    
    EXIT_CODE=${PIPESTATUS[0]}
    
    if [ $EXIT_CODE -eq 124 ]; then
        echo "  ⏱️ 超时"
        echo "batch_size $BS -> 超时" >> $RESULTS_FILE
        continue
    fi
    
    if [ $EXIT_CODE -ne 0 ]; then
        echo "  ❌ OOM 或错误 (exit: $EXIT_CODE)"
        echo "batch_size $BS -> OOM" >> $RESULTS_FILE
        break
    fi
    
    # 获取测试后显存峰值
    VRAM_AFTER=$(nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits)
    VRAM_GB=$(echo "scale=2; $VRAM_AFTER / 1024" | bc)
    
    echo "  ✅ batch_size=$BS -> 显存 ${VRAM_GB} GB"
    echo "batch_size $BS -> 显存 ${VRAM_GB} GB -> 稳定" >> $RESULTS_FILE
    
    # 如果超过 23GB，停止测试
    if [ $(echo "$VRAM_GB > 23" | bc) -eq 1 ]; then
        echo "⚠️ 显存超过 23GB，停止增加 batch"
        break
    fi
done

echo ""
echo "================================"
echo "探测结果:"
cat $RESULTS_FILE
