# TL;DR History: existing architecture and redesign boundaries

Planning audit: 11 October 2026. Status: proposed; no application implementation authorized by this document. Read alongside [design-spec.md](design-spec.md) and [implementation-plan.md](implementation-plan.md). Repository paths below are relative to the repository root.

## Audit basis

Inspected `frontend/AGENTS.md`, the route tree, frontend feature/shared components, styles, contexts, fetching and mutation hooks, schemas, map, masonry and browser fixtures. Inspected backend timeline/stat resolvers, filter validation and cursor construction only to establish contracts. Reviewed all four PNG references in `frontend/resources` after they were supplied.

This is a source audit and visual-reference review, not a fresh runtime certification. No dependency installation, application/backend edits, builds, browser runs or database operations were performed. Existing dependencies and build output are present. A concrete environment mismatch was found: `frontend/package.json` declares `@react-router/dev` 7.18.4, while its installed `node_modules` package reports 7.14.1. Do not assume that an existing build represents the declared dependency set. Historical test results in `docs/audit/remediation.md` are evidence of available coverage, not results from this planning pass. The user's modified `frontend/AGENTS.md` and newly supplied `frontend/resources/` are pre-existing inputs and must remain untouched.

Several descriptions in the instructions/README differ from the current code:

| Assumption to avoid | Actual implementation |
| --- | --- |
| Separate infinite feed scroll container | Window/document scrolling; fixed header and context surfaces make the content appear independently scrollable. |
| Intersection Observer controls era changes | `useEraTracker.tsx` uses window scroll/resize, requestAnimationFrame and mounted-card rectangles. No IntersectionObserver found in frontend source. |
| Floating UI drawer | `Drawer.tsx` uses React portals and Framer Motion; no Floating UI dependency in `frontend/package.json`. |
| Filter draft with Apply/Cancel | Checkbox/theme selections apply immediately. Search and year inputs have local drafts and 300 ms debounce. |
| Region selector filters articles | Era `view` changes the historical range interpretation; `filter.continent` independently changes fetched articles. |
| Era jump navigation already exists | `EraContext.setEra` exists, but has no UI callers. It clamps the context year; it does not scroll or fetch an era. Theme/date URLs are existing ways to explore a period. |
| Historic territorial map | Modern-country geometry and centroid dots, not civilisation borders or migration paths. |
| Profile article cards open a modal | Main timeline cards do; `UserTimeline` renders bare `TimelineCard` without an opening handler. Preserve this distinction unless separately approved. |

## Framework, rendering and shared shell

- `frontend/package.json`: React 19, React Router 7 framework mode, TypeScript, Vite, Tailwind 4, DaisyUI 5, TanStack Query 5, Axios, Zod, Masonic 4, Framer Motion 12, D3/TopoJSON and `react-icons`. Keep the current styling/icon stack.
- `frontend/app/routes.tsx` defines the actual routes. `app/root.tsx` supplies document metadata/scripts, a request-local QueryClient on the server and shared browser QueryClient, then ToastProvider and AuthProvider. `src/pages/RootLayout.tsx` renders global Background, Nav and Outlet. `app/routes/app-layout.tsx` supplies the shared route error boundary.
- `react-router.config.ts` enables SSR and prerenders static paths plus known timeline theme slugs. `DISABLE_PRERENDER=true` skips prerendering for API-independent builds. `vite.config.ts` configures React Router, Tailwind and API proxies. Do not migrate this to a client-only SPA.
- `src/index.css` has a small brown/gold token set, DaisyUI base overrides, `xs: 30rem`, repeated header-height variables and globally hidden scrollbars. Numerous components still hard-code stone colors, gradients and sizing. No coherent light-surface token mapping or reduced-motion policy exists.
- `Nav.tsx` is a fixed, mostly pointer-transparent logo/account overlay, not a full navigation bar. It shares `z-40` with the fixed page header. Its image path `/tldr-history-logo-512.svg` does not match the supplied `public/tldr-history-logo.svg` (429 × 88). The replacement should use the real wide wordmark without changing SEO icons/manifest.
- `PageContainer.tsx` centers all children vertically/horizontally, clips horizontal overflow and fades in. This one layout is used for discovery, forms and legal pages despite their differing needs. `HeaderContainer.tsx` and `StatsContainer.tsx` are shared by timeline, profile and moderation; changing their geometry globally can break all three.

