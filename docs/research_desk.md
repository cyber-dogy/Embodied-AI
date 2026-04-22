# research_desk.md — 研究进展总账本

## 写入方式与边界

这份文档服务于 `homepage` 和项目阶段汇报，目标是把跨线路的重要进展整理成可公开提炼、可快速复盘的工作报告，而不是把每天的操作过程重新抄一遍。新材料应先进入 `fixes.md` 或各线路稳定文档，再由人工提炼成阶段结论写入这里；只有会改变研究判断的事项才进入本账本，例如主线建立、主线冻结、共享审计结论、路线淘汰、训练或评估链关键修复、续训或接管恢复、执行规范定版。

同一天、同一线路、同一主题的多个微小修复要在这里压缩成一条阶段进展，不保留一 bug 一条的流水账。`research_desk.md` 允许维护“当前总览”，时间线部分默认按时间顺序在末尾追加；如果后续需要去重或合并旧条目，只能做压缩整理，不能改写已经形成的历史结论。`fixes.md` 继续保持追加式事实留痕，不承担公开总结职责。

为保证回溯一致性，历史迁移条目如果原始材料只有日期、没有时分秒，统一使用 `12:00:00 +0800` 作为整理占位时间，表示“该日内已经确认的阶段结论”，不表示实验就在该精确时刻发生。

## 命名翻译约定

- `obs` -> `观测`
- `pcd` -> `点云`
- `rgb+text` -> `RGB+文本`
- `lane_a_mainline` -> `主线锚点`
- `lane_a_stabilized` -> `稳定化对照`
- `lane_b_faithful` -> `faithful 对照`
- `lane_c_mtdp_strict` -> `严格 MTDP 对照`
- `success@20` -> `20 回合成功率`
- `success@100` -> `100 回合成功率`

## 当前总览

### PDIT 主线

PDIT 现在仍是全仓库最稳定的行为锚点。训练链、保存链和离线审计链修稳后，点云 baseline 在 `100 epoch` 上先证明“不是学不会”，在 `500 epoch` 上又通过补评估保住了 `0.95` 的最佳行为结果，根目录重整后的 `100 回合成功率` 复核仍有 `0.85`。同时，数据统计增强路线已经因为语义 bug 被作废，`dropout=0.0 + 最终层零初始化` 这条 DiT 动力学候选虽然到过 `0.65@100`，但还没有足够证据替代当前锚点。

### MDIT 主线

MDIT 当前最稳的早期锚点仍是 `0.55@100` 的 RGB+文本主线。稳定化对照弱于主线，faithful 对照的首轮失败被确认是缓存和网络问题，严格 MTDP 对照没有通过共享闸门；在此基础上，同一路线的 `100 -> 500 epoch` 续训已经完成共享审计，并给出 `0.75@300` 与 `0.75@500` 的新结果，说明长训确实把行为上限抬了上去。不过这次 `500 epoch` 审计缺失了 `epoch_0100` 点位，trial 仍被自动标成 collapse，因此当前更准确的任务不是再开新线，而是补齐共享审计叙事。

#### MDIT 主线为什么能成功

当前这条 `0.55@100 -> 0.75@300/500` 的 MDIT 主线，本质上不是“faithful 复现 MTDP 后自然成功”，而是“把 `PDIT` 已经证明有效的骨干、控制语义和评估链保住，只把输入从点云换成 `5RGB + text`”。压缩后最关键的成功原因有 5 条：

