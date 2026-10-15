# TL;DR History — Feature Expansion Specification

**Suggested repository path:** `docs/planning/feature-expansion-spec.md`  
**Status:** Requirements for Codex planning; not approval to implement  
**Sequence:** Finish redesign → plan feature work → implement incrementally → build map explorer → audit and enrich data

## 1. Purpose and working rules

Extend the existing TL;DR History application without replacing its architecture or redesigning its UI again. Keep the chronological timeline as a first-class experience and add richer article metadata, reusable saved timelines, related content and a dedicated historical map explorer.

Before planning, Codex must inspect the **actual repository** rather than assume file names or schemas. Read, where present:

- `AGENTS.md` and any nested agent instructions.
- `docs/redesign/architecture.md`, `docs/redesign/design-spec.md`, `docs/redesign/implementation-plan.md`, plus subsequent redesign decisions and current implementation.
- Prisma schema and migrations; existing seed/import logic; PostgreSQL connection configuration.
- GraphQL schema/type definitions, resolvers, authorization and service/data-access layers; all article, group, filter, user and moderation flows.
- Timeline era/context calculation, fetching, pagination, filtering and card/modal components.
- Existing profile tabs, authentication, current map/modal, navigation, statistics, shared styling and responsive conventions.

Use existing conventions, naming and component patterns. This specification describes **desired behavior**, not literal Prisma model or API names. Resolve naming against the real schema. Do not create parallel fetching, authorization or design systems where existing ones can be extended. Preserve existing IDs, accounts, editorial history and established behavior unless a requirement explicitly changes it.

## 2. Article classification

### 2.1 Post type

Extend the existing post type enum to include `OBJECT`, retaining existing `PERSON`, `LANDMARK`, `EVENT` and `PERIOD` values. Do not silently rename or reinterpret existing stored values.

### 2.2 Kind

Add a **single primary kind per article**, restricted to the selected post type. Proposed taxonomy:

| Post type | Allowed kinds |
|---|---|
| `PERSON` | `RULER`, `POLITICAL_FIGURE`, `MILITARY_LEADER`, `RELIGIOUS_FIGURE`, `PHILOSOPHER`, `SCIENTIST`, `INVENTOR`, `ARTIST`, `WRITER`, `EXPLORER`, `ACTIVIST`, `OTHER` |
| `LANDMARK` | `SETTLEMENT`, `BUILDING`, `MONUMENT`, `ARCHAEOLOGICAL_SITE`, `FORTIFICATION`, `NATURAL_SITE`, `INFRASTRUCTURE`, `OTHER` |
| `EVENT` | `BATTLE`, `POLITICAL_EVENT`, `TREATY`, `DISCOVERY`, `INVENTION`, `DISASTER`, `ASSASSINATION`, `EXPLORATION`, `CULTURAL_EVENT`, `OTHER` |
| `PERIOD` | `ERA`, `EMPIRE`, `KINGDOM`, `DYNASTY`, `WAR`, `CIVILISATION`, `MOVEMENT`, `REVOLUTION`, `OTHER` |
| `OBJECT` | `ARTWORK`, `LITERARY_WORK`, `DOCUMENT`, `WEAPON`, `TECHNOLOGY`, `ARTIFACT`, `RELIGIOUS_OBJECT`, `OTHER` |

**Implementation note:** Prisma enums are global, not scoped to another enum. Use a single globally unique kind enum (prefix values by type if collisions are problematic) or an equally simple validated representation. Enforce allowed type/kind combinations in backend validation and editorial forms. Avoid five redundant kind columns. Kind can initially be nullable for legacy records until enrichment; a later migration can enforce completeness. `OTHER` must be type-specific in validation.

Update article creation, editing, suggestions, moderation, approval, read queries, filter input, frontend types and cards. Kind is visible on cards and in article details; display friendly labels, not raw enum strings. Existing type displays must handle `OBJECT`.

## 3. Historical dates and precision

Retain the existing start/end date model and its BCE handling unless inspection finds a genuine incompatibility. Add `DatePrecision`: `EXACT`, `ESTIMATE`, `RANGE`, `UNKNOWN`.

- `EXACT`: the represented date is known to the stored granularity.
- `ESTIMATE`: a best approximate date, e.g. *c. 500 BCE*.
- `RANGE`: only a bounded interval is known; render as a range rather than pretending an exact event date.
- `UNKNOWN`: reliable date unavailable; do not fabricate one.

**Important:** Duration and uncertainty are different. A reign with known start and end is not automatically `RANGE` precision. Decide during schema inspection whether precision belongs separately to start/end bounds, or to an event-date representation, so mixed certainty is expressible without overcomplication. Existing article start/end dates must continue to control temporal visibility; unknown dates need an explicit inclusion/exclusion policy rather than defaulting to year zero.

