from __future__ import annotations

import copy
import contextlib
import math

import torch
import torch.nn as nn
import torch.nn.functional as F


def _get_activation_fn(activation: str):
    activation = str(activation).lower()
    if activation == "relu":
        return F.relu
    if activation == "gelu":
        return nn.GELU(approximate="tanh")
    if activation == "glu":
        return F.glu
    raise RuntimeError(f"activation should be relu/gelu/glu, not {activation}.")


def _with_pos_embed(tensor: torch.Tensor, pos: torch.Tensor | None = None) -> torch.Tensor:
    return tensor if pos is None else tensor + pos


class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 5000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float32).unsqueeze(1)
        div_term = torch.exp(
            torch.arange(0, d_model, 2, dtype=torch.float32) * -(math.log(10000.0) / d_model)
        )
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0).transpose(0, 1)
        self.register_buffer("pe", pe)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        pe = self.pe[: x.shape[0]]
        pe = pe.repeat((1, x.shape[1], 1))
        return pe.detach().clone()


class TimeNetwork(nn.Module):
    def __init__(self, time_dim: int, out_dim: int, learnable_w: bool = False):
        super().__init__()
        if time_dim % 2 != 0:
            raise ValueError("time_dim must be even.")
        half_dim = time_dim // 2
        w = math.log(10000.0) / max(1, half_dim - 1)
        w = torch.exp(torch.arange(half_dim, dtype=torch.float32) * -w)
        self.register_parameter("w", nn.Parameter(w, requires_grad=learnable_w))
        self.out_net = nn.Sequential(
            nn.Linear(time_dim, out_dim),
            nn.SiLU(),
            nn.Linear(out_dim, out_dim),
        )

    def forward(self, timesteps: torch.Tensor) -> torch.Tensor:
        if timesteps.ndim != 1:
            raise ValueError(f"Expected 1D timestep tensor, got {tuple(timesteps.shape)}")
        phase = timesteps[:, None] * self.w[None].to(device=timesteps.device, dtype=timesteps.dtype)
        features = torch.cat((torch.cos(phase), torch.sin(phase)), dim=1)
        return self.out_net(features)


class SelfAttnEncoder(nn.Module):
    def __init__(
        self,
        d_model: int,
        nhead: int = 8,
        dim_feedforward: int = 2048,
        dropout: float = 0.1,
        activation: str = "gelu",
    ):
        super().__init__()
        self.self_attn = nn.MultiheadAttention(d_model, nhead, dropout=dropout)
        self.linear1 = nn.Linear(d_model, dim_feedforward)
        self.linear2 = nn.Linear(dim_feedforward, d_model)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout1 = nn.Dropout(dropout)
        self.dropout2 = nn.Dropout(dropout)
        self.dropout3 = nn.Dropout(dropout)
        self.activation = _get_activation_fn(activation)

    def forward(self, src: torch.Tensor, pos: torch.Tensor) -> torch.Tensor:
        q = k = _with_pos_embed(src, pos)
        src2, _ = self.self_attn(q, k, value=src, need_weights=False)
        src = src + self.dropout1(src2)
        src = self.norm1(src)
        src2 = self.linear2(self.dropout2(self.activation(self.linear1(src))))
        src = src + self.dropout3(src2)
        src = self.norm2(src)
        return src

    def reset_parameters(self) -> None:
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)


