from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

import torch


TOKEN_PATTERN = re.compile(r"[a-z0-9]+|[^\w\s]")


@dataclass
class EncodedText:
    input_ids: torch.Tensor
    attention_mask: torch.Tensor


class SimpleTokenizer:
    PAD = "[PAD]"
    UNK = "[UNK]"
    CLS = "[CLS]"
    EOS = "[EOS]"

    def __init__(self, vocab: dict[str, int]) -> None:
        self.vocab = vocab
        self.id_to_token = {index: token for token, index in vocab.items()}

    @classmethod
    def build_from_texts(cls, texts: list[str], max_vocab: int = 512) -> "SimpleTokenizer":
        freqs: dict[str, int] = {}
        for text in texts:
            for token in cls._tokenize(text):
                freqs[token] = freqs.get(token, 0) + 1

        vocab = {
            cls.PAD: 0,
            cls.UNK: 1,
            cls.CLS: 2,
            cls.EOS: 3,
        }
        sorted_tokens = sorted(freqs.items(), key=lambda item: (-item[1], item[0]))
        for token, _ in sorted_tokens[: max(0, max_vocab - len(vocab))]:
            vocab[token] = len(vocab)
        return cls(vocab)

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        normalized = text.strip().lower().replace("_", " ")
        return TOKEN_PATTERN.findall(normalized)

    @property
    def vocab_size(self) -> int:
        return len(self.vocab)

    def encode(self, text: str, max_length: int) -> EncodedText:
        tokens = [self.CLS] + self._tokenize(text)[: max(0, max_length - 2)] + [self.EOS]
        ids = [self.vocab.get(token, self.vocab[self.UNK]) for token in tokens]
        pad_id = self.vocab[self.PAD]
        padding = max(0, max_length - len(ids))
        ids.extend([pad_id] * padding)
        attention_mask = [1] * len(tokens) + [0] * padding
        return EncodedText(
            input_ids=torch.tensor(ids, dtype=torch.long),
            attention_mask=torch.tensor(attention_mask, dtype=torch.long),
        )

    def save(self, path: str | Path) -> None:
        target = Path(path).expanduser().resolve()
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(self.vocab, indent=2, ensure_ascii=False))

    @classmethod
    def load(cls, path: str | Path) -> "SimpleTokenizer":
        target = Path(path).expanduser().resolve()
        return cls(json.loads(target.read_text()))

