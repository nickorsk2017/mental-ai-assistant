# Tooling

Commands assume the repository root unless noted. Primary entrypoint: **`Makefile`** (`make help`).

## Prerequisites

| Tool | Purpose |
|------|---------|
| **Node.js 22+** | Web, mobile, backend |
| **pnpm 10.33.2** | Frontend workspaces + Nest (`packageManager` in package manifests) |
| **Python 3.12+** and **[uv](https://docs.astral.sh/uv/)** | AI agents (`ai-agents/app/`) |
| **Docker + Compose** | Kafka (`make kafka-install`), full stack (`make docker-up`) |

Environment: copy **`_common/.env.example`** → **`_common/.env`** (see [`README.md`](../README.md)).

## Install

| Command | Description |
|---------|-------------|
| `make install` | Husky hooks (if configured), backend, frontend workspace, ui-kit filter, mobile, `uv sync` for ai-agents |
| `make backend-install` | `pnpm install` in `backend/app` |
| `make frontend-install` | `pnpm install` in `frontend` |
| `make ui-kit-install` | `pnpm --filter @common/shared install` |
| `make mobile-install` | `pnpm install` in `frontend/mobile` |
| `make ai-agents-install` | `uv sync --directory ai-agents/app --group dev` |

## Local development

| Command | Description |
|---------|-------------|
| `make backend` | NestJS API on port **4000** |
| `make web` | Next.js web on **3000** |
| `make mobile` | Ionic/Vite shell on **8100** — open in a browser with **mobile emulation** (narrow viewport); DevTools device toolbar / responsive mode |
| `make ai-agents` / `make ai` | FastAPI AI service (`AI_AGENTS_PORT`, default **8080**) |
| `make storybook` | Ui-kit Storybook on **6006** |
| `make fullstack-web` | Kafka + **Web + Backend + AI** (API, Next.js, ai-agents) |
| `make fullstack-mobile` | Kafka + **Backend + Mobile + AI** (API, Ionic dev server, ai-agents) |
| `make start-all` | Kafka + web + mobile + API + ai-agents (both clients) |

Kafka alone: `make kafka-install` (broker **9092**), `make kafka-stop`.

## Quality gates

| Command | Description |
|---------|-------------|
| `make lint` / `make lint-fix` | ESLint backend + web + mobile |
| `make test` | Jest (backend, web, `@common/shared`, mobile) + pytest (`ai-agents`) |
| `make test-*` | Per-package tests (see `make help`) |
| `make ci` | Lint + tests + backend build + frontend `typecheck` (matches CI) |
| `make pre-commit-check` | Lint + tests (pre-commit hook) |

## Database migrations

You **must** apply migrations to Supabase before using features that persist data there (patient notes, chat message storage, journaling consumers writing to configured tables).

1. Fill **`_common/.env`** with Supabase credentials. The migration script uses **`SUPABASE_MIGRATE_DB_URL`** if set, otherwise **`SUPABASE_DB_URL`** (see **`_common/.env.example`**).
2. From the repository root:

```bash
make supabase-migrate
```

This runs `backend/app`’s `migrate:supabase` script (`scripts/run-supabase-migrations.ts`) and executes SQL files in **`_common/migrations/`** in order.

| Command | Description |
|---------|-------------|
| `make supabase-migrate` | Apply `_common/migrations/*.sql` to the database selected by env vars |

Repeat **`make supabase-migrate`** after pulling migration additions from git (new `.sql` files).

## Docker (Compose)

| Command | Description |
|---------|-------------|
| `make docker-build` | `docker compose build` |
| `make docker-up` | `docker compose up --build` |
| `make docker-down` | `docker compose down` |
| `make docker-restart` | Rebuild and restart |

Services are defined in **`docker-compose.yml`** at the repo root (see [`README.md`](../README.md#docker)).

## Ports (kill helpers)

`make kill-backend-ports` (4000), `kill-frontend-ports` (3000), `kill-mobile-ports` (8100), `kill-ai-agents-ports`, `kill-storybook-ports` (6006), `kill-all-ports`.

## CI

GitHub Actions runs **`make ci`** on push/PR (`.github/workflows/validate.yml`): install with frozen lockfiles, then lint, tests, backend build, frontend typecheck.