class DiTDecoderBlock(nn.Module):
    """DiT-style decoder block with standard 6-parameter AdaLN-Zero."""

    def __init__(
        self,
        d_model: int,
        nhead: int,
        cond_dim: int,
        dim_feedforward: int = 2048,
        dropout: float = 0.1,
        activation: str = "gelu",
    ):
        super().__init__()
        self.self_attn = nn.MultiheadAttention(d_model, nhead, dropout=dropout)
        self.linear1 = nn.Linear(d_model, dim_feedforward)
        self.linear2 = nn.Linear(dim_feedforward, d_model)
        self.norm1 = nn.LayerNorm(d_model, elementwise_affine=False, eps=1e-6)
        self.norm2 = nn.LayerNorm(d_model, elementwise_affine=False, eps=1e-6)
        self.dropout1 = nn.Dropout(dropout)
        self.dropout2 = nn.Dropout(dropout)
        self.dropout3 = nn.Dropout(dropout)
        self.activation = _get_activation_fn(activation)

        self.adaLN_modulation = nn.Sequential(
            nn.SiLU(),
            nn.Linear(cond_dim, 6 * d_model, bias=True),
        )

    def forward(self, x: torch.Tensor, time_cond: torch.Tensor, cond: torch.Tensor) -> torch.Tensor:
        cond = torch.mean(cond, dim=0)
        cond = torch.cat([cond, time_cond], dim=-1)
        shift_msa, scale_msa, gate_msa, shift_mlp, scale_mlp, gate_mlp = self.adaLN_modulation(cond).chunk(6, dim=1)

        # Attention branch: norm -> modulate -> attn -> gate * output -> residual
        x2 = self.norm1(x) * (1 + scale_msa.unsqueeze(0)) + shift_msa.unsqueeze(0)
        x2, _ = self.self_attn(x2, x2, x2, need_weights=False)
        x = x + gate_msa.unsqueeze(0) * self.dropout1(x2)

        # MLP branch: norm -> modulate -> mlp -> gate * output -> residual
        x2 = self.norm2(x) * (1 + scale_mlp.unsqueeze(0)) + shift_mlp.unsqueeze(0)
        x2 = self.linear2(self.dropout2(self.activation(self.linear1(x2))))
        x = x + gate_mlp.unsqueeze(0) * self.dropout3(x2)
        return x

    def reset_parameters(self) -> None:
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)
        nn.init.constant_(self.adaLN_modulation[-1].weight, 0)
        nn.init.constant_(self.adaLN_modulation[-1].bias, 0)


class FinalLayer(nn.Module):
    def __init__(self, hidden_size: int, out_size: int, cond_dim: int):
        super().__init__()
        self.norm_final = nn.LayerNorm(hidden_size, elementwise_affine=False, eps=1e-6)
        self.linear = nn.Linear(hidden_size, out_size, bias=True)
        self.adaLN_modulation = nn.Sequential(
            nn.SiLU(),
            nn.Linear(cond_dim, 2 * hidden_size, bias=True),
        )

    def forward(self, x: torch.Tensor, cond: torch.Tensor) -> torch.Tensor:
        shift, scale = self.adaLN_modulation(cond).chunk(2, dim=1)
        x = self.norm_final(x)
        x = x * (1 + scale).unsqueeze(0) + shift.unsqueeze(0)
        x = self.linear(x)
        return x.transpose(0, 1)

    def reset_parameters(self) -> None:
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)
        nn.init.constant_(self.adaLN_modulation[-1].weight, 0)
        nn.init.constant_(self.adaLN_modulation[-1].bias, 0)


class TransformerEncoder(nn.Module):
    def __init__(self, base_module: nn.Module, num_layers: int):
        super().__init__()
        self.layers = nn.ModuleList([copy.deepcopy(base_module) for _ in range(num_layers)])
        for layer in self.layers:
            layer.reset_parameters()

    def forward(self, src: torch.Tensor, pos: torch.Tensor) -> list[torch.Tensor]:
        x = src
        outputs = []
        for layer in self.layers:
            x = layer(x, pos)
            outputs.append(x)
        return outputs


class TransformerDecoder(nn.Module):
    def __init__(self, base_module: nn.Module, num_layers: int):
        super().__init__()
        self.layers = nn.ModuleList([copy.deepcopy(base_module) for _ in range(num_layers)])
        for layer in self.layers:
            layer.reset_parameters()

    def forward(self, src: torch.Tensor, time_cond: torch.Tensor, all_conds: list[torch.Tensor]) -> torch.Tensor:
        x = src
        for layer, cond in zip(self.layers, all_conds):
            x = layer(x, time_cond, cond)
        return x


