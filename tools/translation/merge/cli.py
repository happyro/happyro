"""Command-line interface for the translation merge workers."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .client import merge_file as merge_client_file
from .kro import merge_file as merge_kro_file
from .manifest import group_rows, read_rows, rows_for_file
from .models import MergeFailure, Output
from .paths import ROOT, WORKSPACES, default_repo_roots, display, parse_mappings, resolve, safe_relative
from .writer import write_manifest, write_warnings


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
            title("HappyRO translation merge"),
            "",
            section("Usage"),
            f"  {command('python3 tools/translation/merge/main.py')} --workspace <name> --output <merged/files>",
            "",
            section("Workspaces"),
            "  client-server     Merge HappyRO client/server source files",
            "  kro-20211105     Merge kRO extracted JSON and direct text files",
            "",
            section("Common examples"),
            example("  python3 tools/translation/merge/main.py " + "\\"),
            example("    --workspace client-server " + "\\"),
            example("    --output work/translation-merge/client-server/batch-01/merged/files"),
            "",
            example("  python3 tools/translation/merge/main.py " + "\\"),
            example("    --workspace kro-20211105 " + "\\"),
            example("    --output work/translation-merge/kro-20211105/batch-01/merged/files"),
            "",
            section("Options"),
            "  --allow-incomplete    Use source content for pending/blocked units",
            "  --strict-line-count   Reject translated chunks with line-count changes",
            "  --include-unchanged   Emit files with no translated units",
            "  --dry-run             Validate without writing files",
            "  --no-color            Disable ANSI colors in this help output",
            "",
        ]
    ) + "\n"


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(add_help=False)
    result.add_argument("--workspace", choices=sorted(WORKSPACES), required=True)
    result.add_argument("--agents-root", type=Path)
    result.add_argument("--output", type=Path, required=True)
    result.add_argument("--repo-root", action="append", default=[], metavar="NAME=PATH")
    result.add_argument("--allow-incomplete", action="store_true")
    result.add_argument("--strict-line-count", action="store_true")
    result.add_argument("--include-unchanged", action="store_true")
    result.add_argument("--dry-run", action="store_true")
    result.add_argument("--no-color", action="store_true")
    return result


def validate_output_root(output_root: Path, repo_roots: dict[str, Path]) -> None:
    protected = list(repo_roots.values()) + [ROOT / "inputs/official", ROOT / "inputs/runtime"]
    for protected_root in protected:
        try:
            output_root.relative_to(protected_root.resolve())
        except ValueError:
            continue
        raise MergeFailure(f"refusing to write under protected source root: {display(protected_root)}")


def run(args: argparse.Namespace) -> int:
    workspace_root = WORKSPACES[args.workspace]
    agents_root = resolve(args.agents_root) if args.agents_root else workspace_root / "agents"
    output_root = resolve(args.output)
    repo_roots = default_repo_roots(args.workspace)
    repo_roots.update(parse_mappings(args.repo_root))
    validate_output_root(output_root, repo_roots)
    rows = read_rows(agents_root)

    outputs: list[Output] = []
    omitted: list[tuple[str, str]] = []
    errors: list[str] = []
    for key, grouped in sorted(group_rows(rows).items()):
        try:
            file_rows = rows_for_file(grouped, key)
            translated = sum(row.status == "已翻译" for row in file_rows)
            if not translated and not args.include_unchanged:
                omitted.append(key)
                continue
            if args.workspace == "client-server":
                output = merge_client_file(key, file_rows, repo_roots, args.allow_incomplete, args.strict_line_count)
            else:
                output = merge_kro_file(file_rows, args.allow_incomplete, args.strict_line_count)
            outputs.append(output)
        except (MergeFailure, OSError) as error:
            errors.append(str(error))

    if errors:
        for error in errors:
            print(f"ERROR {error}", file=sys.stderr)
        print(f"merge aborted: {len(errors)} error(s), no files written", file=sys.stderr)
        return 1

    print(f"Workspace: {args.workspace}")
    print(f"Work units: {len(rows)}")
    print(f"Complete files: {len(outputs)}")
    print(f"Omitted unchanged files: {len(omitted)}")
    print(f"Incomplete files: {sum(output.incomplete > 0 for output in outputs)}")
    print(f"Files with line-count changes: {sum(output.line_delta != 0 for output in outputs)}")
    print(f"Files with review warnings: {sum(bool(output.warnings) for output in outputs)}")
    if args.dry_run:
        print("Dry run: no files written")
        return 0

    output_root.mkdir(parents=True, exist_ok=True)
    for output in outputs:
        destination = output_root / output.output_path
        safe_relative(destination, output_root, "output file")
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(output.data)
    write_manifest(output_root.parent / "manifest.tsv", outputs, omitted)
    write_warnings(output_root.parent / "validation/merge-warnings.tsv", outputs)
    print(f"Wrote: {display(output_root)}")
    print(f"Manifest: {display(output_root.parent / 'manifest.tsv')}")
    return 0


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    color = "--no-color" not in argv
    if not argv or "--help" in argv or "-h" in argv or set(argv) <= {"--no-color"}:
        sys.stdout.write(help_text(color))
        return 0
    try:
        return run(parser().parse_args(argv))
    except MergeFailure as error:
        print(f"ERROR {error}", file=sys.stderr)
        return 2
