from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
import json
import shutil
from pathlib import Path
from typing import Any, Iterable

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_ROOT = PROJECT_ROOT / "research_archive"
TASKS_ROOT = ARCHIVE_ROOT / "tasks"
TEMPLATES_ROOT = ARCHIVE_ROOT / "templates"
TASK_IDS = ("pdit", "mdit", "lelan", "infra")
DEFAULT_BUCKET_BY_TASK = {
    "pdit": "runs",
    "mdit": "runs",
    "lelan": "runs",
    "infra": "records",
}
ALWAYS_COPY_SUFFIXES = {
    ".md",
    ".json",
    ".jsonl",
    ".yaml",
    ".yml",
    ".csv",
    ".tsv",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".svg",
    ".mp4",
    ".webm",
    ".pdf",
}
LOG_COPY_SUFFIXES = {".log", ".txt"}
NEVER_COPY_SUFFIXES = {".pt", ".pth", ".ckpt", ".bin", ".safetensors"}
LOG_COPY_LIMIT_BYTES = 50 * 1024 * 1024
MAX_COPY_BYTES = 200 * 1024 * 1024
DEMO_IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf"}
DEMO_VIDEO_SUFFIXES = {".mp4", ".webm"}
CHART_SUFFIXES = {".svg"}
TABLE_SUFFIXES = {".csv", ".tsv"}


@dataclass(slots=True)
class ArchiveLayout:
    task_id: str
    bucket: str
    slug: str
    root: Path
    notes_dir: Path
    metrics_dir: Path
    media_dir: Path
    media_demo_dir: Path
    media_demo_images_dir: Path
    media_demo_videos_dir: Path
    media_charts_dir: Path
    media_tables_dir: Path
    artifacts_dir: Path
    report_dir: Path
    report_assets_dir: Path


@dataclass(slots=True)
class TaskMediaLayout:
    task_id: str
    root: Path
    demo_dir: Path
    demo_images_dir: Path
    demo_videos_dir: Path
    charts_dir: Path
    charts_auto_dir: Path
    tables_dir: Path
    tables_auto_dir: Path


def timestamp() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def _json_safe(value: Any) -> Any:
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, dict):
        return {str(key): _json_safe(val) for key, val in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_safe(item) for item in value]
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)


