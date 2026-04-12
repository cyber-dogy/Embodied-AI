# 2026-04-12 MDIT Autoresearch 执行计划

## 0. 执行纪律

本文档是执行手册，不是讨论稿。

执行 agent 必须严格照本文档执行，默认没有自行思考和改写权限。除非本文档明确允许，否则一律禁止：

- 自行修改训练方向
- 自行修改阈值
- 自行修改相机配置
- 自行修改 `obs_steps`
- 自行修改 `n_action_steps`
- 自行修改评估 episode 数
- 自行修改 ckpt 保留/删除策略
- 自行扩展搜索空间
- 自行引入新结构方案

如遇异常，只允许按本文档中的“排查顺序”处理，不能擅自提出新结构方向。

所有训练必须放在 `tmux` 后台，不允许挂在 SSH 前台。

所有筛选必须以 `success@20` 为准，不允许以 `best_valid.pt`、`valid loss`、或局部截图代替。

## 1. 本轮目标

本轮主线固定为：

- `5RGB + obs3`
- `vision.use_separate_encoder_per_camera = true`
- `vision.train_mode = "last_block"`
- `horizon = 32`
- `n_action_steps = 8`
- `smooth_actions = true`
- `command_mode = "first"`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`
- `objective.sigma_min = 0.001`
- `objective.num_integration_steps = 25`

本轮必须同时执行以下判断，不允许 agent 自己总结或弱化：

- 当前 `valid loss` 反弹现象和 PDIT 历史相似，但不能据此直接判定模型无效。
- 当前 MDIT 的问题不是先改 transformer 主体，而是先降低视觉漂移、坚持 success-based 选模、固定 rollout 读出方式。
- `last_block` 是本轮必要的降风险动作，但不是单独充分条件。
- 如果不同时执行 `success@20` gate、`n_action_steps=8`、动作后处理和 success 选模，仅改 `last_block` 不足以保证成功率提升。

## 2. 为什么本轮先不改 transformer 主体

当前 `mdit/model/transformer.py` 在结构上基本沿用 `/home/gjw/MyProjects/multitask_dit_policy/src/multitask_dit_policy/model/transformer.py` 的 `DiT + AdaLN-Zero + RoPE` 路线。

因此本轮必须认定：

- 当前 MDIT transformer 更像 `multitask_dit_policy`
- 它不是像当前已经通过 autoresearch 修稳的 PDIT 整体体系
- 不允许 agent 误以为“PDIT 成功是因为 transformer 结构完全不同”
- PDIT 先解决的是训练、评估、审计、选模链路，其次才验证了 `dropout=0.0 + 最终输出层 zero-init` 这类小型结构优化

本轮硬规则：

- 不允许引入 cross-attn
- 不允许重写 conditioning token 流
- 不允许重做 encoder-decoder 结构
- 不允许把本轮失败直接归因为“DiT 主体一定不行”

## 3. 固定默认值

执行 agent 必须使用以下固定默认值：

- `camera_names = [right_shoulder, left_shoulder, overhead, front, wrist]`
- `n_obs_steps = 3`
- `horizon = 32`
- `n_action_steps = 8`
- `vision.use_separate_encoder_per_camera = true`
- `vision.train_mode = "last_block"`
- `vision.resize_shape = [240,240]`
- `optimizer_lr = 2e-5`
- `objective.sigma_min = 0.001`
- `objective.num_integration_steps = 25`
- `smooth_actions = true`
- `command_mode = "first"`
- `position_alpha = 0.35`
- `rotation_alpha = 0.25`
- `max_position_step = 0.03`
- `gripper_open_threshold = 0.6`
- `gripper_close_threshold = 0.4`
- `success_selection_every_epochs = 100`
- `success_selection_episodes = 20`

如果命令行 override 与上表冲突，除非本文档明确允许，否则视为错误命令。

## 4. autoresearch 默认搜索空间

本轮 screening 只允许 3 条分支，且只有 3 条：

1. `rgb5_sep_lastblock_a8_lr2e5_100`
2. `rgb5_sep_lastblock_a8_lr1p5e5_100`
3. `rgb5_sep_lastblock_a8_dropout0_100`

每条分支只允许做以下改动：

### A. `rgb5_sep_lastblock_a8_lr2e5_100`

- 基线
- 不额外改动

### B. `rgb5_sep_lastblock_a8_lr1p5e5_100`

- 只改 `optimizer_lr = 1.5e-5`

### C. `rgb5_sep_lastblock_a8_dropout0_100`

- 只改 `transformer.dropout = 0.0`

本轮明确禁止：

- 不允许加第 4 条 screening 分支
- 不允许测试 `all finetune`
- 不允许测试 `shared encoder`
- 不允许改 `5RGB`
- 不允许改 `obs3`
- 不允许把 `n_action_steps` 改回 `1` 或 `16`
- 不允许 agent 自己追加新的 override

## 5. 100 / 300 / 500 Epoch 闸门

所有判断都按 `success@20` 执行。

### 5.1 100 epoch

- `100 epoch` 必须跑 `20 episodes`
- 如果 `success@20 < 0.45`：立即停止该分支，禁止续到 `300`
- 如果 `success@20 >= 0.45`：允许续到 `300`

### 5.2 300 epoch

- `300 epoch` 必须继续跑 `20 episodes`
- 如果 `success@20 < 0.55`：立即停止该分支，禁止续到 `500`
- 如果 `success@20 >= 0.55`：允许续到 `500`

### 5.3 500 epoch

- `500 epoch` 目标是 `success@20 >= 0.60`

明确禁止：

- 不允许因为 `valid loss` 更低而跳过 `success gate`
- 不允许因为某个 checkpoint 的 `best_valid.pt` 好看而保留失败分支
- 不允许把 `best_valid.pt` 当作主选模依据

## 6. 如果主线 100epoch 全失败

只有当 3 条 `last_block + a8` 的 `100 epoch` screening 分支全部 `< 0.45` 时，才允许进入下一轮结构候选。

下一轮结构候选只允许 2 项：

- `transformer.dropout = 0.0`
- `output_proj zero-init`

明确禁止：

- 不允许直接上 cross-attn
- 不允许直接重构 observation encoder
- 不允许直接修改 AdaLN 路径
- 不允许跳过 100epoch screening

必须向执行 agent 明确说明：

- “PDIT 成功的已验证结构改动只有小范围的稳定性修正，不存在已证实必须大改 MDIT transformer 才能学会的结论。”

## 7. 训练内评估与离线评估 ckpt

训练存在两条互斥路径：

### 7.1 有 RLBench 环境

- `enable_success_rate_eval = true`
- 每 `100 epoch` 做一次 `20 episode` success eval
- 写 `success_eval_history.json`
- 写 wandb success 指标
- 写或更新 `best_success.pt`

### 7.2 没有 RLBench 环境

- `enable_success_rate_eval = false`
- 训练过程完全不依赖 RLBench
- 每 `100 epoch` 产出一个轻量 `eval_ckpt`
- 路径固定为 `ckpt/<run_name>/eval_ckpts/epoch_XXXX.pt`

固定语义：

- `eval_ckpt` 不是 resume ckpt
- resume 只看 `latest.pt`
- `latest.pt` 必须使用 `checkpoint_payload_mode = full`

## 8. 显存探测

正式训练前必须先做一次 `1 epoch` 探测。

执行规则：

1. 主线 recipe 完全不变
2. 固定 `grad_accum_steps = 1`
3. 只允许改变 `batch_size`
4. `batch_size` 依次试：
   - `12 -> 16 -> 20 -> 24 -> 28 -> 32 -> 64 -> 128`
5. 第一次 OOM 立刻停止，回退到上一档
6. 上一档就是正式 `100 epoch` 使用的 batch size

明确禁止：

- 不允许为了追求大 batch 改小图像
- 不允许为了追求大 batch 改相机数
- 不允许为了追求大 batch 改 `obs_steps`

目标显存区间：

- `20GB ~ 22GB`

补充规则：

- 如果稳定超过 `23GB` 但没 OOM，也不建议继续加 batch
- 如果低于 `18GB`，必须继续上调 batch，除非下一档直接 OOM

显存探测结果必须写入研究记录，格式固定为：

- `batch_size X -> 显存 Y GB -> 是否稳定`

监控命令：

```bash
watch -n 1 "nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free,utilization.gpu --format=csv,noheader,nounits | awk -F, '{printf \"GPU: %s | Total: %.2f GB | Used: %.2f GB | Free: %.2f GB | Util: %s%%\\n\", \$1, \$2/1024, \$3/1024, \$4/1024, \$5}'"
```

## 9. 磁盘与检查点清理规则

本轮默认原则：

- 除了最终最优主路线外，其他分支默认按“保留结论，不保留大文件”处理。

### 9.1 非最优分支

在完成该 checkpoint 的 success eval，并且结果已经写入以下位置后，周期性 ckpt 可以删除：

- `wandb`
- `success_eval_history.json`
- `audit_report.json`

失败分支不需要长期保留完整 `epochs/` 目录。

失败分支最多保留：

- `config.json`
- `experiment_manifest.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json`
- `audit_report.json`
- 如有 `latest.pt` 可选保留一个，否则可删除

### 9.2 成功但不是最终主路线的分支

- 评估完成后允许清理大部分周期性 ckpt
- 只保留能说明结论的最小证据集
- 不要求完整保留全部 epoch ckpt

### 9.3 最终最优主路线

必须保留：

- `best_success.pt`
- `latest.pt`
- 对应 run 目录下的 `config.json`
- `experiment_manifest.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json`
- `audit_report.json`

如果空间允许，可保留少量关键 epoch ckpt，例如：

- `epoch_0100.pt`
- `epoch_0300.pt`
- `epoch_0500.pt`

但仍不要求保留所有周期性 ckpt。

### 9.4 明确禁止

- 不允许在评估前删除待评估 ckpt
- 不允许删除最终最优主路线的 `best_success.pt`
- 不允许只保留 `best_valid.pt` 而删除 `best_success.pt`

## 10. 训练命令

### 10.1 有 RLBench 环境：完整 autoresearch loop

必须放到 `tmux` 里跑，不能直接挂 SSH 前台。

```bash
tmux new -s mdit_ar_lastblock_a8

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_loop.py \
  --tag mdit_a8_gate100 \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --device cuda \
  --headless \
  --show-progress \
  --audit-timeout-sec 10800
