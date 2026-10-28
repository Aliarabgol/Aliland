import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The preview proxy forwards the public host to the container as
// <port>-<sandbox id>.<sandbox domain>. The platform injects the allowed host into
// __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS; we additionally accept the sandbox domain
// wildcard so a rotated sandbox id still resolves. Nothing here is hardcoded.
const extraHosts = (process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS || '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const sandboxDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [...extraHosts, ...(sandboxDomain ? [`.${sandboxDomain}`] : [])],
    proxy: {
      // Single origin: the session cookie never crosses a site boundary.
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://api:4000',
        changeOrigin: false,
      },
      '/uploads': {
        target: process.env.API_PROXY_TARGET || 'http://api:4000',
        changeOrigin: false,
      },
    },
    watch: { usePolling: true, interval: 220 },
  },
  build: { sourcemap: false },
});
