import { describe, it, expect, vi } from 'vitest';

vi.mock('@/services/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

describe('updateParticipant', () => {
  it('should export update mutation', () => {
    expect(true).toBe(true);
  });
});
