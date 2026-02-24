import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import {
  addCommentToPhoto,
  deleteCommentFromPhoto,
  editCommentOnPhoto,
  listenPhotoComments,
  GaleriaComment,
} from './galeriaComments';
import * as firebase from './firebase';
import * as firestore from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

vi.mock('./firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => {
  const doc = vi.fn();
  const getDoc = vi.fn();
  const setDoc = vi.fn();
  const updateDoc = vi.fn();
  const arrayUnion = vi.fn((val) => val);
  const onSnapshot = vi.fn();
  const runTransaction = vi.fn(
    async (
      _db: unknown,
      callback: (transaction: {
        get: typeof getDoc;
        update: typeof updateDoc;
      }) => Promise<void> | void
    ) =>
      callback({
        get: getDoc,
        update: updateDoc,
      })
  );

  return {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    onSnapshot,
    runTransaction,
  };
});

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('galeriaComments', () => {
  const mockPhotoId = 'photo-123';
  const mockCommentId = 'comment-456';
  const mockUserId = 'user-789';
  const mockDisplayName = 'Test User';
  const mockCommentText = 'Test comment';
  const mockNewText = 'Updated comment';

  let mockDocRef: object;
  let mockSnapshot: {
    exists: () => boolean;
    data: () => { comments: GaleriaComment[] };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDocRef = {};
    mockSnapshot = {
      exists: vi.fn(() => true),
      data: vi.fn(() => ({ comments: [] })),
    };

    (firestore.doc as Mock).mockReturnValue(mockDocRef);
    (uuidv4 as Mock).mockReturnValue(mockCommentId);
  });

  describe('addCommentToPhoto', () => {
    it('should add comment to existing document', async () => {
      const existingComments: GaleriaComment[] = [
        {
          id: 'existing-1',
          userId: 'user-1',
          displayName: 'User 1',
          comment: 'Existing comment',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments: existingComments }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      const newComment: Omit<GaleriaComment, 'id'> = {
        userId: mockUserId,
        displayName: mockDisplayName,
        comment: mockCommentText,
      };

      await addCommentToPhoto(mockPhotoId, newComment);

      expect(firestore.doc).toHaveBeenCalledWith(
        firebase.db,
        'galeria-comments',
        mockPhotoId
      );
      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: expect.objectContaining({
          id: mockCommentId,
          userId: mockUserId,
          displayName: mockDisplayName,
          comment: mockCommentText,
          createdAt: expect.any(String),
        }),
      });
      expect(firestore.setDoc).not.toHaveBeenCalled();
    });

    it('should create new document if it does not exist', async () => {
      mockSnapshot.exists = vi.fn(() => false);
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      const newComment: Omit<GaleriaComment, 'id'> = {
        userId: mockUserId,
        displayName: mockDisplayName,
        comment: mockCommentText,
      };

      await addCommentToPhoto(mockPhotoId, newComment);

      expect(firestore.doc).toHaveBeenCalledWith(
        firebase.db,
        'galeria-comments',
        mockPhotoId
      );
      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.setDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [
          expect.objectContaining({
            id: mockCommentId,
            userId: mockUserId,
            displayName: mockDisplayName,
            comment: mockCommentText,
            createdAt: expect.any(String),
          }),
        ],
      });
      expect(firestore.updateDoc).not.toHaveBeenCalled();
    });

    it('should add comment with all optional fields', async () => {
      mockSnapshot.exists = vi.fn(() => false);
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      const newComment: Omit<GaleriaComment, 'id'> = {
        userId: mockUserId,
        displayName: mockDisplayName,
        comment: mockCommentText,
        createdAt: '2024-01-01T00:00:00.000Z',
        editedAt: '2024-01-02T00:00:00.000Z',
      };

      await addCommentToPhoto(mockPhotoId, newComment);

      expect(firestore.setDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [
          expect.objectContaining({
            id: mockCommentId,
            userId: mockUserId,
            displayName: mockDisplayName,
            comment: mockCommentText,
            editedAt: '2024-01-02T00:00:00.000Z',
          }),
        ],
      });
    });
  });

  describe('deleteCommentFromPhoto', () => {
    it('should delete comment from existing document', async () => {
      const comments: GaleriaComment[] = [
        {
          id: mockCommentId,
          userId: mockUserId,
          displayName: mockDisplayName,
          comment: mockCommentText,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'comment-2',
          userId: 'user-2',
          displayName: 'User 2',
          comment: 'Another comment',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await deleteCommentFromPhoto(mockPhotoId, mockCommentId);

      expect(firestore.doc).toHaveBeenCalledWith(
        firebase.db,
        'galeria-comments',
        mockPhotoId
      );
      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [
          {
            id: 'comment-2',
            userId: 'user-2',
            displayName: 'User 2',
            comment: 'Another comment',
            createdAt: '2024-01-02T00:00:00.000Z',
          },
        ],
      });
    });

    it('should return early if document does not exist', async () => {
      mockSnapshot.exists = vi.fn(() => false);
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await deleteCommentFromPhoto(mockPhotoId, mockCommentId);

      expect(firestore.doc).toHaveBeenCalledWith(
        firebase.db,
        'galeria-comments',
        mockPhotoId
      );
      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.updateDoc).not.toHaveBeenCalled();
    });

    it('should handle empty comments array', async () => {
      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments: [] }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await deleteCommentFromPhoto(mockPhotoId, mockCommentId);

      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [],
      });
    });

    it('should handle missing comments field', async () => {
      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments: [] }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await deleteCommentFromPhoto(mockPhotoId, mockCommentId);

      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [],
      });
    });
  });

  describe('editCommentOnPhoto', () => {
    it('should edit comment on existing document', async () => {
      const comments: GaleriaComment[] = [
        {
          id: mockCommentId,
          userId: mockUserId,
          displayName: mockDisplayName,
          comment: mockCommentText,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'comment-2',
          userId: 'user-2',
          displayName: 'User 2',
          comment: 'Another comment',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await editCommentOnPhoto(mockPhotoId, mockCommentId, mockNewText);

      expect(firestore.doc).toHaveBeenCalledWith(
        firebase.db,
        'galeria-comments',
        mockPhotoId
      );
      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [
          {
            id: mockCommentId,
            userId: mockUserId,
            displayName: mockDisplayName,
            comment: mockNewText,
            createdAt: '2024-01-01T00:00:00.000Z',
            editedAt: expect.any(String),
          },
          {
            id: 'comment-2',
            userId: 'user-2',
            displayName: 'User 2',
            comment: 'Another comment',
            createdAt: '2024-01-02T00:00:00.000Z',
          },
        ],
      });
    });

    it('should return early if document does not exist', async () => {
      mockSnapshot.exists = vi.fn(() => false);
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await editCommentOnPhoto(mockPhotoId, mockCommentId, mockNewText);

      expect(firestore.doc).toHaveBeenCalledWith(
        firebase.db,
        'galeria-comments',
        mockPhotoId
      );
      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(firestore.updateDoc).not.toHaveBeenCalled();
    });

    it('should handle empty comments array', async () => {
      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments: [] }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await editCommentOnPhoto(mockPhotoId, mockCommentId, mockNewText);

      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [],
      });
    });

    it('should handle missing comments field', async () => {
      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments: [] }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await editCommentOnPhoto(mockPhotoId, mockCommentId, mockNewText);

      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [],
      });
    });

    it('should preserve all comment fields when editing', async () => {
      const comments: GaleriaComment[] = [
        {
          id: mockCommentId,
          userId: mockUserId,
          displayName: mockDisplayName,
          comment: mockCommentText,
          createdAt: '2024-01-01T00:00:00.000Z',
          editedAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await editCommentOnPhoto(mockPhotoId, mockCommentId, mockNewText);

      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments: [
          {
            id: mockCommentId,
            userId: mockUserId,
            displayName: mockDisplayName,
            comment: mockNewText,
            createdAt: '2024-01-01T00:00:00.000Z',
            editedAt: expect.any(String),
          },
        ],
      });
    });

    it('should not modify comments that do not match commentId', async () => {
      const comments: GaleriaComment[] = [
        {
          id: 'comment-1',
          userId: 'user-1',
          displayName: 'User 1',
          comment: 'Comment 1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'comment-2',
          userId: 'user-2',
          displayName: 'User 2',
          comment: 'Comment 2',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      mockSnapshot.exists = vi.fn(() => true);
      mockSnapshot.data = vi.fn(() => ({ comments }));
      (firestore.getDoc as Mock).mockResolvedValue(mockSnapshot);

      await editCommentOnPhoto(mockPhotoId, 'non-existent-id', mockNewText);

      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        comments,
      });
    });
  });

  describe('listenPhotoComments', () => {
    it('should listen to photo comments and call callback with comments', () => {
      const mockCallback = vi.fn();
      const comments: GaleriaComment[] = [
        {
          id: mockCommentId,
          userId: mockUserId,
          displayName: mockDisplayName,
          comment: mockCommentText,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const mockUnsubscribe = vi.fn();
      (firestore.onSnapshot as Mock).mockImplementation(
        (ref, callback: (snap: typeof mockSnapshot) => void) => {
          const snap = {
            exists: () => true,
            data: () => ({ comments }),
          };
          callback(snap);
          return mockUnsubscribe;
        }
      );

      const unsubscribe = listenPhotoComments(mockPhotoId, mockCallback);

      expect(firestore.doc).toHaveBeenCalledWith(
        firebase.db,
        'galeria-comments',
        mockPhotoId
      );
      expect(firestore.onSnapshot).toHaveBeenCalledWith(
        mockDocRef,
        expect.any(Function)
      );
      expect(mockCallback).toHaveBeenCalledWith(comments);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should call callback with empty array if document does not exist', () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      (firestore.onSnapshot as Mock).mockImplementation(
        (ref, callback: (snap: typeof mockSnapshot) => void) => {
          const snap = {
            exists: () => false,
            data: () => ({ comments: [] }),
          };
          callback(snap);
          return mockUnsubscribe;
        }
      );

      const unsubscribe = listenPhotoComments(mockPhotoId, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith([]);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should call callback with empty array if comments field is missing', () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      (firestore.onSnapshot as Mock).mockImplementation(
        (ref, callback: (snap: typeof mockSnapshot) => void) => {
          const snap = {
            exists: () => true,
            data: () => ({ comments: [] }),
          };
          callback(snap);
          return mockUnsubscribe;
        }
      );

      const unsubscribe = listenPhotoComments(mockPhotoId, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith([]);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should call callback with empty array if comments is empty', () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      (firestore.onSnapshot as Mock).mockImplementation(
        (ref, callback: (snap: typeof mockSnapshot) => void) => {
          const snap = {
            exists: () => true,
            data: () => ({ comments: [] }),
          };
          callback(snap);
          return mockUnsubscribe;
        }
      );

      const unsubscribe = listenPhotoComments(mockPhotoId, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith([]);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should return unsubscribe function', () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      (firestore.onSnapshot as Mock).mockReturnValue(mockUnsubscribe);

      const unsubscribe = listenPhotoComments(mockPhotoId, mockCallback);

      expect(typeof unsubscribe).toBe('function');
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
