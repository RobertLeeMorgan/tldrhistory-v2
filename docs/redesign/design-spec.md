# TL;DR History redesign: design specification

Status: proposed for review, 11 October 2026. This specifies a substantial presentation redesign while retaining the contracts and state ownership in [architecture.md](architecture.md). Implementation order and approval gates are in [implementation-plan.md](implementation-plan.md). Paths are repository-relative; names marked **proposed** are future files, not existing implementations.

## Visual reference decisions

All four supplied images were visually inspected. They are references for hierarchy, composition and materials, not screenshots of supported functionality.

| Reference in `frontend/resources/` | Adopt | Adapt or omit |
| --- | --- | --- |
| `TL;DR History Interactive Timeline.png` | Dark cinematic homepage hero, strong serif heading, prominent search, cream discovery sections, illustrated editorial cards, dark closing invitation. | Retain actual homepage copy/sections/destinations. No fabricated 30,000/5,000/2,000 totals, popular-search ranking, new Places/Topics pages or chronological preview dataset. |
| `Classical Era Global History Timeline.png` | Larger persistent context header, line-and-marker era strip, left context column, filters immediately above feed, dark image/text cards. | No era-selection arrows, learn-about-era route, five tiny columns, result total, civilisation polygons, land-area estimate or list toggle. |
| `Classical Antiquity Timeline Dashboard.png` | Clearest model for current-era vs “you are here” year, quiet decorative map, mixed image/imageless masonry, restrained borders and gold hierarchy. | No bookmark action, view counts, popularity claim or invented civilisation total. Keep like actions. Use one dark card family initially; do not imply cream cards are a new content class. |
| `TL;DR History_ Roman Empire Timeline.png` | Themed title/breadcrumb treatment, large editorial heading, integrated strip, continuous sidebar/feed composition. | Theme is the existing group slug, not a new detail route. No Overview/Events/People/Places/Maps tabs, new Roman sub-era taxonomy, peak population, capital/language/rulers or territory data. No requirement for theme-specific hero art. |

The resulting application should read as a historical atlas: expressive serif headings, calm charcoal surfaces, warm ivory text and restrained gold accents. The homepage introduces the same navigation, typography and exploration controls that appear in the timeline. Forms and legal reading use cream surface variants. These are page surfaces within one design system, not switchable themes.

## Design tokens and shared primitives

Keep Tailwind and DaisyUI. Define semantic tokens in `frontend/src/index.css` using the current Tailwind 4 integration; map DaisyUI base/content/primary/error variables explicitly so system dark-mode behavior does not choose another theme. Temporarily alias old card/stats/drawer/gold tokens during migration. No new CSS framework or icon package.

Initial palette proposals (verify contrast in rendered states, including opacity/overlays):

| Role | Dark atlas | Cream reading surface |
| --- | --- | --- |
| Canvas | `#101719` | `#F5F0E7` |
| Surface | `#182124` | `#FFFCF7` |
| Raised surface | `#202B2E` | `#EEE6D8` |
| Primary text | `#F3EEE4` | `#242725` |
| Secondary text | `#B8BEB9` | `#555B56` |
| Accent text/focus | `#D6AD68` | `#765017` |
| Filled action | `#D6AD68` with `#151A1B` text | Same action pairing |
| Decorative divider | `#354044` | `#D4CCBE` |
| Control border | `#77837F` | `#7C8177` |
| Error / success text | `#FFB4AB` / `#A6D6B4` | `#9D2727` / `#27653C` |

Use `--color-canvas`, `--color-surface`, `--color-surface-raised`, `--color-content`, `--color-content-muted`, `--color-accent`, `--color-on-accent`, `--color-divider`, `--color-control-border`, `--color-focus`, and status tokens with a scoped cream-surface mapping. Decorative dividers are not the sole boundary for inputs or selected states. Avoid existing white-on-gold buttons and gold body copy on cream.

