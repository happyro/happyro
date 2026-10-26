"""Read-only batch discovery and current container observations."""
import json
from pathlib import Path
import subprocess

from tools.acceptance.offline.environment import Batch
from tools.acceptance.offline.checks import service_summary, healthy
from tools.deployment import progress
from tools.release.lifecycle import checked_version, plain_path


def summary(batch):
    state = batch.load()
    return {**batch.identity(), 'recorded_status': state['status'],
            'installation_exists': batch.install.is_dir(),
            'report_exists': (batch.root / 'report.json').is_file(),
            'integrity': 'not_checked'}


def list_batches(args):
    root = Path(args.workspace).resolve(strict=True)
    base = plain_path(root, root / 'work/releases')
    if args.version:
        checked_version(args.version)
    result = []
    for record in sorted(base.glob(f'{args.version or "*"}/acceptance/*/state.json')):
        try:
            plain_path(root, record)
            batch = Batch(root, record.parents[2].name, record.parent.name)
            result.append(summary(batch))
        except (ValueError, OSError, KeyError) as error:
            result.append({'path': str(record.parent), 'error': str(error)})
    progress.message(json.dumps(result, ensure_ascii=False, indent=2))
    return result


def status(args):
    batch = Batch(args.workspace, args.version, args.batch)
    result = summary(batch)
    try:
        containers = service_summary(batch.owned_containers())
        result.update(services=containers, runtime_healthy=healthy(containers))
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        result.update(runtime_healthy=None, runtime_error=str(error))
    # No 'passed' based on historical report: check is the explicit fresh test.
    progress.message(json.dumps(result, ensure_ascii=False, indent=2))
    return result
