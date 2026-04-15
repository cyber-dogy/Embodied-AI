# 2026-04-14 MDIT rgb5_shared_lastblock_pdittoken_obs2_a16 执行记录

## 背景

本轮唯一主线 `rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100` 的 100 epoch screening。

这是在新执行计划下，将 `5RGB + text + last_block` 回锚到更接近成功锚点的 PDIT token-conditioned 条件路径的首次验证。

## 本轮改动

固定配方（相对旧高漂移主线）：

- `n_obs_steps`: `3` → `2`
- `n_action_steps`: `8` → `16`
- `vision.use_separate_encoder_per_camera`: `true` → `false` (shared encoder)
- `use_amp`: `true` → `false`
- `transformer_variant`: `mdit` → `pdit`
- `objective.sigma_min`: `0.001` → `0.0`
- `objective.num_integration_steps`: `20` → `50`
- `smooth_actions`: `true` → `false`
- `optimizer_betas`: `[0.9, 0.999]` → `[0.95, 0.999]`
- `optimizer_weight_decay`: `1e-6` → `0.0`
- `batch_size`: `8`（config 默认值，未覆盖）
- `grad_accum_steps`: `4`
- 有效 batch: `8 * 4 = 32`

## 执行命令

```bash
tmux new -s mdit_mainline_100

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_shared_lastblock_pdittoken_obs2_a16_100"

python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/mdit/rgb5_shared_lastblock_pdittoken_obs2_a16_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100 \
  --run-name "$RUN_NAME" \
  --description "mainline semantic-aligned gate100" \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set rlbench_disable_task_validation=false \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full" \
  --set wandb_enable=true \
  --set wandb_mode="online" \
  --set resume_from_latest=false
```

## 环境

- 训练环境：`mdit_env`
- 评估环境：同一台机器（RTX 5090 24GB）
- GPU 评估：未触发 OOM，全程 `cuda`

## 100 Epoch 结果

| 指标 | 数值 |
|------|------|
| success@20 | **0.0** |
| mean_steps | 80.0 |
| valid/loss_total | 1.3625 |
| valid/loss_xyz | 0.0988 |
| valid/loss_rot6d | 0.2267 |
| valid/loss_grip | 1.0370 |
| valid/grip_deadband_ratio | 0.0 |
| valid/grip_transition_acc | 0.0 |
| valid/grip_binary_acc | 1.0 |
| num_episodes | 20 |
| num_successes | 0 |
| device_used | `cuda` |
| cpu_fallback | **False** |
| recipe_drift | **False** |

评估详情：

- 20/20 episodes 全部失败
- 大量报错为 `The call failed on the V-REP side. Return value: -1` 或 `planning runtime error: The call failed on the V-REP side. Return value: -1`
- 评估耗时约 457 秒，在 GPU 上直接完成
- best_metric 出现在 epoch 19 (0.783)，之后 valid loss 走高

## 闸门决策

success@20 = 0.0 < 0.45 → **FAILED**，未通过 100 epoch 闸门。

按执行计划 6.2：立即停止，**不续训到 300 epoch**。

## 磁盘清理

已执行：

- 删除 `epochs/epoch_0100.pt` (~2.8GB)
- 删除 `best_success.pt` (~2.8GB)

保留：

- `config.json`
- `summary.json`
- `dataset_stats.json`
- `experiment_manifest.json`
- `success_eval_history.json`
- `audit_report.json`
- `mdit_trial_request.json`

## 结论与下一步

本轮 screening 结果：**未通过**。

关键观察：

1. `valid/loss_grip = 1.0370` 显著偏高，gripper 行为学习完全失败
2. `grip_transition_acc = 0.0` 说明 gripper 没有学会任何开关切换
3. `grip_binary_acc = 1.0` 配合 `grip_transition_acc = 0.0` 表明模型只是预测了一个恒定的夹爪状态（始终开或始终关）
4. `planning_runtime_error` 占绝对主导，几乎所有 episode 都在早期步数内被规划器拒绝
5. 评估在 GPU 上直接完成（无 CPU fallback），说明显存充足，失败原因纯为策略质量问题

**注意**：本轮已严格按 `batch_size=8` 执行，无 recipe drift。

这意味着：即使将旧高漂移主线的所有变体回退到 `obs2 + a16 + shared encoder + no AMP + faithful recipe`，MDIT 在此任务上仍然无法通过 100 epoch 的最低成功率闸门。后续若要继续攻关，可能需要跳出当前固定配置，重新审视 vision backbone、条件注入方式或数据增强策略。
