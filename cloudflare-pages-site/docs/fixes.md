# fixes.md — MDIT/PDIT 修复记录

## 【Agent 必读规则】

**每个 agent 在修改本项目代码前必须先读此文件。**
每次发现 bug、做出修改、观察到实验结果后，必须在本文件末尾追加一条记录。
格式固定为：

`### YYYY-MM-DD HH:MM:SS ±TZ · 简明标题`

并严格包含四个字段：

- `范围`：涉及的文件、模块或脚本
- `背景`：发生了什么，为什么值得记录
- `处理`：实际改了什么，或采取了什么应对动作
- `结果`：当前结论、关键指标、产物路径、后续状态

补充要求：

- 标题必须单看就能知道“这条记录在说什么”，不能只写文件名。
- 结果必须尽量写清 `run_name / checkpoint / success rate / 下一步状态`，避免只写 `none`、`待观察` 这类模糊词。
- 允许简略，但必须保证人和后续模型都能快速读懂上下文。
- `fixes.md` 是事实留痕源；如果某次改动已经形成跨线路的阶段结论，应同步提炼到 `docs/research_desk.md`，不要只停留在这里。

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

### 2026-04-13 12:11:35· 消融实验 · PCD + MDIT Transformer vs PCD + PDIT DiT（100 epoch, bs=80）

**实验**：

- Exp A：`unplug_charger_mdit_pcd_mdit_transformer_100`（PCD + Text/CLIP + 因果Transformer）
- Exp B：`unplug_charger_pdit_baseline_100_bs80`（PCD only + DiT backbone，完整 pdit 训练栈）

**关键参数差异**：

| 项目                  | Exp A（MDIT Transformer）             | Exp B（PDIT DiT）             |
| --------------------- | ------------------------------------- | ----------------------------- |
| backbone              | 因果Transformer + positional encoding | DiT (adaLN 每层注入)          |
| FM 时间步             | beta(α=1.5, β=1.0)                  | exp(scale=4.0) + uniform SNR  |
| 推理步数              | 25 步（Euler）                        | 10 步                         |
| 训练数据              | 7773 train                            | 10573 train（+36%，混淆变量） |
| 额外输入              | Text (CLIP)                           | 无                            |
| final_layer_zero_init | True                                  | False                         |

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
>
> 1. 将 MDIT 的 transformer backbone 切换为 DiT（`pcd_transformer_variant=”pdit”`）
> 2. 将 FM schedule 从 `beta(α=1.5,β=1.0)+25步` 改为 `exp(scale=4.0)+uniform SNR+10步`
>
> 仅换 backbone 不换 FM schedule，等价于”只做了一半”，实验设计仍有缺陷（当前 `pcd_ablation_pdit_transformer.json` 即为此陷阱）。

**详细分析**：`docs/mdit/2026-04-13-pcd-transformer-ablation-mdit-vs-pdit.md`

---

### 2026-04-15 12:31:35· `mdit/model/observation_encoder.py` · `last_block` 模式静默 fallthrough 导致实际训练整个 ViT

**问题（重大结构 bug）**：

`CLIPEncoder._configure_train_mode("last_block")` 的原始实现：

```python
blocks = getattr(self.model, "blocks", None)
if isinstance(blocks, (list, nn.ModuleList)) and len(blocks) > 0:
    ...
```

timm 的 ViT-B/16 CLIP 模型中 `blocks` 是 `nn.Sequential`，**不是 `list` 或 `nn.ModuleList`**。
isinstance 检查失败 → 代码 fallthrough → 执行"全解冻 fallback"。

结果：`train_mode="last_block"` 实际上一直等价于 `train_mode="all"`，
即全部 86M ViT 参数均在训练，而不是只训练最后一层（~7M）。

影响：

- 内存占用约 12× 预期
- 过拟合风险更高
- optimizer states 比预期大 12×

**修改**：

```python
_BLOCK_CONTAINER_TYPES = (list, nn.ModuleList, nn.Sequential)
blocks = getattr(self.model, "blocks", None)
if isinstance(blocks, _BLOCK_CONTAINER_TYPES) and len(blocks) > 0:
    for block in list(blocks)[-n:]:
        ...
```

同时将 `layers` 处理对齐。

**结果**：
验证：`last_block` → trainable=7,089,408 frozen=78,710,016（单 encoder）✓
验证：`last_n_blocks(n=2)` → trainable=14,177,280 ✓
验证：`frozen` → 0 trainable ✓
验证：`all` → 85,799,424 trainable ✓

---

### 2026-04-15 12:51:35· `mdit/config/schema.py` + `mdit/model/observation_encoder.py` · 新增 `num_unfreeze_blocks` 解冻层数开关

**改动目的**：提供"以后解冻多少层"的配置开关，而不是只有 `last_block`（死板的最后1层）。

**修改**：

- `VisionEncoderConfig` 新增 `num_unfreeze_blocks: int = 1`
- `_configure_train_mode(train_mode, num_unfreeze_blocks)` 新增 `"last_n_blocks"` 支持
- `"last_block"` 保持兼容（等价于 `last_n_blocks` + `num_unfreeze_blocks=1`）
- `CLIPEncoder.__init__` 从 config 读取 `num_unfreeze_blocks` 并传入

**使用方式**（改 config 后 resume 即生效）：

```json
"train_mode": "last_block",   "num_unfreeze_blocks": 1    // 当前默认，只最后1层
"train_mode": "last_n_blocks","num_unfreeze_blocks": 3    // 解冻后3层
"train_mode": "all"                                       // 全解冻
"train_mode": "frozen"                                    // 全冻结
```

---

### 2026-04-15 13:05:35· `configs/mdit/faithful_baseline.json` · 主线 vision encoder 切换为 per-camera 分开编码器

**改动**：

```json
"use_separate_encoder_per_camera": true,   // 原: false
"num_unfreeze_blocks": 1                   // 显式写明，便于后续调整
```

**原因**：用户要求"5rgb分开微调最后一层"。共享 encoder 所有相机共用同一套权重，梯度来自5个视角的混合，分开后每个相机各自独立地微调最后一层，效果更针对性。

**影响**：

- 参数量：1 × 86M vision → 5 × 7M trainable = 35M（更多独立特征，但更少 trainable 占用）
- 5 个独立 last-block 的 loss 贡献分别流向各自 encoder，互不干扰

---

### 2026-04-15 13:105:35· `mdit/train/eval.py` · eval 路径 `error` 未初始化 + 中途 exception 错误重置 steps

**问题 1**：`error` 变量只在 try/except 内部初始化。若 `env.last_step_error` 本身抛出（极少见），变量未定义会 NameError。

