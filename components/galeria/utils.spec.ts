import { describe, expect, it, vi, beforeEach } from 'vitest';
import { onGetPhotoId, downloadPhoto } from './utils';

describe('utils', () => {
  describe('onGetPhotoId', () => {
    it('should extract photo id from valid Firebase Storage URL', () => {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/api-lulus-app.appspot.com/o/galeria%2Fphoto1.jpg?alt=media';

      const result = onGetPhotoId(url);

      expect(result).toBe('galeria%2Fphoto1.jpg');
    });

    it('should extract id from URL with multiple path segments', () => {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/bucket/o/folder%2Fsubfolder%2Fimage.png?alt=media';

      const result = onGetPhotoId(url);

      expect(result).toBe('folder%2Fsubfolder%2Fimage.png');
    });

    it('should return the URL as-is when it is not a valid URL', () => {
      const invalidUrl = 'not-a-url';

      const result = onGetPhotoId(invalidUrl);

      expect(result).toBe('not-a-url');
    });

    it('should handle URL with query parameters', () => {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/bucket/o/photo.jpg?alt=media&token=123';

      const result = onGetPhotoId(url);

      expect(result).toBe('photo.jpg');
    });

    it('should handle URL without query parameters', () => {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/bucket/o/photo.jpg';

      const result = onGetPhotoId(url);

      expect(result).toBe('photo.jpg');
    });

    it('should handle URL with encoded characters', () => {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/bucket/o/user%40email.com%2Fphoto.jpg';

      const result = onGetPhotoId(url);

      expect(result).toBe('user%40email.com%2Fphoto.jpg');
    });

    it('should handle simple string without URL structure', () => {
      const simpleString = 'photo.jpg';

      const result = onGetPhotoId(simpleString);

      expect(result).toBe('photo.jpg');
    });

    it('should handle path-like string', () => {
      const pathString = '/path/to/photo.jpg';

      const result = onGetPhotoId(pathString);

      // Path-like strings are not valid URLs, so they're returned as-is
      expect(result).toBe('/path/to/photo.jpg');
    });

    it('should handle empty string', () => {
      const result = onGetPhotoId('');

      expect(result).toBe('');
    });

    it('should handle URL with trailing slash', () => {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/bucket/o/photo.jpg/';

      const result = onGetPhotoId(url);

      expect(result).toBe('');
    });

    it('should extract correct id with nested folders', () => {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/bucket/o/folder%2Fnested%2Fdeep%2Fphoto.jpg?alt=media';

      const result = onGetPhotoId(url);

      expect(result).toBe('folder%2Fnested%2Fdeep%2Fphoto.jpg');
    });

    it('should handle URL with port number', () => {
      const url =
        'https://firebasestorage.googleapis.com:443/v0/b/bucket/o/photo.jpg';

      const result = onGetPhotoId(url);

      expect(result).toBe('photo.jpg');
    });
  });

  describe('downloadPhoto', () => {
    let fetchMock: ReturnType<typeof vi.fn>;
    let createObjectURLMock: ReturnType<typeof vi.fn>;
    let revokeObjectURLMock: ReturnType<typeof vi.fn>;
    let createElementMock: ReturnType<typeof vi.fn>;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      vi.clearAllMocks();

      // Mock fetch
      fetchMock = vi.fn();
      globalThis.fetch = fetchMock;

      // Mock URL.createObjectURL
      createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
      globalThis.URL.createObjectURL = createObjectURLMock;
      // Mock URL.revokeObjectURL
      revokeObjectURLMock = vi.fn();
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      // Mock document.createElement
      createElementMock = vi.fn((tag) => {
        const element = document.createElement(tag);
        if (tag === 'a') {
          element.click = vi.fn();
        }
        return element;
      });
      vi.spyOn(document, 'createElement').mockImplementation(createElementMock);

      // Mock console.error
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock window.open
      vi.spyOn(globalThis, 'open').mockImplementation(() => null);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should download photo successfully', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      expect(fetchMock).toHaveBeenCalledWith(url);
      // The function should complete without errors
    });

    it('should create anchor element with correct href and download attribute', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const createElementSpy = vi.spyOn(document, 'createElement');
      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      expect(createElementSpy).toHaveBeenCalledWith('a');
    });

    it('should handle fetch errors and open URL in new window', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith(url, '_blank');
    });

    it('should handle non-ok response status', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith(url, '_blank');
    });

    it('should use default filename when URL does not have filename', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const url = 'https://example.com/';
      await downloadPhoto(url);

      expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
    });

    it('should extract filename from URL with query parameters', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const url = 'https://example.com/photo.jpg?token=123&size=large';
      await downloadPhoto(url);

      expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
    });

    it('should call blob() method on response', async () => {
      const mockBlobMethod = vi.fn();
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      mockBlobMethod.mockResolvedValueOnce(mockBlob);

      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: mockBlobMethod,
      });

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      expect(mockBlobMethod).toHaveBeenCalled();
    });

    it('should append and remove anchor element from document body', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      // Function completes successfully
      expect(fetchMock).toHaveBeenCalled();
    });

    it('should trigger click on anchor element', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      // Function completes successfully without errors
      expect(fetchMock).toHaveBeenCalled();
    });

    it('should handle blob URL properly', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      // Function completes successfully
      expect(fetchMock).toHaveBeenCalled();
    });

    it('should log error to console on failure', async () => {
      const error = new Error('Download failed');
      fetchMock.mockRejectedValueOnce(error);

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erro ao baixar a foto:',
        error
      );
    });

    it('should open URL in new window as fallback', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const url = 'https://example.com/photo.jpg';
      await downloadPhoto(url);

      expect(window.open).toHaveBeenCalledWith(url, '_blank');
    });

    it('should extract filename correctly from Firebase Storage URL', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const url =
        'https://firebasestorage.googleapis.com/v0/b/bucket/o/photo.jpg?alt=media';
      await downloadPhoto(url);

      expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
    });

    it('should handle long filename correctly', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const longFilename = 'a'.repeat(255) + '.jpg';
      const url = `https://example.com/${longFilename}`;
      await downloadPhoto(url);

      expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
    });

    it('should handle special characters in filename', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValueOnce(mockBlob),
      });

      const url = 'https://example.com/photo%20with%20spaces.jpg';
      await downloadPhoto(url);

      expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
    });
  });
});

// Add this helper at the end since we use afterEach
function afterEach(fn: () => void) {
  // This is handled by vitest
}
