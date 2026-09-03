"""Application services for item catalog generation."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Callable

from .assets import asset_map, descriptions
from .client import build_catalog as build_client_catalog
from .client import indexed_items
from .errors import CatalogError
from .monster import build_asset_map, build_catalog as build_monster_catalog, javascript_table
from .server import ITEM_TYPES, MODES, body, build_catalog as build_server_catalog
from .sprite import render_first_frame


JsonReader = Callable[[Path], dict[str, Any]]
JsonWriter = Callable[[Path, dict[str, Any]], None]
YamlReader = Callable[[Path], dict[str, Any]]
GitYamlReader = Callable[[Path, str, Path], dict[str, Any]]
TextReader = Callable[[Path], str]


def generate_client(
    client_source: Path,
    server_catalog: Path,
    grf_manifest: Path,
    output_directory: Path,
    read_json: JsonReader,
    write_catalog: JsonWriter,
    write_asset: JsonWriter,
) -> dict[str, int]:
    client_payload = read_json(client_source)
    manifest_payload = read_json(grf_manifest)
    payload = build_client_catalog(
        client_payload,
        read_json(server_catalog),
        str(client_source),
        str(server_catalog),
    )
    client_items = indexed_items(client_payload, "data", "client itemInfo")
    assets = asset_map(client_items, manifest_payload, str(client_source), str(grf_manifest))
    item_descriptions = descriptions(client_items, str(client_source))
    write_catalog(output_directory / "client-kro-20211105.json", payload)
    write_asset(output_directory / "item-assets.json", assets)
    write_asset(output_directory / "descriptions.json", item_descriptions)
    return {
        "catalog": len(payload["items"]),
        "assets": len(assets["items"]),
        "icons": sum(asset["icon"] is not None for asset in assets["items"].values()),
        "illustrations": sum(asset["illustration"] is not None for asset in assets["items"].values()),
        "descriptions": len(item_descriptions["items"]),
    }


def generate_server(
    server_root: Path,
    server_repository: Path,
    revision: str,
    output_directory: Path,
    read_yaml: YamlReader,
    read_git_yaml: GitYamlReader,
    write_json: JsonWriter,
) -> dict[str, int]:
    counts: dict[str, int] = {}
    for mode, directory in MODES.items():
        sources = []
        for item_type in ITEM_TYPES:
            relative = Path("db") / directory / f"item_db_{item_type}.yml"
            display_path = f"repos/happyro-server/{relative.as_posix()}"
            current = body(read_yaml(server_root / directory / relative.name), display_path)
            english = body(read_git_yaml(server_repository, revision, relative), f"{revision}:{relative}")
            sources.append((display_path, current, english))
        payload = build_server_catalog(mode, revision, sources)
        filename = "renewal.json" if mode == "renewal" else "pre-renewal.json"
        write_json(output_directory / filename, payload)
        counts[mode] = len(payload["items"])
    return counts


def generate_monsters(
    server_database: Path, server_repository: Path, revision: str, name_table: Path,
    sprite_table: Path, sprite_root: Path, output_directory: Path, image_directory: Path,
    read_yaml: YamlReader, read_git_yaml: GitYamlReader, read_text: TextReader,
    write_json: JsonWriter,
) -> dict[str, int]:
    server_source = "repos/happyro-server/db/re/mob_db.yml"
    catalog = build_monster_catalog(
        read_yaml(server_database),
        read_git_yaml(server_repository, revision, Path("db/re/mob_db.yml")),
        javascript_table(read_text(name_table), str(name_table)),
        javascript_table(read_text(sprite_table), str(sprite_table)),
        revision, server_source, [str(name_table), str(sprite_table)],
    )
    assets = build_asset_map(catalog["monsters"], sprite_root)
    write_json(output_directory / "renewal.json", catalog)
    rendered = 0
    for monster_id, asset in assets["monsters"].items():
        if asset["sprite"] is None:
            continue
        try:
            render_first_frame(sprite_root / asset["sprite"], image_directory / f"{monster_id}.png")
        except CatalogError:
            asset["image"] = None
            asset["status"] = "unsupported"
            continue
        rendered += 1
    write_json(output_directory / "monster-assets.json", assets)
    return {"catalog": len(catalog["monsters"]), "assets": rendered}
