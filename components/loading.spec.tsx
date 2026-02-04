import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './loading';

vi.mock('react-spinners/BounceLoader', () => ({
  default: ({ color }: { color: string }) => (
    <div data-testid="bounce-loader" data-color={color} />
  ),
}));

describe('Loading', () => {
  it('should render loading component', () => {
    const { container } = render(<Loading />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toBeInTheDocument();
  });

  it('should render BounceLoader with red color', () => {
    render(<Loading />);

    const loader = screen.getByTestId('bounce-loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute('data-color', '#FF0000');
  });

  it('should apply flex layout classes', () => {
    const { container } = render(<Loading />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-screen'
    );
  });

  it('should center content vertically and horizontally', () => {
    const { container } = render(<Loading />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('items-center');
    expect(mainDiv).toHaveClass('justify-center');
  });

  it('should have minimum full screen height', () => {
    const { container } = render(<Loading />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen');
  });
});