- Typography: system serif stack beginning Georgia for display/title; system sans-serif stack for body, controls and metadata. No font download required. Homepage H1 40–64 px, timeline title 30–44 px desktop/24–30 px mobile, section heading 26–36 px, card title 21–24 px, body 16 px/1.55, secondary labels 14 px. Date numerals tabular. Avoid all-caps long titles and animated typewriter headings. Font changes beyond these stacks need asset/licensing approval.
- Spacing: 4/8/12/16/24/32/48/64 px scale. Page gutters 16 mobile, 24 tablet, 32 desktop; content max-width approximately 1600 px for timeline and 1280 px discovery. Reading measure 65–75 characters; forms 448 px for auth, 768 px for contribution.
- Radius: 6 px inputs, 10 px cards, 16 px dialogs; pills for tags/compact actions only. One subtle elevation style; no heavy multi-gradient shadows on every component.
- Buttons/fields: minimum 44 × 44 px interaction targets, visible labels, disabled/pending states, focus ring with 2 px offset. Solid primary, outline secondary, quiet icon/text, and destructive variants. Preserve button/link semantics and submit types. Icon-only buttons have accessible names.
- `react-icons/lu` is the proposed family for new interface controls, already represented in the project. Existing historical `Gi` icons and semantic maps can remain; do not replace the entire icon system just for uniformity.
- Shared surfaces: Button, form labels/help/errors, search field, card/media, status message, dialog shell, navigation disclosure and page containers. Extend existing primitives where practical. Avoid a generic page-builder abstraction.
- Layer scale: content 0, persistent context 20, nav 30, anchored filter panels 40, modal backdrop/panel 60/61, nested dialog 70/71, status toasts 80. Portals must remain outside transformed/clipped parents; hidden background must not remain keyboard-operable.

## Global navigation and page shells

Rebuild `src/components/ui/Nav.tsx` as a horizontal navigation bar: the real `/tldr-history-logo.svg` wordmark, explicit Home and Timeline links, flexible space, and the existing account menu. Preserve logo destination `/timeline` and add explicit Home `/` for discoverability. Avoid fake disabled future links; flexible spacing and a reusable link list leave room for later routes. Keep existing Profile/Create Article/Review Suggestions/Login/Register/Terms/Privacy/Logout visibility and destinations; expose existing Cookies alongside legal links. Retain the timeline create action even when its route guard must direct a visitor to login/verification.

Mobile: compact wordmark, menu button and account trigger; menu reveals the same actual links, closes on navigation/Escape and returns focus. Authentication-loading state reserves account-trigger space. Do not render privileged links while auth is unresolved. Logout retains the existing auth action and timeline destination.

Search ownership deliberately differs from the mockups: the homepage hero contains one search field; the timeline has one search field in its content toolbar. Global Nav does not mount a second live timeline search above it. This keeps the context providers scoped to `/timeline` and prevents duplicate debounced writers. A later design may move that one field into a nav slot, but it must move the controller too, not clone it.

`RootLayout` becomes the common nav/content shell. `PageContainer` gains explicit discovery/form/reading variants instead of centering every route. Background art belongs to the homepage hero; timeline uses a quiet stable map/gradient; forms/legal use plain readable surfaces. Keep app/root providers, route boundaries, metadata, SSR and hydration intact. Adjust homepage hero preloading in `app/root.tsx` only when its actual rendered asset changes; leave manifest/favicon/OG icons to the user.

## Homepage composition and preservation ledger

`frontend/app/routes/home.tsx` remains the content authority. All existing text, including titles, years, blurbs, detailed time-slice copy, section introductions, eyebrows and CTA labels, remains available and visible. Reorganize layout, not editorial meaning. Some existing section intros read like internal design guidance; preserve them unless copy changes are separately approved.

1. Full-width cinematic hero using `src/assets/images/home/hero.png`, decorative overlay and unchanged main heading/body. Add the authorized shared timeline search entry. Keep both “Open the timeline” and “Start with the modern era” CTAs. Below/alongside it, an integrated “Start here” rail retains Egypt/Greece/Rome and their descriptions.
2. Cream “Featured paths / Good places to begin” section: six illustrated path cards, 3 columns desktop, 2 tablet and 1 narrow mobile. These remain editorial links, not server-ranked stories.
3. “Why this is different / See what was happening at the same time” becomes a broad introduction beside four illustrated time-slice rows. Each keeps both blurb and detail text. Use layout rhythm/imagery to communicate simultaneity; do not invent a new live timeline preview.
4. “Browse by lens / Start with a filter, not a blank slate”: four compact cards using consistent interface icons and existing filter URLs.
5. Three “Same-time fact” cards retain their complete text and period links. Text-first is appropriate without matching art.
6. Dark “Ready to explore” closing block retains heading/body and both CTAs. `explore.png` may be decorative artwork for this existing block. No mockup statistics strip.

