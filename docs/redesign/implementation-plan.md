# TL;DR History redesign: implementation and review plan

Status: planning complete; awaiting review. Prepared 11 October 2026. No application/backend code changed, no dependencies installed and no implementation started. Read [architecture.md](architecture.md) for observed behavior and [design-spec.md](design-spec.md) for the proposed product presentation.

## Approval boundary

The planning-only user request and `frontend/AGENTS.md` require stopping here. The instruction is: **“Stop after producing these documents and request approval before implementation.”** Approval should identify the phase to begin. After approval, implement one approved phase at a time and report changed files, actual checks/results, remaining gaps and deviations before advancing. This plan does not authorize backend work, deployment, package installation or unrelated cleanup.

| Decision | Recommendation for approval | Consequence / alternative |
| --- | --- | --- |
| D1: visual direction | Charcoal/ivory/gold atlas, cream discovery/forms/legal, system serif + sans, supplied SVG logo | No font/network dependency or theme switch. Custom fonts need supplied assets and a revised asset plan. |
| D2: timeline composition | Persistent left context column and larger header; retain window as feed scroll root | Preserves actual Masonic architecture. An inner scroll container would require a separately justified prototype and broader observer/restoration work. |
| D3: era strip | Purely visual, driven by EraContext; horizontal overflow only | No era selection/jump feature. Existing theme/date URLs remain the exploration controls. |
| D4: search and filters | One shared search implementation; homepage submits existing URL format; immediate multiselect filters in desktop toolbar/mobile drawer | No duplicate nav search controller, Apply/Cancel transaction or filtering engine. Preserve reset/view distinctions. |
| D5: homepage | Preserve every existing section, copy item and destination; use supplied images by filename | No mockup-only statistics, popular searches or extra routes. Copy refinement requires separate approval. |
| D6: wide-screen density | Retain Masonic; target one/two columns, up to three only where readable width permits | Two-column cap is the conservative fallback if measurement/scan-order validation fails. No list toggle. |
| D7: accessibility | Repair shared overlay focus/locking and keyboard affordances within presentation phases | Necessary for new drawers/dialogs; retain all business/permission logic. No new dependency assumed. |
| D8: motion | Migrate simple effects to CSS and actual-value text; remove Framer only after all consumers are migrated and checked | Keeping Framer temporarily is safe and preferable to a cross-application removal in Phase 1. No unmeasured performance claims. |

No invariant exception is requested. The larger fixed header does require correcting the existing tracker's visibility band to exclude occluded cards; approval of Phase 3 includes that bounded layout integration. It does not authorize a new era algorithm, persisted selected-era state, pagination scheme or scroll-restoration subsystem.

Existing issues are documented rather than implicitly approved: 2025/2026 bounds mismatch, inclusive era-boundary precedence, one-bound header range precedence, saved-filter matching/view persistence, map open-ended dates/cache lookup, profile cards without modal activation, route metadata path inconsistencies, and general lint debt. If one blocks a phase, reproduce it, propose the smallest separate change and obtain scope approval.

## Dependency and review structure

```text
Phase 1: foundations/shell
  -> Phase 2: homepage/shared search
  -> Phase 3: timeline geometry/header/strip/context
  -> Phase 4: cards/dialogs
  -> Phase 5: desktop/mobile filters
  -> Phase 6: responsive/motion completion
  -> Phase 7a: auth/recovery/legal/error
  -> Phase 7b: contribution forms
  -> Phase 7c: profile/moderation
  -> Phase 8: final regression + optional Framer dependency cleanup
```

Phases are sequential review units, not a single large branch dump. Phase 1 and homepage come first as requested. Phase 3 must include a working compact layout and viewport checks; Phase 6 refines it rather than postponing mobile usability. Phase 4 establishes the overlay primitive before Phase 5 uses it. Secondary route work is split into three smaller units because it spans different guarded workflows. Every phase must leave the application usable with unmigrated routes and must not remove a control before its replacement is available.

Potential new files listed below are proposed locations; keep abstractions small and adjust names during review if needed. All paths are repository-relative.

## Baseline and common validation gate

Before **each** phase, record the starting revision, working-tree changes and relevant current behavior. Do not overwrite user changes; in this planning pass `frontend/AGENTS.md` was already modified and `frontend/resources/` was newly supplied. Use command-local Git safe-directory configuration if required by the local account, not a global Git configuration change.

