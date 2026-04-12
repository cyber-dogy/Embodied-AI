# 2026-04-12 LeLaN Autoresearch 执行计划

## 1. 本轮目标

LeLaN 这一轮只做工程链路修复和可自动执行化，不改主体架构，不发明新的 encoder 微调模式。

低级 agent 必须固定按这条主线执行：

- `5RGB`
- `obs3`
- `horizon = 32`
- `n_action_steps = 8`
- `smooth_actions = true`
- `EMA = on`
- `100 epoch / 20 episode success gate`

本轮先不改 `lelan/model/observation_encoder.py`、`lelan/model/transformer.py` 的结构。原因：

- 先把训练、评估、选模、离线审计、留痕链路补稳
- LeLaN 之前缺的是工程基础设施，不是先证明确实要大改结构
- 如果 `100 epoch` 三条 screening 分支都过不了 `0.45 success@20`，下一轮才允许继续测更激进的结构候选

## 2. 本轮具体改了什么

### 2.1 配置和默认值

LeLaN 现在新增并对齐了和 MDIT 同一套关键字段：

- `enable_success_rate_eval`
- `success_selection_every_epochs`
- `success_selection_episodes`
- `success_eval_path`
- `offline_eval_ckpt_every_epochs`
- `offline_eval_ckpt_payload_mode`
- `offline_eval_ckpt_dir`
- `smooth_actions`
- `command_mode`
- `horizon_index`
- `average_first_n`
- `position_alpha`
- `rotation_alpha`
- `max_position_step`
- `gripper_open_threshold`
- `gripper_close_threshold`

同时把：

- `LeLaNExperimentConfig.n_action_steps: 16 -> 8`
- `configs/lelan/baseline.json` 的 `n_action_steps: 1 -> 8`

### 2.2 新主线配置

新增：

- `configs/lelan/obs3_rgb5_a8_gate100.json`

这份配置固定：

