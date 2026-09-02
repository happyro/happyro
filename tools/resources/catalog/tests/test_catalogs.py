"""Unit tests for client and server catalog construction."""

from __future__ import annotations

import unittest
from pathlib import Path
from unittest.mock import Mock

from tools.resources.catalog.assets import asset_map, descriptions
from tools.resources.catalog.client import build_catalog as build_client_catalog
from tools.resources.catalog.errors import CatalogError
from tools.resources.catalog.server import build_catalog as build_server_catalog
from tools.resources.catalog.service import generate_client


class ClientCatalogTests(unittest.TestCase):
    def test_builds_bilingual_client_catalog(self) -> None:
        client = {"data": {"501": {"identifiedDisplayName": "红色药水", "identifiedResourceName": "사과"}}}
        server = {"englishSource": {"revision": "abc123"}, "items": {"501": {"names": {"en-US": "Red Potion"}}}}

        catalog = build_client_catalog(client, server, "client.json", "server.json")

        self.assertEqual(catalog["items"]["501"]["names"], {"zh-CN": "红色药水", "en-US": "Red Potion"})
        self.assertNotIn("identifiedDisplayName", catalog["items"]["501"])
        self.assertEqual(catalog["clientSource"]["version"], "kro-20211105")

    def test_rejects_client_item_missing_from_server(self) -> None:
        client = {"data": {"501": {"identifiedDisplayName": "红色药水"}}}
        server = {"englishSource": {"revision": "abc123"}, "items": {}}

        with self.assertRaisesRegex(CatalogError, "missing from Renewal"):
            build_client_catalog(client, server, "client.json", "server.json")

    def test_service_uses_injected_storage_adapters(self) -> None:
        client = {"data": {"501": {"identifiedDisplayName": "红色药水", "identifiedResourceName": "红药", "identifiedDescriptionName": ["恢复 HP"]}}}
        server = {"englishSource": {"revision": "abc123"}, "items": {"501": {"names": {"en-US": "Red Potion"}}}}
        manifest = {"source": "data.grf", "files": []}
        reader = Mock(side_effect=[client, manifest, server])
        catalog_writer = Mock()
        asset_writer = Mock()

        counts = generate_client(
            Path("client.json"),
            Path("server.json"),
            Path("manifest.json"),
            Path("output"),
            reader,
            catalog_writer,
            asset_writer,
        )

        self.assertEqual(counts, {"catalog": 1, "assets": 1, "icons": 0, "illustrations": 0, "descriptions": 1})
        self.assertEqual(reader.call_count, 3)
        catalog_writer.assert_called_once()
        self.assertEqual(asset_writer.call_count, 2)

    def test_builds_client_asset_indexes(self) -> None:
        items = {
            "501": {"identifiedResourceName": "红药", "identifiedDescriptionName": ["恢复 HP"]},
            "502": {"identifiedResourceName": "", "identifiedDescriptionName": ["恢复更多 HP"]},
            "503": {"identifiedResourceName": "只有图标", "identifiedDescriptionName": ["只有图标"]},
            "504": {"identifiedResourceName": "只有大图", "identifiedDescriptionName": ["只有大图"]},
            "505": {"identifiedResourceName": "完全缺失", "identifiedDescriptionName": ["完全缺失"]},
        }

        manifest = {
            "source": "data.grf",
            "files": [
                {"status": "ok", "path": "data/texture/유저인터페이스/item/红药.bmp"},
                {"status": "ok", "path": "data/texture/유저인터페이스/collection/红药.bmp"},
                {"status": "ok", "path": "data/texture/유저인터페이스/item/只有图标.bmp"},
                {"status": "ok", "path": "data/texture/유저인터페이스/collection/只有大图.bmp"},
            ],
        }

        assets = asset_map(items, manifest, "itemInfo.json", "manifest.json")

        self.assertEqual(assets["items"]["501"]["icon"], "texture/유저인터페이스/item/红药.bmp")
        self.assertEqual(assets["items"]["501"]["status"], "complete")
        self.assertEqual(assets["items"]["502"]["status"], "resource_name_missing")
        self.assertEqual(assets["items"]["503"]["status"], "illustration_missing")
        self.assertEqual(assets["items"]["504"]["status"], "icon_missing")
        self.assertEqual(assets["items"]["505"]["status"], "asset_missing")
        self.assertEqual(descriptions(items, "itemInfo.json")["items"]["502"], ["恢复更多 HP"])

    def test_resolves_grf_paths_without_case_sensitivity(self) -> None:
        items = {"552": {"identifiedResourceName": "KETUPAT"}}
        manifest = {
            "files": [
                {"status": "ok", "path": "data/texture/유저인터페이스/item/ketupat.bmp"},
                {"status": "ok", "path": "data/texture/유저인터페이스/collection/ketupat.bmp"},
            ],
        }

        assets = asset_map(items, manifest, "itemInfo.json", "manifest.json")

        self.assertEqual(assets["items"]["552"]["icon"], "texture/유저인터페이스/item/ketupat.bmp")
        self.assertEqual(assets["items"]["552"]["illustration"], "texture/유저인터페이스/collection/ketupat.bmp")

    def test_resolves_grf_mojibake_paths(self) -> None:
        items = {
            "566": {"identifiedResourceName": "똠양꿍"},
            "480000": {"identifiedResourceName": "웤웤망토"},
        }
        manifest = {
            "files": [
                {"status": "ok", "path": "data/texture/유저인터페이스/item/\x8cc양꿍.bmp"},
                {"status": "ok", "path": "data/texture/유저인터페이스/collection/\x8cc양꿍.bmp"},
                {"status": "ok", "path": "data/texture/유저인터페이스/item/\x9fp\x9fp망토.bmp"},
                {"status": "ok", "path": "data/texture/유저인터페이스/collection/\x9fp\x9fp망토.bmp"},
            ],
        }

        assets = asset_map(items, manifest, "itemInfo.json", "manifest.json")

        self.assertEqual(assets["items"]["566"]["status"], "complete")
        self.assertEqual(assets["items"]["480000"]["status"], "complete")

    def test_resolves_unicode_normalized_grf_paths(self) -> None:
        items = {"501": {"identifiedResourceName": "Cafe\u0301"}}
        manifest = {
            "files": [
                {"status": "ok", "path": "data/texture/유저인터페이스/item/Café.bmp"},
            ],
        }

        assets = asset_map(items, manifest, "itemInfo.json", "manifest.json")

        self.assertEqual(assets["items"]["501"]["icon"], "texture/유저인터페이스/item/Café.bmp")

    def test_rejects_ambiguous_case_insensitive_grf_paths(self) -> None:
        items = {"552": {"identifiedResourceName": "KeTuPaT"}}
        manifest = {
            "files": [
                {"status": "ok", "path": "data/texture/유저인터페이스/item/KETUPAT.bmp"},
                {"status": "ok", "path": "data/texture/유저인터페이스/item/ketupat.bmp"},
            ],
        }

        with self.assertRaisesRegex(CatalogError, "ambiguous GRF asset path"):
            asset_map(items, manifest, "itemInfo.json", "manifest.json")


class ServerCatalogTests(unittest.TestCase):
    def test_builds_bilingual_server_catalog(self) -> None:
        current = [{"Id": 501, "AegisName": "Red_Potion", "Name": "红色药水"}]
        english = [{"Id": 501, "AegisName": "Red_Potion", "Name": "Red Potion"}]

        catalog = build_server_catalog("renewal", "abc123", [("db/re/items.yml", current, english)])

        self.assertEqual(catalog["items"]["501"]["names"], {"zh-CN": "红色药水", "en-US": "Red Potion"})
        self.assertNotIn("Name", catalog["items"]["501"])

    def test_rejects_duplicate_ids_across_files(self) -> None:
        item = {"Id": 501, "Name": "红色药水"}
        english = {"Id": 501, "Name": "Red Potion"}

        with self.assertRaisesRegex(CatalogError, "across server files"):
            build_server_catalog(
                "renewal",
                "abc123",
                [("one.yml", [item], [english]), ("two.yml", [item], [english])],
            )


if __name__ == "__main__":
    unittest.main()
