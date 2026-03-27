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

  it('should throw when URL is malformed', async () => {
    await expect(deleteGalleryPhoto('not-a-valid-url')).rejects.toThrow(
      'URL de foto inválida'
    );
  });

  it('should throw when URL is not a Cloudinary URL', async () => {
    await expect(
      deleteGalleryPhoto('https://example.com/some/path/photo.jpg')
    ).rejects.toThrow('URL de foto inválida');
  });

  it('should throw when URL does not contain /upload/ segment', async () => {
    await expect(
      deleteGalleryPhoto('https://res.cloudinary.com/demo/image/photo.jpg')
    ).rejects.toThrow('URL de foto inválida');
  });

  it('should propagate errors from cloudinaryDelete', async () => {
    const { cloudinaryDelete } = await import('../cloudinary');
    vi.mocked(cloudinaryDelete).mockRejectedValue(
      new Error('Erro ao deletar imagem')
    );

    await expect(deleteGalleryPhoto(makeUrl('gallery/photo'))).rejects.toThrow(
      'Erro ao deletar imagem'
    );
  });
});
