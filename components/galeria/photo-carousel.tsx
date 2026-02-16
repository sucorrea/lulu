'use client';
import { memo } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoCarouselProps {
  children: React.ReactNode;
  selectedIndex: number | null;
  photos: string[];
  nextPhoto: () => void;
  prevPhoto: () => void;
}

const PhotoCarousel = memo(function PhotoCarousel({
  children,
  selectedIndex,
  photos,
  nextPhoto,
  prevPhoto,
}: PhotoCarouselProps) {
  const totalPhotos = photos.length;
  const index = selectedIndex ?? 0;

  return (
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
        <div className="flex flex-1 justify-center">{children}</div>
        <button
          onClick={nextPhoto}
          aria-label={`Próxima foto (${index === totalPhotos - 1 ? 1 : index + 2} de ${totalPhotos})`}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ right: -20 }}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

export default PhotoCarousel;
