# 2026-04-07 训练与模型审计

> 历史说明
> 这份审计写于仓库仍使用 `src/` 目录布局的阶段。
> 文中对 `src/` 的引用描述的是当时的仓库结构。
> 旧版源码快照现在保存在 `archive/legacy_code/src_layout_snapshot/`。

## 范围

本记录总结了以下当前发现：

- 训练稳定性和检查点行为
- 数据集规模和归一化
- 环境/可复现性风险
- 当前主干网络与官方 DiT 之间的模型结构差异

目标是在开始任何实施工作之前保留具体的变更清单。

## 已确认的发现

### 1. 当前运行早期过拟合

运行：

- `ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1`

从检查点观察到的：

- `best valid loss` 出现在 `epoch 45`
- 从本地 rollout 评估得到的 `best success rate` 出现在 `epoch 100` 或 `200`，均为 `0.55`
- 到 `epoch 1500` 时，`train loss` 仍然更低，但成功率已降至 `0.20`

这不仅仅是"损失有噪声"；而是真实的训练/验证和训练/成功率不匹配。

### 2. `latest.pt` 已损坏

在 `pfp_env` 中确认：

- `best.pt` 可以加载
- `epochs/epoch_1500.pt` 可以加载
- `latest.pt` 加载失败，错误为 `PytorchStreamReader failed locating file data/7`

这意味着检查点写入目前不够可靠。

### 3. 环境不能干净地复现

在 `pfp_env` 中，`autodl_unplug_charger_transformer_fm` 目前作为命名空间包在多个目录中解析，而不是正常的可编辑安装。

观察到的包路径：

- `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm`
- `/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm`

这意味着过去的实验可能运行在混合的代码状态上，而不是严格在当前的 `src/` 目录树上。

### 4. 当前 `src/` 代码中存在真正的导入错误

当前文件：

- `src/autodl_unplug_charger_transformer_fm/models/pointnet.py`

问题：

- 它导入了 `.dp_pytorch_util`
- 该模块不在 `models/` 中；它位于 `utils/` 下

因此当前的 `src/` 包还不是自洽的。

### 5. 数据集规模适中，验证集较小

回放缓冲区统计：

- 训练回合：100
- 训练总步数：10673
- 验证回合：10
- 验证总步数：1199

序列采样器统计：

- 训练窗口：10573
- 验证窗口：1189

由于窗口大量重叠，独立训练示例的有效数量远小于窗口数量所暗示的。

### 6. 当前归一化中心明显偏离数据均值

配置值：

- `norm_pcd_center = [0.4, 0.0, 1.4]`

近似数据均值：

- 训练点云 xyz 均值：`[0.2138, -0.0442, 1.1178]`
- 训练机器人 xyz 均值：`[0.2648, -0.0671, 1.1599]`
- 验证机器人 xyz 均值：`[0.2491, 0.0162, 1.1225]`

因此模型正在学习一个持续的偏移，尤其是在 `x` 和 `z` 上。

### 7. 训练时成功率选择被禁用

当前配置：

- `success_selection_every_epochs = 0`
- `success_selection_episodes = 0`

因此 `best.pt` 仅由验证损失选择，而不是由任务成功率选择。

## 高优先级变更清单

### A. 可复现性和环境

- 修复 `models/pointnet.py` 中的损坏导入
- 使项目可从单个代码树安装和运行
- 避免此仓库和 `PointFlowMatch` 之间的命名空间包混合
- 在 `pfp_env` 内重新运行冒烟测试导入

### B. 检查点可靠性

- 用原子保存后重命名替换直接的 `torch.save(path)` 写入
- 保持 `latest.pt` 足够小以降低损坏风险
- 考虑不在每个检查点中存储完整的训练历史
- 将 `best.pt` 和周期性轮次检查点视为当前可信的工件

### C. 模型选择和评估

- 启用基于成功率的周期性模型选择
- 如果需要，分离 `best_valid.pt` 和 `best_success.pt`
- 停止仅依赖验证损失作为任务质量的唯一信号

### D. 数据归一化和增强

- 更新归一化为数据驱动统计，而不是手工选择的中心
- 添加实际的训练时点云/SE(3) 增强
- 验证是否需要逐维度动作归一化

### E. 训练配置

- 默认为 `--no-resume` 以进行新实验，除非明确恢复
- 根据成功率/验证退化缩短训练或添加早停逻辑
- 重新审视 `loss_weights`，特别是 `xyz`、`rot6d` 和 `grip`

## 针对官方 DiT 的模型结构审计

参考：

