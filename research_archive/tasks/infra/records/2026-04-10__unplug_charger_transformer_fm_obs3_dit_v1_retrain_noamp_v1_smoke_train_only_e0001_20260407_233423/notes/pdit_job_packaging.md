# PDIT 项目包装稿

## 项目名称

面向具身操作的点云模仿学习闭环系统

副标题：当前在 RLBench `unplug_charger` 验证场景上完成闭环验证

## 一句话定位

这是一个具身模仿学习项目：我解决的核心不是“把点云模型训起来”，而是把几何观测、轨迹式动作学习、控制执行和行为评估串成闭环，让训练出的策略能通过真实 rollout 成功率被验证、筛选和解释。当前最直接的项目贡献，是跑通了具身模仿学习的工程闭环，并在验证任务上建立了稳定、高性能、可复现的 baseline；它之所以适合作为后续 VLA、世界模型和 sim2real 前置基础，不是因为这些方向已经做完，而是因为这条 baseline 可以沿观测模态、条件输入和建模目标三个方向自然扩展。

## 适合投递的岗位

- 具身智能算法
- 机器人学习 / 模仿学习
- 机器人操作学习
- 具身系统工程
- 感知控制一体化
- VLA / 世界模型预研基础设施
- 机器人仿真数据与训练闭环工程

## 项目要解决的真实问题

在具身模仿学习里，最常见的问题不是“loss 下不去”，而是下面这几件事：

- 多视角几何观测很难稳定地组织成可训练输入，模型容易只学到局部表象。
- 单步动作回归对 manipulation 不够友好，离线拟合得不错，不代表闭环执行时稳定。
- 验证集 loss 不能直接代表行为质量，容易选出“离线最优但 rollout 一般”的模型。
- 仿真行为评估本身不稳定，planner error、simulator runtime error 会污染实验判断。

这个项目的价值就在于：它把上面四个问题拆开处理，并最终沉淀成一个可验证的具身模仿学习闭环。

## 业务 / 场景背景

- 当前结果证据来自 RLBench 的 `unplug_charger` 场景，这类任务本质上是一个细粒度操作问题：策略既要理解局部几何关系，又要输出一段可执行的末端动作过程。
- 这种任务如果只做“单帧感知 + 单步动作回归”，通常很难兼顾动作连续性和执行稳定性。
- 对面试官来说，这个项目最值得讲的不是某个模块名字，而是：你怎么把 imitation learning 从“离线训练结果”变成“能在闭环里验证的机器人系统结果”。

## 核心技术亮点

### 亮点 1：把几何观测真正接入模仿学习，而不是停留在感知侧

- 输入不是单帧 RGB，而是多视角融合后的点云，加上历史机器人状态。
- 我把点云和机器人状态统一组织成时序条件输入，让模型看到的不只是几何形状，还包括当前执行上下文。
- 这样做解决的是“几何观测如何变成决策条件”这个问题，而不是单纯“用了点云”。

### 亮点 2：把模仿学习目标定义成未来轨迹，而不是一步动作

- 我没有让模型直接回归下一步命令，而是学习未来 `32` 步末端执行器状态轨迹。
- 这样更适合 manipulation，因为模型学的是一段操作过程，而不是局部一步映射。
- 执行时再用逐步重规划方式只取当前命令，兼顾轨迹建模能力和闭环鲁棒性。

### 亮点 3：把行为评估做成模型选型依据，而不是训练后的附属脚本

- 这个项目最关键的工程判断，是承认“validation loss 不等于真实行为质量”。
- 所以我把训练结果放进独立的行为评估环节，对周期性模型做真实 rollout 回查，最终按行为成功率来筛部署候选模型。
- 这一点直接改变了模型选择结论：离线最优 epoch 不是最终最优行为模型。

### 亮点 4：把仿真评估链路本身工程化

- 在具身项目里，评估不稳，结论就不可信。
- 我没有把 rollout 当成随便跑一下的脚本，而是补了子进程隔离、超时控制、错误归因和执行 fallback。
- 这样即使遇到 planner / simulator 不稳定，也能区分“是模型问题”还是“是评估环境问题”。

## 工程问题、解决思路、实现细节

### 工程问题 1：多视角几何观测如何变成稳定的模仿学习输入

**问题是什么**

