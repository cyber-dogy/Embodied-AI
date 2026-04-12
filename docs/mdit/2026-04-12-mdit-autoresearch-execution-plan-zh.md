# 2026-04-12 MDIT Autoresearch 执行计划

## 1. 本轮目标

本轮只做一条主线，不允许低级 agent 自己改方向：

- 保留 `5RGB + obs3`
- `vision train_mode = last_block`
- `vision.use_separate_encoder_per_camera = true`
- `horizon = 32`
- `n_action_steps = 8`
- `smooth_actions = true`

本轮先不改 `mdit/model/transformer.py` 主体结构，不做 cross-attn，不做 encoder/decoder 大改。原因很简单：

- PDIT 的历史记录已经证明，低成功率经常先是训练/评估/选模/环境链路的问题
- MDIT 这一轮先把训练内评估开关、离线评估 ckpt、autoresearch 留痕、跨平台兼容做好
- 如果 `last_block + a8` 的 3 条 100epoch 分支都过不了 `0.45 success@20`，下一轮才允许测试更激进的结构改动

## 2. 本轮具体改了什么

这部分是给执行 agent 和复核人看的，必须先看清楚再跑。

### 2.1 配置和训练默认值

- `MDITExperimentConfig.n_action_steps`: `16 -> 8`
- 新增 `enable_success_rate_eval`
  - `true`：训练中每 100 epoch 做一次 RLBench `20 episode` success eval
  - `false`：训练过程不依赖 RLBench，但会额外保存轻量 `eval_ckpt`
- 新增 `offline_eval_ckpt_every_epochs`
  - 典型值：`100`
- 新增 `offline_eval_ckpt_payload_mode`
  - 默认 `lightweight`
- 新增目录：`ckpt/<run_name>/eval_ckpts/`

### 2.2 新主线配置

新增主线配置：

- `configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json`

这份配置固定了：

- `5RGB`
- `obs3`
- `separate encoder per camera`
- `last_block`
- `n_action_steps=8`
- `resize_shape=[240,240]`
- `sigma_min=0.001`
- `num_integration_steps=25`
- `success_selection_every_epochs=100`
- `success_selection_episodes=20`
- `smooth_actions=true`

### 2.3 训练内评估与离线评估 ckpt

训练现在分成两条互斥路径：

1. `enable_success_rate_eval=true`

- 训练内直接跑 RLBench success eval
- 写入 `success_eval_history.json`
- 写入 wandb success 指标
- 生成/更新 `best_success.pt`

2. `enable_success_rate_eval=false`

- 训练过程不 import RLBench 运行时依赖
- 不做训练内 success eval
- 每 `offline_eval_ckpt_every_epochs` 保存一个轻量 `eval_ckpt`
- 路径固定为 `ckpt/<run_name>/eval_ckpts/epoch_XXXX.pt`

注意：

- `eval_ckpt` 不是 resume ckpt
- resume 只看 `latest.pt`
- `latest.pt` 仍然需要 `checkpoint_payload_mode=full`

### 2.4 autoresearch 留痕

每个 run 目录现在至少要保留：

- `config.json`
- `experiment_manifest.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json` 或 `eval_ckpts/`
- `audit_report.json`（做过 audit 后）

`experiment_manifest.json` 里明确记录：

- 基础 config 路径
- resolved config
- override diff
- git commit
- 是否启用训练内 success eval
- 是否保存 offline eval ckpt
- `change_summary`

`change_summary` 必须是人能读懂的句子，例如：

- `vision train_mode: all -> last_block`
- `n_action_steps: 1 -> 8`
- `success eval: disabled in-train, save eval_ckpt every 100 epochs`

## 3. autoresearch 默认搜索空间

本轮 screening 只允许 3 条 100epoch 分支：

### A. 基线

- `rgb5_sep_lastblock_a8_lr2e5_100`

### B. 更低学习率

- `rgb5_sep_lastblock_a8_lr1p5e5_100`

### C. Dropout 关掉

- `rgb5_sep_lastblock_a8_dropout0_100`

全部都基于同一条主线 recipe：

- `camera_names = [right_shoulder, left_shoulder, overhead, front, wrist]`
- `n_obs_steps = 3`
- `horizon = 32`
- `n_action_steps = 8`
- `use_amp = true`
- `observation_encoder.vision.use_separate_encoder_per_camera = true`
- `observation_encoder.vision.train_mode = "last_block"`
- `observation_encoder.vision.resize_shape = [240,240]`
- `objective.sigma_min = 0.001`
- `objective.num_integration_steps = 25`
- `smooth_actions = true`
- `command_mode = "first"`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`

## 4. 100 / 300 / 500 Epoch 闸门

所有判断都按 `success@20` 执行。

### 4.1 100 epoch

- 如果 `< 0.45`：立刻停掉这条分支，不准续到 300
- 如果 `>= 0.45`：允许进入 300 epoch gate

### 4.2 300 epoch

- 如果 `< 0.55`：停掉这条分支，不准续到 500
- 如果 `>= 0.55`：允许进入 500 epoch gate

### 4.3 500 epoch

- 目标是 `>= 0.60`

如果 3 条 `100 epoch` screening 分支全部没过 `0.45`，下一轮才允许开结构候选。结构候选暂时只准：

- `transformer.dropout=0.0`
- 最终输出层 zero-init

不允许直接做大规模 encoder/decoder 重写。

## 5. 训练命令

### 5.1 有 RLBench 环境：完整 autoresearch loop

必须放到 `tmux` 里跑，不能直接挂 SSH 前台。

```bash
tmux new -s mdit_ar_lastblock_a8

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_loop.py \
  --tag mdit_a8_gate100 \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --device cuda \
  --headless \
  --show-progress \
  --audit-timeout-sec 10800
