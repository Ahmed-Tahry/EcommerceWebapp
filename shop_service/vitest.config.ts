import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'; // If you use tsconfig-paths for aliases

export default defineConfig({
  plugins: [
    tsconfigPaths(), // If you use path aliases like @/* from tsconfig.json
  ],
  test: {
    globals: true, // Optional: to use Vitest globals like describe, it, expect without importing
    environment: 'node', // Specify Node.js environment for backend tests
    coverage: {
      provider: 'c8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'], // Pattern for test files
  },
});