- 官方 DiT 仓库：`facebookresearch/DiT`
- 官方 `models.py`：https://github.com/facebookresearch/DiT/blob/main/models.py

重要提示：

- 当前主干网络只是"DiT 风格"
- 它在架构上不等价于官方 DiT 模型

### 1. 条件路径与官方 DiT 非常不同

官方 DiT：

- 使用单个 Transformer 堆栈
- 用一个条件向量 `c` 条件化每个块
- `c` 由时间步嵌入和标签嵌入组合形成

当前主干网络：

- 首先用单独的编码器编码观测 token
- 然后用单独的解码器解码动作 token
- 每个解码器块在调制前执行 `torch.mean(cond, dim=0)`

含义：

- 观测 token 被压缩成每个块的单个池化摘要
- Token 级条件结构在解码器使用之前被丢弃

这是操作行为的主要瓶颈候选。

### 2. 解码器中没有 token 级交叉注意力或等价机制

当前解码器块使用：

- 仅对轨迹 token 的自注意力
- 池化条件仅通过 AdaLN 调制进入

含义：

- 模型不能直接从未来动作 token 注意力到特定观测 token
- 所有观测细节必须经受编码器和均值池化步骤

对于点云操作，这可能损失太大。

### 3. 最终输出层初始化与官方 DiT 不同

官方 DiT 零初始化：

- 块 adaLN 调制线性层
- 最终 adaLN 调制线性层
- 最终输出线性层

当前主干网络零初始化：

- 解码器块 adaLN 调制线性层
- 最终层 adaLN 调制线性层

但它**没有**零初始化：

- `FinalLayer.linear`

相反，它在 `FinalLayer.reset_parameters()` 中 Xavier 初始化所有线性权重。

这是与官方 DiT 的真实结构差异，也是合理的稳定性/训练动态问题。

### 4. Dropout 与官方 DiT 不同

当前主干网络：

- 在编码器注意力、解码器注意力和 MLP 分支中使用 `dropout = 0.1`

官方 DiT：

- 在 Transformer 块路径中有效地使用零 dropout

这不一定是错的，但意味着当前模型不是忠实的 DiT 移植。

### 5. 位置处理与官方 DiT 不同

当前主干网络：

- 固定正弦编码器位置
- 可学习解码器位置参数

官方 DiT：

- 固定 sin-cos 位置嵌入用于 patch token

这是比条件路径更小的差异，但仍然是真实的偏差。

### 6. 主干网络更接近自定义编码器-解码器 Transformer 而非官方 DiT

实际上，当前架构是：

- PointNet 观测 tokenizer
- 观测 token 上的 Transformer 编码器
- 轨迹 token 上的 Transformer 解码器
- AdaLN 条件化自注意力解码器

这是合法的自定义设计，但不应期望自动继承官方 DiT 的结果。

## 值得重新审视的其他建模风险

### 1. 动作空间损失设计

当前 FM 损失是普通 MSE，作用于：

- `xyz`
- `rot6d`
- `grip`

权重相等。

风险：

- `grip` 是二元的，但用 MSE 而非 BCE/focal 风格处理训练
- `rot6d` 用原始坐标训练，而非旋转感知损失
- 相等权重可能不匹配任务难度

### 2. FM 目标尺度

当前 FM 设置使用：

- 仅部分中心化
- 无完整逐维度标准化
- `noise_scale = 1.0`

因此 `target_vel = z1 - z0` 可以有一个在各维度间不平衡的尺度混合。

### 3. Rollout 控制头

当前 rollout 默认值：

- 仅选择预测 horizon 中的第一个动作
- 默认无平滑

即使 horizon 预测本身改善，这也可能留下成功率提升空间。

## 编码前注意事项

在改变训练逻辑之前，请记住：

- 不要信任 `latest.pt`
- 使用 `best.pt` 和 `epochs/*.pt` 作为稳定的证据基础
- 注意不要从多个仓库根混合运行时导入
- 如果要公平比较变更，应首先冻结一个干净的环境和一个干净的代码树
- 当我们开始修改主干网络时，将每个变更与验证损失和 rollout 成功率比较，而不仅仅是训练损失

## 建议的工作顺序

1. 修复环境一致性和损坏的导入。
2. 修复检查点写入。
3. 重新启用成功率感知选择和更干净的实验启动。
4. 修复归一化和增强。
5. 然后改变主干网络结构：
   - 首先：忠实的 DiT 风格输出初始化
   - 其次：改进条件路径
   - 第三：测试池化条件解码器是否应变为 token 感知