def write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(_json_safe(payload), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def append_jsonl(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(_json_safe(payload), ensure_ascii=False) + "\n")
    return path


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def read_json_if_exists(path: Path | None) -> dict[str, Any] | None:
    if path is None or not path.exists():
        return None
    return read_json(path)


def ensure_archive_scaffold() -> None:
    ARCHIVE_ROOT.mkdir(parents=True, exist_ok=True)
    TASKS_ROOT.mkdir(parents=True, exist_ok=True)
    TEMPLATES_ROOT.mkdir(parents=True, exist_ok=True)
    for task_id in TASK_IDS:
        task_root = TASKS_ROOT / task_id
        task_root.mkdir(parents=True, exist_ok=True)
        media_root = task_root / "media"
        (media_root / "demo" / "images").mkdir(parents=True, exist_ok=True)
        (media_root / "demo" / "videos").mkdir(parents=True, exist_ok=True)
        (media_root / "charts" / "auto").mkdir(parents=True, exist_ok=True)
        (media_root / "tables" / "auto").mkdir(parents=True, exist_ok=True)
        default_bucket = DEFAULT_BUCKET_BY_TASK[task_id]
        (task_root / default_bucket).mkdir(parents=True, exist_ok=True)
        if task_id != "infra":
            (task_root / "milestones").mkdir(parents=True, exist_ok=True)


def slugify(value: str) -> str:
    cleaned = "".join(ch if ch.isalnum() else "_" for ch in str(value).strip().lower())
    cleaned = "_".join(part for part in cleaned.split("_") if part)
    return cleaned or "archive_item"


def _maybe_parse_datetime(value: Any) -> datetime | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    normalized = text.replace("Z", "+00:00")
    for candidate in (
        normalized,
        normalized.replace(" ", "T"),
        normalized.replace("_", " "),
        normalized.replace("_", "T"),
    ):
        try:
            return datetime.fromisoformat(candidate)
        except ValueError:
            continue
    for fmt in (
        "%Y%m%d_%H%M%S",
        "%Y-%m-%d-%H%M%S",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def infer_date_tag(*values: Any, fallback_path: Path | None = None) -> str:
    for value in values:
        parsed = _maybe_parse_datetime(value)
        if parsed is not None:
            return parsed.date().isoformat()
    if fallback_path is not None and fallback_path.exists():
        return datetime.fromtimestamp(fallback_path.stat().st_mtime).date().isoformat()
    return datetime.now().date().isoformat()


def build_run_slug(run_name: str, *, created_at: Any = None, fallback_path: Path | None = None) -> str:
    return f"{infer_date_tag(created_at, fallback_path=fallback_path)}__{slugify(run_name)}"


def build_milestone_slug(name: str, *, created_at: Any = None, fallback_path: Path | None = None) -> str:
    return f"{infer_date_tag(created_at, fallback_path=fallback_path)}__{slugify(name)}"


def ensure_archive_layout(task_id: str, slug: str, *, bucket: str | None = None, create: bool = True) -> ArchiveLayout:
    ensure_archive_scaffold()
    if task_id not in TASK_IDS:
        raise ValueError(f"Unsupported task_id: {task_id}")
    resolved_bucket = bucket or DEFAULT_BUCKET_BY_TASK[task_id]
    root = TASKS_ROOT / task_id / resolved_bucket / slug
    layout = ArchiveLayout(
        task_id=task_id,
        bucket=resolved_bucket,
        slug=slug,
        root=root,
        notes_dir=root / "notes",
        metrics_dir=root / "metrics",
        media_dir=root / "media",
        media_demo_dir=root / "media" / "demo",
        media_demo_images_dir=root / "media" / "demo" / "images",
        media_demo_videos_dir=root / "media" / "demo" / "videos",
        media_charts_dir=root / "media" / "charts",
        media_tables_dir=root / "media" / "tables",
        artifacts_dir=root / "artifacts",
        report_dir=root / "report",
        report_assets_dir=root / "report" / "assets",
    )
    if create:
        for path in (
            layout.root,
            layout.notes_dir,
            layout.metrics_dir,
            layout.media_dir,
            layout.media_demo_dir,
            layout.media_demo_images_dir,
            layout.media_demo_videos_dir,
            layout.media_charts_dir,
            layout.media_tables_dir,
            layout.artifacts_dir,
            layout.report_dir,
            layout.report_assets_dir,
        ):
            path.mkdir(parents=True, exist_ok=True)
    return layout


def ensure_task_media_layout(task_id: str, *, create: bool = True) -> TaskMediaLayout:
    ensure_archive_scaffold()
    if task_id not in TASK_IDS:
        raise ValueError(f"Unsupported task_id: {task_id}")
    root = TASKS_ROOT / task_id / "media"
    layout = TaskMediaLayout(
        task_id=task_id,
        root=root,
        demo_dir=root / "demo",
        demo_images_dir=root / "demo" / "images",
        demo_videos_dir=root / "demo" / "videos",
        charts_dir=root / "charts",
        charts_auto_dir=root / "charts" / "auto",
        tables_dir=root / "tables",
        tables_auto_dir=root / "tables" / "auto",
    )
    if create:
        for path in (
            layout.root,
            layout.demo_dir,
            layout.demo_images_dir,
            layout.demo_videos_dir,
            layout.charts_dir,
            layout.charts_auto_dir,
            layout.tables_dir,
            layout.tables_auto_dir,
        ):
            path.mkdir(parents=True, exist_ok=True)
    return layout


def load_archive_layout(archive_root: Path) -> ArchiveLayout:
    resolved = archive_root.expanduser().resolve()
    relative = resolved.relative_to(TASKS_ROOT)
    task_id, bucket, slug = relative.parts[:3]
    return ensure_archive_layout(task_id, slug, bucket=bucket)


def infer_task_id(*candidates: Any) -> str:
    merged = " ".join(str(value) for value in candidates if value is not None).lower()
    if "lelan" in merged:
        return "lelan"
    if any(token in merged for token in ("mdit", "lane_a", "lane_b", "lane_c", "rgb_text")):
        return "mdit"
    if any(token in merged for token in ("pdit", "baseline", "h1", "h2", "obs3_dit", "ablation")):
        return "pdit"
    return "infra"


def default_source_docs(task_id: str) -> list[Path]:
    docs_root = PROJECT_ROOT / "docs"
    shared = [docs_root / "research_desk.md", docs_root / "fixes.md"]
    if task_id == "pdit":
        return shared + sorted((docs_root / "pdit").glob("*.md"))
    if task_id == "mdit":
        return shared + sorted((docs_root / "mdit").glob("*.md"))
    if task_id == "lelan":
        return shared + sorted((docs_root / "lelan").glob("*.md"))
    return shared + [
        docs_root / "code-structure.md",
        docs_root / "code-structure-zh.md",
        docs_root / "job" / "pdit_job_packaging.md",
    ]


def archive_item_status(
    *,
    summary_path: Path | None,
    audit_report_path: Path | None,
    manifest_path: Path | None,
) -> tuple[str, list[str]]:
    missing: list[str] = []
    if summary_path is None or not summary_path.exists():
        missing.append("summary")
    if audit_report_path is None or not audit_report_path.exists():
        missing.append("audit_report")
    if manifest_path is None or not manifest_path.exists():
        missing.append("experiment_manifest")
    if not missing:
        return "complete", []
    return "incomplete", missing


def should_copy_file(path: Path) -> bool:
    if not path.is_file():
        return False
    suffix = path.suffix.lower()
    size_bytes = path.stat().st_size
    if suffix in NEVER_COPY_SUFFIXES:
        return False
    if size_bytes > MAX_COPY_BYTES:
        return False
    if suffix in ALWAYS_COPY_SUFFIXES:
        return True
    if suffix in LOG_COPY_SUFFIXES and size_bytes <= LOG_COPY_LIMIT_BYTES:
        return True
    return False


def classify_archive_area(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix in {".md"}:
        return "notes"
    if suffix in DEMO_VIDEO_SUFFIXES:
        return "demo_videos"
    if suffix in CHART_SUFFIXES:
        return "charts"
    if suffix in DEMO_IMAGE_SUFFIXES:
        return "demo_images"
    return "metrics"


def _normalized_relative_name(area: str, relative_name: Path) -> Path:
    parts = list(relative_name.parts)
    if not parts:
        return Path(relative_name.name)
    lowered_head = parts[0].lower()
    # 统一去掉外层“images/videos/charts/tables”壳，避免 archive 内再套一层重复目录。
    if area == "demo_images" and lowered_head in {"demo", "image", "images"}:
        parts = parts[1:]
    elif area == "demo_videos" and lowered_head in {"demo", "video", "videos"}:
        parts = parts[1:]
    elif area == "charts" and lowered_head in {"charts", "chart", "assets"}:
        parts = parts[1:]
    elif area == "tables" and lowered_head in {"tables", "table", "assets"}:
        parts = parts[1:]
    return Path(*parts) if parts else Path(relative_name.name)


def _destination_root_for_area(layout: ArchiveLayout, area: str) -> Path:
    if area == "notes":
        return layout.notes_dir
    if area == "demo_images":
        return layout.media_demo_images_dir
    if area == "demo_videos":
        return layout.media_demo_videos_dir
    if area == "charts":
        return layout.media_charts_dir
    if area == "tables":
        return layout.media_tables_dir
    return layout.metrics_dir


def copy_or_index_file(
    *,
    source_path: Path,
    layout: ArchiveLayout,
    area: str,
    relative_name: Path,
    role: str,
    copied_items: list[dict[str, Any]],
    artifact_items: list[dict[str, Any]],
    note: str | None = None,
    dry_run: bool = False,
) -> None:
    resolved = source_path.expanduser().resolve()
    if not resolved.exists() or not resolved.is_file():
        return
    source_size = resolved.stat().st_size
    source_mtime = datetime.fromtimestamp(resolved.stat().st_mtime).astimezone().isoformat(timespec="seconds")
    if should_copy_file(resolved):
        normalized_name = _normalized_relative_name(area, relative_name)
        archive_path = _destination_root_for_area(layout, area) / normalized_name
        copied_items.append(
            {
                "role": role,
                "source_path": str(resolved),
                "archive_path": str(archive_path.relative_to(layout.root)),
                "mode": "copied",
                "size_bytes": source_size,
            }
        )
        if not dry_run:
            archive_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(resolved, archive_path)
        return
    artifact_items.append(
        {
            "role": role,
            "source_path": str(resolved),
            "size_bytes": source_size,
            "mtime": source_mtime,
            "exists": True,
            "note": note or "根据轻量归档规则仅记录索引，不复制该文件。",
        }
    )


def copy_path_tree(
    *,
    source_path: Path,
    layout: ArchiveLayout,
    role_prefix: str,
    copied_items: list[dict[str, Any]],
    artifact_items: list[dict[str, Any]],
    seen_sources: set[Path] | None = None,
    dry_run: bool = False,
) -> None:
    resolved = source_path.expanduser().resolve()
    if not resolved.exists():
        return
    if resolved.is_file():
        if seen_sources is not None and resolved in seen_sources:
            return
        if seen_sources is not None:
            seen_sources.add(resolved)
        copy_or_index_file(
            source_path=resolved,
            layout=layout,
            area=classify_archive_area(resolved),
            relative_name=Path(resolved.name),
            role=role_prefix,
            copied_items=copied_items,
            artifact_items=artifact_items,
            dry_run=dry_run,
        )
        return
    # 目录型证据统一保留相对层级，后续 homepage 或专题页可直接消费。
    for file_path in sorted(resolved.rglob("*")):
        if not file_path.is_file():
            continue
        resolved_file = file_path.expanduser().resolve()
        if seen_sources is not None and resolved_file in seen_sources:
            continue
        if seen_sources is not None:
            seen_sources.add(resolved_file)
        relative = file_path.relative_to(resolved)
        copy_or_index_file(
            source_path=resolved_file,
            layout=layout,
            area=classify_archive_area(file_path),
            relative_name=relative,
            role=f"{role_prefix}::{relative.as_posix()}",
            copied_items=copied_items,
            artifact_items=artifact_items,
            dry_run=dry_run,
        )


def _extract_scalar_history(values: Iterable[Any]) -> list[float]:
    history: list[float] = []
    for value in values:
        if isinstance(value, (int, float)):
            history.append(float(value))
            continue
        if isinstance(value, dict):
            for key in ("value", "loss", "metric", "mse", "success_rate"):
                raw = value.get(key)
                if isinstance(raw, (int, float)):
                    history.append(float(raw))
                    break
    return history


def _build_bar_svg(title: str, labels: list[str], values: list[float], *, color: str = "#3b82f6") -> str:
    width = 900
    height = 380
    chart_left = 80
    chart_top = 60
    chart_width = 760
    chart_height = 240
    max_value = max(values) if values else 1.0
    safe_max = max(max_value, 1e-6)
    slot = chart_width / max(len(values), 1)
    bar_width = max(24.0, slot * 0.48)
    elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" rx="24" fill="#0f172a"/>',
        f'<text x="{chart_left}" y="34" fill="#e2e8f0" font-size="24" font-weight="700">{title}</text>',
        f'<line x1="{chart_left}" y1="{chart_top + chart_height}" x2="{chart_left + chart_width}" y2="{chart_top + chart_height}" stroke="#475569" stroke-width="2"/>',
        f'<line x1="{chart_left}" y1="{chart_top}" x2="{chart_left}" y2="{chart_top + chart_height}" stroke="#475569" stroke-width="2"/>',
    ]
    for index, (label, value) in enumerate(zip(labels, values)):
        bar_height = 0.0 if safe_max <= 0 else chart_height * float(value) / safe_max
        x = chart_left + slot * index + (slot - bar_width) / 2
        y = chart_top + chart_height - bar_height
        elements.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bar_width:.1f}" height="{bar_height:.1f}" rx="10" fill="{color}"/>')
        elements.append(f'<text x="{x + bar_width / 2:.1f}" y="{y - 8:.1f}" text-anchor="middle" fill="#f8fafc" font-size="14">{value:.3f}</text>')
        elements.append(
            f'<text x="{x + bar_width / 2:.1f}" y="{chart_top + chart_height + 26:.1f}" text-anchor="middle" fill="#cbd5e1" font-size="13">{label}</text>'
        )
    elements.append("</svg>")
    return "\n".join(elements)


def _build_line_svg(title: str, series_map: dict[str, list[float]]) -> str:
    width = 960
    height = 420
    chart_left = 80
    chart_top = 60
    chart_width = 800
    chart_height = 260
    palette = ["#38bdf8", "#f97316", "#22c55e", "#e879f9"]
    all_values = [value for series in series_map.values() for value in series]
    if not all_values:
        all_values = [0.0, 1.0]
    min_value = min(all_values)
    max_value = max(all_values)
    span = max(max_value - min_value, 1e-6)
    elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" rx="24" fill="#0f172a"/>',
        f'<text x="{chart_left}" y="34" fill="#e2e8f0" font-size="24" font-weight="700">{title}</text>',
        f'<line x1="{chart_left}" y1="{chart_top + chart_height}" x2="{chart_left + chart_width}" y2="{chart_top + chart_height}" stroke="#475569" stroke-width="2"/>',
        f'<line x1="{chart_left}" y1="{chart_top}" x2="{chart_left}" y2="{chart_top + chart_height}" stroke="#475569" stroke-width="2"/>',
    ]
    for index, (series_name, values) in enumerate(series_map.items()):
        if not values:
            continue
        if len(values) == 1:
            scaled_points = [(chart_left + chart_width / 2, chart_top + chart_height / 2)]
        else:
            scaled_points = []
            for point_index, value in enumerate(values):
                x = chart_left + chart_width * point_index / (len(values) - 1)
                y = chart_top + chart_height - ((float(value) - min_value) / span) * chart_height
                scaled_points.append((x, y))
        path_points = " ".join(f"{x:.1f},{y:.1f}" for x, y in scaled_points)
        color = palette[index % len(palette)]
        elements.append(
            f'<polyline points="{path_points}" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
        )
        for x, y in scaled_points:
            elements.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.5" fill="{color}"/>')
        legend_y = chart_top + chart_height + 36 + index * 22
        elements.append(f'<circle cx="{chart_left + 8}" cy="{legend_y - 5}" r="5" fill="{color}"/>')
        elements.append(f'<text x="{chart_left + 22}" y="{legend_y}" fill="#cbd5e1" font-size="14">{series_name}</text>')
    elements.append("</svg>")
    return "\n".join(elements)


