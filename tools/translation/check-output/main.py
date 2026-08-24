#!/usr/bin/env python3
"""Check translation chunks without modifying the workspace.

Examples:
    python3 tools/translation/check-output/main.py --agent agent-03
    python3 tools/translation/check-output/main.py --all --root docs/translation/zh-cn/client-server/agents
    python3 tools/translation/check-output/main.py --agent-dir docs/translation/zh-cn/kro-20211105/agents/agent-03

Line-count differences are warnings by default. Use --strict-lines when they
should make the check fail.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
REPLACEMENT_BYTES = b"\xef\xbf\xbd"
TOKEN_CHECKS = (
    ("color code", re.compile(r"\^[0-9A-Fa-f]{6}")),
    ("escape", re.compile(r"\\(?:[nrtbfv'\\]|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})")),
    ("placeholder", re.compile(r"%(?:[0-9]+\$)?[-+0-9.#]*[A-Za-z]|\{[0-9]+\}")),
)


@dataclass
class Result:
    label: str
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    statuses: Counter[str] = field(default_factory=Counter)
    manifest_rows: int = 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent", action="append", help="Agent directory name, relative to --root; repeatable")
    parser.add_argument("--agent-dir", action="append", type=Path, help="Explicit agent directory; repeatable")
    parser.add_argument(
        "--root",
        type=Path,
        default=Path("docs/translation/zh-cn/client-server/agents"),
        help="Root containing agent directories",
    )
    parser.add_argument("--all", action="store_true", help="Check every immediate subdirectory with manifest.tsv")
    parser.add_argument("--strict-lines", action="store_true", help="Treat line-count differences as errors")
    return parser.parse_args()


def display(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


def read_tsv(path: Path) -> list[tuple[int, list[str]]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        return [(line_number, row) for line_number, row in enumerate(csv.reader(handle, delimiter="\t"), 1) if row]


def line_count(data: bytes) -> int:
    if not data:
        return 0
    return data.count(b"\n") + (0 if data.endswith(b"\n") else 1)


def manifest_key(row: list[str]) -> tuple[str, str, str]:
    return row[0], row[1], row[5]


def record_key(row: list[str]) -> tuple[str, str, str]:
    return row[0], row[1], row[2]


def token_differences(source: str, translated: str, expression: re.Pattern[str]) -> list[str]:
    source_counts = Counter(expression.findall(source))
    translated_counts = Counter(expression.findall(translated))
    differences = []
    for token in sorted(source_counts.keys() | translated_counts.keys()):
        if source_counts[token] != translated_counts[token]:
            differences.append(f"{token}: {source_counts[token]} -> {translated_counts[token]}")
    return differences


def check_agent(agent_dir: Path, strict_lines: bool) -> Result:
    result = Result(display(agent_dir))
    manifest_path = agent_dir / "manifest.tsv"
    records_path = agent_dir / "translated-files.tsv"
    if not manifest_path.is_file() or not records_path.is_file():
        result.errors.append(f"missing manifest.tsv or translated-files.tsv under {display(agent_dir)}")
        return result

    manifest_rows = read_tsv(manifest_path)
    record_rows = read_tsv(records_path)
    if not manifest_rows or not record_rows:
        result.errors.append("manifest.tsv or translated-files.tsv is empty")
        return result

    manifest_data = manifest_rows[1:]
    record_data = record_rows[1:]
    result.manifest_rows = len(manifest_data)
    manifest_keys: dict[tuple[str, str, str], int] = {}
    translated_keys: set[tuple[str, str, str]] = set()

    for line_number, row in manifest_data:
        if len(row) < 12:
            result.errors.append(f"{display(manifest_path)}:{line_number}: malformed TSV row")
            continue
        result.statuses[row[10]] += 1
        current_key = manifest_key(row)
        if current_key in manifest_keys:
            result.errors.append(f"{display(manifest_path)}:{line_number}: duplicate manifest key {' '.join(current_key)}")
        manifest_keys[current_key] = line_number

        source_path = agent_dir / row[8]
        translated_path = agent_dir / row[9]
        paths = [source_path] + ([translated_path] if row[10] == "已翻译" else [])
        for file_path in paths:
            if not file_path.is_file():
                result.errors.append(f"{display(manifest_path)}:{line_number}: missing {display(file_path)}")
        if row[10] != "已翻译":
            continue
        translated_keys.add(current_key)
        if not source_path.is_file() or not translated_path.is_file():
            continue

        source_bytes = source_path.read_bytes()
        translated_bytes = translated_path.read_bytes()
        source_text = source_bytes.decode("utf-8", errors="replace")
        translated_text = translated_bytes.decode("utf-8", errors="replace")
        source_replacements = source_bytes.count(REPLACEMENT_BYTES)
        translated_replacements = translated_bytes.count(REPLACEMENT_BYTES)
        relative_translated = display(translated_path)
        if translated_replacements > source_replacements:
            result.errors.append(
                f"{relative_translated}: added U+FFFD replacement characters "
                f"({source_replacements} -> {translated_replacements})"
            )

        for name, expression in TOKEN_CHECKS:
            differences = token_differences(source_text, translated_text, expression)
            if differences:
                result.errors.append(f"{relative_translated}: {name} mismatch ({', '.join(differences)})")

        source_lines = line_count(source_bytes)
        translated_lines = line_count(translated_bytes)
        if source_lines != translated_lines:
            message = f"{relative_translated}: line count {source_lines} -> {translated_lines}"
            (result.errors if strict_lines else result.warnings).append(message)

    record_keys: dict[tuple[str, str, str], int] = {}
    for line_number, row in record_data:
        if len(row) < 5:
            result.errors.append(f"{display(records_path)}:{line_number}: malformed TSV row")
            continue
        current_key = record_key(row)
        if current_key in record_keys:
            result.errors.append(f"{display(records_path)}:{line_number}: duplicate translated record {' '.join(current_key)}")
        record_keys[current_key] = line_number
        if current_key not in manifest_keys:
            result.warnings.append(f"{display(records_path)}:{line_number}: record absent from manifest {' '.join(current_key)}")

    for current_key in sorted(translated_keys):
        if current_key not in record_keys:
            result.errors.append(
                f"{display(manifest_path)}: translated unit absent from translated-files.tsv {' '.join(current_key)}"
            )
    return result


def resolve_agents(args: argparse.Namespace) -> list[Path]:
    root = (ROOT / args.root).resolve() if not args.root.is_absolute() else args.root.resolve()
    paths = []
    if args.agent:
        paths.extend(root / name for name in args.agent)
    if args.agent_dir:
        paths.extend((ROOT / path).resolve() if not path.is_absolute() else path.resolve() for path in args.agent_dir)
    if args.all:
        paths.extend(
            path
            for path in sorted(root.iterdir())
            if path.is_dir() and re.fullmatch(r"agent-\d+", path.name) and (path / "manifest.tsv").is_file()
        )
    if not paths:
        paths.append(root / "agent-03")
    unique = []
    seen = set()
    for path in paths:
        if path not in seen:
            unique.append(path)
            seen.add(path)
    return unique


def main() -> int:
    args = parse_args()
    results = []
    for agent_dir in resolve_agents(args):
        if not agent_dir.is_dir():
            result = Result(display(agent_dir))
            result.errors.append("agent directory does not exist")
        else:
            result = check_agent(agent_dir, args.strict_lines)
        results.append(result)
        statuses = ", ".join(f"{status}={count}" for status, count in result.statuses.items()) or "none"
        print(f"Agent: {result.label}")
        print(f"Manifest rows: {result.manifest_rows}")
        print(f"Statuses: {statuses}")
        print(f"Errors: {len(result.errors)}")
        print(f"Warnings: {len(result.warnings)}")
        for message in result.errors:
            print(f"ERROR {message}")
        for message in result.warnings:
            print(f"WARN  {message}")

    return 1 if any(result.errors for result in results) else 0


if __name__ == "__main__":
    sys.exit(main())
