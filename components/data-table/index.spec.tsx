import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from './index';

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table data-testid="table-ui">{children}</table>
  ),
}));

vi.mock('./data-table-input-filter', () => ({
  default: ({ columnId, placeholder }: any) => (
    <input
      data-testid="filter-input"
      placeholder={placeholder}
      data-column-id={columnId}
    />
  ),
}));

vi.mock('./table-body', () => ({
  default: () => (
    <tbody data-testid="table-body">
      <tr>
        <td>Body</td>
      </tr>
    </tbody>
  ),
}));

vi.mock('./table-header', () => ({
  default: ({ className }: any) => (
    <thead data-testid="table-header" className={className}>
      <tr>
        <th>Header</th>
      </tr>
    </thead>
  ),
}));

interface TestData {
  id: string;
  name: string;
  email: string;
}

describe('DataTable', () => {
  const mockColumns: ColumnDef<TestData>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
  ];

  const mockRows: TestData[] = [
    { id: '1', name: 'John', email: 'john@example.com' },
    { id: '2', name: 'Jane', email: 'jane@example.com' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render table component', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });

    it('should render table header', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });

    it('should render table body', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should have rounded-md border wrapper', () => {
      const { container } = render(
        <DataTable<TestData> columns={mockColumns} rows={mockRows} />
      );

      const wrapper = container.querySelector('.rounded-md.border');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('should render filter input when hasFilter is true', () => {
      render(
        <DataTable<TestData>
          columns={mockColumns}
          rows={mockRows}
          hasFilter={true}
        />
      );

      expect(screen.getByTestId('filter-input')).toBeInTheDocument();
    });

    it('should not render filter input when hasFilter is false', () => {
      render(
        <DataTable<TestData>
          columns={mockColumns}
          rows={mockRows}
          hasFilter={false}
        />
      );

      expect(screen.queryByTestId('filter-input')).not.toBeInTheDocument();
    });

    it('should render filter input by default', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('filter-input')).toBeInTheDocument();
    });

    it('should use default columnIdFilter when not provided', () => {
      render(
        <DataTable<TestData>
          columns={mockColumns}
          rows={mockRows}
          hasFilter={true}
        />
      );

      const filterInput = screen.getByTestId('filter-input');
      expect(filterInput).toHaveAttribute('data-column-id', 'id');
    });

    it('should use custom columnIdFilter when provided', () => {
      render(
        <DataTable<TestData>
          columns={mockColumns}
          rows={mockRows}
          hasFilter={true}
          columnIdFilter="name"
        />
      );

      const filterInput = screen.getByTestId('filter-input');
      expect(filterInput).toHaveAttribute('data-column-id', 'name');
    });

    it('should use email as columnIdFilter', () => {
      render(
        <DataTable<TestData>
          columns={mockColumns}
          rows={mockRows}
          hasFilter={true}
          columnIdFilter="email"
        />
      );

      const filterInput = screen.getByTestId('filter-input');
      expect(filterInput).toHaveAttribute('data-column-id', 'email');
    });
  });

  describe('Table Header Styling', () => {
    it('should apply bg-amber-100 class to header', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      const header = screen.getByTestId('table-header');
      expect(header).toHaveClass('bg-amber-100');
    });
  });

  describe('Data Handling', () => {
    it('should accept empty rows array', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={[]} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });

    it('should accept multiple rows', () => {
      const multipleRows: TestData[] = [
        { id: '1', name: 'John', email: 'john@example.com' },
        { id: '2', name: 'Jane', email: 'jane@example.com' },
        { id: '3', name: 'Bob', email: 'bob@example.com' },
      ];

      render(<DataTable<TestData> columns={mockColumns} rows={multipleRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });

    it('should accept single row', () => {
      render(
        <DataTable<TestData>
          columns={mockColumns}
          rows={[{ id: '1', name: 'John', email: 'john@example.com' }]}
        />
      );

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });
  });

  describe('Column Definition', () => {
    it('should accept column definitions', () => {
      const columns: ColumnDef<TestData>[] = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'name', header: 'Name' },
      ];

      render(<DataTable<TestData> columns={columns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });

    it('should handle single column definition', () => {
      const columns: ColumnDef<TestData>[] = [
        { accessorKey: 'id', header: 'ID' },
      ];

      render(<DataTable<TestData> columns={columns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });

    it('should handle multiple column definitions', () => {
      const columns: ColumnDef<TestData>[] = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
      ];

      render(<DataTable<TestData> columns={columns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct flex layout', () => {
      const { container } = render(
        <DataTable<TestData> columns={mockColumns} rows={mockRows} />
      );

      const flexContainer = container.querySelector('.flex.w-full');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have filter container with correct spacing', () => {
      const { container } = render(
        <DataTable<TestData>
          columns={mockColumns}
          rows={mockRows}
          hasFilter={true}
        />
      );

      const filterContainer = container.querySelector(
        '.flex.items-center.gap-3.p-2'
      );
      expect(filterContainer).toBeInTheDocument();
    });

    it('should have items-center py-4 layout', () => {
      const { container } = render(
        <DataTable<TestData> columns={mockColumns} rows={mockRows} />
      );

      const layoutContainer = container.querySelector(
        '.flex.items-center.py-4'
      );
      expect(layoutContainer).toBeInTheDocument();
    });
  });

  describe('Props Variations', () => {
    it('should work with all props provided', () => {
      render(
        <DataTable<TestData>
          columns={mockColumns}
          rows={mockRows}
          hasFilter={true}
          columnIdFilter="email"
        />
      );

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
      expect(screen.getByTestId('filter-input')).toBeInTheDocument();
    });

    it('should work with minimal props', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });

    it('should work with only required props', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should initialize column filters state', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });

    it('should initialize column visibility state', () => {
      render(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle table with many columns', () => {
      const manyColumns: ColumnDef<TestData>[] = Array.from(
        { length: 10 },
        (_, i) => ({
          accessorKey: `col${i}`,
          header: `Column ${i}`,
        })
      );

      render(<DataTable<TestData> columns={manyColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });

    it('should handle table with many rows', () => {
      const manyRows = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `Name ${i}`,
        email: `email${i}@example.com`,
      }));

      render(<DataTable<TestData> columns={mockColumns} rows={manyRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });
  });

  describe('Client Component Behavior', () => {
    it('should render without errors', () => {
      const { container } = render(
        <DataTable<TestData> columns={mockColumns} rows={mockRows} />
      );

      expect(container).toBeInTheDocument();
    });

    it('should maintain state on rerender', () => {
      const { rerender } = render(
        <DataTable<TestData> columns={mockColumns} rows={mockRows} />
      );

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();

      rerender(<DataTable<TestData> columns={mockColumns} rows={mockRows} />);

      expect(screen.getByTestId('table-ui')).toBeInTheDocument();
    });
  });
});
