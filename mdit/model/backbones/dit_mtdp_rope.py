from __future__ import annotations

import math

import torch
from torch import Tensor, nn
from torch.utils.checkpoint import checkpoint


def modulate(x: Tensor, shift: Tensor, scale: Tensor) -> Tensor:
    return x * (1 + scale) + shift


class SinusoidalPosEmb(nn.Module):
    def __init__(self, dim: int):
        super().__init__()
        self.dim = int(dim)

    def forward(self, x: Tensor) -> Tensor:
        device = x.device
        half_dim = self.dim // 2
        emb = math.log(10000.0) / max(1, half_dim - 1)
        emb = torch.exp(torch.arange(half_dim, device=device, dtype=x.dtype) * -emb)
        emb = x[:, None] * emb[None, :]
        return torch.cat((emb.sin(), emb.cos()), dim=-1)


class RotaryPositionalEmbedding(nn.Module):
    def __init__(self, head_dim: int, max_seq_len: int, base: float = 10000.0):
        super().__init__()
        if head_dim % 2 != 0:
            raise ValueError("head_dim must be even for RoPE")
        self.head_dim = int(head_dim)
        self.max_seq_len = int(max_seq_len)
        inv_freq = 1.0 / (float(base) ** (torch.arange(0, head_dim, 2).float() / head_dim))
        self.register_buffer("inv_freq", inv_freq, persistent=False)
        self._precompute_cache(self.max_seq_len)

    def _precompute_cache(self, seq_len: int) -> None:
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
            raise ValueError(f"Sequence length {seq_len} exceeds max_seq_len {self.max_seq_len}")
        cos = self._cos_cached[:, :, :seq_len, :].to(dtype=q.dtype, device=q.device)
        sin = self._sin_cached[:, :, :seq_len, :].to(dtype=q.dtype, device=q.device)
        return (q * cos) + (self._rotate_half(q) * sin), (k * cos) + (self._rotate_half(k) * sin)


class RoPEAttention(nn.Module):
    def __init__(
        self,
        *,
        hidden_size: int,
        num_heads: int,
        dropout: float,
        max_seq_len: int,
        rope_base: float,
    ) -> None:
        super().__init__()
        if hidden_size % num_heads != 0:
            raise ValueError("hidden_size must be divisible by num_heads")
        self.hidden_size = int(hidden_size)
        self.num_heads = int(num_heads)
        self.head_dim = self.hidden_size // self.num_heads
        self.qkv_proj = nn.Linear(self.hidden_size, 3 * self.hidden_size, bias=True)
        self.out_proj = nn.Linear(self.hidden_size, self.hidden_size, bias=True)
        self.dropout = float(dropout)
        self.rope = RotaryPositionalEmbedding(self.head_dim, max_seq_len=max_seq_len, base=rope_base)

    def forward(self, x: Tensor) -> Tensor:
        batch_size, seq_len, _ = x.shape
        qkv = self.qkv_proj(x)
        qkv = qkv.reshape(batch_size, seq_len, 3, self.num_heads, self.head_dim)
        qkv = qkv.permute(2, 0, 3, 1, 4)
        q, k, v = qkv[0], qkv[1], qkv[2]
        q, k = self.rope(q, k)
        attn_out = torch.nn.functional.scaled_dot_product_attention(
            q,
            k,
            v,
            dropout_p=self.dropout if self.training else 0.0,
        )
        attn_out = attn_out.transpose(1, 2).reshape(batch_size, seq_len, self.hidden_size)
        return self.out_proj(attn_out)


class TransformerBlock(nn.Module):
    def __init__(
        self,
        *,
        hidden_size: int,
        num_heads: int,
        cond_dim: int,
        dropout: float,
        use_rope: bool,
        max_seq_len: int,
        rope_base: float,
    ) -> None:
        super().__init__()
        self.use_rope = bool(use_rope)
        if self.use_rope:
            self.attn = RoPEAttention(
                hidden_size=hidden_size,
                num_heads=num_heads,
                dropout=dropout,
                max_seq_len=max_seq_len,
                rope_base=rope_base,
            )
        else:
            self.attn = nn.MultiheadAttention(hidden_size, num_heads, batch_first=True, dropout=dropout)
        self.norm1 = nn.LayerNorm(hidden_size, elementwise_affine=False, eps=1e-6)
        self.norm2 = nn.LayerNorm(hidden_size, elementwise_affine=False, eps=1e-6)
        self.mlp = nn.Sequential(
            nn.Linear(hidden_size, hidden_size * 4),
            nn.GELU(approximate="tanh"),
            nn.Linear(hidden_size * 4, hidden_size),
        )
        self.adaLN_modulation = nn.Sequential(
            nn.SiLU(),
            nn.Linear(cond_dim, 6 * hidden_size, bias=True),
        )
        nn.init.constant_(self.adaLN_modulation[-1].weight, 0)
        nn.init.constant_(self.adaLN_modulation[-1].bias, 0)

    def forward(self, x: Tensor, cond_features: Tensor) -> Tensor:
        shift_msa, scale_msa, gate_msa, shift_mlp, scale_mlp, gate_mlp = self.adaLN_modulation(cond_features).chunk(6, dim=1)
        attn_input = modulate(self.norm1(x), shift_msa.unsqueeze(1), scale_msa.unsqueeze(1))
        if self.use_rope:
            attn_out = self.attn(attn_input)
        else:
            attn_out, _ = self.attn(attn_input, attn_input, attn_input, need_weights=False)
        x = x + gate_msa.unsqueeze(1) * attn_out
        mlp_input = modulate(self.norm2(x), shift_mlp.unsqueeze(1), scale_mlp.unsqueeze(1))
        mlp_out = self.mlp(mlp_input)
        return x + gate_mlp.unsqueeze(1) * mlp_out


