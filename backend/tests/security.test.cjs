const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildSchema, parse, validate } = require('graphql');
const { passwordSchema, registerSchema } = require('../dist/validators/authSchema');
const { boundedOperation, rejectPersistedQueries } = require('../dist/server/graphqlPolicy');
const { isTrustedSsr } = require('../dist/server/rateLimit');

test('registration and reset enforce server-side password/account bounds', () => {
  for (const password of ['', 'short', 'x'.repeat(73), '😀'.repeat(19)]) {
    assert.equal(passwordSchema.safeParse(password).success, false);
  }
  assert.equal(passwordSchema.safeParse('a long passphrase').success, true);
  const valid = { email: 'Test@example.invalid', username: 'test-user', password: 'a long passphrase' };
  assert.equal(registerSchema.parse(valid).email, 'test@example.invalid');
  for (const change of [{username:'x'.repeat(21)}, {username:'<script>'}, {email:'invalid'}, {password:''}]) {
    assert.equal(registerSchema.safeParse({...valid,...change}).success, false);
  }
});

test('hash-only persisted queries are rejected before authentication classification', () => {
  let status, next = false;
  const res = { status(n) { status=n; return this; }, json() {} };
  rejectPersistedQueries({body:{extensions:{persistedQuery:{version:1,sha256Hash:'0'.repeat(64)}}},query:{}},res,()=>{next=true;});
  assert.equal(status,400);assert.equal(next,false);
  rejectPersistedQueries({body:{query:'{ __typename }'},query:{}},res,()=>{next=true;});
  assert.equal(next,true);
});

const schema = buildSchema('type Query { item: Item } type Item { name: String, child: Item } type Mutation { login: String }');
const check = query => validate(schema, parse(query), [boundedOperation]);
test('operation limits count aliases, nested fields and expanded fragments', () => {
  assert.equal(check('{ item { name } }').length,0);
  assert.equal(check('mutation { login }').length,0);
  assert.equal(check('mutation { a:login b:login }').length,1);
  assert.equal(check('{'+Array.from({length:21},(_,i)=>`a${i}:item{name}`).join(' ')+'}').length,1);
  assert.equal(check('{item{'+ 'child{'.repeat(12)+'name'+'}'.repeat(12)+'}}').length,1);
  assert.equal(check('mutation { ...A ...B } fragment A on Mutation {a:login} fragment B on Mutation {b:login}').length,1);
});

test('SSR exemption requires the configured secret; absent and forged headers stay public', () => {
  const before=process.env.SSR_API_KEY;
  try {
    process.env.SSR_API_KEY='synthetic-test-secret';
    assert.equal(isTrustedSsr({get:()=>undefined}),false);
    assert.equal(isTrustedSsr({get:()=> 'forged'}),false);
    assert.equal(isTrustedSsr({get:()=> 'synthetic-test-secret'}),true);
    delete process.env.SSR_API_KEY;
    assert.equal(isTrustedSsr({get:()=> 'synthetic-test-secret'}),false);
  } finally { if(before!==undefined)process.env.SSR_API_KEY=before;else delete process.env.SSR_API_KEY; }
});
