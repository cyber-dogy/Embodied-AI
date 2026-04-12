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
排查显示非 Python 崩溃，而是策略动作幅度异常导致规划器拒绝。  
同一 checkpoint 对比（小批量 valid）：
- `model_state_dict`：`loss_total ~ 0.33`
- `ema_state_dict`：`loss_total ~ 1.23`
说明该阶段 EMA 明显劣于 raw 权重。

**修改**：
- 本条先记录问题与结论，代码层未提交修复。
- 临时规避：评估命令使用 `--no-prefer-ema`，避免加载劣化的 `ema_state_dict`。

**结果**：
`--no-prefer-ema` 下 `epoch_0100` 评估不再出现“几乎全是 error=yes”的模式（5ep 快测：`success_rate=0.2`，多数失败为跑满 horizon 而非仿真侧异常）。
后续待做：调整 EMA 更新策略（重点检查 BN running stats 处理）。

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
