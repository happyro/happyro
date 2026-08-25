"""Command-line interface for translation validation."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from . import chunks, merged


def paint(text: str, code: str, enabled: bool) -> str:
    return f"\x1b[{code}m{text}\x1b[0m" if enabled else text


def help_text(color: bool) -> str:
    title = lambda value: paint(value, "1;36", color)
    section = lambda value: paint(value, "1;33", color)
    command = lambda value: paint(value, "1;32", color)
    example = lambda value: paint(value, "36", color)
    return "\n".join(
        [
            "",
            title("HappyRO translation validation"),
            "",
            section("Usage"),
            f"  {command('python3 tools/translation/validate/main.py')} <command> [options]",
            "",
            section("Commands"),
            "  chunks     Validate agent chunks before merging",
            "  merged     Validate indentation in merged files",
            "",
            section("Examples"),
            example("  python3 tools/translation/validate/main.py chunks --agent agent-03"),
            example("  python3 tools/translation/validate/main.py chunks --all --strict-lines"),
            example(
                "  python3 tools/translation/validate/main.py merged "
                "--agent agent-03 --merged-root <merged/files>"
            ),
            "",
            section("Options"),
            "  --no-color            Disable ANSI colors in this help output",
            "",
        ]
    ) + "\n"


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(add_help=False)
    subparsers = result.add_subparsers(dest="command")

    chunks_parser = subparsers.add_parser("chunks", add_help=False)
    chunks_parser.add_argument("--agent", action="append", default=[])
    chunks_parser.add_argument("--agent-dir", action="append", type=Path, default=[])
    chunks_parser.add_argument("--root", type=Path, default=Path("docs/translation/zh-cn/client-server/agents"))
    chunks_parser.add_argument("--all", action="store_true")
    chunks_parser.add_argument("--strict-lines", action="store_true")
    chunks_parser.add_argument("--no-color", action="store_true")

    merged_parser = subparsers.add_parser("merged", add_help=False)
    merged_parser.add_argument("--agent", action="append", default=[])
    merged_parser.add_argument("--agent-dir", action="append", type=Path, default=[])
    merged_parser.add_argument("--root", type=Path, default=Path("docs/translation/zh-cn/client-server/agents"))
    merged_parser.add_argument("--all", action="store_true")
    merged_parser.add_argument(
        "--merged-root",
        type=Path,
        default=Path("work/translation-merge/client-server/latest/merged/files"),
    )
    merged_parser.add_argument(
        "--merged-manifest",
        type=Path,
        help="Map logical source paths to merged output paths",
    )
    merged_parser.add_argument("--repo-root", action="append", default=[], metavar="NAME=PATH")
    merged_parser.add_argument("--include-dialogue", action="store_true")
    merged_parser.add_argument("--include-ambiguous", action="store_true")
    merged_parser.add_argument("--max-findings", type=int, default=200)
    merged_parser.add_argument("--allow-findings", action="store_true", help="允许审阅告警通过，但仍以错误为失败")
    merged_parser.add_argument("--no-color", action="store_true")
    return result


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    color = "--no-color" not in argv
    if not argv or "--help" in argv or "-h" in argv or set(argv) <= {"--no-color"}:
        sys.stdout.write(help_text(color))
        return 0
    parse_argv = [argument for argument in argv if argument != "--no-color"]
    args = parser().parse_args(parse_argv)
    if args.command == "chunks":
        return chunks.run(args.root, args.agent, args.agent_dir, args.all, args.strict_lines)
    if args.command == "merged":
        return merged.run(
            args.root,
            args.agent,
            args.agent_dir,
            args.all,
            args.merged_root,
            args.merged_manifest,
            args.repo_root,
            args.include_dialogue,
            args.include_ambiguous,
            args.max_findings,
            args.allow_findings,
        )
    sys.stdout.write(help_text(color))
    return 2
