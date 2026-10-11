# Audit remediation

The baseline architecture and risk register describe the pre-fix system. This log records implementation scope and validation separately. Existing unrelated deletions, frontend guidance, logo and redesign assets are preserved. No production data, infrastructure, deployment settings, credentials or historical migrations may be changed.

## Implementation batches

| Batch | Scope | Dependencies, risks and validation |
|---|---|---|
| 1 — Editorial score preservation | R01; focused coverage contributes to R19 | Trace actual form callback → validation → suggestion → approval and review diff. Keep API defaults and explicit score edits intact. Separate stale-snapshot conflicts (R09) from this fix. |
| 2 — Security boundaries and sessions | R02, R06, R16; verify R03 first | Safe tooltip text, account cache separation, auth error recovery. Token work requires reproduction of concurrent consumption; test multiple sessions and logout overlap before fixing it. No permission or visibility changes. |
| 3 — Validation and delivery | R10, R11; policy-dependent R07/R18 | Check boundary values against existing constraints and provider error outcomes. Confirm intended credential/verification policy and aggregate visibility before policy-affecting changes. No silent policy decisions. |
| 4 — Image processing and workload | R04, R08 | Controlled network fixtures, redirect/body handling, legacy token compatibility and bounded load measurements. No live image jobs or external credentials. |
| 5 — Client consistency | R13, R15; verify R14 first | Search/navigation, mutation invalidation, direct-profile SSR/hydration. Capture speculative hydration failure before changing ownership of server/client state. |
| 6 — Timeline and recovery | R12, R17; remaining R09 investigation | Treat virtual cards, refs, scroll position, era and map updates together; verify browser behavior on representative fixtures. Resolve editorial concurrency only after reproducing it and establishing intended conflict handling. |

Each batch requires focused regression tests, relevant type/lint/build checks, a diff review and a recorded result. R19 is incremental coverage work across these batches, not permission for a wholesale lint/refactoring pass.

**R05: excluded from remediation / accepted historical risk.** No modification, rewrite, replay or recovery of historical migrations/data. The user's operational database and required data are accepted as the current baseline.

## Batch 1 — R01

Implementation:

- Edit submission reads significance from the fetched post, separately from parsed form data. The callback is typed with the existing form-data type.
- Changed start/end significance now appears in the existing moderation metadata diff. Unchanged scores do not add rows. Numeric renderers preserve visible zeros instead of the generic renderer's "empty" fallback. This exposes changes in already-pending suggestions without rewriting their data.
- No backend mutation contract, score defaults, permission, ownership-transfer rule or approval policy changes.
- Node's built-in test runner uses existing TypeScript/React/Zod dependencies. Actual source modules are executed with UI service stubs and fake persistence; a loader guard prevents opening the real Prisma client. No additional dependency or production test abstraction is introduced.

Validation command: `node --test tests/edit-significance.test.cjs` from the repository root, after installing the existing frontend/backend dependencies.

Before the fix: 3 of the initial 6 tests failed, showing nonzero scores overwritten with zero and missing moderator score diffs. A seventh test reproduced the generic review renderer displaying zero as "empty" before numeric renderers were added. Tests cover score pairs 1/0.8, 0/0 and 0.25/1 through the actual submit/suggest/approve functions, changed-to-zero visibility, unchanged review rows, and existing explicit-value/default semantics. React static rendering is checked; live database transactions and browser interaction are not integration-tested.

Final validation (2026-10-11):

