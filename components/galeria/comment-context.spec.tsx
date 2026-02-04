import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentProvider, useCommentContext } from './comment-context';
import type { GaleriaComment } from '@/services/galeriaComments';

const mockGaleriaComment: GaleriaComment = {
  id: 'comment-1',
  userId: 'user-1',
  displayName: 'Test User',
  comment: 'Test comment',
};

describe('CommentContext', () => {
  const onSubmitComment = vi.fn();
  const onEditComment = vi.fn();
  const onDeleteComment = vi.fn();

  const createWrapper =
    () =>
    ({ children }: { children: React.ReactNode }) => (
      <CommentProvider
        onSubmitComment={onSubmitComment}
        onEditComment={onEditComment}
        onDeleteComment={onDeleteComment}
      >
        {children}
      </CommentProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial state', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCommentContext(), { wrapper });

    expect(result.current.commentInput).toBe('');
    expect(result.current.editingCommentId).toBeNull();
    expect(result.current.editInput).toBe('');
  });

  it('should update commentInput on onCommentInputChange', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCommentContext(), { wrapper });

    act(() => {
      result.current.onCommentInputChange('New comment');
    });

    expect(result.current.commentInput).toBe('New comment');
  });

  it('should submit comment with onSubmitComment callback', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCommentContext(), {
      wrapper,
    });

    act(() => {
      result.current.onCommentInputChange('Test comment');
    });

    act(() => {
      result.current.onSubmitComment();
    });

    await waitFor(() => {
      expect(onSubmitComment).toHaveBeenCalledWith('Test comment');
    });
    expect(result.current.commentInput).toBe('');
  });

  it('should not submit empty comment', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CommentProvider
        onSubmitComment={onSubmitComment}
        onEditComment={onEditComment}
        onDeleteComment={onDeleteComment}
      >
        {children}
      </CommentProvider>
    );

    const { result } = renderHook(() => useCommentContext(), { wrapper });

    act(() => {
      result.current.onCommentInputChange('   ');
      result.current.onSubmitComment();
    });

    expect(onSubmitComment).not.toHaveBeenCalled();
  });

  it('should update editInput on onEditInputChange', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCommentContext(), { wrapper });

    act(() => {
      result.current.onEditInputChange('Edited comment');
    });

    expect(result.current.editInput).toBe('Edited comment');
  });

  it('should set editing state on onEditComment', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCommentContext(), { wrapper });

    act(() => {
      result.current.onEditComment(mockGaleriaComment);
    });

    expect(result.current.editingCommentId).toBe('comment-1');
    expect(result.current.editInput).toBe('Test comment');
  });

  it('should save edit with onSaveEdit', async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(() => useCommentContext(), { wrapper });

    act(() => {
      result.current.onEditComment(mockGaleriaComment);
    });

    act(() => {
      result.current.onEditInputChange('Updated comment');
    });

    act(() => {
      result.current.onSaveEdit();
    });

    await waitFor(() => {
      expect(onEditComment).toHaveBeenCalledWith(
        'comment-1',
        'Updated comment'
      );
    });
    expect(result.current.editingCommentId).toBeNull();
    expect(result.current.editInput).toBe('');
  });

  it('should not save edit with empty text', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCommentContext(), { wrapper });

    act(() => {
      result.current.onEditComment(mockGaleriaComment);
      result.current.onEditInputChange('   ');
      result.current.onSaveEdit();
    });

    expect(onEditComment).not.toHaveBeenCalled();
  });

  it('should cancel edit with onCancelEdit', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCommentContext(), { wrapper });

    act(() => {
      result.current.onEditComment(mockGaleriaComment);
    });

    expect(result.current.editingCommentId).toBe('comment-1');

    act(() => {
      result.current.onCancelEdit();
    });

    expect(result.current.editingCommentId).toBeNull();
    expect(result.current.editInput).toBe('');
  });

  it('should delete comment with onDeleteComment', () => {
    const wrapper = createWrapper();

    const { result } = renderHook(() => useCommentContext(), { wrapper });

    act(() => {
      result.current.onDeleteComment('comment-1');
    });

    expect(onDeleteComment).toHaveBeenCalledWith('comment-1');
  });

  it('should throw error when useCommentContext is used outside provider', () => {
    expect(() => {
      renderHook(() => useCommentContext());
    }).toThrow('useCommentContext must be used within CommentProvider');
  });
});
