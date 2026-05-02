# Dummy V2: LeRobot-Based Imitation Learning Demo for a Self-Built Robotic Arm

> 自研 6DoF + 线轨夹爪机械臂，基于 LeRobot v3 数据标准、世界坐标 Jog 示教、多视角 RGB-D 感知、MuJoCo/Isaac Lab 仿真和 ACT 策略部署，构建面向方块抓取/叠放任务的端到端具身模仿学习 demo。

## 1. 项目概述

Dummy V2 是一套从硬件控制到具身策略学习的完整机器人 demo。项目目标不是只让机械臂“能动”，而是把自研机械臂接入主流具身智能数据和训练框架，使它具备可采集、可回放、可训练、可迁移的算法闭环能力。

核心能力包括：

- **真机控制闭环**：6DoF 机械臂 + 线轨夹爪，完成关节限位、CAN/串口保护、夹爪电流控制、固件烧录与真机调试。
- **世界坐标示教**：不直接录制原始摇杆/关节遥控，而是在世界坐标系中定义任务路线，通过 IK 解算为关节动作，再用连续性约束、安全边界和真机反馈修正，得到更适合模仿学习的数据。
- **LeRobot v3 数据接入**：采集数据直接落盘为 LeRobotDataset v3，低维状态写 Parquet，多相机视频写 MP4，并保留 Dummy 真机安全回放索引。
- **多模态视觉感知**：集成 Intel RealSense D405 RGB、D405 Depth JET 伪彩和 UVC RGB 三路画面，用于遥操作监督和后续视觉策略训练。
- **仿真与预训练**：MuJoCo 用于 FK/IK、可视化和安全预览；Isaac Lab 用 PPO 课程强化学习完成 Reach -> PreGrasp -> GraspLift 预训练，为模仿学习策略提供 warm-start 和 sim2real 验证。
- **ACT/VLA 部署接口**：基于采集 rollout 训练 ACT 策略完成叠方块 demo，同时数据结构兼容后续 VLA、世界模型和多任务策略扩展。

当前可展示数据集经过清洗后包含：

```text
LeRobotDataset v3
cleaned episodes: 5
frames: 4379
fps: 10Hz
robot: Dummy V2 6DoF + binary gripper
cameras: D405 RGB + D405 Depth + UVC RGB
```

## 2. 系统架构

整套系统按“感知 - 示教 - 约束 - 数据 - 策略 - 回放”组织：

```text
Real Robot
  ├─ 6DoF joints + J6 harmonic reducer
  ├─ Linear rail gripper, binary open/close with current protection
  ├─ J6 end IMU for wrist pose correction
  └─ CAN/serial control channel

GUI Teleoperation
  ├─ World-coordinate Jog: X/Y/Z + gripper open/close
  ├─ MuJoCo state sync and IK preview
  ├─ User workspace boundary and joint limit filtering
  ├─ D405 RGB / D405 Depth / UVC RGB preview
  └─ Episode record / discard / save / replay

Data Layer
  ├─ LeRobotDataset v3
  │   ├─ data/*.parquet: states, actions, joints, timestamps
  │   └─ videos/*.mp4: multi-view camera streams
  └─ dummy_replay_index.json: safe real-robot replay metadata

Learning Layer
  ├─ ACT imitation policy for block stacking
  ├─ Isaac Lab PPO curriculum pretraining
  ├─ rollout validation in sim
  └─ VLA / world model extension interface
```

这套架构的关键点是：**示范数据本身就是任务空间动作，而不是低层随机遥控痕迹**。世界坐标 Jog 每一步都先生成目标 TCP，再经过 IK、连续性修正、安全过滤和真机通信保护，最终写入 `action` 与 `action.joints`。这样数据能同时服务于：

- 行为克隆和 ACT 训练；
- 真机安全回放；
- Isaac/MuJoCo 的离线 rollout 复现；
- 后续 VLA 模型的视觉语言动作对齐。

## 3. 世界坐标示教与 LeRobot 数据

### 3.1 为什么不用直接关节遥操作

直接关节遥操作有两个问题：

