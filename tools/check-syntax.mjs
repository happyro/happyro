/** Syntax-check modules and AsyncFunction scenario bodies without executing them. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {parse} from 'acorn';
const args = process.argv.slice(2);
if (!args.length || args.includes('--help') || args.every(v => v === '--no-color')) {
  const paint = (code, text) => args.includes('--no-color') ? text : `\x1b[${code}m${text}\x1b[0m`;
  console.log(`\n${paint('1;36', 'HappyRO JavaScript syntax check')}\n\n${paint('1;33', 'Usage')}\n  ${paint('1;32', '--run')} [--no-color]\n\n${paint('1;33', 'Example')}\n  ${paint('36', 'node tools/check-syntax.mjs --run --no-color')}\n`);
  process.exit(0);
}
if (!args.includes('--run') || args.some(v => !['--run', '--no-color'].includes(v))) throw new Error('Expected --run [--no-color]');
const root = path.resolve(import.meta.dirname);
async function files(directory) {
  const result = [];
  for (const entry of await fs.readdir(directory, {withFileTypes: true})) {
    if (entry.name === 'node_modules' || entry.name === '__pycache__') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(file));
    else result.push(file);
  }
  return result;
}
let checked = 0;
for (const file of await files(root)) {
  if (!/\.(mjs|cjs|js)$/.test(file)) continue;
  const snippet = file.endsWith('.js') && file.includes('/acceptance/');
  try {
    parse(await fs.readFile(file, 'utf8'), {ecmaVersion: 'latest', sourceType: file.endsWith('.cjs') ? 'script' : 'module',
      allowAwaitOutsideFunction: snippet, allowReturnOutsideFunction: snippet});
  } catch (error) {throw new Error(`${path.relative(root, file)}: ${error.message}`);}
  checked++;
}
console.log(`JavaScript syntax passed: ${checked} modules and scenario bodies (not executed)`);

const registry = JSON.parse(await fs.readFile(path.join(root, 'acceptance/skills/scripts.json'), 'utf8'));
for (const name of registry.scripts) await fs.access(path.join(root, 'acceptance/skills', name));
const scenarios = (await files(path.join(root, 'acceptance/skills/scenarios'))).filter(p => p.endsWith('.js')).map(p => path.relative(path.join(root, 'acceptance/skills'), p)).sort();
if (JSON.stringify(scenarios) !== JSON.stringify(registry.scripts.filter(p => p.endsWith('.js')).sort())) throw new Error('Skill scenario registry differs from maintained files');
console.log(`Scenario inventory passed: ${scenarios.length} explicitly manual skill scenarios`);
