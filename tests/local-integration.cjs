// Run against dev servers that were started with TLDR_INTEGRATION_DATABASE_URL.
// This test refuses any non-loopback, non-disposable PostgreSQL target.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const databaseUrl = process.env.TLDR_INTEGRATION_DATABASE_URL;
if (!databaseUrl) throw new Error('Set TLDR_INTEGRATION_DATABASE_URL to a disposable local database');
const parsed = new URL(databaseUrl);
if (!['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname) ||
    !/^tldrhistory_integration_[a-z0-9]+$/.test(parsed.pathname.slice(1))) {
  throw new Error('Integration test requires a local disposable database');
}
const api = process.env.TLDR_INTEGRATION_API || 'http://localhost:5000';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(api).hostname)) {
  throw new Error('Integration API must be local');
}
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
const nonce = crypto.randomBytes(4).toString('hex');
const password = 'StrongPass1!';

async function gql(query, variables = {}, token, cookie) {
  const headers = { 'content-type': 'application/json' };
  if (token) headers.authorization = `Bearer ${token}`;
  if (cookie) headers.cookie = cookie;
  const response = await fetch(`${api}/graphql`, {
    method: 'POST', headers, body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();
  return { response, body, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
function data(result, key) {
  assert.equal(result.response.status, 200, JSON.stringify(result.body));
  assert.deepEqual(result.body.errors, undefined, JSON.stringify(result.body.errors));
  return result.body.data[key];
}
function errorCode(result, code) {
  assert.ok(result.body.errors?.length, JSON.stringify(result.body));
  if (code) assert.equal(result.body.errors[0].extensions?.code, code, JSON.stringify(result.body.errors));
}
async function tokenFor(userId, type) {
  const raw = `v2.${crypto.randomBytes(32).toString('base64url')}`;
  await prisma.authToken.updateMany({ where: { userId, type }, data: {
    tokenHash: `sha256:${crypto.createHash('sha256').update(raw).digest('hex')}`,
    expiresAt: new Date(Date.now() + 3600_000), usedAt: null,
  } });
  return raw;
}
function postInput(name, year, country, subject, group, description = 'An important historical event.') {
  return { name, type: 'event', startDescription: description, startYear: year,
    startMonth: 0, startDay: 0, endYear: 0, endMonth: 0, endDay: 0,
    startSignificance: .8, endSignificance: .4, civilisation: true,
    country: { name: country }, subjects: [{ id: subject.id, name: subject.name }],
    group: { id: group.id, name: group.name } };
}

async function run() {
  const location = await prisma.$queryRawUnsafe('SELECT current_database() AS db, inet_server_addr()::text AS address');
  assert.equal(location[0].db, parsed.pathname.slice(1));
  assert.ok(['::1/128', '127.0.0.1/32'].includes(location[0].address), JSON.stringify(location));
  const country = `Integration-${nonce}`;
  await prisma.country.create({ data: { name: country, continent: 'Europe' } });
  const country2 = `Integration-Asia-${nonce}`;
  await prisma.country.create({ data: { name: country2, continent: 'Asia' } });
  const subject = await prisma.subject.upsert({ where: { name: 'culture' }, create: { name: 'culture' }, update: {} });
  const group = await prisma.group.create({ data: { name: `Integration group ${nonce}`, description: 'Local integration fixture', icon: 'globe' } });
  await prisma.country.upsert({ where: { name: 'France' }, create: { name: 'France', continent: 'Europe' }, update: {} });
  await prisma.country.upsert({ where: { name: 'Japan' }, create: { name: 'Japan', continent: 'Asia' }, update: {} });
  const lists = data(await gql('query { formLists { allCountries { name } } }'), 'formLists');
  assert.ok(lists.allCountries.some(row => row.name === country), 'API must point at disposable DB');
  console.log('PASS local database and API isolation');

  const authFields = 'token needsEmailVerification user { id email role emailVerifiedAt }';
  const registration = 'mutation($u:String!,$e:String!,$p:String!){register(username:$u,email:$e,password:$p){'+authFields+'}}';
  const login = 'mutation($e:String!,$p:String!){login(email:$e,password:$p){'+authFields+'}}';
  const users = [];
  for (const suffix of ['author', 'second', 'moderator']) {
    const email = `${suffix}-${nonce}@example.test`;
    const result = await gql(registration, { u: `${suffix}${nonce}`, e: email, p: password });
    const auth = data(result, 'register');
    assert.equal(auth.needsEmailVerification, true);
    assert.ok(result.cookie?.startsWith('refreshToken='));
    users.push({ id: Number(auth.user.id), email, access: auth.token, cookie: result.cookie });
  }
  const [author, second, moderator] = users;
  const unverifiedInput = postInput(`Unverified ${nonce}`, 100, country, subject, group);
  const suggest = 'mutation($i:PostInput!){createPostSuggestion(input:$i){id status}}';
  errorCode(await gql(suggest, { i: unverifiedInput }, author.access), 'FORBIDDEN');
  const verify = 'mutation($t:String!){verifyEmail(token:$t){success}}';
  for (const user of users) {
    const raw = await tokenFor(user.id, 'EMAIL_VERIFICATION');
    assert.equal(data(await gql(verify, { t: raw }), 'verifyEmail').success, true);
    errorCode(await gql(verify, { t: raw }), 'BAD_USER_INPUT');
  }
  await prisma.user.update({ where: { id: moderator.id }, data: { role: 'MODERATOR' } });
  for (const user of users) {
    const auth = data(await gql(login, { e: user.email, p: password }), 'login');
    assert.equal(auth.needsEmailVerification, false);
    user.access = auth.token;
  }
  console.log('PASS registration, verification, login and verified-only submission');

  const pending = data(await gql(suggest, { i: postInput(`Founding ${nonce}`, 100, country, subject, group) }, author.access), 'createPostSuggestion');
  const approvePost = 'mutation($id:Int!){approveCreatedPost(id:$id)}';
  errorCode(await gql(approvePost, { id: pending.id }, author.access), 'FORBIDDEN');
  errorCode(await gql('query { pendingStats { pending } }', {}, author.access), 'FORBIDDEN');
  assert.ok(data(await gql('query { pendingStats { pending } }', {}, moderator.access), 'pendingStats').pending >= 1);
  assert.equal(data(await gql(approvePost, { id: pending.id }, moderator.access), 'approveCreatedPost'), true);
  const post = await prisma.post.findUniqueOrThrow({ where: { name: `Founding ${nonce}` } });
  assert.equal(post.startSignificance, .8);
  assert.equal(post.endSignificance, .4);
  const edit = 'mutation($id:Int!,$i:PostInput!){suggestEdit(postId:$id,input:$i){id status}}';
  const a = data(await gql(edit, { id: post.id, i: postInput(post.name, 100, country, subject, group, 'First competing edit description.') }, author.access), 'suggestEdit');
  const b = data(await gql(edit, { id: post.id, i: postInput(post.name, 100, country, subject, group, 'Second competing edit description.') }, second.access), 'suggestEdit');
  const approveEdit = 'mutation($id:Int!){approveEdit(id:$id)}';
  errorCode(await gql(approveEdit, { id: a.id }, author.access), 'FORBIDDEN');
  assert.equal(data(await gql(approveEdit, { id: a.id }, moderator.access), 'approveEdit'), true);
  errorCode(await gql(approveEdit, { id: b.id }, moderator.access), 'CONFLICT');
  const edited = await prisma.post.findUniqueOrThrow({ where: { id: post.id } });
  assert.equal(edited.startDescription, 'First competing edit description.');
  assert.equal(edited.startSignificance, .8);
  assert.equal(edited.endSignificance, .4);
  assert.equal((await prisma.editSuggestion.findUniqueOrThrow({ where: { id: b.id } })).status, 'pending');
  const competing = data(await gql(edit, { id: post.id, i: postInput(post.name, 100, country, subject, group, 'Simultaneously reviewed edit description.') }, second.access), 'suggestEdit');
  const parallelReviews = await Promise.all([
    gql(approveEdit, { id: competing.id }, moderator.access),
    gql(approveEdit, { id: competing.id }, moderator.access),
  ]);
  assert.equal(parallelReviews.filter(result => result.body.data?.approveEdit === true).length, 1);
  assert.equal(parallelReviews.filter(result => result.body.errors?.length).length, 1);
  assert.equal((await prisma.post.findUniqueOrThrow({ where: { id: post.id } })).startDescription, 'Simultaneously reviewed edit description.');
  console.log('PASS creation, moderation permissions, edit conflicts and significance');

  // Seed enough extra historical events to exercise the real cursor and map queries.
  await prisma.post.createMany({ data: Array.from({ length: 30 }, (_, index) => ({
    name: `Timeline ${nonce} ${index.toString().padStart(2, '0')}`,
    type: 'event', startDescription: 'Timeline integration fixture.', startYear: 200 + index,
    endYear: 300 + index, startSignificance: .5, endSignificance: .2,
    civilisation: true, countryId: index % 2 ? country2 : country,
    userId: author.id, groupId: group.id,
  })) });
  for (const [name, year, mappedCountry] of [[`Map France ${nonce}`, 100, 'France'], [`Map Japan ${nonce}`, 220, 'Japan']]) {
    await prisma.post.create({ data: {
      name, type: 'period', startDescription: 'Map integration fixture.', startYear: year,
      endYear: year + 30, startSignificance: .7, endSignificance: .1,
      civilisation: true, countryId: mappedCountry, userId: author.id, groupId: group.id,
      subjects: { connect: [{ id: subject.id }] },
    } });
  }
  const timeline = 'query($cursor:ID,$filter:FilterInput){timeline(cursor:$cursor,filter:$filter){posts{id name startYear country{name continent} startSignificance} nextCursor}}';
  const first = data(await gql(timeline), 'timeline');
  const next = data(await gql(timeline, { cursor: first.nextCursor }), 'timeline');
  assert.equal(first.posts.length, 15);
  assert.equal(next.posts.length, 15);
  assert.equal(new Set([...first.posts, ...next.posts].map(p => p.id)).size, 30);
  assert.ok(first.posts[0].startYear < next.posts[0].startYear);
  const desc = data(await gql(timeline, { filter: { sortBy: false } }), 'timeline');
  assert.ok(desc.posts[0].startYear >= desc.posts[1].startYear);
  const europe = data(await gql(timeline, { filter: { continent: ['Europe'] } }), 'timeline');
  assert.ok(europe.posts.every(p => p.country.continent === 'Europe'));
  const search = data(await gql(timeline, { filter: { search: `Founding ${nonce}` } }), 'timeline');
  assert.deepEqual(search.posts.map(p => p.id), [String(post.id)]);
  const [significantPerson, significantLandmark] = await Promise.all([
    prisma.post.create({ data: {
      name: `Founding ${nonce} person`, type: 'person', startDescription: 'Significant person fixture.',
      startYear: 100, endYear: 0, startSignificance: .9, endSignificance: 0,
      countryId: country, userId: author.id, groupId: group.id,
    } }),
    prisma.post.create({ data: {
      name: `Founding ${nonce} landmark`, type: 'landmark', startDescription: 'Significant landmark fixture.',
      startYear: 100, endYear: 0, startSignificance: .7, endSignificance: 0,
      countryId: country, userId: author.id, groupId: group.id,
    } }),
  ]);
  const significant = data(await gql('query($a:Int!,$b:Int!,$f:FilterInput){getSignificant(startYear:$a,endYear:$b,filter:$f){person{id name} event{id name} landmark{id name}}}', { a: 100, b: 100, f: { search: `Founding ${nonce}` } }), 'getSignificant');
  assert.equal(significant.event.id, String(post.id));
  assert.equal(significant.person.id, String(significantPerson.id));
  assert.equal(significant.landmark.id, String(significantLandmark.id));
  const civilisations = data(await gql('query($a:Int!,$b:Int!){getCivilisation(startYear:$a,endYear:$b){id name country{name}}}', { a: 100, b: 100 }), 'getCivilisation');
  assert.ok(civilisations.some(p => p.id === String(post.id)));
  console.log('PASS timeline pages, filters, sort and era/map GraphQL data');

  const refresh = async cookie => {
    const response = await fetch(`${api}/api/refresh`, { method: 'POST', headers: { cookie } });
    return { status: response.status, cookie: response.headers.get('set-cookie')?.split(';')[0],
      body: response.status === 200 ? await response.json() : null };
  };
  const races = await Promise.all([refresh(author.cookie), refresh(author.cookie)]);
  assert.deepEqual(races.map(r => r.status).sort(), [200, 403]);
  assert.equal(await prisma.refreshToken.count({ where: { userId: author.id } }), 2); // registration + later login + one rotated
  const winning = races.find(r => r.status === 200);
  assert.ok(winning.cookie?.startsWith('refreshToken='));
  assert.equal((await refresh(author.cookie)).status, 403);
  const logout = await fetch(`${api}/api/logout`, { method: 'POST', headers: { cookie: winning.cookie } });
  assert.equal(logout.status, 200);
  assert.equal((await refresh(winning.cookie)).status, 403);
  console.log('PASS competing refresh and logout');

  const forgot = 'mutation($e:String!){forgotPassword(email:$e){success}}';
  assert.equal(data(await gql(forgot, { e: second.email }), 'forgotPassword').success, true);
  const resetToken = await tokenFor(second.id, 'PASSWORD_RESET');
  const reset = 'mutation($t:String!,$p:String!){resetPassword(token:$t,password:$p){token user{id}}}';
  const newPassword = 'NewStrongPass2!';
  const resets = await Promise.all([gql(reset, { t: resetToken, p: newPassword }), gql(reset, { t: resetToken, p: newPassword })]);
  assert.equal(resets.filter(r => r.body.data?.resetPassword).length, 1);
  assert.equal(resets.filter(r => r.body.errors?.length).length, 1);
  errorCode(await gql(login, { e: second.email, p: password }), 'UNAUTHENTICATED');
  const switched = data(await gql(login, { e: second.email, p: newPassword }), 'login');
  assert.equal(Number(switched.user.id), second.id);
  console.log('PASS password reset single consumption and account switching');
}

run().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
