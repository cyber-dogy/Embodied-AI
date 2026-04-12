# 5090 + CUDA 13.0 Environment Setup

Last updated: 2026-04-10

This document is the practical environment setup guide for continuing work on:

- `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm`
- with copied companion repos:
  - `PointFlowMatch/`
  - `dit-policy/`
  - `multitask_dit_policy/`
  - `RoboTwin/`

The main target is to continue the current `MDIT` research line on a new RTX 5090 machine with local CUDA 13.0.

## Recommendation In One Sentence

For the new 5090 machine:

- use a **fresh `mdit_5090` conda environment**
- use **PyTorch cu130**
- continue the current branch:
  - `autoresearch/20260409-mdit`

Do **not** try to clone the old-machine `torch 2.1.2 + cu121` environment byte-for-byte onto the 5090 box.

## Why This Is The Right Direction

The current old-machine `mdit_env` was validated with:

- `torch 2.1.2+cu121`
- `torchvision 0.16.2+cu121`
- `torchaudio 2.1.2+cu121`

That stack was good enough for bring-up on the old GPU, but it is not the right first choice for a new 5090 + CUDA 13.0 workstation.

For the new machine, we should move forward to the official CUDA 13.0 wheels instead of forcing an older CUDA 12.1 runtime stack.

## Official Compatibility Notes

Two external compatibility facts matter here:

- NVIDIA CUDA 13.0 GA on Linux requires driver `>= 580.65.06`
- NVIDIA CUDA 13.0 Update 2 on Linux requires driver `>= 580.95.05`

Source:

- NVIDIA CUDA Toolkit release notes:
  - https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/

PyTorch also officially provides CUDA 13.0 install targets. The stable `2.9.1` install command is:

```bash
pip install torch==2.9.1 torchvision==0.24.1 torchaudio==2.9.1 --index-url https://download.pytorch.org/whl/cu130
```

Source:

- PyTorch previous versions:
  - https://pytorch.org/get-started/previous-versions/

## Scope Of This Environment

This setup guide is optimized for:

- `autodl_unplug_charger_transformer_fm`
- especially the current `mdit/` line
- continued `autoresearch` on RLBench unplug_charger

This setup is **not** claiming that every copied companion repo is fully validated under the same environment yet.

Important distinction:

- `MDIT` on the new machine:
  - recommended to continue immediately with `cu130`
- `PDIT` on the new machine:
  - should be treated more carefully because older `pytorch3d` and related packages were validated with the older stack

## Recommended Environment Name

Use:

```bash
mdit_5090
```

## Fast Path

If you already copied the repo, the shortest path is:

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
chmod +x envs/setup_mdit_5090_env.sh
./envs/setup_mdit_5090_env.sh mdit_5090
```

This script will:

- create a new conda env
- install PyTorch `2.9.1` with `cu130`
- install the pinned user-space dependencies
- install this repo in editable mode

The script is here:

- [setup_mdit_5090_env.sh](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/envs/setup_mdit_5090_env.sh)

## Manual Setup

If you prefer manual control, use the steps below.

### 1. Create the environment

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda create -y -n mdit_5090 python=3.10 pip setuptools wheel
conda activate mdit_5090
python -m pip install --upgrade pip
```

### 2. Install PyTorch cu130

```bash
python -m pip install \
  --index-url https://download.pytorch.org/whl/cu130 \
  torch==2.9.1 \
  torchvision==0.24.1 \
  torchaudio==2.9.1
```

### 3. Install the repo dependencies

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
python -m pip install -r envs/mdit_5090_requirements.txt
python -m pip install -e .
```

Pinned package file:

- [mdit_5090_requirements.txt](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/envs/mdit_5090_requirements.txt)

### 4. Install RLBench / PyRep only when needed

If you need rollout evaluation on the new machine:

```bash
python -m pip install -r envs/mdit_5090_eval_requirements.txt
```

File:

- [mdit_5090_eval_requirements.txt](/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm/envs/mdit_5090_eval_requirements.txt)

## CoppeliaSim / RLBench Runtime Variables

Before RLBench eval, export:

```bash
export COPPELIASIM_ROOT=$HOME/CoppeliaSim
export LD_LIBRARY_PATH=$COPPELIASIM_ROOT:$LD_LIBRARY_PATH
export QT_QPA_PLATFORM_PLUGIN_PATH=$COPPELIASIM_ROOT
```

If you want GUI mode, `xcb` is still the safest default:

```bash
export QT_QPA_PLATFORM=xcb
```

## Validation Checklist

After setup:

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate mdit_5090
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0))"
python -m unittest discover -s tests -v
```

If RLBench eval is installed:

```bash
python scripts/eval_mdit_checkpoint.py --help
python scripts/eval_pdit_checkpoint.py --help
```

## Branch And Repo State To Continue

After copying the repo, run:

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
git fetch origin
git checkout autoresearch/20260409-mdit
git pull --ff-only
```

That is the current continuation branch for the dual-line `pdit + mdit` repo.

## What To Copy Alongside Code

Even if code is refreshed by git, you should still copy these local artifacts if you want continuity:

- `ckpt/`
- `autoresearch_records/`
- `results.tsv`

At minimum, copy:

- `ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741`
- `ckpt/unplug_charger_mdit_faithful_v1__mdit_faithful_baseline_100__e0100__20260409_183119`
- `autoresearch_records/`

## What I Recommend You Do First On The New Machine

Use this order:

1. Copy the selected repos
2. Refresh `autodl_unplug_charger_transformer_fm` with `git`
3. Create `mdit_5090`
4. Run tests
5. Confirm CUDA visibility
6. Resume MDIT screening

## Current Best Practical Choice

Right now the safest plan is:

- continue `MDIT` research in `mdit_5090`
- keep `PDIT` validation logically separate for now

That way, the 5090 migration helps the active research line immediately, without blocking on older point-cloud stack compatibility issues.
