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

## LeLaN 自动 Autoresearch

LeLaN 当前推荐直接用：

- 配置：`configs/lelan/obs3_rgb5_a8_gate100.json`
- 执行文档：[docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md)
- 研究记录目录：[docs/lelan/research/README.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/lelan/research/README.md)

### 训练

```bash
tmux new -s lelan_a8

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_lelan_rgb5_obs3_a8_500"

python scripts/run_lelan_autoresearch_trial.py \
  --phase train-only \
  --config configs/lelan/obs3_rgb5_a8_gate100.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name lelan_rgb5_obs3_a8_500 \
  --run-name "$RUN_NAME" \
  --description "LeLaN 5RGB obs3 a8 500ep" \
  --headless \
  --show-progress
```

### 续训

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_lelan_rgb5_obs3_a8_500"

python scripts/run_lelan_autoresearch_trial.py \
  --phase train-only \
  --config configs/lelan/obs3_rgb5_a8_gate100.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name lelan_rgb5_obs3_a8_500 \
  --run-name "$RUN_NAME" \
  --description "resume LeLaN 5RGB obs3 a8" \
  --headless \
  --show-progress \
  --set resume_from_latest=true \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full"
```

### audit-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate lelan_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_lelan_rgb5_obs3_a8_500"

python scripts/run_lelan_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/$RUN_NAME \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless \
  --show-progress
```

### 本地单 ckpt 评估

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_lelan_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_lelan_rgb5_obs3_a8_500/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --prefer-ema \
  --device cuda
```

### 本地 all ckpt 评估

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_lelan_all_checkpoints.py \
  --ckpt-epochs-dir ckpt/unplug_charger_lelan_rgb5_obs3_a8_500/epochs \
  --results-json ckpt/unplug_charger_lelan_rgb5_obs3_a8_500/eval_results/all_ckpts.json \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --prefer-ema \
  --device cuda
```

## 从零训练

### 从0开始跑5RGB-MDIT（5RGB + 每相机独立 encoder + 全量训练）：

```

开启tmux:

tmux new -s mdit_rgb5_sep_all
tmux kill-session -t mdit_rgb5_sep_all && tmux new -s mdit_rgb5_sep_all



开始训练：

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

断点续训：

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
  --show-progress \
  --no-prefer-ema
```

### 寝室本地离线测评：

```
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_all_checkpoints.py \
  --ckpt-epochs-dir ckpt/unplug_charger_mdit_rgb5_sep_all_500/epochs \
  --results-json ckpt/unplug_charger_mdit_rgb5_sep_all_500/eval_results/all_ckpts__n_action_steps_8.json \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda \
  --set n_action_steps=16 \
  --set smooth_actions=true \
  --set command_mode="first" \
  --set position_alpha=0.35 \
  --set rotation_alpha=0.25 \
  --set max_position_step=0.03 \
  --set gripper_open_threshold=0.6 \
  --set gripper_close_threshold=0.4


开仿真界面，可视化看 1 个 episode：
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

QT_QPA_PLATFORM=xcb python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_sep_all_500/epochs/epoch_0300.pt \
  --episodes 1 \
  --max-steps 200 \
  --seed 1234 \
  --no-headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda \
  --set n_action_steps=16 \
  --set smooth_actions=true \
  --set command_mode="first" \
  --set position_alpha=0.35 \
  --set rotation_alpha=0.25 \
  --set max_position_step=0.03 \
  --set gripper_open_threshold=0.6 \
  --set gripper_close_threshold=0.4

单个 ckpt 做 100 个 episode 评估：
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_sep_all_500/epochs/epoch_0300.pt \
  --episodes 100 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda \
  --set n_action_steps=16 \
  --set smooth_actions=true \
  --set command_mode="first" \
  --set position_alpha=0.35 \
  --set rotation_alpha=0.25 \
  --set max_position_step=0.03 \
  --set gripper_open_threshold=0.6 \
  --set gripper_close_threshold=0.4

```

## AutoDL远程训练指令

### 云端训练：全量微调 5 独立 ViT，带 100epoch success eval