```

跑起来后脱离：

```bash
Ctrl-b d
```

重连：

```bash
tmux attach -t mdit_ar_lastblock_a8
```

### 5.2 没有 RLBench 环境：train-only + 轻量 eval_ckpt

这种情况不要跑 full loop，因为本机做不了 RLBench 审计。

```bash
tmux new -s mdit_train_only_a8

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_lastblock_a8__$(date +%Y%m%d_%H%M%S)"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name rgb5_sep_lastblock_a8_train_only_100 \
  --run-name "$RUN_NAME" \
  --description "5RGB obs3 last_block a8 train-only without RLBench" \
  --set enable_success_rate_eval=false \
  --set offline_eval_ckpt_every_epochs=100 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=\"full\"
```

跑完后应该至少看到：

- `ckpt/<RUN_NAME>/latest.pt`
- `ckpt/<RUN_NAME>/eval_ckpts/epoch_0100.pt`
- `ckpt/<RUN_NAME>/experiment_manifest.json`

## 6. 离线 audit 命令

### 6.1 对完整 run 做 audit-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<RUN_NAME> \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless \
  --show-progress
```

现在 `audit-only` 会自动识别：

- `epochs/`
- 或 `eval_ckpts/`

所以无 RLBench 平台产出的 `eval_ckpts/` 可以直接拿到有 RLBench 的机器上审计。

### 6.2 单个 ckpt 评估

```bash
python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<RUN_NAME>/eval_ckpts/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --headless \
  --show-progress \
  --device cuda \
  --prefer-ema
```

旧 checkpoint 兼容方式：

```bash
python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<OLD_RUN>/epochs/epoch_0300.pt \
  --episodes 20 \
  --max-steps 200 \
  --headless \
  --show-progress \
  --device cuda \
  --prefer-ema \
  --set n_action_steps=8 \
  --set smooth_actions=true \
  --set command_mode=\"first\" \
  --set position_alpha=0.35 \
  --set rotation_alpha=0.25 \
  --set max_position_step=0.03 \
  --set gripper_open_threshold=0.6 \
  --set gripper_close_threshold=0.4
```

## 7. 容量探测

正式跑长训前，先做一次 `1 epoch` 探测，把显存尽量推到 `20GB~23GB`，但不能 OOM。

建议做法：

1. 固定主线 recipe 不变
2. 固定 `grad_accum_steps=1`
3. `batch_size` 依次试：`12 -> 16 -> 20 -> 24`
4. 第一次 OOM 就退回上一档，作为正式训练 batch size

监控命令：

```bash
watch -n 1 "nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free,utilization.gpu --format=csv,noheader,nounits | awk -F, '{printf \"GPU: %s | Total: %.2f GB | Used: %.2f GB | Free: %.2f GB | Util: %s%%\\n\", \$1, \$2/1024, \$3/1024, \$4/1024, \$5}'"
```

## 8. 必须检查的输出文件

训练期间至少盯这些：

- `ckpt/<run_name>/config.json`
- `ckpt/<run_name>/experiment_manifest.json`
- `ckpt/<run_name>/summary.json`
- `ckpt/<run_name>/latest.pt`
- `ckpt/<run_name>/success_eval_history.json`
- `ckpt/<run_name>/best_success.pt`
- `ckpt/<run_name>/eval_ckpts/`
- `ckpt/<run_name>/audit_report.json`

判断标准：

- 有 RLBench 环境：到 `100 epoch` 后必须能看到 `success_eval_history.json`
- 无 RLBench 环境：到 `100 epoch` 后必须能看到 `eval_ckpts/epoch_0100.pt`
- 做过 audit 后必须能看到 `audit_report.json`

## 9. 自排查顺序

训练或评估失败时，按这个顺序查，不允许跳步：

1. 先查 import / environment / requirements
2. 再查 checkpoint payload 和 resume / eval 兼容
3. 再查 success-eval 是否被错误关闭或错误触发
4. 再查 batch size / AMP / OOM / GPU 利用率
5. 最后才考虑模型结构本体

## 10. 常见误操作

- 不要在没有 RLBench 的机器上直接跑 `--phase full`
- 不要把 `eval_ckpt` 当成 resume ckpt
- 不要漏掉 `tmux`
- 不要把 `best_valid.pt` 当作主选模依据
- 不要把旧的 `n_action_steps=1` ckpt 直接原样上线评估，至少加上 `--set n_action_steps=8`

## 11. 研究记录要求

每次正式实验结束后，在 `docs/mdit/research/` 下新增一份中文记录，文件名固定为：

- `YYYY-MM-DD-mdit-<run_name>-zh.md`

必须包含 6 个标题：

1. `背景`
2. `本轮改动`
3. `执行命令`
4. `环境`
5. `结果`
6. `结论与下一步`

其中 `本轮改动` 不能只写“调了超参”，必须写清楚旧值和新值。
