"""Build client image and description indexes from normalized itemInfo."""

from __future__ import annotations

from typing import Any

from .errors import CatalogError


def icon_map(items: dict[str, dict[str, Any]], source: str) -> dict[str, Any]:
    icons: dict[str, str] = {}
    for item_id, item in items.items():
        resource_name = item.get("identifiedResourceName")
        if not isinstance(resource_name, str):
            raise CatalogError(f"invalid identified resource name for item {item_id}")
        if resource_name:
            icons[item_id] = resource_name
    return {"version": 1, "source": source, "items": icons}


def descriptions(items: dict[str, dict[str, Any]], source: str) -> dict[str, Any]:
    result: dict[str, list[str]] = {}
    for item_id, item in items.items():
        lines = item.get("identifiedDescriptionName")
        if not isinstance(lines, list) or not lines or not all(isinstance(line, str) for line in lines):
            raise CatalogError(f"invalid identified description for item {item_id}")
        result[item_id] = lines
    return {"version": 1, "locale": "zh-CN", "source": source, "items": result}
