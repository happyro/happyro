"""Format, token, structure, and JSON checks used by the merge workers."""

from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path

from .models import MergeFailure, Row
from .paths import display


CHUNK_SUFFIX = re.compile(r"\.chunk-\d+\.json$")
STRING_RE = re.compile(rb'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')')
TEXT_ARRAY_FIELDS = {"Description", "identifiedDescriptionName", "unidentifiedDescriptionName"}
PAGE_ARRAY_FIELDS = {"Page"}
VISIBLE_TEXT_FIELDS = {
    "Title",
    "Summary",
    "Description",
    "Page",
    "identifiedDisplayName",
    "unidentifiedDisplayName",
    "identifiedDescriptionName",
    "unidentifiedDescriptionName",
}
TOKEN_CHECKS = (
    re.compile(rb"\^[0-9A-Fa-f]{6}"),
    re.compile(rb"\\(?:[nrtbfv'\\]|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})"),
    re.compile(rb"%(?:[0-9]+\$)?[-+0-9.#]*[A-Za-z]|\{[0-9]+\}"),
)
LEGACY_BYTE_ESCAPE_PATHS = {"src/DB/Items/RobeTable.js"}
PROTECTED_RESOURCE_PATHS = {
    "src/DB/Items/HatTable.js",
    "src/DB/Items/RobeTable.js",
    "src/DB/Jobs/JobNameTable.js",
    "src/DB/Monsters/MonsterTable.js",
}
YAML_SUFFIXES = (".yml", ".yaml")
HTML_SUFFIXES = (".html", ".htm")
YAML_KEY_RE = re.compile(rb"^([ \t]*)(- )?([A-Za-z][A-Za-z0-9_]*):(?:[ \t]|$)")
YAML_BLOCK_RE = re.compile(rb"[|>][-+]?\s*(?:#.*)?$")
TRANSLATABLE_HTML_ATTRIBUTES = {"alt", "aria-label", "data-text", "placeholder", "title", "value"}


def logical_path(label: str) -> str:
    value = label.split("/", 1)[-1]
    return re.sub(r"/(?:full|chunk-\d+)$", "", value)


class _HTMLStructureParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.events: list[tuple[str, str, tuple[tuple[str, str | None], ...]]] = []

    @staticmethod
    def _attributes(attrs: list[tuple[str, str | None]]) -> tuple[tuple[str, str | None], ...]:
        normalized = []
        for name, value in attrs:
            if name in TRANSLATABLE_HTML_ATTRIBUTES:
                if name == "data-text" and value is not None and value.isdigit():
                    normalized.append((name, value))
                else:
                    normalized.append((name, "<TEXT>"))
            else:
                normalized.append((name, value))
        return tuple(normalized)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.events.append(("start", tag, self._attributes(attrs)))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.events.append(("startend", tag, self._attributes(attrs)))

    def handle_endtag(self, tag: str) -> None:
        self.events.append(("end", tag, ()))


def line_count(data: bytes) -> int:
    return len(data.splitlines())


def normalize_newlines(data: bytes) -> bytes:
    return data.replace(b"\r\n", b"\n").replace(b"\r", b"\n")


def convert_newlines(data: bytes, newline: bytes) -> bytes:
    normalized = normalize_newlines(data)
    return normalized if newline == b"\n" else normalized.replace(b"\n", newline)


def preferred_newline(data: bytes) -> bytes:
    return b"\r\n" if b"\r\n" in data else b"\n"


def signature(line: bytes) -> bytes:
    value = line.lstrip(b" \t")
    if value.startswith((b"//", b"#")):
        return b""
    value = STRING_RE.sub(b"<STRING>", value)
    if b"<" in value and b">" in value:
        value = re.sub(rb">[^<]*<", b"><TEXT><", value)
    value = re.sub(rb"\bscript\b.*?(?=\{)", b"script <TEXT>", value)
    return re.sub(rb"\s+", b" ", value).strip()


