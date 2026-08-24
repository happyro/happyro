"""Shared path and manifest helpers for translation validation."""

from __future__ import annotations

import csv
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
MANIFEST_COLUMNS = (
    "repo",
    "path",
    "domain",
    "text_scope",
    "unit_type",
    "chunk_id",
    "start_line",
    "end_line",
    "source_chunk",
    "translated_chunk",
    "status",
    "notes",
)
TRANSLATED = "已翻译"


def resolve(path: Path) -> Path:
    return (ROOT / path).resolve() if not path.is_absolute() else path.resolve()


def display(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


def read_tsv(path: Path) -> list[tuple[int, list[str]]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        return [
            (line_number, row)
            for line_number, row in enumerate(csv.reader(handle, delimiter="\t"), 1)
            if row
        ]


def resolve_agents(root: Path, names: list[str], explicit: list[Path], all_agents: bool) -> list[Path]:
    root = resolve(root)
    paths: list[Path] = [root / name for name in names]
    paths.extend(resolve(path) for path in explicit)
    if all_agents:
        paths.extend(
            path
            for path in sorted(root.iterdir())
            if path.is_dir() and re.fullmatch(r"agent-\d+", path.name) and (path / "manifest.tsv").is_file()
        )
    if not paths:
        paths.append(root / "agent-03")
    unique: list[Path] = []
    seen: set[Path] = set()
    for path in paths:
        path = path.resolve()
        if path not in seen:
            unique.append(path)
            seen.add(path)
    return unique


def read_manifest(agent_dir: Path) -> list[dict[str, str]]:
    path = agent_dir / "manifest.tsv"
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        if tuple(reader.fieldnames or ()) != MANIFEST_COLUMNS:
            raise ValueError(f"{display(path)}: unexpected manifest header")
        return list(reader)

