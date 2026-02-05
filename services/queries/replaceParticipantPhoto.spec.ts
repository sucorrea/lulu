import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../firebase', () => ({
  storage: {},
  db: {},
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

import { replaceParticipantPhoto } from './replaceParticipantPhoto';
import * as firebaseStorage from 'firebase/storage';
import * as firebaseFirestore from 'firebase/firestore';

const mockRef = firebaseStorage.ref as ReturnType<typeof vi.fn>;
const mockUploadBytes = firebaseStorage.uploadBytes as ReturnType<typeof vi.fn>;
const mockGetDownloadURL = firebaseStorage.getDownloadURL as ReturnType<
  typeof vi.fn
>;
const mockDeleteObject = firebaseStorage.deleteObject as ReturnType<
  typeof vi.fn
>;
const mockDoc = firebaseFirestore.doc as ReturnType<typeof vi.fn>;
const mockGetDoc = firebaseFirestore.getDoc as ReturnType<typeof vi.fn>;
const mockUpdateDoc = firebaseFirestore.updateDoc as ReturnType<typeof vi.fn>;

describe('replaceParticipantPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  it('should replace participant photo with Firebase Storage URL and delete old image', async () => {
    const participantId = 'participant-123';
    const oldImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/old%2Fimage.jpg?token=abc';
    const newImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Fnew-image.jpg?token=xyz';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 1,
        name: 'John Doe',
        picture: oldImageUrl,
        photoURL: oldImageUrl,
      }),
    };
    const mockOldImageRef = { fullPath: 'old/image.jpg' };
    const mockNewImageRef = { fullPath: 'images/new-image.jpg' };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockRef.mockImplementation((storage, path) => {
      if (path === 'old/image.jpg') {
        return mockOldImageRef;
      }
      if (path === 'images/new-image.jpg') {
        return mockNewImageRef;
      }
      return null;
    });
    mockDeleteObject.mockResolvedValue(undefined);
    mockUploadBytes.mockResolvedValue({ ref: mockNewImageRef });
    mockGetDownloadURL.mockResolvedValue(newImageUrl);
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockDoc).toHaveBeenCalledWith({}, 'participants', participantId);
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    expect(mockRef).toHaveBeenCalledWith({}, 'old/image.jpg');
    expect(mockDeleteObject).toHaveBeenCalledWith(mockOldImageRef);
    expect(mockRef).toHaveBeenCalledWith({}, 'images/new-image.jpg');
    expect(mockUploadBytes).toHaveBeenCalledWith(mockNewImageRef, file);
    expect(mockGetDownloadURL).toHaveBeenCalledWith(mockNewImageRef);
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
      picture: newImageUrl,
      photoURL: newImageUrl,
      photoUpdatedAt: 1234567890,
    });
  });

  it('should replace participant photo without deleting old image when picture is not Firebase Storage URL', async () => {
    const participantId = 'participant-456';
    const oldImageUrl = 'https://example.com/old-image.jpg';
    const newImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Fnew-image.jpg?token=xyz';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 2,
        name: 'Jane Doe',
        picture: oldImageUrl,
      }),
    };
    const mockNewImageRef = { fullPath: 'images/new-image.jpg' };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockRef.mockReturnValue(mockNewImageRef);
    mockUploadBytes.mockResolvedValue({ ref: mockNewImageRef });
    mockGetDownloadURL.mockResolvedValue(newImageUrl);
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockDeleteObject).not.toHaveBeenCalled();
    expect(mockUploadBytes).toHaveBeenCalledWith(mockNewImageRef, file);
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
      picture: newImageUrl,
      photoURL: newImageUrl,
      photoUpdatedAt: 1234567890,
    });
  });

  it('should replace participant photo without deleting when picture is undefined', async () => {
    const participantId = 'participant-789';
    const newImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Fnew-image.jpg?token=xyz';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 3,
        name: 'Bob Smith',
        picture: undefined,
      }),
    };
    const mockNewImageRef = { fullPath: 'images/new-image.jpg' };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockRef.mockReturnValue(mockNewImageRef);
    mockUploadBytes.mockResolvedValue({ ref: mockNewImageRef });
    mockGetDownloadURL.mockResolvedValue(newImageUrl);
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockDeleteObject).not.toHaveBeenCalled();
  });

  it('should throw error when participant is not found', async () => {
    const participantId = 'nonexistent';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => undefined,
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);

    await expect(replaceParticipantPhoto(participantId, file)).rejects.toThrow(
      'Participante não encontrado'
    );
    expect(mockUploadBytes).not.toHaveBeenCalled();
    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('should continue upload when old image deletion fails', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn');
    const participantId = 'participant-error';
    const oldImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/old%2Fimage.jpg?token=abc';
    const newImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Fnew-image.jpg?token=xyz';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 4,
        name: 'Error User',
        picture: oldImageUrl,
      }),
    };
    const mockOldImageRef = { fullPath: 'old/image.jpg' };
    const mockNewImageRef = { fullPath: 'images/new-image.jpg' };
    const deleteError = new Error('Delete failed');

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockRef.mockImplementation((storage, path) => {
      if (path === 'old/image.jpg') {
        return mockOldImageRef;
      }
      if (path === 'images/new-image.jpg') {
        return mockNewImageRef;
      }
      return null;
    });
    mockDeleteObject.mockRejectedValue(deleteError);
    mockUploadBytes.mockResolvedValue({ ref: mockNewImageRef });
    mockGetDownloadURL.mockResolvedValue(newImageUrl);
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Erro ao deletar imagem antiga:',
      deleteError
    );
    expect(mockUploadBytes).toHaveBeenCalledWith(mockNewImageRef, file);
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
      picture: newImageUrl,
      photoURL: newImageUrl,
      photoUpdatedAt: 1234567890,
    });
  });

  it('should handle Firebase Storage URL with encoded path segments', async () => {
    const participantId = 'participant-encoded';
    const oldImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Fimage.jpg?token=abc';
    const newImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Fnew-image.jpg?token=xyz';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 5,
        name: 'Encoded Path User',
        picture: oldImageUrl,
      }),
    };
    const mockOldImageRef = { fullPath: 'path/to/image.jpg' };
    const mockNewImageRef = { fullPath: 'images/new-image.jpg' };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockRef.mockImplementation((_storage, path) => {
      if (path === 'path/to/image.jpg') {
        return mockOldImageRef;
      }
      if (path === 'images/new-image.jpg') {
        return mockNewImageRef;
      }
      return null;
    });
    mockDeleteObject.mockResolvedValue(undefined);
    mockUploadBytes.mockResolvedValue({ ref: mockNewImageRef });
    mockGetDownloadURL.mockResolvedValue(newImageUrl);
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockRef).toHaveBeenCalledWith({}, 'path/to/image.jpg');
    expect(mockDeleteObject).toHaveBeenCalledWith(mockOldImageRef);
  });

  it('should handle file with special characters in name', async () => {
    const participantId = 'participant-special';
    const newImageUrl =
      'https://firebasestorage.googleapis.com/v0/b/bucket/o/images%2Fspecial%20file%20(1).jpg?token=xyz';
    const file = new File(['content'], 'special file (1).jpg', {
      type: 'image/jpeg',
    });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 6,
        name: 'Special Char User',
        picture: undefined,
      }),
    };
    const mockNewImageRef = { fullPath: 'images/special file (1).jpg' };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockRef.mockReturnValue(mockNewImageRef);
    mockUploadBytes.mockResolvedValue({ ref: mockNewImageRef });
    mockGetDownloadURL.mockResolvedValue(newImageUrl);
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockRef).toHaveBeenCalledWith({}, 'images/special file (1).jpg');
    expect(mockUploadBytes).toHaveBeenCalledWith(mockNewImageRef, file);
  });
});
