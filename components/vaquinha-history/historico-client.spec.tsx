import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { HistoricoClient } from './historico-client';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';

const mockUseUserVerification = vi.fn();
const mockUseGetAllParticipants = vi.fn();
const mockUseGetAvailableYears = vi.fn();
const mockUseGetAllVaquinhaHistory = vi.fn();
const mockUseGetVaquinhaHistoryByYear = vi.fn();
const mockUseAddVaquinhaHistory = vi.fn();
const mockUseUpdateVaquinhaHistory = vi.fn();
const mockUseDeleteVaquinhaHistory = vi.fn();

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

vi.mock('@/components/vaquinha-history', () => ({
  VaquinhaHistoryTimeline: (props: {
    history: VaquinhaHistory[];
    onEdit?: (item: VaquinhaHistory) => void;
    onDelete?: (id: string) => void;
  }) => mockTimeline(props),
  TimelineSkeleton: () => <div data-testid="timeline-skeleton">Loading...</div>,
  YearFilter: (props: {
    years: number[];
    selectedYear: number | null;
    onYearChange: (year: number | null) => void;
  }) => mockYearFilter(props),
  VaquinhaHistoryFormDialog: (props: {
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
  const deleteMutation = { mutateAsync: vi.fn(), isPending: false };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserVerification.mockReturnValue({ isLoading: false });
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

    // Check for skeleton loading state (Skeleton components will have animate-pulse class)
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

    expect(
      await screen.findByText('Erro ao salvar registro. Tente novamente.')
    ).toBeInTheDocument();
  });

  it('should delete item when confirm is accepted', async () => {
    render(<HistoricoClient />);

    await userEvent.click(screen.getByText('Excluir'));

    expect(deleteMutation.mutateAsync).toHaveBeenCalledWith('1');
  });
});
