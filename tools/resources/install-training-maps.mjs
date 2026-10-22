#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '../..');
const args = process.argv.slice(2);
const paint = (code, text) => args.includes('--no-color') ? text : `\x1b[${code}m${text}\x1b[0m`;
if (!args.length || args.includes('--help') || args.every(arg => arg === '--no-color')) {
 console.log(`\n${paint('1;36', 'HappyRO official training-map resources')}\n\n${paint('1;33', 'Usage')}\n  ${paint('1;32', 'install --source PATH')} [--no-color]\n  ${paint('1;32', 'verify')} [--no-color]\n\n${paint('1;33', 'Examples')}\n  ${paint('36', 'node tools/resources/install-training-maps.mjs install --source artifacts/resources/training-maps')}\n  ${paint('36', 'node tools/resources/install-training-maps.mjs verify --no-color')}\n`);
 process.exit(0);
}
const command = args[0];
if (!['install', 'verify'].includes(command)) throw new Error('Expected install or verify');
let source;
for (let i = 1; i < args.length; i++) {
 if (args[i] === '--no-color') continue;
 if (args[i] === '--source' && command === 'install' && args[i + 1] && !source) source = path.resolve(root, args[++i]);
 else throw new Error(`Unknown argument: ${args[i]}`);
}
if (command === 'install' && !source) throw new Error('install requires --source');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'inputs/manifests/training-maps.json'), 'utf8'));
const targetRoot = path.join(root, 'inputs/runtime/kro-20211105/client');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const validate = (bytes, entry) => {
 if (bytes.length !== entry.bytes || hash(bytes) !== entry.sha256) throw new Error(`Resource hash mismatch: ${entry.path}`);
};
const checked = new Map();
// Verify the complete set before publishing. Existing different bytes are an error.
for (const entry of manifest.files) {
 if (!entry.path.startsWith('data/') || entry.path.split('/').includes('..') || entry.path.includes('\\')) throw new Error(`Unsafe resource path: ${entry.path}`);
 if (source) {
  const bytes = await fs.readFile(path.join(source, entry.path));
  validate(bytes, entry);
  checked.set(entry.path, bytes);
 }
 try { validate(await fs.readFile(path.join(targetRoot, entry.path)), entry); }
 catch (error) { if (!(command === 'install' && error.code === 'ENOENT')) throw error; }
}
let installed = 0;
for (const entry of manifest.files) {
 const target = path.join(targetRoot, entry.path);
 if (command === 'install') {
  await fs.mkdir(path.dirname(target), { recursive: true });
  try { await fs.writeFile(target, checked.get(entry.path), { flag: 'wx', mode: 0o644 }); installed++; }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
 }
 validate(await fs.readFile(target), entry);
}
const report = { command, installed, verified: manifest.files.length, manifest: 'inputs/manifests/training-maps.json', at: new Date().toISOString() };
await fs.mkdir(path.join(root, 'artifacts/resources/training-maps'), { recursive: true });
await fs.writeFile(path.join(root, 'artifacts/resources/training-maps/install-report.json'), JSON.stringify(report, null, 2)+'\n');
console.log(JSON.stringify(report));