**问题 2**：`except` 块中有 `steps = 0`。若 episode 在第100步发生 exception，steps 被重置为0，导致分析桶（`at_horizon`/`lt_20` 等）分类错误。

**修改**：

```python
# 在 try 块之前
error: str | None = None
success = False
steps = 0

try:
    ...  # success/steps 在循环中更新
    error = env.last_step_error
except Exception as exc:
    success = False
    # 不再重置 steps
    error = str(exc)
```

**结果**：steps 现在反映实际执行步数，exception 发生在第150步时 steps=150 而非0。

---

### 2026-04-15 15:15:00 · 消融实验执行阻塞：ablation/pcd_mdit 与 ablation/rgb_text_pdit 无法启动

**问题**：按 `docs/mdit/2026-04-15-ablation-pcd-mdit-vs-rgb-pdit-execution-plan.md` 启动两个消融实验时，`mdit/config/schema.py` 中的 `validate_mainline_training()` 立即抛出 `ValueError`：

- `ablation/pcd_mdit`（`use_pcd=true`）：
  ```
  Faithful MDIT mainline training only supports RGB + text + MDIT raw weights.
  Disable legacy options before training: use_pcd=true.
  ```

- `ablation/rgb_text_pdit`（`transformer_variant='pdit'`）：
  ```
  Faithful MDIT mainline training only supports RGB + text + MDIT raw weights.
  Disable legacy options before training: transformer_variant='pdit'.
  ```

**根因**：`mdit/config/loader.py:170` 在加载任意训练配置时无条件调用 `cfg.validate_mainline_training()`。该验证函数将 `use_pcd=true` 和 `transformer_variant='pdit'` 视为 "legacy" 并强制拒绝，导致消融分支上合法的 PCD+MDIT 与 RGB+PDIT 实验无法运行。

**影响**：
- 消融实验计划无法在当前代码状态下执行
- 无法通过交叉验证判断 MDIT 主线低成功率的根本原因是 transformer 结构还是输入模态

**下一步**：
- 方案 A：在 `validate_mainline_training()` 中增加白名单/环境变量开关，允许消融分支显式绕过验证
- 方案 B：将验证逻辑从 `loader.py` 移回 `run_mdit_autoresearch_trial.py` 的主线入口，仅对 faithful 主线 screening 启用，不对 ablation/audit 启用
- 方案 C：在消融分支上直接移除或弱化该验证（需代码改动）

**记录数据**：
- pcd_mdit 分支 commit: `ce4bb17`
- rgb_text_pdit 分支 commit: `02bc489`
- 两个实验均因 collapse 被 trial runner 自动清理，未生成有效 ckpt

---

### 2026-04-15 19:50:08 +0800 · `envs/rlbench_env.py` + `mdit/cli/eval_checkpoint.py` · `V-REP side -1` 回归为 simulator 错误导致评估误判

问题：

- `RLBenchEnv._step_safe()` 把 `RuntimeError: ... V-REP/CoppeliaSim side ... Return value: -1` 直接当 `simulator runtime error` 并立刻终止；
- `mdit` 评估分析也把这类错误并入 `simulator_runtime_error`，导致“规划拒绝动作”被误读成“仿真器崩溃”。

修改：

- `envs/rlbench_env.py`
  - 新增 `_is_planning_runtime_error()` 判别 `V-REP/CoppeliaSim side + return value -1`
  - 这类 `RuntimeError` 改为 `planning runtime error` 并走插值回退路径（与 `IKError/InvalidActionError` 同逻辑）
  - 抽出 `_step_with_planning_fallback()` 统一回退执行
- `mdit/cli/eval_checkpoint.py`
  - 恢复 `planning_runtime_error` 分桶
  - `V-REP side -1` 不再归入 `simulator_runtime_error`
  - `likely_causes` 改为区分 `planner_rejecting_many_predicted_actions` 与 `true_simulator_runtime_failures_dominate`
- `tests/test_mdit_eval_cli.py`
  - 更新断言，锁定新分桶语义，防止再次回归

结果：

- 评估记录重新具备“规划失败 vs 真 simulator 故障”的可解释性；
- 后续看到大量 `planning_runtime_error` 时，优先排查策略动作可执行性，不再先判定仿真环境损坏。

---

### 2026-04-15 19:50:08 +0800 · `pdit/cli/eval_checkpoint.py` + `docs/mdit/*execution*.md` · 补齐 PDIT 评估分桶分析与基准复核步骤

问题：

- PDIT 单 checkpoint 评估只有原始 `episode_records`，缺少统一错误分桶与 likely-causes 分析；
- 手册中缺少“先用已知高成功 PDIT+EMA checkpoint 复核评估链路”的强制步骤，易把链路问题误当模型问题。

修改：

- `pdit/cli/eval_checkpoint.py`
  - 新增 `_normalize_error_label()` / `build_episode_analysis()`
  - 新增 `planning_runtime_error` 分桶（含 `V-REP side -1` 映射）
  - 评估后自动输出 `__analysis.json`，控制台同步打印 `episode_analysis`
- `tests/test_pdit_eval_cli.py`
  - 新增分桶测试，确保 `planning_runtime_error` 与 `simulator_runtime_error` 分离
- `docs/mdit/2026-04-15-ablation-execution-manual.md`
  - 增加“评估链路基准复核（强制先做）”命令（PDIT + EMA + 20ep）
- `docs/mdit/2026-04-15-mdit-faithful-rgb5-fm-execution-plan-zh.md`
  - 增加 PDIT 历史高成功基线复核命令块

结果：

- PDIT / MDIT 两条评估链路的错误分析口径对齐；
- 下游执行先验证评估链路，再解释模型结果，减少“0 成功率”误诊。

### 2026-04-16 17:20:33 +0800 · `mdit/*` + `research/mdit_trial_runner.py` + `research/mdit_autoresearch_loop.py` + `configs/mdit/fm_autodl_lab.json` + `scripts/*mdit*` + `tests/test_mdit_*` + `docs/mdit/2026-04-16-mdit-execution-manual.md` · 新建 MDIT 主线并切换到 5RGB+Text 输入（PDIT backbone/policy 语义保持）

**问题**：仓库已存在 `scripts --line mdit` 与 `pyproject` 的 mdit 入口，但 `mdit/` 代码线缺失，无法执行独立 RGB+text 主线；同时需要确保评估链路与 pdit 一致、且不污染 pdit 现有成功实现。

**修改**：

