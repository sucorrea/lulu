'use client';
import React from 'react';
import clsx from 'clsx';

import { HeartIcon } from 'lucide-react';

interface LikeUnlikeButtonProps {
  likes: number[];
  liked: boolean[];
  handleLike: (index: number) => void;
  index: number;
}

const LikeUnlikeButton = ({
  likes,
  liked,
  handleLike,
  index,
}: LikeUnlikeButtonProps) => {
  const isLiked = liked[index];

  return (
    <button
      onClick={() => handleLike(index)}
      className={clsx(
        'flex items-center justify-center gap-1 rounded-full px-2 py-1 text-sm transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isLiked ? 'scale-110 text-primary' : 'text-muted-foreground'
      )}
      aria-label={isLiked ? 'Descurtir' : 'Curtir'}
    >
      <HeartIcon
        className={clsx(
          'h-4 w-4',
          isLiked ? 'text-primary fill-primary' : 'text-muted-foreground'
        )}
      />
      <span>{likes[index]}</span>
    </button>
  );
};

export default LikeUnlikeButton;
