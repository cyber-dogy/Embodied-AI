# research_archive 规则

## 复制规则

- 始终复制：`.md .json .jsonl .yaml .yml .csv .tsv .png .jpg .jpeg .webp .gif .svg .mp4 .webm .pdf`
- 日志文件 `.log/.txt`：仅当文件大小 `<= 50MB` 时复制
- 默认不复制：`.pt .pth .ckpt .bin .safetensors`
- 任意 `> 200MB` 文件默认不复制
- 不复制的大文件必须写入 `artifacts/index.json`

## 命名规则

- `task_id` 固定使用：`pdit / mdit / lelan / infra`
- `run_slug` 统一格式：`YYYY-MM-DD__run_name_or_stage`
- `milestone_slug` 统一格式：`YYYY-MM-DD__milestone_name`
- 不直接把中文长标题或临时说明塞进 slug

## 事件规则

`events.jsonl` 中每条事件至少要包含：

- `timestamp`
- `event_type`
- `task_id`
- `run_name` 或 `milestone_name`
- `source_run_dir` / `source_doc` / `source_dir`

推荐事件类型：

- `start`
- `train_only`
- `audit_only`
- `solidify`
- `milestone`
- `record`
- `migration`

## 媒体命名

- report-ready 素材放 `report/assets/`
- demo 图片放 `media/demo/images/`
- demo 视频放 `media/demo/videos/`
- 手工整理后的展示图表放任务级 `tasks/<task_id>/media/charts/`
- 手工整理后的展示表格放任务级 `tasks/<task_id>/media/tables/`
- 脚本自动聚合的图表统一放任务级 `tasks/<task_id>/media/charts/auto/`
- 脚本自动聚合的表格统一放任务级 `tasks/<task_id>/media/tables/auto/`
- 原始 `csv/tsv/json` 指标仍优先保留在 `metrics/`
- 每个 archive item 内的 `media/` 是证据层；任务根目录下的 `tasks/<task_id>/media/` 是聚合浏览层
- 任务级 `media/demo/` 采用人工精选维护，不自动从 run / record 批量同步
- 任务级 `media/charts/` 与 `media/tables/` 根目录不再塞自动聚合结果，避免把手工展示素材和脚本产物混在一起
- 若源目录已有合理层级，优先保留相对路径，不再重命名

## 禁止事项

- 不删除源文件
- 不移动源文件
- 不直接手改由脚本生成的 `task_index.json` / `migration_report.json`
- 不把 archive 当成 ckpt 备份盘

## report/report.md 固定写法

- 背景
- 本次验证什么
- 核心结果
- 当前判断
- 证据索引
- 后续动作
