# 2026-04-12 MDIT Autoresearch 执行计划

## 0. 执行纪律

本文档是执行手册，不是讨论稿。

执行 agent 只允许照本文档执行，不允许自行改 recipe、改阈值、改搜索空间、改保留策略。

固定禁止项：

- 不允许把当前主线改回旧的 `obs3 + a8 + separate encoder + AMP + fast FM`
- 不允许把 `mdit/pcd_ablation_pdit_transformer` 误写成 `PDIT` 成功配方复现
- 不允许把 `valid loss` 当主判断依据
- 不允许把 `V-REP side -1` 统统当成 simulator 崩溃
- 不允许做显存探测或自动循环尝试 batch size
- 不允许自行扩展新的 `lr/dropout` 分支
- 不允许在训练启动后不检查 GPU/ckpt 写入状态

所有训练必须放在 `tmux` 后台。所有筛选必须以 `success@20` 为准。

## 1. 本轮唯一主线

本轮唯一主线固定为：

- `rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100`

对应唯一允许作为主线起点的配置文件：

- `configs/mdit/rgb5_shared_lastblock_pdittoken_obs2_a16_gate100.json`

这条主线保留的用户核心诉求：

- `5RGB`
- `text`
- `last_block`

这条主线固定采用的训练 recipe：

- `transformer_variant = "pdit"`
- `n_obs_steps = 2`
- `n_action_steps = 16`
- `vision.use_separate_encoder_per_camera = false`
- `use_amp = false`
- `batch_size = 8`
- `grad_accum_steps = 4`
- `optimizer_lr = 2e-5`
- `optimizer_betas = [0.95, 0.999]`
- `optimizer_weight_decay = 0.0`
- `objective.sigma_min = 0.0`
- `objective.num_integration_steps = 50`
- `objective.loss_weights = {xyz: 1.0, rot6d: 1.0, grip: 1.0}`
- `smooth_actions = false`

## 2. 为什么主线回锚

本轮不是放弃 `5RGB + last_block`，而是把它们放回更接近成功锚点的训练栈里。

固定解释口径：

- 后续低成功率不是“因为改成了 `5RGB + last_block`”
- 更准确的原因是：旧主线一次性叠加了 `obs3 / a8 / separate encoder / AMP / 更小有效 batch / 更快 FM 设置 / rollout 平滑` 等多项高影响变化
- 对旧 `MDIT` 来说，较好的 faithful 基线更像是“更保守、更适配旧 MDIT 条件路径的 recipe”
- 对整个项目来说，真正高成功率主线仍然是 `PDIT`，而且不是运气

执行 agent 固定禁止这样写：

- “验证了 `last_block` 一定更差”
- “验证了 `5RGB` 一定更差”
- “faithful 基线更好只是运气”

## 3. 条件注入复杂度硬约束

本轮目标不是继续放大条件容量，而是把 `5RGB + text` 放进更稳定的 token-conditioned 条件路径里。

硬约束：

- 主线只允许 `obs2`
- text 只保留 `1` 个全局 token
- 不允许把 text 复制到每个 obs step
- 不允许增加 `camera embedding`
- 不允许增加 `modality embedding`
- 不允许增加 `cross-attn`
- 不允许把 RGB 条件重新 flatten 成全局向量喂 AdaLN
- 主线必须走 `transformer_variant = "pdit"`

当前主线的条件 token 数固定为：

- `obs2 * (1 state + 5 camera) + 1 text = 13`

执行 agent 不得改变这个设计。

## 4. 不得回退的已修复项

本轮不得回退以下修复：

- `gripper` 分项加权 loss
- `valid` 侧 gripper 诊断指标
- `planning_runtime_error` 与 `simulator_runtime_error` 分桶
- `V-REP side -1` 走插值回退
- success eval `CUDA OOM -> CPU fallback`
- `fixes.md` 必须带完整时间戳并在文件尾部追加

## 5. 固定默认值

执行 agent 必须使用以下固定默认值：

