"""Command-line interface for game data catalog generation."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import subprocess
import sys

from .errors import CatalogError
from .help import items_help, pipeline_help, root_help
from .server import DEFAULT_ENGLISH_REF
from .service import generate_client, generate_monsters, generate_server
from .storage import read_git_yaml, read_json, read_yaml, write_json, write_pretty_json


DEFAULT_CLIENT_SOURCE = Path("docs/translation/zh-cn/kro-20211105/merged/files/lub/itemInfo_true.json")
DEFAULT_SERVER_CATALOG = Path("repos/happyro-admin/backend/resources/game-data/items/renewal.json")
DEFAULT_GRF_MANIFEST = Path("work/grf-extract/kro-20211105/data/manifest.json")
DEFAULT_SERVER_ROOT = Path("repos/happyro-server/db")
DEFAULT_SERVER_REPOSITORY = Path("repos/happyro-server")
DEFAULT_OUTPUT_DIRECTORY = Path("repos/happyro-admin/backend/resources/game-data/items")
DEFAULT_MONSTER_DATABASE = Path("repos/happyro-server/db/re/mob_db.yml")
DEFAULT_MONSTER_NAMES = Path("repos/happyro-client/src/DB/Monsters/MonsterNameTable.js")
DEFAULT_MONSTER_SPRITES = Path("repos/happyro-client/src/DB/Monsters/MonsterTable.js")
DEFAULT_MONSTER_SPRITE_ROOT = Path("work/grf-extract/kro-20211105/data/data/sprite/몬스터")
DEFAULT_MONSTER_OUTPUT = Path("repos/happyro-admin/backend/resources/game-data/monsters")
DEFAULT_MONSTER_IMAGES = Path("work/game-data/monsters/kro-20211105")


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(add_help=False)
    data_types = result.add_subparsers(dest="data_type", required=True)
    items = data_types.add_parser("items", add_help=False)
    pipelines = items.add_subparsers(dest="pipeline", required=True)
    client = pipelines.add_parser("client", add_help=False)
    client.add_argument("--client-source", type=Path, default=DEFAULT_CLIENT_SOURCE)
    client.add_argument("--server-catalog", type=Path, default=DEFAULT_SERVER_CATALOG)
    client.add_argument("--grf-manifest", type=Path, default=DEFAULT_GRF_MANIFEST)
    client.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIRECTORY)
    server = pipelines.add_parser("server", add_help=False)
    server.add_argument("--server-root", type=Path, default=DEFAULT_SERVER_ROOT)
    server.add_argument("--server-repo", type=Path, default=DEFAULT_SERVER_REPOSITORY)
    server.add_argument("--english-ref", default=DEFAULT_ENGLISH_REF)
    server.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIRECTORY)
    monsters = data_types.add_parser("monsters", add_help=False)
    monsters.add_argument("--server-database", type=Path, default=DEFAULT_MONSTER_DATABASE)
    monsters.add_argument("--server-repo", type=Path, default=DEFAULT_SERVER_REPOSITORY)
    monsters.add_argument("--english-ref", default=DEFAULT_ENGLISH_REF)
    monsters.add_argument("--name-table", type=Path, default=DEFAULT_MONSTER_NAMES)
    monsters.add_argument("--sprite-table", type=Path, default=DEFAULT_MONSTER_SPRITES)
    monsters.add_argument("--sprite-root", type=Path, default=DEFAULT_MONSTER_SPRITE_ROOT)
    monsters.add_argument("--output-dir", type=Path, default=DEFAULT_MONSTER_OUTPUT)
    monsters.add_argument("--image-dir", type=Path, default=DEFAULT_MONSTER_IMAGES)
    return result


def run(args: argparse.Namespace) -> None:
    if args.data_type == "monsters":
        counts = generate_monsters(
            args.server_database, args.server_repo, args.english_ref, args.name_table,
            args.sprite_table, args.sprite_root, args.output_dir, args.image_dir,
            read_yaml, read_git_yaml, lambda path: path.read_text(encoding="utf-8"), write_json,
        )
        print(f"monster catalog: {counts['catalog']} monsters")
        print(f"monster images: {counts['assets']} PNG files")
        return
    if args.pipeline == "client":
        counts = generate_client(
            args.client_source,
            args.server_catalog,
            args.grf_manifest,
            args.output_dir,
            read_json,
            write_json,
            write_pretty_json,
        )
        print(f"client catalog: {counts['catalog']} items")
        print(f"asset map: {counts['assets']} items")
        print(f"icons: {counts['icons']} items")
        print(f"illustrations: {counts['illustrations']} items")
        print(f"descriptions: {counts['descriptions']} items")
        return
    counts = generate_server(
        args.server_root,
        args.server_repo,
        args.english_ref,
        args.output_dir,
        read_yaml,
        read_git_yaml,
        write_json,
    )
    for mode, count in counts.items():
        print(f"{mode}: {count} items")
    print(f"total: {sum(counts.values())} items")


def requested_help(argv: list[str], color: bool) -> str | None:
    help_requested = any(option in argv for option in {"--help", "-h"})
    if not argv or set(argv) <= {"--no-color"} or argv[0] in {"--help", "-h"}:
        return root_help(color)
    if argv[0] == "items" and (len(argv) == 1 or (help_requested and len(argv) < 3)):
        return items_help(color)
    if argv[0] == "monsters" and help_requested:
        return pipeline_help("monsters", ["--server-database PATH  当前 Renewal 魔物数据库", "--english-ref REF  英文数据 Git 基线", "--name-table PATH  客户端中文名称表", "--sprite-table PATH  客户端精灵名称表", "--sprite-root PATH  GRF 解压精灵目录", "--output-dir PATH  后台快照输出目录", "--image-dir PATH  PNG 图片输出目录"], color)
    if len(argv) >= 2 and argv[:2] in (["items", "client"], ["items", "server"]) and help_requested:
        options = [
            "--client-source PATH   客户端 itemInfo JSON",
            "--server-catalog PATH  Renewal 服务端快照",
            "--grf-manifest PATH    GRF 解压清单",
            "--output-dir PATH      客户端产物输出目录",
        ] if argv[1] == "client" else [
            "--server-root PATH  当前 rAthena 数据库根目录",
            "--server-repo PATH  HappyRO Server Git 仓库",
            "--english-ref REF   英文数据 Git 基线",
            "--output-dir PATH   服务端产物输出目录",
        ]
        return pipeline_help(argv[1], options, color)
    return None


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    color = "--no-color" not in argv and os.environ.get("NO_COLOR") is None
    arguments = [argument for argument in argv if argument != "--no-color"]
    help_output = requested_help(arguments, color)
    if help_output is not None:
        sys.stdout.write(help_output)
        return 0
    try:
        run(parser().parse_args(arguments))
        return 0
    except (CatalogError, OSError, subprocess.SubprocessError) as error:
        print(f"ERROR {error}", file=sys.stderr)
        return 1
