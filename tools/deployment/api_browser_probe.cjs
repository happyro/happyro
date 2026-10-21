(async () => {
 const args = process.argv.slice(2);
 const plain = args.includes('--no-color');
 const positional = args.filter(value => value !== '--no-color');
 const url = positional[0];
 if (!url || url === '--help') {
  const color = (code, text) => plain ? text : `\x1b[${code}m${text}\x1b[0m`;
  console.log(`\n${color('1;36','HappyRO Go Admin browser verification')}\n\n${color('1;33','Usage')}\n  ${color('1;32','node tools/deployment/api_browser_probe.cjs <isolated-admin-url>')} [--no-color]\n\n${color('1;33','Example')}\n  ${color('36','node tools/deployment/api_browser_probe.cjs http://127.0.0.1:8080')}\n\nRequires playwright-core (NODE_PATH) and HAPPYRO_GO_CHROME_BINARY. Uses fixture admin/admin.\n`);
  return;
 }
 if (positional.length !== 1 || !/^http:\/\/(127\.0\.0\.1|localhost):[0-9]+$/.test(url)) throw new Error('Expected one isolated loopback HTTP URL');
 if (!process.env.HAPPYRO_GO_CHROME_BINARY) throw new Error('Set HAPPYRO_GO_CHROME_BINARY');
 const { chromium } = require('playwright-core');
 const browser = await chromium.launch({executablePath:process.env.HAPPYRO_GO_CHROME_BINARY, headless:true});
 try {
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto(url+'/user/login',{waitUntil:'networkidle'});
  await page.locator('input[name="username"], input#username').fill('admin');
  await page.locator('input[name="password"], input#password').fill('admin');
  await page.getByRole('button', {name:/登\s*录|Login|Sign in/i}).click();
  await page.waitForURL(u=>!u.pathname.includes('/user/login'),{timeout:20000});
  const user=await context.request.get(url+'/api/auth/user');
  if(user.status()!==200) throw new Error('browser session missing');
  await page.goto(url+'/players/accounts',{waitUntil:'networkidle'});
  await page.waitForSelector('.ant-table-tbody tr.ant-table-row');
  if (process.env.HAPPYRO_GO_BROWSER_SCREENSHOT) await page.screenshot({path:process.env.HAPPYRO_GO_BROWSER_SCREENSHOT,fullPage:true});
  await page.reload({waitUntil:'networkidle'});
  if(page.url().includes('/user/login')) throw new Error('reload lost session');
  await page.goto(url+'/game-data/items',{waitUntil:'networkidle'});
  await page.waitForSelector('.ant-table-tbody tr.ant-table-row');
  if(errors.length) throw new Error(errors.join('\n'));
  console.log('Browser login, account table, reload session and item catalog passed');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
