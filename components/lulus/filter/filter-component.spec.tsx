import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FilterBar from './filter-component';

vi.mock('@/components/ui/input', () => ({
  Input: ({
    value,
    onChange,
    placeholder,
    className,
  }: {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    placeholder: string;
    className: string;
  }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <div
      data-testid="select"
      data-value={value}
      onClick={() => onValueChange('test')}
    >
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="select-trigger">{children}</button>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-group">{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`select-item-${value}`}>{children}</div>,
}));

describe('FilterBar', () => {
  const mockMonths = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
  ];

  const defaultProps = {
    searchTerm: '',
    setSearchTerm: vi.fn(),
    sortBy: 'date',
    setSortBy: vi.fn(),
    filterMonth: 'all',
    setFilterMonth: vi.fn(),
    months: mockMonths,
  };

  it('should render search input', () => {
    render(<FilterBar {...defaultProps} />);
    const input = screen.getByTestId('search-input');
    expect(input).toBeDefined();
  });

  it('should render search input with correct placeholder', () => {
    render(<FilterBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Buscar por nome...');
    expect(input).toBeDefined();
  });

  it('should render sort select', () => {
    render(<FilterBar {...defaultProps} />);
    const selects = screen.getAllByTestId('select');
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it('should render filter month select', () => {
    render(<FilterBar {...defaultProps} />);
    const selects = screen.getAllByTestId('select');
    expect(selects.length).toBe(2);
  });

  it('should render search icon', () => {
    const { container } = render(<FilterBar {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('should pass searchTerm to input', () => {
    render(<FilterBar {...defaultProps} searchTerm="test search" />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    expect(input.value).toBe('test search');
  });

  it('should render all months in filter', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByTestId('select-item-01')).toBeDefined();
    expect(screen.getByTestId('select-item-02')).toBeDefined();
  });

  it('should render todos os meses option', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByTestId('select-item-all')).toBeDefined();
  });

  it('should have correct grid layout classes', () => {
    const { container } = render(<FilterBar {...defaultProps} />);
    const gridDiv = container.querySelector('.grid');
    expect(gridDiv).toBeDefined();
    expect(gridDiv?.className).toContain('grid-cols-1');
    expect(gridDiv?.className).toContain('md:grid-cols-3');
  });

  it('should render card with shadow', () => {
    const { container } = render(<FilterBar {...defaultProps} />);
    const card = container.querySelector('.shadow-lulu-sm');
    expect(card).toBeDefined();
  });

  it('should render with backdrop blur', () => {
    const { container } = render(<FilterBar {...defaultProps} />);
    const backdrop = container.querySelector('.backdrop-blur');
    expect(backdrop).toBeDefined();
  });

  it('should render sort options', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByTestId('select-item-date')).toBeDefined();
    expect(screen.getByTestId('select-item-name')).toBeDefined();
  });

  it('should have correct default sortBy value', () => {
    render(<FilterBar {...defaultProps} />);
    const selects = screen.getAllByTestId('select');
    expect(selects[0].getAttribute('data-value')).toBe('date');
  });

  it('should have correct default filterMonth value', () => {
    render(<FilterBar {...defaultProps} />);
    const selects = screen.getAllByTestId('select');
    expect(selects[1].getAttribute('data-value')).toBe('all');
  });
});
