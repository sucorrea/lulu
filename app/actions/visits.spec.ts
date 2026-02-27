import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSet = vi.fn();
const mockDoc = vi.fn(() => ({ set: mockSet }));
const mockCollection = vi.fn(() => ({ doc: mockDoc }));
const mockIncrement = vi.fn((n: number) => `increment(${n})`);

vi.mock('@/lib/firebase-admin', () => ({
  adminDb: {
    collection: mockCollection,
  },
}));

vi.mock('firebase-admin', () => ({
  default: {
    firestore: {
      FieldValue: {
        increment: mockIncrement,
      },
    },
  },
}));

describe('visits actions', () => {
  const load = async () => {
    const mod = await import('./visits');
    return mod;
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockCollection.mockReturnValue({ doc: mockDoc });
    mockDoc.mockReturnValue({ set: mockSet });
  });

  describe('incrementSiteVisits', () => {
    it('sets FieldValue.increment(1) on stats/site_visits with merge', async () => {
      const { incrementSiteVisits } = await load();
      await incrementSiteVisits();

      expect(mockCollection).toHaveBeenCalledWith('stats');
      expect(mockDoc).toHaveBeenCalledWith('site_visits');
      expect(mockIncrement).toHaveBeenCalledWith(1);
      expect(mockSet).toHaveBeenCalledWith(
        { count: 'increment(1)' },
        { merge: true }
      );
    });

    it('resolves without throwing', async () => {
      mockSet.mockResolvedValueOnce(undefined);
      const { incrementSiteVisits } = await load();

      await expect(incrementSiteVisits()).resolves.toBeUndefined();
    });
  });
});
