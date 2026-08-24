from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[3]
DEFAULT_INPUT = ROOT / "docs/translation/zh-cn/kro-20211105/merged/files/lub"
DEFAULT_OUTPUT = ROOT / "artifacts/client/lub"
DEFAULT_TOOLCHAINS = ROOT / "work/lub-toolchains"

RESET = "\033[0m"
TITLE = "\033[1;36m"
SECTION = "\033[1;33m"
COMMAND = "\033[1;32m"
EXAMPLE = "\033[36m"


@dataclass(frozen=True)
class Target:
    input_name: str
    output_path: str
    global_name: str
    data_path: tuple[str, ...] = ()


@dataclass(frozen=True)
class LuaRelease:
    version: str
    url: str
    sha256: str
    archive_root: str
    lua_relative: str
    luac_relative: str


RELEASES = {
    "5.0": LuaRelease(
        version="5.0.2",
        url="https://www.lua.org/ftp/lua-5.0.2.tar.gz",
        sha256="a6c85d85f912e1c321723084389d63dee7660b81b8292452b190ea7190dd73bc",
        archive_root="lua-5.0.2",
        lua_relative="bin/lua",
        luac_relative="bin/luac",
    ),
    "5.1": LuaRelease(
        version="5.1.5",
        url="https://www.lua.org/ftp/lua-5.1.5.tar.gz",
        sha256="2640fc56a795f29d28ef15e13c34a47e223960b0240e8cb0a82d9b0738695333",
        archive_root="lua-5.1.5",
        lua_relative="src/lua",
        luac_relative="src/luac",
    ),
}


class BuildError(RuntimeError):
    pass


class ColorHelp(argparse.RawDescriptionHelpFormatter):
    def __init__(self, *args: Any, color: bool = True, **kwargs: Any) -> None:
        self.color = color
        super().__init__(*args, **kwargs)

    def start_section(self, heading: str | None) -> None:
        if self.color and heading:
            heading = f"{SECTION}{heading}{RESET}"
        super().start_section(heading)

    def _format_action_invocation(self, action: argparse.Action) -> str:
        text = super()._format_action_invocation(action)
        if self.color and isinstance(action, argparse._SubParsersAction):
            return f"{COMMAND}{text}{RESET}"
        return text


class FriendlyParser(argparse.ArgumentParser):
    def print_help(self, file: Any = None) -> None:
        output = file or sys.stdout
        print(file=output)
        super().print_help(output)
        print(file=output)


def color_enabled(argv: list[str]) -> bool:
    return "--no-color" not in argv and os.environ.get("NO_COLOR") is None


def make_parser(version: str, argv: list[str]) -> argparse.ArgumentParser:
    color = color_enabled(argv)

    def formatter(prog: str) -> ColorHelp:
        return ColorHelp(prog, color=color, max_help_position=32)

    title = f"HappyRO Lua {version} LUB builder"
    if color:
        title = f"{TITLE}{title}{RESET}"
    parser = FriendlyParser(
        prog=f"python3 tools/client/build/lua{version.replace('.', '')}/main.py",
        description=title,
        formatter_class=formatter,
        add_help=False,
    )
    parser.add_argument("-h", "--help", action="help", help="show this help message and exit")
    parser.add_argument("--no-color", action="store_true", help="disable ANSI colors")
    subparsers = parser.add_subparsers(
        dest="command", title="commands", parser_class=FriendlyParser
    )

    prepare = subparsers.add_parser(
        "prepare", help="download and build the compatible Lua toolchain", formatter_class=formatter
    )
    prepare.add_argument("--toolchain-root", type=Path, default=DEFAULT_TOOLCHAINS)
    prepare.add_argument("--force", action="store_true", help="rebuild an existing toolchain")

    build = subparsers.add_parser(
        "build", help="generate Lua source and compile translated LUB files", formatter_class=formatter
    )
    build.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="merged LUB JSON directory")
    build.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="artifact root directory")
    build.add_argument("--toolchain-root", type=Path, default=DEFAULT_TOOLCHAINS)
    build.add_argument("--lua", type=Path, help="compatible Lua interpreter override")
    build.add_argument("--luac", type=Path, help="compatible Lua compiler override")
    build.add_argument("--prepare", action="store_true", help="prepare a missing default toolchain")
    build.add_argument("--keep-source", action="store_true", help="retain generated .lua files")

    examples = [
        f"python3 tools/client/build/lua{version.replace('.', '')}/main.py prepare",
        f"python3 tools/client/build/lua{version.replace('.', '')}/main.py build --input work/translation-merge/<batch>/kro-20211105/merged/files/lub",
    ]
    label = "examples"
    rendered = "\n  ".join(examples)
    if color:
        label = f"{SECTION}{label}{RESET}"
        rendered = f"{EXAMPLE}{rendered}{RESET}"
    parser.epilog = f"{label}:\n  {rendered}"
    return parser


