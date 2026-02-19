import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import type { Person } from '@/components/lulus/types';
import { ParticipantSelection } from './participant-selection';

vi.mock('../lulus/utils', () => ({
  formatDate: () => '01/01',
}));

const makePerson = (overrides: Partial<Person> = {}): Person => ({
  id: 1,
  name: 'Ana',
  fullName: 'Ana Silva',
  date: '2000-05-01',
  month: '5',
  city: 'SP',
  ...overrides,
});

const mockParticipants: Person[] = [
  makePerson({
    id: 1,
    name: 'Carlos',
    fullName: 'Carlos Costa',
    date: '2000-06-15',
  }),
  makePerson({ id: 2, name: 'Ana', fullName: 'Ana Silva', date: '2000-03-10' }),
  makePerson({ id: 3, name: 'Bia', fullName: 'Bia Souza', date: '2000-09-20' }),
];

describe('ParticipantSelection', () => {
  const defaultProps = {
    participants: mockParticipants,
    selectedIds: new Set<number>(),
    onToggle: vi.fn(),
    onSelectAll: vi.fn(),
    onClearSelection: vi.fn(),
  };

  it('renders the participant count correctly', () => {
    render(
      <ParticipantSelection {...defaultProps} selectedIds={new Set([1])} />
    );
    expect(
      screen.getByText('1 de 3 participantes selecionadas')
    ).toBeInTheDocument();
  });

  it('renders 0 selected when no participants selected', () => {
    render(<ParticipantSelection {...defaultProps} />);
    expect(
      screen.getByText('0 de 3 participantes selecionadas')
    ).toBeInTheDocument();
  });

  it('renders all participant names', () => {
    render(<ParticipantSelection {...defaultProps} />);
    expect(screen.getByText('Ana Silva')).toBeInTheDocument();
    expect(screen.getByText('Carlos Costa')).toBeInTheDocument();
    expect(screen.getByText('Bia Souza')).toBeInTheDocument();
  });

  it('uses participant.name when fullName is not set', () => {
    const personWithoutFullName = makePerson({
      id: 4,
      name: 'Duda',
      fullName: '',
      date: '2000-01-01',
      month: '1',
      city: 'BH',
    });
    render(
      <ParticipantSelection
        {...defaultProps}
        participants={[personWithoutFullName]}
      />
    );
    expect(screen.getByText('Duda')).toBeInTheDocument();
  });

  it('calls onToggle with participant id when checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(<ParticipantSelection {...defaultProps} onToggle={onToggle} />);
    const checkbox = screen.getByRole('checkbox', {
      name: /Selecionar Ana Silva/,
    });
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(2);
  });

  it('renders checkmark icon when participant is selected', () => {
    const { container } = render(
      <ParticipantSelection {...defaultProps} selectedIds={new Set([1])} />
    );
    const labels = container.querySelectorAll('label[data-selected="true"]');
    expect(labels).toHaveLength(1);
  });

  it('sets data-selected=false for unselected participants', () => {
    const { container } = render(<ParticipantSelection {...defaultProps} />);
    const labels = container.querySelectorAll('label[data-selected="false"]');
    expect(labels).toHaveLength(3);
  });

  it('calls onSelectAll when "Selecionar Todas" is clicked', () => {
    const onSelectAll = vi.fn();
    render(
      <ParticipantSelection {...defaultProps} onSelectAll={onSelectAll} />
    );
    fireEvent.click(screen.getByRole('button', { name: /Selecionar Todas/ }));
    expect(onSelectAll).toHaveBeenCalledTimes(1);
  });

  it('"Selecionar Todas" is disabled when all participants are selected', () => {
    render(
      <ParticipantSelection
        {...defaultProps}
        selectedIds={new Set([1, 2, 3])}
      />
    );
    expect(
      screen.getByRole('button', { name: /Selecionar Todas/ })
    ).toBeDisabled();
  });

  it('"Selecionar Todas" is enabled when not all are selected', () => {
    render(
      <ParticipantSelection {...defaultProps} selectedIds={new Set([1])} />
    );
    expect(
      screen.getByRole('button', { name: /Selecionar Todas/ })
    ).not.toBeDisabled();
  });

  it('calls onClearSelection when "Limpar Seleção" is clicked', () => {
    const onClearSelection = vi.fn();
    render(
      <ParticipantSelection
        {...defaultProps}
        selectedIds={new Set([1])}
        onClearSelection={onClearSelection}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Limpar Seleção/ }));
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it('"Limpar Seleção" is disabled when nothing is selected', () => {
    render(<ParticipantSelection {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /Limpar Seleção/ })
    ).toBeDisabled();
  });

  it('"Limpar Seleção" is enabled when some participants are selected', () => {
    render(
      <ParticipantSelection {...defaultProps} selectedIds={new Set([2])} />
    );
    expect(
      screen.getByRole('button', { name: /Limpar Seleção/ })
    ).not.toBeDisabled();
  });

  it('shows empty state when participants array is empty', () => {
    render(<ParticipantSelection {...defaultProps} participants={[]} />);
    expect(
      screen.getByText('Nenhuma participante encontrada.')
    ).toBeInTheDocument();
  });

  it('does not show empty state when participants exist', () => {
    render(<ParticipantSelection {...defaultProps} />);
    expect(
      screen.queryByText('Nenhuma participante encontrada.')
    ).not.toBeInTheDocument();
  });

  it('renders participants sorted by date ascending', () => {
    render(<ParticipantSelection {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    const labels = checkboxes.map((cb) => cb.getAttribute('aria-label') ?? '');
    expect(labels[0]).toContain('Ana Silva');
    expect(labels[1]).toContain('Carlos Costa');
    expect(labels[2]).toContain('Bia Souza');
  });

  it('sets the checkbox checked state correctly for selected participant', () => {
    render(
      <ParticipantSelection {...defaultProps} selectedIds={new Set([2])} />
    );
    const checkbox = screen.getByRole('checkbox', {
      name: /Selecionar Ana Silva/,
    });
    expect(checkbox).toBeChecked();
  });

  it('sets the checkbox unchecked state for unselected participant', () => {
    render(<ParticipantSelection {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox', {
      name: /Selecionar Ana Silva/,
    });
    expect(checkbox).not.toBeChecked();
  });
});
