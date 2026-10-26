import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {applySet, validatePath, validateBytes} from './install.mjs';

const entry = (name, bytes) => ({path: name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')});
test('install preflights all entries, preserves existing content and verifies without writes', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'happyro-resources-'));
  t.after(() => fs.rm(root, {recursive: true, force: true}));
  const source = path.join(root, 'source'), runtime = path.join(root, 'runtime');
  await fs.mkdir(path.join(source, 'data'), {recursive: true});
  await fs.mkdir(path.join(runtime, 'data'), {recursive: true});
  await fs.writeFile(path.join(source, 'data/a'), 'A');
  await fs.writeFile(path.join(source, 'data/b'), 'B');
  const manifest = {files: [entry('data/a', Buffer.from('A')), entry('data/b', Buffer.from('B'))]};
  const args = {set: 'training-maps', command: 'install', manifest, source, runtime};
  await fs.writeFile(path.join(runtime, 'data/b'), 'different');
  await assert.rejects(applySet(args), /Hash\/size/);
  await assert.rejects(fs.stat(path.join(runtime, 'data/a')), {code: 'ENOENT'});
  await fs.unlink(path.join(runtime, 'data/b'));
  assert.equal((await applySet(args)).installed, 2);
  assert.equal((await applySet(args)).installed, 0);
  assert.equal((await applySet({...args, source: undefined, command: 'verify'})).verified, 2);
  await fs.unlink(path.join(runtime, 'data/a'));
  await fs.symlink(path.join(source, 'data/a'), path.join(runtime, 'data/a'));
  await assert.rejects(applySet(args), /Symlink/);
});
test('set-specific format validators survive consolidation', () => {
  for (const p of ['data/../escape', '/data/a', 'data//a', 'data/a\\b']) assert.throws(() => validatePath('training-maps', p));
  assert.throws(() => validatePath('fourth-job-icons', 'data/a.bmp'));
  const bytes = Buffer.from('invalid');
  assert.throws(() => validateBytes('fourth-job-icons', bytes, entry('data/a.bmp', bytes)), /Invalid BMP/);
  assert.throws(() => validateBytes('fourth-job-effects', bytes, entry('data/a.str', bytes)), /Invalid STR/);
});
