"""Generate the card-prefix table from authoritative item names."""
import json
import sys
from pathlib import Path


def usage(color: bool = True) -> None:
    def paint(code: str, value: str) -> str:
        return f"\033[{code}m{value}\033[0m" if color else value

    print(
        f"\n{paint('1;36', 'HappyRO item localization generator')}\n\n"
        f"{paint('1;33', 'Usage')}\n"
        f"  {paint('1;32', 'python3 generate_card_prefixes.py --write')} [--no-color]\n\n"
        f"{paint('1;33', 'Examples')}\n"
        f"  {paint('36', 'python3 generate_card_prefixes.py --write')}\n"
        f"  {paint('36', 'python3 generate_card_prefixes.py --write --no-color')}\n"
    )


def main(arguments: list[str]) -> int:
    color = "--no-color" not in arguments
    if not arguments or arguments == ["--no-color"] or any(argument in {"-h", "--help"} for argument in arguments):
        usage(color)
        return 0
    unknown = set(arguments) - {"--write", "--no-color"}
    if unknown or "--write" not in arguments:
        raise SystemExit(f"Unknown or incomplete arguments: {' '.join(arguments)}")

    root = Path(__file__).resolve().parents[3]
    server_catalog = json.loads(
        (root / "repos/happyro-api/resources/game-data/items/renewal.json").read_text()
    )
    client_catalog = json.loads(
        (root / "repos/happyro-api/resources/game-data/items/client-kro-20211105.json").read_text()
    )
    client_items = client_catalog["items"]
    source = root / "work/grf-extract/kro-20211105/data/data/cardprefixnametable.txt"
    prefix_lines = []
    for raw_line in source.read_text(encoding="cp949").splitlines():
        if not raw_line.strip() or raw_line.startswith("//"):
            continue
        item_id, _source_name, remainder = raw_line.split("#", 2)
        item = client_items.get(item_id) or server_catalog["items"].get(item_id)
        if item is None:
            raise ValueError(f"card prefix item is missing from catalogs: {item_id}")
        prefix_lines.append(f'{item_id}#{item["names"]["zh-CN"]}#{remainder}')
    prefix_output = root / "localization/client/data/cardprefixnametable.txt"
    prefix_output.write_text("\n".join(prefix_lines) + "\n", encoding="utf-8")
    print(f"generated {len(prefix_lines)} localized card prefixes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
