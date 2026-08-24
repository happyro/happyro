#!/usr/bin/env python3
"""Compare indentation in merged translation files with their source chunks.

The checker compares each translated chunk with its original source chunk
before interpreting the merged file's line numbers.  This avoids treating
translated dialogue that was merged into fewer lines as a false indentation
error.  Structural lines such as if/switch/case/select are reported by
default; repetitive dialogue commands can be included with --include-dialogue.

Examples:
    python3 tools/translation/check-merged-indentation/main.py \
        --agent agent-03 --merged-root work/translation-merge-test
    python3 tools/translation/check-merged-indentation/main.py \
        --agent agent-03 --merged-root work/merged --include-dialogue
"""

from __future__ import annotations

import argparse
import csv
import difflib
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
MANIFEST_COLUMNS = (
    "repo",
    "path",
    "domain",
    "text_scope",
    "unit_type",
    "chunk_id",
    "start_line",
    "end_line",
    "source_chunk",
    "translated_chunk",
    "status",
    "notes",
)
TRANSLATED = "已翻译"
STRING_RE = re.compile(rb'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')')


@dataclass
class Finding:
    kind: str
    path: str
    output_line: int
    source_line: int | None
    source_prefix: bytes
    translated_prefix: bytes
    detail: str


@dataclass
class Result:
    agent: str
    units: int = 0
    files: int = 0
    findings: list[Finding] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent", action="append", help="Agent directory name; repeatable")
    parser.add_argument("--agent-dir", action="append", type=Path, help="Explicit agent directory; repeatable")
    parser.add_argument("--root", type=Path, default=Path("docs/translation/zh-cn"), help="Root containing agent directories")
    parser.add_argument("--all", action="store_true", help="Check every immediate agent-* directory")
    parser.add_argument(
        "--merged-root",
        type=Path,
        default=Path("work/translation-merge"),
        help="Root containing <agent>/<repo>/<path> merged files",
    )
    parser.add_argument(
        "--repo-root",
        action="append",
        default=[],
        metavar="NAME=PATH",
        help="Map manifest repo name to the original repository path; repeatable",
    )
    parser.add_argument(
        "--include-dialogue",
        action="store_true",
        help="Also report indentation candidates for repetitive mes/next/close lines",
    )
    parser.add_argument(
        "--include-ambiguous",
        action="store_true",
        help="Also report structural signatures repeated within a chunk; these require manual review",
    )
    parser.add_argument("--max-findings", type=int, default=200, help="Maximum findings printed per agent")
    return parser.parse_args()


def resolve_path(path: Path) -> Path:
    return (ROOT / path).resolve() if not path.is_absolute() else path.resolve()


def display(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


def leading(data: bytes) -> bytes:
    index = 0
    while index < len(data) and data[index] in (32, 9):
        index += 1
    return data[:index]


def show_prefix(prefix: bytes) -> str:
    return prefix.decode("ascii", errors="replace").replace("\t", "→").replace(" ", "·") or "<none>"


def signature(data: bytes) -> bytes:
    data = data.lstrip(b" \t").split(b"//", 1)[0]
    data = STRING_RE.sub(b"<S>", data)
    return re.sub(rb"\s+", b" ", data).strip()


def is_dialogue_signature(value: bytes) -> bool:
    return value.startswith((b"mes <S>", b"npctalk <S>", b"next", b"close"))


def mixed(data: bytes) -> bool:
    prefix = leading(data)
    return b" " in prefix and b"\t" in prefix


def parse_repo_roots(values: list[str]) -> dict[str, Path]:
    roots = {
        "client": ROOT / "repos/happyro-client",
        "server": ROOT / "repos/happyro-server",
    }
    for value in values:
        if "=" not in value:
            raise ValueError(f"--repo-root must use NAME=PATH: {value}")
        name, path = value.split("=", 1)
        if not name or not path:
            raise ValueError(f"--repo-root must use NAME=PATH: {value}")
        roots[name] = resolve_path(Path(path))
    return roots


def resolve_agents(args: argparse.Namespace) -> list[Path]:
    root = resolve_path(args.root)
    paths: list[Path] = []
    if args.agent:
        paths.extend(root / name for name in args.agent)
    if args.agent_dir:
        paths.extend(resolve_path(path) for path in args.agent_dir)
    if args.all:
        paths.extend(
            path
            for path in sorted(root.iterdir())
            if path.is_dir() and re.fullmatch(r"agent-\d+", path.name) and (path / "manifest.tsv").is_file()
        )
    if not paths:
        paths.append(root / "agent-03")
    unique: list[Path] = []
    seen: set[Path] = set()
    for path in paths:
        path = path.resolve()
        if path not in seen:
            unique.append(path)
            seen.add(path)
    return unique


def read_manifest(agent_dir: Path) -> list[dict[str, str]]:
    path = agent_dir / "manifest.tsv"
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle, delimiter="\t")
        if tuple(reader.fieldnames or ()) != MANIFEST_COLUMNS:
            raise ValueError(f"{display(path)}: unexpected manifest header")
        return list(reader)