Exact destination/asset ledger (paths under `frontend/src/assets/images/home/`):

| Existing item | Destination to preserve | Image |
| --- | --- | --- |
| Hero / closing timeline CTAs, comparison CTA | `/timeline` | `hero.png` / `explore.png` as decorative surfaces |
| Start with the modern era | `/timeline/modern-era` | No extra art required |
| Start here: Egypt / Greece / Rome | `/timeline/ancient-egypt`, `/timeline/ancient-greece`, `/timeline/ancient-rome` | Typography/icons; no unrelated substitute photos |
| Ancient China | `/timeline/ancient-china` | `ancientchina.jpg` |
| Pre-Columbian Americas | `/timeline/?c=NorthAmerica%2CSouthAmerica&ys=-3000&ye=1572` | `precolombia.jpg` |
| Black History | `/timeline/black-history` | `blackhistory.jpg` |
| Feminism | `/timeline/feminism` | `feminism.jpg` |
| WWII | `/timeline/wwii` | `wwii.jpg` |
| Medieval Europe | `/timeline/medieval-europe` | `medieval.jpg` |
| Explosive Eurasian Convergence | `/timeline?ys=1200&ye=1300` | `aurasian.jpg` (filename spelling retained) |
| The World Connects | `/timeline?ys=1490&ye=1530` | `worldconnects.jpg` |
| Simultaneous Intellectual Explosion | `/timeline?ys=-550&ye=-400` | `intellectualexplosion.jpg` |
| Parallel Superpowers | `/timeline?ys=70&ye=220` | `parallelsuperpowers.jpg` |
| Intellectual history | `/timeline?t=person,event&s=intellectual` | Existing icon family |
| Art and culture | `/timeline?t=person,event&s=art` | Existing icon family |
| Military history | `/timeline?t=landmark,event&s=military` | Existing icon family |
| Religion and belief | `/timeline?t=event,person&s=religion` | Existing icon family |
| Medieval Europe / Islamic Golden Age fact | `/timeline?ys=750&ye=1250` | No image required |
| Samurai / cowboys fact | `/timeline?ys=1800&ye=1900` | No image required |
| Oxford / Aztec fact | `/timeline?ys=1096&ye=1521` | No image required |
| Explore culture closing CTA | `/timeline?t=person,event&s=culture` | No extra art required |

Do not change the unusual existing Pre-Columbian trailing-slash URL incidentally; test its current route resolution. All image mappings are based on supplied descriptive filenames; verify actual crop/content when implementing, and use a text-first card if unsuitable or absent. No generated imagery, new remote imagery or mockup screenshots as background assets. Homepage asset dimensions can be read locally at implementation; reserve their aspect ratios, prioritize only the hero, lazy-load below-fold editorial images and retain legibility with all images blocked.

### Shared search transfer contract

Proposed `src/features/filter/components/TimelineSearchField.tsx` is a controlled accessible search form with a supplied value/change/submit interface. Proposed `features/filter/hooks/useTimelineSearch.ts` extracts the existing timeline draft/300 ms/location-key cancellation from UtilityMenu. It is mounted exactly once inside the timeline layout, independent of breakpoint placement.

The homepage has an ephemeral text draft only; it has no TimelineFilterProvider, QueryClient search query or result cache. Submit trims the text, builds `{ ...DEFAULT_TIMELINE_FILTER, search: value || undefined }`, serializes with `filterToSearchParams`, and navigates to `/timeline?q=...` using normal push navigation. Empty submission opens default `/timeline`. URLSearchParams handles spaces, ampersands and Unicode; never concatenate a raw query. Enter and the visible submit button have the same result.

On arrival, the existing loader decodes `q`, fetches anonymous first-page data, FilterContext reads the same URL, `useTimeline` uses the same key and initializes the toolbar from `filter.search`. The toolbar continues the existing 300 ms live-search behavior. No autocomplete, suggestion endpoints, client result filtering or separate “global search” engine. An explicit submit on the timeline can flush the same pending draft once, without changing its matching semantics.

## Timeline composition and geometry

Recompose `TimelineLayout`, `TimelineHeader` and `TimelineStats` as one desktop composition, with the context column on the **left** and cards on the right. Keep the document/window as the sole feed scroll root. The user sees cards moving beneath persistent navigation/context, preserving the current functional experience. Do not introduce an inner scrolling feed or replace Masonic.

