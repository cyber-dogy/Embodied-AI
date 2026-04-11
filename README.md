# autodl_unplug_charger_transformer_fm

`RLBench unplug_charger` 上的 `point cloud + Transformer + Flow Matching` 模仿学习项目。

当前仓库已经重整为根目录一级模块化结构。正式 source of truth 不再是 `src/`，而是仓库根目录下的这些模块：

- `model/`
- `policy/`
- `train/`
- `config/`
- `data/`
- `envs/`
- `common/`
- `research/`
- `cli/`

`notebooks/` 保留为实验总控台，只负责拼配置、调用 `.py` 入口和查看结果。

## 当前默认方案

- 默认训练方案：`repaired baseline`
- 推荐工作流：`train-only -> audit-only`
- 当前金标准 run：
  - `ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741`
- 当前 canonical best ckpt：
  - `ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt`
- post-refactor 行为回归：
  - `20 episodes`: `1.00 success_rate`
  - `100 episodes`: `0.85 success_rate`

H1/H2 只作为研究证据保留，不作为默认训练配方。

## 仓库结构

```text
autodl_unplug_charger_transformer_fm/
├── model/                    # encoders / backbones / heads / registry
├── policy/                   # fm_policy / diffusion_policy / registry
├── train/                    # builders / runner / eval / checkpoints / postprocess
├── config/                   # ExperimentConfig / loader / schema
├── data/                     # replay buffer / sampler / modalities / dataset
├── envs/                     # RLBench environment wrappers
├── common/                   # runtime / se3 / fm / task text / visualization
├── research/                 # train-only / audit-only / autoresearch orchestration
├── cli/                      # 真正的命令行实现
├── scripts/                  # 薄封装入口
├── configs/                  # 模块化实验配置
├── notebooks/                # 实验控制台，只调用脚本入口
├── docs/                     # 完整保留的研究文档与 manifest
├── tests/                    # 单元测试与 smoke 回归
├── ckpt/                     # 本地模型权重与 run 输出（git ignored）
└── archive/                  # 历史代码与研究结果归档
```

说明：

- 想换 encoder，改 [model/encoders](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/model/encoders)
- 想换 backbone，改 [model/backbones](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/model/backbones)
- 想换 policy，改 [policy](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/policy)
- 想换 `pcd -> rgb`，优先改 [data/modalities](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/data/modalities) 并在 registry / config 里切换
- `train/` 不再直接写死点云 encoder 细节，Notebook 也不再承载模型实现

## 安装

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
source /home/gjw/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env

pip install -r requirements.txt
pip install -e .
```

如果需要 RLBench rollout 评估或视频录制：

```bash
pip install -r requirements_eval.txt
```

## 从零训练

推荐直接用两阶段工作流。

从0开始跑5RGB-MDIT（share+全量）：

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_flowmatch_pditfirst_500__$(date +%Y%m%d_%H%M%S)"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name obs3_rgb5_flowmatch_pditfirst_500 \
  --run-name "$RUN_NAME" \
  --description "5RGB obs3 flow-matching mdit aligned to pdit first-action semantics" \
  --set batch_size=16 \
  --set num_workers=8 \
  --set use_amp=true\
  --set grad_accum_steps=1 \
  --set resume_from_latest=false

```

断点续训：

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="<SAME_RUN_NAME>"
BATCH=<CALIBRATED_BATCH>

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name obs3_rgb5_flowmatch_pditfirst_500 \
  --run-name "$RUN_NAME" \
  --description "resume 5RGB obs3 flow-matching mdit aligned to pdit first-action semantics" \
  --set batch_size=16 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set resume_from_latest=true
```

训练完成后，单独做成功率审计：

```bash
python scripts/run_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<run_name> \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless
```

从0开始跑5RGB-MDIT（5RGB + 每相机独立 encoder + last_block 微调）：

```
#全量微调5独立Vit测试
tmux new -s mdit_rgb5_sep_all

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_all_500"

/home/gjw/.conda/envs/mdit_env/bin/python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_all_500 \
  --run-name "$RUN_NAME" \
  --description "5RGB separate encoders all finetune 500ep" \
  --set batch_size=8 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode=all \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set observation_encoder.vision.resize_shape=[240,240] \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set resume_from_latest=false\
  --set save_latest_ckpt=true\
  --set checkpoint_payload_mode=full





source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_all_500"

/home/gjw/.conda/envs/mdit_env/bin/python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_all_500 \
  --run-name "$RUN_NAME" \
  --description "resume 5RGB separate encoders all finetune" \
  --set batch_size=8 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode=all \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set observation_encoder.vision.resize_shape=[240,240] \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=full \
  --set resume_from_latest=true

跑起来后如果要脱离 tmux：
Ctrl-b d

之后重连：
tmux attach -t mdit_rgb5_sep_all

评估代码：
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_all_500"

/home/gjw/.conda/envs/mdit_env/bin/python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/$RUN_NAME \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress

