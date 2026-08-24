"""Write merged files and provenance reports."""

from __future__ import annotations

import csv
from pathlib import Path

from .models import Output


def write_manifest(path: Path, outputs: list[Output], omitted: list[tuple[str, str]]) -> None:
    columns = (
        "repo", "path", "output_path", "unit_count", "translated_count", "skipped_count",
        "incomplete_count", "line_delta", "warning_count", "status",
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns, delimiter="\t", lineterminator="\n")
        writer.writeheader()
        for output in outputs:
            status = "不完整" if output.incomplete else ("需复核" if output.line_delta or output.warnings else "已合并")
            writer.writerow({
                "repo": output.repo,
                "path": output.logical_path,
                "output_path": output.output_path,
                "unit_count": len(output.rows),
                "translated_count": output.translated,
                "skipped_count": output.skipped,
                "incomplete_count": output.incomplete,
                "line_delta": output.line_delta,
                "warning_count": len(output.warnings),
                "status": status,
            })
        for repo, logical_path in omitted:
            writer.writerow({
                "repo": repo,
                "path": logical_path,
                "output_path": "",
                "unit_count": "",
                "translated_count": "0",
                "skipped_count": "",
                "incomplete_count": "0",
                "line_delta": "0",
                "warning_count": "0",
                "status": "无译文，未输出",
            })


def write_warnings(path: Path, outputs: list[Output]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, delimiter="\t", lineterminator="\n")
        writer.writerow(("repo", "path", "output_path", "warning"))
        for output in outputs:
            for warning in output.warnings:
                writer.writerow((output.repo, output.logical_path, output.output_path, warning))

