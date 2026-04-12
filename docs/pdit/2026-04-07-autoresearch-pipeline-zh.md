# FM/DiT 自主研究流程

## 变更内容

- `scripts/` 和 `cli/` 入口现在优先强制导入本仓库的根目录模块，而不是工作区里的同名外部项目。
- 训练默认参数已调整为更安全的研究行为：
  - `resume_from_latest = false`
  - `checkpoint_every_epochs = 100`
  - `best_valid.pt` 现在是标准的最佳验证检查点名称。
- 检查点保存现在是原子的，以避免 `latest.pt` 写入损坏。
- FM 导入不再依赖于仅用于扩散的包，除非明确请求扩散策略。
- 添加了新的单实验入口点：
  - `scripts/run_autoresearch_trial.py`
  - `autodl-run-autoresearch-trial`

## 实验运行器

新的实验运行器支持三种兼容的阶段：

1. `--phase full`
   - 一个命令中先训练再审计
2. `--phase train-only`
   - 仅训练，不触及 RLBench
3. `--phase audit-only`
   - 稍后在新进程中审计已训练的运行

本项目的推荐工作流程现在是：

1. `train-only`
2. 等待运行完成
3. 从单独的进程运行 `audit-only`
4. 让审计实例化 `best_success.pt`，写入 `audit_report.json`，并清理非必要文件

关键输出字段：

- `trial_score`
- `pending_offline_audit`
- `offline_audit_command`
- `success_100`
- `success_300`
- `success_500`
- `collapse_detected`
- `best_ckpt_path`
- `kept_ckpt_paths`

## 示例命令

仅训练冒烟测试：

```bash
/home/gjw/miniconda3/envs/pfp_env/bin/python scripts/run_autoresearch_trial.py \
  --phase train-only \
  --config configs/fm_autodl_lab.json \
  --stage-epochs 2 \
  --checkpoint-every 1 \
  --experiment-name smoke
```

对现有运行的离线审计：

```bash
/home/gjw/miniconda3/envs/pfp_env/bin/python scripts/run_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<run_name>
```

基线 500 轮训练：

```bash
/home/gjw/miniconda3/envs/pfp_env/bin/python scripts/run_autoresearch_trial.py \
  --phase train-only \
  --config configs/fm_autodl_lab.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --experiment-name baseline_500
```

## 日志和记录

- `results.tsv`
  - 用于自主研究的轻量级实验台账
- `autoresearch_records/<run_name>.json`
  - 每次实验的机器可读结果，即使失败的运行目录被删除也会保留
- `<run_dir>/audit_report.json`
  - 对存活运行的详细成功率/验证损失审计
- `<run_dir>/trial_request.json`
  - `audit-only` 使用的清单，用于复现离线评估设置

`results.tsv`、`run.log` 和 `autoresearch_records/` 通过 `.git/info/exclude` 在本地排除。

## 当前已知阻塞问题

真实的 `pfp_env` 冒烟测试现在可以到达 FM 训练并正确写入检查点，但 RLBench 检查点审计阶段在以下情况之后仍可能卡住：

- 训练已经完成
- `eval_all_checkpoints.py` 发现了检查点
- 模拟器报告已启动

为了防止离线审计无限期挂起，实验运行器支持：

```bash
--audit-timeout-sec <seconds>
```

在超时或其他审计失败时：

- 运行目录被保留
- 当前的 `best_valid.pt` 和周期性检查点保留
- JSON 输出设置 `pending_offline_audit = true`
- 相同的 `offline_audit_command` 可以稍后重试

## 推荐的下次运行顺序

1. 运行干净的 500 轮基线 `train-only`。
2. 当 CoppeliaSim 环境稳定时，单独启动 `audit-only`。
3. 使用相同的两步模式开始 H1-H4 筛选计划。
