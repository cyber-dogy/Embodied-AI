#!/usr/bin/env python3
from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the repo root so homepage/ and docs/ work together.")
    parser.add_argument("--bind", default="127.0.0.1", help="Bind address. Default: 127.0.0.1")
    parser.add_argument("--port", type=int, default=43429, help="Port to serve on. Default: 43429")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    handler = lambda *handler_args, **handler_kwargs: SimpleHTTPRequestHandler(
        *handler_args,
        directory=str(ROOT),
        **handler_kwargs,
    )
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    print(f"Serving repo root: {ROOT}")
    print(f"Homepage root URL: http://{args.bind}:{args.port}/")
    print(f"Homepage direct URL: http://{args.bind}:{args.port}/homepage/")
    print(f"Docs direct URL: http://{args.bind}:{args.port}/docs/")
    print("")
    print("If you insist on serving the parent MyProjects directory instead,")
    print(f"use: http://{args.bind}:{args.port}/{ROOT.name}/")
    print("")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down homepage server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
