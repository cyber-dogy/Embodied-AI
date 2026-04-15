# fixes.md — MDIT/PDIT 修复记录

## 【Agent 必读规则】

**每个 agent 在修改本项目代码前必须先读此文件。**
每次发现 bug、做出修改、观察到实验结果后，必须在本文件末尾追加一条记录。
格式固定为：`YYYY-MM-DD HH:MM:SS ±TZ · 文件 · 问题 · 修改 · 结果`。必须带完整时间戳。只记关键信息，禁止大段粘贴无关代码。

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
后续不再把 `mdit/pcd_ablation_pdit_transformer` 误称为“PDIT 成功配方复现版”。
所有“成功配方消融”都应默认指向真正的 `pdit` 主线。

---

### 2026-04-13 · `pdit` · 成功配方为什么明显强于当前 `mdit`

这次确认后，真正跑出高成功率的是完整 `pdit` 主线，而不是把 `pdit` backbone 塞进 `mdit` 训练栈的那条消融。成功版 `pdit` 的关键参数是：`obs3 + pcd(2048 points) + pred32`，训练侧 `lr=1e-4`、`betas=[0.9,0.95]`、`train_use_amp=false`、`batch_size=32`、`grad_accum_steps=2`、`ema=0.9993`，策略侧 `fm_num_k_infer=10`、`fm_flow_schedule="exp"`、`fm_snr_sampler="uniform"`；模型侧是 `hidden_dim=512`、`time_dim=256`、`num_blocks=6`、`nhead=8`、`ff=2048`、`dropout=0.1`、`decoder_condition_mode="mean_pool"`。

它和当前 `mdit` 的关键差异不在“入口名字”，而在 transformer 的条件路径：`pdit` 的 `DiTTrajectoryBackbone` 保留条件 token，并走 encoder-decoder 式的条件编码与解码；当前 `mdit` 的 `DiffusionTransformer` 则把观测条件展平成一个大向量，与时间嵌入拼接后通过 AdaLN 调制整层。前者更接近“条件作为序列参与建模”，后者更接近“条件作为全局调制信号”。在点云任务上，这个差异会直接影响条件信息是否被稳定保留下来，而不只是影响 loss 形状。

结果上，`pdit` 文档里已经验证到 `epoch_0100 success_rate = 0.90`，后续 `epoch_0500 = 0.95`，再做 `100 episodes` 复核仍有 `0.85`；而当前这轮 `mdit` 主线的 `100 epoch` 审计只有 `0.0 ~ 0.2`。因此，原版 `pdit` 更强的根本原因应记为：它跑通的是“完整且彼此匹配的 PDIT 系统”，包括点云输入、token 级条件路径、对应的 FM/优化配置、EMA 与离线 success 选模；`batch_size=32` 只是当时设备下的一个实现值，不是成功的决定性原因。

---

### 2026-04-13 · `mdit/config/*` + `mdit/model/*` · RGB 主线直接切到 PDIT 条件路径

当前 `MDIT` 的主要问题已经不再记录为“继续扫 `lr/dropout`”，而是记录为“`RGB+TEXT+obs3` 在旧主干里先被压成全局向量，再只通过 AdaLN 调制动作序列，条件 token 结构丢失”。因此这轮代码不再做 bottleneck 试探，而是直接保留 `5RGB + obs3 + last_block + text + a8`，新增统一开关 `transformer_variant`，让 RGB 主线也能走 `PDIT` 风格的 token-conditioned encoder-decoder 路径。

实现上，`ObservationEncoder.encode_tokens()` 的 RGB 分支现在会输出真正的条件 token 序列：每个 `obs step` 固定产出 `1 x robot_state token + 5 x camera token`，整个样本额外追加 `1 x text token`，当前主线总 token 数固定为 `3 * 6 + 1 = 19`。`MultiTaskDiTPolicy` 在 `transformer_variant="pdit"` 时不再要求 `use_pcd=true`，而是直接复用 `PDITDiffusionTransformer` 与现有 `pdit.model.backbones.dit.DiTTrajectoryBackbone`；`pdit_backbone.final_layer_zero_init=true`、`decoder_condition_mode="mean_pool"` 固定写进新的 `obs3_rgb5_pdittoken_lastblock_a8_gate100.json`。