## Complete route inventory

All route files in this table are under `frontend/app/routes/`.

| URL / route file | Layout family | Existing behavior to preserve |
| --- | --- | --- |
| `/` — `home.tsx` | Discovery | Static editorial entry points, all copy and links; no search currently. |
| `/timeline` — `timeline.tsx`, `timeline.index.tsx` | Discovery/feed | Era/filter providers, anonymous SSR first page, enhanced masonry, search/filter/share/sort/create controls, context/map/modals. |
| `/timeline/:groupSlug` — `timeline.$groupSlug.tsx` | Themed discovery/feed | Same providers/layout/query pipeline; slug maps to one group; invalid slugs throw 404; theme-specific metadata. |
| `/login` — `login.tsx` | Account form | Zod validation, pending/error state, authentication, `location.state.from` return path, forgot-password link. |
| `/register` — `register.tsx` | Account form | Username/email/password/confirmation, required terms/privacy checkbox, duplicate feedback, login after registration and timeline redirect. |
| `/forgot-password` — `forgot-password.tsx` | Account recovery | Email validation, success/error, 3-second timeline redirect and login action. |
| `/reset-password` — `reset-password.tsx` | Account recovery | Token query parameter, missing/invalid/success states, confirmation validation, 2-second redirect. |
| `/verify` — `verify.tsx` | Account verification | Token, prompt/verifying/success/invalid states, resend, session refresh, return path and 1.5-second success redirect. |
| `/user/:id` — `user.$id.tsx` | Account/profile | Positive numeric ID loader, initial stats hydration, verified indicator, member date, Created/Liked tabs, real contribution/favorite stats. Public profile; not a private settings route. |
| `/articles` — `articles.tsx` | Form parent | Outlet only, no index child or article catalogue. Do not invent a new index page. |
| `/articles/create` — `articles.create.tsx` | Contribution form | `RequireAuth requireVerified`; creates a pending suggestion and returns home with toast. |
| `/articles/edit/:id` — `articles.edit.$id.tsx` | Suggested-edit form | Same verified guard; loads post/form lists, submits suggestion, preserves original significance values, returns home. Not direct publication. |
| `/review-suggestions` — `review-suggestions.tsx` | Moderation | ADMIN/MODERATOR guard; Edits/Created tabs; diffs, image metadata, approval/rejection, counts and errors. |
| `/terms`, `/privacy`, `/cookies` — corresponding `.tsx` files | Legal | Long static content, existing tables of contents, section IDs, internal/external/mail links and dates. Presentation only; no legal-copy rewrite. |
| `*` — `not-found.tsx`; `app-layout.tsx` boundary | Error | `src/pages/Error.tsx` shows error/status and Go Home; preserve route metadata and loader errors. |
| Article/map overlays — no route | Detail/modal | Local open state, backdrop/Escape dismissal; no article URL, modal history entry or article deep link was found. |

## Timeline data flow and state ownership

```text
URL pathname + t/s/c/ys/ye/q/o
  -> buildTimelineFilterFromUrl -> timelineLoader -> anonymous first page
  -> TimelineFilterProvider -> normalized filter
       -> useTimeline -> timelineInfiniteQueryOptions -> TIMELINE_QUERY
       -> TimelineHeader / TimelineStats / filters / search
posts -> static SSR cards -> Masonic mounted cards + stable refs
  -> useEraTracker (window scroll/resize + masonry onRender)
  -> EraProvider.dataStartYear
EraProvider.view + dataStartYear -> RANGE_SETS -> era label/range/headline
  -> header + sidebar queries + WorldMap active dots
```

