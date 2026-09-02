#!/usr/bin/env python3
"""Generate bilingual HappyRO admin item catalog snapshots."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

import yaml


ITEM_TYPES = ("equip", "usable", "etc")
MODES = {
    "renewal": "re",
    "pre-renewal": "pre-re",
}
DEFAULT_ENGLISH_REF = "2fe6ab3dc4d8"


def read_yaml(path: Path) -> list[dict[str, Any]]:
    payload = yaml.safe_load(path.read_text(encoding="utf-8"))
    body = payload.get("Body", []) if isinstance(payload, dict) else []
    if not isinstance(body, list):
        raise ValueError(f"invalid item database body: {path}")
    return [item for item in body if isinstance(item, dict) and "Id" in item]


def read_git_yaml(repo: Path, revision: str, relative: Path) -> list[dict[str, Any]]:
    result = subprocess.run(
        ["git", "-C", str(repo), "show", f"{revision}:{relative.as_posix()}"],
        check=True,
        capture_output=True,
    )
    payload = yaml.safe_load(result.stdout.decode("utf-8"))
    body = payload.get("Body", []) if isinstance(payload, dict) else []
    if not isinstance(body, list):
        raise ValueError(f"invalid historical item database body: {relative}")
    return [item for item in body if isinstance(item, dict) and "Id" in item]


def by_id(items: list[dict[str, Any]]) -> dict[int, dict[str, Any]]:
    return {int(item["Id"]): item for item in items}


def build_items(server_items: list[dict[str, Any]], english_items: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    english = by_id(english_items)
    result: dict[str, dict[str, Any]] = {}
    for item in server_items:
        item_id = int(item["Id"])
        chinese = str(item.get("Name", ""))
        original = english.get(item_id, {})
        english_name = str(original.get("Name", ""))
        if not english_name:
            raise ValueError(f"missing English name for item {item_id}")
        normalized = {key: value for key, value in item.items() if key not in {"Id", "Name"}}
        normalized["names"] = {"zh-CN": chinese, "en-US": english_name}
        result[str(item_id)] = normalized
    return result


def generate_mode(server_root: Path, server_repo: Path, revision: str, output_dir: Path, mode: str, directory: str) -> int:
    items: dict[str, dict[str, Any]] = {}
    for item_type in ITEM_TYPES:
        relative = Path("db") / directory / f"item_db_{item_type}.yml"
        server_items = read_yaml(server_root / relative.relative_to("db"))
        english_items = read_git_yaml(server_repo, revision, relative)
        items.update(build_items(server_items, english_items))
    payload = {
        "schema": "item-catalog/v2",
        "version": 3,
        "mode": mode,
        "locales": ["zh-CN", "en-US"],
        "source": [f"repos/happyro-server/db/{directory}/item_db_{item_type}.yml" for item_type in ITEM_TYPES],
        "englishSource": {"repository": "repos/happyro-server", "revision": revision},
        "items": dict(sorted(items.items(), key=lambda pair: int(pair[0]))),
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    output = output_dir / ("renewal.json" if mode == "renewal" else "pre-renewal.json")
    output.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return len(items)


def parse_args() -> argparse.Namespace:
    color = "--no-color" not in sys.argv[1:]
    if not sys.argv[1:] or set(sys.argv[1:]) <= {"--no-color"}:
        title = "\033[1;36m" if color else ""
        section = "\033[1;33m" if color else ""
        reset = "\033[0m" if color else ""
        print(f"\n{title}HappyRO item catalog generator{reset}\n")
        print(f"{section}Usage{reset}")
        print("  python3 tools/resources/generate_item_catalog.py \\")
        print("    --server-root repos/happyro-server/db \\")
        print("    --server-repo repos/happyro-server \\")
        print(f"    --english-ref <git-ref>  (default: {DEFAULT_ENGLISH_REF}) \\")
        print("    --output-dir repos/happyro-admin/backend/resources/game/items\n")
        print(f"{section}Options{reset}")
        print("  --no-color   Disable ANSI colors in help output\n")
        raise SystemExit(0)

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--server-root", type=Path, required=True)
    parser.add_argument("--server-repo", type=Path, required=True)
    parser.add_argument("--english-ref", default=DEFAULT_ENGLISH_REF)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--no-color", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    total = 0
    for mode, directory in MODES.items():
        count = generate_mode(args.server_root, args.server_repo, args.english_ref, args.output_dir, mode, directory)
        total += count
        print(f"{mode}: {count} items")
    print(f"total: {total} items")


if __name__ == "__main__":
    main()
