# TODO List

Last updated: 2026-04-10

## Pause Snapshot

- Old-machine training has been stopped on purpose before migration.
- Verified no active `mdit` or `pdit` training / autoresearch processes remain on the old machine.
- Current continuation branch is clean and already pushed:
  - `autoresearch/20260409-mdit`
- If you move now, treat the repo as a paused snapshot:
  - code should come from `git`
  - local artifacts should be copied separately if you want to keep them
- Recommended migration doc:
  - `docs/2026-04-10-5090-migration-checklist.md`

## Current Git State

- Active continuation branch: `autoresearch/20260409-mdit`
- This branch contains the dual-line `pdit/` + `mdit/` layout and the latest MDIT autoresearch fixes.
- `main` is still the older stable snapshot; for continuation on a new machine, check out `autoresearch/20260409-mdit`.

## What Is Already Done

### Dual-line repo layout

- `pdit/`: current point-cloud FM + DiT baseline line
- `mdit/`: faithful MDIT line for RGB + text RLBench experiments
- Shared pieces kept in `common/`, `envs/`, `research/`, `scripts/`, `configs/`, `notebooks/`, `docs/`

### MDIT environment bring-up

- `mdit_env` is repaired and usable
- Confirmed working stack:
  - `numpy 1.23.5`
  - `scipy 1.10.1`
  - `torch 2.1.2+cu121`
  - `timm 0.9.16`
  - `transformers 4.46.3`

### Important MDIT bug fixes already committed

- Fixed rollout camera-contract bug:
  - runtime RLBench RGB observations were not being filtered to the configured camera subset
  - this caused the faithful MDIT rollout path to receive `5` cameras while training used `3`
  - file: `mdit/model/model.py`
- Fixed audit finalize crash:
  - `best_success.pt` materialization crashed when the selected record came from a special checkpoint with `epoch=None`
  - file: `research/mdit_trial_runner.py`
- Reduced search-time audit cost:
  - candidate-stage audit now focuses on periodic checkpoints instead of always spending a long time on `best_valid`
  - file: `research/mdit_trial_runner.py`
- Added regression tests for the above:
  - file: `tests/test_mdit_runtime_and_trial_runner.py`

## Current Experiment Progress

### Faithful MDIT baseline

- Run dir:
  - `ckpt/unplug_charger_mdit_faithful_v1__mdit_faithful_baseline_100__e0100__20260409_183119`
- Training completed:
  - `100 epochs`
  - `best valid epoch = 12`
  - `best valid loss = 0.1715`
- Real periodic checkpoint audit result after rollout fix:
  - `epoch_0100 success@20 = 0.40`
  - `8 / 20` successes
  - `mean_steps = 160.75`
- Conclusion:
  - faithful MDIT is now truly runnable
  - but current baseline is still clearly weaker than current PDIT baseline

### Candidate screening progress

- Finished:
  - `cam_front_wrist_100`: `0.35 @ 20 episodes`
  - `cam_all5_100`: `0.00 @ 20 episodes`
- In progress on the old machine:
  - `obs3_100`
  - local run dir:
    - `ckpt/unplug_charger_mdit_faithful_v1__obs3_100__e0100__20260410_130635`
  - local log:
    - `autoresearch_records/logs/obs3_100.log`

Important:

- `ckpt/` is not pushed to GitHub.
- Active runs on the old machine do **not** transfer through git.
- If switching machines now, assume `obs3_100` needs to be rerun on the new machine.
- If you want to keep partial local evidence anyway, copy:
  - `ckpt/`
  - `autoresearch_records/`
  - `results.tsv`

## Best Known Metrics Right Now

- PDIT baseline reference:
  - `0.85 @ 100 episodes`
- MDIT faithful baseline:
  - `0.40 @ 20 episodes`
- MDIT front+wrist:
  - `0.35 @ 20 episodes`
- MDIT all-5-cameras:
  - `0.00 @ 20 episodes`

## What To Do Next

### 1. Resume on the new machine

```bash
cd /path/to/Embodied-AI/autodl_unplug_charger_transformer_fm
git fetch origin
git checkout autoresearch/20260409-mdit
```

### 2. Recreate / verify environment

Use `mdit_env` for MDIT experiments.

```bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate mdit_env
python -m unittest discover -s tests -v
```

### 3. Resume the screening queue

If `obs3_100` was not preserved locally on the new machine, rerun it:

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase full \
  --config configs/mdit/faithful_baseline.json \
  --stage-epochs 100 \
  --checkpoint-every 100 \
  --eval-episodes 20 \
  --device cuda \
  --experiment-name obs3_100 \
  --description "increase observation steps to 3" \
  --audit-timeout-sec 7200 \
  --headless \
  --show-progress \
  --set n_obs_steps=3
```

Then continue the remaining candidate queue in this order:

1. `dropout0_100`
2. `layers8_100`
3. `rope_100`
4. `uniform_t_100`
5. `vision_last_block_100`

### 4. Promotion rule after 100-epoch screening

- Rank by `success_20`
- Use simpler change as tie-breaker
- Promote top `2` to `500 epoch + 100 episode` evaluation

### 5. Deep-run commands

Use the same trial runner, but with:

- `--stage-epochs 500`
- `--eval-episodes 100`
- same overrides as the winning 100-epoch candidate

## Useful Files

- Loop summary:
  - `autoresearch_records/mdit_autoresearch_loop_mdit_screen_20260409.json`
- MDIT baseline record:
  - `autoresearch_records/unplug_charger_mdit_faithful_v1__mdit_faithful_baseline_100__e0100__20260409_183119.json`
- Experiment log directory:
  - `autoresearch_records/logs/`
- Search runner:
  - `scripts/run_mdit_autoresearch_loop.py`
- Single-trial runner:
  - `scripts/run_mdit_autoresearch_trial.py`

## Short Diagnosis

- The original `0.0` MDIT result was partly fake because rollout was broken by a camera-shape bug.
- After the fix, faithful MDIT is real but weak.
- The next question is no longer "can MDIT run?".
- The next question is "which faithful MDIT setting can raise `success@20` enough to justify a `500 epoch + 100 episode` deep run?"