def is_dialogue_signature(value: bytes) -> bool:
    return value.startswith((b"mes <STRING>", b"npctalk <STRING>", b"next", b"close"))


def structural_signatures(data: bytes) -> list[bytes]:
    signatures = []
    for line in normalize_newlines(data).splitlines():
        value = signature(line)
        if not value or is_dialogue_signature(value):
            continue
        code_like = any(token in value for token in (b"(", b")", b"{", b"}", b";", b"="))
        code_like |= value.startswith(
            (
                b"if ", b"if(", b"else", b"case ", b"default", b"for ", b"for(",
                b"while ", b"while(", b"switch", b"return", b"break", b"continue",
                b"set ", b"call", b"script ", b"function ", b"const ", b"let ", b"var ",
                b"import ", b"export ", b"class ",
            )
        )
        if code_like:
            signatures.append(value)
    return signatures


def logic_warnings(source: bytes, translated: bytes, label: str) -> list[str]:
    warnings = []
    if structural_signatures(source) != structural_signatures(translated):
        warnings.append(f"{label}: non-dialogue structure requires review")
    token_checks = TOKEN_CHECKS
    if label.split("/", 1)[-1].split("/chunk-", 1)[0] in LEGACY_BYTE_ESCAPE_PATHS:
        token_checks = tuple(expression for index, expression in enumerate(TOKEN_CHECKS) if index != 1)
    for expression in token_checks:
        if sorted(expression.findall(source)) != sorted(expression.findall(translated)):
            warnings.append(f"{label}: protected token requires review")
    return warnings


def validate_yaml_structure(source: bytes, translated: bytes, label: str) -> None:
    """Reject translation changes to YAML keys and their structural indentation."""
    if not label.split("/", 1)[-1].split("/chunk-", 1)[0].endswith(YAML_SUFFIXES):
        return
    source_lines = normalize_newlines(source).splitlines()
    translated_lines = normalize_newlines(translated).splitlines()
    if len(source_lines) != len(translated_lines):
        raise MergeFailure(
            f"{label}: YAML translation changes line count {len(source_lines)} -> {len(translated_lines)}"
        )
    block_indent: int | None = None
    for line_number, (source_line, translated_line) in enumerate(zip(source_lines, translated_lines), 1):
        source_indent = len(source_line) - len(source_line.lstrip(b" "))
        if block_indent is not None:
            if not source_line.strip() or source_indent > block_indent:
                continue
            block_indent = None
        source_match = YAML_KEY_RE.match(source_line)
        translated_match = YAML_KEY_RE.match(translated_line)
        source_structure = source_match.groups() if source_match else None
        translated_structure = translated_match.groups() if translated_match else None
        if source_structure != translated_structure:
            raise MergeFailure(f"{label}:{line_number}: YAML key or structural indentation changed")
        if source_match and YAML_BLOCK_RE.search(source_line[source_match.end() :]):
            block_indent = source_indent


def validate_protected_resource_file(source: bytes, translated: bytes, label: str) -> None:
    """Reject translations of tables whose values are runtime resource identifiers."""
    if (
        logical_path(label) in PROTECTED_RESOURCE_PATHS
        and normalize_newlines(source) != normalize_newlines(translated)
    ):
        raise MergeFailure(f"{label}: protected resource mapping must remain byte-for-byte unchanged")


def validate_html_structure(source: bytes, translated: bytes, label: str) -> None:
    """Reject changes to HTML tags, attribute names, and non-text attribute values."""
    if not logical_path(label).endswith(HTML_SUFFIXES):
        return
    source_parser = _HTMLStructureParser()
    translated_parser = _HTMLStructureParser()
    try:
        source_parser.feed(source.decode("utf-8"))
        source_parser.close()
        translated_parser.feed(translated.decode("utf-8"))
        translated_parser.close()
    except (UnicodeDecodeError, ValueError) as error:
        raise MergeFailure(f"{label}: invalid HTML translation: {error}") from error
    if source_parser.events != translated_parser.events:
        raise MergeFailure(f"{label}: HTML tags or protected attributes changed")


