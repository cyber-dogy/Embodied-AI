# 2026-04-15 MDIT Faithful RGB5 FM 执行手册（v4）

## 0. 执行纪律（强制）

本文档是执行手册，不是讨论稿。  
下游 agent 只允许执行，不允许自行改主线方向。

硬规则：

- 必须通过 `scripts/run_mdit_autoresearch_trial.py` 或 `scripts/run_mdit_autoresearch_loop.py` 执行
- 必须在 `tmux` 后台运行，禁止 SSH 前台长挂
- 主线只允许 `text + 5RGB + original MDIT backbone + FM`
- 主线训练禁止 `use_pcd=true`
- 主线训练禁止 `transformer_variant="pdit"`
- 主线训练禁止 `ema_enable=true`
- legacy 配置 `obs3_* / pdittoken_* / pcd_ablation*` 只允许做读取与审计，不允许继续当主线训练
- 所有训练 run 必须有 `wandb_run_id` 和 `wandb_run_url`；缺任一字段视为无效 run
- 主结论先看 `success@20`，禁止用 `valid loss` 替代
- 不允许私自扩搜索空间
- 所有新增修复记录必须追加到 `docs/fixes.md` 尾部，带完整时间戳

## 1. 本轮目标（锁定）

本轮主线固定为：

- `text + 5RGB + MDIT + FM`
- `obs2 / horizon100 / action24`
- `shared vision encoder + last_block`
- `raw model eval`
- `wandb online`

唯一主线配置：

- `configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json`

faithful 基座配置：

- `configs/mdit/faithful_baseline.json`

## 2. 当前代码已固定的行为

下列行为已经写进代码，不需要下游再自行猜：

- `mdit/config/schema.py`
  - 默认值已回到 `n_obs_steps=2`、`horizon=100`、`n_action_steps=24`
  - `ema_enable=false`
  - 默认 `transformer_variant="mdit"`
  - 增加 `drop_n_last_frames`、`observation_delta_indices`、`action_delta_indices`
- `mdit/data/dataset.py`
  - 采样已切回 `anchor + delta_indices + drop_n_last_frames`
  - 不再使用旧的整段 `sequence_length=horizon` 平铺窗口语义
- `mdit/model/model.py` + `mdit/model/observation_encoder.py`
  - 主线是 faithful RGB+text MDIT conditioning
  - legacy `pdit/pcd` 仅保留读取兼容，不是主线训练路径
- `mdit/train/runner.py` + `mdit/train/eval.py`
  - 主线训练、valid、success eval 全部走 raw weights
  - 训练内 success eval 子进程默认显式传 `--no-prefer-ema`
- `mdit/cli/eval_checkpoint.py` + `mdit/cli/eval_all_checkpoints.py`
  - 默认 `prefer_ema=false`
  - 只有 legacy 审计时才允许显式 `--prefer-ema`
- `research/mdit_trial_runner.py`
  - 主线 trial 强制 `wandb_enable=true`
  - 主线 trial 强制 `wandb_mode="online"`
  - 若训练完成后没有 `wandb_run_id/url`，trial 直接记为无效
- `research/mdit_autoresearch_loop.py`
  - 默认不再自动切换到 `obs3/pdit/pcd`
  - 默认只跑一个 faithful baseline + 3 个资源探测 spec

## 3. 固定默认值（主线配方）

- `camera_names = [right_shoulder, left_shoulder, overhead, front, wrist]`
- `n_obs_steps = 2`
- `horizon = 100`
- `n_action_steps = 24`
- `transformer_variant = "mdit"`
- `vision.use_separate_encoder_per_camera = false`
- `vision.train_mode = "last_block"`
- `vision.resize_shape = [224, 224]`
- `batch_size = 8`
- `grad_accum_steps = 4`
- `num_workers = 8`
- `use_amp = true`
- `optimizer_lr = 2e-5`
- `optimizer_betas = [0.95, 0.999]`
- `optimizer_weight_decay = 0.0`
- `objective.sigma_min = 0.0`
- `objective.num_integration_steps = 50`
- `objective.loss_weights = {xyz: 1.0, rot6d: 1.0, grip: 1.0}`
- `command_mode = "first"`
- `smooth_actions = false`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`
- `rlbench_disable_task_validation = false`
- `success_selection_every_epochs = 20`
- `success_selection_episodes = 20`
- `checkpoint_every_epochs = 20`
- `delete_periodic_ckpts_after_success_eval = false`

## 3.1 GPU 资源利用接口（唯一允许的探测空间）

允许的资源探测只限这三组：

- `bs=8, grad_accum=4`
- `bs=12, grad_accum=3`
- `bs=16, grad_accum=2`

说明：

- 这是“资源校准接口”，不是开放搜索空间
- 这些覆盖会被 `experiment_manifest.json` 标成 `recipe_drift=true`
- `recipe_drift` 的锁定字段当前包括：
  - `batch_size`
  - `grad_accum_steps`
  - `camera_names`
  - `n_obs_steps`
  - `horizon`
  - `n_action_steps`
  - `observation_encoder.vision.train_mode`
- `recipe_drift=true` 的 run 不参与主线结论，只做资源探测或诊断

## 4. 训练与评估语义（必须一致）

### 4.1 训练语义

- 主线训练只认 raw model，不构建 EMA
- checkpoint 默认保存 raw `model_state_dict`
- new checkpoint 不依赖 `ema_state_dict`

### 4.2 RLBench 评估语义

- 默认 `rlbench_disable_task_validation=false`
- 默认 `smooth_actions=false`
- `smooth_actions=false` 时：
  - 保留 rot6d 正交化
  - 不做位置/旋转平滑
  - 不做 gripper hysteresis，直接使用原始 gripper 输出
- `smooth_actions=true` 时才启用平滑与 hysteresis

### 4.3 checkpoint 读取语义

- 主线默认：`--no-prefer-ema`
- legacy 审计：若旧 checkpoint 明确需要，才手动传 `--prefer-ema`

## 5. 闸门规则

### 5.1 100 epoch 硬闸门

- 看 `success@20`
- 若 `< 0.45`：停止，不续到 300
- 若 `>= 0.45`：允许续到 300

### 5.2 300 / 500 规则

- `300 epoch` 目标 `>= 0.55`
- `500 epoch` 目标 `>= 0.60`

### 5.3 100 episode 复核

满足以下任一条件时，必须补一次 `100 episodes` 复核：

- `100 epoch` 通过 0.45 闸门
- 你准备把该 run 记成主线候选
- 你准备从该 run 继续续训到 300 / 500

## 6. 标准命令（下游直接执行）

### 6.1 主线 100 epoch 完整 trial（推荐）

```bash
tmux new -s mdit_faithful_100

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/Myprojects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_lastblock_faithful_obs2_h100_a24_100"

