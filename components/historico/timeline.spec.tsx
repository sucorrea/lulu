import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VaquinhaHistoryTimeline } from './timeline';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';

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
    render(<VaquinhaHistoryTimeline history={[]} isAdmin={false} />);
    expect(screen.getByText('Nenhum histórico encontrado')).toBeInTheDocument();
  });

  it('should render history items grouped by year', () => {
    render(<VaquinhaHistoryTimeline history={mockHistory} isAdmin={false} />);
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('should render timeline item header with birthday person and responsible names', () => {
    render(<VaquinhaHistoryTimeline history={mockHistory} isAdmin={false} />);

    expect(screen.getByText('Deborah')).toBeInTheDocument();
    expect(screen.getByText('Stella')).toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('should hide actions when not authenticated', () => {
    render(
      <VaquinhaHistoryTimeline
        history={mockHistory}
        isAdmin={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
  });

  it('should render with edit and delete actions', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <VaquinhaHistoryTimeline
        history={mockHistory}
        isAdmin={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('should call edit and delete handlers', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <VaquinhaHistoryTimeline
        history={mockHistory}
        isAdmin={true}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getAllByRole('button', { name: /editar/i })[0]);
    await user.click(screen.getAllByRole('button', { name: /excluir/i })[0]);

    expect(onEdit).toHaveBeenCalledWith(mockHistory[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should not show action buttons when isAdmin is true but no handlers are provided', () => {
    render(<VaquinhaHistoryTimeline history={mockHistory} isAdmin={true} />);

    expect(
      screen.queryByRole('button', { name: /editar/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /excluir/i })
    ).not.toBeInTheDocument();
  });

  it('should show only edit button when only onEdit is provided', () => {
    render(
      <VaquinhaHistoryTimeline
        history={mockHistory}
        isAdmin={true}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getAllByRole('button', { name: /editar/i })).toHaveLength(2);
    expect(
      screen.queryByRole('button', { name: /excluir/i })
    ).not.toBeInTheDocument();
  });
});
