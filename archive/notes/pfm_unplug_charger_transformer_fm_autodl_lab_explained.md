# `pfm_unplug_charger_transformer_fm_autodl_lab.ipynb` 结构说明

这份文档说明当前这条 **成功跑通的 AutoDL 主训练 notebook** 对应的模型结构、输入输出、训练语义和关键超参。

对应 notebook:
- [pfm_unplug_charger_transformer_fm_autodl_lab.ipynb](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb)

对应核心代码:
- [pointnet_tokens.py](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/lib/pointnet_tokens.py)
- [dit_backbone.py](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/lib/dit_backbone.py)
- [fm_policy.py](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/lib/fm_policy.py)
- [train_utils.py](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/lib/train_utils.py)

## 1. 任务与数据

- 任务: `unplug_charger`
- 观测模态: 点云 `pcd`
- 训练数据:
  - `data/unplug_charger/train`
  - `data/unplug_charger/valid`
- 每个样本的主要张量:
  - `pcd`: `(B, T_obs, P, C)`
  - `robot_state_obs`: `(B, T_obs, 10)`
  - `robot_state_pred`: `(B, T_pred, 10)`

当前默认 notebook 参数:
- `n_obs_steps = 3`
- `n_pred_steps = 32`
- `n_points = 4096`
- `use_pc_color = False`
- `obs_features_dim = 256`
- `y_dim = 10`

其中 `robot_state` 的 10 维语义是:
- `xyz`: 3 维
- `rot6d`: 6 维
- `gripper`: 1 维

## 2. 总体模型主线

当前主线不是 U-Net，也不是原来 shared `TransformerForDiffusion` wrapper 版，而是这条：

`PointNetObsTokenEncoder -> DiTTrajectoryBackbone -> FMTransformerPolicy`

含义是:
- `PointNetObsTokenEncoder` 把每个观测时刻的点云编码成 observation token
- `DiTTrajectoryBackbone` 负责根据条件 token 和当前轨迹状态做 transformer 预测
- `FMTransformerPolicy` 提供 Flow Matching 的训练目标和 ODE 推理

## 3. 输入输出张量

### 3.1 Observation encoder 输入

`PointNetObsTokenEncoder.forward(pcd, robot_state_obs)`

输入:
- `pcd`: `(B, T_obs, P, C)`
- `robot_state_obs`: `(B, T_obs, 10)`

其中:
- `B`: batch size
- `T_obs = 3`
- `P = 4096`
- `C = 3` 或 `6`

### 3.2 Observation encoder 输出

输出 `cond_tokens`:
- 形状: `(B, T_obs, cond_dim)`

这里的 `cond_dim` 由两部分组成:
- 点云编码特征 `embed_dim = 256`
- 当前观测时刻的机器人状态 `10`

所以默认:
- `cond_dim = 256 + 10 = 266`

也就是:
- `cond_tokens.shape = (B, 3, 266)`

### 3.3 Transformer backbone 输入

`DiTTrajectoryBackbone.forward(sample, timestep, cond_tokens)`

输入:
- `sample`: `(B, 32, 10)`
  - 在 FM 里它对应 `z_t`
- `timestep`: `(B,)` 或标量
  - 在 FM 里它对应连续时间 `t`，再乘 `pos_emb_scale`
- `cond_tokens`: `(B, 3, 266)`

### 3.4 Transformer backbone 输出

输出:
- `(B, 32, 10)`

在 FM 语义里它表示:
- 对整段未来轨迹的 **velocity prediction**

## 4. Observation encoder 细节

代码位置:
- [PointNetObsTokenEncoder](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/lib/pointnet_tokens.py)

每个观测 token 的形成方式是:

1. 对每个 observation step 的点云单独过 PointNet
2. 得到一个 256 维点云特征
3. 与同一时刻的 `robot_state_obs(10维)` 拼接
4. 形成一个 266 维 token

所以这版并不是把历史观测 flatten 成一个 `global_cond`，而是显式保留为 3 个时序 token。

这点和原始 U-Net 版最大的差异是:
- U-Net 版更像“一个整体 global condition”
- 这版 transformer 更像“一个 observation token 序列”

## 5. DiT 风格 backbone 细节

代码位置:
- [DiTTrajectoryBackbone](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/lib/dit_backbone.py)

### 5.1 默认结构参数

当前 notebook 默认:
- `hidden_dim = 512`
- `time_dim = 256`
- `num_blocks = 6`
- `nhead = 8`
- `dim_feedforward = 2048`
- `dropout = 0.1`
- `activation = gelu`

### 5.2 结构组成

这版 backbone 不是标准 encoder-decoder transformer API，而是更贴近本地 `dit-policy` 风格的实现:

- `cond_proj`
  - 把 observation token 从 `266` 投影到 `512`
- `enc_pos`
  - 给 observation token 加 positional encoding
- `TransformerEncoder`
  - 堆叠 6 层 self-attention encoder
  - 得到多层 `enc_cache`
- `sample_proj`
  - 把 `z_t` 从 `10` 投影到 `512`
