'use client';
import { memo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type YearSelectorProps = {
  selectedYear: number;
  onChange: (year: number) => void;
};

const generateYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear + 4; y >= currentYear + 1; y--) {
    years.push(y);
  }
  return years.reverse();
};

export const YearSelector = memo(
  ({ selectedYear, onChange }: YearSelectorProps) => {
    const years = generateYearOptions();

    return (
      <div className="flex items-center gap-3">
        <label htmlFor="year-select" className="text-sm font-medium">
          Ano do sorteio:
        </label>
        <Select
          value={String(selectedYear)}
          onValueChange={(val) => onChange(Number(val))}
        >
          <SelectTrigger id="year-select" className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

YearSelector.displayName = 'YearSelector';

export default YearSelector;
