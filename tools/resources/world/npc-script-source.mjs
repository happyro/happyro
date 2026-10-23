/** Keep source line numbers while excluding comments and script-body declarations. */
export function topLevelSourceLines(source) {
	let mode = 'code';
	let depth = 0;
	let lineDepth = 0;
	let line = '';
	const lines = [];
	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		const next = source[i + 1];
		if (ch === '\n') {
			lines.push(lineDepth === 0 ? line : '');
			line = '';
			lineDepth = depth;
			if (mode === 'line-comment') mode = 'code';
			continue;
		}
		if (mode === 'line-comment') {
			line += ' ';
		} else if (mode === 'block-comment') {
			line += ' ';
			if (ch === '*' && next === '/') { mode = 'code'; line += ' '; i++; }
		} else if (mode === 'string') {
			line += ch;
			if (ch === '\\' && next !== '\n' && next !== undefined) { line += next; i++; }
			else if (ch === '"') mode = 'code';
		} else if (ch === '/' && next === '/') {
			mode = 'line-comment'; line += '  '; i++;
		} else if (ch === '/' && next === '*') {
			mode = 'block-comment'; line += '  '; i++;
		} else {
			line += ch;
			if (ch === '"') mode = 'string';
			else if (ch === '{') depth++;
			else if (ch === '}') depth--;
		}
	}
	lines.push(lineDepth === 0 ? line : '');
	return lines;
}
