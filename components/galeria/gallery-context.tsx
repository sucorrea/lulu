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

import { toast } from 'sonner';

import { useUserVerification } from '@/hooks/user-verify';
import type { GaleriaComment } from '@/services/galeriaComments';
import { likePhoto, unlikePhoto } from '@/services/galeriaLikes';
import { deleteGalleryPhoto } from '@/services/queries/deleteGalleryPhoto';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';

import { likesReducer } from './gallery-reducers';
import { useGalleryRealtime } from './use-gallery-realtime';
import { usePhotoComments } from './use-photo-comments';
import { usePhotoNavigation } from './use-photo-navigation';
import { onGetPhotoId } from './utils';

export interface PhotoStats {
  isLiked: boolean;
  likesCount: number;
  commentCount: number;
}

interface GalleryContextType {
  photos: string[];
  isLoading: boolean;
  isError: boolean;
  isDeleting: boolean;
  user: ReturnType<typeof useUserVerification>['user'];
  isAdmin: boolean;
  selectedIndex: number | null;
  selectedPhoto: string | null;
  getPhotoStats: (index: number) => PhotoStats;
  getComments: (photo: string) => GaleriaComment[];
  selectPhoto: (index: number) => void;
  closePhoto: () => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
  toggleLike: (index: number) => void;
  deletePhoto: (photo: string) => Promise<void>;
  addComment: (text: string) => Promise<void>;
  editComment: (commentId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  refetch: () => void;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

const EMPTY_STATS: PhotoStats = {
  isLiked: false,
  likesCount: 0,
  commentCount: 0,
};

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, isAdmin } = useUserVerification();
  const { data, isLoading, isError, refetch } = useGetGalleryImages();
  const photos = useMemo(() => data ?? [], [data]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [, startTransition] = useTransition();

  const getPhotoId = useCallback((photo: string) => onGetPhotoId(photo), []);
  const { firestoreLikes, firestoreComments } = useGalleryRealtime(
    photos,
    getPhotoId
  );

  const navigation = usePhotoNavigation(photos);
  const { selectedPhoto, closePhoto } = navigation;

  const comments = usePhotoComments({
    user,
    selectedPhoto,
    firestoreComments,
    getPhotoId,
  });

  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    { likes: firestoreLikes },
    likesReducer
  );

  const getPhotoStats = useCallback(
    (index: number): PhotoStats => {
      const photo = photos[index];
      if (!photo) {
        return EMPTY_STATS;
      }

      const effectiveLikes =
        optimisticLikes.likes[photo] ?? firestoreLikes[photo] ?? [];

      return {
        isLiked: user ? effectiveLikes.includes(user.uid) : false,
        likesCount: effectiveLikes.length,
        commentCount: firestoreComments[photo]?.length ?? 0,
      };
    },
    [photos, optimisticLikes.likes, firestoreLikes, firestoreComments, user]
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
      const isCurrentlyLiked = getPhotoStats(index).isLiked;

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

  const deletePhoto = useCallback(
    async (photo: string) => {
      if (!photo || isDeleting) {
        return;
      }
      setIsDeleting(true);
      try {
        await deleteGalleryPhoto(photo);
        if (selectedPhoto === photo) {
          closePhoto();
        }
        refetch();
        toast.success('Foto excluída com sucesso.', {
          position: 'bottom-center',
        });
      } catch (error) {
        console.error('Error deleting photo:', error);
        toast.error('Erro ao excluir a foto.', { position: 'bottom-center' });
      } finally {
        setIsDeleting(false);
      }
    },
    [selectedPhoto, closePhoto, refetch, isDeleting]
  );

  const value = useMemo(
    () => ({
      photos,
      isLoading,
      isError,
      isDeleting,
      user,
      isAdmin,
      ...navigation,
      ...comments,
      getPhotoStats,
      toggleLike,
      deletePhoto,
      refetch,
    }),
    [
      photos,
      isLoading,
      isError,
      isDeleting,
      user,
      isAdmin,
      navigation,
      comments,
      getPhotoStats,
      toggleLike,
      deletePhoto,
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
