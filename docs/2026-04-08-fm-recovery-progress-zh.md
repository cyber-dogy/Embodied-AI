# FM/DiT 恢复进展

日期：2026-04-08

> 说明
> 仓库的正式源码主链已经从历史 `src/` 布局迁移到根目录一级模块：
> `model/`、`policy/`、`train/`、`config/`、`data/`、`envs/`、`common/`、`research/`、`cli/`。
> 旧 `src` 树仅作为历史快照保留在 `archive/legacy_code/src_layout_snapshot/`。

## 已确认的修复

以下问题确实存在，且已在代码库中修复：

1. **本地导入/路径污染**
   - 训练/评估包装器现在优先固定到当前仓库的根目录模块。
   - 这消除了当前代码库与另一个工作区副本之间的命名空间包漂移。

2. **FM 策略导入耦合**
   - `policies/__init__.py` 不再在 FM 使用前硬导入扩散模型依赖项。
   - 这移除了一个与 FM 本身无关的、环境特定的故障模式。

3. **PointNet 导入损坏**
   - `models/pointnet.py` 现在从正确的本地包路径导入 `dp_pytorch_util`。

4. **检查点损坏风险**
   - 检查点现在以原子方式保存，而不是直接写入最终路径。
   - 这很可能是导致之前 `latest.pt` 损坏的原因。

5. **离线审计脆弱性**
   - `eval_all_checkpoints.py` 现在在每个子进程中单独评估每个检查点。
   - 这将 RLBench/CoppeliaSim 挂起隔离到单个检查点，而不是污染整个扫描过程。

6. **离线审计阶段覆盖 bug**
   - `audit-only` 之前会用默认值 `500` 覆盖存储的 `stage_epochs`，导致 100-epoch 运行被错误地检测为崩溃。
   - 此问题已修复，并添加了回归测试。

## 新增实验参数

以下参数现已可用，但并非所有参数都已推广到完整的长期运行试验中：

- `decoder_condition_mode = mean_pool | cross_attn`
- `final_layer_zero_init = true | false`
- `augment_data = true | false`
- `augment_translation_sigma`
- `augment_rotation_sigma`
- `robot_state_mean`
- `robot_state_std`
- `fm_loss_weights`
- 用于 `train.py` 和 `run_autoresearch_trial.py` 的 CLI `--set key=value` 覆盖参数

## Baseline@100 结果

### 仅训练运行

运行名称：
- `unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_100__e0100__20260408_002048`

重要训练事实：
- 最佳验证损失：`0.6605488730496482`
- 最佳验证 epoch：`31`
- 第 100 epoch 的最终验证损失：`1.3372277707645768`
- 第 100 epoch 的最终训练损失：`0.04642475039903581`

解读：
- 修复后的基线是可训练的，并达到了良好的早期阶段。
- 过拟合仍然存在。
- 它现在表现为第 30 epoch 后的渐进漂移，而不是立即的早期崩溃。

### 离线成功率审计

原始的 100-epoch 运行目录被旧的 `audit-only` 阶段覆盖 bug 错误删除。
但审计日志在删除前捕获了成功的结果。

确认的成功结果：
- `epoch_0100 success_rate = 0.90`
- `18 / 20` 回合成功
- 平均步数：`79.55`

解读：
- 修复后的基线已超过预期的"100 epoch 应达到 80%+"目标。
- 因此，旧的故障模式并非仅由任务难度或数据集限制造成。
- 之前的训练栈包含真实抑制性能的工程/复现问题。

## 当前 Baseline@500 运行

当前运行名称：
- `unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741`

本报告撰写时最新记录检查点的状态：
- 最新 epoch：`82`
- 最新验证损失：`0.8030234572330588`
- 迄今为止最佳验证损失：`0.622098089048737`
- 迄今为止最佳验证 epoch：`53`

解读：
- 500-epoch 主线运行仍在进行中。
- 修复后的基线早期仍然强劲，但验证损失反弹模式仍然存在。
- 尚未解决的问题是：这种晚期过拟合是否也会在第 300 和 500 epoch 导致行为下降。

### Baseline@500 离线成功检查点

完整的多检查点审计在最后一个检查点完成前超时，因此最终第 `500` epoch 结果是单独评估的。验证的成功数字为：

- `epoch 100`：`0.75` (`15 / 20`)
- `epoch 200`：`0.80` (`16 / 20`)
- `epoch 300`：`0.90` (`18 / 20`)
- `epoch 400`：`0.80` (`16 / 20`)
- `epoch 500`：`0.95` (`19 / 20`)

解读：
-  feared 的"300 到 500 崩溃"并非修复后基线的固有属性。
- 在 20 回合中，成功率曲线有噪音，但本次运行中最强的验证检查点实际上是第 500 epoch。

## H1 结果：数据统计 + 原始数据增强

运行名称：
- `unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914`

离线成功结果：
- `epoch_0100 success_rate = 0.55`
- `11 / 20` 回合成功
- 平均步数：`122.55`