- 具身操作任务依赖几何信息，但原始多视角点云既高维又时序相关。
- 如果不能把几何观测和机器人状态组织成稳定输入，模型就很难学到真正与执行相关的规律。

**解决思路**

- 用历史时刻的点云观测加机器人状态，构造成时序 imitation learning 样本。
- 让模型既看到几何结构，也看到当前机器人执行状态。

**实现细节**

- 训练配置里使用 `n_obs_steps=3`、`n_pred_steps=32`、`subs_factor=3`，表示用 3 个历史观测步预测未来 32 步状态轨迹。
- 数据通过 replay buffer + 滑窗采样形成训练样本。
- 点云通过 PointNet 编码为特征，再与 robot state 拼成时序条件 token。

**代码证据**

- 数据配置： [configs/data/unplug_charger_pcd.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/data/unplug_charger_pcd.json)
- 数据集与采样： [pdit/data/modalities/pcd.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/data/modalities/pcd.py)、 [pdit/data/dp_sampler.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/data/dp_sampler.py)
- 观测编码： [pdit/model/encoders/pointnet/obs_token_encoder.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/model/encoders/pointnet/obs_token_encoder.py)

### 工程问题 2：模仿学习的输出形式怎样才适合 manipulation

**问题是什么**

- 对操作任务来说，单步动作回归容易只学到局部拟合，闭环执行时误差会迅速积累。
- 更大的问题不是“下一步准不准”，而是整段动作过程是否连续、可执行、可收敛。

**解决思路**

- 把策略目标定义成未来轨迹，而不是一步动作。
- 训练时学习未来一段时间内末端执行器状态的演化；执行时只拿当前最前面的命令来闭环重规划。

**实现细节**

- 动作状态表示为 `xyz + rot6d + gripper`，总共 10 维。
- 模型输出未来 `32` 步轨迹，执行端默认只取第一个命令。
- 轨迹推理不是直接一步回归，而是通过 Flow Matching 的方式从噪声逐步生成未来轨迹。

**代码证据**

- 策略基类与轨迹输出： [pdit/policy/base.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/policy/base.py)
- FM 策略： [pdit/policy/fm_policy.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/policy/fm_policy.py)
- 动作后处理： [pdit/train/action_postprocess.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/train/action_postprocess.py)
- 状态/位姿表示： [common/se3.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/common/se3.py)、 [envs/rlbench_env.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/envs/rlbench_env.py)

### 工程问题 3：为什么不能直接按 validation loss 选模型

**问题是什么**

- 机器人模仿学习里经常会出现“离线 loss 好，但真实行为不一定好”。
- 如果只按验证集 loss 选模型，很容易选到一个离线指标最优、但 rollout 成功率不够高的 checkpoint。

**解决思路**

- 把训练和行为评估拆成两个独立阶段。
- 训练负责产出周期性模型，行为评估负责回查这些模型在真实 rollout 中的表现。
- 最终部署候选模型按行为成功率选，而不是按 loss 直接选。

**实现细节**

- 周期性模型会被独立拿去做 rollout success 回查。
- 最终会得到“按行为成功率筛出的部署候选模型”，而不是只保留验证集最优模型。
- 这套逻辑最终沉淀成行为评估报告，能解释为什么某个模型被保留。

**代码证据**

- 训练流程： [pdit/train/runner.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/train/runner.py)
- 行为评估： [pdit/train/eval.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/train/eval.py)
- 评估编排： [research/trial_runner.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/research/trial_runner.py)

### 工程问题 4：行为评估为什么也需要单独做工程化

**问题是什么**

- 仿真行为评估不是纯净环境，planner/runtime 错误会让实验结论失真。
- 如果评估链路不稳，最后根本没法判断是模型不行，还是环境流程本身有问题。

**解决思路**

- 把行为评估做成独立、可隔离、可诊断的流程。
- 对评估过程加入进程隔离、超时控制、错误分桶和执行 fallback。

**实现细节**

- 每个模型的评估可以在独立子进程中完成，避免一个异常污染整次回查。
- 评估输出会记录失败原因，比如 planner runtime error、simulator runtime error、invalid predicted action。
- 控制执行端加入 fallback，以减少不可执行动作直接中断整个 episode。

**代码证据**

