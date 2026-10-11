const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource } = require('./load-source.cjs');

const post = {
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  id: '42', name: 'Example civilisation', type: 'period',
  startDescription: 'The original description.', endDescription: '',
  startYear: 100, startMonth: 0, startDay: 0,
  endYear: 200, endMonth: 0, endDay: 0,
  startSignificance: 1, endSignificance: 0.8, civilisation: true,
  imageUrl: '', imageCredit: '', sourceUrl: '',
  country: { name: 'France' }, group: { id: 1, name: 'Example theme' },
  subjects: [{ id: '1', name: 'culture' }],
  userId: 7, user: { id: 7, username: 'Author', role: 'USER' },
};

function findElement(element, type) {
  if (element?.type === type) return element;
  for (const child of [element?.props?.children].flat()) {
    if (child && typeof child === 'object') {
      const found = findElement(child, type);
      if (found) return found;
    }
  }
}

function submitEdit(original) {
  const calls = [];
  const PostForm = () => null;
  const { default: Edit } = loadSource('frontend/src/pages/Edit.tsx', {
    'react-router': { useParams: () => ({ id: original.id }), useNavigate: () => () => {} },
    '../../src/features/review/hooks/useSuggestions': {
      usePostQuery: () => ({ data: { getPost: original, formLists: {} } }),
    },
    '../../src/features/review/hooks/useEdit': {
      useSuggestEditMutation: () => ({ mutate: (variables) => calls.push(variables) }),
    },
    '../../src/context/ToastContext': { useToast: () => ({ addToast() {} }) },
    '../../src/features/form/components/PostForm': { __esModule: true, default: PostForm },
    '../../src/components/ui/PageContainer': { __esModule: true, default: () => null },
  });
  const { postSchemaClient } = loadSource('frontend/src/schemas/postSchema.client.ts');
  const formData = postSchemaClient.parse({ ...original, startDescription: 'An updated description.' });
  // PostForm calls onSubmit with parsed form data, not the GraphQL response.
  findElement(Edit(), PostForm).props.onSubmit(formData);
  assert.equal(calls.length, 1);
  return JSON.parse(JSON.stringify(calls[0]));
}

for (const scores of [[1, 0.8], [0, 0], [0.25, 1]]) {
  test(`description-only edit preserves ${scores.join('/')} through approval`, async () => {
    const original = { ...post, startSignificance: scores[0], endSignificance: scores[1] };
    const variables = submitEdit(original);
    let storedSuggestion;
    let published;
    let reviewed;
    const prisma = {
      country: { findUnique: async () => ({ name: "France" }) },
      group: { findUnique: async () => ({ id: 1 }) },
      subject: { count: async () => 1 },
      user: { findUnique: async () => ({ emailVerifiedAt: new Date() }) },
      post: {
        findUnique: async () => original,
        update: async ({ data }) => { published = data; return data; },
      },
      editSuggestion: {
        create: async ({ data }) => { storedSuggestion = { id: 9, ...data }; return storedSuggestion; },
        findUnique: async () => storedSuggestion,
        update: async ({ data }) => { reviewed = data; return data; },
        updateMany: async () => ({ count: 1 }),
      },
      $transaction: async (run) => run(prisma),
    };
    const { suggestEdit, approveEdit } = loadSource('backend/src/schema/resolvers/mutation/edits.ts', {
      '../../../server/client': { __esModule: true, default: prisma },
      '../../server/client': { __esModule: true, default: prisma },
      '../server/client': { __esModule: true, default: prisma },
    });
    await suggestEdit(null, variables, { user: { id: 7, role: 'USER' } });
    assert.equal(await approveEdit(null, { id: 9 }, { user: { id: 8, role: 'MODERATOR' } }), true);
    assert.deepEqual(
      [published.startSignificance, published.endSignificance], scores,
    );
    assert.equal(published.startDescription, 'An updated description.');
    assert.equal(published.name, original.name);
    assert.equal(published.civilisation, true);
    assert.deepEqual(published.subjects, { set: [{ id: 1 }] });
    assert.equal(reviewed.status, 'approved');
    assert.equal(reviewed.moderatorId, 8);
  });
}

function reviewScores(original, proposed) {
  const { buildChanges } = loadSource('backend/src/utils/suggestionHelpers.ts');
  const { useReviewDiffs } = loadSource('frontend/src/features/review/hooks/useReviewDiffs.tsx');
  return useReviewDiffs({ post: original, changes: buildChanges(original, proposed) }).metadataFields;
}

test('review exposes explicit score changes, including a change to zero', () => {
  const fields = reviewScores(post, { ...post, startSignificance: 0, endSignificance: 0.5 });
  const scores = fields.filter((field) => /significance/i.test(field.label));
  assert.deepEqual(scores.map(({ label, from, to, isDiff }) => ({ label, from, to, isDiff })), [
    { label: 'Start significance', from: 1, to: 0, isDiff: true },
    { label: 'End significance', from: 0.8, to: 0.5, isDiff: true },
  ]);
});

test('unchanged scores do not add review rows', () => {
  const fields = reviewScores(post, { ...post, startDescription: 'An updated description.' });
  assert.equal(fields.some((field) => /significance/i.test(field.label)), false);
});

test('review renders zero significance as a number rather than empty', () => {
  const { createElement } = require('../frontend/node_modules/react');
  const { renderToStaticMarkup } = require('../frontend/node_modules/react-dom/server');
  const { default: ReviewDiff } = loadSource('frontend/src/features/review/components/ReviewDiff.tsx');
  const fields = reviewScores(post, { ...post, startSignificance: 0, endSignificance: 0 })
    .filter((field) => /significance/i.test(field.label));
  assert.equal(fields.length, 2);
  for (const field of fields) {
    const html = renderToStaticMarkup(createElement(ReviewDiff, { fields: [field] }));
    assert.match(html, /<span>0<\/span>/);
    assert.doesNotMatch(html, /empty/);
  }
});

test('explicit API significance values and creation defaults keep their existing semantics', async () => {
  const { inputSchema } = loadSource('backend/src/validators/inputSchema.ts');
  const explicit = await inputSchema.parseAsync({ ...post, startSignificance: 0, endSignificance: 0.4 });
  assert.deepEqual([explicit.startSignificance, explicit.endSignificance], [0, 0.4]);
  const omitted = await inputSchema.parseAsync({ ...post, startSignificance: undefined, endSignificance: undefined });
  assert.deepEqual([omitted.startSignificance, omitted.endSignificance], [0, 0]);
});
