"""Transformer backbone for noise prediction in LeLaN policy.

Copied from mdit/model/transformer.py — DiffusionTransformer with AdaLN-Zero,
optional RoPE, and sinusoidal timestep embeddings.

The LeLaN observation encoder (FiLM + EfficientNet history + Transformer fusion)
produces the conditioning vector; this module handles action generation via
the same DiT architecture used in MDIT.
"""

import math

import torch
from torch import Tensor, nn


def modulate(x: Tensor, shift: Tensor, scale: Tensor) -> Tensor:
    return x * (1 + scale) + shift


class SinusoidalPosEmb(nn.Module):
    def __init__(self, dim: int):
        super().__init__()
        self.dim = dim

    def forward(self, x: Tensor) -> Tensor:
        device = x.device
        half_dim = self.dim // 2
        emb = math.log(10000) / (half_dim - 1)
        emb = torch.exp(torch.arange(half_dim, device=device) * -emb)
        emb = x[:, None] * emb[None, :]
        emb = torch.cat((emb.sin(), emb.cos()), dim=-1)
        return emb


class RotaryPositionalEmbedding(nn.Module):
    def __init__(self, head_dim: int, max_seq_len: int = 512, base: float = 10000.0):
        super().__init__()
        assert head_dim % 2 == 0, "head_dim must be even for RoPE"
        self.head_dim = head_dim
        self.max_seq_len = max_seq_len
        self.base = base
        inv_freq = 1.0 / (base ** (torch.arange(0, head_dim, 2).float() / head_dim))
        self.register_buffer("inv_freq", inv_freq, persistent=False)
        self._precompute_cache(max_seq_len)

    def _precompute_cache(self, seq_len: int):
        t = torch.arange(seq_len, dtype=self.inv_freq.dtype)
        freqs = torch.outer(t, self.inv_freq)
        emb = torch.cat((freqs, freqs), dim=-1)
        self.register_buffer("_cos_cached", emb.cos()[None, None, :, :], persistent=False)
        self.register_buffer("_sin_cached", emb.sin()[None, None, :, :], persistent=False)

    def _rotate_half(self, x: Tensor) -> Tensor:
        x1 = x[..., : x.shape[-1] // 2]
        x2 = x[..., x.shape[-1] // 2 :]
        return torch.cat((-x2, x1), dim=-1)

    def forward(self, q: Tensor, k: Tensor) -> tuple[Tensor, Tensor]:
        seq_len = q.shape[2]
        if seq_len > self.max_seq_len:
            raise ValueError(
                f"Sequence length {seq_len} exceeds max_seq_len {self.max_seq_len}."
            )
        cos = self._cos_cached[:, :, :seq_len, :].to(q.dtype)
        sin = self._sin_cached[:, :, :seq_len, :].to(q.dtype)
        q_rotated = (q * cos) + (self._rotate_half(q) * sin)
        k_rotated = (k * cos) + (self._rotate_half(k) * sin)
        return q_rotated, k_rotated


class RoPEAttention(nn.Module):
    def __init__(
        self,
        hidden_size: int,
        num_heads: int,
        dropout: float = 0.0,
        max_seq_len: int = 512,
        rope_base: float = 10000.0,
    ):
        super().__init__()
        assert hidden_size % num_heads == 0
        self.hidden_size = hidden_size
        self.num_heads = num_heads
        self.head_dim = hidden_size // num_heads
        self.scale = self.head_dim**-0.5
        self.qkv_proj = nn.Linear(hidden_size, 3 * hidden_size, bias=True)
        self.out_proj = nn.Linear(hidden_size, hidden_size, bias=True)
        self.dropout = nn.Dropout(dropout) if dropout > 0 else nn.Identity()
        self.rope = RotaryPositionalEmbedding(
            head_dim=self.head_dim, max_seq_len=max_seq_len, base=rope_base,
        )

    def forward(self, x: Tensor) -> Tensor:
        B, T, _ = x.shape
        qkv = self.qkv_proj(x)
        qkv = qkv.reshape(B, T, 3, self.num_heads, self.head_dim)
        qkv = qkv.permute(2, 0, 3, 1, 4)
        q, k, v = qkv[0], qkv[1], qkv[2]
        q, k = self.rope(q, k)
        attn_out = torch.nn.functional.scaled_dot_product_attention(
            q, k, v,
            dropout_p=self.dropout.p if isinstance(self.dropout, nn.Dropout) and self.training else 0.0,
        )
        attn_out = attn_out.transpose(1, 2).reshape(B, T, self.hidden_size)
        return self.out_proj(attn_out)


class TransformerBlock(nn.Module):
    """DiT-style transformer block with AdaLN-Zero."""

    def __init__(
        self,
        hidden_size: int = 128,
        num_heads: int = 4,
        num_features: int = 128,
        dropout: float = 0.0,
        use_rope: bool = False,
        max_seq_len: int = 512,
        rope_base: float = 10000.0,
    ):
        super().__init__()
        self.use_rope = use_rope
        if use_rope:
            self.attn = RoPEAttention(
                hidden_size=hidden_size, num_heads=num_heads, dropout=dropout,
                max_seq_len=max_seq_len, rope_base=rope_base,
            )
        else:
            self.attn = nn.MultiheadAttention(hidden_size, num_heads=num_heads, batch_first=True, dropout=dropout)
        self.norm1 = nn.LayerNorm(hidden_size, elementwise_affine=False, eps=1e-6)
        self.norm2 = nn.LayerNorm(hidden_size, elementwise_affine=False, eps=1e-6)
        self.mlp = nn.Sequential(
            nn.Linear(hidden_size, hidden_size * 4),
            nn.GELU(approximate="tanh"),
            nn.Linear(hidden_size * 4, hidden_size),
        )
        self.adaLN_modulation = nn.Sequential(nn.SiLU(), nn.Linear(num_features, 6 * hidden_size, bias=True))

    def forward(self, x: Tensor, features: Tensor) -> Tensor:
        shift_msa, scale_msa, gate_msa, shift_mlp, scale_mlp, gate_mlp = self.adaLN_modulation(features).chunk(6, dim=1)
        attn_input = modulate(self.norm1(x), shift_msa.unsqueeze(1), scale_msa.unsqueeze(1))
        if self.use_rope:
            attn_out = self.attn(attn_input)
        else:
            attn_out, _ = self.attn(attn_input, attn_input, attn_input)
        x = x + gate_msa.unsqueeze(1) * attn_out
        mlp_input = modulate(self.norm2(x), shift_mlp.unsqueeze(1), scale_mlp.unsqueeze(1))
        mlp_out = self.mlp(mlp_input)
        x = x + gate_mlp.unsqueeze(1) * mlp_out
        return x


class DiffusionTransformer(nn.Module):
    """Transformer-based diffusion noise prediction model."""

    def __init__(self, config, conditioning_dim: int):
        super().__init__()
        self.config = config
        self.transformer_config = config.transformer
        self.conditioning_dim = conditioning_dim
        self.action_dim = int(config.action_dim)
        self.horizon = config.horizon
        self.hidden_size = self.transformer_config.hidden_dim
        self.num_layers = self.transformer_config.num_layers
        self.num_heads = self.transformer_config.num_heads
        self.dropout = self.transformer_config.dropout
        self.timestep_embed_dim = self.transformer_config.diffusion_step_embed_dim
        self.time_mlp = nn.Sequential(
            SinusoidalPosEmb(self.timestep_embed_dim),
            nn.Linear(self.timestep_embed_dim, 2 * self.timestep_embed_dim),
            nn.GELU(),
            nn.Linear(2 * self.timestep_embed_dim, self.timestep_embed_dim),
            nn.GELU(),
        )
        self.cond_dim = self.timestep_embed_dim + conditioning_dim
        self.input_proj = nn.Linear(self.action_dim, self.hidden_size)
        self.use_rope = self.transformer_config.use_rope
        if self.transformer_config.use_positional_encoding:
            self.pos_embedding = nn.Parameter(torch.empty(1, self.horizon, self.hidden_size).normal_(std=0.02))
        else:
            self.pos_embedding = None
        self.transformer_blocks = nn.ModuleList(
            [
                TransformerBlock(
                    hidden_size=self.hidden_size,
                    num_heads=self.num_heads,
                    num_features=self.cond_dim,
                    dropout=self.dropout,
                    use_rope=self.use_rope,
                    max_seq_len=self.horizon,
                    rope_base=self.transformer_config.rope_base,
                )
                for _ in range(self.num_layers)
            ]
        )
        self.output_proj = nn.Linear(self.hidden_size, self.action_dim)
        self._initialize_weights()

    def _initialize_weights(self):
        for block in self.transformer_blocks:
            nn.init.constant_(block.adaLN_modulation[-1].weight, 0)
            nn.init.constant_(block.adaLN_modulation[-1].bias, 0)
        nn.init.constant_(self.output_proj.weight, 0)
        nn.init.constant_(self.output_proj.bias, 0)

    def forward(self, x: Tensor, timestep: Tensor, conditioning_vec: Tensor) -> Tensor:
        _, seq_len, _ = x.shape
        timestep_features = self.time_mlp(timestep)
        cond_features = torch.cat([timestep_features, conditioning_vec], dim=-1)
        hidden_seq = self.input_proj(x)
        if self.pos_embedding is not None:
            hidden_seq = hidden_seq + self.pos_embedding[:, :seq_len, :]
        for block in self.transformer_blocks:
            hidden_seq = block(hidden_seq, cond_features)
        return self.output_proj(hidden_seq)
