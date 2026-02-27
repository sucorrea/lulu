import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GalleryProvider, useGallery } from './gallery-context';
import { useUserVerification } from '@/hooks/user-verify';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';
import { useGalleryRealtime } from './use-gallery-realtime';
import { useRouter } from 'next/navigation';
import { likePhoto, unlikePhoto } from '@/services/galeriaLikes';
import {
  addCommentToPhoto,
  editCommentOnPhoto,
  deleteCommentFromPhoto,
} from '@/services/galeriaComments';
import { deleteGalleryPhoto } from '@/services/queries/deleteGalleryPhoto';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: vi.fn(),
}));

vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetGalleryImages: vi.fn(),
}));

vi.mock('./use-gallery-realtime', () => ({
  useGalleryRealtime: vi.fn(),
}));

vi.mock('@/services/galeriaLikes', () => ({
  likePhoto: vi.fn(),
  unlikePhoto: vi.fn(),
}));

vi.mock('@/services/galeriaComments', () => ({
  addCommentToPhoto: vi.fn(),
  editCommentOnPhoto: vi.fn(),
  deleteCommentFromPhoto: vi.fn(),
}));

vi.mock('@/services/queries/deleteGalleryPhoto', () => ({
  deleteGalleryPhoto: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const renderGalleryHook = () => {
  return renderHook(() => useGallery(), {
    wrapper: ({ children }) => <GalleryProvider>{children}</GalleryProvider>,
  });
};

describe('GalleryContext', () => {
  const mockUser = {
    uid: 'user-1',
    displayName: 'Test User',
    email: 'test@example.com',
  };
  const mockPhotos = ['photo-1', 'photo-2', 'photo-3'];
  const mockRouter = { push: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue(
      mockRouter as unknown as ReturnType<typeof useRouter>
    );

    vi.mocked(useUserVerification).mockReturnValue({
      user: mockUser,
      isAdmin: false,
      loading: false,
    } as unknown as ReturnType<typeof useUserVerification>);

    vi.mocked(useGetGalleryImages).mockReturnValue({
      data: mockPhotos,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetGalleryImages>);

    vi.mocked(useGalleryRealtime).mockReturnValue({
      firestoreLikes: { 'photo-1': ['user-2'] },
      firestoreComments: { 'photo-1': [] },
    } as unknown as ReturnType<typeof useGalleryRealtime>);
  });

  describe('Initialization', () => {
    it('should provide photos from useGetGalleryImages', () => {
      const { result } = renderGalleryHook();
      expect(result.current.photos).toEqual(mockPhotos);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should provide authenticated user', () => {
      const { result } = renderGalleryHook();
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('Selection Logic', () => {
    it('should select a photo', () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(1);
      });

      expect(result.current.selectedIndex).toBe(1);
      expect(result.current.selectedPhoto).toBe('photo-2');
    });

    it('should close photo selection', () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(1);
      });
      expect(result.current.selectedIndex).toBe(1);

      act(() => {
        result.current.closePhoto();
      });
      expect(result.current.selectedIndex).toBe(null);
      expect(result.current.selectedPhoto).toBe(null);
    });

    it('should navigate to next photo', () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(0);
      });

      act(() => {
        result.current.nextPhoto();
      });
      expect(result.current.selectedIndex).toBe(1);
      expect(result.current.selectedPhoto).toBe('photo-2');
    });

    it('should wrap around to first photo when navigating select next from last', () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(2);
      });

      act(() => {
        result.current.nextPhoto();
      });
      expect(result.current.selectedIndex).toBe(0);
      expect(result.current.selectedPhoto).toBe('photo-1');
    });

    it('should navigate to previous photo', () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(1);
      });

      act(() => {
        result.current.prevPhoto();
      });
      expect(result.current.selectedIndex).toBe(0);
      expect(result.current.selectedPhoto).toBe('photo-1');
    });

    it('should wrap around to last photo when navigating prev from first', () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(0);
      });

      act(() => {
        result.current.prevPhoto();
      });
      expect(result.current.selectedIndex).toBe(2);
      expect(result.current.selectedPhoto).toBe('photo-3');
    });
  });

  describe('Like Functionality', () => {
    it('should redirect unauthenticated user to login', () => {
      vi.mocked(useUserVerification).mockReturnValue({
        user: null,
        loading: false,
      } as unknown as ReturnType<typeof useUserVerification>);

      const { result } = renderGalleryHook();

      act(() => {
        result.current.toggleLike(0);
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/login');
      expect(likePhoto).not.toHaveBeenCalled();
    });

    it('should call likePhoto when photo is not liked by user', async () => {
      const { result } = renderGalleryHook();

      await act(async () => {
        result.current.toggleLike(0);
      });

      expect(likePhoto).toHaveBeenCalled();
    });

    it('should call unlikePhoto when photo is already liked by user', async () => {
      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: { 'photo-1': ['user-1'] },
        firestoreComments: {},
      });

      const { result } = renderGalleryHook();

      await act(async () => {
        result.current.toggleLike(0);
      });

      expect(unlikePhoto).toHaveBeenCalled();
    });
  });

  describe('Comment Functionality', () => {
    it('should add comment when photo is selected', async () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(0);
      });

      await act(async () => {
        await result.current.addComment('New comment');
      });

      expect(addCommentToPhoto).toHaveBeenCalled();
    });

    it('should not add comment if no photo selected', async () => {
      const { result } = renderGalleryHook();

      await act(async () => {
        await result.current.addComment('New comment');
      });

      expect(addCommentToPhoto).not.toHaveBeenCalled();
    });

    it('should edit comment', async () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(0);
      });

      await act(async () => {
        await result.current.editComment('c1', 'Edited text');
      });

      expect(editCommentOnPhoto).toHaveBeenCalled();
    });

    it('should delete comment', async () => {
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(0);
      });

      await act(async () => {
        await result.current.deleteComment('c1');
      });

      expect(deleteCommentFromPhoto).toHaveBeenCalled();
    });
  });

  describe('Stats Accessor', () => {
    it('should return correct stats for a photo', () => {
      const { result } = renderGalleryHook();

      const stats = result.current.getPhotoStats(0);

      expect(stats.isLiked).toBe(false);
      expect(stats.likesCount).toBe(1);
      expect(stats.commentCount).toBe(0);
    });

    it('should reflect user like status correctly', () => {
      vi.mocked(useGalleryRealtime).mockReturnValue({
        firestoreLikes: { 'photo-1': ['user-1', 'user-2'] },
        firestoreComments: {},
      });

      const { result } = renderGalleryHook();
      const stats = result.current.getPhotoStats(0);

      expect(stats.isLiked).toBe(true);
      expect(stats.likesCount).toBe(2);
    });
  });

  describe('isAdmin', () => {
    it('should expose isAdmin as false by default', () => {
      const { result } = renderGalleryHook();
      expect(result.current.isAdmin).toBe(false);
    });

    it('should expose isAdmin as true when user is admin', () => {
      vi.mocked(useUserVerification).mockReturnValue({
        user: mockUser,
        isAdmin: true,
        loading: false,
      } as unknown as ReturnType<typeof useUserVerification>);

      const { result } = renderGalleryHook();
      expect(result.current.isAdmin).toBe(true);
    });
  });

  describe('deletePhoto', () => {
    it('should call deleteGalleryPhoto with the photo URL', async () => {
      vi.mocked(deleteGalleryPhoto).mockResolvedValue(undefined);
      const { result } = renderGalleryHook();

      await act(async () => {
        await result.current.deletePhoto('photo-1');
      });

      expect(deleteGalleryPhoto).toHaveBeenCalledWith('photo-1');
    });

    it('should close the photo modal when deleting the currently selected photo', async () => {
      vi.mocked(deleteGalleryPhoto).mockResolvedValue(undefined);
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(1);
      });
      expect(result.current.selectedIndex).toBe(1);

      await act(async () => {
        await result.current.deletePhoto('photo-2');
      });

      expect(result.current.selectedIndex).toBeNull();
    });

    it('should not close the modal when deleting a different photo', async () => {
      vi.mocked(deleteGalleryPhoto).mockResolvedValue(undefined);
      const { result } = renderGalleryHook();

      act(() => {
        result.current.selectPhoto(0);
      });

      await act(async () => {
        await result.current.deletePhoto('photo-3');
      });

      expect(result.current.selectedIndex).toBe(0);
    });

    it('should do nothing when photo URL is empty', async () => {
      const { result } = renderGalleryHook();

      await act(async () => {
        await result.current.deletePhoto('');
      });

      expect(deleteGalleryPhoto).not.toHaveBeenCalled();
    });

    it('should show error toast and not throw when deleteGalleryPhoto fails', async () => {
      const { toast } = await import('sonner');
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      vi.mocked(deleteGalleryPhoto).mockRejectedValue(
        new Error('storage error')
      );
      const { result } = renderGalleryHook();

      await expect(
        act(async () => {
          await result.current.deletePhoto('photo-1');
        })
      ).resolves.not.toThrow();

      expect(toast.error).toHaveBeenCalledWith('Erro ao excluir a foto.', {
        position: 'bottom-center',
      });
      consoleSpy.mockRestore();
    });
  });
});
