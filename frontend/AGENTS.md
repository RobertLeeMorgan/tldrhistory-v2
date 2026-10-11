# TL;DR History — Redesign Agent Instructions

## Mission
Redesign the visual presentation and usability of the existing TL;DR History application while preserving its product capabilities, backend contracts, and observable functional behaviour. This is a substantial UI/UX overhaul, **not** a backend rewrite or unrelated feature expansion. Presentation components, layout structure, and UI state wiring may be reorganised where justified.

The product's purpose is to let users understand history through short, interconnected entries situated in a broader chronological and geographic context. It is **not** a Wikipedia replacement. Prioritise fast scanning, chronological orientation, cross-cultural context, and easy exploration over exhaustive article pages.

## Authority and workflow
1. Inspect the repository before proposing or changing code. Identify the actual framework, styling system, route structure, shared components, data flow, timeline observer, infinite scrolling, masonry implementation, filtering/search integration, modal handling, and responsive behaviour. Do not assume filenames or architecture.
2. Create `docs/redesign/architecture.md` describing the existing UI architecture and behaviour, including key file paths, state ownership, integration points, and fragile dependencies.
3. Create `docs/redesign/design-spec.md` with the proposed design system, page layouts, responsive states, interactions, accessibility, animation, and edge cases.
4. Create `docs/redesign/implementation-plan.md` with small, independently verifiable phases, affected files, risk, acceptance criteria, and rollback notes.
5. **Stop after producing these documents and request approval before implementation.** Do not modify application code in the planning pass.
6. After approval, implement one approved phase at a time. Summarise files changed, tests run, remaining issues, and any deviation from the plan. Do not silently broaden scope.

The supplied four mockups are **visual references, not literal functional specifications**. Where a mockup conflicts with existing UI implementation, favour the redesigned experience while preserving functional outcomes. Where it conflicts with a real product capability or backend contract, adapt the design and document the trade-off. Do not invent data or imply that static mockup figures are real.

## Non-negotiable invariants
- Preserve existing backend interfaces, GraphQL operations, schemas, Prisma models, authentication/authorisation, database structure, query parameters, pagination/cursors, caching and server-side filtering semantics.
- Preserve infinite-scroll behaviour, loading correctness, scroll position continuity, and masonry support for variable-height cards. Prefer retaining the current masonry engine, but allow presentation-layer restructuring or an explicitly justified equivalent after testing.
- Preserve the current relationship between scroll observers, visible articles, era/geographic context, header, and sidebar. There must be **one authoritative source of timeline context**, not competing scroll and navigation state.
- Preserve the user-facing experience of independently scrolling infinite content with persistent timeline context. Header/sidebar sizes, placement, DOM hierarchy, sticky mechanics and even scroll-container implementation may change if observer roots, pagination, restoration, and scroll behaviour are verified.
- Preserve multiple simultaneous filter selections, their application to fetch queries, reset/clear behaviour, and existing URL/state persistence where present. Do not turn multiselect filters into single-select controls.
- Preserve article cards opening their existing modals. Do not turn them into mandatory article routes or replace bite-sized content with full article pages.
- Preserve current search semantics. The homepage must integrate with the existing timeline search system; do not implement a second independent search engine, query format, or duplicated filtering logic.
- Preserve existing functional routes and flows, including login, registration, user profiles, article creation/editing, suggested edits, review/moderation, privacy, and terms.
- Preserve permission checks, validation, form submissions, error handling, keyboard interactions and other functional behaviour, even when visually restyling controls.
- Freely refactor or replace presentation components when that improves the design and maintainability. Avoid unnecessary changes to domain logic, query semantics, backend services, and authentication. Add dependencies only with a clear justification.

If a visual request genuinely requires changing a functional or backend invariant, document the conflict and request approval. Do not treat existing component boundaries, DOM structure, drawer placement, or CSS layout as invariants.

## Visual direction
Use a cohesive, contemporary historical-atlas aesthetic: near-black/charcoal backgrounds for the immersive timeline, muted warm-gold accents, ivory/cream text, restrained borders, subtle texture, and high-quality historical imagery where available. Typography should combine a readable serif for major historical headings with a highly legible sans-serif for navigation, labels, filters, metadata, and body copy.

The homepage may use a dark cinematic hero with light/cream discovery sections, as in reference 1. The timeline and its context surfaces should primarily use the dark treatment from references 2–4. Keep shared navigation, typography, controls, spacing and accents consistent across both. Use the same tokens for secondary routes, with surface variants appropriate to forms and long-form content.

Do not add a user-facing theme switch or a full second theme in this phase. Define semantic design tokens rather than scattering hard-coded colours. Respect the existing styling stack and established component conventions; do not introduce a new styling framework without approval.

