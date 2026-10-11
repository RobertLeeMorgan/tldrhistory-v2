# Repository risk register

Baseline: 2026-10-11 (Asia/Singapore), working tree based on `fe131e270e509ebdc65899da5604d8aa8884bacf`. See [architecture.md](architecture.md) for system boundaries, authorization matrix, validation results, exclusions and verification limits.

Remediation is tracked separately in [remediation.md](remediation.md). The entries below retain the original audit evidence. **R05 is excluded from remediation by the user: accepted historical risk; no migration replay, rewrite, data recovery or production-data work.** This supersedes R05's original follow-up recommendation below.

Priority reflects impact and reachability, including prerequisites. **Confirmed** means the stated code behavior was directly established, sometimes with isolated execution; it does not mean a production incident occurred. Unverified concurrency/hydration outcomes are explicitly speculative. No critical production compromise was established. Every recommendation below is an investigation, not an implementation or redesign proposal.

## Remediation update ? 2026-10-11

All six implementation batches have been processed; see [remediation.md](remediation.md) for changes, tests and remaining limits. R01/R02/R04/R06/R07/R10/R11/R12/R13/R14/R15/R16/R18 have targeted fixes. R08 uses indexed lookup for new links while preserving legacy expiry. R09 now guards post-submission changes and moderation transitions. R03 remains partially addressed pending real database/cross-tab validation; R17 still includes uncancelled late writes; R19 has a new automated baseline with integration gaps. **R05 remains excluded.** The user explicitly approved API/form policy parity and moderator-only aggregate counts. Original audit evidence below is retained as the pre-fix record, not a description of current fixed code.

## Prioritized index

| ID | Finding | Category | Severity | Confidence |
|---|---|---|---|---|
| R01 | Ordinary edit approval silently zeros significance scores | confirmed defect | high | confirmed |
| R02 | Stored post names become raw HTML in map tooltips | security risk | high | confirmed |
| R03 | Concurrent refresh/reset token consumption may succeed more than once | speculative concern | high | likely |
| R04 | Image processing can fetch attacker-selected hosts and redirects | security risk | high | confirmed |
| R05 | Historical migrations discard moderation/filter data | confirmed defect | high | confirmed |
| R06 | Account switches reuse another account's saved-filter cache | security risk | medium | confirmed |
| R07 | Credential and verification policies are enforced only in the UI | security risk | medium | confirmed |
| R08 | Every reset/verification attempt scans and bcrypt-checks all active tokens | performance concern | medium | confirmed |
| R09 | Edit snapshots can overwrite intervening approved changes | architectural risk | medium | confirmed |
| R10 | Email delivery rejection is reported as success | confirmed defect | medium | confirmed |
| R11 | Form/API validation accepts data incompatible with persistence | confirmed defect | medium | confirmed |
| R12 | Hidden full timeline defeats DOM virtualization and shares refs | performance concern | medium | confirmed |
| R13 | Search draft overwrites externally changed URL filters | confirmed defect | medium | confirmed |
| R14 | Profile SSR cache is not hydrated into the browser | speculative concern | medium | likely |
| R15 | Mutation invalidation leaves public content and stats stale | confirmed defect | medium | confirmed |
| R16 | Protected API errors do not trigger the client's auth recovery | confirmed defect | medium | confirmed |
| R17 | Query/mutation failures can be hidden or outlive the request | architectural risk | medium | confirmed |
| R18 | Moderation aggregate counts lack the queue's authorization check | security risk | low | confirmed |
| R19 | Critical flows lack an automated regression baseline | maintainability issue | medium | confirmed |

## R01 — Ordinary edit approval silently zeros significance scores

