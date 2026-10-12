# Redesign progress log

Updated: 12 October 2026 (Asia/Singapore)

- Branch: `feature/app-redesign`, created from `master` at `e27f52b`.
- Planning: approved. Architecture, design specification and implementation plan are complete.
- Working-tree inputs preserved: the user's `frontend/AGENTS.md` edits and supplied `frontend/resources/` mockups.
- Baseline issue: the manifest/lockfile declare React Router 7.18.4 while installed packages are 7.14.1. Validation must use the declared lockfile environment before final sign-off.
- Phase 1 — shared design foundations and global shell: complete. Added semantic tokens, reduced-motion/focus foundations, shell variants, a responsive full navigation using the supplied SVG wordmark, and compatible fixed-header offsets. Validation: scoped lint passed; client/security node tests 10/10 passed; production client/SSR build passed with the existing DaisyUI CSS optimizer warning. TypeScript still reports only the documented pre-existing unused `options` parameter in `src/lib/cookies.ts`.
- Phase 2 — homepage and shared timeline search entry: complete. Rebuilt the homepage around the supplied hero/editorial assets while retaining all existing copy, sections and destinations. Added a shared accessible search field and a location-key-aware timeline search controller; homepage submissions enter the existing `q` URL/loader/query pipeline. Validation: scoped lint passed; production client/SSR build passed; TypeScript remains limited to the pre-existing cookie diagnostic. The isolated browser command completed without captured output and will be rerun with the expanded timeline-shell checks in Phase 3.
- Phase 3 — timeline shell, header, passive era strip and context: complete. Rebuilt the timeline around the persistent atlas header, read-only regional era strip, left desktop/compact mobile context panel and up-to-three-column Masonic feed. The existing era tracker now excludes cards occluded by the fixed header while retaining one authoritative scroll-derived year. Validation: scoped lint passed; client/SSR build passed; expanded headless Edge fixture passed bounded virtualization, infinite append, reverse scrolling, resizing, header-occlusion era tracking, map/year updates, region/sort/search/history, modal, error and empty states (10 mounted of 60 loaded at baseline). TypeScript remains limited to the pre-existing cookie diagnostic.
- Current phase: Phase 4 — article cards, map/article dialogs and overlay lifecycle.

Each completed phase will record its commit and validation here.
