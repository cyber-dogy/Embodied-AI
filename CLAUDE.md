# CLAUDE.md - autodl_unplug_charger_transformer_fm

## Project Overview

Imitation learning for RLBench `unplug_charger` robot manipulation task.
Two research lines: PDIT (point cloud, baseline 0.85@100ep) and MDIT (RGB+CLIP, active research).
Goal: make MDIT surpass PDIT's 0.85 success rate.

## Active Branch

`autoresearch/20260409-mdit`

## Key Paths

- Configs: `configs/mdit/faithful_baseline.json`
- Training entry: `scripts/run_mdit_autoresearch_trial.py`
- Loop entry: `scripts/run_mdit_autoresearch_loop.py`
- Results log: `results.tsv`
- Trial records: `autoresearch_records/`
- Relay checklist: `todolist.md`

## Environment

- Conda env: `mdit_env` (torch 2.1.2+cu121, timm 0.9.16, transformers 4.46.3)
- Activate: `source ~/miniconda3/etc/profile.d/conda.sh && conda activate mdit_env`
- Use `HF_HUB_OFFLINE=1` if network is unreliable (CLIP models are cached)
- Current machine: RTX 4070 12GB (train-only, no RLBench)

## MDIT Known Results

- faithful baseline: 0.40 @ 20ep
- cam_front_wrist: 0.35 @ 20ep (worse)
- cam_all5: 0.00 @ 20ep (failed)
- dropout0: 0.10-0.15 @ 20ep (eliminated)
- obs3 confirmed better than obs2, used as default going forward
- h1_stats_aug: 0.55 @ 20ep
- h2_dit_dynamics: 0.65 @ 20ep (best screening so far)

## Training Commands

### Train-only (no RLBench on this machine)

```bash
source ~/miniconda3/etc/profile.d/conda.sh && conda activate mdit_env
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
HF_HUB_OFFLINE=1 python scripts/run_mdit_autoresearch_trial.py \
  --phase train-only \
  --config configs/mdit/faithful_baseline.json \
  --stage-epochs <N> \
  --checkpoint-every 100 \
  --device cuda \
  --experiment-name <name> \
  --description "<desc>" \
  --set n_obs_steps=3 \
  --set use_amp=true
```

### Audit-only (on RLBench machine)

```bash
python scripts/run_mdit_autoresearch_trial.py \
  --phase audit-only \
  --run-dir ckpt/<run_name> \
  --eval-episodes 20 \
  --audit-timeout-sec 7200 \
  --headless --show-progress
```

---

# Autoresearch Protocol for Claude Code

## Overview

Adapted from Karpathy's autoresearch. Claude Code acts as the autonomous experimenter:
modify code/config -> train -> measure -> keep/discard -> log -> repeat.

## Protocol Rules

1. **Measure everything**: No experiment without measurement. Use validation loss as proxy when RLBench is unavailable.
2. **Revert failures**: Only advance on improvements. Use `git reset --hard HEAD~1` for regressions.
3. **Commit before running**: Every experiment gets a commit before execution, format: `experiment: <short description>`.
4. **Log everything**: Append to `results.tsv` after every experiment.
5. **Stay autonomous**: Once the loop starts, keep going. Think harder if stuck.
6. **Simple first**: Try parameter tweaks before architectural changes.

## Experiment Loop

```
1. THINK   - Analyze previous results and current code. Form hypothesis.
2. EDIT    - Modify in-scope files (configs, model code). Keep changes minimal.
3. COMMIT  - git add + commit: "experiment: <description>"
4. RUN     - Execute training. Redirect output to run.log.
5. MEASURE - Extract validation loss from output. Compare to best.
6. DECIDE  - IMPROVED -> keep. SAME/WORSE -> git reset --hard HEAD~1. CRASH -> fix or revert.
7. LOG     - Append row to results.tsv: experiment, commit, metric, status, description.
8. REPEAT
```

## Experiment Strategy Priority

1. Low-hanging fruit: parameter tweaks, obvious inefficiencies
2. Informed by results: explore promising directions deeper
3. Diversify after plateaus: if last 3-5 experiments failed, try different approach
4. Combine winners: if A and B each improved independently, try A+B
5. Simplification passes: periodically try removing complexity
6. Radical changes: after exhausting incremental ideas

## Screening Rules

- 100-epoch screening: rank by success@20 (or valid loss proxy)
- Top 2 advance to 500-epoch deep run with 100-episode eval
- No hard threshold cutoffs for screening
- Tie-breaker: simpler change wins

## Checkpoint & Disk Rules

- Screening (100ep): delete all .pt after eval, keep only JSON/config/stats
- Deep run (500ep): keep epoch_0100..0500.pt + best_success.pt
- Max 1 active mdit run at a time
- If disk is tight, stop and clean before continuing

## Current Default Baseline

- n_obs_steps=3 (obs3)
- use_amp=true
- batch_size=8, grad_accum_steps=4
- 3 cameras: front, wrist, overhead
- Optimizer: AdamW lr=2e-5
