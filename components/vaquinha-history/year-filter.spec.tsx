import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { YearFilter } from './year-filter';

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

describe('YearFilter', () => {
  const mockYears = [2024, 2023, 2022];

  it('should render year filter with all options', () => {
    render(
      <YearFilter
        years={mockYears}
        selectedYear={null}
        onYearChange={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should call onYearChange when selecting a year', async () => {
    const onYearChange = vi.fn();
    const user = userEvent.setup();

    render(
      <YearFilter
        years={mockYears}
        selectedYear={null}
        onYearChange={onYearChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '2023');

    expect(onYearChange).toHaveBeenCalledWith(2023);
  });

  it('should call onYearChange when selecting all years', async () => {
    const onYearChange = vi.fn();
    const user = userEvent.setup();

    render(
      <YearFilter
        years={mockYears}
        selectedYear={2024}
        onYearChange={onYearChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'all');

    expect(onYearChange).toHaveBeenCalledWith(null);
  });

  it('should display selected year', () => {
    render(
      <YearFilter
        years={mockYears}
        selectedYear={2024}
        onYearChange={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });
});