- 新建独立 `mdit/` 包（由 `pdit` 拷贝后按 mdit 命名空间重构），保持 `pdit` 代码零改动。
- `mdit/config/schema.py` 增加 RGB+text 主线字段：5 相机配置、text 来源、CLIP vision/text、3-token 融合、OOM 自动降档 tier。
- `mdit/data/modalities/rgb.py` 实现 `RobotDatasetRgbText`，读取 `data/images` + `data/robot_state`，输出 `(obs_rgb, robot_state_obs, robot_state_pred, task_text)`。
- `mdit/model/encoders/clip_rgb_text_token.py` 实现 5 路独立 CLIP vision 分支（last block 微调）+ 冻结 CLIP text + 投影；通过 `camera adapter -> step fusion adapter -> cond token projector` 输出 3 个 cond token，并对齐 `cond_dim = obs_features_dim + y_dim`。
- `mdit/policy/fm_policy.py` / `diffusion_policy.py` 改为支持 RGB+text batch 合约，`predict_action` 走默认 task text；robot_state 归一化与 backbone/action 语义保持 pdit 对齐。
- `mdit/train/runner.py` 新增 OOM 自动降档：`32x4 -> 16x8 -> 8x16`（global batch 保持 128）。
- 评估链路复用共享实现：`mdit/train/eval.py` 继续复用 `common.rlbench_rollout`，并直接调用 `pdit.train.action_postprocess`。
- 新增 mdit 专用脚本：`scripts/train_mdit.py`、`scripts/eval_mdit_checkpoint.py`、`scripts/eval_mdit_all_checkpoints.py`、`scripts/run_mdit_autoresearch_trial.py`、`scripts/record_mdit_rollout_videos.py`。
- 新增 `research/mdit_trial_runner.py`（mdit 训练+离线审计编排）与 `research/mdit_autoresearch_loop.py`（baseline loop 入口）。
- 新增配置 `configs/mdit/fm_autodl_lab.json`（100 epoch / checkpoint 50 / eval episodes 20 / wandb online）。
- 新增测试：`tests/test_mdit_dataset.py`、`tests/test_mdit_encoder_contract.py`、`tests/test_mdit_policy_contract.py`、`tests/test_mdit_cli_smoke.py`。
- 新增执行手册：`docs/mdit/2026-04-16-mdit-execution-manual.md`。

**结果**：

- `mdit` 主线具备独立可执行的训练/评估/autoresearch/脚本入口。
- 输入侧已从 pcd 切换为 `5RGB + text`，并固定为 3-token 融合策略。
- `pdit` 原有代码路径保持不变；mdit 评估链路与 pdit 共享关键 rollout/postprocess 逻辑。
- 本地已完成 Python 语法编译检查（`mdit` + 新增 `research/scripts` 文件）。

### 2026-04-16 20:48:28 +0800 · `ckpt/unplug_charger_mdit_rgb_text_3token_100/*` + `tmux session mdit_unplug_train` · SSH 前台训练可能被断开，切换为 tmux 断点续训

问题：

- MDIT 训练最初运行在 SSH 前台终端（`pts/6`），若用户退出 SSH 会话，进程可能收到 hangup 导致中断。
- `run_autoresearch_trial --phase train-only` 当前实现会在 trial runner 内强制 `resume_from_latest=False`，不适合作为断点续训入口。

修改：

- 停止前台训练进程，保留已有 checkpoint（`latest.pt`）。
- 创建并启动后台 `tmux` 会话：`mdit_unplug_train`。
- 在 `tmux` 内改用 `scripts/train.py --line mdit --resume` 续训同一 run：
  - `--run-name unplug_charger_mdit_rgb_text_3token_100`
  - `--set train_epochs=100 --set checkpoint_every_epochs=50`
  - `--set wandb_resume=true`，复用 WandB run id `8ikgnzbw`
- 将续训日志落盘到：
  - `ckpt/unplug_charger_mdit_rgb_text_3token_100/logs/train_resume_20260416_204647.log`
  - 并更新 `logs/.latest_resume_log` 指向当前日志文件。

结果：

- 训练已在 `tmux` 后台持续推进（当前可见 `train epoch 2` 进度）。
- 用户可随时断开 SSH，不影响训练；重新连接后可 `tmux attach -t mdit_unplug_train` 直接接力。
- 断点与 WandB 都保持连续，无需重头训练。

### 2026-04-16 20:50:41 +0800 · `ckpt/unplug_charger_mdit_rgb_text_3token_100/logs/train_resume_20260416_204647.log` · WandB 续跑早期 step 告警（非致命）

问题：

- 续训刚启动时出现 `WandB step must be monotonically increasing` 告警，原因是历史 run 的最新 step（约 204）高于本地 checkpoint 记录的 `global_step=166`。

修改：

- 保持 `wandb_resume=true` 连续记录，不中断训练；
- 确认告警仅影响早期少量低 step 日志（低于 WandB 当前 step 的点会被忽略），不影响模型参数更新与 checkpoint 保存。

结果：

- 训练进程继续正常推进，checkpoint 正常写入；
- 监控结论以 epoch 级指标、checkpoint 审计结果和后续 step（超过历史 step）日志为准。

### 2026-04-16 23:30:00 +0800 · `common/task_text.py` + `mdit/config/consistency.py` + `mdit/train/checkpoints.py` + `mdit/cli/shared.py` + `mdit/cli/eval_*` + `research/mdit_trial_runner.py` + `research/mdit_autoresearch_loop.py` + `configs/mdit/fm_autodl_lane_b.json` + `docs/mdit/*` + `CLAUDE.md` · MDIT autoresearch 升级为评估口径锁死 + 双线 watchdog + 冠军固化

问题：此前 `mdit` 虽然已有独立 RGB+text 主线，但缺少严格的 train/eval contract 校验、缺少真实可恢复的 autoresearch 守护 loop，也没有 Lane B 挑战者配置与冠军固定路径；一旦评估配方漂移、训练中断或 run 过多堆积，后续结论容易混乱。

修改：统一新增 `effective_task_text` / `eval_contract` / `recipe_contract` 概念，checkpoint 与 `experiment_manifest.json` 同步保存训练配方；`eval_checkpoint` / `eval_all_checkpoints` 在运行前写 `eval_manifest` 并检查 contract drift；`mdit` 训练阶段新增 `train_heartbeat.json`；`research/mdit_trial_runner.py` 现在会提前写 manifest、在 train/audit 后自动写 `docs/mdit` 与 `docs/fixes.md` 留痕；`research/mdit_autoresearch_loop.py` 升级为带状态文件、训练 watchdog、audit retry、晋级规则、冠军 alias 与 `best_path.md` 的双线 loop；新增 `scripts/run_mdit_autoresearch_loop.py` 和 Lane B 配置 `configs/mdit/fm_autodl_lane_b.json`；执行手册与 `CLAUDE.md` 同步更新到新入口。

