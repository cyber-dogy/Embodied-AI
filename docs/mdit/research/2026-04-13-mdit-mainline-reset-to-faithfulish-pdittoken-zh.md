# 2026-04-13 MDIT 主线回锚到 faithful 风格 + PDIT 条件路径

## 背景

这次调整不是继续沿用旧的 `obs3 + a8 + separate encoder + AMP + fast FM` 主线，而是把实验重新锚定到“最可能成功”的状态。

用户明确要保留的轴没有变：

- `5RGB`
- `text`
- `last_block`

这次变化的是训练 recipe 和默认执行入口。

## 本轮改动

新的唯一主线固定为：

- `5RGB + text + last_block`
- `transformer_variant = "pdit"`
- `n_obs_steps = 2`
- `n_action_steps = 16`
- shared vision encoder
- `use_amp = false`
- `batch_size = 8`
- `grad_accum_steps = 4`
- `sigma_min = 0.0`
- `num_integration_steps = 50`
- `optimizer_betas = [0.95, 0.999]`
- `optimizer_weight_decay = 0.0`
- `smooth_actions = false`

对应配置：

- `configs/mdit/rgb5_shared_lastblock_pdittoken_obs2_a16_gate100.json`

## 为什么这样改

这轮不是放弃 `5RGB + last_block`，而是把它们放回更接近成功锚点的训练栈里。

此前主线之所以变得很难解释，不是因为“只改成了 `5RGB + last_block`”，而是因为同时混入了：

- `obs3`
- `a8`
- separate encoder
- AMP
- 更小有效 batch
- 更快的 FM 设置
- rollout 平滑

这些变化叠加后，很容易再次把旧条件路径推回“超大条件导致训练与 rollout 一起变差”的区域。

## 条件注入复杂度约束

这轮的核心不是继续增加条件容量，而是把 `5RGB + text` 放进更稳定的 token-conditioned 路径里。

固定约束：

- `obs2`
- 每个 obs step：`1 state token + 5 camera token`
- 全局只保留 `1 text token`
- 不重复 text
- 不增加 `camera embedding`
- 不增加 `modality embedding`
- 不增加 `cross-attn`
- 不允许回到 flatten 全局向量 + AdaLN 的旧 RGB 条件路径

因此当前主线的条件 token 数固定为：

- `2 * 6 + 1 = 13`

## 结论

本轮主线应解释为：

- “faithful 风格训练 recipe + PDIT token-conditioned 条件路径 + 保留 5RGB/last_block/text”

而不是：

- “继续在旧高漂移 recipe 上赌 `5RGB + last_block` 会自己变好”

这次回锚的目标是先把主线恢复到可解释、可审计、最可能成功的状态，再决定后续要不要重新放开更高容量设置。