1. **只改输入侧，不动已经验证过的骨干和执行语义**：`DiT backbone -> action output -> RLBench 共享动作后处理` 这条链保持 `PDIT` 语义，避免在输入替换时同时把控制链也改坏。
2. **RGB+文本条件没有直接粗暴展平，而是先做分阶段适配再压成 `3-token` 条件序列**：这让多相机、文本和状态信息能进入主线骨干，同时又不破坏 `PDIT` 对条件 token 的使用方式。
3. **视觉编码器采用 `5` 路独立 CLIP 且只微调最后一个 block**：多相机特征不会被过早共享，参数量和训练不稳定性又被控制在可训范围内。
4. **Flow Matching 与推理链继续沿用主线里已经稳定的工程设定**：当前主线没有走 `MTDP` 的 `beta` 采样、`RoPE` 和 `100-step Euler`；而是使用 `uniform timestep sampling + exp flow schedule + 10-step inference`，这条路径在现有训练栈和 rollout 链里更稳。
5. **长训对这条主线是真正有效的**：`100 epoch` 先把成功率抬到 `0.55`，继续训练到 `300/500 epoch` 后又稳定到 `0.75`，说明这条方法不是“早期偶然对齐”，而是能够持续受益于更长预算。

#### MDIT 与 PDIT 的关键不同

这条 MDIT 主线与 `PDIT` 的关系可以概括成一句话：**差异主要集中在输入侧，骨干、输出和评估契约尽量保持一致。** 具体差异主要有 4 条：

1. **输入模态不同**：`PDIT` 主线是点云输入；当前 MDIT 主线是 `5RGB + text + robot_state`。
2. **观测编码器不同**：`PDIT` 更接近 `点云/状态 -> 条件 token`；MDIT 则是 `5 路 CLIP 视觉特征 + 文本投影 + 状态适配 -> step fusion -> 3 cond tokens`。
3. **主线研究目标不同**：`PDIT` 是稳定行为锚点；MDIT 是在不破坏骨干与评估语义的前提下，把感知输入升级为 `RGB+文本`。
4. **训练比较口径不同**：PDIT 已经是成熟对照组，MDIT 的所有结论都应该解释成“在同一骨干与共享审计链下，输入替换是否带来可持续收益”，而不是拿它去做和 `PDIT` 完全独立的另一套方法学叙事。

相对 `multitask_dit_policy` 原版，当前 MDIT 主线的关键技术调整可以压缩成 5 点：

1. **条件组织改成 `3-token` 序列，而不是全局 conditioning vector**：原版把 `robot state + 多相机 CLS + text` 在时间维展平成单个全局条件向量；当前主线改成“每个观测步 1 个 cond token”，最终只向 backbone 提供 `3` 个条件 token。
2. **输入融合改成分阶段适配，而不是直接 concat flatten**：当前主线先做 `5` 路独立 CLIP 视觉编码、`last block` 微调、文本投影和状态适配，再在 step 内融合；这比原版更偏 `PDIT` 的条件组织，而不是 `MTDP` 的原生 observation encoder 语义。
3. **骨干从单塔 DiT 改成了更接近 PDIT 的 encoder-decoder DiT**：原版更像“动作序列 + conditioning vector”的单塔噪声预测器；当前主线先编码 cond tokens，再用 decoder 生成动作轨迹，控制语义已经明显向 `PDIT` 靠拢。
4. **FM 动力学没有沿用原版的 `beta` 采样与长 ODE 积分**：当前主线去掉了 `beta timestep sampling`，使用 `uniform` 采样、`exp` flow schedule 和 `10-step` 推理，而不是原版更强调的 `beta + 100-step Euler` 路径。
5. **时序、归一化和执行口径整体工程化重构**：当前主线采用 `3 obs / 32 pred`，没有沿用原版 `2 obs / 100 horizon`；同时保留现有主线的 legacy 状态归一化和共享动作后处理链，而不是原版那套严格的 `state/action min-max + 原生推理接口`。

### LeLaN 执行线

LeLaN 当前的重点仍是把执行链路固化成可长期追加的自动研究流程，而不是抢先做更激进的结构搜索。训练、评估、EMA 兼容、离线审计和 `100/300/500 epoch` 闸门规则已经定版，但正式 run 的行为结果还没有形成足够强的阶段结论，需要后续补齐。

### 基础设施

