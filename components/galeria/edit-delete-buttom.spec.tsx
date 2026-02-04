import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EditDeleteButtom from './edit-delete-buttom';
import type { GaleriaComment } from '@/services/galeriaComments';

vi.mock('lucide-react', () => ({
  Edit2: ({ size }: { size: number }) => (
    <span data-testid="edit-icon">Edit Icon</span>
  ),
  Trash2Icon: ({ size }: { size: number }) => (
    <span data-testid="delete-icon">Delete Icon</span>
  ),
}));

const mockComment: GaleriaComment = {
  id: 'comment-1',
  userId: 'user-1',
  displayName: 'Test User',
  comment: 'Test comment',
};

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

const renderEditDeleteButtom = (comment: GaleriaComment = mockComment) => {
  return render(
    <EditDeleteButtom
      onEdit={mockOnEdit}
      onDelete={mockOnDelete}
      comentSelected={comment}
    />
  );
};

describe('EditDeleteButtom', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render edit and delete buttons', () => {
      renderEditDeleteButtom();

      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });

    it('should have proper button styling', () => {
      const { container } = renderEditDeleteButtom();

      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
      buttons.forEach((btn) => {
        expect(btn).toHaveClass('px-2', 'py-0.5');
      });
    });

    it('should have flex container with gap-1', () => {
      const { container } = renderEditDeleteButtom();

      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toHaveClass('gap-1');
    });
  });

  describe('Edit Button', () => {
    it('should have aria-label for edit button', () => {
      renderEditDeleteButtom();

      const editButton = screen.getAllByRole('button')[0];
      expect(editButton).toHaveAttribute('aria-label', 'Editar comentário');
    });

    it('should call onEdit with comment when edit button is clicked', () => {
      renderEditDeleteButtom();

      const editButton = screen.getAllByRole('button')[0];
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockComment);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('should render edit icon', () => {
      renderEditDeleteButtom();

      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    });

    it('should have variant ghost', () => {
      const { container } = renderEditDeleteButtom();

      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn) => {
        expect(btn).toHaveClass('hover:bg-accent');
      });
    });
  });

  describe('Delete Button', () => {
    it('should have aria-label for delete button', () => {
      renderEditDeleteButtom();

      const deleteButton = screen.getAllByRole('button')[1];
      expect(deleteButton).toHaveAttribute('aria-label', 'Excluir comentário');
    });

    it('should call onDelete with comment id when delete button is clicked', () => {
      renderEditDeleteButtom();

      const deleteButton = screen.getAllByRole('button')[1];
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('comment-1');
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should render delete icon', () => {
      renderEditDeleteButtom();

      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });

    it('should have red colored delete icon', () => {
      const { container } = renderEditDeleteButtom();

      const deleteIcon = screen.getByTestId('delete-icon');
      expect(deleteIcon).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call edit callback without calling delete callback', () => {
      renderEditDeleteButtom();

      const editButton = screen.getAllByRole('button')[0];
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    it('should call delete callback without calling edit callback', () => {
      renderEditDeleteButtom();

      const deleteButton = screen.getAllByRole('button')[1];
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalled();
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks on edit button', () => {
      renderEditDeleteButtom();

      const editButton = screen.getAllByRole('button')[0];
      fireEvent.click(editButton);
      fireEvent.click(editButton);
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple clicks on delete button', () => {
      renderEditDeleteButtom();

      const deleteButton = screen.getAllByRole('button')[1];
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(2);
    });
  });

  describe('Different Comments', () => {
    it('should pass correct comment id to onEdit', () => {
      const differentComment: GaleriaComment = {
        id: 'comment-99',
        userId: 'user-99',
        displayName: 'Different User',
        comment: 'Different comment',
      };

      renderEditDeleteButtom(differentComment);

      const editButton = screen.getAllByRole('button')[0];
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(differentComment);
    });

    it('should pass correct comment id to onDelete', () => {
      const differentComment: GaleriaComment = {
        id: 'comment-99',
        userId: 'user-99',
        displayName: 'Different User',
        comment: 'Different comment',
      };

      renderEditDeleteButtom(differentComment);

      const deleteButton = screen.getAllByRole('button')[1];
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('comment-99');
    });

    it('should handle comment with special characters', () => {
      const specialComment: GaleriaComment = {
        id: 'comment-<script>',
        userId: 'user-1',
        displayName: 'User',
        comment: 'Comment with <special> characters',
      };

      renderEditDeleteButtom(specialComment);

      const editButton = screen.getAllByRole('button')[0];
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(specialComment);
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      renderEditDeleteButtom();

      const buttons = screen.getAllByRole('button');

      // Edit button (first)
      fireEvent.click(buttons[0]);
      expect(mockOnEdit).toHaveBeenCalled();

      // Delete button (second)
      fireEvent.click(buttons[1]);
      expect(mockOnDelete).toHaveBeenCalled();
    });

    it('should have size sm variant', () => {
      const { container } = renderEditDeleteButtom();

      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn) => {
        expect(btn).toHaveClass('h-9');
      });
    });
  });

  describe('Props Variation', () => {
    it('should render with different comment data', () => {
      const comment1: GaleriaComment = {
        id: 'c1',
        userId: 'u1',
        displayName: 'Alice',
        comment: 'Comment 1',
      };

      const { rerender } = renderEditDeleteButtom(comment1);

      const editBtn1 = screen.getAllByRole('button')[0];
      fireEvent.click(editBtn1);
      expect(mockOnEdit).toHaveBeenCalledWith(comment1);

      mockOnEdit.mockClear();

      const comment2: GaleriaComment = {
        id: 'c2',
        userId: 'u2',
        displayName: 'Bob',
        comment: 'Comment 2',
      };

      rerender(
        <EditDeleteButtom
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          comentSelected={comment2}
        />
      );

      const editBtn2 = screen.getAllByRole('button')[0];
      fireEvent.click(editBtn2);
      expect(mockOnEdit).toHaveBeenCalledWith(comment2);
    });
  });
});