| State | Authoritative owner | Consumers / restrictions |
| --- | --- | --- |
| Applied article filter | URL, decoded by `src/context/FilterContext.tsx` | Loader, query, controls, stats. New toolbar must call existing `patchFilter`/`resetFilter`, not create a second applied filter. |
| Search draft | Currently `src/components/ui/UtilityMenu.tsx` | Keyed to router location key; navigation replaces draft and cancels pending debounce. Extract once for reuse. |
| Date drafts | `src/components/drawer/useDrawerYearInputs.ts` | Signed integer input, bounds -300000..2025, invalid/reversed pairs not committed, 300 ms debounce. |
| Chronological position and contextual region | `src/context/EraContext.tsx` | One `dataStartYear` and one `view`; era fields derived, never separately selected by the strip/header/sidebar. |
| Server pages and viewer-specific likes | TanStack Query | Query key `["timeline", "list", filter ?? null, viewerKey]`; do not change shape, cursor or viewer isolation. |
| Article/map open state | `Timeline.tsx`, `TimelineStats.tsx`, `WorldMap.tsx` | Local presentation state; keep article modal refreshed from current posts when possible. |
| Authentication | `AuthContext.tsx`, `lib/authSession.ts`, `lib/api.ts` | Token/refresh coordination and cache clearing on viewer change/logout. No new auth store. |
| Form and moderation state | `useFormReducer`, route form state, Query mutations, local tab/action IDs | Preserve payloads, validation and mutation outcomes while recomposing fields. |

### URL, filters and search

`features/filter/components/TimelineFilter.tsx` defaults: empty type/subject/continent arrays, group 0, years -300000..2025, ascending `sortBy: true`, no search. `timelineFilterParams.ts` owns `t`, `s`, `c` comma-separated arrays; `ys`, `ye` signed years; `q` search; `o=asc|desc`. Group comes from the pathname through `utils/groupLookup.ts`, not a second group query parameter. Serialization preserves unrelated query parameters; full reset intentionally navigates to `/timeline` with no query. Updates normally replace browser history rather than push.

`Drawer.tsx` reads the applied filter directly. Types, subjects and continents are genuine multiselects. Theme is one numeric group, not a multiselect supported by the backend. `utils/drawerValues.ts` supplies theme metadata and all filter options. Closing the drawer does not roll back selections. Date strings are the only drawer drafts.

`UtilityMenu.tsx` trims search after 300 ms and patches the same filter. Its draft is synchronized on location-key changes, preventing a pending edit from overwriting saved-filter/reset/back navigation. Sort is immediate; share serializes filter plus optional `v`; create links to the guarded route. Utility Reset also sets era view to global. Drawer Clear Filters resets filters/date drafts but leaves era view unchanged. `hasActiveState` ignores sort-only and view-only changes; badge count excludes search and sort. Record these differences rather than silently standardizing them.

`SavedFilters.tsx` and `features/filter/hooks/useSavedFilter*.tsx` preserve server-backed create/rename/delete/apply, maximum three saves and 50-character names. Ordinary apply changes filter only; the separate apply-with-view action changes view as well. Saved matching currently ignores view and is array-order-sensitive. Query cache is user-keyed and authenticated-only. These are existing semantics, not redesign opportunities.

Search is backend case-insensitive substring matching across name/startDescription/endDescription, not ranked full-text search. Arrays are OR within a category and categories are ANDed. Date filtering includes starts in range OR ends in range with endSignificance > 0.5; it is not arbitrary interval-overlap search. Sources: `backend/src/utils/filters/queryFilters.ts`, `backend/src/validators/filterSchema.ts`. Backend search limit is 100 characters; frontend currently permits longer text and reports API failure. Do not silently invent autocomplete, suggestions, fuzzy matching or a new limit policy.

### Era context and geographic interpretation

