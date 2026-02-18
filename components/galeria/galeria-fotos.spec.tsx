import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRouter } from 'next/navigation';
import { useUserVerification } from '@/hooks/user-verify';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';
import { likePhoto, unlikePhoto } from '@/services/galeriaLikes';
import { useGalleryRealtime } from './use-gallery-realtime';
import { onGetPhotoId } from './utils';
import GaleriaFotos from './galeria-fotos';

type UserData = {
  uid: string;
  displayName: string | null;
  email: string | null;
};

type VirtualItem = {
  index: number;
  start: number;
  end: number;
};

vi.mock('@tanstack/react-virtual');
vi.mock('next/navigation');
vi.mock('./use-gallery-realtime');
vi.mock('./utils');
vi.mock('@/services/galeriaComments');
vi.mock('@/services/galeriaLikes');
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));
vi.mock('@/components/error-state', () => ({
  default: ({
    title,
    message,
    onRetry,
  }: {
    title: string;
    message: string;
    onRetry: () => void;
  }) => (
    <div data-testid="error-state">
      <div>{title}</div>
      <div>{message}</div>
      <button onClick={onRetry} data-testid="retry-button">
        Retry
      </button>
    </div>
  ),
}));
vi.mock('./photo-item', () => ({
  default: ({
    index,
    onSelect,
    onLike,
  }: {
    index: number;
    onSelect: (idx: number) => void;
    onLike: (idx: number) => void;
  }) => (
    <div data-testid={`photo-item-${index}`}>
      <button
        data-testid={`photo-select-${index}`}
        onClick={() => onSelect(index)}
      >
        Select
      </button>
      <button data-testid={`photo-like-${index}`} onClick={() => onLike(index)}>
        Like
      </button>
    </div>
  ),
}));
vi.mock('@/components/dialog/dialog', () => ({
  GenericDialog: ({
    open,
    children,
    onOpenChange,
    footer,
  }: {
    open: boolean;
    children: React.ReactNode;
    onOpenChange: (open: boolean) => void;
    footer?: React.ReactNode;
  }) =>
    open ? (
      <div data-testid="photo-modal">
        <button onClick={() => onOpenChange(false)} data-testid="modal-close">
          Close
        </button>
        {children}
        {footer}
      </div>
    ) : null,
}));

vi.mock('./comment-section', () => ({
  default: ({
    comments,
    userId,
  }: {
    comments: unknown[];
    userId: string | null;
  }) => (
    <div>
      <div data-testid="modal-comments">{comments?.length ?? 0}</div>
      <div data-testid="modal-user">{userId}</div>
    </div>
  ),
}));

vi.mock('./like-unlike-button', () => ({
  default: ({
    handleLike,
    index,
    likes,
  }: {
    handleLike: (idx: number) => void;
    index: number;
    likes: number;
  }) => (
    <div>
      <button onClick={() => handleLike(index)} data-testid="modal-like">
        Like
      </button>
      <div data-testid="modal-likes">{likes}</div>
    </div>
  ),
}));
vi.mock('./upload-photo-gallery', () => ({
  default: () => <div data-testid="upload-button">Upload</div>,
}));
vi.mock('./comment-context', () => ({
  CommentProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="comment-provider">{children}</div>
  ),
}));
vi.mock('@/hooks/user-verify');
vi.mock('@/services/queries/fetchParticipants');

