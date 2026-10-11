const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadSource } = require('./load-source.cjs');
const { GraphQLError } = require('../backend/node_modules/graphql');

const input = { name: 'Valid entry', type: 'period', startDescription: 'Original description', endDescription: '', startYear: 100, endYear: 200, startMonth: 0, endMonth: 0, startDay: 0, endDay: 0, country: { name: 'France' }, subjects: [{ id: 1, name: 'culture' }] };
const moderator = { user: { id: 2, role: 'MODERATOR' } };

test('API registration and reset reject form-invalid credentials before database work', async () => {
  const auth = loadSource('backend/src/schema/resolvers/mutation/auth.ts', {
    '../../../server/client': { __esModule: true, default: new Proxy({}, { get() { throw new Error('unexpected database work'); } }) },
    '../../../lib/tokens': { findMatchingAuthToken() { throw new Error('unexpected token lookup'); } },
    '../../../lib/mail': {}, '../../../utils/auth/issueTokens': {}, '../../../utils/throttle': {},
  });
  for (const change of [{ password: '' }, { password: 'abcdefgh' }, { username: '1invalid' }, { email: 'invalid' }, { username: 'a'.repeat(21) }]) {
    await assert.rejects(auth.register(null, { email: 'user@example.com', username: 'Valid', password: 'Valid123!', ...change }, {}), e => e.extensions?.code === 'BAD_USER_INPUT');
  }
  await assert.rejects(auth.resetPassword(null, { token: 'valid', password: '' }, {}), e => e.extensions?.code === 'BAD_USER_INPUT');
});
test('API password and registration rules agree with valid form inputs', () => {
  const { registerSchema, passwordSchema } = loadSource('backend/src/validators/authSchema.ts');
  assert.equal(registerSchema.safeParse({ email: 'user@example.com', username: 'User-2', password: 'Valid123!' }).success, true);
  assert.equal(passwordSchema.safeParse('Valid123!').success, true);
});
for (const file of ['posts', 'edits']) {
  test(`${file} submission requires current email verification, even for privileged accounts`, async () => {
    let verified = null, writes = 0;
    const prisma = { user: { findUnique: async () => ({ emailVerifiedAt: verified }) } };
    const hooks = loadSource(`backend/src/schema/resolvers/mutation/${file}.ts`, {
      '../../../server/client': { __esModule: true, default: prisma },
      '../../server/client': { __esModule: true, default: prisma },
      '../../../validators/postReferences': { validatePostReferences: async () => { writes++; throw new Error('verified boundary reached'); } },
    });
    const submit = file === 'posts' ? hooks.createPostSuggestion : hooks.suggestEdit;
    for (const role of ['USER', 'MODERATOR', 'ADMIN']) await assert.rejects(submit(null, { postId: 1, input }, { user: { id: 1, role } }), e => e.extensions.code === 'FORBIDDEN');
    assert.equal(writes, 0);
    verified = new Date();
    await assert.rejects(submit(null, { postId: 1, input }, moderator), /verified boundary reached/);
    assert.equal(writes, 1);
  });
}
test('moderation counts deny anonymous and USER before database reads', async () => {
  let reads = 0;
  const model = { groupBy: async () => { reads++; return [{ status: 'pending', _count: { _all: 1 } }]; } };
  const { pendingStats } = loadSource('backend/src/schema/resolvers/query/suggestions.ts', {
    '../../../server/client': { __esModule: true, default: { editSuggestion: model, createdPost: model } },
  });
  await assert.rejects(pendingStats(null, null, { user: null }), e => e.extensions.code === 'UNAUTHENTICATED');
  await assert.rejects(pendingStats(null, null, { user: { id: 1, role: 'USER' } }), e => e.extensions.code === 'FORBIDDEN');
  assert.equal(reads, 0);
  for (const role of ['MODERATOR', 'ADMIN']) assert.equal((await pendingStats(null, null, { user: { id: 1, role } })).pending, 2);
});
test('post references fail at submission for missing country, group or subjects', async () => {
  let missing;
  const { validatePostReferences } = loadSource('backend/src/validators/postReferences.ts', {
    '../server/client': { __esModule: true, default: {
      country: { findUnique: async () => missing === 'country' ? null : {} },
      group: { findUnique: async () => missing === 'group' ? null : {} },
      subject: { count: async () => missing === 'subjects' ? 0 : 1 },
    } },
  });
  await validatePostReferences(input);
  for (missing of ['country', 'group', 'subjects']) await assert.rejects(validatePostReferences({ ...input, group: { id: 1, name: 'Theme' } }), e => e.extensions.code === 'BAD_USER_INPUT');
});

