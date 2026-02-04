'use client';
import { memo } from 'react';

import clsx from 'clsx';
import { HeartIcon } from 'lucide-react';

interface LikeUnlikeButtonProps {
  liked: boolean;
  likes: number;
  handleLike: (index: number) => void;
  index: number;
}

interface LegacyLikeUnlikeButtonProps {
  liked: boolean[];
  likes: number[];
  handleLike: (index: number) => void;
  index: number;
}

type CombinedProps = LikeUnlikeButtonProps | LegacyLikeUnlikeButtonProps;

function isLegacyProps(
  props: CombinedProps
): props is LegacyLikeUnlikeButtonProps {
  return Array.isArray(props.liked);
}

const LikeUnlikeButton = memo(function LikeUnlikeButton(props: CombinedProps) {
  const { handleLike, index } = props;

  const isLiked = isLegacyProps(props) ? props.liked[index] : props.liked;
  const likeCount = isLegacyProps(props) ? props.likes[index] : props.likes;

  return (
    <button
      onClick={() => handleLike(index)}
      className={clsx(
        'flex items-center justify-center gap-1 rounded-full px-2 py-1 text-sm transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isLiked ? 'scale-110 text-primary' : 'text-muted-foreground'
      )}
      aria-label={isLiked ? 'Descurtir' : 'Curtir'}
      aria-pressed={isLiked}
    >
      <HeartIcon
        className={clsx(
          'h-4 w-4 transition-colors',
          isLiked ? 'text-primary fill-primary' : 'text-muted-foreground'
        )}
        aria-hidden="true"
      />
      <span aria-label={`${likeCount} curtida${likeCount !== 1 ? 's' : ''}`}>
        {likeCount}
      </span>
    </button>
  );
});

export default LikeUnlikeButton;
