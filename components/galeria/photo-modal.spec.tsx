/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PhotoModal from './photo-modal';
import { CommentProvider } from './comment-context';
import type { GaleriaComment } from '@/services/galeriaComments';

vi.mock('@/components/dialog/dialog', () => ({
  GenericDialog: ({
    children,
    open,
    title,
    description,
    className,
    onOpenChange,
    footer,
  }: {
    children: React.ReactNode;
    open: boolean;
    title: string;
    description: string;
    className: string;
    onOpenChange: (open: boolean) => void;
    footer?: React.ReactNode;
  }) => {
    if (!open) {
      return null;
    }
    return (
      <dialog
        open={open}
        aria-label={title}
        data-testid="photo-dialog"
        className={className}
      >
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Fechar visualização"
        >
          Close
        </button>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {description}
        </div>
        <div>
          <h2>{title}</h2>
          <p>description: {description}</p>
        </div>
        {children}
        {footer}
      </dialog>
    );
  },
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'> & { priority?: boolean }) => {
    const { priority: _priority, ...imgProps } = props;
    return <img {...imgProps} alt={props.alt ?? ''} />;
  },
}));

vi.mock('./like-unlike-button', () => ({
  default: ({
    handleLike,
    index,
  }: {
    handleLike: (i: number) => void;
    index: number;
  }) => (
    <button
      data-testid={`like-button-${index}`}
      onClick={() => handleLike(index)}
    >
      Like
    </button>
  ),
}));

vi.mock('./comment-section', () => ({
  default: () => <div data-testid="comment-section">Comment Section</div>,
}));

vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    downloadPhoto: vi.fn().mockResolvedValue(undefined),
  };
});

const mockUseGallery = vi.fn();
vi.mock('./gallery-context', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useGallery: () => mockUseGallery(),
  };
});

const mockComments: GaleriaComment[] = [
  {
    id: 'c1',
    userId: 'u1',
    displayName: 'User 1',
    comment: 'Great photo!',
  },
];

const photoUrl = 'https://firebasestorage.googleapis.com/v0/b/app/o/photo.jpg';

const mockCallbacks = {
  onSubmitComment: vi.fn(),
  onEditComment: vi.fn(),
  onDeleteComment: vi.fn(),
};

const setupGalleryMock = (overrides = {}) => {
  const defaultValues = {
    photos: new Array(5).fill(photoUrl),
    selectedIndex: 0,
    selectedPhoto: photoUrl,
    isLoading: false,
    isError: false,
    user: { uid: 'user-1' },
    selectPhoto: vi.fn(),
    closePhoto: vi.fn(),
    nextPhoto: vi.fn(),
    prevPhoto: vi.fn(),
    toggleLike: vi.fn(),
    getPhotoStats: (_index: number) => ({
      isLiked: false,
      likesCount: 10,
      commentCount: 5,
    }),
    getComments: () => mockComments,
    addComment: vi.fn(),
    editComment: vi.fn(),
    deleteComment: vi.fn(),
    isAdmin: false,
    isDeleting: false,
    deletePhoto: vi.fn(),
    ...overrides,
  };

  mockUseGallery.mockReturnValue(defaultValues);
  return defaultValues;
};

const renderPhotoModal = (overrides = {}) => {
  const mockValues = setupGalleryMock(overrides);

  return {
    ...render(
      <CommentProvider {...mockCallbacks}>
        <PhotoModal />
      </CommentProvider>
    ),
    mockValues,
  };
};

