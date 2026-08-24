#!/usr/bin/env python3
"""Executable entry point for the translation merge CLI."""

from __future__ import annotations

from pathlib import Path
import sys


if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
    from translation.merge.cli import main
else:
    from .cli import main


if __name__ == "__main__":
    raise SystemExit(main())
