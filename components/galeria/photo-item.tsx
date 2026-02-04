'use client';
import { memo } from 'react';

import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

import LikeUnlikeButton from './like-unlike-button';

interface PhotoItemProps {
  photo: string;
  index: number;
  liked: boolean;
  likes: number;
  commentCount: number;
  onSelect: (index: number) => void;
  onLike: (index: number) => void;
}

const PhotoItem = memo(function PhotoItem({
  photo,
  index,
  liked,
  likes,
  commentCount,
  onSelect,
  onLike,
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
      <div className="mt-1 flex items-center justify-between">
        <LikeUnlikeButton
          handleLike={onLike}
          liked={liked}
          likes={likes}
          index={index}
        />
        <button
          onClick={() => onSelect(index)}
          className="flex items-center justify-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Ver ${commentCount} comentário${commentCount === 1 ? '' : 's'} da foto`}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>{commentCount}</span>
        </button>
      </div>
    </div>
  );
});

export default PhotoItem;
