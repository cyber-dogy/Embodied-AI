#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm"
export RUN_DIR="${RUN_DIR:-${REPO_ROOT}/ckpt/unplug_charger_mdit_rgb_text_3token_500_resume_from_epoch0100}"
export DEVICE="${DEVICE:-cuda}"

exec "${REPO_ROOT}/scripts/run_prepared_mdit_resume_guard.sh"
