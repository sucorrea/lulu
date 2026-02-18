/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PhotoCarousel from './photo-carousel';

const mockNextPhoto = vi.fn();
const mockPrevPhoto = vi.fn();

const defaultProps = {
  photos: ['url1', 'url2', 'url3', 'url4', 'url5'],
  selectedIndex: 0,
  nextPhoto: mockNextPhoto,
  prevPhoto: mockPrevPhoto,
};

const renderPhotoCarousel = (overrides: Partial<typeof defaultProps> = {}) => {
  const props = { ...defaultProps, ...overrides };
  return render(
    <PhotoCarousel {...props}>
      <img src={props.photos[props.selectedIndex ?? 0]} alt="Current" />
    </PhotoCarousel>
  );
};

describe('PhotoCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render children', () => {
      renderPhotoCarousel();

      expect(screen.getByAltText('Current')).toBeInTheDocument();
    });

    it('should render previous button', () => {
      renderPhotoCarousel();

      expect(
        screen.getByRole('button', { name: /Foto anterior/i })
      ).toBeInTheDocument();
    });

    it('should render next button', () => {
      renderPhotoCarousel();

      expect(
        screen.getByRole('button', { name: /Próxima foto/i })
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call prevPhoto when previous button is clicked', () => {
      renderPhotoCarousel();

      fireEvent.click(screen.getByRole('button', { name: /Foto anterior/i }));

      expect(mockPrevPhoto).toHaveBeenCalledTimes(1);
    });

    it('should call nextPhoto when next button is clicked', () => {
      renderPhotoCarousel();

      fireEvent.click(screen.getByRole('button', { name: /Próxima foto/i }));

      expect(mockNextPhoto).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should show correct aria-label for prev when at first photo', () => {
      renderPhotoCarousel({
        selectedIndex: 0,
        photos: ['a', 'b', 'c', 'd', 'e'],
      });

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior \(5 de 5\)/i,
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('should show correct aria-label for next when at last photo', () => {
      renderPhotoCarousel({
        selectedIndex: 4,
        photos: ['a', 'b', 'c', 'd', 'e'],
      });

      const nextButton = screen.getByRole('button', {
        name: /Próxima foto \(1 de 5\)/i,
      });
      expect(nextButton).toBeInTheDocument();
    });

    it('should show correct aria-label for prev when at middle photo', () => {
      renderPhotoCarousel({
        selectedIndex: 2,
        photos: ['a', 'b', 'c', 'd', 'e'],
      });

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior \(2 de 5\)/i,
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('should show correct aria-label for next when at middle photo', () => {
      renderPhotoCarousel({
        selectedIndex: 2,
        photos: ['a', 'b', 'c', 'd', 'e'],
      });

      const nextButton = screen.getByRole('button', {
        name: /Próxima foto \(4 de 5\)/i,
      });
      expect(nextButton).toBeInTheDocument();
    });

    it('should treat selectedIndex null as 0 for aria-labels', () => {
      renderPhotoCarousel({
        selectedIndex: null as unknown as number,
        photos: ['a', 'b'],
      });

      const prevButton = screen.getByRole('button', {
        name: /Foto anterior \(2 de 2\)/i,
      });
      expect(prevButton).toBeInTheDocument();

      const nextButton = screen.getByRole('button', {
        name: /Próxima foto \(2 de 2\)/i,
      });
      expect(nextButton).toBeInTheDocument();
    });
  });
});