`EraContext` initializes year -300000 and view global. On first mount it consumes valid `v`, changes view, then removes `v` using `history.replaceState`. It does not continuously synchronize view from URL. `setView` changes range definitions without filtering the feed. Share and saved filters carry view explicitly. Preserve this distinction and document that back/forward restores URL filters, not a fully persisted context-view history.

`utils/rangeViews.ts` exposes global plus 17 regional range sets: East Asia, Islamic World, Mediterranean, Iranian Plateau, West Africa, Sub-Saharan Africa, North America, Mesoamerica, Andean Americas, Oceania, South Asia, Steppe, Europe, Southeast Asia, Arctic, Japan and United Kingdom. `historicalRanges.ts` supplies real labels, boundaries, headlines and icons. Adjacent endpoints are inclusive and `findIndex` picks the first match; unmatched years fall back to index zero. Do not rewrite era boundaries in a presentation change.

`TimelineHeader.tsx` title uses theme label when grouped, otherwise current era. Date precedence is currently: explicit range only when **both** bounds differ from defaults; otherwise theme fallback years; otherwise era range. Sort reverses displayed endpoints. Subheadline favors era headline over theme fallback. Separate the filter span, theme title and observed current year visually without changing these rules silently.

### Masonry, loading and scroll coupling

`features/timeline/components/Timeline.tsx` renders static CSS columns during SSR and first hydration, then mounts **one** Masonic Masonry after effect. Defaults: 350 px target column width, 24 px gutter, at most two columns, 400 px estimated item height. Filter JSON keys the masonry instance; post ID keys each item. Refs are stored by ID and pruned when posts leave the dataset. Masonic `onRender` invokes both infinite-loader range checks and era updates. Keep ref forwarding and `data-post-id`/`data-start-year` instrumentation through any new card wrappers.

`useInfiniteLoader` has threshold 10. `loadMore` checks has-next-page, no in-flight next-page request, and no error. Query pages are flattened in response order. Next-page failure preserves cards and exposes Retry; initial loading/empty/error and appending spinner are separate states. `timelineLoader` does a real anonymous first-page request; a loader failure reaches the route error boundary, whereas later query failure reaches the timeline alert.

`useTimeline` uses anonymous initial data only when filters match exactly. Placeholder pages are retained only for the same filter and same viewer or anonymous-to-authenticated transition. Stale time is 30 seconds; authenticated mounts refetch. Preserve this and authentication cache clearing.

Backend `schema/resolvers/query/timeline.ts` fetches 15 posts ordered by startYear/startMonth/startDay/id in the chosen direction. Cursor encodes that tuple using `utils/cursor.ts`. Every nonempty page supplies a cursor; an additional empty request may be needed to discover the end. Never infer completion from a short page or invent a total count.

`useEraTracker` scans posts in data order, ignores unmounted/zero-height/offscreen elements, chooses the first mounted card whose top is in the viewport, otherwise a card crossing the top edge. It only writes changed years; appending pages must not reset context to an evicted first card. Its viewport starts at 0, so cards hidden behind a fixed header currently qualify. A taller redesign must adapt this one tracker to the actual unobscured feed band, not add another observer in the header.

Current layout: `TimelineLayout` pads around a fixed header (128 px mobile, 5.8 rem at sm, 7.6 rem at md, 8 rem at lg); fixed right sidebar starts at sm/640 px with widths min(34vw,420px), min(32vw,440px), min(30vw,460px). Below sm it becomes a 6.5 rem bottom stats bar. Floating utility controls and bottom padding compensate separately. The shell does not constrain a feed to `overflow-y:auto`.

`ScrollManager.tsx` sets browser restoration to manual and scrolls to top on initial mount only. No per-filter/per-route scroll-position store exists. Modal body locking and responsive remeasurement therefore need runtime baselines; do not promise native history restoration that is currently disabled.

### Context sidebar and map