Before Phase 1, verify the existing dependency environment: the audit found declared `@react-router/dev` 7.18.4 but installed 7.14.1. Record manifest/lockfile agreement and the actually executed tool versions. Resolve dependency-environment preparation explicitly within the approved implementation scope before treating results as the declared-version baseline; do not silently upgrade packages or install anything during this planning pass.

Then establish an initial screenshot/interaction baseline at 390×844, 768×1024, 1280×800 and 1920×1080 with reproducible posts and both anonymous/authenticated states. Add 320 px and short landscape during responsive work. Capture home, default/themed/filtered timeline, article/map overlays, profile, each form family, moderation and legal anchors. Record scroll positions and visible post IDs before/after append, resize and overlay close, including returning from a different route. Use the same data for comparisons; do not depend on reference mockup figures.

Commands supported by the existing repository (future implementation checks, **not run in this planning pass**):

```powershell
# From frontend/, using installed local tooling; no install or codegen required.
npm.cmd run lint
node node_modules/@react-router/dev/bin.js typegen
node node_modules/typescript/bin/tsc --noEmit --incremental false -p tsconfig.app.json
$env:DISABLE_PRERENDER = 'true'
npm.cmd run build

# From the repository root.
node --test tests/*.test.cjs
node tests/timeline-browser.cjs
git diff --check
```

Verify the installed React Router CLI entry before executing typegen; alternatively use the existing local `node_modules/.bin/react-router.cmd typegen`. Do not let a missing CLI trigger a package download. Restore a previously set DISABLE_PRERENDER value after the check. Build emits client/SSR artifacts, and typegen emits route types; keep generated output out of design commits unless tracked and intentionally required. Offline build success does not verify API-dependent prerendering; exercise normal prerender only against an approved local/staging API in final integration.

Run lint/type/build and relevant existing tests after each phase. Run the full node suite when shared controls, permissions-sensitive presentations, state wiring or final integration are affected; use the timeline browser fixture after any geometry/card/filter/overlay/motion change. A pure homepage image/layout pass needs content/link checks, shared-search regression and responsive/a11y checks rather than newly authored snapshot tests for every cosmetic class. Do not rerun a passing gate repeatedly without a change or new concern.

The prior audit recorded an unused `options` parameter in `src/lib/cookies.ts`, existing source/generated-code lint failures and successful builds/tests. Recheck these; report baseline vs new diagnostics. Existing debt is not a reason to skip checks or claim green. New diagnostics introduced by the phase must be resolved; unrelated debt requires explicit tracking, not opportunistic refactoring.

Browser coverage must use the actual shell, not only `tests/timeline-browser-fixture.tsx`'s custom fixed test header. Extend the existing fixture/harness as needed with real layout and mocked stats/loader boundaries. The current fixture checks mechanics but cannot certify occlusion, real queries, focus, touch or reference appearance. Use `tests/local-browser.cjs` / `tests/local-integration.cjs` only with the documented disposable local database and disabled delivery in `tests/README.md`; no production services or backend code changes are needed.

## Phase 1 — Shared design foundations and global shell

**Depends on:** approval of D1 and navigation direction. **Risk:** medium (global CSS and shared fixed geometry). **Review result:** coherent token/primitives/navigation foundation with current routes still usable.

**Affected existing files:** `frontend/src/index.css`; `src/pages/RootLayout.tsx`; `src/components/ui/{Nav,Background,Button,PageContainer,HeaderContainer}.tsx`; `src/features/stats/components/StatsContainer.tsx` only for explicit compatibility variants; `src/icons/icons.tsx`; `frontend/app/root.tsx` only where shell/resource integration needs it. Use `frontend/public/tldr-history-logo.svg` as-is. Do not change SEO image assets.

**Work:**

1. Define semantic dark/cream tokens, spacing/type/radius/focus/motion/layer rules and DaisyUI mappings. Keep aliases for unmigrated colors; do not mass-replace every stone utility.
2. Add explicit discovery/form/reading page variants and nav sizing. Rebuild navigation using the existing route/auth visibility set plus explicit Home/Timeline and Cookies access. Keep the wordmark's existing timeline destination.
3. Reserve nav space and compatible offsets for existing timeline/profile/review headers. Introduce explicit legacy/timeline variants if necessary; avoid adding a global header-height change that obscures content on unmigrated routes.
4. Establish button/field styling conventions and reduced-motion CSS. Migrate only shared primitives needed by home/nav; no sweeping Framer removal yet.