结果：现在可以在 **不改 5RGB / obs3 / last_block / text / a8** 的前提下，直接回答“问题是不是出在旧的 MDIT 条件路径”。后续 autoresearch 的首条主线固定为 `rgb5_pdittoken_lastblock_a8_lr2e5_100`，不再继续把 `rgb5_sep_lastblock_a8_lr2e5 / lr1p5e5 / dropout0` 当作主研究方向。

---

### 2026-04-13 · `mdit/train/eval.py` + `mdit/train/runner.py` · success eval GPU OOM 改为自动 CPU fallback 并写入记录

之前 `success@20` screening 里存在一个会污染结论的问题：训练本身可能正常，但训练后隔离评估子进程在 GPU 上加载 ckpt 时 `CUDA OOM`，最后被误看成“模型失败”。这次把行为固定成：先按原 device 跑一次 isolated eval，如果报 `CUDA out of memory`，自动重试一次 `--device cpu`，并把 `device_used`、`cpu_fallback`、`initial_device` 写进 `success_eval_history.json`；如果 CPU fallback 也失败，错误文本里也必须明确显示“先 OOM，后 CPU fallback 失败”。

结果：后续 autoresearch 的 `100 epoch` 结果里，可以区分“模型真的差”和“评估进程在 GPU 上 OOM”。这能避免再把无效负样本写进研究结论，也让 `wandb` 和本地 JSON 记录保持一致。

---

### 2026-04-13 · `mdit/model/objectives.py` + `mdit/train/eval.py` · grip 不是切片 bug，真正问题是 loss 聚合方式低估了 gripper

这次重新检查 `valid/loss_total` 回升和 `valid/loss_grip` 异常后，确认当前重点不是“valid 代码算错了”。`evaluate_model_on_loader()` 仍保持原版随机采样 noise/t 的语义，所以 `valid/loss_total` 小幅回升本身不应直接当 bug；真正危险的是 `valid/loss_grip` 单独变差，而任务 `unplug_charger` 又对夹爪开合时机高度敏感。

代码层的关键差异在于：旧 `MDIT` 的 Flow Matching loss 是 10 维直接平均，因此 `grip` 只有 1 维，在总目标里天然被稀释到约 10%；成功版 `PDIT` 则是先分别算 `loss_xyz / loss_rot6d / loss_grip`，再按组件加权求和，默认三项同级。结合当前数据分布（gripper 打开帧约占 75%~80%，真实开关切换仅约 1.6%~1.9%），旧 `MDIT` 非常容易学成“夹爪中间值”或静态偏置，而 rollout 时又会被 `0.6 / 0.4` hysteresis 强行离散，最后直接拖低 success。

这轮修复固定为：

- `FlowMatchingObjective` 不再返回 10 维统一均值
- 改成按 `xyz / rot6d / grip` 分项加权求和
- 默认权重显式对齐 `PDIT`：`{xyz: 1.0, rot6d: 1.0, grip: 1.0}`
- valid 汇总新增 `grip_mean_pred`、`grip_mean_target`、`grip_deadband_ratio`、`grip_binary_acc`、`grip_transition_acc`

结果：后续训练里，`grip` 不再因为维度少而在总目标中被低权重；同时 autoresearch 能直接判断模型是不是学成了“中间值夹爪”，而不是只看 `loss_total` 猜。

---

---

### 2026-04-13 19:24:26 +0800 · `docs/fixes.md` · 修复记录规则更新

问题：此前有记录按主题插入在历史段落中间，时间粒度也不够细，审计时不容易按真实发生顺序追踪。

修改：从这条开始固定执行两条规则：

- 所有新记录必须写完整时间戳
- 所有新记录只能在 `fixes.md` 尾部追加，不能插入旧记录之间

结果：后续修复记录将按时间顺序单向增长，便于你和 autoresearch 直接审计。

---

### 2026-04-13 19:25:24 +0800 · `envs/rlbench_env.py` + `mdit/cli/eval_checkpoint.py` · 评估把规划失败误记为 simulator runtime error

问题：`PDIT token` 早期 checkpoint 的 20ep 评估里，18/20 被记成 `simulator_runtime_error`，错误文本实际是 `The call failed on the V-REP side. Return value: -1`。这类错误更像规划/动作执行失败，不是 CoppeliaSim 真崩溃。旧实现里 `RLBenchEnv._step_safe()` 对 `RuntimeError` 直接 `terminate=True`，导致本可插值回退的 episode 被过早打成硬失败；评估摘要又把这类错误直接归入 `simulator_runtime_error`，进一步放大误判。

