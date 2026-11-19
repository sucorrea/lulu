import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import GaleriaSkeleton from './galeria-skeleton';

describe('GaleriaSkeleton', () => {
  it('renders skeleton tiles', () => {
    render(<GaleriaSkeleton />);
    expect(screen.getAllByTestId('skeleton-item').length).toBeGreaterThan(0);
  });
});