结果：`mdit` 现在具备“同口径训练/评估 + 可恢复后台接管 + Lane A/Lane B 并行筛选 + 冠军固定”这一整套可托管实验骨架。后续 autoresearch 可直接挂在 `tmux` 中持续推进，且每轮成功/失败都会留下结构化记录。

### 2026-04-17 09:49:32 +0800 · `research/mdit_trial_runner.py + docs/mdit + docs/fixes.md`
问题：将现有 run `unplug_charger_mdit_rgb_text_3token_100` 接入 autoresearch 守护链。

修改：补写 trial_request/experiment_manifest，experiment_name=lane_a_mainline_100，stage_epochs=100。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100，pending_offline_audit=true

### 2026-04-17 10:04:33 +0800 · `research/mdit_trial_runner.py + docs/mdit + docs/fixes.md`
问题：将现有 run `unplug_charger_mdit_rgb_text_3token_100` 接入 autoresearch 守护链。

修改：补写 trial_request/experiment_manifest，experiment_name=lane_a_mainline_100，stage_epochs=100。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100，pending_offline_audit=true

### 2026-04-17 10:04:52 +0800 · `mdit/cli/eval_all_checkpoints.py + research/mdit_trial_runner.py + research/mdit_autoresearch_loop.py`
问题：离线审计虽然会产出 JSON/表格，但终端里没有足够醒目的主结论摘要；同时 autoresearch 恢复时会把 `pending_offline_audit=true` 的 screening 记录误当成已完成，导致跳过应做的正式审计。

修改：给 all-checkpoint 审计补充 `audit_summary` 输出，明确打印 `success@50/100/300/500`、`best_success`、`aggregate_success_rate`；给 trial audit 完成路径补充 `trial_audit_summary` 输出；并修正 autoresearch 恢复逻辑，只有真正完成离线审计的记录才会被视为已完成。

结果：`tmux`/终端日志里会直接看到关键成功率和最佳 checkpoint，不需要再手工翻 JSON；`Lane A mainline` 在恢复后会先按正确口径完成审计，再继续后续候选搜索。

### 2026-04-17 10:37:03 +0800 · `research/mdit_trial_runner.py`
问题：autoresearch 的 audit-only 阶段默认会把 `best_valid/latest` 等 special checkpoints 也一起跑掉，导致即便 `epoch_50/100` 已经完成，后续对比仍要额外等待很久。

修改：将 MDIT trial runner 的共享审计命令改为 `--no-include-special`，autoresearch 只评估周期 checkpoint，保持主判据聚焦在 `epoch_50/100 @ 20 episodes`。

结果：当前主线完成 `epoch_50/100` 后就能更快进入 `lane_a_stabilized` 和 `lane_b_faithful` 的后续对比，不再被 special checkpoint 审计拖慢。

### 2026-04-17 10:39:53 +0800 · `research/mdit_trial_runner.py`
问题：即使已经有可复用的 `audit_raw_results.json`，MDIT trial runner 进入 audit-only 时也会先删除缓存，导致 `epoch_0050` 无法 cache hit，只能重复评估。

修改：移除 `_run_checkpoint_audit(...)` 中对 `audit_raw_results.json` 的预删除逻辑，让共享 `eval_all_checkpoints` 自己按 cache key 复用已有结果。

结果：当前主线重新拉起后可以直接复用已完成的 `epoch_0050` 审计，只补跑 `epoch_0100`，更快进入后续候选对比。

### 2026-04-17 10:37:35 +0800 · `research/mdit_trial_runner.py + docs/mdit + docs/fixes.md`
问题：将现有 run `unplug_charger_mdit_rgb_text_3token_100` 接入 autoresearch 守护链。

修改：补写 trial_request/experiment_manifest，experiment_name=lane_a_mainline_100，stage_epochs=100。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100，pending_offline_audit=true

### 2026-04-17 10:39:34 +0800 · `research/mdit_trial_runner.py + docs/mdit + docs/fixes.md`
问题：将现有 run `unplug_charger_mdit_rgb_text_3token_100` 接入 autoresearch 守护链。

修改：补写 trial_request/experiment_manifest，experiment_name=lane_a_mainline_100，stage_epochs=100。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100，pending_offline_audit=true

### 2026-04-17 10:40:23 +0800 · `research/mdit_trial_runner.py + docs/mdit + docs/fixes.md`
问题：将现有 run `unplug_charger_mdit_rgb_text_3token_100` 接入 autoresearch 守护链。

修改：补写 trial_request/experiment_manifest，experiment_name=lane_a_mainline_100，stage_epochs=100。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100，pending_offline_audit=true

### 2026-04-17 10:41:09 +0800 · `research/mdit_trial_runner.py + docs/mdit + docs/fixes.md`
问题：将现有 run `unplug_charger_mdit_rgb_text_3token_100` 接入 autoresearch 守护链。

修改：补写 trial_request/experiment_manifest，experiment_name=lane_a_mainline_100，stage_epochs=100。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100，pending_offline_audit=true

### 2026-04-17 10:41:59 +0800 · `research/mdit_trial_runner.py + docs/mdit + docs/fixes.md`
问题：将现有 run `unplug_charger_mdit_rgb_text_3token_100` 接入 autoresearch 守护链。

修改：补写 trial_request/experiment_manifest，experiment_name=lane_a_mainline_100，stage_epochs=100。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100，pending_offline_audit=true

### 2026-04-17 10:55:44 +0800 · 离线审计完成，确认当前 RGB+text 主线成绩 · unplug_charger_mdit_rgb_text_3token_100
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：`Lane A mainline` 的 100 epoch screening 已完成，需要用共享 audit chain 固化 `epoch_0050/epoch_0100` 的成功率，作为后续候选比较锚点。

处理：统一使用共享 audit chain 执行 `20 episodes` 审计，锁定与训练一致的评估口径，不引入额外 special checkpoint 干扰主结论。

结果：`epoch_0050` 成功率 `0.25`，`epoch_0100` 成功率 `0.55`，最佳结果为 `0.55 @ epoch 100`；`trial_score=0.55`，`recipe_drift=false`，`collapse=false`，该 run 已成为后续 RGB+text 路线的临时对照锚点。

### 2026-04-17 11:05:36 +0800 · 冻结当前最优路线，防止后续搜索覆盖 · unplug_charger_mdit_rgb_text_3token_100
范围：`docs/mdit/best_path.md + docs/mdit/archive/legacy_notes/2026-04-17-110536-provisional-best-lane-a-mainline.md + autoresearch_records/frozen_best`

