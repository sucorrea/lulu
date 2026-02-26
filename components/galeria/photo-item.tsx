'use client';
import { memo } from 'react';

import { MessageCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import LikeUnlikeButton from './like-unlike-button';
import { confirmDeletePhoto } from './utils';

interface PhotoItemProps {
  photo: string;
  index: number;
  liked: boolean;
  likes: number;
  commentCount: number;
  isAdmin: boolean;
  isDeleting: boolean;
  onSelect: (index: number) => void;
  onLike: (index: number) => void;
  onDelete: (index: number) => void;
}

const PhotoItem = memo(function PhotoItem({
  photo,
  index,
  liked,
  likes,
  commentCount,
  isAdmin,
  isDeleting,
  onSelect,
  onLike,
  onDelete,
}: PhotoItemProps) {
  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(index)}
        className="block w-full aspect-square overflow-hidden rounded shadow"
        aria-label={`Abrir foto ${index + 1} da galeria`}
      >
        <Image
          src={photo}
          alt={`Foto ${index + 1} da galeria`}
          width={300}
          height={300}
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
          loading={index < 6 ? 'eager' : 'lazy'}
          priority={index < 3}
          className="object-cover w-full h-full"
        />
      </button>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1.5 py-1 bg-black/50 rounded-b [&_svg]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] [&_span]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        <LikeUnlikeButton
          handleLike={onLike}
          liked={liked}
          likes={likes}
          index={index}
          className="text-white text-xs py-0.5 [&>span]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
        />
        <button
          onClick={() => onSelect(index)}
          className="flex items-center gap-1 text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Ver ${commentCount} comentário${commentCount === 1 ? '' : 's'} da foto`}
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{commentCount}</span>
        </button>
      </div>

      {isAdmin && (
        <Button
          size="icon"
          variant="destructive"
          className="absolute top-1 right-1 z-10 h-6 w-6 opacity-90 transition-opacity hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDeleting) {
              confirmDeletePhoto(() => onDelete(index));
            }
          }}
          disabled={isDeleting}
          aria-label={`Excluir foto ${index + 1} da galeria`}
        >
          <Trash2 className="h-3 w-3" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
});

export default PhotoItem;
