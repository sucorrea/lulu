import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: (
    _importFn: unknown,
    options?: { loading?: () => React.ReactNode }
  ) => {
    const Loading = options?.loading;
    return () => (Loading ? <Loading /> : null);
  },
}));

import GaleriaFotosDynamic from './galeria-fotos-dynamic';

describe('GaleriaFotosDynamic', () => {
  it('renders the gallery skeleton while the chunk loads', () => {
    render(<GaleriaFotosDynamic />);
    expect(screen.getAllByTestId('skeleton-item').length).toBeGreaterThan(0);
  });
});
