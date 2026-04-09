# FM/DiT Recovery Progress

Date: 2026-04-08  
Latest update: 2026-04-09

> Note
> The repository source of truth has since been migrated from the historical `src/` layout to root-level modules:
> `model/`, `policy/`, `train/`, `config/`, `data/`, `envs/`, `common/`, `research/`, and `cli/`.
> The old `src` tree is preserved only as a legacy snapshot under `archive/legacy_code/src_layout_snapshot/`.

## Final status

这版仓库已经完成两件关键事：

1. 把训练/评估/审计链路修到可复现、可独立运行
2. 把源码重构成可替换模块化结构

当前默认主方案固定为 repaired baseline，不采用 H1/H2 作为默认训练配方。

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
  - `valid loss` 下降
  - rollout success 没有更好
  - `best_valid.pt` 甚至可能是坏行为 checkpoint
- 结论：
  - H2 不作为默认方案
  - 当前任务上不能只按 `valid loss` 选 ckpt

## 这版为什么比之前好

已经确认并修复的关键问题：

1. 路径/导入污染
   - 训练/评估现在优先固定到当前仓库的根目录模块

2. FM 依赖耦合
   - FM 不再因为 diffusion 依赖链问题提前炸掉

3. PointNet 导入错误
   - 本地工具模块导入路径修正

4. checkpoint 保存风险
   - 改为 atomic save

5. `resume` 污染实验
   - 默认 `resume_from_latest = false`
   - autoresearch run 默认唯一 `run_name`

6. RLBench/CoppeliaSim 评估不稳定
   - 推荐流程改成 `train-only -> audit-only`
   - 批量 ckpt 审计改为单 ckpt 子进程隔离

7. audit 阶段逻辑 bug
   - 修掉了 `stage_epochs` 被错误覆盖导致的误判崩坏问题

8. 数据增强语义 bug
   - `rot6d` 不再被错误平移

9. 版本控制卫生
   - `.gitignore` 不再误伤根目录 `data/` 代码包

## 结构重构结果

现在正式 source of truth 是：

- `config/`
- `model/`
- `policy/`
- `data/`
- `train/`
- `envs/`
- `common/`
- `research/`
- `cli/`
- `notebooks/`

旧的 `src layout` 和 `lib/` 都已归档到 `archive/legacy_code/`，不再作为主开发目录。

## 当前最佳方案

默认训练配置：
- [configs/fm_autodl_lab.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/fm_autodl_lab.json)

当前最佳已验证 ckpt：
- [epoch_0500.pt](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epochs/epoch_0500.pt)
- [best_success.pt](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt)

已验证结果：
- `20 episodes`: `0.95 success_rate`
- `100 episodes`: `0.85 success_rate`

post-refactor 行为回归：
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
- 说明：
  - 旧 reference 在仓库根目录重整后不再 bitwise 对齐
  - 新 reference 已验证可重复，并通过了 `20/100` episode 行为回归

H1/H2 归档：
- H1：
  - [h1 archived run](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/h1_stats_aug_100/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914)
- H2：
  - [h2 archived run](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/h2_dit_dynamics_100/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130)
- 文件级迁移校验：
  - [migration_report.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/migration_report.json)

## 推荐工作流

1. 用 notebook 选择实验配置和模块
2. 训练走 `train-only`
3. 成功率评估走 `audit-only`
4. 部署时按 `audit_report.json` 或 manifest 选 ckpt

## Artifact manifest

最佳与保留 ckpt 清单见：
- [top10-checkpoint-manifest.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/top10-checkpoint-manifest.json)
