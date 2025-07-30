import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    // Add type checking to tests
    typecheck: {
      enabled: true,
      include: ['src/**/*.ts'],
    },
  },
});