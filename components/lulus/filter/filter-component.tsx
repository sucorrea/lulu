import React, { FC } from 'react';
import { Search, SortAsc, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SelectWithOptions } from '@/components/ui/select-with-options';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  months: { value: string; label: string }[];
}

const SORT_OPTIONS = [
  { value: 'date', label: 'Ordenar por data' },
  { value: 'name', label: 'Ordenar por nome' },
] as const;

const FilterBar: FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterMonth,
  setFilterMonth,
  months,
}) => {
  const monthOptions = [{ value: 'all', label: 'Todos os meses' }, ...months];

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card/90 p-4 shadow-lulu-sm backdrop-blur">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <SelectWithOptions
            value={sortBy}
            onValueChange={setSortBy}
            options={SORT_OPTIONS}
            placeholder="Selecione uma opção"
            triggerClassName="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <SelectWithOptions
            value={filterMonth}
            onValueChange={setFilterMonth}
            options={monthOptions}
            placeholder="Selecione uma opção"
            triggerClassName="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
