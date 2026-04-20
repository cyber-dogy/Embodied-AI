from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path
import sys
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from research.archive_writer import ensure_task_media_layout, read_json

GENERATED_PAYLOAD_PATH = REPO_ROOT / "homepage" / "assets" / "generated-homepage-data.js"
ARCHIVE_ROOT = REPO_ROOT / "research_archive" / "tasks"

LINE_COLORS = {
    "teal": "#2b766f",
    "rust": "#b2573f",
    "gold": "#a27a32",
    "blue": "#3e7cb1",
    "coral": "#d4684c",
    "olive": "#6b8f3e",
}


def load_payload() -> dict[str, Any]:
    text = GENERATED_PAYLOAD_PATH.read_text(encoding="utf-8")
    return json.loads(text.split("=", 1)[1].strip().rstrip(";"))


def format_value(value: float | int, fmt: str) -> str:
    if fmt == "percent":
        return f"{float(value):.2f}"
    if fmt == "int":
        return str(int(round(float(value))))
    return f"{float(value):.3f}"


def render_line_svg(chart: dict[str, Any]) -> str:
    width = 980
    height = 420
    left = 74
    top = 70
    right = 32
    bottom = 56
    series_list = chart.get("series", [])
    all_points = [point for series in series_list for point in series.get("points", [])]
    if not all_points:
        raise ValueError(f"{chart['id']} 缺少可绘制的折线数据")
    x_values = [float(point["x"]) for point in all_points]
    y_values = [float(point["y"]) for point in all_points]
    min_x = min(x_values)
    max_x = max(x_values)
    min_y = 0.0 if chart.get("format") == "percent" else min(0.0, min(y_values))
    max_y = max(1.0, max(y_values)) if chart.get("format") == "percent" else max(y_values)

    def scale_x(value: float) -> float:
        domain = max(max_x - min_x, 1.0)
        return left + (value - min_x) / domain * (width - left - right)

    def scale_y(value: float) -> float:
        domain = max(max_y - min_y, 1e-6)
        return height - bottom - (value - min_y) / domain * (height - top - bottom)

    grid_values = [min_y + (max_y - min_y) * ratio for ratio in (0.0, 0.25, 0.5, 0.75, 1.0)]
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" rx="26" fill="#0f172a"/>',
        f'<text x="{left}" y="38" fill="#f8fafc" font-size="26" font-weight="700">{chart["title"]}</text>',
        f'<text x="{left}" y="60" fill="#94a3b8" font-size="14">{chart["description"]}</text>',
    ]
    for value in grid_values:
        y = scale_y(value)
        svg.append(f'<line x1="{left}" y1="{y:.1f}" x2="{width-right}" y2="{y:.1f}" stroke="#334155" stroke-width="1"/>')
        svg.append(
            f'<text x="{left-10}" y="{y+4:.1f}" text-anchor="end" fill="#94a3b8" font-size="12">{format_value(value, chart.get("format", "float"))}</text>'
        )
    svg.append(f'<line x1="{left}" y1="{height-bottom}" x2="{width-right}" y2="{height-bottom}" stroke="#475569" stroke-width="2"/>')

    legend_x = left
    legend_y = height - 16
    for series in series_list:
        points = series.get("points", [])
        if not points:
            continue
        path = " ".join(
            f'{"M" if index == 0 else "L"} {scale_x(float(point["x"])):.1f} {scale_y(float(point["y"])):.1f}'
            for index, point in enumerate(points)
        )
        color = series.get("color", LINE_COLORS["blue"])
        svg.append(f'<path d="{path}" fill="none" stroke="{color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>')
        for point in points:
            svg.append(
                f'<circle cx="{scale_x(float(point["x"])):.1f}" cy="{scale_y(float(point["y"])):.1f}" r="4.4" fill="{color}"/>'
            )
        svg.append(f'<circle cx="{legend_x+8}" cy="{legend_y-5}" r="5" fill="{color}"/>')
        svg.append(f'<text x="{legend_x+22}" y="{legend_y}" fill="#cbd5e1" font-size="14">{series["name"]}</text>')
        legend_x += 170
    svg.append("</svg>")
    return "\n".join(svg)


def render_rank_bar_svg(chart: dict[str, Any]) -> str:
    rows = chart.get("rows", [])
    if not rows:
        raise ValueError(f"{chart['id']} 缺少排行数据")
    width = 980
    row_height = 48
    height = 110 + len(rows) * row_height
    left = 210
    right = 70
    top = 78
    max_value = max(max(float(row["value"]) for row in rows), 1.0)
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" rx="26" fill="#0f172a"/>',
        f'<text x="42" y="38" fill="#f8fafc" font-size="26" font-weight="700">{chart["title"]}</text>',
        f'<text x="42" y="60" fill="#94a3b8" font-size="14">{chart["description"]}</text>',
    ]
    for index, row in enumerate(rows):
        y = top + index * row_height
        value = float(row["value"])
        bar_width = (value / max_value) * (width - left - right)
        color = row.get("color", LINE_COLORS["rust"])
        svg.append(f'<text x="42" y="{y+20}" fill="#cbd5e1" font-size="14">{row["label"]}</text>')
        svg.append(f'<rect x="{left}" y="{y}" width="{width-left-right}" height="18" rx="9" fill="#1e293b"/>')
        svg.append(f'<rect x="{left}" y="{y}" width="{bar_width:.1f}" height="18" rx="9" fill="{color}"/>')
        svg.append(
            f'<text x="{width-right+8}" y="{y+14}" fill="#f8fafc" font-size="13">{format_value(value, chart.get("format", "float"))}</text>'
        )
    svg.append("</svg>")
    return "\n".join(svg)


