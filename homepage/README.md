# Homepage Branch

这个目录是仓库里独立出来的一条 `homepage` 支线。

它的职责不是替代 `docs/`，而是：

- 把 `docs/fixes.md` 作为全局修复总账展示出来
- 把 `docs/pdit`、`docs/mdit`、`docs/lelan` 三条文档线整理成统一入口
- 自动抓取 `docs/` 里的最近源材料
- 让你以后继续写文档时，不需要每次都重做首页结构

## 目录结构

```text
homepage/
├── index.html
├── favicon.svg
├── README.md
└── assets/
    ├── generated-homepage-data.js
    ├── homepage-app.js
    ├── homepage.css
    └── homepage-data.js
```

## 维护方式

这套首页现在是“两层数据”：

1. 自动层：`scripts/build_homepage_data.py` 扫描 `docs/`，生成：
   - 最近更新文档
   - 最新 fixes 条目
   - 按支线自动发现的 source list
2. 精修层：`assets/homepage-data.js` 维护：
   - 首页主文案
   - 支线摘要
   - 里程碑
   - 助手工作流
   - 长期维护规则

这样以后新增支线或专题时，通常不需要改 HTML 模板，只需要：

1. 先把正式内容写进 `docs/`
2. 跑一遍自动生成脚本
3. 如果需要更好看的摘要，再微调 `assets/homepage-data.js`

## 作为助手的接管流程

以后你可以直接把这些内容扔给我：

- 一个新的 docs 路径
- 一段 markdown / 日志 / 结论
- 一个 wandb run、checkpoint、run name
- 一张截图或一段 shell 输出

我会按下面流程处理：

1. 先判断它应该归到 `fixes / pdit / mdit / lelan / general`
2. 如果还没落地成 docs，先帮你补正式 source 文档
3. 再把它压成 homepage 里的标题、摘要、状态、关键指标和下一步
4. 更新主页对应区块，而不是让你手工排版

## 本地预览

最稳的方式是直接用我加的服务脚本，它会固定从 repo 根目录启动：

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
python scripts/build_homepage_data.py
python scripts/serve_homepage.py --port 43429
```

然后打开：

```text
http://127.0.0.1:43429/
```

## 你这次 404 的原因

你刚才是在父目录 `~/MyProjects` 下直接跑：

```bash
python -m http.server 43429
```

这时正确地址不是 `/homepage/`，而是：

```text
http://127.0.0.1:43429/autodl_unplug_charger_transformer_fm/
```

因为 repo 本身只是父目录里的一个子目录。

## 链接约定

首页里的源文档链接默认都是相对 repo 根目录的，例如：

- `../docs/fixes.md`
- `../docs/pdit/...`
- `../docs/mdit/...`

所以推荐永远从 repo 根目录启动服务，或者直接使用 `scripts/serve_homepage.py`。
