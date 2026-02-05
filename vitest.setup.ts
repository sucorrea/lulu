import '@testing-library/jest-dom/vitest';

import { config } from 'dotenv';
import { resolve } from 'path';
import { vi } from 'vitest';

const result = config({ path: resolve(__dirname, '.env.test') });

if (result.parsed) {
  Object.entries(result.parsed).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

vi.mock('@/services/firebase', () => ({
  auth: {},
  storage: {},
  db: {},
  default: {},
}));
