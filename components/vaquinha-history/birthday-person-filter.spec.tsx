import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { BirthdayPersonFilter } from './birthday-person-filter';

vi.mock('@/components/ui/select', () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
  }) => (
    <select
      value={value}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
}));

describe('BirthdayPersonFilter', () => {
  const mockPersons = ['Ana', 'Deborah', 'Stella'];

  it('should render filter with combobox', () => {
    render(
      <BirthdayPersonFilter
        persons={mockPersons}
        selectedPerson={null}
        onPersonChange={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with all options including "Todas as aniversariantes"', () => {
    render(
      <BirthdayPersonFilter
        persons={mockPersons}
        selectedPerson={null}
        onPersonChange={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Todas as aniversariantes' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ana' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Deborah' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Stella' })).toBeInTheDocument();
  });

  it('should call onPersonChange with person name when selecting a person', async () => {
    const onPersonChange = vi.fn();
    const user = userEvent.setup();

    render(
      <BirthdayPersonFilter
        persons={mockPersons}
        selectedPerson={null}
        onPersonChange={onPersonChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Deborah');

    expect(onPersonChange).toHaveBeenCalledWith('Deborah');
  });

  it('should call onPersonChange with null when selecting "Todas as aniversariantes"', async () => {
    const onPersonChange = vi.fn();
    const user = userEvent.setup();

    render(
      <BirthdayPersonFilter
        persons={mockPersons}
        selectedPerson="Deborah"
        onPersonChange={onPersonChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'all');

    expect(onPersonChange).toHaveBeenCalledWith(null);
  });

  it('should display selected person value', () => {
    render(
      <BirthdayPersonFilter
        persons={mockPersons}
        selectedPerson="Stella"
        onPersonChange={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('Stella');
  });

  it('should display "all" when selectedPerson is null', () => {
    render(
      <BirthdayPersonFilter
        persons={mockPersons}
        selectedPerson={null}
        onPersonChange={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('all');
  });

  it('should render Gift icon', () => {
    const { container } = render(
      <BirthdayPersonFilter
        persons={mockPersons}
        selectedPerson={null}
        onPersonChange={vi.fn()}
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render only "Todas as aniversariantes" when persons array is empty', () => {
    render(
      <BirthdayPersonFilter
        persons={[]}
        selectedPerson={null}
        onPersonChange={vi.fn()}
      />
    );

    expect(screen.getByRole('option', { name: 'Todas as aniversariantes' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });
});
