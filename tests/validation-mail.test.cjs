const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadSource } = require('./load-source.cjs');
const valid = { name: 'Valid entry', type: 'period', startDescription: 'A valid description', endDescription: '', startYear: 100, endYear: 200, startMonth: 0, endMonth: 0, startDay: 0, endDay: 0, country: { name: 'France' }, subjects: [{ id: '1', name: 'culture' }] };
for (const [file, symbol] of [['backend/src/validators/inputSchema.ts', 'inputSchema'], ['frontend/src/schemas/postSchema.client.ts', 'postSchemaClient']]) {
  test(`${symbol} enforces persistence lengths and date boundaries without rejecting unknown dates`, () => {
    const schema = loadSource(file)[symbol];
    for (const input of [{ name: 'x'.repeat(51) }, { endDescription: 'x'.repeat(201) }, { startDescription: ' '.repeat(20) }, { startDay: -1 }, { endMonth: -1 }, { endYear: 99 }, { startMonth: 3, endYear: 100, endMonth: 2 }, { startYear: 2025, startMonth: 2, startDay: 29 }]) {
      assert.equal(schema.safeParse({ ...valid, ...input }).success, false, JSON.stringify(input));
    }
    for (const input of [{ name: 'x'.repeat(50), endDescription: 'x'.repeat(200) }, { endYear: 0 }, { startYear: -200, endYear: -100 }, { endYear: 100, startMonth: 4, endMonth: 0 }, { startYear: 2024, endYear: 2025, startMonth: 2, startDay: 29 }]) {
      assert.equal(schema.safeParse({ ...valid, ...input }).success, true, JSON.stringify(input));
    }
  });
}
test('unselected optional theme passes the actual client to API schema path', () => {
  const { postSchemaClient } = loadSource('frontend/src/schemas/postSchema.client.ts');
  const { inputSchema } = loadSource('backend/src/validators/inputSchema.ts');
  const data = postSchemaClient.parse({ ...valid, group: { id: 0, name: '' } });
  assert.equal(data.group, null);
  assert.equal(inputSchema.safeParse(data).success, true);
});
test('registration form observes database username/email lengths', () => {
  const { registerSchema } = loadSource('frontend/src/schemas/registerSchema.ts');
  const input = { username: 'User', email: 'user@example.com', password: 'Valid123!', confirmPassword: 'Valid123!' };
  assert.equal(registerSchema.safeParse(input).success, true);
  assert.equal(registerSchema.safeParse({ ...input, username: 'a'.repeat(21) }).success, false);
  assert.equal(registerSchema.safeParse({ ...input, email: 'a'.repeat(70) + '@example.com' }).success, false);
});
for (const mode of ['success', 'rejection', 'network', 'disabled']) {
  test(`mail helpers handle ${mode} without reporting rejected delivery as success`, async () => {
    const previous = process.env.EMAIL_DELIVERY_MODE;
    process.env.EMAIL_DELIVERY_MODE = mode === 'disabled' ? 'disabled' : 'resend';
    let sends = 0;
    try {
      const mail = loadSource('backend/src/lib/mail.ts', { resend: { Resend: class {
        emails = { send: async () => { sends++; if (mode === 'network') throw new Error('network'); return { error: mode === 'rejection' ? { message: 'private provider details' } : null }; } };
      } } });
      for (const fn of [mail.sendVerificationEmail, mail.sendPasswordResetEmail]) {
        const promise = fn({ to: 'test@example.com', username: 'Test', verificationUrl: 'https://example.com', resetUrl: 'https://example.com' });
        if (mode === 'rejection') await assert.rejects(promise, /Email delivery failed/);
        else if (mode === 'network') await assert.rejects(promise, /network/);
        else await promise;
      }
      assert.equal(sends, mode === 'disabled' ? 0 : 2);
    } finally { if (previous === undefined) delete process.env.EMAIL_DELIVERY_MODE; else process.env.EMAIL_DELIVERY_MODE = previous; }
  });
}

test('clearing a theme remains an explicit null and is visible to moderators', () => {
  const { buildChanges } = loadSource('backend/src/utils/suggestionHelpers.ts');
  const { useReviewDiffs } = loadSource('frontend/src/features/review/hooks/useReviewDiffs.tsx');
  const original = { ...valid, group: { id: 1, name: 'Theme' }, startSignificance: 0, endSignificance: 0 };
  const fields = useReviewDiffs({ post: original, changes: buildChanges(original, { ...original, group: null }) }).metadataFields;
  const field = fields.find(row => row.label === 'Group');
  assert.equal(field.to, ''); assert.equal(field.isDiff, true);
});

test('successful email verification still displays success without a refresh cookie', async () => {
  const fs = require('node:fs');
  const ts = require('../frontend/node_modules/typescript');
  const source = fs.readFileSync('frontend/app/routes/verify.tsx', 'utf8');
  const ast = ts.createSourceFile('verify.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let callback;
  function visit(node) {
    if (!callback && ts.isPropertyAssignment(node) && node.name.getText(ast) === 'onSuccess') callback = node.initializer.getText(ast);
    ts.forEachChild(node, visit);
  }
  visit(ast); assert.ok(callback);
  let view, message;
  const js = ts.transpileModule(`const callback = ${callback};`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const fn = new Function('refreshAndApplySession', 'setView', 'setMessage', 'addToast', 'redirectTimeoutRef', 'window', 'navigate', 'from', js + ';return callback;')(
    async () => { throw new Error('no refresh cookie'); }, value => { view = value; }, value => { message = value; }, () => {}, { current: null }, { setTimeout: () => 1 }, () => {}, '/');
  await fn({ verifyEmail: { success: true } });
  assert.equal(view, 'success'); assert.match(message, /verified successfully/);
});
