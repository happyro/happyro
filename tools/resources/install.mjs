#!/usr/bin/env node
/** Install reviewed resource sets without replacing different runtime bytes. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseArgs} from 'node:util';
import {fileURLToPath} from 'node:url';

const sets = ['fourth-job-effects', 'fourth-job-icons', 'training-maps'];

export function validatePath(set, relative) {
  if (!sets.includes(set)) throw new Error(`Unknown resource set: ${set}`);
  if (!relative.startsWith('data/') || relative.includes('\\') || relative.split('/').some(p => !p || p === '.' || p === '..')) {
    throw new Error(`Unsafe resource path: ${relative}`);
  }
  if (set === 'fourth-job-icons' && !/^data\/texture\/유저인터페이스\/item\/[A-Z0-9_]+\.bmp$/.test(relative)) {
    throw new Error(`Unexpected icon path: ${relative}`);
  }
  if (set === 'fourth-job-effects' && !/^data\/texture\/effect\/(DRAGON_KNIGHT|SHADOW_CROSS|ARCHMAGE|WINDHAWK|ABYSS_CHASER|CARDINAL|ELEMENTAL_MASTER|HYPER_NOVICE|IMPERIAL_GUARD|INQUISITOR|SPIRIT_HANDLER|SKY_EMPEROR|BIOLO|MEISTER|NIGHT_WATCH|SHINKIRO_SHIRANUI|TROUBADOUR_TROUVERE)\/[A-Za-z0-9_/]+\.(str|bmp|tga)$/i.test(relative)) {
    throw new Error(`Unexpected effect path: ${relative}`);
  }
}

export function validateBytes(set, bytes, entry) {
  if (bytes.length !== entry.bytes || createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
    throw new Error(`Hash/size mismatch: ${entry.path}`);
  }
  if (set === 'fourth-job-icons' && (bytes.length < 26 || bytes.toString('ascii', 0, 2) !== 'BM' || bytes.readInt32LE(18) !== entry.width || Math.abs(bytes.readInt32LE(22)) !== entry.height)) {
    throw new Error(`Invalid BMP: ${entry.path}`);
  }
  if (set === 'fourth-job-effects' && entry.path.endsWith('.str') && (bytes.length < 8 || bytes.toString('ascii', 0, 4) !== 'STRM' || bytes.readUInt32LE(4) !== 0x94)) {
    throw new Error(`Invalid STR: ${entry.path}`);
  }
}

async function checkedPath(root, relative) {
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    try {
      if ((await fs.lstat(current)).isSymbolicLink()) throw new Error(`Symlink in resource path: ${current}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return current;
}

export async function applySet({set, command, manifest, runtime, source}) {
  if (!['install', 'verify'].includes(command)) throw new Error('Expected install or verify');
  if (command === 'install' && !source) throw new Error('install requires --source');
  if (command === 'verify' && source) throw new Error('verify does not accept --source');
  const checked = new Map();
  const seen = new Set();
  // Validate every source and existing destination before writing the first file.
  for (const entry of manifest.files) {
    validatePath(set, entry.path);
    if (seen.has(entry.path)) throw new Error(`Duplicate resource path: ${entry.path}`);
    seen.add(entry.path);
    if (source) {
      const bytes = await fs.readFile(await checkedPath(source, entry.path));
      validateBytes(set, bytes, entry);
      checked.set(entry.path, bytes);
    }
    try {validateBytes(set, await fs.readFile(await checkedPath(runtime, entry.path)), entry);}
    catch (error) {if (!(command === 'install' && error.code === 'ENOENT')) throw error;}
  }
  let installed = 0;
  for (const entry of manifest.files) {
    const target = await checkedPath(runtime, entry.path);
    if (command === 'install') {
      await fs.mkdir(path.dirname(target), {recursive: true});
      try {await fs.writeFile(target, checked.get(entry.path), {flag: 'wx', mode: 0o644}); installed++;}
      catch (error) {if (error.code !== 'EEXIST') throw error;}
    }
    validateBytes(set, await fs.readFile(target), entry);
  }
  return {command, set, installed, verified: manifest.files.length};
}

async function main(args) {
  if (!args.length || args.includes('--help') || args.every(a => a === '--no-color')) {
    const paint = (code, text) => args.includes('--no-color') ? text : `\x1b[${code}m${text}\x1b[0m`;
    console.log(`\n${paint('1;36', 'HappyRO reviewed resource sets')}\n\n${paint('1;33', 'Usage')}\n  ${paint('1;32', 'install|verify --set NAME')} [--source DIR] [--no-color]\n  Sets: ${sets.join(', ')}\n\n${paint('1;33', 'Example')}\n  ${paint('36', 'node tools/resources/install.mjs verify --set training-maps --no-color')}\n`);
    return;
  }
  const {values, positionals} = parseArgs({args, allowPositionals: true, options: {
    set: {type: 'string'}, source: {type: 'string'}, 'no-color': {type: 'boolean'},
  }});
  if (positionals.length !== 1 || !sets.includes(values.set)) throw new Error('Expected one command and --set');
  const root = path.resolve(import.meta.dirname, '../..');
  const manifest = JSON.parse(await fs.readFile(path.join(root, `inputs/manifests/${values.set}.json`), 'utf8'));
  const report = await applySet({set: values.set, command: positionals[0], manifest,
    runtime: path.join(root, 'inputs/runtime/kro-20211105/client'),
    source: values.source ? path.resolve(values.source) : undefined});
  // Verification is read-only; reports belong to the caller's log.
  console.log(JSON.stringify(report));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {console.error(error.message); process.exitCode = 1;});
}