背景：当前最优 RGB+text 路线已经出现，但原始 run 后续可能被 autoresearch 清理或被更晚的候选覆盖，需要先固化一个可回退锚点。

处理：将 `best_success.pt`、`best_valid.pt`、`epoch_0050.pt`、`epoch_0100.pt` 冻结到 `autoresearch_records/frozen_best/2026-04-17-110536__lane_a_mainline_epoch100_s055`，并建立 `current_provisional_best` 稳定别名，同时更新 `best_path.md`。

结果：当前最佳方向已经可稳定回退；后续实验可以继续推进，但这一条 `0.55 @ epoch_0100` 的 RGB+text 主线不会因清理或覆盖而丢失。

### 2026-04-17 11:10:00 +0800 · 改善 fixes 自动摘要，减少重复和歧义
范围：`research/mdit_trial_runner.py + docs/fixes.md`

背景：训练/审计完成后写入 `docs/fixes.md` 的内容过于状态化，不像可复盘记录；同时同一 run 被重复接管时会追加重复条目，噪声偏大。

处理：给训练完成与审计完成路径补充摘要化结果输出，自动记录关键 epoch、关键指标和审计成绩；同时为 `adopt_existing` 记录增加去重键，避免重复刷屏。

结果：后续训练与评估记录会直接写明核心结论与下一状态；同一历史 run 反复被接管时，不会再在 `fixes.md` 中不断产生重复条目。

### 2026-04-17 11:20:15 +0800 · 修正 autoresearch 完成态判断，失败记录不再阻塞重跑
范围：`research/mdit_autoresearch_loop.py + docs/fixes.md`

背景：`mdit_autoresearch` 被中断后，`lane_a_stabilized_100` 的一次异常失败被错误写成“已完成候选”；恢复时 loop 会直接跳过它，导致托管停在旧失败记录上。

处理：将候选“已完成”的判定收紧为 `pending_offline_audit=false` 且 `error_type is None`；异常失败记录不再阻塞同一候选重新训练或重新审计。

结果：autoresearch 重新拉起后，会继续接管 `lane_a_stabilized_100`，而不是卡死在旧失败上；由于旧 run 缺少可续训的 `latest.pt`，这一轮改为新 run 重启训练。

### 2026-04-17 11:23:51 +0800 · 为 fresh run 提前写出 latest.pt，保证随时可续训
范围：`mdit/train/runner.py + research/mdit_autoresearch_loop.py + docs/fixes.md`

背景：`mdit` 训练原本只在 epoch 结束后保存 `latest.pt`；如果 fresh run 在第一个 epoch 中途被打断，磁盘上会没有可续训 checkpoint，不满足“随时可接续”的要求。

处理：在 MDIT 训练启动后、进入第一个 batch 前，若 `latest.pt` 不存在则立即写入一个 bootstrap latest checkpoint；随后重启当前 `lane_a_stabilized_100` 候选，让它从新逻辑启动。

结果：新 run `unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329` 在 `epoch=0, global_step=0` 时就同时具备 `config.json + train_heartbeat.json + latest.pt`，后续即使中断也可以立刻续训。

### 2026-04-17 11:16:09 +0800 · 训练阶段异常退出，保留现场等待 watchdog 重跑 · unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_105544
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：`lane_a_stabilized_100` 的第一轮训练在训练阶段触发 PyTorch checkpoint 写盘异常：`[enforce fail at inline_container.cc:664] unexpected pos 2602795840 vs 2602795728`。

处理：保留失败 run 的 manifest、trial record 与日志线索，不清理现场，等待 autoresearch watchdog 后续重跑或人工诊断。

结果：该 run 以 `RuntimeError` 结束，未进入正式审计；后续已改为新 run 重新启动同一候选训练。

### 2026-04-17 16:58:16 +0800 · 训练完成并进入待审计状态 · unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：`lane_a_stabilized_100` 的 100 epoch 训练已跑完，需要保留关键产物并转入共享离线审计，验证这条稳定化路线是否优于主线锚点。

处理：写出 `trial record`、`summary.json`、`experiment_manifest.json`，保留 `best_valid.pt`、`epoch_0050.pt`、`epoch_0100.pt`，并生成 audit-only 命令交给共享评估链。

结果：该 run 已完成 `100` 个 epoch（`latest_epoch=99`）；最佳验证指标 `best_metric=0.870`，出现在 `best_epoch=46`；当前候选带有受控配方偏移：`command_mode first -> mean_first_n`、`average_first_n 1 -> 2`、`smooth_actions false -> true`；`pending_offline_audit=true`，审计结果待回填。

### 2026-04-17 17:00:00 +0800 · 将分散的 run note 合并为单一研究日志
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：`docs/mdit` 中每次训练、审计、接管都会新建一份时间戳 note，长期运行后目录污染明显，也提高了误删风险。

处理：将 autoresearch 的 research note 输出从“每次新建单独 markdown 文件”改为统一追加到 `docs/mdit/research_journal.md`；并把现有自动生成的历史 note 合并进该 journal，保留 `best_path.md` 与执行手册作为稳定文档。

结果：后续 `docs/mdit` 不会再因为每次执行新增一堆零散 note；run-by-run 记录会持续沉淀在同一份 `research_journal.md` 中。

### 2026-04-17 17:02:00 +0800 · 归档历史 note，清理 docs/mdit 根目录
范围：`docs/mdit/archive/legacy_notes + docs/mdit/research_journal.md + docs/fixes.md`

背景：虽然新的记录模式已经切到 `research_journal.md`，但历史时间戳 note 仍留在 `docs/mdit` 根目录，目录视图依然杂乱，也更容易被误删。

处理：将历史自动生成 note 从 `docs/mdit/` 根目录整体迁移到 `docs/mdit/archive/legacy_notes/`，根目录只保留执行手册、`best_path.md` 和 `research_journal.md`；同时为归档目录补充 `README.md` 说明。

结果：`docs/mdit` 根目录已收敛成稳定文档集合；历史记录仍保存在 `research_journal.md` 和 `archive/legacy_notes/` 中，不会因根目录误操作而丢失。

### 2026-04-17 17:11:51 +0800 · 重构 fixes 记录模板，提升人和后续模型的可读性
范围：`research/mdit_trial_runner.py + docs/fixes.md`

背景：`fixes.md` 近期自动写入的条目标题只有文件范围，正文又偏向裸 `key=value` 状态输出；虽然简短，但读者和后续模型都需要先猜“这条记录到底在说什么”。

