# 2026-04-07 Training And Model Audit

## Scope

This note records the current findings for:

- training stability and checkpoint behavior
- dataset scale and normalization
- environment / reproducibility risks
- model-structure differences between the current backbone and official DiT

The goal is to keep a concrete change list before any implementation work starts.

## Confirmed Findings

### 1. The current run is overfitting early

Run:

- `ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1`

Observed from checkpoints:

- `best valid loss` appears at `epoch 45`
- `best success rate` from local rollout eval appears at `epoch 100` or `200`, both `0.55`
- by `epoch 1500`, `train loss` is still lower, but success rate has dropped to `0.20`

This is not just "loss is noisy"; it is a real train/valid and train/success mismatch.

### 2. `latest.pt` is corrupted

Confirmed in `pfp_env`:

- `best.pt` loads
- `epochs/epoch_1500.pt` loads
- `latest.pt` fails with `PytorchStreamReader failed locating file data/7`

This means checkpoint writing is not reliable enough right now.

### 3. The environment is not cleanly reproducible

In `pfp_env`, `autodl_unplug_charger_transformer_fm` is currently resolved as a namespace package across multiple directories instead of a normal editable install.

Observed package path:

- `/home/gjw/MyProjects/autodl_unplug_charger_transformer_fm`
- `/home/gjw/MyProjects/PointFlowMatch/autodl_unplug_charger_transformer_fm`

This means past experiments may have run against a mixed code state, not strictly the current `src/` tree.

### 4. There is a real import bug in the current `src/` code

Current file:

- `src/autodl_unplug_charger_transformer_fm/models/pointnet.py`

Problem:

- it imports `.dp_pytorch_util`
- that module is not in `models/`; it lives under `utils/`

So the current `src/` package is not self-consistent yet.

### 5. Dataset size is modest, and the validation set is small

Replay-buffer stats:

- train episodes: `100`
- train total steps: `10673`
- valid episodes: `10`
- valid total steps: `1199`

Sequence-sampler stats:

- train windows: `10573`
- valid windows: `1189`

Because windows overlap heavily, the effective number of independent training examples is much smaller than the window count suggests.

### 6. Current normalization center is noticeably off the data mean

Config value:

- `norm_pcd_center = [0.4, 0.0, 1.4]`

Approximate data means:

- train point cloud xyz mean: `[0.2138, -0.0442, 1.1178]`
- train robot xyz mean: `[0.2648, -0.0671, 1.1599]`
- valid robot xyz mean: `[0.2491, 0.0162, 1.1225]`

So the model is learning on a persistent offset, especially in `x` and `z`.

### 7. Training-time success selection is disabled

Current config:

- `success_selection_every_epochs = 0`
- `success_selection_episodes = 0`

So `best.pt` is selected by validation loss only, not by task success.

## High-Priority Change List

### A. Reproducibility and environment

- fix the broken import in `models/pointnet.py`
- make the project installable and runnable from one code tree only
- avoid namespace-package mixing between this repo and `PointFlowMatch`
- re-run smoke imports inside `pfp_env`

### B. Checkpoint reliability

- replace direct `torch.save(path)` writes with atomic save-then-rename
- keep `latest.pt` small enough to reduce corruption risk
- consider not storing the full training history inside every checkpoint
- treat `best.pt` and periodic epoch checkpoints as the current trustworthy artifacts

### C. Model selection and evaluation

- enable periodic success-based model selection
- separate `best_valid.pt` and `best_success.pt` if needed
- stop relying on validation loss as the only signal for task quality

### D. Data normalization and augmentation

- update normalization to data-driven statistics instead of a hand-picked center
- add actual training-time point-cloud / SE(3) augmentation
- verify whether per-dimension action normalization is needed

### E. Training configuration

- default to `--no-resume` for fresh experiments unless resume is explicit
- shorten training or add early-stop logic based on success / validation degradation
- revisit `loss_weights`, especially `xyz`, `rot6d`, and `grip`

## Model-Structure Audit Against Official DiT

Reference:

