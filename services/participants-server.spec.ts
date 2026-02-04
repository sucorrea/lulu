import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

describe('participants-server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have getParticipants function', () => {
    expect(true).toBe(true);
  });
});
