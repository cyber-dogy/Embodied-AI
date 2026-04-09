from __future__ import annotations

import math
import unittest

import torch

import _bootstrap  # noqa: F401
from pdit.data.modalities.pcd import _apply_se3_to_robot_state


class DatasetAugmentationTest(unittest.TestCase):
    def test_robot_state_transform_keeps_rot6d_translation_free(self) -> None:
        angle = math.pi / 2.0
        rot = torch.tensor(
            [
                [math.cos(angle), -math.sin(angle), 0.0],
                [math.sin(angle), math.cos(angle), 0.0],
                [0.0, 0.0, 1.0],
            ],
            dtype=torch.float32,
        )
        transform = torch.eye(4, dtype=torch.float32)
        transform[:3, :3] = rot
        transform[:3, 3] = torch.tensor([1.0, 2.0, 3.0], dtype=torch.float32)

        robot_state = torch.tensor(
            [[[1.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0]]],
            dtype=torch.float32,
        )

        augmented = _apply_se3_to_robot_state(robot_state, transform)

        expected_xyz = torch.tensor([1.0, 3.0, 3.5], dtype=torch.float32)
        expected_r1 = torch.tensor([0.0, 1.0, 0.0], dtype=torch.float32)
        expected_r2 = torch.tensor([-1.0, 0.0, 0.0], dtype=torch.float32)

        self.assertTrue(torch.allclose(augmented[0, 0, :3], expected_xyz, atol=1e-5))
        self.assertTrue(torch.allclose(augmented[0, 0, 3:6], expected_r1, atol=1e-5))
        self.assertTrue(torch.allclose(augmented[0, 0, 6:9], expected_r2, atol=1e-5))
        self.assertEqual(float(augmented[0, 0, 9]), 1.0)


if __name__ == "__main__":
    unittest.main()
