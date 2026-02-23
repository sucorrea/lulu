'use client';
import { memo } from 'react';

import { SelectWithOptions } from '@/components/ui/select-with-options';

type YearSelectorProps = {
  selectedYear: number;
  onChange: (year: number) => void;
};

const generateYearOptions = (): { value: number; label: string }[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear + 1; y <= currentYear + 4; y++) {
    years.push(y);
  }
  return years.map((y) => ({ value: y, label: String(y) }));
};

export const YearSelector = memo(
  ({ selectedYear, onChange }: YearSelectorProps) => {
    const options = generateYearOptions();

    return (
      <div className="flex items-center gap-3">
        <label htmlFor="year-select" className="text-sm font-medium">
          Ano do sorteio:
        </label>
        <SelectWithOptions
          value={selectedYear}
          onValueChange={(val) => onChange(Number(val))}
          options={options}
          triggerId="year-select"
          triggerClassName="w-32"
        />
      </div>
    );
  }
);

YearSelector.displayName = 'YearSelector';

export default YearSelector;
