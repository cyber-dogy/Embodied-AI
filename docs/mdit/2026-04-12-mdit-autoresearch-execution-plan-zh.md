# MDIT 5RGB + obs3 Autoresearch 执行计划

## 1. 目标和硬约束

- 硬约束不允许改：
  - 必须保留 `5RGB`
  - 必须保留 `obs3`
- 允许改：
  - 学习率
  - weight decay
  - `sigma_min`
  - `num_integration_steps`
  - encoder 是否 shared / separate
  - vision `train_mode`
  - batch / grad_accum
  - success-rate 评估与 checkpoint 清理策略

## 2. 本轮已经落到代码里的改动

- 已补回缺失的 `configs/mdit/faithful_baseline.json`，现在 `obs3_rgb5_flowmatch_pdit_first.json` 可以正常继承。
- MDIT 配置已补齐以下字段：
  - `success_selection_every_epochs`
  - `success_selection_episodes`
  - `standard_eval_episodes`
  - `smooth_actions`
  - `command_mode`
  - `horizon_index`
  - `average_first_n`
  - `position_alpha`
  - `rotation_alpha`
  - `max_position_step`
  - `gripper_open_threshold`
  - `gripper_close_threshold`
  - `delete_periodic_ckpts_after_success_eval`
- MDIT 运行时推理已接入动作后处理：
  - rot6d 重正交化
  - gripper hysteresis threshold
  - 可选位置/旋转平滑
- 训练环已支持：
  - 每 `N` epoch 做一次 RLBench success-rate 评估
  - 写入 `best_success.pt`
  - 写入 `success_eval_history.json`
  - 记录到 W&B
  - 可选在评估后删除 periodic checkpoint
- `run_mdit_autoresearch_trial.py --phase train-only` 现在默认会把
  - `success_selection_every_epochs = checkpoint_every`
  - `success_selection_episodes = eval_episodes`
  自动带进去

## 3. 这次执行时不要混用的两种工作流

### 工作流 A：推荐，单进程 train-only 自带评估

- 用 `scripts/run_mdit_autoresearch_trial.py --phase train-only`
- 训练过程中自动做 `20 episode` success 评估
- 可以打开 `delete_periodic_ckpts_after_success_eval=true`
- 适合这次长训和控磁盘

### 工作流 B：旧的 attached watch 外挂审计

- 用 `scripts/run_mdit_autoresearch_loop.py --attach-run-dir ...`
- 它依赖 periodic checkpoint 还留在磁盘上
- 如果你开了 `delete_periodic_ckpts_after_success_eval=true`，不要再同时开 attached watch

本轮统一使用工作流 A，不要混用。

## 4. 环境准备

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
```

## 5. 开跑前先做的两件事

### 步骤 1：先审当前已有 5RGB 长训，不要直接重训

先看旧 run 在新动作后处理下是否已经有提升。

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_sep_all_500/latest.pt \
  --episodes 20 \
  --max-steps 200 \
  --heartbeat-every 50 \
  --headless \
  --show-progress \
  --device cuda
```

如果 `20 episode success_rate >= 0.45`，先不要起新训练，直接继续做更长评估和 best checkpoint 审计。

如果 `< 0.45`，再进入下面的训练计划。

### 步骤 2：确认这几个文件会持续更新

- `ckpt/<run_name>/latest.pt`
- `ckpt/<run_name>/best_success.pt`
- `ckpt/<run_name>/summary.json`
- `ckpt/<run_name>/success_eval_history.json`

如果训练到了 `100 epoch`，但 `success_eval_history.json` 还没写出来，说明代码路径没走通，要立刻停下检查。

## 6. 推荐起跑配方

### 方案 A：shared encoder，全量微调，优先级最高

这是本轮推荐的第一条 5RGB 主线，不要先从 `separate encoder + all finetune` 开始。

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

RUN_NAME="unplug_charger_mdit_rgb5_shared_all_eval20_500__$(date +%Y%m%d_%H%M%S)"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name obs3_rgb5_shared_all_eval20_500 \
  --run-name "$RUN_NAME" \
  --description "5RGB obs3 shared encoder all-finetune with in-training RLBench eval" \
  --set batch_size=16 \
  --set grad_accum_steps=1 \
  --set num_workers=8 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=false \
  --set observation_encoder.vision.train_mode=\"all\" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set optimizer_lr=2e-5 \
  --set optimizer_weight_decay=1e-4 \
  --set optimizer_betas=[0.9,0.999] \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set smooth_actions=true \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=\"full\" \
  --set delete_periodic_ckpts_after_success_eval=true \
  --set resume_from_latest=false
