import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui/table', () => ({
  TableHead: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <th data-testid="table-head" className={className}>
      {children}
    </th>
  ),
  TableHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <thead data-testid="table-header-ui" className={className}>
      {children}
    </thead>
  ),
  TableRow: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <tr data-testid="table-row" className={className}>
      {children}
    </tr>
  ),
}));

import TableHeader from './table-header';

describe('TableHeader', () => {
  const mockColumns = [
    { id: 'id', header: 'ID' },
    { id: 'name', header: 'Name' },
    { id: 'email', header: 'Email' },
  ];

  const createMockTable = (columns = mockColumns) => ({
    getHeaderGroups: vi.fn(() => [
      {
        id: 'header-group-0',
        headers: columns.map((col, i) => ({
          id: `${i}`,
          column: {
            columnDef: { header: col.header },
          },
          index: i,
          isPlaceholder: false,
          getContext: vi.fn(() => ({
            column: col,
            header: col.header,
          })),
          renderValue: vi.fn(() => col.header),
          colSpan: 1,
          getLeafColumns: vi.fn(() => [col]),
        })),
      },
    ]),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render thead element', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} />);
    expect(screen.getByTestId('table-header-ui')).toBeInTheDocument();
  });

  it('should render header row', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} />);
    const rows = screen.getAllByTestId('table-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should render header cells', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} />);
    const heads = screen.getAllByTestId('table-head');
    expect(heads.length).toBeGreaterThanOrEqual(3);
  });

  it('should render header text', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should skip placeholder headers', () => {
    const mockTable = {
      getHeaderGroups: vi.fn(() => [
        {
          id: 'header-group-0',
          headers: [
            {
              id: '0',
              column: { columnDef: { header: 'ID' } },
              index: 0,
              isPlaceholder: false,
              getContext: vi.fn(),
              renderValue: vi.fn(() => 'ID'),
              colSpan: 1,
              getLeafColumns: vi.fn(),
            },
            {
              id: '1',
              column: { columnDef: { header: undefined } },
              index: 1,
              isPlaceholder: true,
              getContext: vi.fn(),
              renderValue: vi.fn(),
              colSpan: 1,
              getLeafColumns: vi.fn(),
            },
          ],
        },
      ]),
    };

    render(<TableHeader table={mockTable as never} />);
    const heads = screen.getAllByTestId('table-head');

    expect(heads.length).toBe(2);
    expect(screen.getByText('ID')).toBeInTheDocument();
  });

  it('should render single header column', () => {
    const singleColumn = [{ id: 'id', header: 'ID' }];
    const mockTable = createMockTable(singleColumn);
    render(<TableHeader table={mockTable as never} />);
    const heads = screen.getAllByTestId('table-head');
    expect(heads.length).toBe(1);
  });

  it('should apply className to table header', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} className="custom-class" />);
    const header = screen.getByTestId('table-header-ui');
    expect(header).toHaveClass('custom-class');
  });

  it('should call getHeaderGroups from table', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} />);
    expect(mockTable.getHeaderGroups).toHaveBeenCalled();
  });

  it('should have semantic thead element', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} />);
    const thead = screen.getByTestId('table-header-ui');
    expect(thead.tagName).toBe('THEAD');
  });

  it('should render header with colSpan', () => {
    const mockTable = {
      getHeaderGroups: vi.fn(() => [
        {
          id: 'header-group-0',
          headers: [
            {
              id: '0',
              column: { columnDef: { header: 'ID' } },
              index: 0,
              isPlaceholder: false,
              getContext: vi.fn(),
              renderValue: vi.fn(() => 'ID'),
              colSpan: 2,
              getLeafColumns: vi.fn(),
            },
          ],
        },
      ]),
    };

    render(<TableHeader table={mockTable as never} />);
    const head = screen.getByTestId('table-head');

    expect(head).toBeInTheDocument();
  });

  it('should render multiple header columns', () => {
    const mockTable = createMockTable(mockColumns);
    render(<TableHeader table={mockTable as never} />);
    const heads = screen.getAllByTestId('table-head');
    expect(heads.length).toBe(mockColumns.length);
  });

  it('should handle special characters in headers', () => {
    const specialColumns = [
      { id: 'id', header: 'User <ID>' },
      { id: 'name', header: '"Full Name"' },
    ];
    const mockTable = createMockTable(specialColumns);
    render(<TableHeader table={mockTable as never} />);
    expect(screen.getByText('User <ID>')).toBeInTheDocument();
    expect(screen.getByText('"Full Name"')).toBeInTheDocument();
  });

  it('should render th elements for headers', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} />);
    const heads = screen.getAllByTestId('table-head');
    heads.forEach((head) => {
      expect(head.tagName).toBe('TH');
    });
  });

  it('should render tr elements for header groups', () => {
    const mockTable = createMockTable();
    render(<TableHeader table={mockTable as never} />);
    const rows = screen.getAllByTestId('table-row');
    rows.forEach((row) => {
      expect(row.tagName).toBe('TR');
    });
  });

  it('should handle many columns', () => {
    const manyColumns = Array.from({ length: 20 }, (_, i) => ({
      id: `col${i}`,
      header: `Column ${i}`,
    }));

    const mockTable = {
      getHeaderGroups: vi.fn(() => [
        {
          id: 'header-group-0',
          headers: manyColumns.map((col, i) => ({
            id: `${i}`,
            column: { columnDef: { header: col.header } },
            index: i,
            isPlaceholder: false,
            getContext: vi.fn(),
            renderValue: vi.fn(() => col.header),
            colSpan: 1,
            getLeafColumns: vi.fn(),
          })),
        },
      ]),
    };

    render(<TableHeader table={mockTable as never} />);
    const heads = screen.getAllByTestId('table-head');
    expect(heads.length).toBe(20);
  });
});