def add_finding(
    result: Result,
    kind: str,
    path: str,
    output_line: int,
    source_line: int | None,
    source_prefix: bytes,
    translated_prefix: bytes,
    detail: str,
) -> None:
    result.findings.append(Finding(kind, path, output_line, source_line, source_prefix, translated_prefix, detail))


def output_line_start(rows: list[dict[str, str]], target_index: int) -> int:
    """Return the first merged output line for rows[target_index]'s selected data."""
    if rows[0]["unit_type"] == "file":
        return 1
    output_line_count = 1
    source_cursor = 1
    for index, row in enumerate(rows):
        start = int(row["start_line"])
        end = int(row["end_line"])
        translated_path = Path(row["translated_chunk_path"])
        selected_count = len(translated_path.read_bytes().splitlines())
        prefix_count = start - source_cursor
        selected_start = output_line_count + prefix_count
        if index == target_index:
            return selected_start
        output_line_count = selected_start + selected_count
        source_cursor = end + 1
    return output_line_count


def check_agent(
    agent_dir: Path,
    merged_root: Path,
    repo_roots: dict[str, Path],
    include_dialogue: bool,
    include_ambiguous: bool,
) -> Result:
    result = Result(agent_dir.name)
    try:
        rows = read_manifest(agent_dir)
    except (OSError, ValueError) as error:
        result.errors.append(str(error))
        return result
    result.units = sum(row["status"] == TRANSLATED for row in rows)
    groups: dict[tuple[str, str], list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        if row["status"] == TRANSLATED:
            groups[(row["repo"], row["path"])].append(row)
    result.files = len(groups)

    for (repo, logical_path), group in groups.items():
        base_root = repo_roots.get(repo)
        if base_root is None:
            result.errors.append(f"{repo}/{logical_path}: no base repository mapping")
            continue
        merged_path = merged_root / agent_dir.name / repo / logical_path
        if not merged_path.is_file():
            result.errors.append(f"missing merged file: {display(merged_path)}")
            continue
        ordered = sorted(group, key=lambda row: int(row["start_line"]))
        for row_index, row in enumerate(ordered):
            source_path = agent_dir / row["source_chunk"]
            translated_path = agent_dir / row["translated_chunk"]
            if not source_path.is_file() or not translated_path.is_file():
                result.errors.append(f"missing source or translated chunk: {logical_path}/{row['chunk_id']}")
                continue
            source_lines = source_path.read_bytes().splitlines(keepends=True)
            translated_lines = translated_path.read_bytes().splitlines(keepends=True)
            source_start = int(row["start_line"])
            selected_start = output_line_start(
                [
                    {
                        **item,
                        "translated_chunk_path": str(agent_dir / item["translated_chunk"]),
                    }
                    for item in ordered
                ],
                row_index,
            )
            label = f"{repo}/{logical_path}/{row['chunk_id']}"

            source_signatures = [signature(line) for line in source_lines]
            translated_signatures = [signature(line) for line in translated_lines]
            source_signature_counts = Counter(source_signatures)
            translated_signature_counts = Counter(translated_signatures)
            matched_translated: set[int] = set()
            for source_index, translated_index, size in difflib.SequenceMatcher(
                None, source_signatures, translated_signatures
            ).get_matching_blocks():
                for offset in range(size):
                    source_line_index = source_index + offset
                    translated_line_index = translated_index + offset
                    matched_translated.add(translated_line_index)
                    value = source_signatures[source_line_index]
                    if not value:
                        continue
                    source_prefix = leading(source_lines[source_line_index])
                    translated_prefix = leading(translated_lines[translated_line_index])
                    if source_prefix != translated_prefix and mixed(translated_lines[translated_line_index]):
                        add_finding(
                            result,
                            "mixed",
                            label,
                            selected_start + translated_line_index,
                            source_start + source_line_index,
                            source_prefix,
                            translated_prefix,
                            "new mixed Tab/space indentation",
                        )
                    elif (
                        source_prefix != translated_prefix
                        and (include_dialogue or not is_dialogue_signature(value))
                        and (
                            include_ambiguous
                            or (
                                source_signature_counts[value] == 1
                                and translated_signature_counts[value] == 1
                            )
                        )
                    ):
                        add_finding(
                            result,
                            "structural" if source_signature_counts[value] == 1 else "structural-candidate",
                            label,
                            selected_start + translated_line_index,
                            source_start + source_line_index,
                            source_prefix,
                            translated_prefix,
                            "structural indentation differs after semantic line alignment",
                        )
            source_mixed_count = sum(mixed(line) for line in source_lines)
            translated_mixed_indices = [index for index, line in enumerate(translated_lines) if mixed(line)]
            unmatched_mixed = [index for index in translated_mixed_indices if index not in matched_translated]
            if len(translated_mixed_indices) > source_mixed_count and unmatched_mixed:
                for index in unmatched_mixed:
                    add_finding(
                        result,
                        "mixed-candidate",
                        label,
                        selected_start + index,
                        None,
                        b"",
                        leading(translated_lines[index]),
                        f"mixed indentation count increased ({source_mixed_count} -> {len(translated_mixed_indices)})",
                    )
    return result


def print_result(result: Result, max_findings: int) -> None:
    print(f"Agent: {result.agent}")
    print(f"Translated units: {result.units}")
    print(f"Logical files: {result.files}")
    print(f"Findings: {len(result.findings)}")
    print(f"Errors: {len(result.errors)}")
    for message in result.errors:
        print(f"ERROR {message}")
    for finding in result.findings[:max_findings]:
        source_location = f"source:{finding.source_line}" if finding.source_line else "source:?"
        print(
            f"{finding.kind.upper()} {finding.path} merged:{finding.output_line} {source_location} "
            f"{show_prefix(finding.source_prefix)} -> {show_prefix(finding.translated_prefix)}: {finding.detail}"
        )
    if len(result.findings) > max_findings:
        print(f"WARN  {len(result.findings) - max_findings} findings omitted; use --max-findings to increase")


def main() -> int:
    args = parse_args()
    try:
        repo_roots = parse_repo_roots(args.repo_root)
    except ValueError as error:
        print(f"ERROR {error}", file=sys.stderr)
        return 2
    merged_root = resolve_path(args.merged_root)
    results = []
    for agent_dir in resolve_agents(args):
        result = check_agent(
            agent_dir,
            merged_root,
            repo_roots,
            args.include_dialogue,
            args.include_ambiguous,
        )
        results.append(result)
        print_result(result, args.max_findings)
    return 1 if any(result.errors or result.findings for result in results) else 0


if __name__ == "__main__":
    sys.exit(main())
