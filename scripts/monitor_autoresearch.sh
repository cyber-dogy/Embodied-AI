#!/bin/bash
# MDIT Autoresearch 监控脚本

echo "======================================"
echo "MDIT Autoresearch 监控 - $(date)"
echo "======================================"

# 检查 tmux session
echo ""
echo "【Tmux Sessions】"
tmux list-sessions 2>/dev/null | grep mdit_ar || echo "无活跃 session"

# 检查 GPU
echo ""
echo "【GPU 状态】"
nvidia-smi --query-gpu=name,memory.used,memory.total,utilization.gpu,temperature.gpu --format=csv,noheader,nounits | awk -F, '{
    printf "GPU: %s\n显存: %.2f GB / %.2f GB\n利用率: %s%%\n温度: %s°C\n", 
    $1, $2/1024, $3/1024, $4, $5
}'

# 检查训练进程
echo ""
echo "【训练进程】"
ps aux | grep "run_mdit_autoresearch_trial" | grep -v grep | wc -l | xargs -I {} echo "运行中进程数: {}"

# 检查 ckpt 目录
echo ""
echo "【CKPT 目录】"
for dir in /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb5_shared_lastblock_pdittoken_obs2_a16*; do
    if [ -d "$dir" ]; then
        run_name=$(basename "$dir")
        echo ""
        echo "Run: $run_name"
        
        # 检查 summary
        if [ -f "$dir/summary.json" ]; then
            echo "  ✅ Summary 已生成"
            cat "$dir/summary.json" 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print(f'    Epochs: {d.get(\"completed_epochs\", \"N/A\")}')" 2>/dev/null
        else
            echo "  ⏳ 训练中..."
        fi
        
        # 检查 success eval
        if [ -f "$dir/success_eval_history.json" ]; then
            echo "  ✅ Success eval 历史已生成"
            cat "$dir/success_eval_history.json" 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); [print(f'    Epoch {e[\"epoch\"]}: success@{e.get(\"episodes\", 20)}={e[\"success_rate\"]:.2f}') for e in d.get('evaluations', [])]" 2>/dev/null
        fi
    fi
done

echo ""
echo "======================================"
