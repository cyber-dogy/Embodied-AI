from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from common.runtime import CKPT_ROOT, DATA_ROOT, default_device_str
from lelan.model.utils import NormalizationMode


@dataclass
class FiLMConfig:
    num_res_blocks: int = 8
    num_channels: int = 128
    use_coord_conv: bool = True


@dataclass
class HistoryEncoderConfig:
    backbone: str = "efficientnet-b0"
    encoding_dim: int = 512
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


@dataclass
class TransformerConfig:
    """DiT action decoder transformer config (same structure as mdit)."""
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
    run_name: str = "unplug_charger_lelan_v1"
    task_name: str = "unplug_charger"
    train_data_path: Path = DATA_ROOT / "unplug_charger" / "train"
    valid_data_path: Path = DATA_ROOT / "unplug_charger" / "valid"
    ckpt_root: Path = CKPT_ROOT
    device: str = default_device_str()
    seed: int = 1234
    resume_from_latest: bool = False

    n_obs_steps: int = 3
    horizon: int = 32
    n_action_steps: int = 8
    robot_state_dim: int = 10
    action_dim: int = 10
    camera_names: tuple[str, ...] = ("front", "wrist", "overhead", "left_shoulder", "right_shoulder")
    task_text_mode: str = "template"
    task_text_override: str | None = None

    # LeLaN observation encoder configs
    film: FiLMConfig = field(default_factory=FiLMConfig)
    history_encoder: HistoryEncoderConfig = field(default_factory=HistoryEncoderConfig)
    text_encoder: TextEncoderConfig = field(default_factory=TextEncoderConfig)
    fusion_transformer: FusionTransformerConfig = field(default_factory=FusionTransformerConfig)

    # DiT action decoder + Flow Matching (from mdit)
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

    use_ema: bool = True
    ema_decay: float = 0.999

    wandb_enable: bool = False
    wandb_project: str = "autodl-unplug-charger-lelan"
    wandb_entity: str | None = None
    wandb_mode: str = "disabled"
    wandb_resume: bool = False

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

    def __post_init__(self) -> None:
        self.train_data_path = Path(self.train_data_path)
        self.valid_data_path = Path(self.valid_data_path)
        self.ckpt_root = Path(self.ckpt_root)
        self.camera_names = tuple(str(name) for name in self.camera_names)
        self.optimizer_betas = tuple(float(beta) for beta in self.optimizer_betas)
        if not isinstance(self.normalization_mode, NormalizationMode):
            self.normalization_mode = NormalizationMode(str(self.normalization_mode))

    def validate(self) -> None:
        if not self.train_data_path.exists():
            raise FileNotFoundError(f"Train data path does not exist: {self.train_data_path}")
        if not self.valid_data_path.exists():
            raise FileNotFoundError(f"Valid data path does not exist: {self.valid_data_path}")
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
