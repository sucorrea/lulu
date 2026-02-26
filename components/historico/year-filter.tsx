'use client';

import { SelectWithOptions } from '@/components/ui/select-with-options';
import { Calendar } from 'lucide-react';

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

export const YearFilter = ({
  years,
  selectedYear,
  onYearChange,
}: YearFilterProps) => {
  const options = [
    { value: 'all', label: 'Todos os anos' },
    ...years.map((y) => ({ value: String(y), label: String(y) })),
  ];

  return (
    <div className="flex items-center gap-3">
      <Calendar className="h-5 w-5 text-muted-foreground" />
      <SelectWithOptions
        value={selectedYear?.toString() ?? 'all'}
        onValueChange={(value) =>
          onYearChange(value === 'all' ? null : Number.parseInt(value))
        }
        options={options}
        placeholder="Filtrar por ano"
        triggerClassName="w-[180px]"
      />
    </div>
  );
};

export default YearFilter;