```text
Desktop >= 1024 px
┌──────────────── Nav: wordmark / Home / Timeline / account ────────────────┐
│ Theme or current era + range/headline   │ observed year │ era perspective │
│ Passive era strip: range labels + dates, current segment emphasized       │
├──────────────────────┬───────────────────────────────────────────────────┤
│ Persistent context   │ Search + Type / Continent / Subject / Theme / Date │
│ Global population    │ Sort / Saved / Share / Create / reset + selections│
│ Most Significant     ├───────────────────────────────────────────────────┤
│ Existing dot map     │ Variable-height Masonic cards; window scroll      │
└──────────────────────┴───────────────────────────────────────────────────┘

Tablet/mobile
Nav → compact era/date/perspective → passive strip
Search + Filters + compact actions → one/two-column feed
Context disclosure opens an accessible stats/map surface
```

Initial size targets, subject to text/zoom testing: nav 64 px desktop/56 px mobile; desktop context header 136–160 px plus 56 px strip; mobile summary 72–88 px plus 44 px strip; toolbar approximately 56 px per row. Sidebar 256–288 px desktop with 24 px gutter. Use explicit scoped shell variants so profile/review can keep their previous header sizing until migrated.

One shell geometry owner measures actual nav/header/strip/toolbar bounds with ResizeObserver (proposed `features/timeline/hooks/useTimelineGeometry.ts`). It exposes layout measurements, not historical state. Use CSS variables such as `--nav-height`, `--timeline-context-height`, `--timeline-toolbar-height` and `--timeline-sidebar-width`. CSS fallback dimensions must make SSR readable before measurement. Header text should fit a stable reserved region; no height tween when year/headline changes.

The feed's usable top edge is the bottom of its occluding header/toolbar stack; bottom edge excludes any persistent mobile controls and safe area. Adapt the existing `useEraTracker` to this band. Preserve its data-order candidate priority and crossing-card fallback. Call the same scheduled update after shell resize and Masonic render. Do not add IntersectionObserver state, `selectedEra` state, a second header scroll listener or timer-driven context.

Keep geometry changes separate from query state. Changing view or opening a popover must not re-key masonry. Preserve post IDs, item order, page arrays, forwarded refs, Masonic width measurement and `onRender` loading callback. Avoid transforms/overflow clipping on masonry ancestors. On genuine viewport/breakpoint/header-size changes, test the same visible post and relative offset; if correction is needed, use one bounded anchor adjustment after layout, never continuous scroll compensation competing with user input or browser anchoring. Filtering already replaces a dataset; preserve its observed reset/continuity baseline rather than inventing a new reset policy.

History remains under the existing ScrollManager behavior unless a separately scoped restoration change is approved. Record back/forward URL/filter outcomes separately from pixel-position restoration. Add no sessionStorage restoration mechanism as part of layout work.

### Header and passive era strip

Header separates three meanings: title/theme; current contextual era and its range; “Timeline position” from `dataStartYear`. Explicit filter span remains visibly labeled as a filter rather than appearing to be the exact current scroll year. Reuse date formatters and existing theme/range precedence; retain actual era headline. Grouped timelines keep their group title and still display the observed era underneath. No hard-coded Roman/Classical dates or automatic updates to 2025 data bounds.

The selector is labeled “Era perspective” with supporting text that it changes contextual era names; the toolbar's “Continents” label identifies actual content filtering. Keep all `VIEW_OPTIONS`, including global. A generic world silhouette from existing map geometry or a subtle CSS gradient is decorative; it never changes to imply precise era/regional artwork.

Proposed `features/timeline/components/EraStrip.tsx` reads `RANGE_SETS[view]`, `eraIndex` and `dataStartYear`. Render ordered labels and date ranges with equal/minimum-width segments, not a linear-to-scale timeline that makes recent periods invisible. Visually indicate the current segment with line, dot, text and `aria-current="step"`; explain that segments are not to scale. It must have no click selection, era links, tabs, slider role, previous/next era buttons, query writes, `setEra` call or feed scrolling. No strip-specific selected state.

At narrow widths show current and nearby labels in a horizontally scrollable strip with readable minimum widths; retain access to every label. A focusable overflow region allows keyboard horizontal scrolling, but segment labels themselves are not buttons. On an observed-era change, optionally reveal the active label using only the strip element's horizontal offset; never `scrollIntoView` the page and never move keyboard focus. Reduced motion uses an immediate horizontal adjustment. Changes to position should not make screen readers announce every scroll frame.

