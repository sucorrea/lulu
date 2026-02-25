import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { toast } from 'sonner';

import { HistoricoClient } from './historico-client';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';

const {
  mockTimeline,
  mockYearFilter,
  mockBirthdayPersonFilter,
  mockFormDialog,
  mockErrorState,
} = vi.hoisted(() => {
  const mockTimeline = vi.fn(
    ({
      history,
      onEdit,
      onDelete,
    }: {
      history: VaquinhaHistory[];
      onEdit?: (item: VaquinhaHistory) => void;
      onDelete?: (id: string) => void;
    }) => (
      <div>
        <span>{`history-${history.length}`}</span>
        <button type="button" onClick={() => onEdit?.(history[0])}>
          Editar
        </button>
        <button type="button" onClick={() => onDelete?.(history[0]?.id || '')}>
          Excluir
        </button>
      </div>
    )
  );
  const mockYearFilter = vi.fn(
    ({
      years,
      selectedYear,
      onYearChange,
    }: {
      years: number[];
      selectedYear: number | null;
      onYearChange: (year: number | null) => void;
    }) => (
      <div>
        <span>{`years-${years.length}`}</span>
        <span>{selectedYear ?? 'all'}</span>
        <button type="button" onClick={() => onYearChange(2024)}>
          Selecionar 2024
        </button>
      </div>
    )
  );
  const mockBirthdayPersonFilter = vi.fn(
    ({
      persons,
      selectedPerson,
      onPersonChange,
    }: {
      persons: string[];
      selectedPerson: string | null;
      onPersonChange: (person: string | null) => void;
    }) => (
      <div>
        <span>{`persons-${persons.length}`}</span>
        <span>{selectedPerson ?? 'all'}</span>
        <button type="button" onClick={() => onPersonChange('Deborah')}>
          Selecionar Deborah
        </button>
      </div>
    )
  );
  const mockFormDialog = vi.fn(
    ({
      open,
      onSubmit,
      onOpenChange,
      isLoading,
    }: {
      open: boolean;
      onSubmit: (data: {
        year: number;
        responsibleId: number;
        responsibleName: string;
        birthdayPersonId: number;
        birthdayPersonName: string;
      }) => void;
      onOpenChange: (open: boolean) => void;
      participants: { id: number; name: string }[];
      editingItem?: VaquinhaHistory | null;
      isLoading?: boolean;
    }) => (
      <div>
        <span>{open ? 'open' : 'closed'}</span>
        <span>{isLoading ? 'loading' : 'idle'}</span>
        <button
          type="button"
          onClick={() =>
            onSubmit({
              year: 2024,
              responsibleId: 1,
              responsibleName: 'Maria',
              birthdayPersonId: 2,
              birthdayPersonName: 'Joana',
            })
          }
        >
          Salvar
        </button>
        <button type="button" onClick={() => onOpenChange(false)}>
          Fechar
        </button>
      </div>
    )
  );
  const mockErrorState = vi.fn(
    ({
      title,
      message,
      onRetry,
    }: {
      title: string;
      message: string;
      onRetry?: () => void;
    }) => (
      <div>
        <span>{title}</span>
        <span>{message}</span>
        <button type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    )
  );
  return {
    mockTimeline,
    mockYearFilter,
    mockBirthdayPersonFilter,
    mockFormDialog,
    mockErrorState,
  };
});

const mockUseUserVerification = vi.fn();
const mockUseGetAllParticipants = vi.fn();
const mockUseGetAvailableYears = vi.fn();
const mockUseGetAllVaquinhaHistory = vi.fn();
const mockUseGetVaquinhaHistoryByYear = vi.fn();
const mockUseAddVaquinhaHistory = vi.fn();
const mockUseUpdateVaquinhaHistory = vi.fn();
const mockUseDeleteVaquinhaHistory = vi.fn();

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: () => mockUseUserVerification(),
}));

vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetAllParticipants: () => mockUseGetAllParticipants(),
}));

