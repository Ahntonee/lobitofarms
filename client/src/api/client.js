import axios from 'axios';
import resolveFromFixture from '../mockData/resolve';

// import.meta.env.BASE_URL is '/' in dev and '/lobitofarms/' in the GH Pages build
// (see vite.config.js); BASE_URL always ends in '/', so this just appends cleanly.
const api = axios.create({ baseURL: `${import.meta.env.BASE_URL}api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function staticFallback(config) {
  // Only in production builds, and only for the public content reads resolve.js
  // explicitly covers — everything else (admin/auth/writes) still rejects normally.
  if (!import.meta.env.PROD) return undefined;
  return resolveFromFixture(config || {});
}

api.interceptors.response.use(
  (res) => {
    // A static host with no backend can still answer with HTTP 200 for an unmatched
    // path (e.g. an SPA-fallback server serving index.html instead of a real 404) —
    // that shows up here as "success" with an HTML string instead of the real JSON
    // body. Treat that the same as a hard failure rather than handing pages a string.
    if (typeof res.data === 'string') {
      const data = staticFallback(res.config);
      if (data !== undefined) return { ...res, data };
    }
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lf_token');
      localStorage.removeItem('lf_user');
    }

    const data = staticFallback(err.config);
    if (data !== undefined) {
      return Promise.resolve({ data, status: 200, statusText: 'OK (static fallback)', headers: {}, config: err.config });
    }

    return Promise.reject(err);
  }
);

export default api;
