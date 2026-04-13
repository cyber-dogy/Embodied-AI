#!/bin/bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_shared_lastblock_pdittoken_obs2_a16_100"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/rgb5_shared_lastblock_pdittoken_obs2_a16_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100 \
  --run-name "$RUN_NAME" \
  --description "rgb5 shared last_block pdittoken obs2 a16 100ep" \
  --headless \
  --show-progress \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full" \
  --set wandb_enable=true \
  --set wandb_mode="online" \
  --set resume_from_latest=false