`TimelineStats.tsx` queries population by era start and significant/civilisation data by era start/end plus filter. Hooks in `features/stats/hooks/useStats.tsx` cache for 30 minutes and retain previous data during changes. Population is a global estimate, even with a regional era view. Most Significant is selected by significance, not likes/popularity/views. `getPopulation` can return zero for unavailable backend data; do not label this as a verified historical zero without a separate data-policy decision.

Civilisations are deduplicated by cleaned name. `WorldMap.tsx` further checks startYear <= observed year <= endYear, groups by country name, uses the bundled modern-country `world-110m.json`, Natural Earth projection, centroid dots, group colors and significance/count-driven radii. The renderer excludes endYear=0 at positive years even though the backend treats zero as open-ended. Country-name mismatches can omit dots. Preserve these known limitations; no new polygon/history model.

Small-map click opens `MapModal`. Interactive dots open the first matching civilisation article **only if a full post is already in a timeline query cache**; no post fetch is performed. Tooltip content is inserted with D3 `.text()`, an existing security regression safeguard. Map transitions are D3, independent of Framer. A nested article modal can coexist with the map modal.

## Cards, dialogs and images

`AnimatedCard.tsx` owns click-to-open and forwards measured refs/width; global `utils/animatedCache.tsx` remembers fade-in by ID. Hover currently scales/translates measured cards. `TimelineCard` composes `CardContainer`, `CardHeader`, `CardDescriptions`, `CardSubjects` and `CardFooter`; significance==1 gets a highlighted border. Dates/country, descriptions, subjects and likes are real content and must survive layout changes.

Images prefer `https://cdn.tldrhistory.xyz/${cdnId}`, then imageUrl. Cards use eager, small floated images; modal header uses lazy images and credits/source links. No intrinsic width/height/aspect-ratio fields exist in the current timeline query/model, and no card onError fallback is implemented. Do not propose relying on nonexistent dimensions or changing backend fields. Preserve source selection and loading policy; reserve presentation space without imposing equal total card heights.

`CardFooter` stops click propagation, redirects anonymous likes to login, disables pending mutations, applies returned counts and invalidates timeline/profile caches. `TimelineModal` preserves descriptions, metadata, credit/source link, author profile link, like, Suggest Edit and ADMIN-only Delete through `useDeletePost`. No full article route or bookmarks are supported.

`ModalShell` portals to body, locks body overflow and handles Escape/backdrop. It currently lacks dialog role/name, focus trap, focus return and coordinated nested locking. Each shell independently clears body overflow and listens for Escape, so nested map/article closure is fragile. Drawer lacks these protections too and has no explicit close button. Accessibility improvements are presentation work, but require deliberate tests rather than assuming the current overlays are accessible.

## Secondary flows and motion

- `features/form/components/PostForm.tsx` and `useFormReducer.tsx`: one shared create/edit reducer, server-supplied countries/subjects/themes, Zod submission, date components and optional image/source/credit. Zero/unknown date sentinels, null theme and all validation limits must stay intact. Fetched post significance is deliberately merged in `pages/Edit.tsx`; do not expose or erase it accidentally.
- `features/user/components/*` uses `TabbedTimeline` (ordinary CSS grid, not virtual masonry) and user query hooks. Preserve SSR stats initialization and viewer-specific liked flags.
- `features/review/components/*` uses the same tab/grid wrapper, before/after diffs including explicit zero significance, suggested author, changed image metadata, pending row IDs and approval/rejection hooks. Keep mutation invalidation in `lib/invalidatePostQueries.ts`.
- `RequireAuth` retains loading, login return-path, verified-email and role gates. Nav visibility is not a substitute for these guards. No permission changes or auth refactor are needed.
- Framer consumers: Nav; UtilityMenu (layout/width/spring/count); Drawer; Timeline/AnimatedCard; TimelineHeader and TimelineStats; ModalShell; WorldMap modal presence; CardFooter; PageContainer; TabbedTimeline; StatCard; ToastContext; forgot/reset/verify routes; `hooks/useCountUp.tsx` (one-second number tween and character-by-character text swap).
- CSS transitions appear throughout buttons, links, legal TOCs, forms and homepage hover translation; DaisyUI supplies spinners/loaders. D3 map dots/tooltip animate 200–300 ms. All need the same reduced-motion policy. Framer is broadly imported but no indispensable gesture/physics product capability was found; replacing these effects with CSS is feasible, not yet a measured performance result.