function editFixture() {
  let post = { ...input, id: 1, updatedAt: new Date('2026-01-01'), userId: 1, user: { id: 1, role: 'USER', username: 'Author' } };
  let suggestions = new Map(); let nextId = 1;
  const prisma = {
    user: { findUnique: async () => ({ emailVerifiedAt: new Date() }) },
    editSuggestion: {
      create: async ({ data }) => { const row = { id: nextId++, createdAt: new Date('2026-01-02'), ...data }; suggestions.set(row.id,row);return row; },
      findUnique: async ({ where }) => structuredClone(suggestions.get(where.id)),
      updateMany: async ({ where, data }) => {const row=suggestions.get(where.id);if(!row||row.status!==where.status)return {count:0};Object.assign(row,data);return {count:1}},
      update: async ({ where, data }) => Object.assign(suggestions.get(where.id),data),
    },
    post: {
      findUnique: async () => structuredClone(post),
      update: async ({ where, data }) => { if(where.updatedAt.getTime()!==post.updatedAt.getTime())throw Object.assign(new Error('changed'),{code:'P2025'});Object.assign(post,data);return post; },
    },
    $transaction: async run => { const previous=structuredClone({post,suggestions});try{return await run(prisma)}catch(error){post=previous.post;suggestions=previous.suggestions;throw error} },
  };
  const hooks = loadSource('backend/src/schema/resolvers/mutation/edits.ts', {
    '../../../server/client': { __esModule: true, default: prisma }, '../../server/client': { __esModule: true, default: prisma },
    '../../../validators/postReferences': { validatePostReferences: async () => {} },
  });
  return { hooks, prisma, getPost:()=>post, getSuggestion:id=>suggestions.get(id) };
}
test('a second snapshot cannot undo an approved edit; failed claim rolls back', async () => {
  const f=editFixture();
  const a=await f.hooks.suggestEdit(null,{postId:1,input:{...input,startDescription:'First approved description'}},moderator);
  const b=await f.hooks.suggestEdit(null,{postId:1,input:{...input,name:'Second proposed name'}},moderator);
  await f.hooks.approveEdit(null,{id:a.id},moderator);
  await assert.rejects(f.hooks.approveEdit(null,{id:b.id},moderator),e=>e.extensions.code==='CONFLICT');
  assert.equal(f.getPost().startDescription,'First approved description');
  assert.equal(f.getPost().name,input.name);
  assert.equal(f.getSuggestion(b.id).status,'pending');
});
test('legacy suggestions detect post changes using their creation timestamp', async () => {
  const f=editFixture();const row=await f.hooks.suggestEdit(null,{postId:1,input},moderator);
  delete f.getSuggestion(row.id).data._baseUpdatedAt;
  f.getPost().updatedAt=new Date('2026-02-01');
  await assert.rejects(f.hooks.approveEdit(null,{id:row.id},moderator),e=>e.extensions.code==='CONFLICT');
});
test('post changes between read and write are rejected by the conditional update', async () => {
  const f=editFixture();const row=await f.hooks.suggestEdit(null,{postId:1,input},moderator);
  f.prisma.post.update=async()=>{throw Object.assign(new Error('synthetic conflict'),{code:'P2025'})};
  await assert.rejects(f.hooks.approveEdit(null,{id:row.id},moderator),e=>e.extensions.code==='CONFLICT');
  assert.equal(f.getSuggestion(row.id).status,'pending');
});
for (const [file,approve,reject,model] of [['edits','approveEdit','rejectEdit','editSuggestion'],['posts','approveCreatedPost','rejectCreatedPost','createdPost']]) {
  test(`${file} lost approve/reject claims cannot publish or change a completed review`,async()=>{
    const prisma = { [model]: { findUnique:async()=>({id:1,status:'pending'}),updateMany:async()=>({count:0}) }, $transaction:run=>run(prisma) };
    const hooks=loadSource(`backend/src/schema/resolvers/mutation/${file}.ts`,{
      '../../../server/client':{__esModule:true,default:prisma},
      '../../../utils/auth/requireVerifiedEmail':{},'../../../validators/postReferences':{},
    });
    await assert.rejects(hooks[approve](null,{id:1},moderator),/already processed/);
    await assert.rejects(hooks[reject](null,{id:1},moderator),/already processed/);
  });
}
test('database details are masked while intentional API errors keep their code and message',()=>{
  const {formatGraphqlError}=loadSource('backend/src/utils/formatGraphqlError.ts');
  const database=Object.assign(new Error('private SQL value'),{name:'PrismaClientValidationError'});
  const error=new GraphQLError(database.message,{originalError:database,path:["approveEdit"]});
  assert.doesNotMatch(formatGraphqlError(error.toJSON(),error).message,/private SQL/);
  const forbidden=new GraphQLError('Verify email',{extensions:{code:'FORBIDDEN'}});
  assert.deepEqual(formatGraphqlError(forbidden.toJSON(),forbidden),{message:'Verify email',extensions:{code:'FORBIDDEN'}});
});
test('request timeout reports uncertainty rather than encouraging duplicate mutation retries',async()=>{
  const {graphqlRequest}=loadSource('frontend/src/lib/graphql.ts',{'./api':{api:{post:async()=>{throw Object.assign(new Error('timeout'),{code:'ECONNABORTED'})}}}});
  await assert.rejects(graphqlRequest('mutation { likePost }'),/may have completed.*Refresh before retrying/);
});
