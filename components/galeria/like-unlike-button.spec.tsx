import React from 'react';
import '@testing-library/jest-dom';

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import LikeUnlikeButton from './like-unlike-button';

describe('LikeUnlikeButton', () => {
  const likes = [3, 5];
  const liked = [true, false];
  const handleLike = vi.fn();

  it('renders the correct number of likes', () => {
    const { getByText } = render(
      <LikeUnlikeButton
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        index={0}
      />
    );
    expect(getByText('3')).toBeInTheDocument();
  });

  it('shows filled heart icon when liked', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        index={0}
      />
    );
    const button = getByRole('button');
    expect(button.querySelector('svg')).toHaveClass('fill-primary');
  });

  it('shows outlined heart icon when not liked', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        index={1}
      />
    );
    const button = getByRole('button');
    expect(button.querySelector('svg')).not.toHaveClass('fill-primary');
  });

  it('calls handleLike with the correct index when clicked', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        index={1}
      />
    );
    fireEvent.click(getByRole('button'));
    expect(handleLike).toHaveBeenCalledWith(1);
  });

  it('has correct aria-label when liked', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        index={0}
      />
    );
    expect(getByRole('button')).toHaveAttribute(
      'aria-label',
      'Descurtir (3 curtidas)'
    );
  });

  it('has correct aria-label when not liked', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        index={1}
      />
    );
    expect(getByRole('button')).toHaveAttribute(
      'aria-label',
      'Curtir (5 curtidas)'
    );
  });

  it('applies scale-110 class when liked', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        index={0}
      />
    );
    expect(getByRole('button').className).toContain('scale-110');
  });

  it('does not apply scale-110 class when not liked', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        index={1}
      />
    );
    expect(getByRole('button').className).not.toContain('scale-110');
  });

  it('supports non-legacy (scalar) props', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        liked={true}
        likes={1}
        handleLike={handleLike}
        index={0}
      />
    );
    expect(getByRole('button')).toHaveAttribute(
      'aria-label',
      'Descurtir (1 curtida)'
    );
    expect(getByRole('button')).toHaveTextContent('1');
  });

  it('clamps negative like count to zero', () => {
    const { getByRole } = render(
      <LikeUnlikeButton
        liked={false}
        likes={-1}
        handleLike={handleLike}
        index={0}
      />
    );
    expect(getByRole('button')).toHaveTextContent('0');
  });
});