- `dec_pos`
  - horizon 方向的可学习位置参数
- `TimeNetwork`
  - 把连续时间 `t` 编成 `hidden_dim=512` 的条件向量
- `TransformerDecoder`
  - 堆叠 6 层 DiT 风格 block
  - 每层用时间条件和 observation cache 做调制
- `FinalLayer`
  - 输出回 `10` 维轨迹空间

### 5.3 为什么说它是 DiT 风格

因为 decoder block 不只是普通 self-attention + MLP，而是用了:
- `ShiftScaleMod`
- `ZeroScaleMod`
- time condition 与 cond token summary 联合调制

这和图像 DiT 里“用条件调制 block”的思路是一致的。

## 6. Flow Matching 策略细节

代码位置:
- [FMTransformerPolicy](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/lib/fm_policy.py)

### 6.1 训练目标

当前采用的是标准 FM 语义，而不是 diffusion noise prediction：

1. 目标轨迹:
- `z1 = robot_state_pred`

2. 初始噪声:
- `z0 = init_noise(batch_size)`

3. 采样连续时间:
- `t ~ Uniform(0, 1)` 或其它 `snr_sampler`

4. 构造中间状态:
- `z_t = t * z1 + (1 - t) * z0`

5. 目标速度场:
- `target_vel = z1 - z0`

6. 网络预测:
- `pred_vel = backbone(z_t, timestep=t*pos_emb_scale, cond_tokens)`

7. 损失:
- `loss_xyz`
- `loss_rot6d`
- `loss_grip`
- `loss_total = xyz + rot6d + grip`

### 6.2 推理方式

推理不是 DDPM scheduler 去噪，而是 ODE 风格积分:

1. 从初始噪声 `z` 开始
2. 取时间序列 `t0, dt = get_timesteps(...)`
3. 每一步:
   - 预测 `vel_pred = backbone(z, t, cond_tokens)`
   - 更新 `z = z + vel_pred * dt`
4. 最终输出整段未来轨迹 `(B, 32, 10)`

### 6.3 关键 FM 默认参数

当前主 notebook 默认:
- `num_k_infer = 10`
- `time_conditioning = True`
- `noise_type = gaussian`
- `noise_scale = 1.0`
- `loss_type = l2`
- `flow_schedule = exp`
- `exp_scale = 4.0`
- `pos_emb_scale = 20`

## 7. 训练与优化设置

来自主 notebook:
- [pfm_unplug_charger_transformer_fm_autodl_lab.ipynb](/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm/notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb)

默认训练设置:
- `TRAIN_EPOCHS = 5000`
- `BATCH_SIZE = 64`
- `TRAIN_GRAD_ACCUM_STEPS = 2`
- 24G fallback:
  - `BATCH_SIZE = 32`
  - `TRAIN_GRAD_ACCUM_STEPS = 4`

默认优化器:
- `AdamW`
- `lr = 1e-4`
- `betas = (0.9, 0.95)`
- `eps = 1e-8`

默认 weight decay:
- transformer backbone: `1e-3`
- obs encoder: `1e-6`

默认调度器:
- cosine
- `warmup_steps = 1000`

稳定性设置:
- `EMA_ENABLE = True`
- `EMA_DECAY = 0.9993`
- `TRAIN_USE_AMP = False` 是 notebook 初始默认
- `GRAD_CLIP_NORM = 1.0`

## 8. Checkpoint 与评估节奏

主 notebook 初始默认口径:
- `VAL_EVERY_EPOCHS = 1`
- `SUCCESS_SELECTION_EVERY_EPOCHS = 50`
- `CHECKPOINT_EVERY_EPOCHS = 50`
- `SAMPLE_EVERY_EPOCHS = 5`
- `SUCCESS_SELECTION_EPISODES = 10`
- `STANDARD_EVAL_EPISODES = 0`

对应产物:
- `latest.pt`
- `best.pt`
- `best_success.pt`
- `epochs/epoch_XXXX.pt`

后续你在云端实际训练时，已经把 success selection 关掉，仅保留 valid 和 periodic checkpoint，这不影响模型结构本身。

## 9. 当前这版和早期版本的核心差异

### 相比 U-Net 版
- 条件不再是 flatten 的 `global_cond`
- 改成 observation token 序列
- backbone 从 `ConditionalUnet1D` 换成 DiT 风格 transformer
- 训练策略仍然是 FM，不变

### 相比早期 `TransformerForDiffusion` wrapper 版
- 不再依赖 shared `transformer_for_diffusion.py`
- 不走 `global_cond -> reshape back`
- 直接以 token 方式进入本地 DiT 风格 backbone
- 结构语义更接近本地 `dit-policy`

## 10. 一句话总结

当前这版成功 notebook 的模型可以概括为：

**用 PointNet 把 3 帧点云观测编码成 3 个 266 维 observation tokens，再用 6-block、512 hidden 的 DiT 风格 transformer，根据连续时间 `t` 和 observation tokens，对 32 步、10 维未来机器人轨迹做 Flow Matching velocity prediction，并通过 ODE 方式推理整段动作轨迹。**
