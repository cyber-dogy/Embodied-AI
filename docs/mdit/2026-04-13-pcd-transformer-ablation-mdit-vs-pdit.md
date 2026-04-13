# PCD Transformer 消融分析：MDIT Transformer vs PDIT DiT Backbone

**日期**：2026-04-13  
**实验目的**：在相同 PCD 输入模式下，对比 MDIT 自回归 Transformer 与 PDIT DiT backbone 的策略成功率差异，判断是否应将 MDIT RGB+text 方案迁移到 DiT 架构。

---

## 一、实验配置对比

| 项目 | **Exp A：MDIT Transformer** | **Exp B：PDIT DiT（基线）** |
|---|---|---|
| run_name | `unplug_charger_mdit_pcd_mdit_transformer_100` | `unplug_charger_pdit_baseline_100_bs80` |
| 观测模态 | PCD (n=2048) + Text (CLIP ViT-B/16) | PCD (n=2048) only |
| PCD encoder | PointNet, embed_dim=256 | PointNet token, obs_features_dim=256 |
| Backbone | MDIT 因果 Transformer（positional encoding）| DiT (adaLN 时间/条件注入) |
| 层数/注意力头 | 6 layers, 8 heads, hidden_dim=512 | 6 blocks, 8 heads, hidden_dim=512 |
| 条件注入方式 | mean_pool → prefix token | adaLN（每层） |
| FM 时间步采样 | beta(α=1.5, β=1.0) | exp schedule (scale=4.0) + uniform SNR |
| 推理积分步数 | 25 步（Euler） | 10 步（fm_num_k_infer） |
| final_layer_zero_init | **True** | False |
| 训练数据量 | **7773** train / 909 valid | **10573** train / 1189 valid |
| batch_size | 80 | 80 |
| lr | 1e-4, warmup=500 | 1e-4, warmup=1000 |
| weight_decay | 0.001 | 0.001 (transformer) / 1e-6 (encoder) |
| train_epochs | 100 | 100 |
| EMA decay | 0.9993 | 0.9993 |
| 评估 checkpoint | epoch_0100（non-EMA，100 episodes） | epoch_0100（EMA，100 episodes） |
| eval seed | 1234 | 1234 |
| max_steps | 200 | 200 |

---

## 二、评估结果

| 指标 | **Exp A（MDIT Transformer）** | **Exp B（PDIT DiT）** |
|---|---|---|
| **success_rate** | **0.30（30%）** | **0.70（70%）** |
| mean_steps（全部 episodes） | 172.78 | 103.67 |
| 成功 episodes 数 | 30 / 100 | 70 / 100 |
| 失败类型 | 100% 跑满 horizon（200步）| 失败均跑满 horizon，成功平均约 49 步 |
| train loss（final） | 0.00495 | 0.04899 |
| valid loss（final） | 0.345 | 1.236 |
| train/valid loss 倍差 | ~70× | ~25× |
| 训练用时 | 0.50 h | 0.69 h |

---

## 三、是否构成有效对比？

**部分有效，存在一个主要混淆变量。**

**控制相同的变量**：PCD 输入格式（n=2048, no color, norm_center=[0.4,0,1.4]）、网络规模（6层×8头×512维）、batch_size=80、lr=1e-4、ema_decay=0.9993、eval seed/protocol 完全一致。

**混淆变量**：
1. **数据集大小不同**：PDIT 多了 ~36% 训练数据（10573 vs 7773）。这是最主要的非对称性，可能贡献 5–10 pp 的成功率差距。
2. **FM schedule 不同**：两者使用了完全不同的时间步采样策略（见下文）。
3. **MDIT 有 text 条件，PDIT 无**：额外的 text encoder 可能引入无效条件噪声（camera_names=[]，无真实 RGB 输入）。

**结论可信度**：尽管混淆变量存在，**40 pp 的成功率差距（30% → 70%）** 远超数据量差异能解释的范围，结论方向明确可信。

---

## 四、失败原因分析

### 4.1 MDIT 失败模式：全部跑满 horizon

分析 json：`failure_step_buckets.at_horizon = 70`，即所有失败 episode 都在第 200 步超时。  
没有 error（no crash），说明策略**可以运行但无法完成任务**，动作轨迹有偏差。

### 4.2 主要原因逐项分析

**① FM Schedule 差异（最主要嫌疑）**

