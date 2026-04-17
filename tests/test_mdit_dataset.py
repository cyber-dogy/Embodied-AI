from __future__ import annotations

import unittest
from pathlib import Path

import _bootstrap  # noqa: F401

from common.task_text import choose_instruction
from mdit.config import load_config
from mdit.data.registry import build_dataset


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class MDITDatasetTest(unittest.TestCase):
    def test_rgb_text_dataset_contract(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "mdit" / "fm_autodl_lab.json")
        dataset = build_dataset(str(cfg.train_data_path), cfg)

        obs_rgb, robot_state_obs, robot_state_pred, task_text = dataset[0]

        self.assertEqual(obs_rgb.shape, (cfg.n_obs_steps, len(cfg.camera_names), 128, 128, 3))
        self.assertEqual(robot_state_obs.shape, (cfg.n_obs_steps, cfg.y_dim))
        self.assertEqual(robot_state_pred.shape, (cfg.n_pred_steps, cfg.y_dim))
        self.assertIsInstance(task_text, str)
        self.assertEqual(
            task_text,
            choose_instruction(cfg.task_name, descriptions=None, override_text=cfg.task_text_override),
        )


if __name__ == "__main__":
    unittest.main()
