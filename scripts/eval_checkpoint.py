#!/usr/bin/env python3

import _bootstrap  # noqa: F401

from common.line_dispatch import dispatch_line_entrypoint


if __name__ == "__main__":
    raise SystemExit(
        dispatch_line_entrypoint(
            tool_name="scripts/eval_checkpoint.py",
            description="Dispatch to the PDIT or MDIT single-checkpoint evaluation CLI.",
            targets={
                "pdit": "pdit.cli.eval_checkpoint:main",
                "mdit": "mdit.cli.eval_checkpoint:main",
            },
        )
    )
