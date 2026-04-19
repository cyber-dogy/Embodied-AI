# LeLaN fixes.md — LeLaN 专线事实留痕

## 写入方式

**LeLaN 专线相关改动开始前，先读这份文档。**

每次发现 bug、完成修复、训练结束、离线审计完成或确认执行链问题后，都在文末追加一条记录。格式固定为：

`### YYYY-MM-DD HH:MM:SS ±TZ · 简明标题`

并保持四个字段：

- `范围`：涉及的 LeLaN 文件、脚本或文档
- `背景`：问题或现象为什么值得记录
- `处理`：本次实际改了什么或确认了什么
- `结果`：当前结论、关键指标、产物路径、后续状态

补充要求：

- 这份文档只记录 LeLaN 线自己的事实，不承担跨线路总结职责。
- 如果结论会改变整个项目的研究判断，再提炼到 `docs/research_desk.md`。
- 标题要能单独说明“这条记录在讲什么”，不能只写文件名。
- 结果尽量写清 `run_name / checkpoint / success rate / 下一步状态`，避免只写“待观察”。

## 记录

### 2026-04-19 00:20:07 +0800 · 建立 LeLaN 专属文档骨架与自动留痕入口
范围：`docs/lelan/README.md + docs/lelan/fixes.md + docs/lelan/research_journal.md + docs/lelan/best_path.md + docs/lelan/2026-04-19-lelan-execution-manual-zh.md + docs/lelan/research/README.md + research/lelan_trial_runner.py + research/lelan_autoresearch_loop.py`

背景：LeLaN 之前已经有执行计划和单次实验记录约定，但还没有像 `mdit` 那样稳定的 `fixes / research_journal / best_path / execution manual` 四层文档骨架。后续修复和 run 结果如果只留在代码、ckpt 或零散说明里，很容易再次出现“事情做了但证据没跟上”的断层。

处理：新增 LeLaN 专属文档入口与执行手册；把 `train_only`、`audit_only` 结果自动追加到 `docs/lelan/research_journal.md` 和 `docs/lelan/fixes.md`；在 `research/lelan_autoresearch_loop.py` 中补上 winner 写入 `docs/lelan/best_path.md` 的逻辑。

结果：从现在开始，LeLaN 线拥有与 `mdit` 对齐的稳定文档骨架。后续修复、训练、审计和 winner 选择都会在 `docs/lelan/` 下留下可追踪证据，而不是只散落在 run 目录中。

### 2026-04-19 00:20:07 +0800 · LeLaN 对齐 MDIT/PDIT 已确认的关键工程 bug
范围：`lelan/model/transformer.py + lelan/model/objectives.py + lelan/config/schema.py + lelan/train/checkpoints.py + lelan/train/runner.py + lelan/cli/eval_checkpoint.py + tests/test_lelan_model_contracts.py + tests/test_lelan_eval_cli.py + tests/test_lelan_runtime_and_trial_runner.py`

背景：LeLaN 最初是从旧 `mdit` 线上改出的分支，因此继承了部分后来已经在 `mdit` / PDIT 历史中确认过的工程问题，包括 DiT 输出层零初始化缺失、gripper loss 被 10 维均值稀释、resume 对旧 optimizer state 不兼容、以及离线评估分桶把规划器拒绝和仿真器错误混在一起。

处理：补齐 `output_proj` 零初始化；把 `loss_total` 改为 `xyz + rot6d + grip` 分项加权聚合并暴露 `objective.loss_weights`；将 `resume` 过程改成先校验 optimizer state 兼容性，再安全恢复 scheduler/scaler 并回写 `dataset_stats`；把 `V-REP/CoppeliaSim side -1` 统一归到 `planning_runtime_error`，避免误报为 `simulator_runtime_error`。

结果：LeLaN 当前已补齐这批已知硬 bug，对齐到当前正确的 `mdit` 语义。后续行为结果需要继续靠正式 run 和审计来确认，但至少训练、恢复和离线分析不再停留在旧 bug 版本。
