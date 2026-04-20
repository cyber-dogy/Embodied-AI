# Media Layout

按任务放入 demo 素材，推荐直接按图片 / 视频分层：

```text
homepage/media/tasks/<task-id>/
├── images/
└── videos/
```

可选：

- `captions.json`：给素材补公开标题和说明

如果要让某张图出现在首页 `Demo 与现场素材` 预览区，可以在 `captions.json` 里加 `"showcase": true`。
建议每个任务最多只标一张首页亮点图。

支持：

- 图片：`png` `jpg` `jpeg` `webp` `gif`
- 视频：`mp4` `webm`

生成器会递归扫描任务目录，所以你也可以继续往下分子目录。
如果文件名里已经写清 `rollout / success / fail / loss / eval` 等语义，页面会直接围绕这个名字生成展示文案。

如果素材位于兄弟项目仓库里，也可以把符号链接放进 `images/` 或 `videos/`，这样页面仍然按统一任务目录抓取。
