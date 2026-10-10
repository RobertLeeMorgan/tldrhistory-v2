# TL;DR History VPS staging handoff

## Current commissioned state — 2026-10-10

This section supersedes the pre-deployment wording retained below as historical
handoff evidence. Staging is live at `https://staging.tldrhistory.xyz` through
the VPS Caddy/PostgreSQL 18 platform. Its imported database is sanitised, email
delivery is disabled, public R2 media is read-only, backup/restore and reboot
recovery passed, and a Better Stack readiness monitor reports Up.

The production-preparation branch adds server-side account/password validation,
disables persisted GraphQL queries, bounds operations, separates authenticated
SSR from public rate buckets, consumes refresh tokens atomically, and fails on
mail-provider errors. Images use Node 22.23.3; Sharp is 0.35.5. The production
frontend tree has zero npm findings. The backend build generates Prisma, then
removes the vulnerable build-only Prisma CLI/config/deepmerge packages; its
runtime tree reports zero findings and a disposable container liveness test
passes. Four focused security tests run during every backend image build.

Infrastructure now has an empty, separately credentialed production database,
separate production networks/secrets/deployment identity and manual protected
deploy/recovery workflows. A missing root-owned cutover gate deliberately blocks
production deployment. Render, its database, production DNS and production R2
objects remain unchanged. The exact final import/DNS sequence is maintained in
the infrastructure repository's `docs/tldr-production-cutover.md`.

## Validation status

Local Docker Desktop validation completed on 2026-10-09. No VPS configuration, DNS, Render database, or production R2 objects were accessed or changed.

- Built `tldr-history-backend:local` and `tldr-history-frontend:local` successfully from their production Dockerfiles.
- Docker reports uncompressed local image sizes of about 999 MB for backend and 600 MB for frontend. Multi-stage builds exclude development dependencies/build stages from runtime, but the runtime dependency trees remain large; any further reduction needs a separate dependency/bundling review.
- Both images use Node 22.20.0 on Debian Bookworm slim and run as the non-root `node` user. The backend image includes OpenSSL for Prisma's Debian query engine.
- Started backend and frontend as separate containers on an isolated local Docker network. Backend had no frontend build files and served GraphQL with `SERVE_FRONTEND=false`; frontend started and SSR rendered without a backend build dependency.
- Backend `GET /health/live` and `/health/ready` returned 200, with readiness checking PostgreSQL. Frontend `GET /health/live` returned 200. `/login` and `/timeline/ancient-greece` returned 200, including direct navigation after frontend restart.
- A GraphQL `{ __typename }` request from the frontend container to `http://backend:5000/graphql` returned 200. Backend readiness and the nested timeline SSR route also passed against the locally restored and sanitized PostgreSQL copy.
- Both services handled SIGTERM and restarted successfully. The backend has no `/app/public/build`; both runtime images run as `node`.
- Inspected both image filesystems: no `.env` files or database archive were present. Image environment configuration contains runtime defaults only; no credentials were baked into either image. Docker contexts excluded the archive.
- `frontend/Dockerfile` disables React Router prerendering only while building the independent container image, because timeline prerendering requires a running GraphQL API. Render's existing build default is unchanged. SSR still renders timeline routes at runtime.

The first frontend build exposed two issues and they are resolved: its lockfile did not satisfy `npm ci`, so the lockfile was refreshed; then timeline prerendering tried to call `localhost:5000` during the standalone image build, so container-only prerendering was disabled. The final Docker builds pass. The frontend build reports an existing CSS optimizer warning for `@property`; it does not fail the build.

The full frontend lint run reports 166 errors and 9 warnings, down one error from the prior report after removing the changed React Router config's existing explicit `any`. Remaining findings are in pre-existing application code; deployment-specific files pass targeted lint. No unrelated lint cleanup was done.

Compatible lockfile updates fixed the previously critical `proxy-addr` issue (`2.0.7` → `2.0.8`), the React Router high advisories (`7.14.2` → `7.18.4`), and high findings in Axios (`1.20.0`), compression (`1.8.2`), `form-data` (`4.0.6`), `ip-address` (`10.7.3`), GraphQL Tools utilities (`12.0.3`), frontend `nanoid` (`3.3.20`), PostCSS (`8.5.29`), `source-map-js` (`1.2.2`), Vite (`7.3.7`), and `shell-quote` (`1.12.0`). The critical `proxy-addr` advisory concerns incorrectly compiled IPv4-mapped IPv6 trust subnets. This app uses a numeric one-hop trust setting only behind the VPS Caddy route and keeps proxy trust off on Render, so the vulnerable subnet-matching condition was not configured; upgrading removes the vulnerable code from both trees. No forced updates were used.