- **Remediation status:** resolved in batch 1 for new submissions and review visibility; see [implementation and validation](remediation.md#batch-1--r01). Existing suggestions are not rewritten; R09 remains open.
- **Category:** confirmed defect. **Severity:** high. **Confidence:** confirmed.
- **Affected:** `frontend/src/pages/Edit.tsx:13-24` (`handleSubmit`); `features/form/hooks/useFormReducer.tsx`; `schemas/postSchema.client.ts`; `features/review/hooks/useReviewDiffs.tsx`; `backend/src/validators/inputSchema.ts:16-17`; `schema/resolvers/mutation/edits.ts:78-114`; `schema/resolvers/query/stats.ts`.
- **Evidence:** `handleSubmit(data)` shadows the fetched query `data`. The submitted form has no `getPost`, so reading `data?.getPost?.startSignificance/endSignificance` produces undefined. Form state/schema do not carry those values. The API defaults omitted values to zero and approval writes both scores. Although GraphQL diff data includes significance changes, the visible review-diff hook never renders them. An isolated execution of the actual Edit component callback, with original scores 1 and 0.8, captured serialized mutation input without either score.
- **Failure mode:** a user changes only a description; the moderator sees that edit and approves it; both significance scores are overwritten with zero.
- **Impact / blast radius:** permanent content-metadata loss for approved UI edits; affected posts can disappear from significance/civilisation queries and end-date filter matches. All readers of those posts and moderator decisions are affected.
- **Next investigation only:** follow one description-only edit through form, stored suggestion, displayed diff and approval in a disposable database; compare existing approved suggestions and posts to establish historical scope of score loss.

## R02 — Stored post names become raw HTML in map tooltips

- **Category:** security risk. **Severity:** high. **Confidence:** confirmed for HTML injection; script execution not verified.
- **Affected:** `frontend/src/components/map/WorldMap.tsx:228-241`; `frontend/src/utils/cleanName.ts`; `backend/src/validators/inputSchema.ts:7`; `schema/resolvers/mutation/posts.ts:100-130`, `mutation/edits.ts:78-114`; `frontend/server.mjs:11-31`, `backend/src/app.ts:91-111`.
- **Evidence:** WorldMap interpolates civilisation names into D3 `.html()` without escaping/sanitization. Names are accepted as strings, persist after moderator approval, and are not HTML-escaped by `cleanName`. The validator accepted an HTML name in an isolated check; markup fitting the database's 50-character limit is possible. The checked CSP allows inline scripts but installed Helmet also supplies `script-src-attr 'none'`; a simple onerror claim would therefore be insufficient evidence of executable XSS.
- **Failure mode:** a malicious contribution is approved as an active civilisation, with a matching mapped country and significance/subject values, and its name becomes markup when a reader hovers the country dot. DOM injection is established. Whether nested-document or other payloads execute under the actual delivered CSP requires a browser check; no execution, token theft or production compromise is claimed.
- **Impact / blast radius:** untrusted HTML in reader pages; possible same-origin script execution would expose authenticated actions despite HttpOnly refresh cookies. Affected visitors must encounter the stored civilisation in map context. Moderator approval is a prerequisite in the ordinary contribution path.
- **Next investigation only:** use a local browser with the exact application-generated headers and harmless markers to test the sink, including nested markup; inspect stored civilisation names and both miniature/modal map paths. Establish executable scope before describing this as confirmed XSS.

## R03 — Concurrent refresh/reset token consumption may succeed more than once

- **Category:** speculative concern. **Severity:** high. **Confidence:** likely.
- **Affected:** `backend/src/routes/authRoutes.ts:28-77`; `backend/src/lib/tokens.ts:42-59`; `schema/resolvers/mutation/auth.ts:160-181,235-272`; `frontend/src/context/AuthContext.tsx:63-85,125-161`; `frontend/src/lib/api.ts:19-92`; `frontend/app/routes/verify.tsx:80-82`.
- **Evidence:** refresh reads a valid row, deletes with `deleteMany`, ignores the deletion count and creates a successor. Reset/verify read `usedAt:null` before their write transaction; the eventual update matches only token ID. No explicit isolation/locking or conditional consumption is present. Browser mount/timer/verification refreshes are outside the interceptor's single-flight queue; multiple tabs add another source of concurrency.
- **Potential failure:** under ordinary read-committed interleaving, two refreshes can read the same token before either removes it and both create successors, including one orphaned from the browser's winning cookie. Two resets can validate the same token before either marks it used, then write different passwords/issue sessions. There is no family-reuse response. These are concrete possible interleavings, not results of a live concurrency test.
- **Impact / blast radius:** session lifecycle ambiguity, spurious logout and possible reuse of a stolen token during a race; concurrent password-reset users and multiple-tab sessions. Exploitation requires possession of a valid token, not merely knowledge of a user ID.
- **Missing evidence:** deployed PostgreSQL isolation/configuration and synchronized concurrent-request outcomes. No database concurrency test was performed.
- **Next investigation only:** run paired refresh/reset/verify requests against a disposable schema with barriers at the eligibility read; record deletion counts, successor rows, final password and surviving sessions, including overlap with logout.

## R04 — Image processing can fetch attacker-selected hosts and redirects

- **Category:** security risk. **Severity:** high. **Confidence:** confirmed for the unsafe fetch path; operational exploitation unverified.
- **Affected:** `backend/src/validators/inputSchema.ts:19-35`; `backend/src/scripts/metadataAudit.ts:100-123,436-464`; `backend/src/scripts/cdnUpload.ts:92-120,140-145,183-246,249-255`.
- **Evidence:** URL validation only constructs a URL. Metadata lookup extracts a filename without proving its host, and a successful Commons metadata match can preserve the original `post.imageUrl`. The uploader fetches that original URL and follows redirects before MIME validation. Its Wikimedia normalization helper is only a fallback, not an allowlist. The 20-second timer is cleared after headers; `arrayBuffer()` has no explicit response-byte cap or continuing application timeout. Sharp/WebP conversion and SVG rejection are present and limit what is uploaded, but occur after the network fetch.
- **Failure mode:** an approved article supplies a URL on an attacker-controlled host with a filename matching approved Commons metadata. When operator scripts run, that original URL can redirect to a host reachable by the script, or stream an excessive body. A valid image response may be copied to public R2; non-image responses are rejected only after the request. This is not a public binary-upload/presign endpoint.
- **Impact / blast radius:** server-side requests from the image-job environment, possible internal image disclosure and worker memory/resource exhaustion. Scope is the operator job's network and credentials, not every normal API request.
- **Next investigation only:** establish actual job scheduling/network reachability; trace a harmless controlled-host redirect and bounded large-body fixture through metadata and CDN ingestion; inspect which stored approved URLs retain non-Wikimedia hosts. Do not run these probes against production internal services.

## R05 — Historical migrations discard moderation/filter data

**Remediation status: excluded / accepted historical risk by explicit user instruction.** The current database is operational and contains the required data. Do not modify, rewrite or replay these migrations or attempt historical recovery.

- **Category:** confirmed defect. **Severity:** high. **Confidence:** confirmed for SQL semantics; occurrence in production unknown.
- **Affected:** `backend/prisma/migrations/20260411104930_review_enum_and_fixed_relations/migration.sql`; `20260426075129_saved_filter_receives_string_not_json/migration.sql`; `20260427054323_state_to_json/migration.sql`.
- **Evidence / failure:** the review migration drops both existing status columns and recreates them with default pending, so existing approvals/rejections lose their status. The saved-filter migrations drop their predecessor state column and add a required replacement without conversion/default; populated tables cannot complete those alterations successfully. The SQL itself includes corresponding warnings.
- **Impact / blast radius:** historical moderation audit state can be lost/reopened; populated saved-filter migrations fail and do not preserve filter data. Applies when replaying across populated intermediate schemas or if those migrations affected real data, not to every fresh empty install.
- **Boundary:** the checked staging workflows do not run migrations. The live migration ledger, row counts at application time and backups were not inspected. No claim of current deployment failure is made, and no deployment change is recommended.
- **Next investigation only:** inspect migration history and relevant backups read-only; replay these transitions with representative nonempty fixtures in a disposable database, and determine whether status/state recovery investigation is needed.

## R06 — Account switches reuse another account's saved-filter cache

- **Category:** security risk. **Severity:** medium. **Confidence:** confirmed.
- **Affected:** `frontend/src/features/filter/hooks/useSavedFilterQueries.tsx:9-18`; `frontend/src/context/AuthContext.tsx:72-123`; `frontend/src/components/drawer/SavedFilters.tsx:52-64,187-216`; `frontend/src/features/user/hooks/useUser.tsx:17-41`; `frontend/src/lib/queryClient.ts`.
- **Evidence:** saved-filter key has no authenticated user ID and stays fresh for five minutes. Logout/login neither clear it nor invalidate it. The component's auth gate changes presentation, not the cached query. An isolated test using the actual query options and installed QueryClient fetched A's private filter, switched the fake request identity to B, and returned A's data again with only one request. Profile post/like keys similarly omit the viewing account even though results include viewer-specific liked flags, with 30-minute staleness.
- **Failure mode:** A loads saved filters, logs out without a full document reload, and B logs in in the same browser application. B's drawer displays A's filter names/search criteria; attempts to edit/delete A's filter IDs then fail server ownership checks. Profile like controls can inherit the wrong viewer's state.
- **Impact / blast radius:** private saved-filter/search information leaks between sequential accounts sharing a browser tab/application lifetime; misleading social state. Server-side ownership checks still prevent cross-owner mutation. This is not a remote arbitrary-user cache read.
- **Next investigation only:** reproduce A→logout→B and pending-request/logout races through the real UI; inspect all account-dependent keys, including moderator-session caches, without assuming every retained cache is directly visible to an unprivileged page.

## R07 — Credential and verification policies are enforced only in the UI

- **Category:** security risk. **Severity:** medium. **Confidence:** confirmed.
- **Affected:** `backend/src/schema/resolvers/mutation/auth.ts:50-107,235-253`; `backend/src/schema/resolvers/mutation/posts.ts:10-17`; `mutation/edits.ts:11-18`; `utils/auth/requireRole.ts`; `frontend/src/schemas/{registerSchema,resetSchema}.ts`; `frontend/app/routes/articles.create.tsx:17-21`, `articles.edit.$id.tsx:16-20`.
- **Evidence:** register/reset hash their string password directly without equivalent server password validation. Register does not validate email syntax or username format. Both contribution mutations check role but not email verification. Actual GraphQL/resolver probes with fake persistence accepted empty-password registration and a suggestion from an unverified USER.
- **Failure mode:** callers bypass client forms to create weak/invalid credentials or submit content without verifying mailbox ownership. A valid reset link also permits a password the UI would reject. These paths do not let callers select ADMIN or bypass moderation approval.
- **Impact / blast radius:** weakened account policy and more unverified submission abuse; account owners, signup/reset flows and moderator workload. Database string/uniqueness constraints still apply; the issue is not unrestricted role escalation.
- **Next investigation only:** establish intended account policy and exercise direct GraphQL registration/reset/submission variables against a disposable user, including empty passwords, invalid address/username formats and verification-state changes.

## R08 — Every reset/verification attempt scans and bcrypt-checks all active tokens

- **Category:** performance concern. **Severity:** medium. **Confidence:** confirmed for work amplification; production saturation not measured.
- **Affected:** `backend/src/lib/tokens.ts:42-59`; `schema/resolvers/mutation/auth.ts:164,240`; `backend/src/server/rateLimit.ts`; `backend/src/server/timeoutMiddleware.ts`.
- **Evidence:** `findMatchingAuthToken` fetches every unused/unexpired token of a type, includes its user and performs sequential cost-12 bcrypt comparisons until a match. Invalid tokens take the full scan. The tokenHash index cannot support this lookup because no hash predicate is queried. Request limits count HTTP requests, not candidate comparisons, and the response timeout does not cancel work.
- **Failure mode:** as active verification/reset links accumulate, each unauthenticated invalid-link request performs work proportional to the entire candidate population. Concurrent attempts contend with password hashing/comparison even below the configured request limit. Public query aliases also allow multiple database reads per request, but no failed-login alias bypass is claimed: mutation non-null errors affect execution.
- **Impact / blast radius:** slow verification/reset, shared hashing resources and API/database load; scale depends on live active-token count and concurrency. No benchmark or production denial of service is claimed.
- **Next investigation only:** measure candidate counts and latency/CPU for valid/invalid tokens over increasing disposable datasets; verify cancellation after client/server timeout and operation amplification using bounded fixtures.

## R09 — Edit snapshots can overwrite intervening approved changes

- **Category:** architectural risk. **Severity:** medium. **Confidence:** confirmed for overwrite semantics; concurrent status races remain unverified.
- **Affected:** `backend/src/schema/resolvers/mutation/edits.ts:27-38,44-123,128-147`; `mutation/posts.ts:61-145`; `query/suggestions.ts:29-39`; `backend/src/utils/suggestionHelpers.ts:78-119`.
- **Evidence:** each suggestion stores a full validated post snapshot. Approval writes all listed scalar fields and the complete subject set, without a base version or changed-fields check. The review queue computes diffs against the current post. Approvals read pending status then update by ID; rejections check state outside a transaction and update by ID as well.
- **Failure mode:** A and B suggest independent edits from the same original post. After A is approved, approving B also restores B's old snapshot values for A's changes. A moderator with an already-open queue may not see that newly introduced reversal. A separate plausible approve/reject race could mark published content rejected; that interleaving was not database-tested.
- **Impact / blast radius:** lost editorial work and misleading moderation history for posts with overlapping submissions; reviewers and readers of those posts. Single approval's post/status writes are transactional, so generic partial-transaction corruption is not asserted.
- **Next investigation only:** submit two independent edits, approve sequentially and compare all fields; then test stale review pages and paired approve/reject requests under the actual database isolation level.

## R10 — Email delivery rejection is reported as success

- **Category:** confirmed defect. **Severity:** medium. **Confidence:** confirmed.
- **Affected:** `backend/src/lib/mail.ts:16-39,42-65`; `schema/resolvers/mutation/auth.ts:98-113,220-232,327-339`; installed Resend client's response handling.
- **Evidence:** mail helpers await `resend.emails.send` but never inspect its returned error. The installed SDK resolves an error result on provider failures. Running the actual helpers/SDK with a fake fetch returning HTTP 422 made both verification and reset helpers resolve successfully. No real mail was sent.
- **Failure mode:** rejected template/request/provider responses are followed by a successful account or “sent” response. A token has already been created/replaced; cooldown can delay another attempt. Independently, opening a valid verification link without a refresh cookie marks the DB verified but the UI awaits `/api/refresh` before showing success (`frontend/app/routes/verify.tsx:80-107`); the resulting UI state needs browser verification.
- **Impact / blast radius:** users cannot receive verification/reset messages while the product reports success; account recovery/support burden. Delivery-disabled mode is an explicit configuration and is not itself classified as a defect here.
- **Next investigation only:** replay provider rejection, network failure, disabled mode and success using controlled responses; trace token/cooldown/account state and the no-cookie verification-page outcome.

## R11 — Form/API validation accepts data incompatible with persistence

- **Category:** confirmed defect. **Severity:** medium. **Confidence:** confirmed.
- **Affected:** `backend/src/validators/inputSchema.ts:7-17,54-72`; `backend/prisma/schema.prisma:68-70,138-147`; `frontend/src/schemas/registerSchema.ts:6-10`; `frontend/src/schemas/postSchema.client.ts`; `frontend/src/features/form/hooks/useFormReducer.tsx`; `frontend/src/features/form/components/PostForm.tsx:130-150`; approval resolvers.
- **Evidence:** client/API post names permit 100 characters versus database VARCHAR(50); end descriptions permit 250 versus VARCHAR(200). Client registration allows username length 30 versus VARCHAR(20). Group defaults to `{id:0,name:""}` in the form and is sent as such, while backend inputSchema requires a positive ID if group is present. Backend accepts a negative day and does not enforce end-after-start. Isolated validator checks accepted name length 51, end-description length 201 and day -1.
- **Failure mode:** apparently valid submissions enter the JSON queue but fail moderator approval at persistence; optional/no-theme form submissions fail immediately. Invalid dates can persist if approved because equivalent DB check constraints are absent. Unknown foreign keys fail at publication, rather than necessarily at submission.
- **Impact / blast radius:** blocked contributions/registration, moderator rework and malformed historical metadata. Existing DB length/foreign-key constraints protect storage from those particular incompatible values; approval transactions roll back on failure.
- **Next investigation only:** run client→GraphQL→suggestion→approval boundary cases in a disposable DB, covering all maximum lengths, no group, absent/explicit-null optionals, unknown relation IDs and date ordering; inventory already-pending impossible-to-publish submissions.

## R12 — Hidden full timeline defeats DOM virtualization and shares refs

- **Category:** performance concern. **Severity:** medium. **Confidence:** confirmed for retained DOM/shared refs; exact scroll symptoms unverified.
- **Affected:** `frontend/src/features/timeline/components/Timeline.tsx:22-43,63-90,118-169`; `hooks/useEraTracker.tsx:17-81`; `frontend/src/components/cards/CardDescriptions.tsx`; `frontend/src/utils/animatedCache.tsx`.
- **Evidence:** after enhancement, StaticTimelineGrid still maps all flattened pages to full cards, made invisible/absolute rather than unmounted. Masonic renders a second set. Both attach the same ref object per post; virtual mounting/unmounting can overwrite/clear a ref also attached to the hidden card. Images in cards are eager. The era tracker scans those refs and resets its index whenever posts change.
- **Failure mode:** DOM nodes, image elements and mounted card state grow with all loaded pages despite virtual rendering. Era calculations may read hidden geometry or missing/reassigned refs; the exact sequence depends on React/Masonic commits. Scrolling/layout performance degrades on long sessions, particularly mobile, even without a ref race.
- **Impact / blast radius:** all sufficiently long timeline visits; memory, scroll responsiveness and era/header/map accuracy. No device-level benchmark or specific race frequency was measured.
- **Next investigation only:** count DOM cards, refs, image work and heap across a long fixture timeline; record visible-card versus tracked-year behavior during page append, virtual eviction, resize, filter change and direction reversal.

## R13 — Search draft overwrites externally changed URL filters

- **Category:** confirmed defect. **Severity:** medium. **Confidence:** confirmed from state flow; browser reproduction pending.
- **Affected:** `frontend/src/components/ui/UtilityMenu.tsx:25-39`; `frontend/src/components/drawer/SavedFilters.tsx:93-120`; `frontend/src/components/drawer/Drawer.tsx:64-68`; `frontend/src/context/FilterContext.tsx:58-109`.
- **Evidence:** UtilityMenu initializes `searchInput` once from `filter.search`, then its effect treats any difference as an instruction to patch the URL after 300 ms. There is no effect synchronizing the draft when another control/navigation changes search. Saved-filter application and drawer reset update the URL directly. The utility-menu reset clears its own input, so that particular reset path is different.
- **Failure mode:** while the timeline layout remains mounted, apply a saved filter with another search or clear via the drawer. The old local search text wins after the debounce and rewrites the just-applied URL. Back/forward or other same-layout URL navigation can have the same effect.
- **Impact / blast radius:** search, saved-filter application and navigation correctness for timeline users; misleading/no results and extra loader/API work.
- **Next investigation only:** record URL/input/query-key sequences for saved-filter apply, drawer reset and back/forward with a pending debounce, including slow loader responses.

## R14 — Profile SSR cache is not hydrated into the browser

- **Category:** speculative concern. **Severity:** medium. **Confidence:** likely.
- **Affected:** `frontend/src/lib/queryClient.ts:1-3`; `frontend/app/root.tsx:24-30`; `frontend/app/routes/user.$id.tsx:13-26,50-73`; `frontend/src/features/user/hooks/useUser.tsx:45-65`.
- **Evidence:** the loader fills a module-singleton QueryClient and returns public stats. The component ignores loader stats and uses a query against that singleton during SSR. A fresh browser has another QueryClient and receives no explicit dehydrated state or query initialData. The server key excludes request origin and `ensureQueryData` can reuse existing data independently of the fresh browser's fetch.
- **Potential failure:** direct profile navigation produces populated server markup but loading/empty query state on the first browser render, causing hydration recovery/flicker or repeated requests. Server cached public stats can also differ from newer browser results. Process-wide retention across profile URLs deserves measurement. No private SSR leakage is established.
- **Missing evidence:** real built SSR HTML, first hydration render, React warnings and profile navigation traces under current React Router/TanStack versions.
- **Impact / blast radius:** public profile pages, user stats, SSR consistency and potentially server memory across many profiles.
- **Next investigation only:** capture direct profile requests and browser hydration with empty/warm caches, compare loader data with rendered query state, and inspect server cache growth and routing origin usage.

## R15 — Mutation invalidation leaves public content and stats stale

- **Category:** confirmed defect. **Severity:** medium. **Confidence:** confirmed.
- **Affected:** `frontend/src/components/cards/CardFooter.tsx:23-43`; `frontend/src/hooks/useDeletePost.tsx:25-45`; `frontend/src/features/review/hooks/useCreate.tsx:19-40`, `useEdit.tsx:14-35`; `features/user/hooks/useUser.tsx`; `features/stats/hooks/useStats.tsx`; `features/review/hooks/useSuggestions.tsx`.
- **Evidence:** like success updates only the local CardFooter and invalidates userLikes; neither timeline cards nor userPosts/userStats are refreshed. Approved posts/edits invalidate their review queue and timeline only; rejected submissions invalidate the queue only, leaving pendingStats stale. Delete's optimistic update addresses exact key `["timeline"]`, whereas real lists use longer keys and infinite-page shapes; final prefix invalidation does refetch timelines, but profile/stat caches remain. Stats/profile freshness is 30 minutes.
- **Failure mode:** the same post displays different like totals in a card/modal/profile; a virtual remount restores an old count; profile top contribution and map/significance stay outdated after approval/deletion; moderation totals disagree with the queue. Actual server writes can be correct while the UI contradicts them.
- **Impact / blast radius:** readers, contributors and moderators within the affected browser cache lifetime; stale deleted/edited content and loss of trust in action results.
- **Next investigation only:** trace actual cache entries before/after like, approve, reject and delete, across card/modal/profile/map/review views; measure stale duration and distinguish stale display from a failed write.

## R16 — Protected API errors do not trigger the client's auth recovery

- **Category:** confirmed defect. **Severity:** medium. **Confidence:** confirmed.
- **Affected:** `backend/src/utils/auth/requireAuth.ts:3-5`, `requireRole.ts:4-8`; `backend/src/app.ts:132-137,153-163`; `frontend/src/lib/api.ts:52-58,103-107`; `frontend/src/context/AuthContext.tsx:63-69`.
- **Evidence:** expired/invalid bearer tokens produce null context. Guard helpers throw plain `Error("Not authenticated")`; the API assigns INTERNAL_SERVER_ERROR. Axios refreshes only on GraphQL UNAUTHENTICATED or HTTP 401. The isolated GraphQL guard probe produced no auth extension, consistent with this formatter path.
- **Failure mode:** a backgrounded tab resumes after access expiry before its renewal timer completes; a protected like/filter/review request fails with an internal error instead of following the interceptor's recovery path. Public timeline reads can silently become anonymous instead, so they do not force recovery either.
- **Impact / blast radius:** signed-in interactions around token expiry; especially long-lived/background tabs and protected moderation actions. Scheduled refresh may mask the problem during ordinary foreground use.
- **Next investigation only:** expire access tokens while preserving the refresh cookie, invoke each guarded operation, and record HTTP status, GraphQL code, timer/interceptor order and final session state.

## R17 — Query/mutation failures can be hidden or outlive the request

- **Category:** architectural risk. **Severity:** medium. **Confidence:** confirmed for handling paths; actual late-write incidents unverified.
- **Affected:** `frontend/src/features/timeline/hooks/useTimeline.tsx:70-76`, `components/Timeline.tsx:47-49,130-175`; `frontend/src/pages/{Edit,CreateArticle}.tsx`; `frontend/src/features/review/components/{ReviewEditsPanel,ReviewCreatedPanel}.tsx`; `backend/src/server/timeoutMiddleware.ts:3-14`; `backend/src/app.ts:132-137,192-195`; `frontend/src/lib/{api,graphql}.ts`.
- **Evidence:** Timeline ignores its hook's error; creation/edit pages return null without data; review handlers primarily clear acting state. Server timeout sends a 504 but does not cancel downstream work. Axios times out at ten seconds, earlier than the server's 15 seconds. GraphQL formatting returns original error messages, while the client discards partial data/error codes after the interceptor.
- **Failure mode:** load-more fails without explanation/retry affordance, forms remain blank, or a moderator sees a button stop without knowing why publication failed. A slow mutation can commit after the client has timed out, so resubmission may produce duplicates/toggle a like back. Prisma validation errors can expose implementation detail through unchanged messages; no leaked secret value was observed.
- **Impact / blast radius:** timeline, forms, moderation and any slow mutation; uncertainty about whether writes succeeded, support burden, and possible duplicate user actions. Transaction boundaries remain relevant and are not undone by timeout middleware.
- **Next investigation only:** inject controlled GraphQL, network and delayed-commit failures in an isolated environment; record rendered state, late responses and persistence before any retry. Inspect representative error messages/logs with synthetic data for unintended detail exposure.

## R18 — Moderation aggregate counts lack the queue's authorization check

- **Category:** security risk. **Severity:** low. **Confidence:** confirmed.
- **Affected:** `backend/src/schema/resolvers/query/suggestions.ts:83-94`; `backend/src/schema/typeDefs.ts:410-412`; `frontend/app/routes/review-suggestions.tsx:17-21`.
- **Evidence / failure:** `pendingStats` accepts context but does not check it, while both adjacent pending-queue queries require MODERATOR/ADMIN. Anonymous `{ pendingStats { pending approved rejected } }` returned aggregate fixture counts in an actual GraphQL/resolver probe with fake Prisma.
- **Impact / blast radius:** anyone can read moderation volume/outcomes. This does not reveal submission bodies, grant review privileges or prove the public aggregate violates intended product policy.
- **Next investigation only:** confirm the intended visibility of moderation aggregates, compare anonymous/USER/MODERATOR/ADMIN requests, and establish whether these totals were deliberately public.

## R19 — Critical flows lack an automated regression baseline

- **Category:** maintainability issue. **Severity:** medium. **Confidence:** confirmed for the inspected repository.
- **Affected:** `backend/package.json:6-15`; `frontend/package.json:6-12`; `.github/workflows/staging-deploy.yml:15-23`; frontend TypeScript/lint configuration; auth/moderation/timeline/storage paths above.
- **Evidence:** no source test suite/configuration was found; backend `test` is an intentional failing placeholder and frontend has no test command. CI's validate job builds both images without a declared behavioral-test step. Read-only backend compilation passed; frontend compilation failed on existing TS6133 in `src/lib/cookies.ts:12`. Scoped frontend lint reported 133 errors and 9 warnings across 145 files; this is not presented as 142 separate functional defects. The Docker frontend build is not the same check as the failed standalone TypeScript command.
- **Failure mode:** regressions in token consumption, role enforcement, moderation write integrity, query cache identity and infinite scrolling have no demonstrated repository test gate. Build success alone can miss the concrete callback/cache/mail issues reproduced during this audit.
- **Impact / blast radius:** changes across authentication, editorial data and core exploration; increased likelihood of repeated defects and lower confidence in subsequent work. External/manual test suites may exist but were not supplied.
- **Next investigation only:** inventory external/manual validation and determine the smallest evidence set needed to establish reproducible baselines for the ten audits below; distinguish current diagnostics from observed production failures.

## Boundaries and non-findings

Main approve/reject/delete operations have server role guards; saved-filter edits/deletes check owner; submission author and like user IDs come from context. No direct unauthenticated admin write or role escalation was established. Public likes, author roles and verification timestamps are documented in architecture, with product privacy intent unknown. A nested GraphQL declaration alone was not treated as a leak: missing projected fields generally fail default resolution. HTTP array batching is disabled by installed Apollo defaults; alias operations are a separate question.

Raw refresh-token storage and the access-token revocation window are established baseline properties; a stolen database row is usable as a bearer token until expiry/revocation, but no database/backup exposure was found. Secret-pattern scans did not identify active credentials within their stated coverage; they do not certify all history/artifacts clean. Unindexed predicates and unbounded profile/review lists merit measured query-plan work, not an unsupported claim of an existing N+1 or outage. Map `endYear=0` differs from the API's open-ended interpretation, and browser scroll restoration has no route-level implementation; these remain targeted checks within the follow-up scope rather than additional unverified high-priority incidents.

No removal/refactor of retired AI services, future-redesign assets or frontend guidance is recommended. Their preservation and possible future exclusion levels are recorded in architecture. VPS/deployment design is unchanged; no host/platform/container/proxy/deployment-architecture recommendations are made. No live deployment failure is inferred from absent host configuration or the historical migration findings.

## Ten most important follow-up audits, in priority order

1. **Editorial data preservation (R01, R09, R11):** trace description-only and overlapping edits through submission, visible review and approval; quantify historical significance loss and snapshot overwrites using read-only records or disposable fixtures.
2. **Map HTML execution boundary (R02):** validate stored-name markup in a local browser under exact delivered CSP, including map modal paths; determine whether confirmed HTML injection permits same-origin script execution.
3. **Token lifecycle and session races (R03, R16):** synchronize refresh/reset/verification consumption; cover multi-tab renewal, logout overlap, reset revocation and role-change/access-expiry windows using an isolated database.
4. **Complete GraphQL authorization and exposure matrix (R07, R18):** exercise anonymous, unverified, USER, BOT, MODERATOR and ADMIN against roots, alternate selections and aliases; verify owner isolation, public-profile intent and nested response projections.
5. **Image source-to-storage trust chain (R04):** establish real operator schedules/credentials and test controlled host redirects, metadata/original-URL preservation, MIME/decoder behavior, body limits and public object reachability.
6. **Historical migrations (R05) — excluded:** accepted historical risk by explicit user instruction; no migration replay/rewrite or historical data recovery. Retained in this baseline list for traceability only.
7. **Account cache isolation and invalidation (R06, R15):** record A→B account transitions, in-flight requests and card/modal/profile/review/map caches across likes, approvals and deletion.
8. **SSR, timeline navigation and scroll context (R12-R14):** capture profile hydration, loader/query agreement, rapid search/saved-filter navigation, ascending/descending pagination, hidden-card refs, era/geography transitions and back/forward positions at mobile/desktop sizes.
9. **Database and authentication workload (R08, R12):** measure active-token bcrypt scans, representative query plans, profile/review cardinalities, aliases, date/search predicates, Like.postId counts and long-scroll memory; identify actual bottlenecks before drawing index/N+1 conclusions.
10. **Failure recovery and existing validation coverage (R10, R17, R19):** test synthetic provider rejection, no-cookie email verification, timeouts after commit, query failures and retries; reconcile CI/compiler/lint/manual coverage with these critical behaviors.
