from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from common.runtime import CKPT_ROOT, DATA_ROOT, default_device_str
from common.task_text import resolve_task_text


@dataclass
class ExperimentConfig:
    run_name: str = "unplug_charger_mdit_rgb_text_fm_v1"
    task_name: str = "unplug_charger"
    obs_mode: str = "rgb"
    encoder_name: str = "clip_rgb_text_token"
    backbone_name: str = "dit"
    fm_variant: str = "standard"
    normalization_profile: str = "legacy"
    research_lane: str = "lane_a_mainline"
    train_data_path: Path = DATA_ROOT / "unplug_charger" / "train"
    valid_data_path: Path = DATA_ROOT / "unplug_charger" / "valid"
    seed: int = 1234
    device: str = default_device_str()
    resume_from_latest: bool = False

    n_obs_steps: int = 3
    n_pred_steps: int = 32
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
    vision_encode_chunk_size: int = 0
    activation_checkpointing: bool = False

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

    batch_size: int = 32
    grad_accum_steps: int = 4
    num_workers: int = 4
    train_epochs: int = 100
    train_use_amp: bool = False
    train_amp_dtype: str = "bfloat16"
    grad_clip_norm: float | None = 1.0
    empty_cuda_cache: bool = True

    auto_batch_fallback: bool = True
    batch_fallback_tiers: tuple[tuple[int, int], ...] = ((32, 4), (16, 8), (8, 16))

    learning_rate: float = 1.0e-4
    betas: tuple[float, float] = (0.9, 0.95)
    eps: float = 1.0e-8
    transformer_weight_decay: float = 1.0e-3
    obs_encoder_weight_decay: float = 1.0e-6
    lr_scheduler_name: str = "cosine"
    lr_warmup_steps: int = 1000

    ema_enable: bool = True
    ema_decay: float = 0.9993

    val_every_epochs: int = 1
    success_selection_every_epochs: int = 0
    checkpoint_every_epochs: int = 50
    sample_every_epochs: int = 5
    success_selection_episodes: int = 0
    success_max_steps: int = 200
    stop_on_target_success: bool = False
    target_success_rate: float | None = None
    standard_eval_episodes: int = 0
    eval_step_heartbeat_every: int = 50
    smooth_actions: bool = False
    command_mode: str = "first"
    horizon_index: int = 0
    average_first_n: int = 1
    position_alpha: float = 0.35
    rotation_alpha: float = 0.25
    max_position_step: float = 0.03
    gripper_open_threshold: float = 0.6
    gripper_close_threshold: float = 0.4

    norm_pcd_center: tuple[float, float, float] = (0.4, 0.0, 1.4)
    robot_state_mean: tuple[float, ...] | None = None
    robot_state_std: tuple[float, ...] | None = None
    augment_data: bool = False
    augment_translation_sigma: float = 0.02
    augment_rotation_sigma: float = 0.10
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
    fm_num_integration_steps: int = 100
    fm_integration_method: str = "euler"
    fm_timestep_sampling_strategy: str = "uniform"
    fm_timestep_beta_alpha: float = 1.5
    fm_timestep_beta_beta: float = 1.0
    fm_timestep_beta_s: float = 0.999

    state_min: tuple[float, ...] | None = None
    state_max: tuple[float, ...] | None = None
    action_min: tuple[float, ...] | None = None
    action_max: tuple[float, ...] | None = None

    diffusion_train_steps: int = 100
    diffusion_eval_steps: int = 100
    diffusion_num_infer_steps: int = 100
    diffusion_prediction_type: str = "epsilon"
    diffusion_noise_scale: float = 1.0

    wandb_enable: bool = True
    wandb_project: str = "autodl-unplug-charger-mdit"
    wandb_entity: str | None = "cyber-dogy"
    wandb_mode: str = "online"
    wandb_resume: bool = False

    ckpt_root: Path = CKPT_ROOT
    print_every: int = 50
    train_heartbeat_every_steps: int = 50

    def __post_init__(self) -> None:
        self.train_data_path = Path(self.train_data_path)
        self.valid_data_path = Path(self.valid_data_path)
        self.ckpt_root = Path(self.ckpt_root)
        self.betas = tuple(float(beta) for beta in self.betas)
        self.norm_pcd_center = tuple(float(v) for v in self.norm_pcd_center)
        self.camera_names = tuple(str(name) for name in self.camera_names)
        self.vision_image_size = tuple(int(v) for v in self.vision_image_size)
        self.batch_fallback_tiers = tuple(
            (int(pair[0]), int(pair[1]))
            for pair in self.batch_fallback_tiers
        )
        if self.robot_state_mean is not None:
            self.robot_state_mean = tuple(float(v) for v in self.robot_state_mean)
        if self.robot_state_std is not None:
            self.robot_state_std = tuple(float(v) for v in self.robot_state_std)
        if self.fm_loss_weights is not None:
            self.fm_loss_weights = {
                str(key): float(value) for key, value in self.fm_loss_weights.items()
            }
        self.device = str(self.device)
        self.encoder_name = str(self.encoder_name)
        self.backbone_name = str(self.backbone_name)
        self.research_lane = str(self.research_lane)
        self.obs_mode = str(self.obs_mode)
        self.text_source = str(self.text_source)
        self.vision_backbone_name = str(self.vision_backbone_name)
        self.vision_train_mode = str(self.vision_train_mode)
        self.text_model_name = str(self.text_model_name)
        self.text_projection_dim = int(self.text_projection_dim)
        self.token_fusion_mode = str(self.token_fusion_mode)
        self.fm_variant = str(self.fm_variant)
        self.normalization_profile = str(self.normalization_profile)
        self.vision_lr_multiplier = float(self.vision_lr_multiplier)
        self.vision_encode_chunk_size = int(self.vision_encode_chunk_size)
        self.activation_checkpointing = bool(self.activation_checkpointing)
        self.use_rope = bool(self.use_rope)
        self.rope_base = float(self.rope_base)
        self.use_positional_encoding = bool(self.use_positional_encoding)
        self.fm_sigma_min = float(self.fm_sigma_min)
        self.fm_num_integration_steps = int(self.fm_num_integration_steps)
        self.fm_integration_method = str(self.fm_integration_method)
        self.fm_timestep_sampling_strategy = str(self.fm_timestep_sampling_strategy)
        self.fm_timestep_beta_alpha = float(self.fm_timestep_beta_alpha)
        self.fm_timestep_beta_beta = float(self.fm_timestep_beta_beta)
        self.fm_timestep_beta_s = float(self.fm_timestep_beta_s)
        self.stop_on_target_success = bool(self.stop_on_target_success)
        if self.state_min is not None:
            self.state_min = tuple(float(v) for v in self.state_min)
        if self.state_max is not None:
            self.state_max = tuple(float(v) for v in self.state_max)
        if self.action_min is not None:
            self.action_min = tuple(float(v) for v in self.action_min)
        if self.action_max is not None:
            self.action_max = tuple(float(v) for v in self.action_max)

    def validate(self) -> None:
        if not self.train_data_path.exists():
            raise FileNotFoundError(f"Train data path does not exist: {self.train_data_path}")
        if not self.valid_data_path.exists():
            raise FileNotFoundError(f"Valid data path does not exist: {self.valid_data_path}")
        if self.obs_mode.lower() != "rgb":
            raise ValueError(f"MDIT currently supports obs_mode='rgb', got {self.obs_mode}")
        if len(self.camera_names) != 5:
            raise ValueError(f"Expected exactly 5 cameras, got {self.camera_names}")
        if self.encoder_name not in {
            "clip_rgb_text_token",
            "clip_rgb_text_faithful",
            "clip_rgb_text_mtdp",
        }:
            raise ValueError(f"Unsupported MDIT encoder_name={self.encoder_name!r}")
        if self.backbone_name not in {"dit", "dit_mtdp_rope"}:
            raise ValueError(f"Unsupported MDIT backbone_name={self.backbone_name!r}")
        if self.fm_variant not in {"standard", "mtdp_strict"}:
            raise ValueError(f"Unsupported fm_variant={self.fm_variant!r}")
        if self.normalization_profile not in {"legacy", "mtdp_strict"}:
            raise ValueError(f"Unsupported normalization_profile={self.normalization_profile!r}")
        if self.encoder_name == "clip_rgb_text_mtdp":
            if self.token_fusion_mode != "global_conditioning":
                raise ValueError(
                    "clip_rgb_text_mtdp requires token_fusion_mode='global_conditioning'."
                )
        elif self.token_fusion_mode != "3_token":
            raise ValueError(
                f"Only token_fusion_mode='3_token' is supported for the current mainline, got {self.token_fusion_mode}"
            )
        if self.fm_variant == "mtdp_strict":
            if self.encoder_name != "clip_rgb_text_mtdp":
                raise ValueError("mtdp_strict requires encoder_name='clip_rgb_text_mtdp'.")
            if self.backbone_name != "dit_mtdp_rope":
                raise ValueError("mtdp_strict requires backbone_name='dit_mtdp_rope'.")
            if self.normalization_profile != "mtdp_strict":
                raise ValueError("mtdp_strict requires normalization_profile='mtdp_strict'.")
            if self.fm_timestep_sampling_strategy not in {"uniform", "beta"}:
                raise ValueError(
                    "fm_timestep_sampling_strategy must be 'uniform' or 'beta'."
                )
            if self.fm_integration_method not in {"euler", "rk4"}:
                raise ValueError("fm_integration_method must be 'euler' or 'rk4'.")
            if self.vision_lr_multiplier <= 0:
                raise ValueError("vision_lr_multiplier must be > 0 for mtdp_strict.")
            if self.vision_encode_chunk_size < 0:
                raise ValueError("vision_encode_chunk_size must be >= 0.")
            if self.state_min is not None and len(self.state_min) != int(self.y_dim):
                raise ValueError("state_min must match y_dim.")
        if self.target_success_rate is not None:
            self.target_success_rate = float(self.target_success_rate)
            if not (0.0 <= float(self.target_success_rate) <= 1.0):
                raise ValueError("target_success_rate must be within [0, 1].")
            if self.state_max is not None and len(self.state_max) != int(self.y_dim):
                raise ValueError("state_max must match y_dim.")
            if self.action_min is not None and len(self.action_min) != int(self.y_dim):
                raise ValueError("action_min must match y_dim.")
            if self.action_max is not None and len(self.action_max) != int(self.y_dim):
                raise ValueError("action_max must match y_dim.")
        if int(self.text_projection_dim) <= 0:
            raise ValueError("text_projection_dim must be > 0")

    @property
    def x_dim(self) -> int:
        return int(self.obs_features_dim + self.y_dim)

    @property
    def ckpt_dir(self) -> Path:
        return self.ckpt_root / self.run_name

    @property
    def periodic_ckpt_dir(self) -> Path:
        return self.ckpt_dir / "epochs"

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
    def audit_report_path(self) -> Path:
        return self.ckpt_dir / "audit_report.json"

    @property
    def experiment_manifest_path(self) -> Path:
        return self.ckpt_dir / "experiment_manifest.json"

    @property
    def train_heartbeat_path(self) -> Path:
        return self.ckpt_dir / "train_heartbeat.json"

    @property
    def effective_task_text(self) -> str:
        return resolve_task_text(
            task_name=self.task_name,
            text_source=self.text_source,
            descriptions=None,
            override_text=self.task_text_override,
        )
