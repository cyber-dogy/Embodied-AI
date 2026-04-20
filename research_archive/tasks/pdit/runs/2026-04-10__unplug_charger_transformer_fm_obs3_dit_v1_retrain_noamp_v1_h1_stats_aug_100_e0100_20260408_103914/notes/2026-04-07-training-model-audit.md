# Training / Model Audit

> Historical note
> This audit was written before the repository was flattened to root-level modules.
> References to the old `src/` tree describe the repository layout at that time.
> The archived snapshot now lives under `archive/legacy_code/src_layout_snapshot/`.

## H1 在验证什么

`H1` 验证：
- 数据驱动归一化
- 训练期点云/状态增强

结论：
- 这条线暴露出一个真实 bug：SE(3) 增强把平移错误地施加到了 `rot6d`
- bug 修掉以后，H1 仍然不如 repaired baseline
- 所以 H1 不作为默认方案

## H2 在验证什么

`H2` 验证：
- 更接近官方 DiT 的训练动力学
- 具体是 `dropout=0.0 + final layer zero-init`

结论：
- `valid loss` 更好
- rollout success 没更好
- `best_valid.pt` 甚至可能行为很差
- 所以这证明“只按 valid loss 选 ckpt”在这个任务上不可靠

## 当前默认方案

- repaired baseline
- `train-only -> audit-only`
- ckpt 选择按 `audit_report.json`

## 已确认修掉的关键 bug

- 路径/导入污染导致的实际训练代码不一致
- FM 与 diffusion 依赖耦合
- PointNet 本地导入错误
- checkpoint 非原子保存导致的损坏风险
- `resume` 污染实验
- RLBench/CoppeliaSim 与训练进程耦合
- audit 阶段 stage 覆盖 bug
- `rot6d` 增强被错误平移
- `.gitignore` 误伤 `src/.../data`
