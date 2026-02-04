import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useUserVerification } from '@/hooks/user-verify';
import {
  addCommentToPhoto,
  listenPhotoComments,
} from '@/services/galeriaComments';
import {
  likePhoto,
  listenPhotoLikes,
  unlikePhoto,
} from '@/services/galeriaLikes';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';
import GaleriaFotos from './galeria-fotos';

vi.mock('@/services/queries/fetchParticipants');
vi.mock('@/hooks/user-verify');
vi.mock('next/navigation');
vi.mock('@/services/galeriaComments');
vi.mock('@/services/galeriaLikes');
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    return <img {...props} alt={props.alt ?? ''} />;
  },
}));

const mockUseGetGalleryImages = useGetGalleryImages as Mock;
const mockUseUserVerification = useUserVerification as Mock;
const mockUseRouter = useRouter as Mock;
const mockListenPhotoLikes = listenPhotoLikes as Mock;
const mockListenPhotoComments = listenPhotoComments as Mock;
const mockLikePhoto = likePhoto as Mock;
const mockUnlikePhoto = unlikePhoto as Mock;
const mockAddCommentToPhoto = addCommentToPhoto as Mock;

const mockPhotos = [
  'https://firebasestorage.googleapis.com/v0/b/app/o/galeria%2Fphoto1.jpg?alt=media',
  'https://firebasestorage.googleapis.com/v0/b/app/o/galeria%2Fphoto2.jpg?alt=media',
];

const photo1Id = 'galeria%2Fphoto1.jpg';
const photo2Id = 'galeria%2Fphoto2.jpg';

const mockUser = {
  uid: 'user1',
  displayName: 'Test User',
  email: 'test@example.com',
};

