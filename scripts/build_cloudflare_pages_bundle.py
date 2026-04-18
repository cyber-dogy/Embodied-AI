#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PAYLOAD_PATH = ROOT / "homepage/assets/generated-homepage-data.js"
OUTPUT_DIR = ROOT / "cloudflare-pages-site"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build a Cloudflare Pages-ready static bundle.")
    parser.add_argument("--payload", default=str(PAYLOAD_PATH), help="Path to generated-homepage-data.js")
    parser.add_argument("--output", default=str(OUTPUT_DIR), help="Output directory for Cloudflare Pages")
    return parser.parse_args()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def load_payload(path: Path) -> dict[str, Any]:
    raw = read_text(path).strip()
    prefix = "window.homepageData = "
    if not raw.startswith(prefix) or not raw.endswith(";"):
        raise ValueError(f"Unexpected homepage payload format: {path}")
    return json.loads(raw[len(prefix) : -1].strip())


def reset_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def copy_tree(src: Path, dst: Path) -> None:
    for item in src.iterdir():
        if item.name == "__pycache__":
            continue
        target = dst / item.name
        if item.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            copy_tree(item, target)
            continue
        if item.name == ".gitkeep":
            continue
        copy_file(item, target)


def copy_file(src: Path, dst: Path) -> None:
    # 发布包必须去掉外部符号链接，Cloudflare Pages 才能在云端稳定读取所有静态文件。
    dst.parent.mkdir(parents=True, exist_ok=True)
    resolved = src.resolve() if src.is_symlink() else src
    shutil.copy2(resolved, dst)


def looks_like_repo_path(value: str) -> bool:
    if not value or "://" in value:
        return False
    if value.startswith("#"):
        return False
    return not value.startswith("mailto:")


def collect_payload_paths(value: Any, collector: set[str], *, key: str | None = None) -> None:
    if isinstance(value, dict):
        for child_key, child_value in value.items():
            collect_payload_paths(child_value, collector, key=child_key)
        return
    if isinstance(value, list):
        for item in value:
            collect_payload_paths(item, collector, key=key)
        return
    if not isinstance(value, str) or not looks_like_repo_path(value):
        return
    if key not in {"path", "page_path", "docs"}:
        return
    collector.add(value.lstrip("/"))


def collect_existing_sources(payload: dict[str, Any]) -> list[Path]:
    rel_paths: set[str] = set()
    collect_payload_paths(payload, rel_paths)
    rel_paths.update(
        {
            "index.html",
            "homepage/index.html",
            "homepage/favicon.svg",
            "homepage/assets/homepage-app.js",
            "homepage/assets/homepage.css",
            "homepage/assets/generated-homepage-data.js",
        }
    )

    sources: list[Path] = []
    for rel_path in sorted(rel_paths):
        src = ROOT / rel_path
        if src.exists():
            sources.append(src)
    return sources


def write_redirect_files(output_dir: Path) -> None:
    write_text(
        output_dir / "_redirects",
        "/ /homepage/ 302\n/homepage /homepage/ 301\n",
    )
    write_text(
        output_dir / "_headers",
        """/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN

/homepage/assets/*
  Cache-Control: public, max-age=600

/homepage/media/*
  Cache-Control: public, max-age=86400
""",
    )
    write_text(output_dir / "404.html", read_text(ROOT / "index.html"))


def build_bundle(payload_path: Path, output_dir: Path) -> None:
    payload = load_payload(payload_path)
    reset_dir(output_dir)

    for src in collect_existing_sources(payload):
        rel = src.relative_to(ROOT)
        dst = output_dir / rel
        if src.is_dir():
            dst.mkdir(parents=True, exist_ok=True)
            copy_tree(src, dst)
        else:
            copy_file(src, dst)

    write_redirect_files(output_dir)


def main() -> None:
    args = parse_args()
    build_bundle(Path(args.payload), Path(args.output))
    print(f"Cloudflare Pages bundle written to {args.output}")


if __name__ == "__main__":
    main()
