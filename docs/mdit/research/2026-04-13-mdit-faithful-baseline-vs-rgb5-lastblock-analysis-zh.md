# 2026-04-13 MDIT Faithful 基线与 `5RGB + last_block` 分支差异分析

## 背景

当前讨论的问题不是“`5RGB + last_block` 要不要继续做”，而是：

- 为什么前面的 faithful 基线表现更好
- 为什么后续 `rgb5_sep_lastblock_a8_*` 分支成功率明显更低
- 这件事更像是“更像 PDIT 才好”、还是“调参更合适”、还是“纯运气”

需要先固定一个事实：由于最早你口中的 `mdit_faithful_baseline_100` 原始 artifact 当前在仓库里不完整，下面的分析同时参考两类证据：

1. 你记忆中的早期较好基线口径
2. 仓库里现存可直接核对配置的 faithful rerun

如果两者有局部差异，本文优先使用**现存 config.json 可核对的事实**，但保留“方向一致”的结论。

## 对照对象

本文固定比较三层对象：

1. **MDIT faithful 较好基线**
   - 代表现存 run：`unplug_charger_mdit_faithful_v1__cam_all5_100__e0100__20260410_200834`
   - 典型特征：`obs2 + action16 + frozen + shared encoder`

2. **后续低成功率分支**
   - 代表 run：`rgb5_sep_lastblock_a8_lr2e5_100_v2`
   - 典型特征：`obs3 + action8 + last_block + separate encoder`

3. **整个项目里的高成功率主线**
   - 代表：`PDIT baseline`
   - 证据来源：`docs/top10-checkpoint-manifest.json` 与 `docs/pdit/*`

## 真实配置差异

### 1. MDIT faithful 较好基线 vs 后续 `rgb5 + last_block`

现存可核对的 faithful 较好基线配置显示：

- `n_obs_steps = 2`
- `n_action_steps = 16`
- `vision.train_mode = "frozen"`
- `vision.use_separate_encoder_per_camera = false`
- `use_amp = false`
- `batch_size = 8, grad_accum_steps = 4`，等效 batch 更接近 `32`
- `sigma_min = 0.0`
- `num_integration_steps = 50`
- `optimizer_betas = [0.95, 0.999]`
- `optimizer_weight_decay = 0.0`
- `resize_shape = [224, 224]`

而后续 `rgb5_sep_lastblock_a8_*` 分支同时变成了：

- `n_obs_steps = 3`
- `n_action_steps = 8`
- `vision.train_mode = "last_block"`
- `vision.use_separate_encoder_per_camera = true`
- `use_amp = true`
- `batch_size = 8, grad_accum_steps = 1`
- `sigma_min = 0.001`
- `num_integration_steps = 25`
- `optimizer_betas = [0.9, 0.999]`
- `optimizer_weight_decay = 1e-4`
- `resize_shape = [240, 240]`
- rollout 侧又叠加了 `smooth_actions = true`

因此，后续分支不是“只改成 5RGB + last_block”，而是**多项关键训练/执行变量同时变化**。

### 2. MDIT faithful vs PDIT 高成功率主线

仓库现有高成功率证据显示：

- `PDIT baseline epoch_0100 = 0.75 / 20ep`
- `epoch_0300 = 0.90 / 20ep`
- `epoch_0500 = 1.00 / 20ep`
- `100 episodes` 复核仍有 `0.85`

这说明 `PDIT` 的高成功率不是单次偶然波动。

## 为什么后续成功率更低

### 1. 不是单改 `5RGB + last_block`，而是配置漂移叠加

后续分支低成功率的第一解释不是“`last_block` 无效”，而是：

- observation window 更长
- action chunk 更短
- 视觉从冻结变成微调
- encoder 从 shared 变成 separate
- AMP 打开
- 有效 batch 下降
- FM 与优化设置也同时变化

对旧 `MDIT` 全局 AdaLN 条件路径来说，这些变化是**叠加放大难度**，不是单项小修改。

### 2. 较好 faithful 基线更像“保守 recipe 更适配旧架构”

faithful 较好基线的优势更像来自：

- 更短 obs window
- 更长 action chunk
- 共享 encoder
- 冻结视觉
- 更大的有效 batch
- 更保守的积分设置

所以它更像是在“尽量不把旧 MDIT 条件路径推到失稳区”，而不是证明某个单点改动绝对更优。

### 3. 旧 MDIT 的架构本身也限制了后续高容量改动的收益

后续实验已经显示：

- 旧 MDIT 更像 `RGB+TEXT+obs` 先压成全局向量，再通过 AdaLN 调制
- 这种路径对大条件、高自由度视觉微调、本就更敏感

因此，把 `5RGB + last_block + obs3` 一起堆上去，很容易从“更强表达”变成“更难训练、更难 rollout”。

## “更像 PDIT / 调得更合适 / 纯运气” 三者评估

### 1. 对 MDIT faithful vs 后续低成功率分支

这里主因不是“更像 PDIT”，也不是“纯运气”，而是：

- **更保守、更适配旧 MDIT 架构的训练 recipe**

应固定写法：

- faithful 较好基线更像“旧 MDIT 路径的适配点”
- 后续低成功率分支更像“一次性改了太多关键变量”

### 2. 对整个项目里谁是真正高成功率主线

这里答案就不同：

- **更像 PDIT 是主因**
- **调得更合适是配套原因**
- **纯运气不是主要解释**

理由很明确：

- repo 内已有多次 20ep / 100ep 复核
- 不同 epoch 上 success 呈持续提升，不是一次 spike
- `PDIT` 的结构、FM schedule、推理步数和 success-based 选模链路是成体系工作的

因此，对整个项目的大结论应写成：

- `PDIT` 更强，不是偶然，而是“结构 + 训练栈 + 评估/选模链路”共同作用

## 结论与下一步

### 固定结论

1. 后续成功率更低，不能写成“因为改成了 `5RGB + last_block`”
2. 更准确的结论是：在旧 `MDIT` 全局 AdaLN 条件路径下，多项高影响因素同时变化，导致训练稳定性与 rollout 质量一起下降
3. faithful 较好基线更像“保守 recipe 更适配旧 MDIT 架构”
4. 整个项目里真正高成功率的答案仍然是 `PDIT`，而且不是运气

### 对后续研究的解释规则

如果还要继续推进 `5RGB + last_block`，后续必须按下面的口径解释：

- 这是一个更高容量、更高风险的新实验族
- 不是 faithful baseline 的小改版
- 不能再拿它和最保守 faithful baseline 做“一步到位”的单变量对照

更合理的下一步是：

- 保留 `5RGB + last_block`
- 但继续沿着更像 `PDIT` 的条件路径与训练逻辑修正
- 不要再把失败直接归因成 `last_block` 本身错误
