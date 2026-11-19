import { useCallback, useMemo, useOptimistic, useTransition } from 'react';
import type { User } from 'firebase/auth';

import {
  addCommentToPhoto,
  deleteCommentFromPhoto,
  editCommentOnPhoto,
} from '@/services/galeriaComments';

import { commentsReducer, type CommentState } from './gallery-reducers';

interface UsePhotoCommentsParams {
  user: User | null;
  selectedPhoto: string | null;
  firestoreComments: CommentState;
  getPhotoId: (photo: string) => string;
}

const getDisplayName = (user: User): string =>
  user.displayName ?? user.email ?? 'Usuário';

export const usePhotoComments = ({
  user,
  selectedPhoto,
  firestoreComments,
  getPhotoId,
}: UsePhotoCommentsParams) => {
  const [, startTransition] = useTransition();
  const [comments, dispatch] = useOptimistic(
    firestoreComments,
    commentsReducer
  );

  const getComments = useCallback(
    (photo: string) => comments[photo] ?? [],
    [comments]
  );

  const addComment = useCallback(
    async (text: string) => {
      if (!user || !selectedPhoto) {
        return;
      }
      const photoId = getPhotoId(selectedPhoto);
      const comment = text.trim();
      const displayName = getDisplayName(user);

      startTransition(async () => {
        dispatch({
          type: 'add',
          photo: selectedPhoto,
          comment: {
            id: `opt-${globalThis.crypto.randomUUID()}`,
            userId: user.uid,
            displayName,
            comment,
            createdAt: new Date().toISOString(),
          },
        });

        try {
          await addCommentToPhoto(photoId, {
            userId: user.uid,
            displayName,
            comment,
          });
        } catch (error) {
          console.error('Error adding comment:', error);
        }
      });
    },
    [user, selectedPhoto, getPhotoId, dispatch]
  );

  const editComment = useCallback(
    async (commentId: string, text: string) => {
      if (!selectedPhoto) {
        return;
      }
      const photoId = getPhotoId(selectedPhoto);
      const trimmed = text.trim();

      startTransition(async () => {
        dispatch({
          type: 'edit',
          photo: selectedPhoto,
          commentId,
          text: trimmed,
        });

        try {
          await editCommentOnPhoto(photoId, commentId, trimmed);
        } catch (error) {
          console.error('Error editing comment:', error);
        }
      });
    },
    [selectedPhoto, getPhotoId, dispatch]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!selectedPhoto) {
        return;
      }
      const photoId = getPhotoId(selectedPhoto);

      startTransition(async () => {
        dispatch({ type: 'delete', photo: selectedPhoto, commentId });

        try {
          await deleteCommentFromPhoto(photoId, commentId);
        } catch (error) {
          console.error('Error deleting comment:', error);
        }
      });
    },
    [selectedPhoto, getPhotoId, dispatch]
  );

  return useMemo(
    () => ({ getComments, addComment, editComment, deleteComment }),
    [getComments, addComment, editComment, deleteComment]
  );
};
