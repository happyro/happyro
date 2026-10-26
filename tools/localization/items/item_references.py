"""Update item-link labels by their explicit ID, preserving display wrappers."""
import re

ITEM_LINK = re.compile(r'(<ITEM>)(.*?)(<INFO>)(\d+)(</INFO></ITEM>)', re.S)
COLOR = re.compile(r'\^[0-9a-fA-F]{6}')


def sync_item_links(text, names):
    def replace(match):
        start, label, info, item_id, end = match.groups()
        entry = names.get(item_id)
        if entry is None:
            return match.group()
        # Colors are presentation only. Preserve leading/trailing colors and brackets.
        prefix = re.match(r'(?:\^[0-9a-fA-F]{6})*', label)[0]
        suffix = re.search(r'(?:\^[0-9a-fA-F]{6})*$', label)[0]
        inner = label[len(prefix):len(label)-len(suffix) if suffix else len(label)]
        left = right = ''
        if len(inner) > 1 and (inner[0], inner[-1]) in [('「', '」'), ('[', ']'), ('【', '】')]:
            left, right = inner[0], inner[-1]
        if COLOR.search(inner):
            # Keep unusual per-character markup for manual review.
            return match.group()
        return f'{start}{prefix}{left}{entry["name"]}{right}{suffix}{info}{item_id}{end}'
    return ITEM_LINK.sub(replace, text)


SCRIPT_TEXT = re.compile(r'//[^\n]*|/\*[\s\S]*?\*/|"(?:[^"\\]|\\.)*"')


def sync_script_item_links(text, names):
    """Change explicit item links inside script strings, never comments or code."""
    import json
    escaped = {item_id: {**entry, 'name': json.dumps(entry['name'], ensure_ascii=False)[1:-1]}
               for item_id, entry in names.items()}
    return SCRIPT_TEXT.sub(
        lambda match: sync_item_links(match[0], escaped) if match[0].startswith('"') else match[0], text
    )
