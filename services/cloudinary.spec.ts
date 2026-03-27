import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetIdToken = vi.fn().mockResolvedValue('mock-token');

vi.mock('firebase/auth', () => ({
  getAuth: () => ({
    currentUser: { getIdToken: mockGetIdToken },
  }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('services/cloudinary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cloudinaryUpload', () => {
    it('should upload file successfully', async () => {
      const { cloudinaryUpload } = await import('./cloudinary');
      const mockResponse = {
        url: 'https://example.com/img.jpg',
        publicId: 'folder/img',
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const result = await cloudinaryUpload({
        file,
        folder: 'gallery',
        publicId: 'img',
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/cloudinary/upload', {
        method: 'POST',
        headers: { Authorization: 'Bearer mock-token' },
        body: expect.any(FormData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when upload fails', async () => {
      const { cloudinaryUpload } = await import('./cloudinary');
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload falhou' }),
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      await expect(
        cloudinaryUpload({ file, folder: 'gallery', publicId: 'img' })
      ).rejects.toThrow('Upload falhou');
    });

    it('should throw default error when response has no error message', async () => {
      const { cloudinaryUpload } = await import('./cloudinary');
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      await expect(
        cloudinaryUpload({ file, folder: 'gallery', publicId: 'img' })
      ).rejects.toThrow('Erro ao fazer upload');
    });

    it('should throw when user is not authenticated', async () => {
      vi.resetModules();
      vi.doMock('firebase/auth', () => ({
        getAuth: () => ({ currentUser: null }),
      }));

      const { cloudinaryUpload } = await import('./cloudinary');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      await expect(
        cloudinaryUpload({ file, folder: 'gallery', publicId: 'img' })
      ).rejects.toThrow('Usuário não autenticado');

      // Restore the mock for subsequent tests
      vi.resetModules();
      vi.doMock('firebase/auth', () => ({
        getAuth: () => ({
          currentUser: { getIdToken: mockGetIdToken },
        }),
      }));
    });
  });

  describe('cloudinaryDelete', () => {
    it('should delete image successfully', async () => {
      const { cloudinaryDelete } = await import('./cloudinary');
      mockFetch.mockResolvedValue({ ok: true });

      await cloudinaryDelete('gallery/photo');

      expect(mockFetch).toHaveBeenCalledWith('/api/cloudinary/delete', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId: 'gallery/photo' }),
      });
    });

    it('should throw error when delete fails', async () => {
      const { cloudinaryDelete } = await import('./cloudinary');
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Delete falhou' }),
      });

      await expect(cloudinaryDelete('gallery/photo')).rejects.toThrow(
        'Delete falhou'
      );
    });

    it('should throw default error when response has no error message', async () => {
      const { cloudinaryDelete } = await import('./cloudinary');
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(cloudinaryDelete('gallery/photo')).rejects.toThrow(
        'Erro ao deletar imagem'
      );
    });
  });

  describe('cloudinaryListGallery', () => {
    it('should list gallery URLs successfully', async () => {
      const { cloudinaryListGallery } = await import('./cloudinary');
      const urls = ['https://example.com/1.jpg', 'https://example.com/2.jpg'];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ urls }),
      });

      const result = await cloudinaryListGallery();

      expect(mockFetch).toHaveBeenCalledWith('/api/cloudinary/list');
      expect(result).toEqual(urls);
    });

    it('should throw error when list fails', async () => {
      const { cloudinaryListGallery } = await import('./cloudinary');
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'List falhou' }),
      });

      await expect(cloudinaryListGallery()).rejects.toThrow('List falhou');
    });

    it('should throw default error when response has no error message', async () => {
      const { cloudinaryListGallery } = await import('./cloudinary');
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(cloudinaryListGallery()).rejects.toThrow(
        'Erro ao listar galeria'
      );
    });
  });
});
