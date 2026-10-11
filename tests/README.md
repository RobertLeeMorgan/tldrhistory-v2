# Audit regression tests

Install the repository's existing frontend/backend dependencies, then run from the repository root:

```powershell
node --test tests/*.test.cjs
```

The tests execute actual TypeScript/React modules through the installed TypeScript compiler. Service and persistence boundaries use fixtures; the loader refuses to load the real database client. These are not live database or provider integration tests. No new test dependency is required.

For the coupled timeline/browser checks, first build the frontend with `DISABLE_PRERENDER=true`, then run:

```powershell
node tests/timeline-browser.cjs
```

The browser test uses the installed Edge executable by default. Set `BROWSER_PATH` to another Chromium executable if needed. It bundles an isolated fixture using existing esbuild, serves it on a random loopback port, and launches headless Chromium with a separate temporary profile. Real masonry, cards, filters, era tracking, map and modal behavior run against synthetic data. It never starts the backend or accesses a database, mail provider or storage service. Temporary browser profiles remain in the OS temporary directory for normal cleanup.

The browser fixture requires the built frontend CSS and permission to launch a local browser. See [the remediation log](../docs/audit/remediation.md) for coverage, commands, known compiler/lint failures and unverified integration behavior.

## Disposable PostgreSQL and real application integration

The following checks use the actual development frontend/backend, GraphQL routes, Prisma and PostgreSQL. `local-db.cjs` verifies both the configured host and the server address are loopback before creating a new `tldrhistory_integration_*` database from the current Prisma schema. It never runs historical migrations. It stores the disposable URL in the OS temporary directory without printing credentials. Stop the two servers before dropping the database.

```powershell
node tests/local-db.cjs create
$env:TLDR_INTEGRATION_DATABASE_URL = Get-Content -Raw -LiteralPath "$env:TEMP\tldrhistory-integration-url.txt"
```

In separate shells, start the servers with these process-local settings (port 15000 avoids an existing development backend on 5000):

```powershell
# From backend/
$env:DATABASE_URL = Get-Content -Raw -LiteralPath "$env:TEMP\tldrhistory-integration-url.txt"
$env:EMAIL_DELIVERY_MODE = 'disabled'
$env:SERVE_FRONTEND = 'false'
$env:APP_ORIGIN = 'http://localhost:15173'
$env:PORT = '15000'
npm.cmd run dev
```

```powershell
# From frontend/
$env:DEV_API_ORIGIN = 'http://localhost:15000'
$env:API_ORIGIN = 'http://localhost:15000'
Remove-Item Env:VITE_API_ORIGIN -ErrorAction SilentlyContinue
npm.cmd run dev -- --host localhost --port 15173 --strictPort
```

From the repository root, run the API test and then the browser test. Restart the isolated backend between them if repeated runs consume its in-memory authentication rate limit.

```powershell
$env:TLDR_INTEGRATION_API = 'http://localhost:15000'
node tests/local-integration.cjs
node tests/local-browser.cjs
```

The API test inserts a unique country marker and requires it to appear through `formLists` before any account mutations, proving that the server points at the disposable database. It uses disabled email delivery and writes replacement one-time token hashes only in that database, then calls the real verification/reset mutations. The browser test launches headless Edge in a fresh temporary profile. Both tests intentionally leave fixtures in the disposable database; after stopping the servers, run `node tests/local-db.cjs drop` from the repository root. Use a fresh disposable database for a clean test run.
