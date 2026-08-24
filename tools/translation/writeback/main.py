#!/usr/bin/env python3
"""Executable entry point for translation writeback."""

from __future__ import annotations

from pathlib import Path
import sys


if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
    from tools.translation.writeback.cli import main
else:
    from .cli import main


if __name__ == "__main__":
    raise SystemExit(main())