| Check | Result |
|---|---|
| `node --test tests/edit-significance.test.cjs` | **Pass: 7/7**, including actual review component static rendering of zero. |
| Backend: `node node_modules/typescript/bin/tsc --noEmit --incremental false -p tsconfig.json` | **Pass.** |
| Frontend: `node node_modules/typescript/bin/tsc --noEmit --incremental false -p tsconfig.app.json` | **Blocked by existing error:** unused `options` at `src/lib/cookies.ts:12`. No new diagnostics. |
| Frontend: `node node_modules/eslint/bin/eslint.js src/pages/Edit.tsx src/features/review/hooks/useReviewDiffs.tsx` | **Existing failures:** three `no-explicit-any` errors in `FieldDiff` at lines 11, 12 and 14. These and the cookie error were confirmed in HEAD. The edit callback's previous `any` is removed. |
| Frontend: `npm.cmd run build`, process-local `DISABLE_PRERENDER=true` | **Pass:** client and SSR bundles. Initial sandbox filesystem denial resolved by an approved broader-access retry. Existing CSS `@property` optimizer warning remains. No live API prerendering or deployment configuration changes. |
| `git diff --check` and manual diff review | **Pass:** two production frontend files changed; API defaults, permission checks, timeline behavior and unrelated working-tree changes preserved. |

Status after batch 1: **R01 resolved for new edit submissions and moderator visibility; R19 partially addressed with focused regression coverage.** The following sections record subsequent batches.

Remaining boundaries:

- Existing suggestions may already contain zero scores produced by the old bug; they now show those changes to reviewers. No data repair or reinterpretation of explicit zeros is performed.
- R09 was handled separately in batch 6; batch 1 itself did not change conflict handling.
- No policy decision was needed for batch 1. The user subsequently approved the R07/R18 policies recorded under batch 3.


## Batch 2 ? Security boundaries and sessions

Implemented R02, R06 and R16; mitigated R03:

- Map tooltips build fixed elements and assign names as text. Country/civilisation names cannot become HTML markup.
- Saved-filter keys include the authenticated account and are disabled while signed out. Profile post/like keys include the viewer. Cross-account placeholder data is removed, and authentication changes clear the provider's query cache.
- Guards return `UNAUTHENTICATED` or `FORBIDDEN` without changing their role checks.
- Refresh rotation checks the conditional deletion count before creating a successor. Verification/reset claim an unused, unexpired token inside the write transaction before changing the account.
- Startup, scheduled and interceptor refreshes share a request within one tab. Session generations discard stale results. Logout waits for an outstanding rotation before deleting its cookie session; refresh requests have a 20-second bound.

Validation: `tests/security-sessions.test.cjs` has **7 passing tests** covering guard codes, account keys with the actual QueryClient, unsafe tooltip names, shared refresh/logout overlap, paired reset/verification eligibility reads and paired refresh reads. Backend type-check and frontend client/SSR build passed. Scoped lint found existing diagnostics; final comparison is recorded below.

The race fixtures deliberately allow both eligibility reads before modeling the atomic claim. They establish that the second claimant cannot reach the write/successor path. They are **not PostgreSQL concurrency tests**. Deployed transaction isolation, multi-tab refresh/logout/login overlap, session-family replay handling and cookie response ordering across tabs remain unverified. R03 is therefore **partially addressed**, not declared closed.

## Batch 3 ? Validation, mail and approved policies

Implemented R07, R10, R11 and R18:

- Both mail helpers inspect Resend's returned error instead of treating a resolved promise as delivery success. A successful email verification remains successful when the browser has no refresh cookie.
- Client/server post validators enforce the existing database limits: title 50, end description 200, start description 250. Validation trims text before checking its required length. Registration observes username 20/email 80.
- Dates reject negative components, invalid calendar days and known end dates preceding known start dates. Existing zero/unknown date sentinels and imprecise dates remain supported. Out-of-range months return validation errors rather than throwing from the calendar helper.
- An unselected theme is submitted as explicit null and its removal is visible in the moderation diff. Country/theme/subject references are checked before saving a new suggestion.
- **User-approved policy:** enforce the existing registration/reset password and username/email form rules in the API; require current database email verification for USER/MODERATOR/ADMIN article submissions; restrict moderation aggregates to MODERATOR/ADMIN. No verification requirement was added to likes or other unrelated actions.

