// TODO: Implement interceptors
// Request: attach Bearer token from auth store
// Response: pass through on 2xx; call normalizeError on 4xx/5xx
// On 401: refresh token or redirect to /auth/login

export function applyInterceptors(axiosInstance) {
  // placeholder
}