单独测ckpt:
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_all_500"

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<RUN_NAME>/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --headless \
  --show-progress



```

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_last_500__$(date +%Y%m%d_%H%M%S)"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_last_500 \
  --run-name "$RUN_NAME" \
  --description "5RGB separate encoders last-block finetune 500ep" \
  --set batch_size=8 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode=\"last_block\" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set resume_from_latest=false

```

断点续训：

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="<SAME_RUN_NAME>"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_flowmatch_pdit_first.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_last_500 \
  --run-name "$RUN_NAME" \
  --description "resume 5RGB separate encoders last-block finetune" \
  --set batch_size=8 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode=\"last_block\" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set resume_from_latest=true

```

训练完成后，单独做成功率审计：

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_DIR="ckpt/<RUN_NAME>"

python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir "$RUN_DIR" \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress

```

## 换SSH设备跟踪训练进度

```bash
  watch -n 1 "nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free,utilization.gpu --format=csv,noheader,nounits | awk -F, '{printf \"GPU: %s | Total: %.2f GB | Used: %.2f GB | Free: %.2f GB | Util: %s%%\\n\", \$1, \$2/1024, \$3/1024, \$4/1024, \$5}'"
```

## 离线 audit

说明：

- `RLBench/CoppeliaSim` 在 notebook/ipykernel 中容易卡住，所以默认拆成 `train-only -> audit-only`
- ckpt 选择优先看 `audit_report.json` 和 `best_success.pt`
- 不要只按 `best_valid.pt` 选模型

## 单个 ckpt 成功率评估

```bash
python scripts/eval_checkpoint.py \
  --ckpt-path ckpt/<run_name>/best_success.pt \
  --episodes 50 \
  --max-steps 200 \
  --headless
```

## 单次 rollout / 录视频

```bash
python scripts/record_rollout_videos.py \
  --ckpt-path ckpt/<run_name>/best_success.pt \
  --episodes 1 \
  --camera front \
  --output-dir ckpt/videos/<tag> \
  --no-headless
```

无图形环境下改成 `--headless`。

## 最佳模型回归验证

这个仓库提供了固定 batch 的金标准回归脚本，用来确认后续重构没有把当前最佳模型代码改坏：

```bash
python scripts/verify_baseline_regression.py
```

参考基线保存在：

- [baseline-regression-reference.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/baseline-regression-reference.json)
- [baseline-regression-reference.pre_root_layout_rebaseline.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/notes/baseline-regression-reference.pre_root_layout_rebaseline.json)

真实行为回归建议再补两轮：

```bash
python scripts/eval_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt \
  --episodes 20 \
  --headless
```

```bash
python scripts/eval_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt \
  --episodes 100 \
  --headless
```

## Notebook

正式实验 notebook：

- [pfm_unplug_charger_transformer_fm_autodl_lab.ipynb](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb)

它现在只负责：

- 选择 `obs_mode / encoder_name / backbone_name / strategy`
- 调 `train-only`
- 调 `audit-only`
- 调单次 rollout / 视频录制
- 汇总 `summary.json`、`audit_report.json` 和 manifest

不要再把模型实现直接写进 notebook。

## 研究文档

完整历史文档都保留在 [docs](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs)。

推荐阅读顺序：

- [code-structure.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/code-structure.md)
  - 看现在的正式结构、主链路和替换点
- [2026-04-08-fm-recovery-progress.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/2026-04-08-fm-recovery-progress.md)
  - 看这版为什么比旧版更好、H1/H2 结论和当前默认方案
- [2026-04-07-training-model-audit.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/2026-04-07-training-model-audit.md)
  - 看原始问题定位记录和结构怀疑点
- [2026-04-07-autoresearch-pipeline.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/2026-04-07-autoresearch-pipeline.md)
  - 看训练/审计流水线的来龙去脉
- [top10-checkpoint-manifest.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/top10-checkpoint-manifest.json)
  - 看当前保留权重清单、hash、用途和证据文件

## Artifact 规则

- `baseline_500` 原地保留在当前 `ckpt/` 路径
- H1/H2 研究结果归档到仓库内 `archive/ckpt_research/`
- H1/H2 文件级迁移校验：
  - [migration_report.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/ckpt_research/migration_report.json)
- 大权重不推 GitHub
- GitHub 只保留代码、README、docs、notebook、tests 和 manifest

## 当前最佳方案相比旧版提升的原因

这次不是“只调了一个结构超参”。真正拉开差距的是这些问题被修掉了：

- 路径/导入污染，训练与评估终于稳定走当前仓库代码
- FM 路径不再被 diffusion 依赖链拖挂
- PointNet 的坏导入修复
- checkpoint 改成原子保存
- 默认 `no-resume`，避免脏实验续训
- `train-only -> audit-only` 分离，绕开 RLBench/CoppeliaSim 冲突
- audit 阶段 stage/评分逻辑 bug 修复
- 数据增强里 `rot6d` 被错误平移的 bug 修复
- notebook 改成正式实验控制台，不再混模型实现
