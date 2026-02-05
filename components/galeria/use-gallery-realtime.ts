import { useCallback, useEffect, useState } from 'react';

import {
  listenPhotoComments,
  type GaleriaComment,
} from '@/services/galeriaComments';
import { listenPhotoLikes } from '@/services/galeriaLikes';

type LikesState = Record<string, string[]>;
type CommentsState = Record<string, GaleriaComment[]>;

type GetPhotoIdFn = (photo: string) => string;

export const useGalleryRealtime = (
  photos: string[],
  getPhotoId: GetPhotoIdFn
) => {
  const [firestoreLikes, setFirestoreLikes] = useState<LikesState>({});
  const [firestoreComments, setFirestoreComments] = useState<CommentsState>({});

  const applyLikesForPhoto = useCallback((photo: string, users: string[]) => {
    setFirestoreLikes((prev) => ({ ...prev, [photo]: users }));
  }, []);

  const applyCommentsForPhoto = useCallback(
    (photo: string, commentsList: GaleriaComment[]) => {
      setFirestoreComments((prev) => ({ ...prev, [photo]: commentsList }));
    },
    []
  );

  useEffect(() => {
    if (!photos.length) {
      return;
    }

    const unsubscribes = photos.map((photo: string) =>
      listenPhotoLikes(getPhotoId(photo), (users) =>
        applyLikesForPhoto(photo, users)
      )
    );

    return () => unsubscribes.forEach((u: () => void) => u());
  }, [photos, getPhotoId, applyLikesForPhoto]);

  useEffect(() => {
    if (!photos.length) {
      return;
    }

    const unsubscribes = photos.map((photo: string) =>
      listenPhotoComments(getPhotoId(photo), (commentsList) =>
        applyCommentsForPhoto(photo, commentsList)
      )
    );

    return () => unsubscribes.forEach((u: () => void) => u());
  }, [photos, getPhotoId, applyCommentsForPhoto]);

  return {
    firestoreLikes,
    firestoreComments,
  };
};
