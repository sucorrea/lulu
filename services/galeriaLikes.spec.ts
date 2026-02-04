import { describe, it, expect, vi, beforeEach } from 'vitest';
import { likePhoto, unlikePhoto, listenPhotoLikes } from './galeriaLikes';

vi.mock('./firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
  onSnapshot: vi.fn(),
}));

describe('galeriaLikes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('likePhoto', () => {
    it('should export likePhoto function', () => {
      expect(likePhoto).toBeDefined();
    });
  });

  describe('unlikePhoto', () => {
    it('should export unlikePhoto function', () => {
      expect(unlikePhoto).toBeDefined();
    });
  });

  describe('listenPhotoLikes', () => {
    it('should export listenPhotoLikes function', () => {
      expect(listenPhotoLikes).toBeDefined();
    });
  });
});
