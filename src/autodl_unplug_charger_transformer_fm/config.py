from __future__ import annotations

from dataclasses import asdict, dataclass
import json
from pathlib import Path
from typing import Any

from .utils.common import CKPT_ROOT, DATA_ROOT, PROJECT_ROOT, default_device_str


@dataclass
class ExperimentConfig:
    run_name: str = "unplug_charger_transformer_fm_autodl_v1"
    task_name: str = "unplug_charger"
    obs_mode: str = "pcd"
    train_data_path: Path = DATA_ROOT / "unplug_charger" / "train"
    valid_data_path: Path = DATA_ROOT / "unplug_charger" / "valid"
    seed: int = 1234
    device: str = default_device_str()
    resume_from_latest: bool = True

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

    batch_size: int = 32
    grad_accum_steps: int = 2
    num_workers: int = 4
    train_epochs: int = 5000
    train_use_amp: bool = True
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
    success_selection_every_epochs: int = 50
    checkpoint_every_epochs: int = 50
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
    loss_type: str = "l2"

    fm_num_k_infer: int = 10
    fm_time_conditioning: bool = True
    fm_noise_type: str = "gaussian"
    fm_noise_scale: float = 1.0
    fm_flow_schedule: str = "exp"
    fm_exp_scale: float = 4.0
    fm_snr_sampler: str = "uniform"

    diffusion_train_steps: int = 100
    diffusion_eval_steps: int = 100
    diffusion_num_infer_steps: int = 100
    diffusion_prediction_type: str = "epsilon"
    diffusion_noise_scale: float = 1.0

    wandb_enable: bool = True
    wandb_project: str = "pfp-autodl-transformer-fm"
    wandb_entity: str | None = None
    wandb_mode: str = "online"
    wandb_resume: bool = True

    ckpt_root: Path = CKPT_ROOT
    print_every: int = 50

    def __post_init__(self) -> None:
        self.train_data_path = Path(self.train_data_path)
        self.valid_data_path = Path(self.valid_data_path)
        self.ckpt_root = Path(self.ckpt_root)
        self.betas = tuple(float(beta) for beta in self.betas)
        self.norm_pcd_center = tuple(float(v) for v in self.norm_pcd_center)
        self.device = str(self.device)

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
        return self.ckpt_dir / "best.pt"

    @property
    def best_success_ckpt_path(self) -> Path:
        return self.ckpt_dir / "best_success.pt"


def config_to_dict(cfg: ExperimentConfig) -> dict[str, Any]:
    payload = asdict(cfg)
    for key, value in list(payload.items()):
        if isinstance(value, Path):
            payload[key] = str(value)
    return payload


def save_config(cfg: ExperimentConfig, path: Path | None = None) -> Path:
    config_path = cfg.ckpt_dir / "config.json" if path is None else Path(path)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(
        json.dumps(config_to_dict(cfg), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return config_path


def load_config(path: str | Path) -> ExperimentConfig:
    config_path = Path(path).expanduser().resolve()
    payload = json.loads(config_path.read_text(encoding="utf-8"))
    for key in ("train_data_path", "valid_data_path", "ckpt_root"):
        value = payload.get(key)
        if value is None:
            continue
        value_path = Path(value)
        if not value_path.is_absolute():
            payload[key] = str((PROJECT_ROOT / value_path).resolve())
    return ExperimentConfig(**payload)
