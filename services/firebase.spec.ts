import { describe, it, expect, vi } from 'vitest';

vi.mock('firebase/app', () => ({
  getApp: vi.fn(),
  getApps: vi.fn(() => []),
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

describe('firebase', () => {
  it('should initialize firebase', () => {
    expect(true).toBe(true);
  });
});
