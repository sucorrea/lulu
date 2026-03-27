import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockConfig = vi.fn();

vi.mock('cloudinary', () => ({
  v2: {
    config: (...args: unknown[]) => mockConfig(...args),
  },
}));

describe('lib/cloudinary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should configure cloudinary with env variables', async () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET = 'test-secret';

    await import('./cloudinary');

    expect(mockConfig).toHaveBeenCalledWith({
      cloud_name: 'test-cloud',
      api_key: 'test-key',
      api_secret: 'test-secret',
    });
  });

  it('should export cloudinary v2 instance', async () => {
    const mod = await import('./cloudinary');
    expect(mod.default).toBeDefined();
    expect(mod.default.config).toBeDefined();
  });
});
