from __future__ import annotations

from ._bootstrap import bootstrap_local_cli_imports

bootstrap_local_cli_imports()

import argparse
import json
from pathlib import Path
import time

from common.runtime import PROJECT_ROOT
from .shared import payload_cfg_to_experiment_cfg


def render_point_cloud_frame(
    pcd: np.ndarray,
    robot_state: np.ndarray | None,
    *,
    title: str,
    point_limit: int = 2000,
    elev: float = 28.0,
    azim: float = -56.0,
) -> np.ndarray:
    import matplotlib
    import matplotlib.pyplot as plt
    import numpy as np

    matplotlib.use("Agg")
    pcd = np.asarray(pcd)
    if pcd.ndim != 2 or pcd.shape[1] < 3:
        raise ValueError(f"Expected point cloud shape (N, 3+) but got {pcd.shape}")

    xyz = pcd[:, :3]
    colors = None
    if pcd.shape[1] >= 6:
        colors = np.clip(pcd[:, 3:6], 0.0, 1.0)

    if point_limit is not None and len(xyz) > point_limit:
        idx = np.linspace(0, len(xyz) - 1, point_limit, dtype=np.int32)
        xyz = xyz[idx]
        if colors is not None:
            colors = colors[idx]

    fig = plt.figure(figsize=(6, 6), dpi=120)
    ax = fig.add_subplot(111, projection="3d")
    ax.set_title(title)
    ax.view_init(elev=elev, azim=azim)
    ax.scatter(
        xyz[:, 0],
        xyz[:, 1],
        xyz[:, 2],
        s=2.0,
        c=colors if colors is not None else "royalblue",
        alpha=0.9,
        depthshade=False,
    )

    if robot_state is not None:
        ee = np.asarray(robot_state, dtype=np.float32).reshape(-1)
        if ee.shape[0] >= 3:
            ax.scatter(
                [ee[0]],
                [ee[1]],
                [ee[2]],
                s=80.0,
                c="crimson",
                marker="x",
                linewidths=2.5,
            )

    mins = xyz.min(axis=0)
    maxs = xyz.max(axis=0)
    centers = (mins + maxs) / 2.0
    radius = float(np.max(maxs - mins) / 2.0)
    radius = max(radius, 0.15)
    ax.set_xlim(centers[0] - radius, centers[0] + radius)
    ax.set_ylim(centers[1] - radius, centers[1] + radius)
    ax.set_zlim(centers[2] - radius, centers[2] + radius)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_zlabel("z")
    ax.grid(False)
    ax.set_box_aspect((1, 1, 1))
    plt.tight_layout()

    fig.canvas.draw()
    width, height = fig.canvas.get_width_height()
    frame = np.frombuffer(fig.canvas.buffer_rgba(), dtype=np.uint8).reshape(height, width, 4)[..., :3]
    plt.close(fig)
    return frame.copy()


def get_rgb_frame(last_obs, camera: str) -> np.ndarray:
    import numpy as np

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


