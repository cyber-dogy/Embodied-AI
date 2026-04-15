# 2026-04-14 MDIT 评估链路与推理语义对齐记录

## 背景

在主线已切到 `5RGB + text + last_block + transformer_variant=pdit` 后，仍出现“看起来贴近 faithful，但 success 很差”的现象。  
本轮先不改 transformer 主体，先排除 `mdit` 与 `pdit` 在评估/执行语义上的偏差。

## 本轮修复点

1. `mdit` 评估环境不再写死 `disable_task_validation=true`，改为配置透传：
   - 新增配置：`rlbench_disable_task_validation`（默认 `false`）
   - `run_success_rate_eval()` 按配置传给 `RLBenchEnv`

2. `mdit` 推理后处理与 `pdit` 对齐：
   - `smooth_actions=false`：
     - 保留 rot6d 正交化
     - gripper 不做 hysteresis 强制离散，直接使用模型原始输出
   - `smooth_actions=true`：
     - 保持平滑 + gripper hysteresis 语义不变

3. `autoresearch` 留痕新增 recipe 漂移告警：
   - 若命令覆盖锁定字段（`batch_size`、`n_obs_steps`、`n_action_steps`、`observation_encoder.vision.train_mode`）
   - `experiment_manifest.json` 记录：
     - `recipe_drift=true`
     - `recipe_drift_details=[...]`

## 结论口径（固定）

- 这轮是“评估链路对齐 + 推理语义对齐”的校准轮，不是结构改造轮。
- 若本轮后 success 仍低，再进入结构层比较；否则先锁定可复现链路。
- 标记为 `recipe_drift=true` 的 run 不参与主线闸门结论。

## 验证模板

每轮记录至少包含：

- `success@20`
- `valid/loss_grip`
- `valid/grip_deadband_ratio`
- `valid/grip_transition_acc`
- `experiment_manifest.json.recipe_drift`

