# OpenVLA Line

这是一条专门给你拆出来的 `openvla` 支线目录，目标是：

- 完整代码、脚本、配置、文档、notebook 都收在一个文件夹里
- 不依赖 `pdit / mdit / lelan` 的内部函数
- 直接吃 `LIBERO` 原始 `hdf5`
- 至少验证到“你自己能继续训练和改模型”的程度

这里实现的是一条 **OpenVLA-style 轻量训练线**，不是官方 `OpenVLA 7B` 的原仓复刻。这样做的原因很直接：

- 你要求它能独立打包带走
- 你后续需要自己改模型、改输入输出、改研究点
- 官方大模型链条太重，不利于在当前 repo 里做轻量自训练验证

所以这条线保留了 `VLA` 的核心形式：

- 双视觉输入：`agentview_rgb + eye_in_hand_rgb`
- 语言输入：从 `LIBERO` demo 文件名恢复任务指令
- 机器人状态输入：优先 `robot_states`
- 输出：`7D` 连续 action
- 主干：视觉 token + 文本 token + proprio token + action query token 的 Transformer 融合

## 目录结构

```text
openvla_line/
├── openvla_line/            # 真正的 Python package
├── scripts/                 # inspect / build_manifest / train / smoke
├── configs/                 # 正式训练和 smoke 配置
├── docs/                    # 结构说明、验证记录
├── notebooks/               # 学习型 notebook
├── requirements.txt
└── pyproject.toml
```

## 默认数据路径

如果你不显式传 `--data-root`，代码会按下面顺序找数据：

1. `OPENVLA_LIBERO_DATA_ROOT`
2. config 里的 `data_root`
3. 仓库兄弟目录下的：
   `../libero/headless_tools/data/libero_datasets/libero_spatial`

也就是当前 repo 里已经下载好的 `LIBERO` 数据默认就能被自动识别到。

## 最快上手

### 1. 安装依赖

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line
python -m pip install -r requirements.txt
```

### 2. 先看一个 demo 长什么样

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line
python scripts/inspect_libero_dataset.py \
  --demo-file /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/data/libero_datasets/libero_spatial/pick_up_the_black_bowl_on_the_stove_and_place_it_on_the_plate_demo.hdf5 \
  --episode 0
```

### 3. 生成 manifest

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line
python scripts/build_manifest.py \
  --data-root /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/data/libero_datasets/libero_spatial \
  --out artifacts/manifests/libero_spatial_manifest.json
```

### 4. 正式训练

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line
python scripts/train_openvla.py \
  --config configs/libero_spatial_small.json \
  --device cuda
```

### 5. 先做 smoke 验证

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line
python scripts/smoke_train.py
```

## 当前方法的输入与输出

- 输入图像：`obs/agentview_rgb`, `obs/eye_in_hand_rgb`
- 输入语言：从 `*_demo.hdf5` 文件名恢复的英文任务句子
- 输入状态：`robot_states`，如果某些数据没有，再 fallback 到 `ee_states + gripper_states + joint_states`
- 输出动作：`actions[t]`，当前 `LIBERO` demo 里是 `7D`

## 你接下来最常改的地方

- 想加更多输入模态：改 `openvla_line/data.py`
- 想换模型结构：改 `openvla_line/model.py`
- 想换 loss / scheduler / ckpt 口径：改 `openvla_line/trainer.py`
- 想换训练规模：改 `configs/*.json`
- 想快速学习整个链：看 `docs/openvla_structure_zh.md` 和 `notebooks/openvla_libero_learning_lab.ipynb`

