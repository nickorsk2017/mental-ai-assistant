# AGENTS.md — Shared Frontend (`frontend/_common/`)

Rules for the code shared between `frontend/web/` and `frontend/mobile/`.
Also read: [`../../AGENTS.md`](../../AGENTS.md) (global rules).

---

## Structure

```
frontend/_common/
├── hooks/      # Business logic hooks (store wiring, derived state, side effects)
├── services/   # Raw async API/Supabase functions consumed by hooks and apps
├── stores/     # Zustand state stores
└── utils/      # Pure helper functions
```

---

## Rule — Services (`services/`)

Services are the **only** place where external APIs or Supabase are called.
Both web and mobile import from `@common/services` — there is no local `services/` in either app.

### Contract

- Plain `async` functions — no React, no hooks, no JSX
- Always return `Entity.ApiResponse<T>` — never throw to callers
- Receive only primitive arguments — no framework objects

```typescript
// ✅ frontend/_common/services/AuthService.ts
export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<Entity.ApiResponse<{ user: Entity.User; session: Entity.SupabaseSession }>> {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return { success: false, data: null as never, error: error.message };
  return { success: true, data: { user: mapUser(data.user), session: mapSession(data.session) }, error: null };
}
```

### Naming

`[Domain]Service.ts` — one file per domain:

| File | Responsibility |
|---|---|
| `AuthService.ts` | Supabase auth: sign-in, sign-out, session |
| `UserService.ts` | User CRUD via REST or Supabase |

### Import alias

```typescript
import { signInWithEmailAndPassword } from '@common/services/AuthService';
```

---

## Rule — Hooks (`hooks/`)

Hooks orchestrate services and stores. They contain all business logic.

### What belongs here

Every hook must do at least one of:
- Call a function from `@common/services`
- Read from or write to a Zustand store
- Derive or transform data from store state
- Coordinate async side effects (subscriptions, polling, timers)

### No platform imports

`hooks/` must never import from `next/*`, `react-native`, or any platform-specific package.
Hooks run identically in web and mobile.

### Naming

`use[Domain][Action].ts` — camelCase, no hyphens:

| File | Responsibility |
|---|---|
| `useAuthentication.ts` | Login, logout, session restore |
| `useUserList.ts` | Fetch paginated users, infinite scroll |
| `useApiFetch.ts` | Generic loading/error wrapper for one-shot requests |

---

## Rule — Stores (`stores/`)

- File pattern: `use[Domain]Store.ts` — camelCase, no hyphens
- Both `frontend/web/` and `frontend/mobile/` import stores **only** from here
- No local Zustand stores in `web/` or `mobile/`
- Use `persist` middleware only for data that must survive a page refresh

---

## Rule — Shared types (`_common/types/`)

Shared `Entity.*` declarations live in **`_common/types/`** at the repository root (not under `frontend/_common/`). See global [`AGENTS.md`](../../AGENTS.md) Rule 4. Web and mobile resolve them via `@common/types/*` path aliases in their `tsconfig.json` files.

---

## Rule — Utils (`utils/`)

- Pure functions only — no React, no side effects
- No imports from `hooks/`, `stores/`, or `services/`
- One file per domain: `currency-formatter.ts`, `date-formatter.ts`

---

## Shared Frontend Pre-PR Checklist

- [ ] All external API/Supabase calls are in `services/` — not in hooks or components
- [ ] Services return `Entity.ApiResponse<T>` and never throw
- [ ] No hook imports from `next/*` or `@ionic/*`
- [ ] No Zustand store defined outside `stores/`
- [ ] Shared `Entity.*` edits happen only in `_common/types/*.d.ts`
- [ ] `utils/` functions are pure — no side effects, no React
