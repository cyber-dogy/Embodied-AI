from __future__ import annotations

from collections.abc import Callable

from mdit.config import ExperimentConfig
from .backbones import DiTTrajectoryBackbone
from .encoders import ClipRgbTextTokenEncoder, DummyObsEncoder, PointNetObsTokenEncoder


EncoderBuilder = Callable[[ExperimentConfig], object]
BackboneBuilder = Callable[[ExperimentConfig], object]


def _build_clip_rgb_text_token_encoder(cfg: ExperimentConfig) -> ClipRgbTextTokenEncoder:
    return ClipRgbTextTokenEncoder(
        obs_features_dim=int(cfg.obs_features_dim),
        robot_state_dim=int(cfg.y_dim),
        camera_names=tuple(cfg.camera_names),
        image_size=tuple(cfg.vision_image_size),
        vision_backbone_name=str(cfg.vision_backbone_name),
        vision_pretrained=bool(cfg.vision_pretrained),
        vision_train_mode=str(cfg.vision_train_mode),
        vision_num_unfreeze_blocks=int(cfg.vision_num_unfreeze_blocks),
        text_model_name=str(cfg.text_model_name),
        text_projection_dim=int(cfg.text_projection_dim),
        task_name=str(cfg.task_name),
        task_text_override=cfg.task_text_override,
        token_fusion_mode=str(cfg.token_fusion_mode),
        fusion_recipe="step_fusion",
    )


def _build_clip_rgb_text_faithful_encoder(cfg: ExperimentConfig) -> ClipRgbTextTokenEncoder:
    return ClipRgbTextTokenEncoder(
        obs_features_dim=int(cfg.obs_features_dim),
        robot_state_dim=int(cfg.y_dim),
        camera_names=tuple(cfg.camera_names),
        image_size=tuple(cfg.vision_image_size),
        vision_backbone_name=str(cfg.vision_backbone_name),
        vision_pretrained=bool(cfg.vision_pretrained),
        vision_train_mode=str(cfg.vision_train_mode),
        vision_num_unfreeze_blocks=int(cfg.vision_num_unfreeze_blocks),
        text_model_name=str(cfg.text_model_name),
        text_projection_dim=int(cfg.text_projection_dim),
        task_name=str(cfg.task_name),
        task_text_override=cfg.task_text_override,
        token_fusion_mode=str(cfg.token_fusion_mode),
        fusion_recipe="faithful_concat",
    )


def _build_pointnet_obs_encoder(cfg: ExperimentConfig) -> PointNetObsTokenEncoder:
    return PointNetObsTokenEncoder(
        embed_dim=cfg.obs_features_dim,
        input_channels=6 if cfg.use_pc_color else 3,
        input_transform=False,
        use_group_norm=False,
    )


def _build_dummy_obs_encoder(cfg: ExperimentConfig) -> DummyObsEncoder:
    return DummyObsEncoder(
        embed_dim=cfg.obs_features_dim,
        robot_state_dim=cfg.y_dim,
    )


def _build_dit_backbone(cfg: ExperimentConfig) -> DiTTrajectoryBackbone:
    return DiTTrajectoryBackbone(
        input_dim=cfg.y_dim,
        output_dim=cfg.y_dim,
        cond_dim=cfg.x_dim,
        horizon=cfg.n_pred_steps,
        time_dim=cfg.time_dim,
        hidden_dim=cfg.hidden_dim,
        num_blocks=cfg.num_blocks,
        dropout=cfg.dropout,
        dim_feedforward=cfg.dim_feedforward,
        nhead=cfg.nhead,
        activation=cfg.activation,
        debug_finiteness=cfg.debug_finiteness,
        final_layer_zero_init=cfg.final_layer_zero_init,
        decoder_condition_mode=cfg.decoder_condition_mode,
    )


ENCODER_REGISTRY: dict[str, EncoderBuilder] = {
    "clip_rgb_text_token": _build_clip_rgb_text_token_encoder,
    "clip_rgb_text_faithful": _build_clip_rgb_text_faithful_encoder,
    "dummy_obs": _build_dummy_obs_encoder,
    "pointnet_token": _build_pointnet_obs_encoder,
}

BACKBONE_REGISTRY: dict[str, BackboneBuilder] = {
    "dit": _build_dit_backbone,
}


def build_obs_encoder(cfg: ExperimentConfig):
    try:
        builder = ENCODER_REGISTRY[str(cfg.encoder_name)]
    except KeyError as exc:
        raise ValueError(f"Unsupported encoder_name: {cfg.encoder_name}") from exc
    return builder(cfg)


def build_backbone(cfg: ExperimentConfig):
    try:
        builder = BACKBONE_REGISTRY[str(cfg.backbone_name)]
    except KeyError as exc:
        raise ValueError(f"Unsupported backbone_name: {cfg.backbone_name}") from exc
    return builder(cfg)


def list_encoders() -> list[str]:
    return sorted(ENCODER_REGISTRY)


def list_backbones() -> list[str]:
    return sorted(BACKBONE_REGISTRY)
