// Browser acceptance checks against the real dev frontend and its disposable-db backend.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const origin = process.env.TLDR_INTEGRATION_FRONTEND || 'http://localhost:15173';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname)) throw Error('Frontend must be local');
const databaseUrl = process.env.TLDR_INTEGRATION_DATABASE_URL;
if (!databaseUrl || !['localhost', '127.0.0.1', '[::1]'].includes(new URL(databaseUrl).hostname) ||
    !/^tldrhistory_integration_[a-z0-9]+$/.test(new URL(databaseUrl).pathname.slice(1))) {
  throw Error('Browser test requires a disposable local database URL');
}
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tldr-integration-browser-'));
  const edge = spawn(process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
    '--headless=new', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1',
    '--user-data-dir=' + profile, '--no-first-run', '--disable-background-networking',
    '--disable-sync', '--disable-gpu', 'about:blank',
  ], { windowsHide: true, stdio: 'ignore' });
  let ws;
  try {
    const active = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !fs.existsSync(active); i++) await sleep(100);
    const port = fs.readFileSync(active, 'utf8').split('\n')[0];
    const page = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
    ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
    let id = 0;
    const pending = new Map();
    const errors = [];
    ws.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const entry = pending.get(message.id); pending.delete(message.id);
        message.error ? entry.reject(message.error) : entry.resolve(message.result);
      } else if (message.method === 'Runtime.exceptionThrown') {
        errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
      }
    };
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params }));
    });
    const evaluate = async expression => {
      const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || 'evaluate failed');
      return result.result.value;
    };
    const until = async expression => {
      for (let i = 0; i < 120; i++) { if (await evaluate(`Boolean(${expression})`)) return; await sleep(100); }
      const snapshot = await evaluate("({url:location.href,text:document.body.textContent.slice(0,600),profile:[...document.querySelectorAll('a[href^=\"/user/\"]')].map(a=>a.getAttribute('href')),inputs:[...document.querySelectorAll('input')].map(x=>({name:x.name,value:x.value}))})");
      throw Error('Timed out: ' + expression + '; browser errors: ' + JSON.stringify(errors) + '; snapshot: ' + JSON.stringify(snapshot));
    };
    await call('Runtime.enable'); await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: `${origin}/timeline` });
    await until("document.querySelectorAll('[data-post-id]').length > 0 && document.querySelector('header')");
    await until("document.querySelector('svg .map-paths path')");
    await sleep(500);
    const initial = await evaluate("({cards:document.querySelectorAll('[data-post-id]').length,header:document.querySelector('header').textContent.trim().slice(0,80),mapDots:document.querySelectorAll('svg .dots circle').length})");
    assert.ok(initial.cards > 0 && initial.cards <= 20 && initial.mapDots > 0, JSON.stringify(initial));
    assert.equal(await evaluate("document.querySelector('svg .dots circle').__data__.properties.name"), 'France');
    const checkEra = async () => {
      await sleep(500);
      const state = await evaluate(`(()=>{const visible=[...document.querySelectorAll('[data-post-id]')].map(n=>({year:Number(n.dataset.startYear),top:n.getBoundingClientRect().top})).filter(x=>x.top>=0&&x.top<innerHeight).map(x=>x.year);return {visible,header:document.querySelector('header').textContent.trim().slice(0,80),dots:document.querySelectorAll('svg .dots circle').length}})()`);
      assert.ok(state.visible.length > 0 && state.header.length > 0, JSON.stringify(state));
      return state;
    };
    await checkEra();
    const initialMaxYear = await evaluate("Math.max(...[...document.querySelectorAll('[data-post-id]')].map(n=>Number(n.dataset.startYear)))");
    await evaluate('scrollTo(0,document.documentElement.scrollHeight)');
    await until("[...document.querySelectorAll('[data-post-id]')].some(n=>Number(n.dataset.startYear)>110)");
    assert.ok(await evaluate(`Math.max(...[...document.querySelectorAll('[data-post-id]')].map(n=>Number(n.dataset.startYear)))>${initialMaxYear}`));
    await checkEra();
    await evaluate('scrollTo(0,0)'); await checkEra();
    await evaluate("document.querySelector('[data-post-id]').click()");
    await until("document.body.style.overflow==='hidden'");
    await evaluate("window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))");
    await until("document.body.style.overflow!== 'hidden'");
    console.log('PASS browser timeline: real cards, pagination, era/map rendering, scroll and modal navigation', initial);

    await call('Page.navigate', { url: `${origin}/timeline?ys=220&ye=230` });
    await until("location.search.includes('ys=220') && document.querySelector('svg .dots circle')?.__data__?.properties?.name==='Japan'");
    assert.ok(await evaluate("document.querySelector('header').textContent.includes('220')"));
    console.log('PASS browser era and map synchronization: France at year 100, Japan at year 220');

    await call('Page.navigate', { url: `${origin}/timeline?c=Asia&o=desc` });
    await until("document.querySelectorAll('[data-post-id]').length > 0");
    const filtered = await evaluate("({names:[...document.querySelectorAll('[data-post-id]')].map(n=>n.textContent),url:location.search})");
    assert.ok(filtered.url.includes('c=Asia'), JSON.stringify(filtered));
    assert.ok(filtered.names.some(n => n.includes('Timeline')), JSON.stringify(filtered.names.slice(0, 2)));
    assert.ok(filtered.names.every(n => n.includes('Integration-Asia') || n.includes('Japan')), JSON.stringify(filtered.names.slice(0, 3)));
    const years = await evaluate("[...document.querySelectorAll('[data-post-id]')].map(n=>Number(n.dataset.startYear))");
    assert.deepEqual(years, [...years].sort((a, b) => b - a));
    await call('Page.navigate', { url: `${origin}/timeline?q=Founding` });
    await until("document.querySelectorAll('[data-post-id]').length > 0");
    assert.ok(await evaluate("[...document.querySelectorAll('[data-post-id]')].every(n=>n.textContent.includes('Founding'))"));
    await evaluate('history.back()');
    await until("location.search.includes('c=Asia')");
    console.log('PASS browser filters, sorting URL and back navigation');

    const author = await prisma.user.findFirstOrThrow({ where: { username: { startsWith: 'author' } }, orderBy: { id: 'desc' } });
    const second = await prisma.user.findFirstOrThrow({ where: { username: `second${author.username.slice('author'.length)}` } });
    const login = async (email, password, expectedId) => {
      await call('Page.navigate', { url: `${origin}/login` });
      await until("document.querySelector('input[aria-label=email]') && document.querySelector('input[aria-label=password]')");
      await sleep(1500);
      await evaluate(`(()=>{for(const [selector,value] of ${JSON.stringify([['input[aria-label=email]', email], ['input[aria-label=password]', password]])}){const input=document.querySelector(selector);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('form button[type=submit]').click()})()`);
      await until(`document.querySelector('a[href="/user/${expectedId}"]')`);
      assert.ok(await evaluate(`document.querySelector('a[href="/user/${expectedId}"]')!==null`));
    };
    await login(author.email, 'StrongPass1!', author.id);
    await evaluate("document.querySelector('button[aria-label=logout]').click()");
    await until("document.querySelector('a[aria-label=login]')");
    assert.equal(await evaluate("fetch('/api/refresh',{method:'POST',credentials:'include'}).then(r=>r.status)"), 401);
    await login(second.email, 'NewStrongPass2!', second.id);
    assert.equal(await evaluate(`document.querySelector('a[href="/user/${author.id}"]')`), null);
    console.log('PASS browser login, logout and account switch');
    assert.deepEqual(errors, []);
  } finally {
    if (ws) ws.close();
    edge.kill();
    await prisma.$disconnect();
    const resolvedProfile = path.resolve(profile);
    if (path.dirname(resolvedProfile) !== path.resolve(os.tmpdir()) ||
        !path.basename(resolvedProfile).startsWith('tldr-integration-browser-')) {
      throw Error('Refusing to clean a browser profile outside the temp directory');
    }
    try { fs.rmSync(resolvedProfile, { recursive: true, force: true }); } catch { /* Edge may still be releasing files. */ }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
