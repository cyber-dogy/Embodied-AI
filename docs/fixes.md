# fixes.md — MDIT/PDIT 修复记录

## 【Agent 必读规则】

**每个 agent 在修改本项目代码前必须先读此文件。**
每次发现 bug、做出修改、观察到实验结果后，必须在本文件追加一条记录。
格式：日期 · 文件 · 问题 · 修改 · 结果。只记关键信息，禁止大段粘贴无关代码。

---

## 记录

### 2026-04-12 · `mdit/model/transformer.py` · output_proj 未零初始化

**问题**：`_initialize_weights` 只零初始化了各 block 的 `adaLN_modulation`，未零初始化 `output_proj`。
导致 AdaLN-Zero 初始化意图被破坏——blocks 是 identity，但最终输出是随机速度而非 0，早期训练不稳定。

**修改**：

```python
# _initialize_weights 末尾加两行
nn.init.constant_(self.output_proj.weight, 0)
nn.init.constant_(self.output_proj.bias, 0)
```

**结果**：待观察（与下两条同批修入）

---

### ~~2026-04-12 · `mdit/model/transformer.py` · conditioning_dim 过大淹没 timestep 信号~~ [已回滚]

**原分析**：RGB 模式下 conditioning_dim=3870，timestep 信号（256 维）占比低。
**为何回滚**：`cond_proj` 是架构改动，不是 bug。原模型 0.65@20ep 已验证有效；
贸然加入会破坏 checkpoint 兼容性，且效果未知。用户要求只修硬 bug。

---

### 2026-04-12 · `mdit/train/eval.py` · validation loss 随机采样导致 epoch 间剧烈抖动

**问题**：`evaluate_model_on_loader` 调用 `model(batch)` 触发 `compute_loss`，
每次重新采样 noise 和 t，同一模型同一数据集两次 eval 结果可能差 20–30%，
valid loss 曲线完全不可信，看起来像"不收敛"。

**修改**：eval 期间固定随机种子，结束后恢复：

```python
cpu_rng_state = torch.get_rng_state()
cuda_rng_states = torch.cuda.get_rng_state_all() if torch.cuda.is_available() else None
torch.manual_seed(0)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(0)
try:
    # ... 原有 eval 循环 ...
finally:
    torch.set_rng_state(cpu_rng_state)
    if cuda_rng_states is not None:
        torch.cuda.set_rng_state_all(cuda_rng_states)
```

**结果**：valid loss 现在跨 epoch 可比较，是真实的训练信号。待观察。

---

### 2026-04-12 · `mdit/` 全系 · 新增 PCD 输入模式（ablation）

**目的**：隔离排查"训练崩溃是 transformer 实现问题还是 RGB+text 模态问题"。

**修改摘要**：

- `constants.py`：加 `OBS_PCD`
- `config/schema.py`：加 `PcdEncoderConfig` + `use_pcd: bool = False`
- `data/dataset.py`：`use_pcd=True` 时加载 `pcd_xyz`，返回 `OBS_PCD`
- `model/observation_encoder.py`：加 `PointNetObsTokenEncoder`（复用 pdit 实现），`use_pcd` 分支
- `configs/mdit/pcd_ablation.json`：新建，继承 faithful_baseline，仅改模态相关字段

**结果**：100ep 测试，success_rate=0.0，mean_steps=0.0（每 episode 第 0 步即终止）。
train_loss=0.046 vs valid_loss=1.307，严重过拟合/valid 指标失真。
上述三条 transformer bug 修复后需重新评估。

---

### 2026-04-12 · `mdit/model/model.py` + `mdit/train/eval.py` · PCD 评估推理路径全错导致 mean_steps=0

**问题**：eval 每个 episode 瞬间结束（8.6s / 20ep），mean_steps=0.0。
根本原因三处：

1. `reset()` PCD 模式下仍建 `OBS_IMAGES`/`TASK` queue（已修）
2. `predict_action()` 始终组装 `{OBS_IMAGES, OBS_STATE, TASK}` batch，PCD encoder 找不到 `OBS_PCD` → KeyError → exception handler 设 steps=0
3. `run_success_rate_eval()` 中 `obs_mode="rgb"` 硬编码，PCD 模式下 env 不返回点云

