"""Shared data types and manifest constants for translation merging."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


AGENT_COLUMNS = (
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
TERMINAL = {"已翻译", "跳过"}
INCOMPLETE = {"待处理", "进行中", "阻塞"}


@dataclass(frozen=True)
class Row:
    agent: str
    values: dict[str, str]
    source: Path
    translated: Path

    @property
    def repo(self) -> str:
        return self.values["repo"]

    @property
    def logical_path(self) -> str:
        return self.values["path"]

    @property
    def unit_type(self) -> str:
        return self.values["unit_type"]

    @property
    def chunk_id(self) -> str:
        return self.values["chunk_id"]

    @property
    def status(self) -> str:
        return self.values["status"]

    @property
    def start_line(self) -> int:
        return int(self.values["start_line"])

    @property
    def end_line(self) -> int:
        return int(self.values["end_line"])


@dataclass
class Output:
    repo: str
    logical_path: str
    output_path: str
    data: bytes
    rows: list[Row]
    translated: int
    skipped: int
    incomplete: int
    line_delta: int
    warnings: list[str]


class MergeFailure(Exception):
    """A user-actionable merge validation error."""

