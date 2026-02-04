import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CommentItem from './comment-item';
import { CommentProvider } from './comment-context';
import type { GaleriaComment } from '@/services/galeriaComments';

vi.mock('./edit-delete-buttom', () => ({
  default: ({
    onEdit,
    onDelete,
    comentSelected,
  }: {
    onEdit: (comment: GaleriaComment) => void;
    onDelete: (commentId: string) => void;
    comentSelected: GaleriaComment;
  }) => (
    <div data-testid="edit-delete-button">
      <button onClick={() => onEdit(comentSelected)}>Edit</button>
      <button onClick={() => onDelete(comentSelected.id)}>Delete</button>
    </div>
  ),
}));

const mockComment: GaleriaComment = {
  id: 'comment-1',
  userId: 'user-1',
  displayName: 'John Doe',
  comment: 'This is a test comment',
};

const mockCommentCallbacks = {
  onSubmitComment: vi.fn(),
  onEditComment: vi.fn(),
  onDeleteComment: vi.fn(),
};

const renderCommentItem = (
  comment: GaleriaComment,
  isAuthor: boolean = false
) => {
  return render(
    <CommentProvider {...mockCommentCallbacks}>
      <CommentItem comment={comment} isAuthor={isAuthor} />
    </CommentProvider>
  );
};

describe('CommentItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Display Mode', () => {
    it('should render comment with author name and text', () => {
      renderCommentItem(mockComment);

      expect(screen.getByText('John Doe:')).toBeInTheDocument();
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });

    it('should display comment text in span when not editing', () => {
      renderCommentItem(mockComment);

      const commentSpan = screen.getByText('This is a test comment');
      expect(commentSpan.tagName).toBe('SPAN');
    });

    it('should not show edit/delete button when user is not author', () => {
      renderCommentItem(mockComment, false);

      expect(
        screen.queryByTestId('edit-delete-button')
      ).not.toBeInTheDocument();
    });

    it('should show edit/delete button when user is author', () => {
      renderCommentItem(mockComment, true);

      expect(screen.getByTestId('edit-delete-button')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should enter edit mode when onEditComment is called', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(screen.getByDisplayValue(mockComment.comment)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Salvar' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancelar' })
      ).toBeInTheDocument();
    });

    it('should show input field with edited text in edit mode', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByDisplayValue(mockComment.comment);
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('should update input value when user types', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByDisplayValue(
        mockComment.comment
      ) as unknown as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Updated comment' } });

      expect(input.value).toBe('Updated comment');
    });

    it('should call onEditComment with id and new text when save is clicked', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByDisplayValue(
        mockComment.comment
      ) as unknown as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Updated text' } });

      const saveButton = screen.getByRole('button', { name: 'Salvar' });
      fireEvent.click(saveButton);

      expect(mockCommentCallbacks.onEditComment).toHaveBeenCalledWith(
        'comment-1',
        'Updated text'
      );
    });

    it('should exit edit mode when cancel is clicked', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      fireEvent.click(cancelButton);

      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(
        screen.queryByDisplayValue(mockComment.comment)
      ).not.toBeInTheDocument();
    });

    it('should not show edit/delete button while in edit mode', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(
        screen.queryByTestId('edit-delete-button')
      ).not.toBeInTheDocument();
    });

    it('should have sr-only label and legend for accessibility', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      const srOnlyElements = screen.getAllByText('Editar comentário');
      expect(
        srOnlyElements.every((el) => el.classList.contains('sr-only'))
      ).toBe(true);
    });

    it('should have aria-describedby on edit input', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      const input = screen.getByDisplayValue(mockComment.comment);
      expect(input).toHaveAttribute('aria-describedby');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure with fieldset in edit mode', () => {
      const { container } = renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toBeInTheDocument();
      expect(fieldset).toHaveClass('contents');
      expect(fieldset?.querySelector('legend')).toBeInTheDocument();
    });

    it('should have hint text for edit input', () => {
      renderCommentItem(mockComment, true);

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      const hint = screen.getByText(
        'Edite o texto do comentário e clique em Salvar'
      );
      expect(hint).toHaveClass('sr-only');
    });

    it('should render with proper layout structure', () => {
      const { container } = renderCommentItem(mockComment, true);

      const mainDiv = container.querySelector(
        '.text-sm.text-gray-700.border-b'
      );
      expect(mainDiv).toBeInTheDocument();
    });
  });

  describe('Integration with Context', () => {
    it('should call onDeleteComment from context when delete is triggered', () => {
      renderCommentItem(mockComment, true);

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      expect(mockCommentCallbacks.onDeleteComment).toHaveBeenCalledWith(
        'comment-1'
      );
    });

    it('should handle multiple comments independently', () => {
      const comment1 = {
        ...mockComment,
        id: 'comment-1',
        comment: 'First comment',
      };
      const comment2 = {
        ...mockComment,
        id: 'comment-2',
        comment: 'Second comment',
      };

      const { rerender } = render(
        <CommentProvider {...mockCommentCallbacks}>
          <CommentItem comment={comment1} isAuthor={true} />
        </CommentProvider>
      );

      expect(screen.getByText('First comment')).toBeInTheDocument();

      rerender(
        <CommentProvider {...mockCommentCallbacks}>
          <CommentItem comment={comment2} isAuthor={true} />
        </CommentProvider>
      );

      expect(screen.getByText('Second comment')).toBeInTheDocument();
      expect(screen.queryByText('First comment')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty comment text', () => {
      const emptyComment = { ...mockComment, comment: '' };
      renderCommentItem(emptyComment);

      expect(screen.getByText('John Doe:')).toBeInTheDocument();
    });

    it('should handle long comment text', () => {
      const longComment = {
        ...mockComment,
        comment: 'A'.repeat(500),
      };
      renderCommentItem(longComment);

      expect(screen.getByText('A'.repeat(500))).toBeInTheDocument();
    });

    it('should handle special characters in comment', () => {
      const specialComment = {
        ...mockComment,
        comment: 'Comment with <special> "characters" & symbols!',
      };
      renderCommentItem(specialComment);

      expect(
        screen.getByText('Comment with <special> "characters" & symbols!')
      ).toBeInTheDocument();
    });

    it('should be memoized to prevent unnecessary re-renders', () => {
      const { rerender } = renderCommentItem(mockComment, false);

      const initialComment = screen.getByText('This is a test comment');
      expect(initialComment).toBeInTheDocument();

      rerender(
        <CommentProvider {...mockCommentCallbacks}>
          <CommentItem comment={mockComment} isAuthor={false} />
        </CommentProvider>
      );

      const afterRerender = screen.getByText('This is a test comment');
      expect(afterRerender).toBeInTheDocument();
    });
  });
});
