// Creates or removes only a uniquely named database on a verified loopback PostgreSQL server.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const dotenv = require('../backend/node_modules/dotenv');
const { PrismaClient } = require('../backend/node_modules/@prisma/client');

const root = path.resolve(__dirname, '..');
const urlFile = path.join(os.tmpdir(), 'tldrhistory-integration-url.txt');
const localHosts = ['localhost', '127.0.0.1', '[::1]'];
const localAddresses = ['::1/128', '127.0.0.1/32'];
const dbNamePattern = /^tldrhistory_integration_[a-z0-9]+$/;

async function connectLocal(url) {
  assert.ok(localHosts.includes(url.hostname), 'PostgreSQL URL must use loopback');
  const client = new PrismaClient({ datasources: { db: { url: url.href } } });
  const rows = await client.$queryRawUnsafe('SELECT current_database() AS db, inet_server_addr()::text AS address');
  assert.ok(localAddresses.includes(rows[0].address), 'PostgreSQL server address must be loopback');
  return { client, db: rows[0].db };
}

(async () => {
  const action = process.argv[2];
  if (action === 'create') {
    assert.ok(!fs.existsSync(urlFile), `Existing test URL file: ${urlFile}. Drop that database first.`);
    const env = dotenv.parse(fs.readFileSync(path.join(root, 'backend/.env')));
    const base = new URL(env.DATABASE_URL);
    const { client, db } = await connectLocal(base);
    try {
      assert.equal(db, base.pathname.slice(1));
      assert.ok(!dbNamePattern.test(db), 'Base database cannot itself be disposable');
      const name = `tldrhistory_integration_${crypto.randomBytes(6).toString('hex')}`;
      await client.$executeRawUnsafe(`CREATE DATABASE "${name}" TEMPLATE template0`);
      const testUrl = new URL(base.href);
      testUrl.pathname = `/${name}`;
      fs.writeFileSync(urlFile, testUrl.href, { mode: 0o600, flag: 'wx' });
      console.log(`Created local disposable database ${name}.`);
      const cli = path.join(root, 'backend/node_modules/prisma/build/index.js');
      const push = spawnSync(process.execPath, [cli, 'db', 'push', '--skip-generate'], {
        cwd: path.join(root, 'backend'), env: { ...process.env, DATABASE_URL: testUrl.href }, stdio: 'inherit',
      });
      if (push.status !== 0) throw Error('Schema push failed; use drop after resolving the problem');
      console.log(`Schema ready. Test URL is stored in ${urlFile}.`);
    } finally { await client.$disconnect(); }
  } else if (action === 'drop') {
    const testUrl = new URL(fs.readFileSync(urlFile, 'utf8').trim());
    const name = testUrl.pathname.slice(1);
    assert.ok(localHosts.includes(testUrl.hostname) && dbNamePattern.test(name), 'Refusing to drop non-disposable database');
    const adminUrl = new URL(testUrl.href);
    adminUrl.pathname = '/postgres';
    const { client, db } = await connectLocal(adminUrl);
    try {
      assert.equal(db, 'postgres');
      await client.$executeRawUnsafe(`DROP DATABASE "${name}"`);
      fs.unlinkSync(urlFile);
      console.log(`Dropped disposable database ${name}.`);
    } finally { await client.$disconnect(); }
  } else {
    throw Error('Usage: node tests/local-db.cjs create|drop');
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
