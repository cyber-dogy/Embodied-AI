# 4070 兼容环境配置单

这份文档面向 `Ubuntu 22.04 + RTX 4070`，目标不是追求最高吞吐，而是保证三件事都稳定：

- 可以看得到界面的仿真演示
- 可以跑低算力训练或小规模微调
- 可以直接复用 5090 上这套 `libero_headless_tools` 的验证口径

## 推荐角色分工

- `5090`：主训练、长时间 headless rollout、批量评测
- `4070`：可视化仿真、录制 demo、低算力训练、调参 smoke test

## 4070 上建议保留两套环境

### 1. `libero_view`

用途：

- 跑 `LIBERO / robosuite` 仿真
- 录制演示视频
- 做 smoke test

推荐 Python：

- `python3.10`

推荐创建方式：

```bash
python3.10 -m venv ~/.venvs/libero_view
source ~/.venvs/libero_view/bin/activate
pip install -U pip setuptools wheel
pip install robosuite==1.4.1 bddl gym gymnasium==0.29.1 cloudpickle imageio[ffmpeg] opencv-python tqdm websockets msgpack h5py
pip install LIBERO==0.1.1 --no-deps
```

如果你要直接运行 `lingbot-va/evaluation/libero/client.py`，还需要：

```bash
pip install lerobot==0.3.3
```

如果你希望 `libero_view` 完全独立，不依赖别的训练环境，再补一组最常用的运行时包：

```bash
pip install torch==2.9.0 --index-url https://download.pytorch.org/whl/cu128
pip install easydict einops matplotlib transformers wandb
```

图形相关系统依赖：

```bash
sudo apt update
sudo apt install -y libegl1 libglfw3 libosmesa6-dev libgl1-mesa-glx patchelf libvulkan1 mesa-vulkan-drivers vulkan-tools
```

### 2. `lingbot_4070`

用途：

- 跑小 batch 训练
- 跑单卡验证
- 在 4070 上做短周期对照实验

推荐 Python / Torch：

- `python=3.10`
- `torch==2.9.0`
- `torchvision==0.24.0`
- `torchaudio==2.9.0`
- `cu128`

建议安装顺序：

```bash
conda create -n lingbot_4070 python=3.10 -y
conda activate lingbot_4070
pip install torch==2.9.0 torchvision==0.24.0 torchaudio==2.9.0 --index-url https://download.pytorch.org/whl/cu128
pip install flash-attn --no-build-isolation
pip install -r /home/gjw/MyProjects/lingbot-va/requirements.txt
pip install robosuite==1.4.1 bddl gym cloudpickle imageio[ffmpeg] h5py
```

## 4070 的显示 / 渲染建议

### 看界面时

优先使用：

```bash
export MUJOCO_GL=glx
unset PYOPENGL_PLATFORM
export LIBERO_CONFIG_PATH=$HOME/.config/libero_view
```

这个模式更适合直接开窗口看仿真、录屏和调相机。

### 不看界面时

使用：

```bash
export MUJOCO_GL=egl
export PYOPENGL_PLATFORM=egl
export MUJOCO_EGL_DEVICE_ID=0
export LIBERO_CONFIG_PATH=$HOME/.config/libero_view
```

这个模式更适合后台跑评测。

## 和 5090 保持统一的验证入口

4070 上也直接复用这套工具目录里的脚本：

```bash
python /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/libero/headless_tools/validate_libero_smoke.py --suite libero_spatial --task-id 0 --steps 5
```

第一次跑之前，建议先创建 `LIBERO` 配置目录：

```bash
mkdir -p $HOME/.config/libero_view
cat > $HOME/.config/libero_view/config.yaml <<'YAML'
benchmark_root: /home/你的用户名/.venvs/libero_view/lib/python3.10/site-packages/libero/libero
bddl_files: /home/你的用户名/.venvs/libero_view/lib/python3.10/site-packages/libero/libero/./bddl_files
init_states: /home/你的用户名/.venvs/libero_view/lib/python3.10/site-packages/libero/libero/./init_files
datasets: /home/你的用户名/libero_headless_tools/data/libero_datasets
assets: /home/你的用户名/.venvs/libero_view/lib/python3.10/site-packages/libero/libero/./assets
YAML
mkdir -p /home/你的用户名/libero_headless_tools/data/libero_datasets
```

如果这条能过，说明：

- `MuJoCo` 正常
- `robosuite` 正常
- `LIBERO` 正常
- 你的渲染模式设置是通的

## 4070 更适合做什么

- 录制 `LIBERO` 和 `robosuite` demo
- 做 VLA / WM 的短周期验证
- 做可解释性可视化
- 做 counterfactual / robustness 展示视频

## 4070 不建议做什么

- 大模型长时间全量微调
- 多任务大 batch 训练
- 长时间高分辨率视频 world model 训练

## 最后建议

4070 的目标不是替代 5090，而是把“能看、能录、能快速验证”这件事做稳。只要你在 4070 上保持和 5090 相同的任务 suite、相同的验证脚本、相同的 headless / 可视化切换口径，两台机器就能自然形成配合。