- 单模型评估： [pdit/cli/eval_checkpoint.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/cli/eval_checkpoint.py)
- 全周期回查： [pdit/cli/eval_all_checkpoints.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/cli/eval_all_checkpoints.py)
- RLBench 环境封装： [envs/rlbench_env.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/envs/rlbench_env.py)

## 技术路线

示范数据进入 replay buffer -> 通过时序滑窗采样形成“历史点云 + 历史机器人状态 + 未来轨迹”样本 -> PointNet 提取几何表征 -> 与机器人状态构成时序条件 -> DiT-style backbone 学习未来轨迹的演化过程 -> 执行端采用逐步重规划闭环控制 -> 对周期性模型做独立行为回查 -> 按真实 rollout 成功率筛选部署候选模型

## 关键实现细节

- 输入模态：点云 + 机器人状态，不是 RGB 主线。
- 当前主配置：`n_obs_steps=3`，`n_pred_steps=32`，`subs_factor=3`，`n_points=2048`。
- 机器人状态维度：`10` 维，表示为 `xyz + rot6d + gripper`。
- 训练配置：`batch_size=32`，`grad_accum_steps=2`，`train_epochs=500`，`EMA=0.9993`。
- Flow Matching 推理配置：`fm_num_k_infer=10`，`fm_flow_schedule="exp"`。
- 数据规模：训练窗口数 `10573`，验证窗口数 `1189`。

证据：

- 配置： [configs/data/unplug_charger_pcd.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/data/unplug_charger_pcd.json)、 [configs/model/pointnet_dit_baseline.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/model/pointnet_dit_baseline.json)、 [configs/policy/fm_baseline.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/policy/fm_baseline.json)、 [configs/train/baseline_500.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/train/baseline_500.json)
- 训练摘要： [summary.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/summary.json)

## 项目结果

最值得讲的结果，不是“loss 降到多少”，而是下面这三点：

- 500 epoch 主线 run 的行为成功率曲线为：`0.75 / 0.80 / 0.90 / 0.80 / 0.95`
- 最强模型在 `100 episodes` 复核中仍保持 `0.85` 成功率
- 按验证集 loss 选出的最优 epoch 是 `53`，但按真实行为成功率筛出的部署候选模型来自 `epoch 500`

这三点连起来说明：

- 这个项目不是停留在离线训练结果上；
- 行为评估闭环确实改变了模型选择结论；
- 工程化的评测与选型是项目价值的一部分，而不是附属工作。
- 当前核心贡献不是提出新范式，而是把具身模仿学习做成了一个稳定、高成功率、可复核的任务 baseline。

证据：

- [summary.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/summary.json)
- [audit_report.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json)
- [epoch_0500_manual_eval.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epoch_0500_manual_eval.json)
- [docs/top10-checkpoint-manifest.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/top10-checkpoint-manifest.json)

## 项目边界与不足

- 当前成熟结果来自 `RLBench unplug_charger`，所以可以讲成“在该验证场景完成闭环验证”，不能讲成“已经证明多任务泛化”。
- 从代码抽象上看，环境和任务字段不是只服务一个任务，但当前没有跨任务 benchmark 结果证据。
- 这是仿真闭环项目，不是真机闭环项目；没有 ROS、标定、真实相机驱动和真机回放结果，所以不能讲成“sim2real 已经打通”，更准确的说法是“sim2real 前置所需的仿真侧数据采集、数据组织和行为验证架构已经做好”。
- 这不是 VLA，也不是世界模型；当前主线没有语言条件化，也没有 latent dynamics / planning model，所以不能讲成“已经实现 VLA / 世界模型”，但可以讲成“后续 VLA / 世界模型可以直接站在这套任务抽象、观测接口、数据回放和 rollout 验证底座上继续扩展”。

## 为什么这个 baseline 能作为 VLA / 世界模型 / sim2real 的前置基础

这一段更适合从“可扩展性”出发来讲，而不是从“底座已经搭好”出发来讲。

### 1. 当前真正建立起来的，是一个高性能、稳定、可复核的模仿学习 baseline

- 面试里最该先讲清的是：`pdit` 当前不是 VLA，也不是世界模型，它的核心贡献是先把具身模仿学习在一个操作任务上跑通成工程闭环，并把结果做成稳定 baseline。
- 这个 baseline 有两个价值：一是它本身已经能在任务上取得高成功率；二是后续无论你切到 VLA 还是世界模型，都会需要一个强、稳、可比较的 imitation learning 基线做对照。