当前最重要的共性收敛不是再补一个日志文件，而是把“事实留痕”和“阶段总结”彻底分层。`fixes.md` 继续做事实源，`research_desk.md` 承担跨线路阶段总结，`docs/mdit/research_journal.md`、`docs/mdit/best_path.md` 以及各线路稳定文档继续保存可回查证据；homepage 后续应优先从这里提炼公开叙事，再回到底层事实源查细节。

## 统一时间线

## 2026-04-08 09:00:00 +0800 - PDIT 主线 - 100 epoch 离线审计确认修复后 baseline 不再“学不会”

发现问题：在修复训练、保存和审计链之前，PDIT 的低成功率很难解释清楚，到底是任务本身太难，还是工程链路把本来可用的策略压坏了。

原因分析：如果没有一条修复后的短周期基线先跑通并通过离线审计，后续所有关于结构、数据和优化器的讨论都会继续混在“链路是否可信”这个更底层的问题里。

解决思路：先用修复后的 `100 epoch` baseline 做一次最直接的共享审计，验证工程修复之后策略是否已经能稳定完成任务，而不是继续在不可信的训练栈上猜原因。

具体操作：对修复后的 `100 epoch` baseline 执行 `20 回合成功率` 审计，确认 `epoch_0100` 达到 `0.90`，即 `18/20` 成功，`mean_steps（成功与失败回合的平均执行步数）= 79.55`；同时保留 `best_metric（验证损失最优值）= 0.6605`、`best_epoch = 31` 这些训练侧事实，用来和行为结果分开解释。

当前判断：这一轮审计把问题从“PDIT 学不会”改写成“修复工程链后它其实能学起来，而且已经明显超过最低可用门槛”。从这里开始，PDIT 的研究重点不再是证明可训练性，而是进一步追稳定性和长期泛化。

相关材料：[baseline_100 审计记录](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_100__e0100__20260408_002048.json)；[baseline_100 审计日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/logs/baseline_100_audit.log)；[PDIT 恢复进展](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/pdit/2026-04-08-fm-recovery-progress-zh.md)

## 2026-04-08 12:00:00 +0800 - PDIT 主线 - 500 epoch 主线通过补评估保住长期行为锚点

发现问题：`500 epoch` 主线训练完成后，原始的全量 audit sweep 一度因为超时看起来像失败，如果直接把这件事解释成训练崩溃，就会把已经跑出来的长期主线误判为无效。

原因分析：长程 checkpoint 扫描当时比单点补评估更脆弱，而 `500 epoch` 主线真正重要的是关键 checkpoint 的行为结果有没有被保住，而不是第一次 sweep 是否完整结束。

解决思路：不把超时直接当成 collapse，而是把关键 checkpoint 的成功率逐个补齐，只要长期主线的关键行为证据还在，就继续把它作为行为锚点保存下来。

具体操作：保留 `500 epoch` 主线训练产物后，补回 `epoch_0100/0200/0300/0400/0500` 的关键成功率，形成 `0.75 / 0.80 / 0.90 / 0.80 / 0.95` 的阶段曲线；其中 `epoch_0500` 的人工评估达到 `0.95`，`mean_steps = 68.55`，后续对 `best_success.pt` 再做 `100 回合成功率` 复核仍有 `0.85`。

当前判断：PDIT 不仅在短周期上恢复了可训练性，也在长周期上保住了可复核的行为锚点。后续新路线如果不能在同等级别的行为证据上超过这条主线，就不应该轻易替换它。

相关材料：[baseline_500 审计报告](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/audit_report.json)；[epoch_0500 人工评估](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/epoch_0500_manual_eval.json)；[100 回合复核](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json)

## 2026-04-08 13:00:00 +0800 - PDIT 主线 - 数据统计增强路线被确认掺入观测语义错误，原有通过闸门的结果作废

