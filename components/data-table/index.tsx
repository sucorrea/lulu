'use client';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { useState } from 'react';
import { Table as TableUi } from '../ui/table';
import DataTableInputFilter from './data-table-input-filter';
import DataTableBody from './table-body';
import DataTableHeader from './table-header';

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  hasFilter?: boolean;
  columnIdFilter?: keyof TData & string;
  rows: TData[];
};

const DataTable = <TData,>({
  rows,
  columns,
  hasFilter = true,
  columnIdFilter = 'id' as keyof TData & string,
}: DataTableProps<TData>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: rows,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="rounded-md border">
      <div className="flex w-full">
        <div className="flex items-center py-4">
          <div>
            <div className="flex items-center gap-3 p-2">
              {hasFilter && (
                <DataTableInputFilter table={table} columnId={columnIdFilter} />
              )}
            </div>
            <TableUi>
              <DataTableHeader table={table} className="bg-amber-100" />
              <DataTableBody table={table} columns={columns} />
            </TableUi>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
