import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from './page';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/app/actions/participants', () => ({
  getParticipantsWithEditTokens: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/components/lulus/lulus-interactive', () => ({
  default: () => <div>Lulus Component</div>,
}));

vi.mock('@/components/lulus/skeleton-lulus-interactive', () => ({
  default: () => <div data-testid="skeleton-lulus">Carregando...</div>,
}));

vi.mock('@/components/lulus/utils', () => ({
  getNextBirthday: vi.fn().mockReturnValue(null),
  getParticipantPhotoUrl: vi.fn().mockReturnValue(null),
}));

vi.mock('react-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-dom')>()),
  preload: vi.fn(),
}));

describe('Home Page', () => {
  it('should render page title', () => {
    render(<Home />);
    expect(screen.getByText('Participantes')).toBeInTheDocument();
  });

  it('should render page description', () => {
    render(<Home />);
    expect(
      screen.getByText('Veja quem faz parte dessa rede de carinho e amizade')
    ).toBeInTheDocument();
  });

  it('should render skeleton while loading', () => {
    render(<Home />);
    expect(screen.getByTestId('skeleton-lulus')).toBeInTheDocument();
  });

  it('should render Lulus component after data loads', async () => {
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      expect(screen.getByText('Lulus Component')).toBeInTheDocument();
    });
  });
});
