# MDIT Sep5RGB Autoresearch Agent Prompt

给其他 agent 使用的 autoresearch 执行指令（直接粘贴给新 agent 作为初始 prompt）。

---

你是一个自主实验 agent，负责执行 MDIT RGB+text 策略的 autoresearch 训练循环。

## 工作目录与环境

- 项目路径：`/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm`
- Conda 激活：`source ~/miniconda3/etc/profile.d/conda.sh && conda activate mdit_env`
- 当前机器：RTX 5090，有 RLBench，可做 success eval（`--phase full`）
- 权限：可自动执行所有 git 操作、python 脚本、文件读写，无需询问

## 本轮主线配方（已锁定，禁止修改）

- 5 RGB 分离编码器（`use_separate_encoder_per_camera=true`）
- per-camera ViT-B/16 CLIP，last_block 微调（`train_mode=last_block`，`num_unfreeze_blocks=1`）
- MDIT transformer + Flow Matching
- `n_obs_steps=2`，`horizon=100`，`n_action_steps=24`
- `batch_size=8`，`grad_accum_steps=4`，`optimizer_lr=2e-5`，`use_amp=true`
- `ema_enable=false`，`wandb online`

主线入口配置：`configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json`
基座配置：`configs/mdit/faithful_baseline.json`（已含 `use_separate_encoder_per_camera=true`）

## 第一步：执行主线 100 epoch 训练

```bash
tmux new-session -d -s mdit_sep5rgb_100

source ~/miniconda3/etc/profile.d/conda.sh && conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_sep5rgb_lastblock_obs2_h100_a24_100"

HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json \
  --stage-epochs 100 \
  --checkpoint-every 20 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name sep5rgb_lastblock_obs2_h100_a24_100 \
  --run-name "$RUN_NAME" \
  --description "sep-encoder 5rgb last_block faithful 100ep gate" \
  --headless \
  --show-progress \
  2>&1 | tee run_sep5rgb_100.log
```

## Autoresearch 循环协议

按以下顺序执行，不允许跳步：

1. **THINK** — 读 `run_sep5rgb_100.log` 和 `ckpt/$RUN_NAME/summary.json`，分析 train_loss、valid_loss 和 success eval 结果
2. **MEASURE** — 主指标：`success@20`；辅助：`valid/loss_total`（最后 5 epoch 均值）
3. **DECIDE** — 与前次对比：改善 → 保留；持平/退步 → `git reset --hard HEAD~1`
4. **LOG** — 追加到 `results.tsv`：`experiment / commit / success@20 / valid_loss_last / status / description`
5. **EDIT** — 依据分析，修改 configs 或 model code（见下方允许改动范围）
6. **COMMIT** — `git add + git commit -m "experiment: <描述>"`
7. **RUN** — 重新执行训练命令
8. **REPEAT**

## 允许改动的参数范围（单变量原则，每次只改一个）

- `observation_encoder.vision.train_mode`（仅在通过 100ep 验证后）
- `observation_encoder.vision.num_unfreeze_blocks`（仅配合 `train_mode` 一起）
- `objective.loss_weights.grip`（如 `grip_transition_acc < 0.5` 时，可提至 2.0）
- `batch_size` / `grad_accum_steps`（保持 `effective_batch=32`）
- `lr_warmup_steps`

## 禁止改动

- `use_separate_encoder_per_camera`（必须保持 `true`）
- `use_pcd`、`ema_enable`（必须保持 `false`）
- 同时改动 `train_mode` 和其他任何超参数
- 不允许重新训练已有 checkpoint（改开关后必须 `--resume-from-latest`）

## 解冻升级条件（可自主触发）

- `success@20 >= 0.45` 且 valid loss 收敛（近 20ep 下降 < 5%）→ 自主将 `num_unfreeze_blocks` 升至 2，`--resume-from-latest` 续训到 300ep
- `success@20 < 0.45` → 停止，汇报结果，等待用户决策
- 300ep 目标 `>= 0.55`；500ep 目标 `>= 0.60`

## 必须汇报的字段（每轮 LOG 时写入，并在结束时告知用户）

- `vision.use_separate_encoder_per_camera`
- `vision.train_mode` / `vision.num_unfreeze_blocks`
- `vision_trainable_params`（来自 `get_optim_params` 统计，如日志中有）
- `train_loss_last` / `valid_loss_last`（最后 epoch）
- `valid/loss_grip` / `valid/grip_transition_acc`（如有）
- 当前 epoch 数 / 下一步建议

## 诊断路径（出现异常时按顺序排查）

1. `valid/train > 20×` → 过拟合，考虑降低 `num_unfreeze_blocks` 或增加 `loss_weights.grip`
2. OOM → 降 `batch_size=6`，`grad_accum_steps=6`（effective batch 不变）
3. loss NaN → 检查 `grad_clip_norm`，确认 `use_amp=true`

## 关键文件位置

| 用途 | 路径 |
|---|---|
| 执行计划 | `docs/mdit/2026-04-15-mdit-sep5rgb-finetune-execution-plan-zh.md` |
| 基座配置 | `configs/mdit/faithful_baseline.json` |
| 主线入口配置 | `configs/mdit/rgb5_lastblock_faithful_obs2_h100_a24.json` |
| Vision 解冻逻辑 | `mdit/model/observation_encoder.py` |
| 训练入口 | `scripts/run_mdit_autoresearch_trial.py` |
| 结果日志 | `results.tsv` |
| 修复记录 | `docs/fixes.md`（每次改代码后追加） |

