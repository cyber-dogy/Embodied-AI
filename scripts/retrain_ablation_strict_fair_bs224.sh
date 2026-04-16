#!/bin/bash
set -euo pipefail

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

REPO_DIR="/home/gjw/Myprojects/autodl_unplug_charger_transformer_fm"
cd "${REPO_DIR}"

mkdir -p logs

echo "[1/4] Anchor A (original line): PCD + PDIT (bs64, no-AMP)"
HF_HUB_OFFLINE=1 python scripts/run_autoresearch_trial.py \
  --line pdit \
  --phase full \
  --config configs/ablation/pcd_pdit_anchor_100_fair_bs224_noamp.json \
  --stage-epochs 100 \
  --checkpoint-every 50 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name ablation_anchor_pcd_pdit_orig_bs64_noamp_eval50_100 \
  --run-name ablation_anchor_pcd_pdit_orig_bs64_noamp \
  --description "strict fair anchor A: original pdit line, pcd+pdit, bs64, no-amp, eval@50/100" \
  --headless \
  --show-progress \
  --enable-wandb \
  --set wandb_mode=online \
  --set wandb_project=autodl-unplug-charger-mdit \
  --set batch_size=64 \
  --set train_use_amp=false \
  --cleanup-failed \
  2>&1 | tee logs/run_ablation_anchor_pcd_pdit_orig_bs64_noamp_eval50_100.log

echo "[2/4] Anchor B (mainline): 5RGB + text + MDIT + last_block (bs64, no-AMP)"
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/rgb_text_mdit_anchor_100_fair_bs224_noamp.json \
  --stage-epochs 100 \
  --checkpoint-every 50 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name ablation_anchor_rgb5text_mdit_bs64_noamp_eval50_100 \
  --run-name ablation_anchor_rgb5text_mdit_bs64_noamp \
  --description "strict fair anchor B: 5rgb+text+mdit(last_block), obs2/h100/a24, bs64, no-amp, eval@50/100" \
  --headless \
  --show-progress \
  --set use_amp=false \
  --set batch_size=64 \
  --set wandb_project=autodl-unplug-charger-mdit \
  --set observation_encoder.vision.train_mode=last_block \
  --cleanup-failed \
  2>&1 | tee logs/run_ablation_anchor_rgb5text_mdit_bs64_noamp_eval50_100.log

echo "[3/4] Cross C: PCD + MDIT (bs128, no-AMP)"
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/pcd_mdit_100_fair_bs224_noamp.json \
  --stage-epochs 100 \
  --checkpoint-every 50 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name ablation_cross_pcd_mdit_bs128_noamp_eval50_100 \
  --run-name ablation_pcd_mdit_100_fair_bs128_noamp \
  --description "strict fair cross C: pcd+mdit, obs2/h100/a24, bs128, no-amp, eval@50/100" \
  --headless \
  --show-progress \
  --set use_amp=false \
  --set batch_size=128 \
  --set wandb_project=autodl-unplug-charger-mdit \
  --cleanup-failed \
  2>&1 | tee logs/run_ablation_cross_pcd_mdit_bs128_noamp_eval50_100.log

echo "[4/4] Cross D: 5RGB + text + PDIT-adapter (MDIT line, bs128, no-AMP)"
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/ablation/rgb_text_pdit_100_fair_bs224_noamp.json \
  --stage-epochs 100 \
  --checkpoint-every 50 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name ablation_cross_rgb5text_pdit_adapter_bs128_noamp_eval50_100 \
  --run-name ablation_rgb_text_pdit_100_fair_bs128_noamp \
  --description "strict fair cross D: 5rgb+text+pdit-adapter, obs2/h100/a24, bs128, no-amp, eval@50/100" \
  --headless \
  --show-progress \
  --set use_amp=false \
  --set batch_size=128 \
  --set wandb_project=autodl-unplug-charger-mdit \
  --set observation_encoder.vision.train_mode=last_block \
  --cleanup-failed \
  2>&1 | tee logs/run_ablation_cross_rgb5text_pdit_adapter_bs128_noamp_eval50_100.log

echo "done: strict fair ablation (anchors bs64 + cross bs128, no-amp, eval@50/100) finished."
