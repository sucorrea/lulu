import { HTMLAttributes } from 'react';

import { ColumnDef, Table, flexRender } from '@tanstack/react-table';

import { TableBody, TableCell, TableRow } from '@/components/ui/table';

type DataTableBodyProps<TData> = {
  table: Table<TData>;
  columns: ColumnDef<TData>[];
} & HTMLAttributes<HTMLTableSectionElement>;

const DataTableBody = <TData,>({
  table,
  columns,
  ...props
}: DataTableBodyProps<TData>) => (
  <TableBody {...props}>
    {table.getRowModel().rows.length ? (
      table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          No results.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
);

export default DataTableBody;
