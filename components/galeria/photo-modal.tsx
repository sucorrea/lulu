'use client';
import { memo, useCallback, useEffect, useRef } from 'react';

import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import type { GaleriaComment } from '@/services/galeriaComments';
import CommentSection from './comment-section';
import LikeUnlikeButton from './like-unlike-button';
import { downloadPhoto } from './utils';

interface PhotoModalProps {
  isOpen: boolean;
  selectedIndex: number;
  totalPhotos: number;
  photo: string;
  liked: boolean;
  likes: number;
  comments: GaleriaComment[];
  userId: string | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLike: (index: number) => void;
}

const PhotoModal = memo(function PhotoModal({
  isOpen,
  selectedIndex,
  totalPhotos,
  photo,
  liked,
  likes,
  comments,
  userId,
  onClose,
  onPrev,
  onNext,
  onLike,
}: PhotoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDownload = useCallback(() => {
    downloadPhoto(photo);
  }, [photo]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  useEffect(() => {
    if (isOpen && dialogRef.current && !dialogRef.current.open) {
      if (typeof dialogRef.current.showModal === 'function') {
        dialogRef.current.showModal();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      open
      className="fixed inset-0 z-50 flex flex-col items-center justify-center border-0 bg-black/80 px-4 [&::backdrop]:bg-black/80"
      aria-label={`Visualização da foto ${selectedIndex + 1} de ${totalPhotos}`}
      aria-modal="true"
      onClose={onClose}
      data-testid="photo-dialog"
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Foto {selectedIndex + 1} de {totalPhotos}
      </div>

      <button
        className="absolute right-4 top-4 text-2xl text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
        onClick={onClose}
        aria-label="Fechar visualização"
      >
        <X aria-hidden="true" />
      </button>

      <div className="relative flex w-full max-w-md items-center justify-center">
        <button
          onClick={onPrev}
          aria-label={`Foto anterior (${selectedIndex === 0 ? totalPhotos : selectedIndex} de ${totalPhotos})`}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ left: 8 }}
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <div className="flex flex-1 justify-center">
          <Image
            src={photo}
            alt={`Foto ${selectedIndex + 1} de ${totalPhotos} na galeria`}
            width={400}
            height={400}
            priority
            className="object-contain rounded max-h-[60vh] max-w-full"
          />
        </div>

        <button
          onClick={onNext}
          aria-label={`Próxima foto (${selectedIndex === totalPhotos - 1 ? 1 : selectedIndex + 2} de ${totalPhotos})`}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ right: 8 }}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-lulu-md">
        <div className="mb-2 flex justify-between gap-4">
          <LikeUnlikeButton
            handleLike={onLike}
            liked={liked}
            likes={likes}
            index={selectedIndex}
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

        <CommentSection comments={comments} userId={userId} />
      </div>
    </dialog>
  );
});

export default PhotoModal;