发现问题：最初“数据统计 + 数据增强”路线在 `100 epoch` 上一度拿到 `0.55`，表面上像是一条勉强可保留的候选，但这条结果后来被发现不能直接支持结构结论。

原因分析：这条路线的空间增强实现把机器人状态前九维当成三个普通三维点处理，导致平移不仅作用在位置，也错误作用到了 `rot6d（六维旋转表示）` 基向量上。这样得到的结果掺入了观测语义错误，不是一次干净的配方比较。

解决思路：先修正增强语义，再重跑同一路线；只有在 bug 修掉后结果仍然成立，才有资格被解释成“数据统计增强有价值”。

具体操作：修正空间增强后，只让平移作用在位置量，让旋转只作用在 `rot6d` 表示；随后重跑这条路线，修正后的 `100 epoch` 审计只剩 `0.35`，低于主线闸门，而 `best_valid（验证损失最优 checkpoint）` 的行为结果甚至降到 `0.0`。

当前判断：原来那条 `0.55` 结果不能再作为“数据统计增强可行”的证据，应该被解释为被 bug 污染的历史记录。PDIT 后续不能再把这条路线当成结构改进支撑，只能把它作为一次重要的排雷工作归档。

相关材料：[原始数据统计增强审计记录](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_stats_aug_100__e0100__20260408_103914.json)；[修正后重跑审计记录](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h1_fixed_stats_aug_100__e0100__20260408_124213.json)；[PDIT 恢复进展](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/pdit/2026-04-08-fm-recovery-progress-zh.md)

## 2026-04-08 14:00:00 +0800 - PDIT 主线 - DiT 动力学改良候选达到 0.65@100，但还不能直接替代 baseline

发现问题：在 baseline 已经恢复后，项目需要判断晚期漂移有没有结构层面的改良方向，而不是只知道“当前基线能跑”。

原因分析：单看验证损失，`dropout = 0.0` 和最终层零初始化这组改法看起来更接近官方 DiT 动力学设定，但如果没有行为审计支撑，就仍然不能判断它是否真的优于当前主线。

解决思路：把这组动力学改法单独拉成一条候选线，用同样的 `100 epoch` 行为审计检验它是否真比现有主线更强，同时观察 `best_valid` 是否仍然可靠。

具体操作：对这条候选执行 `100 epoch` 审计，`epoch_0100` 达到 `0.65`，`mean_steps = 105.45`；但同一次审计里，`best_valid` 对应 checkpoint 的行为结果是 `0.0`。这说明 `best_metric（最优验证损失）` 并不能直接当成最佳行为代理，行为审计仍然必须独立保留。

当前判断：这条动力学候选证明“结构改进方向值得继续研究”，但它还没有完成对 `500 epoch` 行为锚点的替代。PDIT 当前仍应以 baseline 为主线，把这条路线当成有前景但证据未闭环的候选。

相关材料：[DiT 动力学候选审计记录](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__h2_dit_dynamics_100__e0100__20260408_114130.json)；[DiT 动力学候选审计日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/logs/h2_dit_dynamics_100_audit.log)；[PDIT 恢复进展](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/pdit/2026-04-08-fm-recovery-progress-zh.md)

## 2026-04-09 12:00:00 +0800 - PDIT 主线 - 点云 baseline 恢复为行为锚点

发现问题：PDIT 早期的低成功率同时混杂了训练、保存和离线审计链路的问题，导致当时很难判断是策略学不会，还是工程链路把原本可用的结果压坏了。

原因分析：导入路径污染、检查点非原子保存、`audit-only` 阶段覆盖 bug 和 RLBench 审计脆弱性叠加在一起，使同一批 checkpoint 的训练现象和审计结果不能按同一口径解释。

解决思路：先把训练、保存和审计三条链修稳，再用同一套离线审计口径重新复核 baseline，只有工程链可信后，结构改动和泛化结论才有比较价值。