def render_report_assets_for_layout(layout: ArchiveLayout, *, dry_run: bool = False) -> list[str]:
    generated_assets: list[str] = []
    audit_report = read_json_if_exists(layout.metrics_dir / "audit_report.json")
    summary = read_json_if_exists(layout.metrics_dir / "summary.json")

    if audit_report is not None:
        success_by_epoch = audit_report.get("success_by_epoch") or {}
        if success_by_epoch:
            pairs = sorted((int(epoch), float(value)) for epoch, value in success_by_epoch.items())
            svg_text = _build_bar_svg(
                "共享审计成功率",
                [f"@{epoch}" for epoch, _ in pairs],
                [value for _, value in pairs],
                color="#22c55e",
            )
            output_path = layout.report_assets_dir / "success_by_epoch.svg"
            generated_assets.append(str(output_path.relative_to(layout.root)))
            if not dry_run:
                output_path.write_text(svg_text, encoding="utf-8")

        train_loss_history = _extract_scalar_history(audit_report.get("train_loss_history") or [])
        valid_loss_history = _extract_scalar_history(audit_report.get("valid_loss_history") or [])
        if train_loss_history or valid_loss_history:
            series_map: dict[str, list[float]] = {}
            if train_loss_history:
                series_map["train loss"] = train_loss_history
            if valid_loss_history:
                series_map["valid loss"] = valid_loss_history
            svg_text = _build_line_svg("训练损失走势", series_map)
            output_path = layout.report_assets_dir / "loss_curve.svg"
            generated_assets.append(str(output_path.relative_to(layout.root)))
            if not dry_run:
                output_path.write_text(svg_text, encoding="utf-8")

    if summary is not None and not generated_assets:
        epoch_summaries = summary.get("epoch_summaries") or []
        if isinstance(epoch_summaries, list) and epoch_summaries:
            train_values = _extract_scalar_history(epoch_summaries)
            if train_values:
                svg_text = _build_line_svg("训练摘要走势", {"summary": train_values})
                output_path = layout.report_assets_dir / "summary_curve.svg"
                generated_assets.append(str(output_path.relative_to(layout.root)))
                if not dry_run:
                    output_path.write_text(svg_text, encoding="utf-8")
    synced_media_assets: list[str] = []
    for asset_path in sorted(layout.report_assets_dir.rglob("*")):
        if not asset_path.is_file():
            continue
        suffix = asset_path.suffix.lower()
        if suffix in TABLE_SUFFIXES:
            target_path = layout.media_tables_dir / asset_path.name
        else:
            target_path = layout.media_charts_dir / asset_path.name
        synced_media_assets.append(str(target_path.relative_to(layout.root)))
        if not dry_run:
            target_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(asset_path, target_path)
    if not dry_run:
        write_json(
            layout.report_dir / "report_meta.json",
            {
                "schema_version": 1,
                "generated_at": timestamp(),
                "task_id": layout.task_id,
                "bucket": layout.bucket,
                "slug": layout.slug,
                "assets": generated_assets,
                "media_assets": synced_media_assets,
                "notes": ["report/report.md"],
            },
        )
    sync_item_media_to_task_root(layout, dry_run=dry_run)
    return generated_assets