class DiTMTDPRoPEBackbone(nn.Module):
    def __init__(
        self,
        *,
        input_dim: int,
        output_dim: int,
        horizon: int,
        conditioning_dim: int,
        hidden_dim: int = 512,
        num_layers: int = 6,
        num_heads: int = 8,
        dropout: float = 0.1,
        timestep_embed_dim: int = 256,
        use_rope: bool = True,
        rope_base: float = 10000.0,
        use_positional_encoding: bool = True,
        activation_checkpointing: bool = False,
    ) -> None:
        super().__init__()
        self.input_dim = int(input_dim)
        self.output_dim = int(output_dim)
        self.horizon = int(horizon)
        self.conditioning_dim = int(conditioning_dim)
        self.hidden_dim = int(hidden_dim)
        self.num_layers = int(num_layers)
        self.num_heads = int(num_heads)
        self.dropout = float(dropout)
        self.timestep_embed_dim = int(timestep_embed_dim)
        self.use_rope = bool(use_rope)
        self.use_positional_encoding = bool(use_positional_encoding)
        self.activation_checkpointing = bool(activation_checkpointing)

        self.time_mlp = nn.Sequential(
            SinusoidalPosEmb(self.timestep_embed_dim),
            nn.Linear(self.timestep_embed_dim, 2 * self.timestep_embed_dim),
            nn.GELU(approximate="tanh"),
            nn.Linear(2 * self.timestep_embed_dim, self.timestep_embed_dim),
            nn.GELU(approximate="tanh"),
        )
        self.cond_dim = self.timestep_embed_dim + self.conditioning_dim
        self.input_proj = nn.Linear(self.input_dim, self.hidden_dim)
        if self.use_positional_encoding:
            self.pos_embedding = nn.Parameter(
                torch.empty(1, self.horizon, self.hidden_dim).normal_(std=0.02)
            )
        else:
            self.pos_embedding = None
        self.transformer_blocks = nn.ModuleList(
            [
                TransformerBlock(
                    hidden_size=self.hidden_dim,
                    num_heads=self.num_heads,
                    cond_dim=self.cond_dim,
                    dropout=self.dropout,
                    use_rope=self.use_rope,
                    max_seq_len=self.horizon,
                    rope_base=float(rope_base),
                )
                for _ in range(self.num_layers)
            ]
        )
        self.output_proj = nn.Linear(self.hidden_dim, self.output_dim)

    def _forward_block(self, block: TransformerBlock, x: Tensor, cond_features: Tensor) -> Tensor:
        if not self.activation_checkpointing or not self.training:
            return block(x, cond_features)
        # 这里用激活检查点只换算力不换语义，专门给 12G 档压峰值显存。
        return checkpoint(block, x, cond_features, use_reentrant=False)

    def forward(self, x: Tensor, timestep: Tensor, conditioning_vec: Tensor) -> Tensor:
        if conditioning_vec.ndim != 2:
            raise ValueError(
                "Expected conditioning_vec with shape (B, conditioning_dim), "
                f"got {tuple(conditioning_vec.shape)}"
            )
        seq_len = x.shape[1]
        timestep_features = self.time_mlp(timestep.float())
        cond_features = torch.cat([timestep_features, conditioning_vec], dim=-1)
        hidden_seq = self.input_proj(x)
        if self.pos_embedding is not None:
            hidden_seq = hidden_seq + self.pos_embedding[:, :seq_len, :]
        for block in self.transformer_blocks:
            hidden_seq = self._forward_block(block, hidden_seq, cond_features)
        return self.output_proj(hidden_seq)