### 2. 对 VLA 最可复用的，不是“点云”本身，而是模仿学习的策略骨架

- 当前 `pdit` 的核心方法是“条件观测 -> 未来动作轨迹生成 -> rollout 验证”，其中最可复用的是时序 imitation learning 架构、动作表示和 Flow Matching 策略形式，而不只是 PointNet。
- 如果后续往 VLA 扩，最自然的路径不是重写整条链，而是保留现在这套策略训练与行为评估骨架，把观测编码从点云编码器扩成视觉编码器，再把任务文本作为额外条件输入接进来。
- 更准确地说，可以讲成：当前的点云模仿学习 baseline 已经把“策略怎么学动作过程、怎么评估动作质量、怎么选可部署模型”这些关键问题解决了；后续只要补齐 RGB encoder 和 text conditioning，这条线就能自然升级成 vision-language-action conditioned imitation learning baseline。
- 但这里要注意边界：不是“把点云换成 RGB、再加一句 text 就已经是成熟 VLA”，而是“现有 baseline 的训练目标、轨迹表示和评测闭环可以直接复用，VLA 需要在此基础上新增视觉-语言条件化建模”。

### 3. 对世界模型最可复用的，是时序数据组织和序列生成视角

- 当前 `pdit` 已经把训练样本定义成“历史观测 + 历史机器人状态 -> 未来轨迹”，这是一种很典型的时序建模问题。
- 对世界模型来说，最容易复用的不是当前的具体输入模态，而是这套时间窗组织方式、trajectory prediction 视角，以及基于 rollout 的下游评估方式。
- 如果后续往世界模型扩，最自然的改法不是推翻现在的框架，而是把当前直接预测 `robot_state_pred` 的目标，进一步改成预测未来 latent state、未来观测表征，或者在 latent dynamics 上做 planning。
- 从这个角度看，Flow Matching 在这里也不是只能当“policy 技巧”，它提供的是一种序列生成视角：今天生成的是未来动作轨迹，后续也可以迁移到生成 latent trajectory 或未来状态分布，但当前代码还没有实现这一步。

### 4. 对 sim2real 最可复用的，是 sim-first 阶段的工程资产

- sim2real 不只是最后把模型扔到真机上，更前面的仿真数据采集格式、观测接口、动作表示、行为验证口径其实同样重要。
- `pdit` 当前已经把这些 sim-first 资产做出来了：RLBench 环境封装统一了任务和观测接口，zarr replay buffer 固定了示范数据格式，时序采样固定了训练样本契约，rollout 审计固定了行为评估口径。
- 所以后续如果要做 sim2real，真正要新增的是标定、真实相机驱动、真机控制接口和域差处理；而训练样本组织、策略学习骨架、动作表示和行为评估基线并不需要从零开始。

### 5. 面试里最稳的说法

- `pdit` 当前最核心的成果，是把具身操作任务上的模仿学习工程闭环跑通，并建立了一个高性能、稳定、可复现的 baseline。
- 它之所以能作为后续 VLA / 世界模型 / sim2real 的前置基础，不是因为这些方向已经实现，而是因为现有的 FM 策略、时序 imitation learning 架构、动作表示、数据组织和 rollout 评测闭环，本身就是这些更大方向继续演进时最容易复用的部分。
- 对 VLA 来说，可以在这条 baseline 上继续补视觉编码和文本条件；对世界模型来说，可以复用时序数据契约和序列生成视角，把预测目标从动作扩展到 latent dynamics；对 sim2real 来说，可以复用 sim-first 阶段已经打通的数据和验证链路。

这部分的代码支撑主要来自：

- FM 策略与未来轨迹生成： [pdit/policy/fm_policy.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/policy/fm_policy.py)、 [pdit/policy/base.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/policy/base.py)
- 时序 imitation learning 数据契约： [pdit/data/modalities/pcd.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/data/modalities/pcd.py)、 [pdit/config/schema.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/config/schema.py)
- 环境与 rollout 评测闭环： [envs/rlbench_env.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/envs/rlbench_env.py)、 [pdit/train/eval.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/train/eval.py)、 [pdit/cli/record_rollout_videos.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/cli/record_rollout_videos.py)
- 数据组织与 replay buffer： [pdit/data/replay_buffer.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/data/replay_buffer.py)、 [pdit/data/dp_replay_buffer.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/data/dp_replay_buffer.py)
- 可扩展但尚未完成的模态接口： [pdit/config/schema.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/config/schema.py)、 [pdit/data/modalities/rgb.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/data/modalities/rgb.py)、 [common/task_text.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/common/task_text.py)

