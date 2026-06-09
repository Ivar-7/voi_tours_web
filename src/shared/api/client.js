import axios from 'axios';
import { applyInterceptors } from './interceptors';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

applyInterceptors(client);

export default client;

