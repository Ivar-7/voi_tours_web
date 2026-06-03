// TODO: Implement Axios client
// - Base URL from import.meta.env.VITE_API_BASE_URL
// - Default headers: Content-Type application/json
// - Import and apply request/response interceptors from ./interceptors
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default client;