1. **动作语义弱**：关节角变化和“向左、靠近方块、夹紧”等任务意图之间没有直接对应关系，学习策略容易过拟合操作者习惯。
2. **数据噪声大**：自研机械臂的 J4/J5/J6 腕部自由度存在多个等效 IK 解，直接拖关节容易让末端姿态抖动，给视觉策略带来错误监督。

因此 demo 采用世界坐标任务路线：

```text
operator command:
  X+/X-/Y+/Y-/Z+/Z- + gripper open/close

task-space target:
  target_tcp = current_tcp + delta_xyz

IK:
  target_tcp + preferred posture + continuity prior
  -> target_joints

safety:
  joint limits + user workspace boundary + CAN rate limit

dataset:
  observation.state, action, observation.joints, action.joints, images
```

这种方式把人的输入约束在任务空间中，得到的数据更接近“机器人应该怎么完成任务”，而不是“人当时怎么一点点调电机”。

### 3.2 数据 schema

LeRobot v3 中每一帧包含：

```text
observation.state:
  [x_mm, y_mm, z_mm, rot6d_0..rot6d_5, gripper]

action:
  [target_x_mm, target_y_mm, target_z_mm, target_rot6d_0..target_rot6d_5, target_gripper]

observation.joints:
  [j1, j2, j3, j4, j5, j6]

action.joints:
  [target_j1, target_j2, target_j3, target_j4, target_j5, target_j6]

observation.images.d405_rgb:
  RealSense D405 RGB, 640x480

observation.images.d405_depth:
  D405 depth rendered as JET pseudo-color RGB, focused on 0-1m near-field

observation.images.uvc_rgb:
  external UVC camera RGB, 640x480

timestamp, frame_index, episode_index, index, task_index
```

夹爪统一为二值语义：

```text
0.0 = closed / grasp
1.0 = open
```

真实回放时不把夹爪当作第 7 个普通关节，而是走独立的 `HAND_OPEN / HAND_CLOSE / HAND_DISABLE` 控制，避免夹爪长时间持续发力损伤机构。

### 3.3 采集与清洗

GUI 支持启动相机、开始录制、停止保存、丢弃本集、回放本集。保存时：

- 低维时序数据进入 Parquet；
- 三路视频进入 MP4；
- 额外生成 `dummy_replay_index.json`，记录 `action.joints`、夹爪目标、速度和时间戳，用于真机安全回放；
- episode 质量不合格时可删除并压缩编号，保证 LeRobotDataset 连续可读。

当前清洗后的 demo 数据集：

```text
episode 000: 752 frames
episode 001: 945 frames
episode 002: 807 frames
episode 003: 990 frames
episode 004: 885 frames
total: 4379 frames
```

## 4. IK 解算与 J6 IMU 闭环修正

### 4.1 Posture-biased IK

世界 Jog 每个 tick 都调用 posture-biased IK。目标不是简单求一个位置误差最小的解，而是在满足 TCP 误差的前提下选择“最连续、最像上一帧、腕部最稳定”的解。

IK 优化目标：

```text
L = w_pos * ||FK(q) - target_tcp||^2
  + w_posture * ||q - q_preferred||^2
  + w_continuity * ||q - q_last_success||^2
  + w_wrist * ||q_wrist - q_wrist_ref||^2
  + joint_limit_penalty(q)
```

其中：

- `q_preferred` 来自当前任务姿态或上一段稳定姿态；
- `q_last_success` 是上一帧成功下发/回放的动作；
- `q_wrist_ref` 用于稳定 J4/J5/J6，避免腕部在等效解之间乱跳；
- 输出前还会做最大关节增量裁剪，避免单帧动作过大。

这种设计解决了一个实际问题：连续 Jog 时动作看起来平滑，但单步微调容易因为 IK 选到另一个等效解，导致末端突然晃动。加入连续性项后，策略数据中的 `action.joints` 更平滑，也更适合 ACT 训练。

### 4.2 J6 IMU 闭环

J6 末端安装 IMU 后，腕部姿态不再只依赖编码器和模型预测，而是增加了末端姿态观测。闭环流程为：

