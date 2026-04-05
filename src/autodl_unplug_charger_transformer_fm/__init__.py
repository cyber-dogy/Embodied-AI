from .config import ExperimentConfig, config_to_dict, load_config, save_config
from .utils.common import CKPT_ROOT, DATA_ROOT, PROJECT_ROOT, get_device, set_device, set_seeds


def train_experiment(*args, **kwargs):
    from .training.runner import train_experiment as _train_experiment

    return _train_experiment(*args, **kwargs)


def load_model_for_eval(*args, **kwargs):
    from .training.eval import load_model_for_eval as _load_model_for_eval

    return _load_model_for_eval(*args, **kwargs)


def run_success_rate_eval(*args, **kwargs):
    from .training.eval import run_success_rate_eval as _run_success_rate_eval

    return _run_success_rate_eval(*args, **kwargs)

__all__ = [
    "CKPT_ROOT",
    "DATA_ROOT",
    "PROJECT_ROOT",
    "ExperimentConfig",
    "config_to_dict",
    "get_device",
    "load_config",
    "load_model_for_eval",
    "run_success_rate_eval",
    "save_config",
    "set_device",
    "set_seeds",
    "train_experiment",
]
