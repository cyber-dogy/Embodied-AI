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
    train_mode: str = "frozen"


@dataclass
class TextEncoderConfig:
    model: str = "openai/clip-vit-base-patch16"


@dataclass
class ObservationEncoderConfig:
    vision: VisionEncoderConfig = field(default_factory=VisionEncoderConfig)
    text: TextEncoderConfig = field(default_factory=TextEncoderConfig)


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

    n_obs_steps: int = 3
    horizon: int = 32
    n_action_steps: int = 16
    robot_state_dim: int = 10
    action_dim: int = 10
    camera_names: tuple[str, ...] = ("front", "wrist", "overhead")
    task_text_mode: str = "template"
    task_text_override: str | None = None
    observation_encoder: ObservationEncoderConfig = field(default_factory=ObservationEncoderConfig)
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
    audit_include_special_ckpts: bool = True
    delete_screening_ckpts_after_audit: bool = False
    lr_scheduler_name: str = "cosine"
    lr_warmup_steps: int = 500

    optimizer_lr: float = 2.0e-5
    optimizer_betas: tuple[float, float] = (0.95, 0.999)
    optimizer_eps: float = 1.0e-8
    optimizer_weight_decay: float = 0.0

    success_max_steps: int = 200
    eval_step_heartbeat_every: int = 50

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
            raise ValueError(
                "checkpoint_payload_mode must be either 'full' or 'lightweight'."
            )

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
    def dataset_stats_path(self) -> Path:
        return self.ckpt_dir / "dataset_stats.json"
