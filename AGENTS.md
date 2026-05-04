# AGENTS.md — Global Architectural Rules

Single source of truth for rules that apply **everywhere** in this monorepo.
Each subdirectory has its own `AGENTS.md` — read both.

> Sub-guides:
> - [`frontend/web/AGENTS.md`](frontend/web/AGENTS.md) — Next.js web app
> - [`frontend/mobile/AGENTS.md`](frontend/mobile/AGENTS.md) — Ionic mobile app
> - [`frontend/_common/AGENTS.md`](frontend/_common/AGENTS.md) — Shared hooks, services, stores, ui-kit
> - [`backend/AGENTS.md`](backend/AGENTS.md) — NestJS API + migrations

---

## Repository Structure

```
/
├── frontend/
│   ├── package.json           # Workspace root — packageManager: pnpm@10.33.2
│   ├── pnpm-workspace.yaml    # Workspace package declarations
│   ├── pnpm-lock.yaml         # Committed lockfile — never edit manually
│   ├── tsconfig.json
│   ├── web/                   # Next.js + React + Tailwind
│   ├── mobile/               # Ionic (latest) + React
│   └── _common/               # hooks, services, stores, ui-kit, utils
├── backend/                   # NestJS API
├── ai-agents/                 # Python AI services
├── _common/                   # Shared config + contracts: migrations/, eslint/, types/, .env*
├── docker-compose.yml
├── .gitignore
└── .dockerignore
```

---

## Rule 1 — Repository Zones

Three permanent zones. Files must never cross zone boundaries.

| Zone | Paths | Purpose |
|---|---|---|
| **Frontend** | `frontend/` | Client-side: web, mobile, shared frontend logic |
| **Backend** | `backend/`, `_common/` | Server-side: API, migrations, env |
| **AI Agents** | `ai-agents/` | Python AI services |

- `backend/` must never import from `frontend/`
- `frontend/` must never import from `backend/` — only via HTTP calls
- `ai-agents/` must communicate with frontend/backend via HTTP, Kafka, or database contracts
- Root `_common/` holds shared server and cross-zone contracts: `migrations/`, `eslint/`, `types/`, and `.env*`
- `frontend/_common/` is client-only: `hooks/`, `services/`, `stores/`, `ui-kit/`, `utils/`

---

## Rule 2 — File Length

- **Maximum 200 lines per file.**
- `frontend/_common/services/AuthService.test.ts` may be up to 250 lines.
- Test files under `ai-agents/app/tests/` are exempt from the 200-line limit.
  Each file groups related test cases for one source module (mocks, fixtures,
  parametrized variants), and splitting it would obscure that mapping. The
  exemption applies **only to files matching `ai-agents/app/tests/test_*.py`**;
  production code under `ai-agents/app/src/` follows the 200-line rule.
- Decompose before the limit — extract hooks, utilities, or sub-components.
- A PR containing a file over its limit is rejected without review.

---

## Rule 3 — Naming Conventions

- **Zero abbreviations** in any identifier, file name, or folder name.
- **Frontend implementation files use CamelCase** — no hyphens in `.ts` / `.tsx` file names inside `frontend/`.
- Theme token files inside `frontend/_common/themes/` may use kebab-case.
- **Declaration files use kebab-case** — all `*.d.ts` files inside `frontend/` must use kebab-case.

| ❌ Forbidden | ✅ Required |
|---|---|
| `const v = ...` | `const currentValue = ...` |
| `map((t) => ...)` | `map((transaction) => ...)` |
| `catch (e)` | `catch (error)` |
| `fn`, `cb`, `res` | `handler`, `callback`, `response` |
| `use-authentication.ts` | `useAuthentication.ts` |
| `auth-service.ts` | `AuthService.ts` |
| `use-auth-store.ts` | `useAuthStore.ts` |
| `PatientPanel.d.ts` | `patient-panel.d.ts` |

---

## Rule 4 — TypeScript

### 4.1 — Where types live

**Shared / global types** → `_common/types/*.d.ts` at the repository root (inside `namespace Entity {}`). The NestJS app pulls them in via `backend/app/src/shared-entity-types.d.ts` (triple-slash references) so `rootDir` stays `./src`.

**Component prop types** → defined inline inside the same file as the component, not exported, not moved to `_common/types/`

```typescript
// ✅ Correct — props defined locally, not exported
interface ButtonProps {
  label: string;
  onClick: () => void;
}
export function Button({ label, onClick }: ButtonProps) { ... }

// ❌ Wrong — props exported or moved to _common/types
export interface ButtonProps { ... }
```

- No inline **exported** types in components, hooks, services, or controllers
- Import shared types via `import type { ... } from '@common/types/...'`

### 4.2 — Root Entity Namespace

Every type lives inside `declare global { namespace Entity {} }`:

```typescript
// _common/types/http.d.ts (example)
export {};
declare global {
  namespace Entity {
    interface ApiResponse<DataType> {
      success: boolean;
      data: DataType | null;
      error: string | null;
    }
    interface User {
      id: string;
      email: string;
      displayName: string;
      createdAt: string;
    }
  }
}
```

