from __future__ import annotations

from ..config import ExperimentConfig


def build_policy(strategy: str, cfg: ExperimentConfig, obs_encoder, backbone):
    strategy = str(strategy).lower()
    if strategy == "fm":
        from .fm_policy import FMPolicyConfig, FMTransformerPolicy

        policy_cfg = FMPolicyConfig(
            x_dim=cfg.x_dim,
            y_dim=cfg.y_dim,
            n_obs_steps=cfg.n_obs_steps,
            n_pred_steps=cfg.n_pred_steps,
            num_k_infer=cfg.fm_num_k_infer,
            time_conditioning=cfg.fm_time_conditioning,
            norm_pcd_center=cfg.norm_pcd_center,
            robot_state_mean=cfg.robot_state_mean,
            robot_state_std=cfg.robot_state_std,
            augment_data=cfg.augment_data,
            augment_translation_sigma=cfg.augment_translation_sigma,
            augment_rotation_sigma=cfg.augment_rotation_sigma,
            noise_type=cfg.fm_noise_type,
            noise_scale=cfg.fm_noise_scale,
            loss_type=cfg.loss_type,
            flow_schedule=cfg.fm_flow_schedule,
            exp_scale=cfg.fm_exp_scale,
            snr_sampler=cfg.fm_snr_sampler,
            subs_factor=cfg.subs_factor,
            pos_emb_scale=20,
            loss_weights=cfg.fm_loss_weights or {"xyz": 1.0, "rot6d": 1.0, "grip": 1.0},
        )
        return FMTransformerPolicy(policy_cfg, obs_encoder=obs_encoder, backbone=backbone)
    if strategy == "diffusion":
        from .diffusion_policy import DiffusionPolicyConfig, DiffusionTransformerPolicy

        policy_cfg = DiffusionPolicyConfig(
            x_dim=cfg.x_dim,
            y_dim=cfg.y_dim,
            n_obs_steps=cfg.n_obs_steps,
            n_pred_steps=cfg.n_pred_steps,
            num_inference_steps=cfg.diffusion_num_infer_steps,
            norm_pcd_center=cfg.norm_pcd_center,
            noise_scale=cfg.diffusion_noise_scale,
            train_diffusion_steps=cfg.diffusion_train_steps,
            eval_diffusion_steps=cfg.diffusion_eval_steps,
            prediction_type=cfg.diffusion_prediction_type,
            subs_factor=cfg.subs_factor,
            loss_type=cfg.loss_type,
        )
        return DiffusionTransformerPolicy(policy_cfg, obs_encoder=obs_encoder, backbone=backbone)
    raise ValueError(f"Unsupported strategy: {strategy}")


def list_policies() -> list[str]:
    return ["diffusion", "fm"]
