"""ANSI help text for the game data catalog tool."""

from __future__ import annotations


ENTRYPOINT = "python3 tools/resources/catalog/main.py"


def paint(value: str, code: str, enabled: bool) -> str:
    return f"\033[{code}m{value}\033[0m" if enabled else value


def root_help(color: bool) -> str:
    return render(
        "HappyRO 游戏资料构建工具",
        f"{ENTRYPOINT} <资料类型> <流水线> [选项]",
        ["items  构建客户端和服务端物品资料"],
        [f"{ENTRYPOINT} items client", f"{ENTRYPOINT} items server"],
        color,
    )


def items_help(color: bool) -> str:
    return render(
        "HappyRO 物品资料构建",
        f"{ENTRYPOINT} items <流水线> [选项]",
        ["client  构建客户端快照、图标映射和说明索引", "server  构建 Renewal 与 Pre-Renewal 服务端快照"],
        [f"{ENTRYPOINT} items client", f"{ENTRYPOINT} items server"],
        color,
    )


def pipeline_help(pipeline: str, options: list[str], color: bool) -> str:
    return render(
        f"HappyRO 物品资料构建: {pipeline}",
        f"{ENTRYPOINT} items {pipeline} [选项]",
        options,
        [f"{ENTRYPOINT} items {pipeline}"],
        color,
        "选项",
    )


def render(title_value: str, usage: str, entries: list[str], examples: list[str], color: bool, entry_title: str = "资料类型") -> str:
    title = lambda value: paint(value, "1;36", color)
    section = lambda value: paint(value, "1;33", color)
    command = lambda value: paint(value, "1;32", color)
    example = lambda value: paint(value, "36", color)
    lines = ["", title(title_value), "", section("用法"), f"  {command(usage)}", "", section(entry_title)]
    lines.extend(f"  {entry}" for entry in entries)
    lines.extend(["  --no-color  禁用 ANSI 颜色", "", section("常用例子")])
    lines.extend(example(f"  {value}") for value in examples)
    lines.append("")
    return "\n".join(lines) + "\n"