def _json_path(path: tuple[str, ...]) -> str:
    return "$" if not path else "$." + ".".join(path)


def _merge_json_value(
    source: object,
    translated: object,
    label: str,
    path: tuple[str, ...] = (),
    reject_source_fallback: bool = False,
) -> tuple[object, list[str]]:
    """Keep source structure while replacing translated text values."""
    location = f"{label}{_json_path(path)}"
    if isinstance(source, dict):
        if not isinstance(translated, dict):
            if reject_source_fallback:
                raise MergeFailure(f"{location}: translated value changed from object")
            return source, [f"{location}: translated value changed from object; source retained"]
        extra = sorted(set(translated) - set(source))
        merged: dict[str, object] = {}
        warnings: list[str] = []
        if extra:
            warnings.append(f"{location}: translated JSON added keys ignored: {', '.join(extra)}")
        for key, source_value in source.items():
            if key not in translated:
                if reject_source_fallback and key in VISIBLE_TEXT_FIELDS:
                    raise MergeFailure(f"{location}.{key}: missing translated field")
                merged[key] = source_value
                warnings.append(f"{location}.{key}: missing translated field; source retained")
                continue
            value, value_warnings = _merge_json_value(
                source_value, translated[key], label, (*path, key), reject_source_fallback
            )
            merged[key] = value
            warnings.extend(value_warnings)
        return merged, warnings

    if isinstance(source, list):
        if not isinstance(translated, list):
            if reject_source_fallback:
                raise MergeFailure(f"{location}: translated value changed from array")
            return source, [f"{location}: translated value changed from array; source retained"]
        field = path[-1] if path else ""
        if field in PAGE_ARRAY_FIELDS:
            if len(source) != len(translated):
                if len(source) == 2 and len(translated) == 1:
                    text = translated[0]
                    boundary = text.find("\n\t\t◈", text.find("</NAVI>"))
                    if boundary >= 0:
                        return [text[:boundary], text[boundary + 1 :]], [
                            f"{location}: reconstructed two pages from one translated page"
                        ]
                if reject_source_fallback and len(source) == 1 and all(
                    isinstance(item, str)
                    and not re.search(r"[가-힣ㄱ-ㅎㅏ-ㅣ]", item)
                    for item in translated
                ):
                    return ["\n".join(translated)], [
                        f"{location}: reconstructed one page from translated lines"
                    ]
                if reject_source_fallback:
                    raise MergeFailure(f"{location}: translated page count changed")
                return source, [f"{location}: page count changed {len(source)} -> {len(translated)}; source retained"]
        elif field in TEXT_ARRAY_FIELDS:
            if not all(isinstance(item, str) for item in source + translated):
                raise MergeFailure(f"{location}: text array contains a non-string value")
            if field == "unidentifiedDescriptionName" and source and all(item == "" for item in source):
                if translated != source:
                    if reject_source_fallback:
                        return translated, []
                    return source, [f"{location}: unidentified text changed; source retained"]
            if not translated and source:
                if all(item == "" for item in source):
                    return source, []
                if reject_source_fallback:
                    raise MergeFailure(f"{location}: empty translation")
                return source, [f"{location}: empty translation; source retained"]
            if len(source) != len(translated):
                return translated, [f"{location}: text line count changed {len(source)} -> {len(translated)}"]
            return translated, []
        elif len(source) != len(translated):
            if reject_source_fallback and field in VISIBLE_TEXT_FIELDS:
                raise MergeFailure(f"{location}: non-text array length changed")
            return source, [
                f"{location}: non-text array length changed {len(source)} -> {len(translated)}; source retained"
            ]
        merged_items: list[object] = []
        warnings: list[str] = []
        for index, (source_item, translated_item) in enumerate(zip(source, translated)):
            value, value_warnings = _merge_json_value(
                source_item, translated_item, label, (*path, str(index)), reject_source_fallback
            )
            merged_items.append(value)
            warnings.extend(value_warnings)
        return merged_items, warnings

    if isinstance(source, str):
        if not isinstance(translated, str):
            if reject_source_fallback:
                raise MergeFailure(f"{location}: translated value changed from string")
            return source, [f"{location}: translated value changed from string; source retained"]
        return translated, []

    if type(source) is not type(translated) or source != translated:
        if reject_source_fallback:
            raise MergeFailure(f"{location}: non-text value changed")
        return source, [f"{location}: non-text value changed; source retained"]
    return source, []