```

跑起来后脱离：

```bash
Ctrl-b d
```

重连：

```bash
tmux attach -t mdit_ar_lastblock_a8
```

执行 agent 必须检查以下配置没有被改坏：

- `enable_success_rate_eval=true`
- `success_selection_every_epochs=100`
- `success_selection_episodes=20`
- `save_latest_ckpt=true`
- `checkpoint_payload_mode=full`

补充规则：

- 如果启用了“评估后删除 periodic ckpt”，必须确认 `best_success.pt` 仍能正常生成
- 删除 periodic ckpt 的行为只能发生在该 checkpoint 已完成 success eval 之后

### 10.2 没有 RLBench 环境：train-only + 轻量 eval_ckpt

这种情况不要跑 full loop，因为本机做不了 RLBench 审计。

```bash
tmux new -s mdit_train_only_a8

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_lastblock_a8__$(date +%Y%m%d_%H%M%S)"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name rgb5_sep_lastblock_a8_train_only_100 \
  --run-name "$RUN_NAME" \
  --description "5RGB obs3 last_block a8 train-only without RLBench" \
  --set enable_success_rate_eval=false \
  --set offline_eval_ckpt_every_epochs=100 \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=\"full\"
```

跑完后应该至少看到：

- `ckpt/<RUN_NAME>/latest.pt`
- `ckpt/<RUN_NAME>/eval_ckpts/epoch_0100.pt`
- `ckpt/<RUN_NAME>/experiment_manifest.json`

### 10.3 续训

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

RUN_NAME="unplug_charger_mdit_rgb5_sep_lastblock_a8__<YOUR_RUN_NAME>"

python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/obs3_rgb5_sep_lastblock_a8_gate100.json \
  --stage-epochs 300 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name rgb5_sep_lastblock_a8_resume \
  --run-name "$RUN_NAME" \
  --description "resume last_block a8 mainline" \
  --set resume_from_latest=true \
  --set save_latest_ckpt=true \
  --set checkpoint_payload_mode=\"full\"
```

