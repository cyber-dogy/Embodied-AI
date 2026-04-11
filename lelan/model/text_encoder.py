"""Frozen CLIP text encoder using HuggingFace transformers.

Produces text embeddings used for:
1. FiLM conditioning (gamma/beta generation in FiLMNetwork)
2. Optional additional tokens in the fusion Transformer
"""
from __future__ import annotations

import torch
import torch.nn as nn
from torch import Tensor


class CLIPTextEncoder(nn.Module):
    """Frozen CLIP text encoder with optional learned projection.

    Uses HuggingFace CLIPTextModel for the text backbone and an optional
    linear projection to match the downstream dimension.

    Args:
        model_name: HuggingFace model name (e.g., "openai/clip-vit-base-patch32").
        projection_dim: Output dimension. If None, uses the raw CLIP hidden size.
    """

    def __init__(self, model_name: str = "openai/clip-vit-base-patch32", projection_dim: int | None = None) -> None:
        super().__init__()
        from transformers import CLIPTextModel, CLIPTokenizer

        self.tokenizer = CLIPTokenizer.from_pretrained(model_name)
        self.text_encoder = CLIPTextModel.from_pretrained(model_name)
        for param in self.text_encoder.parameters():
            param.requires_grad_(False)

        self.text_embed_dim = int(self.text_encoder.config.hidden_size)
        if projection_dim is not None and projection_dim != self.text_embed_dim:
            self.projection = nn.Linear(self.text_embed_dim, projection_dim)
        else:
            self.projection = nn.Identity()
            projection_dim = self.text_embed_dim
        self.output_dim = projection_dim

    def forward(self, text: str | list[str]) -> Tensor:
        """Encode text to feature vector.

        Args:
            text: A single string or list of strings.

        Returns:
            (B, output_dim) text features.
        """
        if isinstance(text, str):
            text = [text]
        tokenized = self.tokenizer(text, padding=True, truncation=True, return_tensors="pt")
        tokenized = {
            key: value.to(next(self.parameters()).device)
            for key, value in tokenized.items()
        }
        with torch.no_grad():
            outputs = self.text_encoder(**tokenized)
            text_features = outputs.pooler_output
        return self.projection(text_features)