def sync_item_media_to_task_root(layout: ArchiveLayout, *, dry_run: bool = False) -> list[str]:
    task_media_layout = ensure_task_media_layout(layout.task_id, create=not dry_run)
    synced_paths: list[str] = []
    # 任务级 demo 由人工精选维护，避免把 run/record 里的现场证据整批灌进去后再次制造重复目录。
    # 这里仅自动聚合图表与表格；demo 仍保留在 item 级 media/ 里，并允许人工放到 tasks/<task>/media/demo/。
    path_pairs = (
        (layout.media_charts_dir, task_media_layout.charts_auto_dir),
        (layout.media_tables_dir, task_media_layout.tables_auto_dir),
    )
    for source_root, target_root in path_pairs:
        if not source_root.exists():
            continue
        for file_path in sorted(source_root.rglob("*")):
            if not file_path.is_file():
                continue
            relative = file_path.relative_to(source_root)
            # 任务级 media 作为聚合层，按 bucket/slug 再分层，避免不同 run 的同名素材互相覆盖。
            target_path = target_root / layout.bucket / layout.slug / relative
            synced_paths.append(str(target_path.relative_to(TASKS_ROOT / layout.task_id)))
            if not dry_run:
                target_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file_path, target_path)
    return synced_paths


def _report_result_lines(record: dict[str, Any] | None) -> list[str]:
    if record is None:
        return ["- 目前还没有归档到 trial record，需要后续补齐。"]
    lines = []
    for label, key in (
        ("trial_score", "trial_score"),
        ("best_success_rate", "best_success_rate"),
        ("best_success_epoch", "best_success_epoch"),
        ("collapse_detected", "collapse_detected"),
    ):
        value = record.get(key)
        if value is None:
            continue
        lines.append(f"- {label}: `{value}`")
    if not lines:
        return ["- trial record 已归档，但目前没有可展示的核心指标。"]
    return lines


