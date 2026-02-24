import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SkeletonLulusInteractive from './skeleton-lulus-interactive';

describe('SkeletonLulusInteractive', () => {
  it('should render the main container', () => {
    const { container } = render(<SkeletonLulusInteractive />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toBeInTheDocument();
  });

  it('should apply min-h-screen and padding classes to container', () => {
    const { container } = render(<SkeletonLulusInteractive />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'p-4');
  });

  it('should render header section with two skeleton elements', () => {
    const { container } = render(<SkeletonLulusInteractive />);

    const headerDiv = container.querySelector('.mb-6') as HTMLElement;
    expect(headerDiv).toBeInTheDocument();

    const headerSkeletons = headerDiv.querySelectorAll(
      '[class*="animate-pulse"]'
    );
    expect(headerSkeletons.length).toBeGreaterThanOrEqual(2);
  });

  it('should render exactly 6 skeleton cards', () => {
    const { container } = render(<SkeletonLulusInteractive />);

    const cards = container.querySelectorAll('.lulu-card');
    expect(cards).toHaveLength(6);
  });

  it('should render the grid with correct layout classes', () => {
    const { container } = render(<SkeletonLulusInteractive />);

    const grid = container.querySelector('.grid') as HTMLElement;
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'gap-2');
  });

  it('should render a circular avatar skeleton inside each card', () => {
    const { container } = render(<SkeletonLulusInteractive />);

    const avatarSkeletons = container.querySelectorAll('.rounded-full');
    expect(avatarSkeletons.length).toBeGreaterThanOrEqual(6);
  });

  it('should render badge skeletons inside each card', () => {
    const { container } = render(<SkeletonLulusInteractive />);

    const badgeSkeletons = container.querySelectorAll('.h-6.rounded-full');
    expect(badgeSkeletons.length).toBeGreaterThanOrEqual(12);
  });

  it('should render each card with max-w-md constraint', () => {
    const { container } = render(<SkeletonLulusInteractive />);

    const cards = container.querySelectorAll('.max-w-md');
    expect(cards).toHaveLength(6);
  });
});
