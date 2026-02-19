import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { YearSelector } from './year-selector';

vi.mock('@/components/ui/select', () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="select" data-value={value}>
      {children}
      <button
        data-testid="trigger-change"
        onClick={() => onValueChange(String(Number(value) + 1))}
      >
        next year
      </button>
    </div>
  ),

  SelectTrigger: ({
    children,
    id,
  }: {
    children: React.ReactNode;
    id: string;
  }) => (
    <div data-testid="select-trigger" id={id}>
      {children}
    </div>
  ),
  SelectValue: () => <span data-testid="select-value" />,

  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),

  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <div data-testid={`select-item-${value}`} data-value={value}>
      {children}
    </div>
  ),
}));

describe('YearSelector', () => {
  const currentYear = new Date().getFullYear();

  it('renders the label', () => {
    render(<YearSelector selectedYear={currentYear + 1} onChange={vi.fn()} />);
    expect(screen.getByText('Ano do sorteio:')).toBeInTheDocument();
  });

  it('renders the select with the correct selected year value', () => {
    render(<YearSelector selectedYear={currentYear + 2} onChange={vi.fn()} />);
    const select = screen.getByTestId('select');
    expect(select).toHaveAttribute('data-value', String(currentYear + 2));
  });

  it('renders all year options from currentYear+1 to currentYear+4', () => {
    render(<YearSelector selectedYear={currentYear + 1} onChange={vi.fn()} />);
    for (let y = currentYear + 1; y <= currentYear + 4; y++) {
      expect(screen.getByTestId(`select-item-${y}`)).toBeInTheDocument();
      expect(screen.getByText(String(y))).toBeInTheDocument();
    }
  });

  it('generates exactly 4 year options', () => {
    render(<YearSelector selectedYear={currentYear + 1} onChange={vi.fn()} />);
    const items = screen
      .getAllByTestId(/^select-item-/)
      .filter((el) => !el.getAttribute('data-testid')?.includes('trigger'));
    expect(items).toHaveLength(4);
  });

  it('calls onChange with the next year when year changes', () => {
    const onChange = vi.fn();
    render(<YearSelector selectedYear={currentYear + 1} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('trigger-change'));
    expect(onChange).toHaveBeenCalledWith(currentYear + 2);
  });

  it('renders the SelectTrigger with the correct id', () => {
    render(<YearSelector selectedYear={currentYear + 1} onChange={vi.fn()} />);
    expect(screen.getByTestId('select-trigger')).toHaveAttribute(
      'id',
      'year-select'
    );
  });

  it('renders the select-value component', () => {
    render(<YearSelector selectedYear={currentYear + 1} onChange={vi.fn()} />);
    expect(screen.getByTestId('select-value')).toBeInTheDocument();
  });
});