describe('PhotoModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Visibility', () => {
    it('should render when open (selectedIndex is not null)', () => {
      renderPhotoModal({ selectedIndex: 0, selectedPhoto: photoUrl });

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should not render when closed (selectedIndex is null)', () => {
      renderPhotoModal({ selectedIndex: null, selectedPhoto: null });

      expect(screen.queryByTestId('photo-dialog')).not.toBeInTheDocument();
    });

    it('should have open attribute when open', () => {
      renderPhotoModal({ selectedIndex: 0 });

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveAttribute('open');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label with "Foto"', () => {
      renderPhotoModal();

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Foto');
    });

    it('should have live region for photo number announcements in description', () => {
      renderPhotoModal({ selectedIndex: 2, photos: new Array(5).fill('url') });

      expect(screen.getByText('3 de 5')).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      renderPhotoModal();

      const closeButton = screen.getByRole('button', {
        name: 'Fechar visualização',
      });
      expect(closeButton).toBeInTheDocument();
    });

    it('should call closePhoto when close button is clicked', () => {
      const { mockValues } = renderPhotoModal();

      const closeButton = screen.getByRole('button', {
        name: 'Fechar visualização',
      });
      fireEvent.click(closeButton);

      expect(mockValues.closePhoto).toHaveBeenCalled();
    });
  });

  describe('Navigation Buttons', () => {
    it('should render previous button', () => {
      renderPhotoModal();

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior/i,
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('should render next button', () => {
      renderPhotoModal();

      const nextButton = screen.getByRole('button', {
        name: /Próxima foto/i,
      });
      expect(nextButton).toBeInTheDocument();
    });

    it('should have correct aria-label for navigation', () => {
      renderPhotoModal({ selectedIndex: 0, photos: new Array(5).fill('url') });

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior \(5 de 5\)/i,
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('should call prevPhoto when prev button clicked', () => {
      const { mockValues } = renderPhotoModal();
      const prevButton = screen.getByRole('button', { name: /Foto anterior/i });
      fireEvent.click(prevButton);
      expect(mockValues.prevPhoto).toHaveBeenCalled();
    });

    it('should call nextPhoto when next button clicked', () => {
      const { mockValues } = renderPhotoModal();
      const nextButton = screen.getByRole('button', { name: /Próxima foto/i });
      fireEvent.click(nextButton);
      expect(mockValues.nextPhoto).toHaveBeenCalled();
    });
  });

  describe('Like Button Section', () => {
    it('should render like button and pass index', () => {
      renderPhotoModal({ selectedIndex: 0 });

      expect(screen.getByTestId('like-button-0')).toBeInTheDocument();
    });

    it('should call toggleLike when clicked', () => {
      const { mockValues } = renderPhotoModal({ selectedIndex: 0 });

      const likeButton = screen.getByTestId('like-button-0');
      fireEvent.click(likeButton);

      expect(mockValues.toggleLike).toHaveBeenCalledWith(0);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should call prevPhoto on ArrowLeft key', async () => {
      const { mockValues } = renderPhotoModal();

      fireEvent.keyDown(document, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(mockValues.prevPhoto).toHaveBeenCalled();
      });
    });

    it('should call nextPhoto on ArrowRight key', async () => {
      const { mockValues } = renderPhotoModal();

      fireEvent.keyDown(document, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(mockValues.nextPhoto).toHaveBeenCalled();
      });
    });
  });

  describe('Delete Button', () => {
    it('should not render delete button when isAdmin is false', () => {
      renderPhotoModal({ isAdmin: false });

      expect(
        screen.queryByRole('button', { name: /Excluir foto/i })
      ).not.toBeInTheDocument();
    });

    it('should render delete button when isAdmin is true', () => {
      renderPhotoModal({ isAdmin: true });

      expect(
        screen.getByRole('button', { name: 'Excluir foto' })
      ).toBeInTheDocument();
    });

    it('should show confirmation dialog when delete button is clicked', () => {
      renderPhotoModal({ isAdmin: true });

      fireEvent.click(screen.getByRole('button', { name: 'Excluir foto' }));

      expect(
        screen.getByRole('dialog', { name: 'Excluir esta foto?' })
      ).toBeInTheDocument();
    });

    it('should not call deletePhoto immediately when delete button is clicked', () => {
      const { mockValues } = renderPhotoModal({ isAdmin: true });

      fireEvent.click(screen.getByRole('button', { name: 'Excluir foto' }));

      expect(mockValues.deletePhoto).not.toHaveBeenCalled();
    });

    it('should call deletePhoto with current photo URL when Excluir is clicked in confirmation dialog', () => {
      const { mockValues } = renderPhotoModal({
        isAdmin: true,
        selectedIndex: 3,
      });

      fireEvent.click(screen.getByRole('button', { name: 'Excluir foto' }));
      fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

      expect(mockValues.deletePhoto).toHaveBeenCalledWith(photoUrl);
    });
  });
});
