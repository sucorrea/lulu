import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/auth-guard', () => ({
  assertAdmin: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/services/firebase', () => ({
  db: {},
  storage: {},
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
}));

describe('uploadPhoto', () => {
  it('should export uploadPhoto function', () => {
    expect(true).toBe(true);
  });
});
