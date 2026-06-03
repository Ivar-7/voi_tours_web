// TODO: Implement useAuth
// Returns { user, token, isLoading, isAuthenticated } from useAuthStore
// Single source of truth for auth state across the app

export function useAuth() {
  return { user: null, token: null, isLoading: true, isAuthenticated: false };
}