```text
encoder joints q_t
  -> MuJoCo/FK predicts TCP pose T_fk

J6 IMU
  -> estimate wrist orientation R_imu

residual
  e_R = R_imu - R_fk_wrist

IK next tick
  q_seed = q_last_success + imu_residual_compensation
  preferred wrist posture = wrist posture corrected by IMU
```

IMU 主要用于两个地方：

1. **姿态漂移检测**：当 J6 末端姿态和 FK 预测长期偏离时，说明腕部传动、减速器回差或线缆干扰带来了误差。
2. **IK 初值修正**：下一帧 IK 不再完全相信模型初值，而是把 IMU 残差加入 J4/J5/J6 的姿态偏置，降低腕部累积误差。

在叠方块这类近距离操作中，末端姿态误差会直接影响夹爪接触角度。IMU 闭环的价值是把腕部姿态从“纯开环模型估计”变成“模型 + 末端观测”的弱闭环，提升 sim2real 和长轨迹回放稳定性。

## 5. ACT 模仿学习：方块抓取与叠放

### 5.1 任务定义

Demo 任务为桌面方块操作：

1. 识别目标方块；
2. 世界坐标移动到方块上方；
3. 下探并夹紧；
4. 抬升方块；
5. 移动到目标方块/目标区域上方；
6. 下放并松开；
7. 完成叠放或放置。

这个任务适合展示模仿学习，因为它同时包含：

- 视觉定位；
- 末端轨迹规划；
- 夹爪时序；
- 接触前后的动作切换；
- 失败恢复和安全保护。

### 5.2 模型输入输出

ACT policy 输入：

```text
images:
  D405 RGB
  D405 Depth pseudo-color
  UVC RGB

proprioception:
  observation.joints: 6 joint angles
  observation.state: TCP xyz + rot6d + gripper
  optional history: previous action / previous gripper state
```

ACT policy 输出：

```text
action chunk length k:
  action[0:k] = target TCP xyz + rot6d + gripper
  action.joints[0:k] = target joint angles for safe replay
```

部署时使用两种动作接口：

- **任务空间接口**：策略输出 TCP 目标，再经过 IK、安全边界和关节限位；
- **关节空间接口**：策略直接输出 `action.joints`，适合回放和低延迟控制。

当前 demo 优先采用关节空间安全回放，避免在线 IK 抖动影响 ACT 的动作评估；后续 VLA 多任务部署会更多使用任务空间接口。

### 5.3 模型结构

ACT 采用 chunked action imitation learning：

```text
image encoder:
  shared or per-camera ResNet/CNN backbone
  -> visual tokens

proprioception encoder:
  MLP(joints, tcp pose, gripper)
  -> robot state token

temporal/action module:
  Transformer encoder-decoder
  CVAE latent z for action chunk diversity

decoder head:
  future k-step action chunk
  joint/TCP regression head
  gripper binary head
```

训练损失：

```text
L = L_action + L_joint + L_gripper + beta * KL

L_action:
  TCP xyz / rot6d L1 or MSE

L_joint:
  action.joints L1 or smooth L1

L_gripper:
  binary cross entropy for open/close

KL:
  CVAE latent regularization
```

部署时使用 temporal aggregation：

- 每 100ms 推理一次；
- 模型输出未来 `k` 步 action chunk；
- 对重叠时间步做指数加权平均；
- 夹爪动作做二值阈值和最短保持时间；
- 动作下发前经过用户软边界、固件关节限位、CAN 限频和夹爪电流保护。

### 5.4 Demo 中遇到的问题与修复

**问题 1：IK 等效解跳变导致末端晃动。**  
单步 Jog 或低速微调时，TCP 位置变化很小，但 IK 可能切换到另一个腕部等效解，使 J4/J5/J6 突然变化。修复方法是把 IK 目标从“只看末端误差”改成“末端误差 + 姿态偏置 + 上一帧连续性”，并在输出前限制单 tick 关节跃迁。

