import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore';
import { likePhoto, unlikePhoto, listenPhotoLikes } from './galeriaLikes';

type FirestoreSnap = {
  exists: () => boolean;
  data: () => { users?: string[] };
};

const firestoreMocks = vi.hoisted(() => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('./firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => firestoreMocks);

describe('galeriaLikes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('likePhoto updates existing doc', async () => {
    const mockDoc = vi.mocked(doc);
    const mockGetDoc = vi.mocked(getDoc);
    const mockUpdateDoc = vi.mocked(updateDoc);
    const mockArrayUnion = vi.mocked(arrayUnion);

    const ref = { path: 'galeria-likes/photo-1' };
    mockDoc.mockReturnValue(ref as never);
    mockArrayUnion.mockReturnValue('union-user' as never);
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ users: ['old'] }),
    } as FirestoreSnap);

    await likePhoto('photo-1', 'user-1');

    expect(mockDoc).toHaveBeenCalledWith({}, 'galeria-likes', 'photo-1');
    expect(mockUpdateDoc).toHaveBeenCalledWith(ref, { users: 'union-user' });
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    expect(mockGetDoc).toHaveBeenCalledTimes(1);
  });

  it('likePhoto creates doc when missing', async () => {
    const mockDoc = vi.mocked(doc);
    const mockGetDoc = vi.mocked(getDoc);
    const mockSetDoc = vi.mocked(setDoc);

    const ref = { path: 'galeria-likes/photo-2' };
    mockDoc.mockReturnValue(ref as never);
    mockGetDoc.mockResolvedValue({
      exists: () => false,
      data: () => ({ users: [] }),
    } as FirestoreSnap);

    await likePhoto('photo-2', 'user-2');

    expect(mockSetDoc).toHaveBeenCalledWith(ref, { users: ['user-2'] });
  });

  it('unlikePhoto removes user', async () => {
    const mockDoc = vi.mocked(doc);
    const mockUpdateDoc = vi.mocked(updateDoc);
    const mockArrayRemove = vi.mocked(arrayRemove);

    const ref = { path: 'galeria-likes/photo-3' };
    mockDoc.mockReturnValue(ref as never);
    mockArrayRemove.mockReturnValue('remove-user' as never);

    await unlikePhoto('photo-3', 'user-3');

    expect(mockUpdateDoc).toHaveBeenCalledWith(ref, { users: 'remove-user' });
  });

  it('listenPhotoLikes returns users from snapshot', () => {
    const mockDoc = vi.mocked(doc);
    const mockOnSnapshot = vi.mocked(onSnapshot);
    const ref = { path: 'galeria-likes/photo-4' };
    const callback = vi.fn<(users: string[]) => void>();
    const unsubscribe = vi.fn();

    mockDoc.mockReturnValue(ref as never);
    mockOnSnapshot.mockImplementation((_, onNext) => {
      onNext({
        exists: () => true,
        data: () => ({ users: ['a', 'b'] }),
      } as FirestoreSnap);
      return unsubscribe;
    });

    const result = listenPhotoLikes('photo-4', callback);

    expect(result).toBe(unsubscribe);
    expect(callback).toHaveBeenCalledWith(['a', 'b']);
  });

  it('listenPhotoLikes returns empty array when doc missing', () => {
    const mockDoc = vi.mocked(doc);
    const mockOnSnapshot = vi.mocked(onSnapshot);
    const ref = { path: 'galeria-likes/photo-5' };
    const callback = vi.fn<(users: string[]) => void>();
    const unsubscribe = vi.fn();

    mockDoc.mockReturnValue(ref as never);
    mockOnSnapshot.mockImplementation((_, onNext) => {
      onNext({
        exists: () => false,
        data: () => ({ users: ['ignored'] }),
      } as FirestoreSnap);
      return unsubscribe;
    });

    listenPhotoLikes('photo-5', callback);

    expect(callback).toHaveBeenCalledWith([]);
  });
});
