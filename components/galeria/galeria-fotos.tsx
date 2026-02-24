'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { useVirtualizer } from '@tanstack/react-virtual';
import { Skeleton } from '@/components/ui/skeleton';

import ErrorState from '@/components/error-state';

import PhotoItem from './photo-item';
import UploadPhotoGallery from './upload-photo-gallery';

const PhotoModal = dynamic(() => import('./photo-modal'), { ssr: false });
import { CommentProvider } from './comment-context';
import { GalleryProvider, useGallery } from './gallery-context';

const SKELETON_COUNT = 15;
const VIRTUALIZATION_THRESHOLD = 50;
const ESTIMATED_ROW_HEIGHT = 140;

const GalleryContent = () => {
  const {
    photos,
    isLoading,
    isError,
    refetch,
    selectPhoto,
    toggleLike,
    getPhotoStats,
    addComment,
    editComment,
    deleteComment,
  } = useGallery();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showSkeleton = !isClient || isLoading;

  const parentRef = useRef<HTMLUListElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: photos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const firstVirtualItem = virtualItems.at(0);
  const lastVirtualItem = virtualItems.at(-1);
  const paddingTop = firstVirtualItem?.start ?? 0;
  const paddingBottom =
    lastVirtualItem == null ? 0 : totalSize - (lastVirtualItem.end ?? 0);

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar galeria"
        message="Não foi possível carregar as fotos da galeria. Verifique sua conexão e tente novamente."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      {showSkeleton && (
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

      {!showSkeleton && photos.length > VIRTUALIZATION_THRESHOLD && (
        <ul
          ref={parentRef}
          className="list-none p-0 m-0 h-[70vh] overflow-auto"
          aria-label="Galeria de fotos"
        >
          <li
            className="list-none"
            style={{
              paddingTop,
              paddingBottom,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const idx = virtualRow.index;
              const photo = photos[idx];

              if (!photo) {
                return null;
              }

              const stats = getPhotoStats(idx);

              return (
                <div
                  key={photo}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                >
                  <PhotoItem
                    photo={photo}
                    index={idx}
                    liked={stats.isLiked}
                    likes={stats.likesCount}
                    commentCount={stats.commentCount}
                    onSelect={selectPhoto}
                    onLike={toggleLike}
                  />
                </div>
              );
            })}
          </li>
        </ul>
      )}

      {!showSkeleton && photos.length <= VIRTUALIZATION_THRESHOLD && (
        <ul
          className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 list-none p-0 m-0"
          aria-label="Galeria de fotos"
        >
          {photos.map((photo: string, idx: number) => {
            const stats = getPhotoStats(idx);
            return (
              <li key={photo}>
                <PhotoItem
                  photo={photo}
                  index={idx}
                  liked={stats.isLiked}
                  likes={stats.likesCount}
                  commentCount={stats.commentCount}
                  onSelect={selectPhoto}
                  onLike={toggleLike}
                />
              </li>
            );
          })}
        </ul>
      )}

      <CommentProvider
        onSubmitComment={addComment}
        onEditComment={editComment}
        onDeleteComment={deleteComment}
      >
        <PhotoModal />
      </CommentProvider>
    </>
  );
};

const GaleriaFotos = () => {
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="lulu-header mb-0 text-2xl md:text-3xl">Galeria</h1>
        <UploadPhotoGallery />
      </div>
      <GalleryProvider>
        <GalleryContent />
      </GalleryProvider>
    </div>
  );
};

export default GaleriaFotos;
