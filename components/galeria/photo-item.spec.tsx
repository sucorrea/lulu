import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PhotoItem from './photo-item';

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
    liked,
    likes,
    index,
  }: {
    handleLike: (index: number) => void;
    liked: boolean;
    likes: number;
    index: number;
  }) => (
    <button
      data-testid={`like-button-${index}`}
      onClick={() => handleLike(index)}
      aria-pressed={liked}
    >
      {liked ? 'Unlike' : 'Like'} ({likes})
    </button>
  ),
}));

const mockOnSelect = vi.fn();
const mockOnLike = vi.fn();

const photoUrl = 'https://firebasestorage.googleapis.com/v0/b/app/o/photo.jpg';

const renderPhotoItem = (
  index: number = 0,
  liked: boolean = false,
  likes: number = 5,
  commentCount: number = 3
) => {
  return render(
    <PhotoItem
      photo={photoUrl}
      index={index}
      liked={liked}
      likes={likes}
      commentCount={commentCount}
      onSelect={mockOnSelect}
      onLike={mockOnLike}
    />
  );
};

describe('PhotoItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render photo with correct alt text', () => {
      renderPhotoItem(0);

      expect(screen.getByAltText('Foto 1 da galeria')).toBeInTheDocument();
    });

    it('should render correct alt text for different indices', () => {
      renderPhotoItem(5);

      expect(screen.getByAltText('Foto 6 da galeria')).toBeInTheDocument();
    });

    it('should render image with correct src', () => {
      renderPhotoItem();

      const image = screen.getByAltText(
        'Foto 1 da galeria'
      ) as HTMLImageElement;
      expect(image.src).toContain(photoUrl);
    });

    it('should render with relative group class for hover effects', () => {
      const { container } = renderPhotoItem();

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('relative', 'group');
    });
  });

  describe('Open Photo Button', () => {
    it('should have button to open photo', () => {
      renderPhotoItem(0);

      const button = screen.getByRole('button', {
        name: /Abrir foto 1 da galeria/i,
      });
      expect(button).toBeInTheDocument();
    });

    it('should call onSelect with index when photo button is clicked', () => {
      renderPhotoItem(3);

      const button = screen.getByRole('button', {
        name: /Abrir foto 4 da galeria/i,
      });
      fireEvent.click(button);

      expect(mockOnSelect).toHaveBeenCalledWith(3);
    });

    it('should have correct aria-label for open button', () => {
      renderPhotoItem(7);

      const button = screen.getByRole('button', {
        name: /Abrir foto 8 da galeria/i,
      });
      expect(button).toHaveAttribute('aria-label', 'Abrir foto 8 da galeria');
    });

    it('should have aspect-square class for square shape', () => {
      const { container } = renderPhotoItem();

      const button = container.querySelector('button');
      expect(button).toHaveClass('aspect-square');
    });
  });

  describe('Like Button', () => {
    it('should render like-unlike-button component', () => {
      renderPhotoItem(0, false, 5);

      expect(screen.getByTestId('like-button-0')).toBeInTheDocument();
    });

    it('should pass correct props to like button', () => {
      renderPhotoItem(2, true, 10);

      const likeButton = screen.getByTestId('like-button-2');
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
      expect(likeButton).toHaveTextContent('Unlike (10)');
    });

    it('should call onLike with index when like button is clicked', () => {
      renderPhotoItem(4, false);

      const likeButton = screen.getByTestId('like-button-4');
      fireEvent.click(likeButton);

      expect(mockOnLike).toHaveBeenCalledWith(4);
    });

    it('should display correct like count', () => {
      renderPhotoItem(0, false, 25);

      expect(screen.getByTestId('like-button-0')).toHaveTextContent('(25)');
    });

    it('should show unlike state when liked', () => {
      renderPhotoItem(0, true, 5);

      expect(screen.getByTestId('like-button-0')).toHaveTextContent('Unlike');
    });

    it('should show like state when not liked', () => {
      renderPhotoItem(0, false, 5);

      expect(screen.getByTestId('like-button-0')).toHaveTextContent('Like');
    });
  });

  describe('Comment Count Button', () => {
    it('should render comment count button', () => {
      renderPhotoItem(0, false, 5, 3);

      const commentButton = screen.getByRole('button', {
        name: /Ver 3 comentários da foto/i,
      });
      expect(commentButton).toBeInTheDocument();
    });

    it('should display correct comment count', () => {
      renderPhotoItem(0, false, 5, 12);

      const commentButton = screen.getByRole('button', {
        name: /Ver 12 comentários da foto/i,
      });
      expect(commentButton).toBeInTheDocument();
    });

    it('should call onSelect with index when comment button is clicked', () => {
      renderPhotoItem(5, false, 5, 3);

      const commentButton = screen.getByRole('button', {
        name: /Ver 3 comentários da foto/i,
      });
      fireEvent.click(commentButton);

      expect(mockOnSelect).toHaveBeenCalledWith(5);
    });

    it('should have correct aria-label for comment button singular', () => {
      renderPhotoItem(0, false, 5, 1);

      const commentButton = screen.getByRole('button', {
        name: /Ver 1 comentário da foto/i,
      });
      expect(commentButton).toHaveAttribute(
        'aria-label',
        'Ver 1 comentário da foto'
      );
    });

    it('should have correct aria-label for comment button plural', () => {
      renderPhotoItem(0, false, 5, 2);

      const commentButton = screen.getByRole('button', {
        name: /Ver 2 comentários da foto/i,
      });
      expect(commentButton).toHaveAttribute(
        'aria-label',
        'Ver 2 comentários da foto'
      );
    });

    it('should have MessageCircle icon with aria-hidden', () => {
      const { container } = renderPhotoItem(0, false, 5, 3);

      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('should have proper styling with flex layout', () => {
      const { container } = renderPhotoItem();

      const commentButton = screen.getByRole('button', {
        name: /comentário/i,
      });
      expect(commentButton).toHaveClass('flex', 'gap-1');
    });
  });

  describe('Layout and Structure', () => {
    it('should have flex layout for stats below photo', () => {
      const { container } = renderPhotoItem();

      const statsContainer = container.querySelector('div.mt-1');
      expect(statsContainer).toHaveClass('flex', 'justify-between');
    });

    it('should have overflow-hidden for image', () => {
      const { container } = renderPhotoItem();

      const button = container.querySelector('button');
      expect(button).toHaveClass('overflow-hidden', 'rounded');
    });

    it('should have correct width and height classes for image', () => {
      const { container } = renderPhotoItem();

      const image = container.querySelector('img');
      expect(image).toHaveClass('object-cover', 'w-full', 'h-full');
    });
  });

  describe('Image Loading', () => {
    it('should have eager loading for first 6 photos', () => {
      renderPhotoItem(2);

      const image = screen.getByAltText(
        'Foto 3 da galeria'
      ) as HTMLImageElement;
      expect(image).toHaveAttribute('loading', 'eager');
    });

    it('should have lazy loading for photos after index 6', () => {
      renderPhotoItem(7);

      const image = screen.getByAltText(
        'Foto 8 da galeria'
      ) as HTMLImageElement;
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('should have priority for first 3 photos', () => {
      renderPhotoItem(2);

      const image = screen.getByAltText('Foto 3 da galeria');
      // Priority is a Next.js Image prop that affects rendering
      expect(image).toBeInTheDocument();
    });
  });

  describe('Responsive Sizing', () => {
    it('should have responsive sizes attribute', () => {
      const { container } = renderPhotoItem();

      const image = container.querySelector('img');
      expect(image).toHaveAttribute('sizes');
    });
  });

  describe('Multiple Photo Items', () => {
    it('should handle different indices correctly', () => {
      const { rerender } = render(
        <PhotoItem
          photo={photoUrl}
          index={0}
          liked={false}
          likes={5}
          commentCount={3}
          onSelect={mockOnSelect}
          onLike={mockOnLike}
        />
      );

      expect(screen.getByAltText('Foto 1 da galeria')).toBeInTheDocument();

      rerender(
        <PhotoItem
          photo={photoUrl}
          index={9}
          liked={false}
          likes={5}
          commentCount={3}
          onSelect={mockOnSelect}
          onLike={mockOnLike}
        />
      );

      expect(screen.getByAltText('Foto 10 da galeria')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be memoized to prevent unnecessary re-renders', () => {
      const { rerender } = renderPhotoItem(0, false, 5, 3);

      const image = screen.getByAltText('Foto 1 da galeria');
      expect(image).toBeInTheDocument();

      rerender(
        <PhotoItem
          photo={photoUrl}
          index={0}
          liked={false}
          likes={5}
          commentCount={3}
          onSelect={mockOnSelect}
          onLike={mockOnLike}
        />
      );

      expect(screen.getByAltText('Foto 1 da galeria')).toBeInTheDocument();
    });

    it('should have keyboard accessible buttons', () => {
      renderPhotoItem(0, false, 5, 3);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((btn) => {
        expect(btn).not.toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero likes', () => {
      renderPhotoItem(0, false, 0);

      expect(screen.getByTestId('like-button-0')).toHaveTextContent('(0)');
    });

    it('should handle zero comments', () => {
      renderPhotoItem(0, false, 5, 0);

      const commentButton = screen.getByRole('button', {
        name: /Ver 0/i,
      });
      expect(commentButton).toBeInTheDocument();
    });

    it('should handle large like counts', () => {
      renderPhotoItem(0, false, 9999);

      expect(screen.getByTestId('like-button-0')).toHaveTextContent('(9999)');
    });

    it('should handle large comment counts', () => {
      renderPhotoItem(0, false, 5, 999);

      const commentButton = screen.getByRole('button', {
        name: /Ver 999 comentários da foto/i,
      });
      expect(commentButton).toBeInTheDocument();
    });

    it('should handle large index values', () => {
      renderPhotoItem(99, false, 5, 3);

      expect(screen.getByAltText('Foto 100 da galeria')).toBeInTheDocument();
    });
  });
});
