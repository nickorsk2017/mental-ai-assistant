# AGENTS.md — Mobile App (`frontend/mobile/`)

Rules specific to the Ionic React mobile application.
Also read: [`../../AGENTS.md`](../../AGENTS.md) (global) and [`../_common/AGENTS.md`](../_common/AGENTS.md) (shared frontend).

---

## Structure

```
frontend/mobile/
├── src/
│   ├── features/   # Mobile-only feature components
│   ├── pages/      # Route-level Ionic pages
│   ├── theme/      # Ionic theme variables and global styles
│   ├── App.tsx
│   └── main.tsx
├── capacitor.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## Rule — Shared Logic

- Business hooks, stores, services, schemas, and ui-kit components live in `frontend/_common/`. Shared `Entity.*` types live in `_common/types/` at the repository root.
- Mobile code imports shared functionality through `@common/shared/*`.
- Mobile pages and feature components may contain Ionic routing and layout concerns only.

---

## Rule — Platform Boundaries

- Do not import from `next/*` or `frontend/web/`.
- Do not define local services or Zustand stores in `frontend/mobile/`.
- Platform-specific behavior belongs in `src/features/` or `src/pages/`, not in `frontend/_common/`.

---

## Mobile Pre-PR Checklist

- [ ] Mobile code does not import from `frontend/web/` or `next/*`
- [ ] Shared business logic is in `frontend/_common/`
- [ ] Route-level screens live under `src/pages/`
- [ ] Reusable mobile-only components live under `src/features/`
- [ ] `pnpm --filter mobile build` passes
