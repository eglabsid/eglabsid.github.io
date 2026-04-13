# EGLab Blog — llm-wiki Operating Contract

## Project
- **Site**: eglabsid.github.io (Evolutionary Game LAB, Hongik University)
- **Stack**: Jekyll static site on GitHub Pages + Firebase Firestore + Firebase Auth
- **Firebase project**: `saas-of-funqa`
- **Collections**: `blog_posts` (student research posts), `users` (role: pending/writer/admin)

## Schema Rules

### Source files (raw/)
- Raw sources are immutable. Never edit files under `raw/`.
- One file per source. Name: `YYYYMMDD-slug.md`

### Wiki files (wiki/)
- `wiki/sources/` — one summary page per raw source
- `wiki/entities/` — persistent pages for people, labs, institutions
- `wiki/concepts/` — persistent pages for recurring research concepts (evolutionary game theory, etc.)
- `wiki/queries/` — filed answers to ad-hoc questions
- `wiki/reports/` — high-value synthesis outputs

### Cross-linking
- Always use `[[WikiLinkStyle]]` or `[text](relative-path.md)` for internal links
- Every wiki page must link back to its source summary

### index.md
- Must stay current. Update index whenever a new entity, concept, or report is added.

### log.md
- Append only. Log every ingest, edit, or query-filing with ISO date.

## Maintenance
- Run lint pass monthly: check broken links, orphan pages, stale claims
- Archive raw sources when superseded; do not delete
