#!/bin/bash
set -e

RUN_DIR="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb5_shared_lastblock_pdittoken_obs2_a16_100"
SUMMARY="$RUN_DIR/summary.json"
SUCCESS_HIST="$RUN_DIR/success_eval_history.json"
EPOCH_CKPT="$RUN_DIR/epochs/epoch_0100.pt"
LOG="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/auto_takeover.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG"
}

if [ -f "$EPOCH_CKPT" ] && [ -f "$SUCCESS_HIST" ]; then
    log "Epoch 100 checkpoint and success eval found"
    python3 -c "
import json
with open('$SUCCESS_HIST') as f:
    data = json.load(f)
if isinstance(data, list) and len(data) > 0:
    last = data[-1]
    print(f\"epoch={last.get('epoch')} success_rate={last.get('success_rate')} device={last.get('device_used')} cpu_fallback={last.get('cpu_fallback')}\")
else:
    print('No evaluations found')
" | tee -a "$LOG"
    exit 0
fi

if [ -f "$SUMMARY" ]; then
    COMPLETED=$(python3 -c "import json; d=json.load(open('$SUMMARY')); print(d.get('completed_epochs', 0))" 2>/dev/null || echo "0")
    log "Completed epochs: $COMPLETED"
    
    if [ "$COMPLETED" -ge 100 ] && [ ! -f "$SUCCESS_HIST" ]; then
        log "WARNING: Training completed 100 epochs but success_eval_history.json missing!"
        
        # Check GPU is free
        GPU_USED=$(nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits | awk '{print int($1)}')
        log "GPU memory used: ${GPU_USED}MiB"
        
        if [ "$GPU_USED" -gt 10000 ]; then
            log "GPU still occupied, stopping training first..."
            tmux send-keys -t mdit_rgb5_shared_last_pdittoken_a16 C-c
            sleep 15
            pkill -f "run_mdit_autoresearch_trial.py" || true
            sleep 10
        fi
        
        # Run audit-only eval
        log "Starting audit-only evaluation (20 episodes)..."
        cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
        source /opt/miniconda3/etc/profile.d/conda.sh
        conda activate mdit_env
        
        python scripts/run_mdit_autoresearch_trial.py \
          --phase audit-only \
          --run-dir "$RUN_DIR" \
          --eval-episodes 20 \
          --audit-timeout-sec 10800 \
          --headless \
          --show-progress 2>&1 | tee -a "$LOG"
        
        if [ -f "$SUCCESS_HIST" ]; then
            SUCCESS_RATE=$(python3 -c "import json; d=json.load(open('$SUCCESS_HIST')); print(d[-1].get('success_rate', -1))" 2>/dev/null || echo "-1")
            log "Evaluation complete. success@20 = $SUCCESS_RATE"
            
            # Decision: 3-way gate
            DECISION=$(python3 -c "
sr = float('$SUCCESS_RATE')
if sr >= 0.45:
    print('PASS')
elif sr > 0.2:
    print('BORDERLINE')
else:
    print('FAIL')
")
            log "Gate decision: $DECISION (success@20=$SUCCESS_RATE)"

            if [ "$DECISION" = "PASS" ]; then
                log "Decision: CONTINUE to 300 epoch"
                # Start resume training to 300
                tmux new-session -d -s mdit_rgb5_shared_last_pdittoken_a16_300
                tmux send-keys -t mdit_rgb5_shared_last_pdittoken_a16_300 "
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/rgb5_shared_lastblock_pdittoken_obs2_a16_gate100.json \
  --stage-epochs 300 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_300 \
  --run-name unplug_charger_mdit_rgb5_shared_lastblock_pdittoken_obs2_a16_100 \
  --description \"rgb5 shared last_block pdittoken obs2 a16 resume to 300ep bs16\" \
  --headless \
  --show-progress \
  --set batch_size=16 \
  --set grad_accum_steps=4 \
  --set num_workers=8 \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=full \
  --set wandb_enable=true \
  --set wandb_mode=online \
  --set resume_from_latest=true
" Enter
                log "Resume training to 300 epoch started in tmux: mdit_rgb5_shared_last_pdittoken_a16_300"
            elif [ "$DECISION" = "BORDERLINE" ]; then
                log "Decision: BORDERLINE — awaiting user approval before cleanup or continuation"
                echo "$SUCCESS_RATE" > "$RUN_DIR/.awaiting_user_decision"
                echo "success@20=$SUCCESS_RATE is between 0.2 and 0.45. User approval required before deleting checkpoints or continuing." >> "$RUN_DIR/.awaiting_user_decision"
            else
                log "Decision: STOP branch, cleaning checkpoints"
                find "$RUN_DIR" -name "*.pt" -delete
                log "Removed all .pt files from $RUN_DIR"
            fi
        else
            log "ERROR: success_eval_history.json still missing after audit!"
            exit 1
        fi
    else
        log "Training in progress, not yet at epoch 100 with missing eval"
        exit 1
    fi
else
    log "Training still in progress (summary.json not ready)"
    exit 1
fi
