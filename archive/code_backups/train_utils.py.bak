from __future__ import annotations

import contextlib
import copy
from dataclasses import asdict, dataclass, field
import json
import math
from pathlib import Path
import time
from typing import Any

import numpy as np
import torch
import torch.nn.functional as F
from torch.optim.lr_scheduler import LambdaLR
from torch.utils.data import DataLoader

try:
    from tqdm.auto import tqdm
except ImportError:  # pragma: no cover
    tqdm = None

try:
    import wandb
except ImportError:  # pragma: no cover
    wandb = None

from .common import CKPT_ROOT, DATA_ROOT, DEVICE, PROJECT_ROOT, set_seeds
from .dataset_pcd import RobotDatasetPcd
from .dit_backbone import DiTTrajectoryBackbone
from .pointnet_tokens import PointNetObsTokenEncoder


@dataclass
class ExperimentConfig:
    run_name: str = "unplug_charger_transformer_fm_autodl_v1"
    task_name: str = "unplug_charger"
    obs_mode: str = "pcd"
    train_data_path: Path = DATA_ROOT / "unplug_charger" / "train"
    valid_data_path: Path = DATA_ROOT / "unplug_charger" / "valid"
    seed: int = 1234

    n_obs_steps: int = 3
    n_pred_steps: int = 32
    subs_factor: int = 3
    n_points: int = 4096
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

    batch_size: int = 64
    grad_accum_steps: int = 2
    num_workers: int = 0
    train_epochs: int = 5000
    train_use_amp: bool = False
    train_amp_dtype: str = "float16"
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

    def validate(self) -> None:
        if not Path(self.train_data_path).exists():
            raise FileNotFoundError(f"Train data path does not exist: {self.train_data_path}")
        if not Path(self.valid_data_path).exists():
            raise FileNotFoundError(f"Valid data path does not exist: {self.valid_data_path}")

    @property
    def x_dim(self) -> int:
        return int(self.obs_features_dim + self.y_dim)

    @property
    def ckpt_dir(self) -> Path:
        return Path(self.ckpt_root) / self.run_name

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


def save_config(cfg: ExperimentConfig) -> None:
    cfg.ckpt_dir.mkdir(parents=True, exist_ok=True)
    with open(cfg.ckpt_dir / "config.json", "w", encoding="utf-8") as f:
        json.dump(config_to_dict(cfg), f, indent=2, ensure_ascii=False)


def build_dataset(path: str | Path, cfg: ExperimentConfig) -> RobotDatasetPcd:
    return RobotDatasetPcd(
        data_path=str(path),
        n_obs_steps=cfg.n_obs_steps,
        n_pred_steps=cfg.n_pred_steps,
        use_pc_color=cfg.use_pc_color,
        n_points=cfg.n_points,
        subs_factor=cfg.subs_factor,
    )


def build_dataloaders(cfg: ExperimentConfig):
    dataset_train = build_dataset(cfg.train_data_path, cfg)
    dataset_valid = build_dataset(cfg.valid_data_path, cfg)
    dataloader_train = DataLoader(
        dataset_train,
        shuffle=True,
        batch_size=cfg.batch_size,
        num_workers=cfg.num_workers,
        persistent_workers=bool(cfg.num_workers > 0),
    )
    dataloader_valid = DataLoader(
        dataset_valid,
        shuffle=False,
        batch_size=cfg.batch_size,
        num_workers=cfg.num_workers,
        persistent_workers=bool(cfg.num_workers > 0),
    )
    return dataset_train, dataset_valid, dataloader_train, dataloader_valid


def build_obs_encoder(cfg: ExperimentConfig) -> PointNetObsTokenEncoder:
    return PointNetObsTokenEncoder(
        embed_dim=cfg.obs_features_dim,
        input_channels=6 if cfg.use_pc_color else 3,
        input_transform=False,
        use_group_norm=False,
    )


def build_backbone(cfg: ExperimentConfig) -> DiTTrajectoryBackbone:
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
    )


def build_policy(cfg: ExperimentConfig, strategy: str):
    obs_encoder = build_obs_encoder(cfg)
    backbone = build_backbone(cfg)
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
            augment_data=False,
            noise_type=cfg.fm_noise_type,
            noise_scale=cfg.fm_noise_scale,
            loss_type=cfg.loss_type,
            flow_schedule=cfg.fm_flow_schedule,
            exp_scale=cfg.fm_exp_scale,
            snr_sampler=cfg.fm_snr_sampler,
            subs_factor=cfg.subs_factor,
            pos_emb_scale=20,
            loss_weights={"xyz": 1.0, "rot6d": 1.0, "grip": 1.0},
        )
        policy = FMTransformerPolicy(policy_cfg, obs_encoder=obs_encoder, backbone=backbone)
    elif strategy == "diffusion":
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
        policy = DiffusionTransformerPolicy(policy_cfg, obs_encoder=obs_encoder, backbone=backbone)
    else:
        raise ValueError(f"Unsupported strategy: {strategy}")
    policy.to(DEVICE)
    return policy