**Acceptance:** real SVG loads at every breakpoint; keyboard menu/links work; login/loading/USER/MODERATOR/ADMIN menus match existing permissions; logo/logout destinations preserved; no overlap on timeline/profile/review; all old button call sites retain type/link/loading behavior; light/dark surface contrast measured; no body horizontal overflow at 320 px.

**Validation:** common lint/type/build; node client-consistency/security suites for shared behavior; screenshot/keyboard check on every route family; verify public/private metadata and initial SSR markup remain stable. Test timeline scrolling once because shell offsets changed.

**Rollback:** revert the phase's new token consumers and shell geometry together; retain any approved independent logo correction only if reviewed separately. Do not remove compatibility aliases until no old consumer depends on them.

## Phase 2 — Homepage and shared timeline search entry

**Depends on:** Phase 1; approval of D4/D5. **Risk:** medium (content preservation, URL/debounce/hydration). **Review result:** redesigned homepage with working existing timeline search transfer.

**Affected:** `frontend/app/routes/home.tsx`; `src/components/ui/UtilityMenu.tsx`; `src/features/filter/components/timelineFilterParams.ts` and `TimelineFilter.tsx` as unchanged contracts; proposed `src/features/filter/components/TimelineSearchField.tsx` and `src/features/filter/hooks/useTimelineSearch.ts`; optional small `src/features/home/components/*` and content module if splitting the route improves readability. `app/root.tsx` only for appropriate hero preload. Existing assets in `src/assets/images/home/`.

**Work:**

1. Capture the homepage text/link inventory from the existing route. Recompose cinematic hero, Start here, all six featured paths, explanation/time slices, four lenses, three same-time facts and final CTAs using the specification's ledger.
2. Match supplied assets by descriptive filename, inspect each actual crop, reserve known dimensions and support missing/failed images. Do not generate/substitute art or add mockup-only sections/statistics.
3. Extract the current controlled search and location-key-aware debounce into a shared field/controller. Keep UtilityMenu visually functional during this phase; only substitute its search internals. Avoid duplication of query normalization.
4. Homepage submit uses defaults + trimmed search -> existing serializer -> `/timeline?q=...`. Timeline loader/provider/query perform the only data fetch. Keep one timeline controller mounted. No provider relocation to app/root.

**Acceptance:** every ledger destination and all existing copy remain; empty/Unicode/ampersand search encodes correctly; submitted query appears in timeline input and GraphQL filter; first SSR data agrees with client filter; timeline live search still applies after 300 ms; reset/saved filter/back navigation cancels old drafts; homepage back returns to home; no search request while merely typing on home; no duplicate query pipeline.

**Validation:** common checks, full content/link comparison, anonymous and authenticated home-to-timeline interaction, synthetic search tests for encoding and timer/navigation races, SSR/hydration check, image-blocked and 320/390/768/1280 screenshots. Use existing tests/harness; add only behavior tests that can catch meaningful state regressions.

**Rollback:** revert homepage layout/assets independently if needed while retaining a verified shared search extraction; or restore UtilityMenu's prior search/controller and homepage together. Query format never changes, so old URLs remain valid.

## Phase 3 — Timeline shell, header, passive era strip and context

**Depends on:** Phases 1–2; D2/D3/D6. **Risk:** high (occlusion, virtualization, responsive remeasurement). **Review result:** complete new timeline composition while existing filter drawer and article appearance remain usable.

**Affected:** `src/features/timeline/components/{TimelineLayout,TimelineHeader,TimelineStats,Timeline}.tsx`; `src/features/timeline/hooks/useEraTracker.tsx`; `src/components/ui/HeaderContainer.tsx`; `src/features/stats/components/StatsContainer.tsx`; `src/components/map/WorldMap.tsx` for token styling only initially; scoped `src/index.css`; proposed `features/timeline/components/EraStrip.tsx`, `TimelineContextPanel.tsx`, `hooks/useTimelineGeometry.ts`. `EraContext.tsx`, `utils/rangeViews.ts` and `historicalRanges.ts` are read contracts; do not replace their state/definitions.

**Work:**

