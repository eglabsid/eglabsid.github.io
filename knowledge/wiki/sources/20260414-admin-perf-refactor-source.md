# Source Summary — Admin Perf & Refactor (2026-04-14)

> Source: [raw/sources/20260414-admin-perf-refactor.md](../../raw/sources/20260414-admin-perf-refactor.md)

## What This Is
A combined performance-optimization + code-refactoring session on the two hottest pages of the EGLab Student Blog Platform (`admin/index.html` and `student-blog.html`), executed using the Ralph persistent loop with parallel agent teams.

## Key Changes

| Category | File | Change | Effect |
|----------|------|--------|--------|
| Perf | admin/index.html | Quill `defer` | Removes ~400KB render block on FCP |
| Perf | admin/index.html | `fonts.gstatic.com` preconnect | Eliminates DNS/TLS delay on font CDN |
| Perf | student-blog.html | 200ms search debounce | Stops per-keystroke full DOM reflow |
| Refactor | admin/index.html | Quill lazy init | Quill only for authenticated writers |
| Refactor | admin/index.html | window.* → event delegation | 4 globals removed from window namespace |

## Architecture Decisions
- `let quill = null` at module top; `initEditor()` called inside `onAuthStateChanged` after role confirmed
- `window.updateRole = updateRole` shim kept for dynamically-generated users table (onchange compatibility)
- `window.editPost` deferred to a future slice (tightly coupled to quill scope refactor)
- Event delegation pattern: `data-panel` for nav tabs, `data-action="delete"` for post table

## Linked Concepts
- [[performance-optimization]] — page-load-and-bundle mode, measurement-first approach
- [[code-refactoring]] — local safe refactor mode, behavior-preservation guardrail via manual smoke test

## Status
All planned changes verified. Remaining work: `window.editPost` removal + Slice 3 section marker cleanup.
