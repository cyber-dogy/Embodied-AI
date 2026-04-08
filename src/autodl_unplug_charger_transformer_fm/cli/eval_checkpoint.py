from __future__ import annotations

import argparse
import json
from pathlib import Path
import time

import torch

from ..common.runtime import set_seeds
from .shared import payload_cfg_to_experiment_cfg


def build_default_output_json_path(
    ckpt_path: Path,
    *,
    episodes: int,
    max_steps: int,
    seed: int,
    prefer_ema: bool,
) -> Path:
    out_dir = ckpt_path.resolve().parents[1] / "eval_results"
    file_name = (
        f"{ckpt_path.stem}__episodes={int(episodes)}__max_steps={int(max_steps)}"
        f"__seed={int(seed)}__ema={int(bool(prefer_ema))}.json"
    )
    return out_dir / file_name


def summarize_result_for_console(result: dict) -> dict:
    slim = {k: v for k, v in result.items() if k != "episode_records"}
    episode_records = result.get("episode_records", [])
    slim["num_successes"] = int(sum(int(bool(row.get("success"))) for row in episode_records))
    return slim


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run RLBench checkpoint evaluation in a standalone Python process."
    )
    parser.add_argument("--ckpt-path", type=Path, required=True, help="Path to a .pt checkpoint.")
    parser.add_argument("--strategy", type=str, default="fm", help="Policy strategy name.")
    parser.add_argument("--episodes", type=int, default=20, help="Number of evaluation episodes.")
    parser.add_argument("--max-steps", type=int, default=200, help="Maximum steps per episode.")
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Optional evaluation seed. Defaults to the checkpoint config seed.",
    )
    parser.add_argument(
        "--device",
        type=str,
        default=None,
        help="Optional runtime device override, e.g. cuda or cpu.",
    )
    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Run CoppeliaSim headless (default: true).",
    )
    parser.add_argument(
        "--prefer-ema",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Prefer EMA weights when available (default: true).",
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
        help="Optional path to save the full evaluation JSON. Defaults to <ckpt_root>/eval_results/...",
    )
    parser.add_argument(
        "--print-episode-records",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Print full episode_records JSON to stdout after the summary (default: false).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    from ..train.eval import load_model_for_eval, run_success_rate_eval

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

    model, _ = load_model_for_eval(
        cfg,
        args.strategy,
        ckpt_path,
        prefer_ema=bool(args.prefer_ema),
        payload=payload,
    )

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
            prefer_ema=bool(args.prefer_ema),
        )
    )
    output_json_path.parent.mkdir(parents=True, exist_ok=True)
    output_json_path.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    console_summary = summarize_result_for_console(result)
    print("eval summary:")
    print(json.dumps(console_summary, indent=2, ensure_ascii=False))
    print(f"saved full result -> {output_json_path}")
    if bool(args.print_episode_records):
        print("episode_records:")
        print(json.dumps(result["episode_records"], indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
