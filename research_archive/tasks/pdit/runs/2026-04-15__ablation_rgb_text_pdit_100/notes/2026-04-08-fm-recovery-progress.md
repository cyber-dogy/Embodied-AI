# FM/DiT Recovery Progress

Date: 2026-04-08  
Latest update: 2026-04-09

## Note

这份文档主要记录 `pdit` 这条线是如何被修稳的。  
仓库当前已经升级成双线结构：

- `pdit/`
  当前已验证最强的点云 FM + DiT-style 主线
- `mdit/`
  独立 faithful MDIT 研究线

因此，下面所有 `H1 / H2 / repaired baseline / best_success.pt` 的结论，默认都指向 `pdit`。

## Final status

`pdit` 这版仓库完成了两件关键事：

1. 把训练 / 评估 / 审计链路修到可复现、可独立运行
2. 把原始单线工程重构成后续可扩展的模块化结构

当前默认稳定方案仍然是 `pdit repaired baseline`，不采用 H1/H2 作为默认训练配方。

## H1 / H2 分别验证什么

### H1

- 目标：验证“数据驱动归一化 + 训练期点云/状态增强”是否能改善泛化
- 发现：
  - 原始实现里 `rot6d` 被错误施加平移，是一个真实 bug
  - 修完这个 bug 后，H1 仍然不如 repaired baseline
- 结论：
  - H1 暂不作为默认方案

### H2

- 目标：验证“更接近官方 DiT 的训练动力学”是否是主因
- 具体改动：
  - `dropout = 0.0`
  - `final_layer_zero_init = true`
- 发现：
  - `valid loss` 更低
  - rollout success 没有更好
  - `best_valid.pt` 甚至可能不是最好的行为 checkpoint
- 结论：
  - H2 不作为默认方案
  - 当前任务上不能只按 `valid loss` 选 ckpt

## 这版为什么比之前好

已确认并修复的关键问题：

1. 路径 / 导入污染
   - 训练和评估固定走当前仓库实现，不再混到别的工作区代码

2. FM 依赖耦合
   - FM 不再因为 diffusion 依赖链提前炸掉

3. PointNet 导入错误
   - 本地工具模块导入路径修正

4. checkpoint 保存风险
   - 改成 atomic save

5. `resume` 污染实验
   - 默认 `resume_from_latest = false`
   - autoresearch run 默认唯一 `run_name`

6. RLBench / CoppeliaSim 评估不稳定
   - 工作流改成 `train-only -> audit-only`
   - 多 checkpoint 审计改成单 checkpoint 子进程隔离

7. audit 阶段逻辑 bug
   - 修掉了 `stage_epochs` 被错误覆盖导致的误判崩坏问题

8. 数据增强语义 bug
   - `rot6d` 不再被错误平移

9. notebook 角色错位
   - notebook 重新收敛成实验控制台，不再混进模型实现

## 结构重构结果

现在仓库是双线结构：

- `pdit/`
- `mdit/`
- `common/`
- `envs/`
- `research/`
- `scripts/`
- `configs/`
- `notebooks/`

旧 `src` 和旧 `lib` 仍保留在 `archive/legacy_code/` 里，只作为历史参考。

## 当前最佳方案

当前稳定、已验证、建议默认使用的线路是 `pdit`。

默认训练配置：

- [configs/fm_autodl_lab.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/fm_autodl_lab.json)

当前最佳已验证 ckpt：

- [epoch_0500.pt](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epochs/epoch_0500.pt)
- [best_success.pt](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt)

已验证结果：

- `20 episodes`: `0.95 success_rate`
- `100 episodes`: `0.85 success_rate`

仓库结构重整后的行为回归：

- `20 episodes`: `1.00 success_rate`
- `100 episodes`: `0.85 success_rate`

对应评估结果：

- [epoch_0500_manual_eval.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epoch_0500_manual_eval.json)
- [epoch_0500_recheck_100.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epoch_0500_recheck_100.json)
- [root_layout_recheck_20.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_20.json)
- [root_layout_recheck_100.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json)
- [audit_report.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json)

固定 batch 金标准回归：

- 当前 canonical reference：
  - [baseline-regression-reference.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/baseline-regression-reference.json)
- 旧 reference 归档：
  - [baseline-regression-reference.pre_root_layout_rebaseline.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/notes/baseline-regression-reference.pre_root_layout_rebaseline.json)

## H1 / H2 归档

- H1：
  - [h1 archived run](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/h1_stats_aug_100/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914)
- H2：
  - [h2 archived run](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/h2_dit_dynamics_100/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130)
- 文件级迁移校验：
  - [migration_report.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/migration_report.json)

## 推荐工作流

### PDIT

1. 训练走 `train-only`
2. 成功率评估走 `audit-only`
3. 部署或复核时优先看 `best_success.pt`

### MDIT

1. 先做 faithful baseline
2. 再走独立的 MDIT autoresearch
3. 只有当 `100 episodes` 超过 `pdit 0.85` 时，才把它视为新的胜出方案

## Artifact manifest

最佳与保留 ckpt 清单见：

- [top10-checkpoint-manifest.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/top10-checkpoint-manifest.json)
