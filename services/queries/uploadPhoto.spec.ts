import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadPhoto } from './uploadPhoto';

vi.mock('@/lib/auth-guard', () => ({
  assertAdmin: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../firebase', () => ({
  default: {},
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(() => ({})),
  uploadBytes: vi.fn().mockResolvedValue({}),
  getDownloadURL: vi.fn().mockResolvedValue('https://example.com/photo.jpg'),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  setDoc: vi.fn().mockResolvedValue(undefined),
}));

describe('uploadPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call assertAdmin before uploading', async () => {
    const { assertAdmin } = await import('@/lib/auth-guard');
    const { getDownloadURL } = await import('firebase/storage');

    vi.mocked(getDownloadURL).mockResolvedValue(
      'https://example.com/photo.jpg'
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await uploadPhoto({ file, participantId: '123' });

    expect(assertAdmin).toHaveBeenCalled();
  });

  it('should upload the file to storage using the participant id path', async () => {
    const { ref, uploadBytes, getDownloadURL } = await import(
      'firebase/storage'
    );

    vi.mocked(getDownloadURL).mockResolvedValue(
      'https://example.com/photo.jpg'
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await uploadPhoto({ file, participantId: 'participant-456' });

    expect(ref).toHaveBeenCalledWith(
      expect.anything(),
      'images/participant-456.jpg'
    );
    expect(uploadBytes).toHaveBeenCalled();
  });

  it('should save the download URL to Firestore', async () => {
    const { getDownloadURL } = await import('firebase/storage');
    const { setDoc } = await import('firebase/firestore');

    vi.mocked(getDownloadURL).mockResolvedValue(
      'https://example.com/photo.jpg'
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await uploadPhoto({ file, participantId: '123' });

    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ photoURL: 'https://example.com/photo.jpg' }),
      { merge: true }
    );
  });

  it('should return the download URL', async () => {
    const { getDownloadURL } = await import('firebase/storage');
    vi.mocked(getDownloadURL).mockResolvedValue(
      'https://storage.example.com/img.jpg'
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await uploadPhoto({ file, participantId: '123' });

    expect(result).toBe('https://storage.example.com/img.jpg');
  });

  it('should include photoUpdatedAt timestamp in Firestore document', async () => {
    const { getDownloadURL } = await import('firebase/storage');
    const { setDoc } = await import('firebase/firestore');

    vi.mocked(getDownloadURL).mockResolvedValue(
      'https://example.com/photo.jpg'
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await uploadPhoto({ file, participantId: '123' });

    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ photoUpdatedAt: expect.any(Number) }),
      { merge: true }
    );
  });
});