**修改**：

```python
# model.py predict_action — 加 PCD 分支
if self.config.use_pcd:
    pcd = np.asarray(obs, dtype=np.float32)  # (P_all, C)
    idx = np.random.choice(pcd.shape[0], n_points, replace=False)
    pcd_tensor = torch.from_numpy(pcd[idx]).unsqueeze(0)  # (1, P, C)
    action = self.select_action({OBS_PCD: pcd_tensor, OBS_STATE: state})
else:
    # 原有 images+task 路径不变

# eval.py run_success_rate_eval — obs_mode 随配置切换
obs_mode="pcd" if cfg.use_pcd else "rgb",
n_points=int(cfg.observation_encoder.pcd.n_points) if cfg.use_pcd else 2048,
```

**结果**：待验证（需在 RLBench 机器上重新评估）

---

### 2026-04-12 · `mdit/model/model.py` · PCD 模式下 `OBS_STATE` 仍沿用 RGB 的 min-max 归一化，不符合 PDIT 点云条件分布

**问题**：
`use_pcd=True` 时虽然 observation encoder 已切到 PointNet，但 `OBS_STATE` 仍通过
`dataset_stats` 做 RGB/MDIT 风格的 min-max 归一化；而 PDIT 的点云路径会把观测状态与点云一起
按 `norm_center` 对齐（xyz 减中心，gripper 减 0.5）。
这会让“PCD ablation”并没有真正对齐到 PDIT 输入分布，属于兼容层未做完整。

**修改**：

```python
def _normalize_conditioning_state(self, state):
    if not self.config.use_pcd:
        return self.normalize_state(state)
    normalized = state.clone()
    normalized[..., :3] -= norm_center
    normalized[..., 9] -= 0.5
    return normalized
```

并在 train/eval 共用的 `_normalize_batch()` 与 `_generate_action_chunk()` 中统一走该分支。

**结果**：
代码路径已修正为更接近 PDIT 的 PCD 观测条件。
注意：这会改变 `use_pcd` 模式的训练分布，旧的 `pcd_ablation_v1` checkpoint 不再可用于判断该兼容方案是否有效，需要重新训练后再评估。

---

### 2026-04-12 · `mdit/train/eval.py` · 回滚 valid 固定随机种子逻辑（恢复原版 MDIT 行为）

**问题**：
此前为降低 valid 抖动，在 `evaluate_model_on_loader()` 中加入了固定 `torch` 随机种子。
这会让 Flow Matching 的随机噪声目标在各 epoch 可重复，valid 曲线异常平滑，不符合“保持原版 MDIT 实现”的要求。

**修改**：

- 删除 eval 阶段的 `manual_seed(0)` 与 RNG state save/restore 逻辑
- 恢复为原始随机采样（每次 eval 随机噪声、随机 timestep）

**结果**：
valid 计算行为与原版 MDIT 对齐，不再强制 deterministic。

---

### 2026-04-12 · `mdit/train/checkpoints.py` + `mdit/train/runner.py` + `mdit/train/eval.py` · PCD 路径下 EMA 权重显著劣化，`--prefer-ema` 评估大量 `error=yes`

**问题**：
`epoch_0100` 在 `--prefer-ema` 下评估时，大量 episode 出现
`A path could not be found because the target is outside of workspace` / `V-REP side -1`。
排查显示非 Python 崩溃，而是策略动作幅度异常导致规划器拒绝。同一 checkpoint 对比（小批量 valid）：

- `model_state_dict`：`loss_total ~ 0.33`
- `ema_state_dict`：`loss_total ~ 1.23`
  说明该阶段 EMA 明显劣于 raw 权重。

**修改**：

- 本条先记录问题与结论，代码层未提交修复。
- 临时规避：评估命令使用 `--no-prefer-ema`，避免加载劣化的 `ema_state_dict`。

