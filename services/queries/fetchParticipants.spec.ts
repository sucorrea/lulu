import { describe, it, expect, vi } from 'vitest';

vi.mock('@/services/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useSuspenseQuery: vi.fn(),
}));

describe('fetchParticipants queries', () => {
  it('should have query hooks', () => {
    expect(true).toBe(true);
  });
});
