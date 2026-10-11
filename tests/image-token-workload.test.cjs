const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { loadSource } = require('./load-source.cjs');
const { fetchWikimediaImage, assertWikimediaImageUrl } = loadSource('backend/src/utils/fetchWikimediaImage.ts');
const origin = 'https://upload.wikimedia.org/wikipedia/commons/a/test.jpg';

async function withFetch(fn, run) { const original = global.fetch; global.fetch = fn; try { await run(); } finally { global.fetch = original; } }
const fetchImage = options => fetchWikimediaImage(origin, new AbortController(), { userAgent: 'fixture', ...options });

test('image origins reject local, custom, credentialed and lookalike URLs before fetching', () => {
  for (const url of ['http://upload.wikimedia.org/a', 'https://127.0.0.1/a', 'https://upload.wikimedia.org.evil.test/a', 'https://upload.wikimedia.org:444/a', 'https://user:pass@upload.wikimedia.org/a', 'file:///etc/passwd']) assert.throws(() => assertWikimediaImageUrl(url));
  assert.equal(assertWikimediaImageUrl(origin).href, origin);
});
test('image redirects are validated before follow; same-origin relative redirects work', async () => {
  let calls = 0;
  await withFetch(async () => { calls++; return new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/private' } }); }, async () => {
    await assert.rejects(fetchImage(), /Image source/); assert.equal(calls, 1);
  });
  calls = 0;
  await withFetch(async (url, options) => {
    assert.equal(options.redirect, 'manual'); calls++;
    return calls === 1 ? new Response(null, { status: 302, headers: { location: '/safe.jpg' } }) : new Response('image', { headers: { 'content-type': 'image/jpeg' } });
  }, async () => { assert.equal((await fetchImage()).buffer.toString(), 'image'); assert.equal(calls, 2); });
});
test('image reads cap both advertised and streamed bytes and stop redirect loops', async () => {
  await withFetch(async () => new Response('123456', { headers: { 'content-type': 'image/png', 'content-length': '6' } }), async () => { await assert.rejects(fetchImage({ maxBytes: 5 }), /byte limit/); });
  await withFetch(async () => new Response('123456', { headers: { 'content-type': 'image/png' } }), async () => { await assert.rejects(fetchImage({ maxBytes: 5 }), /byte limit/); });
  let calls = 0;
  await withFetch(async () => { calls++; return new Response(null, { status: 302, headers: { location: origin } }); }, async () => { await assert.rejects(fetchImage(), /redirect/); assert.equal(calls, 6); });
});
test('image timeout remains active while consuming a stalled body', async () => {
  await withFetch(async (_, { signal }) => new Response(new ReadableStream({ start(controller) { signal.addEventListener('abort', () => controller.error(new Error('aborted')), { once: true }); } }), { headers: { 'content-type': 'image/png' } }), async () => { await assert.rejects(fetchImage({ timeoutMs: 20 }), /aborted/); });
});
test('rate-limited and non-image responses are returned without buffering their body', async () => {
  for (const [status, contentType] of [[429, 'text/plain'], [200, 'text/html'], [200, 'image/svg+xml']]) {
    await withFetch(async () => new Response('body', { status, headers: { 'content-type': contentType } }), async () => { const result = await fetchImage(); assert.equal(result.status, status); assert.equal(result.buffer.length, 0); });
  }
});
test('new tokens use one indexed digest lookup and no bcrypt', async () => {
  let stored, queries = 0, comparisons = 0;
  const tokens = loadSource('backend/src/lib/tokens.ts', {
    '../server/client': { __esModule: true, default: { authToken: {
      deleteMany: async () => {}, create: async ({ data }) => { stored = data; },
      findFirst: async ({ where }) => { queries++; assert.equal(where.type, 'PASSWORD_RESET'); return where.tokenHash === stored.tokenHash ? { ...stored, user: { id: 1 } } : null; },
      findMany: () => { throw new Error('must not scan'); },
    } } },
    bcrypt: { compare: async () => { comparisons++; }, hash: () => { throw new Error('random token does not require password hashing'); } },
  });
  const { rawToken } = await tokens.generateAuthToken(1, 'PASSWORD_RESET');
  assert.match(rawToken, /^v2\.[A-Za-z0-9_-]{43}$/);
  assert.notEqual(stored.tokenHash, rawToken);
  assert.equal(stored.tokenHash, 'sha256:' + crypto.createHash('sha256').update(rawToken).digest('hex'));
  assert.ok(await tokens.findMatchingAuthToken(rawToken, 'PASSWORD_RESET'));
  assert.equal(await tokens.findMatchingAuthToken('v2.' + 'x'.repeat(43), 'PASSWORD_RESET'), null);
  assert.equal(queries, 2); assert.equal(comparisons, 0);
});
test('legacy links still match bcrypt; malformed input does no database work', async () => {
  const raw = 'a'.repeat(43); let scans = 0;
  const tokens = loadSource('backend/src/lib/tokens.ts', {
    '../server/client': { __esModule: true, default: { authToken: { findMany: async ({ where }) => { scans++; assert.deepEqual(where.tokenHash, { startsWith: '$2' }); return [{ id: 'legacy', tokenHash: '$2hash' }]; } } } },
    bcrypt: { compare: async value => value === raw },
  });
  assert.equal((await tokens.findMatchingAuthToken(raw, 'EMAIL_VERIFICATION')).id, 'legacy');
  for (const token of ['', 'x'.repeat(100000), 'v2.invalid']) assert.equal(await tokens.findMatchingAuthToken(token, 'EMAIL_VERIFICATION'), null);
  assert.equal(scans, 1);
});
