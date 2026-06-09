import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuthStore } from '@/shared/store';
import httpClient from '@/shared/api';

export default function AuthProvider({ children }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setToken(token);

          const profile = await httpClient.get('/me');
          setAuth({ firebaseUser, profile, token });
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
          clearAuth();
        }
      } else {
        clearAuth();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setAuth, clearAuth, setLoading, setToken]);

  return children;
}

