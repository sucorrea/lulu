import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Home from './page';

const mocks = vi.hoisted(() => ({
  getParticipantsWithEditTokens: vi.fn(),
  getNextBirthday: vi.fn(),
  getParticipantPhotoUrl: vi.fn(),
  preload: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/app/actions/participants', () => ({
  getParticipantsWithEditTokens: mocks.getParticipantsWithEditTokens,
}));

vi.mock('@/components/lulus/lulus-interactive', () => ({
  default: () => <div data-testid="lulus-component">Lulus Component</div>,
}));

vi.mock('@/components/lulus/skeleton-lulus-interactive', () => ({
  default: () => <div data-testid="skeleton-lulus">Carregando...</div>,
}));

vi.mock('@/components/error-state', () => ({
  default: ({ title, message }: { title?: string; message?: string }) => (
    <div data-testid="error-state">
      <span>{title}</span>
      <span>{message}</span>
    </div>
  ),
}));

vi.mock('@/components/lulus/utils', () => ({
  getNextBirthday: mocks.getNextBirthday,
  getParticipantPhotoUrl: mocks.getParticipantPhotoUrl,
}));

vi.mock('react-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-dom')>()),
  preload: mocks.preload,
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getParticipantsWithEditTokens.mockResolvedValue([]);
    mocks.getNextBirthday.mockReturnValue(null);
    mocks.getParticipantPhotoUrl.mockReturnValue(null);
  });

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
      expect(screen.getByTestId('lulus-component')).toBeInTheDocument();
    });
  });

  it('should render ErrorState when getParticipantsWithEditTokens throws', async () => {
    mocks.getParticipantsWithEditTokens.mockRejectedValue(
      new Error('Network error')
    );

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Erro ao carregar participantes')
    ).toBeInTheDocument();
    expect(screen.getByText(/carr.*dados/i)).toBeInTheDocument();
  });

  it('should call preload when participant has a photo URL', async () => {
    const mockParticipant = {
      id: 1,
      name: 'Alice',
      photoURL: 'https://example.com/photo.jpg',
    };
    mocks.getParticipantsWithEditTokens.mockResolvedValueOnce([
      mockParticipant,
    ]);
    mocks.getNextBirthday.mockReturnValueOnce(mockParticipant);
    mocks.getParticipantPhotoUrl.mockReturnValueOnce(
      'https://example.com/photo.jpg'
    );

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('lulus-component')).toBeInTheDocument();
    });

    expect(mocks.preload).toHaveBeenCalledWith(
      'https://example.com/photo.jpg',
      {
        as: 'image',
        fetchPriority: 'high',
      }
    );
  });

  it('should not call preload when participant has no photo URL', async () => {
    const mockParticipant = { id: 1, name: 'Alice' };
    mocks.getParticipantsWithEditTokens.mockResolvedValueOnce([
      mockParticipant,
    ]);
    mocks.getNextBirthday.mockReturnValueOnce(mockParticipant);
    mocks.getParticipantPhotoUrl.mockReturnValueOnce(null);

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('lulus-component')).toBeInTheDocument();
    });

    expect(mocks.preload).not.toHaveBeenCalled();
  });

  it('should not call preload or getParticipantPhotoUrl when no next birthday', async () => {
    mocks.getNextBirthday.mockReturnValueOnce(null);

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('lulus-component')).toBeInTheDocument();
    });

    expect(mocks.preload).not.toHaveBeenCalled();
    expect(mocks.getParticipantPhotoUrl).not.toHaveBeenCalled();
  });
});
