# LeLaN 执行手册

更新时间：2026-04-19

## 1. 目标与主线约束

- 任务：`unplug_charger`
- 主线：`lelan`
- 当前固定执行线：`5RGB + obs3 + horizon32 + a8 + smooth_actions + EMA + 100/300/500 gate`
- 当前阶段优先级：先把训练、恢复、审计、留痕链路固化，再决定是否继续做更激进的结构搜索
- 训练/评估一致性：评估必须从 checkpoint payload 和 `experiment_manifest.json` 恢复，不能手工漂移配方

## 2. 文档分层

- `docs/lelan/fixes.md`
  LeLaN 专线事实账本，记录修复、故障、训练阶段结果、审计结果
- `docs/lelan/research_journal.md`
  LeLaN run-by-run 日志，默认由 `research/lelan_trial_runner.py` 追加
- `docs/lelan/best_path.md`
  LeLaN 当前 winner 的单页摘要，默认由 `research/lelan_autoresearch_loop.py` 更新
- `docs/research_desk.md`
  只保留跨线路阶段总结，不写 LeLaN 的逐条流水账

## 3. 当前主线 recipe

- `camera_names = [right_shoulder, left_shoulder, overhead, front, wrist]`
- `n_obs_steps = 3`
- `horizon = 32`
- `n_action_steps = 8`
- `objective.sigma_min = 0.001`
- `objective.num_integration_steps = 25`
- `smooth_actions = true`
- `command_mode = "first"`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`
- `EMA = on`

## 4. 关键产物

每个 LeLaN run 至少要保留：

- `ckpt/<RUN_NAME>/experiment_manifest.json`
- `ckpt/<RUN_NAME>/summary.json`
- `ckpt/<RUN_NAME>/dataset_stats.json`
- `ckpt/<RUN_NAME>/lelan_trial_request.json`
- `ckpt/<RUN_NAME>/audit_report.json`
- `autoresearch_records/<RUN_NAME>.json`
- `docs/lelan/research_journal.md`
- `docs/lelan/fixes.md`

如果当前 run 成为 winner，还要同步：

- `docs/lelan/best_path.md`

## 5. 单次训练与审计

### Train-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_lelan_autoresearch_trial.py \
  --phase train-only \
  --config configs/lelan/obs3_rgb5_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda
```

### Audit-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_lelan_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<RUN_NAME> \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress
```

## 6. 闸门规则

- `100 epoch`
  - `< 0.45 @ 20 episodes`：停止该分支
  - `>= 0.45 @ 20 episodes`：允许进 `300 epoch`
- `300 epoch`
  - `< 0.55 @ 20 episodes`：停止该分支
  - `>= 0.55 @ 20 episodes`：允许进 `500 epoch`
- `500 epoch`
  - 目标 `>= 0.60`

## 7. 交接清单

交给后续 agent 或接管人时，最少附带：

- 当前 `docs/lelan/fixes.md` 最新条目
- 当前 `docs/lelan/research_journal.md`
- 当前 `docs/lelan/best_path.md`
- `autoresearch_records/<RUN_NAME>.json`
- `ckpt/<RUN_NAME>/experiment_manifest.json`
- `ckpt/<RUN_NAME>/audit_report.json`