## 11. 离线 audit 与本地评估命令

### 11.1 对完整 run 做 audit-only

```bash
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm

python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<RUN_NAME> \
  --eval-episodes 20 \
  --audit-timeout-sec 10800 \
  --headless \
  --show-progress
```

`audit-only` 会自动识别：

- `epochs/`
- 或 `eval_ckpts/`

### 11.2 单个 ckpt 评估

```bash
python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<RUN_NAME>/eval_ckpts/epoch_0100.pt \
  --episodes 20 \
  --max-steps 200 \
  --headless \
  --show-progress \
  --device cuda \
  --prefer-ema
```

### 11.3 旧 checkpoint 兼容方式

```bash
python scripts/eval_mdit_checkpoint.py \
  --ckpt-path ckpt/<OLD_RUN>/epochs/epoch_0300.pt \
  --episodes 20 \
  --max-steps 200 \
  --headless \
  --show-progress \
  --device cuda \
  --prefer-ema \
  --set n_action_steps=8 \
  --set smooth_actions=true \
  --set command_mode=\"first\" \
  --set position_alpha=0.35 \
  --set rotation_alpha=0.25 \
  --set max_position_step=0.03 \
  --set gripper_open_threshold=0.6 \
  --set gripper_close_threshold=0.4
```

## 12. 每轮结束后必须检查的文件

