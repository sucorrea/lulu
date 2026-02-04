import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DataTableInputFilter from './data-table-input-filter';

interface TestData {
  id: string;
  name: string;
  email: string;
}

vi.mock('@/components/ui/input', () => ({
  Input: ({
    placeholder,
    value,
    onChange,
    className,
  }: {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      data-testid="filter-input"
    />
  ),
}));

describe('DataTableInputFilter', () => {
  let mockTable: {
    getColumn: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockTable = {
      getColumn: vi.fn(() => ({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: vi.fn(),
      })),
    };
  });

  describe('Rendering', () => {
    it('should render input element', () => {
      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      expect(screen.getByTestId('filter-input')).toBeInTheDocument();
    });

    it('should use default placeholder when not provided', () => {
      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      expect(input.placeholder).toBe('Filtrar...');
    });

    it('should use custom placeholder when provided', () => {
      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
          placeholder="Buscar por nome..."
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      expect(input.placeholder).toBe('Buscar por nome...');
    });

    it('should apply custom className', () => {
      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
          className="custom-class"
        />
      );

      const input = screen.getByTestId('filter-input');
      expect(input).toHaveClass('custom-class');
    });

    it('should render with empty value initially', () => {
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: vi.fn(),
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('Filtering Functionality', () => {
    it('should display current filter value', () => {
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue('test value'),
        setFilterValue: vi.fn(),
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      expect(input.value).toBe('test value');
    });

    it('should call setFilterValue when input changes', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(setFilterValueMock).toHaveBeenCalledWith('new value');
    });

    it('should call getColumn with correct columnId', () => {
      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="email"
        />
      );

      expect(mockTable.getColumn).toHaveBeenCalledWith('email');
    });

    it('should handle multiple filter value changes', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });

      expect(setFilterValueMock).toHaveBeenCalledTimes(3);
      expect(setFilterValueMock).toHaveBeenNthCalledWith(1, 'a');
      expect(setFilterValueMock).toHaveBeenNthCalledWith(2, 'ab');
      expect(setFilterValueMock).toHaveBeenNthCalledWith(3, 'abc');
    });

    it('should handle clearing filter value', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue('search term'),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      fireEvent.change(input, { target: { value: '' } });

      expect(setFilterValueMock).toHaveBeenCalledWith('');
    });
  });

  describe('Different Column IDs', () => {
    it('should work with id column', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="id"
        />
      );

      expect(mockTable.getColumn).toHaveBeenCalledWith('id');
    });

    it('should work with name column', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      expect(mockTable.getColumn).toHaveBeenCalledWith('name');
    });

    it('should work with email column', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="email"
        />
      );

      expect(mockTable.getColumn).toHaveBeenCalledWith('email');
    });
  });

  describe('Special Characters and Edge Cases', () => {
    it('should handle special characters in filter value', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      fireEvent.change(input, { target: { value: '@#$%^&*()' } });

      expect(setFilterValueMock).toHaveBeenCalledWith('@#$%^&*()');
    });

    it('should handle whitespace in filter value', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      fireEvent.change(input, { target: { value: '   spaces   ' } });

      expect(setFilterValueMock).toHaveBeenCalledWith('   spaces   ');
    });

    it('should handle long filter values', () => {
      const setFilterValueMock = vi.fn();
      const longValue = 'a'.repeat(1000);
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      fireEvent.change(input, { target: { value: longValue } });

      expect(setFilterValueMock).toHaveBeenCalledWith(longValue);
    });

    it('should handle unicode characters', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue(''),
        setFilterValue: setFilterValueMock,
      });

      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      fireEvent.change(input, { target: { value: '你好世界🎉' } });

      expect(setFilterValueMock).toHaveBeenCalledWith('你好世界🎉');
    });
  });

  describe('Props Validation', () => {
    it('should accept all valid props', () => {
      const setFilterValueMock = vi.fn();
      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue('initial'),
        setFilterValue: setFilterValueMock,
      });

      const { container } = render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
          placeholder="Custom placeholder"
          className="my-custom-class"
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('should handle minimal props', () => {
      render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="id"
        />
      );

      expect(screen.getByTestId('filter-input')).toBeInTheDocument();
    });
  });

  describe('Value Updates', () => {
    it('should update displayed value when filter value changes', () => {
      const setFilterValueMock = vi.fn();
      const { rerender } = render(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      mockTable.getColumn.mockReturnValue({
        getFilterValue: vi.fn().mockReturnValue('updated value'),
        setFilterValue: setFilterValueMock,
      });

      rerender(
        <DataTableInputFilter<TestData>
          table={mockTable as never}
          columnId="name"
        />
      );

      const input = screen.getByTestId(
        'filter-input'
      ) as unknown as HTMLInputElement;
      expect(input.value).toBe('updated value');
    });
  });
});