Render dates consistently in cards, modals, timeline headings, filters and map details, including BCE/CE and approximate/range labels. Avoid JavaScript `Date` for ancient historical chronology if the existing numeric representation is more appropriate.

## 4. Geographic data

### 4.1 Three geographic representations

Use a simple `LocationRepresentation` concept:

1. **`POINT`** — static location (battle, settlement, birthplace, monument). Store longitude/latitude.
2. **`REGION`** — one approximate geographic extent (polygon or multipolygon), without requiring dated changes.
3. **`TEMPORAL_REGION`** — a region with multiple dated territorial snapshots, e.g. an empire expanding or contracting.

These are representations, **not precision levels**. Not every article requires a region or a route. Prioritise point locations for data enrichment. Geographic fields should remain optional where a meaningful location cannot be established.

### 4.2 Precision and geometry

Add `LocationPrecision`: `EXACT`, `ESTIMATE`, `RANGE`, `UNKNOWN`:

- `EXACT`: sufficiently well-established point/extent for the intended map scale.
- `ESTIMATE`: best reconstructed point/extent.
- `RANGE`: only a broader possible area is known.
- `UNKNOWN`: no defensible geographic placement.

Do not claim archaeological or historical border accuracy merely because coordinates are precise numerically. For regions use GeoJSON `Polygon` / `MultiPolygon` in WGS84 `[longitude, latitude]`; for points use longitude/latitude or GeoJSON Point consistently. A simple related location/geography model is preferable to putting many sparse geometry columns on `Post`.

Temporal snapshots require a date/year, geometry, provenance/source where available, method (`SOURCED`, `ADAPTED`, `RECONSTRUCTED`), and a brief uncertainty note. Use multiple snapshots per article; do not duplicate the article for each date. Retain a distinction between **snapshot reference year** and the article's lifespan. Validate geometry and sensible chronological ordering.

### 4.3 Interpolation

When scrubbing between two temporal snapshots, attempt smooth visual transitions only when the geometry can be interpolated safely. MapLibre renders the result; it does not automatically morph arbitrary MultiPolygons. Compatible geometry may interpolate; incompatible topology (new islands, disconnected territories, major border changes) should crossfade or switch gracefully. Label intermediate shapes as visual estimates, **not verified borders for that year**. Avoid implementing a full historical reconstruction engine.

## 5. Historical groups: many-to-many

An article can belong to multiple historical groups. Convert the existing relationship to many-to-many while preserving all current memberships. Keep a **primary group** if required by existing canonical URLs, navigation or era context; secondary memberships must not create duplicate articles in result sets. Groups represent historical context (civilisations, movements, conflicts), not a substitute for type/kind.

Update Prisma relations, migrations, GraphQL types and inputs, group resolvers, editorial forms, suggestions/moderation, filters and timeline queries. Filtering by several selected groups should use **OR within the group facet** by default, with **AND across different facets** (e.g. group + kind + region). Deduplicate posts, preserve stable pagination and consistent counts. If the existing API already defines an intentional AND behavior, surface that decision in planning before changing it.

Keep the existing group taxonomy until the final data audit; do not invent dozens of new groups as part of the schema migration.

## 6. Related articles

Store generic article-to-article connections using stable article IDs. Connections should be logically bidirectional; avoid duplicate A↔B edges and self-links. Do **not** introduce a large, manually maintained ontology of relationship types.

Infer display labels from the two articles' types/kinds and context, using a small, conservative set of labels (e.g. *Related people*, *Events*, *Works*, *Associated periods*). Labels must not assert a specific unverified relationship such as *invented by* or *ruled by*. Precompute or derive labels when connections are created/updated rather than performing expensive repeated joins for every modal read, where practical.

Expose related articles in article modal with compact cards/links, no duplicate results, and navigation to the related article. Respect publication/moderation visibility. Existing article edits and deletion behavior must not leave dangling relationships.

## 7. Saved timelines

A saved timeline is a **named, ordered or chronologically presented collection of references to existing articles**, owned by a user. It does not copy article content. Use a `SavedTimeline` model and join entries (`SavedTimelinePost` or equivalent), with unique membership per timeline and suitable indexes. Decide whether explicit user ordering is needed; default display should be chronological, consistent with the main timeline.

### Required interactions

