# AGENTS.md — Backend

NestJS monolithic API. Single publicly-exposed service on port 4000 handles all routing, authentication, and business logic.

---

## Service

| Service | Port | Publicly Exposed | Purpose |
|---|---|---|---|
| `api` | 4000 | Yes (→ 4000) | Authentication, user profile, all business logic |

---

## Rule B1 — Module Ownership

Each domain lives in its own directory under `src/` with exactly four files: module, controller, service, types.

| File | Rule |
|---|---|
| `<domain>.module.ts` | Declares imports, providers, controllers, exports |
| `<domain>.controller.ts` | HTTP bindings only — no business logic |
| `<domain>.service.ts` | All business logic and database calls |
| `<domain>.types.ts` | Local-only types; shared types go to `frontend/_common/types/` |

Never put business logic in a controller. Never put HTTP concerns in a service.

---

## Rule B2 — Authentication Guard

`SupabaseAuthenticationGuard` must be applied with `@UseGuards()` — never globally registered on the app.

- **Public routes** (no guard): `POST /auth/sign-in`, `POST /auth/sign-up`
- **Protected routes** (`@UseGuards(SupabaseAuthenticationGuard)`): all other endpoints

The guard validates the JWT using the admin client, then injects `x-user-id` and `x-user-email` into the request headers. Controllers on protected routes read the caller's identity via `@Headers('x-user-id')` — never re-validate the token inside a service.

To guard a whole controller: `@UseGuards(SupabaseAuthenticationGuard)` on the class.
To guard a single method: `@UseGuards(SupabaseAuthenticationGuard)` on the method.

---

## Rule B3 — Supabase Client Usage

`SupabaseService` exposes two clients. Use the correct one for each operation:

| Client | Getter | Key | Use For |
|---|---|---|---|
| Public | `supabaseService.authClient` | `SUPABASE_PUBLISHABLE_KEY` | User-facing auth (sign-in, sign-up, sign-out) |
| Admin | `supabaseService.adminClient` | `SUPABASE_SECRET_KEY` | JWT validation, DB queries that bypass RLS |

Never instantiate a Supabase client directly — always inject `SupabaseService`.

---

## Rule B4 — Response Envelope

Every endpoint must return `ServiceResponse<T>` using the builders in `src/utils/response.builder.ts`.

```typescript
{ success: true, data, error: null }
{ success: false, data: null, error: 'message' }
```

Never return raw objects. Never throw HTTP exceptions from services — return an error response instead.

---

## Routes

**Public** — no JWT required:

| Method | Path |
|---|---|
| `GET` | `/health` |
| `POST` | `/auth/sign-in` |
| `POST` | `/auth/sign-up` |

**Protected** — valid Supabase JWT required:

| Method | Path |
|---|---|
| `POST` | `/auth/sign-out` |
| `GET` | `/users/me` |
| `PATCH` | `/users/me` |

---

## Request Lifecycle

1. Client sends request to `:4000`.
2. `SupabaseAuthenticationGuard` (on protected routes) validates `Authorization: Bearer <jwt>` using the admin client.
3. Guard injects `x-user-id` and `x-user-email` into the request headers.
4. Controller reads those headers and delegates to the service.
5. Service returns `ServiceResponse<T>` via response builder.

---

## Environment Variables

Loaded from `/_common/.env` via Docker `env_file`. Copy `_common/.env.example` → `_common/.env` for local dev.

```
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
BACKEND_PORT=4000
BACKEND_CORS_ORIGIN=http://localhost:3000
```

---

## Development

### First-time setup (generates pnpm-lock.yaml — commit it)

```bash
cd backend/app && pnpm install
```

### Run locally

```bash
cd backend/app && pnpm dev   # :4000
```

### Run via Docker Compose

```bash
docker compose up --build api
```

---

## Adding a New Domain

1. Create `backend/app/src/<domain>/` with the four standard files.
2. Import `SupabaseModule` in the domain module.
3. Import `AuthenticationModule` if any routes need the guard (it exports `SupabaseAuthenticationGuard`).
4. Apply `@UseGuards(SupabaseAuthenticationGuard)` on protected controllers or methods.
5. Register the new module in `src/app.module.ts` imports.
6. Document new env vars in `_common/.env.example` and this file.

---

## File Structure

```
backend/
└── app/
    ├── Dockerfile
    ├── package.json
    ├── pnpm-lock.yaml
    ├── tsconfig.json
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── health/               GET /health
        ├── supabase/             SupabaseService (authClient + adminClient)
        ├── response/             response.builder.ts
        ├── authentication/       sign-in, sign-up, sign-out, SupabaseAuthenticationGuard
        └── user/                 GET /users/me, PATCH /users/me
```