The instruction to verify “navigating to eras” applies to existing homepage theme/date links and filter changes: no working feed-jump control exists to preserve. A clickable era strip/jump feature is explicitly outside this redesign.

### Context sidebar

Show “Context” plus the actual observed date, a **global** estimated-population block for the current contextual era, Most Significant item (name/image only where present), and the existing map preview with an explicit “Open map” button. Do not label significant data “popular” or add a Read Article action when the returned payload lacks the full modal post.

Population, significant and civilisation requests stay in one mounted controller even when the surface moves/collapses. Present null/error as unavailable, fetch as loading/updating; distinguish old placeholder data from confirmed new-era data without changing query caching. Do not fabricate a count from the mockup or silently reinterpret backend zero.

The map uses existing countries/dots/colors and active-year logic. Explain it shows locations associated with articles using modern country locations, not territorial extent. Preserve small-map expansion, tooltip data and cached-post activation. Keyboard access should expose equivalent available dot information and the same cached-post action without requiring a new endpoint. Missing cached posts remain non-opening; do not invent details. Full map stays in the current map modal.

Desktop sidebar remains persistent. Keep its contents compact enough for ordinary laptop heights. For short viewports/large zoom, switch to the compact context disclosure rather than introducing a permanent competing sidebar scroller. The disclosure is presentation-only open state; the data and EraProvider persist. Mobile/tablet context opens a named modal sheet with one internal scroll area; the page pauses only while that overlay is open.

## Desktop filters and mobile drawer

Primary desktop filter controls sit above and align to the card region. A first row can hold search and sort/actions; a second row holds Type, Continents, Subjects, Theme, Dates and Saved filters. Grouping may wrap to two rows on laptop without shrinking targets. Do not show a fake result total. Use “Timeline entries” if a heading is needed.

Type/Continents/Subjects are checkbox popovers with counts and checked marks. Theme remains single-select. Dates use the existing signed-year drafts/parser/debounce; show inline invalid/reversed-range feedback without changing commit rules. Controls are labeled and panels have headings. Avoid menu/listbox roles on a panel containing arbitrary checkboxes and inputs; use a labeled disclosure/panel and native inputs. One popover open at a time; Escape closes it, outside click dismisses, Tab follows usable control order and focus returns to the trigger where appropriate. No new positioning library is required: align panels within the toolbar and constrain their dimensions to the viewport.

Applied chips beneath controls summarize real selections and allow removal through `patchFilter`; chips wrap into a bounded summary with an explicit expand control rather than unboundedly growing the fixed header. Keep the filter-count definition consistent with the current utility badge. Search is displayed in its field, not counted as a type/subject/continent selection.

Selections apply immediately. Desktop panel “Done” and mobile drawer “Close” dismiss; neither implies commit or cancellation. Keep distinct “Clear filters” (existing drawer semantics: view retained) and “Reset timeline” (existing utility semantics: global view plus full reset). Keep the existing conditions governing when reset appears unless separately approved. Preserve sort, copy-share link feedback, create entry and all saved-filter flows, including “Apply filter” versus “Apply filter and perspective.”

Mobile (<768 px) uses search plus a Filters button with count; drawer includes the same filter field components, saved controls, sort and reset actions. Include a persistent close button, named dialog, focus containment, Escape/backdrop behavior, body scroll lock and safe-area padding. It has one scrolling panel, not nested scrolling accordion bodies. Tablet may use the same consolidated controls to protect feed width. Responsive changes move presentation around one filter/search/date controller; do not leave hidden desktop/mobile controls running duplicate debounces. Closing dates before debounce currently cancels with drawer unmount; capture and preserve that baseline unless the approved extraction explicitly changes it.

## Cards and modal presentation

Cards are editorial units with date/locale, serif title, short description, subject tags and existing like/count. Use image-first blocks where an image is present; retain text-first imageless cards with a subtle border and optional existing group icon. Significance==1 may receive a restrained accent border; no arbitrary alternating cream tiles. Do not truncate away existing descriptions simply to match the mockup, add mandatory article routes, or introduce bookmarks/grid-list toggles.

Retain Masonic, natural card-height variation and server ordering. Target 300–380 px readable columns; allow one on narrow layouts, two when measured feed width fits and at most three on wide desktop after verification. This is a column presentation change, not a new engine. The SSR column fallback and skeleton should follow the same width rules as closely as possible.

