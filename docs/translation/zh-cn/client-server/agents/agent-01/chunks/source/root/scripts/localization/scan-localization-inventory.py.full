#!/usr/bin/env python3
"""Build a read-only localization inventory for the HappyRO product repos."""
from __future__ import annotations

import csv
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "work" / "localization"
REPO_DIRS = {
    "root": ROOT,
    "server": ROOT / "repos" / "happyro-server",
    "client": ROOT / "repos" / "happyro-client",
}

TEXT_EXTS = {
    ".c", ".cc", ".cpp", ".css", ".conf", ".csv", ".h", ".hpp", ".html",
    ".inc", ".in", ".ini", ".js", ".json", ".lua", ".mjs", ".md", ".py",
    ".sql", ".toml", ".ts", ".tsx", ".txt", ".vue", ".xml", ".yaml", ".yml",
}
SKIP_DIRS = {".git", "node_modules", "build", "dist", "target"}
VISIBLE_HINTS = re.compile(
    r"(message|msg|text|title|name|description|label|tooltip|placeholder|dialog|npc|say|print|error|warning|notice|help)",
    re.I,
)
NON_ASCII_OR_WORD = re.compile(r"[A-Za-z]{3,}|[\u3040-\u30ff\u3130-\u318f\uac00-\ud7af]")
QUOTED_TEXT = re.compile(r"(?:\"([^\"\\]*(?:\\.[^\"\\]*)*)\"|'([^'\\]*(?:\\.[^'\\]*)*)')")
DISPLAY_CALL = re.compile(r"(?:say|mes|disp|printf|print|message|notify|error|warning|title|description|label|placeholder)", re.I)


def product_text_scope(repo_name: str, path: str) -> bool:
    """Keep candidate extraction focused while file inventory remains exhaustive."""
    parts = Path(path).parts
    if repo_name == "server":
        return parts[0] in {"conf", "db", "localization", "npc", "sql-files", "src"}
    if repo_name == "client":
        if parts[:2] == ("src", "Vendors") or parts[:2] == ("applications", "tools"):
            return False
        return parts[0] in {"src", "applications", "rathena"}
    return parts[0] in {"configs", "deploy", "localization", "patches", "scripts"}


def classify_candidate(repo_name: str, path: str) -> tuple[str, str, str]:
    parts = Path(path).parts
    if repo_name == "server":
        if parts[0] == "npc":
            return "npc-and-quest", "player-visible", "script-dialogue-or-menu"
        if parts[0] == "db":
            return "game-database", "player-data", "name-description-or-rule-text"
        if parts[:2] == ("conf", "msg_conf"):
            return "server-messages", "player-visible", "message-configuration"
        if parts[0] == "conf":
            return "server-config", "unknown", "configuration-or-command-help"
        if parts[0] == "sql-files":
            return "database-migration", "internal", "schema-or-maintenance"
        if parts[0] == "src" and len(parts) > 1 and parts[1] in {"map", "login", "char", "web"}:
            return "server-runtime", "unknown", "runtime-string"
        return "server-source", "internal", "source-text"
    if repo_name == "client":
        if len(parts) > 1 and parts[1] == "DB":
            return "client-database", "player-data", "name-description-or-rule-text"
        if len(parts) > 1 and parts[1] == "UI":
            return "client-ui", "player-visible", "interface-text"
        if len(parts) > 1 and parts[1] == "Network":
            return "client-network", "internal", "protocol-or-packet-text"
        if parts[0] == "applications":
            return "client-application", "unknown", "page-or-application-text"
        return "client-source", "unknown", "runtime-string"
    return "root-config", "unknown", "project-config-or-script"


def tracked(repo: Path) -> list[str]:
    out = subprocess.check_output(["git", "-C", str(repo), "ls-files", "-z"])
    return [p for p in out.decode("utf-8", "surrogateescape").split("\0") if p]


