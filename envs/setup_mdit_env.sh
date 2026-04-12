#!/usr/bin/env bash
set -euo pipefail

ENV_NAME="${1:-mdit_env}"
PYTHON_VERSION="${PYTHON_VERSION:-3.10}"
CONDA_SH="${CONDA_SH:-$HOME/miniconda3/etc/profile.d/conda.sh}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INSTALL_EVAL="${INSTALL_EVAL:-0}"
TORCH_VERSION="${TORCH_VERSION:-2.9.1}"
TORCHVISION_VERSION="${TORCHVISION_VERSION:-0.24.1}"
TORCHAUDIO_VERSION="${TORCHAUDIO_VERSION:-2.9.1}"
TORCH_CHANNEL="${TORCH_CHANNEL:-cu124}"
TORCH_INDEX_URL="${TORCH_INDEX_URL:-https://download.pytorch.org/whl/${TORCH_CHANNEL}}"

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

echo "[3/5] Installing PyTorch (${TORCH_VERSION}) from ${TORCH_INDEX_URL}"
python -m pip install --upgrade pip
python -m pip install \
  --index-url "${TORCH_INDEX_URL}" \
  "torch==${TORCH_VERSION}" \
  "torchvision==${TORCHVISION_VERSION}" \
  "torchaudio==${TORCHAUDIO_VERSION}"

echo "[4/5] Installing core MDIT dependencies"
python -m pip install -r "${REPO_ROOT}/requirements.txt"
python -m pip install -e "${REPO_ROOT}"

if [[ "${INSTALL_EVAL}" == "1" ]]; then
  if [[ -z "${COPPELIASIM_ROOT:-}" ]]; then
    echo "INSTALL_EVAL=1 requires COPPELIASIM_ROOT to be exported first." >&2
    exit 1
  fi
  echo "[5/5] Installing RLBench/PyRep evaluation dependencies"
  python -m pip install -r "${REPO_ROOT}/requirements_eval.txt"
else
  echo "[5/5] Skipping RLBench/PyRep evaluation dependencies"
  echo "      Re-run with INSTALL_EVAL=1 after COPPELIASIM_ROOT is configured."
fi

echo
echo "Environment ready."
echo "Suggested smoke checks:"
echo "  conda activate ${ENV_NAME}"
echo "  python -c 'import torch; print(torch.__version__, torch.cuda.is_available())'"
echo "  python -c 'import timm, transformers; print(timm.__version__, transformers.__version__)'"
echo "  python -m unittest discover -s tests -v"
