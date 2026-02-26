import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistoricoSkeleton } from './historico-skeleton';

describe('HistoricoSkeleton', () => {
  it('should render without errors', () => {
    const { container } = render(<HistoricoSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render the timeline skeleton', () => {
    render(<HistoricoSkeleton />);
    expect(
      screen.getByLabelText('Carregando histórico...')
    ).toBeInTheDocument();
  });

  it('should render skeleton elements for title and subtitle', () => {
    const { container } = render(<HistoricoSkeleton />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render skeleton for action buttons area', () => {
    const { container } = render(<HistoricoSkeleton />);
    const skeletons = container.querySelectorAll('[class*="h-10"]');
    expect(skeletons.length).toBe(2);
  });
});
