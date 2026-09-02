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
from .service import generate_client, generate_server
from .storage import read_git_yaml, read_json, read_yaml, write_json, write_pretty_json


DEFAULT_CLIENT_SOURCE = Path("docs/translation/zh-cn/kro-20211105/merged/files/lub/itemInfo_true.json")
DEFAULT_SERVER_CATALOG = Path("repos/happyro-admin/backend/resources/game-data/items/renewal.json")
DEFAULT_SERVER_ROOT = Path("repos/happyro-server/db")
DEFAULT_SERVER_REPOSITORY = Path("repos/happyro-server")
DEFAULT_OUTPUT_DIRECTORY = Path("repos/happyro-admin/backend/resources/game-data/items")


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(add_help=False)
    data_types = result.add_subparsers(dest="data_type", required=True)
    items = data_types.add_parser("items", add_help=False)
    pipelines = items.add_subparsers(dest="pipeline", required=True)
    client = pipelines.add_parser("client", add_help=False)
    client.add_argument("--client-source", type=Path, default=DEFAULT_CLIENT_SOURCE)
    client.add_argument("--server-catalog", type=Path, default=DEFAULT_SERVER_CATALOG)
    client.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIRECTORY)
    server = pipelines.add_parser("server", add_help=False)
    server.add_argument("--server-root", type=Path, default=DEFAULT_SERVER_ROOT)
    server.add_argument("--server-repo", type=Path, default=DEFAULT_SERVER_REPOSITORY)
    server.add_argument("--english-ref", default=DEFAULT_ENGLISH_REF)
    server.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIRECTORY)
    return result


def run(args: argparse.Namespace) -> None:
    if args.pipeline == "client":
        counts = generate_client(
            args.client_source,
            args.server_catalog,
            args.output_dir,
            read_json,
            write_json,
            write_pretty_json,
        )
        print(f"client catalog: {counts['catalog']} items")
        print(f"icon map: {counts['icons']} items")
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
    if len(argv) >= 2 and argv[:2] in (["items", "client"], ["items", "server"]) and help_requested:
        options = [
            "--client-source PATH   客户端 itemInfo JSON",
            "--server-catalog PATH  Renewal 服务端快照",
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
