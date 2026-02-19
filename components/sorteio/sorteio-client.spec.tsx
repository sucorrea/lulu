import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';

import { SorteioClient } from './sorteio-client';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: vi.fn(),
}));

vi.mock('@/components/error-state', () => ({
  default: ({
    title,
    message,
    onRetry,
  }: {
    title?: string;
    message?: string;
    onRetry?: () => void;
  }) => (
    <div data-testid="error-state">
      <span>{title}</span>
      <span>{message}</span>
      {onRetry && <button onClick={onRetry}>retry</button>}
    </div>
  ),
}));

vi.mock('@/components/dialog/dialog', () => ({
  GenericDialog: ({
    open,
    footer,
    children,
    title,
    description,
    onOpenChange,
  }: {
    open: boolean;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    title?: string;
    description?: string;
    onOpenChange?: (open: boolean) => void;
  }) =>
    open ? (
      <div data-testid="confirm-dialog">
        <span>{title}</span>
        <span>{description}</span>
        {children}
        {footer}
        <button
          data-testid="btn-close-dialog"
          onClick={() => onOpenChange?.(false)}
        >
          close-dialog
        </button>
      </div>
    ) : null,
}));

vi.mock('./participant-selection', () => ({
  ParticipantSelection: ({
    participants,
    selectedIds,
    onToggle,
    onSelectAll,
    onClearSelection,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    participants: any[];
    selectedIds: Set<number>;
    onToggle: (id: number) => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
  }) => (
    <div data-testid="participant-selection">
      <span data-testid="selected-count">{selectedIds.size}</span>
      <button data-testid="btn-select-all" onClick={onSelectAll}>
        select-all
      </button>
      <button data-testid="btn-clear" onClick={onClearSelection}>
        clear
      </button>
      {participants.map((p) => (
        <button
          key={p.id}
          data-testid={`toggle-${p.id}`}
          onClick={() => onToggle(p.id)}
        >
          {p.fullName || p.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('./sorteio-result-preview', () => ({
  SorteioResultPreview: ({
    pairs,
    isSaved,
    relaxed,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pairs: any[];
    relaxed: boolean;
    isSaved?: boolean;
  }) => (
    <div
      data-testid="result-preview"
      data-saved={isSaved}
      data-relaxed={relaxed}
    >
      {pairs.length} pairs
    </div>
  ),
}));

vi.mock('./year-selector', () => ({
  YearSelector: ({
    selectedYear,
    onChange,
  }: {
    selectedYear: number;
    onChange: (y: number) => void;
  }) => (
    <div data-testid="year-selector">
      <span data-testid="selected-year">{selectedYear}</span>
      <button onClick={() => onChange(selectedYear + 1)}>next-year</button>
    </div>
  ),
}));

const mockRealizarSorteio = vi.fn();
vi.mock('@/lib/sorteio', () => ({
  realizarSorteio: (...args: unknown[]) => mockRealizarSorteio(...args),
}));

const mockUseGetAllParticipants = vi.fn();
vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetAllParticipants: () => mockUseGetAllParticipants(),
}));

const mockUseGetVaquinhaHistoryByYear = vi.fn();
const mockUseBatchAddVaquinhaHistory = vi.fn();
vi.mock('@/services/queries/vaquinhaHistory', () => ({
  useGetVaquinhaHistoryByYear: (year: number) =>
    mockUseGetVaquinhaHistoryByYear(year),
  useBatchAddVaquinhaHistory: () => mockUseBatchAddVaquinhaHistory(),
}));

import { useUserVerification } from '@/hooks/user-verify';

const currentYear = new Date().getFullYear();
const selectedYear = currentYear + 1;

const mockParticipants = [
  {
    id: 1,
    name: 'Ana',
    fullName: 'Ana Silva',
    date: '2000-03-10',
    month: '3',
    city: 'SP',
  },
  {
    id: 2,
    name: 'Bia',
    fullName: 'Bia Souza',
    date: '2000-06-15',
    month: '6',
    city: 'RJ',
  },
  {
    id: 3,
    name: 'Carlos',
    fullName: 'Carlos Lima',
    date: '2000-09-20',
    month: '9',
    city: 'MG',
  },
];

const mockExistingHistory = [
  {
    id: 'h1',
    year: selectedYear,
    responsibleId: 1,
    responsibleName: 'Ana Silva',
    birthdayPersonId: 2,
    birthdayPersonName: 'Bia Souza',
    birthdayDate: '2000-06-15',
  },
];

const mockSorteioResult = {
  pairs: [
    {
      responsibleId: 1,
      responsibleName: 'Ana Silva',
      birthdayPersonId: 2,
      birthdayPersonName: 'Bia Souza',
      birthdayDate: '2000-06-15',
    },
  ],
  relaxed: false,
};

const setupDefaultMocks = (
  options: {
    isLoadingAuth?: boolean;
    isLoadingParticipants?: boolean;
    isErrorParticipants?: boolean;
    participantsData?: typeof mockParticipants | undefined;
    isAuthenticated?: boolean;
    currentYearHistory?: typeof mockExistingHistory | [];
    isLoadingCurrentHistory?: boolean;
    previousYearHistory?: typeof mockExistingHistory | [];
    isLoadingPreviousHistory?: boolean;
    batchMutateAsync?: () => Promise<void>;
    batchIsPending?: boolean;
  } = {}
) => {
  const {
    isLoadingAuth = false,
    isLoadingParticipants = false,
    isErrorParticipants = false,
    participantsData = mockParticipants,
    isAuthenticated = true,
    currentYearHistory = [],
    isLoadingCurrentHistory = false,
    previousYearHistory = [],
    isLoadingPreviousHistory = false,
    batchMutateAsync = vi.fn().mockResolvedValue(undefined),
    batchIsPending = false,
  } = options;

  vi.mocked(useUserVerification).mockReturnValue({
    user: isAuthenticated
      ? ({} as ReturnType<typeof useUserVerification>['user'])
      : null,
    isLogged: isAuthenticated,
    isLoading: isLoadingAuth,
    handleLogout: vi.fn(),
  });

  mockUseGetAllParticipants.mockReturnValue({
    data: participantsData,
    isLoading: isLoadingParticipants,
    isError: isErrorParticipants,
    refetch: vi.fn(),
  });

  mockUseGetVaquinhaHistoryByYear.mockImplementation((year: number) => {
    if (year === selectedYear) {
      return {
        data: currentYearHistory,
        isLoading: isLoadingCurrentHistory,
        refetch: vi.fn(),
      };
    }
    return {
      data: previousYearHistory,
      isLoading: isLoadingPreviousHistory,
    };
  });

  mockUseBatchAddVaquinhaHistory.mockReturnValue({
    mutateAsync: batchMutateAsync,
    isPending: batchIsPending,
  });
};

describe('SorteioClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRealizarSorteio.mockReturnValue(mockSorteioResult);
    setupDefaultMocks();
  });

  describe('loading state', () => {
    it('renders skeleton loaders when auth is loading', () => {
      setupDefaultMocks({ isLoadingAuth: true });
      render(<SorteioClient />);
      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
    });

    it('renders skeleton loaders when participants are loading', () => {
      setupDefaultMocks({ isLoadingParticipants: true });
      render(<SorteioClient />);
      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
    });

    it('renders skeleton loaders when current history is loading', () => {
      setupDefaultMocks({ isLoadingCurrentHistory: true });
      render(<SorteioClient />);
      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
    });
  });

  describe('error state', () => {
    it('renders error state when participants fail to load', () => {
      setupDefaultMocks({ isErrorParticipants: true });
      render(<SorteioClient />);
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(
        screen.getByText('Erro ao carregar participantes')
      ).toBeInTheDocument();
    });

    it('calls refetch when retry is clicked', () => {
      const refetch = vi.fn();
      setupDefaultMocks({ isErrorParticipants: true });
      mockUseGetAllParticipants.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch,
      });
      render(<SorteioClient />);
      fireEvent.click(screen.getByRole('button', { name: 'retry' }));
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('selection step', () => {
    it('renders the page title', () => {
      render(<SorteioClient />);
      expect(screen.getByText('Sorteio da Vaquinha')).toBeInTheDocument();
    });

    it('renders YearSelector', () => {
      render(<SorteioClient />);
      expect(screen.getByTestId('year-selector')).toBeInTheDocument();
    });

    it('renders ParticipantSelection with participants', () => {
      render(<SorteioClient />);
      expect(screen.getByTestId('participant-selection')).toBeInTheDocument();
    });

    it('renders run sorteio button when authenticated', () => {
      render(<SorteioClient />);
      expect(
        screen.getByRole('button', { name: /Realizar Sorteio/ })
      ).toBeInTheDocument();
    });

    it('does not render run sorteio button when unauthenticated', () => {
      setupDefaultMocks({ isAuthenticated: false });
      render(<SorteioClient />);
      expect(
        screen.queryByRole('button', { name: /Realizar Sorteio/ })
      ).not.toBeInTheDocument();
    });

    it('run sorteio button is disabled when fewer than 2 participants selected', () => {
      render(<SorteioClient />);
      expect(
        screen.getByRole('button', { name: /Realizar Sorteio/ })
      ).toBeDisabled();
    });

    it('run sorteio button is disabled when previous history is loading', () => {
      setupDefaultMocks({ isLoadingPreviousHistory: true });
      render(<SorteioClient />);
      const btn = screen.getByRole('button', { name: /Realizar Sorteio/ });
      expect(btn).toBeDisabled();
    });

    it('run sorteio button is enabled after selecting 2+ participants', () => {
      render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
      const btn = screen.getByRole('button', { name: /Realizar Sorteio/ });
      expect(btn).not.toBeDisabled();
    });

    it('toggles participant selection', () => {
      render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('toggle-1'));
      expect(screen.getByTestId('selected-count').textContent).toBe('1');
      fireEvent.click(screen.getByTestId('toggle-1'));
      expect(screen.getByTestId('selected-count').textContent).toBe('0');
    });

    it('select-all sets all participants as selected', () => {
      render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('btn-select-all'));
      expect(screen.getByTestId('selected-count').textContent).toBe('3');
    });

    it('clear selection removes all selected participants', () => {
      render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('btn-select-all'));
      fireEvent.click(screen.getByTestId('btn-clear'));
      expect(screen.getByTestId('selected-count').textContent).toBe('0');
    });

    it('handleSelectAll returns early when participants data is undefined', () => {
      setupDefaultMocks({ participantsData: undefined });
      render(<SorteioClient />);
      expect(() =>
        fireEvent.click(screen.getByTestId('btn-select-all'))
      ).not.toThrow();
    });

    it('shows existing draw banner when draw already exists', () => {
      setupDefaultMocks({ currentYearHistory: mockExistingHistory });
      render(<SorteioClient />);
      expect(
        screen.getByText(`Sorteio de ${selectedYear} já realizado`)
      ).toBeInTheDocument();
    });

    it('shows existing draw result preview when draw exists', () => {
      setupDefaultMocks({ currentYearHistory: mockExistingHistory });
      render(<SorteioClient />);
      expect(screen.getByTestId('result-preview')).toBeInTheDocument();
      expect(screen.getByTestId('result-preview')).toHaveAttribute(
        'data-saved',
        'true'
      );
    });

    it('does not show new participant selection when draw exists', () => {
      setupDefaultMocks({ currentYearHistory: mockExistingHistory });
      render(<SorteioClient />);
      expect(
        screen.queryByTestId('participant-selection')
      ).not.toBeInTheDocument();
    });

    it('year selector calls setSelectedYear', () => {
      render(<SorteioClient />);
      const nextYearBtn = screen.getByRole('button', { name: 'next-year' });
      fireEvent.click(nextYearBtn);
      expect(screen.getByTestId('selected-year').textContent).toBe(
        String(selectedYear + 1)
      );
    });
  });

  describe('run sorteio', () => {
    const selectTwoParticipants = () => {
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
    };

    it('transitions to preview step on success', () => {
      render(<SorteioClient />);
      selectTwoParticipants();
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      expect(screen.getByTestId('result-preview')).toBeInTheDocument();
      expect(
        screen.queryByTestId('participant-selection')
      ).not.toBeInTheDocument();
    });

    it('calls toast.success on successful sorteio', () => {
      render(<SorteioClient />);
      selectTwoParticipants();
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      expect(toast.success).toHaveBeenCalledWith(
        'Sorteio realizado com sucesso!'
      );
    });

    it('calls toast.warning when sorteio result is relaxed', () => {
      mockRealizarSorteio.mockReturnValue({
        ...mockSorteioResult,
        relaxed: true,
      });
      render(<SorteioClient />);
      selectTwoParticipants();
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      expect(toast.warning).toHaveBeenCalled();
    });

    it('calls toast.error when realizarSorteio throws an Error', () => {
      mockRealizarSorteio.mockImplementation(() => {
        throw new Error('Erro no sorteio');
      });
      render(<SorteioClient />);
      selectTwoParticipants();
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      expect(toast.error).toHaveBeenCalledWith('Erro no sorteio');
    });

    it('calls toast.error with fallback message when non-Error is thrown', () => {
      mockRealizarSorteio.mockImplementation(() => {
        throw 'string error';
      });
      render(<SorteioClient />);
      selectTwoParticipants();
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      expect(toast.error).toHaveBeenCalledWith('Erro ao realizar o sorteio');
    });

    it('handleRunSorteio returns early when participants data is undefined', () => {
      setupDefaultMocks({ participantsData: undefined });
      render(<SorteioClient />);
      expect(() =>
        fireEvent.click(screen.getByTestId('btn-select-all'))
      ).not.toThrow();
      expect(mockRealizarSorteio).not.toHaveBeenCalled();
    });
  });

  describe('preview step', () => {
    const goToPreview = () => {
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
    };

    it('renders result preview', () => {
      render(<SorteioClient />);
      goToPreview();
      expect(screen.getByTestId('result-preview')).toBeInTheDocument();
    });

    it('renders re-sorteio button when authenticated', () => {
      render(<SorteioClient />);
      goToPreview();
      expect(
        screen.getByRole('button', { name: /Sortear Novamente/ })
      ).toBeInTheDocument();
    });

    it('renders confirm button when authenticated', () => {
      render(<SorteioClient />);
      goToPreview();
      expect(
        screen.getByRole('button', { name: /Confirmar e Salvar/ })
      ).toBeInTheDocument();
    });

    it('renders back to selection button', () => {
      render(<SorteioClient />);
      goToPreview();
      expect(
        screen.getByRole('button', { name: /Voltar à Seleção/ })
      ).toBeInTheDocument();
    });

    it('back to selection returns to selection step', () => {
      render(<SorteioClient />);
      goToPreview();
      fireEvent.click(screen.getByRole('button', { name: /Voltar à Seleção/ }));
      expect(screen.getByTestId('participant-selection')).toBeInTheDocument();
    });

    it('re-sorteio reruns the draw', () => {
      render(<SorteioClient />);
      goToPreview();
      fireEvent.click(
        screen.getByRole('button', { name: /Sortear Novamente/ })
      );
      expect(mockRealizarSorteio).toHaveBeenCalledTimes(2);
    });

    it('confirm and save opens the dialog', () => {
      render(<SorteioClient />);
      goToPreview();
      fireEvent.click(
        screen.getByRole('button', { name: /Confirmar e Salvar/ })
      );
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });

    it('does not render preview action buttons when unauthenticated', () => {
      setupDefaultMocks({ isAuthenticated: false });
      mockRealizarSorteio.mockReturnValue(mockSorteioResult);
      render(<SorteioClient />);
      expect(
        screen.queryByRole('button', { name: /Sortear Novamente/ })
      ).not.toBeInTheDocument();
    });

    it('renders relaxed preview correctly', () => {
      mockRealizarSorteio.mockReturnValue({
        ...mockSorteioResult,
        relaxed: true,
      });
      render(<SorteioClient />);
      goToPreview();
      expect(screen.getByTestId('result-preview')).toHaveAttribute(
        'data-relaxed',
        'true'
      );
    });
  });

  describe('confirm dialog', () => {
    const goToPreviewAndOpenDialog = () => {
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      fireEvent.click(
        screen.getByRole('button', { name: /Confirmar e Salvar/ })
      );
    };

    it('renders dialog with correct title and description', () => {
      render(<SorteioClient />);
      goToPreviewAndOpenDialog();
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      expect(screen.getByText('Confirmar Sorteio')).toBeInTheDocument();
    });

    it('renders pair count in dialog body', () => {
      render(<SorteioClient />);
      goToPreviewAndOpenDialog();
      const dialog = screen.getByTestId('confirm-dialog');
      expect(dialog).toHaveTextContent('1');
    });

    it('cancel button closes the dialog', () => {
      render(<SorteioClient />);
      goToPreviewAndOpenDialog();
      fireEvent.click(screen.getByRole('button', { name: /Cancelar/ }));
      expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
    });

    it('shows relaxed warning in dialog when sorteio is relaxed', () => {
      mockRealizarSorteio.mockReturnValue({
        ...mockSorteioResult,
        relaxed: true,
      });
      render(<SorteioClient />);
      goToPreviewAndOpenDialog();
      expect(
        screen.getByText(/Algumas atribuições podem repetir o ano anterior/)
      ).toBeInTheDocument();
    });

    it('save button calls mutateAsync and transitions to saved step', async () => {
      const refetchCurrentHistory = vi.fn();
      mockUseGetVaquinhaHistoryByYear.mockImplementation((year: number) => {
        if (year === selectedYear) {
          return { data: [], isLoading: false, refetch: refetchCurrentHistory };
        }
        return { data: [], isLoading: false };
      });
      const mutateAsync = vi.fn().mockResolvedValue(undefined);
      mockUseBatchAddVaquinhaHistory.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      render(<SorteioClient />);
      goToPreviewAndOpenDialog();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /^Salvar$/ }));
      });

      await waitFor(() => {
        expect(mutateAsync).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining('atribuições')
        );
        expect(refetchCurrentHistory).toHaveBeenCalled();
      });
    });

    it('shows error toast when save fails', async () => {
      const mutateAsync = vi.fn().mockRejectedValue(new Error('save error'));
      mockUseBatchAddVaquinhaHistory.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      render(<SorteioClient />);
      goToPreviewAndOpenDialog();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /^Salvar$/ }));
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Erro ao salvar o sorteio. Tente novamente.'
        );
      });
    });

    it('shows isPending state with loading spinner on save button', () => {
      mockUseBatchAddVaquinhaHistory.mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: true,
      });

      render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      fireEvent.click(
        screen.getByRole('button', { name: /Confirmar e Salvar/ })
      );

      const saveBtn = screen.getByRole('button', { name: /^Salvar$/ });
      expect(saveBtn).toBeDisabled();
    });
  });

  describe('saved step', () => {
    it('renders saved success banner after save', async () => {
      const mutateAsync = vi.fn().mockResolvedValue(undefined);
      mockUseBatchAddVaquinhaHistory.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      fireEvent.click(
        screen.getByRole('button', { name: /Confirmar e Salvar/ })
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /^Salvar$/ }));
      });

      await waitFor(() => {
        expect(
          screen.getByText(`Sorteio de ${selectedYear} salvo com sucesso!`)
        ).toBeInTheDocument();
      });
    });

    it('renders result preview in saved step', async () => {
      const mutateAsync = vi.fn().mockResolvedValue(undefined);
      mockUseBatchAddVaquinhaHistory.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      fireEvent.click(
        screen.getByRole('button', { name: /Confirmar e Salvar/ })
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /^Salvar$/ }));
      });

      await waitFor(() => {
        const previews = screen.getAllByTestId('result-preview');
        expect(
          previews.some((el) => el.getAttribute('data-saved') === 'true')
        ).toBe(true);
      });
    });

    it('renders history pairs in saved step when history is available', async () => {
      const mutateAsync = vi.fn().mockResolvedValue(undefined);
      mockUseBatchAddVaquinhaHistory.mockReturnValue({
        mutateAsync,
        isPending: false,
      });

      const { rerender } = render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));
      fireEvent.click(
        screen.getByRole('button', { name: /Confirmar e Salvar/ })
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /^Salvar$/ }));
      });

      mockUseGetVaquinhaHistoryByYear.mockImplementation((year: number) => {
        if (year === selectedYear) {
          return {
            data: mockExistingHistory,
            isLoading: false,
            refetch: vi.fn(),
          };
        }
        return { data: [], isLoading: false };
      });
      rerender(<SorteioClient />);

      await waitFor(() => {
        expect(screen.getByText('1 pairs')).toBeInTheDocument();
      });
    });

    it('shows error toast when hasExistingDraw is true at time of confirm save', async () => {
      const { rerender } = render(<SorteioClient />);
      fireEvent.click(screen.getByTestId('toggle-1'));
      fireEvent.click(screen.getByTestId('toggle-2'));
      fireEvent.click(screen.getByRole('button', { name: /Realizar Sorteio/ }));

      mockUseGetVaquinhaHistoryByYear.mockImplementation((year: number) => {
        if (year === selectedYear) {
          return {
            data: mockExistingHistory,
            isLoading: false,
            refetch: vi.fn(),
          };
        }
        return { data: [], isLoading: false };
      });
      rerender(<SorteioClient />);

      fireEvent.click(
        screen.getByRole('button', { name: /Confirmar e Salvar/ })
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /^Salvar$/ }));
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining('já foi confirmado')
        );
      });
    });
  });
});