处理：将自动写入模板改为固定的 `标题 + 范围 + 背景 + 处理 + 结果` 结构；训练/审计摘要改写成带 `run_name`、关键指标、受控配方偏移和下一状态的短句；同时手工重写最近一批 MDIT 关键记录，让文档从现在起具备一致的阅读口径。

结果：后续新增的 fixes 条目会直接写清事件标题、涉及 run、关键 checkpoint/指标和下一步状态；当前最近一批 MDIT 记录已经可以被人和后续模型单独阅读理解，`python -m py_compile research/mdit_trial_runner.py` 已通过。

### 2026-04-17 17:20:29 +0800 · `research/mdit_trial_runner.py + docs/mdit + docs/fixes.md`
问题：离线审计 trial `unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329` 已完成。

修改：统一使用共享 audit chain，episodes=20，stage_epochs=100。

结果：success@100=0.350，best_success=0.350，best_success_epoch=100，trial_score=-1.000，collapse=True，recipe_drift=True，collapse_reasons=epoch 100 success 0.35 below threshold 0.55

### 2026-04-17 17:20:44 +0800 · 训练失败，保留现场等待重试 · unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：候选 run `unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029` 在训练阶段异常退出：(MaxRetryError("HTTPSConnectionPool(host='huggingface.co', port=443): Max retries exceeded with url: /timm/vit_base_patch16_clip_224.openai/resolve/main/model.safetensors (Caused by ProxyError('Cannot connect to proxy.', TimeoutError('_ssl.c:1000: The handshake operation timed out')))"), '(Request ID: 4de944c2-7728-468a-83d0-51d3b3f6962e)')

处理：保留失败 run 的 trial record、manifest 与日志线索，不清理现场，等待 watchdog 重试或人工诊断。

结果：error_type=ProxyError；run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029

### 2026-04-17 17:20:54 +0800 · 稳定化对照审计完成，确认弱于当前主线锚点 · lane_a_stabilized_100
范围：`autoresearch_records/mdit_loop_state__unplug_rgb_text_search.json + ckpt/unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112329/* + docs/fixes.md`

背景：`lane_a_stabilized_100` 使用 `command_mode=mean_first_n`、`average_first_n=2`、`smooth_actions=true`，目标是缓解主线中的 `planning_runtime_error` 和 horizon exhaustion，需要确认这组稳定化改动是否真的优于主线。

处理：完成共享 audit chain 的 `epoch_0050/epoch_0100 @ 20 episodes` 审计，并与当前主线锚点 `unplug_charger_mdit_rgb_text_3token_100` 的锁定口径结果直接对照。

结果：该候选 `epoch_0050=0.20 (4/20)`、`epoch_0100=0.35 (7/20)`，显著低于主线锚点的 `epoch_0100=0.55 (11/20)`；失败仍以 `at_horizon` 为主，说明动作平滑化没有解决核心问题，反而让 rollout 更容易“做不完”，该路线判定为弱线，不再作为主方向推进。

### 2026-04-17 17:21:30 +0800 · 修复 Lane B 启动时的 Hugging Face 超时，强制 autoresearch 优先走本地缓存
范围：`research/mdit_autoresearch_loop.py + autoresearch_records/logs/unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_172029__train.log + docs/fixes.md`

背景：`lane_b_faithful_100` 在第一次启动时没有进入训练，而是在加载 `timm/vit_base_patch16_clip_224.openai` 时触发 `huggingface.co` 代理握手超时；本机其实已经有 `timm` 视觉权重和 `openai/clip-vit-base-patch16` 文本权重缓存，因此这次失败属于环境加载路径问题，不是模型结构失败。

处理：为 autoresearch 子进程新增本地缓存检测；当检测到 `timm` 和 `CLIP` 权重都已缓存时，自动给训练/审计子进程注入 `HF_HUB_OFFLINE=1`、`TRANSFORMERS_OFFLINE=1`、`HF_HUB_DISABLE_TELEMETRY=1`，强制优先使用本地缓存，并把该环境状态写入子进程日志。

结果：已验证在 `mdit_env` 下离线模式可以成功初始化 `VisionTransformer` 与 `CLIPTextModel`；后续 Lane B 重跑将不再因为外网握手超时而中断，当前这次 `ProxyError` 记录应解释为启动环境故障，而不是 Lane B 方案本身失败。

### 2026-04-17 19:05:00 +0800 · 新增 MTDP 严格验证线与 12G 单档兼容，不污染现有主线和共享评估
范围：`mdit/config/* + mdit/model/* + mdit/policy/* + research/mdit_* + configs/mdit/fm_autodl_lane_c_mtdp_strict*.json + tests/test_mdit_*`

背景：现有 `lane_a/lane_b` 还不足以严格验证 `multitask_dit_policy` 在当前仓库约束下是否可行；同时后续还需要把同一条严格线带到 12G RTX 4070 上做真实训练兼容验证。

处理：新增独立 strict 变体 `clip_rgb_text_mtdp + dit_mtdp_rope + fm_variant=mtdp_strict`，实现 MTDP 风格 global conditioning vector、RoPE backbone、beta timestep sampling、Euler 积分和 state/action min-max 归一化；运行时自动从训练集解析 `state_min/max` 与 `action_min/max` 并写回 config/checkpoint；新增 `lane_c_mtdp_strict_100` 与 `lane_c_mtdp_strict_100_12g` 配置，其中 12G 档只降一档到 `batch_size=16, grad_accum_steps=8`，并通过 `activation_checkpointing=true`、`vision_encode_chunk_size=1` 压显存；autoresearch 默认 screening 新增 `lane_c_mtdp_strict_100`，旧主线与共享评估入口保持不变。

结果：旧主线接口仍保持原行为；新增 strict/12G 代码路径已通过 `python -m unittest discover -s tests -p 'test_mdit*_contract.py'`、`python -m unittest discover -s tests -p 'test_mdit_autoresearch_loop.py'`、`python -m unittest discover -s tests -p 'test_mdit_cli_smoke.py'`、`python -m unittest discover -s tests -p 'test_trial_runner.py'`、`python -m unittest discover -s tests -p 'test_pdit_eval_cli.py'`；当前最佳路线未被覆盖，新 strict 线可作为下一条正式挑战线接入训练。

### 2026-04-17 19:38:30 +0800 · 停止可续训的 Lane B，切换到 MTDP strict 正式训练
范围：`ckpt/unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_174328/* + tmux:mdit_autoresearch + configs/mdit/fm_autodl_lane_c_mtdp_strict.json + docs/fixes.md`

