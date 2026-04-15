import os
import time
import types
import warnings
from functools import partial
from os.path import join

import numpy as np
import open3d as o3d
import rlbench.environment as rlbench_environment
import spatialmath.base as sm
from pyrep import PyRep
from pyrep.const import RenderMode
from pyrep.errors import IKError
from pyrep.robots.arms.panda import Panda
from rlbench.environment import Environment
from rlbench.backend.const import TTT_FILE
from rlbench.backend.observation import Observation
from rlbench.backend.robot import Robot
from rlbench.backend.scene import Scene
from rlbench.backend.exceptions import InvalidActionError
from rlbench.action_modes.action_mode import MoveArmThenGripper
from rlbench.action_modes.gripper_action_modes import Discrete
from rlbench.action_modes.arm_action_modes import EndEffectorPoseViaPlanning
from rlbench.observation_config import ObservationConfig, CameraConfig
from rlbench.const import SUPPORTED_ROBOTS
from rlbench.sim2real.domain_randomization_scene import DomainRandomizationScene
from rlbench.utils import name_to_task_class
from common.pointcloud import make_pcd, merge_pcds
from common.se3 import pfp_to_pose_np, rot6d_to_quat_np
from common.task_text import choose_instruction
from .base_env import BaseEnv

rr = None


class RLBenchEnv(BaseEnv):
    """
    DT = 0.05 (50ms/20Hz)
    robot_state = [px, py, pz, r00, r10, r20, r01, r11, r21, gripper]
    The pose is the ttip frame, with x pointing backwards, y pointing left, and z pointing down.
    """

    def __init__(
        self,
        task_name: str,
        voxel_size: float,
        n_points: int,
        use_pc_color: bool,
        headless: bool,
        vis: bool,
        obs_mode: str = "pcd",
        responsive_ui: bool = True,
        log_invalid_action_errors: bool = False,
        disable_task_validation: bool = False,
    ):
        assert obs_mode in ["pcd", "rgb"], "Invalid obs_mode"
        self.task_name = task_name
        self.obs_mode = obs_mode
        self.responsive_ui = responsive_ui
        self.log_invalid_action_errors = log_invalid_action_errors
        self.disable_task_validation = bool(disable_task_validation)
        self._task_validation_disabled = False
        self._prepare_coppeliasim_env(headless=headless)
        # image_size=(128, 128)
        self.voxel_size = voxel_size
        self.n_points = n_points
        self.use_pc_color = use_pc_color
        camera_config = CameraConfig(
            rgb=True,
            depth=False,
            mask=False,
            point_cloud=self.obs_mode == "pcd",
            image_size=(128, 128),
            render_mode=RenderMode.OPENGL,
        )
        obs_config = ObservationConfig(
            left_shoulder_camera=camera_config,
            right_shoulder_camera=camera_config,
            overhead_camera=camera_config,
            wrist_camera=camera_config,
            front_camera=camera_config,
            gripper_matrix=True,
            gripper_joint_positions=True,
        )
        # EE pose is (X,Y,Z,Qx,Qy,Qz,Qw)
        action_mode = MoveArmThenGripper(
            arm_action_mode=EndEffectorPoseViaPlanning(), gripper_action_mode=Discrete()
        )
        self.env = Environment(
            action_mode,
            obs_config=obs_config,
            headless=headless,
        )
        self._launch_environment(headless=headless)
        self.task = self.env.get_task(name_to_task_class(task_name))
        if self.disable_task_validation:
            self._disable_task_validation()
        self.robot_position = self.env._robot.arm.get_position()
        self.ws_aabb = o3d.geometry.AxisAlignedBoundingBox(
            min_bound=(self.robot_position[0] + 0.1, -0.65, self.robot_position[2] - 0.05),
            max_bound=(1, 0.65, 2),
        )
        self.vis = vis
        self._rv = None
        self.last_obs = None
        self.last_descriptions: list[str] = []
        self.last_step_error: str | None = None
        if self.vis:
            global rr
            if rr is None:
                try:
                    import rerun as rr_module
                except ImportError:
                    warnings.warn(
                        "Rerun is not installed; RLBench visualization is disabled.",
                        RuntimeWarning,
                        stacklevel=2,
                    )
                    self.vis = False
                    return
                rr = rr_module
            from common.visualization import RerunViewer

            self._rv = RerunViewer
            self._rv.add_axis("vis/origin", np.eye(4), size=0.01, timeless=True)
            self._rv.add_aabb(
                "vis/ws_aabb", self.ws_aabb.get_center(), self.ws_aabb.get_extent(), timeless=True
            )
        return

    def _prepare_coppeliasim_env(self, headless: bool) -> None:
        """Ensure the Python process has the same launch env as the shell setup."""
        root = os.environ.get("COPPELIASIM_ROOT", os.path.expanduser("~/CoppeliaSim"))
        if not os.path.isdir(root):
            raise FileNotFoundError(
                f"COPPELIASIM_ROOT does not exist: {root}. "
                "Please install CoppeliaSim or export COPPELIASIM_ROOT correctly."
            )

        os.environ["COPPELIASIM_ROOT"] = root

        ld_library_path = os.environ.get("LD_LIBRARY_PATH", "")
        ld_parts = [p for p in ld_library_path.split(":") if p]
        if root not in ld_parts:
            ld_parts.insert(0, root)
            os.environ["LD_LIBRARY_PATH"] = ":".join(ld_parts)

        # RLBench's README expects this to be exported in the shell. We set it
        # here as well so GUI mode does not depend on external shell state.
        os.environ.setdefault("QT_QPA_PLATFORM_PLUGIN_PATH", root)

        if not headless:
            # Force the native X11 backend for the old bundled Qt runtime.
            os.environ.setdefault("QT_QPA_PLATFORM", "xcb")

    def _launch_environment(self, headless: bool) -> None:
        if headless:
            self.env.launch()
            return

        if self.env._pyrep is not None:
            raise RuntimeError("Already called launch!")

        # GUI mode is much more stable when PyRep keeps the UI responsive in a
        # dedicated thread. This avoids crashes when interacting with the
        # CoppeliaSim window on older RLBench/CoppeliaSim combinations.
        self.env._pyrep = PyRep()
        self.env._pyrep.launch(
            join(rlbench_environment.DIR_PATH, TTT_FILE),
            headless=False,
            responsive_ui=self.responsive_ui,
        )

        arm_class, gripper_class, _ = SUPPORTED_ROBOTS[self.env._robot_setup]
        arm_class = partial(
            arm_class,
            max_velocity=self.env._arm_max_velocity,
            max_acceleration=self.env._arm_max_acceleration,
        )

        if self.env._robot_setup != "panda":
            panda_arm = Panda()
            panda_pos = panda_arm.get_position()
            panda_arm.remove()
            arm_path = join(
                rlbench_environment.DIR_PATH,
                "robot_ttms",
                self.env._robot_setup + ".ttm",
            )
            self.env._pyrep.import_model(arm_path)
            arm, gripper = arm_class(), gripper_class()
            arm.set_position(panda_pos)
        else:
            arm, gripper = arm_class(), gripper_class()

        self.env._robot = Robot(arm, gripper)
        if self.env._randomize_every is None:
            self.env._scene = Scene(
                self.env._pyrep,
                self.env._robot,
                self.env._obs_config,
                self.env._robot_setup,
            )
        else:
            self.env._scene = DomainRandomizationScene(
                self.env._pyrep,
                self.env._robot,
                self.env._obs_config,
                self.env._robot_setup,
                self.env._randomize_every,
                self.env._frequency,
                self.env._visual_randomization_config,
                self.env._dynamics_randomization_config,
            )

        self.env._action_mode.arm_action_mode.set_control_mode(self.env._robot)

    def reset(self):
        try:
            descriptions, _ = self.task.reset()
        except RuntimeError as error:
            if not self._should_retry_reset_without_validation(error):
                raise
            self._disable_task_validation()
            descriptions, _ = self.task.reset()
        self.last_descriptions = list(descriptions or [])
        return self.last_descriptions

    def reset_rng(self):
        return

    def _disable_task_validation(self) -> None:
        if self._task_validation_disabled:
            return
        task_impl = getattr(self.task, "_task", None)
        if task_impl is None:
            return

        def _skip_validate(*_args, **_kwargs):
            return None

        task_impl.validate = types.MethodType(_skip_validate, task_impl)
        self._task_validation_disabled = True

    def _should_retry_reset_without_validation(self, error: Exception | str) -> bool:
        if self._task_validation_disabled:
            return False
        lowered = str(error).strip().lower()
        if "return value: -1" not in lowered:
            return False
        return "v-rep side" in lowered or "coppeliasim side" in lowered

    def get_task_descriptions(self) -> list[str]:
        return list(self.last_descriptions)

    def get_task_instruction(
        self,
        override_text: str | None = None,
        *,
        use_env_descriptions: bool = True,
    ) -> str:
        return choose_instruction(
            task_name=self.task_name,
            descriptions=self.last_descriptions if use_env_descriptions else None,
            override_text=override_text,
        )

    def step(self, robot_state: np.ndarray):
        self.last_step_error = None
        try:
            action = self._build_action(robot_state)
        except (FloatingPointError, ValueError, RuntimeError) as e:
            self.last_step_error = f"invalid predicted action: {e}"
            if self.log_invalid_action_errors:
                print(f"RLBench action rejected: {self.last_step_error}")
            return 0.0, True
        reward, terminate = self._step_safe(action)
        return reward, terminate

    def _build_action(self, robot_state: np.ndarray) -> np.ndarray:
        robot_state = np.asarray(robot_state, dtype=np.float32).reshape(-1)
        if robot_state.shape[0] != 10:
            raise ValueError(f"Expected robot_state with 10 values, got shape {robot_state.shape}.")

        fallback_pose = None
        if self.last_obs is not None and getattr(self.last_obs, "gripper_pose", None) is not None:
            fallback_pose = np.asarray(self.last_obs.gripper_pose, dtype=np.float32)

        ee_position = robot_state[:3]
        if not np.all(np.isfinite(ee_position)):
            if fallback_pose is None:
                raise ValueError("non-finite end-effector position without fallback pose")
            ee_position = fallback_pose[:3]

        ee_quat = rot6d_to_quat_np(robot_state[3:9])
        quat_norm = float(np.linalg.norm(ee_quat))
        if not np.all(np.isfinite(ee_quat)) or not np.isfinite(quat_norm) or quat_norm < 1e-8:
            if fallback_pose is not None:
                ee_quat = fallback_pose[3:7]
                quat_norm = float(np.linalg.norm(ee_quat))
            else:
                ee_quat = np.array([0.0, 0.0, 0.0, 1.0], dtype=np.float32)
                quat_norm = 1.0
        ee_quat = (ee_quat / quat_norm).astype(np.float32)

        gripper = np.clip(robot_state[-1:], 0.0, 1.0).astype(np.float32)
        return np.concatenate([ee_position.astype(np.float32), ee_quat, gripper]).astype(np.float32)

    def _step_safe(self, action: np.ndarray, recursion_depth=0):
        if recursion_depth > 15:
            self.last_step_error = "recursion depth limit reached"
            if self.log_invalid_action_errors:
                print("RLBench planning fallback: recursion depth limit reached.")
            return 0.0, True
        try:
            _, reward, terminate = self.task.step(action)
        except RuntimeError as e:
            self.last_step_error = f"simulator runtime error: {e}"
            if self.log_invalid_action_errors:
                print(f"RLBench simulator error: {e}")
            return 0.0, True
        except (IKError, InvalidActionError) as e:
            self.last_step_error = str(e)
            if self.log_invalid_action_errors and recursion_depth == 0:
                print(f"RLBench planning fallback: {e}")
            if self.last_obs is None or getattr(self.last_obs, "gripper_pose", None) is None:
                return 0.0, True

            last_pose = np.asarray(self.last_obs.gripper_pose, dtype=np.float32)
            if last_pose.shape[0] < 7 or not np.all(np.isfinite(last_pose[:7])):
                return 0.0, True

            cur_position = self.last_obs.gripper_pose[:3]
            des_position = action[:3]
            new_position = cur_position + (des_position - cur_position) * 0.25

            cur_quat = self.last_obs.gripper_pose[3:]
            cur_quat = np.array([cur_quat[3], cur_quat[0], cur_quat[1], cur_quat[2]])
            des_quat = action[3:7]
            des_quat = np.array([des_quat[3], des_quat[0], des_quat[1], des_quat[2]])
            try:
                new_quat = sm.qslerp(cur_quat, des_quat, 0.25, shortest=True)
            except Exception as interp_error:
                self.last_step_error = f"{self.last_step_error}; interpolation failed: {interp_error}"
                if self.log_invalid_action_errors:
                    print(f"RLBench interpolation error: {interp_error}")
                return 0.0, True
            new_quat = np.array([new_quat[1], new_quat[2], new_quat[3], new_quat[0]])

            new_action = np.concatenate([new_position, new_quat, action[-1:]])
            reward, terminate = self._step_safe(new_action, recursion_depth + 1)
        return reward, terminate

    def get_obs(self) -> tuple[np.ndarray, ...]:
        obs_rlbench = self.task.get_observation()
        self.last_obs = obs_rlbench
        robot_state = self.get_robot_state(obs_rlbench)
        if self.obs_mode == "pcd":
            pcd_o3d = self.get_pcd(obs_rlbench)
            pcd = np.asarray(pcd_o3d.points)
            if self.use_pc_color:
                pcd_color = np.asarray(pcd_o3d.colors, dtype=np.float32)
                pcd = np.concatenate([pcd, pcd_color], axis=-1)
            obs = pcd
        elif self.obs_mode == "rgb":
            obs = self.get_images(obs_rlbench)
        return robot_state, obs

    def get_robot_state(self, obs: Observation) -> np.ndarray:
        ee_position = obs.gripper_matrix[:3, 3]
        ee_rot6d = obs.gripper_matrix[:3, :2].flatten(order="F")
        gripper = np.array([obs.gripper_open])
        robot_state = np.concatenate([ee_position, ee_rot6d, gripper]).astype(np.float32)
        return robot_state

    def get_pcd(self, obs: Observation) -> o3d.geometry.PointCloud:
        right_pcd = make_pcd(obs.right_shoulder_point_cloud, obs.right_shoulder_rgb)
        left_pcd = make_pcd(obs.left_shoulder_point_cloud, obs.left_shoulder_rgb)
        overhead_pcd = make_pcd(obs.overhead_point_cloud, obs.overhead_rgb)
        front_pcd = make_pcd(obs.front_point_cloud, obs.front_rgb)
        wrist_pcd = make_pcd(obs.wrist_point_cloud, obs.wrist_rgb)
        pcd_list = [right_pcd, left_pcd, overhead_pcd, front_pcd, wrist_pcd]
        pcd = merge_pcds(self.voxel_size, self.n_points, pcd_list, self.ws_aabb)
        return pcd

    def get_images(self, obs: Observation) -> np.ndarray:
        images = np.stack(
            (
                obs.right_shoulder_rgb,
                obs.left_shoulder_rgb,
                obs.overhead_rgb,
                obs.front_rgb,
                obs.wrist_rgb,
            )
        )
        return images

    def vis_step(self, robot_state: np.ndarray, obs: np.ndarray, prediction: np.ndarray = None):
        """
        robot_state: the current robot state (10,)
        obs: either pcd or images
            - pcd: the current point cloud (N, 6) or (N, 3)
            - images: the current images (5, H, W, 3)
        prediction: the full trajectory of robot states (T, 10)
        """
        VIS_FLOW = False
        if not self.vis:
            return
        rr.set_time_seconds("time", time.time())

        # Point cloud
        if self.obs_mode == "pcd":
            pcd = obs
            pcd_xyz = pcd[:, :3]
            pcd_color = (pcd[:, 3:6] * 255).astype(np.uint8) if self.use_pc_color else None
            self._rv.add_np_pointcloud(
                "vis/pcd_obs", points=pcd_xyz, colors_uint8=pcd_color, radii=0.003
            )

        # RGB images
        elif self.obs_mode == "rgb":
            images = obs
            for i, img in enumerate(images):
                self._rv.add_rgb(f"vis/rgb_obs_{i}", img)

        # EE State
        ee_pose = pfp_to_pose_np(robot_state[np.newaxis, ...]).squeeze()
        self._rv.add_axis("vis/ee_state", ee_pose)
        rr.log("plot/gripper_state", rr.Scalar(robot_state[-1]))

        if prediction is None:
            return

        # EE predictions
        final_pred = prediction[-1]
        if VIS_FLOW:
            for traj in prediction:
                self._rv.add_traj("vis/traj_k", traj)
        else:
            self._rv.add_traj("vis/ee_pred", final_pred)

        # Gripper action prediction
        rr.log("plot/gripper_pred", rr.Scalar(final_pred[0, -1]))
        return

    def close(self):
        self.env.shutdown()
        return


if __name__ == "__main__":
    env = RLBenchEnv(
        "close_microwave",
        voxel_size=0.01,
        n_points=5500,
        use_pc_color=False,
        headless=True,
        vis=True,
    )
    env.reset()
    for i in range(1000):
        robot_state, pcd = env.get_obs()
        next_robot_state = robot_state.copy()
        next_robot_state[:3] += np.array([-0.005, 0.005, 0.0])
        env.step(next_robot_state)
    env.close()
