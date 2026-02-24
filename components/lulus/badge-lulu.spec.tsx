import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Gift } from 'lucide-react';
import BadgeLulu from './badge-lulu';

describe('BadgeLulu', () => {
  it('should render text', () => {
    render(<BadgeLulu text="Somos 3 Lulus" />);

    expect(screen.getByText('Somos 3 Lulus')).toBeInTheDocument();
  });

  it('should render default Users icon when icon prop is not provided', () => {
    const { container } = render(<BadgeLulu text="Test" />);

    const usersIcon = container.querySelector('.lucide-users');
    expect(usersIcon).toBeInTheDocument();
  });

  it('should render custom icon when icon prop is provided', () => {
    const { container } = render(
      <BadgeLulu text="17 Participantes" icon={<Gift data-testid="custom-icon" />} />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    const usersIcon = container.querySelector('.lucide-users');
    expect(usersIcon).not.toBeInTheDocument();
  });

  it('should have correct container layout classes', () => {
    const { container } = render(<BadgeLulu text="Test" />);

    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('flex', 'md:justify-end', 'xs:justify-center', 'mb-2');
  });

  it('should apply font-semibold to text', () => {
    const { container } = render(<BadgeLulu text="Test" />);

    const span = container.querySelector('.font-semibold');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('Test');
  });

  it('should render badge with secondary variant styling', () => {
    const { container } = render(<BadgeLulu text="Test" />);

    const badge = container.querySelector('.bg-primary');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('shadow-lulu-sm', 'px-3', 'py-2', 'text-sm');
  });
});
