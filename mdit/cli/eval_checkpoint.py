from __future__ import annotations

from ._bootstrap import bootstrap_local_cli_imports

bootstrap_local_cli_imports()

import argparse
import json
import os
from pathlib import Path
import shutil
import sys
import time

import torch

from common.runtime import set_seeds
from .shared import payload_cfg_to_experiment_cfg


def build_default_output_json_path(
    ckpt_path: Path,
    *,
    episodes: int,
    max_steps: int,
    seed: int,
) -> Path:
    out_dir = ckpt_path.resolve().parents[1] / "eval_results"
    file_name = (
        f"{ckpt_path.stem}__episodes={int(episodes)}__max_steps={int(max_steps)}"
        f"__seed={int(seed)}.json"
    )
    return out_dir / file_name


def summarize_result_for_console(result: dict) -> dict:
    slim = {k: v for k, v in result.items() if k != "episode_records"}
    episode_records = result.get("episode_records", [])
    slim["num_successes"] = int(sum(int(bool(row.get("success"))) for row in episode_records))
    return slim


def _normalize_error_label(error: str | None) -> str:
    text = "" if error is None else str(error).strip()
    if not text:
        return "none"
    lowered = text.lower()
    if "v-rep side" in lowered or "simulator runtime error" in lowered:
        return "simulator_runtime_error"
    if "invalid predicted action" in lowered:
        return "invalid_predicted_action"
    if "recursion depth limit" in lowered:
        return "planning_recursion_limit"
    return text


def build_episode_analysis(result: dict) -> dict:
    episode_records = list(result.get("episode_records") or [])
    success_records = [row for row in episode_records if bool(row.get("success"))]
    failure_records = [row for row in episode_records if not bool(row.get("success"))]
    error_buckets: dict[str, int] = {}
    for row in failure_records:
        label = _normalize_error_label(row.get("error"))
        error_buckets[label] = error_buckets.get(label, 0) + 1

    return {
        "num_episodes": int(result.get("num_episodes", len(episode_records))),
        "num_successes": len(success_records),
        "num_failures": len(failure_records),
        "success_rate": float(result.get("success_rate", 0.0)),
        "mean_steps": float(result.get("mean_steps", 0.0)),
        "success_episode_indices": [int(row.get("episode", -1)) for row in success_records],
        "failure_episode_indices": [int(row.get("episode", -1)) for row in failure_records],
        "failure_error_buckets": error_buckets,
        "num_failures_without_error": sum(1 for row in failure_records if not row.get("error")),
        "max_steps_observed": max((int(row.get("steps", 0)) for row in episode_records), default=0),
        "min_steps_observed": min((int(row.get("steps", 0)) for row in episode_records), default=0),
    }


def build_episode_analysis_path(output_json_path: Path) -> Path:
    return output_json_path.with_name(f"{output_json_path.stem}__analysis.json")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run faithful MDIT RLBench checkpoint evaluation in a standalone Python process."
    )
    parser.add_argument("--ckpt-path", type=Path, required=True, help="Path to a .pt checkpoint.")
    parser.add_argument("--episodes", type=int, default=20, help="Number of evaluation episodes.")
    parser.add_argument("--max-steps", type=int, default=200, help="Maximum steps per episode.")
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Optional evaluation seed. Defaults to the checkpoint config seed.",
    )
    parser.add_argument("--device", type=str, default=None, help="Optional runtime device override.")
    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Run CoppeliaSim headless (default: true).",
    )
    parser.add_argument(
        "--show-progress",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Print per-episode progress (default: true).",
    )
    parser.add_argument(
        "--heartbeat-every",
        type=int,
        default=None,
        help="Optional rollout heartbeat override for RLBench evaluation.",
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        default=None,
        help="Optional path to save the full evaluation JSON.",
    )
    parser.add_argument(
        "--print-episode-records",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Print full episode_records JSON to stdout after the summary.",
    )
    return parser.parse_args()


def _should_reexec_under_xvfb(args: argparse.Namespace) -> bool:
    if not bool(args.headless):
        return False
    if bool(os.environ.get("DISPLAY")):
        return False
    if os.environ.get("MDIT_XVFB_ACTIVE") == "1":
        return False
    return shutil.which("xvfb-run") is not None


def _reexec_under_xvfb() -> None:
    cmd = [
        "xvfb-run",
        "-a",
        "-s",
        "-screen 0 1024x768x24",
        "env",
        "QT_QPA_PLATFORM=xcb",
        "MDIT_XVFB_ACTIVE=1",
        sys.executable,
        *sys.argv,
    ]
    raise SystemExit(os.spawnvp(os.P_WAIT, "xvfb-run", cmd))


def main() -> int:
    args = parse_args()
    if _should_reexec_under_xvfb(args):
        _reexec_under_xvfb()
    from mdit.train.eval import load_model_for_eval, run_success_rate_eval

    ckpt_path = args.ckpt_path.expanduser().resolve()
    if not ckpt_path.exists():
        raise FileNotFoundError(f"Checkpoint not found: {ckpt_path}")

    payload = torch.load(ckpt_path, map_location="cpu")
    eval_seed = int(payload["cfg"].get("seed", 1234) if args.seed is None else args.seed)
    ckpt_root = ckpt_path.parents[1]
    cfg = payload_cfg_to_experiment_cfg(
        payload["cfg"],
        seed=eval_seed,
        ckpt_root=ckpt_root,
        device=args.device,
        heartbeat_every=args.heartbeat_every,
    )
    set_seeds(eval_seed)

    model, _ = load_model_for_eval(cfg, ckpt_path, payload=payload)

    started_at = time.perf_counter()
    summary = run_success_rate_eval(
        model,
        cfg,
        num_episodes=int(args.episodes),
        max_steps=int(args.max_steps),
        headless=bool(args.headless),
        show_progress=bool(args.show_progress),
        progress_desc=ckpt_path.stem,
    )
    elapsed = time.perf_counter() - started_at

    result = {
        "ckpt": str(ckpt_path),
        "seed": int(cfg.seed),
        "success_rate": float(summary["success_rate"]),
        "mean_steps": float(summary["mean_steps"]),
        "num_episodes": int(summary["num_episodes"]),
        "duration_sec": float(elapsed),
        "episode_records": summary["episode_records"],
    }

    output_json_path = (
        args.output_json.expanduser().resolve()
        if args.output_json is not None
        else build_default_output_json_path(
            ckpt_path,
            episodes=int(args.episodes),
            max_steps=int(args.max_steps),
            seed=int(cfg.seed),
        )
    )
    output_json_path.parent.mkdir(parents=True, exist_ok=True)
    output_json_path.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    analysis = build_episode_analysis(result)
    analysis_path = build_episode_analysis_path(output_json_path)
    analysis_path.write_text(json.dumps(analysis, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    console_summary = summarize_result_for_console(result)
    console_summary["episode_analysis"] = analysis
    print("eval summary:")
    print(json.dumps(console_summary, indent=2, ensure_ascii=False))
    print(f"saved full result -> {output_json_path}")
    print(f"saved episode analysis -> {analysis_path}")
    if bool(args.print_episode_records):
        print("episode_records:")
        print(json.dumps(result["episode_records"], indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
