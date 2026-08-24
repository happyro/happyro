import fs from 'node:fs/promises';
import path from 'node:path';

const repo = path.resolve(new URL('../../../', import.meta.url).pathname);
const root = path.join(repo, 'docs/translation/zh-cn/kro-20211105');
const columns = [
  'agent_id', 'repo', 'path', 'domain', 'text_scope', 'unit_type', 'chunk_id',
  'start_line', 'end_line', 'source_chunk', 'translated_chunk', 'status', 'notes'
];

const readTsv = async (file, expectedColumns = columns) => {
  const text = await fs.readFile(file, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split('\t');
  if (header.join('\t') !== expectedColumns.join('\t')) {
    throw new Error(`${file}: unexpected header`);
  }
  return lines.map((line, index) => {
    const values = line.split('\t');
    if (values.length !== expectedColumns.length) {
      throw new Error(`${file}: line ${index + 2} has ${values.length} columns`);
    }
    return Object.fromEntries(expectedColumns.map((key, i) => [key, values[i]]));
  });
};

const manifest = await readTsv(path.join(root, 'manifest.tsv'));
const errors = [];
const byAgent = new Map();
for (const row of manifest) {
  if (!/^agent-0[1-4]$/.test(row.agent_id)) errors.push(`invalid agent: ${row.agent_id}`);
  if (row.status !== '待处理') errors.push(`${row.path}/${row.chunk_id}: status is ${row.status}`);
  const source = path.join(root, row.agent_id, row.source_chunk);
  try {
    const data = await fs.readFile(source);
    const lineCount = row.unit_type === 'chunk'
      ? data.toString('utf8').split(/\r?\n/).filter(Boolean).length
      : data.filter(byte => byte === 10).length + (data.length && data[data.length - 1] !== 10 ? 1 : 0);
    if (lineCount > 500) errors.push(`${source}: ${lineCount} lines`);
    if (source.endsWith('.json')) JSON.parse(data.toString('utf8'));
  } catch (error) {
    errors.push(`${source}: ${error.message}`);
  }
  const list = byAgent.get(row.agent_id) ?? [];
  list.push(row);
  byAgent.set(row.agent_id, list);
}

for (const [agent, rows] of byAgent) {
  const agentManifest = await readTsv(path.join(root, agent, 'manifest.tsv'), columns.slice(1));
  const a = rows.map(row => `${row.path}\\t${row.chunk_id}`).sort().join('\\n');
  const b = agentManifest.map(row => `${row.path}\\t${row.chunk_id}`).sort().join('\\n');
  if (a !== b) errors.push(`${agent}/manifest.tsv does not match root manifest`);
}

for (const [sourcePath, rows] of Map.groupBy(manifest, row => row.path)) {
  const sorted = rows.toSorted((a, b) => Number(a.start_line) - Number(b.start_line));
  for (let i = 1; i < sorted.length; i += 1) {
    if (Number(sorted[i - 1].end_line) + 1 !== Number(sorted[i].start_line)) {
      errors.push(`${sourcePath}: non-contiguous range near ${sorted[i].chunk_id}`);
    }
  }
}

const extracted = await fs.readFile(path.join(root, 'status/extracted-files.tsv'), 'utf8');
const extractedLines = extracted.split(/\r?\n/).filter(Boolean).slice(1);
const extractedUnits = extractedLines.reduce((sum, line) => sum + Number(line.split('\t')[6]), 0);
if (extractedUnits !== manifest.length) {
  errors.push(`extracted-files.tsv units ${extractedUnits} != manifest rows ${manifest.length}`);
}

if (errors.length) {
  console.error(errors.join('\\n'));
  process.exit(1);
}
console.log(`kRO workspace valid: ${manifest.length} units, ${byAgent.size} agents`);
