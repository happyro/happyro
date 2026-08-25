"""Release batch state persistence."""

from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path


def timestamp() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def save(root: Path, state_path: Path, state: dict[str, object]) -> None:
    root.mkdir(parents=True, exist_ok=True)
    state["updated_at"] = timestamp()
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_batch(manifest: Path, workspace: str, batch: str, status: str) -> None:
    path = manifest.parent / "BATCH_STATE"
    path.write_text(
        f"state={status}\nworkspace={workspace}\nbatch={batch}\nupdated_at={timestamp()}\n",
        encoding="utf-8",
    )
