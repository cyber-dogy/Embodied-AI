from __future__ import annotations

import subprocess
import sys
import unittest
from pathlib import Path

import _bootstrap  # noqa: F401


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class MDITCliSmokeTest(unittest.TestCase):
    def _run_help(self, *args: str) -> None:
        cmd = [sys.executable, *args, "--help"]
        proc = subprocess.run(cmd, cwd=PROJECT_ROOT, capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, msg=proc.stderr)

    def test_dispatch_train_help(self) -> None:
        self._run_help("scripts/train.py", "--line", "mdit")

    def test_dispatch_eval_help(self) -> None:
        self._run_help("scripts/eval_checkpoint.py", "--line", "mdit")

    def test_dispatch_autoresearch_help(self) -> None:
        self._run_help("scripts/run_autoresearch_trial.py", "--line", "mdit")

    def test_loop_help(self) -> None:
        self._run_help("scripts/run_mdit_autoresearch_loop.py")


if __name__ == "__main__":
    unittest.main()
