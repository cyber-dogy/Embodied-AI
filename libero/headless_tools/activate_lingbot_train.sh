#!/usr/bin/env bash
set -eo pipefail

TOOLS_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# conda activate 会执行 activate.d，这里先暂时关闭 nounset，避免第三方脚本读未定义变量时报错。
set +u
source /opt/miniconda3/etc/profile.d/conda.sh
export PYTHONPATH="${PYTHONPATH:-}"
export NVCC_PREPEND_FLAGS="${NVCC_PREPEND_FLAGS:-}"
conda activate lingbot
set -u

# 训练环境也必须能做验证，因此和纯仿真环境保持同一条 EGL headless 链路。
export MUJOCO_GL=egl
export PYOPENGL_PLATFORM=egl
export MUJOCO_EGL_DEVICE_ID="${MUJOCO_EGL_DEVICE_ID:-0}"
export TOKENIZERS_PARALLELISM=false
export LIBERO_CONFIG_PATH="${TOOLS_ROOT}/configs/lingbot"
export LIBERO_HEADLESS_TOOLS_ROOT="${TOOLS_ROOT}"
export PYTHONPATH="${TOOLS_ROOT}:/home/gjw/MyProjects/LIBERO:${PYTHONPATH}"

echo "[lingbot] python: $(python -V 2>&1)"
echo "[lingbot] torch: $(python -c 'import torch; print(torch.__version__)')"
echo "[lingbot] MUJOCO_GL=${MUJOCO_GL} MUJOCO_EGL_DEVICE_ID=${MUJOCO_EGL_DEVICE_ID}"
echo "[lingbot] LIBERO_CONFIG_PATH=${LIBERO_CONFIG_PATH}"
