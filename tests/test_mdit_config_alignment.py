from __future__ import annotations

import sys
import tempfile
from pathlib import Path
from types import ModuleType, SimpleNamespace
import unittest
from unittest import mock

import numpy as np
import torch
import torch.nn as nn
import zarr

import _bootstrap  # noqa: F401
from mdit.config import MDITExperimentConfig, config_from_dict, load_config
from mdit.constants import OBS_IMAGES
from mdit.data.dataset import build_dataset
from mdit.model.observation_encoder import CLIPEncoder, CLIPTextEncoder


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class _DummyVisionModel(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.embed_dim = 8
        self.blocks = nn.ModuleList([nn.Linear(8, 8), nn.Linear(8, 8)])
        self.norm = nn.LayerNorm(8)
        self.pretrained_cfg = {
            "mean": (0.1, 0.2, 0.3),
            "std": (0.9, 0.8, 0.7),
        }

    def forward_features(self, x: torch.Tensor) -> torch.Tensor:
        batch_size = int(x.shape[0])
        return torch.zeros(batch_size, 1, self.embed_dim, dtype=x.dtype, device=x.device)


class _DummyTokenizer:
    @classmethod
    def from_pretrained(cls, model_name: str):
        del model_name
        return cls()

    def __call__(self, text, padding=True, truncation=True, return_tensors="pt"):
        del padding, truncation
        batch_size = len(text)
        if return_tensors != "pt":
            raise AssertionError("This dummy tokenizer only supports return_tensors='pt'.")
        return {
            "input_ids": torch.ones(batch_size, 4, dtype=torch.long),
            "attention_mask": torch.ones(batch_size, 4, dtype=torch.long),
        }


class _DummyTextModel(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.proj = nn.Linear(4, 16)
        self.config = SimpleNamespace(hidden_size=16)

    @classmethod
    def from_pretrained(cls, model_name: str):
        del model_name
        return cls()

    def forward(self, input_ids: torch.Tensor, attention_mask: torch.Tensor):
        del attention_mask
        batch_size = int(input_ids.shape[0])
        pooled = self.proj(torch.ones(batch_size, 4, dtype=torch.float32, device=input_ids.device))
        return SimpleNamespace(pooler_output=pooled)


def _dummy_timm_module() -> ModuleType:
    module = ModuleType("timm")
    module.create_model = lambda *args, **kwargs: _DummyVisionModel()
    return module


def _dummy_transformers_module() -> ModuleType:
    module = ModuleType("transformers")
    module.CLIPTextModel = _DummyTextModel
    module.CLIPTokenizer = _DummyTokenizer
    return module


class MDITConfigAlignmentTest(unittest.TestCase):
    def test_default_vision_train_mode_is_all(self) -> None:
        cfg = MDITExperimentConfig()
        self.assertEqual(cfg.observation_encoder.vision.train_mode, "all")
        self.assertEqual(cfg.n_action_steps, 8)
        self.assertEqual(cfg.transformer_variant, "mdit")
        self.assertIsNone(cfg.objective.loss_weights)
        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.offline_eval_ckpt_every_epochs, 0)

    def test_obs3_rgb5_flowmatch_pdit_first_config_loads_expected_values(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "mdit" / "obs3_rgb5_flowmatch_pdit_first.json")

        self.assertEqual(cfg.n_obs_steps, 3)
        self.assertEqual(cfg.horizon, 32)
        self.assertEqual(cfg.n_action_steps, 1)
        self.assertEqual(
            cfg.camera_names,
            ("right_shoulder", "left_shoulder", "overhead", "front", "wrist"),
        )
        self.assertEqual(cfg.observation_encoder.vision.train_mode, "all")
        self.assertEqual(cfg.observation_encoder.vision.lr_multiplier, 0.1)
        self.assertFalse(cfg.transformer.use_rope)
        self.assertTrue(cfg.use_amp)
        self.assertTrue(cfg.wandb_enable)
        self.assertEqual(cfg.wandb_mode, "online")
        self.assertTrue(cfg.wandb_resume)
        self.assertEqual(cfg.checkpoint_payload_mode, "full")
        self.assertTrue(cfg.save_latest_ckpt)
        self.assertTrue(cfg.save_best_valid_ckpt)
        self.assertEqual(cfg.success_selection_every_epochs, 100)
        self.assertEqual(cfg.success_selection_episodes, 20)
        self.assertTrue(cfg.smooth_actions)

    def test_obs3_rgb5_sep_lastblock_a8_gate100_config_loads_expected_values(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "mdit" / "obs3_rgb5_sep_lastblock_a8_gate100.json")

        self.assertEqual(cfg.n_obs_steps, 3)
        self.assertEqual(cfg.horizon, 32)
        self.assertEqual(cfg.n_action_steps, 8)
        self.assertEqual(
            cfg.camera_names,
            ("right_shoulder", "left_shoulder", "overhead", "front", "wrist"),
        )
        self.assertTrue(cfg.observation_encoder.vision.use_separate_encoder_per_camera)
        self.assertEqual(cfg.observation_encoder.vision.train_mode, "last_block")
        self.assertEqual(tuple(cfg.observation_encoder.vision.resize_shape), (240, 240))
        self.assertTrue(cfg.enable_success_rate_eval)
        self.assertEqual(cfg.success_selection_every_epochs, 100)
        self.assertEqual(cfg.success_selection_episodes, 20)
        self.assertTrue(cfg.smooth_actions)

    def test_obs3_rgb5_pdittoken_lastblock_a8_gate100_config_loads_expected_values(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "mdit" / "obs3_rgb5_pdittoken_lastblock_a8_gate100.json")

        self.assertEqual(cfg.transformer_variant, "pdit")
        self.assertEqual(cfg.n_obs_steps, 3)
        self.assertEqual(cfg.n_action_steps, 8)
        self.assertTrue(cfg.observation_encoder.vision.use_separate_encoder_per_camera)
        self.assertEqual(cfg.observation_encoder.vision.train_mode, "last_block")
        self.assertTrue(cfg.pdit_backbone.final_layer_zero_init)
        self.assertEqual(cfg.pdit_backbone.decoder_condition_mode, "mean_pool")
        self.assertEqual(cfg.objective.loss_weights, {"xyz": 1.0, "rot6d": 1.0, "grip": 1.0})

    def test_pcd_ablation_pdit_transformer_config_maps_legacy_alias(self) -> None:
        cfg = load_config(PROJECT_ROOT / "configs" / "mdit" / "pcd_ablation_pdit_transformer.json")

        self.assertTrue(cfg.use_pcd)
        self.assertEqual(cfg.transformer_variant, "pdit")
        self.assertTrue(cfg.pdit_backbone.final_layer_zero_init)

    def test_transformer_variant_conflict_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "conflicting transformer variant fields"):
            config_from_dict(
                {
                    "train_data_path": "/tmp/train",
                    "valid_data_path": "/tmp/valid",
                    "transformer_variant": "mdit",
                    "pcd_transformer_variant": "pdit",
                }
            )

    def test_objective_loss_weights_validate_keys_and_values(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            with self.assertRaisesRegex(ValueError, "unsupported keys"):
                config_from_dict(
                    {
                        "train_data_path": tmp_dir,
                        "valid_data_path": tmp_dir,
                        "objective": {
                            "loss_weights": {"bad": 1.0},
                        },
                    }
                ).validate()

    def test_clip_alignment_keeps_vision_trainable_and_text_encoder_frozen(self) -> None:
        with mock.patch.dict(
            sys.modules,
            {
                "timm": _dummy_timm_module(),
                "transformers": _dummy_transformers_module(),
            },
        ):
            vision = CLIPEncoder(
                SimpleNamespace(
                    backbone="vit_base_patch16_clip_224.openai",
                    train_mode="all",
                )
            )
            text = CLIPTextEncoder(
                model_name="openai/clip-vit-base-patch16",
                projection_dim=32,
            )

        self.assertTrue(any(param.requires_grad for param in vision.model.parameters()))
        self.assertTrue(all(param.requires_grad for param in vision.model.parameters()))
        self.assertTrue(all(not param.requires_grad for param in text.text_encoder.parameters()))
        self.assertTrue(all(param.requires_grad for param in text.projection.parameters()))

    def test_dataset_camera_order_matches_rlbench_native_order_for_rgb5(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            root = zarr.open_group(str(tmp_dir), mode="w")
            data = root.create_group("data")
            meta = root.create_group("meta")
            images = np.zeros((1, 5, 2, 2, 3), dtype=np.uint8)
            for cam_idx, value in enumerate((11, 22, 33, 44, 55)):
                images[0, cam_idx] = value
            robot_state = np.zeros((1, 10), dtype=np.float32)
            data.create_dataset("images", data=images, shape=images.shape)
            data.create_dataset("robot_state", data=robot_state, shape=robot_state.shape)
            meta.create_dataset("episode_ends", data=np.asarray([1], dtype=np.int64), shape=(1,))

            cfg = MDITExperimentConfig(
                train_data_path=Path(tmp_dir),
                valid_data_path=Path(tmp_dir),
                camera_names=("right_shoulder", "left_shoulder", "overhead", "front", "wrist"),
                n_obs_steps=1,
                horizon=1,
            )
            dataset = build_dataset(tmp_dir, cfg)

            sample = dataset[0]

        selected_values = [int(sample[OBS_IMAGES][0, idx, 0, 0, 0]) for idx in range(5)]
        self.assertEqual(selected_values, [11, 22, 33, 44, 55])


if __name__ == "__main__":
    unittest.main()
