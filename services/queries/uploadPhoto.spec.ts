import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadPhoto } from './uploadPhoto';

vi.mock('../cloudinary', () => ({
  cloudinaryUpload: vi
    .fn()
    .mockResolvedValue({
      url: 'https://res.cloudinary.com/demo/image/upload/images/123.jpg',
      publicId: 'images/123',
    }),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  setDoc: vi.fn().mockResolvedValue(undefined),
}));

describe('uploadPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call cloudinaryUpload with correct params', async () => {
    const { cloudinaryUpload } = await import('../cloudinary');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await uploadPhoto({ file, participantId: '123' });

    expect(cloudinaryUpload).toHaveBeenCalledWith({
      file,
      folder: 'images',
      publicId: '123',
    });
  });

  it('should upload the file using the participant id as publicId', async () => {
    const { cloudinaryUpload } = await import('../cloudinary');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await uploadPhoto({ file, participantId: 'participant-456' });

    expect(cloudinaryUpload).toHaveBeenCalledWith(
      expect.objectContaining({ publicId: 'participant-456' })
    );
  });

  it('should save the download URL to Firestore', async () => {
    const { setDoc } = await import('firebase/firestore');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await uploadPhoto({ file, participantId: '123' });

    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        photoURL: 'https://res.cloudinary.com/demo/image/upload/images/123.jpg',
      }),
      { merge: true }
    );
  });

  it('should return the download URL', async () => {
    const { cloudinaryUpload } = await import('../cloudinary');
    vi.mocked(cloudinaryUpload).mockResolvedValue({
      url: 'https://res.cloudinary.com/demo/image/upload/images/img.jpg',
      publicId: 'images/img',
    });

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await uploadPhoto({ file, participantId: '123' });

    expect(result).toBe(
      'https://res.cloudinary.com/demo/image/upload/images/img.jpg'
    );
  });

  it('should include photoUpdatedAt timestamp in Firestore document', async () => {
    const { setDoc } = await import('firebase/firestore');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await uploadPhoto({ file, participantId: '123' });

    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ photoUpdatedAt: expect.any(Number) }),
      { merge: true }
    );
  });
});
