"""Writeback target and output-path safety checks."""

from __future__ import annotations

from pathlib import Path

from ..merge.models import MergeFailure
from ..merge.paths import ROOT, display


def relative_output(repo: str, output_path: str) -> Path:
    candidate = Path(output_path)
    if candidate.is_absolute() or ".." in candidate.parts:
        raise MergeFailure(f"unsafe output path: {output_path}")
    if candidate.parts[:1] == (repo,):
        candidate = Path(*candidate.parts[1:])
    if not candidate.parts:
        raise MergeFailure(f"empty output path for {repo}")
    return candidate


def validate_target(path: Path) -> None:
    resolved = path.resolve()
    try:
        parts = resolved.relative_to(ROOT).parts
    except ValueError:
        parts = ()
    if parts[:1] == ("inputs",):
        raise MergeFailure(f"refusing to write protected source root: {display(path)}")
