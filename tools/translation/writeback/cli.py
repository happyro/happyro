"""Publish merged translation files using the merge manifest."""

from __future__ import annotations

import argparse
from pathlib import Path
import sys

from ..merge.paths import ROOT, display, parse_mappings, resolve
from ..merge.models import MergeFailure
from .manifest import read_batch_state, read_manifest
from .publisher import build_operations, publish
from .targets import validate_target
def help_text(color: bool) -> str:
    paint = lambda value, code: f"\x1b[{code}m{value}\x1b[0m" if color else value
    return "\n".join(
        [
            "",
            paint("HappyRO translation writeback", "1;36"),
            "",
            paint("Usage", "1;33"),
            "  python3 tools/translation/writeback/main.py [options]",
            "",
            paint("Examples", "1;33"),
            paint("  python3 tools/translation/writeback/main.py \\", "36"),
            paint("    --merged-root work/translation-merge/<batch>/merged/files \\", "36"),
            paint("    --manifest work/translation-merge/<batch>/merged/manifest.tsv \\", "36"),
            paint("    --target-root client=docs/translation/zh-cn/kro-20211105/merged/files", "36"),
            "",
            paint("Options", "1;33"),
            "  --merged-root PATH       Root containing merged output files",
            "  --manifest PATH         Merge manifest.tsv",
            "  --target-root NAME=PATH Destination root; repeat per repository",
            "  --backup-dir PATH       Copy replaced files here before writing",
            "  --allow-closed          Allow an explicitly requested historical batch",
            "  --write                 Perform writes (default is dry-run)",
            "  --no-color              Disable ANSI colors",
            "",
        ]
    ) + "\n"


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(add_help=False)
    result.add_argument("--merged-root", type=Path, required=True)
    result.add_argument("--manifest", type=Path, required=True)
    result.add_argument("--target-root", action="append", default=[], metavar="NAME=PATH", required=True)
    result.add_argument("--backup-dir", type=Path)
    result.add_argument("--allow-closed", action="store_true")
    result.add_argument("--write", action="store_true")
    result.add_argument("--no-color", action="store_true")
    return result


def run(args: argparse.Namespace) -> int:
    merged_root = resolve(args.merged_root)
    manifest = resolve(args.manifest)
    targets = parse_mappings(args.target_root)
    if not merged_root.is_dir():
        raise MergeFailure(f"merged root does not exist: {display(merged_root)}")
    for name, target in targets.items():
        validate_target(target)
    backup_root = resolve(args.backup_dir) if args.backup_dir else None
    if backup_root:
        validate_target(backup_root)
    state = read_batch_state(manifest)
    if state.get("state") == "closed" and not args.allow_closed:
        batch = state.get("batch", "unknown")
        raise MergeFailure(
            f"{display(manifest)} belongs to closed batch {batch}; "
            "create a new batch or replay in staging, or explicitly use --allow-closed"
        )
    rows = read_manifest(manifest)
    operations = build_operations(rows, merged_root, targets)
    publish(operations, backup_root, args.write)
    return 0


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    color = "--no-color" not in argv
    if not argv or "--help" in argv or "-h" in argv or set(argv) <= {"--no-color"}:
        sys.stdout.write(help_text(color))
        return 0
    try:
        return run(parser().parse_args([item for item in argv if item != "--no-color"]))
    except MergeFailure as error:
        print(f"ERROR {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