具体操作：修复训练与审计链后，保留 `500 epoch` 主线结果，并对同一 `best_success.pt` 做 `20 回合成功率` 与 `100 回合成功率` 复核；同时把原本容易散落在不同日志里的 checkpoint 结果统一收束到稳定文档和清单中。

当前判断：PDIT 已经从“能不能学起来”的问题，转成“后期泛化能否继续稳定”的问题。点云 baseline 继续是整个仓库的行为锚点，后续任何新路线都应先与这条线对齐再比较。

相关材料：[PDIT 恢复进展](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/pdit/2026-04-08-fm-recovery-progress-zh.md)；[训练模型审计](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/pdit/2026-04-07-training-model-audit-zh.md)；[checkpoint 清单](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/top10-checkpoint-manifest.json)

## 2026-04-12 12:00:00 +0800 - LeLaN 执行线 - 自动研究链路与 100/300/500 闸门定版

发现问题：LeLaN 当时更缺的是训练、评估、选模和留痕的统一入口，而不是立即继续做新的结构尝试；没有固定执行口径时，即使跑出结果也难以稳定复用。

原因分析：动作后处理、EMA 评估、训练内成功率评估和离线审计产物此前没有被收进同一执行规范里，导致每轮实验都在重复补脚手架，结果也很难积累成连续档案。

解决思路：先把工程执行链和晋级门槛固定下来，把结构搜索后移，避免在基础链路还不稳定时就把一次实验的好坏解释成方法优劣。

具体操作：定版 `100/300/500 epoch` 闸门，固定 `n_action_steps（单次推理输出的动作步数）= 8`、`smooth_actions（动作平滑）= true`，并把训练内成功率评估与离线 `eval_ckpt（评估专用 checkpoint）` 两条路径的产物要求写进执行计划。

当前判断：LeLaN 现在首先是一条“执行线”，目标是把正式实验沉淀成可长期追加的研究档案；在 `100 epoch` 结果没有越过闸门前，不应优先把预算投入更激进的结构改动。

相关材料：[LeLaN 执行计划](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/lelan/2026-04-12-lelan-autoresearch-execution-plan-zh.md)；[LeLaN 研究记录约定](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/lelan/research/README.md)

## 2026-04-13 20:03:04 +0800 - MDIT 主线 - 早期兼容排查确认混合消融不能直接支持结构结论

发现问题：MDIT 早期在 RGB、点云、PDIT backbone、PDIT 条件路径等多种改动之间来回排查时，表面上虽然不断有训练现象和验证损失，但很难说明到底是哪一个因素真正起作用。

原因分析：许多早期实验同时改变了观测模态、条件注入方式和评估语义，得到的是“混合改法”的表现，而不是 faithful MDIT 自身的干净证据；如果直接拿这类结果下结论，主线会越来越模糊。

解决思路：先停止把混合消融当成主线证据，把问题拆成“哪条路径更接近 faithful MDIT 语义”和“哪条路径与共享审计口径兼容”两个维度，再回到可解释的默认基线。

具体操作：回看 RGB 与点云兼容、损失解释和评估路径问题后，明确把 `obs（观测）`、`pcd（点云）`、PDIT 兼容路径与 faithful MDIT 分开记录，不再用混合路线的一次成功或失败直接支持结构判断。

当前判断：MDIT 不能靠“把能跑的东西拼起来”推进；后续所有结论都必须建立在单一路径、单一评估语义和清晰命名上，否则主线会再次失真。

相关材料：[PDIT 与 MDIT 定位对照](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/pdit-vs-mdit.md)；[修复留痕总表](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/fixes.md)

## 2026-04-15 11:51:34 +0800 - MDIT 主线 - faithful RGB+文本默认路径与共享评估口径定版

发现问题：在这一步之前，MDIT 主线仍混入了点云兼容默认路径、PDIT 语义残留和 EMA 默认分支，导致“当前到底在跑什么配方”无法一句话说清。

