import { describe, expect, it, vi } from 'vitest';
import { uploadGalleryPhoto } from './uploadGalleryPhoto';

vi.mock('../cloudinary', () => ({
  cloudinaryUpload: vi
    .fn()
    .mockResolvedValue({
      url: 'https://res.cloudinary.com/demo/image/upload/gallery/uid_123.jpg',
      publicId: 'gallery/uid_123',
    }),
}));

describe('uploadGalleryPhoto', () => {
  it('should call cloudinaryUpload with correct params', async () => {
    const { cloudinaryUpload } = await import('../cloudinary');
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });

    await uploadGalleryPhoto({ file, photoId: 'uid_123' });

    expect(cloudinaryUpload).toHaveBeenCalledWith({
      file,
      folder: 'gallery',
      publicId: 'uid_123',
    });
  });

  it('should upload file to gallery folder', async () => {
    const { cloudinaryUpload } = await import('../cloudinary');
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });

    await uploadGalleryPhoto({ file, photoId: 'uid_123' });

    expect(cloudinaryUpload).toHaveBeenCalledWith(
      expect.objectContaining({ folder: 'gallery', publicId: 'uid_123' })
    );
  });
});
