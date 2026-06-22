# Auth Feature

## Responsibilities

- Firebase email/password authentication.
- Syncing a Firestore `users/{uid}` profile document (role, tier, contact
  details) alongside the Firebase Auth user.
- Protected route and role-based access guards.

There is no separate backend — Firebase Auth + Firestore _is_ the backend.

## Files

| Path                              | Role                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `api/auth.api.js`                  | Firebase Auth calls + `users/{uid}` Firestore profile sync             |
| `hooks/useAuth.js`                 | Reads auth state from `useAuthStore`                                   |
| `hooks/useForgotPassword.js`       | Mutation wrapping `forgotPassword`                                     |
| `components/ProtectedRoute.jsx`    | Redirects unauthenticated users to `/auth/login`                       |
| `components/RoleGuard.jsx`         | Restricts a route to specific `role` values                            |
| `schema/auth.schema.js`            | `forgotPasswordSchema` (Login/Register validate inline, see below)     |
| `pages/LoginPage.jsx`              | `/auth/login` — self-contained form, no `LoginForm` widget              |
| `pages/RegisterPage.jsx`           | `/auth/register` — self-contained form, no `RegisterForm` widget        |
| `pages/ForgotPasswordPage.jsx`     | `/auth/forgot-password` — react-hook-form + `useForgotPassword`        |

`LoginPage`/`RegisterPage` intentionally own their form markup and validation
directly rather than delegating to `LoginForm`/`RegisterForm` widgets — those
widgets existed only as unused stubs and were removed rather than built out
as dead duplicates.

## Auth Flow

1. Firebase Auth signs the user in/up and returns an ID token.
2. `auth.api.js` reads or creates the matching `users/{uid}` Firestore
   document (`role`, `tier`, `full_name`, `phone`, `is_active`, timestamps).
   New accounts default to `role: "customer"`, `tier: "citizen"`.
3. `AuthProvider` listens to `onAuthStateChanged` and re-hydrates the
   Zustand `useAuthStore` (`user`, `firebaseUser`, `token`) on every
   sign-in/refresh, fetching the same Firestore profile.
4. `ProtectedRoute` / `RoleGuard` read `useAuth()` (backed by the store) to
   gate `/dashboard/*` and `/admin/*` routes.

## Becoming an admin

There is no invite flow. To promote an account to `admin` or `agent`,
register normally, then edit that user's `role` field directly in the
Firestore console (`users/{uid}.role`). See the root `README.md` for the
full bootstrap steps.
