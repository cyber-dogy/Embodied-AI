# FM/DiT Recovery Progress

Date: 2026-04-08

## Confirmed fixes

The following issues were real and have already been fixed in the repo:

1. Local import/path pollution
   - Training/eval wrappers now bootstrap the local `src/` tree first.
   - This removed namespace-package drift between the current repo and another workspace copy.

2. FM policy import coupling
   - `policies/__init__.py` no longer hard-imports diffusion dependencies before FM is used.
   - This removed an environment-specific failure mode unrelated to FM itself.

3. Broken PointNet import
   - `models/pointnet.py` now imports `dp_pytorch_util` from the correct local package path.

4. Checkpoint corruption risk
   - Checkpoints are now saved atomically instead of writing directly to the final path.
   - This was likely responsible for the previously corrupted `latest.pt`.

5. Offline audit fragility
   - `eval_all_checkpoints.py` now evaluates each checkpoint in its own subprocess.
   - This isolates RLBench/CoppeliaSim hangs to a single checkpoint instead of poisoning the whole sweep.

6. Offline audit stage-clobber bug
   - `audit-only` previously overwrote stored `stage_epochs` with the default `500`, causing false collapse detection for 100-epoch runs.
   - This has been fixed and covered by a regression test.

## New experiment knobs added

These are now available but not all of them have been promoted into full long-running trials yet:

- `decoder_condition_mode = mean_pool | cross_attn`
- `final_layer_zero_init = true | false`
- `augment_data = true | false`
- `augment_translation_sigma`
- `augment_rotation_sigma`
- `robot_state_mean`
- `robot_state_std`
- `fm_loss_weights`
- CLI `--set key=value` overrides for both `train.py` and `run_autoresearch_trial.py`

## Baseline@100 result

### Train-only run

Run name:

- `unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_100__e0100__20260408_002048`

Important training facts:

- Best valid loss: `0.6605488730496482`
- Best valid epoch: `31`
- Final valid loss at epoch 100: `1.3372277707645768`
- Final train loss at epoch 100: `0.04642475039903581`

Interpretation:

- The repaired baseline is trainable and reaches a strong early regime.
- Overfitting is still present.
- It now starts as a gradual post-30-epoch drift, not an immediate early collapse.

### Offline success audit

The original 100-epoch run directory was incorrectly deleted by the old `audit-only` stage-clobber bug.
However the audit log captured the successful result before deletion.

Confirmed success result:

- `epoch_0100 success_rate = 0.90`
- `18 / 20` episodes succeeded
- Mean steps: `79.55`

Interpretation:

- The repaired baseline already exceeds the expected "`100` epochs should reach `80%+`" target.
- Therefore the old failure mode was not solely due to task difficulty or dataset limits.
- The previous training stack contained real engineering/repro issues that materially suppressed performance.

## Current baseline@500 run

Current run name:

- `unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741`

Status at the latest recorded checkpoint during this report:

- Latest epoch seen: `82`
- Latest valid loss: `0.8030234572330588`
- Best valid loss so far: `0.622098089048737`
- Best valid epoch so far: `53`

Interpretation:

- The 500-epoch mainline run is still active.
- The repaired baseline remains strong early, but the valid-loss rebound pattern still exists.
- The unresolved question is whether this late overfitting also causes a behavior drop by epochs `300` and `500`.

## Current diagnosis

### Category A: Environment and reproducibility

This was a major root cause.

- Mixed import paths meant the code being trained was not guaranteed to be the code visible in the repo.
- FM imports were coupled to unrelated diffusion dependencies.
- This alone made previous conclusions about "the model architecture" unreliable.

### Category B: Archiving and audit pipeline

This was also a major root cause.

- Corrupted `latest.pt` was real.
- Audit runs were previously vulnerable to simulator hangs.
- `audit-only` could falsely mark stage-100 runs as collapsed because it silently treated them as stage-500 runs.

### Category C: Model/training dynamics

This remains a real secondary issue.

- Even after the pipeline fixes, the baseline still overfits after the early sweet spot.
- In the repaired 100-epoch run, best valid was at epoch 31 while final valid loss more than doubled by epoch 100.
- So "trainability" is no longer the main blocker, but "late-stage generalization stability" still needs work.

### Category D: Candidate architectural bottlenecks still worth testing

These have not been ruled out yet:

- Decoder condition mean-pooling instead of token-aware cross-attention
- Output-layer initialization sensitivity
- Missing data augmentation in the original training setup
- Lack of robot-state standardization

## Bottom line so far

The repo was not failing for a single reason.

The strongest confirmed conclusion is:

- The original low/unstable performance was heavily amplified by training-stack and evaluation-stack bugs.
- After fixing those issues, the baseline already reaches `0.90 success@100` on `20` offline episodes.
- The remaining problem is no longer "why can it not learn at all?"
- The remaining problem is "how do we keep the strong early policy from drifting by epochs 300 to 500?"
