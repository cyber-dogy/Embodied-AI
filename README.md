# autodl_unplug_charger_transformer_fm

`RLBench unplug_charger` 上的 `point cloud + Transformer + Flow Matching` 模仿学习项目。当前仓库已经整理成研究型模块化结构：`notebooks/` 负责实验编排，核心实现全部下沉到 `src/`，后续替换 `encoder / backbone / policy / modality` 都只需要替换对应模块和实验配置。

## 当前结论
- 默认主方案是 repaired baseline，不采用 H1/H2 作为默认训练配方。
- 当前最佳已验证 ckpt：
  - `ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epochs/epoch_0500.pt`
- 当前 canonical best alias：
  - `ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt`
- 已验证结果：
  - `20 episodes`: `0.95 success_rate`
  - `100 episodes`: `0.85 success_rate`
- 研究结论与 bug 修复总结见：
  - [docs/2026-04-08-fm-recovery-progress.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/2026-04-08-fm-recovery-progress.md)

## 目录
```text
autodl_unplug_charger_transformer_fm/
├── configs/
│   ├── data/                     # 数据/观测模态配置
│   ├── model/                    # encoder/backbone 配置
│   ├── policy/                   # FM / Diffusion 配置
│   ├── train/                    # 训练超参配置
│   ├── eval/                     # rollout / audit 配置
│   ├── experiment/               # 组合实验入口
│   └── fm_autodl_lab.json        # 默认实验配置入口
├── docs/                         # 研究报告、结构说明、artifact manifest
├── notebooks/                    # 实验总控台，只调用 .py 入口
├── scripts/                      # 薄封装 CLI
├── src/autodl_unplug_charger_transformer_fm/
│   ├── common/                   # runtime / se3 / fm / pointcloud 等通用工具
│   ├── config/                   # ExperimentConfig + 组合配置加载
│   ├── data/                     # replay buffer / sampler / modalities
│   ├── envs/                     # RLBench 环境封装
│   ├── model/                    # encoders / backbones / heads / registry
│   ├── policy/                   # fm_policy / diffusion_policy / registry
│   ├── train/                    # builders / runner / eval / checkpoints
│   ├── research/                 # autoresearch trial orchestration
│   └── cli/                      # 真正的命令行实现
├── ckpt/                         # 本地权重与 run 输出（git ignored）
└── archive/                      # 历史材料归档
```

说明：
- `src/.../model` 是 encoder/backbone/head 的正式 source of truth。
- `src/.../model/encoders/dummy.py` 是最小 smoke encoder，用来验证“换一个 encoder 文件即可替换整条编码链路”。
- `src/.../policy` 只放策略定义；动作后处理在 `src/.../train/action_postprocess.py`。
- `src/.../data/modalities` 负责模态相关数据逻辑；未来要加 `rgb`，就在这里加对应模块。
- `src/.../data/modalities/rgb.py` 目前保留为明确的预留入口；现在切到 `rgb` 会得到清晰的 `NotImplementedError`，而不是静默走错链路。
- `src/.../models`、`policies`、`training`、`utils` 目前只保留轻量过渡入口，不再作为主开发目录。

## 安装
```bash
pip install -r requirements.txt
pip install -e .
```

如果要做 RLBench 离线成功率评估或 rollout 视频录制，再安装：

```bash
pip install -r requirements_eval.txt
```

## 训练
推荐入口是两阶段工作流。

从零训练 baseline：

```bash
python scripts/run_autoresearch_trial.py \
  --phase train-only \
  --config configs/fm_autodl_lab.json \
  --strategy fm \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --experiment-name baseline_500_retrain \
  --no-enable-wandb
```

如果你只想直接触发训练，不走 autoresearch 包装，也可以：

```bash
python scripts/train.py \
  --config configs/fm_autodl_lab.json \
  --strategy fm
```

## 离线 audit
训练完成后，单独做离线成功率审计：

```bash
python scripts/run_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<run_name> \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless
```

说明：
- RLBench/CoppeliaSim 很容易在 notebook/ipykernel 里卡住，所以默认推荐 `train-only -> audit-only` 分离。
- ckpt 最终选择以 `audit_report.json` 的 success rate 为准，不要只看 `best_valid.pt`。
- canonical baseline run 已经补齐了 `audit_report.json` 和 `best_success.pt`，可以直接当作目录模板参考。

## 单个 ckpt 评估
```bash
python scripts/eval_checkpoint.py \
  --ckpt-path ckpt/<run_name>/epochs/epoch_0500.pt \
  --episodes 50 \
  --max-steps 200 \
  --headless
```

## 单次仿真 / 录视频
```bash
python scripts/record_rollout_videos.py \
  --ckpt-path ckpt/<run_name>/epochs/epoch_0500.pt \
  --episodes 1 \
  --camera front \
  --output-dir ckpt/videos/<tag> \
  --no-headless
```

如果是无图形环境，改成 `--headless`。

## Notebook
主 notebook：
- [notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb)

它现在的职责是：
- 选择实验配置
- 选择 `obs_mode / encoder_name / backbone_name / strategy`
- 调用训练 CLI
- 调用 audit CLI
- 调用单次 rollout 录视频 CLI
- 汇总 `summary.json` / `audit_report.json`

## 最佳 artifact 与 manifest
- 最佳 ckpt manifest：
  - [docs/top10-checkpoint-manifest.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/top10-checkpoint-manifest.json)
- 研究结论：
  - [docs/2026-04-08-fm-recovery-progress.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/2026-04-08-fm-recovery-progress.md)
- 结构说明：
  - [docs/code-structure.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/code-structure.md)

注意：
- 大权重不推 GitHub。
- 仓库内只保留 manifest、文档、notebook 和运行入口。
- 本地实际权重路径以 `docs/top10-checkpoint-manifest.json` 为准。
