import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { VaquinhaHistoryFormDialog } from './form-dialog';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';
import { Person } from '../lulus/types';

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

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

describe('VaquinhaHistoryFormDialog', () => {
  const participants = [
    { id: 1, name: 'Maria' },
    { id: 2, name: 'Joana' },
  ] as Person[];

  const editingItem: VaquinhaHistory = {
    id: '1',
    year: 2023,
    responsibleId: 1,
    responsibleName: 'Maria',
    birthdayPersonId: 2,
    birthdayPersonName: 'Joana',
    createdAt: new Date('2023-01-10').toISOString(),
  };

  it('should render add state by default', () => {
    render(
      <VaquinhaHistoryFormDialog
        open
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        participants={participants}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Adicionar' })
    ).toBeInTheDocument();
  });

  it('should render update label when editing item', () => {
    render(
      <VaquinhaHistoryFormDialog
        open
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        participants={participants}
        editingItem={editingItem}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Atualizar' })
    ).toBeInTheDocument();
  });

  it('should render loading label when saving', () => {
    render(
      <VaquinhaHistoryFormDialog
        open
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        participants={participants}
        isLoading
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Salvando...' });
    expect(submitButton).toBeDisabled();
  });

  it('should submit with selected participant names', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <VaquinhaHistoryFormDialog
        open
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
        participants={participants}
      />
    );

    const yearInput = screen.getByLabelText('Ano');
    await user.clear(yearInput);
    await user.type(yearInput, '2025');

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], '2');
    await user.selectOptions(selects[1], '1');

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      year: 2025,
      responsibleId: 1,
      responsibleName: 'Maria',
      birthdayPersonId: 2,
      birthdayPersonName: 'Joana',
    });
  });

  it('should reset form when editing item changes', async () => {
    const currentYear = new Date().getFullYear();

    const { rerender } = render(
      <VaquinhaHistoryFormDialog
        open
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        participants={participants}
        editingItem={editingItem}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Ano')).toHaveValue(2023);
    });

    rerender(
      <VaquinhaHistoryFormDialog
        open
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        participants={participants}
        editingItem={null}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Ano')).toHaveValue(currentYear);
    });
  });
});
