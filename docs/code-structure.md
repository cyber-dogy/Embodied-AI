# 代码结构说明

这份文档回答五个问题：

1. 现在仓库为什么是双线结构？
2. `pdit/` 和 `mdit/` 分别负责什么？
3. 当前正式入口在哪里？
4. 以后如果要替换 encoder / backbone / modality / transformer，应该改哪里？
5. notebook 和脚本在现在的结构里分别负责什么？

## 1. 双线结构的原因

当前仓库不再假设“只有一条训练主线”。

现在有两条并列研究线：

- `pdit/`
  - 当前已验证稳定、已知最强的点云主线
  - 核心是 `point cloud + FM + DiT-style backbone`
- `mdit/`
  - 独立的 faithful MDIT 研究线
  - 核心是 `RGB + text + MultiTask DiT`

这两条线共享：

- `common/`
- `envs/`
- `research/`
- `scripts/`
- `configs/`
- `docs/`
- `notebooks/`

但它们**不共享模型接口假设**。这点是刻意设计的，目的是保证：

- `pdit` 可以继续作为稳定对照组
- `mdit` 可以忠实尝试参考实现，不需要被迫适配 `pdit` 的 token contract

## 2. 正式主链路

### PDIT

训练主链路：

```text
scripts/train_pdit.py
  -> pdit/cli/train.py
  -> pdit/train/runner.py
  -> pdit/train/builders.py
  -> pdit/data/* + pdit/model/* + pdit/policy/*
```

autoresearch / audit 主链路：

```text
scripts/run_autoresearch_trial.py --line pdit ...
  -> pdit/cli/run_autoresearch_trial.py
  -> research/trial_runner.py
  -> pdit/train/runner.py
  -> scripts/eval_pdit_all_checkpoints.py
```

### MDIT

训练主链路：

```text
scripts/train_mdit.py
  -> mdit/cli/train.py
  -> mdit/train/runner.py
  -> mdit/train/builders.py
  -> mdit/data/* + mdit/model/*
```

autoresearch / audit 主链路：

```text
scripts/run_mdit_autoresearch_trial.py
  -> mdit/cli/run_autoresearch_trial.py
  -> research/mdit_trial_runner.py
  -> mdit/train/runner.py
  -> scripts/eval_mdit_all_checkpoints.py
```

### 通用脚本

保留了一组通用脚本：

- `scripts/train.py`
- `scripts/eval_checkpoint.py`
- `scripts/eval_all_checkpoints.py`
- `scripts/run_autoresearch_trial.py`
- `scripts/record_rollout_videos.py`

这些脚本现在**必须显式指定**：

```bash
--line pdit
```

或：

```bash
--line mdit
```

它们不再静默默认到 `pdit`。

## 3. source of truth

### `pdit/`

- `pdit/config/`
  - `ExperimentConfig`、配置加载、实验组合
- `pdit/model/`
  - `encoders/`
  - `backbones/`
  - `heads/`
  - `registry.py`
- `pdit/policy/`
  - `fm_policy.py`
  - `diffusion_policy.py`
  - `registry.py`
- `pdit/data/`
  - `modalities/pcd.py`
  - `modalities/rgb.py` 预留
  - `registry.py`
- `pdit/train/`
  - `builders.py`
  - `runner.py`
  - `eval.py`
  - `checkpoints.py`
  - `action_postprocess.py`
- `pdit/cli/`
  - 线路专属 CLI

### `mdit/`

- `mdit/config/`
  - faithful MDIT 配置 schema / loader
- `mdit/model/`
  - `observation_encoder.py`
  - `transformer.py`
  - `objectives.py`
  - `model.py`
- `mdit/data/`
  - RLBench zarr -> faithful MDIT batch contract
  - dataset stats
- `mdit/train/`
  - builders / runner / eval / checkpoints
- `mdit/cli/`
  - 线路专属 CLI

### 共享层

- `common/`
  - runtime、路径、随机种子、SE(3)、task text 等
- `envs/`
  - RLBench 环境封装
- `research/`
  - `pdit` 和 `mdit` 的 trial orchestration

### 不是源码包的目录

- 根目录 `data/`
  - 这是数据集目录，不是代码包
- `ckpt/`
  - 本地权重和运行结果
- `archive/`
  - 旧代码和研究结果归档

## 4. 可替换点

### 想改 PDIT encoder

- 改 `pdit/model/encoders/`
- 在 `pdit/model/registry.py` 注册
- 在 `configs/` 里切 `encoder_name`

### 想改 PDIT backbone

- 改 `pdit/model/backbones/`
- 在 `pdit/model/registry.py` 注册
- 在配置里切 `backbone_name`

### 想改 PDIT 模态

- 改 `pdit/data/modalities/`
- 在 `pdit/data/registry.py` 注册
- 再切 `obs_mode`

### 想改 MDIT vision/text encoder

- 改 `mdit/model/observation_encoder.py`
- 如果要新增 encoder 族，可以拆到 `mdit/model/encoders/`

### 想改 MDIT transformer

- 改 `mdit/model/transformer.py`

### 想改 MDIT objective

- 改 `mdit/model/objectives.py`

### 想改 MDIT 数据契约

- 改 `mdit/data/dataset.py`
- 以及对应 `mdit/train/builders.py`

## 5. notebook 的定位

`notebooks/` 必须保留，而且它是正式实验入口的一部分。

现在的 notebook 只做：

- 选择线路
- 选择配置
- 拼接训练命令
- 拼接 audit 命令
- 拼接单 checkpoint 评估 / rollout 命令
- 查看结果 JSON

它不再做：

- 模型实现
- 数据实现
- 正式训练循环实现
- 线路之间的隐式兼容逻辑

## 6. 当前推荐工作方式

### 用 PDIT 时

- 训练：`scripts/train_pdit.py`
- 审计：`scripts/run_autoresearch_trial.py --line pdit ...`
- 单 ckpt 评估：`scripts/eval_pdit_checkpoint.py`

### 用 MDIT 时

- 训练：`scripts/train_mdit.py`
- 审计：`scripts/run_mdit_autoresearch_trial.py`
- 单 ckpt 评估：`scripts/eval_mdit_checkpoint.py`

### 用通用脚本时

一定要显式写：

```bash
--line pdit
```

或者：

```bash
--line mdit
```

## 7. 历史目录怎么理解

历史 `src/` 和旧 `lib/` 都已经退出当前正式主链。

它们只作为研究历史保留在：

- `archive/legacy_code/`

当前后续开发，请直接以：

- `pdit/`
- `mdit/`
- `common/`
- `envs/`
- `research/`

为准。
