# 2026-04-15 MDIT 分离 5RGB + 选择性微调 执行计划（v1）

## 0. 执行纪律（继承）

与上一版本相同，补充以下新规则：

- 主线 vision encoder 已切换为 **5 个独立 ViT-B/16**（per-camera separate）
- `train_mode` 开关和 `num_unfreeze_blocks` 是唯一允许改动的 vision 解冻参数
- 改动 `num_unfreeze_blocks` 后必须 resume 而非重新训练，避免丢失已有收益
- 禁止同时修改 `train_mode` 和其他超参数（单变量实验）

---

## 1. 已修复的结构 bug（本轮新增）

| 文件 | Bug | 影响 | 状态 |
|---|---|---|---|
| `observation_encoder.py` | `last_block` 因 `nn.Sequential` isinstance 判断缺失，一直 fallthrough 全解冻 | 实际训练整个 ViT 86M 而非 7M，12× 内存超支、过拟合风险 | **已修复** |
| `eval.py` | except 块 `steps=0` 重置中途 exception 步数 | 分析桶（at_horizon/lt_20）分类错误 | **已修复** |
| `eval.py` | `error` 变量未在 try 外初始化 | 潜在 NameError | **已修复** |
| `configs/mdit/faithful_baseline.json` | `use_separate_encoder_per_camera: false` | 所有相机共用梯度，无法独立微调 | **已更新** |

---

## 2. 当前主线配方（锁定）

```
text + 5RGB（分离编码器） + MDIT transformer + FM
obs2 / horizon100 / action24
per-camera ViT-B/16 CLIP，last_block 微调（num_unfreeze_blocks=1）
raw model eval，wandb online
```

**当前配方对应文件**：
- `configs/mdit/faithful_baseline.json`（主线基座）
- `configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json`（主线入口，extends 上面）

---

## 3. Vision Encoder 解冻开关（唯一允许触碰的解冻参数）

### 3.1 开关说明

| `train_mode` | `num_unfreeze_blocks` | 实际可训练参数（单 encoder） | 5 camera 合计 |
|---|---|---|---|
| `"last_block"` | 1（默认） | ~7M | ~35M |
| `"last_n_blocks"` | 2 | ~14M | ~70M |
| `"last_n_blocks"` | 3 | ~21M | ~105M |
| `"all"` | - | ~86M | ~430M |
| `"frozen"` | - | 0 | 0 |

### 3.2 何时解冻更多层

**条件（先满足 100ep gate 再考虑）**：
1. 通过 `success@20 >= 0.45` 闸门
2. valid loss 已明显收敛（不再下降超过 5% per 20ep）
3. 下一阶段续训到 300 epoch

**操作（config + resume，不重新训练）**：

```bash
# 例如解冻后 2 层
--set observation_encoder.vision.train_mode=last_n_blocks \
--set observation_encoder.vision.num_unfreeze_blocks=2 \
--resume-from-latest
```

### 3.3 开关语义说明

- **`last_block`**：仅最后 1 个 transformer block + final norm。  
  适合：数据量适中、避免 ViT 大幅迁移的早期阶段。
- **`last_n_blocks`**：顶部 N 个 block + final norm。  
  适合：策略已有基础 SR，希望进一步适配任务视觉特征。
- **`all`**：全量微调，慎用（显存爆炸风险）。
- **`frozen`**：完全冻结（当 GPU 显存非常紧张时用于对比实验）。

---

## 4. 训练参数（主线默认值）

| 参数 | 值 | 说明 |
|---|---|---|
| `n_obs_steps` | 2 | |
| `horizon` | 100 | |
| `n_action_steps` | 24 | |
| `camera_names` | 5 cameras | right_shoulder, left_shoulder, overhead, front, wrist |
| `use_separate_encoder_per_camera` | **true** | **新：分离编码器** |
| `train_mode` | `"last_block"` | |
| `num_unfreeze_blocks` | 1 | 开关，按阶段调整 |
| `lr_multiplier` | 0.1 | vision encoder 的 LR 倍数（相对主 LR） |
| `batch_size` | 8 | |
| `grad_accum_steps` | 4 | effective batch = 32 |
| `optimizer_lr` | 2e-5 | 主网络 LR |
| `use_amp` | true | bf16 mixed precision |
| `ema_enable` | false | |
| `checkpoint_every_epochs` | 20 | |
| `success_selection_every_epochs` | 20 | |

---

## 5. 闸门规则（继承 v4）

### 5.1 100 epoch 硬闸门

- `success@20 < 0.45` → 停止
- `success@20 >= 0.45` → 允许续训到 300 epoch

### 5.2 300 / 500 目标

- 300 epoch 目标 `>= 0.55`
- 500 epoch 目标 `>= 0.60`

### 5.3 解冻决策节点

- 通过 100ep gate → 可以考虑提升 `num_unfreeze_blocks` 到 2
- 通过 300ep 目标 → 可以考虑 `num_unfreeze_blocks=3`
- 始终先改开关 + resume，不重新训练

---

## 6. 标准命令

### 6.1 主线 100 epoch