The security-focused npm audit review on 2026-10-09 found no advisories in the frontend production dependency tree (0 total). The frontend full tree has 23 high advisories and no critical advisories, all through development/build tooling. The affected packages are `@graphql-codegen/add`, `cli`, `client-preset`, `core`, `gql-tag-operations`, `plugin-helpers`, `schema-ast`, `typed-document-node`, `typescript`, `typescript-operations`, and `visitor-plugin-common`; `@graphql-tools/code-file-loader`, `git-loader`, `graphql-file-loader`, `json-file-loader`, and `utils`; and `braces`, `fast-glob`, `globby`, `graphql-config`, `micromatch`. The direct dependency chains start at `@graphql-codegen/cli`, `@graphql-codegen/typescript`, and `@graphql-codegen/typescript-operations`. Codegen runs only when explicitly invoked and its checked-in config points at `http://localhost:5000/graphql`; use a trusted local schema/API for that operation. The `braces` finding is stack exhaustion from deeply nested glob patterns; the `@graphql-tools/utils` finding is prototype pollution in `mergeDeep`. The remaining two findings are `nodemon@3` and its `chokidar` dependency (the watcher is not used by the runtime image). The suggested GraphQL Codegen remediation crosses to v7 and its plugin packages cross major versions; these are not part of the runtime image, so no broad tooling upgrade was made.

The backend has four high advisories and no critical advisories, including under `npm audit --omit=dev`: `prisma@6.19.3` and `@prisma/config` are affected through `deepmerge-ts@7.1.5`, whose high advisory is stack exhaustion on recursively merged object graphs; one advisory is the chain's aggregate Prisma CLI/config finding. npm's suggested Prisma fix is a downgrade to 6.12.0 (a semver-major change relative to the pinned 6.19 line); the affected CLI/config merger is used by build/migration tooling and does not process web requests. The fourth finding is `sharp@0.34.5` and its bundled libvips, libheif, and librsvg libraries (advisory ranges include `<0.35.0`, `<0.35.4`, and `<0.35.5`). The only application import is the operator-run `src/scripts/cdnUpload.ts` image migration, which fetches Wikimedia-hosted images, rejects SVG, and is not invoked by the HTTP service. Updating to 0.35.5 is marked semver-major by npm and needs image-script regression testing. Neither tool is exposed as a public HTTP operation, but keep Prisma schema/config files and the image migration operator-controlled, do not process untrusted image bytes with this script, and review these updates before adding such operations to a deployed service. The runtime HTTP paths do not expose Prisma's CLI or Sharp's image decoder.

The backend's previous `ERR_ERL_KEY_GEN_IPV6` warning came from a custom key generator returning raw `req.ip`. Raw IPv6 addresses can rotate within a subnet to evade per-address limits. The custom generator has been removed; `express-rate-limit@8.7.1` now uses its supported default key generator and `/56` IPv6 normalization. The existing limits remain 120 GraphQL requests/minute and 20 matching GraphQL authentication mutations/10 minutes. When `TRUST_PROXY=1` for the documented VPS Caddy ingress, a 20-per-10-minute limit also covers `/api/refresh` and `/api/logout`, which previously bypassed the GraphQL-only middleware. The REST limiter is conditional on that staging setting; Render's default proxy trust and REST route behavior remain unchanged.

