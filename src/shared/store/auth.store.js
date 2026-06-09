import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      firebaseUser: null,
      token: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setAuth: ({ firebaseUser, profile, token }) =>
        set((state) => ({
          firebaseUser,
          user: profile,
          token: token ?? state.token,
          isLoading: false,
        })),
      clearAuth: () =>
        set({
          user: null,
          firebaseUser: null,
          token: null,
          isLoading: false,
        }),
    }),
    {
      name: 'voi-tours-auth',
      // Only serialize JSON-safe data; avoid firebaseUser object methods.
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