Prioritise legibility and information hierarchy over decorative effects. Do not make the application depend on high-quality images being present.

## Icons

- Continue using the existing `react-icons` library throughout the application.
- Reuse existing icon imports and conventions where appropriate.
- New icons should be sourced from `react-icons`, choosing a visually consistent icon family for the redesigned interface.
- Do not introduce additional icon libraries or replace `react-icons` with another icon system.
- Existing icons may be changed to better match the new design, provided their meaning and accessibility are preserved.

## Homepage

- Redesign as a clear entry point into the existing timeline and discovery routes, informed by reference 1.
- **Preserve all existing homepage content, links, destinations, and functionality.** Codex may reorganise sections, change layouts, improve visual hierarchy, and refine presentation, but should not remove or replace existing content or navigation without explicit approval.
- Do not introduce new sections, links, or features solely to match the mockup unless they are supported by existing functionality or explicitly approved.
- Keep links and sections grounded in routes, features, and data that actually exist. Any featured stories, statistics, popular searches, or previews must come from real supported data or clearly defined static editorial content; do not invent counts or backend capabilities.
- Homepage images will be provided in `/src/assets/images/home`. Use these assets where appropriate, matching them to their intended articles or sections based on descriptive filenames. Do not substitute unrelated imagery or generate placeholder images.
- Design gracefully around missing images. The homepage should remain visually cohesive even when some articles or sections have no suitable imagery.
- Reuse the timeline's search UI/logic through shared components or a thin adapter, according to the current architecture. Define explicitly how a homepage query transfers to timeline search state and triggers the existing query pipeline.
- Do not build a separate global search endpoint or parallel search state.
- The nav bar requires an overhaul

## Timeline layout and context
- Maintain the established viewport/scroll architecture: the card region scrolls infinitely while the header and context sidebar remain visible as currently intended.
- The top context area should communicate current era, selected geographic scope, and current chronological position. All values must be derived from existing data and observer state; never hard-code the reference mockup's dates, populations, civilisation counts, or regions.
- **Design an era timeline strip as a primary part of the new timeline header**, informed by references 2 and 3. Inspect existing era definitions, region-dependent era options, scroll navigation and observer updates. This will be purely visual and should have no navigation logic or selection feature.
- Preserve geographic selection, including global and regional scopes. Do not reduce or remove regional coverage to accommodate artwork.
- Avoid per-era/per-region hero image requirements. Prefer a stable decorative map, subtle gradient/texture, or a small curated set of generic non-contextual visuals. A background must not falsely represent the selected region or period. Context should remain clear without imagery.
- The sidebar should retain the application's real context data and map behaviour. Do not invent civilisation polygon coverage or geographic precision beyond the existing map model. Restyle the current map rather than replacing it with unsupported data.
- **Recompose the header and sidebar** to approach the mockups: larger contextual hero where useful, clear date/scope, integrated era navigator, narrower or wider sidebar as needed, and filters aligned with the content region. These elements may change size, DOM hierarchy and placement. Audit sticky offsets, container height, scrollbar placement, observer root/threshold assumptions and viewport breakpoints.
- The timeline is the application's primary product experience and should inform the global design system. The homepage should introduce that experience rather than establish visual patterns that are unsuitable for the timeline.

## Cards and masonry
- Keep the existing masonry implementation, dynamic card heights, loading strategy, image allocation, and item ordering semantics.
- Support entries with no image, landscape/portrait/square images, slow or failed image loads, unusually long titles, short descriptions, and differing metadata.
- Use flexible card layouts with predictable padding, type hierarchy, and readable contrast. Preserve natural masonry height variation instead of forcing every card into a mockup-sized tile.
- Image containers must prevent layout shift using existing dimensions/aspect ratio data when available; retain the current image loading/optimisation strategy. Do not assume uniform source quality or crop away important content indiscriminately.
- Imageless cards must be first-class designs, not broken or empty versions of image cards. Use typography, date, metadata and restrained surfaces to provide hierarchy.
- Preserve existing modal opening, dismissal, deep linking (if present), focus behaviour, and action controls. Redesign the modal consistently with cards.
- Do not implement a grid/list toggle solely because it appears in the mockups. The primary masonry presentation remains the intended experience. A list mode may be proposed separately only if it has a clear product benefit and a safe implementation path.

## Filters and search
- **Move the primary desktop filter controls to a toolbar above the card grid**, as in the mockups, while retaining multiselect behaviour. The current Floating UI drawer is an implementation detail, not a layout requirement: reuse its accessible primitives/state where helpful, or replace its presentation with multiselect popovers/panels. On mobile, a consolidated drawer may remain the best pattern.
- Maintain all multiselect semantics and fetch integration. Mockup dropdowns are visual references only; design genuine multiselect controls with selection counts/chips, keyboard support, apply/reset semantics and sensible overflow.
- Distinguish draft vs applied selections if the current implementation does; preserve the current apply/cancel behaviour and any debounce or pagination reset semantics.
- Keep search integrated with the existing timeline query and filters. Preserve loading, empty, error and no-results states.
- On mobile, use a compact filter trigger and an accessible overlay/drawer with clearly visible active selections and an unambiguous way to close it.

