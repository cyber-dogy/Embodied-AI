# research_archive · Agent Workflow

未来 agent 维护 archive 时，默认按下面顺序执行。

## 标准链路

1. 发现新 run、新 milestone 或新文档
2. 先写 archive，再考虑 homepage
3. 对 run 使用 `scripts/archive/solidify_run.py`
4. 对 milestone 使用 `scripts/archive/migrate_existing.py` 或共享库接口
5. 跑 `scripts/archive/validate.py`
6. 先跑 `scripts/archive/render_report_assets.py` 补 item 级 report 图
7. 再跑 `scripts/archive/render_task_showcase_assets.py` 生成任务线级精选图和表
8. 最后才决定是否同步到 homepage

## 展示素材归档规则

- demo 图片统一进入 `media/demo/images/`
- demo 视频统一进入 `media/demo/videos/`
- 任务线手工整理后的图表放 `tasks/<task_id>/media/charts/`
- 任务线手工整理后的表格放 `tasks/<task_id>/media/tables/`
- 由脚本生成的 report 图表同步进入 `tasks/<task_id>/media/charts/auto/`
- 由脚本聚合的表格同步进入 `tasks/<task_id>/media/tables/auto/`
- `tasks/<task_id>/media/demo/` 视为人工精选展示层，不要再用脚本把 run/record 的 demo 批量灌进去
- `homepage/media/tasks/*` 下已有的展示素材也要迁进 `infra/records/`，不要只留在 homepage 目录里
- homepage 图表区默认优先展示 `tasks/<task_id>/media/charts/` 根目录下的手工图；只有根目录没图时，才回退到脚本内置图表或 auto 聚合图

## 训练阶段接入规则

- run 启动时：写初版 archive manifest 和 `start` 事件
- train 完成后：补 `summary.json / logs / source paths`
- audit 完成后：补 `audit_report.json` 并写 `audit_only` 事件
- best path / frozen best 更新后：写 milestone 快照

## 修改边界

- 不删源文件
- 不挪源文件
- 不直接手改 generated 产物
- homepage 与 archive 分层维护：先 archive，后 homepage

## 推荐命令

迁移现有内容：

```bash
python scripts/archive/migrate_existing.py
```

固化单条 run：

```bash
python scripts/archive/solidify_run.py --task-id mdit --run-dir <run_dir>
```

校验：

```bash
python scripts/archive/validate.py
```

补 report 静态图：

```bash
python scripts/archive/render_report_assets.py
```

补任务线级精选图表与表格：

```bash
python scripts/archive/render_task_showcase_assets.py
```
