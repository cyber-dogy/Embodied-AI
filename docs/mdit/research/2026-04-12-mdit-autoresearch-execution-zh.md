# 2026-04-12 MDIT Autoresearch 执行记录

## 背景

旧主线 `rgb5_sep_lastblock_a8_*` 不再作为本轮主研究方向。

当前唯一主线固定为：

- `5RGB + text + last_block`
- `transformer_variant = "pdit"`
- `obs2`
- `n_action_steps = 16`
- shared vision encoder
- faithful 风格训练配方

对应配置：

- `configs/mdit/rgb5_shared_lastblock_pdittoken_obs2_a16_gate100.json`

## 本轮改动

本轮不是放弃 `5RGB + last_block`，而是把它放回更接近成功锚点的 recipe 里。

固定保留：

- `5RGB`
- `text`
- `last_block`
- `PDIT` token-conditioned 条件路径
- `gripper loss` 对齐修复
- `planning_runtime_error` / `simulator_runtime_error` 分桶
- success eval CPU fallback

固定回锚：

- `n_obs_steps = 2`
- `n_action_steps = 16`
- `use_separate_encoder_per_camera = false`
- `use_amp = false`
- `batch_size = 8`
- `grad_accum_steps = 4`
- `sigma_min = 0.0`
- `num_integration_steps = 50`
- `optimizer_betas = [0.95, 0.999]`
- `optimizer_weight_decay = 0.0`
- `smooth_actions = false`

## 执行命令

### 训练

```bash
tmux new -s mdit_rgb5_shared_last_pdittoken_a16

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
```

### 续训

```bash
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
  --description "resume rgb5 shared last_block pdittoken obs2 a16 100ep" \
  --headless \
  --show-progress \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full" \
  --set wandb_enable=true \
  --set wandb_mode="online" \
  --set resume_from_latest=true
```

### audit-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/unplug_charger_mdit_rgb5_shared_lastblock_pdittoken_obs2_a16_100 \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress
```

### 本地单 ckpt 评估

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_shared_lastblock_pdittoken_obs2_a16_100/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --prefer-ema \
  --device cuda
```

## 环境

- 训练环境：`mdit_env`
- 本地评估环境：`pfp_env`
- 本轮固定禁止显存探测
- 本轮固定 `batch_size = 8`

## 记录规则

本轮执行完成后，至少必须能看到：

- `ckpt/<run>/config.json`
- `ckpt/<run>/summary.json`
- `ckpt/<run>/dataset_stats.json`
- `ckpt/<run>/success_eval_history.json`
- `ckpt/<run>/audit_report.json`
- `ckpt/<run>/experiment_manifest.json`
- `ckpt/<run>/best_success.pt`（如果已经跑出 success）
- `ckpt/<run>/eval_results/*.json`（如果单独做过 checkpoint 评估）

如果 success eval 发生 GPU `OOM`，记录中必须能看到：

- `device_used`
- `cpu_fallback`
- `initial_device`

如果只有 wandb 曲线，没有本地 JSON 记录，视为执行不合格。

## 结果

当前文档作为本轮执行模板。正式实验结果请追加到本文件尾部，不要覆盖主线命令和记录规则。

追加格式固定为：

- 运行时间
- run 名称
- batch size
- success@20
- valid/loss_grip
- valid/grip_deadband_ratio
- valid/grip_transition_acc
- valid/grip_binary_acc
- planning_runtime_error 次数
- simulator_runtime_error 次数
- 是否发生 CPU fallback
- 是否通过 100 epoch 闸门
- 保留了哪些 ckpt / 删除了哪些 ckpt

## 结论与下一步

本轮的唯一目标是回答：

- `5RGB + text + last_block` 在 faithful 风格 recipe 下，走 `PDIT` token-conditioned 条件路径后，是否明显优于旧的高漂移主线

在拿到 `rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100` 的有效 `success@20` 前，不再继续扩展新的 `lr/dropout` 搜索分支。
