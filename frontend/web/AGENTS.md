# AGENTS.md — Web App (`frontend/web/`)

Rules specific to the Next.js web application.
Also read: [`../../AGENTS.md`](../../AGENTS.md) (global) and [`../_common/AGENTS.md`](../_common/AGENTS.md) (shared frontend).

---

## Structure

```
frontend/web/
├── app/          # Next.js App Router — layouts, pages, loading, error, route handlers
├── components/   # Thin, web-only React components (NOT shared with mobile)
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

### Forbidden folders

These must never exist inside `frontend/web/`:

| Folder | Reason |
|---|---|
| `contexts/` | Replaced by `@common/stores` — no React Context needed |
| `services/` | Lives in `frontend/_common/services/` |
| `hooks/` | Lives in `frontend/_common/hooks/` |
| `stores/` | Lives in `frontend/_common/stores/` |
| `types/` | Lives in `frontend/_common/types/` |
| `utils/` | Lives in `frontend/_common/utils/` |

---

## Rule — Styling (Tailwind CSS)

**All styling in `frontend/web/` must use Tailwind CSS utility classes.**

| Allowed | Banned |
|---|---|
| `className="bg-calm-surface rounded-3xl p-8"` | `style={{ backgroundColor: '#fff' }}` |
| `className={isActive ? 'text-calm-primary' : 'text-calm-muted'}` | `style={useMemo(() => ({ color: ... }), [])}` |
| Tailwind `calm-*` custom classes | Importing `softCalmTheme` in web components |

### Custom color palette (`calm-*`)

Defined in `tailwind.config.ts` under `theme.extend.colors.calm`. Map directly to the "Soft & Calm" design tokens:

| Tailwind class | Value | Usage |
|---|---|---|
| `bg-calm-background` | `#F8F9FE` | Page backgrounds |
| `bg-calm-surface` | `#FFFFFF` | Card surfaces |
| `text-calm-text` | `#3D4255` | Primary body text |
| `text-calm-muted` | `#8B90A7` | Secondary / placeholder text |
| `text-calm-primary` | `#E48A3A` | Actions, brand marks, active tabs |
| `border-calm-border` | `#E5E7F0` | Dividers, input borders |
| `bg-calm-error-light` | `#FEF2F2` | Error backgrounds |
| `text-calm-error` | `#F87171` | Error text |
| `text-calm-success` | `#6EE7B7` | Success icons/text |

### Custom shadows

`shadow-lifted`, `shadow-medium`, `shadow-soft`, `shadow-subtle` — defined in `tailwind.config.ts`.

### Conditional classes

Use inline string expressions — no extra `useMemo` needed for simple class strings:

```tsx
// ✅ Correct
<Button className={`flex-1 py-2 ${isActive ? 'text-calm-primary font-semibold' : 'text-calm-muted font-normal'}`}>

// ❌ Wrong — no inline styles, no theme imports
import { softCalmTheme } from '@common/ui-kit/theme';
<Button style={{ color: isActive ? softCalmTheme.colors.primary : softCalmTheme.colors.textSecondary }}>
```

### ui-kit exception

`@common/ui-kit` components (Button, Icon, TextInput, PasswordInput) use **inline styles** internally via `softCalmTheme` — this is intentional for cross-platform Ionic compatibility. Do not modify their internals. Use their `className` prop to extend with Tailwind when needed from web components.

---

## Rule — Layer Responsibilities

```
app/page.tsx
  └── components/
        ├── @common/stores    ← read state directly (currentUser, isLoading, etc.)
        └── @common/hooks     ← call actions (login, logout, fetchUsers, etc.)
              └── @common/services  ← raw Supabase / fetch calls
                    └── Entity.ApiResponse<T>
```

Zustand stores are global — React Context is not needed and must not be used.

### `app/`

- Contains only `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, and `route.ts` files
- No business logic, no direct API calls

### `components/`

- Web-only thin components not shared with mobile
- Read state via `useXxxStore()` from `@common/stores`
- Trigger actions via hooks from `@common/hooks`
- May render `@common/ui-kit` components without wrapping
- Must be wrapped in `React.memo`

```tsx
// ✅ Correct — store for state, hook for actions
import { useAuthenticationStore } from '@common/stores';
import { useAuthentication } from '@common/hooks';

const LoginPage = React.memo(function LoginPage() {
  const { currentUser, isAuthenticating, authenticationError } = useAuthenticationStore();
  const { login, logout } = useAuthentication();

  const handleLogin = useCallback(async () => {
    await login({ email, password });
  }, [login, email, password]);

  return <LoginForm onSubmit={handleLogin} isLoading={isAuthenticating} error={authenticationError} />;
});
```

---

## Rule — Thin Components

Components contain **zero** business logic.

| Allowed | Not allowed |
|---|---|
| Render JSX from props | Call `fetch` or import from `@common/services` directly |
| Read state from `useXxxStore()` | Use React Context (`createContext`, `useContext`) |
| Call actions from `@common/hooks` | Transform or filter API data |
| `useMemo` / `useCallback` for render perf | Business `if/else` conditions |
| Apply local Tailwind classes | Define derived state from raw API data |

---

## Rule — React Performance

Mandatory in every component:

| API | When |
|---|---|
| `React.memo` | Every component that receives props |
| `useMemo` | Every value derived from props or state |
| `useCallback` | Every function passed down to a child |

---

## Rule — Controls

- Use `Button` from `@common/shared/ui-kit` for every clickable button control.
- Do not render raw `<button>` elements in `frontend/web/`; icon-only controls must also use `Button` with an `aria-label`.
- Use `TextInput` from `@common/shared/ui-kit` for every text-like input control.
- Do not render raw `<input>` elements in `frontend/web/` unless you are implementing `TextInput`.
- Use `TextArea` from `@common/shared/ui-kit` for multi-line form fields.
- Raw `<textarea>` is allowed only inside `TextArea` itself or specialized composer components such as `ChatInput`.
- Use `Modal` from `@common/shared/ui-kit` for modal dialogs.
- Do not reimplement portal, overlay, body-scroll locking, modal header, or close button behavior in web feature components.

---

## Web Pre-PR Checklist

- [ ] `frontend/web/` has no `contexts/`, `services/`, `hooks/`, `stores/`, `types/`, or `utils/` folders
- [ ] Every component is wrapped in `React.memo`
- [ ] All `useMemo` and `useCallback` applied where required
- [ ] All clickable button controls use `@common/shared/ui-kit/Button`
- [ ] All text-like input controls use `@common/shared/ui-kit/TextInput`
- [ ] All multi-line form fields use `@common/shared/ui-kit/TextArea`
- [ ] All modal dialogs use `@common/shared/ui-kit/Modal`
- [ ] No component calls `fetch` or imports from `@common/services` directly
- [ ] No `createContext` or `useContext` — use `@common/stores` instead
- [ ] **Zero inline `style` props** — all styling via Tailwind classes
- [ ] **Zero `softCalmTheme` imports** in `frontend/web/` — use `calm-*` Tailwind classes instead
- [ ] New custom colors added to `tailwind.config.ts`, not hardcoded with `text-[#hex]`
