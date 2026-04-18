# Cloudflare Pages 部署说明

这套主页现在已经固定成 Cloudflare Pages 友好的纯静态发布流程，核心思路是：

- 本地先整理实验内容、图表、证据和素材
- 统一打包到 `cloudflare-pages-site/`
- Cloudflare Pages 只负责自动发布这个目录

这样做可以避开两类常见问题：

- 主页里有一部分素材和文档来自兄弟仓库软链接
- 一部分证据来自本地 `ckpt/`、JSON 快照或本地环境里的 W&B 抓取结果，云端不适合重新构建

## 一次性准备

### 1. 本地生成发布包

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
./scripts/rebuild_homepage.sh
```

这个命令会同时更新：

- `homepage/assets/generated-homepage-data.js`
- `cloudflare-pages-site/`

### 2. 把改动提交到 Git 仓库

Cloudflare Pages 的 Git 自动部署是基于远端仓库内容触发的，所以发布包目录也要一起入库。

## Cloudflare Pages 控制台设置

在 Cloudflare Dashboard 里：

1. 进入 `Workers & Pages`
2. 选择 `Create application`
3. 选择 `Pages`
4. 连接你的 GitHub 仓库
5. 关键配置建议如下：

- Framework preset: `None`
- Production branch: 你的主分支
- Build command: `exit 0`
- Build output directory / Build directory: `.`
- Root directory: `cloudflare-pages-site`

为什么这里不让 Cloudflare 再跑构建？

- 这套主页的公开产物已经在本地整理好
- 远端构建环境拿不到你本机的兄弟项目软链接和本地快照上下文
- 直接发布 `cloudflare-pages-site/` 才是稳定方案

为什么不能继续让 Cloudflare 从仓库根目录开始：

- 如果 `Root directory` 留在 `/`，Pages 会先从仓库根目录执行安装和构建流程
- 你的仓库根目录里有 `requirements.txt`
- 这样它就会去安装整个项目依赖，并在 `open3d` 这类和构建镜像 Python 版本不兼容的包上失败

所以现在这套主页的正确理解是：

- `cloudflare-pages-site/` 本身就是要发布的静态站根目录
- 不是“在仓库根目录构建，然后把 `cloudflare-pages-site/` 当输出目录”
- 而是“把 `cloudflare-pages-site/` 直接当 Pages 项目根目录”

## 自动部署工作流

后续每次更新内容时，固定按这个顺序走：

1. 修改 `docs/`、素材、`site-config.json` 或 `manual_overrides.json`
2. 执行：

```bash
./scripts/rebuild_homepage.sh
```

3. 本地预览：

```bash
python scripts/serve_homepage.py --port 43429
```

4. 检查首页、任务页、时间线、素材页
5. 提交并 push
6. Cloudflare Pages 自动发布最新 `cloudflare-pages-site/`

如果你已经创建过一个配置错的 Pages 项目，直接去：

1. `Settings`
2. `Builds & deployments`
3. 把 `Root directory` 改成 `cloudflare-pages-site`
4. 把 `Build command` 改成 `exit 0`
5. 把 `Build output directory` 或 `Build directory` 改成 `.`
6. 保存后重新触发部署

## 发布目录说明

`cloudflare-pages-site/` 里会包含：

- 根目录跳转页
- `homepage/` 静态页面
- 主页引用到的 Markdown / JSON 证据文件
- 主页引用到的图片 / GIF / 视频素材
- `_redirects`
- `_headers`
- `404.html`

也就是说，Cloudflare Pages 发布后，即使原始 source 是软链接或本地快照，公开站也能直接访问。

## 推荐公开地址

Cloudflare Pages 会直接给你一个免费子域名：

- `https://<your-project>.pages.dev`

如果以后你愿意再买域名，也可以后面再绑，不影响当前自动部署流程。

## 相关官方文档

- Cloudflare Pages 总览: https://developers.cloudflare.com/pages/
- Cloudflare Pages 自定义域名 / `pages.dev`: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages 限制: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages Git 集成: https://developers.cloudflare.com/pages/get-started/git-integration/
- Cloudflare Pages 构建配置: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Cloudflare Pages 静态 HTML 部署: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