原因分析：如果默认训练入口同时兼容多条历史路径，任何成功率变化都无法判断究竟来自 faithful RGB+文本主线，还是来自兼容层偶然产生的配方漂移。

解决思路：把默认路径彻底收回到 faithful `文本 + 5 路 RGB + MDIT + Flow Matching`，并把不属于主线的路径全部降级为显式对照，让训练入口、评估入口和执行手册重新对齐。

具体操作：将默认配置回收到 faithful `text + 5RGB + MDIT + FM`，移除主线上的 EMA、PDIT、点云默认分支；同时让 `5RGB` 主线、共享审计、研究日志和执行手册收束到同一入口。

当前判断：从这一步开始，MDIT 主线终于拥有可以持续复现和解释的默认配方；后续任何锚点、对照和长训结果，才开始具有真正的可比性。

相关材料：[修复留痕总表](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/fixes.md)；[MDIT 执行手册](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/2026-04-16-mdit-execution-manual.md)

## 2026-04-16 23:30:00 +0800 - MDIT 主线 - 共享评估契约与后台守护链固化为标准执行方式

发现问题：即便主线配方已经回收完成，只要训练口径、评估口径、冠军冻结和后台接管没有锁死，后续 run 依然会因为配方漂移或中断恢复而失去继承关系。

原因分析：早期 autoresearch 缺少明确的训练契约、评估契约和冠军固定路径，结果虽然能跑出来，却不容易被托管，也不适合拿来做严格对照。

解决思路：把“如何训练、如何审计、如何冻结冠军、如何恢复后台运行”一起固化为主线基础设施，而不是让每一轮候选自己定义规则。

具体操作：引入 `eval_contract（评估契约）`、`recipe_contract（训练配方契约）` 和训练心跳文件，让 checkpoint、`experiment_manifest.json`、共享 audit、watchdog 和 `best_path.md` 共同保存同一条主线定义。

当前判断：MDIT 从这一步起不再只是零散实验集合，而是一条可托管、可恢复、可比较的研究线；后面的锚点冻结和续训接管才有真正可追踪的 lineage。

相关材料：[MDIT 执行手册](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/2026-04-16-mdit-execution-manual.md)；[MDIT 研究日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/research_journal.md)；[当前主线路径](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/best_path.md)

## 2026-04-17 11:05:36 +0800 - MDIT 主线 - 共享审计确认 0.55@100 锚点并冻结当前最佳路线

发现问题：当时需要一条已经过共享审计链验证的 RGB+文本锚点，否则后续所有候选都没有统一参照物，也很难决定谁该继续推进。

原因分析：训练完成并不等于主线成立，只有在同一共享 audit 口径下确认关键 checkpoint 的成功率，并把最优结果冻结下来，主线才不会被后续搜索和清理覆盖。

解决思路：先用共享审计链确认 `epoch_0050` 与 `epoch_0100` 的行为结果，再把当前最佳 checkpoint、关键 epoch 和稳定别名一起冻结，让后续候选必须在同口径下超过它。

具体操作：对主线锚点执行 `20 回合成功率` 审计，确认 `epoch_0050 = 0.25`、`epoch_0100 = 0.55`，随后冻结 `best_success.pt`、`best_valid.pt`、`epoch_0050.pt` 和 `epoch_0100.pt`，并更新 `best_path.md`。

当前判断：`0.55@100` 是当前唯一经过共享审计链确认的 RGB+文本锚点。后续路线可以继续挑战，但必须先在同一口径下超过它，否则都只能算对照线。

相关材料：[MDIT 研究日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/research_journal.md)；[当前主线路径](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/best_path.md)；[修复留痕总表](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/fixes.md)

## 2026-04-17 17:21:30 +0800 - MDIT 对照线 - 稳定化与 faithful 对照完成分流，主线不再被弱候选带偏

发现问题：在主线锚点出现后，仍需要确认稳定化对照和 faithful 对照到底是在挑战主线，还是只是在制造更多噪声；如果这一步不及时分流，主线会被多个弱候选反复打断。

