# Homepage

这个目录现在是一个可复用的静态科研主页框架，核心目标只有两件事：

- 把 `docs/`、`fixes.md`、本地实验产物整理成结构化首页与详情页
- 让后续新增任务、研究线、demo 素材时，不需要再重写页面骨架

## 目录结构

```text
homepage/
├── assets/
│   ├── generated-homepage-data.js
│   ├── homepage-app.js
│   └── homepage.css
├── branches/
├── config/
│   └── site-config.json
├── media/
│   └── tasks/
├── showcase/
├── tasks/
├── timeline/
├── favicon.svg
├── index.html
└── MAINTENANCE.md
```

## 生成方式

主页不是手写 HTML 集合，而是通过生成脚本统一产出：

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
./scripts/rebuild_homepage.sh
python scripts/serve_homepage.py --port 43429
```

然后打开：

```text
http://127.0.0.1:43429/
```

`rebuild_homepage.sh` 会同时完成两件事：

- 重建 `homepage/assets/generated-homepage-data.js`
- 重建 `cloudflare-pages-site/` 发布包

如果你想把这套主页长期挂出去，不只本地预览，部署方案放在：

- `deploy/homepage/caddy/README.md`
- `deploy/homepage/cloudflare-pages/README.md`

当前仓库已经带了用户态 Caddy 反代脚本和正式服务器 Caddyfile 模板。

## 配置入口

需要长期维护的公开展示信息集中在：

- `homepage/config/site-config.json`
- `homepage/config/manual_overrides.json`

这里负责定义：

- 站点标题与 slogan
- 任务卡片
- 研究线 profile
- 任务与图表的映射关系
- 各任务的 source 文档与实验产物入口

其中：

- `site-config.json` 负责“结构和数据入口”
- `manual_overrides.json` 负责“手工修标题、summary、任务页说明、首页卡片文案”

如果你只是想手修标题、摘要或时间线文案，优先改 `manual_overrides.json`，不用碰 Python。

## Cloudflare Pages 发布包

当前仓库额外生成一个专门给 Cloudflare Pages 用的纯静态目录：

```text
cloudflare-pages-site/
```

这个目录有几个目的：

- 保留根目录 `/ -> /homepage/` 的访问方式
- 把 `homepage/` 内部依赖的符号链接素材、外部 Markdown、JSON 证据都打包成真实文件
- 避免 Cloudflare 云端构建时因为本地 `ckpt/`、兄弟项目路径或软链接失效而报错

也就是说，Cloudflare Pages 不需要在云端重新跑实验数据整理逻辑；它只需要自动发布这个已经准备好的静态目录。

如果使用 Cloudflare Pages 的 Git 自动部署，当前推荐配置是：

- `Root directory`: `cloudflare-pages-site`
- `Build command`: `exit 0`
- `Build output directory`: `.`

不要把仓库根目录 `/` 作为 Pages 的工作目录，否则它会扫到主项目里的 `requirements.txt` 并尝试安装整仓依赖。

## 素材入口

按任务放素材：

```text
homepage/media/tasks/<task-id>/
```

当前任务目录已预留：

- `dummy-sim2real-platform`
- `pdit-anchor`
- `mdit-mainline`
- `lelan-pipeline`
- `infra-audit`

支持格式：

- `png`
- `jpg`
- `webp`
- `gif`
- `mp4`
- `webm`

如果任务材料来自兄弟项目仓库，公开证据建议先挂到：

- `homepage/external/<project>/`

然后在 `site-config.json` 里把这些路径当作 `featured_paths` 使用。这样公开页仍然走同一套任务页框架，不会退回成散乱的文档跳转页。

## 页面结构

当前生成的公开页面包括：

- 首页：大标题 hero + `进行中 / 已完成` 日期分组卡片 + 少量概览图表 + 研究线入口 + showcase
- `homepage/tasks/<task-id>/`
- `homepage/branches/<branch-id>/`
- `homepage/timeline/`
- `homepage/showcase/`

任务页固定采用：

- 任务背景与当前判断
- 关键成果卡片
- success / total loss / mse 图表
- 按日期分组、带竖轴的任务时间线
- 关键结论
- 证据链接

## 维护说明

维护规则、agent 处理边界、标题写法和素材规范都放在：

- `homepage/MAINTENANCE.md`