Security references: [proxy-addr advisory](https://github.com/jshttp/proxy-addr/security/advisories/GHSA-jqcg-44mw-7w3h), [express-rate-limit IPv6 key guidance](https://express-rate-limit.github.io/ERR_ERL_KEY_GEN_IPV6/), [Express proxy trust guidance](https://expressjs.com/en/guide/behind-proxies/), and [Caddy reverse-proxy header behavior](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy).

The rebuilt frontend and backend images passed production builds. The frontend runtime install reported 0 vulnerabilities after pruning development dependencies; the backend runtime audit still reports the four documented high findings above. Both containers started independently on an isolated Docker network. Backend live/readiness returned 200; Caddy-routed GraphQL `{ __typename }` returned `Query`; login for a nonexistent account returned the expected `UNAUTHENTICATED` result; `/login` and `/timeline/ancient-greece` both returned 200 after applying migrations to an empty disposable PostgreSQL 18.6 database. A 21-request GraphQL auth burst with a different forged `X-Forwarded-For` on every request returned 20 normal GraphQL responses followed by one 429; a 121-request general GraphQL burst returned 120 responses followed by one 429; and a 21-request `/api/refresh` burst returned 20 401 responses followed by one 429. The same 21 refresh requests against a final backend container with `TRUST_PROXY` unset returned 21 401 responses and no 429, confirming Render-mode route behavior was preserved. These tests show Caddy did not let the external header vary the VPS client bucket. Direct `ipKeyGenerator` checks preserved IPv4 keys and grouped addresses within the same IPv6 `/56`. Both services restarted; backend logs showed SIGTERM shutdown and startup without the IPv6 warning. No successful login with a seeded account was tested in this security review.

## Images, ports, and routes

| Service | GHCR image path | Container port | Health endpoint | Network access |
| --- | --- | ---: | --- | --- |
| Frontend SSR | `ghcr.io/<owner>/<repository>-frontend:<commit-sha>` | 3000 | `GET /health/live` → `ok` | Caddy/proxy network only |
| Backend API | `ghcr.io/<owner>/<repository>-backend:<commit-sha>` | 5000 | `GET /health/live` → `ok`; `GET /health/ready` → `tldr-history-ready` | Caddy/proxy and app database networks |

The workflow deploys immutable GHCR digests, not these mutable tags. Frontend browser requests use same-origin `/graphql` and `/api`; Caddy should send `/graphql*`, `/api/*`, and `/health/*` to `backend:5000` and all other paths to `frontend:3000`. The frontend server uses `API_ORIGIN=http://backend:5000` for SSR. Do not publish application ports. Backend runs with `SERVE_FRONTEND=false`; the default combined Render behavior remains enabled when its frontend build is present.

The current restricted deployment command takes the complete ordered set of configured image digests and deploys both fixed services together. Independent frontend/backend builds are ready; a targeted-service release is not required for this staging onboarding and no deployment tooling change is proposed. The rollback workflow uses the documented `recover` and `rollback` operations. Image rollback does not reverse schema migrations.

## PostgreSQL 18 and archive validation

The supplied `2026-10-08T16_38Z.dir.tar.gz` is a PostgreSQL directory-format archive created by `pg_dump 18.6` for source database `tldrhistory`. Its contents were copied only into a disposable local PostgreSQL 18.6 container. The source archive was not modified, committed, or sent to CI. Do not attempt to restore it into PostgreSQL 17.

The restore succeeded on PostgreSQL 18.6 with `pg_restore --no-owner --no-privileges --exit-on-error --jobs=1`. The archive contains 15 public tables, 24 sequences, 16 foreign-key constraints, and one non-core extension, `pg_stat_statements`; the TOC references three source owner labels. Ownership and ACL entries were omitted. In the disposable test, restore was run as the container's local administrator. On the VPS, restore as the dedicated TL;DR migrator/owner role so restored objects belong to the application owner; never import source roles, ACLs, or production credentials.

The restored database has nine `_prisma_migrations` rows, all complete. `prisma migrate status` found the repository's nine migrations and reported the schema up to date. No migration was applied. Aggregate pre-sanitization counts were: users 3, posts 1,221, countries 204, subjects 11, groups 55, likes 6, refresh tokens 3, and auth tokens 2. The PostgreSQL 18.6 restore completed without SQL errors. No row values were printed.

The archive contains account emails/usernames, password hashes, active refresh-token records, authentication-token hashes, and user-associated content. Sanitization is mandatory before public staging. A rehearsal on the disposable restored copy succeeded: all 3 users were anonymized, all refresh and auth token rows were removed, and no elevated `ADMIN`/`MODERATOR` role remained. The original archive and restored source data were not changed by that rehearsal; only the disposable database copy was sanitized.

### VPS restore and sanitization procedure

1. Complete the shared PostgreSQL 18 upgrade/reinitialization first. Provision an empty, isolated `tldr_history` database plus a restricted runtime role (`tldr_runtime`) and separate migrator/owner role. Do not connect this app to Render or another application's database.
2. Transfer the archive through an approved secure channel into a root-only temporary directory. Verify its checksum and target database before restoring. Use PostgreSQL 18.6 `pg_restore` tooling. Provide the migrator password with the infrastructure-approved protected `PGPASSFILE`, never command-line arguments or shell history.
3. Restore the directory-format archive with source ownership and privileges omitted, and fail on the first error. Example (run only after confirming the new isolated target):

   ```sh
   pg_restore --host <private-postgres-host> --username tldr_migrator \
     --dbname tldr_history --format directory --no-owner --no-privileges \
     --exit-on-error --jobs 1 /restricted/restore/tldrhistory
   ```

4. Compare `_prisma_migrations` with `backend/prisma/migrations` and run `prisma migrate status`. The local rehearsal found no pending migration. Do not run `prisma migrate deploy` unless the infrastructure owner reviews pending SQL and approves it after a recovery point.
5. Before allowing Caddy traffic, generate a random password value in a protected one-off procedure, bcrypt-hash it, discard the random value, and use the hash below. In one transaction delete imported sessions/tokens, anonymize imported account identifiers, replace password hashes, clear verification state, and downgrade imported privileged accounts:

   ```sql
   BEGIN;
   DELETE FROM "RefreshToken";
   DELETE FROM "AuthToken";
   UPDATE "User"
   SET "username" = 'stg-user-' || id::text,
       "email" = 'staging+' || id::text || '@example.invalid',
       "password" = '<bcrypt hash of discarded random value>',
       "emailVerifiedAt" = NULL,
       "role" = 'USER'::"UserRole";
   COMMIT;
   ```

   `stg-user-<id>` fits the 20-character username limit for positive Prisma `Int` IDs. Verify aggregate counts, zero imported token rows, zero elevated imported accounts, foreign-key validation, and representative read-only GraphQL/timeline queries. Never print sample records. Create a separate staging account through normal registration for authentication testing.
6. Sanitizing accounts does not sanitize user-authored text or media metadata. Review those fields for personal information before public access; otherwise keep staging behind the approved access restriction. Do not use production email/AI credentials or write to production R2. No R2 credentials are needed for the web runtime; imported public CDN URLs can be loaded read-only.

`pg_stat_statements` was present in the export and restored successfully into the local PostgreSQL 18.6 image. The shared server must have the extension package available and the infrastructure owner should decide whether it belongs in the shared server's preload configuration. TL;DR application queries do not require it.

## VPS onboarding requirements

No VPS change or remote deployment was performed. The next infrastructure session should use `/opt/vps-infra` and `/etc/vps-infra`'s documented onboarding contract; do not add application Compose or secrets to this repository.

- Standardize/reinitialize the empty shared PostgreSQL service on PostgreSQL 18 before creating application databases. Update its Compose/image, initialization and provisioning procedure, extension availability, backup/restore tooling, and operator documentation. Verify backup and isolated restore on PostgreSQL 18. Do not perform this change from the TL;DR repository.
- Install an administrator-owned Compose project `app-tldr-history` with fixed `frontend` and `backend` services and `FRONTEND_IMAGE`/`BACKEND_IMAGE` digest inputs matching the GHCR paths above. Use the existing restart, health, stop-grace, log, resource, read-only filesystem, tmpfs, dropped-capability, and `no-new-privileges` conventions.
- Attach frontend to the existing/per-app proxy network only. Attach backend to that proxy network and the internal TL;DR database network. Attach Caddy and shared PostgreSQL only to their intended networks. Keep database ports private and publish no application ports.
- Store protected runtime files under `/etc/vps-infra/apps/tldr-history/`. Set backend `DATABASE_URL` to the restricted `tldr_runtime` role with `connection_limit=5`, staging-only `JWT_SECRET` and `JWT_REFRESH_SECRET`, `APP_ORIGIN=https://staging.tldrhistory.xyz`, `EMAIL_DELIVERY_MODE=disabled`, `NODE_ENV=production`, `SERVE_FRONTEND=false`, `TRUST_PROXY=1`, and `PORT=5000`. Disabled delivery does not construct a Resend client or send HTTPS requests, so restored records and authentication tests cannot contact real users; do not supply any Resend key. Add staging-only `OPENAI_KEY` only if those external flows are approved for testing. `TRUST_PROXY=1` is safe only while Caddy is the sole external ingress and the backend has no published port or alternate public client route. Public requests must traverse one Caddy hop; the private frontend may call the backend directly for SSR and must not forward client-supplied `X-Forwarded-For`. Caddy's default `reverse_proxy` behavior must remain in place so it sets or replaces/ignores client-supplied `X-Forwarded-For`, `X-Forwarded-Host`, and `X-Forwarded-Proto` before forwarding. Do not configure Express to trust arbitrary forwarded headers or increase the hop count. Set frontend `API_ORIGIN=http://backend:5000`, `NODE_ENV=production`, and `PORT=3000`.
- Register the database in the existing `BACKUP_DATABASES` configuration, take a backup after restoration/sanitization, and rehearse its restore into another isolated target. Register both long-running services in Better Stack monitoring and test readiness through HTTPS.
- Add staging-only Caddy routing for `/graphql*`, `/api/*`, and `/health/*` to backend and other paths to frontend. Validate Caddy before reload and retain the infrastructure `/healthz` route.
- Keep Caddy directly internet-facing with no CDN in front for the initial staging route, or—if a CDN is intentionally placed in front—configure Caddy's global `servers` `trusted_proxies` with the provider's verified, current CIDR ranges and enable its forwarded-header parsing before relying on client IPs. Do not use `TRUST_PROXY=1` with an untrusted CDN `X-Forwarded-For` chain. Caddy's default reverse proxy discards untrusted incoming forwarding values; its trusted-proxy configuration is only needed to recover the actual client address from a known upstream CDN. The VPS Caddyfile currently does not configure trusted proxies.
- The application code references `www.tldrhistory.xyz` and the Render origin for its existing CSP/CORS allowances. Same-origin staging requires no cross-origin browser API access. Choose an approved temporary hostname (for example, `staging.tldrhistory.xyz`) and point its DNS to the VPS only after confirming the hostname and target addresses; no DNS changes were made here.
- Link both private GHCR packages to the repository and give the VPS pull tooling its own read-only package credential. Never expose that credential to Actions.
- Configure the protected GitHub Environment `staging` and add secrets `STAGING_DEPLOY_HOST`, `STAGING_DEPLOY_USER`, `STAGING_DEPLOY_SSH_KEY`, and `STAGING_KNOWN_HOSTS`. The key must be a dedicated repository deploy identity, the host key independently verified, and the forced command restricted to this app. Add the approved HTTPS `STAGING_URL` as an environment variable. Actions publish images with their built-in `GITHUB_TOKEN` and never receive the VPS GHCR pull token.
- Restrict who can approve/use the staging Environment and protect the repository's default `master` branch. The current application workflow builds both images on pull requests and publishes/deploys immutable digests on protected `master`; rollback/recovery is manual via its workflow. There is no production deployment job.

## Remaining validation and blockers

Staging has not been deployed. The following require the infrastructure onboarding session and its authorized credentials/configuration:

- PostgreSQL 18 shared-server reinitialization, role/database provisioning, sanitized restore, backup registration and restore rehearsal.
- Fixed Compose services, networks, Caddy route, monitoring, restricted SSH identity, GHCR pull access, GitHub Environment configuration, and an approved staging DNS record/URL.
- Remote health, HTTPS, backup, recovery/rollback, cross-database denial, and VPS reboot validation.
- Review the four backend high npm advisories before running operator tooling against untrusted files or images; none is reachable through the backend's HTTP request paths. The 23 frontend high findings are development/build-only and absent from the production frontend tree. Create a staging account for authentication-flow verification. The remaining frontend lint findings are 166 errors and 9 warnings in pre-existing application code; deployment-specific files pass targeted lint.

Local runtime verification confirmed that the custom IPv6-key warning is absent. Rate-limit behavior assumes the documented single-proxy Caddy ingress; keep backend ports private and preserve Caddy's forwarded-header sanitization.

## Eventual production migration

Keep Render serving production throughout staging onboarding. A later production migration needs a separately approved plan: review sanitized staging results and the production data/R2 handling requirements; schedule a PostgreSQL 18 production-compatible export/restore and migration window; provision production-only runtime and external-service credentials; deploy both images under the production environment with its own approval gate; validate GraphQL, auth, media reads, backups, and rollback; then change production DNS only under explicit authorization. Keep Render available as the rollback target until the production release is accepted. No production cutover, DNS change, Render shutdown, or production data modification is authorized by this handoff.
