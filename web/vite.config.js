import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewMode = process.env.BASE44_PREVIEW_MODE === '1';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // In the Base44 sandbox the preview proxy reaches Vite through a changing
    // external hostname, so the host allowlist is opened only for preview mode.
    allowedHosts: previewMode ? true : undefined,
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://api:8000',
        changeOrigin: false,
      },
    },
    watch: { usePolling: true, interval: 300 },
  },
});
