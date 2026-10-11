const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadSource } = require('./load-source.cjs');
const fs = require('node:fs');
const ts = require('../frontend/node_modules/typescript');

test('guards distinguish missing authentication from insufficient role', () => {
  const { requireRole } = loadSource('backend/src/utils/auth/requireRole.ts');
  assert.throws(() => requireRole({}, ['ADMIN']), e => e.extensions.code === 'UNAUTHENTICATED');
  assert.throws(() => requireRole({ user: { role: 'USER' } }, ['ADMIN']), e => e.extensions.code === 'FORBIDDEN');
  assert.equal(requireRole({ user: { id: 1, role: 'ADMIN' } }, ['ADMIN']).id, 1);
});

test('saved-filter caches and profile like flags are isolated by viewer without placeholder leakage', async () => {
  const { QueryClient } = require('../frontend/node_modules/@tanstack/react-query');
  const client = new QueryClient();
  let viewer = 'A'; let calls = 0;
  const mocks = {
    '@tanstack/react-query': { useQuery: options => options },
    '../../../context/AuthContext': { useAuth: () => ({ isAuth: { id: viewer, token: viewer } }) },
    '../../../lib/graphql': { graphqlRequest: async () => { calls++; return { savedFilters: [viewer] }; } },
    '../../../graphql/queries': {},
  };
  const { useSavedFiltersQuery } = loadSource('frontend/src/features/filter/hooks/useSavedFilterQueries.tsx', mocks);
  assert.deepEqual(await client.fetchQuery(useSavedFiltersQuery()), { savedFilters: ['A'] });
  viewer = 'B';
  assert.equal(useSavedFiltersQuery().placeholderData, undefined);
  assert.deepEqual(await client.fetchQuery(useSavedFiltersQuery()), { savedFilters: ['B'] });
  assert.equal(calls, 2);
  const users = loadSource('frontend/src/features/user/hooks/useUser.tsx', mocks);
  const bKey = users.useUserLikesQuery({ userId: 1 }).queryKey;
  viewer = null;
  assert.equal(useSavedFiltersQuery().enabled, false);
  assert.notDeepEqual(users.useUserLikesQuery({ userId: 1 }).queryKey, bKey);
  client.clear();
});

test('map tooltip treats markup in country and civilisation names as text', () => {
  const source = fs.readFileSync('frontend/src/components/map/WorldMap.tsx', 'utf8');
  const ast = ts.createSourceFile('map.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let handler;
  function visit(node) {
    if (ts.isCallExpression(node) && node.arguments[0]?.text === 'mouseenter') handler = node.arguments[1].getText(ast);
    ts.forEachChild(node, visit);
  }
  visit(ast); assert.ok(handler);
  const texts = []; const tags = [];
  const selection = new Proxy({}, { get: (_, key) => (...args) => {
    assert.notEqual(key, 'html', 'untrusted tooltip content must not enter an HTML sink');
    if (key === 'text') texts.push(args[0]);
    if (key === 'append') tags.push(args[0]);
    return selection;
  } });
  const country = '<img src=x onerror=alert(1)>';
  const civ = '<iframe srcdoc="test">';
  const js = ts.transpileModule(`const handler = ${handler};`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const fn = new Function('select', 'tooltipRef', 'countryMap', js + ';return handler;')(
    () => selection, { current: {} }, new Map([[country, { civs: [{ name: civ }] }]]));
  fn(null, { properties: { name: country } });
  assert.deepEqual(texts, [country, civ]);
  assert.deepEqual(tags, ['strong', 'br', 'span']);
});

test('refresh callers share one request and logout discards its late session', async () => {
  let finish; let requests = 0;
  const originalFetch = global.fetch;
  global.fetch = () => { requests++; return new Promise(resolve => { finish = resolve; }); };
  try {
    const session = loadSource('frontend/src/lib/authSession.ts', { './api': { setAccessToken() {} } });
    const first = session.fetchRefreshSession();
    const second = session.fetchRefreshSession();
    assert.equal(first, second); assert.equal(requests, 1);
    const outcome = assert.rejects(first, session.SessionChangedError);
    const logout = session.invalidateRefreshSession();
    finish({ ok: true, json: async () => ({ token: 'old', user: { id: 'A' } }) });
    await outcome; await logout;
    await assert.rejects(session.fetchRefreshSession(), session.SessionChangedError);
    session.beginLoginSession();
    const fresh = session.fetchRefreshSession();
    finish({ ok: true, json: async () => ({ token: 'new', user: { id: 'B' } }) });
    assert.equal((await fresh).token, 'new');
  } finally { global.fetch = originalFetch; }
});

for (const operation of ['verifyEmail', 'resetPassword']) {
  test(`${operation} consumes a token once despite two successful eligibility reads`, async () => {
    let reads = 0, release; const barrier = new Promise(resolve => { release = resolve; });
    let used = false, writes = 0, sessions = 0;
    const tx = {
      authToken: { updateMany: async ({ where }) => {
        assert.equal(where.usedAt, null); assert.ok(where.expiresAt.gt instanceof Date);
        if (used) return { count: 0 }; used = true; return { count: 1 };
      } },
      user: { update: async () => { writes++; } },
      refreshToken: { deleteMany: async () => ({ count: 1 }) },
    };
    const auth = loadSource('backend/src/schema/resolvers/mutation/auth.ts', {
      '../../../server/client': { __esModule: true, default: { $transaction: run => run(tx) } },
      '../../../lib/tokens': { findMatchingAuthToken: async () => {
        if (++reads === 2) release(); await barrier;
        return { id: 1, userId: 2, user: { id: 2 } };
      } },
      '../../../lib/mail': {}, '../../../utils/throttle': {},
      '../../../utils/auth/issueTokens': { issueTokens: async () => { sessions++; return 'session'; } },
      'bcrypt': { hash: async () => 'hash' },
    });
    const results = await Promise.allSettled([auth[operation](null, { token: 't', password: 'Valid123!' }, {}), auth[operation](null, { token: 't', password: 'Valid123!' }, {})]);
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(writes, 1);
    assert.equal(sessions, operation === 'resetPassword' ? 1 : 0);
  });
}

test('refresh creates only one successor when both requests read the same row', async () => {
  let handler, reads = 0, release; const barrier = new Promise(resolve => { release = resolve; });
  let deleted = false, created = 0;
  const tx = {
    refreshToken: {
      findFirst: async () => { if (++reads === 2) release(); await barrier; return { id: 1 }; },
      deleteMany: async () => { if (deleted) return { count: 0 }; deleted = true; return { count: 1 }; },
      create: async () => { created++; },
    },
    user: { findUnique: async () => ({ id: 1 }) },
  };
  loadSource('backend/src/routes/authRoutes.ts', {
    express: { Router: () => ({ post: (path, fn) => { if (path === '/refresh') handler = fn; } }) },
    jsonwebtoken: { verify: () => ({ id: 1 }), sign: () => 'signed' },
    '../server/client': { __esModule: true, default: { $transaction: run => run(tx) } },
  });
  const statuses = [];
  const response = () => ({ cookie() {}, json() { statuses.push(200); }, sendStatus(code) { statuses.push(code); } });
  await Promise.all([handler({ cookies: { refreshToken: 'old' } }, response()), handler({ cookies: { refreshToken: 'old' } }, response())]);
  assert.equal(created, 1); assert.deepEqual(statuses.sort(), [200, 403]);
});
