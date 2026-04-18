#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
OUTPUT_PATH = ROOT / "homepage" / "assets" / "generated-homepage-data.js"

VISIBLE_SUFFIXES = {".md", ".json", ".png", ".jpg", ".jpeg", ".webp", ".gif"}
RECENT_DOC_SUFFIXES = {".md", ".json"}
MAX_PREVIEW_CHARS = 180


def normalize_preview(text: str) -> str:
    text = text.replace(ROOT.as_posix(), "<repo>")
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = text.replace("**", "")
    text = text.replace("~~", "")
    return text


def truncate(text: str, limit: int = MAX_PREVIEW_CHARS) -> str:
    text = normalize_preview(text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def classify_doc(doc_path: Path) -> str:
    relative = doc_path.relative_to(DOCS_DIR)
    parts = relative.parts
    if relative.as_posix() == "fixes.md" or parts[:2] == ("image", "fixes"):
        return "fixes"
    if parts[0] in {"pdit", "mdit", "lelan"}:
        return parts[0]
    return "general"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def extract_markdown_title(text: str, fallback: str) -> str:
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def extract_markdown_preview(text: str) -> str:
    lines = text.splitlines()
    in_code = False
    paragraph: list[str] = []
    for raw_line in lines:
        line = raw_line.rstrip()
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        if not stripped:
            if paragraph:
                break
            continue
        if stripped.startswith("#"):
            continue
        if stripped.startswith(">"):
            stripped = stripped.lstrip(">").strip()
        if stripped.startswith("- ") or stripped.startswith("* ") or re.match(r"^\d+\.\s", stripped):
            stripped = re.sub(r"^(- |\* |\d+\.\s)", "", stripped).strip()
        paragraph.append(stripped)
        if len(" ".join(paragraph)) >= MAX_PREVIEW_CHARS:
            break
    if not paragraph:
        return "该文档目前主要由结构化标题、代码块或清单组成，适合在主页里作为源材料入口。"
    return truncate(" ".join(paragraph))


def extract_json_preview(path: Path) -> str:
    name = path.name
    if name == "top10-checkpoint-manifest.json":
        return "checkpoint 排名、canonical best、post-refactor 行为回归与归档映射。"
    if name == "baseline-regression-reference.json":
        return "baseline 回归参考与对照指标，适合作为主线 sanity check 的证据源。"
    return "结构化 JSON 产物，可作为实验清单、对照或评测证据的 source of truth。"


def build_doc_entry(path: Path) -> dict[str, object]:
    relative = path.relative_to(ROOT)
    branch = classify_doc(path)
    modified_ts = path.stat().st_mtime
    modified = datetime.fromtimestamp(modified_ts).strftime("%Y-%m-%d %H:%M")
    href = "../" + relative.as_posix()

    if path.suffix == ".md":
        text = read_text(path)
        title = extract_markdown_title(text, path.stem)
        preview = extract_markdown_preview(text)
    elif path.suffix == ".json":
        title = path.name
        preview = extract_json_preview(path)
    else:
        title = path.name
        preview = "图像证据，可在主页中作为修复现场或实验截图引用。"

    archived = "archive/legacy_notes" in relative.as_posix()
    return {
        "branch": branch,
        "title": title,
        "preview": preview,
        "href": href,
        "path": relative.as_posix(),
        "modified": modified,
        "mtime": modified_ts,
        "archived": archived,
        "suffix": path.suffix,
    }


def parse_fixes_entries(path: Path, limit: int = 6) -> list[dict[str, str]]:
    text = read_text(path)
    entries: list[dict[str, object]] = []
    heading: str | None = None
    lines: list[str] = []
    in_code = False

    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
        if not in_code and raw_line.startswith("### "):
            if heading is not None:
                entries.append({"heading": heading, "lines": lines[:]})
            heading = raw_line[4:].strip()
            lines = []
            continue
        if heading is not None:
            lines.append(raw_line.rstrip())

    if heading is not None:
        entries.append({"heading": heading, "lines": lines[:]})

    latest_entries = entries[-limit:]
    latest_entries.reverse()
    result: list[dict[str, str]] = []

    for entry in latest_entries:
        heading_text = str(entry["heading"])
        content_lines = [line.strip() for line in entry["lines"] if line.strip()]
        parts = heading_text.split(" · ")
        date = parts[0]
        title = parts[1] if len(parts) > 1 else heading_text
        trailing = parts[2] if len(parts) > 2 else ""
        scope = next((line.replace("范围：", "", 1).strip() for line in content_lines if line.startswith("范围：")), "")
        background = next((line.replace("背景：", "", 1).strip() for line in content_lines if line.startswith("背景：")), "")
        result_line = next((line.replace("结果：", "", 1).strip() for line in content_lines if line.startswith("结果：")), "")
        preview = result_line or background or scope or "fixes 最新记录。"
        result.append(
            {
                "date": date,
                "title": title,
                "run": trailing,
                "scope": truncate(scope, 120) if scope else "",
                "preview": truncate(preview, 200),
                "href": "../docs/fixes.md",
            }
        )
    return result


def main() -> None:
    all_docs = [
      build_doc_entry(path)
      for path in sorted(DOCS_DIR.rglob("*"))
      if path.is_file() and path.suffix.lower() in VISIBLE_SUFFIXES
    ]

    visible_docs = [doc for doc in all_docs if not doc["archived"]]
    recent_docs = sorted(
        [doc for doc in visible_docs if doc["suffix"] in RECENT_DOC_SUFFIXES],
        key=lambda item: float(item["mtime"]),
        reverse=True,
    )[:10]

    docs_by_branch: dict[str, list[dict[str, str]]] = defaultdict(list)
    branch_counter: Counter[str] = Counter()
    for doc in visible_docs:
        branch = str(doc["branch"])
        branch_counter[branch] += 1
        docs_by_branch[branch].append(
            {
                "title": str(doc["title"]),
                "preview": str(doc["preview"]),
                "href": str(doc["href"]),
                "modified": str(doc["modified"]),
            }
        )

    for branch, entries in docs_by_branch.items():
        entries.sort(key=lambda item: item["modified"], reverse=True)
        docs_by_branch[branch] = entries[:8]

    branch_stats = {
        branch: {
            "doc_count": branch_counter.get(branch, 0),
            "visible_recent_count": len(docs_by_branch.get(branch, [])),
        }
        for branch in sorted(set(branch_counter) | {"fixes", "pdit", "mdit", "lelan", "general"})
    }

    payload = {
        "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "repoName": ROOT.name,
        "totalVisibleDocs": len(visible_docs),
        "branchStats": branch_stats,
        "latestFixes": parse_fixes_entries(DOCS_DIR / "fixes.md"),
        "recentDocs": [
            {
                "branch": str(doc["branch"]),
                "title": str(doc["title"]),
                "preview": str(doc["preview"]),
                "href": str(doc["href"]),
                "modified": str(doc["modified"]),
            }
            for doc in recent_docs
        ],
        "docsByBranch": docs_by_branch,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        "window.homepageGeneratedData = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
