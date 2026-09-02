"""Command-line interface for item catalog generation."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import subprocess
import sys

from .errors import CatalogError
from .server import DEFAULT_ENGLISH_REF
from .service import generate_client, generate_server
from .storage import read_git_yaml, read_json, read_yaml, write_json


DEFAULT_CLIENT_SOURCE = Path("docs/translation/zh-cn/kro-20211105/merged/files/lub/itemInfo_true.json")
DEFAULT_SERVER_CATALOG = Path("repos/happyro-admin/backend/resources/game/items/renewal.json")
DEFAULT_CLIENT_OUTPUT = Path("repos/happyro-admin/backend/resources/game/items/client-kro-20211105.json")
DEFAULT_SERVER_ROOT = Path("repos/happyro-server/db")
DEFAULT_SERVER_REPOSITORY = Path("repos/happyro-server")
DEFAULT_OUTPUT_DIRECTORY = Path("repos/happyro-admin/backend/resources/game/items")


def paint(value: str, code: str, enabled: bool) -> str:
    return f"\033[{code}m{value}\033[0m" if enabled else value


def help_text(color: bool) -> str:
    title = lambda value: paint(value, "1;36", color)
    section = lambda value: paint(value, "1;33", color)
    command = lambda value: paint(value, "1;32", color)
    example = lambda value: paint(value, "36", color)
    return "\n".join(
        [
            "",
            title("HappyRO 物品快照生成工具"),
            "",
            section("用法"),
            f"  {command('python3 tools/resources/item_catalog/main.py')} <子命令> [选项]",
            "",
            section("子命令"),
            f"  {command('client')}  从客户端 itemInfo 与 Renewal 快照生成仅客户端快照",
            f"  {command('server')}  从当前及历史 rAthena 数据生成双语服务端快照",
            "",
            section("常用例子"),
            example("  python3 tools/resources/item_catalog/main.py client"),
            example("  python3 tools/resources/item_catalog/main.py server"),
            "",
            section("通用选项"),
            "  --no-color  禁用 ANSI 颜色",
            "",
        ]
    ) + "\n"


def command_help_text(command_name: str, color: bool) -> str:
    title = lambda value: paint(value, "1;36", color)
    section = lambda value: paint(value, "1;33", color)
    command = lambda value: paint(value, "1;32", color)
    example = lambda value: paint(value, "36", color)
    if command_name == "client":
        options = [
            "  --client-source PATH   客户端 itemInfo JSON",
            "  --server-catalog PATH  Renewal 服务端快照",
            "  --output PATH          仅客户端快照输出路径",
        ]
    else:
        options = [
            "  --server-root PATH     当前 rAthena 数据库根目录",
            "  --server-repo PATH     HappyRO Server Git 仓库",
            "  --english-ref REF      英文数据 Git 基线",
            "  --output-dir PATH      服务端快照输出目录",
        ]
    return "\n".join(
        [
            "",
            title(f"HappyRO 物品快照生成工具: {command_name}"),
            "",
            section("用法"),
            f"  {command(f'python3 tools/resources/item_catalog/main.py {command_name}')} [选项]",
            "",
            section("选项"),
            *options,
            "  --no-color             禁用 ANSI 颜色",
            "",
            section("常用例子"),
            example(f"  python3 tools/resources/item_catalog/main.py {command_name}"),
            "",
        ]
    ) + "\n"


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(add_help=False)
    subcommands = result.add_subparsers(dest="command", required=True)
    client = subcommands.add_parser("client", add_help=False)
    client.add_argument("--client-source", type=Path, default=DEFAULT_CLIENT_SOURCE)
    client.add_argument("--server-catalog", type=Path, default=DEFAULT_SERVER_CATALOG)
    client.add_argument("--output", type=Path, default=DEFAULT_CLIENT_OUTPUT)
    server = subcommands.add_parser("server", add_help=False)
    server.add_argument("--server-root", type=Path, default=DEFAULT_SERVER_ROOT)
    server.add_argument("--server-repo", type=Path, default=DEFAULT_SERVER_REPOSITORY)
    server.add_argument("--english-ref", default=DEFAULT_ENGLISH_REF)
    server.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIRECTORY)
    return result


def run(args: argparse.Namespace) -> None:
    if args.command == "client":
        count = generate_client(args.client_source, args.server_catalog, args.output, read_json, write_json)
        print(f"client-only: {count} items -> {args.output}")
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


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    color = "--no-color" not in argv and os.environ.get("NO_COLOR") is None
    if not argv or set(argv) <= {"--no-color"} or argv[0] in {"--help", "-h"}:
        sys.stdout.write(help_text(color))
        return 0
    if argv[0] in {"client", "server"} and any(option in argv for option in {"--help", "-h"}):
        sys.stdout.write(command_help_text(argv[0], color))
        return 0
    try:
        run(parser().parse_args([argument for argument in argv if argument != "--no-color"]))
        return 0
    except (CatalogError, OSError, subprocess.SubprocessError) as error:
        print(f"ERROR {error}", file=sys.stderr)
        return 1
