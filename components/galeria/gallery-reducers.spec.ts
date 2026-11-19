import { describe, it, expect } from 'vitest';

import type { GaleriaComment } from '@/services/galeriaComments';

import { commentsReducer, likesReducer } from './gallery-reducers';

const comment = (id: string, text = 'oi'): GaleriaComment => ({
  id,
  userId: 'u1',
  displayName: 'Ana',
  comment: text,
  createdAt: '2026-11-19T00:00:00.000Z',
});

describe('likesReducer', () => {
  it('should add the user when not liked yet', () => {
    const state = likesReducer(
      { likes: { p1: ['u2'] } },
      { type: 'toggle', photo: 'p1', userId: 'u1', isCurrentlyLiked: false }
    );
    expect(state.likes.p1).toEqual(['u2', 'u1']);
  });

  it('should remove the user when currently liked', () => {
    const state = likesReducer(
      { likes: { p1: ['u1', 'u2'] } },
      { type: 'toggle', photo: 'p1', userId: 'u1', isCurrentlyLiked: true }
    );
    expect(state.likes.p1).toEqual(['u2']);
  });

  it('should not duplicate a user that already liked', () => {
    const state = likesReducer(
      { likes: { p1: ['u1'] } },
      { type: 'toggle', photo: 'p1', userId: 'u1', isCurrentlyLiked: false }
    );
    expect(state.likes.p1).toEqual(['u1']);
  });

  it('should start an empty list for a photo without likes', () => {
    const state = likesReducer(
      { likes: {} },
      { type: 'toggle', photo: 'p1', userId: 'u1', isCurrentlyLiked: false }
    );
    expect(state.likes.p1).toEqual(['u1']);
  });
});

describe('commentsReducer', () => {
  it('should append a comment', () => {
    const state = commentsReducer(
      { p1: [comment('c1')] },
      { type: 'add', photo: 'p1', comment: comment('c2') }
    );
    expect(state.p1.map((c) => c.id)).toEqual(['c1', 'c2']);
  });

  it('should add the first comment of a photo', () => {
    const state = commentsReducer(
      {},
      { type: 'add', photo: 'p1', comment: comment('c1') }
    );
    expect(state.p1).toHaveLength(1);
  });

  it('should edit only the matching comment', () => {
    const state = commentsReducer(
      { p1: [comment('c1'), comment('c2')] },
      { type: 'edit', photo: 'p1', commentId: 'c2', text: 'novo' }
    );
    expect(state.p1.map((c) => c.comment)).toEqual(['oi', 'novo']);
  });

  it('should delete the matching comment', () => {
    const state = commentsReducer(
      { p1: [comment('c1'), comment('c2')] },
      { type: 'delete', photo: 'p1', commentId: 'c1' }
    );
    expect(state.p1.map((c) => c.id)).toEqual(['c2']);
  });
});
