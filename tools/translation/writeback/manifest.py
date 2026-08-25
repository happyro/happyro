"""Manifest and batch-state readers for translation writeback."""

from __future__ import annotations

import csv
from pathlib import Path

from ..merge.models import MergeFailure
from ..merge.paths import display


MANIFEST_COLUMNS = (
    "repo", "path", "output_path", "unit_count", "translated_count", "skipped_count",
    "incomplete_count", "line_delta", "warning_count", "status",
)


def read_manifest(path: Path) -> list[dict[str, str]]:
    try:
        with path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            if tuple(reader.fieldnames or ()) != MANIFEST_COLUMNS:
                raise MergeFailure(f"{display(path)}: unexpected manifest header")
            rows = list(reader)
    except OSError as error:
        raise MergeFailure(f"cannot read manifest {display(path)}: {error}") from error
    if not rows:
        raise MergeFailure(f"{display(path)}: manifest is empty")
    return rows


def read_batch_state(manifest: Path) -> dict[str, str]:
    state_path = manifest.parent / "BATCH_STATE"
    if not state_path.is_file():
        return {}
    try:
        values: dict[str, str] = {}
        for raw_line in state_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            values[key.strip()] = value.strip()
        return values
    except OSError as error:
        raise MergeFailure(f"cannot read batch state {display(state_path)}: {error}") from error
