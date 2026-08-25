"""Executable entry point for the translation release pipeline."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from tools.translation.release.cli import main


if __name__ == "__main__":
    raise SystemExit(main())
