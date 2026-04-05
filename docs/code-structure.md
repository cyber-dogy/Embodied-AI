# 代码结构说明

这份文档用于回答两个问题：
1. 这个仓库现在的主流程从哪里进入？
2. 如果我要改某一部分逻辑，应该改哪个 `.py`？

## 1. 主流程总览

训练主链路：

```text
scripts/train.py
  -> autodl_unplug_charger_transformer_fm.cli.train
  -> load_config(...)
  -> train_experiment(...)
  -> training/builders.py 构建 dataset / model / optimizer
  -> training/runner.py 执行训练循环
  -> training/checkpoints.py 保存 latest / best / periodic checkpoint
  -> training/eval.py 做训练中验证与可选成功率评估
```

评估主链路：

```text
scripts/eval_checkpoint.py
  -> cli/eval_checkpoint.py
  -> 从 checkpoint 读取 payload["cfg"]
  -> payload_cfg_to_experiment_cfg(...)
  -> load_model_for_eval(...)
  -> run_success_rate_eval(...)
```

notebook 主链路：

```text
notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb
  -> 拼训练命令
  -> 调用 scripts/train.py
  -> 读取 ckpt/<run_name>/summary.json
  -> 可选调用 scripts/eval_all_checkpoints.py
```

## 2. 顶层目录怎么理解

### `src/autodl_unplug_charger_transformer_fm/`
正式代码入口。现在新增功能或修 bug，优先改这里。

### `scripts/`
仓库根目录下的薄封装脚本。它们只负责把命令转发到 `src/.../cli/`，方便你继续用熟悉的 `python scripts/*.py` 工作流。

### `configs/`
训练配置 JSON。当前默认预设是 `configs/fm_autodl_lab.json`。

### `notebooks/`
保留的实验 notebook。这里不再保存训练核心实现，而是保留参数、命令和结果查看逻辑。

### `archive/`
历史 notebook、旧说明、`.bak` 代码备份的归档区，不参与主流程。

### `lib/`
历史迁移参考。当前正式流程已经切到 `src/`，不要继续把新逻辑加回 `lib/`。

## 3. 每个核心模块负责什么

### `config.py`
- 定义 `ExperimentConfig`
- 负责配置加载、保存、路径规范化
- 如果你要增加新的训练参数，优先改这里

### `cli/train.py`
- 训练命令行入口
- 负责读取 `--config` 和少量高频 override
- 不放训练逻辑本体

### `cli/eval_checkpoint.py`
- 单 checkpoint 成功率评估入口
- 适合快速验证一个模型权重

### `cli/eval_all_checkpoints.py`
- 批量遍历 `epochs/*.pt`
- 带评估缓存与成功率曲线图输出

### `cli/record_rollout_videos.py`
- 录制模拟器 RGB 视频和点云视频
- 常用于结果展示和误差分析

### `training/builders.py`
- 构建 dataset / dataloader
- 构建 obs encoder / backbone / policy
- 构建 optimizer / scheduler / AMP 相关工具
- 如果你想替换 backbone、换 policy 类型，通常从这里接入

### `training/checkpoints.py`
- EMA 模型维护
- checkpoint payload 组织
- latest / best / periodic checkpoint 的保存与恢复
- wandb run 初始化与结束

### `training/eval.py`
- loader 上的验证指标
- RLBench success rate 评估
- 预测动作后处理（例如选择 horizon、动作平滑）
- checkpoint 权重加载为可评估模型

### `training/runner.py`
- 真正的训练循环
- loss 反传、梯度累计、scheduler step、checkpoint 保存、训练摘要输出
- 如果你想改 epoch 级流程、日志时机、训练后 summary，改这里

### `models/pointnet_tokens.py`
- 点云观测编码器
- PointNet 提取点云特征，再拼接 robot state 形成观测 token
- 如果你想换 observation encoder，先看这里

### `models/dit_backbone.py`
- 轨迹 backbone
- 当前实现是 DiT 风格 backbone
- 如果你想改 transformer 结构、AdaLN 调制、时间嵌入，改这里

### `policies/fm_policy.py`
- Flow Matching 策略
- 定义训练损失和推理轨迹积分流程

### `policies/diffusion_policy.py`
- Diffusion 策略
- 定义扩散训练与采样逻辑

### `data/dataset_pcd.py`
- 训练数据集入口
- 从 replay buffer 中采样连续观察与预测片段
- 做点云增强和状态配套变换

### `data/replay_buffer.py` / `dp_replay_buffer.py` / `dp_sampler.py`
- 底层 replay buffer 和序列采样逻辑
- 这部分通常在“换数据格式”时才需要动

### `env/rlbench_env.py`
- RLBench / PyRep 环境封装
- 负责 reset、step、观测提取、点云生成、错误处理
- 如果你想改评估行为、环境观测或动作执行方式，改这里

### `utils/`
- `common.py`：项目根路径、默认 device、随机种子
- `se3_utils.py`：位姿、rot6d、随机轨迹等几何工具
- `o3d_utils.py`：点云处理
- `fm_utils.py`：Flow Matching 的 timestep 相关工具
- `task_text.py`：任务文本说明
- `dp_pytorch_util.py` / `visualization.py`：辅助工具

## 4. 常见修改场景应该改哪里

想改训练超参数默认值：
- 改 `configs/fm_autodl_lab.json`

想加一个新的配置字段：
- 先改 `config.py`
- 再根据用途改 `training/builders.py` 或 `training/runner.py`
- 最后如果需要命令行覆盖，再改 `cli/train.py`

想换 observation encoder：
- 改 `models/pointnet_tokens.py`
- 如果构造参数变化，再改 `training/builders.py`

想换 backbone：
- 改 `models/dit_backbone.py`
- 如果入口构建变了，再改 `training/builders.py`

想加一种新策略：
- 新增 `policies/<your_policy>.py`
- 在 `training/builders.py` 的 `build_policy()` 中注册
- 如需 notebook/CLI 使用，再补 `--strategy`

想改训练循环或 checkpoint 逻辑：
- 主体在 `training/runner.py`
- checkpoint 结构在 `training/checkpoints.py`

想改 RLBench 评估行为：
- success rate 流程在 `training/eval.py`
- 环境细节在 `env/rlbench_env.py`

## 5. Notebook 应该承担什么

现在 notebook 的定位是：
- 学习当前项目怎么用
- 保留实验参数和命令
- 快速查看训练输出和评估结果

现在 notebook 不应该继续承担：
- 大段训练主逻辑
- 模型定义
- 数据 pipeline 核心实现
- 与正式脚本重复维护的代码

## 6. 迁移说明

本次整理后，`src/` 已经是主代码目录，但 `lib/` 仍然保留为历史迁移参考，主要是为了不直接抹掉已有实验痕迹和工作区改动。

如果后续你确认新结构长期稳定，再做下一步也会很自然：
- 删除或彻底归档 `lib/`
- 为不同实验补更多 `configs/*.json`
- 给 `tests/` 增加最基础的 smoke tests
