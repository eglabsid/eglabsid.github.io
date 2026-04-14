# EGLab Knowledge Base — Index

> Evolutionary Game LAB · Hongik University · eglabsid.github.io

## Navigation

- [log.md](log.md) — chronological activity log
- [AGENTS.md](AGENTS.md) — wiki operating contract and schema
- [wiki/reports/ui-tone-refresh-report.md](wiki/reports/ui-tone-refresh-report.md) — April 14, 2026 public page tone refresh

## Wiki Sections

| Section | Path | Contents |
|---------|------|----------|
| Source Summaries | [wiki/sources/](wiki/sources/) | Per-source LLM summaries |
| Entities | [wiki/entities/](wiki/entities/) | People, labs, institutions |
| Concepts | [wiki/concepts/](wiki/concepts/) | Research concepts (EGT, Game AI, etc.) |
| Queries | [wiki/queries/](wiki/queries/) | Filed answers to ad-hoc questions |
| Reports | [wiki/reports/](wiki/reports/) | Synthesis reports |

## Project Overview

The EGLab Student Blog Platform is a Jekyll static site deployed on GitHub Pages.
Students publish academic research posts via an admin panel backed by Firebase Firestore.

**Firebase project**: `saas-of-funqa`
**Firestore collections**: `blog_posts`, `users`, `llm_wiki`
**Admin panel**: `/admin/` (Google OAuth + role-based access)
**Blog**: `/student-blog.html`

## Setup Notes

Firebase credentials (apiKey, appId, messagingSenderId) must be filled in from:
Firebase Console → Project Settings → Your apps → Web app config
See ADMIN_SETUP.md for full instructions.

## Recent Reports

- [Admin Perf & Refactor Report](wiki/reports/admin-perf-refactor-report.md) — Quill defer, fonts preconnect, search debounce, Quill lazy init, window.* removal (2026-04-14)
- [UI Tone Refresh Report](wiki/reports/ui-tone-refresh-report.md) — home poster cards, archive cleanup, and student post shell alignment (2026-04-14)