Validation: **10 passing mail/validation tests** in `tests/validation-mail.test.cjs`; six policy/reference tests in `tests/policy-moderation-recovery.test.cjs`. Provider success, resolved rejection, network failure, disabled mode, no-cookie verification, exact boundaries, unknown dates, absent theme, removed-theme review display, invalid direct API credentials, role matrix and current verification status are covered. Backend checks and frontend build passed; existing frontend type/lint diagnostics remain.

No mail was sent and no database data was changed. Already-pending invalid submissions are not rewritten. Registration still creates the account before email delivery; a delivery failure can leave an account that must sign in and resend. Existing cooldown behavior is unchanged. A foreign key removed after submission can still prevent approval, with its transaction rolling back.

## Batch 4 ? Image ingestion and token lookup

Implemented R04 and the forward-compatible R08 fix:

- Metadata processing uses the URL returned by Wikimedia metadata rather than preserving an arbitrary supplied host after a filename match.
- The CDN job accepts HTTPS media only on `upload.wikimedia.org`, with no credentials or custom ports. Every redirect is validated before following it, with a five-redirect limit. This confines the existing Commons ingestion pipeline; it does not change public article URL validation.
- Downloads enforce a 25 MiB byte cap on both Content-Length and streamed data, keep the 20-second deadline through body consumption, cancel unused bodies, and limit decoded images to 40 million pixels. Existing 429 stop behavior, WebP conversion and SVG rejection remain. Oversized or unsafe sources fail the job item without being uploaded.
- Newly generated high-entropy tokens use a versioned format and SHA-256 digest lookup through the existing tokenHash index. Password hashing remains bcrypt. Existing bcrypt links retain their original expiry and use the legacy path; malformed token strings perform no lookup.

Validation: `tests/image-token-workload.test.cjs` has **7 passing tests** covering unsafe hosts/ports/credentials, relative and external redirects, loops, declared/streamed size, stalled-body timeout, non-image/429 outcomes, indexed lookup and legacy compatibility. A new-token lookup performs one indexed query and zero bcrypt comparisons in the instrumented fixture. Backend type-check and TypeScript build passed; there is no backend lint script. No production job, fetch, upload, benchmark or migration was run.

Remaining limits: existing bcrypt links can still require a scan until expiry (up to 24 hours after the last old-version writer issues one). No production latency claim is made. Larger legitimate originals may need operator review because they now exceed explicit job resource limits. No historical URL/data cleanup was attempted.

## Batch 5 ? Navigation, hydration and cached views

Implemented R13, R14 and R15:

- Search drafts are tied to the current history entry. Saved-filter application, reset and back/forward navigation replace an old draft and cancel its debounce.
- Profile loader data initializes the stats query on both server and client. The loader no longer fills a process-wide query cache; SSR uses a provider-local QueryClient. Profile requests now use the same configured server GraphQL origin as other loaders.
- Publishing/deleting invalidates timeline, post, profile, significance/civilisation and moderation caches. Rejecting invalidates the queue and moderation totals. Likes refresh timeline/profile views as well as liked lists. The nonfunctional delete update against the wrong cache shape was removed.
- Anonymous timelines refetch stale/invalidated cache entries on mount. Loader initial data is used only when its filter matches the query filter. An open timeline modal uses the current matching post when available.

Validation: **3 passing tests** in `tests/client-consistency.test.cjs` cover profile first-render agreement with the actual QueryClient, invalidation of real key shapes, and approve/reject hook effects. Running the profile regression against HEAD's original route produced populated server markup versus client `loading`; the corrected route produces identical first-render markup. This confirms the state mismatch, without claiming a full production SSR hydration trace. The browser fixture additionally passes saved-search application, reset, history navigation and cancellation of an uncommitted search draft. Frontend type/lint/build checks were run; build passed and remaining diagnostics are below.

## Batch 6 ? Timeline, moderation conflicts and recovery

Implemented R12 and the confirmed R09 overwrite/status-transition protections; partially addressed R17:

