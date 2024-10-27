import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    reporters: ['verbose'],
    coverage: {
      enabled: false // Disable built-in coverage for now
    }
  }
});