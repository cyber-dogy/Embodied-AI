#!/usr/bin/env python3

import _bootstrap  # noqa: F401

from common.line_dispatch import dispatch_line_entrypoint


if __name__ == "__main__":
    raise SystemExit(
        dispatch_line_entrypoint(
            tool_name="scripts/record_rollout_videos.py",
            description="Dispatch to the PDIT or MDIT rollout-video recording CLI.",
            targets={
                "pdit": "pdit.cli.record_rollout_videos:main",
                "mdit": "mdit.cli.record_rollout_videos:main",
            },
        )
    )