- After client enhancement, only Masonic owns timeline cards and their refs. The SSR fallback unmounts instead of retaining the complete hidden timeline.
- Era tracking considers mounted visible geometry, schedules updates on masonry renders/scroll/resize and does not reset to an unmounted first card when pages append. It continues to feed the existing EraContext and map.
- New suggestions store the post's submission-time updatedAt in their existing JSON data. Approval rejects changed posts; legacy suggestions compare the post timestamp with suggestion creation time. The post write also conditionally matches the version read in the transaction. No Prisma schema/migration or GraphQL input/output contract changed.
- Approvals claim pending status transactionally before publication; rejections conditionally match pending status. A lost claim cannot publish or overwrite a completed review. Ownership transfer behavior remains unchanged.
- Timeline and form failures now have visible recovery states. Failed moderation actions report their error. Prisma error details are masked in GraphQL responses while intentional domain messages/codes remain available. Client timeout messaging states that the operation may have completed; its deadline is now longer than the existing server response timeout.

Validation: **7 moderation/recovery tests** in `tests/policy-moderation-recovery.test.cjs` cover sequential stale suggestions, legacy timestamps, a change between read/write, lost approval/rejection claims, error masking and timeout uncertainty. Combined with its six batch-3 tests this file has 13 tests. Backend type-check/build and frontend build passed.

`node tests/timeline-browser.cjs` runs real React, Masonic, card/modal components, filter/era providers and D3 map in isolated headless Edge at 1280?800 and 390?844, with synthetic posts and mocked network/auth boundaries. **Passed:** infinite loading; bounded DOM with 240 loaded items; ascending/descending order; scrolling down/up; append; resize; varied image/description dimensions; region change; map dots matching tracked year; modal open/Escape close; saved/reset/back navigation; pending search debounce; error/retry; empty state. No runtime exceptions were reported. The pre-fix fixture mounted **70 cards for 60 posts**; the corrected initial fixture mounted **10 for 60**. Bounds are fixture results, not device-level performance measurements.

Conflict limitations: a background image update also advances updatedAt and can require resubmission. The check protects changes after suggestion creation; it does not carry a version from the moment an edit form was first opened. Existing damaged data is not repaired. No real database contention/rollback test was run; transactional behavior is tested with controlled persistence fixtures.

R17 remains open for late writes: the server response timeout does not cancel downstream database work, and transport failure can occur after commit. No durable idempotency store or cancellation architecture was introduced. The frontend error fixes do not claim otherwise. Cross-tab auth and production SSR/browser/database integration remain acceptance-test gaps.

## Final status and validation

| Finding | Outcome |
|---|---|
| R01, R02, R04, R06, R07, R10, R11, R12, R13, R14, R15, R16, R18 | Targeted fixes implemented and locally verified as described above. |
| R03 | Single-consumption guards and same-tab refresh coordination implemented; real PostgreSQL refresh contention passed in the final integration run. Cross-tab policy and broader session races remain open. |
| R05 | **Excluded: accepted historical risk.** |
| R08 | New-token scan eliminated; existing links retain the legacy path until expiry. |
| R09 | Confirmed post-submission overwrite and status races guarded; competing suggestions and simultaneous approval passed against real PostgreSQL. Form-open staleness remains open. |
| R17 | Error visibility and safer messaging implemented; late mutation completion remains unresolved. |
| R19 | Automated regression baseline added: 47 Node tests, browser fixture, disposable PostgreSQL integration and real frontend/browser acceptance tests. Some form-level end-to-end coverage remains incomplete. |

Final commands/results (2026-10-11, Asia/Singapore):

