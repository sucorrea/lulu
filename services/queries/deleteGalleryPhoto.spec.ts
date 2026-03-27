import { describe, it, expect, vi, beforeEach } from 'vitest';

import { deleteGalleryPhoto } from './deleteGalleryPhoto';

vi.mock('../cloudinary', () => ({
  cloudinaryDelete: vi.fn().mockResolvedValue(undefined),
}));

const makeUrl = (publicId: string) =>
  `https://res.cloudinary.com/demo/image/upload/v1234567890/${publicId}.jpg`;

describe('deleteGalleryPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should extract correct publicId from Cloudinary URL', async () => {
    const { cloudinaryDelete } = await import('../cloudinary');
    await deleteGalleryPhoto(makeUrl('gallery/photo'));
    expect(cloudinaryDelete).toHaveBeenCalledWith('gallery/photo');
  });

  it('should handle URL without version prefix', async () => {
    const { cloudinaryDelete } = await import('../cloudinary');
    const url =
      'https://res.cloudinary.com/demo/image/upload/gallery/photo.jpg';
    await deleteGalleryPhoto(url);
    expect(cloudinaryDelete).toHaveBeenCalledWith('gallery/photo');
  });

  it('should call cloudinaryDelete with the extracted publicId', async () => {
    const { cloudinaryDelete } = await import('../cloudinary');
    await deleteGalleryPhoto(makeUrl('gallery/my-photo'));
    expect(cloudinaryDelete).toHaveBeenCalledWith('gallery/my-photo');
  });

  it('should decode encoded publicIds before deleting', async () => {
    const { cloudinaryDelete } = await import('../cloudinary');
    const url =
      'https://res.cloudinary.com/demo/image/upload/v1234567890/gallery/espa%C3%A7o%20foto.jpg';
    await deleteGalleryPhoto(url);
    expect(cloudinaryDelete).toHaveBeenCalledWith('gallery/espaço foto');
  });

  it('should throw error for invalid URL', async () => {
    await expect(deleteGalleryPhoto('not-a-url')).rejects.toThrow(
      'URL de foto inválida'
    );
  });

  it('should throw error for non-cloudinary domain', async () => {
    await expect(
      deleteGalleryPhoto('https://example.com/image.jpg')
    ).rejects.toThrow('URL de foto inválida');
  });

  it('should throw error for URL without /upload/ path', async () => {
    await expect(
      deleteGalleryPhoto('https://res.cloudinary.com/demo/image/photo.jpg')
    ).rejects.toThrow('URL de foto inválida');
  });
});
