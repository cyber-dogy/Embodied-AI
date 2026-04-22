#!/usr/bin/env bash
set -euo pipefail

source /home/gjw/.venvs/libero_5090/bin/activate

TOOLS_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# 5090 训练机大多数时候无显示器，这里默认走 EGL 的离屏渲染链路。
export MUJOCO_GL=egl
export PYOPENGL_PLATFORM=egl
export MUJOCO_EGL_DEVICE_ID="${MUJOCO_EGL_DEVICE_ID:-0}"
export LIBERO_CONFIG_PATH="${TOOLS_ROOT}/configs/libero_5090"
export LIBERO_HEADLESS_TOOLS_ROOT="${TOOLS_ROOT}"
export PYTHONPATH="${TOOLS_ROOT}:/home/gjw/MyProjects/LIBERO:${PYTHONPATH:-}"

echo "[libero_5090] python: $(python -V 2>&1)"
echo "[libero_5090] MUJOCO_GL=${MUJOCO_GL} MUJOCO_EGL_DEVICE_ID=${MUJOCO_EGL_DEVICE_ID}"
echo "[libero_5090] LIBERO_CONFIG_PATH=${LIBERO_CONFIG_PATH}"
