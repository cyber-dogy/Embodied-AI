# 2026-04-12 MDIT Autoresearch 执行记录

## 背景

旧主线 `rgb5_sep_lastblock_a8_lr2e5 / lr1p5e5 / dropout0` 已经不再作为本轮主研究方向。

当前主线固定为：

- `5RGB + obs3 + text`
- `vision.train_mode = "last_block"`
- `n_action_steps = 8`
- `transformer_variant = "pdit"`
- `pdit_backbone.final_layer_zero_init = true`
- `pdit_backbone.decoder_condition_mode = "mean_pool"`

对应配置：

- `configs/mdit/obs3_rgb5_pdittoken_lastblock_a8_gate100.json`

## 本轮改动

本轮只改一件事：

- 把 RGB 条件注入方式从旧的“flatten 全局向量 + AdaLN”改成 `PDIT` 风格的 token-conditioned encoder-decoder 路径

保持不变：

- `5RGB`
- `obs3`
- `text`
- `last_block`
- `a8`
- Flow Matching objective
- action postprocess

## 执行命令

### 训练

```bash
tmux new -s mdit_rgb5_pdittoken_last_a8

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
  --description "rgb5 pdittoken last_block a8 100ep" \
  --headless \
  --show-progress \
  --set batch_size=8 \
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

### 续训

```bash
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
  --description "resume rgb5 pdittoken last_block a8 100ep" \
  --headless \
  --show-progress \
  --set batch_size=8 \
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
  --set resume_from_latest=true
```

### audit-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/unplug_charger_mdit_rgb5_pdittoken_last_a8_100 \
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
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_pdittoken_last_a8_100/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --prefer-ema \
  --device cuda
```

## 环境

- GPU: 24GB 级别显卡
- 训练环境: `mdit_env`
- 本地评估环境: `pfp_env`

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

如果 success eval 发生 GPU `OOM`，现在应自动 CPU fallback。记录中必须能看到：

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
- 是否发生 CPU fallback
- 是否通过 100 epoch 闸门
- 保留了哪些 ckpt / 删除了哪些 ckpt

## 结论与下一步

本轮的唯一目标是回答：

- `RGB + last_block + text` 在切到 token-conditioned `PDIT` 条件路径后，是否明显好于旧的 `MDIT` 全局 AdaLN 条件路径

在拿到 `rgb5_pdittoken_lastblock_a8_lr2e5_100` 的有效 `success@20` 前，不再继续扩展新的 `lr/dropout` 搜索分支。
