"""Build the catalog whose record set is defined by client itemInfo."""

from __future__ import annotations

from typing import Any

from .errors import CatalogError


CLIENT_RESOURCE_VERSION = "kro-20211105"


def indexed_items(payload: dict[str, Any], field: str, source: str) -> dict[str, dict[str, Any]]:
    raw_items = payload.get(field)
    if not isinstance(raw_items, dict):
        raise CatalogError(f"{source} must contain an object at {field}")
    items: dict[str, dict[str, Any]] = {}
    for raw_id, item in raw_items.items():
        if not str(raw_id).isdigit() or not isinstance(item, dict):
            raise CatalogError(f"invalid {source} item entry: {raw_id}")
        item_id = str(int(raw_id))
        if item_id in items:
            raise CatalogError(f"duplicate {source} item ID: {item_id}")
        items[item_id] = item
    return items


def build_items(
    client_items: dict[str, dict[str, Any]],
    server_items: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    missing = sorted(set(client_items) - set(server_items), key=int)
    if missing:
        raise CatalogError(f"client items missing from Renewal server catalog: {missing[:10]}")
    result: dict[str, dict[str, Any]] = {}
    for item_id, client_item in client_items.items():
        names = server_items[item_id].get("names")
        english_name = names.get("en-US") if isinstance(names, dict) else None
        chinese_name = client_item.get("identifiedDisplayName")
        if not isinstance(english_name, str) or not english_name.strip():
            raise CatalogError(f"missing English server name for client item {item_id}")
        if not isinstance(chinese_name, str) or not chinese_name.strip():
            raise CatalogError(f"missing Chinese client name for item {item_id}")
        item = {
            key: value
            for key, value in client_item.items()
            if key not in {"unidentifiedDisplayName", "identifiedDisplayName"}
        }
        item["names"] = {"zh-CN": chinese_name, "en-US": english_name}
        result[item_id] = item
    return dict(sorted(result.items(), key=lambda pair: int(pair[0])))


def build_catalog(
    client_payload: dict[str, Any],
    server_payload: dict[str, Any],
    client_path: str,
    server_path: str,
) -> dict[str, Any]:
    client_items = indexed_items(client_payload, "data", "client itemInfo")
    server_items = indexed_items(server_payload, "items", "server catalog")
    source = server_payload.get("englishSource")
    revision = source.get("revision") if isinstance(source, dict) else None
    if not isinstance(revision, str) or not revision:
        raise CatalogError("server catalog must identify its English source revision")
    return {
        "schema": "item-catalog/v2",
        "version": 1,
        "mode": "client-only",
        "locales": ["zh-CN", "en-US"],
        "clientSource": {
            "version": CLIENT_RESOURCE_VERSION,
            "path": client_path,
            "schema": client_payload.get("schema", "itemInfo_true"),
        },
        "serverEnglishSource": {"path": server_path, "revision": revision},
        "items": build_items(client_items, server_items),
    }
