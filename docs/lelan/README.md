# LeLaN Documentation Map

LeLaN 现在按 `mdit` 的分层方式维护自己的文档，不再只靠单份执行计划和零散 run 记录。

## 稳定文档

- `fixes.md`
  LeLaN 专线的追加式事实账本。每次修复、故障、训练阶段结果、审计结论都先落这里。
- `research_journal.md`
  LeLaN 的 run-by-run 研究日志。train/audit 阶段结果按时间顺序追加。
- `best_path.md`
  当前 LeLaN 已确认最佳路线的单页摘要。只有 winner 改变时才更新。
- `2026-04-19-lelan-execution-manual-zh.md`
  LeLaN 当前固定执行方式、闸门、产物和交接清单。

## 归档目录

- `research/`
  放长篇中文实验记录或后续归档材料。这里不再承担唯一入口职责。

## 维护规则

- LeLaN 专线改动前，先读 `docs/lelan/fixes.md` 和当前执行手册。
- LeLaN 的 train/audit 结果优先写入 `docs/lelan/research_journal.md`。
- LeLaN 的 winner 变化必须同步更新 `docs/lelan/best_path.md`。
- 只有会改变跨线路研究判断的结论，才再提炼到 `docs/research_desk.md`。
