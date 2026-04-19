#!/usr/bin/env bash
set -euo pipefail

# 这条脚本用于“先建档、后续训”的单 run 托管。
# 第一次启动用 autoresearch train-only 建立标准 trial 记录；
# 之后如果中断，则直接用原生 --resume 接回同一个 run。

source /opt/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env

REPO_ROOT="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm"
cd "${REPO_ROOT}"

RUN_NAME="${RUN_NAME:-close_door_mdit_rgb_text_3token_500}"
TASK_NAME="${TASK_NAME:-close_door}"
TRAIN_DATA_PATH="${TRAIN_DATA_PATH:-${REPO_ROOT}/data/${TASK_NAME}/train}"
VALID_DATA_PATH="${VALID_DATA_PATH:-${REPO_ROOT}/data/${TASK_NAME}/valid}"
EXPERIMENT_NAME="${EXPERIMENT_NAME:-close_door_mainline_500}"
DESCRIPTION="${DESCRIPTION:-Close door MDIT mainline 500 epochs}"
STAGE_EPOCHS="${STAGE_EPOCHS:-500}"
CHECKPOINT_EVERY="${CHECKPOINT_EVERY:-100}"
DEVICE="${DEVICE:-cuda}"
BATCH_SIZE_OVERRIDE="${BATCH_SIZE_OVERRIDE:-}"
GRAD_ACCUM_STEPS_OVERRIDE="${GRAD_ACCUM_STEPS_OVERRIDE:-}"
BATCH_FALLBACK_TIERS_JSON="${BATCH_FALLBACK_Tiers_JSON:-${BATCH_FALLBACK_TIERS_JSON:-}}"
RUN_DIR="${REPO_ROOT}/ckpt/${RUN_NAME}"
LOG_PATH="${REPO_ROOT}/autoresearch_records/logs/${RUN_NAME}__guard.log"

mkdir -p "${REPO_ROOT}/autoresearch_records/logs"

log() {
  printf '[%s] %s\n' "$(date '+%F %T %z')" "$*" | tee -a "${LOG_PATH}"
}

log "guard start: run_name=${RUN_NAME} task_name=${TASK_NAME} stage_epochs=${STAGE_EPOCHS}"

while true; do
  extra_args=()
  # 训练控制只在显式传入覆盖值时生效，默认完全沿用已有 run 配置。
  if [[ -n "${BATCH_SIZE_OVERRIDE}" ]]; then
    extra_args+=(--set "batch_size=${BATCH_SIZE_OVERRIDE}")
  fi
  if [[ -n "${GRAD_ACCUM_STEPS_OVERRIDE}" ]]; then
    extra_args+=(--set "grad_accum_steps=${GRAD_ACCUM_STEPS_OVERRIDE}")
  fi
  if [[ -n "${BATCH_FALLBACK_TIERS_JSON}" ]]; then
    extra_args+=(--set "batch_fallback_tiers=${BATCH_FALLBACK_TIERS_JSON}")
  fi

  if [[ -f "${RUN_DIR}/latest.pt" && -f "${RUN_DIR}/config.json" ]]; then
    log "resume existing run"
    if python scripts/train.py \
      --line mdit \
      --config "${RUN_DIR}/config.json" \
      --strategy fm \
      --run-name "${RUN_NAME}" \
      --device "${DEVICE}" \
      --resume \
      --set train_epochs="${STAGE_EPOCHS}" \
      --set checkpoint_every_epochs="${CHECKPOINT_EVERY}" \
      --set wandb_enable=true \
      --set wandb_resume=true \
      "${extra_args[@]}" \
      >> "${LOG_PATH}" 2>&1; then
      rc=0
    else
      rc=$?
    fi
  else
    log "bootstrap train-only trial"
    if python scripts/run_autoresearch_trial.py \
      --line mdit \
      --phase train-only \
      --config configs/mdit/fm_autodl_lab.json \
      --strategy fm \
      --stage-epochs "${STAGE_EPOCHS}" \
      --checkpoint-every "${CHECKPOINT_EVERY}" \
      --eval-episodes 20 \
      --device "${DEVICE}" \
      --run-name "${RUN_NAME}" \
      --experiment-name "${EXPERIMENT_NAME}" \
      --description "${DESCRIPTION}" \
      --enable-wandb \
      --no-cleanup-failed \
      --set task_name="\"${TASK_NAME}\"" \
      --set train_data_path="\"${TRAIN_DATA_PATH}\"" \
      --set valid_data_path="\"${VALID_DATA_PATH}\"" \
      --set research_lane="\"lane_a_mainline\"" \
      "${extra_args[@]}" \
      >> "${LOG_PATH}" 2>&1; then
      rc=0
    else
      rc=$?
    fi
  fi
  log "process exit rc=${rc}"
  if [[ ${rc} -eq 0 ]]; then
    log "training completed"
    break
  fi

  # 训练异常时保留现场，10 秒后直接接着同一个 run 续训。
  log "restart after 10s"
  sleep 10
done
