# EGLab Knowledge Base — Index

> Evolutionary Game LAB · Hongik University · eglabsid.github.io

## Navigation

- [log.md](log.md) — chronological activity log
- [AGENTS.md](AGENTS.md) — wiki operating contract and schema

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
**Firestore collections**: `blog_posts`, `users`
**Admin panel**: `/admin/` (Google OAuth + role-based access)
**Blog**: `/student-blog.html`

## Setup Notes

Firebase credentials (apiKey, appId, messagingSenderId) must be filled in from:
Firebase Console → Project Settings → Your apps → Web app config
See ADMIN_SETUP.md for full instructions.
