import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  server: {
    port: parseInt(process.env.VITE_DEV_PORT || '3000'),
    proxy: process.env.VITE_BACKEND_URL ? {
      "/api": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
      "/auth": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
      "/billing/subscribe": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
      "/nlp/to-oql": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
      "/nlp/to-iql": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
      "/nlp/devops": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
    } : {},
  },
});