**问题 2：J5/J6 通信和 CAN 总线容易阻塞。**  
连续 Jog、相机写盘和位置轮询同时进行时，GUI 可能卡顿甚至闪退。修复方法是进入实时 Jog 模式后降低非必要轮询，相机只取 latest frame，IK worker 忙时跳过下一帧，下发频率限制在 10Hz 左右，并对串口 I/O 错误加入恢复逻辑。

**问题 3：近距离 depth 显示分辨率不够。**  
默认 depth 映射关注范围太远，桌面 0.2-0.5m 操作区域几乎全蓝，影响人工监督。修复方法是将 D405 depth 按 0-1m 归一化，使用 JET 伪彩，无效点和 1m 外区域置黑，强化近景深度差异。

**问题 4：夹爪静摩擦导致策略动作看似正确但抓取失败。**  
线轨夹爪实测需要约 0.7A 才能可靠克服静摩擦。修复方法是把夹爪从普通关节控制中拆出来，使用独立开合命令和时效保护；策略只输出 open/close 语义，由底层映射到受保护的电流动作。

## 6. Isaac Lab PPO 课程预训练

### 6.1 为什么加入 RL

真实机械臂数据采集成本高，尤其是接触任务容易损伤夹爪或打乱环境。Isaac Lab 预训练用于解决三个问题：

1. **策略 warm-start**：在仿真中先学到 reaching、pregrasp 和 lift 的基本动作结构，再迁移到真实 rollout。
2. **奖励和阶段设计验证**：通过并行环境快速验证任务是否可学习，避免在真机上盲调。
3. **生成辅助 rollout**：将仿真策略导出为候选轨迹，再经过 MuJoCo/GUI 安全检查后回放或加入训练集。

### 6.2 PPO 课程设计

课程分为三阶段：

```text
Stage 1: Reach
  目标：TCP 移动到方块附近或预抓取区域

Stage 2: PreGrasp
  目标：夹爪保持打开，到达方块上方预抓取位姿

Stage 3: GraspLift
  目标：接近、闭合夹爪、抬升方块
```

三阶段共享同一策略接口，方便 checkpoint warm-start：

```text
observation dim: 30
action dim: 7
```

观测输入：

```text
joint positions: 6
joint velocities: 6
gripper opening: 2
tcp position: 3
cube position: 3
cube relative position: 3
last action: 7
```

动作输出：

```text
action[0:6] = normalized joint delta
action[6]   = gripper open/close delta
```

策略模型：

```text
PPO Actor-Critic
actor MLP: 256 -> 128 -> 64
critic MLP: 256 -> 128 -> 64
activation: ELU
parallel envs: 64-384 probed, 128 used for stable training
```

奖励函数包含：

- TCP 到目标点距离；
- 预抓取高度误差；
- XY 对齐误差；
- 夹爪打开/闭合阶段奖励；
- 方块抬升高度；
- 动作平滑惩罚；
- 关节速度和不稳定状态惩罚。

训练价值：

- Reach/PreGrasp 提供稳定的空间移动先验；
- GraspLift 提供接触阶段策略初始化；
- 导出的 policy rollout 可转为 Dummy 控制器轨迹，用作 ACT 数据增强或 sim2real 检查；
- 与真实 LeRobot 数据结合后，可形成“仿真预训练 + 真实示范微调”的训练路线。

## 7. VLA 与世界模型扩展

当前数据已经具备 VLA 和世界模型训练所需的基础结构：

- 多视角图像；
- depth 近景几何线索；
- 低维 robot state；
- 目标动作和真实回放动作；
- episode/task 元数据；
- 真机安全回放接口。

后续可接入的模型方向：

```text
ACT:
  low-level visuomotor policy, good for short-horizon manipulation

Diffusion Policy:
  generate smoother multi-step action trajectories

VLA / OpenVLA / pi0-style policy:
  add language command, map instruction + images + proprioception -> action

World Model:
  learn latent dynamics from rollout, predict future visual/state transitions,
  support model-predictive action selection and counterfactual evaluation
```

我自己的迁移学习和因果学习研究背景可以自然接到这个项目上：用真实/仿真域之间的因果不变因素做 sim2real 对齐，用迁移学习降低小数据机器人 demo 对海量真机数据的依赖。

## 8. 可展示结果

