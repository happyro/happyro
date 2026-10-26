"""Standard-library terminal progress, also shipped inside offline bundles."""
from contextlib import contextmanager
from functools import wraps
import builtins
import threading
import time

_enabled = False
_plain = False
_stack = []
_lock = threading.RLock()


def configure(no_color=False):
    global _enabled, _plain
    _enabled, _plain = True, no_color


def message(text, kind='info'):
    codes = {'info': '36', 'stage': '1;33', 'done': '1;32', 'failed': '1;31'}
    with _lock:
        value = str(text)
        if _enabled and not _plain:
            value = f'\033[{codes[kind]}m{value}\033[0m'
        builtins.print(value, flush=True)


@contextmanager
def step(label, interval=10):
    if not _enabled:
        yield
        return
    started = time.monotonic()
    stopped = threading.Event()
    marker = object()
    with _lock:
        _stack.append(marker)
        message(f'[开始] {label}', 'stage')

    def heartbeat():
        while not stopped.wait(interval):
            with _lock:
                if _stack and _stack[-1] is marker:
                    message(f'[进行中] {label} · 已耗时 {time.monotonic() - started:.0f}s')

    worker = threading.Thread(target=heartbeat, daemon=True)
    worker.start()
    try:
        yield
    except BaseException:
        message(f'[未完成] {label} · 耗时 {time.monotonic() - started:.1f}s', 'failed')
        raise
    else:
        message(f'[完成] {label} · 耗时 {time.monotonic() - started:.1f}s', 'done')
    finally:
        stopped.set()
        worker.join()
        with _lock:
            _stack.remove(marker)


def operation(label):
    def decorate(function):
        @wraps(function)
        def wrapped(*args, **kwargs):
            with step(label):
                return function(*args, **kwargs)
        return wrapped
    return decorate