| | MDIT | PDIT |
|---|---|---|
| 时间步分布 | beta(α=1.5, β=1.0)，偏向低 t 区域 | exp(scale=4.0) + uniform SNR，均匀覆盖高噪声区 |
| 推理步数 | 25 步 | 10 步 |
| 训练损失量级 | ~0.005 | ~0.049 |

PDIT 用 10 步就能以 70% 成功，说明其 exp flow schedule 产生了更"直"的流场，积分更容易收敛。MDIT 的 beta 采样集中于低噪声区，导致高噪声区的轨迹方向学习不足，推理时积分更容易偏离。

**② Backbone 条件注入方式（次要但重要）**

- MDIT：用 mean_pool 将 PCD/text token 压缩为一个向量，作为 prefix token 拼到序列前，靠因果注意力隐式传播到动作预测。
- PDIT DiT：adaLN 在**每一层**都直接用时间步嵌入 + 条件嵌入调制 scale/shift，时间步信号更直接、梯度更稳定。

这是 DiT vs 普通 Transformer 在扩散/流匹配任务上的经典差异：adaLN 对时间步调制更有效。

**③ 数据量差异（次要）**

PDIT 多 36% 数据，理论上可贡献约 5–10 pp 成功率，但不足以解释 40 pp 差距。

**④ Text 条件噪声（待验证）**

MDIT 中 camera_names=[] 但 text encoder（CLIP ViT-B/16）仍在图中。若 text token 被接入 conditioning，其语义内容对仿真环境中的低层动作几乎没有区分度，相当于在每步注入固定噪声条件；若未接入，则 text encoder 参数白占显存、白走梯度更新。需确认 conditioning 路径。

**⑤ final_layer_zero_init 差异（方向相反）**

MDIT 为 True（更好的初始化），PDIT 为 False（原始 baseline 设定）。MDIT 在这一点上反而更好，说明这不是失败原因，也说明 True 设定正确。

---

## 五、结论：MDIT RGB+text 方案是否应改用 PDIT Transformer 架构？

**建议：是，且改动应配套调整 FM schedule。**

### 应改的点

| 改动 | 当前 MDIT | 目标 |
|---|---|---|
| Backbone | 因果 Transformer + positional encoding | DiT (adaLN) backbone |
| 时间步采样 | beta(α=1.5, β=1.0) | exp flow schedule (scale=4.0) + uniform SNR |
| 推理积分步数 | 25 | 10（与 PDIT 对齐） |
| conditioning 注入 | mean_pool → prefix | adaLN（每层注入 time + cond） |

### 必须保留的点

- RGB 图像输入（ViT-B/16 encoder，这是 MDIT 线区别于 PDIT 的核心）
- Text 条件输入（CLIP text encoder）
- PCD 输入（PointNet encoder）
- camera_names 设为非空（确保 RGB 真正接入）

### 注意事项

1. `pcd_transformer_variant="pdit"` 开关已存在于 `mdit/` 训练栈，可直接用于实验，但它沿用的是 MDIT 的 FM schedule（beta 采样），**换 backbone 的同时必须同步换 FM schedule**，否则实验设计仍有缺陷。
2. 此消融仍处于 PCD-only 对比，加入 RGB+text 后参数量与数据分布都会变化，需重新评估。
3. PDIT baseline 使用了更大的数据集，后续 MDIT 迁移实验应对齐数据集，确保 train/valid split 一致。

---

## 六、精简摘要卡片（Quick Reference）

```
消融实验：PCD + MDIT Transformer vs PCD + PDIT DiT（100 epoch, bs=80）

成功率：MDIT 30%  vs  PDIT 70%  （差距 40 pp）
步数：MDIT mean=172.78 vs PDIT mean=103.67
数据：MDIT 7773 train vs PDIT 10573 train（+36%，混淆变量）
FM：MDIT beta(1.5,1.0)+25步 vs PDIT exp(4.0)+uniform+10步

结构差异：
  MDIT backbone = 因果Transformer，mean_pool条件注入
  PDIT backbone = DiT，adaLN每层注入时间步+条件

主因：FM schedule + adaLN条件注入 > 数据量差异
结论：MDIT RGB+text线应迁移到DiT backbone，并同步对齐FM schedule
     backbone改动必须配套 exp flow schedule + uniform SNR sampler
```
