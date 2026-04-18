#!/usr/bin/env python3
from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class Utf8StaticHandler(SimpleHTTPRequestHandler):
    # 这些源码文件会被直接在浏览器里打开，明确加上 utf-8 避免中文被错误解码。
    UTF8_SUFFIXES = {".md", ".json", ".js", ".css", ".html", ".svg"}

    def guess_type(self, path: str) -> str:
        content_type = super().guess_type(path)
        if any(path.endswith(suffix) for suffix in self.UTF8_SUFFIXES) and "charset=" not in content_type:
            return f"{content_type}; charset=utf-8"
        return content_type


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the repo root so homepage/ and docs/ work together.")
    parser.add_argument("--bind", default="127.0.0.1", help="Bind address. Default: 127.0.0.1")
    parser.add_argument("--port", type=int, default=43429, help="Port to serve on. Default: 43429")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    homepage_root = f"http://{args.bind}:{args.port}/"
    handler = lambda *handler_args, **handler_kwargs: Utf8StaticHandler(
        *handler_args,
        directory=str(ROOT),
        **handler_kwargs,
    )
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    print(f"Serving repo root: {ROOT}")
    print(f"Homepage root URL: {homepage_root}")
    print(f"Homepage direct URL: {homepage_root}homepage/")
    print(f"Timeline URL: {homepage_root}homepage/timeline/")
    print(f"Showcase URL: {homepage_root}homepage/showcase/")
    print(f"Docs direct URL: {homepage_root}docs/")
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
