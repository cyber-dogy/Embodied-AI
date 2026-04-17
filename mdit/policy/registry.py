from __future__ import annotations

from common.task_text import resolve_task_text
from mdit.config import ExperimentConfig


def _default_task_text(cfg: ExperimentConfig) -> str:
    return resolve_task_text(
        task_name=str(cfg.task_name),
        text_source=str(cfg.text_source),
        descriptions=None,
        override_text=cfg.task_text_override,
    )


def build_policy(strategy: str, cfg: ExperimentConfig, obs_encoder, backbone):
    strategy = str(strategy).lower()
    if strategy == "fm":
        if str(cfg.fm_variant) == "mtdp_strict":
            from .fm_mtdp_policy import MTDPFMPolicy, MTDPFMPolicyConfig

            policy_cfg = MTDPFMPolicyConfig(
                y_dim=cfg.y_dim,
                n_obs_steps=cfg.n_obs_steps,
                n_pred_steps=cfg.n_pred_steps,
                default_task_text=_default_task_text(cfg),
                subs_factor=cfg.subs_factor,
                sigma_min=cfg.fm_sigma_min,
                num_integration_steps=cfg.fm_num_integration_steps,
                integration_method=cfg.fm_integration_method,
                timestep_sampling_strategy=cfg.fm_timestep_sampling_strategy,
                timestep_beta_alpha=cfg.fm_timestep_beta_alpha,
                timestep_beta_beta=cfg.fm_timestep_beta_beta,
                timestep_beta_s=cfg.fm_timestep_beta_s,
                vision_lr_multiplier=cfg.vision_lr_multiplier,
                loss_weights=cfg.fm_loss_weights or {"xyz": 1.0, "rot6d": 1.0, "grip": 1.0},
                state_min=cfg.state_min,
                state_max=cfg.state_max,
                action_min=cfg.action_min,
                action_max=cfg.action_max,
            )
            return MTDPFMPolicy(policy_cfg, obs_encoder=obs_encoder, backbone=backbone)

        from .fm_policy import FMPolicyConfig, FMTransformerPolicy

        policy_cfg = FMPolicyConfig(
            x_dim=cfg.x_dim,
            y_dim=cfg.y_dim,
            n_obs_steps=cfg.n_obs_steps,
            n_pred_steps=cfg.n_pred_steps,
            num_k_infer=cfg.fm_num_k_infer,
            time_conditioning=cfg.fm_time_conditioning,
            default_task_text=_default_task_text(cfg),
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
            default_task_text=_default_task_text(cfg),
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
