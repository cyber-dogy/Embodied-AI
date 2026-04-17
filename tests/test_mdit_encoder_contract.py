from __future__ import annotations

import types
import unittest
from unittest import mock

import torch
import torch.nn as nn

import _bootstrap  # noqa: F401
from mdit.model.encoders.clip_rgb_text_token import ClipRgbTextTokenEncoder


class _DummyVisionBackbone(nn.Module):
    def __init__(self, embed_dim: int = 32) -> None:
        super().__init__()
        self.embed_dim = embed_dim
        self.num_features = embed_dim
        self.blocks = nn.ModuleList([nn.Linear(embed_dim, embed_dim) for _ in range(4)])
        self.norm = nn.LayerNorm(embed_dim)

    def forward_features(self, x: torch.Tensor) -> torch.Tensor:
        batch = x.shape[0]
        cls = torch.ones(batch, self.embed_dim, device=x.device, dtype=x.dtype)
        return cls.unsqueeze(1)


class _DummyTokenizer:
    @classmethod
    def from_pretrained(cls, _name: str):
        return cls()

    def __call__(self, texts, padding=True, truncation=True, return_tensors="pt"):
        batch = len(texts)
        return {
            "input_ids": torch.ones(batch, 4, dtype=torch.long),
            "attention_mask": torch.ones(batch, 4, dtype=torch.long),
        }


class _DummyTextModel(nn.Module):
    def __init__(self, hidden_size: int = 24) -> None:
        super().__init__()
        self.config = types.SimpleNamespace(hidden_size=hidden_size)

    @classmethod
    def from_pretrained(cls, _name: str):
        return cls()

    def forward(self, input_ids: torch.Tensor, attention_mask: torch.Tensor):
        del attention_mask
        batch = input_ids.shape[0]
        pooled = torch.ones(batch, self.config.hidden_size, device=input_ids.device)
        return types.SimpleNamespace(pooler_output=pooled)


class MDITEncoderContractTest(unittest.TestCase):
    def test_separate_vision_branches_last_block_and_output_shape(self) -> None:
        with mock.patch(
            "mdit.model.encoders.clip_rgb_text_token.timm",
            new=types.SimpleNamespace(create_model=lambda *args, **kwargs: _DummyVisionBackbone()),
        ), mock.patch(
            "mdit.model.encoders.clip_rgb_text_token.CLIPTokenizer",
            new=_DummyTokenizer,
        ), mock.patch(
            "mdit.model.encoders.clip_rgb_text_token.CLIPTextModel",
            new=_DummyTextModel,
        ):
            encoder = ClipRgbTextTokenEncoder(
                obs_features_dim=16,
                robot_state_dim=10,
                camera_names=("right_shoulder", "left_shoulder", "overhead", "front", "wrist"),
                image_size=(32, 32),
                vision_backbone_name="dummy",
                vision_pretrained=False,
                vision_train_mode="last_block",
                vision_num_unfreeze_blocks=1,
                text_model_name="dummy",
                text_projection_dim=16,
                task_name="unplug_charger",
                task_text_override=None,
                token_fusion_mode="3_token",
            )

            self.assertEqual(len(encoder.vision_branches), 5)
            self.assertNotEqual(id(encoder.vision_branches[0]), id(encoder.vision_branches[1]))

            first_block = encoder.vision_branches[0].backbone.blocks[0]
            last_block = encoder.vision_branches[0].backbone.blocks[-1]
            self.assertTrue(all(not p.requires_grad for p in first_block.parameters()))
            self.assertTrue(any(p.requires_grad for p in last_block.parameters()))

            obs_rgb = torch.rand(2, 3, 5, 16, 16, 3)
            robot_state_obs = torch.rand(2, 3, 10)
            cond_tokens = encoder(obs_rgb, robot_state_obs, task_text=["a", "b"])
            self.assertEqual(cond_tokens.shape, (2, 3, 26))

    def test_faithful_concat_recipe_keeps_same_cond_contract(self) -> None:
        with mock.patch(
            "mdit.model.encoders.clip_rgb_text_token.timm",
            new=types.SimpleNamespace(create_model=lambda *args, **kwargs: _DummyVisionBackbone(embed_dim=20)),
        ), mock.patch(
            "mdit.model.encoders.clip_rgb_text_token.CLIPTokenizer",
            new=_DummyTokenizer,
        ), mock.patch(
            "mdit.model.encoders.clip_rgb_text_token.CLIPTextModel",
            new=_DummyTextModel,
        ):
            encoder = ClipRgbTextTokenEncoder(
                obs_features_dim=16,
                robot_state_dim=10,
                camera_names=("right_shoulder", "left_shoulder", "overhead", "front", "wrist"),
                image_size=(32, 32),
                vision_backbone_name="dummy",
                vision_pretrained=False,
                vision_train_mode="last_block",
                vision_num_unfreeze_blocks=1,
                text_model_name="dummy",
                text_projection_dim=16,
                task_name="unplug_charger",
                task_text_override=None,
                token_fusion_mode="3_token",
                fusion_recipe="faithful_concat",
            )

            obs_rgb = torch.rand(2, 3, 5, 16, 16, 3)
            robot_state_obs = torch.rand(2, 3, 10)
            cond_tokens = encoder(obs_rgb, robot_state_obs, task_text=["a", "b"])
            self.assertEqual(cond_tokens.shape, (2, 3, 26))


if __name__ == "__main__":
    unittest.main()
