from __future__ import annotations

import unittest

from tools.translation.merge.checks import (
    validate_html_structure,
    validate_protected_resource_file,
    validate_yaml_structure,
)
from tools.translation.merge.models import MergeFailure


class YamlStructureTests(unittest.TestCase):
    def test_allows_translated_value(self) -> None:
        validate_yaml_structure(
            b"  - Id: 19779\n    Name: Costume Persika\n",
            "  - Id: 19779\n    Name: Persika 服装\n".encode(),
            "server/db/re/item_db_equip.yml/chunk-0206",
        )

    def test_rejects_missing_key(self) -> None:
        with self.assertRaisesRegex(MergeFailure, "YAML key or structural indentation changed"):
            validate_yaml_structure(
                b"    Name: Costume Persika\n",
                "    Persika 服装\n".encode(),
                "server/db/re/item_db_equip.yml/chunk-0206",
            )

    def test_rejects_changed_indentation(self) -> None:
        with self.assertRaisesRegex(MergeFailure, "YAML key or structural indentation changed"):
            validate_yaml_structure(
                b"    Name: Sword\n",
                "\tName: 剑\n".encode(),
                "server/db/pre-re/item_db_equip.yml/chunk-0001",
            )

    def test_allows_colon_text_inside_block_scalar(self) -> None:
        validate_yaml_structure(
            b"    Help: |\n      Params: <char name>. Search by name.\n    Command: next\n",
            "    Help: |\n      参数：<char name>。按名称搜索。\n    Command: next\n".encode(),
            "server/conf/atcommands.yml/chunk-0001",
        )

    def test_ignores_non_yaml_files(self) -> None:
        validate_yaml_structure(
            b"Name: original\n",
            b"translated text\n",
            "client/src/example.js/chunk-0001",
        )


class ProtectedResourceTests(unittest.TestCase):
    def test_rejects_translated_resource_name(self) -> None:
        with self.assertRaisesRegex(MergeFailure, "protected resource mapping"):
            validate_protected_resource_file(
                b"JobNameTable[1] = 'novice';\n",
                "JobNameTable[1] = '新手';\n".encode(),
                "client/src/DB/Jobs/JobNameTable.js/full",
            )

    def test_allows_unchanged_resource_mapping(self) -> None:
        content = b"export default { 1: 'Angel_Wing' };\n"
        validate_protected_resource_file(
            content,
            content,
            "client/src/DB/Items/RobeTable.js/full",
        )

    def test_rejects_translated_resource_chunk(self) -> None:
        with self.assertRaisesRegex(MergeFailure, "protected resource mapping"):
            validate_protected_resource_file(
                b"export default { 0: 'Novice' };\n",
                "export default { 0: '初心者' };\n".encode(),
                "client/src/DB/Monsters/MonsterTable.js/chunk-0001",
            )


class HtmlStructureTests(unittest.TestCase):
    def test_allows_visible_text_translation(self) -> None:
        validate_html_structure(
            b'<button class="tab" data-text="1465">Item</button>\n',
            '<button class="tab" data-text="1465">消耗品</button>\n'.encode(),
            "client/src/UI/Inventory.html/full",
        )

    def test_rejects_missing_closing_tag(self) -> None:
        with self.assertRaisesRegex(MergeFailure, "HTML tags or protected attributes changed"):
            validate_html_structure(
                b'<div><button class="tab">Item</button></div>\n',
                '<div><button class="tab">物品</button>\n'.encode(),
                "client/src/UI/Inventory.html/full",
            )

    def test_rejects_changed_resource_attribute(self) -> None:
        with self.assertRaisesRegex(MergeFailure, "HTML tags or protected attributes changed"):
            validate_html_structure(
                b'<button data-background="inventory/button.bmp"></button>\n',
                b'<button data-background="inventory/translated.bmp"></button>\n',
                "client/src/UI/Inventory.html/full",
            )


if __name__ == "__main__":
    unittest.main()
