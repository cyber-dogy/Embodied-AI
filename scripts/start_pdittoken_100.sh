#!/bin/bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_pdittoken_last_a8_100"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_pdittoken_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb5_pdittoken_lastblock_a8_lr2e5_100 \
  --run-name "$RUN_NAME" \
  --description "rgb5 pdittoken last_block a8 100ep bs10" \
  --headless \
  --show-progress \
  --set batch_size=10 \
  --set grad_accum_steps=1 \
  --set num_workers=8 \
  --set optimizer_lr=2e-5 \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full" \
  --set wandb_enable=true \
  --set wandb_mode="online" \
  --set resume_from_latest=false
