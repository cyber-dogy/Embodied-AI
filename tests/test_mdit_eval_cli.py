from __future__ import annotations

import argparse
import unittest
from unittest import mock

import _bootstrap  # noqa: F401
from mdit.cli.eval_checkpoint import _should_reexec_under_xvfb


class MDITEvalCliTest(unittest.TestCase):
    def test_should_reexec_under_xvfb_when_headless_without_display(self) -> None:
        args = argparse.Namespace(headless=True)
        with mock.patch.dict("os.environ", {}, clear=True), mock.patch(
            "mdit.cli.eval_checkpoint.shutil.which",
            return_value="/usr/bin/xvfb-run",
        ):
            self.assertTrue(_should_reexec_under_xvfb(args))

    def test_should_not_reexec_when_display_exists(self) -> None:
        args = argparse.Namespace(headless=True)
        with mock.patch.dict("os.environ", {"DISPLAY": ":99"}, clear=True), mock.patch(
            "mdit.cli.eval_checkpoint.shutil.which",
            return_value="/usr/bin/xvfb-run",
        ):
            self.assertFalse(_should_reexec_under_xvfb(args))


if __name__ == "__main__":
    unittest.main()
