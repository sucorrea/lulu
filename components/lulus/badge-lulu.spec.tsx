import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BadgeLulu from './badge-lulu';

describe('BadgeLulu', () => {
  it('should render value and label', () => {
    render(<BadgeLulu value={3} label="Lulus" />);

    expect(screen.getByTestId('badge-lulu')).toHaveTextContent('3Lulus');
  });

  it('should highlight the value with the serif font', () => {
    render(<BadgeLulu value={3} label="Lulus" />);

    expect(screen.getByText('3')).toHaveClass(
      'font-serif',
      'font-bold',
      'text-primary',
      'lining-nums'
    );
  });

  it('should vertically center the value with the label', () => {
    render(<BadgeLulu value={3} label="Lulus" />);

    const badge = screen.getByTestId('badge-lulu');
    expect(badge).toHaveClass('items-center');
    expect(badge).not.toHaveClass('items-baseline');
  });

  it('should not render as a pill', () => {
    render(<BadgeLulu value={3} label="Lulus" />);

    const badge = screen.getByTestId('badge-lulu');
    expect(badge).not.toHaveClass('rounded-full');
    expect(badge).not.toHaveClass('border');
  });

  it('should accept a custom test id', () => {
    render(<BadgeLulu value="—" label="Lulus" testId="custom" />);

    expect(screen.getByTestId('custom')).toHaveTextContent('—Lulus');
  });
});
