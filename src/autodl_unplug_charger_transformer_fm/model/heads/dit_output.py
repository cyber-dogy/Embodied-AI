from __future__ import annotations

import torch
import torch.nn as nn


class FinalLayer(nn.Module):
    def __init__(
        self,
        hidden_size: int,
        out_size: int,
        cond_dim: int,
        zero_init_output: bool = False,
    ):
        super().__init__()
        self.zero_init_output = bool(zero_init_output)
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
        for param in self.parameters():
            if param.dim() > 1:
                nn.init.xavier_uniform_(param)
        nn.init.constant_(self.adaLN_modulation[-1].weight, 0)
        nn.init.constant_(self.adaLN_modulation[-1].bias, 0)
        if self.zero_init_output:
            nn.init.constant_(self.linear.weight, 0)
            nn.init.constant_(self.linear.bias, 0)
