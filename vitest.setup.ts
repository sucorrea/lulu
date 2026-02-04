import '@testing-library/jest-dom/vitest';

import { config } from 'dotenv';
import { resolve } from 'path';
import { vi } from 'vitest';

config({ path: resolve(__dirname, '.env.test') });

vi.mock('@/services/firebase', () => ({
  auth: {},
  storage: {},
  db: {},
  default: {},
}));
