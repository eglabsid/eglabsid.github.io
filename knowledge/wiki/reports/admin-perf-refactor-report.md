# Report — EGLab Admin Page: Performance & Refactoring (2026-04-14)

> Type: synthesis report | Source: [20260414-admin-perf-refactor-source.md](../sources/20260414-admin-perf-refactor-source.md)

## Summary
Three performance fixes and two refactoring slices were applied to `admin/index.html` (hottest path, 41x access) and `student-blog.html` (13x access) in a single Ralph+Team session. All changes verified in 1 iteration.

## Performance Brief Recap

**Surface:** Page-load + Frontend interaction
**Primary modes:** `page-load-and-bundle` (admin) + `interaction-and-rendering` (student-blog)

### Bottlenecks Addressed

1. **Quill render-blocking** (HIGH) — 400KB+ synchronous script in critical path
   - Fix: `defer` attribute
   - Expected: FCP improvement on all admin page loads

2. **fonts.gstatic.com missing preconnect** (MEDIUM) — DNS/TLS handshake delay on font CDN
   - Fix: `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
   - Expected: Reduced FOIT/FOUT

3. **Search debounce absent** (MEDIUM) — full DOM reflow per keystroke in student-blog
   - Fix: 200ms clearTimeout/setTimeout wrap
   - Expected: Significant reduction in reflows during active search

## Refactoring Brief Recap

**Mode:** Local safe refactor
**Behavior guardrail:** Manual smoke test (no automated tests exist)

### Structural Improvements

**Slice 1 — Quill lazy init**
- Before: `new Quill(...)` runs at module load for all visitors
- After: `initEditor()` runs only inside `onAuthStateChanged` success path, guarded by `if (quill) return`
- Benefit: Unauthenticated users never pay Quill initialization cost

**Slice 2 — window.* globals → event delegation**
- Before: 5 functions polluting `window` namespace, HTML onclick strings
- After: 4 converted to proper scope; event delegation on nav tabs + posts table + dialog
- Pattern: `data-panel`, `data-action="delete"` attribute-based delegation
- Remaining: `window.editPost` (next slice), `window.updateRole` shim (dynamic HTML constraint)

## Execution Notes
- Ralph + /team mode: 2 executor agents ran in parallel (non-overlapping line ranges)
- Agent A: lines 737-803 (Quill scope) + line 915 (auth callback)
- Agent B: lines 931, 1023-1025, 1056-1076, 1122 (window.* + HTML templates)
- Verification: 1 iteration, score 1.0

## Open Items
| Item | Priority | Notes |
|------|----------|-------|
| `window.editPost` removal | Medium | Requires coordinating quill scope + data-action="edit" delegation |
| Slice 3 section markers | Low | Mechanical comment cleanup |
| CSS extraction | Low | 700-line inline style → `assets/css/admin.css` |
| JS module separation | Future | `assets/js/admin.js` (no build system needed for GitHub Pages) |
| Verify with Lighthouse | Medium | Measure actual FCP improvement after deploy |
