#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm"
TASK_NAME="put_books_on_bookshelf"
RUN_NAME="put_books_on_bookshelf_mdit_rgb_text_3token_500"
TRAIN_DATA_PATH="${REPO_ROOT}/data/${TASK_NAME}/train"
VALID_DATA_PATH="${REPO_ROOT}/data/${TASK_NAME}/valid"
LOG_PATH="${REPO_ROOT}/autoresearch_records/logs/${RUN_NAME}__bootstrap_wait.log"
DATA_RETRY_INTERVAL_SEC="${DATA_RETRY_INTERVAL_SEC:-600}"

mkdir -p "${REPO_ROOT}/autoresearch_records/logs"

log() {
  printf '[%s] %s\n' "$(date '+%F %T %z')" "$*" | tee -a "${LOG_PATH}"
}

has_files() {
  local path="$1"
  [[ -d "${path}" ]] || return 1
  find "${path}" -type f -print -quit | grep -q .
}

dataset_ready() {
  local required_paths=(
    "${TRAIN_DATA_PATH}/.zgroup"
    "${TRAIN_DATA_PATH}/data/.zgroup"
    "${TRAIN_DATA_PATH}/meta/.zgroup"
    "${TRAIN_DATA_PATH}/data/images"
    "${TRAIN_DATA_PATH}/data/robot_state"
    "${VALID_DATA_PATH}/.zgroup"
    "${VALID_DATA_PATH}/data/.zgroup"
    "${VALID_DATA_PATH}/meta/.zgroup"
    "${VALID_DATA_PATH}/data/images"
    "${VALID_DATA_PATH}/data/robot_state"
  )
  local path
  for path in "${required_paths[@]}"; do
    [[ -e "${path}" ]] || return 1
  done
  has_files "${TRAIN_DATA_PATH}/data/images" || return 1
  has_files "${TRAIN_DATA_PATH}/data/robot_state" || return 1
  has_files "${VALID_DATA_PATH}/data/images" || return 1
  has_files "${VALID_DATA_PATH}/data/robot_state" || return 1
}

log "bootstrap wait start: task_name=${TASK_NAME} retry_interval_sec=${DATA_RETRY_INTERVAL_SEC}"

# 数据还没拷过来时，这里按 10 分钟周期等待，不让上层监督器误以为脚本已经失败。
# 一旦数据到位，后续交给通用 train guard：
# 1. 第一次启动用主线 `lane_a_mainline + fm_autodl_lab.json`
# 2. 之后如果训练中断，会自动基于同一 run 的 latest.pt 断点续训
while ! dataset_ready; do
  log "waiting for complete dataset: train=${TRAIN_DATA_PATH} valid=${VALID_DATA_PATH}"
  sleep "${DATA_RETRY_INTERVAL_SEC}"
done

log "dataset ready; hand over to train guard"

export RUN_NAME="${RUN_NAME}"
export TASK_NAME="${TASK_NAME}"
export TRAIN_DATA_PATH="${TRAIN_DATA_PATH}"
export VALID_DATA_PATH="${VALID_DATA_PATH}"
export EXPERIMENT_NAME="put_books_on_bookshelf_mainline_500"
export DESCRIPTION="Put books on bookshelf MDIT mainline 500 epochs"
export STAGE_EPOCHS="500"
export CHECKPOINT_EVERY="100"
export DEVICE="${DEVICE:-cuda}"

# 这里沿用当前 close_door 任务已经验证稳定的 64x2 执行形态，
# 只调整吞吐，不改变主线方法和等效 global batch。
export BATCH_SIZE_OVERRIDE="64"
export GRAD_ACCUM_STEPS_OVERRIDE="2"
export BATCH_FALLBACK_TIERS_JSON="[[64,2],[32,4],[16,8],[8,16]]"

exec "${REPO_ROOT}/scripts/run_mdit_train_guard.sh"
