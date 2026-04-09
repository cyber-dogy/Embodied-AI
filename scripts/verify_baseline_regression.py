#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import _bootstrap  # noqa: F401
import numpy as np
import torch

from cli.shared import payload_cfg_to_experiment_cfg
from common.runtime import PROJECT_ROOT, set_device, set_seeds
from data.registry import build_dataset
from train.builders import move_batch_to_device
from train.eval import load_model_for_eval


DEFAULT_REFERENCE = PROJECT_ROOT / "docs" / "baseline-regression-reference.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Verify that the refactored repo still reproduces the baseline best_success checkpoint."
    )
    parser.add_argument(
        "--reference-json",
        type=Path,
        default=DEFAULT_REFERENCE,
        help="Reference JSON generated from the canonical baseline checkpoint.",
    )
    parser.add_argument(
        "--ckpt-path",
        type=Path,
        default=None,
        help="Optional checkpoint override. Defaults to the checkpoint stored in the reference JSON.",
    )
    parser.add_argument(
        "--strategy",
        type=str,
        default="fm",
        help="Policy strategy name.",
    )
    parser.add_argument(
        "--device",
        type=str,
        default="cpu",
        help="Runtime device used for the regression check. Default: cpu.",
    )
    parser.add_argument(
        "--atol",
        type=float,
        default=1e-5,
        help="Absolute tolerance for numeric comparisons.",
    )
    parser.add_argument(
        "--rtol",
        type=float,
        default=1e-5,
        help="Relative tolerance for numeric comparisons.",
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        default=None,
        help="Optional path to save the measured regression payload.",
    )
    return parser.parse_args()


def _stack_samples(samples: list[tuple[Any, ...]]) -> tuple[torch.Tensor, ...]:
    columns = list(zip(*samples))
    stacked: list[torch.Tensor] = []
    for column in columns:
        arrays = [np.asarray(item) for item in column]
        stacked.append(torch.as_tensor(np.stack(arrays, axis=0)))
    return tuple(stacked)


def _tensor_stats(tensor: torch.Tensor) -> dict[str, Any]:
    tensor = tensor.detach().cpu()
    return {
        "shape": list(tensor.shape),
        "mean": float(tensor.mean().item()),
        "std": float(tensor.std().item()),
        "min": float(tensor.min().item()),
        "max": float(tensor.max().item()),
    }


def _compare_scalar(name: str, actual: float, expected: float, *, atol: float, rtol: float) -> str | None:
    if np.isclose(actual, expected, atol=atol, rtol=rtol):
        return None
    return (
        f"{name} mismatch: actual={actual:.10f}, expected={expected:.10f}, "
        f"atol={atol}, rtol={rtol}"
    )


def _compare_stats(
    prefix: str,
    actual: dict[str, Any],
    expected: dict[str, Any],
    *,
    atol: float,
    rtol: float,
) -> list[str]:
    errors: list[str] = []
    if list(actual["shape"]) != list(expected["shape"]):
        errors.append(f"{prefix}.shape mismatch: actual={actual['shape']}, expected={expected['shape']}")
    for key in ("mean", "std", "min", "max"):
        mismatch = _compare_scalar(
            f"{prefix}.{key}",
            float(actual[key]),
            float(expected[key]),
            atol=atol,
            rtol=rtol,
        )
        if mismatch is not None:
            errors.append(mismatch)
    return errors


def _compare_payload(
    actual: dict[str, Any],
    expected: dict[str, Any],
    *,
    atol: float,
    rtol: float,
) -> list[str]:
    errors: list[str] = []
    for key, expected_value in expected["loss_dict"].items():
        mismatch = _compare_scalar(
            f"loss_dict.{key}",
            float(actual["loss_dict"][key]),
            float(expected_value),
            atol=atol,
            rtol=rtol,
        )
        if mismatch is not None:
            errors.append(mismatch)
    errors.extend(_compare_stats("pred_y", actual["pred_y"], expected["pred_y"], atol=atol, rtol=rtol))
    errors.extend(
        _compare_stats("pred_traj", actual["pred_traj"], expected["pred_traj"], atol=atol, rtol=rtol)
    )
    return errors


def main() -> int:
    args = parse_args()
    reference_path = args.reference_json.expanduser().resolve()
    reference = json.loads(reference_path.read_text(encoding="utf-8"))
    ckpt_path = Path(reference["checkpoint_path"]) if args.ckpt_path is None else args.ckpt_path
    ckpt_path = ckpt_path.expanduser().resolve()
    if not ckpt_path.exists():
        raise FileNotFoundError(f"Checkpoint not found: {ckpt_path}")

    payload = torch.load(ckpt_path, map_location="cpu")
    seed = int(reference["seed"])
    set_seeds(seed)
    set_device(args.device)
    cfg = payload_cfg_to_experiment_cfg(
        payload["cfg"],
        seed=seed,
        ckpt_root=ckpt_path.parents[1],
        device=args.device,
    )
    dataset = build_dataset(str(cfg.valid_data_path), cfg)
    samples = [dataset[int(index)] for index in reference["dataset_indices"]]
    batch = move_batch_to_device(_stack_samples(samples))

    model, _ = load_model_for_eval(
        cfg,
        args.strategy,
        ckpt_path,
        prefer_ema=True,
        payload=payload,
    )
    model.eval()
    with torch.inference_mode():
        loss_dict = model.compute_loss_dict(batch)
        pcd, robot_state_obs, _robot_state_pred = model._norm_data(batch)
        pred_y = model.infer_y(pcd, robot_state_obs)
        pred_traj = model.infer_y(pcd, robot_state_obs, return_traj=True)

    measured = {
        "reference_name": reference.get("reference_name", "baseline_best_success_fixed_batch"),
        "checkpoint_path": str(ckpt_path),
        "seed": seed,
        "device": str(args.device),
        "dataset_indices": [int(index) for index in reference["dataset_indices"]],
        "loss_dict": {key: float(value.detach().cpu().item()) for key, value in loss_dict.items()},
        "pred_y": _tensor_stats(pred_y),
        "pred_traj": _tensor_stats(pred_traj),
    }
    errors = _compare_payload(measured, reference, atol=float(args.atol), rtol=float(args.rtol))
    measured["matches_reference"] = not errors
    measured["errors"] = errors

    if args.output_json is not None:
        output_path = args.output_json.expanduser().resolve()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(measured, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps(measured, indent=2, ensure_ascii=False))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
