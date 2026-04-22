#!/usr/bin/env bash
set -euo pipefail

TOOLS_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
DATASET_NAME="${1:-libero_spatial}"
DATASET_ROOT="${TOOLS_ROOT}/data/libero_datasets"
TARGET_DIR="${DATASET_ROOT}/${DATASET_NAME}"
CACHE_DIR="${DATASET_ROOT}/.cache/huggingface/download/${DATASET_NAME}"
FORCE_OVERWRITE="${FORCE_OVERWRITE:-0}"

# SSH / 无界面环境下不能依赖交互确认；如果显式要求覆盖，就先删掉已有目录再重下。
if [ "${FORCE_OVERWRITE}" = "1" ] && [ -d "${TARGET_DIR}" ]; then
  echo "[download_libero_datasets] removing existing dataset dir: ${TARGET_DIR}"
  rm -rf "${TARGET_DIR}"
fi
if [ "${FORCE_OVERWRITE}" = "1" ] && [ -d "${CACHE_DIR}" ]; then
  # 这里顺手清掉对应数据集的下载缓存，避免残留 lock / incomplete 文件把后续重试卡住。
  echo "[download_libero_datasets] removing existing download cache: ${CACHE_DIR}"
  rm -rf "${CACHE_DIR}"
fi

python /home/gjw/MyProjects/LIBERO/benchmark_scripts/download_libero_datasets.py \
  --download-dir "${DATASET_ROOT}" \
  --datasets "${DATASET_NAME}" \
  --use-huggingface