def print_help(parser: argparse.ArgumentParser) -> None:
    parser.print_help()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def replace_once(path: Path, old: str, new: str) -> None:
    content = path.read_text(encoding="ascii")
    if content.count(old) != 1:
        raise BuildError(f"expected one patch location in {path}")
    path.write_text(content.replace(old, new), encoding="ascii")


def patch_lua50(source: Path) -> None:
    dump = source / "src/ldump.c"
    undump = source / "src/lundump.c"
    limits = source / "src/llimits.h"
    replace_once(limits, "typedef unsigned long Instruction;", "typedef unsigned int Instruction;")
    replace_once(
        dump,
        "static void DumpSize(size_t x, DumpState* D)\n{\n DumpBlock(&x,sizeof(x),D);\n}",
        "static void DumpSize(size_t x, DumpState* D)\n{\n unsigned int y=(unsigned int)x;\n DumpBlock(&y,sizeof(y),D);\n}",
    )
    replace_once(dump, " DumpByte(sizeof(size_t),D);", " DumpByte(sizeof(unsigned int),D);")
    replace_once(
        undump,
        "static size_t LoadSize (LoadState* S)\n{\n size_t x;\n LoadBlock(S,&x,sizeof(x));\n return x;\n}",
        "static size_t LoadSize (LoadState* S)\n{\n unsigned int x;\n LoadBlock(S,&x,sizeof(x));\n return x;\n}",
    )
    replace_once(
        undump,
        ' TESTSIZE(sizeof(size_t), "size_t");',
        ' TESTSIZE(sizeof(unsigned int), "size_t");',
    )


def patch_lua51(source: Path) -> None:
    dump = source / "src/ldump.c"
    undump = source / "src/lundump.c"
    replace_once(
        dump,
        "  size_t size=0;\n  DumpVar(size,D);",
        "  unsigned int size=0;\n  DumpVar(size,D);",
    )
    replace_once(
        dump,
        "  size_t size=s->tsv.len+1;\t\t/* include trailing '\\0' */\n  DumpVar(size,D);",
        "  unsigned int size=(unsigned int)s->tsv.len+1;\t/* include trailing '\\0' */\n  DumpVar(size,D);",
    )
    replace_once(
        undump,
        " size_t size;\n LoadVar(S,size);",
        " unsigned int size;\n LoadVar(S,size);",
    )
    replace_once(undump, " *h++=(char)sizeof(size_t);", " *h++=(char)sizeof(unsigned int);")


def safe_extract(archive: Path, destination: Path) -> None:
    destination_resolved = destination.resolve()
    with tarfile.open(archive, "r:gz") as bundle:
        for member in bundle.getmembers():
            target = (destination / member.name).resolve()
            if destination_resolved not in target.parents and target != destination_resolved:
                raise BuildError(f"unsafe archive member: {member.name}")
            if member.isdev():
                raise BuildError(f"unsupported archive member: {member.name}")
            if member.issym() or member.islnk():
                link = (target.parent / member.linkname).resolve()
                if destination_resolved not in link.parents and link != destination_resolved:
                    raise BuildError(f"unsafe archive link: {member.name}")
        bundle.extractall(destination)


def run(command: list[str], cwd: Path | None = None) -> None:
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True)
    if result.returncode:
        detail = (result.stderr or result.stdout).strip()
        raise BuildError(f"command failed ({' '.join(command)}): {detail}")


def toolchain_paths(version: str, root: Path) -> tuple[Path, Path]:
    release = RELEASES[version]
    source = root / release.archive_root
    return source / release.lua_relative, source / release.luac_relative