1. Compose measured nav/context/strip offsets, left desktop sidebar and feed. Preserve window root and existing Masonic engine/infinite callback. Define SSR fallback geometry and keep non-timeline shell variants compatible.
2. Add current position, separate labeled theme/filter span and all geographic perspectives. Header/strip/sidebar read the same EraContext. Strip contains no selection handlers or `setEra` calls.
3. Adapt the existing tracker to the unobscured feed band from one geometry owner. Keep data-order candidate selection and mounted-ref checks. On geometry resize, schedule the same tracker; do not drive state from decorative strip visibility.
4. Restyle/reposition real stats and current dot map; label population globally and significance accurately. Retain query keys/stale/placeholder behavior and surface pending/unavailable states. Do not add totals or cached-post fetch fallback.
5. Add compact tablet/mobile context disclosure and read-only overflow strip. Keep one controller mounted across breakpoints. Keep the existing UtilityMenu/Drawer in a safe temporary location until Phase 5; moving it must not hide any action.
6. Adjust measured column count only if acceptance passes, including SSR fallback/skeleton. Preserve Masonic item/ref identity. Start at existing two-column cap; enable the approved third column only after verifying width/order/reflow.

**Acceptance:** initial/append/reverse-scroll context matches a mounted card in the **visible feed band**; header-obscured/evicted cards cannot win; append never resets era; view changes reinterpret the same year without filtering/resetting cards; filters still reach existing queries; new header cannot overlap nav/actions; sidebar remains visible desktop; compact mode works at 320 px and short heights; strips never trigger fetch, navigate or move document scroll; no duplicate SSR/enhanced card trees; Masonic DOM remains bounded.

**Validation:** common checks plus real-shell browser fixture; compare scroll anchor ID/offset before/after append and width change with actual variable-height cards; validate initial SSR-to-Masonic swap and resize through every threshold. Exercise all 18 view options, themed/default/one-bound/both-bound/date-descending cases. Confirm sidebar/map respond through existing context, not independent state. Browser tracing should show at most one scheduled era calculation per animation frame, not a new fetch on every frame.

**Rollback:** revert geometry/visibility-band/column changes as one coherent unit; retain independently reviewed token styles. Never roll back header dimensions while leaving tracker offsets from the new layout. If three columns fail, revert only to two while retaining the approved shell.

## Phase 4 — Article cards, map/article dialogs and overlay lifecycle

**Depends on:** Phase 3 and D7. **Risk:** high (image measurement, nested focus/locking, shared cards). **Review result:** visual masonry and detail experience, with a reliable reusable overlay primitive.

**Affected:** `src/features/timeline/components/{AnimatedCard,TimelineCard,TimelineModal}.tsx`; `src/components/cards/{CardContainer,CardHeader,CardDescriptions,CardSubjects,CardFooter}.tsx`; `src/components/modal/{ModalShell,ModalHeader,ModalDescription,ModalActions,ModalCloseButton}.tsx`; `src/components/map/{MapModal,WorldMap}.tsx`; optional small `src/components/modal/useOverlayLifecycle.ts` and shared media presentation component; `utils/animatedCache.tsx` only if entrance-motion behavior needs adjustment.

**Work:** recompose cards into image/text editorial units with natural height; reserve media stages without inventing dimensions; preserve source/loading policy, descriptions, tags/date/locale/significance/likes. Make open affordances keyboard-operable without nested buttons or transformed measurement boxes. Restyle modal content and preserve all actions/credits/links. Implement topmost dialog focus/Escape/inertness/lock coordination, including map → cached article nesting and a fallback when the virtualized opener is gone. Preserve current map cache lookup and safe text tooltips; make existing information/actions keyboard-accessible.

**Acceptance:** landscape/portrait/square/low-resolution/absent/slow/failed images do not break measurement; long title and short/long description cards remain variable-height; no deliberate crop of important content; like clicks never open a modal; authenticated and anonymous like behavior preserved; admin-only Delete and Suggest Edit still use existing hooks/guards; dialog dismissal by Escape/backdrop/close returns focus and original feed position; nested article close leaves map open and background locked; all modal source/author links remain; profile/review shared-card use is not given new click behavior accidentally.

**Validation:** common checks/full node regressions; real browser masonry reflow/append under delayed image decoding; keyboard-only full modal path; screen-reader dialog naming and focus check; nested map/article test; modal after post deletion/cache invalidation; shared card smoke tests on profile/review; reduced motion and mobile safe-area/keyboard checks.

