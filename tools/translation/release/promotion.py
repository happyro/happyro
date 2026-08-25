"""Promotion of a validated batch into the formal merged directory."""

from __future__ import annotations

import os
from pathlib import Path
import shutil
import tempfile

from ..merge.models import MergeFailure
from ..merge.paths import display
from .state import save


def promote(
    enabled: bool,
    formal: Path,
    batch_root: Path,
    merged: Path,
    manifest: Path,
    logs: Path,
    write: bool,
    state: dict[str, object],
    state_path: Path,
) -> None:
    if not enabled:
        return
    if formal.resolve() == batch_root.resolve() or formal.resolve().is_relative_to(batch_root.resolve()):
        raise MergeFailure("formal merged directory cannot be inside the release batch")
    operations: list[tuple[Path, Path]] = [
        (source, formal / source.relative_to(merged))
        for source in sorted(merged.rglob("*"))
        if source.is_file()
    ]
    operations.extend([(manifest, formal / "manifest.tsv"), (manifest.parent / "BATCH_STATE", formal / "BATCH_STATE")])
    validation_root = manifest.parent / "validation"
    if validation_root.is_dir():
        operations.extend(
            (source, formal / "validation" / source.relative_to(validation_root))
            for source in sorted(validation_root.rglob("*"))
            if source.is_file()
        )
    log_path = logs / "promote-merged.log"
    logs.mkdir(parents=True, exist_ok=True)
    lines = [f"Formal merged: {display(formal)}", f"Files: {len(operations)}"]
    backup_root = batch_root / "backup/formal-merged"
    for source, destination in operations:
        lines.append(f"{('WRITE' if write else 'PLAN ')} {display(source)} -> {display(destination)}")
        if not write:
            continue
        if destination.is_file():
            backup = backup_root / destination.relative_to(formal)
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
        lines.append("Dry run: no formal merged files written")
    log_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    state["stages"]["promote-merged"] = {"status": "passed", "log": display(log_path), "files": len(operations), "target": display(formal)}
    save(batch_root, state_path, state)
