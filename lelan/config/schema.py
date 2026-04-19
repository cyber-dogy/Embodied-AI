from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from common.runtime import CKPT_ROOT, DATA_ROOT, default_device_str
from common.task_text import resolve_task_text


@dataclass
class FiLMConfig:
    num_res_blocks: int = 8
    num_channels: int = 128
    use_coord_conv: bool = True


@dataclass
class HistoryEncoderConfig:
    backbone: str = "efficientnet-b0"
    pretrained: bool = False
    features_per_group: int = 16


@dataclass
class TextEncoderConfig:
    model: str = "openai/clip-vit-base-patch16"
    freeze: bool = True


@dataclass
class FusionTransformerConfig:
    hidden_dim: int = 512
    num_heads: int = 4
    num_layers: int = 2
    ff_dim_factor: int = 4
    dropout: float = 0.1


@dataclass
class TimestepSamplingConfig:
    strategy_name: str = "beta"
    s: float = 0.999
    alpha: float = 1.5
    beta: float = 1.0


@dataclass
class FlowMatchingConfig:
    objective_name: str = "flow_matching"
    sigma_min: float = 0.0
    num_integration_steps: int = 50
    integration_method: str = "euler"
    timestep_sampling: TimestepSamplingConfig = field(default_factory=TimestepSamplingConfig)
    loss_weights: dict[str, float] | None = None


@dataclass
class TransformerConfig:
    hidden_dim: int = 512
    num_layers: int = 6
    num_heads: int = 8
    dropout: float = 0.1
    use_positional_encoding: bool = True
    diffusion_step_embed_dim: int = 256
    use_rope: bool = False
    rope_base: float = 10000.0


