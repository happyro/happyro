"""Compiled LUB and direct-text runtime publishing."""

from __future__ import annotations

import os
from pathlib import Path
import shutil
import tempfile

from ..merge.models import MergeFailure
from ..merge.paths import ROOT, display, resolve
from .state import save


def publish(
    runtime_arg: Path | None,
    artifacts: Path,
    merged: Path,
    batch_root: Path,
    logs: Path,
    write: bool,
    state: dict[str, object],
    state_path: Path,
) -> None:
    if not runtime_arg:
        return
    runtime_root = resolve(runtime_arg)
    try:
        runtime_root.relative_to((ROOT / "inputs/runtime").resolve())
    except ValueError as error:
        raise MergeFailure("--runtime-root must be under inputs/runtime") from error
    operations: list[tuple[Path, Path]] = []
    for artifact_root in (artifacts / "lua50", artifacts / "lua51"):
        operations.extend((source, runtime_root / source.relative_to(artifact_root)) for source in sorted(artifact_root.rglob("*.lub")))
    text_root = merged / "text"
    operations.extend((source, runtime_root / source.relative_to(text_root)) for source in sorted(text_root.rglob("*")) if source.is_file())
    destinations: set[Path] = set()
    for _, destination in operations:
        if destination in destinations:
            raise MergeFailure(f"duplicate runtime destination: {display(destination)}")
        destinations.add(destination)
    logs.mkdir(parents=True, exist_ok=True)
    log_path = logs / "runtime-writeback.log"
    lines = [f"Runtime root: {display(runtime_root)}", f"Files: {len(operations)}"]
    backup_root = batch_root / "backup/runtime"
    for source, destination in operations:
        lines.append(f"{('WRITE' if write else 'PLAN ')} {display(source)} -> {display(destination)}")
        if not write:
            continue
        if destination.is_file():
            backup = backup_root / destination.relative_to(runtime_root)
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(destination, backup)
        destination.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=destination.parent, prefix=f".{destination.name}.", delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(source.read_bytes())
        try:
            os.replace(temporary, destination)
        finally:
            temporary.unlink(missing_ok=True)
    if not write:
        lines.append("Dry run: no runtime files written")
    log_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    state["stages"]["runtime-writeback"] = {"status": "passed", "log": display(log_path), "files": len(operations)}
    save(batch_root, state_path, state)