修改：

- `envs/rlbench_env.py`
  - 对 `V-REP/CoppeliaSim side + return value -1` 这类 `RuntimeError` 改为走和 `IKError/InvalidActionError` 一样的插值回退路径
  - 仅把真正未识别的 `RuntimeError` 继续记为 `simulator runtime error`
- `mdit/cli/eval_checkpoint.py`
  - 新增 `planning_runtime_error` 分桶
  - 不再把 `V-REP side -1` 直接算进 `simulator_runtime_error`
  - `likely_causes` 改为区分 `planner_rejecting_many_predicted_actions` 和 `true_simulator_runtime_failures_dominate`

结果：评估记录现在能区分“规划器大量拒绝动作”和“仿真器真崩了”。后续看到大量 `planning_runtime_error` 时，应先怀疑策略动作不可执行，不要再直接解读成 simulator 本身异常。

---

### 2026-04-13 19:45:25 +0800 · `autoresearch/execution` · v2 screening 全分支未过 0.45 闸门，且训练进程存在"僵尸启动"现象

**问题**：

1. **v2 筛选结论**：3 条 100 epoch 分支全部失败，最高 success@20 仅 0.2，确认 AdaLN 全局条件路径即使修复 `output_proj` 零初始化后也无法突破 0.45 闸门：

   - `rgb5_sep_lastblock_a8_lr2e5_100_v2`：0.2（从 bug 版的 0.0 提升，但仍远低于阈值）
   - `rgb5_sep_lastblock_a8_lr1p5e5_100_v2`：0.1（更低 lr 效果更差）
   - `rgb5_sep_lastblock_a8_dropout0_100_v2`：训练中因用户干预终止
2. **训练进程"僵尸启动"**：在启动 `rgb5_pdittoken_lastblock_a8_lr2e5_100` 正式训练时，曾出现进程 PID 存在（CPU 占 25-73%）、但 **GPU 显存未分配**、**不写 checkpoint**、**tmux pane 无任何训练进度输出** 的状态。若不及时发现并杀死该进程，会造成显存空闲但训练无限挂起的假象。

**修改/结论**：

- 所有 v2 分支停止续训到 300 epoch，按执行计划清理周期性 ckpt，仅保留结论文件
- 本轮唯一主线全面切至 `rgb5_pdittoken_lastblock_a8_lr2e5_100`（PDIT token-conditioned 路径）
- **启动训练后必须双重确认**：
  1. `nvidia-smi` 中 Python 进程已占用显存
  2. `ckpt/<run>/epochs/` 目录开始产生写入，或 tmux 出现 `mdit train epoch N:` 进度条

**结果**：

- v2 分支结果已全部写入 `results.tsv` 与研究文档，标记为 FAILED
- PDIT token-conditioned 主线当前已在 `mdit_pdittoken_100` session 中正常训练（epoch 2+，GPU 20.7GB，5.24 it/s）

---

### 2026-04-13 20:03:04 +0800 · `docs/fixes.md` + `docs/mdit/research/*` + `docs/mdit/2026-04-12-*` · MDIT faithful 基线优于后续 `rgb5+last_block` 分支的原因分析

问题：后续 `rgb5_sep_lastblock_a8_*` 分支成功率显著低于前面的 faithful 较好基线，但这件事很容易被误写成“因为改成了 `5RGB + last_block`”。实际核对现存 run 配置后，后续分支并不是单变量对照，而是同时改了 `obs_steps`、`n_action_steps`、视觉冻结/微调方式、shared/separate encoder、AMP、有效 batch、FM 积分设置、优化器超参和 rollout 平滑等多项关键因素。

修改：固定更新三条解释口径并写入执行文档与独立分析文档：

- 对 `MDIT faithful` 内部对比，较好基线更像“更保守、更适配旧 MDIT 全局 AdaLN 条件路径的 recipe”，不是运气
- 对后续 `5RGB + last_block` 分支，不允许再写成“只改了 5RGB+last_block，所以它更差”
- 对整个项目的大结论，`PDIT` 的高成功率主要来自结构 + FM 训练栈 + success-based 选模链路共同作用，不是纯运气

结果：后续研究记录和 autoresearch 执行口径现在会明确区分两层问题：