python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb5_lastblock_faithful_obs2_h100_a24_100 \
  --run-name "$RUN_NAME" \
  --description "faithful mainline 100ep gate run" \
  --headless \
  --show-progress
```

### 6.2 仅训练，不立即离线审计

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/Myprojects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb5_lastblock_faithful_obs2_h100_a24_train_only \
  --run-name unplug_charger_mdit_rgb5_lastblock_faithful_obs2_h100_a24_train_only \
  --description "faithful mainline train-only" \
  --headless \
  --show-progress
```

### 6.3 资源探测（10 epoch）

三组只允许这样写：

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/Myprojects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --stage-epochs 10 \
  --checkpoint-every 10 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name rgb5_lastblock_bs12_acc3_probe10 \
  --run-name unplug_charger_mdit_rgb5_lastblock_bs12_acc3_probe10 \
  --description "throughput_probe faithful mdit bs12 acc3" \
  --headless \
  --show-progress \
  --set batch_size=12 \
  --set grad_accum_steps=3 \
  --set num_workers=8
```

另外两组：

- `bs=8, grad_accum=4`
- `bs=16, grad_accum=2`

命名必须和 loop 里的 spec 对齐：

- `rgb5_lastblock_bs8_acc4_probe10`
- `rgb5_lastblock_bs12_acc3_probe10`
- `rgb5_lastblock_bs16_acc2_probe10`

### 6.4 自动跑 baseline + 资源探测

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/Myprojects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_loop.py \
  --tag faithful_rgb5_mainline \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --device cuda \
  --headless \
  --show-progress
```

### 6.5 对已有 run 做离线审计

20 episode：

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/Myprojects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/unplug_charger_mdit_rgb5_lastblock_faithful_obs2_h100_a24_100 \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress
```

100 episode：

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/unplug_charger_mdit_rgb5_lastblock_faithful_obs2_h100_a24_100 \
  --eval-episodes 100 \
  --audit-timeout-sec 21600 \
  --headless \
  --show-progress
```

### 6.6 单 checkpoint 直接评估

主线 raw：

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/Myprojects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<run>/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --device cuda \
  --headless \
  --show-progress \
  --no-prefer-ema
```

legacy 审计需要时才允许：

```bash
python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<legacy_run>/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --device cuda \
  --headless \
  --show-progress \
  --prefer-ema
```

PDIT 历史高成功基线复核（用于先验证评估链路本身）：

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_pdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epochs/epoch_0500.pt \
  --strategy fm \
  --episodes 20 \
  --max-steps 200 \
  --device cuda \
  --headless \
  --show-progress \
  --prefer-ema
```

### 6.7 全 checkpoint 评估

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/Myprojects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_all_checkpoints.py \
  --ckpt-epochs-dir ckpt/<run>/epochs \
  --results-json ckpt/<run>/audit_raw_results.json \
  --episodes 20 \
  --seed 1234 \
  --max-steps 200 \
  --device cuda \
  --headless \
  --show-progress \
  --no-prefer-ema
