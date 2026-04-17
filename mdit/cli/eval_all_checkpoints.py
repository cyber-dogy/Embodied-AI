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
from .shared import payload_cfg_to_experiment_cfg, prepare_eval_manifest

try:
    from tqdm.auto import tqdm
except ImportError:  # pragma: no cover
    tqdm = None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Evaluate all checkpoints and reuse cached results when available."
    )
    parser.add_argument(
        "--ckpt-epochs-dir",
        type=Path,
        default=PROJECT_ROOT / "ckpt" / "epochs",
        help="Directory that contains epoch_XXXX.pt checkpoints.",
    )
    parser.add_argument(
        "--results-json",
        type=Path,
        default=PROJECT_ROOT / "ckpt" / "local_eval_results.json",
        help="Cache file for per-checkpoint evaluation results.",
    )
    parser.add_argument("--strategy", type=str, default="fm", help="Policy strategy name.")
    parser.add_argument("--episodes", type=int, default=100, help="Episodes per checkpoint.")
    parser.add_argument("--seed", type=int, default=1234, help="Evaluation seed.")
    parser.add_argument("--device", type=str, default=None, help="Optional runtime device override.")
    parser.add_argument("--max-steps", type=int, default=200, help="Max steps per episode.")
    parser.add_argument(
        "--heartbeat-every",
        type=int,
        default=50,
        help="Step heartbeat interval inside each episode. Set smaller for more frequent logs.",
    )
    parser.add_argument(
        "--include-special",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Include best_valid.pt/best.pt/latest.pt/best_success.pt when present.",
    )
    parser.add_argument(
        "--prefer-ema",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Prefer EMA weights when available.",
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
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Optional limit on how many checkpoints to process, useful for smoke tests.",
    )
    parser.add_argument(
        "--plot-path",
        type=Path,
        default=PROJECT_ROOT / "ckpt" / "local_eval_success_rate.png",
        help="Where to save the all-checkpoint success-rate line plot.",
    )
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
        help="Evaluate each checkpoint in a fresh subprocess so one RLBench/CoppeliaSim hang does not poison the whole sweep.",
    )
    parser.add_argument(
        "--per-checkpoint-timeout-sec",
        type=int,
        default=900,
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


def build_runtime_result_view(result: dict[str, Any]) -> dict[str, Any]:
    runtime_result = dict(result)
    runtime_result.pop("episode_records", None)
    return runtime_result


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
    special_names: list[str],
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
        for name in special_names:
            ckpt_path = run_dir / name
            if not ckpt_path.exists():
                continue
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


def make_cache_key(
    ckpt_path: Path,
    *,
    episodes: int,
    max_steps: int,
    prefer_ema: bool,
    seed: int,
) -> str:
    return (
        f"{ckpt_path.resolve()}::episodes={int(episodes)}::max_steps={int(max_steps)}"
        f"::ema={int(bool(prefer_ema))}::seed={int(seed)}"
    )


def _extract_path_from_cache_key(cache_key: str) -> Path | None:
    path_str, sep, _ = cache_key.partition("::episodes=")
    if not sep or not path_str.endswith(".pt"):
        return None
    try:
        return Path(path_str)
    except Exception:
        return None


def _extract_int(cache_key: str, field: str) -> int | None:
    match = re.search(rf"(?:^|::){re.escape(field)}=(\d+)", cache_key)
    if match is None:
        return None
    return int(match.group(1))


def build_cache_alias_index(cached: dict[str, Any], ckpt_root: Path) -> dict[tuple[Any, ...], Any]:
    alias_index: dict[tuple[Any, ...], Any] = {}
    for cache_key, value in cached.items():
        ckpt_path = _extract_path_from_cache_key(cache_key)
        if ckpt_path is None:
            continue
        try:
            rel_path = ckpt_path.resolve().relative_to(ckpt_root.resolve())
        except Exception:
            rel_path = Path(ckpt_path.name)
        episodes = _extract_int(cache_key, "episodes")
        max_steps = _extract_int(cache_key, "max_steps")
        ema = _extract_int(cache_key, "ema")
        seed = _extract_int(cache_key, "seed")
        alias_index[(str(rel_path), episodes, max_steps, ema, seed)] = value
        alias_index[(ckpt_path.name, episodes, max_steps, ema, seed)] = value
    return alias_index


def lookup_cached_result(
    cached: dict[str, Any],
    alias_index: dict[tuple[Any, ...], Any],
    ckpt_path: Path,
    *,
    ckpt_root: Path,
    episodes: int,
    max_steps: int,
    prefer_ema: bool,
    seed: int,
) -> Any | None:
    direct_key = make_cache_key(
        ckpt_path,
        episodes=episodes,
        max_steps=max_steps,
        prefer_ema=prefer_ema,
        seed=seed,
    )
    if direct_key in cached:
        return cached[direct_key]

    legacy_key = (
        f"{ckpt_path.resolve()}::episodes={int(episodes)}::max_steps={int(max_steps)}"
        f"::ema={int(bool(prefer_ema))}"
    )
    if legacy_key in cached:
        return cached[legacy_key]

    try:
        rel_path = ckpt_path.resolve().relative_to(ckpt_root.resolve())
    except Exception:
        rel_path = Path(ckpt_path.name)

    candidates = [
        (str(rel_path), int(episodes), int(max_steps), int(bool(prefer_ema)), int(seed)),
        (str(rel_path), int(episodes), int(max_steps), int(bool(prefer_ema)), None),
        (ckpt_path.name, int(episodes), int(max_steps), int(bool(prefer_ema)), int(seed)),
        (ckpt_path.name, int(episodes), int(max_steps), int(bool(prefer_ema)), None),
    ]
    for candidate in candidates:
        if candidate in alias_index:
            return alias_index[candidate]
    return None


def eval_single_checkpoint(
    record: dict[str, Any],
    *,
    strategy: str,
    prefer_ema: bool,
    seed: int,
    device: str | None,
    episodes: int,
    max_steps: int,
    headless: bool,
    show_progress: bool,
    ckpt_root: Path,
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
        print(
            f"starting checkpoint {record['label']}: loading model and preparing eval environment...",
            flush=True,
        )
        cfg = payload_cfg_to_experiment_cfg(
            payload["cfg"],
            seed=seed,
            ckpt_root=ckpt_root,
            heartbeat_every=heartbeat_every,
            device=device,
        )
        eval_manifest, eval_manifest_path = prepare_eval_manifest(
            ckpt_path=ckpt_path,
            payload=payload,
            cfg=cfg,
            strategy=strategy,
            seed=int(seed),
            episodes=int(episodes),
            max_steps=int(max_steps),
            headless=bool(headless),
            show_progress=bool(show_progress),
            prefer_ema=bool(prefer_ema),
            heartbeat_every=int(heartbeat_every),
        )
        model, _ = load_model_for_eval(
            cfg,
            strategy,
            record["path"],
            prefer_ema=prefer_ema,
            payload=payload,
        )

        started_at = time.perf_counter()
        print(
            f"checkpoint {record['label']}: simulator launched, running {episodes} episodes "
            f"(max_steps={max_steps}, heartbeat_every={heartbeat_every})",
            flush=True,
        )
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
        successes = int(sum(int(bool(row.get("success"))) for row in summary["episode_records"]))
        return {
            "label": record["label"],
            "kind": record["kind"],
            "path": str(ckpt_path),
            "epoch": record["epoch"] if record.get("epoch") is not None else extract_epoch_from_path(ckpt_path, payload),
            "completed_epoch": payload.get("completed_epoch"),
            "best_metric": payload.get("best_metric"),
            "best_epoch": payload.get("best_epoch"),
            "best_success_rate": payload.get("best_success_rate"),
            "best_success_epoch": payload.get("best_success_epoch"),
            "success_rate": float(summary["success_rate"]),
            "mean_steps": float(summary["mean_steps"]),
            "num_successes": successes,
            "num_episodes": int(len(summary["episode_records"])),
            "duration_sec": float(elapsed),
            "episode_records": summary["episode_records"],
            "eval_manifest_path": str(eval_manifest_path),
            "recipe_drift": bool(eval_manifest["recipe_drift"]),
            "contract_issues": list(eval_manifest["contract_issues"]),
        }
    finally:
        release_eval_resources(summary, model, cfg, payload)


def _build_single_eval_command(
    *,
    record: dict[str, Any],
    strategy: str,
    prefer_ema: bool,
    seed: int,
    device: str | None,
    episodes: int,
    max_steps: int,
    heartbeat_every: int,
    headless: bool,
    show_progress: bool,
    output_json: Path,
) -> list[str]:
    cmd = [
        sys.executable,
        str(PROJECT_ROOT / "scripts" / "eval_mdit_checkpoint.py"),
        "--ckpt-path",
        str(Path(record["path"]).resolve()),
        "--strategy",
        str(strategy),
        "--episodes",
        str(int(episodes)),
        "--max-steps",
        str(int(max_steps)),
        "--heartbeat-every",
        str(int(heartbeat_every)),
        "--seed",
        str(int(seed)),
        "--output-json",
        str(output_json),
        "--prefer-ema" if prefer_ema else "--no-prefer-ema",
        "--headless" if headless else "--no-headless",
        "--show-progress" if show_progress else "--no-show-progress",
    ]
    if device is not None:
        cmd.extend(["--device", str(device)])
    return cmd


def eval_single_checkpoint_isolated(
    record: dict[str, Any],
    *,
    strategy: str,
    prefer_ema: bool,
    seed: int,
    device: str | None,
    episodes: int,
    max_steps: int,
    headless: bool,
    show_progress: bool,
    ckpt_root: Path,
    heartbeat_every: int,
    timeout_sec: int,
) -> dict[str, Any]:
    ckpt_path = Path(record["path"]).resolve()
    payload = load_checkpoint_payload(ckpt_path)
    with tempfile.TemporaryDirectory(prefix=f"{ckpt_path.stem}_", dir=ckpt_root) as tmp_dir:
        output_json = Path(tmp_dir) / "result.json"
        cmd = _build_single_eval_command(
            record=record,
            strategy=strategy,
            prefer_ema=prefer_ema,
            seed=seed,
            device=device,
            episodes=episodes,
            max_steps=max_steps,
            heartbeat_every=heartbeat_every,
            headless=headless,
            show_progress=show_progress,
            output_json=output_json,
        )
        subprocess.run(
            cmd,
            cwd=PROJECT_ROOT,
            check=True,
            timeout=max(1, int(timeout_sec)),
        )
        result_payload = json.loads(output_json.read_text(encoding="utf-8"))

    successes = int(sum(int(bool(row.get("success"))) for row in result_payload.get("episode_records", [])))
    return {
        "label": record["label"],
        "kind": record["kind"],
        "path": str(ckpt_path),
        "epoch": record["epoch"] if record.get("epoch") is not None else extract_epoch_from_path(ckpt_path, payload),
        "completed_epoch": payload.get("completed_epoch"),
        "best_metric": payload.get("best_metric"),
        "best_epoch": payload.get("best_epoch"),
        "best_success_rate": payload.get("best_success_rate"),
        "best_success_epoch": payload.get("best_success_epoch"),
        "success_rate": float(result_payload["success_rate"]),
        "mean_steps": float(result_payload["mean_steps"]),
        "num_successes": successes,
        "num_episodes": int(result_payload["num_episodes"]),
        "duration_sec": float(result_payload["duration_sec"]),
        "episode_records": result_payload.get("episode_records", []),
    }


def build_failed_result(record: dict[str, Any], ckpt_path: Path, exc: Exception) -> dict[str, Any]:
    payload = None
    try:
        payload = load_checkpoint_payload(ckpt_path)
    except Exception:
        payload = None

    return {
        "label": record["label"],
        "kind": record["kind"],
        "path": str(ckpt_path.resolve()),
        "epoch": record["epoch"] if record.get("epoch") is not None else extract_epoch_from_path(ckpt_path, payload),
        "completed_epoch": None if payload is None else payload.get("completed_epoch"),
        "best_metric": None if payload is None else payload.get("best_metric"),
        "best_epoch": None if payload is None else payload.get("best_epoch"),
        "best_success_rate": None if payload is None else payload.get("best_success_rate"),
        "best_success_epoch": None if payload is None else payload.get("best_success_epoch"),
        "success_rate": None,
        "mean_steps": None,
        "num_successes": 0,
        "num_episodes": 0,
        "duration_sec": None,
        "episode_records": [],
        "eval_error": str(exc),
    }


def print_eval_table(results: list[dict[str, Any]]) -> None:
    print(f"{'label':<20} {'epoch':>8} {'kind':<10} {'succ':>8} {'mean_steps':>12} {'dur_s':>8}")
    for row in results:
        epoch = "NA" if row.get("epoch") is None else str(row["epoch"])
        success_rate = row.get("success_rate")
        mean_steps = row.get("mean_steps")
        duration_sec = row.get("duration_sec")
        succ_text = "ERR" if success_rate is None else f"{float(success_rate):>8.3f}"
        steps_text = "ERR" if mean_steps is None else f"{float(mean_steps):>12.2f}"
        dur_text = "ERR" if duration_sec is None else f"{float(duration_sec):>8.1f}"
        print(f"{row['label']:<20} {epoch:>8} {row['kind']:<10} {succ_text} {steps_text} {dur_text}")


def _find_epoch_result(results: list[dict[str, Any]], epoch: int) -> dict[str, Any] | None:
    candidates = [
        row
        for row in results
        if row.get("epoch") is not None and int(row["epoch"]) == int(epoch) and row.get("success_rate") is not None
    ]
    if not candidates:
        return None
    return max(candidates, key=lambda row: (float(row["success_rate"]), str(row.get("label", ""))))


def _find_best_result(results: list[dict[str, Any]]) -> dict[str, Any] | None:
    candidates = [row for row in results if row.get("success_rate") is not None]
    if not candidates:
        return None
    return max(
        candidates,
        key=lambda row: (
            float(row["success_rate"]),
            -float(row.get("mean_steps") or 0.0),
            -float(row.get("epoch") or -1),
            str(row.get("label", "")),
        ),
    )


def print_audit_summary(results: list[dict[str, Any]], *, episodes: int) -> None:
    print()
    print("audit_summary:")
    for epoch in (50, 100, 300, 500):
        row = _find_epoch_result(results, epoch)
        if row is None:
            continue
        print(
            f"  success@epoch_{int(epoch):04d} = {float(row['success_rate']):.3f} "
            f"({int(row.get('num_successes') or 0)}/{int(row.get('num_episodes') or 0)}) "
            f"[label={row.get('label')}]"
        )

    best_row = _find_best_result(results)
    if best_row is None:
        print("  best_success = unavailable")
        return

    print(
        f"  best_success = {float(best_row['success_rate']):.3f} "
        f"({int(best_row.get('num_successes') or 0)}/{int(best_row.get('num_episodes') or 0)}) "
        f"[label={best_row.get('label')}, epoch={best_row.get('epoch')}, kind={best_row.get('kind')}]"
    )
    best_mean_steps = "ERR" if best_row.get("mean_steps") is None else f"{float(best_row['mean_steps']):.2f}"
    print(f"  best_mean_steps = {best_mean_steps}")
    print(f"  episodes_per_checkpoint = {int(episodes)}")


def compute_aggregate_success(results: list[dict[str, Any]]) -> tuple[int, int, float]:
    total_successes = 0
    total_episodes = 0
    for row in results:
        successes = row.get("num_successes")
        episodes = row.get("num_episodes")
        if successes is None or episodes is None:
            continue
        total_successes += int(successes)
        total_episodes += int(episodes)
    aggregate = float(total_successes / total_episodes) if total_episodes > 0 else 0.0
    return total_successes, total_episodes, aggregate


def log_result_status(
    result: dict[str, Any],
    *,
    idx: int,
    total: int,
    from_cache: bool,
    running_results: list[dict[str, Any]],
) -> None:
    total_successes, total_episodes, aggregate = compute_aggregate_success(running_results)
    source = "cache hit" if from_cache else "evaluated"
    success_rate = result.get("success_rate")
    mean_steps = result.get("mean_steps")
    success_text = "ERR" if success_rate is None else f"{float(success_rate):.3f}"
    steps_text = "ERR" if mean_steps is None else f"{float(mean_steps):.2f}"
    print(
        f"[{idx}/{total}] {source}: {result['label']} "
        f"success_rate={success_text} mean_steps={steps_text} "
        f"aggregate_success={aggregate:.3f} ({total_successes}/{total_episodes})"
    )


def make_overall_progress(total: int):
    if tqdm is None or not sys.stdout.isatty():
        return None
    return tqdm(total=total, desc="all_ckpt_eval", unit="ckpt", dynamic_ncols=True)


def update_progress_bar(progress_bar, results: list[dict[str, Any]], *, last_label: str) -> None:
    if progress_bar is None:
        return
    total_successes, total_episodes, aggregate = compute_aggregate_success(results)
    progress_bar.set_postfix(
        label=last_label,
        agg_succ=f"{aggregate:.3f}",
        agg=f"{total_successes}/{total_episodes}",
    )
    progress_bar.update(1)


def save_success_rate_plot(
    results: list[dict[str, Any]],
    *,
    plot_path: Path,
    figsize: tuple[float, float],
    episodes: int,
) -> Path | None:
    plot_rows = [
        row
        for row in results
        if row.get("epoch") is not None and row.get("success_rate") is not None
    ]
    if not plot_rows:
        return None

    plot_rows = sorted(plot_rows, key=lambda row: (row["epoch"], row["label"]))
    epochs = [row["epoch"] for row in plot_rows]
    success_rates = [float(row["success_rate"]) for row in plot_rows]
    labels = [row["label"] for row in plot_rows]

    plot_path.parent.mkdir(parents=True, exist_ok=True)
    fig, ax = plt.subplots(figsize=figsize)
    ax.plot(epochs, success_rates, marker="o")
    for x, y, label in zip(epochs, success_rates, labels):
        ax.annotate(label, (x, y), textcoords="offset points", xytext=(0, 6), ha="center", fontsize=8)
    ax.set_title(f"Success Rate ({episodes} episodes)")
    ax.set_xlabel("Epoch")
    ax.set_ylabel("Success Rate")
    ax.grid(True, alpha=0.3)
    fig.tight_layout()
    fig.savefig(plot_path, dpi=160)
    plt.close(fig)
    return plot_path


def main() -> int:
    args = parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(line_buffering=True)
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(line_buffering=True)

    ckpt_epochs_dir = args.ckpt_epochs_dir.expanduser().resolve()
    ckpt_root = ckpt_epochs_dir.parent
    results_json = args.results_json.expanduser().resolve()
    special_names = ["latest.pt", "best_valid.pt", "best.pt", "best_success.pt"]

    ckpt_records = discover_checkpoints(
        ckpt_epochs_dir,
        include_special=bool(args.include_special),
        special_names=special_names,
    )
    if args.limit is not None:
        ckpt_records = ckpt_records[: max(0, int(args.limit))]

    print(f"project_root = {PROJECT_ROOT}")
    print(f"ckpt_epochs_dir = {ckpt_epochs_dir}")
    print(f"results_json = {results_json}")
    print(f"discovered checkpoints = {len(ckpt_records)}")

    cached = load_cached_results(results_json)
    alias_index = build_cache_alias_index(cached, ckpt_root)
    results: list[dict[str, Any]] = []
    cache_dirty = False
    progress_bar = make_overall_progress(len(ckpt_records))

    try:
        for idx, record in enumerate(ckpt_records, start=1):
            ckpt_path = Path(record["path"])
            direct_key = make_cache_key(
                ckpt_path,
                episodes=args.episodes,
                max_steps=args.max_steps,
                prefer_ema=args.prefer_ema,
                seed=args.seed,
            )

            if not args.force_reeval:
                cached_result = lookup_cached_result(
                    cached,
                    alias_index,
                    ckpt_path,
                    ckpt_root=ckpt_root,
                    episodes=args.episodes,
                    max_steps=args.max_steps,
                    prefer_ema=args.prefer_ema,
                    seed=args.seed,
                )
                if cached_result is not None:
                    normalized_result = dict(cached_result)
                    normalized_result["path"] = str(ckpt_path.resolve())
                    results.append(build_runtime_result_view(normalized_result))
                    if cached.get(direct_key) != normalized_result:
                        cached[direct_key] = normalized_result
                        cache_dirty = True
                    log_result_status(
                        normalized_result,
                        idx=idx,
                        total=len(ckpt_records),
                        from_cache=True,
                        running_results=results,
                    )
                    update_progress_bar(progress_bar, results, last_label=record["label"])
                    continue

            try:
                if bool(args.isolate_checkpoints):
                    result = eval_single_checkpoint_isolated(
                        record,
                        strategy=args.strategy,
                        prefer_ema=args.prefer_ema,
                        seed=args.seed,
                        device=args.device,
                        episodes=args.episodes,
                        max_steps=args.max_steps,
                        headless=args.headless,
                        show_progress=args.show_progress,
                        ckpt_root=ckpt_root,
                        heartbeat_every=args.heartbeat_every,
                        timeout_sec=args.per_checkpoint_timeout_sec,
                    )
                else:
                    result = eval_single_checkpoint(
                        record,
                        strategy=args.strategy,
                        prefer_ema=args.prefer_ema,
                        seed=args.seed,
                        device=args.device,
                        episodes=args.episodes,
                        max_steps=args.max_steps,
                        headless=args.headless,
                        show_progress=args.show_progress,
                        ckpt_root=ckpt_root,
                        heartbeat_every=args.heartbeat_every,
                    )
            except Exception as exc:
                result = build_failed_result(record, ckpt_path, exc)
                print(f"evaluation failed for {record['label']}: {exc}")

            cached[direct_key] = result
            alias_index = build_cache_alias_index(cached, ckpt_root)
            save_cached_results(results_json, cached)
            cache_dirty = False
            results.append(build_runtime_result_view(result))
            log_result_status(
                results[-1],
                idx=idx,
                total=len(ckpt_records),
                from_cache=False,
                running_results=results,
            )
            update_progress_bar(progress_bar, results, last_label=record["label"])
    finally:
        if progress_bar is not None:
            progress_bar.close()

    if cache_dirty:
        save_cached_results(results_json, cached)

    print()
    print_eval_table(results)
    print_audit_summary(results, episodes=int(args.episodes))
    total_successes, total_episodes, aggregate = compute_aggregate_success(results)
    print()
    print(f"aggregate_success_rate = {aggregate:.3f} ({total_successes}/{total_episodes})")

    plot_path = save_success_rate_plot(
        results,
        plot_path=args.plot_path.expanduser().resolve(),
        figsize=(float(args.plot_figsize[0]), float(args.plot_figsize[1])),
        episodes=int(args.episodes),
    )
    if plot_path is None:
        print("success_rate_plot = skipped (no valid epoch/success_rate rows)")
    else:
        print(f"success_rate_plot = {plot_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
