"""Subprocess stage execution and logging."""

from __future__ import annotations

from pathlib import Path
import subprocess
import sys

from ..merge.models import MergeFailure
from ..merge.paths import display
from .state import save


def run(
    name: str,
    command: list[str],
    root: Path,
    logs: Path,
    state: dict[str, object],
    state_path: Path,
    paint,
) -> None:
    logs.mkdir(parents=True, exist_ok=True)
    log_path = logs / f"{name}.log"
    print(paint(f"== {name} ==", "1;33", "--no-color" not in sys.argv))
    print("$ " + " ".join(str(item) for item in command))
    process = subprocess.run(command, cwd=root, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    log_path.write_text(process.stdout, encoding="utf-8")
    print(process.stdout, end="")
    if process.returncode:
        state["stages"][name] = {"status": "failed", "log": display(log_path)}
        state["status"] = "failed"
        save(root, state_path, state)
        raise MergeFailure(f"stage {name} failed; see {display(log_path)}")
    state["stages"][name] = {"status": "passed", "log": display(log_path)}
    save(root, state_path, state)
