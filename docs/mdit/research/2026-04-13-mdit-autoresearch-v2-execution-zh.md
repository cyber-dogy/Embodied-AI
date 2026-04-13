# 2026-04-13 MDIT Autoresearch V2 执行记录

## 背景

之前的 screening 分支 (`rgb5_sep_lastblock_a8_lr2e5_100`) 使用 bug 版本代码训练，
缺少 `output_proj` 零初始化，导致 100 epoch 训练完成但 success@20 = 0.0。

fixes.md 已记录修复 (commit `28adab6`)：
```python
nn.init.constant_(self.output_proj.weight, 0)
nn.init.constant_(self.output_proj.bias, 0)
```

## 本轮改动

使用修复后的代码重新训练3条 screening 分支。

## 执行策略

**串行执行**（避免显存不足）：
1. 分支1: `rgb5_sep_lastblock_a8_lr2e5_100_v2` (基线, lr=2e-5)
2. 分支2: `rgb5_sep_lastblock_a8_lr1p5e5_100_v2` (lr=1.5e-5)
3. 分支3: `rgb5_sep_lastblock_a8_dropout0_100_v2` (dropout=0.0)

## 执行命令

```bash
tmux new-session -d -s mdit_ar_v2

# 分支1
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --experiment-name rgb5_sep_lastblock_a8_lr2e5_100_v2 \
  --set batch_size=8 \
  --set optimizer_lr=2e-5

# 分支2
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --experiment-name rgb5_sep_lastblock_a8_lr1p5e5_100_v2 \
  --set batch_size=8 \
  --set optimizer_lr=1.5e-5

# 分支3
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --experiment-name rgb5_sep_lastblock_a8_dropout0_100_v2 \
  --set batch_size=8 \
  --set transformer.dropout=0.0
```

## 环境

- GPU: NVIDIA GeForce RTX 5090 D v2 (24GB)
- CUDA: 13.0
- Driver: 580.126.09
- Conda env: mdit_env
- Code: commit `28adab6` (含 output_proj 零初始化修复)
- Date: 2026-04-13

## 100 Epoch 闸门目标

| 指标 | 阈值 | 动作 |
|------|------|------|
| success@20 | < 0.45 | 停止分支，不续到 300 |
| success@20 | >= 0.45 | 允许续训到 300 epoch |

## 状态跟踪

- [x] 分支1 (lr2e5) - ✅ 完成, success@20=0.2, **FAILED**
- [ ] 分支2 (lr1p5e5) - 等待
- [ ] 分支3 (dropout0) - 等待

## 结论与下一步

⏳ 等待所有3条分支完成 100 epoch 训练并评估 success@20。

---

## 执行状态更新

### 2026-04-13 01:38

**修复后训练启动**

- ✅ fixes.md 已更新修复记录
- ✅ 串行执行 session (mdit_ar_v2) 已启动
- ✅ 自动监控任务已设置（每15分钟检查）
- ⏳ 分支1训练中...

**预计完成时间**: 
- 每条分支约 5-6 小时
- 总计约 15-18 小时

---

### 2026-04-13 07:30 - 分支 1 完成评估

**状态**: FAILED - 未通过 100 epoch 闸门

| 指标 | 数值 |
|------|------|
| 完成 Epochs | 100 |
| success@20 | 0.2 (4/20) |
| 平均步数 | 166.3 |
| 训练耗时 | ~5.5 小时 |

**对比修复前后**:
- 修复前 (bug 版本): success@20 = 0.0
- 修复后 (output_proj 零初始化): success@20 = 0.2
- 提升: +0.2，但仍低于 0.45 阈值

**闸门决策**: 0.2 < 0.45 → 停止分支，不续训到 300 epoch

**下一步**: 继续分支2 (lr=1.5e-5)
