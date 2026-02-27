import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, deleteObject } from 'firebase/storage';

import { deleteGalleryPhoto } from './deleteGalleryPhoto';
import { assertAdmin } from '@/lib/auth-guard';

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  deleteObject: vi.fn(),
}));

vi.mock('@/lib/auth-guard', () => ({
  assertAdmin: vi.fn(),
}));

vi.mock('../firebase', () => ({
  storage: {},
}));

const makeUrl = (path: string) =>
  `https://firebasestorage.googleapis.com/v0/b/myapp.appspot.com/o/${encodeURIComponent(path)}?alt=media&token=abc`;

describe('deleteGalleryPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(assertAdmin).mockResolvedValue(undefined);
    vi.mocked(ref).mockReturnValue({ fullPath: 'mocked' } as ReturnType<
      typeof ref
    >);
    vi.mocked(deleteObject).mockResolvedValue(undefined);
  });

  it('should call assertAdmin before deleting', async () => {
    await deleteGalleryPhoto(makeUrl('gallery/photo.jpg'));
    expect(assertAdmin).toHaveBeenCalledOnce();
  });

  it('should extract correct path from Firebase Storage URL', async () => {
    await deleteGalleryPhoto(makeUrl('gallery/photo.jpg'));
    expect(ref).toHaveBeenCalledWith({}, 'gallery/photo.jpg');
  });

  it('should decode URL-encoded path segments', async () => {
    await deleteGalleryPhoto(makeUrl('gallery/my photo.jpg'));
    expect(ref).toHaveBeenCalledWith({}, 'gallery/my photo.jpg');
  });

  it('should decode path with encoded slash', async () => {
    const url = `https://firebasestorage.googleapis.com/v0/b/myapp.appspot.com/o/gallery%2Fphoto.jpg?alt=media`;
    await deleteGalleryPhoto(url);
    expect(ref).toHaveBeenCalledWith({}, 'gallery/photo.jpg');
  });

  it('should call deleteObject with the created ref', async () => {
    const mockRef = { fullPath: 'gallery/photo.jpg' } as ReturnType<typeof ref>;
    vi.mocked(ref).mockReturnValue(mockRef);

    await deleteGalleryPhoto(makeUrl('gallery/photo.jpg'));

    expect(deleteObject).toHaveBeenCalledWith(mockRef);
  });

  it('should throw when URL is malformed', async () => {
    await expect(deleteGalleryPhoto('not-a-valid-url')).rejects.toThrow(
      'URL de foto inválida'
    );
    expect(deleteObject).not.toHaveBeenCalled();
  });

  it('should throw when URL does not contain /o/ segment', async () => {
    await expect(
      deleteGalleryPhoto('https://example.com/some/path/photo.jpg')
    ).rejects.toThrow('URL de foto inválida');
    expect(deleteObject).not.toHaveBeenCalled();
  });

  it('should not call deleteObject when assertAdmin throws', async () => {
    vi.mocked(assertAdmin).mockRejectedValue(
      new Error('Acesso restrito a administradores')
    );

    await expect(
      deleteGalleryPhoto(makeUrl('gallery/photo.jpg'))
    ).rejects.toThrow('Acesso restrito a administradores');
    expect(deleteObject).not.toHaveBeenCalled();
  });

  it('should propagate storage errors from deleteObject', async () => {
    vi.mocked(deleteObject).mockRejectedValue(
      new Error('storage/object-not-found')
    );

    await expect(
      deleteGalleryPhoto(makeUrl('gallery/photo.jpg'))
    ).rejects.toThrow('storage/object-not-found');
  });
});