def classify(path: str) -> tuple[str, str]:
    suffix = Path(path).suffix.lower()
    if suffix in TEXT_EXTS:
        return "text", "scan"
    if suffix in {".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".ico", ".svg"}:
        return "visual", "metadata-or-ocr"
    if suffix in {".dll", ".so", ".a", ".lib", ".wasm", ".dat", ".bin", ".exe"}:
        return "binary", "manual-resource-review"
    return "other", "manual-review"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    files_path = OUT / "scan-files.tsv"
    candidates_path = OUT / "scan-candidates.tsv"
    classified_path = OUT / "scan-candidates-classified.tsv"
    classified_summary_path = OUT / "scan-candidate-summary.tsv"
    batches_path = OUT / "scan-batches.tsv"
    translation_files_path = OUT / "translation-files.tsv"
    stats_path = OUT / "scan-summary.tsv"
    file_rows: list[list[str]] = []
    candidate_rows: list[list[str]] = []
    classified_rows: list[list[str]] = []
    summary: dict[tuple[str, str, str], int] = {}

    for repo_name, repo in REPO_DIRS.items():
        for rel in tracked(repo):
            kind, method = classify(rel)
            suffix = Path(rel).suffix.lower() or "(none)"
            file_rows.append([repo_name, rel, suffix, kind, method])
            key = (repo_name, suffix, kind)
            summary[key] = summary.get(key, 0) + 1
            if kind != "text" or not product_text_scope(repo_name, rel):
                continue
            path = repo / rel
            try:
                data = path.read_text(encoding="utf-8", errors="replace")
            except (OSError, UnicodeError):
                continue
            for number, line in enumerate(data.splitlines(), 1):
                clean = line.strip()
                if not clean or len(clean) > 500 or not NON_ASCII_OR_WORD.search(clean):
                    continue
                if clean.startswith(("//", "#", "/*", "*", "<!--")) and not DISPLAY_CALL.search(clean):
                    continue
                quoted = QUOTED_TEXT.findall(clean)
                has_quoted_text = any(len(a or b) >= 3 and NON_ASCII_OR_WORD.search(a or b) for a, b in quoted)
                if not has_quoted_text and not DISPLAY_CALL.search(clean):
                    continue
                hint = "visible-hint" if VISIBLE_HINTS.search(clean) or DISPLAY_CALL.search(clean) else "quoted-text"
                candidate_rows.append([repo_name, rel, str(number), hint, clean])

    with files_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh, delimiter="\t", lineterminator="\n")
        writer.writerow(["repo", "path", "suffix", "kind", "review_method"])
        writer.writerows(file_rows)
    # Keep all locations, but remove exact duplicate lines from generated/vendor tables.
    unique_candidates = []
    seen = set()
    for row in candidate_rows:
        key = (row[0], row[1], row[4])
        if key in seen:
            continue
        seen.add(key)
        unique_candidates.append(row)
    with candidates_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh, delimiter="\t", lineterminator="\n")
        writer.writerow(["repo", "path", "line", "candidate_type", "text"])
        writer.writerows(unique_candidates)
    for row in unique_candidates:
        domain, visibility, reason = classify_candidate(row[0], row[1])
        classified_rows.append(row[:2] + [domain, visibility, reason] + row[2:])
    with classified_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh, delimiter="\t", lineterminator="\n")
        writer.writerow(["repo", "path", "domain", "visibility", "reason", "line", "candidate_type", "text"])
        writer.writerows(classified_rows)
    counts: dict[tuple[str, str, str], int] = {}
    for row in classified_rows:
        key = (row[0], row[2], row[3])
        counts[key] = counts.get(key, 0) + 1
    with classified_summary_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh, delimiter="\t", lineterminator="\n")
        writer.writerow(["repo", "domain", "visibility", "count"])
        writer.writerows([list(k) + [v] for k, v in sorted(counts.items())])
    priority = {
        "client-ui": 1,
        "client-database": 2,
        "server-messages": 3,
        "npc-and-quest": 4,
        "game-database": 5,
        "server-runtime": 6,
        "client-application": 7,
        "client-source": 8,
        "server-config": 8,
        "server-source": 9,
        "client-network": 10,
        "database-migration": 11,
        "root-config": 12,
    }
    batch_counts: dict[tuple[str, str, str, str], int] = {}
    for row in classified_rows:
        key = (row[0], row[1], row[2], row[3])
        batch_counts[key] = batch_counts.get(key, 0) + 1
    with batches_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh, delimiter="\t", lineterminator="\n")
        writer.writerow(["priority", "repo", "path", "domain", "visibility", "candidate_count"])
        for (repo_name, path, domain, visibility), count in sorted(
            batch_counts.items(), key=lambda item: (priority.get(item[0][2], 99), item[0][0], item[0][1])
        ):
            writer.writerow([priority.get(domain, 99), repo_name, path, domain, visibility, count])
    translation_domains = {"client-ui", "client-database", "server-messages", "npc-and-quest", "game-database"}
    with translation_files_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh, delimiter="\t", lineterminator="\n")
        writer.writerow(["priority", "repo", "path", "domain", "visibility", "candidate_count", "status"])
        for (repo_name, path, domain, visibility), count in sorted(
            batch_counts.items(), key=lambda item: (priority.get(item[0][2], 99), item[0][0], item[0][1])
        ):
            if domain in translation_domains:
                writer.writerow([priority[domain], repo_name, path, domain, visibility, count, "待翻译"])
    with stats_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh, delimiter="\t", lineterminator="\n")
        writer.writerow(["repo", "suffix", "kind", "count"])
        writer.writerows([list(k) + [v] for k, v in sorted(summary.items())])
    print(f"files={len(file_rows)} candidates={len(unique_candidates)}")


if __name__ == "__main__":
    main()