原因分析：稳定化对照虽然想解决 horizon exhaustion，但共享审计显示它的行为更弱；faithful 对照的首轮失败则来自 Hugging Face 缓存与网络加载，而不是方法本身已经被证明无效。

解决思路：用同一共享审计链先判定稳定化对照是否真的优于主线，再把 faithful 首轮失败从“方法失败”纠正回“启动链失败”，避免错杀可继续验证的路线。

具体操作：完成稳定化对照的 `epoch_0050/epoch_0100 @ 20 episodes` 审计，确认 `epoch_0100 = 0.35`，低于主线锚点 `0.55`；同时为 faithful 对照强制启用本地缓存优先的离线模式，修复模型权重加载阶段的外网握手超时。

当前判断：稳定化对照已经被判定为弱线，不再作为主方向推进；faithful 对照可以继续保留为正式对照，但它的首轮失败不能被解释成结构结论。主线从这一天开始重新收束，而不是继续发散。

相关材料：[MDIT 研究日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/research_journal.md)；[修复留痕总表](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/fixes.md)

## 2026-04-18 00:57:23 +0800 - MDIT 对照线 - 严格 MTDP 对照未过共享闸门

发现问题：在稳定化和 faithful 对照之后，项目需要回答一个更强的问题：严格 MTDP 语义在当前共享评估链下是否真的值得替代现有 RGB+文本主线。

原因分析：如果没有把 MTDP 的全局条件、RoPE backbone 语义和状态或动作归一化一起纳入同一条验证线，就很容易把“像 MTDP 的局部改动”误当成对 MTDP 的正式判断。

解决思路：单独建立严格 MTDP 对照线，用共享闸门做正式验证；只要它没有在同一口径下越过当前锚点，就立即停止扩张预算，并把研究焦点收回到最佳路线。

具体操作：建立严格 MTDP 对照线并完成共享审计，结果没有通过当前闸门；同时记录配方漂移信息，确认这次失败不是一条可以直接升级为新主线的结果。

当前判断：严格 MTDP 对照已经完成“值得不值得继续投入”的首轮回答，目前结论是否定的。项目不再把预算继续铺在这条线上，而是回到唯一已过审的 RGB+文本主线。

相关材料：[MDIT 研究日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/research_journal.md)；[修复留痕总表](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/fixes.md)

## 2026-04-18 09:00:55 +0800 - MDIT 主线 - 恢复 100→500 续训接管

发现问题：严格 MTDP 对照未过闸门后，理论上应该立即把预算收回到当前最佳路线继续长训，但实际接管时暴露出旧 checkpoint 的优化器状态和当前参数顺序不兼容，后台还会误把旧心跳当成新进度。

原因分析：早期的续训链假设旧 optimizer state 可以直接恢复，这在 `100 epoch -> 500 epoch` 的长训接力里并不可靠；同时 watchdog 对活跃训练的判定过宽，出现了“看起来已接管、其实没有真正推进”的假象。

解决思路：把最佳路线的续训兼容和后台监督器一起修通，确保接管不是形式上的补记，而是真正能继续推进 `500 epoch` 的主线动作。

具体操作：为续训恢复增加优化器状态形状校验，在旧 Adam 动量错绑时只恢复模型、EMA 和步数；重新计算 scheduler 当前学习率，并让后台监督器只认真实 Python 训练进程，避免旧心跳造成误判。

当前判断：MDIT 现在最重要的工作已经明确，不是再开更多相似候选，而是把当前最佳路线稳定推进到 `500 epoch` 并完成共享审计。主线终于从筛选期进入长训接管期。

相关材料：[MDIT 研究日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/research_journal.md)；[当前主线路径](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/best_path.md)；[修复留痕总表](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/fixes.md)

## 2026-04-18 23:16:42 +0800 - 基础设施 - 建立 research desk 作为 homepage 的阶段总结总账本

