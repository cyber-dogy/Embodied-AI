# 2026-04-12 MDIT Autoresearch 执行记录

## 背景

启动 MDIT Autoresearch 执行计划（2026-04-12-mdit-autoresearch-execution-plan-zh.md）。

主线配置固定为：
- 5RGB (right_shoulder, left_shoulder, overhead, front, wrist)
- obs3 (n_obs_steps=3)
- vision.train_mode="last_block"
- horizon=32, n_action_steps=8
- smooth_actions=true, command_mode="first"

## 本轮改动

### 显存探测
由于 5RGB + obs3 + separate_encoder + last_block 配置显存需求较高，在 24GB 显存 (RTX 5090 D v2) 下进行 batch_size 探测：

| batch_size | 结果 | 显存 |
|------------|------|------|
| 24 | OOM | - |
| 20 | OOM | - |
| 16 | OOM | - |
| 12 | OOM | - |
| 8 | ✅ 成功 | 22.97 GB |

**正式训练 batch_size=8**（原配置为 8，但探测确认这是最大稳定值）

### Screening 分支

1. **rgb5_sep_lastblock_a8_lr2e5_100** (基线)
   - batch_size=8
   - optimizer_lr=2e-5
   - transformer.dropout=0.1

2. **rgb5_sep_lastblock_a8_lr1p5e5_100**
   - batch_size=8
   - optimizer_lr=1.5e-5
   - transformer.dropout=0.1

3. **rgb5_sep_lastblock_a8_dropout0_100**
   - batch_size=8
   - optimizer_lr=2e-5
   - transformer.dropout=0.0

## 执行命令

### 显存探测
```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 1 \
  --set batch_size=8 \
  --set wandb_enable=false
```

### 分支 1 (lr2e5)
```bash
tmux new-session -d -s mdit_ar_bs8_lr2e5_100
python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --experiment-name rgb5_sep_lastblock_a8_lr2e5_100 \
  --set batch_size=8 \
  --set optimizer_lr=2e-5
```

### 分支 2 (lr1p5e5)
```bash
tmux new-session -d -s mdit_ar_bs8_lr1p5e5_100
python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --experiment-name rgb5_sep_lastblock_a8_lr1p5e5_100 \
  --set batch_size=8 \
  --set optimizer_lr=1.5e-5
```

### 分支 3 (dropout0)
```bash
tmux new-session -d -s mdit_ar_bs8_dropout0_100
python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --experiment-name rgb5_sep_lastblock_a8_dropout0_100 \
  --set batch_size=8 \
  --set transformer.dropout=0.0
```

## 环境

- GPU: NVIDIA GeForce RTX 5090 D v2 (24GB)
- CUDA: 13.0
- Driver: 580.126.09
- Conda env: mdit_env
- Date: 2026-04-12

## 结果

**进行中** - 3 条分支已启动到 tmux session：
- `mdit_ar_bs8_lr2e5_100`
- `mdit_ar_bs8_lr1p5e5_100`
- `mdit_ar_bs8_dropout0_100`

### Run 目录
- `ckpt/unplug_charger_mdit_rgb5_sep_lastblock_a8_lr2e5_100__20260412_190616`
- `ckpt/unplug_charger_mdit_rgb5_sep_lastblock_a8_lr1p5e5_100__20260412_190618`
- `ckpt/unplug_charger_mdit_rgb5_sep_lastblock_a8_dropout0_100__20260412_190621`

### 100 Epoch 闸门
- 目标: success@20 >= 0.45
- 评估: 每 100 epoch 20 episodes
- 通过则续训到 300 epoch，否则停止

## 监控命令

```bash
# 查看 tmux session
tmux list-sessions | grep mdit_ar

# 连接到训练 session
tmux attach -t mdit_ar_bs8_lr2e5_100

# 查看 GPU
watch -n 5 nvidia-smi

# 检查训练进度
ls -la ckpt/unplug_charger_mdit_rgb5_sep_lastblock_a8_*/summary.json

# 检查 success eval 历史
cat ckpt/unplug_charger_mdit_rgb5_sep_lastblock_a8_*/success_eval_history.json
```

## 结论与下一步

- ✅ 显存探测完成，确定 batch_size=8
- ✅ 3 条 100 epoch screening 分支已启动
- ⏳ 等待 100 epoch 完成并评估 success@20
- ⏳ 根据闸门规则决定是否续训到 300/500 epoch

---

## 执行状态更新

### 2026-04-12 19:28

**分支 1 (rgb5_sep_lastblock_a8_lr2e5_100 - 基线) 已启动**

状态: 🟢 运行中

启动命令 (按文档 10.1):
```bash
tmux new-session -d -s mdit_ar_lastblock_a8
python scripts/run_mdit_autoresearch_loop.py \
  --tag mdit_a8_gate100 \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --device cuda \
  --headless \
  --show-progress \
  --audit-timeout-sec 10800
```

Run 目录:
- `ckpt/unplug_charger_mdit_rgb5_sep_lastblock_a8_gate100__rgb5_sep_lastblock_a8_lr2e5_100__e0100__20260412_192611`

监控指标:
- GPU 显存: 22.97 GB / 23.88 GB
- GPU 利用率: 97%
- 进程数: 10 (主进程 + data loader workers)

### 100 Epoch 闸门目标

| 指标 | 阈值 | 动作 |
|------|------|------|
| success@20 | < 0.45 | 停止分支，不续到 300 |
| success@20 | >= 0.45 | 允许续训到 300 epoch |

**预计 100 epoch 完成时间**: ~10-12 小时

### 2026-04-13 00:46 - 分支 1 完成评估

**状态**: ❌ **FAILED** - 未通过 100 epoch 闸门

| 指标 | 数值 |
|------|------|
| 完成 Epochs | 100 |
| success@20 | **0.0** |
| 成功数 | 0 / 20 |
| 平均步数 | 182.4 |
| 训练耗时 | ~5.3 小时 |
| 评估耗时 | ~10 分钟 |

**闸门决策**: success@20 = 0.0 < 0.45 → **停止分支，不续训到 300 epoch**

**处理动作**:
1. ✅ 中断训练进程
2. ✅ 释放显存
3. ✅ 离线评估 (20 episodes)
4. ✅ 记录结果到 results.tsv
5. ✅ 更新 success_eval_history.json

**保留文件** (按执行计划 9.1 节):
- config.json
- experiment_manifest.json  
- summary.json
- dataset_stats.json
- success_eval_history.json
- audit_report.json
- best_success.pt (作为失败证据)

**结论**: 
基线分支 (rgb5_sep_lastblock_a8_lr2e5_100) 在 100 epoch 时 success@20 = 0.0，远低于 0.45 的阈值。根据执行计划 5.1 节，**该分支被终止，不再续训到 300 epoch**。

待其他两个分支 (lr1p5e5 和 dropout0) 完成后，再决定是否进入下一轮结构候选。

