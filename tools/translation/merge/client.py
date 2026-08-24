"""Merge HappyRO client/server source files."""

from __future__ import annotations

from pathlib import Path

from .checks import (
    convert_newlines,
    logic_warnings,
    line_count,
    normalize_newlines,
    preferred_newline,
    read_chunk,
    validate_chunk_line_count,
)
from .models import TERMINAL, MergeFailure, Output, Row
from .paths import safe_relative


def merge_file(
    key: tuple[str, str],
    rows: list[Row],
    repo_roots: dict[str, Path],
    allow_incomplete: bool,
    strict_line_count: bool,
) -> Output:
    repo, logical_path = key
    base_root = repo_roots.get(repo)
    if base_root is None:
        raise MergeFailure(f"{repo}/{logical_path}: no repository mapping")
    base_path = (base_root / logical_path).resolve()
    safe_relative(base_path, base_root, "source file")
    if not base_path.is_file():
        raise MergeFailure(f"missing source file: {base_path}")
    base = base_path.read_bytes()
    translated_count = sum(row.status == "已翻译" for row in rows)
    skipped_count = sum(row.status == "跳过" for row in rows)
    warnings: list[str] = []

    if rows[0].unit_type == "file":
        row = rows[0]
        if row.status == "已翻译":
            data = read_chunk(row, translated=True)
            line_delta = line_count(data) - line_count(base)
            warnings.extend(logic_warnings(base, data, f"{repo}/{logical_path}"))
            if line_delta and strict_line_count:
                raise MergeFailure(f"{repo}/{logical_path}: complete translation changes line count {line_delta}")
            incomplete = 0
        elif row.status == "跳过":
            data, line_delta, incomplete = base, 0, 0
        elif allow_incomplete:
            data, line_delta, incomplete = base, 0, 1
        else:
            raise MergeFailure(f"{repo}/{logical_path}: unresolved status {row.status}")
        return Output(
            repo,
            logical_path,
            f"{repo}/{logical_path}",
            convert_newlines(data, preferred_newline(base)),
            rows,
            translated_count,
            skipped_count,
            incomplete,
            line_delta,
            warnings,
        )

    base_lines = base.splitlines(keepends=True)
    output: list[bytes] = []
    source_cursor = 0
    incomplete = 0
    line_delta = 0
    newline = preferred_newline(base)
    for row in rows:
        source = read_chunk(row, translated=False)
        validate_chunk_line_count(row, source)
        base_chunk = b"".join(base_lines[row.start_line - 1 : row.end_line])
        if normalize_newlines(base_chunk) != normalize_newlines(source):
            raise MergeFailure(f"{repo}/{logical_path}/{row.chunk_id}: source chunk differs from repository")
        if row.status == "已翻译":
            replacement = read_chunk(row, translated=True)
            actual = line_count(replacement)
            expected = row.end_line - row.start_line + 1
            warnings.extend(logic_warnings(source, replacement, f"{repo}/{logical_path}/{row.chunk_id}"))
            if actual != expected and strict_line_count:
                raise MergeFailure(
                    f"{repo}/{logical_path}/{row.chunk_id}: translated line count {actual}, expected {expected}"
                )
            line_delta += actual - expected
        elif row.status == "跳过":
            replacement = source
        elif allow_incomplete:
            replacement, incomplete = source, incomplete + 1
        else:
            raise MergeFailure(f"{repo}/{logical_path}: unresolved status {row.status}")
        output.extend(base_lines[source_cursor : row.start_line - 1])
        output.extend(convert_newlines(replacement, newline).splitlines(keepends=True))
        source_cursor = row.end_line
    output.extend(base_lines[source_cursor:])
    return Output(
        repo,
        logical_path,
        f"{repo}/{logical_path}",
        b"".join(output),
        rows,
        translated_count,
        skipped_count,
        incomplete,
        line_delta,
        warnings,
    )
