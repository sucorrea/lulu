'use client';
import React from 'react';

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
  return (
    <button
      onClick={() => handleLike(index)}
      className={`flex justify-center items-center gap-1  text-lg transition-transform ${liked[index] ? 'scale-110' : ''}`}
      aria-label={liked[index] ? 'Descurtir' : 'Curtir'}
    >
      {liked[index] ? (
        <HeartIcon color="red" size={15} />
      ) : (
        <HeartIcon color="red" fill="red" size={15} />
      )}
      {likes[index]}
    </button>
  );
};

export default LikeUnlikeButton;
