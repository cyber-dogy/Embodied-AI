# CLAUDE.md - autodl_unplug_charger_transformer_fm

## Project Overview

Imitation learning for RLBench `unplug_charger` robot manipulation.
Two active lines:

- `pdit`: point cloud baseline, proven strong
- `mdit`: RGB+text research line, now guarded by autoresearch

Current MDIT target: find the best `RGB+text + FM + Transformer` path without drifting away from PDIT-proven training/eval semantics.

## Key Paths

- Lane A config: `configs/mdit/fm_autodl_lab.json`
- Lane B config: `configs/mdit/fm_autodl_lane_b.json`
- Trial entry: `scripts/run_mdit_autoresearch_trial.py`
- Loop entry: `scripts/run_mdit_autoresearch_loop.py`
- Shared dispatch entry: `scripts/run_autoresearch_trial.py --line mdit`
- Loop state: `autoresearch_records/mdit_loop_state__<tag>.json`
- Champion alias: `ckpt/mdit_best` or `ckpt/mdit_best.json`
- Champion doc: `docs/mdit/best_path.md`
- Results log: `results.tsv`
- Trial records: `autoresearch_records/`

## Environment

- Conda env: `mdit_env`
- Activate:
  - `source /opt/miniconda3/etc/profile.d/conda.sh`
  - `conda activate mdit_env`
- CLIP models may rely on local cache; `HF_HUB_OFFLINE=1` is acceptable when needed

## Core Rules

1. Keep `RGB+text`, `FM`, and `Transformer`
2. Do not mutate `pdit/` behavior when changing `mdit/`
3. Training/eval must stay on the same contract
4. Every run must leave traces in:
   - `autoresearch_records/`
   - `docs/mdit/`
   - `docs/fixes.md`
5. Only the current best MDIT artifact set should remain as the long-term champion

## Default Commands

### Single Trial

```bash
python scripts/run_autoresearch_trial.py \
  --line mdit \
  --phase full \
  --config configs/mdit/fm_autodl_lab.json \
  --stage-epochs 100 \
  --checkpoint-every 50 \
  --eval-episodes 20 \
  --device cuda
```

### Autoresearch Loop

```bash
python scripts/run_mdit_autoresearch_loop.py \
  --tag unplug_rgb_text_search \
  --lane-a-config configs/mdit/fm_autodl_lab.json \
  --lane-b-config configs/mdit/fm_autodl_lane_b.json \
  --device cuda \
  --audit-timeout-sec 7200 \
  --train-stall-timeout-sec 2700
```

### Tmux Hand-off

```bash
python scripts/run_mdit_autoresearch_loop.py \
  --tag unplug_rgb_text_search \
  --lane-a-config configs/mdit/fm_autodl_lab.json \
  --lane-b-config configs/mdit/fm_autodl_lane_b.json \
  --device cuda \
  --tmux-session mdit_autoresearch
```

## Evaluation Contract

- Eval rebuilds from checkpoint payload + `experiment_manifest.json`
- Allowed runtime overrides are limited to device/seed/headless/progress/heartbeat
- Drift is written to `eval_manifests/*.json` and should be treated as a blocked mainline conclusion
