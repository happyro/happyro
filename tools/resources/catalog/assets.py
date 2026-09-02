"""Build client image and description indexes from normalized itemInfo."""

from __future__ import annotations

import unicodedata
from collections import defaultdict
from typing import Any, Callable

from .errors import CatalogError


ICON_ROOT = "data/texture/유저인터페이스/item"
ILLUSTRATION_ROOT = "data/texture/유저인터페이스/collection"


def asset_map(
    items: dict[str, dict[str, Any]],
    manifest: dict[str, Any],
    item_source: str,
    manifest_source: str,
) -> dict[str, Any]:
    paths = manifest_paths(manifest)
    normalized_paths = path_index(paths, normalize_path)
    folded_paths = path_index(paths, lambda path: normalize_path(path).casefold())
    assets: dict[str, dict[str, str | None]] = {}
    for item_id, item in items.items():
        resource_name = item.get("identifiedResourceName")
        if not isinstance(resource_name, str):
            raise CatalogError(f"invalid identified resource name for item {item_id}")
        icon = resolve_asset(resource_name, ICON_ROOT, paths, normalized_paths, folded_paths)
        illustration = resolve_asset(resource_name, ILLUSTRATION_ROOT, paths, normalized_paths, folded_paths)
        assets[item_id] = {
            "resourceName": resource_name or None,
            "icon": relative_resource_path(icon),
            "illustration": relative_resource_path(illustration),
            "status": asset_status(resource_name, icon, illustration),
        }
    return {
        "version": 1,
        "itemSource": item_source,
        "manifestSource": manifest_source,
        "items": assets,
    }


def manifest_paths(manifest: dict[str, Any]) -> set[str]:
    files = manifest.get("files")
    if not isinstance(files, list):
        raise CatalogError("GRF manifest must contain a files array")
    paths: set[str] = set()
    for entry in files:
        if not isinstance(entry, dict) or entry.get("status") != "ok":
            continue
        path = entry.get("path")
        if isinstance(path, str) and path:
            paths.add(path.replace("\\", "/"))
    return paths


def path_index(paths: set[str], key: Callable[[str], str]) -> dict[str, list[str]]:
    index: dict[str, list[str]] = defaultdict(list)
    for path in paths:
        index[key(path)].append(path)
    return index


def resolve_asset(
    resource_name: str,
    root: str,
    paths: set[str],
    normalized_paths: dict[str, list[str]],
    folded_paths: dict[str, list[str]],
) -> str | None:
    if not resource_name:
        return None
    expected = f"{root}/{resource_name}.bmp"
    if expected in paths:
        return expected
    normalized = unique_match(normalized_paths.get(normalize_path(expected), []), expected)
    if normalized:
        return normalized
    return unique_match(folded_paths.get(normalize_path(expected).casefold(), []), expected)


def unique_match(matches: list[str], expected: str) -> str | None:
    if len(matches) > 1:
        raise CatalogError(f"ambiguous GRF asset path for {expected}: {sorted(matches)}")
    return matches[0] if matches else None


def normalize_path(path: str) -> str:
    return unicodedata.normalize("NFC", path)


def relative_resource_path(path: str | None) -> str | None:
    return path.removeprefix("data/") if path else None


def asset_status(resource_name: str, icon: str | None, illustration: str | None) -> str:
    if not resource_name:
        return "resource_name_missing"
    if icon and illustration:
        return "complete"
    if not icon and not illustration:
        return "asset_missing"
    return "icon_missing" if not icon else "illustration_missing"


def descriptions(items: dict[str, dict[str, Any]], source: str) -> dict[str, Any]:
    result: dict[str, list[str]] = {}
    for item_id, item in items.items():
        lines = item.get("identifiedDescriptionName")
        if not isinstance(lines, list) or not lines or not all(isinstance(line, str) for line in lines):
            raise CatalogError(f"invalid identified description for item {item_id}")
        result[item_id] = lines
    return {"version": 1, "locale": "zh-CN", "source": source, "items": result}
