import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'shared/tests/**/*.test.ts',
      'backend/tests/**/*.test.ts',
      'tests/**/*.test.ts'
    ]
  },
  resolve: {
    alias: {
      '@z-wbe/shared': path.resolve(__dirname, 'shared/src')
    }
  }
});