- On each article card, offer a save/bookmark control. For authenticated users, open a compact chooser of their timelines, with an option to create a timeline and save immediately. Show current membership and allow removal. Avoid making the whole card harder to open.
- For guests, prompt sign-in without losing the article context.
- In the timeline filter bar, let users select **All history** or one of their saved timelines as the **content source**. Other filters (dates, groups, type, kind, region) still apply within that source. Provide a clear way to return to All history.
- On the existing user profile, add a **Saved timelines** section/tab that fits its established tab pattern; within it, each saved timeline should be accessible as a tab or equivalent manageable view. Allow create, rename, delete, view and remove articles. Handle empty timelines.
- A user may save the same article to multiple timelines; adding it twice to one timeline is idempotent. Deleting a timeline must not delete articles.

Start with **private, owner-only timelines**; sharing/public discovery is not in scope. Add authenticated owner-scoped GraphQL CRUD queries/mutations, pagination where needed, and authorization on every read/write. Reuse existing published-content visibility rules. Decide how removed/unpublished posts appear to owners (prefer hidden/unavailable rather than leaking content).

## 8. Article modal URLs and navigation

Every published article needs a stable, directly accessible canonical URL. Opening it from the timeline should display a modal **without losing the underlying timeline state or scroll position**. Back closes the modal and restores context; forward reopens it. Direct loading or refreshing the article URL must render a usable article page (or route-level equivalent), not an empty modal over a missing background. Support links from related articles, saved timelines and map markers. Preserve existing canonical slugs/redirects and SSR/SEO behavior where present. Modal focus management, Escape handling, background scroll lock and mobile behavior must remain correct.

## 9. Filters and API propagation

Trace new fields through **all relevant reads and writes**: Prisma, migrations, GraphQL schema/input types, resolvers/services, create/edit/submit/review/approve flows, frontend types, cards, modals, search, pagination and counts. Avoid a schema-only implementation that leaves editorial paths silently dropping fields.

Support multi-select group filtering, post type, kind, date range, region and saved timeline source as applicable. Type changes should reset or reject incompatible kind selections. Persist filter state in URL or existing state mechanism where useful, without introducing a second competing state system. Reuse existing fetch and caching patterns and preserve pagination/infinite-scroll behavior when filters change.

## 10. Dedicated map explorer

### 10.1 Architecture and appearance

Create a full-screen or map-dominant **Map** route using **MapLibre GL JS**, not D3 for the new explorer. Reuse the application's era/time context, article queries, filter semantics, selection state and relevant statistics where possible, but do not couple map rendering to timeline-specific DOM/layout. Inspect whether shared hooks/services can be extracted cleanly rather than duplicating data logic.

Use a **plain, site-styled geographic canvas**: neutral landmasses, no mandatory modern country outlines, no streets, commercial basemap, labels or baked-in colour palette. Load a simple reusable landmass GeoJSON/vector source (Natural Earth or suitable existing licensed data). MapLibre's style can be nearly empty, with our own background, landmass, markers and historical layers. Prefer consistent colours from site design tokens. Do not assume MapLibre ships with geography.

Disable map rotation and pitch; heavily constrain zoom (initial candidate max ~6, adjust through visual testing). Prevent distracting repeated-world copies. Provide intuitive pan, zoom, reset/fit controls and mobile touch behavior. Keep rendering responsive and accessible.

### 10.2 Time scrub and temporal visibility

The primary browsing control is a **year-based time scrubber** supporting BCE and CE, with readable dates and appropriate coarse/fine stepping across long periods. Its selected year controls active article visibility and historical geographic snapshots. Articles enter at their start date and leave after their end date, following the existing timeline's established temporal semantics; single-date events need a deliberate visibility treatment so they are discoverable without being permanently displayed. Do not load or render the entire historical corpus at once.

Scrubbing should update markers, regions, context labels, stats and legend coherently, with smooth but restrained transitions. Avoid race conditions from rapid scrubbing or stale requests. Where helpful, reuse timeline era fetching and prefetch adjacent time windows. Don't require precise polygons for every year.

### 10.3 Layers, filters and legend

Use existing filter capabilities with a map-appropriate interface (desktop panel, compact mobile drawer). Type and kind primarily determine **marker icon/symbol**; historical group membership can determine **colour**. Provide a legend that explains currently visible symbols, colours and region overlays. A post may have multiple groups: choose a deterministic primary colour (prefer primary group), while filters still match all memberships. Provide fallback symbols/colours for unknown or uncategorised data. Avoid a unique colour for every group if it makes the legend unusable; show relevant groups and allow collapsing/scrolling.

Points should be clickable with an article preview and a clear path to the canonical article modal/page. Hover/focus states should identify features without requiring tiny targets. Overlapping points should remain selectable (simple clustering or expansion where needed). Regions should have subtle fills and clear interactive outlines; handle overlap and selection predictably. Animate entry/exit modestly, honour reduced-motion preferences and avoid transitions that imply false historical certainty.

