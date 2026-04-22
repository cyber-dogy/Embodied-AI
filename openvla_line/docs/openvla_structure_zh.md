# OpenVLA 结构说明

## 1. 这条线解决的是什么问题

你希望在当前仓库里单独拉出一条 `openvla` 研究线，而且它要满足几个条件：

- 和 `pdit / mdit / lelan` 尽量解耦
- 未来可以整个文件夹单独打包带走
- 直接用 `LIBERO` 数据启动训练
- 不只是摆结构，而是真能自己继续训练和改

因此这里没有直接硬接官方 `OpenVLA 7B` 的整套重量级依赖，而是做了一条 **OpenVLA-style 可训练主线**：

- 保留 VLA 的多模态结构
- 保留语言条件动作预测的接口
- 用轻量 Transformer 骨架把训练链跑通
- 让你后面可以继续替换成更强视觉骨干、动作离散化头、action chunk 等研究点

## 2. 数据输入是什么

当前代码的单步样本长这样：

- 图像输入
  - `obs/agentview_rgb`
  - `obs/eye_in_hand_rgb`
- 语言输入
  - 从 `pick_up_the_black_bowl_on_the_stove_and_place_it_on_the_plate_demo.hdf5`
  - 还原成
  - `pick up the black bowl on the stove and place it on the plate`
- 状态输入
  - 优先 `robot_states`
  - 如果缺失，则退化到 `obs/ee_states + obs/gripper_states + obs/joint_states`
- 监督信号
  - `actions[t]`
  - 当前 `LIBERO spatial` demo 里是 `7D`

对应代码：

- manifest 构建：[openvla_line/data.py](../openvla_line/data.py)
- step-level dataset：[openvla_line/data.py](../openvla_line/data.py)

## 3. 输出是什么

当前实现输出的是单步连续动作：

- `action_pred.shape = [B, 7]`

也就是说，这条线目前是：

- `当前观测 + 当前语言 -> 当前动作`

它不是文本生成式 action token 解码，而是 **连续动作回归版 VLA baseline**。这样做的好处是：

- 能更快自训练
- 依赖更轻
- 更适合你现在先把接口和研究实验打顺

如果你后面要改成更接近官方 OpenVLA 的离散 action token，也很容易：

1. 先在 `data.py` 里做动作离散化
2. 再在 `model.py` 里把回归头换成 token classifier
3. 最后在 `trainer.py` 里把 loss 从 regression 换成 CE

## 4. 方法主结构是什么

当前主结构可以概括成：

1. 双相机图像分别编码成 visual tokens
2. 语言指令编码成 text tokens
3. 机器人状态编码成 proprio token
4. 加一个 learnable action query token
5. 所有 token 进入 Transformer encoder 做融合
6. 用 action query 对应位置的 hidden state 预测最终 action

也就是：

```text
agentview_rgb ----\
                    -> visual tokens --\
eye_in_hand_rgb --/                    \
                                         -> multimodal transformer -> action head -> 7D action
language ----------------> text tokens --/
robot state -----------> proprio token -/
learnable action query -----------------/
```

对应代码：

- 视觉 token 化：[openvla_line/model.py](../openvla_line/model.py)
- 多模态融合：[openvla_line/model.py](../openvla_line/model.py)
- 训练闭环：[openvla_line/trainer.py](../openvla_line/trainer.py)

## 5. 创新点整理

严格说，这里更像是你未来研究的“主干母线”，而不是最终论文创新本体。它已经给你预留出的创新落点主要有这几个：

### 创新点 1：双视角视觉 token 融合

不是只吃一个 `agentview`，而是天然预留了：

- `agentview_rgb`
- `eye_in_hand_rgb`

你可以继续往下做：

- camera-specific encoder
- camera routing
- cross-view attention
- hierarchical fusion

### 创新点 2：语言 + 视觉 + proprio 的统一 token 化接口

这里把不同模态都转成 token 再融合，而不是写死成几个向量拼接。这为你后面做这些方向留好了接口：

- 因果 token 拆分
- text-conditioned routing
- modality dropout
- intervention-based interpretability

### 创新点 3：完整可打包的轻量 VLA 训练线

这点更偏工程创新：

- manifest
- tokenizer
- dataset
- model
- trainer
- configs
- notebook

