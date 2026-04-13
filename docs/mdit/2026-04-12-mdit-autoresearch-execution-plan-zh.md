# 2026-04-12 MDIT Autoresearch 执行计划

## 0. 执行纪律

本文档是执行手册，不是讨论稿。

执行 agent 只允许照本文档执行，不允许自行扩展搜索空间，不允许自行改 recipe，不允许自行改阈值，不允许自行改保留策略。

固定禁止项：

- 不允许把 `5RGB` 改成别的相机组合
- 不允许把 `obs3` 改成别的 observation window
- 不允许把 `n_action_steps` 改成 `1` 或 `16`
- 不允许把 `vision.train_mode` 改回 `all`
- 不允许把 `lr/dropout` 重新当作本轮第一优先级
- 不允许把 `best_valid.pt` 当作主选模依据
- 不允许跳过 `tmux`

所有训练必须放在 `tmux` 后台。所有筛选必须以 `success@20` 为准。

## 1. 本轮结论

本轮主线不再是 `rgb5_sep_lastblock_a8_lr2e5 / lr1p5e5 / dropout0`。

本轮唯一主线改为：

- `rgb5_pdittoken_lastblock_a8_lr2e5_100`

这条线保持不变的部分：

- `5RGB + obs3 + text`
- `vision.use_separate_encoder_per_camera = true`
- `vision.train_mode = "last_block"`
- `horizon = 32`
- `n_action_steps = 8`
- `smooth_actions = true`
- `command_mode = "first"`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`

本轮唯一改变的是：

- 条件如何进入 transformer
- 不再走 “RGB+TEXT+obs3 flatten 成全局向量再 AdaLN 调制” 的旧路径
- 直接改成 `PDIT` 风格的 token-conditioned encoder-decoder 条件路径

## 2. 为什么主线切到 PDIT 条件路径

当前 `MDIT` 的主问题已经明确：

- `RGB+TEXT+obs3` 先被拼成大 token
- 再被 flatten 成一个全局 conditioning 向量
- transformer 只通过 AdaLN 接收这个全局向量
- observation token 结构被丢失

所以本轮不再继续扫 `lr` / `dropout` 作为主方向。

本轮必须认定：

- `output_proj` 零初始化是重要 bug，但不是根因
- `lr=1.5e-5` 那条分支曾因评估 `OOM` 失真，不能当作结构结论
- 现在要验证的是“把 RGB 条件路径改成 token-conditioned 之后，是否明显优于当前 `success@20 ≈ 0.2` 的基线”

## 3. 固定默认值

执行 agent 必须使用以下固定默认值：

- `camera_names = [right_shoulder, left_shoulder, overhead, front, wrist]`
- `n_obs_steps = 3`
- `horizon = 32`
- `n_action_steps = 8`
- `transformer_variant = "pdit"`
- `vision.use_separate_encoder_per_camera = true`
- `vision.train_mode = "last_block"`
- `vision.resize_shape = [240, 240]`
- `optimizer_lr = 2e-5`
- `objective.sigma_min = 0.001`
- `objective.num_integration_steps = 25`
- `smooth_actions = true`
- `command_mode = "first"`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`
- `success_selection_every_epochs = 100`
- `success_selection_episodes = 20`
- `pdit_backbone.final_layer_zero_init = true`
- `pdit_backbone.decoder_condition_mode = "mean_pool"`

如果命令行 override 与上表冲突，除非本文档明确允许，否则视为错误命令。

## 4. 固定配置文件

本轮唯一允许作为主线起点的配置文件：

- `configs/mdit/obs3_rgb5_pdittoken_lastblock_a8_gate100.json`

该配置固定含义：

- 保留 `5RGB + obs3 + last_block + text + a8`
- 只把 `transformer_variant` 切到 `"pdit"`
- 只把 `pdit_backbone.final_layer_zero_init` 和 `decoder_condition_mode` 设成主线值

不允许再把 `configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json` 当作本轮主线。

## 5. 训练与评估流程

### 5.1 本轮唯一 screening 分支

本轮首轮 screening 只跑 1 条：

- `rgb5_pdittoken_lastblock_a8_lr2e5_100`

在拿到这条结果前，不允许再开新的 `lr/dropout` 分支。

### 5.2 100 / 300 / 500 epoch 闸门