def normalize_json_pair(
    source: bytes,
    translated: bytes,
    label: str,
    reject_source_fallback: bool = False,
) -> tuple[bytes, list[str]]:
    try:
        source_value = json.loads(source.decode("utf-8"))
        translated_value = json.loads(translated.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise MergeFailure(f"{label}: invalid JSON: {error}") from error
    merged, warnings = _merge_json_value(
        source_value, translated_value, label, reject_source_fallback=reject_source_fallback
    )
    return json.dumps(merged, ensure_ascii=False, separators=(",", ":")).encode("utf-8"), warnings


def read_chunk(row: Row, translated: bool) -> bytes:
    path = row.translated if translated else row.source
    if not path.is_file():
        raise MergeFailure(f"{row.agent}/{row.chunk_id}: missing {display(path)}")
    return path.read_bytes()


def validate_chunk_line_count(row: Row, data: bytes) -> None:
    expected = row.end_line - row.start_line + 1
    actual = line_count(data)
    if actual != expected:
        raise MergeFailure(
            f"{row.agent}/{row.chunk_id}: {display(row.translated)} has {actual} lines, expected {expected}"
        )


def target_from_chunk(row: Row) -> str:
    parts = Path(row.values["translated_chunk"]).parts
    try:
        index = parts.index("translated")
    except ValueError as error:
        raise MergeFailure(f"cannot derive output path from {row.translated}") from error
    relative = Path(*parts[index + 1 :])
    if relative.name.endswith(".full"):
        relative = relative.with_name(relative.name[: -len(".full")])
    return relative.with_name(CHUNK_SUFFIX.sub("", relative.name)).as_posix()


def merge_framed_json(chunks: list[bytes]) -> bytes:
    """Merge JSON chunk objects or arrays into one valid JSON resource."""
    if not chunks:
        raise MergeFailure("cannot merge an empty JSON chunk list")
    parsed: list[object] = []
    for data in chunks:
        try:
            parsed.append(json.loads(data.decode("utf-8")))
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise MergeFailure(f"invalid JSON chunk: {error}") from error
    first = parsed[0]
    if isinstance(first, dict):
        merged: dict[str, object] = {}
        for chunk in parsed:
            if not isinstance(chunk, dict):
                raise MergeFailure("JSON chunks use inconsistent top-level types")
            for key, value in chunk.items():
                if key in merged:
                    if key == "data" and isinstance(merged[key], dict) and isinstance(value, dict):
                        overlap = set(merged[key]) & set(value)
                        if overlap:
                            raise MergeFailure(f"JSON chunks repeat data keys: {', '.join(sorted(overlap))}")
                        merged[key] = {**merged[key], **value}
                    else:
                        raise MergeFailure(f"JSON chunks repeat top-level key: {key}")
                else:
                    merged[key] = value
        return json.dumps(merged, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
    if isinstance(first, list):
        merged_list: list[object] = []
        for chunk in parsed:
            if not isinstance(chunk, list):
                raise MergeFailure("JSON chunks use inconsistent top-level types")
            merged_list.extend(chunk)
        return json.dumps(merged_list, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
    raise MergeFailure("JSON chunk must contain an object or array")


def parse_json_if_needed(path: str, data: bytes) -> None:
    if not path.endswith(".json"):
        return
    try:
        json.loads(data.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise MergeFailure(f"{path}: merged output is not valid JSON: {error}") from error
