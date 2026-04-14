# EGLab Wiki Activity Log

<!-- Append entries below. Format: YYYY-MM-DD | action | description -->

2026-04-13 | bootstrap | llm-wiki vault created for eglabsid.github.io project
2026-04-13 | setup | Firebase project wired: saas-of-funqa (projectId, authDomain, storageBucket updated)
2026-04-13 | setup | Firestore rules updated in saas-of-funqa: blog_posts and users collections added
2026-04-13 | add | llm_wiki Firestore collection wired to Firebase saas-of-funqa; added DB_COLLECTIONS.LLM_WIKI to firebase-config.js; created llm-wiki-service.js client module; added Playwright tests
2026-04-14 | report | UI tone refresh logged for home poster cards, archive cleanup, and student post branded shell
2026-04-14 | perf | admin/index.html: Quill defer added (render-block removed), fonts.gstatic.com preconnect added
2026-04-14 | perf | student-blog.html: 200ms search debounce added (per-keystroke DOM reflow eliminated)
2026-04-14 | refactor | admin/index.html Slice1: Quill lazy init via initEditor(), only runs after onAuthStateChanged success
2026-04-14 | refactor | admin/index.html Slice2: window.showPanel/confirmDelete/closeDialog/updateRole removed; event delegation added
2026-04-14 | ingest | raw/sources/20260414-admin-perf-refactor.md + wiki/sources + wiki/reports filed
2026-04-14 | refactor | admin/index.html Slice3: window.editPost removed; data-action="edit" delegation added; postsTableBody listener unified for edit+delete
2026-04-14 | verify | Playwright e2e run: 63/63 PASSED (Chromium, localhost:4000, 39.9s); all perf/refactor/LLM-Wiki changes confirmed green
2026-04-14 | feature | tags.html redesigned as D3 v7 force-directed knowledge graph; nodes = tags sized by post count; edges = co-occurrence; click = post panel
2026-04-14 | test | tags-graph.spec.js added (12 tests); fixed toggle logic bug (style.display check); full suite 82/82 PASSED
