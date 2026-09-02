"""File and Git adapters for item catalog generation."""

from __future__ import annotations

import json
import os
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import yaml

from .errors import CatalogError


def read_json(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise CatalogError(f"file not found: {path}") from error
    except json.JSONDecodeError as error:
        raise CatalogError(f"invalid JSON: {path}: {error}") from error
    if not isinstance(payload, dict):
        raise CatalogError(f"expected JSON object: {path}")
    return payload


def read_yaml(path: Path) -> dict[str, Any]:
    try:
        payload = yaml.safe_load(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise CatalogError(f"file not found: {path}") from error
    except yaml.YAMLError as error:
        raise CatalogError(f"invalid YAML: {path}: {error}") from error
    if not isinstance(payload, dict):
        raise CatalogError(f"expected YAML object: {path}")
    return payload


def read_git_yaml(repository: Path, revision: str, path: Path) -> dict[str, Any]:
    result = subprocess.run(
        ["git", "-C", str(repository), "show", f"{revision}:{path.as_posix()}"],
        check=True,
        capture_output=True,
    )
    try:
        payload = yaml.safe_load(result.stdout.decode("utf-8"))
    except (UnicodeDecodeError, yaml.YAMLError) as error:
        raise CatalogError(f"invalid historical YAML: {revision}:{path}") from error
    if not isinstance(payload, dict):
        raise CatalogError(f"expected historical YAML object: {revision}:{path}")
    return payload


def write_json(path: Path, payload: dict[str, Any]) -> None:
    write_serialized(path, json.dumps(payload, ensure_ascii=False, separators=(",", ":")))


def write_pretty_json(path: Path, payload: dict[str, Any]) -> None:
    write_serialized(path, json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


def write_serialized(path: Path, serialized: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary: Path | None = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as handle:
            handle.write(serialized)
            temporary = Path(handle.name)
        os.replace(temporary, path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()
