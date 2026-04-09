from __future__ import annotations

import unittest
from pathlib import Path

import _bootstrap  # noqa: F401

from config import ExperimentConfig, load_config
from data.registry import build_dataset, list_modalities
from model.registry import (
    build_backbone,
    build_obs_encoder,
    list_backbones,
    list_encoders,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class ConfigAndRegistryTest(unittest.TestCase):
    def test_modular_experiment_config_composes(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "experiment" / "fm_autodl_lab.json")
        self.assertEqual(cfg.obs_mode, "pcd")
        self.assertEqual(cfg.encoder_name, "pointnet_token")
        self.assertEqual(cfg.backbone_name, "dit")
        self.assertEqual(cfg.train_epochs, 500)

    def test_registry_builders_match_baseline(self) -> None:
        cfg = ExperimentConfig(
            train_data_path=PROJECT_ROOT / "data" / "unplug_charger" / "train",
            valid_data_path=PROJECT_ROOT / "data" / "unplug_charger" / "valid",
        )
        obs_encoder = build_obs_encoder(cfg)
        backbone = build_backbone(cfg)
        dataset = build_dataset(str(cfg.train_data_path), cfg)

        self.assertEqual(type(obs_encoder).__name__, "PointNetObsTokenEncoder")
        self.assertEqual(type(backbone).__name__, "DiTTrajectoryBackbone")
        self.assertEqual(type(dataset).__name__, "RobotDatasetPcd")

    def test_registry_lists_expose_replaceable_modules(self) -> None:
        self.assertIn("pointnet_token", list_encoders())
        self.assertIn("dummy_obs", list_encoders())
        self.assertIn("dit", list_backbones())
        self.assertIn("pcd", list_modalities())
        self.assertIn("rgb", list_modalities())

    def test_dummy_modality_and_dummy_encoder_build(self) -> None:
        cfg = ExperimentConfig(
            obs_mode="dummy",
            encoder_name="dummy_obs",
            train_data_path=PROJECT_ROOT / "data" / "unplug_charger" / "train",
            valid_data_path=PROJECT_ROOT / "data" / "unplug_charger" / "valid",
        )
        obs_encoder = build_obs_encoder(cfg)
        dataset = build_dataset(str(cfg.train_data_path), cfg)

        self.assertEqual(type(obs_encoder).__name__, "DummyObsEncoder")
        self.assertEqual(type(dataset).__name__, "DummySequenceDataset")


if __name__ == "__main__":
    unittest.main()
