// TODO: Implement Zustand auth store
// State: user (User | null), token (string | null), isLoading
// Actions: setUser, setToken, clearAuth
// Persisted to localStorage via zustand/middleware/persist

import { create } from 'zustand';

export const useAuthStore = create(() => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: () => {},
  setToken: () => {},
  clearAuth: () => {},
}));