### 4.3 — Local `*.d.ts` files are allowed

Local declaration files are allowed inside feature/app packages when they are package-specific (for example framework typing gaps or local module augmentation).

The restriction applies only to shared entity contracts:

- Shared entity types used by **web**, **mobile**, and **backend** must live in `_common/types/*.d.ts`
- Shared entity types must remain inside `declare global { namespace Entity {} }`
- Do not duplicate shared entity contracts in app-local `*.d.ts` files

---

## Rule 5 — Frontend Controls

- All clickable button controls in `frontend/` must use `frontend/_common/ui-kit/Button`.
- Do not render raw `<button>` elements in web, mobile, or shared frontend UI unless you are implementing the `Button` component itself.
- Icon-only buttons still use `Button`; pass icon children and accessibility attributes such as `aria-label`.
- All text-like input controls in `frontend/` must use `frontend/_common/ui-kit/TextInput`.
- Do not render raw `<input>` elements in web, mobile, or shared frontend UI unless you are implementing the `TextInput` component itself.
- Multi-line form fields in `frontend/` must use `frontend/_common/ui-kit/TextArea`.
- Raw `<textarea>` is allowed only inside `TextArea` itself or specialized composer components such as `ChatInput`.
- Select/dropdown controls in `frontend/` must use `frontend/_common/ui-kit/Select`.
- Do not render raw `<select>` elements unless you are implementing the `Select` component itself.
- Modal dialogs in `frontend/` must use `frontend/_common/ui-kit/Modal`.
- Do not reimplement portal, overlay, body-scroll locking, modal header, or close button behavior in feature components.

---

## Rule 6 — Package Manager (pnpm)

**pnpm `10.33.2`** is the package manager for all services and workspaces.

### Common commands

```bash
pnpm install                        # install all workspace deps
pnpm add <pkg>                      # add a dependency
pnpm add -D <pkg>                   # add a dev dependency
pnpm remove <pkg>                   # remove a dependency
pnpm build                          # run build script
pnpm --filter web dev               # run a script in a specific workspace
pnpm --filter @common/ui-kit build  # target a workspace by package name
pnpm install --frozen-lockfile      # CI / Docker — never mutates lockfile
```

### Workspace setup

- `frontend/pnpm-workspace.yaml` declares all frontend packages:

```yaml
packages:
  - 'web'
  - 'mobile'
  - '_common/*'
```

- Workspace cross-references use the `workspace:*` protocol:

```json
"@common/hooks": "workspace:*",
"@common/services": "workspace:*"
```

- `"packageManager": "pnpm@10.33.2"` pinned in every workspace root `package.json`
- `pnpm-lock.yaml` is always committed — never delete or edit it manually

### Docker installs

```dockerfile
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
RUN pnpm install --frozen-lockfile
```

---

## Rule 7 — Environment Variables

- Single source of truth: `_common/.env`
- All Docker services mount it via `env_file` in `docker-compose.yml`
- Never commit `_common/.env` — commit only `_common/.env.example`
- Naming: `SCREAMING_SNAKE_CASE`, prefixed by service (`WEB_`, `BACKEND_`, `SUPABASE_`)

---

## Rule 8 — Docker

- Each service owns its `Dockerfile`:
  - `frontend/web/Dockerfile` (build context: `./frontend`)
  - `backend/app/Dockerfile` (build context: `.`)
- `docker-compose.yml` at repo root is the only way to run all services together
- Multi-stage builds required: `dependencies → builder → runner`
- Always install with `pnpm install --frozen-lockfile` — never copy `node_modules` into the image

---

## Rule 9 — CI/CD

CI/CD files are allowed when they validate the template without hardcoding project-specific deployment details.

---

## Global Pre-PR Checklist

- [ ] No file exceeds its line limit
- [ ] No abbreviations in any identifier or file name
- [ ] All shared types are in `_common/types/*.d.ts` inside `namespace Entity {}`
- [ ] Frontend clickable button controls use `frontend/_common/ui-kit/Button`
- [ ] Frontend text-like input controls use `frontend/_common/ui-kit/TextInput`
- [ ] Frontend multi-line form fields use `frontend/_common/ui-kit/TextArea`
- [ ] Frontend select/dropdown controls use `frontend/_common/ui-kit/Select`
- [ ] Frontend modal dialogs use `frontend/_common/ui-kit/Modal`
- [ ] `_common/.env` is not committed; `_common/.env.example` is updated if needed
- [ ] No `frontend/` code imports directly from `backend/`
- [ ] Root `_common/` contains only `migrations/`, `eslint/`, `types/`, and `.env*`
- [ ] Dockerfiles use multi-stage builds with `pnpm install --frozen-lockfile`
- [ ] Workspace deps use `"workspace:*"` protocol
- [ ] `pnpm-lock.yaml` is committed and up to date