## 面试可直接说的版本

### 偏 VLA / 世界模型岗位的 30 秒讲法

我会把 `pdit` 讲成一个高性能、稳定、可复核的具身模仿学习 baseline。它当前的直接成果不是 VLA 或世界模型本身，而是先把操作任务上的 imitation learning 工程闭环跑通：用时序几何观测学习未来轨迹，再通过 rollout 成功率来做模型选型。这个 baseline 的价值在于，后续往 VLA 扩可以继续补视觉编码和文本条件，往世界模型扩可以把当前的序列预测目标从动作轨迹进一步扩到 latent dynamics，所以它是一个很好的前置基础。

### 偏 VLA / 世界模型岗位的 1 分钟讲法

如果投 VLA 或世界模型岗位，我不会把 `pdit` 讲成“我已经做了 VLA / 世界模型”，而是会讲成“我先把具身模仿学习的强 baseline 做扎实了”。当前这条线的核心贡献有两个：第一，我把点云操作任务上的模仿学习工程闭环跑通了，解决了输入组织、未来轨迹建模、闭环执行和行为评估选型这几件真正影响结果的事；第二，我把它做成了一个高成功率、稳定、可复核的 baseline。它之所以适合作为后续 VLA / 世界模型的前置基础，是因为最可复用的不是点云本身，而是 FM 策略、时序 imitation learning 架构、动作表示、数据契约和 rollout 评测闭环。后续往 VLA 走，可以在这条线上补视觉编码和文本条件；往世界模型走，可以保留现在的时序数据组织和序列生成视角，把预测目标从动作扩到 latent dynamics 或未来表征。

### 偏 VLA / 世界模型岗位的 PPT 三条卖点

- 先做强 baseline：先在具身操作任务上跑通高性能、稳定、可复核的模仿学习工程闭环，而不是一开始就空谈大模型叙事。
- 方法可演进：现有 FM 策略、时序 imitation learning 架构和未来轨迹建模方式，可以自然扩展到 vision-language conditioned policy 或更强的序列生成模型。
- 工程可复用：当前的数据契约、动作表示和 rollout 评测闭环已经稳定，后续切到 VLA / 世界模型主要是升级条件输入和预测目标，而不是重做整条训练部署链。

### 30 秒版本

我做的是一个具身模仿学习闭环项目。核心不是单纯把点云模型训起来，而是解决离线训练和真实行为之间的落差：我用时序点云和机器人状态做输入，让模型预测未来轨迹，再通过独立的 rollout 行为评估来筛最终模型。当前在 RLBench `unplug_charger` 上，最强模型做到了 `95% success@20 episodes`、`85% success@100 episodes`。

### 1 分钟版本

这个项目针对的是具身模仿学习里一个很典型的问题：validation loss 好，不等于机器人在闭环里真的做得好。我的做法是把项目拆成三个层面。第一层是输入层，我把多视角点云和机器人状态组织成时序条件，让几何观测真正进入决策；第二层是输出层，我不做一步动作回归，而是预测未来 `32` 步末端轨迹，更符合 manipulation 的执行需求；第三层是评估层，我把训练和行为评估拆开，对周期性模型做独立 rollout 回查，最终按真实行为成功率选部署候选模型。结果上，500 epoch 主线 run 的成功率曲线到 `epoch500` 达到 `0.95@20 episodes`，而 `100 episodes` 复核还有 `0.85`，并且最终最优行为模型并不是验证集 loss 最优的 `epoch53`。

### 3 分钟版本

这个项目我会把它定义成“面向具身操作的点云模仿学习闭环系统”。它当前的验证场景是 RLBench `unplug_charger`，但我真正想解决的不是单一任务本身，而是具身模仿学习里几个很典型的工程问题。

第一个问题是几何观测怎么稳定进入模仿学习。操作任务里几何关系很关键，所以我没有把它做成 RGB 单帧策略，而是用历史点云和机器人状态构成时序输入，让模型同时看到几何结构和当前执行状态。