```

### 方案 B：shared encoder，只开 last_block

如果方案 A 在 `100 epoch` 明显不动，再试这个。

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

RUN_NAME="unplug_charger_mdit_rgb5_shared_lastblock_eval20_500__$(date +%Y%m%d_%H%M%S)"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name obs3_rgb5_shared_lastblock_eval20_500 \
  --run-name "$RUN_NAME" \
  --description "5RGB obs3 shared encoder last-block finetune with in-training RLBench eval" \
  --set batch_size=24 \
  --set grad_accum_steps=1 \
  --set num_workers=8 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=false \
  --set observation_encoder.vision.train_mode=\"last_block\" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set optimizer_lr=3e-5 \
  --set optimizer_weight_decay=1e-4 \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set smooth_actions=true \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=\"full\" \
  --set delete_periodic_ckpts_after_success_eval=true \
  --set resume_from_latest=false
```

### 方案 C：separate encoder，但不要一上来 all finetune

只有当 shared encoder 明显不行，再试。

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

RUN_NAME="unplug_charger_mdit_rgb5_sep_lastblock_eval20_500__$(date +%Y%m%d_%H%M%S)"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_lastblock_eval20_500 \
  --run-name "$RUN_NAME" \
  --description "5RGB obs3 separate encoders last-block finetune with in-training RLBench eval" \
  --set batch_size=8 \
  --set grad_accum_steps=1 \
  --set num_workers=8 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode=\"last_block\" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set optimizer_lr=2e-5 \
  --set optimizer_weight_decay=1e-4 \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set smooth_actions=true \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=\"full\" \
  --set delete_periodic_ckpts_after_success_eval=true \
  --set resume_from_latest=false
```

## 7. 断点续训命令

只允许在同一个 `RUN_NAME` 上续训，不要新建目录续旧权重。

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

RUN_NAME="<同一个 run_name>"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name <同一个 experiment_name> \
  --run-name "$RUN_NAME" \
  --description "resume existing 5RGB obs3 run" \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=\"full\" \
  --set delete_periodic_ckpts_after_success_eval=true \
  --set resume_from_latest=true
```

## 8. 100/200/300/500 epoch 判定规则

### 100 epoch

- `success_rate >= 0.45`
  - 继续
- `0.30 <= success_rate < 0.45`
  - 允许继续到 200
  - 但要记为“黄灯”
- `success_rate < 0.30`
  - 直接停
  - 这个配方不要继续烧到 500

### 200 epoch

- `max(success@100, success@200) >= 0.45`
  - 继续
- `< 0.45`
  - 停掉，切下一条配方

### 300 epoch

- 如果比历史最好值回落超过 `0.05`
  - 标记为退化
  - 除非 loss / rollout 证据非常明确，否则优先停

### 500 epoch

- 保留：
  - `best_success.pt`
  - `latest.pt`
  - `summary.json`
  - `success_eval_history.json`
- 最终只对 `best_success.pt` 做一次更长评估

## 9. 最终评估命令

训练结束后，只评估 `best_success.pt`，不要再对已经删掉的 periodic ckpt 做追补。

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<run_name>/best_success.pt \
  --episodes 100 \
  --max-steps 200 \
  --heartbeat-every 50 \
  --headless \
  --show-progress \
  --device cuda
```

## 10. 必须盯的代码和信号

### 必盯代码文件

- `mdit/model/model.py`
  - 现在负责 runtime 动作后处理
  - 如果 rollout 出现抖动、gripper 不闭合、rotation 爆掉，先看这里
- `mdit/train/runner.py`
  - 现在负责 in-training success eval、best_success 保存、history 写盘、W&B 记录
- `mdit/train/checkpoints.py`
  - 现在负责 resume 时保留 `success_eval_history`
- `mdit/train/eval.py`
  - 现在是 cloud eval / standalone eval 的核心路径
- `research/mdit_trial_runner.py`
  - 现在会把 `eval_episodes` 自动映射到训练内 success eval

### 必盯文件输出

- `ckpt/<run_name>/success_eval_history.json`
  - 这是中途 success 记录的唯一准线
- `ckpt/<run_name>/best_success.pt`
  - 如果 100 epoch 后这个文件还不存在，说明 best-success 分支没有跑通
- W&B
  - 看 `success_select/success_rate`
  - 看 `success_select/mean_steps`
  - 看 `summary/best_success_rate`

## 11. 交付要求

其他 agent 最终只需要交这几样：

- 结论
  - 哪条配方最好
  - 为什么最好
- 最优 run 路径
- 最优 `best_success.pt` 路径
- 对 `best_success.pt` 的 `100 episode` 最终 success rate
- 一份中文总结，写到 `docs/mdit/` 下

不要交一堆中间 ckpt。

## 12. 已做过的最小 smoke 结果

- 我已经在本机对
  - `ckpt/unplug_charger_mdit_rgb5_sep_all_500/latest.pt`
  做过 `1 episode / 5 steps` 的最小 smoke test。
- 结果：
  - eval CLI 能跑通
  - RLBench 能启动
  - 说明“checkpoint 重建 + 云端评估路径 + 当前动作后处理路径”是通的
- 这不代表模型质量已经好，只代表基础设施可用。
