# 5090 Migration Checklist

Last updated: 2026-04-10

This note is the handoff for moving the current `pdit + mdit` repo to a new machine with an RTX 5090 and a local CUDA 13.0 toolkit.

## Current Pause State

- Old-machine training has been stopped before migration.
- The current continuation branch is:
  - `autoresearch/20260409-mdit`
- The repo is clean and already pushed on that branch.
- The latest meaningful local progress is:
  - `mdit` faithful baseline finished and audited
  - `obs3_100` was only a local in-progress run and should be treated as rerun-needed on the new machine

## What Should Move By Git

Use `git` for code.

Why:

- the branch already contains the dual-line `pdit/ + mdit/` structure
- code history is cleaner and reproducible
- you avoid copying broken local Python state by accident

Recommended code migration:

```bash
git clone <your-remote-url>
cd autodl_unplug_charger_transformer_fm
git checkout autoresearch/20260409-mdit
```

If the repo already exists on the new machine:

```bash
git fetch origin
git checkout autoresearch/20260409-mdit
git pull --ff-only
```

## What Should Move By Copy Or Rsync

Do **not** rely on git for local artifacts. Copy them explicitly if you want continuity.

Recommended artifacts to copy:

- `ckpt/`
- `autoresearch_records/`
- `results.tsv`
- local dataset files if they are not regenerated elsewhere

Recommended command:

```bash
rsync -avh --info=progress2 \
  /old_machine/path/autodl_unplug_charger_transformer_fm/ckpt \
  /old_machine/path/autodl_unplug_charger_transformer_fm/autoresearch_records \
  /old_machine/path/autodl_unplug_charger_transformer_fm/results.tsv \
  /new_machine/path/autodl_unplug_charger_transformer_fm/
```

If disk is tight, at minimum keep:

- `ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741`
- `ckpt/unplug_charger_mdit_faithful_v1__mdit_faithful_baseline_100__e0100__20260409_183119`
- `autoresearch_records/`

## 5090 Environment Recommendation

For the new 5090 machine, create a **fresh MDIT-first environment**.

Do **not** try to directly reuse the old-machine `torch 2.1.2 + cu121` environment on the 5090 box.

Why:

- the current old-machine environment was validated on CUDA 12.1 wheels
- your new machine already has CUDA 13.0
- official current PyTorch binaries now have CUDA 13.0 wheels, so it is better to move forward cleanly instead of forcing an older stack

Recommended target:

- Python: `3.10`
- PyTorch: `2.9.1`
- torchvision: `0.24.1`
- torchaudio: `2.9.1`
- wheel index: `cu130`

Pinned user-space packages are in:

- `envs/mdit_5090_requirements.txt`
- `envs/mdit_5090_eval_requirements.txt`

One-command bootstrap script:

- `envs/setup_mdit_5090_env.sh`

## Official Compatibility Notes

These are the important external constraints for the new machine:

- NVIDIA documents CUDA 13.0 GA requiring Linux driver `>= 580.65.06`, and CUDA 13.0 Update 2 requiring `>= 580.95.05`.
- PyTorch officially provides CUDA 13.0 install targets, so a fresh `cu130` PyTorch environment is the right direction for a 5090 box.

If the new machine driver is older than the CUDA 13.0 minimum, upgrade the NVIDIA driver first.

## One-Click Setup On The New Machine

From the repo root:

```bash
chmod +x envs/setup_mdit_5090_env.sh
./envs/setup_mdit_5090_env.sh mdit_5090
```

This installs:

- Python `3.10`
- PyTorch `2.9.1` with `cu130`
- the pinned MDIT research dependencies
- the local repo in editable mode

If you also want RLBench/PyRep evaluation on the new machine, install CoppeliaSim first and export:

```bash
export COPPELIASIM_ROOT=$HOME/CoppeliaSim
export LD_LIBRARY_PATH=$COPPELIASIM_ROOT:$LD_LIBRARY_PATH
export QT_QPA_PLATFORM_PLUGIN_PATH=$COPPELIASIM_ROOT
```

Then run:

```bash
INSTALL_EVAL=1 ./envs/setup_mdit_5090_env.sh mdit_5090
```

## Validation Commands

After environment creation:

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate mdit_5090
python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0))"
python -m unittest discover -s tests -v
```

If RLBench eval is installed, also verify:

```bash
python scripts/eval_mdit_checkpoint.py --help
python scripts/eval_pdit_checkpoint.py --help
```

## Resume Plan On The New Machine

1. Check out `autoresearch/20260409-mdit`
2. Create `mdit_5090`
3. Copy `ckpt/` and `autoresearch_records/` if you want local continuity
4. Run tests
5. Rerun `obs3_100`
6. Continue the MDIT screening queue

The restart command for `obs3_100` is already documented in `todolist.md`.

## Practical Recommendation

Best practice is:

- `git` for code
- `rsync` for `ckpt/`, `autoresearch_records/`, and local datasets

I do **not** recommend copying the whole old repo directory as your main migration method, because that tends to drag old environment assumptions and stale local state along with it.
