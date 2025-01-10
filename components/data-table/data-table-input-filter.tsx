import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';

export type DataTableInputFilterProps<TData> = {
  table: Table<TData>;
  columnId: keyof TData & string; // ID da coluna que será filtrada
  placeholder?: string;
  className?: string;
};

const DataTableInputFilter = <TData,>({
  table,
  columnId,
  placeholder = 'Filtrar...',
  className,
}: DataTableInputFilterProps<TData>) => {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn(columnId)?.setFilterValue(event.target.value)
      }
      className={className}
    />
  );
};

export default DataTableInputFilter;
