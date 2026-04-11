from __future__ import annotations

import unittest
from unittest import mock

import _bootstrap  # noqa: F401
from mdit.config import MDITExperimentConfig
from mdit.train.builders import build_dataloaders, move_batch_to_device


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


if __name__ == "__main__":
    unittest.main()