- `MDIT faithful` 为什么相对更稳：更像保守 recipe 更适配旧架构
- 为什么项目里真正高成功率的是 `PDIT`：更像 `PDIT` 的结构与整套链路更强，而且结果可复现，不是偶然

---

### 2026-04-13 22:31:29 +0800 · `configs/mdit/*` + `research/mdit_autoresearch_loop.py` + `docs/mdit/*` · 主线从 `obs3+a8+separate+AMP` 回锚到 `obs2+a16+shared+AMP off`

问题：此前主线同时混入了多项并非用户最开始明确要求的高影响改动，包括 `obs3`、`a8`、separate encoder、AMP、更快 FM 设置与 rollout 平滑。这会让 `5RGB + last_block` 的结论被大量 recipe 漂移污染，也容易再次把旧 RGB 条件路径拖回“超大条件导致模型失败”的区域。

修改：本轮把默认主线固定回更接近成功锚点的 recipe：`obs2 + action16 + shared encoder + use_amp=false + grad_accum_steps=4 + sigma_min=0.0 + integration_steps=50 + weight_decay=0.0`，同时保留用户明确要坚持的 `5RGB + text + last_block`，并继续保留 `PDIT` token-conditioned 条件路径、gripper loss 对齐修复、planning/runtime error 分桶和 success eval CPU fallback。新增唯一主线配置 `rgb5_shared_lastblock_pdittoken_obs2_a16_gate100.json`，autoresearch 默认 baseline 与执行手册也全部切到这条线；显存探测脚本被显式禁用，防止低智 agent 陷入 batch size 循环。

结果：新的默认主线不再是“在旧高漂移 recipe 上继续加复杂度”，而是“成功锚点约束下的最可能成功状态”。这不是放弃 `5RGB + last_block`，而是把它们放回更稳的训练栈里，并通过 token-conditioned 路径避免再次走回超大 flatten conditioning vector 的失败模式。

---

### 2026-04-14 10:35:09 +0800 · `autoresearch/execution` · 旧 `rgb5_pdittoken_lastblock_a8_lr2e5_100` 主线评估完成，success@20=0.0，未过闸门，已清理

**问题**：
旧 `obs3+a8+separate+AMP` 的 PDIT token-conditioned 主线已完成 100 epoch 训练与评估，success@20 = 0.0，远低于 0.45 闸门。评估显示：

- 20/20  episodes 全部失败
- mean_steps = 198.75（几乎跑满 horizon）
- failure_error_buckets：`planning_runtime_error=11`，`none=6`，路径规划失败=2，recursion_limit=1
- `likely_causes` 明确指向 `planner_rejecting_many_predicted_actions` 和 `policy_quality_is_currently_well_below_target`
- valid/loss_grip = 0.953，grip_transition_acc = 0.0，说明 gripper 维度虽然 loss 聚合已对齐，但策略质量整体仍不足

**修改/结论**：

- 按执行计划，该分支停止续训到 300 epoch
- 清理了周期性大 ckpt：`epochs/epoch_0100.pt`（~8.3GB）和 `best_success.pt`（~8.3GB）
- 保留了结论文件：`config.json`、`summary.json`、`dataset_stats.json`、`experiment_manifest.json`、`success_eval_history.json`、`audit_report.json`、`latest.pt`
- 评估记录已确认写盘，不只有 wandb 曲线
- 结果已写入 `results.tsv`

**结果**：
旧 `obs3+a8+separate+AMP` 的 PDIT token-conditioned 路径在此 recipe 下被证伪。autoresearch 现在全面切到新主线 `rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100`（`obs2+a16+shared+AMP off`）。

---



### 2026-04-14 10:52:40 +0800 · `autoresearch/execution` · 旧 `rgb5_pdittoken_lastblock_a8_lr2e5_100` 主线 100ep 成功率为 0 的原因复盘

问题：旧 `obs3+a8+separate+AMP` 的 PDIT token-conditioned 主线在 100 epoch 后 success@20=0.0，评估中 `planning_runtime_error=11`、`none=6`，mean_steps 接近上限，`loss_grip` 与 `grip_transition_acc` 极差。表面上看“像代码写错”，但结合已有修复与错误分桶，不支持“评估脚本坏了”的结论。

