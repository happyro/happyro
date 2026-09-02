"""Application services for item catalog generation."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Callable

from .client import build_catalog as build_client_catalog
from .server import ITEM_TYPES, MODES, body, build_catalog as build_server_catalog


JsonReader = Callable[[Path], dict[str, Any]]
JsonWriter = Callable[[Path, dict[str, Any]], None]
YamlReader = Callable[[Path], dict[str, Any]]
GitYamlReader = Callable[[Path, str, Path], dict[str, Any]]


def generate_client(
    client_source: Path,
    server_catalog: Path,
    output: Path,
    read_json: JsonReader,
    write_json: JsonWriter,
) -> int:
    payload = build_client_catalog(
        read_json(client_source),
        read_json(server_catalog),
        str(client_source),
        str(server_catalog),
    )
    write_json(output, payload)
    return len(payload["items"])


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