发现问题：`fixes.md` 继续追加之后逐渐同时承担了事实留痕、自动状态流和阶段总结三种职责，读者需要先跨过大量日志样式条目才能看见真正改变研究判断的节点，homepage 也只能从偏机械的记录里反向猜主线叙事。

原因分析：事实源和总结源长期没有分层，导致同一天的大量小修复会淹没真正重要的路线变化；跨线路进展也只能散落在 `fixes.md`、`research_journal.md` 和各线路稳定文档中，缺少一份适合公开提炼的总账本。

解决思路：保留 `fixes.md` 作为事实账本，新建人工维护的 `research_desk.md` 负责跨线路阶段总结，并让 homepage 优先读取这份总账本，再回到底层事实源查细节。

具体操作：固定 `时间戳 - 线路中文名 - 事件标题` 模板，并约束 `发现问题`、`原因分析`、`解决思路`、`具体操作`、`当前判断`、`相关材料` 六段结构；同时让 homepage 的全局时间线、当前焦点候选和 `infra-audit` 页面优先从 `research_desk.md` 提炼摘要。

当前判断：从现在起，项目形成了 `fixes.md` 记事实、`research_desk.md` 做阶段总结、各线路稳定文档保留证据的三层文档结构。后续 homepage 整理应先看 `research_desk.md`，需要回查细节时再落到 `fixes.md` 和分线路文档。

相关材料：[修复留痕总表](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/fixes.md)；[MDIT 研究日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/research_journal.md)；[Homepage 维护规则](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/homepage/MAINTENANCE.md)

## 2026-04-19 09:00:36 +0800 - MDIT 主线 - 100→500 主线续训完成共享审计并把长训结果抬到 0.75

发现问题：`100 epoch` 锁定锚点之后，MDIT 一直缺一条真正跑完并完成同口径共享审计的长训主线。没有这一步，项目虽然知道当前最优是 `0.55@100`，却仍无法回答“同一路线继续训到 `300/500 epoch` 后能不能真正变强”。

原因分析：此前最关键的障碍不是模型本身，而是接管链路和共享审计叙事都不完整。严格 MTDP 对照未过闸门后，接管器确实把预算收回到了最佳 RGB+文本路线，但旧优化器状态不兼容、watchdog 假接管和续训 run 缺失 `epoch_0100` 审计点位，都会让长训结果看起来像“没有真正接上”。

解决思路：先把 `100 -> 500 epoch` 的续训接管跑通，再用同一套共享 audit chain 把长训主线的关键点位补齐。只要 `300/500 epoch` 的行为结果能在同口径下稳定超过 `0.55@100`，就说明这条主线不只是能做早期锚点，而是具备继续深挖的价值。

具体操作：对 `unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723` 完成共享离线审计，记录到 `autoresearch_records`；当前审计结果给出 `epoch_0300 = 0.75`、`epoch_0500 = 0.75`，最佳共享成功率为 `0.75@300`。同时保留自动审计的异常标记：因为这条续训 run 没有回填 `epoch_0100` 的共享结果，trial 仍被自动写成 `trial_score = -1.0 / collapse = true`，但这已经不该再被解释成“长训失败”。

当前判断：MDIT 现在最重要的新结论不是“续训已经恢复”，而是“同一条 RGB+文本主线在共享审计下已经从 `0.55@100` 抬到了 `0.75@300/500`”。后续工作重点不再是继续开相似对照，而是补齐 `epoch_0100` 点位、收束共享审计叙事，并把这条长训结果稳定固化为新的阶段证据。

相关材料：[500 续训审计记录](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/autoresearch_records/unplug_charger_mdit_rgb_text_3token_100__lane_a_mainline_500_resume__e0500__20260418_005723.json)；[MDIT 研究日志](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/mdit/research_journal.md)；[修复留痕总表](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/docs/fixes.md)