第二个问题是输出形式怎么定义。对 manipulation 来说，单步动作回归很容易只学到局部拟合，所以我把学习目标设计成未来 `32` 步末端执行器状态轨迹。训练时模型学的是整个动作过程，执行时再用逐步重规划只取当前命令，保证闭环稳定性。

第三个问题是模型怎么选。我认为这个项目最重要的一点就是没有把 validation loss 当最终目标，而是把训练和行为评估拆开。训练阶段产出周期性模型，评估阶段用真实 rollout 回查这些模型，最后按行为成功率筛出部署候选模型。这个判断是有结果支撑的：当前主线 run 里，验证集最优 epoch 是 `53`，但最终行为最强模型来自 `epoch500`；500 epoch 的行为成功率曲线是 `0.75 / 0.80 / 0.90 / 0.80 / 0.95`，`100 episodes` 复核还有 `0.85`。

另外，行为评估本身我也做了工程化处理，因为 RLBench/CoppeliaSim 的 planner 和 runtime 不稳定会污染实验判断。所以我补了子进程隔离、超时控制、错误分桶和执行 fallback。对我来说，这个项目最能体现的能力不是“我会写某个模型”，而是我能把具身模仿学习从离线训练打通到闭环行为验证和模型选型。

## 简历版内容

### 中文简历 bullet

- 面向具身操作任务搭建点云模仿学习闭环，将多视角几何观测、轨迹式动作学习、控制执行与行为评估串联起来，并在 RLBench `unplug_charger` 验证场景下实现 `95% success@20 episodes`、`85% success@100 episodes`。
- 针对“离线 loss 不等于真实行为”的研究痛点，将训练与行为评估拆成独立阶段，对周期模型进行 rollout 回查，并依据真实行为成功率筛选最终部署候选模型。
- 为解决 manipulation 中单步动作回归不足的问题，将学习目标定义为未来 `32` 步末端执行器状态轨迹，并通过逐步重规划方式完成闭环执行。
- 为提升评测可信度，补齐子进程隔离、超时控制、错误归因、动作 fallback 与 checkpoint 结果沉淀，使行为评估从辅助脚本升级为可复核的研究资产。

### 英文简历 bullet

- Built an embodied imitation learning loop for point-cloud-based manipulation, connecting geometric observation, trajectory learning, control execution, and behavior evaluation, and achieved `95% success@20 episodes` and `85% success@100 episodes` on RLBench `unplug_charger`.
- Addressed the mismatch between offline loss and real behavior by decoupling training from rollout-based behavior evaluation and selecting the final deployment candidate by success rate rather than validation loss.
- Framed the policy target as a future 32-step end-effector trajectory instead of one-step action regression, making the learned policy better aligned with manipulation execution.
- Turned behavior evaluation into a reliable engineering component with isolated evaluation subprocesses, timeout control, failure attribution, action fallback, and persistent evaluation artifacts.

## 可能被问到的基础概念

### 1. 什么是 imitation learning

- 用 demonstration 直接监督策略学习，而不是通过在线试错去学。
- 在这个项目里，监督目标来自示范轨迹 `robot_state_pred`，所以本质上是模仿学习，不是 RL。

### 2. 为什么点云适合这个项目

- 点云直接提供 3D 几何信息，更适合抓取、拉拔这类依赖局部空间关系的任务。
- 当前这条主线追求的是几何强 baseline，而不是多模态条件化。

### 3. 为什么用未来轨迹而不是一步动作

- 一步动作更像局部回归，容易积累误差。
- 未来轨迹更适合描述 manipulation 过程，再通过逐步重规划保证闭环稳定。

### 4. 什么是 Flow Matching

- 一种从噪声分布到目标分布学习演化过程的方法。
- 在这个项目里，它被用来生成未来动作轨迹，是方法手段，不是项目需求本身。

### 5. 什么是 receding horizon / 逐步重规划

- 每次预测一整段未来，但执行时只取当前最前面的动作，下一时刻再重新预测。
- 这样能兼顾轨迹建模和闭环鲁棒性。

### 6. 为什么 validation loss 不等于行为成功率

- 离线监督只能度量对示范分布的拟合程度。
- 闭环执行里还会叠加控制误差、planner 可达性和动作稳定性问题。