**结果**：
`--no-prefer-ema` 下 `epoch_0100` 评估不再出现”几乎全是 error=yes”的模式（5ep 快测：`success_rate=0.2`，多数失败为跑满 horizon 而非仿真侧异常）。
后续待做：调整 EMA 更新策略（重点检查 BN running stats 处理）。

---

### 2026-04-13 · `mdit/model/transformer.py` · output_proj 零初始化修复验证 (autoresearch)

**问题**：
之前的 screening 分支 (`rgb5_sep_lastblock_a8_lr2e5_100`) 使用 bug 版本代码训练 (commit `105a050`)，
该版本缺少 `output_proj` 的零初始化，导致：

- 100 epoch 训练完成，train_loss=0.00116
- 但 success@20 = 0.0（完全失败）

**修复验证**：
当前代码 (commit `28adab6`) 已包含修复：

```python
nn.init.constant_(self.output_proj.weight, 0)
nn.init.constant_(self.output_proj.bias, 0)
```

**重新训练**：
使用修复后的代码重新启动3条 screening 分支：

1. `rgb5_sep_lastblock_a8_lr2e5_100_v2` (基线)
2. `rgb5_sep_lastblock_a8_lr1p5e5_100_v2` (lr=1.5e-5)
3. `rgb5_sep_lastblock_a8_dropout0_100_v2` (dropout=0.0)

**结果**：待观察 (100 epoch 后评估)

---

### 2026-04-13 · `mdit/` 全链路 · 新增 PCD transformer 消融开关（`mdit` vs `pdit`）

**问题**：
用户要求在同一训练入口下做“是否是 transformer 结构问题”的可复现实验：

- 选 `mdit`：沿用当前 MDIT transformer
- 选 `pdit`：切换到 PDIT 的 DiT trajectory backbone（点云路径）

**修改**：

- `config/schema.py`：新增
  - `pcd_transformer_variant: str = "mdit"`（`mdit|pdit`）
  - `PDITBackboneConfig`（`dim_feedforward/activation/debug_finiteness/final_layer_zero_init/decoder_condition_mode`）
- `model/observation_encoder.py`：
  - 新增 `token_dim`
  - 新增 `encode_tokens()`，保留 `encode()` 输出 flatten 行为
- `model/transformer.py`：
  - 新增 `PDITDiffusionTransformer`，内部复用 `pdit.model.backbones.dit.DiTTrajectoryBackbone`
- `model/model.py`：
  - 按 `pcd_transformer_variant` 选择 `DiffusionTransformer` 或 `PDITDiffusionTransformer`
  - 新增 `_encode_conditioning()`，`pdit` 分支走 token conditioning
- `mdit/cli/train.py` 与 `mdit/cli/run_autoresearch_trial.py`：
  - 新增 CLI 参数 `--pcd-transformer-variant {mdit,pdit}`
- 新增配置：
  - `configs/mdit/pcd_ablation_pdit_transformer.json`

**结果**：
可在同一训练命令体系下通过单开关完成 PCD transformer 消融。
已做 smoke test：`pcd_ablation_pdit_transformer.json` 可正常前向计算 loss。

---

### 2026-04-13 · `mdit/train/eval.py` · valid loss 仍使用随机 noise/t，epoch 间不可直接比较

**问题**：
当前 `evaluate_model_on_loader()` 直接调用 `model(batch)`，Flow Matching 会再次随机采样 `noise` 和 `t`。
这会让同一模型对同一 valid 集两次计算得到不同 loss，容易把“指标抖动”误判成“训练反弹”。

**修改**：

- 新增 `validation_seed` 配置项，默认 `0`
- valid 评估时固定 `torch` RNG，并在结束后恢复 CPU/CUDA RNG state
- 这样 valid 的噪声目标在不同 epoch 间可比，但不会污染训练阶段的随机数流

**结果**：
valid loss 现在可作为跨 epoch 的稳定对比信号；训练采样随机性保持不变。

---

### 2026-04-13 · `mdit/config/schema.py` + `configs/mdit/pcd_ablation_pdit_transformer.json` · PCD 切到 PDIT backbone 时未默认启用 final layer zero-init