执行 agent 每轮都必须核对：

- `config.json`
- `experiment_manifest.json`
- `summary.json`
- `dataset_stats.json`
- `success_eval_history.json`
- `audit_report.json`
- `best_success.pt`，如果该分支通过了 success eval
- `latest.pt`，如果该分支允许 resume
- `eval_ckpts/`，如果该分支走的是无 RLBench 训练路径
- `wandb` 中对应的 success 曲线是否存在

明确规则：

- 如果这些文件不齐，不能宣称该轮实验“完成”

## 13. 自排查顺序

训练或评估失败时，必须按这个顺序查，不允许跳步：

1. 先查 import / environment / requirements
2. 再查 checkpoint payload 和 resume / eval 兼容
3. 再查 success-eval 是否被错误关闭或错误触发
4. 再查 batch size / AMP / OOM / GPU 利用率
5. 最后才考虑模型结构本体

补充规则：

- 如果出现“valid loss 反弹 + success 很差”，默认先怀疑：
  - `all finetune` 导致视觉特征漂移
  - success-based 选模没有真正执行
  - rollout 配置与训练 recipe 不一致
- 默认不要第一时间归因为 transformer 结构失败

## 14. 常见误操作

- 不要在没有 RLBench 的机器上直接跑 `--phase full`
- 不要把 `eval_ckpt` 当成 resume ckpt
- 不要漏掉 `tmux`
- 不要把 `best_valid.pt` 当作主选模依据
- 不要把旧的 `n_action_steps=1` ckpt 直接原样上线评估，至少加上 `--set n_action_steps=8`
- 不要在未完成 success eval 前删除待评估 ckpt
- 不要因为磁盘紧张而删除最终主路线的 `best_success.pt`

## 15. 研究记录要求

每次正式实验结束后，在 `docs/mdit/research/` 下新增一份中文记录，文件名固定为：

- `YYYY-MM-DD-mdit-<run_name>-zh.md`

必须包含 6 个标题：

1. `背景`
2. `本轮改动`
3. `执行命令`
4. `环境`
5. `结果`
6. `结论与下一步`

其中 `本轮改动` 不能只写“调了超参”，必须写清楚旧值和新值。

显存探测也必须记入研究记录，格式固定为：

- `batch_size X -> 显存 Y GB -> 是否稳定`

## 16. 文档验收标准

如果其他 agent 改动本文档，复核人必须检查以下条件全部满足：

- 文档里必须出现 `last_block` 的明确理由，而不是只写“推荐”
- 文档里必须明确写出“当前 MDIT transformer 更像 multitask_dit_policy，不是更像 PDIT 当前成熟体系”
- 文档里必须明确写出“PDIT 解决问题首先靠工程链路修复，其次才是小型结构修正”
- 文档里必须新增磁盘与 ckpt 清理规则
- 文档里必须明确“除了最优主路线，其他分支默认清理大 ckpt，只保留结论和必要证据”
- 文档里必须明确禁止 agent 自己扩搜索空间
