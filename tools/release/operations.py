"""Version-based release operations, separate from argument parsing."""
import argparse
from datetime import datetime, timezone
from pathlib import Path

from tools.deployment import progress
from tools.release import publish, split as splitting
from tools.release.lifecycle import Layout, ResourceLayout, clean_locked, version_lock


def layout_for(args):
    return (ResourceLayout if args.group == 'resources' else Layout)(args.workspace, args.version)


def clean(args):
    layout = layout_for(args)
    with version_lock(layout, create=args.execute):
        return clean_locked(layout, include_package=args.group == 'resources' or args.include_package,
                            execute=args.execute)


def split(args):
    return splitting.split(args)


def push(args):
    layout = Layout(args.workspace, args.version)
    with version_lock(layout) as descriptor:
        state = layout.read_state()
        if not state:
            raise ValueError('Push requires a registered offline version')
        batch = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S.%fZ')
        evidence = args.evidence or layout.records / 'logs' / state['run_id'] / ('dockerhub-' + batch)
        return publish_locked(layout, state, descriptor, Path(evidence))


def publish_locked(layout, state, descriptor, evidence):
    if not state.get('package'):
        raise ValueError('Push requires a registered completed offline package')
    state.update(status='running', stage='push', publication={'evidence': str(evidence)})
    layout.save(state)
    try:
        options = argparse.Namespace(workspace=layout.root, version=layout.version, images=layout.images,
                                     bundle=layout.bundle, evidence=evidence, lock_fd=descriptor)
        publish.publish(options)
    except BaseException as error:
        state.update(status='interrupted' if isinstance(error, (KeyboardInterrupt, SystemExit)) else 'failed',
                     error_type=type(error).__name__)
        layout.save(state)
        raise
    state.update(status='published', stage=None)
    layout.save(state)
    progress.message(f'Docker Hub publication verified: {evidence}')
