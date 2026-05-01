# Serene Monorepository

Monorepo for the Serene web app, Ionic mobile app, NestJS backend API, and shared frontend packages.

## Structure

```
.
├── frontend/
│   ├── web/          # Next.js 16 + Tailwind CSS
│   ├── mobile/       # Ionic 8 + Capacitor + Vite
│   └── _common/      # Shared hooks / services / stores / ui-kit / themes / types
├── backend/
│   └── app/          # NestJS API (port 4000)
├── _common/
│   ├── .env          # Environment variables (not committed)
│   └── .env.example  # Template — copy and fill in
└── docker-compose.yml
```

## Requirements

- Node.js 22+
- pnpm 10.33.2
- Docker + Docker Compose (for containerised workflow)
- Makefile

---

## Quick start

### 1. Environment

```bash
cp _common/.env.example _common/.env
# Fill in Supabase keys, URLs, and ports
```

### 2. Install

```bash
make install
```

If the pnpm store is inconsistent, reset cleanly:

```bash
pnpm store prune
rm -rf frontend/node_modules frontend/mobile/node_modules backend/app/node_modules
```

---

## Run locally (Recommended)

### Backend + Web

```bash
make fullstack-web
```

| Service | URL |
|---|---|
| Web | http://localhost:3000 |
| API | http://localhost:4000 |

### Backend + Mobile

```bash
make fullstack-mobile
```

| Service | URL |
|---|---|
| Ionic dev server | http://localhost:8100 |
| API | http://localhost:4000 |

### Individual services

```bash
make backend   # API  (:4000)
make web       # Web  (:3000)
make mobile    # Ionic dev server (:8100)
```

---

## Docker

Runs **web** and **api** only. The mobile app runs locally via Vite and is deployed as a native app through Capacitor.

```bash
make docker-build    # Build images
make docker-up       # Build and start
make docker-down     # Stop
make docker-restart  # Stop, rebuild, start
```

---

## Mobile — Capacitor native builds

```bash
make mobile-build           # Build frontend/mobile bundle
make mobile-capacitor-sync  # Build + sync to native platforms
make mobile-run-android     # Build + sync + run on Android
make mobile-run-ios         # Build + sync + run on iOS
```

---

## Build

```bash
pnpm --dir backend/app build
pnpm --dir frontend/web build
pnpm --dir frontend/mobile build
```

---

## Lint

Shared lint rules are centralized in `_common/eslint/base.cjs` and reused by backend, web, and mobile ESLint flat configs.

Run linters for all apps:

```bash
make lint
```

Auto-fix lint issues for all apps:

```bash
make lint-fix
```

Run linter per app:

```bash
pnpm --dir backend/app lint
pnpm --dir frontend/web lint
pnpm --dir frontend/mobile lint
```

Pre-commit checks:

```bash
make pre-commit-check
```

Git commits also run this automatically through the repository `pre-commit` hook.

CI-equivalent local check:

```bash
make ci
```

---

## Environment variables

| Prefix | Used by |
|---|---|
| `SUPABASE_*` | Backend API (server-side) |
| `NEXT_PUBLIC_*` | Next.js web (client + server) |
| `BACKEND_URL` | Server-side fetch in Next.js — use `http://api:4000` inside Docker |
| `BACKEND_PORT` | API listen port (default `4000`) |

---

## Architecture

The repository is split into two strict runtime zones:

- **Frontend zone**: `frontend/web`, `frontend/mobile`, `frontend/_common`
- **Backend zone**: `backend/app`, root `_common` env and infra files

Frontend code never imports backend source directly. Communication is HTTP-only through the API.

### Frontend layering model

Both clients (`web` and `mobile`) are thin shells. Shared logic is centralized in `frontend/_common`.

```text
Web (Next.js) / Mobile (Ionic)
  -> _common/ui-kit        (shared presentational components)
  -> _common/hooks         (feature orchestration and side effects)
  -> _common/stores        (Zustand global state)
  -> _common/services      (API client and auth/session calls)
  -> Backend API           (NestJS endpoints)
```

### Responsibilities by package

- `frontend/web`
  - Next.js routing, server rendering concerns, web-only adapters
  - Uses shared `_common` hooks/services/ui-kit for feature behavior
- `frontend/mobile`
  - Ionic shell (`IonApp`, router/outlet), Capacitor integration, mobile navigation
  - Reuses shared `_common` feature logic and UI components
- `backend/app`
  - NestJS API, auth/session endpoints, CORS and env-driven runtime config

### `frontend/_common` (shared frontend core)

`frontend/_common` is the single source of truth for reusable frontend behavior shared by **both** clients (web and mobile).

- `frontend/_common/ui-kit`
  - Reusable atoms/molecules/organisms consumed by both apps
  - Visual tokens come from `frontend/_common/themes/calm-theme.ts`
- `frontend/_common/hooks`
  - Feature orchestration and side effects (for example auth flows)
  - Composes services + stores instead of embedding API logic in pages
- `frontend/_common/services`
  - API transport layer (`fetch`, backend URL resolution, response mapping)
  - Keeps request/response contracts centralized
- `frontend/_common/stores`
  - Zustand global state (session, user, cross-screen state)
- `frontend/_common/types`
  - Shared type contracts used by web, mobile, and backend integration points

Rules for usage:

1. Place business logic in `_common/hooks` or `_common/services`, not in page components.
2. Keep web/mobile pages as thin wrappers around `_common` hooks and UI-kit.
3. Reuse existing `_common` modules before creating app-specific duplicates.

### Authentication and redirect flow

1. UI shell renders shared auth/dashboard organisms from `_common/ui-kit`.
2. Form actions call shared hooks (`useAuthentication`, `useSignUp`).
3. Hooks call shared service functions in `_common/services/AuthService.ts`.
4. Service hits backend `/auth/*` endpoints and updates auth store.
5. Route guards redirect:
   - authenticated users -> `/dashboard`
   - unauthenticated users -> `/auth`

This keeps business logic in one place and prevents feature divergence between web and mobile.
