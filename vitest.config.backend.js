import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'backend',
    root: './server',
    environment: 'node',
    passWithNoTests: true,
    include: ['**/__tests__/**/*.{js,ts}', '**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../coverage/backend',
    },
  },
});
