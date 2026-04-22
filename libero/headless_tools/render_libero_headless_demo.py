import argparse
from pathlib import Path

import numpy as np

from libero_common import (
    build_env,
    default_video_path,
    get_task_suite_and_task,
    prepare_frame,
    save_video,
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--suite", default="libero_spatial")
    parser.add_argument("--task-id", type=int, default=0)
    parser.add_argument("--camera-size", type=int, default=128)
    parser.add_argument("--steps", type=int, default=120)
    parser.add_argument("--settle-steps", type=int, default=10)
    parser.add_argument("--fps", type=int, default=20)
    parser.add_argument("--include-wrist", action="store_true")
    parser.add_argument("--out", type=str, default=None)
    args = parser.parse_args()

    task_suite, task = get_task_suite_and_task(args.suite, args.task_id)
    init_states = task_suite.get_task_init_states(args.task_id)
    env = build_env(task_suite, args.task_id, args.camera_size)

    # 这里先放到 benchmark 的固定初始状态，保证每次录制的起点一致。
    env.reset()
    obs = env.set_init_state(init_states[0])
    zero_action = np.zeros(7, dtype=np.float32)

    for _ in range(args.settle_steps):
        obs, _, _, _ = env.step(zero_action)

    frames = []
    for _ in range(args.steps):
        frames.append(prepare_frame(obs, include_wrist=args.include_wrist))
        obs, _, done, _ = env.step(zero_action)
        if done:
            break

    env.close()

    out_path = Path(args.out) if args.out else default_video_path("headless_demo", args.suite, args.task_id)
    save_video(frames, out_path, fps=args.fps)

    print(f"suite={args.suite}")
    print(f"task_id={args.task_id}")
    print(f"task_name={task.name}")
    print(f"instruction={task.language}")
    print(f"frames={len(frames)}")
    print(f"video={out_path}")


if __name__ == "__main__":
    main()