Reuse era headers/context and relevant stats in a **map-specific presentation** rather than copying timeline sidebars verbatim. The active date, era and geographic selection must be easy to understand. Don't add decorative panels that compete with the map.

### 10.4 Navigation

Add Map to the primary navigation. Replace the existing map modal's entry points with navigation to the Map route, preserving useful context (year, filters, selected article) where practical. Review home-page map calls to action and direct some to the Map route where that is more appropriate than the timeline. Timeline and Map should be clearly distinct, easily switchable experiences.

### 10.5 Map performance and data scope

The app filters by time: only currently relevant records are rendered. Start with GeoJSON sources and simple MapLibre layers. Do **not** add vector tile infrastructure, deck.gl, 3D engines, drawing tools or PostGIS unless a measured requirement emerges. Reuse existing PostgreSQL/Prisma patterns for geometry storage where adequate. A small set of representative sample points, regions and temporal snapshots is sufficient to build and test the explorer before the data audit.

## 11. Final data audit and enrichment (after features and map)

Once the schema, editorial flows and map are working, perform a broad data pass:

- Populate new type/kind, date precision, location representation/precision and point coordinates where supported.
- Review historical accuracy, summaries, dates, classification, groups, duplicates and geographic coverage.
- Reassess global group taxonomy and assign multiple groups where justified.
- Identify missing significant articles and create them where warranted, avoiding low-value filler and duplicates.
- Add meaningful related-article connections after records and classifications are settled.
- Use sourced/adapted regional geometry where practical; **prioritise points**, and reserve dated territorial snapshots for major historically important entities initially.
- Do not invent exact coordinates, historical borders or certainty. Keep provenance and distinguish estimates.

Perplexity may handle historical research and structured enrichment exports; Codex can handle database integration, relationship generation, GIS acquisition/transformation and validation. This is an intended division of work, not a requirement to build an elaborate pipeline. Use a database backup before large edits. Defer making nullable enrichment fields mandatory until coverage and exceptions are understood.

## 12. Migration and compatibility expectations

- Plan additive migrations first; backfill and enforce stricter constraints later.
- Preserve existing IDs, user data, content moderation history, slugs and current group membership.
- Confirm all Prisma and GraphQL enum changes are handled across API input/output and frontend rendering.
- Keep existing articles functional when new optional fields are empty.
- Avoid duplicated posts from many-to-many joins and saved timeline joins.
- Ensure saved timeline permissions and related-post publication visibility are enforced server-side.
- Review indexing for year-window queries, group filtering, relationships, saved timeline membership and geographic snapshot lookups; avoid premature optimisation.
- Update tests for migration/backfill, editorial submission/approval, group filters, saved timelines, URL/back navigation and map time behavior.

## 13. Planning-stage outputs (Codex should create these, not implement yet)

Place planning artifacts under `docs/features/` (or an existing project documentation convention):

1. **`architecture.md`** — current architecture and exact files/services affected; migration strategy; proposed Prisma/GraphQL models and API operations; reuse opportunities; material risks and open decisions.
2. **`design-spec.md`** — interactions and UI states for card save control, profile timelines, filters, related-article modal, article URL routing and map desktop/mobile; reuse the completed redesign's design system.
3. **`implementation-plan.md`** — ordered, independently testable phases with affected areas, dependencies and validation criteria. Suggested phases: (1) schema/types/migrations, (2) editorial/API/filter propagation, (3) relationships and saved timelines, (4) modal URLs, (5) MapLibre explorer, (6) final data audit/enrichment.

Keep the documents actionable and reasonably concise. **Do not write application code or run migrations during planning.** Identify any genuinely blocking ambiguities, choose sensible defaults for minor ones, and request approval of the implementation plan before coding.

## 14. Acceptance checklist

- Existing articles and editorial flows still work after migration.
- `OBJECT` and type-valid kinds work throughout read/write/review UI.
- Date precision displays correctly, including BCE and uncertain dates.
- Optional point/region/temporal-region data can be stored and rendered.
- Multi-group articles appear once in results; multi-group filters work end-to-end.
- Related articles appear in modals with safe, inferred labels.
- Users can create/manage saved timelines and save articles without copying records.
- Article URLs work on direct load, modal open, refresh, Back and Forward.
- Map is a standalone, plain MapLibre view with time scrub, filters, legend, selection, restrained transitions and appropriate context/stats.
- Time scrub respects article end dates and handles snapshot transitions honestly.
- The final audit can enrich legacy data without requiring every article to have a polygon.
