# MDIT 执行手册（RGB+Text + FM + Transformer）

更新时间：2026-04-16

## 1. 目标与固定设置

- 任务：`unplug_charger`
- 主线：`mdit`，与 `pdit` 代码线隔离
- 不可变要求：保留 `RGB+text`、`FM`、`Transformer`
- 训练/评估一致性：评估必须从 checkpoint payload + `experiment_manifest.json` 恢复，禁止单独改配方
- 共享评估链：继续复用 `common.rlbench_rollout + pdit.train.action_postprocess`
- 首轮 screening：`100 epoch`，在 `epoch 50/100` 做 `20 episodes` 审计
- Champion 复核：最佳候选再做 `100 episodes` 单点复核

## 2. 两条搜索线

- `Lane A`：`configs/mdit/fm_autodl_lab.json`
  - `clip_rgb_text_token`
  - `5` 个独立 CLIP vision encoder
  - `last_block` 微调
  - `3-token` step fusion
  - PDIT 风格 DiT + FM 主干
- `Lane B`：`configs/mdit/fm_autodl_lane_b.json`
  - `clip_rgb_text_faithful`
  - `5` 个独立 CLIP vision encoder
  - `last_block` 微调
  - faithful concat conditioning，再投影回 PDIT cond token 契约
  - 评估链路与 Lane A 完全一致

## 3. Manifest 与留痕

每个 run 至少会生成：

- `ckpt/<RUN_NAME>/experiment_manifest.json`
- `ckpt/<RUN_NAME>/train_heartbeat.json`
- `ckpt/<RUN_NAME>/summary.json`
- `ckpt/<RUN_NAME>/audit_report.json`
- `ckpt/<RUN_NAME>/eval_manifests/*.json`
- `autoresearch_records/<RUN_NAME>.json`
- `docs/mdit/<timestamp>-<run_name>.md`
- `docs/fixes.md` 追加记录

重点检查字段：

- `effective_task_text`
- `eval_contract`
- `recipe_drift`
- `contract_issues`

## 4. 单次训练 / 审计命令

查看指令

tmux attach -t mdit_autoresearch

tmux list-panes -a -F '#{session_name} #{window_index}.#{pane_index} #{pane_current_command} #{pane_dead} #{pane_current_path}'

tail -f /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/logs/unplug_charger_mdit_rgb_text_fm_v1__lane_a_stabilized_100__e0100__20260417_112110__train.log

### Train-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_autoresearch_trial.py \
  --line mdit \
  --phase train-only \
  --config configs/mdit/fm_autodl_lab.json \
  --stage-epochs 100 \
  --checkpoint-every 50 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name lane_a_mainline_100 \
  --description "MDIT lane A mainline screening" \
  --enable-wandb
```

### Audit-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_autoresearch_trial.py \
  --line mdit \
  --phase audit-only \
  --run-dir ckpt/<RUN_NAME> \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress
```

## 5. Autoresearch Loop

### 前台运行

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_loop.py \
  --tag unplug_rgb_text_search \
  --lane-a-config configs/mdit/fm_autodl_lab.json \
  --lane-b-config configs/mdit/fm_autodl_lane_b.json \
  --device cuda \
  --audit-timeout-sec 7200 \
  --train-stall-timeout-sec 2700 \
  --show-progress
```

### 直接挂到 tmux 后台

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_loop.py \
  --tag unplug_rgb_text_search \
  --lane-a-config configs/mdit/fm_autodl_lab.json \
  --lane-b-config configs/mdit/fm_autodl_lane_b.json \
  --device cuda \
  --audit-timeout-sec 7200 \
  --train-stall-timeout-sec 2700 \
  --tmux-session mdit_autoresearch
```

接管后查看：

- `tmux attach -t mdit_autoresearch`
- `autoresearch_records/mdit_loop_state__unplug_rgb_text_search.json`
- `autoresearch_records/logs/*.log`
- `ckpt/mdit_best` 或 `ckpt/mdit_best.json`
- `docs/mdit/best_path.md`

## 6. 晋级与清理规则

- Screening 淘汰：`epoch100@20 < 0.45` 或 collapse
- `100 -> 300`：`epoch100@20 >= max(当前冠军 + 0.05, 0.60)`
- `300 -> 500`：`epoch300@20 >= max(当前冠军 + 0.03, 0.75)`
- 最终冠军：做 `100 episodes` 复核
- 非冠军 run：只保留 JSON/manifest/docs 记录，大 checkpoint 可清理
- 当前冠军：保留完整 run 目录与 `best_success.pt`

## 7. OOM 与 watchdog

- OOM 自动降档：`32x4 -> 16x8 -> 8x16`
- Watchdog 盯住：
  - `train_heartbeat.json` 长时间不更新
  - 训练子进程退出
  - 审计超时
- 训练恢复统一走：`scripts/train.py --line mdit --resume`

## 8. 交接最小清单

交给 autoresearch 或其他 agent 时必须附带：

- 当前 loop 状态文件
- 当前冠军 `run_dir`
- `best_success.pt` 路径
- `docs/mdit/best_path.md`
- `docs/fixes.md` 最新条目
- WandB run URL
