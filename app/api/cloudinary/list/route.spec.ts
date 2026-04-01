import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockResources = vi.fn();

vi.mock('@/lib/cloudinary', () => ({
  default: {
    api: {
      resources: (...args: unknown[]) => mockResources(...args),
    },
  },
}));

import { GET, listAllGalleryUrls } from './route';

describe('GET /api/cloudinary/list', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('lists gallery URLs from a single Cloudinary page', async () => {
    mockResources.mockResolvedValue({
      resources: [
        { secure_url: 'https://example.com/1.jpg' },
        { secure_url: 'https://example.com/2.jpg' },
      ],
    });

    const result = await listAllGalleryUrls();

    expect(result).toEqual([
      'https://example.com/1.jpg',
      'https://example.com/2.jpg',
    ]);
    expect(mockResources).toHaveBeenCalledWith({
      type: 'upload',
      prefix: 'gallery/',
      max_results: 500,
      resource_type: 'image',
      next_cursor: undefined,
    });
  });

  it('paginates through Cloudinary resources until next_cursor is exhausted', async () => {
    mockResources
      .mockResolvedValueOnce({
        resources: [{ secure_url: 'https://example.com/1.jpg' }],
        next_cursor: 'cursor-1',
      })
      .mockResolvedValueOnce({
        resources: [{ secure_url: 'https://example.com/2.jpg' }],
      });

    const result = await listAllGalleryUrls();

    expect(result).toEqual([
      'https://example.com/1.jpg',
      'https://example.com/2.jpg',
    ]);
    expect(mockResources).toHaveBeenNthCalledWith(1, {
      type: 'upload',
      prefix: 'gallery/',
      max_results: 500,
      resource_type: 'image',
      next_cursor: undefined,
    });
    expect(mockResources).toHaveBeenNthCalledWith(2, {
      type: 'upload',
      prefix: 'gallery/',
      max_results: 500,
      resource_type: 'image',
      next_cursor: 'cursor-1',
    });
  });

  it('returns urls from the route response', async () => {
    mockResources.mockResolvedValue({
      resources: [{ secure_url: 'https://example.com/1.jpg' }],
    });

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      urls: ['https://example.com/1.jpg'],
    });
  });

  it('returns 500 when Cloudinary listing fails', async () => {
    mockResources.mockRejectedValue(new Error('Cloudinary failed'));

    const res = await GET();

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: 'Erro ao listar imagens da galeria',
    });
  });
});
