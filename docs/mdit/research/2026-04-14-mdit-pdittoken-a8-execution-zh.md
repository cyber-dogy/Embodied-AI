# 2026-04-14 MDIT rgb5_pdittoken_lastblock_a8 执行记录

## 背景

这是旧主线 `obs3 + a8 + separate encoder + AMP` 的 PDIT token-conditioned 路径的 100 epoch screening。

## 执行命令

```bash
tmux new -s mdit_pdittoken_100
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
```

## 100 Epoch 结果

| 指标 | 数值 |
|------|------|
| success@20 | 0.0 |
| mean_steps | 198.75 |
| valid/loss_total | 1.321 |
| valid/loss_grip | 0.953 |
| valid/grip_deadband_ratio | 0.0 |
| valid/grip_transition_acc | 0.0 |
| valid/grip_binary_acc | 1.0 |
| planning_runtime_error | 11 |
| simulator_runtime_error | 0 |
| cpu_fallback | False |

## 失败分析

- 20/20 episodes 全部失败
- `failure_error_buckets` 中 `planning_runtime_error=11`，说明大量动作被规划器拒绝
- `likely_causes` 明确指向 `planner_rejecting_many_predicted_actions` 和 `policy_quality_is_currently_well_below_target`
- 虽然 `grip_binary_acc=1.0`，但 `grip_transition_acc=0.0`，说明 gripper 没有学会真正的开关切换，只是预测了一个恒定的夹爪状态

## 闸门决策

success@20 = 0.0 < 0.45 → **FAILED**，停止分支，不续训到 300 epoch。

## 磁盘清理

已删除：
- `epochs/epoch_0100.pt` (~8.3GB)
- `best_success.pt` (~8.3GB)

保留：
- `config.json`
- `summary.json`
- `dataset_stats.json`
- `experiment_manifest.json`
- `success_eval_history.json`
- `audit_report.json`
- `latest.pt`

## 结论

`obs3 + a8 + separate + AMP` 的 PDIT token-conditioned 路径在此 recipe 下被证伪。评估记录已完整写盘。autoresearch 现已全面切到新主线 `rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100`。
