# autodl_unplug_charger_transformer_fm

一个面向 `RLBench unplug_charger` 任务的点云策略学习项目仓库。当前主训练流程已经整理为标准 `src` 包结构，训练、评估和视频录制都提供了独立的 Python CLI 入口；`notebooks/` 只保留为实验期学习与调试入口。

## 项目特点
- 标准包结构：核心代码位于 `src/autodl_unplug_charger_transformer_fm/`
- 训练入口独立：使用 `scripts/train.py`
- 评估入口独立：支持单 checkpoint、全 checkpoint、rollout 视频录制
- notebook 不再承载核心训练逻辑，而是调用脚本或包内 API
- 配置集中管理：默认训练配置位于 `configs/fm_autodl_lab.json`

## 目录说明
```text
autodl_unplug_charger_transformer_fm/
├── configs/                      # JSON 配置预设
├── docs/                         # 代码结构与使用说明
├── notebooks/                    # 保留的学习 / 实验 notebook
├── scripts/                      # 薄封装 CLI 入口
├── src/
│   └── autodl_unplug_charger_transformer_fm/
│       ├── cli/                  # 真正的命令行实现
│       ├── data/                 # 数据集 / replay buffer / sampler
│       ├── env/                  # RLBench 环境封装
│       ├── models/               # PointNet / DiT backbone
│       ├── policies/             # FM / Diffusion policy
│       ├── training/             # builders / checkpoints / eval / runner
│       ├── utils/                # 通用工具函数
│       └── config.py             # ExperimentConfig 与配置读写
├── archive/                      # 历史 notebook / 旧说明 / bak 归档
├── requirements.txt             # 基础依赖
├── requirements_eval.txt        # RLBench / PyRep 可选依赖
└── pyproject.toml               # 可编辑安装配置
```

说明：
- `src/` 是当前正式代码入口。
- `lib/` 仍保留为历史迁移参考，请不要继续在新流程中新增逻辑。
- `archive/` 保存历史 notebook、旧说明文档和 `.bak` 备份，避免混在主流程目录里。

## 安装
建议先准备训练环境，再在仓库根目录执行：

```bash
pip install -r requirements.txt
pip install -e .
```

如果要运行 RLBench 成功率评估或 rollout 视频录制，再额外安装：

```bash
pip install -r requirements_eval.txt
```

提示：
- `requirements_eval.txt` 只覆盖 Python 包名，RLBench / PyRep 往往还需要额外系统环境配置。
- `scripts/*.py` 设计为在完成 `pip install -e .` 后使用。

## 快速开始
默认训练配置：

```bash
python scripts/train.py --config configs/fm_autodl_lab.json
```

常用覆盖参数：

```bash
python scripts/train.py \
  --config configs/fm_autodl_lab.json \
  --strategy fm \
  --run-name unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1 \
  --device cuda \
  --resume
```

如果需要换数据根目录或 checkpoint 根目录：

```bash
python scripts/train.py \
  --config configs/fm_autodl_lab.json \
  --data-root /path/to/data \
  --ckpt-root /path/to/ckpt
```

## 评估与可视化
单个 checkpoint 成功率评估：

```bash
python scripts/eval_checkpoint.py \
  --ckpt-path ckpt/<run_name>/epochs/epoch_0500.pt \
  --episodes 20 \
  --max-steps 200 \
  --headless
```

遍历某个 run 的所有 checkpoint：

```bash
python scripts/eval_all_checkpoints.py \
  --ckpt-epochs-dir ckpt/<run_name>/epochs \
  --results-json ckpt/<run_name>/local_eval_results.json \
  --plot-path ckpt/<run_name>/local_eval_success_rate.png \
  --episodes 20 \
  --max-steps 200 \
  --headless
```

录制 rollout 视频：

```bash
python scripts/record_rollout_videos.py \
  --ckpt-path ckpt/<run_name>/best.pt \
  --episodes 1 \
  --camera front \
  --headless
```

## Notebook 工作流
- 主 notebook：`notebooks/pfm_unplug_charger_transformer_fm_autodl_lab.ipynb`
  - 负责设置实验参数
  - 调用 `scripts/train.py`
  - 可选调用 `scripts/eval_all_checkpoints.py`
  - 读取 `summary.json` 和缓存评估结果做汇总
- 策略对比 notebook：`notebooks/pfm_unplug_charger_transformer_strategy_compare_autodl_lab.ipynb`
  - 适合快速比较 `fm` / `diffusion`
  - 调用新包导出的 `ExperimentConfig` 与 `train_experiment`

## 数据与输出
- 训练数据默认读取：
  - `data/unplug_charger/train`
  - `data/unplug_charger/valid`
- 每个训练 run 默认输出到：
  - `ckpt/<run_name>/config.json`
  - `ckpt/<run_name>/summary.json`
  - `ckpt/<run_name>/latest.pt`
  - `ckpt/<run_name>/best.pt`
  - `ckpt/<run_name>/epochs/epoch_XXXX.pt`

## 代码结构文档
更细的模块职责说明见：

- `docs/code-structure.md`

这个文档会告诉你：
- 每个模块负责什么
- 训练 / 评估链路怎么串起来
- 想改模型、想改训练 loop、想改环境时应该去哪个文件