- `node --test tests/*.test.cjs`: **47/47 pass**.
- `node tests/timeline-browser.cjs`: **pass**, including final added infinite-loading and pending-search cases. Uses a separate temporary browser profile; no personal session.
- Backend `tsc --noEmit --incremental false -p tsconfig.json` and `tsc --incremental false -p tsconfig.json`: **pass**. Generated tracked tsbuildinfo from an earlier build was restored to its starting contents.
- Frontend `tsc --noEmit --incremental false -p tsconfig.app.json`: still fails only at the unchanged `src/lib/cookies.ts:12` unused `options` parameter.
- ESLint over all changed frontend source files, compared with those same files from HEAD via `--stdin`: **26 errors versus 32 originally**. The remaining errors occur on pre-existing code. Fixing Timeline's ref access exposed a `set-state-in-effect` diagnostic on its unchanged SSR-enhancement effect; it replaces the previous refs diagnostic. The new invalidation helper has no lint errors. Existing fast-refresh, explicit-any, empty-catch and effect diagnostics were not turned into a broad refactor.
- Frontend `npm.cmd run build` with process-local `DISABLE_PRERENDER=true`: **client and SSR build pass**. Existing CSS `@property` optimization warning remains. Live API prerendering was intentionally not exercised.
- Manual diff review and `git diff --check`: completed. No package/dependency changes, UI redesign, production access, deployment/configuration edits, credential changes or historical migration changes. Unrelated deletions and redesign assets remain intact.

One expanded browser run initially could not execute because automatic approval review hit a usage limit, not because it deemed the test unsafe. After the user's continuation, the same approval path succeeded and that expanded test passed.

No product-policy clarification remains pending: the user explicitly approved R07 and R18. Further work on durable mutation idempotency, cross-tab/session-family policy, or form-open versioning should be scoped separately with the limitations above visible.

## Final local integration run (2026-10-11)

The local PostgreSQL connection was verified with a read-only query (`current_database=tldrhistory_v2`, server address `::1/128`, port 5432) before creating a uniquely named `tldrhistory_integration_*` database. Its tables were created with `prisma db push --skip-generate` from the current schema; no historical migration was replayed. The backend and frontend ran via `npm run dev` on isolated ports 15000 and 15173. A unique country marker inserted into the disposable database had to appear through the live GraphQL API before any account or article mutation. Email delivery was disabled; test-only one-time token hashes were substituted in that database and consumed through the real verification/reset mutations. No existing development or production data was changed.

Added reusable `tests/local-db.cjs`, `tests/local-integration.cjs`, and `tests/local-browser.cjs`, with setup and cleanup commands in `tests/README.md`. The only application change in this run is a process-local `DEV_API_ORIGIN` override for Vite's development proxy; its default remains port 5000. This was necessary because another local backend already occupied port 5000, which the marker check detected before account mutations.

**Passed against real PostgreSQL, backend routes and GraphQL:** registration and verified-email submission policy; one-time verification; login; moderator-only counts and approvals; article creation/editing with significance preserved; stale competing suggestions; two simultaneous approvals of one edit (one winner); cursor pagination, search/continent filters and both sort orders; significant/civilisation queries; simultaneous refresh rotation (one winner), logout/replay rejection; one-time password reset under concurrent requests; and login to a second account. The headless Edge run passed real timeline scrolling and page loading, bounded visible cards, modal open/close, URL filters/sorting/back navigation, France-to-Japan map/era changes, and login/logout/account switching through the UI.

Validation: `node --test tests/*.test.cjs` **47/47 pass**; backend TypeScript no-emit and build **pass**; frontend client/SSR build with `DISABLE_PRERENDER=true` **pass**. Frontend TypeScript still has the previously known unused `options` parameter at `src/lib/cookies.ts:12`. Full frontend ESLint still fails with **160 errors and 9 warnings**, dominated by generated `.react-router`/GraphQL types and pre-existing source diagnostics. `git diff --check` passed. The disposable test database was removed after the run.

Remaining limits: the disabled email mode does not prove provider delivery or link contents. The browser test covers reading, filtering, navigation and account switching but not every authoring/review form. Real concurrency checks validate single consumption and post state, not cross-tab session policy or durable idempotency after transport failure. R05 remains excluded as an accepted historical risk; R17's late-write uncertainty and the previously documented form-open version gap remain open.
