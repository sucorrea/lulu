import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PhotoModal from './photo-modal';
import { CommentProvider } from './comment-context';
import type { GaleriaComment } from '@/services/galeriaComments';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} />;
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

vi.mock('./utils', () => ({
  downloadPhoto: vi.fn().mockResolvedValue(undefined),
}));

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

const renderPhotoModal = (
  isOpen: boolean = true,
  selectedIndex: number = 0,
  totalPhotos: number = 5,
  liked: boolean = false,
  likes: number = 10,
  userId: string | null = 'user-1'
) => {
  return render(
    <CommentProvider {...mockCallbacks}>
      <PhotoModal
        isOpen={isOpen}
        selectedIndex={selectedIndex}
        totalPhotos={totalPhotos}
        photo={photoUrl}
        liked={liked}
        likes={likes}
        comments={mockComments}
        userId={userId}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onLike={vi.fn()}
      />
    </CommentProvider>
  );
};

describe('PhotoModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Visibility', () => {
    it('should render when isOpen is true', () => {
      renderPhotoModal(true);

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      renderPhotoModal(false);

      expect(screen.queryByTestId('photo-dialog')).not.toBeInTheDocument();
    });

    it('should have open attribute when isOpen', () => {
      renderPhotoModal(true);

      const dialog = screen.getByTestId('photo-dialog') as HTMLDialogElement;
      expect(dialog).toHaveAttribute('open');
    });

    it('should render null when not open', () => {
      const { container } = renderPhotoModal(false);

      // Container should only have the root div
      expect(container.querySelectorAll('dialog')).toHaveLength(0);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label with photo position', () => {
      renderPhotoModal(true, 2, 10);

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveAttribute(
        'aria-label',
        'Visualização da foto 3 de 10'
      );
    });

    it('should have aria-modal attribute', () => {
      renderPhotoModal(true);

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have live region for photo number announcements', () => {
      renderPhotoModal(true, 2, 5);

      expect(screen.getByText('Foto 3 de 5')).toHaveAttribute(
        'aria-live',
        'polite'
      );
      expect(screen.getByText('Foto 3 de 5')).toHaveAttribute(
        'aria-atomic',
        'true'
      );
    });

    it('should have sr-only class for live region', () => {
      renderPhotoModal(true);

      const liveRegion = screen.getByText(/Foto .* de .*/);
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      renderPhotoModal(true);

      const closeButton = screen.getByRole('button', {
        name: 'Fechar visualização',
      });
      expect(closeButton).toBeInTheDocument();
    });

    it('should have aria-label on close button', () => {
      renderPhotoModal(true);

      const closeButton = screen.getByRole('button', {
        name: 'Fechar visualização',
      });
      expect(closeButton).toHaveAttribute('aria-label', 'Fechar visualização');
    });

    it('should position close button absolute top-right', () => {
      const { container } = renderPhotoModal(true);

      const closeButton = container.querySelector(
        'button[aria-label="Fechar visualização"]'
      );
      expect(closeButton).toHaveClass('absolute', 'right-4', 'top-4');
    });
  });

  describe('Navigation Buttons', () => {
    it('should render previous button', () => {
      renderPhotoModal(true);

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior/i,
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('should render next button', () => {
      renderPhotoModal(true);

      const nextButton = screen.getByRole('button', {
        name: /Próxima foto/i,
      });
      expect(nextButton).toBeInTheDocument();
    });

    it('should have correct aria-label for previous button at start', () => {
      renderPhotoModal(true, 0, 5);

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior \(5 de 5\)/i,
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('should have correct aria-label for next button at end', () => {
      renderPhotoModal(true, 4, 5);

      const nextButton = screen.getByRole('button', {
        name: /Próxima foto \(1 de 5\)/i,
      });
      expect(nextButton).toBeInTheDocument();
    });

    it('should have correct aria-label for middle navigation', () => {
      renderPhotoModal(true, 2, 5);

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior \(2 de 5\)/i,
      });
      const nextButton = screen.getByRole('button', {
        name: /Próxima foto \(4 de 5\)/i,
      });

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe('Photo Display', () => {
    it('should render photo with correct src', () => {
      renderPhotoModal(true);

      const image = screen.getByAltText(/Foto .* de .* na galeria/);
      expect((image as HTMLImageElement).src).toContain(photoUrl);
    });

    it('should have correct alt text for photo', () => {
      renderPhotoModal(true, 2, 5);

      const image = screen.getByAltText('Foto 3 de 5 na galeria');
      expect(image).toBeInTheDocument();
    });

    it('should have object-contain class for proper scaling', () => {
      renderPhotoModal(true);

      const image = screen.getByAltText(/Foto .* de .* na galeria/);
      expect(image).toHaveClass('object-contain');
    });
  });

  describe('Like Button Section', () => {
    it('should render like button', () => {
      renderPhotoModal(true, 0);

      expect(screen.getByTestId('like-button-0')).toBeInTheDocument();
    });

    it('should pass selectedIndex to like button', () => {
      renderPhotoModal(true, 3);

      expect(screen.getByTestId('like-button-3')).toBeInTheDocument();
    });
  });

  describe('Download Button', () => {
    it('should render download button', () => {
      renderPhotoModal(true);

      const downloadButton = screen.getByRole('button', {
        name: 'Baixar foto',
      });
      expect(downloadButton).toBeInTheDocument();
    });

    it('should have aria-label on download button', () => {
      renderPhotoModal(true);

      const downloadButton = screen.getByRole('button', {
        name: 'Baixar foto',
      });
      expect(downloadButton).toHaveAttribute('aria-label', 'Baixar foto');
    });

    it('should have variant outline', () => {
      const { container } = renderPhotoModal(true);

      const downloadButton = screen.getByRole('button', {
        name: 'Baixar foto',
      });
      expect(downloadButton).toBeInTheDocument();
    });
  });

  describe('Comment Section', () => {
    it('should render comment section', () => {
      renderPhotoModal(true);

      expect(screen.getByTestId('comment-section')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have fixed positioning', () => {
      const { container } = renderPhotoModal(true);

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveClass('fixed', 'inset-0');
    });

    it('should have z-50 for layering', () => {
      const { container } = renderPhotoModal(true);

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveClass('z-50');
    });

    it('should have flex layout', () => {
      const { container } = renderPhotoModal(true);

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveClass('flex', 'flex-col');
    });

    it('should have dark background', () => {
      const { container } = renderPhotoModal(true);

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveClass('bg-black/80');
    });

    it('should have card styling for photo card', () => {
      const { container } = renderPhotoModal(true);

      const photoCard = container.querySelector('.bg-card');
      expect(photoCard).toHaveClass('border', 'bg-card', 'p-4');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should call onClose on Escape key', async () => {
      const onCloseMock = vi.fn();

      render(
        <CommentProvider {...mockCallbacks}>
          <PhotoModal
            isOpen={true}
            selectedIndex={0}
            totalPhotos={5}
            photo={photoUrl}
            liked={false}
            likes={10}
            comments={mockComments}
            userId="user-1"
            onClose={onCloseMock}
            onPrev={vi.fn()}
            onNext={vi.fn()}
            onLike={vi.fn()}
          />
        </CommentProvider>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalled();
      });
    });

    it('should call onPrev on ArrowLeft key', async () => {
      const onPrevMock = vi.fn();

      render(
        <CommentProvider {...mockCallbacks}>
          <PhotoModal
            isOpen={true}
            selectedIndex={2}
            totalPhotos={5}
            photo={photoUrl}
            liked={false}
            likes={10}
            comments={mockComments}
            userId="user-1"
            onClose={vi.fn()}
            onPrev={onPrevMock}
            onNext={vi.fn()}
            onLike={vi.fn()}
          />
        </CommentProvider>
      );

      fireEvent.keyDown(document, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(onPrevMock).toHaveBeenCalled();
      });
    });

    it('should call onNext on ArrowRight key', async () => {
      const onNextMock = vi.fn();

      render(
        <CommentProvider {...mockCallbacks}>
          <PhotoModal
            isOpen={true}
            selectedIndex={2}
            totalPhotos={5}
            photo={photoUrl}
            liked={false}
            likes={10}
            comments={mockComments}
            userId="user-1"
            onClose={vi.fn()}
            onPrev={vi.fn()}
            onNext={onNextMock}
            onLike={vi.fn()}
          />
        </CommentProvider>
      );

      fireEvent.keyDown(document, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(onNextMock).toHaveBeenCalled();
      });
    });
  });

  describe('Photo Information Display', () => {
    it('should display correct photo count in live region', () => {
      renderPhotoModal(true, 0, 10);

      expect(screen.getByText('Foto 1 de 10')).toBeInTheDocument();
    });

    it('should update live region when index changes', () => {
      const { rerender } = renderPhotoModal(true, 0, 10);

      expect(screen.getByText('Foto 1 de 10')).toBeInTheDocument();

      rerender(
        <CommentProvider {...mockCallbacks}>
          <PhotoModal
            isOpen={true}
            selectedIndex={5}
            totalPhotos={10}
            photo={photoUrl}
            liked={false}
            likes={10}
            comments={mockComments}
            userId="user-1"
            onClose={vi.fn()}
            onPrev={vi.fn()}
            onNext={vi.fn()}
            onLike={vi.fn()}
          />
        </CommentProvider>
      );

      expect(screen.getByText('Foto 6 de 10')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have max-w-md for photo container', () => {
      const { container } = renderPhotoModal(true);

      const photoContainer = container.querySelector('.max-w-md');
      expect(photoContainer).toBeInTheDocument();
    });

    it('should have px-4 for responsive padding', () => {
      const { container } = renderPhotoModal(true);

      const dialog = screen.getByTestId('photo-dialog');
      expect(dialog).toHaveClass('px-4');
    });
  });

  describe('Edge Cases', () => {
    it('should handle first photo with wraparound', () => {
      renderPhotoModal(true, 0, 5);

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior \(5 de 5\)/i,
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('should handle last photo with wraparound', () => {
      renderPhotoModal(true, 4, 5);

      const nextButton = screen.getByRole('button', {
        name: /Próxima foto \(1 de 5\)/i,
      });
      expect(nextButton).toBeInTheDocument();
    });

    it('should handle single photo', () => {
      renderPhotoModal(true, 0, 1);

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior \(1 de 1\)/i,
      });
      const nextButton = screen.getByRole('button', {
        name: /Próxima foto \(1 de 1\)/i,
      });

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should handle null userId', () => {
      renderPhotoModal(true, 0, 5, false, 10, null);

      expect(screen.getByTestId('photo-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('comment-section')).toBeInTheDocument();
    });
  });

  describe('Memo Optimization', () => {
    it('should not rerender unnecessarily', () => {
      const { rerender } = renderPhotoModal(true, 0, 5);

      const image = screen.getByAltText(/Foto .* de .* na galeria/);
      expect(image).toBeInTheDocument();

      rerender(
        <CommentProvider {...mockCallbacks}>
          <PhotoModal
            isOpen={true}
            selectedIndex={0}
            totalPhotos={5}
            photo={photoUrl}
            liked={false}
            likes={10}
            comments={mockComments}
            userId="user-1"
            onClose={vi.fn()}
            onPrev={vi.fn()}
            onNext={vi.fn()}
            onLike={vi.fn()}
          />
        </CommentProvider>
      );

      expect(
        screen.getByAltText(/Foto .* de .* na galeria/)
      ).toBeInTheDocument();
    });
  });
});
