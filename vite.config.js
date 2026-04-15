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
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:8101",
        changeOrigin: true,
      },
      "/auth": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:8101",
        changeOrigin: true,
      },
      "/billing": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:8101",
        changeOrigin: true,
      },
      "/nlp": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:8101",
        changeOrigin: true,
      },
    },
  },
});
