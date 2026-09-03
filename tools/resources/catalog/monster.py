"""Build a bilingual monster catalog from server and client sources."""

from __future__ import annotations

import ast
import re
from pathlib import Path
from typing import Any

from .errors import CatalogError
from .server import by_id, body

CLIENT_VERSION = "kro-20211105"
TABLE_ENTRY = re.compile(r"^\s*(\d+):\s*(['\"])(.*?)\2,?\s*$")


def javascript_table(source: str, label: str) -> dict[int, str]:
    result: dict[int, str] = {}
    for line in source.splitlines():
        match = TABLE_ENTRY.match(line)
        if not match:
            continue
        monster_id = int(match.group(1))
        try:
            value = ast.literal_eval(f"{match.group(2)}{match.group(3)}{match.group(2)}")
        except (SyntaxError, ValueError) as error:
            raise CatalogError(f"invalid JavaScript string for monster {monster_id} in {label}") from error
        if monster_id in result:
            raise CatalogError(f"duplicate monster ID {monster_id} in {label}")
        result[monster_id] = value
    if not result:
        raise CatalogError(f"no monster entries found in {label}")
    return result


def build_catalog(current_payload: dict[str, Any], english_payload: dict[str, Any], names: dict[int, str],
                  sprites: dict[int, str], revision: str, server_source: str,
                  client_sources: list[str]) -> dict[str, Any]:
    current = by_id(body(current_payload, server_source), server_source)
    english = by_id(body(english_payload, f"{revision}:db/re/mob_db.yml"), revision)
    if set(current) != set(english):
        raise CatalogError("current and English monster databases contain different IDs")
    monsters: dict[str, dict[str, Any]] = {}
    for monster_id, record in current.items():
        english_name = english[monster_id].get("Name")
        chinese_name = names.get(monster_id, record.get("Name"))
        if not isinstance(chinese_name, str) or not chinese_name.strip():
            raise CatalogError(f"missing Chinese name for monster {monster_id}")
        if not isinstance(english_name, str) or not english_name.strip():
            raise CatalogError(f"missing English name for monster {monster_id}")
        normalized = {key: value for key, value in record.items() if key not in {"Id", "Name"}}
        normalized["names"] = {"zh-CN": chinese_name, "en-US": english_name}
        normalized["spriteName"] = sprites.get(monster_id)
        monsters[str(monster_id)] = normalized
    return {
        "schema": "monster-catalog/v1", "version": 1, "mode": "renewal",
        "locales": ["zh-CN", "en-US"],
        "serverSource": {"path": server_source, "revision": revision},
        "clientSource": {"version": CLIENT_VERSION, "paths": client_sources},
        "monsters": dict(sorted(monsters.items(), key=lambda pair: int(pair[0]))),
    }


def build_asset_map(monsters: dict[str, Any], sprite_root: Path) -> dict[str, Any]:
    available = {path.stem.casefold(): path.name for path in sprite_root.glob("*.spr")}
    assets: dict[str, dict[str, str | None]] = {}
    for monster_id, monster in monsters.items():
        sprite_name = monster.get("spriteName")
        filename = available.get(sprite_name.casefold()) if isinstance(sprite_name, str) else None
        assets[monster_id] = {
            "spriteName": sprite_name, "sprite": filename,
            "image": f"{monster_id}.png" if filename else None,
            "status": "available" if filename else "missing",
        }
    return {"version": 1, "clientVersion": CLIENT_VERSION, "monsters": assets}
