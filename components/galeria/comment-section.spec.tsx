import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CommentSection from './comment-section';
import { CommentProvider } from './comment-context';
import type { GaleriaComment } from '@/services/galeriaComments';

vi.mock('./comment-item', () => ({
  default: ({
    comment,
    isAuthor,
  }: {
    comment: GaleriaComment;
    isAuthor: boolean;
  }) => (
    <div data-testid={`comment-item-${comment.id}`}>
      {comment.displayName}: {comment.comment} {isAuthor && '(author)'}
    </div>
  ),
}));

const mockComments: GaleriaComment[] = [
  {
    id: 'comment-1',
    userId: 'user-1',
    displayName: 'Alice',
    comment: 'First comment',
  },
  {
    id: 'comment-2',
    userId: 'user-2',
    displayName: 'Bob',
    comment: 'Second comment',
  },
];

const mockCallbacks = {
  onSubmitComment: vi.fn(),
  onEditComment: vi.fn(),
  onDeleteComment: vi.fn(),
};

const renderCommentSection = (
  comments: GaleriaComment[],
  userId: string | null
) => {
  return render(
    <CommentProvider {...mockCallbacks}>
      <CommentSection comments={comments} userId={userId} />
    </CommentProvider>
  );
};

describe('CommentSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Display Mode', () => {
    it('should render with section aria-label', () => {
      const { container } = renderCommentSection(mockComments, 'user-1');

      const section = container.querySelector(
        'section[aria-label="Comentários"]'
      );
      expect(section).toBeInTheDocument();
    });

    it('should render comment list with role="list"', () => {
      const { container } = renderCommentSection(mockComments, 'user-1');

      const list = container.querySelector('[role="list"]');
      expect(list).toBeInTheDocument();
      expect(list).toHaveAttribute('aria-label', 'Lista de comentários');
    });

    it('should display all comments', () => {
      renderCommentSection(mockComments, 'user-1');

      expect(screen.getByTestId('comment-item-comment-1')).toBeInTheDocument();
      expect(screen.getByTestId('comment-item-comment-2')).toBeInTheDocument();
    });

    it('should show "no comments" message when list is empty', () => {
      renderCommentSection([], null);

      expect(
        screen.getByText('Nenhum comentário ainda. Seja o primeiro a comentar!')
      ).toBeInTheDocument();
    });

    it('should mark comments as author when userId matches', () => {
      renderCommentSection(mockComments, 'user-1');

      const authorComment = screen.getByTestId('comment-item-comment-1');
      expect(authorComment).toHaveTextContent('(author)');

      const nonAuthorComment = screen.getByTestId('comment-item-comment-2');
      expect(nonAuthorComment).not.toHaveTextContent('(author)');
    });
  });

  describe('Input and Authentication', () => {
    it('should show disabled input when user is not logged in', () => {
      renderCommentSection([], null);

      const input = screen.getByPlaceholderText(
        'Faça login para comentar'
      ) as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should show enabled input when user is logged in', () => {
      renderCommentSection([], 'user-1');

      const input = screen.getByPlaceholderText(
        'Comente algo...'
      ) as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });

    it('should show login hint when not logged in', () => {
      renderCommentSection([], null);

      expect(
        screen.getByText('Você precisa fazer login para comentar')
      ).toHaveClass('sr-only');
    });

    it('should have proper aria-describedby when not logged in', () => {
      const { container } = renderCommentSection([], null);

      const input = container.querySelector('input[type="text"]');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('should not have aria-describedby when logged in', () => {
      const { container } = renderCommentSection([], 'user-1');

      const input = container.querySelector('input[type="text"]');
      expect(input).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('Comment Input', () => {
    it('should update input value when user types', () => {
      renderCommentSection([], 'user-1');

      const input = screen.getByPlaceholderText(
        'Comente algo...'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'New comment' } });

      expect(input.value).toBe('New comment');
    });

    it('should have sr-only label for input', () => {
      const { container } = renderCommentSection([], 'user-1');

      const label = container.querySelector('label[class*="sr-only"]');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Escreva um comentário');
    });
  });

  describe('Submit Comment', () => {
    it('should submit comment when Enviar button is clicked', async () => {
      renderCommentSection([], 'user-1');

      const input = screen.getByPlaceholderText('Comente algo...');
      fireEvent.change(input, { target: { value: 'Test comment' } });

      const submitButton = screen.getByRole('button', {
        name: 'Enviar comentário',
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCallbacks.onSubmitComment).toHaveBeenCalled();
      });
    });

    it('should submit comment when Enter is pressed', async () => {
      renderCommentSection([], 'user-1');

      const input = screen.getByPlaceholderText('Comente algo...');
      fireEvent.change(input, { target: { value: 'Test comment' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(mockCallbacks.onSubmitComment).toHaveBeenCalled();
      });
    });

    it('should not submit comment when Shift+Enter is pressed', () => {
      renderCommentSection([], 'user-1');

      const input = screen.getByPlaceholderText('Comente algo...');
      fireEvent.change(input, { target: { value: 'Test comment' } });
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

      expect(mockCallbacks.onSubmitComment).not.toHaveBeenCalled();
    });

    it('should disable Enviar button when input is empty and user is logged in', () => {
      renderCommentSection([], 'user-1');

      const submitButton = screen.getByRole('button', {
        name: 'Enviar comentário',
      }) as HTMLButtonElement;
      expect(submitButton).toBeDisabled();
    });

    it('should disable Enviar button when input only has spaces', () => {
      renderCommentSection([], 'user-1');

      const input = screen.getByPlaceholderText('Comente algo...');
      fireEvent.change(input, { target: { value: '   ' } });

      const submitButton = screen.getByRole('button', {
        name: 'Enviar comentário',
      }) as HTMLButtonElement;
      expect(submitButton).toBeDisabled();
    });

    it('should disable Enviar button when user is not logged in', () => {
      renderCommentSection([], null);

      const submitButton = screen.getByRole('button', {
        name: 'Enviar comentário',
      }) as HTMLButtonElement;
      expect(submitButton).toBeDisabled();
    });

    it('should enable Enviar button when input has text and user is logged in', () => {
      renderCommentSection([], 'user-1');

      const input = screen.getByPlaceholderText('Comente algo...');
      fireEvent.change(input, { target: { value: 'Valid comment' } });

      const submitButton = screen.getByRole('button', {
        name: 'Enviar comentário',
      }) as HTMLButtonElement;
      expect(submitButton).not.toBeDisabled();
    });

    it('should have aria-label on submit button', () => {
      renderCommentSection([], 'user-1');

      const submitButton = screen.getByRole('button', {
        name: 'Enviar comentário',
      });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be memoized component', () => {
      const { rerender } = renderCommentSection(mockComments, 'user-1');

      expect(screen.getByTestId('comment-item-comment-1')).toBeInTheDocument();

      rerender(
        <CommentProvider {...mockCallbacks}>
          <CommentSection comments={mockComments} userId="user-1" />
        </CommentProvider>
      );

      expect(screen.getByTestId('comment-item-comment-1')).toBeInTheDocument();
    });

    it('should have semantic section structure', () => {
      const { container } = renderCommentSection(mockComments, 'user-1');

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have comment scroll container with max-height', () => {
      const { container } = renderCommentSection(mockComments, 'user-1');

      const scrollContainer = container.querySelector('.max-h-24');
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer).toHaveClass('overflow-y-auto');
    });
  });

  describe('Comment List Rendering', () => {
    it('should not render comment list when no comments', () => {
      renderCommentSection([], null);

      expect(
        screen.queryByTestId('comment-item-comment-1')
      ).not.toBeInTheDocument();
    });

    it('should render correct number of comments', () => {
      const comments = [
        ...mockComments,
        {
          id: 'comment-3',
          userId: 'user-3',
          displayName: 'Charlie',
          comment: 'Third comment',
        },
      ];

      renderCommentSection(comments, 'user-1');

      expect(screen.getByTestId('comment-item-comment-1')).toBeInTheDocument();
      expect(screen.getByTestId('comment-item-comment-2')).toBeInTheDocument();
      expect(screen.getByTestId('comment-item-comment-3')).toBeInTheDocument();
    });

    it('should handle null userId gracefully', () => {
      renderCommentSection(mockComments, null);

      const authorComment = screen.getByTestId('comment-item-comment-1');
      expect(authorComment).not.toHaveTextContent('(author)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle comments with special characters', () => {
      const specialComments: GaleriaComment[] = [
        {
          id: 'comment-1',
          userId: 'user-1',
          displayName: 'User <script>',
          comment: 'Comment with <special> & "characters"',
        },
      ];

      renderCommentSection(specialComments, 'user-1');

      expect(screen.getByText(/Comment with/)).toBeInTheDocument();
    });

    it('should handle very long comment list', () => {
      const longCommentList = Array.from({ length: 50 }, (_, i) => ({
        id: `comment-${i}`,
        userId: `user-${i}`,
        displayName: `User ${i}`,
        comment: `Comment ${i}`,
      }));

      renderCommentSection(longCommentList, 'user-1');

      expect(screen.getByTestId('comment-item-comment-0')).toBeInTheDocument();
      expect(screen.getByTestId('comment-item-comment-49')).toBeInTheDocument();
    });

    it('should handle empty displayName', () => {
      const commentWithEmptyName: GaleriaComment[] = [
        {
          id: 'comment-1',
          userId: 'user-1',
          displayName: '',
          comment: 'Comment text',
        },
      ];

      renderCommentSection(commentWithEmptyName, 'user-1');

      expect(screen.getByTestId('comment-item-comment-1')).toBeInTheDocument();
    });
  });
});
