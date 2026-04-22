import argparse
from pathlib import Path

import numpy as np

from libero_common import (
    build_env,
    default_video_path,
    get_task_suite_and_task,
    load_action_trace_bundle,
    load_demo_states,
    prepare_frame,
    resolve_demo_file,
    save_video,
)


def replay_demo_states(args) -> None:
    task_suite, task = get_task_suite_and_task(args.suite, args.task_id)
    demo_path = resolve_demo_file(task_suite, args.task_id, args.demo_file)
    episode_key, demo_states, _ = load_demo_states(demo_path, args.episode)

    env = build_env(task_suite, args.task_id, args.camera_size)
    env.reset()

    # 这里直接逐帧回放 demonstration 里的 MuJoCo state，最适合做“成功轨迹视频”。
    frames = []
    for state in demo_states[: args.max_frames]:
        obs = env.set_init_state(state)
        frames.append(prepare_frame(obs, include_wrist=args.include_wrist))

    env.close()

    out_path = Path(args.out) if args.out else default_video_path("demo_rollout", args.suite, args.task_id)
    save_video(frames, out_path, fps=args.fps)

    print(f"source=demo_states")
    print(f"suite={args.suite}")
    print(f"task_id={args.task_id}")
    print(f"task_name={task.name}")
    print(f"instruction={task.language}")
    print(f"episode={args.episode}")
    print(f"episode_key={episode_key}")
    print(f"frames={len(frames)}")
    print(f"demo_file={demo_path}")
    print(f"video={out_path}")


def replay_action_trace(args) -> None:
    task_suite, task = get_task_suite_and_task(args.suite, args.task_id)
    init_states = task_suite.get_task_init_states(args.task_id)
    actions, embedded_initial_state, metadata = load_action_trace_bundle(args.action_file)
    if embedded_initial_state is None:
        if args.init_index < 0 or args.init_index >= len(init_states):
            raise IndexError(f"init-index={args.init_index} 超出范围 [0, {len(init_states)})")
        initial_state = init_states[args.init_index]
        init_source = f"benchmark_init[{args.init_index}]"
    else:
        initial_state = embedded_initial_state
        init_source = "embedded_initial_state"

    env = build_env(task_suite, args.task_id, args.camera_size)
    env.reset()
    obs = env.set_init_state(initial_state)

    zero_action = np.zeros(7, dtype=np.float32)
    for _ in range(args.settle_steps):
        obs, _, _, _ = env.step(zero_action)

    # 这里按顺序重放模型保存下来的动作，适合接你后面的 VLA / WM 评测结果。
    frames = [prepare_frame(obs, include_wrist=args.include_wrist)]
    reward = 0.0
    done = False
    for action in actions[: args.max_frames]:
        if action.shape[0] != 7:
            raise ValueError(f"当前脚本要求 action_dim=7，实际拿到的是 {action.shape[0]}")

        obs, reward, done, _ = env.step(action)
        frames.append(prepare_frame(obs, include_wrist=args.include_wrist))
        if done:
            break

    env.close()

    out_path = Path(args.out) if args.out else default_video_path("action_rollout", args.suite, args.task_id)
    save_video(frames, out_path, fps=args.fps)

    print(f"source=action_trace")
    print(f"suite={args.suite}")
    print(f"task_id={args.task_id}")
    print(f"task_name={task.name}")
    print(f"instruction={task.language}")
    print(f"init_source={init_source}")
    print(f"actions={len(actions)}")
    print(f"frames={len(frames)}")
    print(f"last_reward={reward}")
    print(f"last_done={done}")
    print(f"action_file={Path(args.action_file).expanduser().resolve()}")
    if metadata:
        print(f"metadata={metadata}")
    print(f"video={out_path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", choices=["demo_states", "action_trace"], required=True)
    parser.add_argument("--suite", default="libero_spatial")
    parser.add_argument("--task-id", type=int, default=0)
    parser.add_argument("--camera-size", type=int, default=128)
    parser.add_argument("--fps", type=int, default=20)
    parser.add_argument("--include-wrist", action="store_true")
    parser.add_argument("--max-frames", type=int, default=400)
    parser.add_argument("--out", type=str, default=None)

    parser.add_argument("--demo-file", type=str, default=None)
    parser.add_argument("--episode", type=int, default=0)

    parser.add_argument("--action-file", type=str, default=None)
    parser.add_argument("--init-index", type=int, default=0)
    parser.add_argument("--settle-steps", type=int, default=10)
    args = parser.parse_args()

    if args.source == "demo_states":
        replay_demo_states(args)
        return

    if args.action_file is None:
        raise ValueError("source=action_trace 时必须提供 --action-file")
    replay_action_trace(args)


if __name__ == "__main__":
    main()
