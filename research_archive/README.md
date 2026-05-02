# research_archive

`research_archive/` 是当前仓库的统一留档根，用来长期保存训练证据、结构化摘要和后续可直接给 homepage / 专题页消费的报告素材。

## 目标

- 不删除、不移动现有训练产物。
- 通过“复制小证据 + 索引大产物”的方式，把散落在 `ckpt/`、`autoresearch_records/`、`docs/`、`homepage/media/` 的内容整理成统一入口。
- 先把 archive 做成证据层；当前 homepage 仍然继续读取既有 `docs/ + ckpt + autoresearch_records`。

## 目录结构

```text
research_archive/
  README.md
  RULES.md
  AGENT_WORKFLOW.md
  task_index.json
  migration_report.json
  tasks/
    act/
      media/
      notes/
    pdit/
      media/
      runs/
      milestones/
    mdit/
      media/
      runs/
      milestones/
    lelan/
      media/
      runs/
      milestones/
    infra/
      media/
      records/
  templates/
```

每个 `runs/<run_slug>/` 固定包含：

- `archive_manifest.json`
- `sources.json`
- `events.jsonl`
- `notes/`
- `metrics/`
- `media/demo/images/`
- `media/demo/videos/`
- `media/charts/`
- `media/tables/`
- `artifacts/index.json`
- `report/report.md`
- `report/assets/`

每个 `tasks/<task_id>/media/` 还会额外维护一层聚合素材：

- `media/demo/images/`
- `media/demo/videos/`
- `media/charts/`
- `media/tables/`

其中：

- `media/demo/` 是任务线展示层，后续你手工补 demo 直接放这里
- `media/charts/` 与 `media/tables/` 根目录优先留给手工整理后的展示素材
- `media/charts/auto/` 与 `media/tables/auto/` 才是脚本自动聚合层，会按 `bucket/slug/` 再分层

也就是说，后续如果你想给某条任务线补展示图：

- demo 放 `tasks/<task>/media/demo/...`
- 手工图表放 `tasks/<task>/media/charts/...`
- 自动生成图不要手工塞到根目录，而是让脚本进 `tasks/<task>/media/charts/auto/...`

## 常用命令

先做一次现有内容迁移：

```bash
python scripts/archive/migrate_existing.py
```

只看会迁移什么，不真正写文件：

```bash
python scripts/archive/migrate_existing.py --dry-run
```

对单条 run 做 post-run 固化：

```bash
python scripts/archive/solidify_run.py \
  --task-id mdit \
  --run-dir ckpt/<run_dir> \
  --trial-record autoresearch_records/<run_name>.json
```

校验 archive 结构：

```bash
python scripts/archive/validate.py
```

补 report 级静态图：

```bash
python scripts/archive/render_report_assets.py
```

这条命令除了更新 `report/assets/`，也会把图表同步整理到 `media/charts/auto/`。

补任务线级精选图表与表格：

```bash
python scripts/archive/render_task_showcase_assets.py
```

这条命令会把 `PDIT / MDIT` 当前对外最值得展示的主图和结构化表格写到：

- `tasks/<task>/media/charts/`
- `tasks/<task>/media/tables/`

## 当前约束

- 大 checkpoint 默认只做索引，不复制。
- 兄弟仓库材料暂时只保留引用位，不在本轮迁移中复制外部大文件。
- archive v1 不改变现有训练链和 homepage 发布链。
- `homepage/media/tasks/*` 下已有的 demo 素材会迁移到 `infra/records/`，作为平台与展示素材的统一归档入口。
- homepage 现在会优先读取任务级 archive demo；手工补到 `tasks/<task>/media/charts/` 的静态图，也可以直接接入任务页图表区。
