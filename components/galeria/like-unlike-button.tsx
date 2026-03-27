'use client';

import { memo, useCallback } from 'react';

import { HeartIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LikeUnlikeButtonProps {
  liked: boolean;
  likes: number;
  handleLike: (index: number) => void;
  index: number;
  className?: string;
}

interface LegacyLikeUnlikeButtonProps {
  liked: boolean[];
  likes: number[];
  handleLike: (index: number) => void;
  index: number;
  className?: string;
}

type CombinedProps = LikeUnlikeButtonProps | LegacyLikeUnlikeButtonProps;

const isLegacyProps = (
  props: CombinedProps
): props is LegacyLikeUnlikeButtonProps => Array.isArray(props.liked);

const getLikeCountLabel = (count: number) =>
  `${count} curtida${count === 1 ? '' : 's'}`;

const LikeUnlikeButton = memo(function LikeUnlikeButton(props: CombinedProps) {
  const { handleLike, index } = props;

  const isLiked = isLegacyProps(props) ? props.liked[index] : props.liked;
  const likeCount = Math.max(
    0,
    isLegacyProps(props) ? props.likes[index] : props.likes
  );

  const ariaLabel = isLiked
    ? `Descurtir (${getLikeCountLabel(likeCount)})`
    : `Curtir (${getLikeCountLabel(likeCount)})`;

  const handleClick = useCallback(() => {
    handleLike(index);
  }, [handleLike, index]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center gap-1 rounded-full px-2 py-1 text-sm transition-[color,transform] duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95',
        isLiked ? 'scale-110 text-primary' : 'text-muted-foreground',
        props.className
      )}
      aria-label={ariaLabel}
      aria-pressed={isLiked}
    >
      <HeartIcon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          isLiked ? 'text-primary fill-primary' : 'text-current'
        )}
        aria-hidden
      />
      <span>{likeCount}</span>
    </button>
  );
});

export default LikeUnlikeButton;
