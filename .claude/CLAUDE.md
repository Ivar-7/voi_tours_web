# React + Vite + JavaScript — Agentic Rules

## Architecture
- **`src/app/`** — The authenticated app shell and layouts.
- **`src/shared/`** — Reusable primitives: `api`, `components`, `hooks`, `layouts`, `types`, `utils`, `store`, `providers`.
- **`src/features/<feature>/`** — Domain-driven modules, one folder per concern: `api/`, `types/`, `hooks/`, `widgets/`, `pages/`.
- **Root Files** — `App.jsx`, `main.jsx`.

## Core Rules
- **API Layer** — `src/shared/api/` owns the HTTP client and auth interceptors. Features call it via their own `api/<feature>.api.js`.
- **Page Isolation** — Pages are state and layout orchestrators only.
- **Naming Conventions** — `*.api.js`, `*.keys.js`, `*.types.js`, `*.schema.js`, `*Provider.jsx`, `*Page.jsx`, `use<Thing>.js`.
- **Routing** — Object-based config (`src/app/routes.jsx`) with route-level lazy loading (`lazy:`, not `React.lazy` + `Suspense`).
- **Firebase** — Config/rules/indexes in `src/config/firebase`; rules are authorization-only, indexes stay minimal, deploy on change.
- **Error Handling** — One shared error-handling layer for the whole app. Never show raw errors to users; log the error itself.
- **Security & Cleanliness** — No hardcoded secrets (maintain `.env.example`). No dead code, no linter suppressions.
- **Documentation** — Minimal README for each feature.

## UI/UX
- **Design Tokens** — Tailwind classes only. No arbitrary values.
- **Theming** — Light/dark support everywhere.
- **Motion** — Framer Motion only; animate with purpose.
- **Component States** — Every feature handles 4 states: loading, empty, success, error.
- **Layouts** — Mounted at the route level.

## Verification
- **Before Finishing** — `npm run format`, `npm run lint`, `npm run build`. Fix all warnings and errors.
- **Dev-Server Checks** — Required only for logic, state, or layout risk; reuse a running instance; end self-started instances once done.