结论（固定口径）：当前 0 成功率更像是 **recipe 过度复杂 + 旧主线偏离成功锚点** 导致的策略质量不足，而非评估链路或 simulator 本体 bug。`planning_runtime_error` 说明规划器拒绝大量动作，`none` 表示策略在仿真中长期无效但未触发 simulator error；`grip_transition_acc=0` 说明策略在关键开合时机上完全失效。已确认 `planning_runtime_error` 与 `simulator_runtime_error` 分桶正常、`V-REP side -1` 插值回退逻辑生效，因此该结果应被解释为“策略失败”，不是评估代码坏掉。

处理：按执行计划终止该分支，并将主线回锚到 `obs2 + action16 + shared encoder + AMP off + faithful FM/optimizer` 的 `rgb5_shared_lastblock_pdittoken_obs2_a16_lr2e5_100`，保留 `gripper` loss 对齐修复与 PDIT token-conditioned 条件路径，作为当前“最可能成功状态”。

---

### 2026-04-14 21:05:27 +0800 · `mdit/train/eval.py` + `mdit/model/action_postprocess.py` + `research/mdit_trial_runner.py` · 对齐 mdit/pdit 评估语义与推理语义，并新增 recipe 漂移告警

问题：主线已经回锚到 `rgb5_shared_lastblock_pdittoken_obs2_a16`，但 `mdit` 里仍存在两处和 `pdit` 不一致的执行语义：一是 success eval 路径把 `disable_task_validation` 写死为 `true`；二是 `smooth_actions=false` 时仍对 gripper 强制 hysteresis 离散。并且 autoresearch 之前缺少对“命令覆盖主线锁定字段”的显式告警，容易把漂移 run 误当主线结论。

修改：新增 `rlbench_disable_task_validation` 配置项（默认 `false`）并在 `run_success_rate_eval()` 中透传到 `RLBenchEnv`；`postprocess_robot_state_command()` 改为仅在 `smooth_actions=true` 时执行 gripper hysteresis，`smooth_actions=false` 时保留 rot6d 正交化并直接使用原始 gripper 输出；`experiment_manifest.json` 新增 `recipe_drift` 与 `recipe_drift_details`，当覆盖 `batch_size / n_obs_steps / n_action_steps / observation_encoder.vision.train_mode` 时自动标记漂移并写明明细。

结果：本轮先把“评估链路偏差”和“推理语义偏差”从结构问题中剥离，后续 gate 结果可以先判断策略质量而不是语义错位。带 `recipe_drift=true` 的实验默认不参与主线结论。

---

### 2026-04-15 11:51:34 +0800 · `mdit/config/*` + `mdit/data/dataset.py` + `mdit/model/*` + `mdit/train/*` + `mdit/cli/*` + `research/mdit_*` + `configs/mdit/*` + `tests/test_mdit*` · MDIT 主线回收为 faithful `text+5RGB+MDIT+FM`，并移除主线 EMA / PDIT / PCD 默认路径

问题：现有 `mdit` 主线已经严重漂移，默认时间配方变成 `obs3/h32/a8`，训练里引入了原版没有的 `EMA`，success eval 子进程还默认 `--prefer-ema`，同时 `pdit/pcd` 与 faithful MDIT 语义混在同一条训练路径里，导致 `success=0` 时无法判断到底是策略崩了、评估坏了，还是 recipe 本身已经不是原版 MDIT。

修改：

- `mdit/config/schema.py`
  - 默认值改回 `n_obs_steps=2`、`horizon=100`、`n_action_steps=24`
  - `ema_enable=false`
  - 新增 `drop_n_last_frames`、`observation_delta_indices`、`action_delta_indices`
  - 新增 `validate_mainline_training()`，主线训练显式拒绝 `use_pcd=true / transformer_variant="pdit" / ema_enable=true`
- `mdit/data/dataset.py`
  - 采样切回 `anchor + delta_indices + drop_n_last_frames`
  - 删除旧的整窗平铺取样语义
- `mdit/model/observation_encoder.py` + `mdit/model/model.py`
  - 主线 conditioning 固定为 faithful RGB+text MDIT
  - legacy `pdit/pcd` 分支仅保留读取兼容，不再进入主线默认训练
- `mdit/train/runner.py` + `mdit/train/eval.py` + `mdit/train/checkpoints.py`
  - 主线 `valid`、`best_valid`、`success eval` 全部使用 raw model
  - success eval 子进程默认传 `--no-prefer-ema`
  - 新 checkpoint 默认不再保存空的 `ema_state_dict`
