#!/usr/bin/env bash
set -euo pipefail

ENV_NAME="${1:-mdit_5090}"
PYTHON_VERSION="${PYTHON_VERSION:-3.10}"
CONDA_SH="${CONDA_SH:-$HOME/miniconda3/etc/profile.d/conda.sh}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INSTALL_EVAL="${INSTALL_EVAL:-0}"

if [[ ! -f "${CONDA_SH}" ]]; then
  echo "Conda init script not found: ${CONDA_SH}" >&2
  echo "Set CONDA_SH to your conda.sh path and rerun." >&2
  exit 1
fi

source "${CONDA_SH}"

echo "[1/5] Creating conda env ${ENV_NAME} with python=${PYTHON_VERSION}"
conda create -y -n "${ENV_NAME}" "python=${PYTHON_VERSION}" pip setuptools wheel

echo "[2/5] Activating ${ENV_NAME}"
conda activate "${ENV_NAME}"

echo "[3/5] Installing PyTorch cu130 wheels"
python -m pip install --upgrade pip
python -m pip install \
  --index-url https://download.pytorch.org/whl/cu130 \
  torch==2.9.1 \
  torchvision==0.24.1 \
  torchaudio==2.9.1

echo "[4/5] Installing repo dependencies"
python -m pip install -r "${REPO_ROOT}/envs/mdit_5090_requirements.txt"
python -m pip install -e "${REPO_ROOT}"

if [[ "${INSTALL_EVAL}" == "1" ]]; then
  if [[ -z "${COPPELIASIM_ROOT:-}" ]]; then
    echo "INSTALL_EVAL=1 requires COPPELIASIM_ROOT to be exported first." >&2
    exit 1
  fi
  echo "[5/5] Installing RLBench/PyRep evaluation dependencies"
  python -m pip install -r "${REPO_ROOT}/envs/mdit_5090_eval_requirements.txt"
else
  echo "[5/5] Skipping RLBench/PyRep eval dependencies"
  echo "      Re-run with INSTALL_EVAL=1 after COPPELIASIM_ROOT is configured."
fi

echo
echo "Environment ready."
echo "Next checks:"
echo "  conda activate ${ENV_NAME}"
echo "  python -c 'import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0))'"
echo "  python -m unittest discover -s tests -v"
