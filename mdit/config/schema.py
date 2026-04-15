from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from common.runtime import CKPT_ROOT, DATA_ROOT, default_device_str
from mdit.model.utils import NormalizationMode


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

    def __post_init__(self) -> None:
        if self.loss_weights is not None:
            self.loss_weights = {
                str(key): float(value) for key, value in self.loss_weights.items()
            }


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
class VisionEncoderConfig:
    backbone: str = "vit_base_patch16_clip_224.openai"
    use_separate_encoder_per_camera: bool = False
    lr_multiplier: float = 0.1
    resize_shape: tuple[int, int] | None = (224, 224)
    crop_shape: tuple[int, int] | None = (224, 224)
    crop_is_random: bool = True
    train_mode: str = "all"
    # Number of transformer blocks to unfreeze from the top when train_mode is
    # "last_block" or "last_n_blocks".  Set to 1 for the original last-block-only
    # behaviour; increase (e.g. 2 or 3) or switch train_mode to "all" when you
    # want to open more of the encoder to gradient updates.
    num_unfreeze_blocks: int = 1


@dataclass
class TextEncoderConfig:
    model: str = "openai/clip-vit-base-patch16"


@dataclass
class PcdEncoderConfig:
    n_points: int = 2048
    use_color: bool = False
    input_transform: bool = False
    use_group_norm: bool = False
    embed_dim: int = 256
    norm_center: tuple[float, float, float] = (0.4, 0.0, 1.4)

    def __post_init__(self) -> None:
        self.norm_center = tuple(float(v) for v in self.norm_center)


@dataclass
class PDITBackboneConfig:
    dim_feedforward: int = 2048
    activation: str = "gelu"
    debug_finiteness: bool = True
    final_layer_zero_init: bool = True
    decoder_condition_mode: str = "mean_pool"


@dataclass
class ObservationEncoderConfig:
    vision: VisionEncoderConfig = field(default_factory=VisionEncoderConfig)
    text: TextEncoderConfig = field(default_factory=TextEncoderConfig)
    pcd: PcdEncoderConfig = field(default_factory=PcdEncoderConfig)


