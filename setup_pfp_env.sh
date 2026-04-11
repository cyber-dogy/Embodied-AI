#!/bin/bash
# Setup script for pfp_env environment
# Run this script to complete the environment setup

set -e

echo "=== Activating pfp_env ==="
source /opt/miniconda3/etc/profile.d/conda.sh
conda activate pfp_env

echo "=== Setting pip mirror to Tsinghua ==="
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

echo "=== Installing PyTorch 2.1.2 with CUDA 12.1 ==="
# This may take 10-30 minutes depending on network speed
pip install torch==2.1.2 torchvision==0.16.2 --index-url https://download.pytorch.org/whl/cu121

echo "=== Installing core ML dependencies ==="
pip install timm==0.9.16 transformers==4.46.3 diffusers==0.24.0 huggingface_hub==0.25.2

echo "=== Installing other dependencies ==="
pip install wandb tqdm ipykernel numba zarr numcodecs imagecodecs matplotlib imageio

echo "=== Installing spatialmath-python and open3d ==="
pip install spatialmath-python open3d

echo "=== Verifying installation ==="
python -c "
import torch
import numpy as np
import scipy
import timm
import transformers
import diffusers
print(f'PyTorch: {torch.__version__}')
print(f'CUDA available: {torch.cuda.is_available()}')
print(f'NumPy: {np.__version__}')
print(f'SciPy: {scipy.__version__}')
print(f'timm: {timm.__version__}')
print(f'transformers: {transformers.__version__}')
print(f'diffusers: {diffusers.__version__}')
print('All core dependencies installed successfully!')
"

echo "=== Setup complete! ==="
echo "To activate the environment, run:"
echo "  source /opt/miniconda3/etc/profile.d/conda.sh && conda activate pfp_env"
