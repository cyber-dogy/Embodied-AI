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
- 研究线入口
- `进行中 / 已完成` 两个主分区
- 每个分区按日期分组
- 每个日期下面放成果卡片
- showcase

`Current Focus` 只展示当前主推进任务，不能再罗列多个卡片。

首页卡片左上角标签遵循固定层级：

- 第一标签优先显示所属任务主标签，例如 `PDIT 主线`、`MDIT 主线`
- 第二标签才补充当前阶段或特殊动作，例如 `Baseline Recovery`、`RGB+Text Anchor`
- 不允许只出现难以独立理解的实验内部代号标签

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
- 带竖轴，能一眼看出时间先后
- 每张卡都明确写清：
  - 做了什么
  - 指标如何
  - 当前判断是什么

如果原始文档里没有写清先后顺序：

1. 先看文档内明确日期
2. 再看 fixes / journal 里的时间戳
3. 仍然没有时，再退回文件日期或产物修改时间推断

## 任务与研究线

任务和研究线不是一回事。

- 任务：用户视角下的一块工作，例如 `PDIT 基线恢复`
- 研究线：文档与实验组织线，例如 `pdit`、`mdit`、`lelan`

新增文档目录时：

1. 如果它是新的研究线，先放到 `docs/<branch>/`
2. 让生成器自动发现 branch
3. 如果它已经足够成为首页一级任务，再补 `homepage/config/site-config.json`

如果只是要手修公开展示文案：

1. 优先改 `homepage/config/manual_overrides.json`
2. 能不碰 Python 就不碰 Python
3. 只有当自动提炼逻辑本身错了，才回头改 `scripts/build_homepage_data.py`

如果材料来自同级兄弟仓库：

1. 先把公开证据挂到 `homepage/external/<project>/`
2. 任务页正文仍然要在生成器里整理成卡片、时间线和结论
3. 不能因为 source 在别的仓库，就退回成“只挂原始文档链接”
4. Cloudflare Pages 发布时不要依赖这些软链接原样存在，必须通过发布包把它们转成真实文件

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

推荐目录：

- `homepage/media/tasks/<task-id>/images/`
- `homepage/media/tasks/<task-id>/videos/`

生成器会递归扫描任务目录，并优先围绕文件名语义生成说明。
如果素材原本放在别的项目里，可以直接把符号链接放到这两个目录中，公开页会按同样方式抓取。
首页只保留已经明确指定的亮点封面，不要把每个任务的所有素材都堆到首页。
如果需要把某张图或 GIF 放到首页预览，在该任务的 `captions.json` 里加：

```json
{
  "images/00-cover.jpg": {
    "title": "封面标题",
    "caption": "首页亮点说明。",
    "showcase": true
  }
}
```

## 推荐维护流程

1. 新材料先进入 `docs/` 或实验产物目录
2. 必要时补 `fixes.md`
3. 提炼并更新 `research_desk.md`
4. 如果是新的一级任务，再更新 `homepage/config/site-config.json`
5. 运行 `./scripts/rebuild_homepage.sh`
6. 用 `python scripts/serve_homepage.py --port 43429` 本地检查
7. 本地检查重点：
   - 首页卡片标题是否还是成果标题
   - 有没有漏出原始 run name / 绝对路径
   - 任务页时间线是否按日期分组
   - success 顺序是否正确
   - 页面主体是否仍然能不点文档就读懂
   - `cloudflare-pages-site/` 里是否已经带上最新素材、外部 Markdown 和 JSON 证据
8. 提交并 push：
   - `homepage/assets/generated-homepage-data.js`
   - `cloudflare-pages-site/`
   - 本次实际变更的配置 / 文档 / 素材
9. 等 Cloudflare Pages 自动发布
10. 访问公开地址复核：
   - `https://embodied-ai.pages.dev/homepage/`

这条发布链路是工作流的一部分，后续只要 homepage 内容有改动，就必须同步到线上页面，不能只改本地。

## Cloudflare Pages 发布规则

`cloudflare-pages-site/` 是给 Cloudflare Pages 用的纯静态发布目录。

- 这个目录必须跟着主页一起重建
- 目录里的文件允许是生成产物，不要手工修改
- Cloudflare Pages 应该发布它，而不是直接发布本地预览目录
- 自动部署的正确含义是：push 后自动发布这个目录，而不是让云端重新跑本地实验抓取逻辑
- 所以每次主页内容更新后，`cloudflare-pages-site/` 必须一起更新并提交

这样做的原因有两个：

- 主页里有一部分证据和素材来自兄弟仓库软链接
- 主页里还有一部分证据来自本地 `ckpt/` / JSON 快照，云端未必能重新构造

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
但日常标题、summary、任务页手工修文，优先走 `manual_overrides.json`。
