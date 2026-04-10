# 接力清单

最后更新：2026-04-11

## 1. 当前接力总览

- 当前继续分支：`autoresearch/20260409-mdit`
- 旧机器上的训练已经手动停止
- `archive/` 已删除
- `ckpt/` 已按“只留关键产物”做过清理
- 当前磁盘空间安全，不再处于爆盘状态
- 新设备是 `24GB RTX 5090`
- 新设备没有 `RLBench / CoppeliaSim` 评估环境
- 新设备只负责 `train-only`
- 行为评估必须回到有 RLBench 的机器做 `audit-only`

如果要在新设备继续，代码仍然从 git 获取：

```bash
cd /path/to/autodl_unplug_charger_transformer_fm
git fetch origin
git checkout autoresearch/20260409-mdit
git pull --ff-only
```

环境迁移说明仍然看：

- `docs/2026-04-10-5090-migration-checklist.md`
- `docs/2026-04-10-5090-environment-setup.md`

注意：

- 上面两份文档继续保留英文环境说明
- 真正的“下一步实验怎么跑”，以本文件为准

## 2. 当前 MDIT 已知结论

### 当前最好的 MDIT 结果

- faithful MDIT baseline：`0.40 @ 20 episodes`
- 这是当前已知最好的 `mdit` screening 结果
- 对照参考：
  - `pdit` 当前基线是 `0.85 @ 100 episodes`

### 已经跑过并且可以直接定性的实验

- faithful baseline
  - 结论：能稳定训练和 rollout，但明显弱于 `pdit`
  - 指标：`0.40 @ 20`

- `cam_front_wrist_100`
  - 结论：比 baseline 更差
  - 指标：`0.35 @ 20`

- `cam_all5_100`
  - 结论：明显失败，不再继续
  - 指标：`0.00 @ 20`

- `dropout0_100`
  - 结论：直接淘汰
  - `best_valid.pt = 0.15 @ 20`
  - `latest.pt = 0.10 @ 20`
  - 说明：这条不是评估挂了，而是真实 rollout 大多数 episode 跑满 `200` 步仍失败

### `obs3_100` 的真实情况

- `obs3_100` 不能按“模型不行”来判失败
- 它不是行为差，而是训练到中途 checkpoint/container 写坏
- 训练日志显示它在写 checkpoint 前已经正常训练到 `epoch 37` 左右
- 当前结论：
  - `obs3` 仍然应当视为正确方向
  - `obs3_100` 必须在新的轻量 checkpoint 策略下重跑

### 当前已经确认的先验

- `obs3` 视为已确认优于 `obs2`
- 后续默认基线直接用 `obs3`
- 不再把 `obs2` 作为主 baseline 或主要搜索方向

## 3. 后续统一执行原则

### 指标口径

- `100 epoch` screening：看 `success@20`
- `500 epoch` deep run：看 `success@100`
- 目标不变：
  - 最终要拿 `mdit` 去严格比较并尝试超过当前 `pdit` 的 `0.85 @ 100 episodes`

### screening 晋级规则

- screening 不再使用旧的硬阈值淘汰
- 不再用 `0.55 / 0.65 / 0.68` 那套阈值卡死 100-epoch 阶段
- screening 只按分数排名：
  - 按 `success@20` 从高到低排序
  - 取前 `2` 个进入 `500 epoch + 100 episode`
- 如分数接近，再用“改动更简单”作为 tie-breaker

### 默认训练方向

- `obs3` 固定为新的默认基线
- 短训默认开启 `AMP`
- 正式 screening 前先做一次显存校准 smoke

### 新设备显存策略

- 新设备是 `24GB 5090`
- 不再沿用旧 `4070 12GB` 的 `9-10GB` 显存目标
- 在新设备上应当自动校准：
  - `batch_size`
  - `grad_accum_steps`
  - `AMP`
- 目标是在不 `OOM`、不出现 `NaN/Inf` 的前提下，把吞吐推到稳定上限
- `9-10GB` 只作为旧机器的参考，不作为新机器目标

## 4. CKPT 与磁盘规则

### 短训 `100 epoch`

