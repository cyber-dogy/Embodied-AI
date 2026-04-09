from __future__ import annotations

import argparse
import importlib
import sys


def dispatch_line_entrypoint(
    *,
    tool_name: str,
    description: str,
    targets: dict[str, str],
) -> int:
    argv = list(sys.argv[1:])
    line_flag_present = any(arg == "--line" or arg.startswith("--line=") for arg in argv)
    help_requested = any(arg in {"-h", "--help"} for arg in argv)

    if help_requested and not line_flag_present:
        parser = argparse.ArgumentParser(prog=tool_name, description=description)
        parser.add_argument(
            "--line",
            required=True,
            choices=sorted(targets),
            help="Which implementation line to use.",
        )
        parser.epilog = (
            "Pass the remaining flags to the selected line-specific CLI.\n"
            f"Example: {tool_name} --line pdit --help"
        )
        parser.print_help()
        return 0

    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--line", required=True, choices=sorted(targets))
    args, remaining = parser.parse_known_args(argv)

    module_name, function_name = targets[args.line].split(":")
    module = importlib.import_module(module_name)
    main = getattr(module, function_name)
    sys.argv = [sys.argv[0], *remaining]
    return int(main() or 0)