def build_report_markdown(
    *,
    task_id: str,
    run_name: str,
    experiment_name: str,
    description: str,
    record: dict[str, Any] | None,
    copied_items: list[dict[str, Any]],
    artifact_items: list[dict[str, Any]],
) -> str:
    evidence_lines = []
    for item in copied_items[:8]:
        evidence_lines.append(f"- `{item['role']}` -> `{item['archive_path']}`")
    if not evidence_lines:
        evidence_lines.append("- 当前批次没有复制到可直接阅读的证据文件。")
    artifact_lines = []
    for item in artifact_items[:5]:
        artifact_lines.append(f"- `{item['role']}` -> `{item['source_path']}`")
    if not artifact_lines:
        artifact_lines.append("- 当前批次没有只索引未复制的大文件。")
    next_step = "继续补齐 report/assets 并再决定是否同步到 homepage。"
    if record is not None and record.get("pending_offline_audit"):
        next_step = "当前 run 仍处于待共享审计状态，下一步应先跑 finalize/audit 再补齐结论。"
    if record is not None and record.get("collapse_detected"):
        next_step = "当前 run 已被标记为 collapse，下一步应回溯 recipe 漂移、成功率断点和保留 checkpoint。"
    return "\n".join(
        [
            f"# {run_name}",
            "",
            "## 背景",
            "",
            f"- task_id: `{task_id}`",
            f"- experiment_name: `{experiment_name or run_name}`",
            f"- description: {description or '未填写'}",
            "",
            "## 本次验证什么",
            "",
            f"- 围绕 `{experiment_name or run_name}` 固化训练证据、结构化指标和后续可展示素材。",
            "",
            "## 核心结果",
            "",
            *_report_result_lines(record),
            "",
            "## 当前判断",
            "",
            f"- 归档条目已经建立，可作为后续 homepage / 专题页的统一证据入口。",
            "",
            "## 证据索引",
            "",
            *evidence_lines,
            "",
            "## 大产物索引",
            "",
            *artifact_lines,
            "",
            "## 后续动作",
            "",
            f"- {next_step}",
            "",
        ]
    )


def write_archive_payloads(
    *,
    layout: ArchiveLayout,
    manifest: dict[str, Any],
    copied_items: list[dict[str, Any]],
    artifact_items: list[dict[str, Any]],
    report_text: str,
    event_payload: dict[str, Any],
    dry_run: bool = False,
) -> dict[str, Any]:
    sources_payload = {
        "schema_version": 1,
        "generated_at": timestamp(),
        "task_id": layout.task_id,
        "bucket": layout.bucket,
        "slug": layout.slug,
        "items": copied_items,
    }
    artifacts_payload = {
        "schema_version": 1,
        "generated_at": timestamp(),
        "task_id": layout.task_id,
        "bucket": layout.bucket,
        "slug": layout.slug,
        "items": artifact_items,
    }
    if not dry_run:
        write_json(layout.root / "archive_manifest.json", manifest)
        write_json(layout.root / "sources.json", sources_payload)
        write_json(layout.artifacts_dir / "index.json", artifacts_payload)
        (layout.report_dir / "report.md").write_text(report_text, encoding="utf-8")
        append_jsonl(layout.root / "events.jsonl", event_payload)
    return {
        "manifest_path": str(layout.root / "archive_manifest.json"),
        "sources_path": str(layout.root / "sources.json"),
        "artifacts_index_path": str(layout.artifacts_dir / "index.json"),
        "report_path": str(layout.report_dir / "report.md"),
    }


