import { describe, expect, it, vi } from 'vitest';
import { uploadGalleryPhoto } from './uploadGalleryPhoto';

vi.mock('@/lib/auth-guard', () => ({
  assertAdmin: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../firebase', () => ({ default: {} }));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(),
  uploadBytes: vi.fn().mockResolvedValue(undefined),
}));

describe('uploadGalleryPhoto', () => {
  it('should call assertAdmin before uploading', async () => {
    const { assertAdmin } = await import('@/lib/auth-guard');
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });

    await uploadGalleryPhoto({ file, photoId: 'uid_123' });

    expect(assertAdmin).toHaveBeenCalled();
  });

  it('should upload file to gallery path', async () => {
    const { uploadBytes } = await import('firebase/storage');
    const { ref } = await import('firebase/storage');
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });

    await uploadGalleryPhoto({ file, photoId: 'uid_123' });

    expect(ref).toHaveBeenCalledWith({}, 'gallery/uid_123');
    expect(uploadBytes).toHaveBeenCalled();
  });
});