**Rollback:** card visual changes can revert separately from a validated overlay accessibility fix. Overlay lifecycle changes must revert as a unit across article/map callers. Keep backend mutation and invalidation code unchanged throughout.

## Phase 5 — Desktop filter toolbar and consolidated mobile controls

**Depends on:** Phases 2–4. **Risk:** high (multiple state writers, history and debounce). **Review result:** replacement controls are complete before floating controls are retired.

**Affected:** `src/features/timeline/components/TimelineLayout.tsx`; `src/components/ui/UtilityMenu.tsx`; `src/components/drawer/{Drawer,DrawerCollapse,DrawerCheckbox,DrawerInput,SavedFilters}.tsx`; `src/components/drawer/useDrawerYearInputs.ts`, `drawerFilterHelpers.ts`; proposed `src/features/filter/components/{TimelineToolbar,FilterFields,FilterPopover,ActiveFilters}.tsx`; shared search controller. `FilterContext.tsx`, serializer, saved-filter mutation hooks and option definitions remain semantic contracts.

**Work:** extract shared fields that render current URL filter values; use desktop checkbox popovers and single theme selector, date panel and Saved section. Move search/sort/share/create/reset into the new toolbar while retaining their action logic. Use a shared mobile drawer with explicit Close and the overlay primitive. Keep one search/date controller; make closing a date-edit surface explicitly cancel/reset uncommitted drafts consistent with current drawer unmount behavior, and verify reopen state. A breakpoint change must not mount two timers or replay a stale draft. Chips/counts derive from the filter, never store copies.

**Acceptance:** two+ selections within each array and combinations across categories reach the same query; immediate commit and replace-history behavior unchanged; theme uses pathname; malformed/partial/negative/reversed dates do not send invalid commits; clear retains perspective while full reset returns global; both saved apply modes, rename/delete/three-save limit and auth gating retained; pending search/date edits cannot overwrite navigation; share includes view and unrelated URL handling matches existing serializer; mobile controls expose every desktop capability; Close/Done does not imply rollback.

**Validation:** common checks/full state regression; focused serializer/search/date/navigation tests; browser tests with combined multiselects, clear, saved apply-with/without-view, back/forward, direct URL load, sort both ways, clipboard success/failure and account switching. Assert no extra applied filter object/store, no duplicate controller and no unexpected loader/query semantics change. Keyboard/tab/Escape/outside-click, narrow toolbar wrapping and overlay focus tests.

**Rollback:** restore UtilityMenu/Drawer presentation and keep the same URL state. Revert new field ownership and timer lifecycle together if races appear. Do not change query keys or invalidate caches to mask a control bug.

## Phase 6 — Responsive integration and timeline motion refinement

**Depends on:** Phases 3–5; D8. **Risk:** medium/high (layout transitions and viewport behavior). **Review result:** coherent timeline at every target size, with restrained motion.

**Affected:** scoped `src/index.css`; timeline header/layout/strip/context/card/toolbar; `src/hooks/useCountUp.tsx`; map D3 transition code; relevant Framer consumers in Nav, UtilityMenu replacement, Drawer, Timeline, AnimatedCard, TimelineHeader/Stats, ModalShell, CardFooter and WorldMap.

**Work:** refine mobile/tablet context and controls, era-strip overflow, column thresholds and short-height mode using real data. Preserve providers/query pages through resize. Replace timeline count tween/typewriter/hover layout motion with CSS or immediate actual values. Keep map transitions only where useful, with reduced-motion bypass. Remove unused timeline animation helpers only after checking other consumers; retain Framer package for secondary routes still using it.

**Acceptance:** 320/390/480/768/1024/1280/1536/1920 widths and short landscape work without page overflow, focus occlusion, duplicate timers or nested scroll traps; safe areas and software keyboard do not hide close/search actions; resize/zoom preserves usable position and correct era; no card-height animation, header-size oscillation or uncontrolled strip auto-scroll; reduced-motion makes dates truthful immediately and disables decorative effects. No count/era label from animation can lag into misleading context.

**Validation:** common checks plus screenshot comparisons to the spec, browser performance trace on a fixed synthetic dataset, bundle comparison for migrated chunks, real touch-device testing where available. Record unavailable device/browser coverage honestly. No arbitrary performance claim from desktop synthetic tests alone.

