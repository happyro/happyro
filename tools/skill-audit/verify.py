"""Read-only validation of the checked-in skill audit snapshot."""
from audit_cli import require_audit_command
require_audit_command(__file__)
import hashlib
import json
import re
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[2]
evidence = root / 'docs/development/skill-review/evidence'
read = lambda name: json.loads((evidence / name).read_text())
inventory = read('audited-inventory.json')
coverage = read('coverage-verification.json')
tracked = set(subprocess.check_output(['git', '-C', str(root), 'ls-files'], text=True).splitlines())
skills = inventory['skills']
assert len(skills) == len({s['id'] for s in skills}) == 607
assert sum(s['processed'] for s in skills) == 606
assert [s['id'] for s in skills if not s['processed']] == [106]
assert sum(row['total'] for row in inventory['byLine']) == 666
parsed = set()
for skill in skills:
    for item in skill['evidence']:
        path = evidence / item['file']
        assert str(path.relative_to(root)) in tracked, path
        if path not in parsed:
            json.loads(path.read_text())
            parsed.add(path)
for name, expected in coverage['retestEvidenceSha256'].items():
    assert hashlib.sha256((evidence / name).read_bytes()).hexdigest() == expected, name
report = root / 'docs/development/skill-review/catalog.md'
for link in re.findall(r'\]\(([^)]+)\)', report.read_text()):
    if '://' in link or link.startswith('#'):
        continue
    target = (report.parent / link.split('#')[0]).resolve()
    assert target.exists(), link
    assert str(target.relative_to(root)) in tracked, link
assert len(re.findall(r'^\| \d+ \| .*`', report.read_text(), re.M)) == 607
print('Verified: 607 skills, 606 processed, 1 waived; tracked links and evidence hashes match.')
