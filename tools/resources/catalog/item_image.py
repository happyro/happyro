"""Render item BMP assets as transparent PNG files."""

from __future__ import annotations

from pathlib import Path
import shutil
import tempfile
from typing import Any

from PIL import Image, ImageDraw

from .errors import CatalogError


ASSET_DIRECTORIES = {"icon": "icons", "illustration": "illustrations"}
TRANSPARENT_KEY = (255, 0, 255)


def render_item_images(asset_map: dict[str, Any], source_root: Path, output_root: Path) -> dict[str, int]:
    items = asset_map.get("items")
    if not isinstance(items, dict):
        raise CatalogError("item asset map must contain an items object")
    output_root.parent.mkdir(parents=True, exist_ok=True)
    temporary = Path(tempfile.mkdtemp(prefix=f".{output_root.name}-", dir=output_root.parent))
    counts = {"icons": 0, "illustrations": 0}
    try:
        for item_id, assets in items.items():
            if not item_id.isdigit() or not isinstance(assets, dict):
                raise CatalogError(f"invalid item asset entry: {item_id}")
            for asset_type, directory in ASSET_DIRECTORIES.items():
                relative = assets.get(asset_type)
                if relative is None:
                    continue
                if not isinstance(relative, str) or not relative:
                    raise CatalogError(f"invalid {asset_type} path for item {item_id}")
                render_item_image(source_root / relative, temporary / directory / f"{item_id}.png")
                counts[directory] += 1
        replace_directory(temporary, output_root)
    except Exception:
        shutil.rmtree(temporary, ignore_errors=True)
        raise
    return counts


def render_item_image(source: Path, destination: Path) -> None:
    try:
        with Image.open(source) as image:
            rgba = image.convert("RGBA")
    except (OSError, ValueError) as error:
        raise CatalogError(f"invalid item image: {source}") from error
    background = rgba.getpixel((0, 0))
    ImageDraw.floodfill(rgba, (0, 0), (0, 0, 0, 0), thresh=12)
    if rgba.getpixel((0, 0))[3] != 0:
        raise CatalogError(f"item image background was not cleared: {source} ({background})")
    rgba.putdata([
        (0, 0, 0, 0) if pixel[:3] == TRANSPARENT_KEY else pixel
        for pixel in rgba.get_flattened_data()
    ])
    destination.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(destination, format="PNG", optimize=True)
    destination.chmod(0o644)


def replace_directory(temporary: Path, destination: Path) -> None:
    backup = destination.with_name(f".{destination.name}.previous")
    if backup.exists():
        shutil.rmtree(backup)
    if destination.exists():
        destination.rename(backup)
    try:
        temporary.rename(destination)
    except Exception:
        if backup.exists() and not destination.exists():
            backup.rename(destination)
        raise
    shutil.rmtree(backup, ignore_errors=True)