## Fragile dependencies and unresolved baseline issues

| ID | Risk / existing limitation | Required handling |
| --- | --- | --- |
| R1 | Window/Masonic measurement/era coupling; header occlusion; filter-key remount | Keep window root; one tracker; measure shared shell bounds; assert visible-year and anchor stability after append/resize. |
| R2 | Search/date debounce races against URL navigation and responsive remounts | One mounted controller; location-key cancellation; no parallel nav/toolbar query state. |
| R3 | Era view is not continent filtering or permanently URL-persisted | Label separately; preserve all options, share and two saved-apply behaviors. |
| R4 | Shared fixed shell also used by profile/review | Add explicit variants/compatibility geometry; migrate each route in its phase. |
| R5 | Nested dialogs unlock body/close together; keyboard gaps | Common overlay lifecycle, topmost Escape, focus stack and return fallback; test map → article → map. |
| R6 | Unknown image sizes; bigger media; SSR-to-masonry swap | Reserved media, natural card heights, real engine resize checks, slow/failing media and hydration tests. |
| R7 | Mockups imply unsupported totals, maps, popularity and navigation | Use only current fields/routes/editorial content; visual strip stays passive. |
| R8 | Previous stats can appear under a new era during fetch | Preserve caching; label updating/unavailable and suppress stale attribution without new cache semantics. |
| R9 | Restore behavior is incomplete today | Record append/modal/resize/history baselines; don't introduce storage/reset behavior as an incidental redesign. |
| R10 | Year ceiling frontend 2025 vs backend filter 2026; header one-bound range precedence; inclusive era boundaries | Document separately; keep contracts and existing values pending explicit follow-up approval. |
| R11 | Framer removal affects many routes and numerical displays | Stage CSS migrations; numbers update to actual values; uninstall only after no consumers remain and regression passes. |
| R12 | Existing compiler/lint diagnostics, installed/declared Router version mismatch and fixture coverage gaps | Verify the dependency baseline before implementation, report new vs old failures; never equate an old build with behavioral QA. No dependency installation in this planning pass. |

Other recorded limitations: source/credit visibility depends on an image in the modal; saved-filter matching ignores view; map cached-post lookup can miss; unknown route view uses the shared error component; create/edit SEO paths differ from actual routes. These are not automatic authorization for unrelated fixes.

## Available validation

`tests/README.md` documents node regression suites and isolated/live browser harnesses. `tests/*.test.cjs` cover significance, session/cache separation, validation, image safety, moderation recovery and client consistency. `timeline-browser.cjs` + `timeline-browser-fixture.tsx` run real Masonic, refs, era tracker, filters, cards, map and dialogs against synthetic pages; check bounded DOM, append, scroll/reverse, 1280/390 widths, sort, region, saved/reset/history, pending search, error/retry/empty. They do **not** mount the actual new header/sidebar shell or test real GraphQL filtering, keyboard focus, nested overlays, touch or all breakpoints.

`local-browser.cjs` and `local-integration.cjs` can test actual app/server/database integration using the disposable database procedure in `tests/README.md`. No production data should be needed. Extend the existing harness for real shell geometry and focused state regressions; no testing dependency is required by this plan.

The previous audit reports 47 passing node tests and successful client/SSR builds, with an unused parameter in `src/lib/cookies.ts` and broad existing lint failures. Re-measure before Phase 1; do not treat historical counts as current passes or expand this redesign into global lint cleanup.
