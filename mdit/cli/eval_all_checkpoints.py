from __future__ import annotations

from ._bootstrap import bootstrap_local_cli_imports

bootstrap_local_cli_imports()

import argparse
import gc
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import time
from typing import Any

import matplotlib.pyplot as plt
import torch

from common.runtime import PROJECT_ROOT
from .shared import payload_cfg_to_experiment_cfg

try:
    from tqdm.auto import tqdm
except ImportError:  # pragma: no cover
    tqdm = None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Evaluate all faithful MDIT checkpoints and reuse cached results when available."
    )
    parser.add_argument("--ckpt-epochs-dir", type=Path, required=True, help="Directory containing epoch_XXXX.pt.")
    parser.add_argument("--results-json", type=Path, required=True, help="Where to save cached evaluation results.")
    parser.add_argument("--episodes", type=int, default=100, help="Episodes per checkpoint.")
    parser.add_argument("--seed", type=int, default=1234, help="Evaluation seed.")
    parser.add_argument("--device", type=str, default=None, help="Optional runtime device override.")
    parser.add_argument("--max-steps", type=int, default=200, help="Max steps per episode.")
    parser.add_argument("--heartbeat-every", type=int, default=50, help="Step heartbeat interval.")
    parser.add_argument(
        "--include-special",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Include best_valid.pt/latest.pt/best_success.pt when present.",
    )
    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Run CoppeliaSim headless.",
    )
    parser.add_argument(
        "--show-progress",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Show per-episode progress while evaluating each checkpoint.",
    )
    parser.add_argument(
        "--force-reeval",
        action=argparse.BooleanOptionalAction,
        default=False,
        help="Ignore cache and reevaluate every checkpoint.",
    )
    parser.add_argument("--limit", type=int, default=None, help="Optional limit on checkpoints.")
    parser.add_argument("--plot-path", type=Path, default=None, help="Optional success-rate plot output.")
    parser.add_argument(
        "--plot-figsize",
        type=float,
        nargs=2,
        metavar=("WIDTH", "HEIGHT"),
        default=(10.0, 4.0),
        help="Figure size for the success-rate plot.",
    )
    parser.add_argument(
        "--isolate-checkpoints",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Evaluate each checkpoint in a fresh subprocess.",
    )
    parser.add_argument(
        "--per-checkpoint-timeout-sec",
        type=int,
        default=1800,
        help="Timeout for each isolated checkpoint evaluation subprocess.",
    )
    return parser.parse_args()


def extract_epoch_from_path(path: Path, payload: dict[str, Any] | None = None) -> int | None:
    completed_epoch = None if payload is None else payload.get("completed_epoch")
    if completed_epoch is not None:
        try:
            return int(completed_epoch) + 1
        except Exception:
            pass
    match = re.search(r"epoch_(\d+)", path.name)
    if match:
        return int(match.group(1))
    return None


def load_checkpoint_payload(ckpt_path: Path) -> dict[str, Any]:
    return torch.load(ckpt_path, map_location="cpu")


def release_eval_resources(*objects: Any) -> None:
    for obj in objects:
        del obj
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()


def discover_checkpoints(
    epochs_dir: Path,
    *,
    include_special: bool,
) -> list[dict[str, Any]]:
    if not epochs_dir.exists():
        raise FileNotFoundError(f"Checkpoint epochs dir does not exist: {epochs_dir}")

    records: list[dict[str, Any]] = []
    for ckpt_path in sorted(epochs_dir.glob("*.pt")):
        records.append(
            {
                "label": ckpt_path.stem,
                "kind": "periodic",
                "path": str(ckpt_path.resolve()),
                "epoch": extract_epoch_from_path(ckpt_path),
            }
        )

    if include_special:
        run_dir = epochs_dir.parent
        for name in ("best_valid.pt", "best_success.pt", "latest.pt"):
            ckpt_path = run_dir / name
            if ckpt_path.exists():
                records.append(
                    {
                        "label": ckpt_path.stem,
                        "kind": "special",
                        "path": str(ckpt_path.resolve()),
                        "epoch": extract_epoch_from_path(ckpt_path),
                    }
                )

    records.sort(key=lambda row: (10**9 if row["epoch"] is None else row["epoch"], row["label"]))
    return records