def prepare_toolchain(version: str, root: Path, force: bool = False) -> tuple[Path, Path]:
    release = RELEASES[version]
    lua, luac = toolchain_paths(version, root)
    if lua.is_file() and luac.is_file() and not force:
        validate_toolchain(version, lua, luac)
        return lua, luac

    source = root / release.archive_root
    if force and source.exists():
        shutil.rmtree(source)
    root.mkdir(parents=True, exist_ok=True)
    archive = root / f"{release.archive_root}.tar.gz"
    if not archive.is_file() or sha256(archive) != release.sha256:
        if archive.exists():
            archive.unlink()
        try:
            urllib.request.urlretrieve(release.url, archive)
        except Exception as error:
            raise BuildError(f"cannot download {release.url}: {error}") from error
    actual = sha256(archive)
    if actual != release.sha256:
        raise BuildError(f"checksum mismatch for {archive}: {actual}")
    safe_extract(archive, root)

    if version == "5.0":
        patch_lua50(source)
        run(["./configure"], cwd=source)
        run(["make", "clean"], cwd=source)
        run(["make", "all", "MYCFLAGS=-O2 -std=gnu89"], cwd=source)
    else:
        patch_lua51(source)
        run(["make", "clean"], cwd=source)
        run(["make", "generic", "MYCFLAGS=-O2 -std=gnu99"], cwd=source)
    validate_toolchain(version, lua, luac)
    return lua, luac


def expected_header(version: str) -> bytes:
    if version == "5.0":
        return bytes.fromhex("1b4c756150010404040608090908")
    return bytes.fromhex("1b4c75615100010404040800")


def validate_toolchain(version: str, lua: Path, luac: Path) -> None:
    for executable in (lua, luac):
        if not executable.is_file() or not os.access(executable, os.X_OK):
            raise BuildError(f"toolchain executable is unavailable: {executable}")
    with tempfile.TemporaryDirectory(prefix="happyro-lub-probe-") as temp:
        temp_root = Path(temp)
        source = temp_root / "probe.lua"
        output = temp_root / "probe.lub"
        source.write_text("probe = 'ok'\n", encoding="ascii")
        run([str(luac), "-s", "-o", str(output), str(source)])
        header = output.read_bytes()[: len(expected_header(version))]
        if header != expected_header(version):
            raise BuildError(
                f"incompatible Lua {version} compiler header: {header.hex()} "
                f"(expected {expected_header(version).hex()})"
            )
        run([str(lua), str(output)])


INTEGER_KEY = re.compile(r"^(0|[1-9][0-9]*)$")
LUA_RESERVED = {
    "and",
    "break",
    "do",
    "else",
    "elseif",
    "end",
    "false",
    "for",
    "function",
    "if",
    "in",
    "local",
    "nil",
    "not",
    "or",
    "repeat",
    "return",
    "then",
    "true",
    "until",
    "while",
}


def lua_string(value: str) -> str:
    parts: list[str] = ['"']
    for byte in value.encode("utf-8"):
        if byte == 34:
            parts.append('\\"')
        elif byte == 92:
            parts.append("\\\\")
        elif 32 <= byte <= 126:
            parts.append(chr(byte))
        else:
            parts.append(f"\\{byte:03d}")
    parts.append('"')
    return "".join(parts)


def lua_value(value: Any, indent: int = 0) -> str:
    if value is None:
        return "nil"
    if value is True:
        return "true"
    if value is False:
        return "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        if not math.isfinite(value):
            raise BuildError("JSON contains a non-finite number")
        return repr(value)
    if isinstance(value, str):
        return lua_string(value)
    padding = "  " * indent
    child_padding = "  " * (indent + 1)
    if isinstance(value, list):
        if not value:
            return "{}"
        rows = [f"{child_padding}{lua_value(item, indent + 1)}," for item in value]
        return "{\n" + "\n".join(rows) + f"\n{padding}}}"
    if isinstance(value, dict):
        if not value:
            return "{}"
        rows = []
        for key, item in value.items():
            if INTEGER_KEY.fullmatch(key):
                rendered_key = f"[{key}]"
            elif key.isidentifier() and key.isascii() and key not in LUA_RESERVED:
                rendered_key = key
            else:
                rendered_key = f"[{lua_string(key)}]"
            rows.append(f"{child_padding}{rendered_key} = {lua_value(item, indent + 1)},")
        return "{\n" + "\n".join(rows) + f"\n{padding}}}"
    raise BuildError(f"unsupported JSON value: {type(value).__name__}")


