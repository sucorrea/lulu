import '@testing-library/jest-dom/vitest';

import React from 'react';
import { config } from 'dotenv';
import { resolve } from 'path';
import { vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: (importFn: () => Promise<{ default: React.ComponentType }>) => {
    const LazyComponent = React.lazy(
      importFn as () => Promise<{ default: React.ComponentType }>
    );
    return (props: object) =>
      React.createElement(
        React.Suspense,
        { fallback: null },
        React.createElement(LazyComponent, props)
      );
  },
}));

const result = config({ path: resolve(__dirname, '.env.test') });

if (result.parsed) {
  Object.entries(result.parsed).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

vi.mock('@/services/firebase', () => ({
  auth: { signOut: vi.fn(() => Promise.resolve()) },
  storage: {},
  db: {},
  default: {},
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((_auth, callback: (user: null) => void) => {
    callback(null);
    return () => {};
  }),
  signOut: vi.fn(() => Promise.resolve()),
  getIdTokenResult: vi.fn(() => Promise.resolve({ claims: {} })),
}));