class DiTTrajectoryBackbone(nn.Module):
    def __init__(
        self,
        input_dim: int,
        output_dim: int,
        cond_dim: int,
        horizon: int,
        time_dim: int = 256,
        hidden_dim: int = 512,
        num_blocks: int = 6,
        dropout: float = 0.1,
        dim_feedforward: int = 2048,
        nhead: int = 8,
        activation: str = "gelu",
        debug_finiteness: bool = False,
    ):
        super().__init__()
        self.input_dim = int(input_dim)
        self.output_dim = int(output_dim)
        self.cond_dim = int(cond_dim)
        self.horizon = int(horizon)
        self.hidden_dim = int(hidden_dim)
        self.num_blocks = int(num_blocks)
        self.debug_finiteness = bool(debug_finiteness)

        self.enc_pos = PositionalEncoding(hidden_dim)
        self.register_parameter(
            "dec_pos",
            nn.Parameter(torch.empty(self.horizon, 1, hidden_dim), requires_grad=True),
        )
        nn.init.xavier_uniform_(self.dec_pos.data)

        self.time_net = TimeNetwork(time_dim, hidden_dim)
        self.sample_proj = nn.Sequential(
            nn.Linear(self.input_dim, self.input_dim),
            nn.GELU(approximate="tanh"),
            nn.Linear(self.input_dim, hidden_dim),
        )
        self.cond_proj = nn.Sequential(
            nn.Linear(self.cond_dim, hidden_dim),
            nn.GELU(approximate="tanh"),
            nn.Linear(hidden_dim, hidden_dim),
        )

        encoder_module = SelfAttnEncoder(
            hidden_dim,
            nhead=nhead,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
            activation=activation,
        )
        decoder_module = DiTDecoderBlock(
            hidden_dim,
            nhead=nhead,
            cond_dim=hidden_dim * 2,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
            activation=activation,
        )
        self.encoder = TransformerEncoder(encoder_module, num_blocks)
        self.decoder = TransformerDecoder(decoder_module, num_blocks)
        self.output_head = FinalLayer(hidden_dim, self.output_dim, cond_dim=hidden_dim * 2)

    def _normalize_timestep(self, sample: torch.Tensor, timestep: torch.Tensor | float | int) -> torch.Tensor:
        timesteps = timestep
        if not torch.is_tensor(timesteps):
            timesteps = torch.tensor([timesteps], dtype=torch.float32, device=sample.device)
        elif timesteps.ndim == 0:
            timesteps = timesteps[None].to(device=sample.device)
        else:
            timesteps = timesteps.to(device=sample.device)
        return timesteps.expand(sample.shape[0]).float()

    def _assert_finite(self, name: str, tensor: torch.Tensor) -> None:
        if not self.debug_finiteness:
            return
        if torch.isfinite(tensor).all():
            return
        finite_mask = torch.isfinite(tensor)
        raise FloatingPointError(
            f"Non-finite tensor detected in {name}: "
            f"shape={tuple(tensor.shape)} finite={int(finite_mask.sum().item())}/{tensor.numel()}"
        )

    def forward_enc(self, cond_tokens: torch.Tensor) -> list[torch.Tensor]:
        cond_tokens = cond_tokens.float().transpose(0, 1)
        autocast_off = (
            torch.autocast(device_type=cond_tokens.device.type, enabled=False)
            if cond_tokens.device.type in {"cuda", "cpu"}
            else contextlib.nullcontext()
        )
        with autocast_off:
            cond_tokens = self.cond_proj(cond_tokens)
        pos = self.enc_pos(cond_tokens)
        self._assert_finite("cond_tokens", cond_tokens)
        return self.encoder(cond_tokens, pos)

    def forward_dec(
        self,
        sample: torch.Tensor,
        timestep: torch.Tensor | float | int,
        enc_cache: list[torch.Tensor],
    ) -> torch.Tensor:
        sample = sample.float()
        timesteps = self._normalize_timestep(sample, timestep)
        time_enc = self.time_net(timesteps)
        sample_tokens = self.sample_proj(sample).transpose(0, 1)
        dec_in = sample_tokens + self.dec_pos
        self._assert_finite("time_enc", time_enc)
        self._assert_finite("dec_in", dec_in)
        dec_out = self.decoder(dec_in, time_enc, enc_cache)
        self._assert_finite("dec_out", dec_out)
        cond_final = torch.mean(enc_cache[-1], dim=0)
        cond_final = torch.cat([cond_final, time_enc], dim=-1)
        return self.output_head(dec_out, cond_final)

    def forward(
        self,
        sample: torch.Tensor,
        timestep: torch.Tensor | float | int,
        cond_tokens: torch.Tensor,
    ) -> torch.Tensor:
        enc_cache = self.forward_enc(cond_tokens)
        return self.forward_dec(sample, timestep, enc_cache)