def build_optimizer(policy, cfg: ExperimentConfig) -> torch.optim.Optimizer:
    return policy.get_optimizer(
        learning_rate=cfg.learning_rate,
        betas=cfg.betas,
        eps=cfg.eps,
        transformer_weight_decay=cfg.transformer_weight_decay,
        obs_encoder_weight_decay=cfg.obs_encoder_weight_decay,
    )


def build_scheduler(optimizer: torch.optim.Optimizer, cfg: ExperimentConfig, train_loader_len: int):
    total_training_steps = max(
        1,
        (train_loader_len * cfg.train_epochs) // max(1, cfg.grad_accum_steps),
    )

    def lr_lambda(current_step: int) -> float:
        if current_step < cfg.lr_warmup_steps:
            return float(current_step) / float(max(1, cfg.lr_warmup_steps))
        progress = float(current_step - cfg.lr_warmup_steps) / float(
            max(1, total_training_steps - cfg.lr_warmup_steps)
        )
        progress = min(max(progress, 0.0), 1.0)
        return max(0.0, 0.5 * (1.0 + math.cos(math.pi * progress)))

    if cfg.lr_scheduler_name != "cosine":
        raise ValueError(f"Unsupported scheduler: {cfg.lr_scheduler_name}")
    return LambdaLR(optimizer, lr_lambda=lr_lambda)


def resolve_amp_dtype(amp_dtype: str = "float16"):
    if amp_dtype == "bfloat16":
        if torch.cuda.is_available() and hasattr(torch.cuda, "is_bf16_supported"):
            if torch.cuda.is_bf16_supported():
                return torch.bfloat16
    return torch.float16


def amp_enabled(enabled: bool = False) -> bool:
    return bool(enabled and torch.cuda.is_available() and torch.device(DEVICE).type == "cuda")


def get_autocast_context(enabled: bool = False, amp_dtype: str = "float16"):
    if not amp_enabled(enabled):
        return contextlib.nullcontext()
    return torch.autocast(device_type="cuda", dtype=resolve_amp_dtype(amp_dtype))


def build_grad_scaler(enabled: bool = False, amp_dtype: str = "float16"):
    scaler_enabled = amp_enabled(enabled) and resolve_amp_dtype(amp_dtype) == torch.float16
    return torch.cuda.amp.GradScaler(enabled=scaler_enabled)


def maybe_empty_cuda_cache(enabled: bool = True) -> None:
    if enabled and torch.cuda.is_available():
        torch.cuda.empty_cache()


def move_batch_to_device(batch: tuple[Any, ...]) -> tuple[Any, ...]:
    moved = []
    for value in batch:
        if torch.is_tensor(value):
            moved.append(value.to(DEVICE))
        else:
            moved.append(value)
    return tuple(moved)


def build_ema_model(model: torch.nn.Module, enabled: bool) -> torch.nn.Module | None:
    if not enabled:
        return None
    ema_model = copy.deepcopy(model)
    ema_model.to(DEVICE)
    ema_model.eval()
    for param in ema_model.parameters():
        param.requires_grad_(False)
    return ema_model


@torch.no_grad()
def update_ema_model(ema_model: torch.nn.Module | None, model: torch.nn.Module, decay: float) -> None:
    if ema_model is None:
        return
    decay = float(decay)
    ema_state = ema_model.state_dict()
    model_state = model.state_dict()
    for key, ema_value in ema_state.items():
        model_value = model_state[key].to(device=ema_value.device, dtype=ema_value.dtype)
        if torch.is_floating_point(ema_value):
            ema_value.lerp_(model_value, 1.0 - decay)
        else:
            ema_value.copy_(model_value)


