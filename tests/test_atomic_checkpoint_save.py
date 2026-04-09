from __future__ import annotations

import tempfile
from pathlib import Path
import unittest

import torch

import _bootstrap  # noqa: F401
from pdit.train.checkpoints import _save_payload


class AtomicCheckpointSaveTest(unittest.TestCase):
    def test_atomic_save_writes_final_file_and_cleans_tmp(self) -> None:
        with tempfile.TemporaryDirectory() as tmp_dir:
            ckpt_path = Path(tmp_dir) / "nested" / "latest.pt"
            _save_payload(ckpt_path, {"tensor": torch.tensor([1, 2, 3])})

            self.assertTrue(ckpt_path.exists())
            payload = torch.load(ckpt_path, map_location="cpu")
            self.assertEqual(payload["tensor"].tolist(), [1, 2, 3])

            leftovers = list(ckpt_path.parent.glob(f".{ckpt_path.name}.tmp.*"))
            self.assertEqual(leftovers, [])


if __name__ == "__main__":
    unittest.main()
