import { useAuthStore } from "@shared/store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token) || Boolean(user),
  };
}
