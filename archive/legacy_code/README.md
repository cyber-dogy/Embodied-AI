# Legacy Code Archive

这个目录只用于保留历史研究材料，不再是当前仓库的正式 source of truth。

当前正式开发入口已经迁移到仓库根目录一级模块：

- `model/`
- `policy/`
- `train/`
- `config/`
- `data/`
- `envs/`
- `common/`
- `research/`
- `cli/`

这里保留的内容：

- `src_layout_snapshot/`
  - 重整前的 `src/` 目录树快照
- `lib/`
  - 更早阶段的历史实现

使用建议：

- 想理解研究历史，可以参考这里
- 想继续开发、训练或评估，请改根目录正式模块，不要在这里继续加新逻辑
