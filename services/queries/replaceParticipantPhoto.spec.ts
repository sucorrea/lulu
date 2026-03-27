import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../cloudinary', () => ({
  cloudinaryUpload: vi.fn(),
  cloudinaryDelete: vi.fn(),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

import { replaceParticipantPhoto } from './replaceParticipantPhoto';
import * as cloudinaryModule from '../cloudinary';
import * as firebaseFirestore from 'firebase/firestore';

const mockCloudinaryUpload = cloudinaryModule.cloudinaryUpload as ReturnType<
  typeof vi.fn
>;
const mockCloudinaryDelete = cloudinaryModule.cloudinaryDelete as ReturnType<
  typeof vi.fn
>;
const mockDoc = firebaseFirestore.doc as ReturnType<typeof vi.fn>;
const mockGetDoc = firebaseFirestore.getDoc as ReturnType<typeof vi.fn>;
const mockUpdateDoc = firebaseFirestore.updateDoc as ReturnType<typeof vi.fn>;

describe('replaceParticipantPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  it('should replace participant photo with Cloudinary URL and delete old image', async () => {
    const participantId = 'participant-123';
    const oldImageUrl =
      'https://res.cloudinary.com/demo/image/upload/v1234567890/images/old-image.jpg';
    const newImageUrl =
      'https://res.cloudinary.com/demo/image/upload/v1234567890/images/new-image.jpg';
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

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockCloudinaryDelete.mockResolvedValue(undefined);
    mockCloudinaryUpload.mockResolvedValue({
      url: newImageUrl,
      publicId: 'images/new-image',
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockDoc).toHaveBeenCalledWith({}, 'participants', participantId);
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    expect(mockCloudinaryDelete).toHaveBeenCalledWith('images/old-image');
    expect(mockCloudinaryUpload).toHaveBeenCalledWith({
      file,
      folder: 'images',
      publicId: 'new-image',
    });
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
      picture: newImageUrl,
      photoURL: newImageUrl,
      photoUpdatedAt: 1234567890,
    });
  });

  it('should replace participant photo without deleting old image when picture is not Cloudinary URL', async () => {
    const participantId = 'participant-456';
    const oldImageUrl = 'https://example.com/old-image.jpg';
    const newImageUrl =
      'https://res.cloudinary.com/demo/image/upload/v1234567890/images/new-image.jpg';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 2,
        name: 'Jane Doe',
        picture: oldImageUrl,
      }),
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockCloudinaryUpload.mockResolvedValue({
      url: newImageUrl,
      publicId: 'images/new-image',
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockCloudinaryDelete).not.toHaveBeenCalled();
    expect(mockCloudinaryUpload).toHaveBeenCalled();
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
      picture: newImageUrl,
      photoURL: newImageUrl,
      photoUpdatedAt: 1234567890,
    });
  });

  it('should replace participant photo without deleting when picture is undefined', async () => {
    const participantId = 'participant-789';
    const newImageUrl =
      'https://res.cloudinary.com/demo/image/upload/v1234567890/images/new-image.jpg';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 3,
        name: 'Bob Smith',
        picture: undefined,
      }),
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockCloudinaryUpload.mockResolvedValue({
      url: newImageUrl,
      publicId: 'images/new-image',
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockCloudinaryDelete).not.toHaveBeenCalled();
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
    expect(mockCloudinaryUpload).not.toHaveBeenCalled();
    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('should continue upload when old image deletion fails', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn');
    const participantId = 'participant-error';
    const oldImageUrl =
      'https://res.cloudinary.com/demo/image/upload/v1234567890/images/old-image.jpg';
    const newImageUrl =
      'https://res.cloudinary.com/demo/image/upload/v1234567890/images/new-image.jpg';
    const file = new File(['content'], 'new-image.jpg', { type: 'image/jpeg' });
    const deleteError = new Error('Delete failed');

    const mockDocRef = { id: participantId };
    const mockSnapshot = {
      data: () => ({
        id: 4,
        name: 'Error User',
        picture: oldImageUrl,
      }),
    };

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockCloudinaryDelete.mockRejectedValue(deleteError);
    mockCloudinaryUpload.mockResolvedValue({
      url: newImageUrl,
      publicId: 'images/new-image',
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Erro ao deletar imagem antiga:',
      deleteError
    );
    expect(mockCloudinaryUpload).toHaveBeenCalled();
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, {
      picture: newImageUrl,
      photoURL: newImageUrl,
      photoUpdatedAt: 1234567890,
    });
  });

  it('should handle file with special characters in name', async () => {
    const participantId = 'participant-special';
    const newImageUrl =
      'https://res.cloudinary.com/demo/image/upload/v1234567890/images/special-file-1.jpg';
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

    mockDoc.mockReturnValue(mockDocRef);
    mockGetDoc.mockResolvedValue(mockSnapshot);
    mockCloudinaryUpload.mockResolvedValue({
      url: newImageUrl,
      publicId: 'images/special file (1)',
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    const result = await replaceParticipantPhoto(participantId, file);

    expect(result).toBe(newImageUrl);
    expect(mockCloudinaryUpload).toHaveBeenCalledWith({
      file,
      folder: 'images',
      publicId: 'special file (1)',
    });
  });
});
