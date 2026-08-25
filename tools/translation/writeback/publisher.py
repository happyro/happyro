"""Build and publish manifest-listed writeback operations."""

from __future__ import annotations

import hashlib
import os
from pathlib import Path
import shutil
import tempfile

from ..merge.models import MergeFailure
from ..merge.paths import display
from .targets import relative_output


Operation = tuple[str, Path, Path, Path, bytes]


def atomic_write(destination: Path, data: bytes) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=destination.parent, prefix=f".{destination.name}.", delete=False) as handle:
        temporary = Path(handle.name)
        handle.write(data)
    try:
        os.replace(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)


def build_operations(rows: list[dict[str, str]], merged_root: Path, targets: dict[str, Path]) -> list[Operation]:
    operations: list[Operation] = []
    for row in rows:
        if not row["output_path"] or row["status"] == "无译文，未输出":
            continue
        repo = row["repo"]
        if repo not in targets:
            raise MergeFailure(f"no target root for repository {repo}")
        relative = relative_output(repo, row["output_path"])
        source = (merged_root / Path(row["output_path"])).resolve()
        try:
            source.relative_to(merged_root.resolve())
        except ValueError as error:
            raise MergeFailure(f"merged output escapes root: {row['output_path']}") from error
        if not source.is_file():
            raise MergeFailure(f"missing merged output: {display(source)}")
        operations.append((repo, relative, source, targets[repo].resolve() / relative, source.read_bytes()))
    seen: set[Path] = set()
    for _, _, _, destination, _ in operations:
        if destination in seen:
            raise MergeFailure(f"duplicate write destination: {display(destination)}")
        seen.add(destination)
    return operations


def publish(operations: list[Operation], backup_root: Path | None, write: bool) -> None:
    print(f"Files: {len(operations)}")
    for repo, relative, source, destination, data in operations:
        digest = hashlib.sha256(data).hexdigest()[:12]
        print(f"{('WRITE' if write else 'PLAN ')} {display(source)} -> {display(destination)} ({digest})")
        if not write:
            continue
        if backup_root and destination.is_file():
            backup = backup_root / repo / relative
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(destination, backup)
        atomic_write(destination, data)
    if not write:
        print("Dry run: no files written")
