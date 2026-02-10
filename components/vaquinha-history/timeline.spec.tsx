import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VaquinhaHistoryTimeline } from './timeline';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';

const mockUseUserVerification = vi.fn();

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: () => mockUseUserVerification(),
}));

describe('VaquinhaHistoryTimeline', () => {
  const mockHistory: VaquinhaHistory[] = [
    {
      id: '1',
      year: 2024,
      responsibleId: 1,
      responsibleName: 'Stella',
      birthdayPersonId: 2,
      birthdayPersonName: 'Deborah',
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: '2',
      year: 2023,
      responsibleId: 3,
      responsibleName: 'Maria',
      birthdayPersonId: 4,
      birthdayPersonName: 'João',
      createdAt: new Date('2023-06-20').toISOString(),
    },
  ];

  it('should render empty state when no history', () => {
    mockUseUserVerification.mockReturnValue({ user: null });
    render(<VaquinhaHistoryTimeline history={[]} />);
    expect(screen.getByText('Nenhum histórico encontrado')).toBeInTheDocument();
  });

  it('should render history items grouped by year', () => {
    mockUseUserVerification.mockReturnValue({ user: null });
    render(<VaquinhaHistoryTimeline history={mockHistory} />);
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('should display responsible and birthday person names', () => {
    mockUseUserVerification.mockReturnValue({ user: null });
    render(<VaquinhaHistoryTimeline history={mockHistory} />);
    expect(screen.getByText('Deborah')).toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(
      screen.getByText(/Stella foi responsável pela vaquinha/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Maria foi responsável pela vaquinha/i)
    ).toBeInTheDocument();
  });

  it('should hide actions when not authenticated', () => {
    mockUseUserVerification.mockReturnValue({ user: null });
    render(
      <VaquinhaHistoryTimeline
        history={mockHistory}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
  });

  it('should render with edit and delete actions', () => {
    mockUseUserVerification.mockReturnValue({ user: { uid: '1' } });
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <VaquinhaHistoryTimeline
        history={mockHistory}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('should call edit and delete handlers', async () => {
    mockUseUserVerification.mockReturnValue({ user: { uid: '1' } });
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <VaquinhaHistoryTimeline
        history={mockHistory}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getAllByText('Editar')[0]);
    await user.click(screen.getAllByText('Excluir')[0]);

    expect(onEdit).toHaveBeenCalledWith(mockHistory[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