### 7. 为什么行为评估要单独工程化

- 因为 simulator/planner 会引入额外不稳定性。
- 如果不把评估流程设计好，就无法判断问题出在模型还是环境。

## 面试高频问题

1. 这个项目到底在解决什么问题？
   回答思路：解决的是具身模仿学习里“离线训练结果不等于真实行为结果”的问题。我把几何观测、动作目标和行为选型串成了闭环。

2. 为什么你把它讲成模仿学习工程，而不是操作策略项目？
   回答思路：因为核心约束来自 demonstration、监督目标和模型选型逻辑，它本质上是 imitation learning pipeline。策略只是产出形式。

3. 为什么点云是合理输入？
   回答思路：当前验证场景几何关系强，点云能直接提供 3D 结构，更适合做几何强 baseline。

4. 为什么不是单帧输入？
   回答思路：操作任务决策依赖当前执行状态和时序上下文，单帧容易丢掉动作进展信息。

5. 为什么输出未来轨迹而不是一步动作？
   回答思路：因为 manipulation 更像过程控制。未来轨迹让模型学动作过程，执行时再逐步重规划。

6. 为什么不能直接按 validation loss 选模型？
   回答思路：因为离线 loss 和真实行为会错位。这个项目里最直接的证据就是 `epoch53` 和 `epoch500` 的差异。

7. 你怎么证明这个项目不是“只会离线回归”？
   回答思路：因为我保留了真实 rollout 成功率、100 回合复核和行为评估报告，模型选型依据来自行为结果而不是只看 loss。

8. 行为评估为什么要单独做工程化？
   回答思路：如果评估链路不稳，实验结论就不可信。planner/runtime 问题必须被隔离和解释。

9. 这个项目最关键的工程判断是什么？
   回答思路：承认 validation loss 不是最终目标，并愿意为行为评估单独建设流程。

10. 如果继续做，下一步会扩哪一块？
    回答思路：优先做行为评估与训练信号之间的进一步对齐，其次再扩更强的条件化或观测模态。

11. 为什么现在不能把它讲成 VLA 或世界模型？
    回答思路：因为当前主线没有语言条件输入，也没有 latent dynamics / planning model，所以不能讲成“已经实现 VLA / 世界模型”；但可以讲成它已经把任务抽象、数据组织和 rollout 验证底座搭好了，后续往这两个方向扩展不需要推倒重来。

12. 为什么现在不能讲成多任务泛化项目？
    回答思路：因为当前成熟结果集中在 `unplug_charger` 验证场景，没有跨任务 benchmark 证据。

## 不该吹的地方

- 不能吹成已经实现的 VLA
- 不能吹成已经实现的世界模型
- 不能吹成多任务通用具身模型
- 不能吹成真机 sim2real 已落地
- 不能吹成“提出了新的 DiT 算法创新”

## 代码与工件证据附录

| 结论 | 证据 |
| --- | --- |
| 当前主线是点云模仿学习系统 | [configs/data/unplug_charger_pcd.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/data/unplug_charger_pcd.json)、 [pdit/policy/fm_policy.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/policy/fm_policy.py) |
| 输入是时序点云 + 机器人状态 | [pdit/data/modalities/pcd.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/data/modalities/pcd.py)、 [pdit/model/encoders/pointnet/obs_token_encoder.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/model/encoders/pointnet/obs_token_encoder.py) |
| 输出是未来 `32` 步轨迹 | [pdit/config/schema.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/config/schema.py)、 [pdit/policy/base.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/policy/base.py) |
| 当前方法使用 Flow Matching | [configs/policy/fm_baseline.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/policy/fm_baseline.json)、 [pdit/policy/fm_policy.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/policy/fm_policy.py) |
| 训练与行为评估是拆开的 | [research/trial_runner.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/research/trial_runner.py) |
| 验证集最优与行为最优不一致 | [summary.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/summary.json)、 [audit_report.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json) |
| 当前验证场景是 `unplug_charger` | [configs/data/unplug_charger_pcd.json](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/configs/data/unplug_charger_pcd.json)、相关评测工件 |
| 环境层不是写死单任务 | [pdit/config/schema.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/pdit/config/schema.py)、 [envs/rlbench_env.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/envs/rlbench_env.py)、 [common/task_text.py](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/common/task_text.py) |