describe('GaleriaFotos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: vi.fn() });
    mockListenPhotoLikes.mockReturnValue(() => {});
    mockListenPhotoComments.mockReturnValue(() => {});
  });

  it('should render skeletons while loading', () => {
    mockUseGetGalleryImages.mockReturnValue({ data: [], isLoading: true });
    mockUseUserVerification.mockReturnValue({ user: null });

    render(<GaleriaFotos />);

    expect(screen.getAllByTestId('skeleton-item')).toHaveLength(15);
  });

  it('should render photos when data is loaded', () => {
    mockUseGetGalleryImages.mockReturnValue({
      data: mockPhotos,
      isLoading: false,
    });
    mockUseUserVerification.mockReturnValue({ user: null });

    render(<GaleriaFotos />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockPhotos.length);
    expect(images[0]).toHaveAttribute('src', mockPhotos[0]);

    expect(images[0]).toHaveAttribute('alt', 'Foto 1 da galeria');
    expect(images[1]).toHaveAttribute('alt', 'Foto 2 da galeria');
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockUseGetGalleryImages.mockReturnValue({
        data: mockPhotos,
        isLoading: false,
      });
      mockUseUserVerification.mockReturnValue({ user: null });
      mockListenPhotoLikes.mockImplementation((photoId, callback) => {
        callback([]);
        return () => {};
      });
      mockListenPhotoComments.mockImplementation((photoId, callback) => {
        callback([]);
        return () => {};
      });
    });

    it('should redirect to login when like button is clicked', async () => {
      const push = vi.fn();
      mockUseRouter.mockReturnValue({ push });
      render(<GaleriaFotos />);

      const likeButtons = screen.getAllByRole('button', { name: /Curtir/i });
      fireEvent.click(likeButtons[0]);

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/login');
      });
    });

    it('should disable comment input in modal', async () => {
      render(<GaleriaFotos />);

      const photoButtons = screen.getAllByRole('button', {
        name: /Abrir foto 1 da galeria/i,
      });
      fireEvent.click(photoButtons[0]);

      await waitFor(() => {
        const commentInput = screen.getByPlaceholderText(
          'Faça login para comentar'
        );
        expect(commentInput).toBeInTheDocument();
        expect(commentInput).toBeDisabled();
      });
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      mockUseGetGalleryImages.mockReturnValue({
        data: mockPhotos,
        isLoading: false,
      });
      mockUseUserVerification.mockReturnValue({ user: mockUser });

      mockListenPhotoLikes.mockImplementation((photoId, callback) => {
        if (photoId === photo1Id) {
          callback(['user1']);
        } else {
          callback(['user2']);
        }
        return () => {};
      });

      mockListenPhotoComments.mockImplementation((photoId, callback) => {
        if (photoId === photo1Id) {
          callback([
            {
              id: 'c1',
              userId: 'user1',
              displayName: 'Test User',
              comment: 'My own comment',
            },
            {
              id: 'c2',
              userId: 'user2',
              displayName: 'Other User',
              comment: 'Nice!',
            },
          ]);
        } else {
          callback([]);
        }
        return () => {};
      });
    });

    it('should handle liking a photo', async () => {
      render(<GaleriaFotos />);
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Descurtir' })
        ).toBeInTheDocument();
      });
      const likeButton = screen.getByRole('button', { name: 'Curtir' });
      mockLikePhoto.mockResolvedValue(undefined);
      await act(async () => {
        fireEvent.click(likeButton);
      });

      expect(mockLikePhoto).toHaveBeenCalledWith(photo2Id, 'user1');
    });

    it('should handle unliking a photo', async () => {
      render(<GaleriaFotos />);
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Descurtir' })
        ).toBeInTheDocument();
      });
      const unlikeButton = screen.getByRole('button', { name: 'Descurtir' });
      mockUnlikePhoto.mockResolvedValue(undefined);
      await act(async () => {
        fireEvent.click(unlikeButton);
      });

      expect(mockUnlikePhoto).toHaveBeenCalledWith(photo1Id, 'user1');
    });

    it('should open modal on photo click and display photo and comments', async () => {
      render(<GaleriaFotos />);

      const photoButtons = screen.getAllByAltText('Foto 1 da galeria');
      fireEvent.click(photoButtons[0]);

      await waitFor(() => {
        const dialog = screen.getByTestId('photo-dialog');
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText('My own comment')).toBeInTheDocument();
        expect(screen.getByText('Nice!')).toBeInTheDocument();
      });
    });

    it('should allow adding a comment', async () => {
      render(<GaleriaFotos />);

      const images = screen.getAllByAltText('Foto 1 da galeria');
      fireEvent.click(images[0]);

      await waitFor(() => {
        expect(screen.getByTestId('photo-dialog')).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText('Comente algo...')
        ).toBeInTheDocument();
      });

      const commentInput = screen.getByPlaceholderText('Comente algo...');

      const allButtons = screen.getAllByRole('button');
      const sendButton = allButtons.find(
        (btn) =>
          btn.textContent?.includes('Enviar') &&
          !btn.textContent?.includes('foto')
      );
      expect(sendButton).toBeDefined();

      fireEvent.change(commentInput, { target: { value: 'A new comment' } });
      fireEvent.click(sendButton!);

      await waitFor(() => {
        expect(mockAddCommentToPhoto).toHaveBeenCalledWith(photo1Id, {
          userId: 'user1',
          displayName: 'Test User',
          comment: 'A new comment',
        });
      });
    });

    it("should show edit/delete buttons only for user's own comments", async () => {
      render(<GaleriaFotos />);

      fireEvent.click(screen.getAllByAltText('Foto 1 da galeria')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('photo-dialog')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('My own comment')).toBeInTheDocument();
        const editButtons = screen.getAllByRole('button', {
          name: 'Editar comentário',
        });
        const deleteButtons = screen.getAllByRole('button', {
          name: 'Excluir comentário',
        });
        expect(editButtons.length).toBe(1);
        expect(deleteButtons.length).toBe(1);
      });

      const otherUserComment = screen.getByText('Nice!');
      expect(otherUserComment).toBeInTheDocument();
    });
  });
});