def _save_payload(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(payload, path)


def build_checkpoint_payload(
    *,
    cfg: ExperimentConfig,
    strategy: str,
    model: torch.nn.Module,
    ema_model: torch.nn.Module | None,
    optimizer: torch.optim.Optimizer,
    scheduler: LambdaLR,
    scaler: torch.cuda.amp.GradScaler,
    epoch: int,
    global_step: int,
    best_metric: float | None,
    best_epoch: int | None,
    best_success_rate: float | None,
    best_success_epoch: int | None,
    train_loss_history: list[float],
    valid_loss_history: list[float | None],
    epoch_summaries: list[dict[str, Any]],
    wandb_run_id: str | None,
) -> dict[str, Any]:
    return {
        "cfg": config_to_dict(cfg),
        "strategy": str(strategy),
        "model_state_dict": model.state_dict(),
        "ema_state_dict": None if ema_model is None else ema_model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "scheduler_state_dict": scheduler.state_dict(),
        "scaler_state_dict": scaler.state_dict(),
        "completed_epoch": int(epoch),
        "global_step": int(global_step),
        "best_metric": best_metric,
        "best_epoch": best_epoch,
        "best_success_rate": best_success_rate,
        "best_success_epoch": best_success_epoch,
        "train_loss_history": list(train_loss_history),
        "valid_loss_history": list(valid_loss_history),
        "epoch_summaries": list(epoch_summaries),
        "wandb_run_id": wandb_run_id,
    }


def save_checkpoint(
    path: Path,
    *,
    cfg: ExperimentConfig,
    strategy: str,
    model: torch.nn.Module,
    ema_model: torch.nn.Module | None,
    optimizer: torch.optim.Optimizer,
    scheduler: LambdaLR,
    scaler: torch.cuda.amp.GradScaler,
    epoch: int,
    global_step: int,
    best_metric: float | None,
    best_epoch: int | None,
    best_success_rate: float | None,
    best_success_epoch: int | None,
    train_loss_history: list[float],
    valid_loss_history: list[float | None],
    epoch_summaries: list[dict[str, Any]],
    wandb_run_id: str | None,
) -> None:
    payload = build_checkpoint_payload(
        cfg=cfg,
        strategy=strategy,
        model=model,
        ema_model=ema_model,
        optimizer=optimizer,
        scheduler=scheduler,
        scaler=scaler,
        epoch=epoch,
        global_step=global_step,
        best_metric=best_metric,
        best_epoch=best_epoch,
        best_success_rate=best_success_rate,
        best_success_epoch=best_success_epoch,
        train_loss_history=train_loss_history,
        valid_loss_history=valid_loss_history,
        epoch_summaries=epoch_summaries,
        wandb_run_id=wandb_run_id,
    )
    _save_payload(path, payload)


def load_resume_state(
    cfg: ExperimentConfig,
    strategy: str,
    model: torch.nn.Module,
    ema_model: torch.nn.Module | None,
    optimizer: torch.optim.Optimizer,
    scheduler: LambdaLR,
    scaler: torch.cuda.amp.GradScaler,
) -> dict[str, Any]:
    if not cfg.latest_ckpt_path.exists():
        return {
            "resumed": False,
            "start_epoch": 0,
            "global_step": 0,
            "best_metric": None,
            "best_epoch": None,
            "best_success_rate": None,
            "best_success_epoch": None,
            "train_loss_history": [],
            "valid_loss_history": [],
            "epoch_summaries": [],
            "wandb_run_id": None,
        }

    payload = torch.load(cfg.latest_ckpt_path, map_location="cpu")
    if payload.get("strategy") != strategy:
        raise ValueError(
            f"Resume checkpoint strategy mismatch: expected {strategy}, got {payload.get('strategy')}"
        )
    model.load_state_dict(payload["model_state_dict"])
    if ema_model is not None and payload.get("ema_state_dict") is not None:
        ema_model.load_state_dict(payload["ema_state_dict"])
    optimizer.load_state_dict(payload["optimizer_state_dict"])
    scheduler.load_state_dict(payload["scheduler_state_dict"])
    scaler_state = payload.get("scaler_state_dict")
    if scaler_state:
        scaler.load_state_dict(scaler_state)
    completed_epoch = int(payload.get("completed_epoch", -1))
    return {
        "resumed": True,
        "start_epoch": completed_epoch + 1,
        "global_step": int(payload.get("global_step", 0)),
        "best_metric": payload.get("best_metric"),
        "best_epoch": payload.get("best_epoch"),
        "best_success_rate": payload.get("best_success_rate"),
        "best_success_epoch": payload.get("best_success_epoch"),
        "train_loss_history": list(payload.get("train_loss_history") or []),
        "valid_loss_history": list(payload.get("valid_loss_history") or []),
        "epoch_summaries": list(payload.get("epoch_summaries") or []),
        "wandb_run_id": payload.get("wandb_run_id"),
    }


def init_wandb_run(cfg: ExperimentConfig, *, strategy: str, resume_run_id: str | None = None):
    if not cfg.wandb_enable:
        return None
    if wandb is None:
        raise ImportError("wandb is not installed.")
    run = wandb.init(
        project=cfg.wandb_project,
        entity=cfg.wandb_entity,
        mode=cfg.wandb_mode,
        name=f"{cfg.run_name}_{strategy}",
        dir=str(cfg.ckpt_dir),
        config={"strategy": strategy, **config_to_dict(cfg)},
        resume="allow" if cfg.wandb_resume else None,
        id=resume_run_id if cfg.wandb_resume else None,
    )
    return run


def finish_wandb_run(run) -> None:
    if run is not None:
        run.finish()


def summarize_metrics(metrics: list[dict[str, float]]) -> dict[str, float]:
    summary = {}
    for key in metrics[0].keys():
        values = [float(row[key]) for row in metrics]
        summary[key] = float(np.mean(values))
    return summary


def evaluate_model_on_loader(
    model: torch.nn.Module,
    loader: DataLoader,
    cfg: ExperimentConfig,
    max_batches: int | None = None,
) -> dict[str, float] | None:
    model.eval()
    metrics_list: list[dict[str, float]] = []
    with torch.inference_mode():
        for batch_idx, batch_cpu in enumerate(loader):
            if max_batches is not None and batch_idx >= max_batches:
                break
            batch = move_batch_to_device(batch_cpu)
            with get_autocast_context(cfg.train_use_amp, cfg.train_amp_dtype):
                loss_dict = model.compute_loss_dict(batch)
                pcd, robot_state_obs, robot_state_pred = model._norm_data(batch)
                pred_y = model.infer_y(pcd, robot_state_obs)
                metrics = {
                    "loss_total": float(loss_dict["loss_total"].detach().cpu()),
                    "loss_xyz": float(loss_dict["loss_xyz"].detach().cpu()),
                    "loss_rot6d": float(loss_dict["loss_rot6d"].detach().cpu()),
                    "loss_grip": float(loss_dict["loss_grip"].detach().cpu()),
                    "mse_xyz": float(F.mse_loss(pred_y[..., :3], robot_state_pred[..., :3]).detach().cpu()),
                    "mse_rot6d": float(
                        F.mse_loss(pred_y[..., 3:9], robot_state_pred[..., 3:9]).detach().cpu()
                    ),
                    "mse_grip": float(F.mse_loss(pred_y[..., 9], robot_state_pred[..., 9]).detach().cpu()),
                }
            metrics_list.append(metrics)
    if not metrics_list:
        return None
    summary = summarize_metrics(metrics_list)
    summary["num_batches"] = len(metrics_list)
    return summary


def compute_sample_metric(model: torch.nn.Module, batch: tuple[Any, ...]) -> float:
    batch = move_batch_to_device(batch)
    pcd, robot_state_obs, robot_state_pred = model._norm_data(batch)
    with torch.inference_mode():
        pred_y = model.infer_y(pcd, robot_state_obs)
    return float(F.mse_loss(pred_y, robot_state_pred).detach().cpu())


def normalize_rot6d_np(rot6d: np.ndarray) -> np.ndarray:
    rot6d = np.asarray(rot6d, dtype=np.float32).reshape(6)
    a1 = rot6d[:3]
    a2 = rot6d[3:6]
    n1 = float(np.linalg.norm(a1))
    if not np.isfinite(n1) or n1 < 1e-8:
        a1 = np.array([1.0, 0.0, 0.0], dtype=np.float32)
        n1 = 1.0
    b1 = a1 / n1
    a2 = a2 - np.dot(b1, a2) * b1
    n2 = float(np.linalg.norm(a2))
    if not np.isfinite(n2) or n2 < 1e-8:
        ref = np.array([0.0, 1.0, 0.0], dtype=np.float32)
        if abs(float(np.dot(b1, ref))) > 0.9:
            ref = np.array([0.0, 0.0, 1.0], dtype=np.float32)
        a2 = ref - np.dot(b1, ref) * b1
        n2 = float(np.linalg.norm(a2))
    b2 = a2 / max(n2, 1e-8)
    return np.concatenate([b1, b2], axis=0).astype(np.float32)


def select_robot_state_from_prediction(
    prediction: np.ndarray,
    mode: str,
    horizon_index: int,
    average_first_n: int,
) -> np.ndarray:
    prediction = np.asarray(prediction, dtype=np.float32)
    final_horizon = prediction[-1]
    horizon_len = final_horizon.shape[0]
    mode = str(mode).lower()
    if mode == "first":
        selected = final_horizon[0]
    elif mode == "horizon_index":
        index = int(np.clip(horizon_index, 0, horizon_len - 1))
        selected = final_horizon[index]
    elif mode == "mean_first_n":
        count = int(np.clip(average_first_n, 1, horizon_len))
        chunk = final_horizon[:count]
        selected = chunk.mean(axis=0)
        selected[9] = 1.0 if float(np.mean(chunk[:, 9])) >= 0.5 else 0.0
    else:
        raise ValueError(f"Unsupported command selection mode: {mode}")
    selected = selected.astype(np.float32).copy()
    selected[3:9] = normalize_rot6d_np(selected[3:9])
    return selected


def smooth_robot_state_command(
    current_robot_state: np.ndarray,
    predicted_robot_state: np.ndarray,
    *,
    enabled: bool,
    position_alpha: float,
    rotation_alpha: float,
    max_position_step: float | None,
    gripper_open_threshold: float,
    gripper_close_threshold: float,
) -> np.ndarray:
    predicted = np.asarray(predicted_robot_state, dtype=np.float32).reshape(-1).copy()
    predicted[3:9] = normalize_rot6d_np(predicted[3:9])
    if not enabled:
        return predicted
    current = np.asarray(current_robot_state, dtype=np.float32).reshape(-1)
    current[3:9] = normalize_rot6d_np(current[3:9])
    smoothed = predicted.copy()
    smoothed[:3] = current[:3] + (predicted[:3] - current[:3]) * float(np.clip(position_alpha, 0.0, 1.0))
    if max_position_step is not None and float(max_position_step) > 0.0:
        delta = smoothed[:3] - current[:3]
        delta_norm = float(np.linalg.norm(delta))
        if np.isfinite(delta_norm) and delta_norm > float(max_position_step):
            smoothed[:3] = current[:3] + delta / delta_norm * float(max_position_step)
    blended_rot = current[3:9] * (1.0 - rotation_alpha) + predicted[3:9] * rotation_alpha
    smoothed[3:9] = normalize_rot6d_np(blended_rot)
    predicted_gripper = float(predicted[9])
    current_gripper = float(current[9])
    if predicted_gripper >= float(gripper_open_threshold):
        smoothed[9] = 1.0
    elif predicted_gripper <= float(gripper_close_threshold):
        smoothed[9] = 0.0
    else:
        smoothed[9] = 1.0 if current_gripper >= 0.5 else 0.0
    return smoothed.astype(np.float32)


def make_progress_iter(iterable, total=None, desc=None, enable=True):
    if enable and tqdm is not None:
        return tqdm(iterable, total=total, desc=desc, leave=False)
    return iterable


def run_success_rate_eval(
    model: torch.nn.Module,
    cfg: ExperimentConfig,
    *,
    num_episodes: int,
    max_steps: int,
    headless: bool = True,
    show_progress: bool = True,
    progress_desc: str = "eval",
) -> dict[str, Any]:
    try:
        from .rlbench_env import RLBenchEnv
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "RLBench evaluation requires optional RLBench/PyRep dependencies. "
            "Install them before enabling success selection or standard eval."
        ) from exc

    env = RLBenchEnv(
        task_name=cfg.task_name,
        voxel_size=0.01,
        n_points=int(cfg.n_points),
        use_pc_color=bool(cfg.use_pc_color),
        headless=headless,
        vis=False,
        obs_mode=cfg.obs_mode,
        responsive_ui=True,
    )
    model.eval()
    records = []
    success_count = 0
    heartbeat_every = int(cfg.eval_step_heartbeat_every) if cfg.eval_step_heartbeat_every else None
    episode_iter = make_progress_iter(
        range(num_episodes),
        total=num_episodes,
        desc=progress_desc,
        enable=show_progress,
    )
    use_tqdm_progress = show_progress and tqdm is not None and hasattr(episode_iter, "set_postfix")
    try:
        for episode_idx in episode_iter:
            model.reset_obs()
            descriptions = []
            if show_progress:
                print(f"{progress_desc}: episode={episode_idx} starting")
            try:
                descriptions = env.reset()
                success = False
                steps = 0
                for step in range(max_steps):
                    if show_progress and heartbeat_every is not None and step > 0 and step % heartbeat_every == 0:
                        print(f"{progress_desc}: episode={episode_idx} heartbeat step={step}")
                    robot_state, obs = env.get_obs()
                    with torch.inference_mode():
                        prediction = model.predict_action(obs, robot_state)
                    predicted_robot_state = select_robot_state_from_prediction(
                        prediction,
                        mode=cfg.command_mode,
                        horizon_index=cfg.horizon_index,
                        average_first_n=cfg.average_first_n,
                    )
                    next_robot_state = smooth_robot_state_command(
                        robot_state,
                        predicted_robot_state,
                        enabled=cfg.smooth_actions,
                        position_alpha=cfg.position_alpha,
                        rotation_alpha=cfg.rotation_alpha,
                        max_position_step=cfg.max_position_step,
                        gripper_open_threshold=cfg.gripper_open_threshold,
                        gripper_close_threshold=cfg.gripper_close_threshold,
                    )
                    reward, terminate = env.step(next_robot_state)
                    success = bool(reward)
                    steps = step + 1
                    if reward or terminate:
                        break
                error = env.last_step_error
            except Exception as exc:
                success = False
                steps = 0
                error = str(exc)
            success_count += int(success)
            record = {
                "episode": int(episode_idx),
                "success": bool(success),
                "steps": int(steps),
                "descriptions": descriptions,
                "error": error,
            }
            records.append(record)
            running_success = success_count / len(records)
            if use_tqdm_progress:
                episode_iter.set_postfix(
                    success_rate=f"{running_success:.2f}",
                    steps=steps,
                    error="yes" if error else "no",
                )
            elif show_progress:
                print(
                    f"{progress_desc}: episode={episode_idx} success={success} "
                    f"steps={steps} running_success_rate={running_success:.2f} error={error}"
                )
    finally:
        env.close()

    return {
        "success_rate": success_count / max(1, num_episodes),
        "mean_steps": float(np.mean([row["steps"] for row in records])) if records else 0.0,
        "num_episodes": len(records),
        "episode_records": records,
    }


