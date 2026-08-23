"""Repository and workspace path helpers."""

from __future__ import annotations

from pathlib import Path

from .models import MergeFailure


ROOT = Path(__file__).resolve().parents[3]
WORKSPACES = {
    "client-server": ROOT / "docs/translation/zh-cn/client-server",
    "kro-20211105": ROOT / "docs/translation/zh-cn/kro-20211105",
}


def resolve(path: Path) -> Path:
    return (ROOT / path).resolve() if not path.is_absolute() else path.resolve()


def display(path: Path) -> str:
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


def safe_relative(path: Path, root: Path, label: str) -> Path:
    try:
        relative = path.resolve().relative_to(root.resolve())
    except ValueError as error:
        raise MergeFailure(f"{label} escapes {display(root)}: {path}") from error
    if not relative.parts or ".." in relative.parts:
        raise MergeFailure(f"{label} is outside its root: {path}")
    return relative


def parse_mappings(values: list[str]) -> dict[str, Path]:
    mappings: dict[str, Path] = {}
    for value in values:
        if "=" not in value:
            raise MergeFailure(f"--repo-root must use NAME=PATH: {value}")
        name, raw_path = value.split("=", 1)
        if not name or not raw_path:
            raise MergeFailure(f"--repo-root must use NAME=PATH: {value}")
        mappings[name] = resolve(Path(raw_path))
    return mappings


def default_repo_roots(workspace: str) -> dict[str, Path]:
    if workspace == "client-server":
        return {
            "client": ROOT / "repos/happyro-client",
            "server": ROOT / "repos/happyro-server",
        }
    return {}

