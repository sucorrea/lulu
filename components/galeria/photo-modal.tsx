'use client';
import { memo, useCallback, useEffect } from 'react';

import { Download } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { GenericDialog } from '@/components/dialog/dialog';
import CommentSection from './comment-section';
import LikeUnlikeButton from './like-unlike-button';
import { downloadPhoto } from './utils';
import { useGallery } from './gallery-context';
import PhotoCarousel from './photo-carousel';

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
      className="rounded"
      footer={
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
      }
    >
      <PhotoCarousel
        selectedIndex={selectedIndex}
        photos={photos}
        nextPhoto={nextPhoto}
        prevPhoto={prevPhoto}
      >
        <Image
          src={photo}
          alt={`Foto ${index + 1} de ${totalPhotos} na galeria`}
          width={400}
          height={400}
          priority
          className="object-contain rounded max-h-[60vh] max-w-full"
        />
      </PhotoCarousel>
    </GenericDialog>
  );
});

export default PhotoModal;