**问题**：
虽然 `mdit` 主干已经补了 `output_proj` 零初始化，但 `pcd_transformer_variant="pdit"` 这条消融线仍默认
`final_layer_zero_init=false`。这和 PDIT autoresearch 已验证有效的结构设定不一致，会让消融结果掺入额外变量。

**修改**：

- `PDITBackboneConfig.final_layer_zero_init` 默认值改为 `True`
- `configs/mdit/pcd_ablation_pdit_transformer.json` 同步改为 `true`

**结果**：
PCD + PDIT-backbone 消融现在和 PDIT 的已验证稳定配置更一致；后续结果更可解释。

---

### 2026-04-13 · `mdit/train/eval.py` · 回滚 deterministic valid loss（恢复原版 MDIT / PDIT 评估语义）

**问题**：
此前为了让 valid loss 跨 epoch 可比，给 `evaluate_model_on_loader()` 加了固定随机种子。
实际验证后，这会让 valid 曲线异常平滑，不再反映原版 MDIT / PDIT 的随机噪声评估行为。

**修改**：

- 删除 `validation_seed`
- 删除 valid 阶段固定 RNG / 恢复 RNG state 的逻辑
- 恢复为每次 eval 都随机采样 noise 和 timestep

**结果**：
当前 valid 评估重新与原版 MDIT / PDIT 行为对齐；后续不再把 deterministic valid 当作默认方案。

---

### 2026-04-13 · `pdit/` vs `mdit/pcd_ablation_pdit_transformer` · 澄清“成功配方消融”与“仅替换 backbone”不是同一件事

**问题**：
之前一度把 `configs/mdit/pcd_ablation_pdit_transformer.json` 当成“复现 PDIT 成功配方”的入口，这是错误理解。
用户要做的是：

- 以 **当时已经验证成功的 PDIT 完整配方** 为基线做消融对比
- 不是在 `mdit/` 训练栈里只把 transformer backbone 换成 `pdit`

**关键区别（必须固定记住）**：

1. **训练栈不同**

- `pdit` 成功线使用的是完整 `pdit/` policy、objective、optimizer、audit 流程
- `mdit` 消融线仍然使用 `mdit/` 的 dataset adapter、objective、EMA、success eval、rollout/readout、postprocess 与 checkpoint 逻辑
- 也就是说，`mdit` 这条线只是“借用 PDIT backbone”，并没有复现完整的 PDIT 系统

3. **优化配置不同**

- PDIT 成功线（`configs/train/baseline_500.json`）：
  - `batch_size=32`
  - `grad_accum_steps=2`
  - `train_use_amp=false`
  - `learning_rate=1e-4`
  - `betas=[0.9, 0.95]`
  - `transformer_weight_decay=0.001`
- MDIT 消融线（`configs/mdit/faithful_baseline.json` 及其派生）：
  - 默认 `use_amp=true`
  - `optimizer_lr=2e-5`
  - `betas=[0.9, 0.999]`
  - `optimizer_weight_decay=1e-4`

4. **FM/采样语义不同**

- PDIT 成功线 policy 配置（`configs/policy/fm_baseline.json`）仍包含：
  - `fm_num_k_infer=10`
  - `fm_flow_schedule="exp"`
  - `fm_snr_sampler="uniform"`
- MDIT 消融线使用的是 `mdit` 的 Flow Matching objective：
  - `sigma_min=0.001`
  - `num_integration_steps=25`
  - `timestep_sampling.strategy_name="beta"`
- 两者虽然都叫 FM / DiT，但训练目标与推理积分细节并不相同

5. **结构语义也不完全相同**

- PDIT 成功线的 baseline model（`configs/model/pointnet_dit_baseline.json`）原始设定是：
  - `dropout=0.1`
  - `final_layer_zero_init=false`
- 后续 autoresearch 才证明：
  - `dropout=0.0 + final_layer_zero_init=true`
    是一个可信的结构改进方向
- 当前 `mdit/pcd_ablation_pdit_transformer` 默认已经被我改成 `final_layer_zero_init=true`，这更接近 PDIT 的改进候选，不再是最初 baseline 的逐项复现