Media keeps existing CDN-first source selection and eager card/lazy modal loading. With no source dimensions in the contract, reserve a bounded 16:10 media stage for image cards, using `object-fit: contain` on a matching dark surface so portraits, diagrams and low-resolution images remain usable. This does not set total card height. Do not stretch or upscale small images aggressively. Failure displays a neutral “Image unavailable” treatment inside the reserved stage; no-image cards have no stage. Preserve credits/source links in the modal. If intrinsic dimensions become available later, use them only through an approved existing-data path, not a backend schema change.

The card's main opening affordance must be keyboard-operable while like remains an independent button; avoid putting buttons inside another button. Prefer a title/open button and a non-nested pointer activation area. Focus-visible treatment is consistent. Keep refs/data attributes on the stable measured outer card; visual hover uses border/shadow rather than transforming that measured box.

`TimelineModal` remains a bite-sized detail overlay, approximately 720–800 px desktop, near-full-screen mobile with `dvh` and safe areas. Preserve title, date/person labels, country/group/subjects, image credit/source, both descriptions, author profile, like, Suggest Edit and ADMIN Delete. One internal scrolling body and a persistent close control. No article history entry or URL semantics are added.

Upgrade `ModalShell` as the common presentation primitive: labeled dialog, initial focus, focus trap, background inertness, previous-focus restoration and a stable feed/card fallback if virtualization removed the opener. Coordinate scroll locks and Escape for nested map/article overlays; only the topmost closes. Returning from article to map keeps page locked and restores focus in the map. Restore the previous body style rather than blindly clearing it. Modal closing must preserve feed position and not remount the timeline. A lightweight local implementation/native primitives are preferred; a new accessibility dependency needs separate justification and approval.

## Responsive specification

| Width / condition | Composition | Feed / controls |
| --- | --- | --- |
| 320–479 px | Compact nav, 2-line era/date summary, perspective selector, 44 px strip, context disclosure | One column; search/Filters; menu for secondary actions; drawer and near-fullscreen article modal. No bottom stats bar permanently covering cards. |
| 480–767 px | Larger mobile spacing, same interaction model | One comfortable column; preserve readable titles/tags and no horizontal overflow. |
| 768–1023 px | Compact header, horizontal strip; context sheet rather than sidebar | Two columns only when actual feed width permits; consolidated filters plus search/sort. |
| 1024–1279 px | Left 256 px context, fuller header, desktop toolbar | One or two measured columns; avoid forcing two undersized cards. Toolbar can wrap. |
| 1280–1535 px | Left 272–288 px context, clear observed-year block | Normally two columns; desktop popovers/chips. |
| >=1536 px | Max-width shell, same hierarchy | Up to three columns if minimum widths/gutters fit; never stretch to five tiny reference tiles. |
| Height <650 px, landscape or high zoom | Compact header/context mode even on wide screens | Keep a substantial visible feed band; move long controls to an overlay instead of clipping them. |

Use actual container width to determine masonry columns. Breakpoints must not key providers or data hooks. Validate 320, 390, 480, 768, 1024, 1280, 1536 and 1920 px, including 844×390 landscape, browser zoom and mobile keyboard. Use `min-width:0`, wrapping text and safe-area inset padding; never mask overflow problems with global clipping. Show native scrollbars where relevant. Horizontal strip scrolling is allowed; horizontal page scrolling is not.

## Secondary routes