def load_cached_results(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def save_cached_results(path: Path, results: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def make_cache_key(ckpt_path: Path, *, episodes: int, max_steps: int, seed: int) -> str:
    return (
        f"{ckpt_path.resolve()}::episodes={int(episodes)}::max_steps={int(max_steps)}::seed={int(seed)}"
    )


def _run_eval_subprocess(
    record: dict[str, Any],
    *,
    episodes: int,
    seed: int,
    device: str | None,
    max_steps: int,
    heartbeat_every: int,
    headless: bool,
    show_progress: bool,
    timeout_sec: int,
) -> dict[str, Any]:
    ckpt_path = Path(record["path"]).resolve()
    with tempfile.TemporaryDirectory(prefix="mdit-eval-") as tmpdir:
        output_json = Path(tmpdir) / "result.json"
        cmd = [
            sys.executable,
            str(PROJECT_ROOT / "scripts" / "eval_mdit_checkpoint.py"),
            "--ckpt-path",
            str(ckpt_path),
            "--episodes",
            str(int(episodes)),
            "--seed",
            str(int(seed)),
            "--max-steps",
            str(int(max_steps)),
            "--heartbeat-every",
            str(int(heartbeat_every)),
            "--output-json",
            str(output_json),
            "--headless" if headless else "--no-headless",
            "--show-progress" if show_progress else "--no-show-progress",
        ]
        if device is not None:
            cmd.extend(["--device", str(device)])
        subprocess.run(cmd, cwd=PROJECT_ROOT, check=True, timeout=max(1, int(timeout_sec)))
        result = json.loads(output_json.read_text(encoding="utf-8"))
        return {
            "label": record["label"],
            "kind": record["kind"],
            "path": str(ckpt_path),
            "epoch": record.get("epoch"),
            "success_rate": float(result["success_rate"]),
            "mean_steps": float(result["mean_steps"]),
            "num_episodes": int(result["num_episodes"]),
            "duration_sec": float(result["duration_sec"]),
        }


def eval_single_checkpoint(
    record: dict[str, Any],
    *,
    seed: int,
    device: str | None,
    episodes: int,
    max_steps: int,
    headless: bool,
    show_progress: bool,
    heartbeat_every: int,
) -> dict[str, Any]:
    from mdit.train.eval import load_model_for_eval, run_success_rate_eval

    ckpt_path = Path(record["path"]).resolve()
    payload = None
    cfg = None
    model = None
    summary = None
    try:
        payload = load_checkpoint_payload(ckpt_path)
        cfg = payload_cfg_to_experiment_cfg(
            payload["cfg"],
            seed=seed,
            ckpt_root=ckpt_path.parents[1],
            heartbeat_every=heartbeat_every,
            device=device,
        )
        model, _ = load_model_for_eval(cfg, record["path"], payload=payload)
        started_at = time.perf_counter()
        summary = run_success_rate_eval(
            model,
            cfg,
            num_episodes=int(episodes),
            max_steps=int(max_steps),
            headless=bool(headless),
            show_progress=bool(show_progress),
            progress_desc=f"eval {record['label']}",
        )
        elapsed = time.perf_counter() - started_at
        return {
            "label": record["label"],
            "kind": record["kind"],
            "path": str(ckpt_path),
            "epoch": record.get("epoch"),
            "success_rate": float(summary["success_rate"]),
            "mean_steps": float(summary["mean_steps"]),
            "num_episodes": int(summary["num_episodes"]),
            "duration_sec": float(elapsed),
        }
    finally:
        release_eval_resources(model, payload, cfg, summary)


def maybe_plot(results: dict[str, Any], plot_path: Path | None, figsize: tuple[float, float]) -> None:
    if plot_path is None:
        return
    rows = [row for row in results.values() if row.get("kind") == "periodic" and row.get("success_rate") is not None]
    if not rows:
        return
    rows.sort(key=lambda row: int(row.get("epoch") or 0))
    epochs = [int(row["epoch"]) for row in rows]
    success_rates = [float(row["success_rate"]) for row in rows]
    plot_path.parent.mkdir(parents=True, exist_ok=True)
    fig, ax = plt.subplots(figsize=figsize)
    ax.plot(epochs, success_rates, marker="o")
    ax.set_xlabel("Epoch")
    ax.set_ylabel("Success Rate")
    ax.set_title("Faithful MDIT checkpoint success rate")
    ax.grid(True, alpha=0.3)
    fig.tight_layout()
    fig.savefig(plot_path)
    plt.close(fig)


def main() -> int:
    args = parse_args()
    records = discover_checkpoints(args.ckpt_epochs_dir.expanduser().resolve(), include_special=bool(args.include_special))
    if args.limit is not None:
        records = records[: int(args.limit)]
    cached = load_cached_results(args.results_json.expanduser().resolve())

    iterator = tqdm(records, desc="mdit ckpts", leave=False) if tqdm is not None else records
    for record in iterator:
        ckpt_path = Path(record["path"]).resolve()
        cache_key = make_cache_key(
            ckpt_path,
            episodes=int(args.episodes),
            max_steps=int(args.max_steps),
            seed=int(args.seed),
        )
        if (not args.force_reeval) and cache_key in cached:
            continue
        if bool(args.isolate_checkpoints):
            result = _run_eval_subprocess(
                record,
                episodes=int(args.episodes),
                seed=int(args.seed),
                device=args.device,
                max_steps=int(args.max_steps),
                heartbeat_every=int(args.heartbeat_every),
                headless=bool(args.headless),
                show_progress=bool(args.show_progress),
                timeout_sec=int(args.per_checkpoint_timeout_sec),
            )
        else:
            result = eval_single_checkpoint(
                record,
                seed=int(args.seed),
                device=args.device,
                episodes=int(args.episodes),
                max_steps=int(args.max_steps),
                headless=bool(args.headless),
                show_progress=bool(args.show_progress),
                heartbeat_every=int(args.heartbeat_every),
            )
        cached[cache_key] = result
        save_cached_results(args.results_json.expanduser().resolve(), cached)

    save_cached_results(args.results_json.expanduser().resolve(), cached)
    maybe_plot(
        cached,
        None if args.plot_path is None else args.plot_path.expanduser().resolve(),
        tuple(float(v) for v in args.plot_figsize),
    )

    best_row = None
    for row in cached.values():
        if row.get("success_rate") is None:
            continue
        if best_row is None or float(row["success_rate"]) > float(best_row["success_rate"]):
            best_row = row

    print(json.dumps({"num_results": len(cached), "best": best_row}, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
