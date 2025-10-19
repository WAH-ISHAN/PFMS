// Axios instance configured for backend or WSO2 API GW.
// Automatically attaches Bearer token and (optionally) an API key.

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  withCredentials: false,
  timeout: 15000
});

// Add Authorization and optional WSO2 subscription key
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const apiKey = import.meta.env.VITE_WSO2_API_KEY;
  if (apiKey) {
    config.headers['X-WSO2-ApiKey'] = apiKey;
  }
  return config;
});

// Optional: global 401 handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // Token invalid/expired; you could trigger a logout here if desired
      // For simplicity, we just pass the error through.
    }
    return Promise.reject(err);
  }
);

export default api;