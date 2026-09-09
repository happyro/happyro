"""Build the catalog whose record set is defined by client itemInfo."""

from __future__ import annotations

import re
from typing import Any

from .errors import CatalogError


CLIENT_RESOURCE_VERSION = "kro-20211105"
CARD_SUFFIX = "_card"
ENGLISH_CARD_SUFFIX = " card"


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
    monster_items: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    missing = sorted(set(client_items) - set(server_items), key=int)
    if missing:
        raise CatalogError(f"client items missing from Renewal server catalog: {missing[:10]}")
    card_names = monster_card_names(server_items, monster_items)
    result: dict[str, dict[str, Any]] = {}
    for item_id, client_item in client_items.items():
        names = server_items[item_id].get("names")
        english_name = names.get("en-US") if isinstance(names, dict) else None
        chinese_name = client_item.get("identifiedDisplayName")
        if not isinstance(english_name, str) or not english_name.strip():
            raise CatalogError(f"missing English server name for client item {item_id}")
        if not isinstance(chinese_name, str) or not chinese_name.strip():
            raise CatalogError(f"missing Chinese client name for item {item_id}")
        monster_name = card_names.get(item_id)
        if monster_name is not None:
            chinese_name = f"{monster_name}卡片"
        item = {
            key: value
            for key, value in client_item.items()
            if key not in {"unidentifiedDisplayName", "identifiedDisplayName"}
        }
        item["names"] = {"zh-CN": chinese_name, "en-US": english_name}
        result[item_id] = item
    return dict(sorted(result.items(), key=lambda pair: int(pair[0])))


def monster_card_names(
    server_items: dict[str, dict[str, Any]],
    monster_items: dict[str, dict[str, Any]],
) -> dict[str, str]:
    aegis_names = unique_monster_names(monster_items, lambda monster: monster.get("AegisName"), str.casefold)
    english_names = unique_monster_names(
        monster_items,
        lambda monster: localized_name(monster, "en-US"),
        normalized_english_name,
    )
    dropped_by: dict[str, set[str]] = {}
    for monster in monster_items.values():
        chinese_name = localized_name(monster, "zh-CN")
        if chinese_name is None:
            continue
        drops = monster.get("Drops")
        if not isinstance(drops, list):
            continue
        for drop in drops:
            item_name = drop.get("Item") if isinstance(drop, dict) else None
            if isinstance(item_name, str) and item_name:
                dropped_by.setdefault(item_name.casefold(), set()).add(chinese_name)

    result: dict[str, str] = {}
    for item_id, item in server_items.items():
        if item.get("Type") != "Card":
            continue
        aegis_name = item.get("AegisName")
        english_name = localized_name(item, "en-US")
        is_named_card = (
            isinstance(aegis_name, str) and aegis_name.casefold().endswith(CARD_SUFFIX)
        ) or (
            isinstance(english_name, str) and english_name.casefold().endswith(ENGLISH_CARD_SUFFIX)
        )
        monster_name = None
        if isinstance(aegis_name, str) and aegis_name.casefold().endswith(CARD_SUFFIX):
            monster_name = aegis_names.get(aegis_name[:-len(CARD_SUFFIX)].casefold())
        if monster_name is None and isinstance(english_name, str) and english_name.casefold().endswith(ENGLISH_CARD_SUFFIX):
            monster_name = english_names.get(normalized_english_name(english_name[:-len(ENGLISH_CARD_SUFFIX)]))
        if monster_name is None and is_named_card and isinstance(aegis_name, str):
            candidates = dropped_by.get(aegis_name.casefold(), set())
            if len(candidates) == 1:
                monster_name = next(iter(candidates))
        if monster_name is not None:
            result[item_id] = monster_name
    return result


def unique_monster_names(monster_items, source_name, normalize) -> dict[str, str]:
    candidates: dict[str, set[str]] = {}
    for monster in monster_items.values():
        name = source_name(monster)
        chinese_name = localized_name(monster, "zh-CN")
        if isinstance(name, str) and name and chinese_name is not None:
            candidates.setdefault(normalize(name), set()).add(chinese_name)
    return {key: next(iter(names)) for key, names in candidates.items() if len(names) == 1}


def localized_name(record: dict[str, Any], locale: str) -> str | None:
    names = record.get("names")
    name = names.get(locale) if isinstance(names, dict) else None
    return name.strip() if isinstance(name, str) and name.strip() else None


def normalized_english_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.casefold()).strip()


def build_catalog(
    client_payload: dict[str, Any],
    server_payload: dict[str, Any],
    monster_payload: dict[str, Any],
    client_path: str,
    server_path: str,
    monster_path: str,
) -> dict[str, Any]:
    client_items = indexed_items(client_payload, "data", "client itemInfo")
    server_items = indexed_items(server_payload, "items", "server catalog")
    monster_items = indexed_items(monster_payload, "monsters", "monster catalog")
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
        "monsterNameSource": {"path": monster_path, "schema": monster_payload.get("schema")},
        "items": build_items(client_items, server_items, monster_items),
    }
