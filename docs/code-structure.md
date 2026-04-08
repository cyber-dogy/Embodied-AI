# 代码结构说明

这份文档回答三个问题：
1. 现在项目的正式主链路从哪里进入？
2. 如果我要替换某个模块，应该改哪里？
3. notebook 和 `.py` 脚本在现在的结构里各自负责什么？

## 1. 主流程

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

notebook 主链路：

```text
notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb
  -> 只拼命令和配置 override
  -> 调用 scripts/run_autoresearch_trial.py
  -> 调用 scripts/eval_checkpoint.py / scripts/record_rollout_videos.py
  -> 读取 summary.json / audit_report.json / manifest
```

## 2. 当前 source of truth

### `src/autodl_unplug_charger_transformer_fm/config/`
- `schema.py`
  - 定义 `ExperimentConfig`
- `loader.py`
  - 负责 flat JSON 和模块化 experiment config 的组合加载
- 如果你想加新的配置字段，先改这里

### `src/autodl_unplug_charger_transformer_fm/model/`
- `encoders/`
  - 观测编码器
  - 当前正式实现是 `encoders/pointnet/`
  - `encoders/dummy.py` 用于 replaceability smoke test
- `backbones/`
  - 轨迹主干网络
  - 当前正式实现是 `backbones/dit.py`
- `heads/`
  - 输出头
- `registry.py`
  - 根据配置实例化 `encoder/backbone`

### `src/autodl_unplug_charger_transformer_fm/policy/`
- 只放策略定义
- 当前正式策略是 `fm_policy.py`
- `diffusion_policy.py` 仍保留作对照
- `registry.py`
  - 根据 `strategy` 构建 policy

### `src/autodl_unplug_charger_transformer_fm/data/`
- `modalities/`
  - 模态相关数据逻辑
  - 当前正式实现是 `modalities/pcd.py`
  - `modalities/dummy.py` 用于快速验证换模态后训练主链是否还能跑通
  - 将来如果换 `rgb`，优先在这里新增 `rgb.py`
  - 当前 `modalities/rgb.py` 是明确的保留入口，尚未接入真实 RGB pipeline
- `replay_buffer.py`
  - 数据存储入口
- `sequence_sampler.py`
  - 时序切片采样
- `registry.py`
  - 根据 `obs_mode` 选择数据入口

### `src/autodl_unplug_charger_transformer_fm/train/`
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

### `src/autodl_unplug_charger_transformer_fm/envs/`
- 环境封装
- 当前正式实现是 `rlbench_env.py`

### `src/autodl_unplug_charger_transformer_fm/common/`
- 运行时路径、随机种子、SE(3)、FM timestep、点云工具等

### `src/autodl_unplug_charger_transformer_fm/research/`
- `train-only / audit-only / full` 试验编排
- manifest、audit 报告、collapse 判定

## 3. 可替换点

### 想换 encoder
- 改 `src/.../model/encoders/`
- 在 `model/registry.py` 里注册新 encoder
- 在实验配置里改 `encoder_name`

### 想换 backbone
- 改 `src/.../model/backbones/`
- 在 `model/registry.py` 里注册新 backbone
- 在实验配置里改 `backbone_name`

### 想换策略
- 改 `src/.../policy/`
- 在 `policy/registry.py` 里注册
- notebook/CLI 用 `--strategy`

### 想换 `pcd -> rgb`
- 在 `src/.../data/modalities/` 增加 `rgb.py`
- 增加对应 encoder
- 在 `data/registry.py` 和 `model/registry.py` 注册
- 在实验配置里切换 `obs_mode` 和 `encoder_name`
- 训练主流程不需要重写

## 4. 配置结构

根目录 `configs/` 现在分成：

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

这意味着 notebook 和 CLI 以后只需要切 experiment 或少量 `--set` override。

## 5. notebook 的定位

`notebooks/` 必须保留，而且它不是附属说明文件。

它的正式职责是：
- 做实验参数总控
- 选择配置与模块组合
- 调训练命令
- 调 audit 命令
- 调单 ckpt rollout/录视频命令
- 查看结果 JSON

它不再承担：
- 模型实现
- 数据 pipeline 实现
- 长段训练循环
- 和正式 `.py` 脚本重复维护的逻辑

## 6. 旧目录怎么理解

这些目录现在仍存在，但已经不是 source of truth：
- `src/.../models`
- `src/.../policies`
- `src/.../training`
- `src/.../env`
- `src/.../utils`

它们目前只保留轻量过渡入口，方便老路径不立刻炸掉；后续如果确认新结构稳定，可以进一步删掉。
