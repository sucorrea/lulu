import { describe, it, expect, vi, beforeEach } from 'vitest';
import { doc, onSnapshot } from 'firebase/firestore';
import { listenSiteVisits } from './siteStats';

const firestoreMocks = vi.hoisted(() => ({
  doc: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('./firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => firestoreMocks);

describe('siteStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listenSiteVisits', () => {
    it('calls onSnapshot with the stats/site_visits doc ref', () => {
      const ref = { path: 'stats/site_visits' };
      vi.mocked(doc).mockReturnValue(ref as never);
      vi.mocked(onSnapshot).mockReturnValue(vi.fn() as never);

      listenSiteVisits(vi.fn());

      expect(doc).toHaveBeenCalledWith({}, 'stats', 'site_visits');
      expect(onSnapshot).toHaveBeenCalledWith(ref, expect.any(Function));
    });

    it('invokes callback with count when document exists', () => {
      const ref = { path: 'stats/site_visits' };
      vi.mocked(doc).mockReturnValue(ref as never);

      let snapshotHandler: (snap: unknown) => void = vi.fn();
      vi.mocked(onSnapshot).mockImplementation((_ref, handler) => {
        snapshotHandler = handler as typeof snapshotHandler;
        return vi.fn() as never;
      });

      const callback = vi.fn();
      listenSiteVisits(callback);

      snapshotHandler({ exists: () => true, data: () => ({ count: 42 }) });

      expect(callback).toHaveBeenCalledWith(42);
    });

    it('invokes callback with 0 when document does not exist', () => {
      vi.mocked(doc).mockReturnValue({} as never);

      let snapshotHandler: (snap: unknown) => void = vi.fn();
      vi.mocked(onSnapshot).mockImplementation((_ref, handler) => {
        snapshotHandler = handler as typeof snapshotHandler;
        return vi.fn() as never;
      });

      const callback = vi.fn();
      listenSiteVisits(callback);

      snapshotHandler({ exists: () => false, data: () => null });

      expect(callback).toHaveBeenCalledWith(0);
    });

    it('invokes callback with 0 when count field is missing', () => {
      vi.mocked(doc).mockReturnValue({} as never);

      let snapshotHandler: (snap: unknown) => void = vi.fn();
      vi.mocked(onSnapshot).mockImplementation((_ref, handler) => {
        snapshotHandler = handler as typeof snapshotHandler;
        return vi.fn() as never;
      });

      const callback = vi.fn();
      listenSiteVisits(callback);

      snapshotHandler({ exists: () => true, data: () => ({}) });

      expect(callback).toHaveBeenCalledWith(0);
    });

    it('returns the unsubscribe function from onSnapshot', () => {
      vi.mocked(doc).mockReturnValue({} as never);
      const unsubscribe = vi.fn();
      vi.mocked(onSnapshot).mockReturnValue(unsubscribe as never);

      const result = listenSiteVisits(vi.fn());

      expect(result).toBe(unsubscribe);
    });
  });
});
