from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from common.runtime import CKPT_ROOT, DATA_ROOT, default_device_str


@dataclass
class ExperimentConfig:
    run_name: str = "unplug_charger_transformer_fm_autodl_v1"
    task_name: str = "unplug_charger"
    obs_mode: str = "pcd"
    encoder_name: str = "pointnet_token"
    backbone_name: str = "dit"
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

    batch_size: int = 32
    grad_accum_steps: int = 2
    num_workers: int = 4
    train_epochs: int = 500
    train_use_amp: bool = False
    train_amp_dtype: str = "bfloat16"
    grad_clip_norm: float | None = 1.0
    empty_cuda_cache: bool = True

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
    checkpoint_every_epochs: int = 100
    sample_every_epochs: int = 5
    success_selection_episodes: int = 10
    success_max_steps: int = 200
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

    diffusion_train_steps: int = 100
    diffusion_eval_steps: int = 100
    diffusion_num_infer_steps: int = 100
    diffusion_prediction_type: str = "epsilon"
    diffusion_noise_scale: float = 1.0

    wandb_enable: bool = False
    wandb_project: str = "pfp-autodl-transformer-fm"
    wandb_entity: str | None = None
    wandb_mode: str = "disabled"
    wandb_resume: bool = False

    ckpt_root: Path = CKPT_ROOT
    print_every: int = 50

    def __post_init__(self) -> None:
        self.train_data_path = Path(self.train_data_path)
        self.valid_data_path = Path(self.valid_data_path)
        self.ckpt_root = Path(self.ckpt_root)
        self.betas = tuple(float(beta) for beta in self.betas)
        self.norm_pcd_center = tuple(float(v) for v in self.norm_pcd_center)
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
        self.obs_mode = str(self.obs_mode)

    def validate(self) -> None:
        if not self.train_data_path.exists():
            raise FileNotFoundError(f"Train data path does not exist: {self.train_data_path}")
        if not self.valid_data_path.exists():
            raise FileNotFoundError(f"Valid data path does not exist: {self.valid_data_path}")

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
