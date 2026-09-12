#!/usr/bin/python3
"""Stop the container when either serving process exits."""
import os
import signal
import sys

while True:
    sys.stdout.write('READY\n')
    sys.stdout.flush()
    header = sys.stdin.readline()
    if not header:
        break
    fields = dict(field.split(':', 1) for field in header.split())
    sys.stdin.read(int(fields['len']))
    sys.stdout.write('RESULT 2\nOK')
    sys.stdout.flush()
    os.kill(1, signal.SIGTERM)
