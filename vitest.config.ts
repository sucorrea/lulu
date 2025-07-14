import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dynamicImport from 'vite-plugin-dynamic-import';

export default defineConfig({
  plugins: [react(), dynamicImport()],
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: [
      ['verbose'],
      ['vitest-sonar-reporter', { outputFile: 'coverage/test-report.xml' }],
    ],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      enabled: true,
      include: ['/**/*.ts', 'src/**/*.tsx'],
      exclude: ['/**/*.spec.ts', '/**/*.spec.tsx'],
      reporter: ['lcov', 'text-summary'],
      reportOnFailure: true,
      reportsDirectory: 'coverage',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
