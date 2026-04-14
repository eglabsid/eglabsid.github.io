# admin/index.html — Performance & Refactor Session (2026-04-14)

## Context
Site: eglabsid.github.io (EGLab Student Blog Platform)
Stack: Jekyll + Firebase (saas-of-funqa) + GitHub Pages
Hot paths by access frequency: admin/index.html (41x), _pages/archive.html (15x), student-blog.html (13x)

## Performance Fixes Applied

### Fix 1 — Quill.js render-blocking removed
File: admin/index.html line 16
Before: `<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>`
After:  `<script src="https://cdn.quilljs.com/1.3.7/quill.min.js" defer></script>`
Rationale: Quill (~400KB) was blocking HTML parser on every page load including unauthenticated visitors.

### Fix 2 — Google Fonts missing preconnect
File: admin/index.html line 11
Added: `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
Rationale: fonts.gstatic.com is the actual font CDN; only fonts.googleapis.com had preconnect, causing DNS/TLS delay on the font file requests.

### Fix 3 — Search input debounce
File: student-blog.html lines 301-307
Before: direct `applyFilters()` on every input event
After: 200ms debounce via clearTimeout/setTimeout
Rationale: Every keystroke was triggering full innerHTML replacement of the posts grid, causing unnecessary DOM reparse/reflow.

## Refactoring Applied

### Slice 1 — Quill lazy initialization
File: admin/index.html
Change: `const quill = new Quill(...)` at module top-level → `let quill = null` + `function initEditor()` called inside `onAuthStateChanged` success path.
Guard: `if (quill) return` prevents double-initialization.
Impact: Quill no longer initializes for unauthenticated visitors.

### Slice 2 — window.* global removal
File: admin/index.html
Removed globals: window.showPanel, window.confirmDelete, window.closeDialog, window.updateRole
Method: converted to regular functions + addEventListener / event delegation
- nav-tab buttons: data-panel attribute + querySelectorAll delegation
- delete buttons: data-action="delete" + postsTableBody click delegation
- dialog: dialogCancelBtn addEventListener
- updateRole: window.updateRole = updateRole shim retained for dynamic users table onchange
window.editPost: intentionally left for separate slice (quill scope dependency)

## Verification Evidence
- grep -n "const quill" → 0 results (lazy init confirmed)
- grep -n "window\." → only window.editPost + updateRole shim remain
- grep -n "onclick=" → only editPost inline handler remains
- All nav-tab data-panel delegation wired
- postsTableBody data-action="delete" delegation confirmed
