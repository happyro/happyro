"""Validate translated agent chunks before merging."""

from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

from .common import display, read_tsv, resolve_agents


REPLACEMENT_BYTES = b"\xef\xbf\xbd"
TOKEN_CHECKS = (
    ("color code", re.compile(r"\^[0-9A-Fa-f]{6}")),
    ("escape", re.compile(r"\\(?:[nrtbfv'\\]|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})")),
    ("placeholder", re.compile(r"%(?:[0-9]+\$)?[-+0-9.#]*[A-Za-z]|\{[0-9]+\}")),
)
LEGACY_BYTE_ESCAPE_PATHS = {("client", "src/DB/Items/RobeTable.js")}


@dataclass
class Result:
    label: str
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    statuses: Counter[str] = field(default_factory=Counter)
    manifest_rows: int = 0


def line_count(data: bytes) -> int:
    if not data:
        return 0
    return data.count(b"\n") + (0 if data.endswith(b"\n") else 1)


def manifest_key(row: list[str]) -> tuple[str, str, str]:
    return row[0], row[1], row[5]


def record_key(row: list[str]) -> tuple[str, str, str]:
    # kRO translated-files.tsv has an explicit unit column before chunk_id;
    # client-server files use chunk_id in the third column.
    chunk_id = row[3] if len(row) >= 4 and row[2] in {"chunk", "file"} else row[2]
    return row[0], row[1], chunk_id


def token_differences(source: str, translated: str, expression: re.Pattern[str]) -> list[str]:
    source_counts = Counter(expression.findall(source))
    translated_counts = Counter(expression.findall(translated))
    return [
        f"{token}: {source_counts[token]} -> {translated_counts[token]}"
        for token in sorted(source_counts.keys() | translated_counts.keys())
        if source_counts[token] != translated_counts[token]
    ]


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
            result.errors.append(
                f"{display(manifest_path)}:{line_number}: duplicate manifest key {' '.join(current_key)}"
            )
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

        token_checks = TOKEN_CHECKS
        if (row[0], row[1]) in LEGACY_BYTE_ESCAPE_PATHS:
            token_checks = tuple(item for item in TOKEN_CHECKS if item[0] != "escape")
        for name, expression in token_checks:
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
            result.errors.append(
                f"{display(records_path)}:{line_number}: duplicate translated record {' '.join(current_key)}"
            )
        record_keys[current_key] = line_number
        if current_key not in manifest_keys:
            result.warnings.append(
                f"{display(records_path)}:{line_number}: record absent from manifest {' '.join(current_key)}"
            )

    for current_key in sorted(translated_keys):
        if current_key not in record_keys:
            result.errors.append(
                f"{display(manifest_path)}: translated unit absent from translated-files.tsv {' '.join(current_key)}"
            )
    return result


def run(root: Path, agents: list[str], agent_dirs: list[Path], all_agents: bool, strict_lines: bool) -> int:
    results = []
    for agent_dir in resolve_agents(root, agents, agent_dirs, all_agents):
        if not agent_dir.is_dir():
            result = Result(display(agent_dir))
            result.errors.append("agent directory does not exist")
        else:
            result = check_agent(agent_dir, strict_lines)
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