作品集展示时建议按下面顺序放视频和截图：

1. GUI 主界面：真机状态、MuJoCo 同步、D405 RGB、D405 depth、UVC RGB 同屏。
2. 世界坐标 Jog：按 X/Y/Z 移动 TCP，并同步夹爪开合。
3. LeRobot 数据：展示 episode 列表、Parquet + MP4 结构，以及 `LeRobotDataset` 成功加载。
4. Isaac Lab：播放 Reach 或 GraspLift checkpoint，展示课程 RL。
5. ACT demo：播放方块抓取/叠放视频，强调策略输入输出和安全回放链路。

验收指标：

```text
LeRobotDataset load: pass
cleaned episodes: 5
cleaned frames: 4379
recording fps: 10Hz
camera streams: 3
robot action dim: 6 joints + binary gripper
sim curriculum: reach / pregrasp / grasplift
```

## 9. 项目时间线

### 2026-04-20 ~ 2026-04-22：控制栈与安全基础

- 梳理 Dummy V2 机械臂控制链路、串口/CAN 指令、关节限位和 reset 姿态。
- 建立关节角、世界坐标、TCP 位姿之间的基础转换关系。
- 设计用户软边界和安全回放策略，避免调试阶段越界或持续发力。

### 2026-04-23 ~ 2026-04-26：MuJoCo、IK 与世界坐标 Jog

- 搭建 MuJoCo 模型和 GUI 同步界面，实现真机状态与仿真状态一致显示。
- 完成 FK/IK 解算，加入 posture-biased IK 和连续性保护。
- 增加世界坐标 Jog 控制：X/Y/Z 六向移动、键盘/按钮控制、目标 TCP 显示、安全边界记录。
- 将任务路线从“关节遥控”升级为“世界坐标动作 + IK 解算”的示范采集方式。

### 2026-04-27：夹爪固件与硬件验证

- 使用 ST-LINK 完成线轨夹爪固件烧录。
- 验证夹爪 CAN 节点、拨码规则、电流阈值和开合方向。
- 确定夹爪静摩擦约 0.7A，设计真实模式下的 open/close/disable 保护逻辑。

### 2026-04-28 ~ 2026-04-30：Isaac Lab 强化学习预训练

- 将 Dummy V2 资产接入 Isaac Lab，定义 40mm cube 操作任务。
- 设计 Reach -> PreGrasp -> GraspLift 三阶段 PPO curriculum。
- 完成并行环境数量探测、训练 checkpoint 保存、GUI 播放和 demo 归档。
- 形成仿真策略到真实轨迹候选的离线桥接路线。

### 2026-05-01：多相机 LeRobot 采集与 ACT/VLA Demo 整合

- 接入 D405 RGB、D405 depth 和 UVC RGB 三路视觉。
- 实现 LeRobotDataset v3 episode 录制、保存、丢弃、清洗和安全回放。
- 清洗得到 5 个高质量 episode，共 4379 帧。
- 基于 rollout 数据整理 ACT 叠方块 demo，并将数据接口扩展到 VLA/世界模型方向。

## 10. 简历 Bullet

### 中文版

- 自研 Dummy V2 6DoF 机械臂具身模仿学习系统，完成真机控制、世界坐标示教、多视角 RGB-D 采集、LeRobot v3 数据落盘、仿真预训练和 ACT 策略部署的端到端 demo。
- 设计世界坐标 Jog 示教链路，将人工操作转化为 TCP 任务路线，并通过 posture-biased IK、J6 IMU 姿态残差、关节连续性约束和安全边界过滤生成高质量示范数据。
- 集成 Intel RealSense D405 RGB/Depth 与 UVC 双视角相机，构建 LeRobotDataset v3 数据集，清洗得到 5 个 episode / 4379 帧，包含多路 MP4 视频、Parquet 低维状态和真机 replay metadata。
- 在 Isaac Lab 中构建 Dummy V2 方块操作课程强化学习环境，使用 PPO 训练 Reach/PreGrasp/GraspLift 阶段策略，为真实 ACT/VLA 策略提供仿真 warm-start 和 sim2real 验证。
- 基于 ACT chunked action imitation learning 部署方块抓取/叠放 demo，输入多视角 RGB-D + proprioception，输出未来动作 chunk，并通过 temporal aggregation、CAN 限频和夹爪电流保护实现稳定真机执行。

