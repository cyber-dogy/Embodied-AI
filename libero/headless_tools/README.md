# LIBERO Headless Tools

这套工具目录专门服务于 `5090` 训练机上的 `LIBERO` 验证、headless 录制和 rollout 回放。

当前 canonical 路径：

- `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools`

为了兼容你之前的命令，旧路径 `/home/gjw/MyProjects/libero_headless_tools` 仍然保留为软链。

## 目录说明

- `activate_libero_5090.sh`：纯仿真 / 验证环境激活脚本
- `activate_lingbot_train.sh`：主训练环境激活脚本
- `validate_libero_smoke.py`：最小环境验收
- `render_libero_headless_demo.py`：无策略的场景录制
- `record_libero_rollout.py`：回放官方 demo 轨迹，或重放你自己的 action 轨迹
- `download_libero_datasets.sh`：下载 `LIBERO` 官方 demonstrations
- `configs/`：这套工具自己的 `LIBERO_CONFIG_PATH`
- `output/`：默认视频输出目录

## 5090 验收

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/validate_libero_smoke.py --suite libero_spatial --task-id 0 --steps 1'
```

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_lingbot_train.sh && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/validate_libero_smoke.py --suite libero_spatial --task-id 0 --steps 1'
```

## 录一个 headless 场景视频

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/render_libero_headless_demo.py --suite libero_spatial --task-id 0 --steps 120 --fps 20 --include-wrist'
```

## 下载官方 demo 数据

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/download_libero_datasets.sh libero_spatial'
```

## 回放官方成功轨迹

先下载对应 suite 的 demo 数据，然后执行：

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/record_libero_rollout.py --source demo_states --suite libero_spatial --task-id 0 --episode 0 --fps 20 --include-wrist'
```

## 回放你自己的 action 轨迹

假设你已经保存了一个形状为 `T x 7` 的 `npy` / `npz`：

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/record_libero_rollout.py --source action_trace --suite libero_spatial --task-id 0 --action-file /path/to/actions.npy --fps 20 --include-wrist'
```

其中：

- `npy`：文件内容直接是 `actions`
- `npz`：需要存在 `actions` 这个 key

## 说明

- `demo_states` 模式回放的是 demonstration 里的 MuJoCo 状态序列，最适合做“成功轨迹视频”。
- `action_trace` 模式重放的是你自己模型吐出来的动作，最适合接后面的 `VLA / WM` 评测结果。
- 这台 `5090` 机器默认走 `EGL` 离屏渲染，不需要显示器。

## 已接入评测器

### OpenVLA-OFT

文件：

- `/home/gjw/MyProjects/RoboTwin/policy/openvla-oft/experiments/robot/libero/run_libero_eval.py`

新增能力：

- 每个 episode 自动保存 `mp4`
- 每个 episode 自动保存 `action_trace.npz`
- 两者统一落到 `autodl_unplug_charger_transformer_fm/libero/headless_tools/output/evals/openvla_oft/...`

产物结构大致是：

```text
autodl_unplug_charger_transformer_fm/libero/headless_tools/output/evals/openvla_oft/
  libero_spatial/
    00_xxx_task_name/
      ep000_success1.mp4
      ep000_success1.npz
```

### lingbot-va

文件：

- `/home/gjw/MyProjects/lingbot-va/evaluation/libero/client.py`

新增能力：

- 保留原有评测逻辑
- 每个 episode 自动保存 `mp4`
- 每个 episode 自动保存 `action_trace.npz`
- 两者统一落到 `autodl_unplug_charger_transformer_fm/libero/headless_tools/output/evals/lingbot_va/...`

## 统一重放某个评测输出

拿任意一个评测产出的 `npz`，都可以直接这样重放：

```bash
bash -lc 'source /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/activate_libero_5090.sh && python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/record_libero_rollout.py --source action_trace --suite libero_spatial --task-id 0 --action-file /path/to/ep000_success1.npz --fps 20 --include-wrist'
```

如果这个 `npz` 里已经带了 `initial_state`，脚本会自动使用，不需要你再传 `--init-index`。