def solidify_run_archive(
    *,
    task_id: str,
    run_dir: Path | None = None,
    trial_record_path: Path | None = None,
    source_docs: Iterable[Path] = (),
    extra_paths: Iterable[Path] = (),
    event_type: str = "solidify",
    bucket: str | None = None,
    dry_run: bool = False,
) -> dict[str, Any]:
    ensure_archive_scaffold()
    resolved_record_path = trial_record_path.expanduser().resolve() if trial_record_path is not None else None
    record = read_json_if_exists(resolved_record_path)
    resolved_run_dir = run_dir.expanduser().resolve() if run_dir is not None else None
    if resolved_run_dir is None and record is not None and record.get("run_dir"):
        resolved_run_dir = Path(str(record["run_dir"])).expanduser().resolve()
    if resolved_run_dir is None and resolved_record_path is None:
        raise ValueError("solidify_run_archive 需要 run_dir 或 trial_record_path。")

    run_name = (
        (record or {}).get("run_name")
        or (None if resolved_run_dir is None else resolved_run_dir.name)
        or (resolved_record_path.stem if resolved_record_path is not None else "run")
    )
    summary_path = None if resolved_run_dir is None else resolved_run_dir / "summary.json"
    audit_report_path = None if resolved_run_dir is None else resolved_run_dir / "audit_report.json"
    manifest_path = None if resolved_run_dir is None else resolved_run_dir / "experiment_manifest.json"
    trial_request_path = None
    if resolved_run_dir is not None:
        trial_request_candidates = [resolved_run_dir / "trial_request.json", resolved_run_dir / "lelan_trial_request.json"]
        trial_request_path = next((path for path in trial_request_candidates if path.exists()), None)
    summary = read_json_if_exists(summary_path)
    audit_report = read_json_if_exists(audit_report_path)
    experiment_manifest = read_json_if_exists(manifest_path)
    created_at = (
        (summary or {}).get("created_at")
        or (experiment_manifest or {}).get("created_at")
        or (record or {}).get("created_at")
    )
    run_slug = build_run_slug(run_name, created_at=created_at, fallback_path=resolved_record_path or resolved_run_dir)
    layout = ensure_archive_layout(task_id, run_slug, bucket=bucket or "runs", create=not dry_run)

    copied_items: list[dict[str, Any]] = []
    artifact_items: list[dict[str, Any]] = []
    seen_sources: set[Path] = set()

    def add_file(path: Path | None, *, area: str, relative_name: Path, role: str, note: str | None = None) -> None:
        if path is None:
            return
        resolved = path.expanduser().resolve()
        if not resolved.exists() or not resolved.is_file() or resolved in seen_sources:
            return
        seen_sources.add(resolved)
        copy_or_index_file(
            source_path=resolved,
            layout=layout,
            area=area,
            relative_name=relative_name,
            role=role,
            copied_items=copied_items,
            artifact_items=artifact_items,
            note=note,
            dry_run=dry_run,
        )

    if resolved_record_path is not None and resolved_record_path.exists():
        add_file(
            resolved_record_path,
            area="metrics",
            relative_name=Path("trial_record.json"),
            role="trial_record",
            note="trial record 是训练/审计阶段的统一外部索引。",
        )
    add_file(summary_path, area="metrics", relative_name=Path("summary.json"), role="summary")
    add_file(audit_report_path, area="metrics", relative_name=Path("audit_report.json"), role="audit_report")
    add_file(manifest_path, area="metrics", relative_name=Path("experiment_manifest.json"), role="experiment_manifest")
    if trial_request_path is not None:
        add_file(trial_request_path, area="metrics", relative_name=Path(trial_request_path.name), role="trial_request")
    if resolved_run_dir is not None:
        for candidate in (
            resolved_run_dir / "config.json",
            resolved_run_dir / "dataset_stats.json",
            resolved_run_dir / "success_eval_history.json",
            resolved_run_dir / "wandb-summary.json",
            resolved_run_dir / "wandb-metadata.json",
        ):
            if candidate.exists():
                add_file(candidate, area="metrics", relative_name=Path(candidate.name), role=candidate.stem)

    for doc_path in source_docs:
        if not doc_path.exists():
            continue
        add_file(doc_path, area="notes", relative_name=Path(doc_path.name), role=f"note::{doc_path.stem}")

    for extra_path in extra_paths:
        if not extra_path.exists():
            continue
        copy_path_tree(
            source_path=extra_path,
            layout=layout,
            role_prefix=f"extra::{extra_path.stem}",
            copied_items=copied_items,
            artifact_items=artifact_items,
            seen_sources=seen_sources,
            dry_run=dry_run,
        )

    if resolved_run_dir is not None:
        for file_path in sorted(resolved_run_dir.rglob("*")):
            if not file_path.is_file():
                continue
            resolved = file_path.expanduser().resolve()
            if resolved in seen_sources:
                continue
            relative = file_path.relative_to(resolved_run_dir)
            area = classify_archive_area(file_path)
            add_file(file_path, area=area, relative_name=relative, role=f"run::{relative.as_posix()}")

    status, missing_items = archive_item_status(
        summary_path=summary_path,
        audit_report_path=audit_report_path,
        manifest_path=manifest_path,
    )
    manifest_payload = {
        "schema_version": 1,
        "archived_at": timestamp(),
        "task_id": task_id,
        "bucket": layout.bucket,
        "slug": layout.slug,
        "run_name": run_name,
        "experiment_name": (record or {}).get("experiment_name") or (summary or {}).get("experiment_name") or run_name,
        "description": (record or {}).get("description") or (summary or {}).get("description") or "",
        "line": (record or {}).get("line") or infer_task_id(run_name),
        "phase": (record or {}).get("phase"),
        "source_run_dir": None if resolved_run_dir is None else str(resolved_run_dir),
        "source_trial_record": None if resolved_record_path is None else str(resolved_record_path),
        "status": status,
        "missing_items": missing_items,
        "trial_score": None if record is None else record.get("trial_score"),
        "best_success_rate": None if record is None else record.get("best_success_rate"),
        "best_success_epoch": None if record is None else record.get("best_success_epoch"),
        "collapse_detected": None if record is None else record.get("collapse_detected"),
    }
    report_text = build_report_markdown(
        task_id=task_id,
        run_name=run_name,
        experiment_name=str(manifest_payload["experiment_name"]),
        description=str(manifest_payload["description"]),
        record=record,
        copied_items=copied_items,
        artifact_items=artifact_items,
    )
    write_result = write_archive_payloads(
        layout=layout,
        manifest=manifest_payload,
        copied_items=copied_items,
        artifact_items=artifact_items,
        report_text=report_text,
        event_payload={
            "timestamp": timestamp(),
            "event_type": event_type,
            "task_id": task_id,
            "run_name": run_name,
            "source_run_dir": None if resolved_run_dir is None else str(resolved_run_dir),
            "source_trial_record": None if resolved_record_path is None else str(resolved_record_path),
            "status": status,
        },
        dry_run=dry_run,
    )
    generated_assets = render_report_assets_for_layout(layout, dry_run=dry_run)
    write_result.update(
        {
            "archive_root": str(layout.root),
            "generated_assets": generated_assets,
            "status": status,
            "missing_items": missing_items,
        }
    )
    return write_result


