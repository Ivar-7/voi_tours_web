import { useAuthStore } from '@/shared/store';
import { normalizeError } from './errors';

export function applyInterceptors(axiosInstance) {
  // Request interceptor: Attach Bearer Token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(normalizeError(error)),
  );

  // Response interceptor: Extract data and handle errors
  axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const normalised = normalizeError(error);

      // On 401, clear credentials to force re-login
      if (normalised.status === 401) {
        useAuthStore.getState().clearAuth();
      }

      return Promise.reject(normalised);
    },
  );
}