```bash
tmux new -s mdit_sep5rgb_100

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/Myprojects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_sep5rgb_lastblock_obs2_h100_a24_100"

python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name sep5rgb_lastblock_obs2_h100_a24_100 \
  --run-name "$RUN_NAME" \
  --description "sep-encoder 5rgb last_block faithful 100ep gate" \
  --headless \
  --show-progress
```

### 6.2 解冻更多层后续训（通过 100ep gate 后）

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --stage-epochs 300 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name sep5rgb_2blocks_obs2_h100_a24_300 \
  --run-name "unplug_charger_mdit_sep5rgb_2blocks_obs2_h100_a24_300" \
  --description "sep-encoder 5rgb last_2_blocks 300ep" \
  --headless \
  --show-progress \
  --set observation_encoder.vision.train_mode=last_n_blocks \
  --set observation_encoder.vision.num_unfreeze_blocks=2 \
  --resume-from-latest
```

### 6.3 资源探测（10 epoch，测吞吐量）

```bash
# bs=8, acc=4（基线）
python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --stage-epochs 10 --checkpoint-every 10 \
  --experiment-name sep5rgb_bs8_acc4_probe10 \
  --run-name unplug_charger_mdit_sep5rgb_bs8_acc4_probe10 \
  --description "sep-encoder throughput probe bs8 acc4" \
  --headless --show-progress

# bs=12, acc=3
python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --stage-epochs 10 --checkpoint-every 10 \
  --experiment-name sep5rgb_bs12_acc3_probe10 \
  --run-name unplug_charger_mdit_sep5rgb_bs12_acc3_probe10 \
  --description "sep-encoder throughput probe bs12 acc3" \
  --headless --show-progress \
  --set batch_size=12 --set grad_accum_steps=3
```

### 6.4 单 checkpoint 离线评估

```bash
python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<run>/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --device cuda \
  --headless \
  --show-progress \
  --no-prefer-ema
```

---

## 7. 诊断路径（按顺序排查，不允许乱跳）

### 7.1 success=0 / 极低成功率

先排查顺序：

1. 查 `eval_results/` 下的 `__analysis.json`：
   - `failure_step_buckets.lt_20 > 30%` → 动作发散，看 `action_postprocess.py`
   - `failure_step_buckets.at_horizon = 100%` → 策略运行但无法完成，看 loss 收敛
   - `failure_error_buckets.planning_runtime_error > 50%` → planner 拒绝动作，检查 gripper threshold
2. 查 `summary.json` 的 `train_loss_last` 与 `valid_loss_last` 比值：
   - 如果 `valid/train > 20×` → 严重过拟合，考虑降低可训练参数（减少 `num_unfreeze_blocks`）
3. 若 `grip_transition_acc < 0.5`（valid 里）→ 先提 `loss_weights.grip=2.0`

### 7.2 valid loss 已收敛但 success 仍低

1. 确认 eval 使用 raw weights（`--no-prefer-ema`）
2. 确认 eval 使用 `success@20`，不用 valid loss
3. 检查 `mdit/model/model.py` 的 `predict_action` 的相机选择逻辑（`_select_runtime_cameras`）是否与训练时 camera_names 匹配

### 7.3 显存不足

1. 先尝试降 `batch_size=6, grad_accum_steps=6`（effective batch 不变）
2. 再尝试 `num_unfreeze_blocks=1`（已是最小值）
3. 如果仍不足，切回 `use_separate_encoder_per_camera=false`（共享 encoder，显存减 4/5）

---

## 8. 文件映射

| 目的 | 文件 |
|---|---|
| 主线配置 | `configs/mdit/faithful_baseline.json` |
| 主线入口配置 | `configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json` |
| Vision 解冻逻辑 | `mdit/model/observation_encoder.py` |
| Vision config 定义 | `mdit/config/schema.py` (`VisionEncoderConfig`) |
| 优化参数分组 | `mdit/model/model.py` (`get_optim_params`) |
| 评估入口 | `mdit/train/eval.py` |
| 训练主循环 | `mdit/train/runner.py` |

---

## 9. 每轮必须汇报的字段（继承 v4，补充）

- `vision.use_separate_encoder_per_camera`
- `vision.train_mode`
- `vision.num_unfreeze_blocks`
- `vision_trainable_params`（来自 `get_optim_params` 统计）
- `success@20` / `success@100`
- `valid/loss_total`, `valid/loss_grip`, `valid/grip_transition_acc`

---

## 10. 与上一版本 v4 的差异总结

| 项目 | v4 | 本版本 |
|---|---|---|
| vision encoder | 共享 1 个 ViT | **5 个独立 ViT（per-camera）** |
| `last_block` 是否真正只训最后1层 | 否（bug，实训全量） | **是（已修复）** |
| 解冻粒度 | 只有 `last_block`/`all`/`frozen` | **增加 `last_n_blocks` + `num_unfreeze_blocks`** |
| eval `steps` 精度 | 中途 exception → steps=0 | **保留实际步数** |
| 主要已知风险 | vision 全量训练+过拟合 | adaLN conditioning_dim 过大（~8724），未压缩到 hidden_dim |
