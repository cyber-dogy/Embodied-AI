# FM/DiT Autoresearch Pipeline

## What Changed

- Script wrappers under `scripts/` now force-import this repo's local `src/` tree first.
- Training defaults were aligned to safer research behavior:
  - `resume_from_latest = false`
  - `checkpoint_every_epochs = 100`
  - `best_valid.pt` is now the canonical best-valid checkpoint name.
- Checkpoint saving is now atomic to avoid corrupt `latest.pt` writes.
- FM imports no longer depend on diffusion-only packages unless the diffusion policy is explicitly requested.
- A new single-trial entrypoint was added:
  - `scripts/run_autoresearch_trial.py`
  - `autodl-run-autoresearch-trial`

## Trial Runner

The new trial runner supports three compatible phases:

1. `--phase full`
   - train and then audit in one command
2. `--phase train-only`
   - train only, never touches RLBench
3. `--phase audit-only`
   - audit an existing trained run later in a fresh process

The recommended workflow for this project is now:

1. `train-only`
2. wait for the run to finish
3. `audit-only` from a separate process
4. let audit materialize `best_success.pt`, write `audit_report.json`, and prune non-essential files

Key output fields:

- `trial_score`
- `pending_offline_audit`
- `offline_audit_command`
- `success_100`
- `success_300`
- `success_500`
- `collapse_detected`
- `best_ckpt_path`
- `kept_ckpt_paths`

## Example Commands

Train-only smoke:

```bash
/home/gjw/miniconda3/envs/pfp_env/bin/python scripts/run_autoresearch_trial.py \
  --phase train-only \
  --config configs/fm_autodl_lab.json \
  --stage-epochs 2 \
  --checkpoint-every 1 \
  --experiment-name smoke
```

Offline audit of an existing run:

```bash
/home/gjw/miniconda3/envs/pfp_env/bin/python scripts/run_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<run_name>
```

Baseline 500-epoch training:

```bash
/home/gjw/miniconda3/envs/pfp_env/bin/python scripts/run_autoresearch_trial.py \
  --phase train-only \
  --config configs/fm_autodl_lab.json \
  --stage-epochs 500 \
  --checkpoint-every 100 \
  --experiment-name baseline_500
```

## Logs And Records

- `results.tsv`
  - lightweight experiment ledger for autoresearch
- `autoresearch_records/<run_name>.json`
  - per-trial machine-readable result, kept even when failed run dirs are deleted
- `<run_dir>/audit_report.json`
  - detailed success/valid-loss audit for surviving runs
- `<run_dir>/trial_request.json`
  - manifest used by `audit-only` to reproduce the offline evaluation settings

`results.tsv`, `run.log`, and `autoresearch_records/` are excluded locally via `.git/info/exclude`.

## Current Known Blocker

The real `pfp_env` smoke run now reaches FM training and writes checkpoints correctly, but the RLBench checkpoint audit stage can still stall after:

- training is already complete
- `eval_all_checkpoints.py` discovers the checkpoint
- the simulator reports it has launched

To keep offline audit from hanging forever, the trial runner supports:

```bash
--audit-timeout-sec <seconds>
```

On timeout or other audit failures:

- the run directory is kept
- the current `best_valid.pt` and periodic checkpoints remain
- the JSON output sets `pending_offline_audit = true`
- the same `offline_audit_command` can be retried later

## Recommended Next Run Order

1. Run `train-only` for the clean 500-epoch baseline.
2. Launch `audit-only` separately when the CoppeliaSim environment is stable.
3. Start the H1-H4 screening schedule with the same two-step pattern.
