"""Build bilingual server item catalogs from current and historical rAthena data."""

from __future__ import annotations

from typing import Any

from .errors import CatalogError


ITEM_TYPES = ("equip", "usable", "etc")
MODES = {"renewal": "re", "pre-renewal": "pre-re"}
DEFAULT_ENGLISH_REF = "2fe6ab3dc4d8"


def body(payload: dict[str, Any], source: str) -> list[dict[str, Any]]:
    items = payload.get("Body")
    if not isinstance(items, list):
        raise CatalogError(f"invalid item database body: {source}")
    return [item for item in items if isinstance(item, dict) and "Id" in item]


def by_id(items: list[dict[str, Any]], source: str) -> dict[int, dict[str, Any]]:
    result: dict[int, dict[str, Any]] = {}
    for item in items:
        try:
            item_id = int(item["Id"])
        except (KeyError, TypeError, ValueError) as error:
            raise CatalogError(f"invalid item ID in {source}") from error
        if item_id in result:
            raise CatalogError(f"duplicate item ID {item_id} in {source}")
        result[item_id] = item
    return result


def build_items(
    current_items: list[dict[str, Any]],
    english_items: list[dict[str, Any]],
    source: str,
) -> dict[str, dict[str, Any]]:
    english = by_id(english_items, f"English {source}")
    result: dict[str, dict[str, Any]] = {}
    for item_id, current in by_id(current_items, source).items():
        chinese_name = current.get("Name")
        english_name = english.get(item_id, {}).get("Name")
        if not isinstance(chinese_name, str) or not chinese_name.strip():
            raise CatalogError(f"missing Chinese name for item {item_id}")
        if not isinstance(english_name, str) or not english_name.strip():
            raise CatalogError(f"missing English name for item {item_id}")
        normalized = {key: value for key, value in current.items() if key not in {"Id", "Name"}}
        normalized["names"] = {"zh-CN": chinese_name, "en-US": english_name}
        result[str(item_id)] = normalized
    return result


def build_catalog(
    mode: str,
    revision: str,
    source_items: list[tuple[str, list[dict[str, Any]], list[dict[str, Any]]]],
) -> dict[str, Any]:
    items: dict[str, dict[str, Any]] = {}
    sources: list[str] = []
    for path, current, english in source_items:
        built = build_items(current, english, path)
        overlap = set(items) & set(built)
        if overlap:
            raise CatalogError(f"duplicate item IDs across server files: {sorted(overlap, key=int)[:10]}")
        items.update(built)
        sources.append(path)
    return {
        "schema": "item-catalog/v2",
        "version": 3,
        "mode": mode,
        "locales": ["zh-CN", "en-US"],
        "source": sources,
        "englishSource": {"repository": "repos/happyro-server", "revision": revision},
        "items": dict(sorted(items.items(), key=lambda pair: int(pair[0]))),
    }
