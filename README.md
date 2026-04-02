# AutoDL `unplug_charger` Transformer-FM Package

This directory is a self-contained training package for the RLBench `unplug_charger` task.

Main choices:
- point cloud input
- PointNet observation tokens
- DiT-style transformer backbone
- Flow Matching as the main training strategy
- a comparison notebook for Diffusion vs Flow Matching on the same backbone

Recommended GPU:
- 48G single-GPU vGPU

Default training settings:
- `n_obs_steps = 3`
- `n_pred_steps = 32`
- `hidden_dim = 512`
- `num_blocks = 6`
- `nhead = 8`
- `batch_size = 64`
- `grad_accum_steps = 2`
- `train_epochs = 5000`

Directory layout:
- `data/`: copied point cloud dataset
- `lib/`: self-contained Python support code
- `notebooks/`: main training and comparison notebooks
- `ckpt/`: checkpoints and wandb artifacts

Suggested AutoDL workflow:
1. Upload this whole directory.
2. Install dependencies from `requirements.txt`.
3. Open the notebooks under `notebooks/`.
4. Run the main Flow Matching notebook first.

Notes:
- `n_obs_steps = 3` is a task-side default chosen to align better with upstream transformer usage. It is not a canonical DiT architecture rule.
- The compare notebook uses the same PointNet + DiT backbone and only changes the strategy layer.
- `requirements.txt` pins `diffusers==0.24.0` and `huggingface_hub==0.25.2` to avoid the scheduler import mismatch that can happen with newer hub versions.
- The main FM notebook smoke-tested successfully in `pfp_env`; the diffusion comparison notebook should be run after installing the pinned requirements in a clean environment.
- RLBench / PyRep are treated as optional evaluation dependencies now. You can train with `requirements.txt` only.
- If you later want success selection or rollout evaluation, prepare an RLBench-capable environment and then install the optional dependencies listed in `requirements_eval.txt`.
