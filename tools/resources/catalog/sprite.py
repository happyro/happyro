"""Render the first indexed SPR frame as a transparent PNG."""

from __future__ import annotations

from pathlib import Path
import struct
from PIL import Image
from .errors import CatalogError


def render_first_frame(source: Path, destination: Path) -> None:
    payload = source.read_bytes()
    if len(payload) < 14 or payload[:2] != b"SP":
        raise CatalogError(f"invalid SPR file: {source}")
    version = (payload[3], payload[2])
    if version < (1, 1) or struct.unpack_from("<H", payload, 4)[0] < 1:
        raise CatalogError(f"unsupported SPR file: {source}")
    offset = 8 if version > (1, 1) else 6
    width, height = struct.unpack_from("<HH", payload, offset)
    offset += 4
    expected = width * height
    if version >= (2, 1):
        encoded_length = struct.unpack_from("<H", payload, offset)[0]
        offset += 2
        pixels = decode_rle(payload[offset:offset + encoded_length], expected)
    else:
        pixels = payload[offset:offset + expected]
    if len(pixels) != expected:
        raise CatalogError(f"invalid first frame in SPR: {source}")
    palette = payload[-1024:]
    rgba = bytearray()
    for index in pixels:
        start = index * 4
        rgba.extend((*palette[start:start + 3], 0 if index == 0 else 255))
    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.frombytes("RGBA", (width, height), bytes(rgba)).save(destination, optimize=True)
    destination.chmod(0o644)


def decode_rle(encoded: bytes, expected: int) -> bytes:
    decoded = bytearray()
    offset = 0
    while offset < len(encoded) and len(decoded) < expected:
        value = encoded[offset]
        offset += 1
        decoded.append(value)
        if value != 0 or offset >= len(encoded):
            continue
        count = encoded[offset]
        offset += 1
        decoded.extend(b"\0" * (1 if count == 0 else count - 1))
    return bytes(decoded)