describe('GaleriaFotos', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useVirtualizer).mockReturnValue({
      getVirtualItems: () =>
        [{ index: 0, start: 0, end: 140 }] as VirtualItem[],
      getTotalSize: () => 7000,
      measureElement: vi.fn(),
    } as unknown as ReturnType<typeof useVirtualizer>);

    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    vi.mocked(useGalleryRealtime).mockReturnValue({
      firestoreLikes: {},
      firestoreComments: {},
    });

    vi.mocked(onGetPhotoId).mockImplementation((url: string) => {
      const match = new RegExp(/id=([^&]*)/).exec(url);
      return match ? match[1] : url;
    });

    vi.mocked(useGetGalleryImages).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetGalleryImages>);

    vi.mocked(useUserVerification).mockReturnValue({
      user: null,
    } as unknown as ReturnType<typeof useUserVerification>);
  });

  describe('Loading State', () => {
    it('should render skeleton items when loading', () => {
      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      render(<GaleriaFotos />);

      expect(screen.getAllByTestId('skeleton')).toHaveLength(15);
    });

    it('should render header with title', () => {
      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      render(<GaleriaFotos />);

      expect(screen.getByText('Galeria')).toBeInTheDocument();
    });

    it('should render upload button', () => {
      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      render(<GaleriaFotos />);

      expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error when isError is true', () => {
      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      render(<GaleriaFotos />);

      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    it('should call refetch when retry button is clicked', () => {
      const mockRefetch = vi.fn();
      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        refetch: mockRefetch,
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('retry-button'));
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Grid Rendering', () => {
    it('should render photos below threshold', () => {
      const photos = [
        'https://example.com/photo.jpg?id=photo0',
        'https://example.com/photo.jpg?id=photo1',
      ];

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: { photo0: [], photo1: [] },
        firestoreComments: { photo0: [], photo1: [] },
      });

      render(<GaleriaFotos />);

      expect(screen.getByTestId('photo-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('photo-item-1')).toBeInTheDocument();
    });

    it('should render many photos with virtualization', () => {
      const photos = Array.from(
        { length: 60 },
        (_, i) => `https://example.com/photo.jpg?id=photo${i}`
      );

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: {},
        firestoreComments: {},
      });

      render(<GaleriaFotos />);

      expect(screen.getByTestId('photo-item-0')).toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    beforeEach(() => {
      vi.mocked(useUserVerification).mockReturnValue({
        user: {
          uid: 'user-123',
          displayName: 'Test User',
          email: 'test@example.com',
        },
      } as unknown as ReturnType<typeof useUserVerification>);

      const photos = [
        'https://example.com/photo.jpg?id=photo0',
        'https://example.com/photo.jpg?id=photo1',
      ];

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: {
          'https://example.com/photo.jpg?id=photo0': ['user-123'],
          'https://example.com/photo.jpg?id=photo1': [],
        },
        firestoreComments: {
          'https://example.com/photo.jpg?id=photo0': [{}],
          'https://example.com/photo.jpg?id=photo1': [],
        },
      } as unknown as ReturnType<typeof useGalleryRealtime>);
    });

    it('should open modal when photo is selected', async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-select-0'));

      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });
    });

    it('should close modal', async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-select-0'));

      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('modal-close'));

      await waitFor(() => {
        expect(screen.queryByTestId('photo-modal')).not.toBeInTheDocument();
      });
    });

    it('should navigate next in modal', async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-select-0'));

      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });
      // The real component renders multiple navigation buttons (prev/next). We target the "Next" button.
      const nextButton = screen.getByRole('button', { name: /Próxima foto/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });
    });

    it('should navigate prev in modal', async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-select-1'));

      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });
      // The real component renders multiple navigation buttons (prev/next). We target the "Previous" button.
      const prevButton = screen.getByRole('button', { name: /Foto anterior/i });
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });
    });

    it('should display like count in modal', async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-select-0'));

      await waitFor(() => {
        expect(screen.getByTestId('modal-likes')).toHaveTextContent('1');
      });
    });

    it('should display comment count in modal', async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-select-0'));

      await waitFor(() => {
        expect(screen.getByTestId('modal-comments')).toHaveTextContent('1');
      });
    });

    it('should pass userId to modal when authenticated', async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-select-0'));

      await waitFor(() => {
        expect(screen.getByTestId('modal-user')).toHaveTextContent('user-123');
      });
    });
  });

  describe('Like Functionality', () => {
    beforeEach(() => {
      vi.mocked(useUserVerification).mockReturnValue({
        user: {
          uid: 'user-123',
          displayName: 'Test User',
          email: 'test@example.com',
        } as unknown as UserData,
      } as unknown as ReturnType<typeof useUserVerification>);

      const photos = ['https://example.com/photo.jpg?id=photo0'];

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: { 'https://example.com/photo.jpg?id=photo0': [] },
        firestoreComments: { 'https://example.com/photo.jpg?id=photo0': [] },
      } as unknown as ReturnType<typeof useGalleryRealtime>);
    });

    it('should like a photo', async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-like-0'));

      await waitFor(() => {
        expect(likePhoto).toHaveBeenCalledWith('photo0', 'user-123');
      });
    });

    it('should unlike a photo', async () => {
      const photos = ['https://example.com/photo.jpg?id=photo0'];

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: {
          'https://example.com/photo.jpg?id=photo0': ['user-123'],
        },
        firestoreComments: { 'https://example.com/photo.jpg?id=photo0': [] },
      });

      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-like-0'));

      await waitFor(() => {
        expect(unlikePhoto).toHaveBeenCalledWith('photo0', 'user-123');
      });
    });

    it('should redirect to login when not authenticated', () => {
      vi.mocked(useUserVerification).mockReturnValue({
        user: null,
      } as unknown as ReturnType<typeof useUserVerification>);

      const photos = ['https://example.com/photo.jpg?id=photo0'];

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      const mockPush = vi.fn();
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
      } as unknown as ReturnType<typeof useRouter>);

      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-like-0'));

      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should handle like error gracefully', async () => {
      vi.mocked(likePhoto).mockRejectedValueOnce(new Error('Network error'));
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-like-0'));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should render empty gallery', () => {
      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      render(<GaleriaFotos />);

      expect(screen.queryByTestId(/photo-item-/)).not.toBeInTheDocument();
    });

    it('should handle null user', () => {
      vi.mocked(useUserVerification).mockReturnValue({
        user: null,
      } as unknown as ReturnType<typeof useUserVerification>);

      const photos = ['https://example.com/photo.jpg?id=photo0'];

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: { photo0: [] },
        firestoreComments: { photo0: [] },
      });

      render(<GaleriaFotos />);

      expect(screen.getByTestId('photo-item-0')).toBeInTheDocument();
    });

    it('should not render modal when no photo selected', () => {
      const photos = ['https://example.com/photo.jpg?id=photo0'];

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: { 'https://example.com/photo.jpg?id=photo0': [] },
        firestoreComments: { 'https://example.com/photo.jpg?id=photo0': [] },
      });

      render(<GaleriaFotos />);

      expect(screen.queryByTestId('photo-modal')).not.toBeInTheDocument();
    });

    it('should handle navigation with single photo', async () => {
      vi.mocked(useUserVerification).mockReturnValue({
        user: {
          uid: 'user-123',
          displayName: 'Test',
          email: 'test@example.com',
        } as unknown as UserData,
      } as unknown as ReturnType<typeof useUserVerification>);

      const photos = ['https://example.com/photo.jpg?id=photo0'];

      vi.mocked(useGetGalleryImages).mockReturnValue({
        data: photos,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as unknown as ReturnType<typeof useGetGalleryImages>);

      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: { 'https://example.com/photo.jpg?id=photo0': [] },
        firestoreComments: { 'https://example.com/photo.jpg?id=photo0': [] },
      } as unknown as ReturnType<typeof useGalleryRealtime>);

      render(<GaleriaFotos />);

      fireEvent.click(screen.getByTestId('photo-select-0'));

      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Próxima foto/i }));

      await waitFor(() => {
        expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
      });
    });
  });
});
