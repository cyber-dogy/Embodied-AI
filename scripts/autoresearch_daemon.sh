#!/bin/bash
# Autoresearch Daemon - 全自动接管

LOG="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_daemon.log"
CKPT_ROOT="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt"

echo "$(date) - Autoresearch Daemon Started" >> $LOG

# 扫描所有 v2 run
for dir in $CKPT_ROOT/unplug_charger_mdit_*v2__*/; do
    if [ -f "$dir/summary.json" ]; then
        ce=$(cat "$dir/summary.json" | python3 -c "import json,sys; print(json.load(sys.stdin).get('completed_epochs',0))")
        if [ "$ce" -ge 100 ]; then
            run=$(basename "$dir")
            sr=$(cat "$dir/success_eval_history.json" 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin)[-1] if json.load(sys.stdin) else None; print(d.get('success_rate') if d and d.get('success_rate')!=None else 'NEED_EVAL')")
            
            if [ "$sr" = "NEED_EVAL" ]; then
                echo "$(date) - $run: 100 epoch completed, starting eval..." >> $LOG
                
                # 检查显存
                gpu_mem=$(nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits 2>/dev/null | head -1)
                if [ "$gpu_mem" -lt 10000 ]; then
                    cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
                    source /opt/miniconda3/etc/profile.d/conda.sh
                    conda activate mdit_env
                    
                    # 运行评估
                    python scripts/run_mdit_autoresearch_trial.py \
                        --phase audit-only \
                        --run-dir "$dir" \
                        --eval-episodes 20 \
                        --headless \
                        --show-progress >> $LOG 2>&1
                    
                    # 读取结果
                    new_sr=$(cat "$dir/success_eval_history.json" 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin)[-1] if json.load(sys.stdin) else None; print(d.get('success_rate') if d else 'NONE')")
                    echo "$(date) - $run: eval complete, success@20=$new_sr" >> $LOG
                    
                    # 闸门决策
                    if python3 -c "exit(0 if float('$new_sr') >= 0.45 else 1)" 2>/dev/null; then
                        echo "$(date) - $run: PASSED gate, resuming to 300..." >> $LOG
                        # 续训到 300
                    else
                        echo "$(date) - $run: FAILED gate, cleaning up..." >> $LOG
                        rm -rf "$dir/epochs/"
                        echo "$(date)    $run    -    success@20=$new_sr    FAILED" >> results.tsv
                    fi
                else
                    echo "$(date) - GPU busy, skipping eval for $run" >> $LOG
                fi
            fi
        fi
    fi
done

echo "$(date) - Daemon cycle complete" >> $LOG