@dataclass
class LeLaNExperimentConfig:
    run_name: str = "unplug_charger_lelan_v2"
    task_name: str = "unplug_charger"
    obs_mode: str = "rgb"
    encoder_name: str = "clip_rgb_history_token"
    backbone_name: str = "dit"
    fm_variant: str = "standard"
    normalization_profile: str = "legacy"
    research_lane: str = "lelan_history_mainline"
    train_data_path: Path = DATA_ROOT / "unplug_charger" / "train"
    valid_data_path: Path = DATA_ROOT / "unplug_charger" / "valid"
    seed: int = 1234
    device: str = default_device_str()
    resume_from_latest: bool = False

    n_obs_steps: int = 3
    n_pred_steps: int = 32
    n_action_steps: int = 8
    subs_factor: int = 3
    n_points: int = 2048
    use_pc_color: bool = False
    obs_features_dim: int = 256
    y_dim: int = 10

    camera_names: tuple[str, ...] = (
        "right_shoulder",
        "left_shoulder",
        "overhead",
        "front",
        "wrist",
    )
    text_source: str = "task_template"
    task_text_override: str | None = None

    vision_backbone_name: str = "vit_base_patch16_clip_224.openai"
    vision_pretrained: bool = True
    vision_image_size: tuple[int, int] = (224, 224)
    vision_train_mode: str = "last_block"
    vision_num_unfreeze_blocks: int = 1

    text_model_name: str = "openai/clip-vit-base-patch16"
    text_projection_dim: int = 256
    token_fusion_mode: str = "3_token"
    vision_lr_multiplier: float = 1.0
    activation_checkpointing: bool = False
    history_encoder: HistoryEncoderConfig = field(default_factory=HistoryEncoderConfig)

    hidden_dim: int = 512
    time_dim: int = 256
    num_blocks: int = 6
    nhead: int = 8
    dim_feedforward: int = 2048
    dropout: float = 0.1
    activation: str = "gelu"
    debug_finiteness: bool = True
    final_layer_zero_init: bool = False
    decoder_condition_mode: str = "mean_pool"
    use_rope: bool = False
    rope_base: float = 10000.0
    use_positional_encoding: bool = True

    batch_size: int = 8
    grad_accum_steps: int = 4
    num_workers: int = 4
    train_epochs: int = 500
    train_use_amp: bool = True
    train_amp_dtype: str = "bfloat16"
    grad_clip_norm: float | None = 1.0
    empty_cuda_cache: bool = False

    learning_rate: float = 2.0e-5
    betas: tuple[float, float] = (0.95, 0.999)
    eps: float = 1.0e-8
    transformer_weight_decay: float = 0.0
    obs_encoder_weight_decay: float = 0.0
    lr_scheduler_name: str = "cosine"
    lr_warmup_steps: int = 500

    ema_enable: bool = True
    ema_decay: float = 0.999

    val_every_epochs: int = 1
    checkpoint_every_epochs: int = 100
    print_every: int = 50
    train_heartbeat_every_steps: int = 50

    save_latest_ckpt: bool = True
    save_best_valid_ckpt: bool = True
    checkpoint_payload_mode: str = "full"
    enable_success_rate_eval: bool = True
    offline_eval_ckpt_every_epochs: int = 0
    offline_eval_ckpt_payload_mode: str = "lightweight"
    audit_include_special_ckpts: bool = True
    delete_screening_ckpts_after_audit: bool = False
    delete_periodic_ckpts_after_success_eval: bool = False

    success_selection_every_epochs: int = 0
    success_selection_episodes: int = 0
    success_max_steps: int = 200
    standard_eval_episodes: int = 0
    eval_step_heartbeat_every: int = 50
    smooth_actions: bool = False
    command_mode: str = "first"
    horizon_index: int = 0
    average_first_n: int = 1
    position_alpha: float = 0.35
    rotation_alpha: float = 0.25
    max_position_step: float | None = 0.03
    gripper_open_threshold: float = 0.6
    gripper_close_threshold: float = 0.4

    norm_pcd_center: tuple[float, float, float] = (0.4, 0.0, 1.4)
    robot_state_mean: tuple[float, ...] | None = None
    robot_state_std: tuple[float, ...] | None = None
    state_min: tuple[float, ...] | None = None
    state_max: tuple[float, ...] | None = None
    action_min: tuple[float, ...] | None = None
    action_max: tuple[float, ...] | None = None
    loss_type: str = "l2"

    fm_num_k_infer: int = 10
    fm_time_conditioning: bool = True
    fm_noise_type: str = "gaussian"
    fm_noise_scale: float = 1.0
    fm_flow_schedule: str = "exp"
    fm_exp_scale: float = 4.0
    fm_snr_sampler: str = "uniform"
    fm_loss_weights: dict[str, float] | None = None
    fm_sigma_min: float = 0.0
    fm_num_integration_steps: int = 50
    fm_integration_method: str = "euler"
    fm_timestep_sampling_strategy: str = "beta"
    fm_timestep_beta_alpha: float = 1.5
    fm_timestep_beta_beta: float = 1.0
    fm_timestep_beta_s: float = 0.999

    wandb_enable: bool = False
    wandb_project: str = "autodl-unplug-charger-lelan"
    wandb_entity: str | None = None
    wandb_mode: str = "disabled"
    wandb_resume: bool = False

    ckpt_root: Path = CKPT_ROOT

    def __post_init__(self) -> None:
        self.train_data_path = Path(self.train_data_path)
        self.valid_data_path = Path(self.valid_data_path)
        self.ckpt_root = Path(self.ckpt_root)
        self.device = str(self.device)
        self.obs_mode = str(self.obs_mode)
        self.encoder_name = str(self.encoder_name)
        self.backbone_name = str(self.backbone_name)
        self.fm_variant = str(self.fm_variant)
        self.normalization_profile = str(self.normalization_profile)
        self.research_lane = str(self.research_lane)
        self.camera_names = tuple(str(name) for name in self.camera_names)
        self.text_source = str(self.text_source).strip().lower().replace("-", "_").replace(" ", "_")
        if self.text_source == "template":
            self.text_source = "task_template"
        elif self.text_source == "override":
            self.text_source = "task_template"
        self.vision_backbone_name = str(self.vision_backbone_name)
        self.vision_image_size = tuple(int(v) for v in self.vision_image_size)
        self.vision_train_mode = str(self.vision_train_mode)
        self.text_model_name = str(self.text_model_name)
        self.text_projection_dim = int(self.text_projection_dim)
        self.token_fusion_mode = str(self.token_fusion_mode)
        self.vision_lr_multiplier = float(self.vision_lr_multiplier)
        self.activation_checkpointing = bool(self.activation_checkpointing)
        self.n_action_steps = int(self.n_action_steps)
        self.hidden_dim = int(self.hidden_dim)
        self.time_dim = int(self.time_dim)
        self.num_blocks = int(self.num_blocks)
        self.nhead = int(self.nhead)
        self.dim_feedforward = int(self.dim_feedforward)
        self.dropout = float(self.dropout)
        self.activation = str(self.activation)
        self.final_layer_zero_init = bool(self.final_layer_zero_init)
        self.decoder_condition_mode = str(self.decoder_condition_mode)
        self.use_rope = bool(self.use_rope)
        self.rope_base = float(self.rope_base)
        self.use_positional_encoding = bool(self.use_positional_encoding)
        self.betas = tuple(float(beta) for beta in self.betas)
        self.norm_pcd_center = tuple(float(v) for v in self.norm_pcd_center)
        if self.robot_state_mean is not None:
            self.robot_state_mean = tuple(float(v) for v in self.robot_state_mean)
        if self.robot_state_std is not None:
            self.robot_state_std = tuple(float(v) for v in self.robot_state_std)
        if self.state_min is not None:
            self.state_min = tuple(float(v) for v in self.state_min)
        if self.state_max is not None:
            self.state_max = tuple(float(v) for v in self.state_max)
        if self.action_min is not None:
            self.action_min = tuple(float(v) for v in self.action_min)
        if self.action_max is not None:
            self.action_max = tuple(float(v) for v in self.action_max)
        if self.fm_loss_weights is not None:
            self.fm_loss_weights = {
                str(key): float(value) for key, value in self.fm_loss_weights.items()
            }

    def validate(self) -> None:
        if not self.train_data_path.exists():
            raise FileNotFoundError(f"Train data path does not exist: {self.train_data_path}")
        if not self.valid_data_path.exists():
            raise FileNotFoundError(f"Valid data path does not exist: {self.valid_data_path}")
        if str(self.obs_mode).lower() != "rgb":
            raise ValueError(f"LeLaN currently supports obs_mode='rgb', got {self.obs_mode!r}")
        if str(self.encoder_name) != "clip_rgb_history_token":
            raise ValueError(
                "LeLaN now follows reconstructed MDIT mainline and only supports "
                "encoder_name='clip_rgb_history_token'."
            )
        if str(self.text_source) not in {"task_template", "task_name", "dataset"}:
            raise ValueError("text_source must be one of {'task_template', 'task_name', 'dataset'}.")
        if str(self.backbone_name) != "dit":
            raise ValueError("LeLaN currently supports backbone_name='dit' only.")
        if str(self.fm_variant) != "standard":
            raise ValueError("LeLaN currently supports fm_variant='standard' only.")
        if str(self.normalization_profile) not in {"legacy", "mtdp_strict"}:
            raise ValueError(
                "normalization_profile must be one of {'legacy', 'mtdp_strict'}."
            )
        if len(self.camera_names) != 5:
            raise ValueError(f"Expected exactly 5 cameras, got {self.camera_names}")
        if int(self.n_action_steps) <= 0 or int(self.n_action_steps) > int(self.n_pred_steps):
            raise ValueError("n_action_steps must be in [1, n_pred_steps].")
        if str(self.token_fusion_mode) != "3_token":
            raise ValueError("LeLaN currently supports token_fusion_mode='3_token' only.")
        if int(self.text_projection_dim) <= 0:
            raise ValueError("text_projection_dim must be > 0.")
        if str(self.checkpoint_payload_mode) not in {"full", "lightweight"}:
            raise ValueError("checkpoint_payload_mode must be either 'full' or 'lightweight'.")
        if str(self.offline_eval_ckpt_payload_mode) not in {"full", "lightweight"}:
            raise ValueError("offline_eval_ckpt_payload_mode must be either 'full' or 'lightweight'.")
        if str(self.command_mode) not in {"first", "horizon_index", "mean_first_n"}:
            raise ValueError(
                "command_mode must be one of {'first', 'horizon_index', 'mean_first_n'}."
            )
        if int(self.success_selection_every_epochs) < 0:
            raise ValueError("success_selection_every_epochs must be >= 0.")
        if int(self.success_selection_episodes) < 0:
            raise ValueError("success_selection_episodes must be >= 0.")
        if int(self.standard_eval_episodes) < 0:
            raise ValueError("standard_eval_episodes must be >= 0.")
        if int(self.offline_eval_ckpt_every_epochs) < 0:
            raise ValueError("offline_eval_ckpt_every_epochs must be >= 0.")
        if float(self.gripper_close_threshold) > float(self.gripper_open_threshold):
            raise ValueError("gripper_close_threshold must be <= gripper_open_threshold.")
        if self.fm_loss_weights is not None:
            valid_loss_keys = {"xyz", "rot6d", "grip"}
            unknown_keys = set(self.fm_loss_weights) - valid_loss_keys
            if unknown_keys:
                raise ValueError(
                    f"fm_loss_weights contains unsupported keys: {sorted(unknown_keys)}"
                )
        if self.normalization_profile == "mtdp_strict":
            if self.state_min is None or self.state_max is None:
                raise ValueError("mtdp_strict requires state_min/state_max.")
            if self.action_min is None or self.action_max is None:
                raise ValueError("mtdp_strict requires action_min/action_max.")
            if len(self.state_min) != int(self.y_dim) or len(self.state_max) != int(self.y_dim):
                raise ValueError("state_min/state_max must match y_dim.")
            if len(self.action_min) != int(self.y_dim) or len(self.action_max) != int(self.y_dim):
                raise ValueError("action_min/action_max must match y_dim.")

    @property
    def x_dim(self) -> int:
        return int(self.obs_features_dim + self.y_dim)

    @property
    def horizon(self) -> int:
        return int(self.n_pred_steps)

    @horizon.setter
    def horizon(self, value: int) -> None:
        self.n_pred_steps = int(value)

    @property
    def robot_state_dim(self) -> int:
        return int(self.y_dim)

    @robot_state_dim.setter
    def robot_state_dim(self, value: int) -> None:
        self.y_dim = int(value)

    @property
    def action_dim(self) -> int:
        return int(self.y_dim)

    @action_dim.setter
    def action_dim(self, value: int) -> None:
        self.y_dim = int(value)

    @property
    def task_text_mode(self) -> str:
        return str(self.text_source)

    @task_text_mode.setter
    def task_text_mode(self, value: str) -> None:
        self.text_source = str(value)

    @property
    def use_amp(self) -> bool:
        return bool(self.train_use_amp)

    @use_amp.setter
    def use_amp(self, value: bool) -> None:
        self.train_use_amp = bool(value)

    @property
    def optimizer_lr(self) -> float:
        return float(self.learning_rate)

    @optimizer_lr.setter
    def optimizer_lr(self, value: float) -> None:
        self.learning_rate = float(value)

    @property
    def optimizer_betas(self) -> tuple[float, float]:
        return tuple(float(beta) for beta in self.betas)

    @optimizer_betas.setter
    def optimizer_betas(self, value: tuple[float, float] | list[float]) -> None:
        self.betas = tuple(float(beta) for beta in value)

    @property
    def optimizer_eps(self) -> float:
        return float(self.eps)

    @optimizer_eps.setter
    def optimizer_eps(self, value: float) -> None:
        self.eps = float(value)

    @property
    def optimizer_weight_decay(self) -> float:
        return float(self.transformer_weight_decay)

    @optimizer_weight_decay.setter
    def optimizer_weight_decay(self, value: float) -> None:
        scalar = float(value)
        self.transformer_weight_decay = scalar
        self.obs_encoder_weight_decay = scalar

    @property
    def use_ema(self) -> bool:
        return bool(self.ema_enable)

    @use_ema.setter
    def use_ema(self, value: bool) -> None:
        self.ema_enable = bool(value)

    @property
    def transformer(self) -> TransformerConfig:
        return TransformerConfig(
            hidden_dim=int(self.hidden_dim),
            num_layers=int(self.num_blocks),
            num_heads=int(self.nhead),
            dropout=float(self.dropout),
            use_positional_encoding=bool(self.use_positional_encoding),
            diffusion_step_embed_dim=int(self.time_dim),
            use_rope=bool(self.use_rope),
            rope_base=float(self.rope_base),
        )

    @transformer.setter
    def transformer(self, value: TransformerConfig) -> None:
        self.hidden_dim = int(value.hidden_dim)
        self.num_blocks = int(value.num_layers)
        self.nhead = int(value.num_heads)
        self.dropout = float(value.dropout)
        self.use_positional_encoding = bool(value.use_positional_encoding)
        self.time_dim = int(value.diffusion_step_embed_dim)
        self.use_rope = bool(value.use_rope)
        self.rope_base = float(value.rope_base)

    @property
    def text_encoder(self) -> TextEncoderConfig:
        return TextEncoderConfig(model=str(self.text_model_name), freeze=True)

    @text_encoder.setter
    def text_encoder(self, value: TextEncoderConfig) -> None:
        self.text_model_name = str(value.model)

    @property
    def objective(self) -> FlowMatchingConfig:
        return FlowMatchingConfig(
            sigma_min=float(self.fm_sigma_min),
            num_integration_steps=int(self.fm_num_integration_steps),
            integration_method=str(self.fm_integration_method),
            timestep_sampling=TimestepSamplingConfig(
                strategy_name=str(self.fm_timestep_sampling_strategy),
                s=float(self.fm_timestep_beta_s),
                alpha=float(self.fm_timestep_beta_alpha),
                beta=float(self.fm_timestep_beta_beta),
            ),
            loss_weights=None if self.fm_loss_weights is None else dict(self.fm_loss_weights),
        )

    @objective.setter
    def objective(self, value: FlowMatchingConfig) -> None:
        self.fm_sigma_min = float(value.sigma_min)
        self.fm_num_integration_steps = int(value.num_integration_steps)
        self.fm_integration_method = str(value.integration_method)
        self.fm_timestep_sampling_strategy = str(value.timestep_sampling.strategy_name)
        self.fm_timestep_beta_s = float(value.timestep_sampling.s)
        self.fm_timestep_beta_alpha = float(value.timestep_sampling.alpha)
        self.fm_timestep_beta_beta = float(value.timestep_sampling.beta)
        self.fm_loss_weights = (
            None if value.loss_weights is None else {str(k): float(v) for k, v in value.loss_weights.items()}
        )

    @property
    def ckpt_dir(self) -> Path:
        return self.ckpt_root / self.run_name

    @property
    def periodic_ckpt_dir(self) -> Path:
        return self.ckpt_dir / "epochs"

    @property
    def offline_eval_ckpt_dir(self) -> Path:
        return self.ckpt_dir / "eval_ckpts"

    @property
    def latest_ckpt_path(self) -> Path:
        return self.ckpt_dir / "latest.pt"

    @property
    def best_ckpt_path(self) -> Path:
        return self.ckpt_dir / "best_valid.pt"

    @property
    def best_success_ckpt_path(self) -> Path:
        return self.ckpt_dir / "best_success.pt"

    @property
    def summary_path(self) -> Path:
        return self.ckpt_dir / "summary.json"

    @property
    def success_eval_path(self) -> Path:
        return self.ckpt_dir / "success_eval_history.json"

    @property
    def audit_report_path(self) -> Path:
        return self.ckpt_dir / "audit_report.json"

    @property
    def dataset_stats_path(self) -> Path:
        return self.ckpt_dir / "dataset_stats.json"

    @property
    def effective_task_text(self) -> str:
        return resolve_task_text(
            task_name=self.task_name,
            text_source=self.text_source,
            descriptions=None,
            override_text=self.task_text_override,
        )
