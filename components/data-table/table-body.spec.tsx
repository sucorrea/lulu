import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui/table', () => ({
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody data-testid="table-body-ui">{children}</tbody>
  ),
  TableCell: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <td data-testid="table-cell" className={className}>
      {children}
    </td>
  ),
  TableRow: ({
    children,
    className,
    'data-state': dataState,
  }: {
    children: React.ReactNode;
    className?: string;
    'data-state'?: string;
  }) => (
    <tr data-testid="table-row" className={className} data-state={dataState}>
      {children}
    </tr>
  ),
}));

import TableBody from './table-body';

describe('TableBody', () => {
  const mockColumns = [
    { id: 'id', header: 'ID' },
    { id: 'name', header: 'Name' },
  ];

  const createMockTable = (rows: any[] = []) => ({
    getRowModel: vi.fn(() => ({
      rows: rows.map((row, index) => ({
        id: `row-${index}`,
        index,
        original: row,
        getIsSelected: vi.fn(() => false),
        getVisibleCells: vi.fn(() =>
          mockColumns.map((col, colIndex) => ({
            id: `${index}-${colIndex}`,
            column: { columnDef: { cell: (info: any) => info.getValue() } },
            getValue: vi.fn(() => row[col.id]),
            getContext: vi.fn(() => ({ getValue: () => row[col.id] })),
            renderValue: vi.fn(() => row[col.id]),
          }))
        ),
      })),
    })),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render tbody element', () => {
    const mockTable = createMockTable([]);
    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    expect(screen.getByTestId('table-body-ui')).toBeInTheDocument();
  });

  it('should render rows from table data', () => {
    const mockTable = createMockTable([
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' },
    ]);
    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    const rows = screen.getAllByTestId('table-row');
    expect(rows).toHaveLength(2);
  });

  it('should render "No results" when table is empty', () => {
    const mockTable = createMockTable([]);
    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('should render cells with correct data', () => {
    const mockTable = createMockTable([{ id: '1', name: 'John' }]);
    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    const cells = screen.getAllByTestId('table-cell');
    expect(cells.length).toBeGreaterThanOrEqual(2);
  });

  it('should set selected state when row is selected', () => {
    const mockTable = {
      getRowModel: vi.fn(() => ({
        rows: [
          {
            id: 'row-0',
            index: 0,
            original: { id: '1', name: 'John' },
            getIsSelected: vi.fn(() => true),
            getVisibleCells: vi.fn(() =>
              mockColumns.map((col, i) => ({
                id: `0-${i}`,
                column: { columnDef: { cell: (info: any) => info.getValue() } },
                getValue: vi.fn(() => {
                  const data = { id: '1', name: 'John' };
                  return data[col.id as keyof typeof data];
                }),
                getContext: vi.fn(() => ({
                  getValue: () => {
                    const data = { id: '1', name: 'John' };
                    return data[col.id as keyof typeof data];
                  },
                })),
                renderValue: vi.fn(() => {
                  const data = { id: '1', name: 'John' };
                  return data[col.id as keyof typeof data];
                }),
              }))
            ),
          },
        ],
      })),
    };

    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    const row = screen.getByTestId('table-row');
    expect(row).toHaveAttribute('data-state', 'selected');
  });

  it('should call getRowModel from table', () => {
    const mockTable = createMockTable([{ id: '1', name: 'John' }]);
    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    expect(mockTable.getRowModel).toHaveBeenCalled();
  });

  it('should render many rows', () => {
    const manyRows = Array.from({ length: 50 }, (_, i) => ({
      id: `${i}`,
      name: `Name ${i}`,
    }));
    const mockTable = createMockTable(manyRows);
    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    const rows = screen.getAllByTestId('table-row');
    expect(rows).toHaveLength(50);
  });

  it('should have semantic tbody element', () => {
    const mockTable = createMockTable([{ id: '1', name: 'John' }]);
    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    const tbody = screen.getByTestId('table-body-ui');
    expect(tbody.tagName).toBe('TBODY');
  });

  it('should render all visible cells', () => {
    const mockTable = {
      getRowModel: vi.fn(() => ({
        rows: [
          {
            id: 'row-0',
            index: 0,
            original: { id: '1', name: 'John' },
            getIsSelected: vi.fn(() => false),
            getVisibleCells: vi.fn(() =>
              mockColumns.map((col, i) => ({
                id: `0-${i}`,
                column: { columnDef: { cell: (info: any) => info.getValue() } },
                getValue: vi.fn(() => {
                  const data = { id: '1', name: 'John' };
                  return data[col.id as keyof typeof data];
                }),
                getContext: vi.fn(() => ({
                  getValue: () => {
                    const data = { id: '1', name: 'John' };
                    return data[col.id as keyof typeof data];
                  },
                })),
                renderValue: vi.fn(() => {
                  const data = { id: '1', name: 'John' };
                  return data[col.id as keyof typeof data];
                }),
              }))
            ),
          },
        ],
      })),
    };

    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    const cells = screen.getAllByTestId('table-cell');
    expect(cells.length).toBeGreaterThanOrEqual(2);
  });

  it('should display "No results" in centered cell', () => {
    const mockTable = createMockTable([]);
    render(<TableBody table={mockTable as any} columns={mockColumns as any} />);
    const emptyCell = screen.getByText('No results.');
    expect(emptyCell.closest('td')).toHaveClass('text-center');
  });
});
