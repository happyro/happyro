#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const paint = (code, value) => args.includes('--no-color') ? value : `\x1b[${code}m${value}\x1b[0m`;
if (!args.length || args.includes('--help') || args.every(arg => arg === '--no-color')) {
	console.log(`\n${paint('1;36', 'HappyRO fourth-job icon supplement')}\n\n${paint('1;33', 'Usage')}\n  ${paint('1;32', 'install --source <extracted-root>')} [--no-color]\n  ${paint('1;32', 'verify')} [--no-color]\n\n${paint('1;33', 'Examples')}\n  ${paint('36', 'node tools/resources/install-fourth-job-icons.mjs install --source work/fourth-jobs/official-patches/extracted')}\n  ${paint('36', 'node tools/resources/install-fourth-job-icons.mjs verify --no-color')}\n`);
	process.exit(0);
}
const command = args[0];
if (!['install', 'verify'].includes(command)) throw new Error('Expected install or verify');
let source;
for (let index = 1; index < args.length; index++) {
	if (args[index] === '--no-color') continue;
	if (args[index] === '--source' && command === 'install' && args[index + 1] && !source) source = path.resolve(root, args[++index]);
	else throw new Error(`Unknown or duplicate argument: ${args[index]}`);
}
if (command === 'install' && !source) throw new Error('install requires --source');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'inputs/manifests/fourth-job-icons.json'), 'utf8'));
const runtime = path.join(root, 'inputs/runtime/kro-20211105/client');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const checked = new Map();
function validate(bytes, entry) {
	if (bytes.length !== entry.bytes || hash(bytes) !== entry.sha256) throw new Error(`Hash/size mismatch: ${entry.path}`);
	if (bytes.toString('ascii', 0, 2) !== 'BM' || bytes.readInt32LE(18) !== entry.width || Math.abs(bytes.readInt32LE(22)) !== entry.height) throw new Error(`Invalid BMP: ${entry.path}`);
}
// Validate every source and destination before publishing any file.
for (const entry of manifest.files) {
	if (!/^data\/texture\/유저인터페이스\/item\/[A-Z0-9_]+\.bmp$/.test(entry.path)) throw new Error(`Unexpected icon path: ${entry.path}`);
	const target = path.join(runtime, entry.path);
	if (source) {
		const bytes = await fs.readFile(path.join(source, entry.path));
		validate(bytes, entry);
		checked.set(entry.path, bytes);
	}
	try {validate(await fs.readFile(target), entry);} catch (error) {
		if (!(command === 'install' && error.code === 'ENOENT')) throw error;
	}
}
for (const entry of manifest.files) {
	const target = path.join(runtime, entry.path);
	if (command === 'install') {
		await fs.mkdir(path.dirname(target), {recursive: true});
		try {await fs.writeFile(target, checked.get(entry.path), {flag: 'wx', mode: 0o644});}
		catch (error) {if (error.code !== 'EEXIST') throw error;}
	}
	validate(await fs.readFile(target), entry);
}
const report = {at: new Date().toISOString(), command, manifest: 'inputs/manifests/fourth-job-icons.json', filesVerified: manifest.files.length};
await fs.mkdir(path.join(root, 'artifacts/fourth-jobs'), {recursive: true});
await fs.writeFile(path.join(root, 'artifacts/fourth-jobs/icon-install-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