**Rollback:** revert motion replacements per component and breakpoint changes as their own reviewable commit; retain working desktop shell and state pipeline. No dependency removal in this phase if any consumer remains.

## Phase 7a — Authentication, recovery, legal and error surfaces

**Depends on:** Phase 1 primitives and Phase 6 motion policy. **Risk:** medium. **Review result:** secondary reading/form pages match the system.

**Affected:** `frontend/app/routes/{login,register,forgot-password,reset-password,verify,terms,privacy,cookies,not-found}.tsx`; `src/pages/Error.tsx`; `src/components/ui/PageContainer.tsx`; `src/context/ToastContext.tsx`. Preserve `RequireAuth`, schemas and auth hooks.

**Work:** apply form/reading variants, visible labels/error relationships, heading hierarchy and status surfaces; adapt existing legal TOCs with shared anchor offsets; migrate remaining animations in these files. Preserve all legal text/URLs/IDs and auth redirect timers/return-state semantics.

**Acceptance/validation:** common checks; login invalid/valid/pending/from path; register mismatch/duplicate/consent; forgot success/failure; reset missing/expired/valid token; verify prompt/resend/invalid/success/no-refresh-cookie; server refresh/account-switch smoke test using local fixtures. Legal content/anchor/link comparison and keyboard/200% zoom checks. Toasts announce outcomes without stealing focus; uncertainty messaging remains.

**Rollback:** revert route family independently; shared primitives keep backwards-compatible props so completed timeline/home remain unaffected.

## Phase 7b — Create and suggested-edit forms

**Depends on:** Phase 7a form conventions. **Risk:** medium/high (validation and payload preservation). **Review result:** comprehensible long-form contribution flow without business changes.

**Affected:** `src/pages/{CreateArticle,Edit}.tsx`; `src/features/form/components/{PostForm,TextInput,NumberInput,SelectInput,UrlInput,FieldLabel,FieldHelp}.tsx`; corresponding article route wrappers only for layout. `useFormReducer`, schemas and mutation hooks remain unchanged unless a strictly presentational prop adapter is needed.

**Work:** organize existing controls into summary/classification/dates/sources sections, retain one form and all fields, stack date inputs on narrow screens and link inline feedback to controls. Keep server form-list failure/retry and pending submissions. No wizard/autosave/new fields.

**Acceptance/validation:** common checks/full node significance and validation suites; anonymous/unverified/verified route guards; exact unchanged valid payload; optional group null; unknown date zeros and BCE; retained start/end significance; subjects/country/theme selections; errors retain input; create/edit pending review outcome and home redirect. Test long labels/source URLs at 320 px and keyboard submit behavior.

**Rollback:** revert field/layout changes without touching reducer/schema/payload. Keep reviewed primitive improvements where compatible.

## Phase 7c — Profiles and moderation

**Depends on:** Phase 7b and shared card primitives. **Risk:** medium/high (shared layout, role visibility and action state). **Review result:** consistent account/review compositions with all existing data/actions.

**Affected:** `frontend/app/routes/user.$id.tsx`; `src/features/user/components/{UserHeader,UserStats,UserTimeline}.tsx`; `src/pages/Review.tsx`; `src/features/review/components/*`; `src/components/ui/{TabbedTimeline,TimelineTabs}.tsx`; `src/features/stats/components/{StatsContainer,StatCard,StatsBlock}.tsx`. Keep profile loader/query keys, review hooks/diff calculations and role guards.

**Work:** replace legacy fixed profile/review compositions with explicit account/moderation variants; real stats, grid/tab content and readable diff rows. Preserve title/date/verification, all image/source/change fields and action grouping. Improve tab semantics/keyboard behavior and remaining motion, including StatCard and TabbedTimeline. Do not reuse timeline era context or virtualized feed hooks on these routes.

**Acceptance/validation:** common checks/full node suites; profile first SSR render and not-found behavior; Created/Liked tabs/counts, viewer cache separation and likes; no accidental introduction of profile-modal navigation. Moderator/admin access vs denied USER/anonymous; edits and created suggestions, zero/null significance diffs, changed image metadata, per-row pending/error and approve/reject outcomes; refreshed totals and stale suggestion errors. Test narrow and wide review rows with long content.

