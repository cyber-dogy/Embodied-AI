# autodl_unplug_charger_transformer_fm

`RLBench unplug_charger` 的双线研究仓库。

当前仓库包含两条并列实现：

- `pdit/`
  当前已验证最强的 `point cloud + Flow Matching + DiT-style backbone` 主线
- `mdit/`
  独立的 faithful `RGB + text + MultiTask DiT` 研究线

`docs/`、历史排查记录、manifest、以及现有 `ckpt/` 证据都保留在仓库里。  
当前金标准模型仍然是 `pdit` baseline，而 `mdit` 是正在推进的独立验证线。

迁移到新机器时，优先看：

- [2026-04-10-5090-migration-checklist.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/2026-04-10-5090-migration-checklist.md)
- [todolist.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/todolist.md)

## 当前最强模型

- 线路：`pdit`
- 配置：[configs/fm_autodl_lab.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/fm_autodl_lab.json)
- canonical best ckpt：
  [best_success.pt](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt)
- 已验证结果：
  - `20 episodes = 1.00`
  - `100 episodes = 0.85`

## 仓库布局

```text
autodl_unplug_charger_transformer_fm/
├── pdit/          # 点云 FM + DiT-style 主线
├── mdit/          # faithful MDIT 独立主线
├── common/        # 共享运行时、SE(3)、task text 等
├── envs/          # RLBench 环境封装
├── research/      # autoresearch / trial orchestration
├── scripts/       # 外部脚本入口
├── configs/       # pdit / mdit 实验配置
├── notebooks/     # 实验控制台
├── docs/          # 历史研究文档与 manifest
├── data/          # 本地数据集目录（不是源码包）
├── ckpt/          # 本地权重和 run 输出（git ignored）
└── archive/       # 历史代码和研究结果归档
```

关键约定：

- 想换 `pdit` encoder：改 `pdit/model/encoders/`
- 想换 `pdit` backbone：改 `pdit/model/backbones/`
- 想换 `mdit` encoder / transformer：改 `mdit/model/`
- 想换 `mdit` 图像/文本数据入口：改 `mdit/data/`
- notebook 只拼配置、调脚本、看结果，不再承载模型实现

## 环境

### PDIT

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /home/gjw/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
pip install -r requirements.txt
pip install -e .
```

### MDIT

`mdit` 额外依赖 `timm + transformers`。建议单独环境，避免影响 `pdit` 基线：

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /home/gjw/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
pip install -r requirements.txt
pip install -e '.[mdit]'
```

如果要做 rollout / 视频录制，还需要：

```bash
pip install -r requirements_eval.txt
```

## 训练入口

### PDIT 训练

```bash
python scripts/train_pdit.py \
  --config configs/fm_autodl_lab.json \
  --strategy fm
```

推荐工作流仍然是：

```bash
python scripts/run_autoresearch_trial.py \
  --line pdit \
  --phase train-only \
  --config configs/fm_autodl_lab.json \
  --strategy fm \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --experiment-name baseline_500_retrain \
  --no-enable-wandb
```

### MDIT 训练

faithful baseline：

```bash
python scripts/train_mdit.py \
  --config configs/mdit/faithful_baseline.json
```

或直接走 MDIT trial runner：

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/faithful_baseline.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --experiment-name mdit_faithful_baseline_100
```

## 离线审计

### PDIT

```bash
python scripts/run_autoresearch_trial.py \
  --line pdit \
  --phase audit-only \
  --run-dir ckpt/<pdit_run_name> \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless
```

### MDIT

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<mdit_run_name> \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless
```

## 单 checkpoint 评估

### PDIT

```bash
python scripts/eval_pdit_checkpoint.py \
  --ckpt-path ckpt/<pdit_run_name>/best_success.pt \
  --episodes 50 \
  --max-steps 200 \
  --headless
```

### MDIT

```bash
python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<mdit_run_name>/best_success.pt \
  --episodes 50 \
  --max-steps 200 \
  --headless
```

也可以用通用入口，但现在必须显式指定线路：

```bash
python scripts/eval_checkpoint.py --line pdit --help
python scripts/eval_checkpoint.py --line mdit --help
```

## 单次 rollout / 视频录制

### PDIT

```bash
python scripts/record_pdit_rollout_videos.py \
  --ckpt-path ckpt/<pdit_run_name>/best_success.pt \
  --episodes 1 \
  --camera front \
  --output-dir ckpt/videos/pdit_demo \
  --no-headless
```

### MDIT

```bash
python scripts/record_mdit_rollout_videos.py \
  --ckpt-path ckpt/<mdit_run_name>/best_success.pt \
  --episodes 1 \
  --camera front \
  --output-dir ckpt/videos/mdit_demo \
  --no-headless
```

## notebook

当前 notebook 角色：

- [pfm_unplug_charger_transformer_fm_autodl_lab.ipynb](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb)
  `pdit` 实验控制台
- [mdit_unplug_charger_transformer_autodl_lab.ipynb](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/notebooks/mdit_unplug_charger_transformer_autodl_lab.ipynb)
  `mdit` faithful baseline 实验控制台

notebook 现在只做：

- 选择线路和配置
- 调训练命令
- 调 audit 命令
- 调单 checkpoint 评估或 rollout
- 对比 `summary.json / audit_report.json / eval json`

## 文档入口

- [docs/code-structure.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/code-structure.md)
  看双线结构和替换点
- [docs/2026-04-08-fm-recovery-progress.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/2026-04-08-fm-recovery-progress.md)
  看 `pdit` 这版为何稳定下来、H1/H2 结论和当前金标准
- [docs/2026-04-07-training-model-audit.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/2026-04-07-training-model-audit.md)
  看最早的问题定位记录
- [docs/top10-checkpoint-manifest.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/top10-checkpoint-manifest.json)
  看当前保留 ckpt 清单

## 最佳模型回归

`pdit` 金标准回归脚本：

```bash
python scripts/verify_baseline_regression.py
```

参考文件：

- [baseline-regression-reference.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/baseline-regression-reference.json)

## 当前结论

- 当前最强且已验证的是 `pdit`
- `mdit` 是独立研究线，不会和 `pdit` 共享模型接口
- 后续如果 `mdit` 在 `100 episodes` 上超过 `0.85`，它才会成为新的研究胜出方案