def write_csv(path: Path, columns: list[str], rows: list[list[Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(columns)
        writer.writerows(rows)


def upsert_captions(task_id: str, entries: dict[str, dict[str, str]]) -> None:
    captions_path = ARCHIVE_ROOT / task_id / "media" / "captions.json"
    payload = read_json(captions_path) if captions_path.exists() else {}
    payload.update(entries)
    captions_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def _find_run(task_id: str, keyword: str, *, exclude_keywords: tuple[str, ...] = ()) -> Path:
    runs_root = ARCHIVE_ROOT / task_id / "runs"
    matches = sorted(
        path
        for path in runs_root.iterdir()
        if path.is_dir()
        and keyword in path.name
        and not any(exclude in path.name for exclude in exclude_keywords)
    )
    if len(matches) != 1:
        raise RuntimeError(f"{task_id} 下用关键字 {keyword} 未能唯一定位 run，当前匹配 {len(matches)} 条。")
    return matches[0]


def _pdit_tables() -> list[tuple[str, list[str], list[list[Any]]]]:
    baseline500 = _find_run("pdit", "baseline_500")
    baseline100 = _find_run("pdit", "baseline_100")
    h1 = _find_run("pdit", "h1_stats_aug_100")
    h2 = _find_run("pdit", "h2_dit_dynamics_100")
    baseline500_audit = read_json(baseline500 / "metrics" / "audit_report.json")
    baseline500_summary = read_json(baseline500 / "metrics" / "summary.json")
    baseline500_recheck = read_json(baseline500 / "metrics" / "root_layout_recheck_100.json")
    baseline100_record = read_json(baseline100 / "metrics" / "trial_record.json")
    h1_record = read_json(h1 / "metrics" / "trial_record.json")
    h2_record = read_json(h2 / "metrics" / "trial_record.json")
    route_rows = [
        ["Baseline@100", "0.90@20", "-", "-", "证明点云主线可训练性恢复"],
        [
            "Baseline@500",
            f"{baseline500_audit['success_by_epoch']['500']:.2f}@20",
            f"{baseline500_recheck['success_rate']:.2f}@100",
            f"{baseline500_summary['epoch_summaries'][-1]['valid']['loss_total']:.3f}",
            "当前行为锚点",
        ],
        ["H1 统计增强", f"{h1_record.get('best_success_rate', 0.0):.2f}@100", "-", "-", "弱于 baseline，不再作为主结论"],
        ["H2 动力学候选", f"{h2_record.get('best_success_rate', 0.0):.2f}@100", "-", "-", "有提升，但证据不足以接管主线"],
    ]
    module_rows = [
        ["时序点云观测", "3 帧点云条件输入", "把几何观测变成稳定的策略输入", "可升级成 RGB / RGB+Text 多模态输入"],
        ["Flow Matching + DiT", "6-block DiT + flow matching", "直接生成未来 action chunk", "可继续接 latent trajectory / world model 表达"],
        ["Action chunk 表达", "32 步动作块", "适配 manipulation 的连续执行过程", "可继续接 subgoal / 层级动作抽象"],
        ["行为审计闭环", "loss + rollout + 20/100 回合复核", "把选模标准和真实行为绑定起来", "后续多模态扩线可以直接复用"],
    ]
    return [
        ("pdit_key_results.csv", ["路线", "关键短审计", "长回合复核", "valid loss 尾段", "当前判断"], route_rows),
        ("pdit_core_modules.csv", ["技术模块", "当前实现", "当前作用", "扩展方向"], module_rows),
    ]


def _mdit_tables() -> list[tuple[str, list[str], list[list[Any]]]]:
    mainline = _find_run("mdit", "rgb_text_3token_100", exclude_keywords=("resume",))
    stabilized = _find_run("mdit", "lane_a_stabilized_100_e0100_20260417_112329")
    faithful = _find_run("mdit", "lane_b_faithful")
    strict_mtdp = _find_run("mdit", "lane_c_mtdp_strict")
    resume = _find_run("mdit", "lane_a_mainline_500_resume")
    mainline_record = read_json(mainline / "metrics" / "trial_record.json")
    mainline_audit = read_json(mainline / "metrics" / "audit_report.json")
    stabilized_record = read_json(stabilized / "metrics" / "trial_record.json")
    faithful_record = read_json(faithful / "metrics" / "trial_record.json")
    strict_record = read_json(strict_mtdp / "metrics" / "trial_record.json")
    resume_record = read_json(resume / "metrics" / "trial_record.json")
    route_rows = [
        [
            "RGB+Text 主线",
            f"0.25@50 / {mainline_audit['success_by_epoch']['100']:.2f}@100",
            f"{resume_record.get('success_300', 0.0):.2f}@300 / {resume_record.get('success_500', 0.0):.2f}@500",
            "当前继续推进的主线",
        ],
        ["Stabilized 对照", "0.35@100", "-", "弱于主线，只保留参考价值"],
        ["Faithful recipe", "-", "-", "首轮卡在启动链，暂不作为方法结论"],
        ["Strict MTDP", "-", "-", "当前未通过同一 gate，不接管主线"],
    ]
    module_rows = [
        ["CLIP 视觉 + 文本编码", "5 路视觉分支 + task text", "把多视角语义和任务语义统一进控制条件", "继续向 VLA 条件策略靠拢"],
        ["3-token 条件融合", "多相机 + 文本 cond token", "压缩多模态条件，便于控制骨架消费", "可继续接更强的语言监督与 subtask prompt"],
        ["Action chunk 预测", "3 帧观测 -> 32 步动作块", "把多模态感知直接接到 manipulation 执行过程", "可扩成分层动作或 latent action 表达"],
        ["共享审计与接管", "同一 lineage 下 100→500 续训", "让路线筛选和长训提升落到同一口径里", "后续世界模型 / VLA 对照能沿用同一 gate"],
    ]
    return [
        ("mdit_key_results.csv", ["路线", "关键点位", "长训结果", "当前判断"], route_rows),
        ("mdit_core_modules.csv", ["技术模块", "当前实现", "当前作用", "扩展方向"], module_rows),
    ]


def render_task_showcase_assets(task_id: str, payload: dict[str, Any], *, dry_run: bool = False) -> None:
    task_media = ensure_task_media_layout(task_id, create=not dry_run)
    charts = {chart["id"]: chart for chart in payload.get("charts", {}).values()}
    if task_id == "pdit":
        chart_specs = [
            ("pdit-checkpoint-rank", "01-pdit_rank_overview.svg", "PDIT 关键结果排行", "把关键 checkpoint 和 100 回合复核放到同一张图里，直接看当前该认哪一个锚点。"),
            ("pdit-loss-tail", "02-pdit_best_loss_curve.svg", "PDIT 最优组 loss 尾段", "围绕当前最优 baseline@500，直接看 train / valid total loss 的尾段关系。"),
            ("pdit-mse-tail", "03-pdit_best_mse_curve.svg", "PDIT 最优组 MSE 尾段", "把 xyz / rot6d / grip 三条误差拆开，解释当前行为锚点背后的误差结构。"),
        ]
        tables = _pdit_tables()
    elif task_id == "mdit":
        chart_specs = [
            ("mdit-audit-rank", "01-mdit_rank_overview.svg", "MDIT 关键结果排行", "把主线关键节点和共享审计结果放到一张图里，直接看当前真正成立的阶段结果。"),
            ("mdit-loss-curve", "02-mdit_mainline_loss_curve.svg", "MDIT 主线 loss 趋势", "围绕 100→500 主线续训，直接看 train / valid total loss 如何收束。"),
            ("mdit-mse-curve", "03-mdit_mainline_mse_curve.svg", "MDIT 主线 MSE 变化", "把 xyz / rot6d / grip 三条误差拆开，解释长训结果为什么能抬到 0.75。"),
        ]
        tables = _mdit_tables()
    else:
        return

    caption_entries: dict[str, dict[str, str]] = {}
    for chart_id, filename, title, caption in chart_specs:
        chart = charts.get(chart_id)
        if chart is None:
            raise RuntimeError(f"generated payload 中缺少图表 {chart_id}")
        if chart["type"] == "line":
            svg_text = render_line_svg(chart)
        elif chart["type"] == "rank_bar":
            svg_text = render_rank_bar_svg(chart)
        else:
            raise RuntimeError(f"{chart_id} 当前暂不支持直接固化为静态图，类型={chart['type']}")
        target = task_media.charts_dir / filename
        caption_entries[f"charts/{filename}"] = {"title": title, "caption": caption, "note": chart.get("note", "")}
        if not dry_run:
            target.write_text(svg_text, encoding="utf-8")

    for filename, columns, rows in tables:
        if not dry_run:
            write_csv(task_media.tables_dir / filename, columns, rows)

    if not dry_run:
        upsert_captions(task_id, caption_entries)


def main() -> int:
    parser = argparse.ArgumentParser(description="为任务线生成可直接展示的精选图表与表格。")
    parser.add_argument("--task-id", choices=("pdit", "mdit"))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    payload = load_payload()
    task_ids = [args.task_id] if args.task_id else ["pdit", "mdit"]
    for task_id in task_ids:
        render_task_showcase_assets(task_id, payload, dry_run=bool(args.dry_run))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
