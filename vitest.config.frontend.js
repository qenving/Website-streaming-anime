import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'frontend',
    root: '.',
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
});
