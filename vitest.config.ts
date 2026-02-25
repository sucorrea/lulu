import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dynamicImport from 'vite-plugin-dynamic-import';

export default defineConfig({
  plugins: [react(), dynamicImport()],
  test: {
    globals: true,
    environment: 'jsdom',
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
      },
    },
    reporters: [
      ['verbose'],
      ['vitest-sonar-reporter', { outputFile: 'coverage/test-report.xml' }],
    ],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      enabled: true,
      include: [
        'components/**/*.{ts,tsx}',
        'hooks/**/*.ts',
        'lib/**/*.ts',
        'providers/**/*.{ts,tsx}',
        'services/**/*.ts',
        'app/page.tsx',
        'app/sorteio/page.tsx',
        'app/participantes/[id]/page.tsx',
      ],
      exclude: [
        'components/lulus/mockdata.ts',
        'components/lulus/mockdata/**/*.{ts,tsx}',
        'components/ui/**',
        'app/**/loading.tsx',
        'app/**/layout.tsx',
        'app/**/not-found.tsx',
        'app/**/error.tsx',
        '**/*.spec.{ts,tsx}',
        '**/*.test.{ts,tsx}',
        '**/node_modules/**',
        '**/coverage/**',
        '**/.next/**',
        '**/vitest.setup.ts',
        'components/audit/index.ts',
      ],
      reporter: ['text-summary', 'lcov', 'html'],
      reportOnFailure: true,
      reportsDirectory: 'coverage',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
