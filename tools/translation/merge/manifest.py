"""Read and group per-agent translation manifests."""

from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

from .models import AGENT_COLUMNS, INCOMPLETE, TERMINAL, MergeFailure, Row
from .paths import display, safe_relative


def read_rows(agents_root: Path) -> list[Row]:
    if not agents_root.is_dir():
        raise MergeFailure(f"agents directory does not exist: {display(agents_root)}")
    rows: list[Row] = []
    seen: set[tuple[str, str, str]] = set()
    for manifest in sorted(agents_root.glob("agent-*/manifest.tsv")):
        agent_root = manifest.parent
        with manifest.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            if tuple(reader.fieldnames or ()) != AGENT_COLUMNS:
                raise MergeFailure(f"{display(manifest)}: unexpected manifest header")
            for line_number, values in enumerate(reader, 2):
                if any(value is None for value in values.values()):
                    raise MergeFailure(f"{display(manifest)}:{line_number}: malformed TSV row")
                if values["status"] not in TERMINAL | INCOMPLETE:
                    raise MergeFailure(f"{display(manifest)}:{line_number}: unknown status {values['status']}")
                key = (values["repo"], values["path"], values["chunk_id"])
                if key in seen:
                    raise MergeFailure(f"duplicate work unit: {'/'.join(key)}")
                seen.add(key)
                try:
                    source = (agent_root / values["source_chunk"]).resolve()
                    translated = (agent_root / values["translated_chunk"]).resolve()
                    safe_relative(source, agent_root, "source chunk")
                    safe_relative(translated, agent_root, "translated chunk")
                    start = int(values["start_line"])
                    end = int(values["end_line"])
                except (ValueError, MergeFailure) as error:
                    raise MergeFailure(f"{display(manifest)}:{line_number}: {error}") from error
                if start < 1 or end < start:
                    raise MergeFailure(f"{display(manifest)}:{line_number}: invalid line range")
                rows.append(Row(manifest.parent.name, values, source, translated))
    if not rows:
        raise MergeFailure(f"no agent manifests found under {display(agents_root)}")
    return rows


def group_rows(rows: list[Row]) -> dict[tuple[str, str], list[Row]]:
    groups: dict[tuple[str, str], list[Row]] = defaultdict(list)
    for row in rows:
        groups[(row.repo, row.logical_path)].append(row)
    return groups


def rows_for_file(rows: list[Row], key: tuple[str, str]) -> list[Row]:
    selected = sorted(rows, key=lambda row: (row.start_line, row.agent, row.chunk_id))
    if not selected:
        raise MergeFailure(f"no rows for {key[0]}/{key[1]}")
    unit_types = {row.unit_type for row in selected}
    if len(unit_types) != 1:
        raise MergeFailure(f"{key[0]}/{key[1]} mixes file and chunk work units")
    if selected[0].unit_type == "chunk":
        for previous, current in zip(selected, selected[1:]):
            if previous.end_line + 1 != current.start_line:
                raise MergeFailure(
                    f"{key[0]}/{key[1]} has non-contiguous ranges near {current.chunk_id}"
                )
    return selected
