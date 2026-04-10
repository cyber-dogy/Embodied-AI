from .base_env import BaseEnv

__all__ = ["BaseEnv", "RLBenchEnv"]


def __getattr__(name: str):
    if name == "RLBenchEnv":
        from .rlbench_env import RLBenchEnv

        return RLBenchEnv
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
