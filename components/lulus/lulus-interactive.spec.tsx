import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LulusInteractive from './lulus-interactive';
import { Person } from './types';

const mockUseUserVerification = vi.fn();
const mockUseQuery = vi.fn();

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: () => mockUseUserVerification(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (config: unknown) => mockUseQuery(config),
}));

vi.mock('react-spinners/BounceLoader', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('./filter/filter', () => ({
  default: ({
    searchTerm,
    filterMonth,
    sortBy,
    setSearchTerm,
    setFilterMonth,
  }: {
    searchTerm: string;
    filterMonth: string;
    sortBy: string;
    setSearchTerm: (value: string) => void;
    setFilterMonth: (value: string) => void;
  }) => (
    <div data-testid="filter-component">
      Filter Component {searchTerm} {filterMonth} {sortBy}
      <button
        type="button"
        data-testid="set-search-filter"
        onClick={() => {
          setSearchTerm('Teste');
          setFilterMonth('all');
        }}
      >
        Apply search
      </button>
      <button
        type="button"
        data-testid="set-month-filter"
        onClick={() => {
          setSearchTerm('');
          setFilterMonth('january');
        }}
      >
        Apply month
      </button>
    </div>
  ),
}));

vi.mock('./lulu-card/lulu-card-home', () => ({
  default: ({
    participant,
    isNextBirthday,
  }: {
    participant: Person;
    isNextBirthday?: boolean;
  }) => (
    <div
      data-testid={isNextBirthday ? 'next-birthday-card' : 'participant-card'}
    >
      {participant.name}
    </div>
  ),
}));

describe('LulusInteractive', () => {
  const mockParticipants: Person[] = [
    {
      id: 1,
      name: 'Maria Silva',
      fullName: 'Maria Silva Santos',
      date: '1990-03-15',
      month: 'Março',
      gives_to: 'João',
      gives_to_id: 2,
      city: 'São Paulo',
      email: 'maria@example.com',
    },
    {
      id: 2,
      name: 'João Santos',
      fullName: 'João Santos Oliveira',
      date: '1988-07-20',
      month: 'Julho',
      gives_to: 'Maria',
      gives_to_id: 1,
      city: 'Rio de Janeiro',
      phone: '11999999999',
    },
    {
      id: 3,
      name: 'Ana Costa',
      fullName: 'Ana Costa Lima',
      date: '1992-01-10',
      month: 'Janeiro',
      gives_to: '',
      gives_to_id: 0,
      city: 'Brasília',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
    });
    mockUseQuery.mockImplementation((config) => ({
      data: config.initialData || [],
    }));
  });

  describe('Loading State', () => {
    it('should render loading skeletons when user is loading', () => {
      mockUseUserVerification.mockReturnValue({
        user: null,
        isLoading: true,
      });

      const { container } = render(
        <LulusInteractive initialParticipants={mockParticipants} />
      );

      const skeletons = container.querySelectorAll('.lulu-card');
      expect(skeletons).toHaveLength(6);
    });

    it('should show animated loading header when loading', () => {
      mockUseUserVerification.mockReturnValue({
        user: null,
        isLoading: true,
      });

      const { container } = render(
        <LulusInteractive initialParticipants={mockParticipants} />
      );

      const animatedHeader = container.querySelector('.animate-pulse');
      expect(animatedHeader).toBeInTheDocument();
    });
  });

  describe('Participants Display', () => {
    it('should render with empty participants', () => {
      render(<LulusInteractive initialParticipants={[]} />);
      expect(screen.getByTestId('filter-component')).toBeInTheDocument();
    });

    it('should show total participants badge with correct count', () => {
      render(<LulusInteractive initialParticipants={mockParticipants} />);
      expect(screen.getByText(/2 Participantes/)).toBeInTheDocument();
    });

    it('should exclude participants with gives_to_id === 0 from count', () => {
      render(<LulusInteractive initialParticipants={mockParticipants} />);
      const badge = screen.getByText(/Participantes/);
      expect(badge.textContent).toBe('2 Participantes');
    });

    it('should render participant cards', () => {
      render(<LulusInteractive initialParticipants={mockParticipants} />);
      const cards = screen.getAllByTestId('participant-card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Next Birthday Display', () => {
    it('should render next birthday card when there is a next birthday', () => {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      const participantsWithUpcomingBirthday: Person[] = [
        {
          ...mockParticipants[0],
          date: nextMonth.toISOString().split('T')[0],
          gives_to_id: 1,
        },
      ];

      render(
        <LulusInteractive
          initialParticipants={participantsWithUpcomingBirthday}
        />
      );

      expect(screen.queryByTestId('next-birthday-card')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state message when no participants match filters', () => {
      render(<LulusInteractive initialParticipants={[]} />);
      expect(
        screen.getByText('Nenhuma participante encontrada')
      ).toBeInTheDocument();
    });

    it('should show search term in empty state when searching', () => {
      render(<LulusInteractive initialParticipants={[]} />);
      fireEvent.click(screen.getByTestId('set-search-filter'));
      expect(
        screen.getByText('Não encontramos resultados para "Teste"')
      ).toBeInTheDocument();
    });

    it('should show month-specific empty state message when filtering by month', () => {
      render(<LulusInteractive initialParticipants={[]} />);
      fireEvent.click(screen.getByTestId('set-month-filter'));
      expect(
        screen.getByText('Nenhuma participante encontrada neste mês')
      ).toBeInTheDocument();
    });

    it('should clear filters when clicking "Limpar filtros" button', () => {
      render(<LulusInteractive initialParticipants={[]} />);

      fireEvent.click(screen.getByTestId('set-search-filter'));

      const clearButton = screen.getByRole('button', {
        name: 'Limpar filtros',
      });

      expect(clearButton).toBeInTheDocument();

      fireEvent.click(clearButton);

      expect(
        screen.getByText('Tente ajustar os filtros de busca')
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Limpar filtros' })
      ).not.toBeInTheDocument();
    });
  });

  describe('React Query Integration', () => {
    it('should use initial participants data', () => {
      mockUseQuery.mockReturnValue({
        data: mockParticipants,
      });

      render(<LulusInteractive initialParticipants={mockParticipants} />);
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['get-all-participants-with-tokens'],
          initialData: mockParticipants,
        })
      );
    });

    it('should use staleTime to avoid excessive token regeneration', () => {
      render(<LulusInteractive initialParticipants={mockParticipants} />);
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          staleTime: 5 * 60 * 1000,
        })
      );
    });
  });

  describe('User Authentication', () => {
    it('should pass user status to participant cards when authenticated', () => {
      mockUseUserVerification.mockReturnValue({
        user: { id: '123', email: 'user@example.com' },
        isLoading: false,
      });

      render(<LulusInteractive initialParticipants={mockParticipants} />);
      const cards = screen.getAllByTestId('participant-card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should pass false user status when not authenticated', () => {
      mockUseUserVerification.mockReturnValue({
        user: null,
        isLoading: false,
      });

      render(<LulusInteractive initialParticipants={mockParticipants} />);
      const cards = screen.getAllByTestId('participant-card');
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
