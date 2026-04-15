import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './.pyqual/coverage',
      exclude: ['node_modules/', 'e2e/'],
    },
  },
});