@dataclass
class MDITExperimentConfig:
    run_name: str = "unplug_charger_mdit_faithful"
    task_name: str = "unplug_charger"
    train_data_path: Path = DATA_ROOT / "unplug_charger" / "train"
    valid_data_path: Path = DATA_ROOT / "unplug_charger" / "valid"
    ckpt_root: Path = CKPT_ROOT
    device: str = default_device_str()
    seed: int = 1234
    resume_from_latest: bool = False

    n_obs_steps: int = 2
    horizon: int = 100
    n_action_steps: int = 24
    robot_state_dim: int = 10
    action_dim: int = 10
    camera_names: tuple[str, ...] = ("right_shoulder", "left_shoulder", "overhead", "front", "wrist")
    use_pcd: bool = False
    transformer_variant: str = "mdit"
    pcd_transformer_variant: str | None = None
    drop_n_last_frames: int | None = None
    task_text_mode: str = "template"
    task_text_override: str | None = None
    observation_encoder: ObservationEncoderConfig = field(default_factory=ObservationEncoderConfig)
    pdit_backbone: PDITBackboneConfig = field(default_factory=PDITBackboneConfig)
    transformer: TransformerConfig = field(default_factory=TransformerConfig)
    objective: FlowMatchingConfig = field(default_factory=FlowMatchingConfig)
    normalization_mode: NormalizationMode = NormalizationMode.MIN_MAX

    batch_size: int = 8
    grad_accum_steps: int = 4
    num_workers: int = 4
    train_epochs: int = 500
    grad_clip_norm: float | None = 1.0
    use_amp: bool = True
    checkpoint_every_epochs: int = 100
    val_every_epochs: int = 1
    print_every: int = 50
    save_latest_ckpt: bool = True
    save_best_valid_ckpt: bool = True
    ema_enable: bool = False
    ema_decay: float = 0.9993
    checkpoint_payload_mode: str = "full"
    enable_success_rate_eval: bool = True
    offline_eval_ckpt_every_epochs: int = 0
    offline_eval_ckpt_payload_mode: str = "lightweight"
    audit_include_special_ckpts: bool = True
    delete_screening_ckpts_after_audit: bool = False
    delete_periodic_ckpts_after_success_eval: bool = False
    lr_scheduler_name: str = "cosine"
    lr_warmup_steps: int = 500

    optimizer_lr: float = 2.0e-5
    optimizer_betas: tuple[float, float] = (0.95, 0.999)
    optimizer_eps: float = 1.0e-8
    optimizer_weight_decay: float = 0.0
    wandb_enable: bool = False
    wandb_project: str = "autodl-unplug-charger-mdit"
    wandb_entity: str | None = None
    wandb_mode: str = "disabled"
    wandb_resume: bool = False

    success_selection_every_epochs: int = 0
    success_selection_episodes: int = 0
    success_max_steps: int = 200
    success_eval_timeout_sec: int = 7200
    standard_eval_episodes: int = 0
    eval_step_heartbeat_every: int = 50
    rlbench_disable_task_validation: bool = False
    smooth_actions: bool = False
    command_mode: str = "first"
    horizon_index: int = 0
    average_first_n: int = 1
    position_alpha: float = 0.35
    rotation_alpha: float = 0.25
    max_position_step: float | None = 0.03
    gripper_open_threshold: float = 0.6
    gripper_close_threshold: float = 0.4

    def __post_init__(self) -> None:
        self.train_data_path = Path(self.train_data_path)
        self.valid_data_path = Path(self.valid_data_path)
        self.ckpt_root = Path(self.ckpt_root)
        self.camera_names = tuple(str(name) for name in self.camera_names)
        self.optimizer_betas = tuple(float(beta) for beta in self.optimizer_betas)
        self.transformer_variant = str(self.transformer_variant)
        if self.drop_n_last_frames is None:
            self.drop_n_last_frames = self.horizon - self.n_action_steps - self.n_obs_steps + 1
        if self.pcd_transformer_variant is not None:
            self.pcd_transformer_variant = str(self.pcd_transformer_variant)
            if self.transformer_variant == "mdit":
                self.transformer_variant = self.pcd_transformer_variant
        if not isinstance(self.normalization_mode, NormalizationMode):
            self.normalization_mode = NormalizationMode(str(self.normalization_mode))

    def validate(self) -> None:
        if not self.train_data_path.exists():
            raise FileNotFoundError(f"Train data path does not exist: {self.train_data_path}")
        if not self.valid_data_path.exists():
            raise FileNotFoundError(f"Valid data path does not exist: {self.valid_data_path}")
        if str(self.checkpoint_payload_mode) not in {"full", "lightweight"}:
            raise ValueError(
                "checkpoint_payload_mode must be either 'full' or 'lightweight'."
            )
        if str(self.offline_eval_ckpt_payload_mode) not in {"full", "lightweight"}:
            raise ValueError(
                "offline_eval_ckpt_payload_mode must be either 'full' or 'lightweight'."
            )
        if str(self.command_mode) not in {"first", "horizon_index", "mean_first_n"}:
            raise ValueError(
                "command_mode must be one of {'first', 'horizon_index', 'mean_first_n'}."
            )
        if int(self.success_selection_every_epochs) < 0:
            raise ValueError("success_selection_every_epochs must be >= 0.")
        if int(self.success_selection_episodes) < 0:
            raise ValueError("success_selection_episodes must be >= 0.")
        if int(self.success_eval_timeout_sec) < 0:
            raise ValueError("success_eval_timeout_sec must be >= 0.")
        if int(self.standard_eval_episodes) < 0:
            raise ValueError("standard_eval_episodes must be >= 0.")
        if int(self.offline_eval_ckpt_every_epochs) < 0:
            raise ValueError("offline_eval_ckpt_every_epochs must be >= 0.")
        if int(self.drop_n_last_frames) < 0:
            raise ValueError("drop_n_last_frames must be >= 0.")
        if float(self.gripper_close_threshold) > float(self.gripper_open_threshold):
            raise ValueError("gripper_close_threshold must be <= gripper_open_threshold.")
        if self.objective.loss_weights is not None:
            allowed_loss_keys = {"xyz", "rot6d", "grip"}
            unknown_keys = set(self.objective.loss_weights) - allowed_loss_keys
            if unknown_keys:
                raise ValueError(
                    f"objective.loss_weights contains unsupported keys: {sorted(unknown_keys)}."
                )
            for key, value in self.objective.loss_weights.items():
                if float(value) < 0.0:
                    raise ValueError(f"objective.loss_weights[{key!r}] must be >= 0.")
        if str(self.transformer_variant) not in {"mdit", "pdit"}:
            raise ValueError("transformer_variant must be one of {'mdit', 'pdit'}.")
        if self.pcd_transformer_variant is not None and str(self.pcd_transformer_variant) != str(self.transformer_variant):
            raise ValueError(
                "Legacy pcd_transformer_variant conflicts with transformer_variant. "
                "Use transformer_variant as the canonical field."
            )

    def validate_mainline_training(self) -> None:
        self.validate()
        legacy_fields: list[str] = []
        if bool(self.use_pcd):
            legacy_fields.append("use_pcd=true")
        if str(self.transformer_variant).lower() != "mdit":
            legacy_fields.append(f"transformer_variant={self.transformer_variant!r}")
        if bool(self.ema_enable):
            legacy_fields.append("ema_enable=true")
        if legacy_fields:
            joined = ", ".join(legacy_fields)
            raise ValueError(
                "Faithful MDIT mainline training only supports RGB + text + MDIT raw weights. "
                f"Disable legacy options before training: {joined}."
            )

    @property
    def observation_delta_indices(self) -> list[int]:
        return list(range(1 - int(self.n_obs_steps), 1))

    @property
    def action_delta_indices(self) -> list[int]:
        return list(range(1 - int(self.n_obs_steps), 1 - int(self.n_obs_steps) + int(self.horizon)))

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
