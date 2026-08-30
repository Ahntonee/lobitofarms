import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GH_PAGES=true npm run build produces a build served from a GitHub Pages project
// subpath (https://<user>.github.io/lobitofarms/) instead of the domain root.
export default defineConfig({
  base: process.env.GH_PAGES ? '/lobitofarms/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
      '/sitemap.xml': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