def _summarize_for_json(summary: dict[str, Any] | None) -> dict[str, Any] | None:
    if summary is None:
        return None
    slim = dict(summary)
    if "episode_records" in slim:
        slim["num_successes"] = int(sum(int(bool(row.get("success"))) for row in slim["episode_records"]))
        slim["episode_records"] = slim["episode_records"][:10]
    return slim


def write_summary_json(cfg: ExperimentConfig, summary: dict[str, Any]) -> Path:
    path = cfg.ckpt_dir / "summary.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    return path


def train_experiment(cfg: ExperimentConfig, strategy: str = "fm") -> dict[str, Any]:
    cfg.validate()
    cfg.ckpt_dir.mkdir(parents=True, exist_ok=True)
    cfg.periodic_ckpt_dir.mkdir(parents=True, exist_ok=True)
    save_config(cfg)
    set_seeds(cfg.seed)

    dataset_train, dataset_valid, dataloader_train, dataloader_valid = build_dataloaders(cfg)
    model = build_policy(cfg, strategy)
    optimizer = build_optimizer(model, cfg)
    scheduler = build_scheduler(optimizer, cfg, len(dataloader_train))
    scaler = build_grad_scaler(cfg.train_use_amp, cfg.train_amp_dtype)
    ema_model = build_ema_model(model, cfg.ema_enable)
    resume_state = load_resume_state(cfg, strategy, model, ema_model, optimizer, scheduler, scaler)
    wandb_run = init_wandb_run(cfg, strategy=strategy, resume_run_id=resume_state["wandb_run_id"])

    train_loss_history = resume_state["train_loss_history"]
    valid_loss_history = resume_state["valid_loss_history"]
    epoch_summaries = resume_state["epoch_summaries"]
    best_metric = resume_state["best_metric"]
    best_epoch = resume_state["best_epoch"]
    best_success_rate = resume_state["best_success_rate"]
    best_success_epoch = resume_state["best_success_epoch"]
    global_step = int(resume_state["global_step"])
    start_epoch = int(resume_state["start_epoch"])

    sample_batch_cpu = next(iter(dataloader_train))
    run_started_at = time.perf_counter()

    for epoch in range(start_epoch, cfg.train_epochs):
        model.train()
        epoch_losses: list[float] = []
        optimizer.zero_grad(set_to_none=True)
        train_iter = make_progress_iter(
            enumerate(dataloader_train),
            total=len(dataloader_train),
            desc=f"train epoch {epoch}",
            enable=True,
        )
        for batch_idx, batch_cpu in train_iter:
            batch = move_batch_to_device(batch_cpu)
            with get_autocast_context(cfg.train_use_amp, cfg.train_amp_dtype):
                loss_dict = model.compute_loss_dict(batch)
                loss = loss_dict["loss_total"] / max(1, cfg.grad_accum_steps)
            scaler.scale(loss).backward()

            should_step = ((batch_idx + 1) % max(1, cfg.grad_accum_steps) == 0) or (
                batch_idx == len(dataloader_train) - 1
            )
            if should_step:
                if cfg.grad_clip_norm is not None:
                    scaler.unscale_(optimizer)
                    torch.nn.utils.clip_grad_norm_(model.parameters(), float(cfg.grad_clip_norm))
                scaler.step(optimizer)
                scaler.update()
                optimizer.zero_grad(set_to_none=True)
                scheduler.step()
                update_ema_model(ema_model, model, cfg.ema_decay)
                global_step += 1

            raw_loss = float(loss_dict["loss_total"].detach().cpu())
            epoch_losses.append(raw_loss)
            if tqdm is not None and hasattr(train_iter, "set_postfix"):
                train_iter.set_postfix(loss=f"{raw_loss:.4f}", lr=f"{scheduler.get_last_lr()[0]:.2e}")

            if wandb_run is not None and (batch_idx % max(1, cfg.print_every) == 0):
                wandb_run.log(
                    {
                        "train/loss_total": raw_loss,
                        "train/loss_xyz": float(loss_dict["loss_xyz"].detach().cpu()),
                        "train/loss_rot6d": float(loss_dict["loss_rot6d"].detach().cpu()),
                        "train/loss_grip": float(loss_dict["loss_grip"].detach().cpu()),
                        "train/lr": float(scheduler.get_last_lr()[0]),
                        "epoch": epoch,
                    },
                    step=global_step,
                )

        train_summary = {
            "loss_total": float(np.mean(epoch_losses)) if epoch_losses else float("nan"),
            "num_batches": len(epoch_losses),
            "lr": float(scheduler.get_last_lr()[0]),
        }
        train_loss_history.append(train_summary["loss_total"])

        valid_summary = None
        eval_model = ema_model if ema_model is not None else model
        if ((epoch + 1) % max(1, cfg.val_every_epochs)) == 0:
            valid_summary = evaluate_model_on_loader(eval_model, dataloader_valid, cfg)
        valid_loss_history.append(None if valid_summary is None else valid_summary["loss_total"])

        sample_summary = None
        if int(cfg.sample_every_epochs) > 0 and ((epoch + 1) % int(cfg.sample_every_epochs)) == 0:
            sample_summary = {
                "train_action_mse_error": compute_sample_metric(
                    eval_model,
                    sample_batch_cpu,
                )
            }

        epoch_row = {
            "epoch": int(epoch),
            "train": train_summary,
            "valid": valid_summary,
            "sample": sample_summary,
        }
        epoch_summaries.append(epoch_row)

        if valid_summary is not None:
            metric = float(valid_summary["loss_total"])
            if best_metric is None or metric < best_metric:
                best_metric = metric
                best_epoch = int(epoch)

        save_checkpoint(
            cfg.latest_ckpt_path,
            cfg=cfg,
            strategy=strategy,
            model=model,
            ema_model=ema_model,
            optimizer=optimizer,
            scheduler=scheduler,
            scaler=scaler,
            epoch=epoch,
            global_step=global_step,
            best_metric=best_metric,
            best_epoch=best_epoch,
            best_success_rate=best_success_rate,
            best_success_epoch=best_success_epoch,
            train_loss_history=train_loss_history,
            valid_loss_history=valid_loss_history,
            epoch_summaries=epoch_summaries,
            wandb_run_id=None if wandb_run is None else wandb_run.id,
        )

        if best_epoch == epoch:
            save_checkpoint(
                cfg.best_ckpt_path,
                cfg=cfg,
                strategy=strategy,
                model=model,
                ema_model=ema_model,
                optimizer=optimizer,
                scheduler=scheduler,
                scaler=scaler,
                epoch=epoch,
                global_step=global_step,
                best_metric=best_metric,
                best_epoch=best_epoch,
                best_success_rate=best_success_rate,
                best_success_epoch=best_success_epoch,
                train_loss_history=train_loss_history,
                valid_loss_history=valid_loss_history,
                epoch_summaries=epoch_summaries,
                wandb_run_id=None if wandb_run is None else wandb_run.id,
            )

        if int(cfg.checkpoint_every_epochs) > 0 and ((epoch + 1) % int(cfg.checkpoint_every_epochs)) == 0:
            periodic_path = cfg.periodic_ckpt_dir / f"epoch_{epoch + 1:04d}.pt"
            save_checkpoint(
                periodic_path,
                cfg=cfg,
                strategy=strategy,
                model=model,
                ema_model=ema_model,
                optimizer=optimizer,
                scheduler=scheduler,
                scaler=scaler,
                epoch=epoch,
                global_step=global_step,
                best_metric=best_metric,
                best_epoch=best_epoch,
                best_success_rate=best_success_rate,
                best_success_epoch=best_success_epoch,
                train_loss_history=train_loss_history,
                valid_loss_history=valid_loss_history,
                epoch_summaries=epoch_summaries,
                wandb_run_id=None if wandb_run is None else wandb_run.id,
            )

        success_summary = None
        if (
            int(cfg.success_selection_every_epochs) > 0
            and int(cfg.success_selection_episodes) > 0
            and ((epoch + 1) % int(cfg.success_selection_every_epochs)) == 0
        ):
            success_summary = run_success_rate_eval(
                eval_model,
                cfg,
                num_episodes=int(cfg.success_selection_episodes),
                max_steps=int(cfg.success_max_steps),
                headless=True,
                show_progress=True,
                progress_desc=f"select epoch {epoch + 1}",
            )
            success_rate = float(success_summary["success_rate"])
            if best_success_rate is None or success_rate > best_success_rate:
                best_success_rate = success_rate
                best_success_epoch = int(epoch)
                save_checkpoint(
                    cfg.best_success_ckpt_path,
                    cfg=cfg,
                    strategy=strategy,
                    model=model,
                    ema_model=ema_model,
                    optimizer=optimizer,
                    scheduler=scheduler,
                    scaler=scaler,
                    epoch=epoch,
                    global_step=global_step,
                    best_metric=best_metric,
                    best_epoch=best_epoch,
                    best_success_rate=best_success_rate,
                    best_success_epoch=best_success_epoch,
                    train_loss_history=train_loss_history,
                    valid_loss_history=valid_loss_history,
                    epoch_summaries=epoch_summaries,
                    wandb_run_id=None if wandb_run is None else wandb_run.id,
                )

        if wandb_run is not None:
            payload = {
                "epoch": epoch,
                "summary/train_loss_total": train_summary["loss_total"],
                "summary/lr": train_summary["lr"],
            }
            if valid_summary is not None:
                for key, value in valid_summary.items():
                    payload[f"valid/{key}"] = value
            if sample_summary is not None:
                payload.update({f"sample/{key}": value for key, value in sample_summary.items()})
            if success_summary is not None:
                payload["success_select/success_rate"] = float(success_summary["success_rate"])
                payload["success_select/mean_steps"] = float(success_summary["mean_steps"])
                payload["success_select/num_episodes"] = int(success_summary["num_episodes"])
            wandb_run.log(payload, step=global_step)
            wandb_run.summary["best_metric"] = best_metric
            wandb_run.summary["best_epoch"] = best_epoch
            wandb_run.summary["best_success_rate"] = best_success_rate
            wandb_run.summary["best_success_epoch"] = best_success_epoch
            wandb_run.summary["strategy"] = strategy

        maybe_empty_cuda_cache(cfg.empty_cuda_cache)

    final_eval = None
    if cfg.standard_eval_episodes and int(cfg.standard_eval_episodes) > 0:
        final_eval = run_success_rate_eval(
            ema_model if ema_model is not None else model,
            cfg,
            num_episodes=int(cfg.standard_eval_episodes),
            max_steps=int(cfg.success_max_steps),
            headless=True,
            show_progress=True,
            progress_desc="standard eval",
        )

    wall_clock_hours = (time.perf_counter() - run_started_at) / 3600.0
    summary = {
        "run_name": cfg.run_name,
        "strategy": strategy,
        "run_dir": str(cfg.ckpt_dir),
        "wandb_run_id": None if wandb_run is None else wandb_run.id,
        "wandb_run_url": None if wandb_run is None else wandb_run.get_url(),
        "config": config_to_dict(cfg),
        "best_metric": best_metric,
        "best_epoch": best_epoch,
        "best_success_rate": best_success_rate,
        "best_success_epoch": best_success_epoch,
        "latest_epoch": cfg.train_epochs - 1,
        "train_loss_last": train_loss_history[-1] if train_loss_history else None,
        "valid_loss_last": valid_loss_history[-1] if valid_loss_history else None,
        "epoch_summaries": epoch_summaries[-5:],
        "final_standard_eval": _summarize_for_json(final_eval),
        "wall_clock_hours": wall_clock_hours,
    }
    write_summary_json(cfg, summary)
    finish_wandb_run(wandb_run)
    return summary


def load_model_for_eval(
    cfg: ExperimentConfig,
    strategy: str,
    ckpt_path: str | Path,
    prefer_ema: bool = True,
    payload: dict[str, Any] | None = None,
):
    if payload is None:
        payload = torch.load(Path(ckpt_path), map_location="cpu")
    model = build_policy(cfg, strategy)
    if prefer_ema and payload.get("ema_state_dict") is not None:
        model.load_state_dict(payload["ema_state_dict"])
    else:
        model.load_state_dict(payload["model_state_dict"])
    model.to(DEVICE)
    model.eval()
    return model, payload