训练事实：
- 最佳验证损失：`1.5509084541546672`
- 最佳验证 epoch：`39`
- 第 100 epoch 的最终验证损失：`2.8032641028495213`
- 第 100 epoch 的最终训练损失：`0.13251210197671304`

解读：
- 该方向远低于修复后的基线表现。
- 组合的"数据集驱动统计 + 数据增强"方案不应保留其原始实现。

## H1 根本原因更新：数据增强 bug

H1 的差结果不仅仅是"超参数不佳"的问题。

数据增强实现本身包含一个语义 bug：

- `augment_pcd_data_with_params()` 将前 9 个机器人状态维度视为三个通用 3D 点。
- 这意味着 SE(3) 平移不仅应用于 `xyz`，还应用于两个 `rot6d` 基向量。
- 这在训练期间破坏了方向表示。

现已本地修复：
- 位置接收旋转 + 平移。
- 两个 `rot6d` 向量仅接收旋转。
- 添加了回归测试以防止此问题再次出现。

解读：
- 原始 H1 结果不是"数据集驱动归一化"的公平测试。
- 更好地解释为旧数据增强路径无效的证据。

## H2 中期运行状态：DiT 动态更接近官方设置

运行名称：
- `unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130`

当前确认的中期运行快照：
- 在第 `37` epoch，最佳验证损失达到 `0.5715935011639407`
- 迄今为止最佳验证 epoch：`34`
- 第 37 epoch 的最新验证损失：`0.6323951491595883`

解读：
- 这已经优于修复后基线在 100 epoch 时的最佳验证损失（`0.6605488730496482`）。
- 因此"`dropout=0.0 + 最终层零初始化`"改变是一个可信的结构改进，而不仅仅是中性的清理。
- 剩余问题是这是否也能在第 `100` epoch 改善离线成功率。

## 当前诊断

### 类别 A：环境和可复现性

这是一个主要的根本原因。

- 混合导入路径意味着正在训练的代码不能保证是代码库中可见的代码。
- FM 导入与无关的扩散模型依赖项耦合。
- 仅此一点就使之前关于"模型架构"的结论不可靠。
- 根 `.gitignore` 规则已经调整，不再误伤现在的根目录 `data/` 代码包。

### 类别 B：归档和审计管道

这也是一个主要的根本原因。

- 损坏的 `latest.pt` 是真实的。
- 审计运行之前容易受到模拟器挂起的影响。
- `audit-only` 可能错误地将阶段-100 运行标记为崩溃，因为它静默地将它们视为阶段-500 运行。

### 类别 C：模型/训练动态

这仍然是一个真实的次要问题。

- 即使在管道修复后，基线仍在早期最佳点之后过拟合。
- 在修复后的 100-epoch 运行中，最佳验证在第 31 epoch，而到第 100 epoch 最终验证损失增加了一倍多。
- 因此"可训练性"不再是主要障碍，但"晚期泛化稳定性"仍需改进。

### 类别 D：仍值得测试的候选架构瓶颈

这些尚未排除：

- 解码器条件均值池化而非 token 感知交叉注意力
- 输出层初始化敏感性
- 原始训练设置中缺少数据增强
- 缺乏机器人状态标准化

## 迄今为止的总结

代码库的失败并非由单一原因造成。

最强的确认结论是：

- 原始的低/不稳定性能被训练栈和评估栈的 bug 严重放大。
- 修复这些问题后，基线已在 20 个离线回合中达到 `0.90 success@100`。
- 剩余问题不再是"为什么它完全无法学习？"
- 剩余问题是"如何防止强大的早期策略在第 300 到 500 epoch 之间漂移？"

## 根目录重整后的行为回归

在仓库迁移为根目录一级模块后，重新对同一个 `best_success.pt` 做了真实行为复核：

- `20 episodes`：`1.00 success_rate`
- `100 episodes`：`0.85 success_rate`

解读：
- 这说明根目录重整没有把当前最优策略代码改坏。
- `20 episodes` 的短评估更高，但更关键的是 `100 episodes` 复核仍与历史参考值对齐。

对应结果：

- [root_layout_recheck_20.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_20.json)
- [root_layout_recheck_100.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json)

## 固定 batch 金标准回归

固定 batch 数值回归在根目录重整后重新固化为新的 canonical reference。

- 当前 reference：
  - [baseline-regression-reference.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/baseline-regression-reference.json)
- 旧 reference 归档：
  - [baseline-regression-reference.pre_root_layout_rebaseline.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/notes/baseline-regression-reference.pre_root_layout_rebaseline.json)

说明：

- 旧 reference 在仓库结构重整后不再 bitwise 对齐
- 新 reference 已验证可重复，并可由 `scripts/verify_baseline_regression.py` 直接检查

## H1/H2 归档

为保持 `ckpt/` 干净，H1/H2 结果已迁移到仓库内归档目录：

- H1：
  - [h1 archived run](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/h1_stats_aug_100/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914)
- H2：
  - [h2 archived run](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/h2_dit_dynamics_100/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130)
- 迁移校验：
  - [migration_report.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/migration_report.json)