- 评估完成后删除全部 `.pt`
- 只保留：
  - trial 结论 JSON
  - `audit_report.json`
  - `summary.json`
  - `config.json`
  - `dataset_stats.json`
  - `trial_request.json`
  - log

### 长训 `500 epoch`

- 只保留：
  - `epoch_0100.pt`
  - `epoch_0200.pt`
  - `epoch_0300.pt`
  - `epoch_0400.pt`
  - `epoch_0500.pt`
  - `best_success.pt`
- 不保留：
  - `best_valid.pt`
  - `latest.pt`

### 磁盘安全原则

- 同时最多只允许一个 active `mdit` run
- screening run 一旦完成 audit，立刻清理 `.pt`
- 磁盘空间接近危险线时，先停实验，再清理，不要硬顶着继续跑
- `obs3_100` 这次写坏，已经说明 checkpoint 写入策略本身有风险
- 恢复实验前，先做 checkpoint 轻量化

## 5. 继续任务前，必须先完成的代码改动

下面这些改动要先做，再正式恢复 `mdit` autoresearch：

1. 把 `obs3` 设为默认基线  
2. 把 screening 改为纯排名晋级  
3. 把 `mdit` checkpoint 改成轻量化保存  
4. screening audit 完成后自动删 `.pt`  
5. 增加 `AMP + 显存校准 smoke`  

说明：

- 当前 `obs3_100` 的失败，本质上已经足够说明“先修 checkpoint 策略，再继续跑”
- 不建议直接用旧配置在新机器上无脑重开

## 6. 下一轮实验顺序

下一轮固定按这个顺序推进：

1. `obs3_amp_smoke_1ep`
2. `obs3_amp_baseline_100`
3. `layers8_obs3_amp_100`
4. `rope_obs3_amp_100`
5. `uniform_t_obs3_amp_100`
6. `vision_last_block_obs3_amp_100`
7. `lr3e5_obs3_amp_100`

然后：

- 按 `success@20` 排名前二
- 前二进入 `500 epoch + 100 episode`
- deep run 才保留 periodic ckpt 和 `best_success.pt`

## 7. 新设备与评估机的工作分工

### 新设备：只训练

- 新设备没有 RLBench / CoppeliaSim
- 所以新设备不要跑 `phase full`
- 新设备只跑：
  - `train-only`

训练命令模板：

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/faithful_baseline.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name <实验名> \
  --description "<中文说明>" \
  --set n_obs_steps=3 \
  --set use_amp=true
```

说明：

- 正式恢复前，不要再使用旧的 `phase full`
- `obs3` 应该直接通过 `--set n_obs_steps=3` 或默认配置来固定

### 评估机：只审计

- 把新设备训练产出的 run 目录同步回评估机
- 然后在有 RLBench 的机器上执行：
  - `audit-only`

评估命令模板：

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<run_name> \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress
```

如果是 deep run，改成：

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<run_name> \
  --eval-episodes 100 \
  --audit-timeout-sec 21600 \
  --headless \
  --show-progress
```

## 8. 旧机 / 新机都还值得保留的参考

### 关键记录

- loop summary：
  - `autoresearch_records/mdit_autoresearch_loop_mdit_screen_20260409.json`
- faithful baseline 记录：
  - `autoresearch_records/unplug_charger_mdit_faithful_v1__mdit_faithful_baseline_100__e0100__20260409_183119.json`
- 日志目录：
  - `autoresearch_records/logs/`

### 关键脚本

- 单试验入口：
  - `scripts/run_mdit_autoresearch_trial.py`
- 循环入口：
  - `scripts/run_mdit_autoresearch_loop.py`

## 9. 一句话诊断

- faithful MDIT 已经不是“跑不通”，而是“能跑，但当前默认配方明显不够强”
- `dropout0` 已经证明不是正确方向
- `obs3` 仍然是最值得优先推进的方向
- 下一轮真正要做的不是盲目继续试，而是先把：
  - `obs3`
  - `AMP`
  - 轻量 checkpoint
  - screening 后自动清理 `.pt`
  这四件事定住，再恢复 autoresearch
