# 代码结构说明

这份文档回答五个问题：

1. 现在仓库为什么是双线结构？
2. `pdit/` 和 `mdit/` 分别负责什么？
3. 当前正式入口在哪里？
4. 如果我要替换 encoder / backbone / modality / policy / transformer，应该改哪里？
5. notebook 和脚本在现在的结构里分别负责什么？

> 说明
> 当前仓库已经不是旧的单线结构，而是双线并列：
> `pdit/` 是当前已验证最强的点云主线，`mdit/` 是 faithful MDIT 独立研究线。
> 详细说明请以 [code-structure.md](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/code-structure.md) 为准。

## 1. 正式主链路

训练主链路：

```text
scripts/run_autoresearch_trial.py
  -> cli/run_autoresearch_trial.py
  -> research/trial_runner.py
  -> train/runner.py
  -> train/builders.py
  -> data/registry.py + model/registry.py + policy/registry.py
  -> checkpoint / summary / periodic ckpt
```

离线 audit 主链路：

```text
scripts/run_autoresearch_trial.py --phase audit-only
  -> cli/run_autoresearch_trial.py
  -> research/trial_runner.py
  -> scripts/eval_all_checkpoints.py
  -> cli/eval_all_checkpoints.py
  -> train/eval.py
```

单个 ckpt 评估：

```text
scripts/eval_checkpoint.py
  -> cli/eval_checkpoint.py
  -> train/eval.py
```

单次 rollout / 录视频：

```text
scripts/record_rollout_videos.py
  -> cli/record_rollout_videos.py
  -> train/eval.py + envs/rlbench_env.py
```

notebook 主链路：

```text
notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb
  -> 只拼命令和配置 override
  -> 调 scripts/run_autoresearch_trial.py
  -> 调 scripts/eval_checkpoint.py / scripts/record_rollout_videos.py
  -> 读 summary.json / audit_report.json / manifest
```

## 2. 当前 source of truth

正式源码主链已经迁移到仓库根目录一级模块。

### `config/`

- `schema.py`
  - 定义 `ExperimentConfig`
- `loader.py`
  - 负责 flat JSON 和模块化 experiment config 的组合加载
- 想加配置字段，先改这里

### `model/`

- `encoders/`
  - 观测编码器唯一替换点
  - 当前正式实现是 `encoders/pointnet/`
  - `encoders/dummy.py` 用于 replaceability smoke test
- `backbones/`
  - 轨迹主干网络唯一替换点
  - 当前正式实现是 `backbones/dit.py`
- `heads/`
  - 输出头
- `registry.py`
  - 根据配置实例化 `encoder/backbone`

### `policy/`

- 只放策略定义
- 当前正式策略是 `fm_policy.py`
- `diffusion_policy.py` 仍保留作对照
- `registry.py`
  - 根据 `strategy` 构建 policy

### `data/`

- `modalities/`
  - 模态相关数据逻辑唯一替换点
  - 当前正式实现是 `modalities/pcd.py`
  - `modalities/dummy.py` 用于训练链路 smoke test
  - `modalities/rgb.py` 是明确的预留入口，目前不会静默 fallback 到 `pcd`
- `replay_buffer.py`
  - 数据存储入口
- `sequence_sampler.py`
  - 时序切片采样
- `registry.py`
  - 根据 `obs_mode` 选择数据入口

### `train/`

- `builders.py`
  - 把 `config / data / model / policy` 连起来
- `runner.py`
  - 训练循环
- `eval.py`
  - loader 验证和 RLBench rollout success 评估
- `action_postprocess.py`
  - 命令选择与平滑
- `checkpoints.py`
  - EMA / atomic save / resume / wandb

### `envs/`

- 环境封装
- 当前正式实现是 `rlbench_env.py`

### `common/`

- 运行时路径、随机种子、SE(3)、FM timestep、点云工具等通用逻辑

### `research/`

- `train-only / audit-only / full` 试验编排
- trial manifest、audit 报告、collapse 判定

### `cli/`

- 稳定的命令行实现
- 负责在入口处固定当前仓库的根目录模块解析，避免串到同工作区的其他项目

## 3. 可替换点

### 想换 encoder

- 改 [model/encoders](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/model/encoders)
- 在 [model/registry.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/model/registry.py) 注册新 encoder
- 在实验配置里改 `encoder_name`

### 想换 backbone

- 改 [model/backbones](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/model/backbones)
- 在 [model/registry.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/model/registry.py) 注册新 backbone
- 在实验配置里改 `backbone_name`

### 想换策略

- 改 [policy](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/policy)
- 在 [policy/registry.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/policy/registry.py) 注册
- notebook / CLI 用 `--strategy`

### 想换 `pcd -> rgb`

- 在 [data/modalities](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/data/modalities) 增加真实 `rgb.py`
- 增加对应 encoder
- 在 [data/registry.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/data/registry.py) 和 [model/registry.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/model/registry.py) 注册
- 在实验配置里切换 `obs_mode` 和 `encoder_name`
- 训练主流程不需要重写

## 4. 配置结构

根目录 `configs/` 分成：

```text
configs/
├── data/
├── model/
├── policy/
├── train/
├── eval/
├── experiment/
└── fm_autodl_lab.json
```

使用方式：

- 平时直接用 `configs/fm_autodl_lab.json`
- 它会 `extends -> experiment/fm_autodl_lab.json`
- experiment config 再组合 `data / model / policy / train / eval`

所以 notebook 和 CLI 以后只需要切 experiment 或少量 `--set` override。

## 5. notebook 的定位

`notebooks/` 必须保留，而且它不是附属说明文件。

它的正式职责是：

- 做实验参数总控
- 选择配置与模块组合
- 调训练命令
- 调 audit 命令
- 调单 ckpt rollout / 录视频命令
- 查看结果 JSON

它不再承担：

- 模型实现
- 数据 pipeline 实现
- 长段训练循环
- 和正式 `.py` 脚本重复维护的逻辑

## 6. 历史目录怎么理解

历史 `src` 结构和旧版 `lib/` 都已经退出正式主链。

- 旧 `src layout` 快照保存在：
  - [archive/legacy_code/src_layout_snapshot](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/legacy_code/src_layout_snapshot)
- 旧 `lib/` 代码保存在：
  - [archive/legacy_code/lib](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/archive/legacy_code/lib)

这些目录只用于保留研究历史，不再作为当前开发入口。
