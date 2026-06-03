# Auth Feature

## Responsibilities
- Firebase email/password authentication
- JWT token management via Zustand `useAuthStore`
- Protected route and role-based access guard

## Files
| Path | Role |
|---|---|
| `api/auth.api.js` | Firebase + backend auth calls |
| `hooks/useAuth.js` | Read auth state |
| `hooks/useLogin.js` | Login mutation |
| `hooks/useRegister.js` | Registration mutation |
| `hooks/useForgotPassword.js` | Password reset mutation |
| `components/LoginForm.jsx` | Login form UI |
| `components/RegisterForm.jsx` | Registration form UI |
| `components/ProtectedRoute.jsx` | Redirects unauthenticated users |
| `components/RoleGuard.jsx` | Restricts by user role |
| `schema/auth.schema.js` | Zod validation schemas |
| `pages/LoginPage.jsx` | `/auth/login` |
| `pages/RegisterPage.jsx` | `/auth/register` |
| `pages/ForgotPasswordPage.jsx` | `/auth/forgot-password` |

## Auth Flow
1. Firebase signs in the user and returns an ID token.
2. `AuthProvider` calls `GET /me` with the token and hydrates the store.
3. All subsequent API calls attach the token via the Axios request interceptor.
