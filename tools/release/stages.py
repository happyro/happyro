"""Managed phase execution; no anonymous output directories or cleanup gaps."""
import argparse
import os

from tools.release import images, package, sources, workflow
from tools.release.lifecycle import Layout, LOCK_ENV, plain_path, require_managed_lock, version_lock


def worker(layout, phase):
    """Internal child invocation must inherit the parent's verified version lock."""
    require_managed_lock(layout.root, layout.artifacts)
    state = layout.read_state()
    if not state or state['status'] != 'running' or state['stage'] != phase:
        raise ValueError('Stage worker does not match the registered running phase')
    options = argparse.Namespace(workspace=layout.root, version=layout.version, images=layout.images,
                                 bundle=layout.bundle, output=layout.bundle if phase == 'prepare' else layout.images)
    return {'prepare': package.prepare, 'build': images.build, 'package': images.package}[phase](options)


def execute(args):
    layout = Layout(args.workspace, args.version)
    if os.environ.get(LOCK_ENV) is not None:
        return worker(layout, args.action)
    if sources.version(layout.root) != layout.version:
        raise ValueError('Stage version must match deploy/docker/VERSION')
    with version_lock(layout) as descriptor:
        if args.action == 'prepare':
            if layout.artifacts.exists():
                raise ValueError('Version output exists; use offline clean --include-package --execute first')
            state, log_dir = layout.create(workflow.preflight(layout.root, layout.version))
        else:
            state = layout.read_state()
            required = {'build': 'prepared', 'package': 'built'}[args.action]
            if not state or state['status'] != required:
                raise ValueError(f'{args.action} requires the registered {required} phase; inspect offline status')
            log_dir = plain_path(layout.root, layout.records / 'logs' / state['run_id'])
        try:
            workflow.complete_phase(layout, state, args.action, descriptor, log_dir)
        except BaseException as error:
            state.update(status='interrupted' if isinstance(error, (KeyboardInterrupt, SystemExit)) else 'failed',
                         error_type=type(error).__name__)
            layout.save(state)
            raise
