import {parseArgs} from 'node:util';

export function sessionOptions(args) {
  const {values} = parseArgs({args, options: {
    run: {type: 'boolean'}, role: {type: 'string', default: 'main'},
    credentials: {type: 'string'}, character: {type: 'string'},
    port: {type: 'string'}, slot: {type: 'string', default: '0'},
    'base-url': {type: 'string', default: 'http://127.0.0.1:3338'},
    'browser-path': {type: 'string'}, 'no-color': {type: 'boolean'},
  }});
  if (!values.run) throw new Error('Explicit --run required');
  const roles = {
    main: {credentials: 'work/runtime/automation-account.env', port: 9341, user: 'AUTOMATION_ACCOUNT_USER', password: 'AUTOMATION_ACCOUNT_PASSWORD'},
    partner: {credentials: 'work/runtime/test-account.env', port: 9343, user: 'TEST_ACCOUNT_USER', password: 'TEST_ACCOUNT_PASSWORD'},
    assist: {credentials: 'work/runtime/skill-assist-account.env', port: 9345, user: 'AUTOMATION_ACCOUNT_USER', password: 'AUTOMATION_ACCOUNT_PASSWORD'},
  };
  const role = roles[values.role];
  if (!role) throw new Error('role must be main, partner or assist');
  const port = values.port === undefined ? role.port : Number(values.port);
  const slot = Number(values.slot);
  if (!Number.isInteger(port) || port < 1025 || port > 65535) throw new Error('Invalid controller port');
  if (!Number.isInteger(slot) || slot < 0 || slot > 14) throw new Error('Invalid character slot');
  if (!values.character?.trim()) throw new Error('--character must name the dedicated test character');
  if (!values['browser-path']) throw new Error('--browser-path must select the installed Chromium executable');
  const url = new URL(values['base-url']);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid base URL');
  return {...role, role: values.role, credentials: values.credentials || role.credentials,
    port, slot, character: values.character, browserPath: values['browser-path'], baseUrl: url.origin};
}