- `mdit/cli/train.py` + `mdit/cli/run_autoresearch_trial.py` + `research/mdit_trial_runner.py`
  - 默认配置切到 `configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json`
  - 主线 trial 强制 `wandb_enable=true`、`wandb_mode="online"`，缺 `wandb_run_id/url` 直接判无效
- `research/mdit_autoresearch_loop.py`
  - 默认 baseline 改为 faithful `rgb5_lastblock_faithful_obs2_h100_a24_100`
  - 只保留 `bs8_acc4 / bs12_acc3 / bs16_acc2` 三个资源探测 spec
- `configs/mdit/*`
  - `faithful_baseline.json` 改成 exact-faithful 基座
  - 新增唯一主线配置 `rgb5_lastblock_faithful_obs2_h100_a24.json`
- `tests/test_mdit*`
  - 更新默认值、raw/no-EMA 行为、mainline 校验与 autoresearch 行为断言

结果：当前 `mdit` 主线已经收敛到“faithful RGB+text+MDIT+FM + raw eval + wandb online”的单义路径；legacy checkpoint 仍可显式 `--prefer-ema` 做只读审计，但不再污染主线结论。

---

### 2026-04-15 11:51:35 +0800 · `docs/mdit/2026-04-12-mdit-autoresearch-execution-plan-zh.md` + `docs/fixes.md` · 执行手册切换到 faithful 主线，并补齐训练 / 评估 / 改进路径 / W&B / 资源探测口径

问题：旧执行手册仍以 `rgb5_shared_lastblock_pdittoken_obs2_a16` 为唯一主线，且缺少新的 faithful 配置、raw/no-EMA 评估口径、wandb 强制留档规则、`bs=8/12/16` 资源探测接口，以及“结果差时先改哪里”的固定分流，已经不能直接指导当前代码。

修改：

- 把唯一主线改成 `configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json`
- 明确写入：
  - 主线训练禁止 `pdit/pcd/EMA`
  - 主线评估默认 `--no-prefer-ema`
  - `wandb_run_id` + `wandb_run_url` 是有效 run 的必要条件
  - `recipe_drift` 的锁定字段与判定口径
  - `bs=8/12/16` 与 `grad_accum=4/3/2` 的唯一允许资源接口
  - baseline / train-only / audit-only / 单 checkpoint / 全 checkpoint 的标准命令
  - 100ep / 300ep / 500ep 闸门
  - `planning_runtime_error` / `grip_transition_acc` / raw-vs-EMA / GPU 利用率四条固定排查分支
  - 文件级改动映射

结果：下游 agent 现在可以直接按执行手册跑 faithful 主线、资源探测和审计，且所有结果都能通过本地 JSON + wandb 双重留痕复核。

---

### 2026-04-15 12:26:14 +0800 · `docs/mdit/2026-04-15-mdit-faithful-rgb5-fm-execution-plan-zh.md` + `docs/mdit/2026-04-12-mdit-autoresearch-execution-plan-zh.md` + `docs/mdit/research/2026-04-13-mdit-autoresearch-v2-execution-zh.md` + `docs/fixes.md` · 执行手册正式迁移到 2026-04-15 文件名，旧路径保留跳转页

问题：上一轮虽然已经把 `2026-04-12-mdit-autoresearch-execution-plan-zh.md` 内容更新为 faithful 主线最新版，但文件名仍停留在历史日期，容易让执行者误以为“内容是 4-12 的旧计划”。继续沿用旧文件名会让下游 agent、研究记录引用和人工审阅都产生混淆。

修改：

- 新建正式文件：
  - `docs/mdit/2026-04-15-mdit-faithful-rgb5-fm-execution-plan-zh.md`
- 将完整 faithful MDIT 执行手册正文迁移到新文件
- 原 `docs/mdit/2026-04-12-mdit-autoresearch-execution-plan-zh.md` 改为兼容跳转页
  - 保留旧路径，避免历史链接失效
  - 明确声明“最新版请看 2026-04-15 文件”
- 将已发现的研究文档引用更新到新路径：
  - `docs/mdit/research/2026-04-13-mdit-autoresearch-v2-execution-zh.md`

结果：现在文档层已经同时满足两件事：

- 最新 faithful 主线执行手册有正确的 2026-04-15 文件名
- 历史 `2026-04-12` 路径仍可打开，但只作为归档跳转，不再误导执行者
