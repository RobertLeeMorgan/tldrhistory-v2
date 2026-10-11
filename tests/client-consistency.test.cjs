const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadSource } = require('./load-source.cjs');
const React = require('../frontend/node_modules/react');
const { renderToString } = require('../frontend/node_modules/react-dom/server');
const { QueryClient, QueryClientProvider } = require('node:module').createRequire(require('node:path').resolve('frontend/package.json'))('@tanstack/react-query');

test('profile initial render agrees between server and fresh client caches using loader data', () => {
  const initial = { userStats: { username: 'Fixture', createdAt: '0', emailVerifiedAt: null, stats: {} } };
  const file = 'frontend/app/routes/user.$id.tsx';
  const sources = process.env.AUDIT_BASELINE ? { [file]: require('node:child_process').execFileSync('git', ['-c', 'safe.directory=C:/Users/rober/WebDev/projects/tldrhistory-v2', 'show', 'HEAD:' + file], { encoding: 'utf8' }) } : {};
  const User = loadSource(file, {
    'react-router': { useParams: () => ({ id: '1' }), useLoaderData: () => initial },
    '../../src/lib/seo': {}, '../../src/lib/queryClient': {},
    '../../src/features/user/components/UserHeader': { __esModule: true, default: ({ user, isLoading }) => React.createElement('div', null, isLoading ? 'loading' : user) },
    '../../src/features/user/components/UserStats': { __esModule: true, default: () => null },
    '../../src/features/user/components/UserTimeline': { __esModule: true, default: () => null },
    '../../../context/AuthContext': {},
    '../../../lib/graphql': { graphqlRequest: () => { throw new Error('initial render must not fetch'); } },
    '../../src/lib/graphql': {},
  }, new Map(), sources).default;
  const server = new QueryClient(); server.setQueryData(['userStats', 1], initial);
  const browser = new QueryClient();
  const render = client => renderToString(React.createElement(QueryClientProvider, { client }, React.createElement(User)));
  try { assert.equal(render(server), render(browser)); assert.match(render(browser), /Fixture/); }
  finally { server.clear(); browser.clear(); }
});

test('publish/delete invalidation reaches actual infinite, profile, map and review cache keys', async () => {
  const client = new QueryClient();
  const keys = [['timeline','list',{},'A'], ['userPosts',1,'A'], ['userLikes',1,'A'], ['userStats',1], ['civilisation',0,100], ['significant',{}], ['post',{id:1}], ['pendingEdits'], ['pendingCreatedPosts'], ['pendingStats']];
  for (const key of [...keys, ['savedFilters','A'], ['population',{}]]) client.setQueryData(key, { fixture: true });
  await loadSource('frontend/src/lib/invalidatePostQueries.ts').invalidatePostQueries(client);
  for (const key of keys) assert.equal(client.getQueryState(key).isInvalidated, true, JSON.stringify(key));
  assert.equal(client.getQueryState(['savedFilters','A']).isInvalidated, false);
  assert.equal(client.getQueryState(['population',{}]).isInvalidated, false);
  client.clear();
});

test('approve/reject hooks invalidate moderation totals; publishing invalidates post consumers', async () => {
  for (const [file, names] of [['useCreate.tsx', ['useApproveCreatedPost','useRejectCreatedPost']], ['useEdit.tsx', ['useApproveEdit','useRejectEdit']]]) {
    const invalidated = [];
    const hooks = loadSource('frontend/src/features/review/hooks/' + file, {
      '@tanstack/react-query': { useMutation: options => options, useQueryClient: () => ({ invalidateQueries: ({ queryKey }) => { invalidated.push(queryKey[0]); } }) },
      '../../../lib/graphql': {},
    });
    for (const name of names) {
      invalidated.length = 0; await hooks[name]().onSuccess();
      assert.ok(invalidated.includes('pendingStats'));
      assert.equal(invalidated.includes('timeline'), name.includes('Approve'));
    }
  }
});