| Family / concrete files | Proposed composition | Functional boundaries |
| --- | --- | --- |
| Auth/recovery: `app/routes/login.tsx`, `register.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `verify.tsx` | Cream form card on quiet atlas shell; persistent visible labels, coherent feedback and loading panels; mobile full-width padding | Same schemas, consent checkbox, token handling, resend, auth callbacks, return paths and redirect timers. |
| Profile: `app/routes/user.$id.tsx`, `features/user/components/*` | Account header, real stats in a compact summary, Created/Liked tabs and existing grid cards | Same loader/query initialization, counts and viewer keys. No unrequested private account settings or new card-modal behavior. |
| Contributions: `pages/CreateArticle.tsx`, `pages/Edit.tsx`, `features/form/components/*` | 768 px reading/form surface with sections: summary, classification, dates, sources/media; labels/help aligned; date fields stack logically on mobile | Same reducer, values, Zod rules, native constraints, submission/mutation, significance merge and verified guard. Do not add a multi-step wizard. |
| Moderation: `pages/Review.tsx`, `features/review/components/*` | Compact heading/stats, clear Edits/Created tabs, readable before/after rows and sticky-within-card action grouping where safe | Preserve every diff/zero/null value, submitter, image changes, pending state, role restriction and stale/failed-action feedback. No bulk actions. |
| Legal: `app/routes/terms.tsx`, `privacy.tsx`, `cookies.tsx` | Cream reading surface, 65–75ch measure, legible tables/lists, existing TOC with anchor offsets | Preserve exact legal text, links, IDs and last-updated values. Horizontal table scrolling only where genuinely required. |
| Errors/feedback: `pages/Error.tsx`, `components/ui/Skeleton.tsx`, `context/ToastContext.tsx` | Consistent status surfaces, retry/home actions, accessible live feedback | Preserve route errors and operation uncertainty; do not turn timeout feedback into automatic mutation retries. |

## Motion, accessibility and state presentation

Replace decorative springs/layout animation, typewriter text and interpolated historical dates with CSS opacity/color transitions and immediate true values. Proposed motion duration: 120–180 ms controls, 180–220 ms overlays; no card-size/width animations or scroll-linked parallax. Drawer can translate its own overlay panel without moving the feed. Modal animation may target an inner visual layer while stable dialog geometry/focus is established.

Framer is unnecessary for the proposed interaction set. Migrate its consumers phase by phase; retain the package until the final import audit and browser checks pass, then remove it in a separate approved cleanup. Do not claim a performance improvement without comparing bundle and runtime traces. D3 map animations remain separately governed; under reduced motion update dots/tooltips immediately. Disable decorative entry/loading pulses with `prefers-reduced-motion`; loading text remains.

| State | Required presentation |
| --- | --- |
| Initial SSR/load | Stable shell and reserved skeleton space; named loading status; no fabricated current-year certainty before data is ready. |
| Page append | Existing cards remain; small footer loading status; never full-page skeleton or scroll reset. |
| No matches / no content | Clear distinction in copy where filter presence supports it; retain controls and applicable reset action; no stale map asserted as matching empty results. |
| Initial loader error | Shared route error surface/home action; do not assume component Retry is reached. |
| Query/next-page failure | Existing timeline Retry calls refetch/fetchNextPage as appropriate; preserve loaded cards. |
| Context refresh/failure | Updating/unavailable annotation, not static mockup numbers or falsely current cached stats. |
| Selected / disabled / pending | Label/check/icon plus color; disabled duplicate mutation action; keep pending text visible. |
| Image absent / failed / slow | Text-first card / reserved neutral media / reserved loading stage respectively. |
| Auth expired / insufficient permission | Existing guard/redirect and feedback, no leaked privileged controls or cache data. |

Use nav/main/aside landmarks, one main H1, logical headings and skip-to-content. Visible keyboard focus must not disappear under sticky surfaces; use shared scroll-padding/scroll-margin offsets for focus and legal anchors. Checkbox groups use fieldsets/legends; form errors connect through `aria-describedby`/`aria-invalid`. Add proper tab semantics and arrow-key behavior where the existing tab wrapper is migrated. Dialog/drawer names, close controls, topmost Escape, focus trapping/return and scroll locks are explicit acceptance criteria.

Target WCAG AA: 4.5:1 normal text, 3:1 large text and essential controls. Verify actual composed backgrounds, not just token swatches. Gold is an accent, not the only indicator. Decorative hero/map imagery has empty alt; content imagery uses meaningful article/title context. Map information needs keyboard/text equivalence without claiming geographical precision. Announce search/loading/mutation outcomes politely, not every animated era update. Preserve reduced-motion, 200% zoom, reflow at narrow equivalent widths and touch usability.

## Review decisions

Approval of the implementation plan should explicitly cover: this palette/system-font direction; left desktop sidebar with window-root scrolling; up to three wide-screen columns; passive era strip; homepage content preservation and image mapping; single shared search entry/controller; immediate filters with their current reset differences; scoped overlay accessibility repair; and staged CSS motion migration followed by Framer removal.

No backend/schema/query/auth/pagination changes, new dependencies, new product routes or interactive era navigation are proposed. Existing limitations listed in architecture remain separate follow-ups. No implementation should start until the user approves a phase.