- `camera_names = [right_shoulder, left_shoulder, overhead, front, wrist]`
- `n_obs_steps = 2`
- `horizon = 32`
- `n_action_steps = 16`
- `transformer_variant = "pdit"`
- `vision.use_separate_encoder_per_camera = false`
- `vision.train_mode = "last_block"`
- `vision.resize_shape = [224, 224]`
- `batch_size = 8`
- `grad_accum_steps = 4`
- `num_workers = 8`
- `use_amp = false`
- `optimizer_lr = 2e-5`
- `optimizer_betas = [0.95, 0.999]`
- `optimizer_weight_decay = 0.0`
- `objective.sigma_min = 0.0`
- `objective.num_integration_steps = 50`
- `objective.loss_weights = {xyz: 1.0, rot6d: 1.0, grip: 1.0}`
- `smooth_actions = false`
- `command_mode = "first"`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`
- `pdit_backbone.final_layer_zero_init = true`
- `pdit_backbone.decoder_condition_mode = "mean_pool"`
- `success_selection_every_epochs = 100`
- `success_selection_episodes = 20`

关于 batch size 的固定规则：

- 本轮默认 `batch_size = 8`
- 不做显存探测
- 不允许 agent 自己循环尝试 `6/8/10/12/...`
- 只有用户明确要求时，才允许手动改 batch
- 如果 `batch_size = 8` 仍然 OOM，直接停止并汇报，不允许 agent 自行继续降配或重试

## 6. 训练与评估流程

### 6.1 本轮唯一 screening 分支

本轮首轮 screening 只跑 1 条：

- `rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100`

在拿到这条结果前，不允许再开新的 `lr/dropout` 分支。

### 6.2 100 / 300 / 500 epoch 闸门

- `100 epoch` 必须跑 `20 episodes`
- 如果 `success@20 < 0.45`：立即停止，不续到 `300`
- 如果 `success@20 >= 0.45`：允许续到 `300`
- `300 epoch` 必须继续跑 `20 episodes`
- 如果 `success@20 < 0.55`：立即停止，不续到 `500`
- 如果 `success@20 >= 0.55`：允许续到 `500`
- `500 epoch` 目标是 `success@20 >= 0.60`

不允许因为 `valid loss` 更低而跳过 `success gate`。

### 6.3 训练启动后的双重确认

启动训练后必须同时确认：

1. `nvidia-smi` 里 Python 进程已真实占用显存
2. `ckpt/<run>/epochs/` 开始产生写入，或 tmux 出现 `mdit train epoch N:` 进度输出

如果只看到 CPU 占用、没有显存、没有 ckpt、没有训练进度，按“僵尸启动”处理，不能当作训练已经正常开始。

### 6.4 success eval OOM 规则

训练内 success eval 固定按以下规则运行：

1. 先在配置指定的 device 上执行隔离子进程评估
2. 如果评估子进程报 `CUDA out of memory`
3. 自动重试一次 `--device cpu`
4. 结果必须写入 `success_eval_history.json`

记录中必须能看到：

- `device_used`
- `cpu_fallback`
- `initial_device`

如果 CPU fallback 也失败，必须有完整错误文本，不能只写空值。

## 7. 标准命令模板

### 7.1 训练命令

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

### 7.2 续训命令

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

### 7.3 audit-only

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

### 7.4 本地单 ckpt 评估

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

## 8. 评估记录与磁盘清理规则

单 checkpoint 评估默认保存到：

- `ckpt/<run>/eval_results/`

`audit-only` 必须生成：

- `audit_report.json`

训练内 success eval 必须更新：

- `success_eval_history.json`

每轮必须检查这些文件存在：

- `config.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json`
- `audit_report.json`
- `experiment_manifest.json`
- `best_success.pt`（如果已有成功率结果）

如果只有 wandb 曲线，没有本地 JSON 记录，视为执行不合格。

磁盘清理规则：

- 必须注意磁盘空间
- 评估完成后，除最终最优主路线外，其他分支默认按“保留结论，不保留大文件”处理
- 非最优分支只保留：
  - `config.json`
  - `summary.json`
  - `dataset_stats.json`
  - `experiment_manifest.json`
  - `success_eval_history.json`
  - `audit_report.json`
  - `latest.pt`（可选）
- 不允许在评估前删除待评估 ckpt
- 不允许删除最终最优主路线的 `best_success.pt`

## 9. 本轮必须汇报的指标

除了 `success@20`，后续 autoresearch 汇报必须同时记录：

- `valid/loss_grip`
- `valid/grip_deadband_ratio`
- `valid/grip_transition_acc`
- `valid/grip_binary_acc`
- `failure_error_buckets.planning_runtime_error`
- `failure_error_buckets.simulator_runtime_error`
- 是否触发 `cpu_fallback`

## 10. 结果解释规则

本轮如果结果仍然不理想，固定解释顺序是：

1. 先看是否真的按新主线 recipe 运行
2. 再看 `grip` 诊断是否明显恶化
3. 再看 `planning_runtime_error` 是否占主导
4. 最后才讨论结构问题

固定禁止的解释方式：

- “因为 `5RGB + last_block` 天然更差”
- “只看 valid loss 就能证明这轮失败”
- “评估里有 `V-REP side -1` 就说明 simulator 坏了”
