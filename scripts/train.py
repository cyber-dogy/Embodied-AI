#!/usr/bin/env python3

import _bootstrap  # noqa: F401

from common.line_dispatch import dispatch_line_entrypoint


if __name__ == "__main__":
    raise SystemExit(
        dispatch_line_entrypoint(
            tool_name="scripts/train.py",
            description="Dispatch to the PDIT or MDIT training CLI.",
            targets={
                "pdit": "pdit.cli.train:main",
                "mdit": "mdit.cli.train:main",
            },
        )
    )
