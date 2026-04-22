import argparse

from libero_common import build_env, get_task_suite_and_task


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--suite", default="libero_spatial")
    parser.add_argument("--task-id", type=int, default=0)
    parser.add_argument("--camera-size", type=int, default=128)
    parser.add_argument("--steps", type=int, default=5)
    args = parser.parse_args()

    task_suite, task = get_task_suite_and_task(args.suite, args.task_id)

    # 这里只做最小 smoke test：能创建环境、能 reset、能 step 即认为仿真链路是通的。
    env = build_env(task_suite, args.task_id, args.camera_size)
    env.reset()

    # 使用全零 dummy action，验证 MuJoCo / robosuite / LIBERO 三层接口是否一致可用。
    for _ in range(args.steps):
        obs, reward, done, info = env.step([0.0] * 7)

    env.close()

    print(f"suite={args.suite}")
    print(f"task_id={args.task_id}")
    print(f"task_name={task.name}")
    print(f"instruction={task.language}")
    print(f"bddl={task_suite.get_task_bddl_file_path(args.task_id)}")
    print(f"last_reward={reward}")
    print(f"last_done={done}")
    print(f"obs_keys={sorted(list(obs.keys()))[:8]}")
    print(f"info_keys={sorted(list(info.keys()))[:8]}")


if __name__ == "__main__":
    main()
