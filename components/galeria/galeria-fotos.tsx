'use client';
import {
  useCallback,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { useUserVerification } from '@/hooks/user-verify';
import {
  addCommentToPhoto,
  deleteCommentFromPhoto,
  editCommentOnPhoto,
} from '@/services/galeriaComments';
import { likePhoto, unlikePhoto } from '@/services/galeriaLikes';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';
import ErrorState from '@/components/error-state';

import PhotoItem from './photo-item';
import PhotoModal from './photo-modal';
import UploadPhotoGallery from './upload-photo-gallery';
import { CommentProvider } from './comment-context';
import { useGalleryRealtime } from './use-gallery-realtime';
import { onGetPhotoId } from './utils';

const SKELETON_COUNT = 15;
const VIRTUALIZATION_THRESHOLD = 50;
const ESTIMATED_ROW_HEIGHT = 140;

interface LikeState {
  likes: { [photo: string]: string[] };
}

type LikeAction = {
  type: 'toggle';
  photo: string;
  userId: string;
  isCurrentlyLiked: boolean;
};

const GaleriaFotos = () => {
  const { data, isLoading, isError, refetch } = useGetGalleryImages();
  const photos = useMemo(() => data ?? [], [data]);
  const { user } = useUserVerification();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [selected, setSelected] = useState<number | null>(null);

  const getPhotoId = useCallback((photo: string) => onGetPhotoId(photo), []);

  const { firestoreLikes, firestoreComments } = useGalleryRealtime(
    photos,
    getPhotoId
  );

  const [optimisticLikes, setOptimisticLike] = useOptimistic<
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

  const likesData = useMemo(() => {
    const effectiveLikes = optimisticLikes.likes;
    return photos.map((photo: string) => ({
      count:
        effectiveLikes[photo]?.length ?? firestoreLikes[photo]?.length ?? 0,
      isLiked: user
        ? (effectiveLikes[photo]?.includes(user.uid) ??
          firestoreLikes[photo]?.includes(user.uid) ??
          false)
        : false,
    }));
  }, [photos, optimisticLikes.likes, firestoreLikes, user]);

  const commentCounts = useMemo(
    () => photos.map((photo: string) => firestoreComments[photo]?.length ?? 0),
    [photos, firestoreComments]
  );

  const handleLike = useCallback(
    (idx: number) => {
      if (!user) {
        router.push('/login');
        return;
      }
      const photo = photos[idx];
      if (!photo) {
        return;
      }

      const photoId = getPhotoId(photo);
      const isCurrentlyLiked = likesData[idx]?.isLiked ?? false;

      startTransition(async () => {
        setOptimisticLike({
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
    [user, router, photos, getPhotoId, likesData, setOptimisticLike]
  );

  const handleComment = useCallback(
    async (commentText: string) => {
      if (!user) {
        return;
      }
      if (selected === null || !commentText.trim()) {
        return;
      }
      const photo = photos[selected];
      if (!photo) {
        return;
      }

      const photoId = getPhotoId(photo);
      await addCommentToPhoto(photoId, {
        userId: user.uid,
        displayName: user.displayName ?? user.email ?? 'Usuário',
        comment: commentText.trim(),
      });
    },
    [user, selected, photos, getPhotoId]
  );

  const handleEditComment = useCallback(
    async (commentId: string, newText: string) => {
      if (selected === null) {
        return;
      }
      const photo = photos[selected];
      if (!photo) {
        return;
      }
      const photoId = getPhotoId(photo);
      await editCommentOnPhoto(photoId, commentId, newText.trim());
    },
    [selected, photos, getPhotoId]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (selected === null) {
        return;
      }
      const photo = photos[selected];
      if (!photo) {
        return;
      }
      const photoId = getPhotoId(photo);
      await deleteCommentFromPhoto(photoId, commentId);
    },
    [selected, photos, getPhotoId]
  );

  const handlePrev = useCallback(() => {
    setSelected((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setSelected((prev) => (prev === null ? null : (prev + 1) % photos.length));
  }, [photos.length]);

  const selectedPhoto = selected === null ? null : (photos[selected] ?? null);

  const handleCloseModal = useCallback(() => {
    setSelected(null);
  }, []);

  const parentRef = useRef<HTMLUListElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: photos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 10,
  });

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="lulu-header mb-0 text-2xl md:text-3xl">Galeria</h1>
          <UploadPhotoGallery />
        </div>
        <ErrorState
          title="Erro ao carregar galeria"
          message="Não foi possível carregar as fotos da galeria. Verifique sua conexão e tente novamente."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="lulu-header mb-0 text-2xl md:text-3xl">Galeria</h1>
        <UploadPhotoGallery />
      </div>

      {isLoading && (
        <ul
          className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 list-none p-0 m-0"
          aria-label="Galeria de fotos"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, idx) => (
            <li
              key={idx}
              className="relative group"
              data-testid="skeleton-item"
              aria-label="Carregando foto"
            >
              <div className="block w-full aspect-square overflow-hidden rounded shadow">
                <Skeleton className="w-full aspect-square" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && photos.length > VIRTUALIZATION_THRESHOLD && (
        <ul
          ref={parentRef}
          className="list-none p-0 m-0 h-[70vh] overflow-auto"
          aria-label="Galeria de fotos"
        >
          <li
            className="relative list-none"
            style={{
              height: rowVirtualizer.getTotalSize(),
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const idx = virtualRow.index;
              const photo = photos[idx];

              if (!photo) {
                return null;
              }

              return (
                <div
                  key={photo}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <PhotoItem
                    photo={photo}
                    index={idx}
                    liked={likesData[idx]?.isLiked ?? false}
                    likes={likesData[idx]?.count ?? 0}
                    commentCount={commentCounts[idx] ?? 0}
                    onSelect={setSelected}
                    onLike={handleLike}
                  />
                </div>
              );
            })}
          </li>
        </ul>
      )}

      {!isLoading && photos.length <= VIRTUALIZATION_THRESHOLD && (
        <ul
          className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 list-none p-0 m-0"
          aria-label="Galeria de fotos"
        >
          {photos.map((photo: string, idx: number) => (
            <li key={photo}>
              <PhotoItem
                photo={photo}
                index={idx}
                liked={likesData[idx]?.isLiked ?? false}
                likes={likesData[idx]?.count ?? 0}
                commentCount={commentCounts[idx] ?? 0}
                onSelect={setSelected}
                onLike={handleLike}
              />
            </li>
          ))}
        </ul>
      )}
      <CommentProvider
        onSubmitComment={handleComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      >
        <PhotoModal
          isOpen={selected !== null && selectedPhoto !== null}
          selectedIndex={selected ?? 0}
          totalPhotos={photos.length}
          photo={selectedPhoto ?? ''}
          liked={
            selected === null ? false : (likesData[selected]?.isLiked ?? false)
          }
          likes={selected === null ? 0 : (likesData[selected]?.count ?? 0)}
          comments={
            selectedPhoto ? (firestoreComments[selectedPhoto] ?? []) : []
          }
          userId={user?.uid ?? null}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
          onLike={handleLike}
        />
      </CommentProvider>
    </div>
  );
};

export default GaleriaFotos;
