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
    let unsubscribe = () => {};

    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const token = await firebaseUser.getIdToken();
            setToken(token);

            try {
              const profile = await httpClient.get('/me');
              setAuth({ firebaseUser, profile, token });
            } catch (error) {
              // Backend may be down — still mark auth as resolved with
              // the Firebase user so the UI can function offline.
              console.warn('Failed to fetch backend profile:', error);
              setAuth({ firebaseUser, profile: null, token });
            }
          } else {
            clearAuth();
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          clearAuth();
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      // Firebase itself failed to initialize (bad config, network block, etc.)
      console.error('Firebase onAuthStateChanged setup failed:', error);
      clearAuth();
      setLoading(false);
    }

    return () => unsubscribe();
  }, [setAuth, clearAuth, setLoading, setToken]);

  return children;
}