vi.mock('@/services/queries/vaquinhaHistory', () => ({
  useGetAllVaquinhaHistory: () => mockUseGetAllVaquinhaHistory(),
  useGetVaquinhaHistoryByYear: (year: number | null) =>
    mockUseGetVaquinhaHistoryByYear(year),
  useGetAvailableYears: () => mockUseGetAvailableYears(),
  useAddVaquinhaHistory: () => mockUseAddVaquinhaHistory(),
  useUpdateVaquinhaHistory: () => mockUseUpdateVaquinhaHistory(),
  useDeleteVaquinhaHistory: () => mockUseDeleteVaquinhaHistory(),
}));

vi.mock('@/components/error-state', () => ({
  default: (props: { title: string; message: string; onRetry?: () => void }) =>
    mockErrorState(props),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('./birthday-person-filter', () => ({
  default: (props: {
    persons: string[];
    selectedPerson: string | null;
    onPersonChange: (person: string | null) => void;
  }) => mockBirthdayPersonFilter(props),
}));

vi.mock('./timeline', () => ({
  default: (props: {
    history: VaquinhaHistory[];
    onEdit?: (item: VaquinhaHistory) => void;
    onDelete?: (id: string) => void;
  }) => mockTimeline(props),
}));

vi.mock('./timeline-skeleton', () => ({
  default: () => <div data-testid="timeline-skeleton">Loading...</div>,
}));

vi.mock('./year-filter', () => ({
  default: (props: {
    years: number[];
    selectedYear: number | null;
    onYearChange: (year: number | null) => void;
  }) => mockYearFilter(props),
}));

vi.mock('./form-dialog', () => ({
  default: (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: {
      year: number;
      responsibleId: number;
      responsibleName: string;
      birthdayPersonId: number;
      birthdayPersonName: string;
    }) => void;
    participants: { id: number; name: string }[];
    editingItem?: VaquinhaHistory | null;
    isLoading?: boolean;
  }) => mockFormDialog(props),
}));

vi.mock('react-spinners/BounceLoader', () => ({
  default: ({ color }: { color: string }) => <div>{`loader-${color}`}</div>,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('HistoricoClient', () => {
  const participants = [
    { id: 1, name: 'Maria' },
    { id: 2, name: 'Joana' },
  ];
  const sortedParticipants = [...participants].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const history: VaquinhaHistory[] = [
    {
      id: '1',
      year: 2024,
      responsibleId: 1,
      responsibleName: 'Maria',
      birthdayPersonId: 2,
      birthdayPersonName: 'Joana',
      createdAt: new Date('2024-01-10').toISOString(),
    },
  ];

  const baseQueries = {
    data: history,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  };

  const filteredQueries = {
    data: history,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  };

  const addMutation = { mutateAsync: vi.fn(), isPending: false };
  const updateMutation = { mutateAsync: vi.fn(), isPending: false };
  const deleteMutation = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserVerification.mockReturnValue({
      isLoading: false,
      isAdmin: true,
    });
    mockUseGetAllParticipants.mockReturnValue({
      data: participants,
      isLoading: false,
    });
    mockUseGetAvailableYears.mockReturnValue({
      data: [2024, 2023],
      isLoading: false,
    });
    mockUseGetAllVaquinhaHistory.mockReturnValue(baseQueries);
    mockUseGetVaquinhaHistoryByYear.mockReturnValue(filteredQueries);
    mockUseAddVaquinhaHistory.mockReturnValue(addMutation);
    mockUseUpdateVaquinhaHistory.mockReturnValue(updateMutation);
    mockUseDeleteVaquinhaHistory.mockReturnValue(deleteMutation);
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true)
    );
  });

  it('should render loader when any loading flag is true', () => {
    mockUseUserVerification.mockReturnValue({ isLoading: true });

    const { container } = render(<HistoricoClient />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render error state and retry all history', async () => {
    const refetchAll = vi.fn();
    mockUseGetAllVaquinhaHistory.mockReturnValue({
      ...baseQueries,
      isError: true,
      refetch: refetchAll,
    });

    render(<HistoricoClient />);

    expect(screen.getByText('Erro ao carregar histórico')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Tentar novamente'));
    expect(refetchAll).toHaveBeenCalled();
  });

  it('should render timeline with all history when no year selected', () => {
    render(<HistoricoClient />);

    expect(mockTimeline).toHaveBeenCalled();
    const timelineProps = mockTimeline.mock.calls[0][0] as {
      history: VaquinhaHistory[];
    };
    expect(timelineProps.history).toEqual(history);
  });

  it('should render filtered history when a year is selected', async () => {
    const filtered = [
      {
        ...history[0],
        id: '2',
        year: 2023,
      },
    ];
    mockUseGetVaquinhaHistoryByYear.mockReturnValue({
      ...filteredQueries,
      data: filtered,
    });

    render(<HistoricoClient />);

    await userEvent.click(screen.getByText('Selecionar 2024'));

    const lastCall = mockTimeline.mock.calls.at(-1)?.[0];
    expect(lastCall?.history).toEqual(filtered);
  });

  it('should open dialog when add button is clicked', async () => {
    render(<HistoricoClient />);

    await userEvent.click(screen.getByText('Adicionar Registro'));

    const dialogProps = mockFormDialog.mock.calls.at(-1)?.[0];
    expect(dialogProps?.open).toBe(true);
    expect(dialogProps?.editingItem).toBeNull();
    expect(dialogProps?.participants).toEqual(sortedParticipants);
    expect(dialogProps?.isLoading).toBe(false);
  });

  it('should submit create mutation when dialog submits without editing item', async () => {
    render(<HistoricoClient />);

    await userEvent.click(screen.getByText('Adicionar Registro'));
    await userEvent.click(screen.getByText('Salvar'));

    expect(addMutation.mutateAsync).toHaveBeenCalledWith({
      year: 2024,
      responsibleId: 1,
      responsibleName: 'Maria',
      birthdayPersonId: 2,
      birthdayPersonName: 'Joana',
    });
  });

  it('should submit update mutation when editing item', async () => {
    render(<HistoricoClient />);

    await userEvent.click(screen.getByText('Editar'));
    await userEvent.click(screen.getByText('Salvar'));

    expect(updateMutation.mutateAsync).toHaveBeenCalledWith({
      id: '1',
      data: {
        year: 2024,
        responsibleId: 1,
        responsibleName: 'Maria',
        birthdayPersonId: 2,
        birthdayPersonName: 'Joana',
      },
    });
  });

  it('should close dialog and clear editing item when dialog closes', async () => {
    render(<HistoricoClient />);

    await userEvent.click(screen.getByText('Editar'));

    let dialogProps = mockFormDialog.mock.calls.at(-1)?.[0];
    expect(dialogProps?.open).toBe(true);
    expect(dialogProps?.editingItem).not.toBeNull();

    await userEvent.click(screen.getByText('Fechar'));

    dialogProps = mockFormDialog.mock.calls.at(-1)?.[0];
    expect(dialogProps?.open).toBe(false);
    expect(dialogProps?.editingItem).toBeNull();
  });

  it('should announce error when save fails', async () => {
    addMutation.mutateAsync.mockRejectedValueOnce(new Error('fail'));

    render(<HistoricoClient />);

    await userEvent.click(screen.getByText('Adicionar Registro'));
    await userEvent.click(screen.getByText('Salvar'));

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Erro ao adicionar registro. Tente novamente.'
      );
    });
  });

  it('should delete item when confirm is accepted', async () => {
    render(<HistoricoClient />);

    await userEvent.click(screen.getByText('Excluir'));

    const warningCall = (toast.warning as unknown as Mock).mock.calls[0];
    const options = warningCall[1] as { action: { onClick: () => void } };

    options.action.onClick();

    expect(deleteMutation.mutate).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({})
    );
  });
});