- `100 epoch` 必须跑 `20 episodes`
- 如果 `success@20 < 0.45`：立即停止，不续到 `300`
- 如果 `success@20 >= 0.45`：允许续到 `300`
- `300 epoch` 必须继续跑 `20 episodes`
- 如果 `success@20 < 0.55`：立即停止，不续到 `500`
- 如果 `success@20 >= 0.55`：允许续到 `500`
- `500 epoch` 目标是 `success@20 >= 0.60`

不允许因为 `valid loss` 更低而跳过 `success gate`。

### 5.3 success eval OOM 规则

训练内 success eval 现在固定按以下规则运行：

1. 先在配置指定的 device 上执行隔离子进程评估
2. 如果评估子进程报 `CUDA out of memory`
3. 自动重试一次 `--device cpu`
4. 结果必须写入 `success_eval_history.json`

记录规则固定为：

- `device_used`: 最终评估使用的设备
- `cpu_fallback`: 是否发生 CPU fallback
- `initial_device`: 如果发生 fallback，记录原始设备

如果 CPU fallback 也失败，记录里必须有完整错误文本，不能只写空值。

## 6. 标准命令模板

### 6.1 训练命令

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

显存探测只允许改 `batch_size`，其他不动。

### 6.2 续训命令

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

### 6.3 audit-only 命令

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

### 6.4 本地单 checkpoint 评估命令

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

## 7. 评估记录规则

执行 agent 必须检查并保留以下评估记录：

- 单 checkpoint 评估默认写到 `ckpt/<run>/eval_results/`
- `audit-only` 必须生成 `audit_report.json`
- 训练内 success eval 必须更新 `success_eval_history.json`
- `wandb` 中必须有 success 曲线

每轮必须检查这些文件存在：

- `config.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json`
- `audit_report.json`
- `experiment_manifest.json`
- `best_success.pt`（如果该轮已有成功率结果）
- `latest.pt`（如果允许 resume）

如果发生 CPU fallback，`success_eval_history.json` 里必须能看到：

- `device_used = "cpu"`
- `cpu_fallback = true`
- `initial_device = "cuda"` 或对应原设备

若某轮只有 `wandb` 曲线，没有本地 JSON 记录，视为该轮不合格。

## 8. 磁盘与检查点清理规则

总原则：

- 除最终最优主路线外，其它分支默认按“保留结论，不保留大文件”处理

具体规则：

### 8.1 非最优分支

在完成 success eval 并把结果写入：

- `wandb`
- `success_eval_history.json`
- `audit_report.json`

之后，周期性 ckpt 可以删除。

失败分支最多保留：

- `config.json`
- `experiment_manifest.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json`
- `audit_report.json`
- `latest.pt`（可选）

### 8.2 成功但不是最终主路线的分支

也允许清理大部分周期性 ckpt，只保留能说明结论的最小证据集，不要求完整保留所有 epoch ckpt。

### 8.3 最终最优主路线

必须保留：

- `best_success.pt`
- `latest.pt`
- `config.json`
- `experiment_manifest.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json`
- `audit_report.json`

如果空间允许，可额外保留：

- `epoch_0100.pt`
- `epoch_0300.pt`
- `epoch_0500.pt`

明确禁止：

- 不允许在评估前删除待评估 ckpt
- 不允许删除最终最优主路线的 `best_success.pt`
- 不允许只保留 `best_valid.pt` 而删除 `best_success.pt`

## 9. 排查顺序

执行 agent 遇到异常时，必须按以下顺序排查：

1. 先检查 import / environment / requirement 是否缺依赖
2. 再检查 checkpoint payload 与 resume / eval 兼容性
3. 再检查 success eval 是否被错误关闭，或是否发生 GPU OOM 后未触发 CPU fallback
4. 再检查 batch size / AMP / OOM 与 GPU 利用率
5. 最后才考虑模型结构本体

如果出现“valid loss 反弹 + success 很差”，默认先怀疑：

- 旧的全局 AdaLN 条件路径仍在被误用
- success-based 选模没有真正执行
- rollout 配置与训练 recipe 不一致

默认不要第一时间归因为 `PDIT backbone` 本身失败。

## 10. 交给 autoresearch 的固定指令

autoresearch 本轮只允许执行这条主线：

- `rgb5_pdittoken_lastblock_a8_lr2e5_100`

在这条结果出来前，不允许：

- 继续扫 `lr`
- 继续扫 `dropout`
- 继续扫 `all finetune`
- 回退到旧的 `rgb5_sep_lastblock_a8_*` 三分支

本轮的目标只有一个：

- 拿到一个有效的 `success@20`
- 判断 token-conditioned 条件路径是否显著好于当前 `success@20 ≈ 0.2` 的旧基线
