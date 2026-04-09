#!/usr/bin/env python3

import _bootstrap  # noqa: F401

from common.line_dispatch import dispatch_line_entrypoint


if __name__ == "__main__":
    raise SystemExit(
        dispatch_line_entrypoint(
            tool_name="scripts/run_autoresearch_trial.py",
            description="Dispatch to the PDIT or MDIT autoresearch trial CLI.",
            targets={
                "pdit": "pdit.cli.run_autoresearch_trial:main",
                "mdit": "mdit.cli.run_autoresearch_trial:main",
            },
        )
    )