def select_data(document: Any, target: Target) -> Any:
    value = document
    for part in target.data_path:
        if not isinstance(value, dict) or part not in value:
            raise BuildError(f"{target.input_name}: missing JSON path {'.'.join(target.data_path)}")
        value = value[part]
    return value


def load_document(path: Path) -> Any:
    try:
        with path.open(encoding="utf-8") as stream:
            return json.load(stream)
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise BuildError(f"cannot read {path}: {error}") from error


COMPARE_LUA = r'''
local function compare(actual, expected, path)
  if type(actual) ~= type(expected) then
    error(path .. ": type mismatch " .. type(actual) .. " != " .. type(expected))
  end
  if type(expected) ~= "table" then
    if actual ~= expected then error(path .. ": value mismatch") end
    return
  end
  for key, expected_value in pairs(expected) do
    if actual[key] == nil then error(path .. ": missing key " .. tostring(key)) end
    compare(actual[key], expected_value, path .. "." .. tostring(key))
  end
  for key in pairs(actual) do
    if expected[key] == nil then error(path .. ": unexpected key " .. tostring(key)) end
  end
end
'''


def build_targets(
    version: str,
    targets: Iterable[Target],
    input_root: Path,
    output_root: Path,
    lua: Path,
    luac: Path,
    keep_source: bool,
) -> list[tuple[Target, Path, str]]:
    if not input_root.is_dir():
        raise BuildError(f"input directory does not exist: {input_root}")
    validate_toolchain(version, lua, luac)
    results = []
    manifest_rows = ["version\tinput\toutput\tsha256\tencoding\tverification"]
    for target in targets:
        input_path = input_root / target.input_name
        if not input_path.is_file():
            raise BuildError(f"missing merged input: {input_path}")
        document = load_document(input_path)
        data = select_data(document, target)
        rendered = lua_value(data)
        output_path = output_root / target.output_path
        source_path = output_path.with_suffix(".lua")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        source_path.write_text(f"{target.global_name} = {rendered}\n", encoding="ascii")
        run([str(luac), "-s", "-o", str(output_path), str(source_path)])
        header = output_path.read_bytes()[: len(expected_header(version))]
        if header != expected_header(version):
            raise BuildError(f"unexpected output header for {output_path}: {header.hex()}")

        with tempfile.NamedTemporaryFile("w", encoding="ascii", suffix=".lua", delete=False) as verify:
            verify_path = Path(verify.name)
            verify.write(f"dofile({lua_string(str(output_path))})\n")
            verify.write(COMPARE_LUA)
            verify.write(f"local expected = {rendered}\n")
            verify.write(f"compare({target.global_name}, expected, {lua_string(target.global_name)})\n")
        try:
            run([str(lua), str(verify_path)])
        finally:
            verify_path.unlink(missing_ok=True)
        if not keep_source:
            source_path.unlink()
        digest = sha256(output_path)
        manifest_rows.append(
            f"Lua {version}\t{target.input_name}\t{target.output_path}\t{digest}\tUTF-8\tpassed"
        )
        results.append((target, output_path, digest))
    output_root.mkdir(parents=True, exist_ok=True)
    (output_root / f"manifest-lua{version.replace('.', '')}.tsv").write_text(
        "\n".join(manifest_rows) + "\n", encoding="utf-8"
    )
    return results


def execute(version: str, targets: tuple[Target, ...], argv: list[str]) -> int:
    parser = make_parser(version, argv)
    if not argv:
        print_help(parser)
        return 0
    args = parser.parse_args(argv)
    if args.command is None:
        print_help(parser)
        return 0
    try:
        if args.command == "prepare":
            lua, luac = prepare_toolchain(version, args.toolchain_root, args.force)
            print(f"Lua:  {lua}")
            print(f"luac: {luac}")
            return 0

        default_lua, default_luac = toolchain_paths(version, args.toolchain_root)
        lua = args.lua or default_lua
        luac = args.luac or default_luac
        if args.prepare and (not lua.is_file() or not luac.is_file()):
            lua, luac = prepare_toolchain(version, args.toolchain_root)
        results = build_targets(
            version, targets, args.input, args.output, lua, luac, args.keep_source
        )
        for target, output, digest in results:
            print(f"built {target.input_name} -> {output} ({digest[:12]})")
        print(f"built and verified {len(results)} Lua {version} LUB file(s)")
        return 0
    except BuildError as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