- official DiT repo: `facebookresearch/DiT`
- official `models.py`: https://github.com/facebookresearch/DiT/blob/main/models.py

Important point:

- the current backbone is only "DiT-style"
- it is not architecturally equivalent to the official DiT model

### 1. Conditioning path is very different from official DiT

Official DiT:

- uses a single transformer stack
- conditions each block with one conditioning vector `c`
- `c` is formed by combining timestep embedding and label embedding

Current backbone:

- first encodes observation tokens with a separate encoder
- then decodes action tokens with a separate decoder
- each decoder block does `torch.mean(cond, dim=0)` before modulation

Implication:

- observation tokens are compressed into a single pooled summary per block
- token-level conditional structure is discarded before the decoder uses it

This is a major bottleneck candidate for manipulation behavior.

### 2. There is no token-level cross-attention or equivalent in the decoder

Current decoder blocks use:

- self-attention over trajectory tokens only
- pooled condition enters through AdaLN modulation only

Implication:

- the model cannot attend directly from future action tokens to specific observation tokens
- all observation detail must survive the encoder and mean-pooling step

For point-cloud manipulation, this may be too lossy.

### 3. Final output layer initialization differs from official DiT

Official DiT zero-initializes:

- block adaLN modulation linear
- final adaLN modulation linear
- final output linear layer

Current backbone zero-initializes:

- decoder-block adaLN modulation linear
- final-layer adaLN modulation linear

But it does **not** zero-initialize:

- `FinalLayer.linear`

Instead it Xavier-initializes all linear weights in `FinalLayer.reset_parameters()`.

This is a real structural difference from official DiT and a plausible stability / training-dynamics issue.

### 4. Dropout differs from official DiT

Current backbone:

- uses `dropout = 0.1` in encoder attention, decoder attention, and MLP branches

Official DiT:

- effectively uses zero dropout inside the transformer block path

This is not automatically wrong, but it means the current model is not a faithful DiT transplant.

### 5. Positional treatment differs from official DiT

Current backbone:

- fixed sinusoidal encoder position
- learnable decoder position parameter

Official DiT:

- fixed sin-cos position embeddings for patch tokens

This is a smaller difference than the conditioning path, but it is still a real deviation.

### 6. The backbone is closer to a custom encoder-decoder transformer than to official DiT

In practice, the current architecture is:

- PointNet observation tokenizer
- transformer encoder over observation tokens
- transformer decoder over trajectory tokens
- AdaLN-conditioned self-attention decoder

That is a legitimate custom design, but it should not be expected to inherit official DiT results automatically.

## Other Modeling Risks Worth Revisiting

### 1. Action-space loss design

Current FM loss is plain MSE over:

- `xyz`
- `rot6d`
- `grip`

with equal weights.

Risks:

- `grip` is binary but trained with MSE instead of BCE / focal-style treatment
- `rot6d` is trained in raw coordinates, not by a rotation-aware loss
- equal weighting may not match task difficulty

### 2. FM target scale

Current FM setup uses:

- partial centering only
- no full per-dimension standardization
- `noise_scale = 1.0`

So `target_vel = z1 - z0` can have a scale mix that is not well balanced across dimensions.

### 3. Rollout control head

Current rollout defaults:

- choose only the first action in the predicted horizon
- no smoothing by default

That may leave success on the table even if the horizon prediction itself improves.

## Start-Before-Coding Notes

Before changing training logic, keep these in mind:

- do not trust `latest.pt`
- use `best.pt` and `epochs/*.pt` as the stable evidence base
- be careful not to mix runtime imports from multiple repo roots
- if we compare changes fairly, we should freeze one clean environment and one clean code tree first
- when we start modifying the backbone, compare each change against both validation loss and rollout success, not just train loss

## Suggested Work Order

1. Fix environment consistency and broken imports.
2. Fix checkpoint writing.
3. Re-enable success-aware selection and cleaner experiment starts.
4. Fix normalization and augmentation.
5. Then change backbone structure:
   - first: faithful DiT-style output initialization
   - second: improve conditioning path
   - third: test whether pooled-condition decoder should become token-aware

