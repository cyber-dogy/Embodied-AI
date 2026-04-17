from .base import BasePolicy
from .registry import build_policy, list_policies

__all__ = [
    "BasePolicy",
    "DiffusionPolicyConfig",
    "DiffusionTransformerPolicy",
    "FMPolicyConfig",
    "FMTransformerPolicy",
    "build_policy",
    "list_policies",
]


def __getattr__(name: str):
    if name in {"FMPolicyConfig", "FMTransformerPolicy"}:
        from .fm_policy import FMPolicyConfig, FMTransformerPolicy

        exports = {
            "FMPolicyConfig": FMPolicyConfig,
            "FMTransformerPolicy": FMTransformerPolicy,
        }
        return exports[name]
    if name in {"DiffusionPolicyConfig", "DiffusionTransformerPolicy"}:
        from .diffusion_policy import DiffusionPolicyConfig, DiffusionTransformerPolicy

        exports = {
            "DiffusionPolicyConfig": DiffusionPolicyConfig,
            "DiffusionTransformerPolicy": DiffusionTransformerPolicy,
        }
        return exports[name]
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