## Nav bar
- complete redesign, check for useful navigation links, but leave space for extra routes later as more features will be added
- there is a new svg logo in /public, that is the new logo of the site, I will replace the icons for seo meta data seperately to this redesign

## Responsive design
Design and verify at narrow mobile, larger mobile, tablet, laptop and wide desktop widths. Do not merely shrink the desktop composition.

- Desktop: design the header, persistent sidebar, filter toolbar and masonry region together; widths, spacing, card columns and context placement may differ substantially from the current implementation.
- Tablet: redesign the composition for available width, including relocating or collapsing the sidebar and filters, reducing card columns, and simplifying the era navigator.
- Mobile: use a deliberately distinct composition: compact current-era/date/scope summary, usable era navigation, accessible filter drawer, and contextual stats/map in a collapsible surface. Preserve infinite scroll and card modals without reproducing desktop density.
- The era strip, if implemented, must scroll or condense without squeezing labels into unreadable widths.
- Avoid nested scroll traps and competing scroll containers. Test that the original observer and load-more logic still work after responsive layout changes.
- Ensure usable touch targets, safe-area handling, keyboard accessibility and no horizontal overflow.

## Motion and interaction
Inventory existing animations, then freely refine, replace or remove them to suit the new design. Ensure transitions do not interfere with scroll position, intersection observers, masonry measurement or infinite loading.

Use restrained transitions for hover, focus, drawers, modals, and contextual updates. Respect `prefers-reduced-motion`. Do not animate card dimensions in ways that repeatedly reflow masonry or cause scroll jumps. Make loading, empty, error, focus, selected and disabled states explicit in the design specification.

## Secondary routes and shared components
Apply the same tokens and shared UI patterns to authentication, registration, user profiles, create/edit article forms, suggested-edit review, moderation, privacy, terms, and all other existing routes found during the audit.

Inventory every route and classify it by layout type: discovery, detail/modal, form, account, admin/moderation, legal. Reuse common headers, navigation, buttons, fields, typography, surfaces, feedback messages and dialog styles. Do not change business logic, validation, role-based visibility or permissions during restyling.

## Accessibility and quality
- Semantic landmarks and heading order; keyboard-operable menus, drawers, cards and modals; visible focus indicators.
- Correct focus management and scroll locking for overlays; accessible labels and statuses for search, filters, loading and pagination.
- WCAG AA contrast target for normal text and controls; avoid gold-on-light low contrast and tiny metadata.
- Meaningful image alt text; decorative hero art should not add noisy announcements.
- No fabricated imagery, statistics, historical dates, or map semantics.
- Prefer maintainable, reusable components and semantic tokens. Avoid excessive one-off CSS and unnecessary component abstractions.

## Validation requirements
Before any implementation phase, capture current behaviour and identify available tests. After each phase, run relevant lint, type checks, build and tests supported by the repository, and manually verify affected interactions.

For the timeline specifically verify: initial load; infinite loading; masonry reflow; images of varying sizes; no-image entries; search; combined multiselect filters; clear filters; region/global switching; era changes during scroll; navigating to eras; browser back/forward where applicable; modal open/close; sidebar/context updates; responsive resizing; mobile scroll; empty/error/loading states; and authentication-sensitive controls.

Compare desktop/mobile screenshots with the design specification, but do not optimise for screenshot similarity at the expense of actual behaviour. Document untested cases honestly; never claim success from a build alone.

## Deliverables and change discipline
Planning pass deliverables:
- `docs/redesign/architecture.md`
- `docs/redesign/design-spec.md`
- `docs/redesign/implementation-plan.md`
- A concise summary of major risks, assumptions, and decisions needing approval.

Recommended phase order, subject to repository inspection:
1. Design tokens, shared primitives and global shell.
2. Homepage and shared search entry point.
3. Timeline header, era navigator, context/sidebar composition and responsive scroll-layout integration.
4. Timeline cards and modal presentation.
5. Desktop filter toolbar, multiselect popovers and mobile drawer.
6. Responsive timeline adaptation and motion refinement.
7. Secondary routes and consistency pass.
8. Regression, accessibility and visual QA.

Keep changes reviewable and reversible. Do not combine unrelated architectural refactors with design work. If an implementation exposes a pre-existing architectural problem, record it separately instead of fixing it opportunistically.