全部都在一个目录里，不依赖原仓库的现有训练框架。你后面把这个文件夹拿出去，也能继续演进。

### 创新点 4：从 raw LIBERO hdf5 直接起训

没有额外要求你先转 RLDS / LeRobot 才能开跑，而是直接基于官方 `hdf5` 搭 step-level 数据管线。这样非常适合作为：

- 新方法第一版 baseline
- 新输入输出接口验证
- 论文前期 ablation 母线

## 6. 关键技术点

### 6.1 manifest 设计

`build_libero_manifest()` 做的不是“复制数据”，而是生成一个轻量切分文件，记录：

- 哪个 demo 文件
- 哪个 episode
- 属于 train 还是 val
- 指令是什么
- 这个 episode 有多少步

这样你就能稳定复现实验切分，而且不会额外拷贝大体积图像数据。

### 6.2 proprio fallback

`LIBERO` 不同任务里最稳定的低维状态通常是 `robot_states`，所以当前优先用它。若某些数据缺失，再回退到：

- `ee_states`
- `gripper_states`
- `joint_states`

这个设计可以让数据接口更稳，不会被单一字段卡死。

### 6.3 归一化

训练前会在 train split 上统计：

- `action_mean/std`
- `state_mean/std`

这样能显著减少不同动作维、状态维的尺度差异，训练更稳。

### 6.4 action query token

这是整条方法里最接近 VLA 感的一个点。我们没有直接把所有 token 池化，而是引入了一个可学习 `action query`：

- 它和图像、文本、状态 token 一起进入 Transformer
- 最终只取它对应位置的 hidden state 去预测 action

这让模型天然具备“用 query 从多模态上下文里读出动作”的结构，非常适合后续改成：

- 多 query action chunk
- autoregressive action tokens
- diffusion / flow matching query heads

## 7. 代码中的细节讲解

### `openvla_line/config.py`

负责三件事：

- 解析 `json` 配置
- 自动找 `LIBERO` 数据目录
- 约定 manifest 和 run 输出默认放哪

你以后换机器时，最先改的通常是这里的数据路径策略。

### `openvla_line/tokenizer.py`

这是一个本地轻量 tokenizer，不依赖额外下载 HuggingFace tokenizer。理由是：

- `LIBERO` 指令本来就比较短
- 当前任务里语言分布很有限
- 你更需要的是训练链稳定，而不是大词表能力

### `openvla_line/data.py`

这里是最关键的一层。

它做了四件核心事：

1. 从 `LIBERO hdf5` 扫出 `train / val manifest`
2. 从文件名恢复 instruction
3. 把 episode 进一步展开成 step-level sample
4. 做图像 resize、状态归一化、动作归一化

如果你后面想做：

- history frames
- action chunk
- 更多 camera
- depth / segmentation / point cloud

优先都改这里。

### `openvla_line/model.py`

重点看三个部件：

- `VisionTokenizer`
  - 把 RGB 图像变成 patch-like tokens
- `text_embedding + proprio_proj`
  - 把语言和状态也统一到同一 hidden 维度
- `OpenVLAStylePolicy`
  - 用 action query 汇总多模态上下文，最后输出动作

### `openvla_line/trainer.py`

这里负责：

- 建 manifest
- 建 tokenizer
- 统计 mean/std
- 跑 train / val
- 保存 `best.pt / last.pt / training_summary.json`

也就是说，只要你能跑通 `scripts/train_openvla.py`，这整条线就已经具备独立训练能力了。

## 8. 你后续最值得继续做的升级

按投入产出比排序，我建议你后面优先做：

1. action chunk 输出
2. 更强的视觉 backbone
3. 文本改成预训练 tokenizer / encoder
4. action 离散化，向真正 OpenVLA 风格靠近
5. 接上 LIBERO 仿真闭环评测

## 9. 当前结论

这条 `openvla_line` 不是“官方 OpenVLA 一比一镜像”，而是更适合你当前研究和自训练节奏的 **可独立打包、可直接训练、可继续演进的 OpenVLA-style 主线骨架**。

如果你的目标是：

- 先把 VLA 主线从零到一搭起来
- 用 LIBERO 直接起训
- 自己继续改模型和创新点

那这条线已经是合适的起点。