- `camera_names = [right_shoulder, left_shoulder, overhead, front, wrist]`
- `n_obs_steps = 3`
- `horizon = 32`
- `n_action_steps = 8`
- `objective.sigma_min = 0.001`
- `objective.num_integration_steps = 25`
- `enable_success_rate_eval = true`
- `success_selection_every_epochs = 100`
- `success_selection_episodes = 20`
- `smooth_actions = true`
- `command_mode = "first"`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`

### 2.3 推理后处理

LeLaN 推理路径现在支持：

- `command_mode = first | horizon_index | mean_first_n`
- rot6d 正交化
- gripper hysteresis
- 可选位置/旋转平滑

注意：

- rot6d 正交化和 gripper hysteresis 一直会执行
- `smooth_actions=false` 只会关闭位置/旋转平滑，不会关闭 rot6d/gripper 的安全后处理

### 2.4 EMA 与评估兼容

LeLaN 现在已经补齐完整 EMA 链路：

- ckpt payload 保存 `ema_state_dict`
- resume 时恢复 EMA
- `eval_lelan_checkpoint.py` / `eval_lelan_all_checkpoints.py` 支持 `--prefer-ema`
- 评估默认优先加载 EMA

并且补了两个兼容开关：

- `--prefer-ema`
- `--set KEY=VALUE`

所以老 ckpt 现在也可以直接用 `--set n_action_steps=8` 或动作后处理参数做离线评估覆盖。

### 2.5 训练内评估与离线评估 ckpt

训练现在有两条互斥路径：

1. `enable_success_rate_eval=true`

- 每 `success_selection_every_epochs` 做一次 RLBench success eval
- 写 `success_eval_history.json`
- 写 wandb success 指标
- 写/更新 `best_success.pt`

2. `enable_success_rate_eval=false`

- 训练过程完全不依赖 RLBench
- 每 `offline_eval_ckpt_every_epochs` 产出一个轻量 `eval_ckpt`
- 路径固定：`ckpt/<run_name>/eval_ckpts/epoch_XXXX.pt`

注意：

- `eval_ckpt` 不是 resume ckpt
- resume 只看 `latest.pt`
- `latest.pt` 需要 `checkpoint_payload_mode=full`

### 2.6 autoresearch 留痕

现在每个 LeLaN run 至少保留：

- `config.json`
- `experiment_manifest.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json` 或 `eval_ckpts/`
- `audit_report.json`
- `lelan_trial_request.json`

`experiment_manifest.json` 固定记录：

- base config path
- base config
- resolved config
- config diff
- git commit
- 是否启用训练内 success eval
- 是否保存 offline eval ckpt
- `change_summary`

`change_summary` 必须是人类可读句子，例如：

- `n_action_steps: 1 -> 8`
- `success eval: enabled in-train -> disabled in-train, save eval_ckpt every 100 epochs`
- `fusion_transformer.dropout: 0.1 -> 0.0`

### 2.7 容量探测
    正式跑长训前，先做一次 `1 epoch` 探测，把显存尽量推到 `20GB~22GB`，但不能 OOM。

    建议做法：

    1. 固定主线 recipe 不变
    2. 固定 `grad_accum_steps=1`
    3. `batch_size` 依次试：`12 -> 16 -> 20 -> 24-> 28-> 32-> 64-> 128`
    4. 第一次 OOM 就退回上一档，作为正式训练 batch size

    监控命令：

    ```bash
    watch -n 1 "nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free,utilization.gpu --format=csv,noheader,nounits | awk -F, '{printf \"GPU: %s | Total: %.2f GB | Used: %.2f GB | Free: %.2f GB | Util: %s%%\\n\", \$1, \$2/1024, \$3/1024, \$4/1024, \$5}'"
    ```

## 3. autoresearch 默认搜索空间

这轮 screening 只允许 3 条 `100 epoch` 分支：

### A. 基线

- `rgb5_obs3_a8_lr2e5_100`

### B. 更低学习率

- `rgb5_obs3_a8_lr1p5e5_100`

### C. fusion dropout 关掉

- `rgb5_obs3_a8_fusion_dropout0_100`

都基于同一条主线 recipe：

- `5RGB`
- `obs3`
- `horizon=32`
- `n_action_steps=8`
- `sigma_min=0.001`
- `num_integration_steps=25`
- `smooth_actions=true`
- `command_mode="first"`
- `position_alpha=0.35`
- `rotation_alpha=0.25`
- `max_position_step=0.03`
- `gripper_open_threshold=0.6`
- `gripper_close_threshold=0.4`

## 4. 100 / 300 / 500 Epoch 闸门

全部按 `success@20` 判断。

### 4.1 100 epoch

- `< 0.45`：立即停止该分支
- `>= 0.45`：允许进入 300 epoch

### 4.2 300 epoch

- `< 0.55`：立即停止该分支
- `>= 0.55`：允许进入 500 epoch

### 4.3 500 epoch

- 目标 `>= 0.60`

如果三条 `100 epoch` 分支都没过 `0.45`，下一轮才允许试更大结构改动。

## 5. 环境安装

### 5.1 通用安装

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
bash envs/setup_mdit_env.sh lelan_env
```

这条脚本现在会一并安装：

- `timm==0.9.16`
- `transformers==4.46.3`
- `efficientnet-pytorch==0.7.1`

如果要装 RLBench / PyRep 评估环境：

```bash
export COPPELIASIM_ROOT=/path/to/CoppeliaSim
INSTALL_EVAL=1 bash envs/setup_mdit_env.sh lelan_env
```

### 5.2 基础 smoke check

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env

python -c 'import torch; print(torch.__version__, torch.cuda.is_available())'
python -c 'import timm, transformers, efficientnet_pytorch; print("deps_ok")'
python -m unittest discover -s tests -p "test_lelan_*.py"
```

## 6. 训练命令

### 6.1 有 RLBench 环境：完整 autoresearch loop

必须放到 `tmux` 后台执行，禁止直接挂 SSH 前台。

```bash
tmux new -s lelan_ar_a8

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_lelan_autoresearch_loop.py \
  --tag lelan_a8_gate100 \
  --config configs/lelan/obs3_rgb5_a8_gate100.json \
  --device cuda \
  --headless \
  --show-progress \
  --audit-timeout-sec 10800
