from __future__ import annotations

import subprocess
import sys
import unittest
from pathlib import Path

from tools.client.build.common import BuildError, Target, lua_string, lua_value, render_source, select_data


ROOT = Path(__file__).resolve().parents[4]


class LuaSerializationTests(unittest.TestCase):
    def test_string_uses_utf8_decimal_escapes(self) -> None:
        self.assertEqual(lua_string('中"\\\n'), '"\\228\\184\\173\\"\\\\\\010"')

    def test_numeric_object_keys_are_lua_numbers(self) -> None:
        rendered = lua_value({"1": "first", "name": [True, 3], "end": "reserved"})
        self.assertIn('[1] = "first"', rendered)
        self.assertIn("name = {", rendered)
        self.assertIn('["end"] = "reserved"', rendered)

    def test_select_data_requires_the_declared_path(self) -> None:
        target = Target("sample.json", "sample.lub", "tbl", ("data",))
        self.assertEqual(select_data({"data": {"1": "ok"}}, target), {"1": "ok"})
        with self.assertRaises(BuildError):
            select_data({}, target)

    def test_towninfo_source_exposes_client_main_entrypoint(self) -> None:
        target = Target("Towninfo.json", "System/Towninfo.lub", "mapNPCInfoTable", entrypoint="towninfo")
        source = render_source(target, '{prontera = {{name = "Guide", X = 1, Y = 2, TYPE = 4}}}')
        self.assertIn("mapNPCInfoTable =", source)
        self.assertIn("function main()", source)
        self.assertIn("AddTownInfo(mapName, entry.name, entry.X, entry.Y, entry.TYPE)", source)

    def test_mapinfo_source_exposes_client_callbacks(self) -> None:
        target = Target("mapInfo_true.json", "System/mapInfo_true.lub", "mapTbl", entrypoint="mapinfo")
        source = render_source(target, '{prontera = {displayName = "Prontera"}}')
        self.assertIn("function main()", source)
        self.assertIn("AddMapDisplayName(mapName, entry.displayName", source)
        self.assertIn("AddMapSignName(mapName", source)
        self.assertIn("AddMapBackgroundBmp(mapName", source)


class HelpTests(unittest.TestCase):
    def test_no_arguments_only_print_friendly_help(self) -> None:
        entry = ROOT / "tools/client/build/lua51/main.py"
        result = subprocess.run(
            [sys.executable, str(entry), "--no-color"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=True,
        )
        self.assertTrue(result.stdout.startswith("\nusage:"))
        self.assertTrue(result.stdout.endswith("\n\n"))
        self.assertIn("examples:\n", result.stdout)
        self.assertNotIn("\033[", result.stdout)


if __name__ == "__main__":
    unittest.main()
