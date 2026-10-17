import { fileURLToPath } from 'node:url';
export function requireAuditCommand(url) {
 const args = process.argv.slice(2).filter(arg => arg !== '--no-color');
 if (!args.length || args.includes('--help') || args.includes('-h')) {
  const color = !process.argv.includes('--no-color');
  const paint = (code, text) => color ? `\x1b[${code}m${text}\x1b[0m` : text;
  const path = fileURLToPath(url).replace(process.cwd() + '/', '');
  console.log(`\n${paint('1;36', 'HappyRO skill audit')}\n${paint('1;33', 'Usage')}\n  node ${path} ${paint('1;32', '--run')} [options] [--no-color]\n${paint('1;33', 'Example')}\n  ${paint('36', `node ${path} --help --no-color`)}\n\nRead tools/skill-audit/README.md and the script prerequisites before running.\n`);
  process.exit(0);
 }
 if (!args.includes('--run')) throw new Error('Explicit --run required; use --help');
}