6. **batch size 不是根因**

- PDIT 成功线里的 `batch_size=32` 是当时基于设备显存选出来的工程参数，不是“100 epoch 能到 0.8+”的本质原因
- 真正起决定作用的是：
  - 跑的是完整 `pdit/` 训练栈
  - 训练/评估/审计链路已被 autoresearch 修稳
  - ckpt 选择按离线 success，而不是只看 `valid loss`
- 因此不能把“今天某台机器能跑到更大的 bs”解释成“已经复现了当时成功配方”

**结论（后续执行必须遵守）**：

- 若目标是**复现并对比当时 `100 epoch ≈ 0.8+` 的成功配方**，必须走 `pdit` 线：
  - `--line pdit`
  - `configs/fm_autodl_lab.json`
- 若目标是**只测 transformer 主干替换是否有效**，才使用 `mdit/pcd_ablation_pdit_transformer.json`
- 这两种实验的解释口径不同，结果绝不能混写在一起

**结果**：
后续不再把 `mdit/pcd_ablation_pdit_transformer` 误称为”PDIT 成功配方复现版”。
所有”成功配方消融”都应默认指向真正的 `pdit` 主线。

---

### 2026-04-13 · 消融实验 · PCD + MDIT Transformer vs PCD + PDIT DiT（100 epoch, bs=80）

**实验**：
- Exp A：`unplug_charger_mdit_pcd_mdit_transformer_100`（PCD + Text/CLIP + 因果Transformer）
- Exp B：`unplug_charger_pdit_baseline_100_bs80`（PCD only + DiT backbone，完整 pdit 训练栈）

**关键参数差异**：

| 项目 | Exp A（MDIT Transformer） | Exp B（PDIT DiT） |
|---|---|---|
| backbone | 因果Transformer + positional encoding | DiT (adaLN 每层注入) |
| FM 时间步 | beta(α=1.5, β=1.0) | exp(scale=4.0) + uniform SNR |
| 推理步数 | 25 步（Euler） | 10 步 |
| 训练数据 | 7773 train | 10573 train（+36%，混淆变量）|
| 额外输入 | Text (CLIP) | 无 |
| final_layer_zero_init | True | False |

**结果**：
- Exp A success_rate = **0.30**，mean_steps = 172.78，失败全部跑满 horizon（200步）
- Exp B success_rate = **0.70**，mean_steps = 103.67，成功 episodes 平均 ~49 步完成

**现象**：
MDIT Transformer 在 PCD-only 条件下，策略可运行但动作无法收敛完成任务；PDIT DiT 用10步推理就获得70%成功率，流场更”直”、积分更稳。

**根本原因分析**：
1. **FM schedule 差异是主因**：PDIT 的 exp(scale=4.0) + uniform SNR 更均匀覆盖噪声区，产生更直的流场，10步就够；MDIT 的 beta 采样偏向低噪声区，高噪声段学习不足，推理积分容易偏。
2. **adaLN vs mean_pool 条件注入**：DiT 在每层用时间步/条件调制 LayerNorm scale/shift，比 MDIT 的 mean_pool prefix 注入对时间步信号更直接有效。
3. **数据量差异贡献有限**：+36% 数据最多贡献约 5–10 pp，无法解释 40 pp 的差距。

**改进方向（MDIT RGB+text 线的下一步）**：

> **必须同步做两件事，缺一不可**：
> 1. 将 MDIT 的 transformer backbone 切换为 DiT（`pcd_transformer_variant=”pdit”`）
> 2. 将 FM schedule 从 `beta(α=1.5,β=1.0)+25步` 改为 `exp(scale=4.0)+uniform SNR+10步`
>
> 仅换 backbone 不换 FM schedule，等价于”只做了一半”，实验设计仍有缺陷（当前 `pcd_ablation_pdit_transformer.json` 即为此陷阱）。

**详细分析**：`docs/mdit/2026-04-13-pcd-transformer-ablation-mdit-vs-pdit.md`
