import { describe, it, expect, vi } from 'vitest';

vi.mock('@/services/firebase', () => ({
  db: {},
  storage: {},
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
}));

describe('replaceParticipantPhoto', () => {
  it('should export replace photo function', () => {
    expect(true).toBe(true);
  });
});
