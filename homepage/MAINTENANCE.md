# Homepage Maintenance Guide

这个文档是给后续维护 agent 看的内部说明，不属于公开主页内容。

## 公开页边界

主页只能展示科研工作留痕本身，不能把下面这些内容直接暴露出去：

- 助手工作流
- “我来怎么帮你整理”一类过程描述
- 维护规则本身
- 冗长文件名、原始 run name、绝对路径
- 机械式流水账标题

公开页要回答的是：

- 做了什么任务
- 每个阶段做成了什么
- 哪条研究线现在走到哪里
- 有哪些量化结果、图表和 demo

首页结构固定为：

- 大标题 hero
- `已完成 / 进行中` 两个主分区
- 每个分区按日期分组
- 每个日期下面放成果卡片
- 少量概览图表
- 研究线入口
- showcase

## 标题规则

标题必须像成果条目，不像日志行。

允许：

- `冻结当前最佳主线`
- `恢复 100->500 续训接管`
- `把 PDIT baseline 修稳为行为锚点`

不允许：

- 原始文件名
- 原始 run name
- `xxx.py · 某某问题`
- “今天改了很多东西”这类空泛表述

## 时间线规则

时间线按天聚合，每天都要回答：

- 这一天推进了什么
- 是结果、修复、冻结、接管还是规范化

如果当天有很多原始记录：

1. 先找最重要的阶段变化
2. 再用 1 句总结补足背景
3. 只保留 2 到 3 个最关键 source link

任务页里的时间线必须做成：

- 按日期分组
- 同一天允许多张事件卡
- 每张卡都明确写清：
  - 做了什么
  - 指标如何
  - 当前判断是什么

## 任务与研究线

任务和研究线不是一回事。

- 任务：用户视角下的一块工作，例如 `PDIT 基线恢复`
- 研究线：文档与实验组织线，例如 `pdit`、`mdit`、`lelan`

新增文档目录时：

1. 如果它是新的研究线，先放到 `docs/<branch>/`
2. 让生成器自动发现 branch
3. 如果它已经足够成为首页一级任务，再补 `homepage/config/site-config.json`

## 图表规则

默认采用 `W&B API 优先，本地快照回退`：

- 能抓完整 history 时优先抓完整 history
- 抓不到时回退到本地快照，但必须在图表注释里写明

本地常用数据源：

- `summary.json`
- `audit_report.json`
- `wandb-summary.json`
- `results.tsv`
- `top10-checkpoint-manifest.json`

图表选择顺序：

1. 成功率曲线
2. train/valid total loss
3. 核心 mse
4. 实验状态统计或 gate 图

额外要求：

- success 曲线必须严格按 epoch 升序
- 首页只放概览图
- 详细训练曲线只放任务页

## Demo 素材规则

把素材放到：

```text
homepage/media/tasks/<task-id>/
```

文件名本身不能直接当公开标题，除非已经足够短且语义明确。

## 推荐维护流程

1. 新材料先进入 `docs/` 或实验产物目录
2. 必要时补 `fixes.md`
3. 如果是新的一级任务，再更新 `homepage/config/site-config.json`
4. 运行 `python scripts/build_homepage_data.py`
5. 用 `python scripts/serve_homepage.py --port 43429` 本地检查
6. 本地检查重点：
   - 首页卡片标题是否还是成果标题
   - 有没有漏出原始 run name / 绝对路径
   - 任务页时间线是否按日期分组
   - success 顺序是否正确
   - 页面主体是否仍然能不点文档就读懂

## 当前生成器职责

`scripts/build_homepage_data.py` 负责：

- 扫描 `docs/`
- 提炼 fixes 条目
- 聚合时间线
- 生成首页、任务页与研究线页
- 读取本地图表数据源
- 在可用时抓取 W&B history
- 发现 demo 素材

如果后续要继续扩展，优先改这个脚本和 `site-config.json`，不要在公开 HTML 里手写业务内容。
