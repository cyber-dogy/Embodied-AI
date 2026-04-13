from __future__ import annotations

import sys
from types import ModuleType, SimpleNamespace
import unittest
from unittest import mock

import _bootstrap  # noqa: F401
import torch
import torch.nn as nn
from mdit.config import MDITExperimentConfig
from mdit.constants import OBS_IMAGES, OBS_STATE, TASK
from mdit.train.builders import build_dataloaders, move_batch_to_device
from mdit.train.builders import build_policy


class _DummyVisionModel(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.embed_dim = 8
        self.blocks = nn.ModuleList([nn.Linear(8, 8), nn.Linear(8, 8)])
        self.norm = nn.LayerNorm(8)
        self.pretrained_cfg = {"mean": (0.1, 0.2, 0.3), "std": (0.9, 0.8, 0.7)}

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


class MDITTrainBuildersTest(unittest.TestCase):
    def test_build_dataloaders_enables_cuda_prefetch_flags(self) -> None:
        cfg = MDITExperimentConfig(device="cuda", batch_size=4, num_workers=2)
        dataset = list(range(8))

        with mock.patch("mdit.train.builders.build_dataset", return_value=dataset):
            _, _, train_loader, valid_loader = build_dataloaders(cfg)

        self.assertTrue(train_loader.pin_memory)
        self.assertTrue(valid_loader.pin_memory)
        self.assertEqual(train_loader.prefetch_factor, 2)
        self.assertEqual(valid_loader.prefetch_factor, 2)
        self.assertTrue(train_loader.persistent_workers)
        self.assertTrue(valid_loader.persistent_workers)

    def test_move_batch_to_device_uses_non_blocking_transfer(self) -> None:
        batch = {"demo": object()}

        with mock.patch("mdit.train.builders.get_device", return_value="cuda"), mock.patch(
            "mdit.train.builders.move_to_device",
            return_value=batch,
        ) as mocked_move:
            result = move_batch_to_device(batch)

        self.assertIs(result, batch)
        mocked_move.assert_called_once_with(batch, "cuda", non_blocking=True)

    def test_build_policy_supports_rgb_pdit_transformer_variant(self) -> None:
        cfg = MDITExperimentConfig(
            device="cpu",
            transformer_variant="pdit",
            train_data_path="/tmp/train.zarr",
            valid_data_path="/tmp/valid.zarr",
            camera_names=("right_shoulder", "left_shoulder", "overhead", "front", "wrist"),
            n_obs_steps=3,
            horizon=32,
            n_action_steps=8,
        )

        with mock.patch.dict(
            sys.modules,
            {
                "timm": _dummy_timm_module(),
                "transformers": _dummy_transformers_module(),
            },
        ):
            policy = build_policy(cfg, dataset_stats={})

            batch = {
                OBS_IMAGES: torch.zeros(1, 3, 5, 3, 8, 8, dtype=torch.float32),
                OBS_STATE: torch.zeros(1, 3, 10, dtype=torch.float32),
                TASK: ["demo task"],
            }
            cond_tokens = policy._encode_conditioning(batch)

        self.assertEqual(policy._transformer_variant, "pdit")
        self.assertEqual(tuple(cond_tokens.shape), (1, 19, cfg.transformer.hidden_dim))


if __name__ == "__main__":
    unittest.main()
