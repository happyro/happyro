"""Unit tests for client and server catalog construction."""

from __future__ import annotations

import unittest
from pathlib import Path
from unittest.mock import Mock

from tools.resources.item_catalog.assets import descriptions, icon_map
from tools.resources.item_catalog.client import build_catalog as build_client_catalog
from tools.resources.item_catalog.errors import CatalogError
from tools.resources.item_catalog.server import build_catalog as build_server_catalog
from tools.resources.item_catalog.service import generate_client


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
        reader = Mock(side_effect=[client, server])
        catalog_writer = Mock()
        asset_writer = Mock()

        counts = generate_client(Path("client.json"), Path("server.json"), Path("output"), reader, catalog_writer, asset_writer)

        self.assertEqual(counts, {"catalog": 1, "icons": 1, "descriptions": 1})
        self.assertEqual(reader.call_count, 2)
        catalog_writer.assert_called_once()
        self.assertEqual(asset_writer.call_count, 2)

    def test_builds_client_asset_indexes(self) -> None:
        items = {
            "501": {"identifiedResourceName": "红药", "identifiedDescriptionName": ["恢复 HP"]},
            "502": {"identifiedResourceName": "", "identifiedDescriptionName": ["恢复更多 HP"]},
        }

        self.assertEqual(icon_map(items, "itemInfo.json")["items"], {"501": "红药"})
        self.assertEqual(descriptions(items, "itemInfo.json")["items"]["502"], ["恢复更多 HP"])


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
