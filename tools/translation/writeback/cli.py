"""Publish merged translation files using the merge manifest."""

from __future__ import annotations

import argparse
import csv
import hashlib
import os
from pathlib import Path
import shutil
import sys
import tempfile

from ..merge.paths import ROOT, display, parse_mappings, resolve
from ..merge.models import MergeFailure


MANIFEST_COLUMNS = (
    "repo", "path", "output_path", "unit_count", "translated_count", "skipped_count",
    "incomplete_count", "line_delta", "warning_count", "status",
)
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
    result.add_argument("--write", action="store_true")
    result.add_argument("--no-color", action="store_true")
    return result


def read_manifest(path: Path) -> list[dict[str, str]]:
    try:
        with path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            if tuple(reader.fieldnames or ()) != MANIFEST_COLUMNS:
                raise MergeFailure(f"{display(path)}: unexpected manifest header")
            rows = list(reader)
    except OSError as error:
        raise MergeFailure(f"cannot read manifest {display(path)}: {error}") from error
    if not rows:
        raise MergeFailure(f"{display(path)}: manifest is empty")
    return rows


def relative_output(repo: str, output_path: str) -> Path:
    candidate = Path(output_path)
    if candidate.is_absolute() or ".." in candidate.parts:
        raise MergeFailure(f"unsafe output path: {output_path}")
    if candidate.parts[:1] == (repo,):
        candidate = Path(*candidate.parts[1:])
    if not candidate.parts:
        raise MergeFailure(f"empty output path for {repo}")
    return candidate


def validate_target(path: Path) -> None:
    resolved = path.resolve()
    try:
        parts = resolved.relative_to(ROOT).parts
    except ValueError:
        parts = ()
    if parts[:1] == ("inputs",):
        raise MergeFailure(f"refusing to write protected source root: {display(path)}")


def atomic_write(destination: Path, data: bytes) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=destination.parent, prefix=f".{destination.name}.", delete=False) as handle:
        temporary = Path(handle.name)
        handle.write(data)
    try:
        os.replace(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)


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
    rows = read_manifest(manifest)
    operations: list[tuple[str, Path, Path, Path, bytes]] = []
    for row in rows:
        if not row["output_path"] or row["status"] == "无译文，未输出":
            continue
        repo = row["repo"]
        if repo not in targets:
            raise MergeFailure(f"{display(manifest)}: no target root for repository {repo}")
        relative = relative_output(repo, row["output_path"])
        source = (merged_root / Path(row["output_path"])).resolve()
        try:
            source.relative_to(merged_root.resolve())
        except ValueError as error:
            raise MergeFailure(f"merged output escapes root: {row['output_path']}") from error
        if not source.is_file():
            raise MergeFailure(f"missing merged output: {display(source)}")
        destination = targets[repo].resolve() / relative
        operations.append((repo, relative, source, destination, source.read_bytes()))
    seen: set[Path] = set()
    for _, _, _, destination, _ in operations:
        if destination in seen:
            raise MergeFailure(f"duplicate write destination: {display(destination)}")
        seen.add(destination)
    print(f"Files: {len(operations)}")
    for repo, relative, source, destination, data in operations:
        digest = hashlib.sha256(data).hexdigest()[:12]
        print(f"{('WRITE' if args.write else 'PLAN ')} {display(source)} -> {display(destination)} ({digest})")
        if not args.write:
            continue
        if backup_root and destination.is_file():
            backup = backup_root / repo / relative
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(destination, backup)
        atomic_write(destination, data)
    if not args.write:
        print("Dry run: no files written")
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
