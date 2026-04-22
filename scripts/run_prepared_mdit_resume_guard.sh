#!/usr/bin/env bash
set -euo pipefail

# 这条脚本只负责托管“已经准备好的 resume run”。
# 它不会改 run 配置，也不会生成新 run，只会持续用同一个 latest.pt 续训。

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

REPO_ROOT="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm"
cd "${REPO_ROOT}"

RUN_DIR="${RUN_DIR:-}"
DEVICE="${DEVICE:-cuda}"

if [[ -z "${RUN_DIR}" ]]; then
  echo "RUN_DIR is required" >&2
  exit 1
fi

CONFIG_PATH="${RUN_DIR}/config.json"
LATEST_PATH="${RUN_DIR}/latest.pt"
RUN_NAME="$(basename "${RUN_DIR}")"
LOG_PATH="${REPO_ROOT}/autoresearch_records/logs/${RUN_NAME}__resume_guard.log"

mkdir -p "${REPO_ROOT}/autoresearch_records/logs"

log() {
  printf '[%s] %s\n' "$(date '+%F %T %z')" "$*" | tee -a "${LOG_PATH}"
}

if [[ ! -f "${CONFIG_PATH}" ]]; then
  echo "config missing: ${CONFIG_PATH}" >&2
  exit 1
fi
if [[ ! -f "${LATEST_PATH}" ]]; then
  echo "latest checkpoint missing: ${LATEST_PATH}" >&2
  exit 1
fi

log "prepared resume guard start: run_name=${RUN_NAME} run_dir=${RUN_DIR}"

while true; do
  if python scripts/train.py \
    --line mdit \
    --config "${CONFIG_PATH}" \
    --strategy fm \
    --device "${DEVICE}" \
    --resume \
    >> "${LOG_PATH}" 2>&1; then
    rc=0
  else
    rc=$?
  fi

  log "process exit rc=${rc}"
  if [[ ${rc} -eq 0 ]]; then
    log "training completed"
    break
  fi

  # 异常退出后保留现场，10 秒后继续接同一条 run。
  log "restart after 10s"
  sleep 10
done
