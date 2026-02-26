import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimelineSkeleton } from './timeline-skeleton';

describe('TimelineSkeleton', () => {
  it('should render skeleton placeholders', () => {
    const { container } = render(<TimelineSkeleton />);

    expect(
      screen.getByLabelText('Carregando histórico...')
    ).toBeInTheDocument();

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(14);
  });
});