```

## 7. 结果不理想时的固定改进路径

禁止“看着像哪里不对就到处改”。  
必须按下面顺序处理。

### 7.1 先确认是不是链路问题

优先检查：

1. `summary.json`
2. `experiment_manifest.json`
3. `success_eval_history.json`
4. `audit_report.json`
5. `wandb_run_id`
6. `wandb_run_url`

如果发现：

- 没有 `wandb_run_id/url`
- `recipe_drift=true` 但你把它当主线结论
- 评估命令误用了 `--prefer-ema`

先判定为执行问题，不进入结构讨论。

### 7.2 如果 GPU 没吃满

只允许改：

- `batch_size`
- `grad_accum_steps`

顺序固定：

1. `bs=12, grad_accum=3`
2. `bs=16, grad_accum=2`

不允许顺手同时改：

- 学习率
- `n_obs_steps`
- `horizon`
- `n_action_steps`
- 相机数

### 7.3 如果 `success=0` 且 `planning_runtime_error` 很高

先怀疑动作语义，不先怪 simulator。

优先看这些文件：

- `mdit/model/model.py`
- `mdit/model/action_postprocess.py`
- `mdit/train/eval.py`
- `envs/rlbench_env.py`

优先核查：

- 是否主线用了 raw 而不是 EMA
- 是否 `smooth_actions=false`
- 是否 `command_mode="first"`
- 是否错误分桶把 planner reject 当成 simulator crash

### 7.4 如果 `grip_binary_acc` 还行，但 `grip_transition_acc` 很差

优先改：

1. `objective.loss_weights.grip = 2.0`
2. 若仍差，再试 `3.0`

改动位置：

- 配置覆盖：`--set objective.loss_weights='{\"xyz\":1.0,\"rot6d\":1.0,\"grip\":2.0}'`
- 代码观察点：
  - `mdit/model/objectives.py`
  - `mdit/train/eval.py`
  - `mdit/model/model.py`

### 7.5 如果 `valid loss` 看着还行，但 success 很差

优先检查：

- raw / EMA load path 是否一致
- best checkpoint 选择逻辑是否来自 success audit
- 训练内 success eval 与离线 audit 是否都用了 `--no-prefer-ema`

看这些文件：

- `mdit/train/checkpoints.py`
- `mdit/train/eval.py`
- `mdit/cli/eval_checkpoint.py`
- `mdit/cli/eval_all_checkpoints.py`

### 7.6 100 epoch 仍未过 0.45 之后才允许讨论的方向

只有在完成以下三步后，才允许讨论结构层改动：

1. 跑过 faithful baseline 100ep
2. 跑过资源探测 `8/12/16`
3. 跑过至少一个 `grip weight` 修复分支

再往后才允许单开新文档讨论：

- 更换 vision train_mode
- 更换 shared / separate encoder
- 改时间配方
- 重新引入 legacy `pdit/pcd` 对照

## 8. 改哪里（文件映射）

### 8.1 配置与主线校验

- `mdit/config/schema.py`
- `mdit/config/loader.py`
- `configs/mdit/faithful_baseline.json`
- `configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json`

### 8.2 数据与时间语义

- `mdit/data/dataset.py`

### 8.3 模型与动作输出

- `mdit/model/observation_encoder.py`
- `mdit/model/model.py`
- `mdit/model/action_postprocess.py`
- `mdit/model/objectives.py`

### 8.4 训练 / 评估 / checkpoint

- `mdit/train/runner.py`
- `mdit/train/eval.py`
- `mdit/train/checkpoints.py`
- `mdit/cli/train.py`
- `mdit/cli/eval_checkpoint.py`
- `mdit/cli/eval_all_checkpoints.py`

### 8.5 autoresearch 托管层

- `mdit/cli/run_autoresearch_trial.py`
- `research/mdit_trial_runner.py`
- `research/mdit_autoresearch_loop.py`
- `scripts/run_mdit_autoresearch_loop.py`

## 9. 每轮必须汇报的字段

- `run_name`
- `wandb_run_id`
- `wandb_run_url`
- `success@20`
- `success@100`（若做了 100ep audit）
- `valid/loss_total`
- `valid/loss_grip`
- `valid/grip_deadband_ratio`
- `valid/grip_transition_acc`
- `batch_size`
- `grad_accum_steps`
- `effective_batch = batch_size * grad_accum_steps`
- `gpu_name`
- `memory_used_gb`
- `memory_free_gb`
- `device_used`
- `cpu_fallback`
- `recipe_drift`
- `recipe_drift_details`
- `planning_runtime_error` 占比
- `simulator_runtime_error` 占比
- 已删除与已保留文件清单

## 10. 磁盘控制（强制）

总原则：保留结论文件，按需清理大 ckpt。

失败或非最终主线，至少保留：

- `config.json`
- `summary.json`
- `dataset_stats.json`
- `experiment_manifest.json`
- `success_eval_history.json`
- `audit_report.json`
- `mdit_trial_request.json`

若 run 进入候选主线，额外保留：

- `best_success.pt`
- `latest.pt`

禁止项：

- 不允许评估前删待评估 ckpt
- 不允许只留 wandb 不留本地 JSON
- 不允许删掉最终主线的 `best_success.pt`

## 11. 当前验收口径

本轮首先验收三件事，不是先看最终成功率：

1. 主线代码是否单义
2. 训练 / 评估 / 选模 / 审计 是否一致
3. 结果是否可复核、可留痕、可解释

只有这三件事稳定后，`success@20 / success@100` 才是可信指标。
