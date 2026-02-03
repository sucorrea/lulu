import React from 'react';
import { Search, SortAsc, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  months: { value: string; label: string }[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterMonth,
  setFilterMonth,
  months,
}) => {
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
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
            defaultValue="date"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date">Ordenar por data</SelectItem>
                <SelectItem value="name">Ordenar por nome</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filterMonth}
            onValueChange={(value) => setFilterMonth(value)}
            defaultValue="all"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os meses</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
