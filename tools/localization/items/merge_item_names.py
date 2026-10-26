"""Merge archived source snapshots without inventing item names or identities."""
import hashlib
import json
from pathlib import Path
from tools.localization.items.item_names import base_name, is_chinese_name

SOURCES = {'dvg-list': 'dvg/item-list', 'dvg-grid': 'dvg/grid', 'ro321': 'ro321'}
POLICY = '小册子列表中文名优先，其次身份获交叉核验的网格中文名，再用 RO321 中文名；保留所有候选、拒绝理由和冲突。不自行翻译，只移除标题末尾插槽数。'


def load_sources(root):
    sources, provenance = {}, {}
    for name, folder in SOURCES.items():
        directory = root / folder
        raw = (directory / 'manifest.json').read_bytes()
        manifest = json.loads(raw)
        rows = {}
        for part in manifest['parts']:
            path = directory / part['file']
            payload = path.read_bytes()
            if hashlib.sha256(payload).hexdigest() != part['sha256']:
                raise ValueError(f'{name}: source hash mismatch: {part["file"]}')
            data = json.loads(payload)
            if len(data) != part['records'] or rows.keys() & data.keys():
                raise ValueError(f'{name}: duplicate IDs or record count mismatch')
            rows.update(data)
        if len(rows) != manifest['records']:
            raise ValueError(f'{name}: snapshot record count mismatch')
        sources[name] = rows
        provenance[name] = {'manifest': f'{folder}/manifest.json', 'sha256': hashlib.sha256(raw).hexdigest(),
                            'records': len(rows), 'scanDate': manifest['scanDate']}
    return sources, provenance


def merge(sources, project, exclusions=None):
    exclusions = exclusions or {}
    records, selected, unresolved, conflicts = {}, {}, {}, {}
    ids = set(project).union(*(set(rows) for rows in sources.values()))
    for item_id in sorted(ids, key=int):
        item = project.get(item_id)
        candidates = []
        accepted = []
        for source in SOURCES:
            raw = sources[source].get(item_id)
            if raw is None:
                continue
            candidate = {'source': source, 'raw': raw, 'normalizedName': base_name(raw['name'])}
            identity = raw.get('aegis', '')
            if source == 'dvg-grid' and item:
                proofs = [s for s in ('dvg-list', 'ro321') if
                          sources[s].get(item_id, {}).get('aegis', '').casefold() == item['AegisName'].casefold()]
                candidate['identitySources'] = proofs
                identity = item['AegisName'] if proofs else ''
            exclusion = exclusions.get(item_id, {})
            if source == exclusion.get('source') and candidate['normalizedName'] == exclusion.get('name'):
                candidate['decision'] = exclusion['reason']
            elif not item:
                candidate['decision'] = 'outside_project'
            elif not is_chinese_name(candidate['normalizedName']):
                candidate['decision'] = 'no_chinese_name'
            elif not identity:
                candidate['decision'] = 'missing_identity'
            elif identity.casefold() != item['AegisName'].casefold():
                candidate['decision'] = 'identity_conflict'
            else:
                candidate['decision'] = 'eligible'
                accepted.append(candidate)
            candidates.append(candidate)
        row = {'candidates': candidates, 'selectedSource': None}
        if item:
            row['projectAegis'] = item['AegisName']
            if accepted:
                chosen = accepted[0]
                raw = chosen['raw']
                entry = {'name': chosen['normalizedName'], 'aegis': item['AegisName'], 'source': raw['source'],
                         'sourceName': raw['name'], 'sourceAegis': raw.get('aegis'), 'selectedSource': chosen['source']}
                if 'identitySources' in chosen:
                    entry['identitySources'] = chosen['identitySources']
                selected[item_id] = entry
                row.update(selectedSource=chosen['source'], selectedName=entry['name'], reason='first_eligible_by_source_priority')
                if len({c['normalizedName'] for c in accepted}) > 1:
                    conflicts[item_id] = {'selected': entry, 'candidates': accepted, 'reason': row['reason']}
            else:
                row['reason'] = 'no_eligible_source'
                unresolved[item_id] = {'currentName': item['names']['zh-CN'], 'aegis': item['AegisName'],
                                       'references': candidates, 'reason': row['reason']}
        else:
            row['reason'] = 'outside_project'
        records[item_id] = row
    return records, selected, unresolved, conflicts


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def write_archive(directory, records, provenance, summary):
    parts = []
    keys = list(records)
    for start in range(0, len(keys), 1000):
        batch = keys[start:start + 1000]
        filename = f'data/{start // 1000 + 1:03}.json'
        path = directory / filename
        write_json(path, {i: records[i] for i in batch})
        parts.append({'file': filename, 'records': len(batch), 'firstID': batch[0], 'lastID': batch[-1],
                      'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
    write_json(directory / 'manifest.json', {'sources': provenance, 'policy': POLICY, 'summary': summary, 'parts': parts})
    lines = ['# 合并记录索引', '', '每条包含原始候选、资格判定、身份依据和选用来源。项目外条目保留来源但不应用到产品。', '',
             '| 文件 | ID 范围 | 条数 |', '| --- | --- | ---: |']
    lines += [f"| [{p['file']}]({p['file']}) | {p['firstID']}–{p['lastID']} | {p['records']} |" for p in parts]
    (directory / 'index.md').write_text('\n'.join(lines) + '\n')