背景：当前正在训练的是 `lane_b_faithful_100`，但这条线的对比价值已经低于新完成的 `MTDP strict` 挑战线；同时 `lane_b` 已经写出 `latest.pt`，具备安全停机和后续续训条件，因此更合理的资源分配是暂停 `lane_b`，把 5090 直接切到 `lane_c_mtdp_strict_100`。

处理：先确认 `lane_b` 的 `latest.pt` 和 `train_heartbeat.json` 存在，再停止其 autoresearch 父进程与孤立训练子进程，保留现有 run 目录不清理；随后在 `tmux` 会话 `mdit_autoresearch` 中新增窗口 `mtdp_strict`，启动 `configs/mdit/fm_autodl_lane_c_mtdp_strict.json` 的 `100 epoch` 训练，并将控制台输出同步写入独立训练日志。

结果：`lane_b` 已在 `epoch=28, global_step=2399` 处安全停下，续训点保留在 `ckpt/unplug_charger_mdit_lane_b_faithful_fm_v1__lane_b_faithful_100__e0100__20260417_174328/latest.pt`；新的严格验证线 `unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720` 已正式启动，当前已写出 `latest.pt` 和 `train_heartbeat.json`，并进入 `epoch=0, batch_idx=50, global_step=12`，后续主比较对象切换为 `MTDP strict`。

### 2026-04-17 19:50:30 +0800 · 启用 MTDP strict 自动接管与 best500 fallback 守护
范围：`research/mdit_takeover_controller.py + scripts/run_mdit_takeover.py + tmux:mdit_autoresearch:takeover_guard + docs/fixes.md`

背景：当前 5090 正在训练 `lane_c_mtdp_strict_100`，用户要求后续不要靠人工盯；如果这条严格挑战线在共享审计里没有超过当前锁定最优 `0.55`，就自动把最优主线 recipe 拉到 `500 epoch` 继续验证。

处理：新增专用接管器 `run_mdit_takeover.py`，后台守护当前 active run 的训练完成、离线审计与必要的续训恢复；当 `MTDP strict` 审计结果未超过当前锚点时，自动按当前最优主线的已锁定 recipe 新开一条 `500 epoch` run，并继续走同一条共享评估链。该守护已挂到 `tmux` 会话 `mdit_autoresearch` 的 `takeover_guard` 窗口中。

结果：当前自动接管策略已生效；active run=`unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720`，incumbent=`unplug_charger_mdit_rgb_text_3token_100`，fallback 条件为“严格线共享审计未超过 `0.55`”；若触发 fallback，将自动拉起 `lane_a_mainline_500_fallback`，无需人工再下指令。

### 2026-04-17 19:55:00 +0800 · 增加 latest 补点脚本，并为 0.55 主线补出可续训 latest
范围：`scripts/patch_mdit_latest_from_checkpoint.py + ckpt/unplug_charger_mdit_rgb_text_3token_100/latest.pt + docs/fixes.md`

背景：当前最优主线 `unplug_charger_mdit_rgb_text_3token_100` 保留了 `epoch_0100.pt`，但没有 `latest.pt`；而现有 `--resume` 逻辑默认只识别 `latest.pt`，导致最佳路线虽然具备完整训练态 checkpoint，却不能直接走原生续训入口。

处理：新增独立补丁脚本 `scripts/patch_mdit_latest_from_checkpoint.py`，专门把一个完整训练态 checkpoint 校验后原样补成 `latest.pt`，默认不覆盖已有 `latest`；随后实际对 `ckpt/unplug_charger_mdit_rgb_text_3token_100/epochs/epoch_0100.pt` 执行补点，生成 `ckpt/unplug_charger_mdit_rgb_text_3token_100/latest.pt`。

结果：当前最优主线现在已经具备原生 resume 入口；新生成的 `latest.pt` 已校验包含 `model_state_dict`、`optimizer_state_dict`、`scheduler_state_dict`、`scaler_state_dict`、`ema_state_dict`，并且 `completed_epoch=99`、`global_step=8300`、`strategy=fm`，后续可以直接基于它继续向 `500 epoch` 续训，而不需要再从头开跑。

### 2026-04-17 20:03:00 +0800 · 更新接管器 fallback：最佳路线改为从 100 epoch latest 续到 500
范围：`research/mdit_takeover_controller.py + scripts/run_mdit_takeover.py + tmux:mdit_autoresearch:takeover_guard + docs/fixes.md`

背景：此前接管器在 `MTDP strict` 未超过当前最优时，会按最佳主线 recipe 新开一条 500 epoch fresh run；这虽然语义正确，但没有利用现成的 100 epoch 训练态 checkpoint，会浪费时间，也不符合“最佳路线继续深挖”的目标。

处理：先用 `scripts/patch_mdit_latest_from_checkpoint.py` 为当前最优主线补出可续训 `latest.pt`，再把接管器 fallback 改成“克隆最佳路线的 config/latest 与 50/100 checkpoint 到新 run 目录，然后通过原生 `train.py --resume` 从 `epoch_0100` 继续训练到 `500 epoch`”；原最佳 run 保持不动，防止覆盖当前锚点。

结果：当前 `takeover_guard` 已采用新的 fallback 逻辑；如果 `lane_c_mtdp_strict_100` 没超过 `0.55`，后续会自动拉起一条基于最佳路线 `epoch_0100` 续训的 `500 epoch` run，而不是从头重训。

### 2026-04-18 00:26:53 +0800 · 训练完成并进入待审计状态 · unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：候选 run `unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720` 已完成训练阶段，需要保留关键产物并转入共享离线审计。

处理：写出 trial record、summary、experiment_manifest，并保留关键 checkpoint；stage_epochs=100，checkpoint_every=50。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720；训练已完成 100 个 epoch（latest_epoch=99）；最佳验证指标 best_metric=0.228，best_epoch=52；保留检查点=best_valid.pt, epoch_0050.pt, epoch_0100.pt；待离线审计=True；受控配方偏移=state_min None -> [-0.16713987290859222, -0.6003386974334717, 0.7817165851593018, -0.9997481107711792, -0.9988288879394531, -0.9999188184738159, -0.9999663829803467, -0.9964766502380371, -1.000000238418579, 0.0]；state_max None -> [0.4585603177547455, 0.5131571292877197, 1.7406383752822876, 0.9998515248298645, 0.9948352575302124, 0.9993093013763428, 0.9999883770942688, 1.0, 0.8144750595092773, 1.0]；action_min None -> [-0.16713987290859222, -0.6003386974334717, 0.7817165851593018, -0.9997481107711792, -0.9988288879394531, -0.9999188184738159, -0.9999663829803467, -0.9964766502380371, -1.000000238418579, 0.0]；action_max None -> [0.4585603177547455, 0.5131571292877197, 1.7406383752822876, 0.9998515248298645, 0.9948352575302124, 0.9993093013763428, 0.9999883770942688, 1.0, 0.8144750595092773, 1.0]