**Rollback:** revert profile/review variants independently from timeline shell; retain compatibility containers until final migration passes. No cache/invalidation changes are needed for visual rollback.

## Phase 8 — Final regression, accessibility and optional dependency cleanup

**Depends on:** all approved presentation phases. **Risk:** medium. **Review result:** documented release candidate, not automatic deployment.

**Affected:** existing tests/browser fixtures as required; design documents updated with actual deviations/results; `frontend/package.json` and lockfile **only** for the separately reviewable Framer removal after a zero-consumer search. No new packages. Do not remove unrelated D3 dependencies or sweep unused files opportunistically.

**Work:** audit remaining `framer-motion` imports across app/src; if zero and CSS/lifecycle replacements are verified, remove dependency using the existing package manager and inspect lockfile diff for unrelated churn. Rebuild and run relevant regression once after removal. If any consumer remains, defer removal and state why. Compare chunks/performance before claiming benefit. Run final route/role/responsive/keyboard/image/error matrix; audit hard-coded colors and legacy shell aliases and remove only migrated aliases safely.

**Acceptance:** all functional routes and homepage ledger pass; no backend/GraphQL/schema/query/cursor/cache/auth drift; no known redesign regression; actual accessibility/visual checks recorded; build/type/lint status accurately separates prior failures; test coverage gaps and approved deviations documented. Approval to implement is not approval to deploy.

**Rollback:** dependency cleanup is a separate commit and can revert without losing completed CSS redesign. Revert any phase that fails its behavioral gate rather than patching backend contracts to accommodate UI assumptions.

## Cross-phase regression matrix

| Area | Required cases | Evidence / owning phases |
| --- | --- | --- |
| SSR/loading | Anonymous loader data; authenticated re-fetch; only one mounted grid; delayed loader; route error vs query error | SSR markup + browser console/network, P2/P3/P8 |
| Infinite pagination | Initial page, several appends, no duplicate concurrent fetch, final empty cursor page, next-page error/retry | Existing/extended browser fixture and local integration, P3–P6/P8 |
| Masonry/context | Variable descriptions/media, resize, reverse scroll, evicted refs, append with stable era, visible band below header | Real-shell synthetic fixture with IDs/rectangles and screenshots, P3/P4/P6 |
| Filters/search | Combined arrays; theme + q + dates; sort; one-bound defaults; clear/reset; long/Unicode queries; debounce races | Focused controller tests and real API-variable inspection, P2/P5 |
| Geography/eras | All views, global, existing theme/date links, boundary years, share v import, ordinary vs include-view save apply | Browser + context comparison; strip has zero navigation handlers, P3/P5 |
| History/continuity | URL back/forward, pending draft cancellation, modal close, resize, return from form/profile; distinguish existing restoration limits | Before/after visible-post/scroll traces; no invented full history guarantee, P2–P6/P8 |
| Context/map | Population/significance current vs placeholder, missing/error, dots, tooltip text, cached/missing article, nested map dialog | Existing safe-text test + browser keyboard/pointing tests, P3/P4 |
| Permissions/actions | Anonymous, unverified user, verified USER, MODERATOR, ADMIN; like, suggest, delete, review visibility/actions | Existing node suites + disposable local browser, P1/P4/P7/P8 |
| Responsive/a11y | All widths, short landscape, 200% zoom/reflow, Tab/Shift-Tab/Enter/Space/Escape, reduced motion, real touch | Manual record/screenshots; test harness where suitable, every UI phase |
| Forms/legal/content | Home full copy/link ledger; validation and unchanged payloads; timers/return paths; legal anchors/text | Content diff + node behavior tests + browser, P2/P7 |
| Performance | Bounded mounted-card count, same page policy, no header/masonry reflow animation; slow media | Reproducible fixture before/after and trace; no made-up pass threshold, P3/P4/P6/P8 |

For each review, supply a compact evidence record: revision, viewport/data/auth setup, command results, screenshots, behavioral cases passed/failed/not run, remaining baseline issues and deviations. A visually close screenshot or successful build alone cannot close the phase.

## Planning deliverable verification

This pass delivers only `docs/redesign/architecture.md`, `docs/redesign/design-spec.md` and this plan. Application code, backend, manifests and lockfiles are unchanged. Documents were checked for internal consistency, referenced paths and planning-only scope; runtime validation is explicitly deferred until an implementation phase is approved.