### English Version

- Built an end-to-end embodied imitation learning demo for a self-developed 6DoF Dummy V2 robotic arm, integrating real-robot control, world-frame teleoperation, multi-view RGB-D sensing, LeRobot v3 dataset recording, Isaac Lab pretraining, and ACT policy deployment.
- Designed a world-coordinate Jog demonstration pipeline that converts human task-space commands into IK-solved robot actions, with posture-biased IK, J6 IMU residual correction, joint-continuity regularization, and workspace safety filtering.
- Integrated RealSense D405 RGB/Depth and an external UVC camera into the control GUI, producing a cleaned LeRobotDataset v3 dataset with 5 episodes / 4379 frames, synchronized MP4 videos, Parquet states/actions, and real-robot replay metadata.
- Developed an Isaac Lab PPO curriculum for cube manipulation, including Reach, PreGrasp, and GraspLift stages, enabling simulation warm-start and sim-to-real validation for downstream imitation policies.
- Deployed an ACT-style chunked action policy for block grasping/stacking, using multi-view RGB-D and proprioceptive inputs to predict future action chunks, with temporal aggregation and hardware-aware safety constraints for stable execution.

## 11. 面试讲解要点

### 为什么这个项目适合具身算法岗位

这个项目不是单点功能，而是一个小型 embodied AI stack：

- 有真实机器人硬件；
- 有多模态数据采集；
- 有主流 LeRobot 数据标准；
- 有仿真和强化学习；
- 有 ACT 模仿学习部署；
- 有 sim2real 和安全执行问题；
- 有后续 VLA/世界模型扩展空间。

### 为什么世界坐标示教重要

世界坐标 Jog 让数据天然带有任务语义。对模仿学习来说，策略学到的是“TCP 应该往哪里走、夹爪什么时候开合”，而不是“操作者如何一点点调每个电机”。这让数据更平滑、更可迁移，也更适合后续接 VLA 的语言目标。

### 为什么 ACT 适合这个 demo

ACT 的 action chunk 能处理低频遥操作和接触任务中的短期时序依赖。叠方块不是每一帧都需要重新规划，很多动作是连续片段：靠近、下探、夹紧、抬升、移动、松开。ACT 直接预测未来一段动作，再用 temporal aggregation 平滑执行，很适合这种任务。

### 为什么还要做 Isaac PPO

真实数据少、接触任务风险高，所以用 Isaac Lab 做课程 RL。PPO 不直接替代 ACT，而是提供：

- 任务阶段设计验证；
- 仿真 rollout；
- 策略 warm-start；
- safety boundary 和 reward shaping 的快速试错。

最终路线是：仿真策略提供先验，真实 LeRobot rollout 提供分布校正，ACT/VLA 负责真实任务执行。

### 失败原因与修复如何回答

可以重点讲三个真实工程问题：

1. **IK 跳解**：等效解导致腕部突然摆动。通过 continuity prior、posture bias、J6 IMU residual 和单帧关节限幅修复。
2. **通信阻塞**：相机、IK、CAN 下发和位置轮询竞争资源。通过实时模式、限频、busy-skip、串口恢复和相机 latest-frame 缓冲修复。
3. **夹爪不稳定**：静摩擦导致策略夹紧失败。通过实测电流阈值、二值夹爪语义、时效保护和 disable 命令修复。

## 12. 后续扩展

- 增加更多任务：开抽屉、搬运、按键、分类放置。
- 扩展语言条件：把 task string 或自然语言指令接入 VLA。
- 训练世界模型：用 rollout 预测未来图像/状态，做 model-predictive control 或失败预判。
- 强化 sim2real：用真实 rollout 估计摩擦、回差、夹爪接触参数，反向校准 Isaac/MuJoCo。
- 数据规模化：将 LeRobot 数据上传到 Hugging Face Hub，配套 dataset card 和 demo video。
