"""Merge kRO extracted JSON and direct text files."""

from __future__ import annotations

import re

from .checks import (
    line_count,
    logic_warnings,
    merge_framed_json,
    normalize_json_pair,
    parse_json_if_needed,
    read_chunk,
    target_from_chunk,
)
from .models import MergeFailure, Output, Row


STRICT_SOURCE_FALLBACK_OUTPUTS = {
    "itemInfo_true.json",
    "OngoingQuestInfoList.json",
    "OngoingQuestInfoList_True.json",
    "tipbox.json",
}
HANGUL_RE = re.compile(r"[가-힣ㄱ-ㅎㅏ-ㅣ]")


def merge_file(rows: list[Row], allow_incomplete: bool, strict_line_count: bool) -> Output:
    repo, logical_path = rows[0].repo, rows[0].logical_path
    output_path = target_from_chunk(rows[0])
    strict_output = any(output_path.endswith(name) for name in STRICT_SOURCE_FALLBACK_OUTPUTS)
    reject_source_fallback = strict_output
    translated_count = sum(row.status == "已翻译" for row in rows)
    skipped_count = sum(row.status == "跳过" for row in rows)
    warnings: list[str] = []

    if rows[0].unit_type == "file":
        row = rows[0]
        if row.status == "已翻译":
            data, source = read_chunk(row, True), read_chunk(row, False)
            line_delta = line_count(data) - line_count(source)
            if output_path.endswith(".json"):
                warnings.extend(logic_warnings(source, data, logical_path))
                data, shape_warnings = normalize_json_pair(
                    source, data, logical_path, reject_source_fallback
                )
                warnings.extend(shape_warnings)
            if line_delta and strict_line_count:
                raise MergeFailure(f"{logical_path}: complete translation changes line count {line_delta}")
            incomplete = 0
        elif row.status == "跳过":
            data, line_delta, incomplete = read_chunk(row, False), 0, 0
        elif allow_incomplete:
            data, line_delta, incomplete = read_chunk(row, False), 0, 1
        else:
            raise MergeFailure(f"{logical_path}: unresolved status {row.status}")
        return Output(
            repo,
            logical_path,
            output_path,
            data,
            rows,
            translated_count,
            skipped_count,
            incomplete,
            line_delta,
            warnings,
        )

    chunks: list[bytes] = []
    incomplete = 0
    line_delta = 0
    for row in rows:
        source = read_chunk(row, False)
        if row.status == "已翻译":
            replacement = read_chunk(row, True)
            delta = line_count(replacement) - line_count(source)
            if output_path.endswith(".json"):
                warnings.extend(logic_warnings(source, replacement, f"{logical_path}/{row.chunk_id}"))
                replacement, shape_warnings = normalize_json_pair(
                    source,
                    replacement,
                    f"{logical_path}/{row.chunk_id}",
                    reject_source_fallback,
                )
                warnings.extend(shape_warnings)
            if delta and strict_line_count:
                raise MergeFailure(f"{logical_path}/{row.chunk_id}: translated line count changes by {delta}")
            line_delta += delta
        elif row.status == "跳过":
            replacement = source
        elif allow_incomplete:
            replacement, incomplete = source, incomplete + 1
        else:
            raise MergeFailure(f"{logical_path}: unresolved status {row.status}")
        chunks.append(replacement)
    data = merge_framed_json(chunks) if output_path.endswith(".json") else b"".join(chunks)
    parse_json_if_needed(output_path, data)
    if strict_output and HANGUL_RE.search(data.decode("utf-8")):
        raise MergeFailure(f"{logical_path}: Hangul remains after translation merge")
    return Output(
        repo,
        logical_path,
        output_path,
        data,
        rows,
        translated_count,
        skipped_count,
        incomplete,
        line_delta,
        warnings,
    )