```

脱离：

```bash
Ctrl-b d
```

重连：

```bash
tmux attach -t lelan_ar_a8
```

### 6.2 没有 RLBench 环境：train-only + offline eval ckpt

```bash
tmux new -s lelan_train_only_a8

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_lelan_rgb5_obs3_a8__$(date +%Y%m%d_%H%M%S)"

python scripts/run_lelan_autoresearch_trial.py \
  --phase train-only \
  --config configs/lelan/obs3_rgb5_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name lelan_rgb5_obs3_a8_train_only_100 \
  --run-name "$RUN_NAME" \
  --description "LeLaN 5RGB obs3 a8 train-only without RLBench" \
  --set enable_success_rate_eval=false \
  --set offline_eval_ckpt_every_epochs=100 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full"
```

这条命令结束后至少要检查：

- `ckpt/<RUN_NAME>/latest.pt`
- `ckpt/<RUN_NAME>/eval_ckpts/epoch_0100.pt`
- `ckpt/<RUN_NAME>/experiment_manifest.json`

## 7. audit-only 命令

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_lelan_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<RUN_NAME> \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless \
  --show-progress
```

`audit-only` 会自动识别：

- `epochs/`
- 或 `eval_ckpts/`

## 8. 本地评估命令

### 8.1 单个 ckpt，20 episode

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_lelan_checkpoint.py \
  --ckpt-path ckpt/<RUN_NAME>/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --prefer-ema \
  --device cuda
```

### 8.2 单个 ckpt，100 episode

```bash
python scripts/eval_lelan_checkpoint.py \
  --ckpt-path ckpt/<RUN_NAME>/epochs/epoch_0300.pt \
  --episodes 100 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --prefer-ema \
  --device cuda
```

### 8.3 可视化看 1 个 episode

```bash
QT_QPA_PLATFORM=xcb python scripts/eval_lelan_checkpoint.py \
  --ckpt-path ckpt/<RUN_NAME>/epochs/epoch_0300.pt \
  --episodes 1 \
  --max-steps 200 \
  --seed 1234 \
  --no-headless \
  --show-progress \
  --prefer-ema \
  --device cuda
```

### 8.4 批量评估 all checkpoints

```bash
python scripts/eval_lelan_all_checkpoints.py \
  --ckpt-epochs-dir ckpt/<RUN_NAME>/epochs \
  --results-json ckpt/<RUN_NAME>/eval_results/all_ckpts.json \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --prefer-ema \
  --device cuda
```

如果评估的是老 ckpt，也允许加：

```bash
  --set n_action_steps=8 \
  --set smooth_actions=true \
  --set command_mode="first" \
  --set position_alpha=0.35 \
  --set rotation_alpha=0.25 \
  --set max_position_step=0.03 \
  --set gripper_open_threshold=0.6 \
  --set gripper_close_threshold=0.4
```

## 9. 低级 agent 的排查顺序

训练或评估失败时，必须严格按下面顺序排查：

1. 先检查 import / environment / requirements
2. 再检查 checkpoint payload 和 resume / eval 兼容
3. 再检查 success eval 是否被错误打开或错误关闭
4. 再检查 batch size / AMP / OOM / GPU 占用
5. 最后才允许怀疑模型结构本体

不允许一上来就说“LeLaN 架构不行”。

## 10. 中文研究记录格式

每次正式实验后，在 `docs/lelan/research/` 新增一份：

- `YYYY-MM-DD-lelan-<run_name>-zh.md`

必须包含 6 个标题：

1. `背景`
2. `本轮改动`
3. `执行命令`
4. `环境`
5. `结果`
6. `结论与下一步`

`本轮改动` 必须写清楚旧值和新值，不能只写“调了超参”。
