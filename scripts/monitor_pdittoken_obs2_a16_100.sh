#!/bin/bash
RUN_DIR="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb5_shared_lastblock_pdittoken_obs2_a16_100"
SUMMARY="$RUN_DIR/summary.json"
SUCCESS_HIST="$RUN_DIR/success_eval_history.json"
EPOCH_CKPT="$RUN_DIR/epochs/epoch_0100.pt"

if [ -f "$EPOCH_CKPT" ] && [ -f "$SUCCESS_HIST" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Epoch 100 checkpoint and success eval found"
    python3 -c "
import json
with open('$SUCCESS_HIST') as f:
    data = json.load(f)
if isinstance(data, list) and len(data) > 0:
    last = data[-1]
    print(f\"epoch={last.get('epoch')} success_rate={last.get('success_rate')} device={last.get('device_used')} cpu_fallback={last.get('cpu_fallback')}\")
else:
    print('No evaluations found')
"
    exit 0
elif [ -f "$SUMMARY" ]; then
    COMPLETED=$(python3 -c "import json; d=json.load(open('$SUMMARY')); print(d.get('completed_epochs', 0))" 2>/dev/null)
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Completed epochs: $COMPLETED"
    if [ "$COMPLETED" -ge 100 ] && [ ! -f "$SUCCESS_HIST" ]; then
        echo "WARNING: Training completed 100 epochs but success_eval_history.json missing!"
    fi
    exit 1
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Training still in progress (summary.json not ready)"
    exit 1
fi