def archive_directory_as_milestone(
    *,
    task_id: str,
    source_dir: Path,
    milestone_name: str,
    metadata: dict[str, Any] | None = None,
    source_docs: Iterable[Path] = (),
    event_type: str = "milestone",
    dry_run: bool = False,
) -> dict[str, Any]:
    ensure_archive_scaffold()
    resolved_source_dir = source_dir.expanduser().resolve()
    if not resolved_source_dir.exists():
        raise FileNotFoundError(f"Milestone source dir does not exist: {resolved_source_dir}")
    slug = build_milestone_slug(milestone_name, fallback_path=resolved_source_dir)
    layout = ensure_archive_layout(task_id, slug, bucket="milestones", create=not dry_run)
    copied_items: list[dict[str, Any]] = []
    artifact_items: list[dict[str, Any]] = []

    for doc_path in source_docs:
        if not doc_path.exists():
            continue
        copy_or_index_file(
            source_path=doc_path.expanduser().resolve(),
            layout=layout,
            area="notes",
            relative_name=Path(doc_path.name),
            role=f"note::{doc_path.stem}",
            copied_items=copied_items,
            artifact_items=artifact_items,
            dry_run=dry_run,
        )

    for file_path in sorted(resolved_source_dir.rglob("*")):
        if not file_path.is_file():
            continue
        relative = file_path.relative_to(resolved_source_dir)
        copy_or_index_file(
            source_path=file_path.expanduser().resolve(),
            layout=layout,
            area=classify_archive_area(file_path),
            relative_name=relative,
            role=f"milestone::{relative.as_posix()}",
            copied_items=copied_items,
            artifact_items=artifact_items,
            dry_run=dry_run,
        )

    manifest_payload = {
        "schema_version": 1,
        "archived_at": timestamp(),
        "task_id": task_id,
        "bucket": "milestones",
        "slug": layout.slug,
        "milestone_name": milestone_name,
        "source_dir": str(resolved_source_dir),
        "metadata": metadata or {},
        "status": "complete",
        "missing_items": [],
    }
    report_text = "\n".join(
        [
            f"# {milestone_name}",
            "",
            "## 背景",
            "",
            f"- task_id: `{task_id}`",
            f"- source_dir: `{resolved_source_dir}`",
            "",
            "## 核心结果",
            "",
            "- 该目录已经作为 milestone 快照固化，可用于后续 best path / frozen best 展示。",
            "",
            "## 证据索引",
            "",
            *(
                [f"- `{item['role']}` -> `{item['archive_path']}`" for item in copied_items[:10]]
                or ["- 当前没有复制到 milestone 内的轻量证据。"]
            ),
            "",
            "## 后续动作",
            "",
            "- 如需展示到 homepage，可直接消费 report/assets 或补充专题页素材。",
            "",
        ]
    )
    write_result = write_archive_payloads(
        layout=layout,
        manifest=manifest_payload,
        copied_items=copied_items,
        artifact_items=artifact_items,
        report_text=report_text,
        event_payload={
            "timestamp": timestamp(),
            "event_type": event_type,
            "task_id": task_id,
            "milestone_name": milestone_name,
            "source_dir": str(resolved_source_dir),
        },
        dry_run=dry_run,
    )
    generated_assets = render_report_assets_for_layout(layout, dry_run=dry_run)
    write_result["archive_root"] = str(layout.root)
    write_result["generated_assets"] = generated_assets
    return write_result


