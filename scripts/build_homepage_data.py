#!/usr/bin/env python3
from __future__ import annotations

import argparse
import copy
import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "homepage/config/site-config.json"
OVERRIDES_PATH = ROOT / "homepage/config/manual_overrides.json"
OUTPUT_PATH = ROOT / "homepage/assets/generated-homepage-data.js"

LINE_COLORS = {
    "teal": "#2b766f",
    "rust": "#b2573f",
    "gold": "#a27a32",
    "blue": "#3e7cb1",
    "coral": "#d4684c",
    "olive": "#6b8f3e",
}
MEDIA_EXTENSIONS = {
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".gif": "image",
    ".webp": "image",
    ".svg": "image",
    ".mp4": "video",
    ".webm": "video",
}
STATUS_GROUP = {
    "已完成": "done",
    "已验证": "done",
    "已固化": "done",
    "稳定锚点": "done",
    "推进中": "in_progress",
    "待结果": "in_progress",
    "铺设中": "in_progress",
    "长期维护": "in_progress",
}
RESEARCH_DESK_LINE_TO_TASK = {
    "PDIT 主线": "pdit-anchor",
    "MDIT 主线": "mdit-mainline",
    "MDIT 对照线": "mdit-mainline",
    "LeLaN 执行线": "lelan-pipeline",
    "基础设施": "infra-audit",
    "文档治理": "infra-audit",
}
TASK_TO_PRIMARY_RESEARCH_DESK_LINE = {
    "pdit-anchor": "PDIT 主线",
    "mdit-mainline": "MDIT 主线",
    "lelan-pipeline": "LeLaN 执行线",
    "infra-audit": "基础设施",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build the static homepage payload.")
    parser.add_argument("--config", default=str(CONFIG_PATH), help="Path to homepage site-config.json")
    parser.add_argument("--overrides", default=str(OVERRIDES_PATH), help="Path to manual_overrides.json")
    parser.add_argument("--output", default=str(OUTPUT_PATH), help="Path to generated JS payload")
    return parser.parse_args()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(read_text(path))


def read_json_if_exists(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return read_json(path)


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def strip_private_override_keys(value: Any) -> Any:
    if isinstance(value, dict):
        return {
            key: strip_private_override_keys(item)
            for key, item in value.items()
            if not str(key).startswith("_")
        }
    if isinstance(value, list):
        return [strip_private_override_keys(item) for item in value]
    return value


def deep_merge(base: Any, override: Any) -> Any:
    # 覆写规则尽量简单：字典递归合并，数组整段替换，避免人工维护时出现“半覆盖”歧义。
    if override is None:
        return copy.deepcopy(base)
    if isinstance(base, dict) and isinstance(override, dict):
        merged = {key: copy.deepcopy(value) for key, value in base.items()}
        for key, value in override.items():
            if key in merged:
                merged[key] = deep_merge(merged[key], value)
            else:
                merged[key] = copy.deepcopy(value)
        return merged
    return copy.deepcopy(override)


def repo_rel(path_like: str | Path | None) -> str | None:
    if not path_like:
        return None
    path = Path(path_like)
    if path.is_absolute():
        try:
            return path.relative_to(ROOT).as_posix()
        except ValueError:
            return path.as_posix()
    return path.as_posix()


def clean_text(text: str) -> str:
    text = text.replace(str(ROOT), "")
    text = text.replace("\u00a0", " ")
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", text)
    text = re.sub(r"/home/\S+", lambda match: Path(match.group(0)).name, text)
    text = re.sub(r"^\s*[-*]\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def safe_excerpt(text: str, *, limit: int = 160) -> str:
    text = clean_text(text)
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def first_sentence(text: str, *, limit: int = 120) -> str:
    text = clean_text(text)
    if not text:
        return ""
    matched = re.search(r"(.+?[。！？；])", text)
    sentence = matched.group(1) if matched else text
    return safe_excerpt(sentence, limit=limit)


def first_sentences(text: str, *, count: int = 2, limit: int = 220) -> str:
    text = clean_text(text)
    if not text:
        return ""
    parts = [item.strip() for item in re.split(r"(?<=[。！？；])", text) if item.strip()]
    if not parts:
        return safe_excerpt(text, limit=limit)
    return safe_excerpt("".join(parts[:count]), limit=limit)


def format_ratio(value: float | int | None, digits: int = 2) -> str:
    if value is None:
        return "-"
    return f"{float(value):.{digits}f}"


def format_number(value: float | int | None, digits: int = 3) -> str:
    if value is None:
        return "-"
    return f"{float(value):.{digits}f}"


def parse_first_float(text: str) -> float | None:
    matched = re.search(r"-?\d+(?:\.\d+)?", str(text))
    if not matched:
        return None
    return float(matched.group(0))


def status_group(status: str) -> str:
    return STATUS_GROUP.get(status, "in_progress")


def make_metric(label: str, value: Any) -> dict[str, str]:
    return {"label": label, "value": str(value)}


def make_link(title: str, path: str | Path | None, summary: str = "", label: str = "查看原始记录") -> dict[str, str]:
    return {
        "title": title,
        "path": repo_rel(path) or "",
        "summary": summary,
        "label": label,
    }


def make_chart_point(x: float | int, y: float | int, label: str) -> dict[str, Any]:
    return {"x": x, "y": y, "label": label}


def sorted_success_points(mapping: dict[str, Any] | None) -> list[dict[str, Any]]:
    if not mapping:
        return []
    points: list[tuple[int, float]] = []
    for raw_epoch, raw_value in mapping.items():
        try:
            epoch = int(raw_epoch)
            value = float(raw_value)
        except (TypeError, ValueError):
            continue
        points.append((epoch, value))
    points.sort(key=lambda item: item[0])
    return [make_chart_point(epoch, value, f"epoch {epoch}") for epoch, value in points]


def parse_markdown_sections(text: str) -> list[dict[str, Any]]:
    matches = list(re.finditer(r"^(#{1,6})\s+(.+?)\s*$", text, flags=re.MULTILINE))
    if not matches:
        return []
    sections: list[dict[str, Any]] = []
    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        sections.append(
            {
                "level": len(match.group(1)),
                "title": clean_text(match.group(2)),
                "body": text[start:end].strip(),
            }
        )
    return sections


def section_body(sections: list[dict[str, Any]], title: str) -> str:
    for section in sections:
        if section["title"] == title:
            return section["body"]
    return ""


def bullet_lines(text: str) -> list[str]:
    lines = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("```"):
            continue
        if line.startswith("- ") or line.startswith("* "):
            lines.append(clean_text(line))
    return lines


def parse_bullet_fields(text: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    for raw_line in text.splitlines():
        line = raw_line.strip()
        matched = re.match(r"^-\s+([^:]+):\s*(.*)$", line)
        if not matched:
            continue
        fields[clean_text(matched.group(1))] = clean_text(matched.group(2))
    return fields


def parse_labeled_fields(text: str, labels: list[str]) -> dict[str, str]:
    if not labels:
        return {}
    pattern = re.compile(rf"^({'|'.join(re.escape(label) for label in labels)})：\s*", re.MULTILINE)
    matches = list(pattern.finditer(text))
    fields: dict[str, str] = {}
    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        fields[match.group(1)] = text[start:end].strip()
    return fields


def extract_markdown_links(text: str) -> list[dict[str, str]]:
    links: list[dict[str, str]] = []
    for matched in re.finditer(r"\[([^\]]+)\]\(([^)]+)\)", text):
        rel_path = repo_rel(matched.group(2))
        if not rel_path:
            continue
        links.append({"title": clean_text(matched.group(1)), "path": rel_path})
    return links


def humanize_file_name(path: str | Path) -> str:
    stem = Path(path).stem
    stem = re.sub(r"^\d{4}-\d{2}-\d{2}[-_]*", "", stem)
    stem = stem.replace("_", " ").replace("-", " ")
    stem = re.sub(r"\s+", " ", stem).strip()
    return stem or Path(path).name


def is_raw_title(title: str) -> bool:
    title = title.strip()
    return (
        "__" in title
        or bool(re.fullmatch(r"[a-z0-9_]+", title)) and len(title) > 24
        or ("/" in title and not any("\u4e00" <= char <= "\u9fff" for char in title))
        or ".py" in title
        or ".md" in title
    )


def prettify_fix_title(title: str) -> str:
    parts = [clean_text(part) for part in title.split(" · ")]
    if len(parts) > 1 and is_raw_title(parts[-1]) and not is_raw_title(parts[0]):
        return parts[0]
    if is_raw_title(title):
        return ""
    return clean_text(title)


def media_caption_from_name(path: Path) -> str:
    base = humanize_file_name(path)
    return f"{base} 的现场素材。"


def infer_media_caption(task_title: str, file_path: Path) -> str:
    title = humanize_file_name(file_path)
    lowered = file_path.stem.lower()
    if "数字孪生" in title:
        return f"展示 {task_title} 的真机-仿真数字孪生同步效果：{title}。"
    if "规划轨迹执行" in title:
        return f"展示 {task_title} 的规划轨迹如何从预览落到真实执行：{title}。"
    if "仿真运动规划" in title or "mojoco仿真运动规划" in title.lower():
        return f"展示 {task_title} 中 MuJoCo 侧的运动规划与预览过程：{title}。"
    if "示教" in title:
        return f"展示 {task_title} 的示教或回放现场：{title}。"
    if "rollout" in lowered or "demo" in lowered:
        return f"展示 {task_title} 的 rollout / demo 片段：{title}。"
    if "success" in lowered or "pass" in lowered:
        return f"记录 {task_title} 的成功行为片段：{title}。"
    if "fail" in lowered or "error" in lowered:
        return f"记录 {task_title} 的失败或异常现象：{title}。"
    if "loss" in lowered or "curve" in lowered or "chart" in lowered:
        return f"展示 {task_title} 的训练或评估曲线素材：{title}。"
    if "audit" in lowered or "eval" in lowered:
        return f"补充 {task_title} 的评估 / 审计现场：{title}。"
    return f"展示 {task_title} 的现场素材：{title}。"


def build_media_items(task_id: str, task_title: str, entries: list[dict[str, Any]] | None = None) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    media_root = ROOT / "homepage/media/tasks" / task_id
    captions_path = media_root / "captions.json"
    caption_overrides: dict[str, dict[str, str]] = {}
    if captions_path.exists():
        caption_overrides = read_json(captions_path)

    for file_path in sorted(media_root.rglob("*")):
        if not file_path.is_file() or file_path.name.startswith(".") or file_path.name == "captions.json":
            continue
        kind = MEDIA_EXTENSIONS.get(file_path.suffix.lower())
        if not kind:
            continue
        rel_inside_task = file_path.relative_to(media_root).as_posix()
        overrides = caption_overrides.get(rel_inside_task) or caption_overrides.get(file_path.name) or {}
        items.append(
            {
                "task_id": task_id,
                "kind": kind,
                "title": overrides.get("title", humanize_file_name(file_path)),
                "caption": overrides.get("caption", infer_media_caption(task_title, file_path)),
                "path": repo_rel(file_path) or "",
                "showcase_preview": bool(overrides.get("showcase", False)),
            }
        )
    for entry in entries or []:
        rel_path = repo_rel(entry.get("path"))
        if not rel_path:
            continue
        kind = MEDIA_EXTENSIONS.get(Path(rel_path).suffix.lower(), "image")
        items.append(
            {
                "task_id": task_id,
                "kind": kind,
                "title": entry.get("title", humanize_file_name(rel_path)),
                "caption": entry.get("caption", infer_media_caption(task_title, Path(rel_path))),
                "path": rel_path,
                "showcase_preview": bool(entry.get("showcase", False)),
            }
        )
    return items


def doc_count_under(path: Path) -> int:
    if not path.exists():
        return 0
    return sum(1 for file_path in path.rglob("*") if file_path.suffix.lower() in {".md", ".json"} and file_path.is_file())


def file_date_label(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime).astimezone().strftime("%Y-%m-%d")


def file_time_label(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime).astimezone().strftime("%H:%M")


def parse_fix_entries(limit: int = 4) -> list[dict[str, str]]:
    fix_path = ROOT / "docs/fixes.md"
    text = read_text(fix_path)
    pattern = re.compile(r"^###\s+(.+)$", re.MULTILINE)
    matches = list(pattern.finditer(text))
    entries: list[dict[str, str]] = []
    for index, match in enumerate(matches):
        heading = match.group(1).strip()
        heading_parts = heading.split(" · ")
        if not heading_parts:
            continue
        timestamp = heading_parts[0]
        date = timestamp.split()[0]
        title = prettify_fix_title(" · ".join(heading_parts[1:]))
        if not title or title.startswith("`"):
            continue
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        body = text[start:end]
        background = re.search(r"\*\*背景\*\*：(.+)", body)
        result = re.search(r"\*\*结果\*\*：(.+)", body)
        summary_parts = []
        if background:
            summary_parts.append(background.group(1))
        if result:
            summary_parts.append(result.group(1))
        summary = safe_excerpt(" ".join(summary_parts) or body, limit=150)
        entries.append(
            {
                "date": date,
                "title": title,
                "summary": summary,
                "path": repo_rel(fix_path) or "docs/fixes.md",
                "_sort_key": timestamp,
            }
        )
    entries.sort(key=lambda item: item["_sort_key"], reverse=True)
    return [{key: value for key, value in entry.items() if key != "_sort_key"} for entry in entries[:limit]]


def parse_research_desk_entries() -> list[dict[str, Any]]:
    desk_path = ROOT / "docs/research_desk.md"
    if not desk_path.exists():
        return []
    text = read_text(desk_path)
    pattern = re.compile(r"^##\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{4}) - (.+?) - (.+)$", re.MULTILINE)
    matches = list(pattern.finditer(text))
    entries: list[dict[str, Any]] = []
    labels = ["发现问题", "原因分析", "解决思路", "具体操作", "当前判断", "相关材料"]
    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        body = text[start:end].strip()
        line_name = clean_text(match.group(2))
        task_id = RESEARCH_DESK_LINE_TO_TASK.get(line_name)
        if not task_id:
            continue
        fields = parse_labeled_fields(body, labels)
        entries.append(
            {
                "date": match.group(1).split()[0],
                "timestamp": match.group(1),
                "line_name": line_name,
                "title": clean_text(match.group(3)),
                "task_id": task_id,
                "finding": clean_text(fields.get("发现问题", "")),
                "cause": clean_text(fields.get("原因分析", "")),
                "solution": clean_text(fields.get("解决思路", "")),
                "operation": clean_text(fields.get("具体操作", "")),
                "judgment": clean_text(fields.get("当前判断", "")),
                "links": extract_markdown_links(fields.get("相关材料", ""))[:3],
            }
        )
    entries.sort(key=lambda item: item["timestamp"], reverse=True)
    return entries


def parse_research_desk_overview_map() -> dict[str, str]:
    desk_path = ROOT / "docs/research_desk.md"
    if not desk_path.exists():
        return {}
    text = read_text(desk_path)
    matched = re.search(r"^##\s+当前总览\s*$", text, flags=re.MULTILINE)
    if not matched:
        return {}
    overview_text = text[matched.end() :]
    next_section = re.search(r"^##\s+", overview_text, flags=re.MULTILINE)
    if next_section:
        overview_text = overview_text[: next_section.start()]

    sections = parse_markdown_sections(overview_text)
    overview_map: dict[str, str] = {}
    for section in sections:
        if section["level"] != 3:
            continue
        # research_desk 是总结源，但公开页不直接照抄整段，
        # 默认只取前两句，保证首页和任务页更像“判断摘要”而不是“文档搬运”。
        summary = first_sentences(section["body"], count=2, limit=220)
        if summary:
            overview_map[section["title"]] = summary
    return overview_map


def build_research_desk_timeline_card(entry: dict[str, Any]) -> dict[str, Any]:
    summary_text = first_sentence(
        " ".join(part for part in [entry.get("finding", ""), entry.get("solution", "")] if part) or entry.get("judgment", ""),
        limit=110,
    )
    card = {
        "badge": entry["line_name"],
        "title": entry["title"],
        "summary": summary_text,
        "date_key": entry["date"],
        "metrics": [
            make_metric("线路", entry["line_name"]),
            make_metric("日期", entry["date"]),
            make_metric("来源", "research desk"),
        ],
        "outcome": first_sentence(entry.get("judgment", ""), limit=120),
        "links": [card_link(link["title"], link["path"]) for link in entry.get("links", [])],
    }
    if entry.get("task_id"):
        card["task_id"] = entry["task_id"]
    return card


def build_research_desk_home_entry(entry: dict[str, Any], task: dict[str, Any]) -> dict[str, Any]:
    summary = first_sentence(
        entry.get("judgment", "")
        or entry.get("solution", "")
        or entry.get("finding", ""),
        limit=105,
    )
    return {
        "date": entry["date"],
        "group": task["status_group"],
        "task_id": task["id"],
        "branch_ids": task["branch_ids"],
        "badge": entry["line_name"],
        "title": entry["title"],
        "summary": summary,
        "metrics": task.get("hero_metrics", [])[:3],
        "meta": "阶段总结 · Research Desk",
        "path": task["page_path"],
    }


def merge_task_timeline_with_research_desk(task: dict[str, Any], research_desk_entries: list[dict[str, Any]]) -> dict[str, Any]:
    if task["id"] == "infra-audit":
        return task
    task_entries = [entry for entry in research_desk_entries if entry["task_id"] == task["id"]]
    if not task_entries:
        return task

    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for entry in task_entries:
        grouped[entry["date"]].append(build_research_desk_timeline_card(entry))
    for group in task.get("timeline_groups", []):
        for card in group["cards"]:
            grouped[group["date"]].append(card)

    merged_timeline = []
    for date in sorted(grouped.keys(), reverse=True):
        merged_timeline.append({"date": date, "cards": grouped[date]})
    task["timeline_groups"] = merged_timeline
    latest_dates = [task.get("latest_update", "")] + [entry["date"] for entry in task_entries]
    task["latest_update"] = max(date for date in latest_dates if date)
    return task


def apply_research_desk_overview(task: dict[str, Any], overview_map: dict[str, str]) -> dict[str, Any]:
    line_name = TASK_TO_PRIMARY_RESEARCH_DESK_LINE.get(task["id"])
    if not line_name:
        return task
    overview = overview_map.get(line_name)
    if not overview:
        return task
    task["summary"] = overview
    if task["id"] in {"pdit-anchor", "mdit-mainline", "lelan-pipeline", "infra-audit"}:
        task["report_intro"] = overview
    return task


def apply_research_desk_overview_to_branch(branch: dict[str, Any], overview_map: dict[str, str]) -> dict[str, Any]:
    line_name = None
    for task_id in branch.get("related_task_ids", []):
        if task_id in TASK_TO_PRIMARY_RESEARCH_DESK_LINE:
            line_name = TASK_TO_PRIMARY_RESEARCH_DESK_LINE[task_id]
            break
    if not line_name:
        return branch
    overview = overview_map.get(line_name)
    if overview:
        branch["summary"] = overview
    return branch


def parse_mdit_journal_events(text: str) -> list[dict[str, Any]]:
    pattern = re.compile(r"^##\s+(\d{4}-\d{2}-\d{2})T[^\n]*? · ([^·\n]+) · (.+)$", re.MULTILINE)
    matches = list(pattern.finditer(text))
    events: list[dict[str, Any]] = []
    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = text[start:end].strip()
        fields = parse_bullet_fields(block)
        events.append(
            {
                "date": match.group(1),
                "phase": clean_text(match.group(2)),
                "slug": clean_text(match.group(3)),
                "fields": fields,
                "body": clean_text(block),
            }
        )
    return events


def parse_best_path(path: Path) -> dict[str, str]:
    return parse_bullet_fields(read_text(path))


def collect_wandb_history(run_url: str | None) -> dict[str, dict[int, float]]:
    if not run_url:
        return {}
    try:
        import wandb  # type: ignore
    except ModuleNotFoundError:
        return {}

    parsed = urlparse(run_url)
    parts = [part for part in parsed.path.split("/") if part]
    if len(parts) < 4 or parts[-2] != "runs":
        return {}
    # W&B Public API 需要的是 entity/project/run_id，而不是 URL 里的 entity/project/runs。
    run_path = "/".join([parts[0], parts[1], parts[-1]])

    try:
        api = wandb.Api(timeout=30)
        run = api.run(run_path)
        rows = run.scan_history(
            keys=[
                "epoch",
                "_step",
                "train/loss_total",
                "valid/loss_total",
                "valid/mse_xyz",
                "valid/mse_rot6d",
                "valid/mse_grip",
            ]
        )
    except Exception:
        return {}

    by_epoch: dict[int, dict[str, float]] = {}
    for row in rows:
        epoch_value = row.get("epoch")
        if epoch_value is None:
            continue
        try:
            epoch = int(epoch_value)
        except (TypeError, ValueError):
            continue
        by_epoch[epoch] = row

    metrics = {
        "train/loss_total": {},
        "valid/loss_total": {},
        "valid/mse_xyz": {},
        "valid/mse_rot6d": {},
        "valid/mse_grip": {},
    }
    for epoch, row in sorted(by_epoch.items()):
        for key in metrics:
            value = row.get(key)
            if value is None:
                continue
            try:
                metrics[key][epoch] = float(value)
            except (TypeError, ValueError):
                continue
    return metrics


def build_line_chart(
    chart_id: str,
    *,
    title: str,
    description: str,
    series: list[dict[str, Any]],
    fmt: str = "float",
    note: str = "",
) -> dict[str, Any]:
    return {
        "id": chart_id,
        "type": "line",
        "title": title,
        "description": description,
        "format": fmt,
        "note": note,
        "series": series,
    }


def build_bar_chart(
    chart_id: str,
    *,
    title: str,
    description: str,
    categories: list[str],
    values: list[float],
    color: str,
    fmt: str = "float",
    note: str = "",
) -> dict[str, Any]:
    return {
        "id": chart_id,
        "type": "bar",
        "title": title,
        "description": description,
        "format": fmt,
        "note": note,
        "categories": categories,
        "series": [{"name": title, "values": values, "color": color}],
    }


def build_grouped_bar_chart(
    chart_id: str,
    *,
    title: str,
    description: str,
    categories: list[str],
    series: list[dict[str, Any]],
    fmt: str = "float",
    note: str = "",
) -> dict[str, Any]:
    return {
        "id": chart_id,
        "type": "grouped_bar",
        "title": title,
        "description": description,
        "format": fmt,
        "note": note,
        "categories": categories,
        "series": series,
    }


def build_rank_bar_chart(
    chart_id: str,
    *,
    title: str,
    description: str,
    rows: list[dict[str, Any]],
    fmt: str = "float",
    note: str = "",
) -> dict[str, Any]:
    return {
        "id": chart_id,
        "type": "rank_bar",
        "title": title,
        "description": description,
        "format": fmt,
        "note": note,
        "rows": rows,
    }


def build_compare_cards(chart_id: str, *, title: str, description: str, cards: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "id": chart_id,
        "type": "compare_cards",
        "title": title,
        "description": description,
        "cards": cards,
    }


def card_link(title: str, path: str | Path) -> dict[str, str]:
    return {"title": title, "path": repo_rel(path) or ""}


def build_branch_card_copy(branch_id: str, branch_title: str, related_tasks: list[dict[str, Any]]) -> dict[str, str]:
    # 首页研究线入口强调“这是什么线、正在做什么、当前成果是什么”，
    # 不直接复用 branch.summary 这种更适合详情页的长段落。
    if branch_id == "pdit":
        return {
            "title": branch_title,
            "summary": "围绕点云 DiT 主线，把训练、保存和离线审计修回到可复核的行为锚点。",
            "result": "当前成果：best success 0.95@20，100 回合复核 0.85。",
        }
    if branch_id == "mdit":
        return {
            "title": branch_title,
            "summary": "围绕 RGB+文本主线、对照出清和 100→500 续训接管，收束成同一条可审计的多模态主线。",
            "result": "当前成果：共享审计已经从 0.55@100 抬到 0.75@300/500。",
        }
    if branch_id == "lelan":
        return {
            "title": branch_title,
            "summary": "围绕 LeLaN 的训练、评估、选模和审计流程，先把自动研究执行链路固化下来。",
            "result": "当前成果：100 / 300 / 500 gate 已定版，等待正式 run 结果。",
        }
    if branch_id == "robot-platform":
        return {
            "title": branch_title,
            "summary": "围绕 Sim2Real 映射、示教轨迹和 FK/IK 控制，搭起可复用的六轴臂采集平台。",
            "result": "当前成果：平台已固化，可直接承接具身学习数据采集。",
        }

    lead_task = related_tasks[0]
    return {
        "title": branch_title,
        "summary": first_sentence(lead_task.get("summary", ""), limit=100),
        "result": first_sentence(lead_task.get("summary_cards", [{}])[0].get("title", ""), limit=96),
    }


def build_pdit_task(task_cfg: dict[str, Any], charts: dict[str, Any], media_items: list[dict[str, str]]) -> dict[str, Any]:
    doc_path = ROOT / task_cfg["featured_paths"][0]
    audit_path = ROOT / task_cfg["artifact_paths"]["audit"]
    summary_path = ROOT / task_cfg["artifact_paths"]["summary"]
    manifest_path = ROOT / task_cfg["artifact_paths"]["manifest"]
    training_audit_path = ROOT / task_cfg["featured_paths"][1]
    recheck20_path = ROOT / "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_20.json"
    recheck100_path = ROOT / "ckpt/unplug_charger_transformer_fm_obs3_dit_v1_retrain_noamp_v1__baseline_500__e0500__20260408_011741/root_layout_recheck_100.json"
    regression_path = ROOT / "docs/baseline-regression-reference.json"

    doc_text = read_text(doc_path)
    doc_sections = parse_markdown_sections(doc_text)
    audit = read_json(audit_path)
    summary = read_json(summary_path)
    manifest = read_json(manifest_path)
    recheck20 = read_json(recheck20_path)
    recheck100 = read_json(recheck100_path)

    success_points = sorted_success_points(audit.get("success_by_epoch"))
    tail_epochs = summary.get("epoch_summaries", [])
    loss_tail_points_train = []
    loss_tail_points_valid = []
    mse_xyz_points = []
    mse_rot_points = []
    mse_grip_points = []
    for item in tail_epochs:
        epoch = int(item["epoch"])
        loss_tail_points_train.append(make_chart_point(epoch, item["train"]["loss_total"], f"epoch {epoch}"))
        loss_tail_points_valid.append(make_chart_point(epoch, item["valid"]["loss_total"], f"epoch {epoch}"))
        mse_xyz_points.append(make_chart_point(epoch, item["valid"]["mse_xyz"], f"epoch {epoch}"))
        mse_rot_points.append(make_chart_point(epoch, item["valid"]["mse_rot6d"], f"epoch {epoch}"))
        mse_grip_points.append(make_chart_point(epoch, item["valid"]["mse_grip"], f"epoch {epoch}"))

    pdit_rank_rows = [
        {
            "label": f"epoch {int(point['x'])}",
            "value": float(point["y"]),
            "color": LINE_COLORS["rust"] if int(point["x"]) == 500 else LINE_COLORS["teal"],
        }
        for point in sorted(success_points, key=lambda item: item["y"], reverse=True)
    ]
    pdit_rank_rows.append(
        {
            "label": "100 回合复核",
            "value": float(recheck100["success_rate"]),
            "color": LINE_COLORS["blue"],
        }
    )

    charts["pdit-loss-tail"] = build_line_chart(
        "pdit-loss-tail",
        title="PDIT 最优组 train / valid loss 尾段",
        description="围绕当前最优的 baseline@500 组，直接看尾段 train / valid total loss 的收敛关系，而不是再重复摆一张 success 柱状图。",
        fmt="float",
        note="当前 baseline@500 训练记录里没有可回抓的 W&B history，因此这里只能展示本地 summary 保留下来的 495-499 epoch 尾段快照。",
        series=[
            {"name": "train/loss_total", "color": LINE_COLORS["rust"], "points": loss_tail_points_train},
            {"name": "valid/loss_total", "color": LINE_COLORS["blue"], "points": loss_tail_points_valid},
        ],
    )
    charts["pdit-mse-tail"] = build_line_chart(
        "pdit-mse-tail",
        title="PDIT 最优组 valid MSE 尾段",
        description="把最优组尾段的 xyz / rot6d / grip 三条误差单独拆开，直接解释当前行为锚点背后的误差结构。",
        fmt="float",
        note="PDIT 当前没有可用的 W&B history，这张图与 loss 图一样来自本地 summary 尾段快照。",
        series=[
            {"name": "mse_xyz", "color": LINE_COLORS["teal"], "points": mse_xyz_points},
            {"name": "mse_rot6d", "color": LINE_COLORS["gold"], "points": mse_rot_points},
            {"name": "mse_grip", "color": LINE_COLORS["coral"], "points": mse_grip_points},
        ],
    )
    charts["pdit-checkpoint-rank"] = build_rank_bar_chart(
        "pdit-checkpoint-rank",
        title="PDIT 关键结果排行",
        description="PDIT 只保留一张行为结果图，把关键 checkpoint 和 100 回合复核放在同一张排行条里，直接回答当前该认哪一个锚点。",
        fmt="percent",
        note="epoch 500 仍然是当前最稳的行为锚点，100 回合复核也继续站得住。",
        rows=pdit_rank_rows,
    )

    timeline_groups = [
        {
            "date": "2026-04-09",
            "cards": [
                {
                    "badge": "PDIT 主线",
                    "title": "根目录重整后的最优策略复核通过",
                    "summary": "对同一 best_success checkpoint 重新做行为复核，确认仓库结构重整没有把当前最优策略改坏。",
                    "metrics": [
                        make_metric("20 回合", format_ratio(recheck20["success_rate"])),
                        make_metric("100 回合", format_ratio(recheck100["success_rate"])),
                        make_metric("mean steps@100", format_number(recheck100["mean_steps"], 2)),
                    ],
                    "outcome": "Baseline@500 继续作为当前 PDIT 行为锚点。",
                    "links": [
                        card_link("20 回合复核", recheck20_path),
                        card_link("100 回合复核", recheck100_path),
                        card_link("checkpoint manifest", manifest_path),
                    ],
                },
                {
                    "badge": "Regression",
                    "title": "固定 batch 数值回归重新固化为新基准",
                    "summary": "根目录重整后旧 reference 不再 bitwise 对齐，于是把固定 batch regression 重新固化成新的 canonical baseline。",
                    "metrics": [
                        make_metric("reference", "已重建"),
                        make_metric("脚本", "verify_baseline_regression.py"),
                        make_metric("状态", "可重复"),
                    ],
                    "outcome": "后续代码重构有了统一的数值回归锚点。",
                    "links": [
                        card_link("新 regression reference", regression_path),
                        card_link("恢复进展文档", doc_path),
                    ],
                },
            ],
        },
        {
            "date": "2026-04-08",
            "cards": [
                {
                    "badge": "Repair",
                    "title": "训练与离线审计链关键 bug 修完",
                    "summary": "本地导入污染、FM 导入耦合、PointNet 导入、checkpoint 原子保存、子进程 audit 隔离和 audit-only stage 覆盖问题都在同一轮里修正。",
                    "metrics": [
                        make_metric("关键修复", "6"),
                        make_metric("audit-only", "已修"),
                        make_metric("latest.pt", "原子保存"),
                    ],
                    "outcome": "之前“模型完全学不会”的结论被重新归因为工程与评估链问题。",
                    "links": [
                        card_link("恢复进展文档", doc_path),
                        card_link("训练模型审计", training_audit_path),
                    ],
                },
                {
                    "badge": "Baseline",
                    "title": "Baseline@100 恢复到 0.90 success@20",
                    "summary": "修复后的 baseline 不再早期崩掉，在 100 epoch 已经能稳定学出可用行为。",
                    "metrics": [
                        make_metric("success@100", "0.90"),
                        make_metric("best valid", "0.661"),
                        make_metric("best epoch", "31"),
                    ],
                    "outcome": "点云主线的可训练性已经重新被确认。",
                    "links": [
                        card_link("恢复进展文档", doc_path),
                        card_link("训练模型审计", training_audit_path),
                    ],
                },
                {
                    "badge": "Anchor",
                    "title": "Baseline@500 锚定 0.95 success@20",
                    "summary": "100/200/300/400/500 五个检查点的 success 曲线重新梳理后，最强点实际落在 500 epoch，而不是中途崩塌。",
                    "metrics": [
                        make_metric("100", "0.75"),
                        make_metric("300", "0.90"),
                        make_metric("500", "0.95"),
                    ],
                    "outcome": "修复后的 baseline 没有出现之前 feared 的 300→500 崩塌。",
                    "links": [
                        card_link("audit report", audit_path),
                        card_link("summary", summary_path),
                    ],
                },
                {
                    "badge": "Ablation",
                    "title": "统计特征增强对照作废，官方式动态候选仍待验证",
                    "summary": "统计特征归一化 + 原始增强这条对照之所以表现差，并不只是超参问题，而是增强实现把 rot6d 当成了可平移点；更接近官方 DiT 动态的候选在 valid loss 上更好，但还没形成新的行为锚点。",
                    "metrics": [
                        make_metric("增强对照@100", "0.55"),
                        make_metric("动态候选 best valid", "0.572"),
                        make_metric("状态", "待行为验证"),
                    ],
                    "outcome": "旧增强对照不再作为结构结论引用，当前锚点仍是 baseline@500。",
                    "links": [
                        card_link("恢复进展文档", doc_path),
                        card_link("训练模型审计", training_audit_path),
                    ],
                },
            ],
        },
    ]

    findings = [
        {
            "title": "主因已经从“学不会”转成“如何稳住后期泛化”",
            "body": "修复工程问题之后，PDIT baseline 已经能在 100 epoch 达到 0.90@20，在 500 epoch 达到 0.95@20。当前真正的问题是怎么降低 300-500 epoch 的策略漂移，而不是是否能学起来。",
        },
        {
            "title": "统计特征增强对照的旧结论不能继续沿用",
            "body": "数据增强实现曾经错误地把 rot6d 向量当成三维点平移，所以那条统计特征增强对照的坏结果不能被解读成“数据驱动统计一定无效”。",
        },
        {
            "title": "当前公开最强证据是 0.95@20 / 0.85@100",
            "body": "20 回合短审计把 500 epoch 锚点推到 0.95，根目录重整后又用同一策略做了 100 回合复核，保持在 0.85，足够支撑它继续做主线锚点。",
        },
    ]

    evidence_links = [
        make_link("FM/DiT 恢复进展", doc_path, "完整记录了修复项、Baseline@100/500、统计特征增强对照与动态候选的判断。"),
        make_link("训练模型审计", training_audit_path, "补充了修复前后模型与训练行为的核对过程。"),
        make_link("PDIT audit report", audit_path, "包含 success_by_epoch 和当前 best checkpoint。"),
        make_link("PDIT summary", summary_path, "包含最新 valid/train 尾段指标与 run 元信息。"),
        make_link("checkpoint manifest", manifest_path, "固化了 canonical best 及其复核证据。"),
        make_link("100 回合复核结果", recheck100_path, "验证根目录重整后最优策略仍然成立。"),
    ]

    home_entries = [
        {
            "date": "2026-04-09",
            "group": "done",
            "task_id": task_cfg["id"],
            "branch_ids": task_cfg["branch_ids"],
            "badge": "PDIT 主线",
            "title": "PDIT baseline 在 500 epoch 锚定 0.95@20 / 0.85@100",
            "summary": "修复训练与审计链后，点云主线不再在 300-500 epoch 崩塌，当前最强策略已经有 20 回合与 100 回合两轮复核。",
            "metrics": [
                make_metric("success@20", "0.95"),
                make_metric("100 回合复核", "0.85"),
                make_metric("锚点", "@500"),
            ],
            "meta": "PDIT 基线恢复与锚点固化",
            "path": "homepage/tasks/pdit-anchor/",
        },
        {
            "date": "2026-04-08",
            "group": "done",
            "task_id": task_cfg["id"],
            "branch_ids": task_cfg["branch_ids"],
            "badge": "Baseline Recovery",
            "title": "点云训练栈修稳后，Baseline@100 重新回到 0.90 success@20",
            "summary": "这一天的核心不是又跑了一次实验，而是把导致历史结论失真的训练、保存和审计问题真正修通了。",
            "metrics": [
                make_metric("success@100", "0.90"),
                make_metric("关键修复", "6"),
                make_metric("best valid", "0.661"),
            ],
            "meta": "从“学不会”转向“后期如何稳住”",
            "path": "homepage/tasks/pdit-anchor/",
        },
    ]

    hero_metrics = [
        make_metric("best success@20", format_ratio(audit["best_success_rate"])),
        make_metric("100 回合复核", format_ratio(recheck100["success_rate"])),
        make_metric("best epoch", audit["best_success_epoch"]),
    ]

    return {
        "id": task_cfg["id"],
        "title": task_cfg["title"],
        "summary": task_cfg["summary"],
        "status": task_cfg["status"],
        "status_group": status_group(task_cfg["status"]),
        "page_path": f"homepage/tasks/{task_cfg['id']}/",
        "branch_ids": task_cfg["branch_ids"],
        "latest_update": "2026-04-09",
        "hero_metrics": hero_metrics,
        "report_intro": "PDIT 这条线的任务不是继续堆实验数量，而是把点云主线从“曾经不可信的训练栈”修成一个能反复复核、能承接后续比较的稳定锚点。",
        "summary_cards": [
            {
                "eyebrow": "Anchor",
                "title": "行为锚点已经稳定下来",
                "body": "Baseline@500 在离线 20 回合达到 0.95，根目录重整后的 100 回合复核仍有 0.85，说明当前最优策略不是一次性好运气。",
                "metrics": [
                    make_metric("20 回合", "0.95"),
                    make_metric("100 回合", "0.85"),
                    make_metric("best epoch", "500"),
                ],
            },
            {
                "eyebrow": "Repair",
                "title": "训练 / 保存 / 审计三条链都修过一轮",
                "body": "导入路径污染、checkpoint 原子保存、audit-only stage 覆盖和 RLBench 挂起隔离等问题被集中处理，当前结果终于能按同一口径解释。",
                "metrics": [
                    make_metric("关键修复", "6"),
                    make_metric("audit chain", "稳定"),
                    make_metric("行为回归", "通过"),
                ],
            },
            {
                "eyebrow": "Ablation",
                "title": "统计特征增强对照作废，官方式动态候选仍属待证",
                "body": "统计特征增强路径存在语义 bug，不能再拿来支持结构结论；更接近官方 DiT 动态的候选在 valid loss 上有优势，但还没有行为层面的替代证据。",
                "metrics": [
                    make_metric("增强对照", "作废"),
                    make_metric("动态候选 best valid", "0.572"),
                    make_metric("当前锚点", "baseline"),
                ],
            },
            {
                "eyebrow": "Current",
                "title": "现在要解决的是后期稳定性，而不是可训练性",
                "body": "PDIT 已经证明自己能学起来，真正要继续追的是怎样减少中后期漂移、让 success 与 valid signal 更长期对齐。",
                "metrics": [
                    make_metric("100 epoch", "可用"),
                    make_metric("500 epoch", "可复核"),
                    make_metric("问题", "晚期泛化"),
                ],
            },
        ],
        "timeline_groups": timeline_groups,
        "findings": findings,
        "evidence_links": evidence_links,
        "chart_ids": ["pdit-checkpoint-rank", "pdit-loss-tail", "pdit-mse-tail"],
        "media_items": media_items,
        "home_entries": home_entries,
        "task_badge": "PDIT 主线",
        "docs": [repo_rel(path) for path in task_cfg["featured_paths"]],
        "manifest_note": safe_excerpt(clean_text(section_body(doc_sections, "迄今为止的总结"))),
    }


def build_mdit_task(task_cfg: dict[str, Any], charts: dict[str, Any], media_items: list[dict[str, str]]) -> dict[str, Any]:
    journal_path = ROOT / task_cfg["featured_paths"][0]
    best_path_path = ROOT / task_cfg["featured_paths"][1]
    manual_path = ROOT / task_cfg["featured_paths"][2]
    audit_path = ROOT / task_cfg["artifact_paths"]["audit"]
    summary_path = ROOT / task_cfg["artifact_paths"]["summary"]
    wandb_summary_path = ROOT / task_cfg["artifact_paths"]["resume_wandb"]
    resume_record_path = ROOT / task_cfg["artifact_paths"]["resume_record"]

    journal_text = read_text(journal_path)
    journal_events = parse_mdit_journal_events(journal_text)
    best_path = parse_best_path(best_path_path)
    audit = read_json(audit_path)
    summary = read_json(summary_path)
    # 500 续训的阶段结论以 autoresearch 记录和共享审计为准；
    # 本地 wandb 快照只是补充展示，仓库里不一定长期保留。
    wandb_summary = read_json_if_exists(wandb_summary_path)
    resume_record = read_json_if_exists(resume_record_path)
    resume_audit = resume_record.get("audit_report", {}) if resume_record else {}
    wandb_history = collect_wandb_history(summary.get("wandb_run_url"))
    event_map = {(event["date"], event["slug"]): event for event in journal_events}
    stabilized_event = next((event for event in journal_events if "lane_a_stabilized" in event["slug"] and event["phase"] == "audit_only"), None)
    lane_b_fix_event = next((event for event in journal_events if event["phase"] == "infra_fix" and "Lane B first launch failed" in event["fields"].get("Title", "")), None)
    fallback_event = event_map.get(("2026-04-18", "takeover_triggered_fallback_best500"))
    resume_event = event_map.get(("2026-04-18", "best500_resume_recovered"))

    merged_success_by_epoch = dict(audit.get("success_by_epoch") or {})
    for epoch in ["200", "300", "400", "500"]:
        value = (resume_audit.get("success_by_epoch") or {}).get(epoch)
        if value is not None:
            merged_success_by_epoch[epoch] = value
    success_points = sorted_success_points(merged_success_by_epoch)
    resume_best_success = resume_record.get("best_success_rate")
    resume_best_epoch = resume_record.get("best_success_epoch")
    resume_success_300 = resume_record.get("success_300")
    resume_success_500 = resume_record.get("success_500")
    mdit_rank_rows = [
        {
            "label": f"epoch {int(point['x'])}",
            "value": float(point["y"]),
            "color": LINE_COLORS["rust"] if int(point["x"]) in {300, 500} else LINE_COLORS["teal"],
        }
        for point in sorted(success_points, key=lambda item: item["y"], reverse=True)
    ]
    if stabilized_event:
        stabilized_success = parse_first_float(stabilized_event["fields"].get("success_100"))
        if stabilized_success is not None:
            mdit_rank_rows.append(
                {
                    "label": "stabilized@100",
                    "value": stabilized_success,
                    "color": LINE_COLORS["blue"],
                }
            )

    if wandb_history.get("train/loss_total") and wandb_history.get("valid/loss_total"):
        total_loss_note = "使用 W&B API 抓取完整 history，展示主线真实训练曲线。"
        train_loss_points = [make_chart_point(epoch, value, f"epoch {epoch}") for epoch, value in sorted(wandb_history["train/loss_total"].items())]
        valid_loss_points = [make_chart_point(epoch, value, f"epoch {epoch}") for epoch, value in sorted(wandb_history["valid/loss_total"].items())]
    else:
        total_loss_note = "W&B API 当前不可用，回退为本地 audit_report 的 1-100 epoch 历史。"
        train_loss_points = [make_chart_point(index + 1, value, f"epoch {index + 1}") for index, value in enumerate(audit.get("train_loss_history", []))]
        valid_loss_points = [make_chart_point(index + 1, value, f"epoch {index + 1}") for index, value in enumerate(audit.get("valid_loss_history", []))]

    if wandb_history.get("valid/mse_xyz"):
        mse_note = "使用 W&B API 抓取 valid mse_xyz / mse_rot6d / mse_grip 全量 history。"
        mse_xyz_points = [make_chart_point(epoch, value, f"epoch {epoch}") for epoch, value in sorted(wandb_history["valid/mse_xyz"].items())]
        mse_rot_points = [make_chart_point(epoch, value, f"epoch {epoch}") for epoch, value in sorted(wandb_history["valid/mse_rot6d"].items())]
        mse_grip_points = [make_chart_point(epoch, value, f"epoch {epoch}") for epoch, value in sorted(wandb_history["valid/mse_grip"].items())]
    else:
        mse_note = "W&B API 当前不可用，因此 mse 曲线回退到 summary 里保留下来的 95-99 epoch 尾段快照。"
        mse_xyz_points = []
        mse_rot_points = []
        mse_grip_points = []
        for item in summary.get("epoch_summaries", []):
            epoch = int(item["epoch"])
            mse_xyz_points.append(make_chart_point(epoch, item["valid"]["mse_xyz"], f"epoch {epoch}"))
            mse_rot_points.append(make_chart_point(epoch, item["valid"]["mse_rot6d"], f"epoch {epoch}"))
            mse_grip_points.append(make_chart_point(epoch, item["valid"]["mse_grip"], f"epoch {epoch}"))

    charts["mdit-loss-curve"] = build_line_chart(
        "mdit-loss-curve",
        title="MDIT 主线 train / valid total loss",
        description="保留一张完整的主线 loss 曲线，直接看 100→500 续训过程中收敛、波动和回弹是怎样展开的。",
        fmt="float",
        note=total_loss_note,
        series=[
            {"name": "train/loss_total", "color": LINE_COLORS["rust"], "points": train_loss_points},
            {"name": "valid/loss_total", "color": LINE_COLORS["blue"], "points": valid_loss_points},
        ],
    )
    charts["mdit-mse-curve"] = build_line_chart(
        "mdit-mse-curve",
        title="MDIT 主线 valid MSE 变化",
        description="把 xyz / rot6d / grip 三条 valid MSE 拆开来看，用误差结构解释主线为什么能把共享审计抬到 0.75。",
        fmt="float",
        note=mse_note,
        series=[
            {"name": "mse_xyz", "color": LINE_COLORS["teal"], "points": mse_xyz_points},
            {"name": "mse_rot6d", "color": LINE_COLORS["gold"], "points": mse_rot_points},
            {"name": "mse_grip", "color": LINE_COLORS["coral"], "points": mse_grip_points},
        ],
    )
    charts["mdit-audit-rank"] = build_rank_bar_chart(
        "mdit-audit-rank",
        title="MDIT 审计结果排行",
        description="MDIT 只保留一张行为结果图，把关键里程碑和稳定化对照放到同一张排行条里，直接回答当前最能代表主线结果的是谁。",
        fmt="percent",
        note="300 / 500 epoch 已经超过早期 0.55@100 锚点，因此这条线后面更应该看 loss 与 MSE 怎样支撑这个提升。",
        rows=mdit_rank_rows,
    )

    timeline_groups = [
        {
            "date": "2026-04-18",
            "cards": [
                {
                    "badge": "Mainline Resume",
                    "title": "严格 MTDP 对照未过共享审计后，研究重新收束到 RGB+Text 主线",
                    "summary": "严格 MTDP 对照没有通过共享 gate，项目没有继续把预算散到弱候选上，而是立即收回到唯一过审的 RGB+Text 主线。",
                    "metrics": [
                        make_metric("当前锚点", "0.55@100"),
                        make_metric("回退动作", "best500 fallback"),
                        make_metric("原因", "recipe drift"),
                    ],
                    "outcome": "MDIT 重新聚焦到唯一可信的 RGB+Text 主线，而不是继续同时养多个弱对照。",
                    "links": [
                        card_link("研究日志", journal_path),
                        card_link("当前主线路径", best_path_path),
                    ],
                },
                {
                    "badge": "Takeover",
                    "title": "100→500 主线续训在 supervisor 下恢复",
                    "summary": "早先的 fallback run 首个 optimizer step 就崩掉，后来又确认 watchdog 误判了“已接管但其实空转”的状态；这一天把 optimizer / scheduler 兼容和 supervisor 都补上了。",
                    "metrics": [
                        make_metric("续训目标", "500 epoch"),
                        make_metric("当前 best", "0.55@100"),
                        make_metric("状态", "已恢复"),
                    ],
                    "outcome": "后续 500 epoch 结果会继续积累在同一条主线 lineage 上，而不是再新开匿名 run。",
                    "links": [
                        card_link("研究日志", journal_path),
                        card_link("W&B 摘要", wandb_summary_path),
                    ],
                },
            ],
        },
        {
            "date": "2026-04-17",
            "cards": [
                {
                    "badge": "Anchor",
                    "title": "RGB+Text 当前主线被正式冻结为阶段锚点",
                    "summary": "在共享 audit 链下，当前 RGB+Text 主线是当时唯一完成锁定审计的候选，因此被正式冻结为主线锚点。",
                    "metrics": [
                        make_metric("epoch 50", "0.25"),
                        make_metric("epoch 100", "0.55"),
                        make_metric("mean steps", "121.75"),
                    ],
                    "outcome": "后续其他对照只有在同一审计口径下超过 0.55，才有资格接管主线。",
                    "links": [
                        card_link("当前主线路径", best_path_path),
                        card_link("共享审计结果", audit_path),
                    ],
                },
                {
                    "badge": "Comparison",
                    "title": "平滑动作对照审计后确认弱于当前主线",
                    "summary": "平滑动作这条对照没有真正触及核心失败模式，在 50 / 100 epoch 的表现都落在当前锚点之下。",
                    "metrics": [
                        make_metric("epoch 50", "0.20"),
                        make_metric("epoch 100", "0.35"),
                        make_metric("主要失败", "超时未完成"),
                    ],
                    "outcome": "这条稳定化对照线被明确降级为参考线，而不是新主线。",
                    "links": [
                        card_link("研究日志", journal_path),
                        card_link("执行手册", manual_path),
                    ],
                },
                {
                    "badge": "Infra Fix",
                    "title": "faithful recipe 对照的首轮失败被确认是缓存 / 网络问题",
                    "summary": "第一次 faithful recipe 对照启动时卡在 Hugging Face 远程握手，而不是训练本身；autoresearch 随后改成优先吃本地缓存并强制 offline。",
                    "metrics": [
                        make_metric("HF 模式", "offline"),
                        make_metric("问题归因", "启动链"),
                        make_metric("模型判断", "未下结论"),
                    ],
                    "outcome": "这条 faithful recipe 对照的首轮失败不再被误记成“方法本身无效”。",
                    "links": [
                        card_link("研究日志", journal_path),
                        card_link("执行手册", manual_path),
                    ],
                },
            ],
        },
        {
            "date": "2026-04-16",
            "cards": [
                {
                    "badge": "Manual",
                    "title": "MDIT 执行手册定版，主线推进开始有统一口径",
                    "summary": "从训练命令、共享评估链、晋级门槛到接管方式，全部被整理成固定手册，后续不再靠零散命令和口口相传维持。",
                    "metrics": [
                        make_metric("搜索线", "2"),
                        make_metric("闸门", "100/300/500"),
                        make_metric("审计链", "锁定"),
                    ],
                    "outcome": "MDIT 开始从零散 run note 转成真正可持续维护的主线研究线。",
                    "links": [
                        card_link("执行手册", manual_path),
                        card_link("研究日志", journal_path),
                    ],
                }
            ],
        },
    ]

    findings = [
        {
            "title": "早期锚点是 0.55@100，但长训主线已经把 300/500 拉到 0.75",
            "body": "当前最稳的早期锚点仍是 0.55@100 的 RGB+文本主线；在同一条 best-route lineage 上，100→500 续训后的共享审计已经给出 0.75@300 和 0.75@500，说明长训确实把行为上限抬了上去。",
        },
        {
            "title": "平滑动作和其他弱对照没有解决核心失败模式",
            "body": "已知失败大头仍是“动作还没做完就到时间上限”，说明只是平滑 action head 或轻微换 recipe 并不能直接解决 MDIT 的行为瓶颈。",
        },
        {
            "title": "当前缺口不是再开新线，而是补齐 100 epoch 点位并收束共享审计叙事",
            "body": "这次 500 续训 run 的共享审计已经证明 300/500 表现提升到 0.75，但因为 epoch_0100 点位缺失，trial_score 仍按 collapse 落档。下一步更像是补齐审计口径，而不是再新开相似路线。",
        },
    ]

    evidence_links = [
        make_link("研究日志", journal_path, "append-only 研究日志，记录每条对照线的推进、失败和接管。"),
        make_link("当前主线路径", best_path_path, "当前主线锚点、best checkpoint 和晋级逻辑。"),
        make_link("执行手册", manual_path, "训练、审计、接管与晋级规则的固定手册。"),
        make_link("共享审计报告", audit_path, "0.25@50 / 0.55@100 的共享审计证据。"),
        make_link("500 续训审计记录", resume_record_path, "记录了 100→500 续训主线的 0.75@300 / 0.75@500 结果，以及当前 trial_score 仍为 -1 的原因。"),
        make_link("主线 summary", summary_path, "1-100 epoch 主线的 summary 与 W&B run URL。"),
        make_link("W&B 摘要快照", wandb_summary_path, "500 续训接管后的本地 W&B 摘要快照。"),
    ]

    home_entries = [
        {
            "date": "2026-04-18",
            "group": "in_progress",
            "task_id": task_cfg["id"],
            "branch_ids": task_cfg["branch_ids"],
            "badge": "MDIT 主线",
            "title": "MDIT 主线恢复 100→500 续训接管",
            "summary": "严格 MTDP 对照没有通过共享审计后，研究预算被收回到唯一过审的 RGB+Text 主线，并把 100→500 续训兼容与 supervisor 一起修通。",
            "metrics": [
                make_metric("当前锚点", "0.55@100"),
                make_metric("续训目标", "500"),
                make_metric("状态", "恢复中"),
            ],
            "meta": "主线从筛选期进入长训接管期",
            "path": "homepage/tasks/mdit-mainline/",
        },
        {
            "date": "2026-04-17",
            "group": "in_progress",
            "task_id": task_cfg["id"],
            "branch_ids": task_cfg["branch_ids"],
            "badge": "RGB+Text Anchor",
            "title": "RGB+Text 当前锚点固定为 0.55@100，所有对照暂未越线",
            "summary": "共享 audit 下的 0.55@100 成为当前唯一可信锚点，平滑动作对照和 faithful recipe 对照的首轮推进都没能完成接管。",
            "metrics": [
                make_metric("epoch 50", "0.25"),
                make_metric("epoch 100", "0.55"),
                make_metric("对照线", "2"),
            ],
            "meta": "研究线开始从扩散筛选重新收束",
            "path": "homepage/tasks/mdit-mainline/",
        },
    ]

    latest_resume_epoch = wandb_summary.get("epoch")
    hero_metrics = [
        make_metric("早期锚点", "0.55@100"),
        make_metric("best success", format_ratio(resume_best_success) if resume_best_success is not None else "0.55"),
        make_metric("500 轮审计", format_ratio(resume_success_500) if resume_success_500 is not None else (f"epoch {latest_resume_epoch}" if latest_resume_epoch is not None else "100→500")),
    ]

    return {
        "id": task_cfg["id"],
        "title": task_cfg["title"],
        "summary": task_cfg["summary"],
        "status": task_cfg["status"],
        "status_group": status_group(task_cfg["status"]),
        "page_path": f"homepage/tasks/{task_cfg['id']}/",
        "branch_ids": task_cfg["branch_ids"],
        "latest_update": "2026-04-19",
        "hero_metrics": hero_metrics,
        "report_intro": "MDIT 这条线现在已经不只是“把 100→500 续训接起来”，而是要把 0.55@100 的早期锚点与 0.75@300/500 的长训结果收进同一条共享审计叙事里，避免新结论继续散落在 fixes 和 run note 中。",
        "summary_cards": [
            {
                "eyebrow": "Anchor",
                "title": "同一条 RGB+Text 主线已经从 0.55@100 抬到 0.75@300/500",
                "body": "0.55@100 仍是当前锁定的早期锚点；在此基础上，100→500 续训后的共享审计已经给出 0.75@300 和 0.75@500，说明这条线不是只能停在 100 epoch。",
                "metrics": [
                    make_metric("epoch 100", "0.55"),
                    make_metric("epoch 300", format_ratio(resume_success_300) if resume_success_300 is not None else "0.75"),
                    make_metric("epoch 500", format_ratio(resume_success_500) if resume_success_500 is not None else "0.75"),
                ],
            },
            {
                "eyebrow": "Resume",
                "title": "100→500 续训接管已经真正跑通并完成共享审计",
                "body": "这轮不只是把 supervisor 和 optimizer 兼容补上，而是已经让同一条 best-route lineage 从 epoch_0100 真正续到 500，并拿回可用于判断的共享审计结果。",
                "metrics": [
                    make_metric("best success", format_ratio(resume_best_success) if resume_best_success is not None else "0.75"),
                    make_metric("best epoch", resume_best_epoch if resume_best_epoch is not None else "300"),
                    make_metric("状态", "已审计"),
                ],
            },
            {
                "eyebrow": "Screening",
                "title": "平滑动作 / faithful / 严格 MTDP 三条对照已经完成出清",
                "body": "平滑动作对照只到 0.35，faithful 首败被确认是缓存 / 网络问题，严格 MTDP 对照也没有越过共享闸门。主线预算已经重新收束，不再被相似弱候选打断。",
                "metrics": [
                    make_metric("stabilized@100", "0.35"),
                    make_metric("faithful", "启动链故障"),
                    make_metric("严格 MTDP", "未过 gate"),
                ],
            },
            {
                "eyebrow": "Audit",
                "title": "当前缺口是补齐 100 epoch 审计点位，而不是再开新 run",
                "body": "500 续训 run 当前仍被自动标成 collapse，不是因为 300/500 表现差，而是因为这个续训 run 的共享审计缺了 epoch_0100 点位。下一步应该先把审计叙事补完整。",
                "metrics": [
                    make_metric("trial_score", str(resume_record.get("trial_score", "-1.0"))),
                    make_metric("100 点位", "缺失"),
                    make_metric("recipe drift", "无"),
                ],
            },
        ],
        "timeline_groups": timeline_groups,
        "findings": findings,
        "evidence_links": evidence_links,
        "chart_ids": ["mdit-audit-rank", "mdit-loss-curve", "mdit-mse-curve"],
        "media_items": media_items,
        "home_entries": home_entries,
        "task_badge": "MDIT 主线",
        "docs": [repo_rel(path) for path in task_cfg["featured_paths"]],
        "event_digest": {
            "resume_recovered": resume_event["fields"] if resume_event else {},
            "fallback_triggered": fallback_event["fields"] if fallback_event else {},
            "stabilized_lane": stabilized_event["fields"] if stabilized_event else {},
            "lane_b_fix": lane_b_fix_event["fields"] if lane_b_fix_event else {},
            "resume_audit": {
                "best_success_rate": resume_best_success,
                "best_success_epoch": resume_best_epoch,
                "success_300": resume_success_300,
                "success_500": resume_success_500,
                "trial_score": resume_record.get("trial_score"),
            },
        },
    }


def build_lelan_task(task_cfg: dict[str, Any], charts: dict[str, Any], media_items: list[dict[str, str]]) -> dict[str, Any]:
    plan_path = ROOT / task_cfg["featured_paths"][0]
    readme_path = ROOT / task_cfg["featured_paths"][1]
    plan_text = read_text(plan_path)
    sections = parse_markdown_sections(plan_text)

    charts["lelan-stage-gates"] = build_bar_chart(
        "lelan-stage-gates",
        title="LeLaN 阶段闸门",
        description="LeLaN 目前还在铺设工程链路，所以最重要的不是已有结果，而是把 100 / 300 / 500 epoch 的晋级门槛固定清楚。",
        categories=["100 epoch", "300 epoch", "500 epoch"],
        values=[0.45, 0.55, 0.60],
        color=LINE_COLORS["teal"],
        fmt="percent",
        note="这是一张任务规则图，不是训练曲线图。",
    )

    timeline_groups = [
        {
            "date": "2026-04-12",
            "cards": [
                {
                    "badge": "Recipe",
                    "title": "LeLaN 主线配方先固定为 5 路 RGB、3 帧观测和 8 步动作",
                    "summary": "这一轮先固定 5 路 RGB、3 帧观测、horizon=32、8 步动作和平滑动作，再用 100 epoch / 20 episode gate 管住节奏，不急着改 backbone。",
                    "metrics": [
                        make_metric("RGB", "5 路"),
                        make_metric("观测帧", "3"),
                        make_metric("动作步数", "8"),
                    ],
                    "outcome": "LeLaN 第一轮重点从“改模型”转成“先把工程链路立起来”。",
                    "links": [
                        card_link("执行计划", plan_path),
                        card_link("LeLaN research README", readme_path),
                    ],
                },
                {
                    "badge": "Eval Chain",
                    "title": "EMA、success eval 与 offline eval ckpt 双路径补齐",
                    "summary": "训练中 success gate 和不依赖 RLBench 的离线 eval ckpt 两条路径被明确分开，resume 和 prefer-ema 也都补齐了兼容。",
                    "metrics": [
                        make_metric("EMA", "on"),
                        make_metric("success gate", "100@20"),
                        make_metric("eval ckpt", "100 epoch"),
                    ],
                    "outcome": "LeLaN 后续 run 不会再出现“训练、评估、选模链路断开”的状态。",
                    "links": [
                        card_link("执行计划", plan_path),
                        card_link("LeLaN research README", readme_path),
                    ],
                },
                {
                    "badge": "Trace",
                    "title": "autoresearch 留痕规范一次性固定下来",
                    "summary": "manifest、summary、dataset_stats、audit_report、trial_request 和 change_summary 都被写进固定产物约定里，后续可以直接追加而不是重新发明格式。",
                    "metrics": [
                        make_metric("核心产物", "7+"),
                        make_metric("筛选分支", "3"),
                        make_metric("停止门槛", "0.45"),
                    ],
                    "outcome": "LeLaN 后续最先长出来的是“可审计的工程链路”，而不是无上下文的零散 run。",
                    "links": [
                        card_link("执行计划", plan_path),
                        card_link("LeLaN research README", readme_path),
                    ],
                },
            ],
        }
    ]

    findings = [
        {
            "title": "这一轮先补工程基础，而不是先改结构",
            "body": "LeLaN 当前的核心缺口不是 encoder 设计，而是训练、评估、选模和审计链路没有一体化。"},
        {
            "title": "所有 screening 先走统一主线 recipe",
            "body": "只有当三条 100 epoch screening 全都过不了 0.45@20，下一轮才允许更激进的结构改动。",
        },
        {
            "title": "留痕格式已经比结果更早固定",
            "body": "即便本页还没有 success 曲线，后续每条 LeLaN run 也会自动留下 manifest、summary、audit 和 change summary。",
        },
    ]

    evidence_links = [
        make_link("LeLaN autoresearch 执行计划", plan_path, "定义了本轮目标、主线 recipe、闸门与训练 / 评估约束。"),
        make_link("LeLaN research README", readme_path, "定义了后续 run 报告必须具备的结构。"),
    ]

    home_entries = [
        {
            "date": "2026-04-12",
            "group": "in_progress",
            "task_id": task_cfg["id"],
            "branch_ids": task_cfg["branch_ids"],
            "badge": "LeLaN",
            "title": "LeLaN 自动研究链路完成首轮固化",
            "summary": "先把 5 路 RGB、3 帧观测、8 步动作的主线配方，以及 EMA / eval 双路径和 autoresearch 留痕规范一起固定下来，为后续正式 run 做好底座。",
            "metrics": [
                make_metric("观测帧", "3"),
                make_metric("动作步数", "8"),
                make_metric("100 epoch gate", "0.45"),
            ],
            "meta": "当前还是工程铺设期，结果页会在正式 run 后变厚",
            "path": "homepage/tasks/lelan-pipeline/",
        }
    ]

    return {
        "id": task_cfg["id"],
        "title": task_cfg["title"],
        "summary": task_cfg["summary"],
        "status": task_cfg["status"],
        "status_group": status_group(task_cfg["status"]),
        "page_path": f"homepage/tasks/{task_cfg['id']}/",
        "branch_ids": task_cfg["branch_ids"],
        "latest_update": "2026-04-12",
        "hero_metrics": [
            make_metric("输入", "5 路 RGB / 3 帧"),
            make_metric("动作步数", "8"),
            make_metric("100 epoch gate", "0.45"),
        ],
        "report_intro": "LeLaN 这页目前更像“执行链路报告”，因为它的首要目标是把训练、评估、选模和审计变成一套能长期追加的自动研究流程。",
        "summary_cards": [
            {
                "eyebrow": "Recipe",
                "title": "第一轮 recipe 固定，不先碰 backbone",
                "body": "先锁定 5 路 RGB、3 帧观测、horizon=32、8 步动作和 smooth_actions，把工程链路建立清楚再谈结构创新。",
                "metrics": [
                    make_metric("RGB", "5 路"),
                    make_metric("观测帧", "3"),
                    make_metric("动作步数", "8"),
                ],
            },
            {
                "eyebrow": "Eval",
                "title": "训练内 success gate 与离线 eval ckpt 双路径都补齐了",
                "body": "训练可以选择直接做 success eval，也可以完全不依赖 RLBench、按固定节奏保存轻量 eval ckpt，后续审计链不再卡死在单一路径上。",
                "metrics": [
                    make_metric("EMA", "兼容"),
                    make_metric("prefer-ema", "已支持"),
                    make_metric("eval ckpt", "固定目录"),
                ],
            },
            {
                "eyebrow": "Trace",
                "title": "autoresearch 产物和 change summary 已经定版",
                "body": "manifest、summary、dataset_stats、audit_report 和 trial_request 都成为固定产物，change_summary 也必须可被人直接读懂。",
                "metrics": [
                    make_metric("产物", "7+"),
                    make_metric("change_summary", "人类可读"),
                    make_metric("状态", "可追加"),
                ],
            },
            {
                "eyebrow": "Gate",
                "title": "100 / 300 / 500 三段闸门已经固定",
                "body": "当前阶段最重要的是用统一 gate 管住筛选节奏，而不是同时尝试太多方向导致结论无法对比。",
                "metrics": [
                    make_metric("100", "0.45"),
                    make_metric("300", "0.55"),
                    make_metric("500", "0.60"),
                ],
            },
        ],
        "timeline_groups": timeline_groups,
        "findings": findings,
        "evidence_links": evidence_links,
        "chart_ids": ["lelan-stage-gates"],
        "media_items": media_items,
        "home_entries": home_entries,
        "task_badge": "LeLaN",
        "docs": [repo_rel(path) for path in task_cfg["featured_paths"]],
        "manifest_note": safe_excerpt(section_body(sections, "2.6 autoresearch 留痕")),
    }


def build_dummy_sim2real_task(task_cfg: dict[str, Any], charts: dict[str, Any], media_items: list[dict[str, str]]) -> dict[str, Any]:
    interview_path = ROOT / task_cfg["featured_paths"][0]
    can_path = ROOT / task_cfg["featured_paths"][1]
    boundary_path = ROOT / task_cfg["featured_paths"][2]
    kinematics_path = ROOT / task_cfg["featured_paths"][3]

    interview_text = read_text(interview_path)
    interview_sections = parse_markdown_sections(interview_text)
    latest_update = "2026-04-02"

    summary_cards = [
        {
            "eyebrow": "Sim2Real",
            "title": "六轴运动映射和数字孪生同步已经打通",
            "body": "把单位制、轴向符号和 J3 的 90° 零位偏置统一进 firmware_to_urdf()，再用 EMA 平滑把真机状态稳定映射到 MuJoCo 侧，真机与仿真终于站到同一坐标口径上。",
            "metrics": [
                make_metric("映射轴数", "6"),
                make_metric("仿真同步", "20 Hz"),
                make_metric("J3 偏置", "90°"),
            ],
        },
        {
            "eyebrow": "Planning",
            "title": "仿真规划、影子预览和示教回放连成了同一条轨迹链路",
            "body": "主体、影子和 IK 各自独立持有 MuJoCo 模型，真机监控与规划预览可以同屏共存；示教则改成带时间戳的连续轨迹记录，天然兼容模仿学习数据格式。",
            "metrics": [
                make_metric("影子模型", "3 套"),
                make_metric("示教录制", "10 Hz"),
                make_metric("轨迹压缩", "RDP"),
            ],
        },
        {
            "eyebrow": "Kinematics",
            "title": "MuJoCo FK 与数值 IK 已经形成闭环控制接口",
            "body": "FK 直接复用 MuJoCo 的完整几何模型，IK 用 L-BFGS-B 和多初始猜测在关节限位内求解目标位姿，再把结果回写到影子预览与真机执行，形成可直接接入模仿学习和世界模型的动作接口。",
            "metrics": [
                make_metric("IK 精度", "< 8 mm"),
                make_metric("初始猜测", "6 组"),
                make_metric("FK 引擎", "MuJoCo"),
            ],
        },
        {
            "eyebrow": "Safety",
            "title": "CAN 限流和示教边界保护把平台从能跑推进到可复用",
            "body": "采样间隔、回放频率、超时保护、RDP 稀疏化和示教退出回退机制补齐后，轨迹回放不再轻易挤爆总线，现场示教也更适合作为长期复用的数据采集流程。",
            "metrics": [
                make_metric("最小采样", "50 ms"),
                make_metric("回放上限", "20 Hz"),
                make_metric("双层保护", "已补齐"),
            ],
        },
    ]

    # 这条线所有公开文档都集中在同一天，因此时间线按“阶段顺序”展开，
    # 用卡片顺序表达先后，不再把用户扔回原始 Markdown 自己拼过程。
    timeline_groups = [
        {
            "date": "2026-04-02",
            "cards": [
                {
                    "badge": "Safety",
                    "title": "补齐 CAN 限流与示教退出保护，平台状态正式固化",
                    "summary": "采样节奏、回放上限、超时保护、RDP 稀疏化和退出示教时的平滑回退全部补齐后，这套六轴臂平台不再只是能演示，而是具备长期复用的数据采集稳定性。",
                    "metrics": [
                        make_metric("阶段", "04"),
                        make_metric("最小采样", "50 ms"),
                        make_metric("回放上限", "20 Hz"),
                    ],
                    "outcome": "平台从“功能打通”走到了“可以稳定拿来做真机轨迹采集”的状态，因此被固定进已完成区。",
                    "links": [
                        card_link("CAN 通信保护总结", can_path),
                        card_link("示教边界与退出处理", boundary_path),
                    ],
                }
            ],
        },
        {
            "date": "2026-03-28",
            "cards": [
                {
                    "badge": "Kinematics",
                    "title": "用 MuJoCo 正解与数值逆解建立末端闭环控制",
                    "summary": "FK 直接复用 MuJoCo 的完整几何与 site 定义，IK 则用 L-BFGS-B 在关节限位内做多初始猜测优化，把“目标位姿 → 逆解 → 影子预览 → 真机下发”串成闭环。",
                    "metrics": [
                        make_metric("阶段", "03"),
                        make_metric("IK 精度", "< 8 mm"),
                        make_metric("初始猜测", "6 组"),
                    ],
                    "outcome": "这套平台已经具备服务模仿学习和世界模型的数据接口，不再只是一个可视化控制 Demo。",
                    "links": [
                        card_link("项目总览", interview_path),
                        card_link("正逆运动学技术文档", kinematics_path),
                    ],
                },
            ],
        },
        {
            "date": "2026-03-22",
            "cards": [
                {
                    "badge": "Planning",
                    "title": "把仿真规划与示教录制做成连续轨迹链路",
                    "summary": "通过主体 / 影子 / IK 三套模型隔离运行状态，让规划预览和真机监控能够同屏；同时把示教记录改成带时间戳的 10 Hz 连续轨迹，并接入 RDP 稀疏化与按节奏回放。",
                    "metrics": [
                        make_metric("阶段", "02"),
                        make_metric("模型数", "3"),
                        make_metric("示教录制", "10 Hz"),
                    ],
                    "outcome": "规划、示教和回放开始共享同一种轨迹格式，这一步已经非常接近模仿学习数据采集。",
                    "links": [card_link("项目总览", interview_path)],
                }
            ],
        },
        {
            "date": "2026-03-15",
            "cards": [
                {
                    "badge": "Sim2Real",
                    "title": "打通六轴映射与真机-仿真数字孪生同步",
                    "summary": "围绕单位制、轴向符号和零位偏置统一出一套 firmware_to_urdf() 映射，再用 EMA 平滑把真机轮询稳定映射成 MuJoCo 侧的连续显示，解决了数字孪生最先卡住的坐标系问题。",
                    "metrics": [
                        make_metric("阶段", "01"),
                        make_metric("六轴映射", "已打通"),
                        make_metric("同步节奏", "2 → 20 Hz"),
                    ],
                    "outcome": "真机姿态现在可以稳定映射到 MuJoCo 侧，Sim2Real 这条基础链路已经成立。",
                    "links": [card_link("项目总览", interview_path)],
                },
            ],
        }
    ]

    findings = [
        {
            "title": "这条项目线已经完成平台搭建，可以固定留在“已完成”区",
            "body": "它的价值不在于继续滚动追加训练日志，而在于把具身学习所需的运动映射、示教回放、逆解控制和安全保护一次性搭稳，后续直接作为数据采集底座复用。",
        },
        {
            "title": "三项核心能力已经对齐到具身学习数据采集场景",
            "body": "Sim2Real 运动映射负责真机与仿真的统一坐标口径，示教轨迹负责结构化演示数据，FK/IK 闭环负责把末端目标变成可执行动作，这三者组合起来正好对应模仿学习与世界模型的接口需求。",
        },
        {
            "title": "安全保护不是附属功能，而是平台可复用的前提",
            "body": "如果没有 CAN 限流、RDP 稀疏化、超时保护和边界回退，这套系统只能偶尔演示；正是这些工程约束补齐后，它才有资格成为长期复用的数据采集平台。",
        },
    ]

    evidence_links = [
        make_link("项目总览", interview_path, safe_excerpt(section_body(interview_sections, "一、项目全景"), limit=120)),
        make_link("CAN 通信保护总结", can_path, "记录示教采样、RDP 稀疏化、回放限流和超时保护的关键参数。"),
        make_link("示教边界与退出处理", boundary_path, "记录示教拖动时的边界提示、平滑回退和退出流程。"),
        make_link("正逆运动学技术文档", kinematics_path, "补充 FK/IK 求解逻辑、关节范围与关键姿态验证结果。"),
    ]

    home_entries = [
        {
            "date": latest_update,
            "group": "done",
            "task_id": task_cfg["id"],
            "branch_ids": task_cfg["branch_ids"],
            "badge": "Sim2Real 平台",
            "title": "六轴臂 Sim2Real 采集平台固化完成",
            "summary": "把仿真-真机映射、影子规划、连续示教、数值 IK 和总线保护整合成一套可直接承接模仿学习与世界模型数据采集的六轴臂实验平台。",
            "metrics": [
                make_metric("机械臂", "6 轴"),
                make_metric("示教录制", "10 Hz"),
                make_metric("Demo", "3 个"),
            ],
            "meta": "已完成 · 具身采集平台",
            "path": f"homepage/tasks/{task_cfg['id']}/",
        }
    ]

    return {
        "id": task_cfg["id"],
        "title": task_cfg["title"],
        "summary": task_cfg["summary"],
        "status": task_cfg["status"],
        "status_group": status_group(task_cfg["status"]),
        "page_path": f"homepage/tasks/{task_cfg['id']}/",
        "branch_ids": task_cfg["branch_ids"],
        "latest_update": latest_update,
        "hero_metrics": [
            make_metric("机械臂", "6 轴"),
            make_metric("IK 精度", "< 8 mm"),
            make_metric("Demo", "3 个"),
        ],
        "report_intro": "这条项目线已经完成平台搭建并固化到“已完成”区：它把六轴臂的 Sim2Real 映射、示教轨迹采集、正逆运动学控制和总线保护整理成了一套可直接复用的具身学习数据采集平台。",
        "summary_cards": summary_cards,
        "timeline_groups": timeline_groups,
        "findings": findings,
        "evidence_links": evidence_links,
        "chart_ids": [],
        "media_items": media_items,
        "home_entries": home_entries,
        "task_badge": "Sim2Real 平台",
        "docs": [repo_rel(path) for path in task_cfg["featured_paths"]],
    }


def build_infra_task(
    task_cfg: dict[str, Any],
    charts: dict[str, Any],
    media_items: list[dict[str, str]],
    research_desk_entries: list[dict[str, Any]],
) -> dict[str, Any]:
    research_desk_path = ROOT / task_cfg["featured_paths"][0]
    fixes_path = ROOT / task_cfg["featured_paths"][1]
    code_structure_path = ROOT / task_cfg["featured_paths"][2]
    compare_path = ROOT / task_cfg["featured_paths"][3]
    fix_entries = parse_fix_entries(limit=6)

    branch_counts = [
        doc_count_under(ROOT / "docs/pdit"),
        doc_count_under(ROOT / "docs/mdit"),
        doc_count_under(ROOT / "docs/lelan"),
    ]
    charts["results-status-overview"] = build_bar_chart(
        "results-status-overview",
        title="任务状态分布",
        description="首页只保留高层状态分布，帮助快速看当前有哪些任务已经形成锚点，哪些还在推进中。",
        categories=["已验证", "推进中", "待结果", "长期维护"],
        values=[1, 1, 1, 1],
        color=LINE_COLORS["rust"],
        fmt="int",
    )
    charts["branch-doc-volume"] = build_bar_chart(
        "branch-doc-volume",
        title="文档沉淀规模",
        description="按支线统计当前 docs 下已沉淀的 Markdown / JSON 文档数量，用来反映哪条研究线的留痕已经成体系。",
        categories=["PDIT", "MDIT", "LeLaN"],
        values=[float(count) for count in branch_counts],
        color=LINE_COLORS["blue"],
        fmt="int",
    )

    timeline_cards = []
    if research_desk_entries:
        for entry in research_desk_entries:
            timeline_cards.append(build_research_desk_timeline_card(entry))
    else:
        for entry in fix_entries:
            timeline_cards.append(
                {
                    "badge": "Infra",
                    "title": entry["title"],
                    "summary": entry["summary"],
                    "date_key": entry["date"],
                    "metrics": [
                        make_metric("日期", entry["date"]),
                        make_metric("类型", "修复"),
                        make_metric("状态", "已记录"),
                    ],
                    "outcome": "这条修复已被收入口径统一的 fixes 账本。",
                    "links": [card_link("fixes.md", fixes_path)],
                }
            )

    timeline_groups = []
    grouped_cards: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for card in timeline_cards:
        grouped_cards[str(card.get("date_key") or card["metrics"][0]["value"])].append(card)
    for date in sorted(grouped_cards.keys(), reverse=True):
        timeline_groups.append({"date": date, "cards": grouped_cards[date]})

    findings = [
        {
            "title": "research_desk 负责阶段总结，fixes 退回事实源",
            "body": "首页与全局时间线优先展示人工提炼过的阶段进展；需要回查具体 bug、run 状态和路径时，再回到 fixes 账本。",
        },
        {
            "title": "跨线路整理终于有了单一入口",
            "body": "PDIT、MDIT、LeLaN 和文档治理的关键阶段变化现在可以汇总到同一份 desk 文档，homepage 不必再从多份自动日志里反向猜结论。",
        },
    ]

    evidence_links = [
        make_link("research_desk.md", research_desk_path, "跨线路阶段总结总账本，供 homepage 优先提炼。"),
        make_link("fixes.md", fixes_path, "全局修复与调试事实源。"),
        make_link("代码结构文档", code_structure_path, "补充仓库结构与模块关系。"),
        make_link("PDIT vs MDIT 对照", compare_path, "帮助解释两条主线的定位差异。"),
    ]

    return {
        "id": task_cfg["id"],
        "title": task_cfg["title"],
        "summary": task_cfg["summary"],
        "status": task_cfg["status"],
        "status_group": status_group(task_cfg["status"]),
        "page_path": f"homepage/tasks/{task_cfg['id']}/",
        "branch_ids": task_cfg["branch_ids"],
        "latest_update": research_desk_entries[0]["date"] if research_desk_entries else (fix_entries[0]["date"] if fix_entries else ""),
        "hero_metrics": [
            make_metric("desk 条目", len(research_desk_entries)),
            make_metric("PDIT docs", branch_counts[0]),
            make_metric("MDIT docs", branch_counts[1]),
        ],
        "report_intro": "这页现在承担全项目阶段总结入口的职责：homepage 优先从 `research_desk.md` 提炼跨线路进展，`fixes.md` 继续保留为事实源和回查源。",
        "summary_cards": [
            {
                "eyebrow": "Research Desk",
                "title": "阶段总结已经从 fixes 日志中抽离出来",
                "body": "research_desk 负责讲清“哪条线现在走到哪里、为什么这样判断、下一步是什么”，避免 homepage 继续从机械式记录里反向拼叙事。",
                "metrics": [
                    make_metric("总结源", "research desk"),
                    make_metric("结构", "固定"),
                    make_metric("写法", "人工提炼"),
                ],
            },
            {
                "eyebrow": "Evidence",
                "title": "事实源和稳定证据文档继续保留",
                "body": "fixes、研究日志、best_path 和各线路稳定文档仍然保留原始事实与证据，desk 只负责把真正改变研究判断的节点压缩出来。",
                "metrics": [
                    make_metric("fixes", len(fix_entries)),
                    make_metric("LeLaN docs", branch_counts[2]),
                    make_metric("状态", "并行保留"),
                ],
            },
        ],
        "timeline_groups": timeline_groups,
        "findings": findings,
        "evidence_links": evidence_links,
        "chart_ids": ["results-status-overview", "branch-doc-volume"],
        "media_items": media_items,
        "home_entries": [],
        "task_badge": "Infra",
        "docs": [repo_rel(path) for path in task_cfg["featured_paths"]],
    }


def build_task(task_cfg: dict[str, Any], charts: dict[str, Any], research_desk_entries: list[dict[str, Any]]) -> dict[str, Any]:
    media_items = build_media_items(task_cfg["id"], task_cfg["title"], task_cfg.get("media_entries"))
    if task_cfg["id"] == "dummy-sim2real-platform":
        return build_dummy_sim2real_task(task_cfg, charts, media_items)
    if task_cfg["id"] == "pdit-anchor":
        return build_pdit_task(task_cfg, charts, media_items)
    if task_cfg["id"] == "mdit-mainline":
        return build_mdit_task(task_cfg, charts, media_items)
    if task_cfg["id"] == "lelan-pipeline":
        return build_lelan_task(task_cfg, charts, media_items)
    if task_cfg["id"] == "infra-audit":
        return build_infra_task(task_cfg, charts, media_items, research_desk_entries)
    raise ValueError(f"Unsupported task id: {task_cfg['id']}")


def build_branch_dashboard_charts(
    branch_id: str,
    related_tasks: list[dict[str, Any]],
    charts: dict[str, Any],
) -> list[str]:
    branch_chart_ids: list[str] = []
    task_by_id = {task["id"]: task for task in related_tasks}

    def register(chart_id: str, chart: dict[str, Any] | None) -> None:
        if not chart:
            return
        chart_copy = copy.deepcopy(chart)
        chart_copy["id"] = chart_id
        charts[chart_id] = chart_copy
        branch_chart_ids.append(chart_id)

    if branch_id == "pdit":
        register(
            "branch-pdit-rank",
            {
                **copy.deepcopy(charts.get("pdit-checkpoint-rank")),
                "title": "PDIT 关键结果排行",
                "description": "研究线页也只保留一张行为结果图，把关键 checkpoint 和长回合复核放在同一张排行条里，直接看当前行为锚点是谁。",
            } if charts.get("pdit-checkpoint-rank") else None,
        )
        register(
            "branch-pdit-loss",
            {
                **copy.deepcopy(charts.get("pdit-loss-tail")),
                "title": "PDIT 最优组 loss 尾段",
                "description": "围绕当前最优组，直接看 train/valid total loss 的尾段关系，而不是重复摆第二张 success 图。",
            } if charts.get("pdit-loss-tail") else None,
        )
        register(
            "branch-pdit-mse",
            {
                **copy.deepcopy(charts.get("pdit-mse-tail")),
                "title": "PDIT 最优组 MSE 尾段",
                "description": "拆开 xyz / rot6d / grip 误差，直接解释当前行为锚点背后的误差结构。",
            } if charts.get("pdit-mse-tail") else None,
        )
        return branch_chart_ids

    if branch_id == "mdit":
        register(
            "branch-mdit-rank",
            {
                **copy.deepcopy(charts.get("mdit-audit-rank")),
                "title": "MDIT 关键结果排行",
                "description": "研究线页同样只保留一张行为结果图，用排行条直接看当前最能代表这条研究线阶段成果的是哪个 checkpoint 或对照结果。",
            } if charts.get("mdit-audit-rank") else None,
        )
        register(
            "branch-mdit-loss",
            {
                **copy.deepcopy(charts.get("mdit-loss-curve")),
                "title": "MDIT 主线 loss 趋势",
                "description": "保留一张完整主线 loss 曲线，直接看 100→500 续训是怎样把训练过程收束下来的。",
            } if charts.get("mdit-loss-curve") else None,
        )
        register(
            "branch-mdit-mse",
            {
                **copy.deepcopy(charts.get("mdit-mse-curve")),
                "title": "MDIT 主线 MSE 变化",
                "description": "把 xyz / rot6d / grip 三条误差拆开，解释 0.75@300/500 是靠哪类误差下降撑起来的。",
            } if charts.get("mdit-mse-curve") else None,
        )
        return branch_chart_ids

    if branch_id == "lelan":
        register(
            "branch-lelan-gate",
            {
                **copy.deepcopy(charts.get("lelan-stage-gates")),
                "title": "LeLaN 阶段 gate 概览",
                "description": "这条线现在更像执行线，最重要的是 gate 与执行规则是否已经固定，而不是先追求复杂结构图。",
            } if charts.get("lelan-stage-gates") else None,
        )
        register(
            "branch-lelan-readiness",
            build_grouped_bar_chart(
                "branch-lelan-readiness",
                title="LeLaN 执行链路就绪度",
                description="把训练、评估、选模和留痕四条链路放在一张分组柱状图里，看这条线现在是不是已经具备长期追加实验的基础。",
                categories=["训练入口", "评估链", "选模规则", "留痕规范"],
                series=[
                    {
                        "name": "已固定",
                        "values": [1.0, 1.0, 1.0, 1.0],
                        "color": LINE_COLORS["teal"],
                    },
                    {
                        "name": "待正式 run 验证",
                        "values": [0.45, 0.45, 0.55, 0.60],
                        "color": LINE_COLORS["gold"],
                    },
                ],
                fmt="percent",
                note="这张图表达的是执行成熟度和 gate 位置，不是行为成功率。",
            ),
        )
        return branch_chart_ids

    if branch_id == "robot-platform":
        register(
            "branch-robot-capabilities",
            build_bar_chart(
                "branch-robot-capabilities",
                title="平台能力构成",
                description="这条线不是训练线，所以图表重点改成展示平台已经打通了哪些关键能力模块。",
                categories=["Sim2Real", "示教轨迹", "FK/IK", "CAN 保护"],
                values=[1.0, 1.0, 1.0, 1.0],
                color=LINE_COLORS["blue"],
                fmt="percent",
                note="四项能力都已经固化，可直接承接真机数据采集。",
            ),
        )
        register(
            "branch-robot-milestones",
            build_rank_bar_chart(
                "branch-robot-milestones",
                title="平台阶段完成度",
                description="按阶段看这套平台从坐标映射、示教录制到控制闭环和总线保护是怎样逐步收口的。",
                rows=[
                    {"label": "阶段 01 运动映射", "value": 0.25, "color": LINE_COLORS["teal"]},
                    {"label": "阶段 02 示教轨迹", "value": 0.5, "color": LINE_COLORS["gold"]},
                    {"label": "阶段 03 FK/IK 闭环", "value": 0.75, "color": LINE_COLORS["blue"]},
                    {"label": "阶段 04 稳定固化", "value": 1.0, "color": LINE_COLORS["rust"]},
                ],
                fmt="percent",
                note="这张图表达的是平台搭建完成度，而不是训练结果。",
            ),
        )
        return branch_chart_ids

    return branch_chart_ids


def build_branches(
    branch_profiles: dict[str, Any],
    tasks: list[dict[str, Any]],
    charts: dict[str, Any],
) -> list[dict[str, Any]]:
    task_map = {task["id"]: task for task in tasks}
    branches = []
    for branch_id, profile in branch_profiles.items():
        related_tasks = [task for task in tasks if branch_id in task["branch_ids"]]
        if not related_tasks:
            continue
        branch_card_copy = build_branch_card_copy(branch_id, profile["title"], related_tasks)
        timeline_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for task in related_tasks:
            for group in task["timeline_groups"]:
                for card in group["cards"]:
                    branch_card = dict(card)
                    branch_card["task_id"] = task["id"]
                    branch_card["task_title"] = task["title"]
                    timeline_groups[group["date"]].append(branch_card)
        merged_timeline = []
        for date in sorted(timeline_groups.keys(), reverse=True):
            merged_timeline.append({"date": date, "cards": timeline_groups[date]})

        related_chart_ids: list[str] = []
        for task in related_tasks:
            for chart_id in task["chart_ids"]:
                if chart_id not in related_chart_ids:
                    related_chart_ids.append(chart_id)
        related_media_items: list[dict[str, Any]] = []
        seen_media_paths: set[str] = set()
        for task in related_tasks:
            for item in task.get("media_items", []):
                media_path = str(item.get("path", ""))
                if not media_path or media_path in seen_media_paths:
                    continue
                seen_media_paths.add(media_path)
                related_media_items.append(copy.deepcopy(item))
        branches.append(
            {
                "id": branch_id,
                "title": profile["title"],
                "summary": profile["summary"],
                "status": profile["status"],
                "status_group": status_group(profile["status"]),
                "page_path": f"homepage/branches/{branch_id}/",
                "latest_update": merged_timeline[0]["date"] if merged_timeline else "",
                "hero_metrics": related_tasks[0]["hero_metrics"],
                "card_title": branch_card_copy["title"],
                "card_summary": branch_card_copy["summary"],
                "card_result": branch_card_copy["result"],
                "detail_intro": f"{branch_card_copy['summary']} {branch_card_copy['result']}".strip(),
                "related_task_ids": [task["id"] for task in related_tasks],
                "timeline_groups": merged_timeline,
                "evidence_links": [make_link(humanize_file_name(path), path) for path in profile.get("featured_paths", [])],
                "chart_ids": related_chart_ids[:3],
                "dashboard_chart_ids": build_branch_dashboard_charts(branch_id, related_tasks, charts),
                "media_items": related_media_items,
                "summary_cards": [
                    {
                        "eyebrow": "Branch",
                        "title": related_tasks[0]["summary_cards"][0]["title"],
                        "body": related_tasks[0]["summary_cards"][0]["body"],
                        "metrics": related_tasks[0]["summary_cards"][0]["metrics"],
                    }
                ],
            }
        )
    return branches


def build_home_sections(tasks: list[dict[str, Any]], research_desk_entries: list[dict[str, Any]]) -> dict[str, Any]:
    done_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    in_progress_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    task_map = {task["id"]: task for task in tasks}
    covered_task_ids = {entry["task_id"] for entry in research_desk_entries if entry["task_id"] != "infra-audit"}

    for entry in research_desk_entries:
        if entry["task_id"] == "infra-audit":
            continue
        task = task_map.get(entry["task_id"])
        if task is None:
            continue
        target = done_groups if task["status_group"] == "done" else in_progress_groups
        target[entry["date"]].append(build_research_desk_home_entry(entry, task))

    for task in tasks:
        if task["id"] == "infra-audit" or task["id"] in covered_task_ids:
            continue
        for entry in task["home_entries"]:
            target = done_groups if entry["group"] == "done" else in_progress_groups
            target[entry["date"]].append(entry)

    def pack(groups: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
        packed = []
        for date in sorted(groups.keys(), reverse=True):
            # 主页卡片保持“最新在前”的阅读顺序，同一天内沿用任务定义顺序。
            cards = list(groups[date])
            packed.append({"date": date, "cards": cards})
        return packed

    done = pack(done_groups)
    in_progress = pack(in_progress_groups)
    current_focus = copy.deepcopy(in_progress[0]["cards"][0]) if in_progress and in_progress[0]["cards"] else None
    if current_focus:
        current_focus["summary"] = first_sentence(current_focus.get("summary", ""), limit=82)

    return {
        "done_groups": done,
        "in_progress_groups": in_progress,
        "current_focus": current_focus,
    }


def build_timeline_page(tasks: list[dict[str, Any]], research_desk_entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    task_map = {task["id"]: task for task in tasks}
    covered_task_ids = {entry["task_id"] for entry in research_desk_entries}

    for entry in research_desk_entries:
        task = task_map.get(entry["task_id"])
        if task is None:
            continue
        timeline_card = build_research_desk_timeline_card(entry)
        timeline_card["task_id"] = task["id"]
        timeline_card["task_title"] = task["title"]
        timeline_card["task_path"] = task["page_path"]
        grouped[entry["date"]].append(timeline_card)

    for task in tasks:
        if task["id"] in covered_task_ids:
            continue
        for group in task["timeline_groups"]:
            for card in group["cards"]:
                timeline_card = dict(card)
                timeline_card["task_id"] = task["id"]
                timeline_card["task_title"] = task["title"]
                timeline_card["task_path"] = task["page_path"]
                grouped[group["date"]].append(timeline_card)
    packed = []
    for date in sorted(grouped.keys(), reverse=True):
        packed.append({"date": date, "cards": grouped[date]})
    return packed


def build_payload(config: dict[str, Any], overrides: dict[str, Any] | None = None) -> dict[str, Any]:
    overrides = strip_private_override_keys(overrides or {})
    charts: dict[str, Any] = {}
    task_overrides = overrides.get("tasks", {})
    branch_overrides = overrides.get("branches", {})
    research_desk_entries = parse_research_desk_entries()
    research_desk_overview_map = parse_research_desk_overview_map()

    tasks = []
    for task_cfg in config["tasks"]:
        task = build_task(task_cfg, charts, research_desk_entries)
        task = apply_research_desk_overview(task, research_desk_overview_map)
        task = merge_task_timeline_with_research_desk(task, research_desk_entries)
        task = deep_merge(task, task_overrides.get(task["id"], {}))
        tasks.append(task)

    branches = build_branches(config["branch_profiles"], tasks, charts)
    branches = [apply_research_desk_overview_to_branch(branch, research_desk_overview_map) for branch in branches]
    branches = [deep_merge(branch, branch_overrides.get(branch["id"], {})) for branch in branches]
    showcase_items = [item for task in tasks for item in task["media_items"]]
    showcase_preview_items = []
    seen_preview_tasks: set[str] = set()
    for item in showcase_items:
        if not item.get("showcase_preview"):
            continue
        if item["task_id"] in seen_preview_tasks:
            continue
        seen_preview_tasks.add(item["task_id"])
        showcase_preview_items.append(item)
    home = build_home_sections(tasks, research_desk_entries)
    timeline_page = build_timeline_page(tasks, research_desk_entries)
    fix_highlights = parse_fix_entries(limit=4)

    stats = {
        "task_count": len(tasks),
        "branch_count": len(branches),
        "timeline_count": sum(len(group["cards"]) for group in timeline_page),
        "validated_rows": sum(len(task["chart_ids"]) for task in tasks if task["chart_ids"]),
    }
    home["hero_inline_stats"] = [
        make_metric("任务", stats["task_count"]),
        make_metric("研究线", stats["branch_count"]),
        make_metric("时间线事件", stats["timeline_count"]),
        make_metric("图表", stats["validated_rows"]),
    ]

    compare_cards = []
    for task in tasks:
        if task["id"] == "infra-audit":
            continue
        compare_cards.append(
            {
                "badge": task.get("task_badge", task["title"]),
                "title": task["title"],
                "summary": task["summary_cards"][0]["title"] if task.get("summary_cards") else task["summary"],
                "metrics": task["hero_metrics"][:3],
            }
        )
    charts["task-anchor-overview"] = build_compare_cards(
        "task-anchor-overview",
        title="当前主任务产出对照",
        description="不用抽象进度圈，而是直接列出各任务当前最重要的成功率、里程碑或产出，让比较口径一眼可读。",
        cards=compare_cards,
    )

    payload = {
        "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "site": deep_merge(config["site"], overrides.get("site", {})),
        "stats": stats,
        "home": home,
        "tasks": tasks,
        "branches": branches,
        "timeline_page_groups": timeline_page,
        "charts": charts,
        "home_chart_ids": overrides.get("home_chart_ids", config["home_charts"]),
        "showcase": {"items": showcase_items, "preview_items": showcase_preview_items},
        "fix_highlights": fix_highlights,
    }
    return deep_merge(payload, overrides.get("payload", {}))


def main() -> None:
    args = parse_args()
    config = read_json(Path(args.config))
    overrides = read_json_if_exists(Path(args.overrides))
    payload = build_payload(config, overrides)
    js = "window.homepageData = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n"
    write_text(Path(args.output), js)
    print(f"Wrote homepage payload to {args.output}")


if __name__ == "__main__":
    main()