### 2026-04-18 00:57:23 +0800 · 离线审计完成 · unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：候选 run `unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720` 已完成共享离线审计，需要固化关键成功率与后续筛选依据。

处理：统一使用共享 audit chain 执行评估；episodes=20，stage_epochs=100。

结果：最佳成功率=未解析；最佳 checkpoint epoch=未解析；trial_score=-1.000；是否 collapse=True；collapse 原因=epoch 100 success None below threshold 0.55；受控配方偏移=state_min None -> [-0.16713987290859222, -0.6003386974334717, 0.7817165851593018, -0.9997481107711792, -0.9988288879394531, -0.9999188184738159, -0.9999663829803467, -0.9964766502380371, -1.000000238418579, 0.0]；state_max None -> [0.4585603177547455, 0.5131571292877197, 1.7406383752822876, 0.9998515248298645, 0.9948352575302124, 0.9993093013763428, 0.9999883770942688, 1.0, 0.8144750595092773, 1.0]；action_min None -> [-0.16713987290859222, -0.6003386974334717, 0.7817165851593018, -0.9997481107711792, -0.9988288879394531, -0.9999188184738159, -0.9999663829803467, -0.9964766502380371, -1.000000238418579, 0.0]；action_max None -> [0.4585603177547455, 0.5131571292877197, 1.7406383752822876, 0.9998515248298645, 0.9948352575302124, 0.9993093013763428, 0.9999883770942688, 1.0, 0.8144750595092773, 1.0]

### 2026-04-18 00:57:23 +0800 · 接管器触发 500 epoch 最优路线 fallback
范围：`research/mdit_takeover_controller.py + docs/fixes.md + docs/mdit/research_journal.md`

背景：严格挑战线 `unplug_charger_mdit_lane_c_mtdp_strict_fm_v1__lane_c_mtdp_strict_100__e0100__20260417_193720` 已完成共享审计，但没有超过当前锁定最优锚点 `0.550`。

处理：按照当前最优主线的已锁定 recipe 新开一条 500 epoch run，继续使用共享评估链，不覆盖原有 best snapshot。

结果：触发原因：challenger audit reported recipe drift

<!-- dedupe:adopt_existing:unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723:lane_a_mainline_500_resume:500 -->
### 2026-04-18 00:57:23 +0800 · 接管已有 run 并补齐元数据 · unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：现有 run `unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723` 需要纳入 autoresearch 守护链，供后续统一训练/审计/筛选。

处理：补写 trial_request/experiment_manifest，experiment_name=lane_a_mainline_500_resume，stage_epochs=500。

结果：run_dir=/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723；pending_offline_audit=true

### 2026-04-18 09:00:55 +0800 · 修复主线 100->500 续训兼容并恢复真实后台接管
范围：`mdit/train/checkpoints.py + mdit/train/runner.py + research/mdit_takeover_controller.py + scripts/run_mdit_takeover_supervisor.py + tmux:mdit_autoresearch`

背景：用户指出所谓 autoresearch 并没有真实接管。排查后确认：`lane_c_mtdp_strict_100` 审计结束后，接管器确实试图把当前最优主线从 `epoch_0100` 续到 `500 epoch`，但旧 checkpoint 的优化器状态和当前参数顺序不兼容，导致 `optimizer.step()` 在第一轮就崩；同时接管器还会被旧心跳、旧清理状态和日志 tail 误判成“训练还活着”。

处理：为续训加载增加优化器状态形状校验，遇到旧 Adam 动量错绑时只恢复模型/EMA/步数并重建优化器内部状态；同时按新的 `train_epochs` 重新计算 scheduler 当前学习率，避免 100->500 时带着 0 学习率空跑。接着修正接管状态机：支持从已有 `active_audit_result` / `fallback_run_dir` 直接恢复；活跃进程探测只认 Python 训练进程；旧 heartbeat 不再被当成新进度；新增 `run_mdit_takeover_supervisor.py` 常驻监督器，并重新挂到 `tmux` 的 `takeover_guard` 窗口。

结果：当前 `best route` 已经由后台监督器重新拉起，run=`unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723`；新的训练日志已经出现 `[resume] skip optimizer_state_dict: ...`，随后 `epoch 100` 继续推进且学习率恢复为约 `9.21e-05`，说明最佳路线的 `100 -> 500` 续训链路已经真正接通，不再依赖用户手动发消息。

### 2026-04-18 23:16:42 +0800 · 建立 research_desk 阶段总账本，并让 homepage 优先读取阶段总结
范围：`docs/research_desk.md + docs/fixes.md + docs/mdit/research_journal.md + homepage/MAINTENANCE.md + homepage/config/site-config.json + scripts/build_homepage_data.py`

背景：`fixes.md` 长期同时承担事实留痕、自动状态流和阶段总结三种职责，读者与 homepage 生成链都需要先跨过大量日志样式条目，才能重新拼出当前主线判断。

处理：新增 `docs/research_desk.md`，用 `发现问题 / 原因分析 / 解决思路 / 具体操作 / 当前判断 / 相关材料` 六段结构整理 PDIT、MDIT、LeLaN 和文档治理里程碑；同时让 homepage 的全局时间线、当前焦点候选和 `infra-audit` 页面优先解析 `research_desk.md`，`fixes.md` 退回为事实源和回查源；同步在维护文档中写清职责分工。

结果：项目现在形成了 `fixes.md` 记事实、`research_desk.md` 做阶段总结、各线路稳定文档保留证据的三层结构；homepage 后续会优先展示人工提炼过的阶段进展，而不是自动状态流。

### 2026-04-19 09:00:36 +0800 · 离线审计完成 · unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723
范围：`research/mdit_trial_runner.py + docs/mdit/research_journal.md + docs/fixes.md`

背景：候选 run `unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723` 已完成共享离线审计，需要固化关键成功率与后续筛选依据。

处理：统一使用共享 audit chain 执行评估；episodes=20，stage_epochs=500。

结果：success@epoch_0300=0.750；success@epoch_0500=0.750；最佳成功率=0.750；最佳 checkpoint epoch=300；trial_score=-1.000；是否 collapse=True；collapse 原因=epoch 100 success None below threshold 0.55；受控配方偏移=无
