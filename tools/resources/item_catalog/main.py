"""Executable entry point for HappyRO item catalog generation."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from tools.resources.item_catalog.cli import main


if __name__ == "__main__":
    raise SystemExit(main())