def archive_document_record(
    *,
    task_id: str,
    source_doc: Path,
    record_name: str | None = None,
    extra_paths: Iterable[Path] = (),
    metadata: dict[str, Any] | None = None,
    event_type: str = "record",
    dry_run: bool = False,
) -> dict[str, Any]:
    ensure_archive_scaffold()
    resolved_doc = source_doc.expanduser().resolve()
    if not resolved_doc.exists():
        raise FileNotFoundError(f"Document does not exist: {resolved_doc}")
    title = record_name or resolved_doc.stem
    slug = build_run_slug(title, fallback_path=resolved_doc)
    layout = ensure_archive_layout(task_id, slug, bucket="records", create=not dry_run)
    copied_items: list[dict[str, Any]] = []
    artifact_items: list[dict[str, Any]] = []
    copy_or_index_file(
        source_path=resolved_doc,
        layout=layout,
        area="notes",
        relative_name=Path(resolved_doc.name),
        role="primary_doc",
        copied_items=copied_items,
        artifact_items=artifact_items,
        dry_run=dry_run,
    )
    for extra_path in extra_paths:
        if not extra_path.exists():
            continue
        copy_path_tree(
            source_path=extra_path,
            layout=layout,
            role_prefix=f"extra::{extra_path.stem}",
            copied_items=copied_items,
            artifact_items=artifact_items,
            dry_run=dry_run,
        )
    manifest_payload = {
        "schema_version": 1,
        "archived_at": timestamp(),
        "task_id": task_id,
        "bucket": "records",
        "slug": layout.slug,
        "record_name": title,
        "source_doc": str(resolved_doc),
        "metadata": metadata or {},
        "status": "complete",
        "missing_items": [],
    }
    report_text = "\n".join(
        [
            f"# {title}",
            "",
            "## 背景",
            "",
            f"- source_doc: `{resolved_doc}`",
            "",
            "## 当前判断",
            "",
            "- 该文档已经被纳入统一 archive，可作为后续专题页或 homepage 摘要的事实源。",
            "",
            "## 证据索引",
            "",
            *(
                [f"- `{item['role']}` -> `{item['archive_path']}`" for item in copied_items]
                or ["- 当前没有复制到 record 内的轻量证据。"]
            ),
            "",
        ]
    )
    write_result = write_archive_payloads(
        layout=layout,
        manifest=manifest_payload,
        copied_items=copied_items,
        artifact_items=artifact_items,
        report_text=report_text,
        event_payload={
            "timestamp": timestamp(),
            "event_type": event_type,
            "task_id": task_id,
            "record_name": title,
            "source_doc": str(resolved_doc),
        },
        dry_run=dry_run,
    )
    sync_item_media_to_task_root(layout, dry_run=dry_run)
    write_result["archive_root"] = str(layout.root)
    return write_result


def build_task_index() -> dict[str, Any]:
    ensure_archive_scaffold()
    tasks_payload: dict[str, Any] = {}
    for task_id in TASK_IDS:
        task_root = TASKS_ROOT / task_id
        task_entry = {"runs": [], "milestones": [], "records": []}
        for bucket in ("runs", "milestones", "records"):
            bucket_root = task_root / bucket
            if not bucket_root.exists():
                continue
            for item_dir in sorted(path for path in bucket_root.iterdir() if path.is_dir()):
                manifest_path = item_dir / "archive_manifest.json"
                manifest = read_json_if_exists(manifest_path)
                task_entry[bucket].append(
                    {
                        "slug": item_dir.name,
                        "path": str(item_dir),
                        "manifest_path": None if manifest_path is None else str(manifest_path),
                        "status": None if manifest is None else manifest.get("status"),
                        "label": (
                            None
                            if manifest is None
                            else manifest.get("run_name")
                            or manifest.get("milestone_name")
                            or manifest.get("record_name")
                        ),
                    }
                )
        tasks_payload[task_id] = task_entry
    return {
        "schema_version": 1,
        "generated_at": timestamp(),
        "tasks": tasks_payload,
    }


def write_task_index() -> Path:
    ensure_archive_scaffold()
    return write_json(ARCHIVE_ROOT / "task_index.json", build_task_index())


def write_migration_report(entries: list[dict[str, Any]], *, dry_run: bool = False) -> Path | None:
    payload = {
        "schema_version": 1,
        "generated_at": timestamp(),
        "entry_count": len(entries),
        "entries": entries,
    }
    if dry_run:
        return None
    return write_json(ARCHIVE_ROOT / "migration_report.json", payload)


def validate_archive_tree() -> dict[str, Any]:
    ensure_archive_scaffold()
    errors: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []
    checked_items = 0
    for task_id in TASK_IDS:
        task_root = TASKS_ROOT / task_id
        for bucket in ("runs", "milestones", "records"):
            bucket_root = task_root / bucket
            if not bucket_root.exists():
                continue
            for item_dir in sorted(path for path in bucket_root.iterdir() if path.is_dir()):
                checked_items += 1
                manifest_path = item_dir / "archive_manifest.json"
                sources_path = item_dir / "sources.json"
                artifacts_path = item_dir / "artifacts" / "index.json"
                report_path = item_dir / "report" / "report.md"
                for required_path, label in (
                    (manifest_path, "archive_manifest"),
                    (sources_path, "sources"),
                    (artifacts_path, "artifacts_index"),
                    (report_path, "report"),
                ):
                    if not required_path.exists():
                        errors.append({"path": str(item_dir), "missing": label})
                manifest = read_json_if_exists(manifest_path)
                if manifest is not None and manifest.get("status") == "incomplete":
                    warnings.append(
                        {
                            "path": str(item_dir),
                            "warning": "incomplete_run",
                            "missing_items": manifest.get("missing_items") or [],
                        }
                    )
                sources = read_json_if_exists(sources_path) or {}
                for item in sources.get("items") or []:
                    source_path = Path(str(item.get("source_path", "")))
                    if not source_path.exists():
                        errors.append(
                            {
                                "path": str(item_dir),
                                "missing": "source_path",
                                "source_path": str(source_path),
                            }
                        )
                artifacts = read_json_if_exists(artifacts_path) or {}
                for item in artifacts.get("items") or []:
                    source_path = Path(str(item.get("source_path", "")))
                    if not source_path.exists():
                        warnings.append(
                            {
                                "path": str(item_dir),
                                "warning": "indexed_source_missing",
                                "source_path": str(source_path),
                            }
                        )
    return {
        "schema_version": 1,
        "generated_at": timestamp(),
        "checked_items": checked_items,
        "error_count": len(errors),
        "warning_count": len(warnings),
        "errors": errors,
        "warnings": warnings,
    }
