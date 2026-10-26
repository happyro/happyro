import assert from 'node:assert/strict';
import test from 'node:test';
import {sessionOptions} from './session-options.mjs';
const args = ['--run', '--character', 'AuditOnly', '--browser-path', '/fixture/chromium'];
test('independent roles have independent controller and credential defaults', () => {
  const roles = ['main', 'partner', 'assist'].map(role => sessionOptions([...args, '--role', role]));
  assert.equal(new Set(roles.map(v => v.port)).size, 3);
  assert.equal(new Set(roles.map(v => v.credentials)).size, 3);
  assert.equal(roles[1].user, 'TEST_ACCOUNT_USER');
});
test('explicit character and installed browser are required before any login', () => {
  assert.throws(() => sessionOptions(['--run']), /character/);
  assert.throws(() => sessionOptions(['--run', '--character', 'AuditOnly']), /browser-path/);
});
test('invalid roles, ports, slots and unknown options fail', () => {
  for (const pair of [['--role', 'other'], ['--port', '0'], ['--port', 'abc'], ['--slot', '-1'], ['--slot', '1.2'], ['--unknown', 'x']]) {
    assert.throws(() => sessionOptions([...args, ...pair]));
  }
});
