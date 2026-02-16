'use client';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from 'react';

import { useUserVerification } from '@/hooks/user-verify';
import {
  addCommentToPhoto,
  deleteCommentFromPhoto,
  editCommentOnPhoto,
  GaleriaComment,
} from '@/services/galeriaComments';
import { likePhoto, unlikePhoto } from '@/services/galeriaLikes';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';

import { useGalleryRealtime } from './use-gallery-realtime';
import { onGetPhotoId } from './utils';

export interface PhotoStats {
  isLiked: boolean;
  likesCount: number;
  commentCount: number;
}

interface LikeState {
  likes: { [photo: string]: string[] };
}

type LikeAction = {
  type: 'toggle';
  photo: string;
  userId: string;
  isCurrentlyLiked: boolean;
};

interface GalleryContextType {
  photos: string[];
  isLoading: boolean;
  isError: boolean;
  user: ReturnType<typeof useUserVerification>['user'];
  selectedIndex: number | null;
  selectedPhoto: string | null;
  getPhotoStats: (index: number) => PhotoStats;
  getComments: (photo: string) => GaleriaComment[];
  selectPhoto: (index: number) => void;
  closePhoto: () => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
  toggleLike: (index: number) => void;
  addComment: (text: string) => Promise<void>;
  editComment: (commentId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  refetch: () => void;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user } = useUserVerification();
  const { data, isLoading, isError, refetch } = useGetGalleryImages();
  const photos = useMemo(() => data ?? [], [data]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const getPhotoId = useCallback((photo: string) => onGetPhotoId(photo), []);

  const { firestoreLikes, firestoreComments } = useGalleryRealtime(
    photos,
    getPhotoId
  );
  const [optimisticLikes, setOptimisticLikes] = useOptimistic<
    LikeState,
    LikeAction
  >({ likes: firestoreLikes }, (state, action) => {
    if (action.type === 'toggle') {
      const currentLikes = state.likes[action.photo] ?? [];
      const newLikes = action.isCurrentlyLiked
        ? currentLikes.filter((uid) => uid !== action.userId)
        : [...currentLikes, action.userId];
      return {
        ...state,
        likes: { ...state.likes, [action.photo]: newLikes },
      };
    }
    return state;
  });

  const selectedPhoto =
    selectedIndex === null ? null : (photos[selectedIndex] ?? null);

  const selectPhoto = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closePhoto = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const nextPhoto = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % photos.length
    );
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const getPhotoStats = useCallback(
    (index: number): PhotoStats => {
      const photo = photos[index];
      if (!photo) {
        return { isLiked: false, likesCount: 0, commentCount: 0 };
      }

      const effectiveLikes =
        optimisticLikes.likes[photo] ?? firestoreLikes[photo] ?? [];
      const isLiked = user ? effectiveLikes.includes(user.uid) : false;
      const likesCount = effectiveLikes.length;
      const commentCount = firestoreComments[photo]?.length ?? 0;

      return { isLiked, likesCount, commentCount };
    },
    [photos, optimisticLikes.likes, firestoreLikes, firestoreComments, user]
  );

  const getComments = useCallback(
    (photo: string) => {
      return firestoreComments[photo] ?? [];
    },
    [firestoreComments]
  );

  const toggleLike = useCallback(
    (index: number) => {
      if (!user) {
        router.push('/login');
        return;
      }
      const photo = photos[index];
      if (!photo) {
        return;
      }

      const photoId = getPhotoId(photo);
      const stats = getPhotoStats(index);
      const isCurrentlyLiked = stats.isLiked;

      startTransition(async () => {
        setOptimisticLikes({
          type: 'toggle',
          photo,
          userId: user.uid,
          isCurrentlyLiked,
        });

        try {
          if (isCurrentlyLiked) {
            await unlikePhoto(photoId, user.uid);
          } else {
            await likePhoto(photoId, user.uid);
          }
        } catch (error) {
          console.error('Error toggling like:', error);
        }
      });
    },
    [photos, user, router, getPhotoId, getPhotoStats, setOptimisticLikes]
  );

  const addComment = useCallback(
    async (text: string) => {
      if (!user || !selectedPhoto) {
        return;
      }
      const photoId = getPhotoId(selectedPhoto);
      await addCommentToPhoto(photoId, {
        userId: user.uid,
        displayName: user.displayName ?? user.email ?? 'Usuário',
        comment: text.trim(),
      });
    },
    [user, selectedPhoto, getPhotoId]
  );

  const editComment = useCallback(
    async (commentId: string, text: string) => {
      if (!selectedPhoto) {
        return;
      }
      const photoId = getPhotoId(selectedPhoto);
      await editCommentOnPhoto(photoId, commentId, text.trim());
    },
    [selectedPhoto, getPhotoId]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!selectedPhoto) {
        return;
      }
      const photoId = getPhotoId(selectedPhoto);
      await deleteCommentFromPhoto(photoId, commentId);
    },
    [selectedPhoto, getPhotoId]
  );

  const value = useMemo(
    () => ({
      photos,
      isLoading,
      isError,
      user,
      selectedIndex,
      selectedPhoto,
      getPhotoStats,
      getComments,
      selectPhoto,
      closePhoto,
      nextPhoto,
      prevPhoto,
      toggleLike,
      addComment,
      editComment,
      deleteComment,
      refetch,
    }),
    [
      photos,
      isLoading,
      isError,
      user,
      selectedIndex,
      selectedPhoto,
      getPhotoStats,
      getComments,
      selectPhoto,
      closePhoto,
      nextPhoto,
      prevPhoto,
      toggleLike,
      addComment,
      editComment,
      deleteComment,
      refetch,
    ]
  );

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
