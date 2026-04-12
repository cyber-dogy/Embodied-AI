from __future__ import annotations

from ._bootstrap import bootstrap_local_cli_imports

bootstrap_local_cli_imports()

import argparse
import json
from pathlib import Path
import time

import numpy as np
import torch

from common.runtime import PROJECT_ROOT, set_seeds
from envs import RLBenchEnv
from lelan.train.eval import load_model_for_eval
from .shared import payload_cfg_to_experiment_cfg


def get_rgb_frame(last_obs, camera: str) -> np.ndarray:
    camera_attr = f"{camera}_rgb"
    frame = getattr(last_obs, camera_attr, None)
    if frame is None:
        raise AttributeError(f"Observation does not have camera '{camera_attr}'")
    frame = np.asarray(frame)
    if frame.dtype != np.uint8:
        frame = np.clip(frame, 0, 255).astype(np.uint8)
    return frame.copy()


def resolve_camera_names(camera_arg: str) -> list[str]:
    all_cameras = ["front", "wrist", "overhead", "left_shoulder", "right_shoulder"]
    if camera_arg == "all":
        return all_cameras
    return [camera_arg]


def build_argparser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Record simulator rollout videos for one LeLaN checkpoint."
    )
    parser.add_argument("--ckpt-path", required=True, help="Path to checkpoint .pt file")
    parser.add_argument("--output-dir", default=str(PROJECT_ROOT / "ckpt" / "videos"))
    parser.add_argument("--device", default=None, help="Optional runtime device override")
    parser.add_argument("--episodes", type=int, default=1)
    parser.add_argument("--max-steps", type=int, default=200)
    parser.add_argument("--fps", type=int, default=20)
    parser.add_argument(
        "--camera",
        default="front",
        choices=["front", "wrist", "overhead", "left_shoulder", "right_shoulder", "all"],
    )
    parser.add_argument(
        "--tail-frames",
        type=int,
        default=10,
        help="Repeat the last frame this many times so the ending is easier to watch.",
    )
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
    return parser


def record_rollout_videos(args: argparse.Namespace) -> dict:
    import imageio.v2 as imageio

    ckpt_path = Path(args.ckpt_path).expanduser().resolve()
    payload = torch.load(ckpt_path, map_location="cpu")
    ckpt_root = ckpt_path.parents[1]
    cfg = payload_cfg_to_experiment_cfg(
        payload["cfg"],
        ckpt_root=ckpt_root,
        device=args.device,
    )
    set_seeds(int(cfg.seed))
    model, _ = load_model_for_eval(cfg, ckpt_path, payload=payload)

    env = RLBenchEnv(
        task_name=cfg.task_name,
        voxel_size=0.01,
        n_points=2048,
        use_pc_color=False,
        headless=bool(args.headless),
        vis=False,
        obs_mode="rgb",
        responsive_ui=True,
    )

    out_dir = Path(args.output_dir).expanduser().resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    camera_names = resolve_camera_names(args.camera)
    sim_video_paths = {
        camera_name: out_dir / f"{ckpt_path.stem}_{camera_name}_sim.mp4"
        for camera_name in camera_names
    }
    summary_path = out_dir / f"{ckpt_path.stem}_video_summary.json"

    sim_frames_by_camera: dict[str, list[np.ndarray]] = {camera_name: [] for camera_name in camera_names}
    records = []
    success_count = 0
    started_at = time.perf_counter()

    model.eval()
    try:
        for episode_idx in range(int(args.episodes)):
            model.reset()
            descriptions = env.reset()
            instruction = env.get_task_instruction(
                override_text=cfg.task_text_override if cfg.task_text_mode == "override" else None,
                use_env_descriptions=cfg.task_text_mode != "template",
            )
            success = False
            steps = 0
            error = None
            for step_idx in range(int(args.max_steps)):
                robot_state, obs = env.get_obs()
                for camera_name in camera_names:
                    try:
                        sim_frames_by_camera[camera_name].append(get_rgb_frame(env.last_obs, camera_name))
                    except Exception as exc:
                        error = f"camera_capture_error[{camera_name}]: {exc}"

                with torch.inference_mode():
                    action = model.predict_action(obs, robot_state, task_text=instruction)
                reward, terminate = env.step(action)
                success = bool(reward)
                steps = step_idx + 1
                if reward or terminate:
                    break
            success_count += int(success)
            records.append(
                {
                    "episode": int(episode_idx),
                    "success": bool(success),
                    "steps": int(steps),
                    "descriptions": descriptions,
                    "error": error or env.last_step_error,
                }
            )
            if bool(args.show_progress):
                running_success = success_count / len(records)
                print(
                    f"lelan video rollout: episode={episode_idx} success={success} "
                    f"steps={steps} running_success_rate={running_success:.2f}"
                )
    finally:
        env.close()

    if not any(sim_frames_by_camera.values()):
        raise RuntimeError("No simulator RGB frames were captured.")

    tail_frames = max(0, int(args.tail_frames))
    if tail_frames > 0:
        for camera_name, sim_frames in sim_frames_by_camera.items():
            if sim_frames:
                sim_frames.extend([sim_frames[-1].copy() for _ in range(tail_frames)])

    saved_sim_videos = {}
    for camera_name, sim_frames in sim_frames_by_camera.items():
        if not sim_frames:
            continue
        sim_video_path = sim_video_paths[camera_name]
        imageio.mimsave(sim_video_path, sim_frames, fps=int(args.fps))
        saved_sim_videos[camera_name] = str(sim_video_path)

    elapsed = time.perf_counter() - started_at
    summary = {
        "ckpt_path": str(ckpt_path),
        "line": "lelan",
        "sim_video_paths": saved_sim_videos,
        "camera": args.camera,
        "camera_names": camera_names,
        "episodes": int(args.episodes),
        "max_steps": int(args.max_steps),
        "fps": int(args.fps),
        "tail_frames": tail_frames,
        "success_rate": float(success_count / max(1, len(records))),
        "num_successes": int(success_count),
        "num_episodes": int(len(records)),
        "duration_sec": float(elapsed),
        "records": records,
    }
    summary_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return summary


def main() -> int:
    args = build_argparser().parse_args()
    summary = record_rollout_videos(args)
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