def record_rollout_videos(args: argparse.Namespace) -> dict:
    import imageio.v2 as imageio
    import numpy as np
    import torch

    from envs import RLBenchEnv
    from pdit.train.action_postprocess import (
        select_robot_state_from_prediction,
        smooth_robot_state_command,
    )
    from mdit.train.eval import (
        load_model_for_eval,
    )

    ckpt_path = Path(args.ckpt_path).expanduser().resolve()
    payload = torch.load(ckpt_path, map_location="cpu")
    strategy = args.strategy or payload.get("strategy") or "fm"
    cfg = payload_cfg_to_experiment_cfg(
        payload["cfg"],
        ckpt_root=PROJECT_ROOT / "ckpt",
        device=args.device,
    )
    model, _ = load_model_for_eval(cfg, strategy, ckpt_path, prefer_ema=bool(args.prefer_ema), payload=payload)

    env = RLBenchEnv(
        task_name=cfg.task_name,
        voxel_size=0.01,
        n_points=int(cfg.n_points),
        use_pc_color=bool(cfg.use_pc_color),
        headless=bool(args.headless),
        vis=False,
        obs_mode=cfg.obs_mode,
        responsive_ui=True,
    )

    out_dir = Path(args.output_dir).expanduser().resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    camera_names = resolve_camera_names(args.camera)
    sim_video_paths = {
        camera_name: out_dir / f"{ckpt_path.stem}_{camera_name}_sim.mp4"
        for camera_name in camera_names
    }
    pcd_video_path = out_dir / f"{ckpt_path.stem}_pcd.mp4"
    summary_path = out_dir / f"{ckpt_path.stem}_video_summary.json"

    sim_frames_by_camera: dict[str, list[np.ndarray]] = {camera_name: [] for camera_name in camera_names}
    pcd_frames: list[np.ndarray] = []
    records = []
    success_count = 0
    started_at = time.perf_counter()
    global_frame_idx = 0

    model.eval()
    try:
        for episode_idx in range(int(args.episodes)):
            model.reset_obs()
            descriptions = env.reset()
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
                try:
                    pcd_frames.append(
                        render_point_cloud_frame(
                            obs,
                            robot_state,
                            title=f"{ckpt_path.stem} | ep {episode_idx} step {step_idx}",
                            point_limit=int(args.point_limit),
                            elev=float(args.pcd_elev),
                            azim=float(args.pcd_azim_start)
                            + float(args.pcd_azim_step) * global_frame_idx
                            if bool(args.pcd_rotate)
                            else float(args.pcd_azim_start),
                        )
                    )
                except Exception as exc:
                    error = f"pcd_render_error: {exc}"

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
                steps = step_idx + 1
                global_frame_idx += 1
                if reward or terminate:
                    break

            success_count += int(success)
            records.append(
                {
                    "episode": int(episode_idx),
                    "success": bool(success),
                    "steps": int(steps),
                    "descriptions": descriptions,
                    "error": error,
                }
            )
    finally:
        try:
            env.close()
        except Exception:
            pass

    if not any(sim_frames_by_camera.values()):
        raise RuntimeError("No simulator RGB frames were captured.")
    if not pcd_frames:
        raise RuntimeError("No point cloud frames were rendered.")

    tail_frames = max(0, int(args.tail_frames))
    if tail_frames > 0:
        for camera_name, sim_frames in sim_frames_by_camera.items():
            if sim_frames:
                sim_frames.extend([sim_frames[-1].copy() for _ in range(tail_frames)])
        if pcd_frames:
            pcd_frames.extend([pcd_frames[-1].copy() for _ in range(tail_frames)])

    saved_sim_videos = {}
    for camera_name, sim_frames in sim_frames_by_camera.items():
        if not sim_frames:
            continue
        sim_video_path = sim_video_paths[camera_name]
        imageio.mimsave(sim_video_path, sim_frames, fps=int(args.fps))
        saved_sim_videos[camera_name] = str(sim_video_path)
    imageio.mimsave(pcd_video_path, pcd_frames, fps=int(args.fps))

    elapsed = time.perf_counter() - started_at
    summary = {
        "ckpt_path": str(ckpt_path),
        "strategy": strategy,
        "sim_video_paths": saved_sim_videos,
        "pcd_video_path": str(pcd_video_path),
        "camera": args.camera,
        "camera_names": camera_names,
        "episodes": int(args.episodes),
        "max_steps": int(args.max_steps),
        "fps": int(args.fps),
        "tail_frames": tail_frames,
        "pcd_rotate": bool(args.pcd_rotate),
        "pcd_elev": float(args.pcd_elev),
        "pcd_azim_start": float(args.pcd_azim_start),
        "pcd_azim_step": float(args.pcd_azim_step),
        "success_rate": float(success_count / max(1, len(records))),
        "num_successes": int(success_count),
        "num_episodes": int(len(records)),
        "duration_sec": float(elapsed),
        "records": records,
    }
    summary_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n")
    return summary


def build_argparser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Record simulator and point-cloud rollout videos for one checkpoint."
    )
    parser.add_argument("--ckpt-path", required=True, help="Path to checkpoint .pt file")
    parser.add_argument("--output-dir", default=str(PROJECT_ROOT / "ckpt" / "videos"))
    parser.add_argument("--strategy", default=None, help="Override strategy, default uses checkpoint value")
    parser.add_argument("--device", default=None, help="Optional runtime device override")
    parser.add_argument("--episodes", type=int, default=1)
    parser.add_argument("--max-steps", type=int, default=200)
    parser.add_argument("--fps", type=int, default=20)
    parser.add_argument(
        "--camera",
        default="front",
        choices=["front", "wrist", "overhead", "left_shoulder", "right_shoulder", "all"],
    )
    parser.add_argument("--point-limit", type=int, default=2000)
    parser.add_argument(
        "--tail-frames",
        type=int,
        default=10,
        help="Repeat the last frame this many times so the ending is easier to watch.",
    )
    parser.add_argument(
        "--pcd-rotate",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Rotate the point-cloud camera azimuth gradually over time. Default: True.",
    )
    parser.add_argument("--pcd-elev", type=float, default=28.0)
    parser.add_argument("--pcd-azim-start", type=float, default=-56.0)
    parser.add_argument(
        "--pcd-azim-step",
        type=float,
        default=1.2,
        help="Azimuth delta in degrees per rendered point-cloud frame.",
    )
    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Run RLBench without GUI window. Default: True.",
    )
    parser.add_argument(
        "--prefer-ema",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Prefer EMA weights when available. Default: True.",
    )
    return parser


def main() -> int:
    parser = build_argparser()
    args = parser.parse_args()
    summary = record_rollout_videos(args)
    print(json.dumps({k: v for k, v in summary.items() if k != "records"}, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
