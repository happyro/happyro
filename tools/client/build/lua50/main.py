#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))

from tools.client.build.common import Target, execute


TARGETS = (
    Target(
        input_name="System_MsgString_lua50.json",
        output_path="System/MsgString.lub",
        global_name="SetupMSG",
        data_path=("SetupMSG",),
    ),
)


if __name__ == "__main__":
    raise SystemExit(execute("5.0", TARGETS, sys.argv[1:]))
