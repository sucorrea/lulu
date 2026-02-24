import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SorteioPage from './page';

vi.mock('@/components/sorteio/sorteio-client', () => ({
  SorteioClient: () => <div>Sorteio Client</div>,
}));

describe('SorteioPage', () => {
  it('should render SorteioClient component', () => {
    render(<SorteioPage />);
    expect(screen.getByText('Sorteio Client')).toBeInTheDocument();
  });
});
