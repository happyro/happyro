"""Build the project map and documented merge from verified source shards."""
import argparse
from pathlib import Path
import sys
import json
import hashlib

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))
from tools.localization.items.merge_item_names import load_sources, merge, write_json, write_archive, POLICY


def main(argv):
    if not argv or set(argv) <= {'--no-color'} or any(x in argv for x in ['--help', '-h']):
        def c(code, value):
            return value if '--no-color' in argv else f'\033[{code}m{value}\033[0m'
        print('\n' + c('1;36', 'HappyRO item reference map') + '\n\n' + c('1;33', 'Usage') + '\n  '
              + c('1;32', 'build') + ' --references DIR [--output DIR] [--merged-output DIR] [--no-color]\n\n'
              + c('1;33', 'Examples') + '\n  ' + c('36', 'python3 tools/localization/items/build_item_names.py build --references docs/localization/item-name-scans') + '\n')
        return
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('command', choices=['build'])
    parser.add_argument('--references', type=Path, required=True)
    parser.add_argument('--output', type=Path, default=ROOT / 'localization/item-names')
    parser.add_argument('--merged-output', type=Path, default=ROOT / 'docs/localization/item-name-scans/merged')
    parser.add_argument('--no-color', action='store_true')
    args = parser.parse_args(argv)
    sources, provenance = load_sources(args.references)
    project = json.loads((ROOT / 'repos/happyro-api/resources/game-data/items/renewal.json').read_text())['items']
    exclusion_path = ROOT / 'localization/item-names/source-exclusions.json'
    exclusions = json.loads(exclusion_path.read_text())
    provenance['reviewExclusions'] = {
        'path': str(exclusion_path.relative_to(ROOT)),
        'sha256': hashlib.sha256(exclusion_path.read_bytes()).hexdigest(),
        'records': len(exclusions),
    }
    records, selected, unresolved, conflicts = merge(sources, project, exclusions)
    summary = {'sourceRecords': {k: len(v) for k, v in sources.items()},
               'sourceUnionIDs': len(set().union(*(set(v) for v in sources.values()))),
               'projectIDs': len(project), 'mergedRecords': len(records), 'mapped': len(selected),
               'unresolved': len(unresolved), 'conflicts': len(conflicts)}
    write_json(args.output / 'zh-CN.json', {'scope': 'Renewal / PACKETVER=20211103', 'sources': provenance,
                                          'policy': POLICY, 'coverage': summary, 'items': selected})
    write_json(args.output / 'unresolved.json', unresolved)
    write_json(args.output / 'source-conflicts.json', conflicts)
    write_archive(args.merged_output, records, provenance, summary)
    write_json(args.merged_output / 'source-exclusions.json', exclusions)
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == '__main__':
    main(sys.argv[1:])
