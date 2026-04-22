# OpenVLA Line 验证记录

## 验证日期

- 2026-04-22

## 1. 数据结构验证

验证命令：

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line
python scripts/inspect_libero_dataset.py \
  --demo-file /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/data/libero_datasets/libero_spatial/pick_up_the_black_bowl_on_the_stove_and_place_it_on_the_plate_demo.hdf5 \
  --episode 0 \
  --max-depth 2
```

确认到的关键字段：

- 每个 demo 文件约 `50` 个 episode
- `actions.shape = [T, 7]`
- `robot_states.shape = [T, 9]`
- 可用 RGB 相机：
  - `agentview_rgb`
  - `eye_in_hand_rgb`
- 还存在低维状态：
  - `ee_states`
  - `gripper_states`
  - `joint_states`

这说明当前代码里定义的：

- 双相机输入
- `robot_states` proprio
- `7D` action 监督

和真实 `LIBERO` 数据是一致的。

## 2. manifest 验证

手动 manifest 构建命令：

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line
python scripts/build_manifest.py \
  --data-root /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/data/libero_datasets/libero_spatial \
  --out artifacts/manifests/libero_spatial_manifest.json
```

手动构建结果：

- `num_demo_files = 10`
- `num_train_episodes = 450`
- `num_val_episodes = 50`
- `action_dim = 7`
- `proprio_dim = 9`

说明：

- 正式训练配置默认会重新按对应 config 重建 manifest
- smoke 配置为了加快验证，会把 `max_files` 限到 `2`

## 3. smoke train 验证

执行命令：

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line
python scripts/smoke_train.py
```

本次 smoke 配置：

- `max_files = 2`
- `image_size = 64`
- `sample_stride = 16`
- `max_train_samples = 64`
- `max_val_samples = 16`
- `epochs = 1`
- `max_train_steps_per_epoch = 4`
- `max_val_steps = 2`

实际运行结果：

- `device = cuda`
- `train_dataset_size = 64`
- `val_dataset_size = 16`
- `train_loss = 0.5443601086735725`
- `train_mae = 0.8729615956544876`
- `val_loss = 0.5045834928750992`
- `val_mae = 0.7990301847457886`

产物落点：

- run 目录：`/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/openvla_line/artifacts/runs/openvla_libero_spatial_smoke`
- summary：[training_summary.json](../artifacts/runs/openvla_libero_spatial_smoke/training_summary.json)
- vocab：[vocab.json](../artifacts/runs/openvla_libero_spatial_smoke/vocab.json)
- stats：[stats.json](../artifacts/runs/openvla_libero_spatial_smoke/stats.json)
- best ckpt：`best.pt`
- last ckpt：`last.pt`

## 4. 当前验证结论

已经确认：

- 真实 `LIBERO hdf5` 能被正确读取
- manifest 能稳定生成
- tokenizer 能从任务指令自动构词
- dataset 能把双相机图像、语言、状态、动作拼成训练样本
- model 能完成 forward
- trainer 能在 `cuda` 上跑完整个 train / val
- checkpoint / stats / summary 会落盘

也就是说，这条线已经达到了：

- 你可以直接自己继续训练
- 你可以开始改模型结构
- 你可以开始加自己的创新点

## 5. 目前还没做的事

这次验证还没有覆盖：

- 闭环 `LIBERO` 仿真评测
- rollout 视频导出
- action trace 回放
- 更大规模长训后的收敛质量

所以当前口径是：

- **训练链已打通**
- **闭环 benchmark 评测尚未接上**