```
tmux new -s mdit_rgb5_sep_all

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_all_500"

/home/gjw/.conda/envs/mdit_env/bin/python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_all_500 \
  --run-name "$RUN_NAME" \
  --description "5RGB separate encoders all finetune 500ep with success gate" \
  --headless \
  --show-progress \
  --set batch_size=8 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode="all" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set observation_encoder.vision.resize_shape=[240,240] \
  --set n_action_steps=8 \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set resume_from_latest=false \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full"


云端断点续训
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_all_500"

/home/gjw/.conda/envs/mdit_env/bin/python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_all_500 \
  --run-name "$RUN_NAME" \
  --description "resume 5RGB separate encoders all finetune" \
  --headless \
  --show-progress \
  --set batch_size=8 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode="all" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set observation_encoder.vision.resize_shape=[240,240] \
  --set n_action_steps=8 \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full" \
  --set resume_from_latest=true

tmux 脱离 / 重连
Ctrl-b d
tmux attach -t mdit_rgb5_sep_all

云端 audit-only
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

单独测一个 ckpt
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_all_500"

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/$RUN_NAME/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --heartbeat-every 50 \
  --headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda


寝室本地批量测评
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_all_checkpoints.py \
  --ckpt-epochs-dir ckpt/unplug_charger_mdit_rgb5_sep_all_500/epochs \
  --results-json ckpt/unplug_charger_mdit_rgb5_sep_all_500/eval_results/all_ckpts__n_action_steps_8.json \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda

开仿真界面看 1 个 episode
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

QT_QPA_PLATFORM=xcb python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_sep_all_500/epochs/epoch_0300.pt \
  --episodes 1 \
  --max-steps 200 \
  --seed 1234 \
  --no-headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda

单个 ckpt 做 100 episode 评估
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_sep_all_500/epochs/epoch_0300.pt \
  --episodes 100 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda

如果你要评估的是“旧的 n_action_steps=1 老 ckpt”，那就在评估命令后面补这一段 override：
  --set n_action_steps=8 \
  --set smooth_actions=true \
  --set command_mode="first" \
  --set position_alpha=0.35 \
  --set rotation_alpha=0.25 \
  --set max_position_step=0.03 \
  --set gripper_open_threshold=0.6 \
  --set gripper_close_threshold=0.4

```

### 云端训练：Last block微调 5RGB + obs3 + separate encoder + last_block + n_action_steps=8

```

tmux new -s mdit_rgb5_sep_last

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_last_a8_500"

/home/gjw/.conda/envs/mdit_env/bin/python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_last_a8_500 \
  --run-name "$RUN_NAME" \
  --description "5RGB separate encoders last_block finetune a8 500ep" \
  --headless \
  --show-progress \
  --set batch_size=8 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode="last_block" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set observation_encoder.vision.resize_shape=[240,240] \
  --set n_action_steps=8 \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set resume_from_latest=false \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full"

云端断点续训
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_last_a8_500"

/home/gjw/.conda/envs/mdit_env/bin/python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name obs3_rgb5_sep_last_a8_500 \
  --run-name "$RUN_NAME" \
  --description "resume 5RGB separate encoders last_block finetune a8" \
  --headless \
  --show-progress \
  --set batch_size=8 \
  --set num_workers=8 \
  --set grad_accum_steps=1 \
  --set observation_encoder.vision.use_separate_encoder_per_camera=true \
  --set observation_encoder.vision.train_mode="last_block" \
  --set observation_encoder.vision.lr_multiplier=0.1 \
  --set observation_encoder.vision.resize_shape=[240,240] \
  --set n_action_steps=8 \
  --set objective.sigma_min=0.001 \
  --set objective.num_integration_steps=25 \
  --set enable_success_rate_eval=true \
  --set success_selection_every_epochs=100 \
  --set success_selection_episodes=20 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode="full" \
  --set resume_from_latest=true


audit-only
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_last_a8_500"

python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/$RUN_NAME \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress

单个 ckpt 评估
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_sep_last_a8_500/epochs/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --heartbeat-every 50 \
  --headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda

本地批量评估
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_all_checkpoints.py \
  --ckpt-epochs-dir ckpt/unplug_charger_mdit_rgb5_sep_last_a8_500/epochs \
  --results-json ckpt/unplug_charger_mdit_rgb5_sep_last_a8_500/eval_results/all_ckpts__n_action_steps_8.json \
  --episodes 20 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda

本地开界面看 1 个 episode
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

QT_QPA_PLATFORM=xcb python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_sep_last_a8_500/epochs/epoch_0300.pt \
  --episodes 1 \
  --max-steps 200 \
  --seed 1234 \
  --no-headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda


本地单个 ckpt，100 episode
source ~/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/unplug_charger_mdit_rgb5_sep_last_a8_500/epochs/epoch_0300.pt \
  --episodes 100 \
  --max-steps 200 \
  --seed 1234 \
  --headless \
  --show-progress \
  --no-prefer-ema \
  --device cuda

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
  --line pdit \
  --ckpt-path ckpt/<run_name>/best_success.pt \
  --episodes 50 \
  --max-steps 200 \
  --headless
```

## 单次 rollout / 录视频

```bash
python scripts/record_rollout_videos.py \
  --line pdit \
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
  --line pdit \
  --ckpt-path ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/best_success.pt \
  --episodes 20 \
  --headless
```

```bash
python scripts/eval_checkpoint.py \
  --line pdit \
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
