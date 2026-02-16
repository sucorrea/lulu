'use client';
import { memo, useCallback, useEffect } from 'react';

import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { GenericDialog } from '@/components/dialog/dialog';
import CommentSection from './comment-section';
import LikeUnlikeButton from './like-unlike-button';
import { downloadPhoto } from './utils';
import { useGallery } from './gallery-context';

const PhotoModal = memo(function PhotoModal() {
  const {
    selectedIndex,
    selectedPhoto,
    photos,
    closePhoto,
    nextPhoto,
    prevPhoto,
    toggleLike,
    getPhotoStats,
    getComments,
    user,
  } = useGallery();

  const isOpen = selectedIndex !== null && selectedPhoto !== null;
  const photo = selectedPhoto ?? '';
  const totalPhotos = photos.length;
  const index = selectedIndex ?? 0;

  const stats = getPhotoStats(index);
  const comments = getComments(photo);

  const handleDownload = useCallback(() => {
    if (photo) {
      downloadPhoto(photo);
    }
  }, [photo]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevPhoto();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextPhoto();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, prevPhoto, nextPhoto]);

  if (!isOpen) {
    return null;
  }

  return (
    <GenericDialog
      open={isOpen}
      onOpenChange={(open) => !open && closePhoto()}
      title="Foto"
      description={`${index + 1} de ${totalPhotos}`}
      className="max-w-[100vw] h-full sm:h-auto sm:max-w-4xl bg-transparent border-none shadow-none p-4 flex flex-col items-center justify-center gap-4 [&>button]:text-white [&>button]:bg-black/20 [&>button]:hover:bg-black/40 [&>button]:rounded-full [&>button]:h-10 [&>button]:w-10 [&>button]:top-4 [&>button]:right-4"
    >
      <div className="relative flex w-full flex-col items-center justify-center gap-4">
        <div className="relative flex w-full max-w-md items-center justify-center">
          <button
            onClick={prevPhoto}
            aria-label={`Foto anterior (${index === 0 ? totalPhotos : index} de ${totalPhotos})`}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ left: -20 }}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div className="flex flex-1 justify-center">
            <Image
              src={photo}
              alt={`Foto ${index + 1} de ${totalPhotos} na galeria`}
              width={400}
              height={400}
              priority
              className="object-contain rounded max-h-[60vh] max-w-full"
            />
          </div>

          <button
            onClick={nextPhoto}
            aria-label={`Próxima foto (${index === totalPhotos - 1 ? 1 : index + 2} de ${totalPhotos})`}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ right: -20 }}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-lulu-md">
          <div className="mb-2 flex justify-between gap-4">
            <LikeUnlikeButton
              handleLike={toggleLike}
              liked={stats.isLiked}
              likes={stats.likesCount}
              index={index}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              aria-label="Baixar foto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <CommentSection comments={comments} userId={user?.uid ?? null} />
        </div>
      </div>
    </GenericDialog>
  );
});

export default PhotoModal;
