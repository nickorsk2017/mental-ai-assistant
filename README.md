# Mental Health Monorepository

Monorepo for the Mental Health web app, Ionic mobile app, NestJS backend API, and shared frontend packages.

## Structure

```
.
├── frontend/
│   ├── web/          # Next.js 16 + Tailwind CSS
│   ├── mobile/       # Ionic 8 + Capacitor + Vite
│   └── _common/      # Shared hooks, services, stores, ui-kit, themes, utils
├── backend/
│   └── app/          # NestJS API (port 4000)
├── ai-agents/
│   └── app/          # FastAPI + LangChain (chat stream + Kafka consumer → Supabase notes)
├── _common/
│   ├── types/        # Shared Entity.* TypeScript declarations (web, mobile, backend)
│   ├── migrations/   # Supabase SQL migrations
│   ├── eslint/       # Shared ESLint config
│   ├── .env          # Environment variables (not committed)
│   └── .env.example  # Template — copy and fill in
├── docs/             # Tooling notes and architecture supplements
└── docker-compose.yml
```

## Requirements

- Node.js 22+
- pnpm 10.33.2
- Python 3.12+ and [uv](https://docs.astral.sh/uv/) (for `ai-agents/app` and `make ai-agents-install`)
- Docker + Docker Compose (Kafka in `make kafka-*`, full stack via Compose)
- Makefile (primary command reference; see [`docs/tooling.md`](docs/tooling.md))

---

## Getting started with Docker

This is the minimal path to run the full stack in Docker and open the web application in your browser.

### 1. Configure `_common/.env`

1. Copy the environment template:

   ```bash
   cp _common/.env.example _common/.env
   ```

2. Open **`_common/.env`** in an editor. You only need to fill in **Supabase** credentials and **OpenAI**; leave the rest of the file **unchanged** from the template unless you know you need different ports or URLs.

   **You must set:**

   | Variable | Purpose |
   |----------|---------|
   | `SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key from the Supabase dashboard |
   | `SUPABASE_SECRET_KEY` | Secret (service role) key — keep private |
   | `SUPABASE_DB_URL` | Direct Postgres connection string (from Supabase) |
   | `SUPABASE_MIGRATE_DB_URL` | Prefer the **Session pooler** URI for migrations when direct `db.*` access is awkward (see comments in `.env.example`) |
   | `OPENAI_API_KEY` | API key for OpenAI (used by the AI agents service) |

   All other variables in `.env.example` (ports, `BACKEND_CORS_ORIGIN`, Kafka, compose overrides, etc.) can stay as provided for a standard local Docker run.

### 2. Start all services

From the **repository root**:

```bash
make docker-run-all
```

This runs `docker compose` with **`_common/.env`**, rebuilds images if needed, and starts **Kafka**, **api** (NestJS), **web** (Next.js), **mobile** (Vite shell), and **ai-agents** (FastAPI). The first run may take several minutes while images build.

### 3. Open the web app

In your browser, open:

**http://localhost:3000**

(`WEB_PORT` in `_common/.env` defaults to `3000`; change the URL if you changed that port.)

### Optional: database migrations

If you see errors about missing tables when using auth, notes, or chat journaling, apply Supabase SQL migrations **once** per database (with the same `_common/.env`):

```bash
make supabase-migrate
```

### Troubleshooting

If Docker is running, ports are not blocked by another process, and you have set Supabase + OpenAI as above, but something still fails, you can reach the author on Telegram: **[@niclstepdev](https://t.me/niclstepdev)**.

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

### 3. Database migrations (Supabase)

SQL lives in **`_common/migrations/`**. Apply it to your Supabase Postgres after **`_common/.env`** has valid database URLs — at minimum **`SUPABASE_DB_URL`** or **`SUPABASE_MIGRATE_DB_URL`** (pooler URI is recommended when direct DB access is blocked; see **`_common/.env.example`**).

```bash
make supabase-migrate
```

Run this **once per environment** (new database or fresh clone) before relying on patient chat, notes, or Kafka-backed journaling — otherwise tables may be missing.

---

## Run locally (Recommended)

### Web + Backend + AI

```bash
make fullstack-web
```

Runs **Kafka** (via embedded `make kafka-install`), then **API**, **Next.js web**, and **AI agents** (FastAPI).

| Service | URL |
|---|---|
| Web | http://localhost:3000 |
| API | http://localhost:4000 |
| AI agents | http://localhost:8080 (see `AI_AGENTS_PORT` in `_common/.env`) |
| Kafka | localhost:9092 (broker started automatically by this command) |

### Backend + Mobile + AI

```bash
make fullstack-mobile
```

Runs **Kafka** (via embedded `make kafka-install`), then **API**, **Ionic dev server**, and **AI agents**.

| Service | URL |
|---|---|
| Ionic dev server | http://localhost:8100 |
| API | http://localhost:4000 |
| AI agents | http://localhost:8080 (see `AI_AGENTS_PORT` in `_common/.env`) |
| Kafka | localhost:9092 (broker started automatically by this command) |

### Web + Mobile + Backend + AI

```bash
make start-all
```

Runs **Kafka** (via embedded `make kafka-install`), then **API**, **web**, **mobile**, and **AI agents** — both clients plus the same stack as above.

| Service | URL |
|---|---|
| Web | http://localhost:3000 |
| Ionic dev server | http://localhost:8100 |
| API | http://localhost:4000 |
| AI agents | http://localhost:8080 (see `AI_AGENTS_PORT` in `_common/.env`) |
| Kafka | localhost:9092 (broker started automatically by this command) |

### Individual services

```bash
make backend    # API  (:4000)
make web        # Web  (:3000)
make mobile     # Ionic dev server (:8100)
make ai-agents  # AI service (:8080 by default)
```

**Mobile dev in the browser:** after `make mobile`, open **http://localhost:8100** in a desktop browser with **mobile device emulation** enabled (for example Chrome DevTools → **Toggle device toolbar** / responsive mode, or Safari Web Inspector device presets). The Ionic shell is built for narrow viewports; full desktop width often looks wrong or hides mobile-only layouts.

---

## Docker

`docker-compose.yml` defines **api** (NestJS), **web** (Next.js), **mobile** (Vite shell), **ai-agents** (FastAPI), and **Kafka**. Published ports typically include **4000**, **3000**, **8100**, **8080**, **9092**. For day-to-day UI development you can still run **web** or **mobile** with `make` on the host and only use Compose for Kafka or full integration.

```bash
make docker-run-all   # Down stack, free Kafka port if needed, build and start (detached)
make docker-stop-all  # Stop, remove containers and compose images
```

---

## Tooling

Lint, tests, `make` targets, migrations, and CI parity: **[`docs/tooling.md`](docs/tooling.md)**.

### Git hooks (local commits)

After `make install` or `pnpm install` at the **repository root**, [Husky](https://typicode.github.io/husky/) registers a pre-commit hook that runs `make pre-commit-check` (lint + unit tests in backend, web, mobile). A commit is rejected if that command fails.

To bypass the hook in emergencies (avoid habitually): `HUSKY=0 git commit …`.

### GitHub (remote checks)

Workflows [`.github/workflows/validate.yml`](.github/workflows/validate.yml) (default branch PRs/pushes) and [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (all branches) run **`make ci`** (lint, tests, backend TypeScript build, frontend workspace typecheck).

In GitHub: **Settings → Rules → Rulesets** for the default branch (or **Branches → Branch protection**), enable **Require status checks to pass** and select the workflow jobs you rely on so merges are blocked when CI fails.

---

## Architecture

The repository is split into two strict runtime zones:

- **Frontend zone**: `frontend/web`, `frontend/mobile`, `frontend/_common`
- **Backend zone**: `backend/app`, root `_common` (`.env`, `migrations/`, `eslint/`, shared **`types/`** for `Entity.*` contracts)

Frontend code never imports backend source directly. Communication is HTTP-only through the API.

### Chat, Kafka, journaling

The API proxies streaming chat to **AI agents** (`AI_AGENTS_BASE_URL`) and publishes the same journal payload to **Kafka**. The Python service consumes Kafka and writes **Supabase** patient notes asynchronously. Apply **`_common/migrations/`** first (**`make supabase-migrate`**). Details: [`docs/chat-journaling.md`](docs/chat-journaling.md).

### Frontend layering model

Both clients (`web` and `mobile`) are thin shells. Shared logic is centralized in `frontend/_common`.

```text
Web (Next.js) / Mobile (Ionic)
  -> frontend/_common/ui-kit        (shared presentational components)
  -> frontend/_common/hooks         (feature orchestration and side effects)
  -> frontend/_common/stores        (Zustand global state)
  -> frontend/_common/services       (API client and auth/session calls)
  -> Backend API                    (NestJS endpoints)

Shared `Entity.*` types: `_common/types/*.d.ts` (repository root), referenced by web/mobile tsconfig and by Nest via `backend/app/src/shared-entity-types.d.ts`.
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

Rules for usage:

1. Place business logic in `_common/hooks` or `_common/services`, not in page components.
2. Keep web/mobile pages as thin wrappers around `_common` hooks and UI-kit.
3. Reuse existing `_common` modules before creating app-specific duplicates.

### `_common/types` (repository root)

Shared `Entity.*` TypeScript declaration files (`.d.ts`) consumed by **web**, **mobile**, and **`backend/app`** so HTTP and domain shapes stay aligned.

### Authentication and redirect flow

1. UI shell renders shared auth/dashboard organisms from `_common/ui-kit`.
2. Form actions call shared hooks (`useAuthentication`, `useSignUp`).
3. Hooks call shared service functions in `_common/services/AuthService.ts`.
4. Service hits backend `/auth/*` endpoints and updates auth store.
5. Route guards redirect:
   - authenticated users → **`/patient-panel/chat`** (patient dashboard shell)
   - unauthenticated users → **`/auth`**

This keeps business logic in one place and prevents feature divergence between web and mobile.

## Copyright

Copyright © Nikolai Stepanov. All rights reserved.
