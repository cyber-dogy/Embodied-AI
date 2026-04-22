# LIBERO Workspace

这个目录是你在 `autodl_unplug_charger_transformer_fm` 里做 `LIBERO / VLA / WM` 的统一工作区。

你现在最需要建立的，不是“再找一个新 benchmark”，而是把下面这条链打顺：

1. 看懂 `LIBERO` 的原始数据格式
2. 做出稳定的 `train / val` 切分
3. 把原始数据转成 `VLA` 和 `WM` 各自吃得下的格式
4. 训练
5. 在仿真里统一验证
6. 自动输出 `json + mp4 + action_trace.npz`

## 目录说明

- `headless_tools/`
  - 纯仿真验证、headless 渲染、rollout 回放、4070 兼容配置
- `scripts/`
  - 看原始 `hdf5` 结构、生成 `train / val` manifest
- `../notebooks/libero/`
  - 学习和操作入口 notebook

## 你要先理解的 3 层数据格式

### 1. LIBERO 原始格式

这是 benchmark 官方的单任务 `hdf5`：

- 一个任务一个 `xxx_demo.hdf5`
- 里面通常有 `data/demo_0`, `data/demo_1`, ...
- 每个 episode 下面常见字段：
  - `states`
  - `actions`
  - `obs/...`
  - `rewards`
  - `dones`

这层最适合：

- 看任务长度
- 看动作维度
- 看 observation 命名
- 做 train / val 切分

### 2. VLA 训练格式

`VLA` 训练真正关心的是 step-level 对齐样本：

- `image(s)`
- `language_instruction`
- `robot_state / proprio`
- `action`

在你这台机器上的两条主路是：

- `OpenVLA-OFT`：偏 `RLDS`
- `pi0 / SmolVLA / LingBot post-train`：更偏 `LeRobot`

所以你做 `VLA` 时，不建议直接让训练脚本读原始 `hdf5`，而应该：

1. 先从原始 `hdf5` 做出 `train / val manifest`
2. 再转成 `RLDS` 或 `LeRobot`

### 3. WM 训练格式

`WM` 比 `VLA` 更像“动作条件下的视频 / latent 序列建模”。

对你最有帮助的现成路线是：

- 原始 `LIBERO hdf5`
- 转成 `LeRobot`
- 再抽 `video latents`
- 用 `LingBot-VA` 的 `MultiLatentLeRobotDataset` 训练

所以 `WM` 这条线里，关键不是原始图像本身，而是：

- episode 序列
- action 对齐
- latent 序列

## 第一步：验证仿真环境

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/validate_libero_smoke.py --suite libero_spatial --task-id 0 --steps 1'
```

## 第二步：下载 demo 数据

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/download_libero_datasets.sh libero_spatial'
```

默认下载位置：

- `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/data/libero_datasets`

## 第三步：看懂原始 hdf5

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && DEMO_FILE=$(find /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/data/libero_datasets -name "*.hdf5" | head -n 1) && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/scripts/inspect_libero_dataset.py --demo-file "$DEMO_FILE" --episode 0'
```

这一步你重点看：

- `states.shape`
- `actions.shape`
- `obs` 下面有哪些相机和状态字段
- 一个 episode 有多少步

## 第四步：创建 train / val 切分

推荐先用 manifest，而不是复制文件。

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && DEMO_FILE=$(find /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/data/libero_datasets -name "*.hdf5" | head -n 1) && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/scripts/create_libero_split_manifest.py --demo-file "$DEMO_FILE" --train-ratio 0.9 --seed 7 --out /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/manifests/libero_single_task_split.json'
```

生成结果里会有：

- `train_episodes`
- `val_episodes`
- `num_train`
- `num_val`

## 第五步：VLA 训练路线

### 路线 A：OpenVLA-OFT

适合你做：

- 多模态融合
- 因果特征解耦后的 action policy
- 统一 benchmark 成绩展示

推荐流程：

1. 用官方 `hdf5`
2. 按 `manifest` 切 train / val
3. 转 `RLDS`
4. 用 `vla-scripts/finetune.py` 训练
5. 用 `run_libero_eval.py` 评测并自动导出 `mp4 + npz`

你本机上的相关路径：

- 数据转 `RLDS`：`/home/gjw/MyProjects/RoboTwin/policy/openvla-oft/rlds_dataset_builder`
- 训练入口：`/home/gjw/MyProjects/RoboTwin/policy/openvla-oft/vla-scripts/finetune.py`
- 评测入口：`/home/gjw/MyProjects/RoboTwin/policy/openvla-oft/experiments/robot/libero/run_libero_eval.py`

### 路线 B：LeRobot / pi0 / 你自己的轻量 VLA

适合你做：

- 快速验证新数据接口
- 先跑通单任务 VLA baseline

你本机上的参考转换脚本：

- `/home/gjw/MyProjects/RoboTwin/policy/pi0/examples/libero/convert_libero_data_to_lerobot.py`

如果你想先把自己的方法挂到 `LIBERO` 上，这条线通常会更快。

## 第六步：WM 训练路线

推荐你先用 `LingBot-VA` 跑通一版，因为它已经有：

- `LIBERO` 评测 client
- `LeRobot latent dataset` 训练代码
- `LIBERO` 训练 config

你本机上的关键入口：

- 训练 config：`/home/gjw/MyProjects/lingbot-va/wan_va/configs/va_libero_train_cfg.py`
- 训练入口：`/home/gjw/MyProjects/lingbot-va/wan_va/train.py`
- 启动脚本：`/home/gjw/MyProjects/lingbot-va/script/run_va_posttrain.sh`
- LIBERO 评测 client：`/home/gjw/MyProjects/lingbot-va/evaluation/libero/client.py`

推荐流程：

1. 原始 `LIBERO hdf5`
2. 转成 `LeRobot`
3. 提取 `video latents`
4. 训练 `LingBot-VA`
5. 跑 `LIBERO` client 评测
6. 自动拿到 `mp4 + action_trace.npz`

## 第七步：怎么接你的研究方法

### 你的 VLA 方法

你自己的方法至少要对齐下面这个 sample：

- `images`
- `language_instruction`
- `robot_state`
- `action`

如果你做“多模态融合 / 因果解耦 / 域迁移”，建议优先把实验设计写成：

- baseline VLA
- + multimodal fusion
- + disentangled causal tokens
- + domain adaptation
- + explainability / intervention

### 你的 WM 方法

你自己的方法至少要对齐下面这个 sample：

- `video latent chunk`
- `action chunk`
- `language`
- `optional proprio`

然后把研究问题落到：

- latent disentanglement
- counterfactual rollout
- domain-invariant dynamics
- causal controllability

## 验证效果怎么输出

你现在已经有统一 headless 输出链：

- 原始环境渲染：`headless_tools/render_libero_headless_demo.py`
- 官方 demo 回放：`headless_tools/record_libero_rollout.py --source demo_states`
- 模型 action 回放：`headless_tools/record_libero_rollout.py --source action_trace`

而且：

- `OpenVLA-OFT` 评测会自动输出 `action_trace.npz + mp4`
- `LingBot-VA` 评测也会自动输出 `action_trace.npz + mp4`

这意味着你做论文 / 求职 demo 时，已经可以把：

- 成功率
- counterfactual 行为变化
- rollout 视频
- action trace

统一收口。

## 建议你接下来的顺序

1. 先跑 notebook，看懂 `LIBERO` 原始数据和切分方式
2. 先做一个单任务 `VLA` baseline
3. 再把你的 `WM` 路线接到同一个 task 上
4. 最后再做跨 task / 跨 suite 的迁移和可解释性
