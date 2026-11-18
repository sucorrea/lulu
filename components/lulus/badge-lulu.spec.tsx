import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BadgeLulu from './badge-lulu';

describe('BadgeLulu', () => {
  it('should render text', () => {
    render(<BadgeLulu text="Somos 3 Lulus" />);

    expect(screen.getByText('Somos 3 Lulus')).toBeInTheDocument();
  });

  it('should render as a white pill with border', () => {
    render(<BadgeLulu text="Somos 3 Lulus" />);

    expect(screen.getByText('Somos 3 Lulus')).toHaveClass(
      'rounded-full',
      'border',
      'border-border',
      'bg-card',
      'text-primary',
      'font-semibold'
    );
  });

  it('should not render an icon', () => {
    const { container } = render(<BadgeLulu text="Test" />);

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
