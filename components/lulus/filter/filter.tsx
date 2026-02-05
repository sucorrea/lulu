'use client';

import { Filter as FilterIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { meses } from '../utils';
import FilterBar from './filter-component';
import { useDisclosure } from '@/hooks/use-disclosure';

interface FilterProps {
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const Filter = ({
  filterMonth,
  setFilterMonth,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}: FilterProps) => {
  const { isOpen, onToggle } = useDisclosure();

  const activeFiltersCount = [
    searchTerm,
    filterMonth !== 'all',
    sortBy !== 'date',
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterMonth('all');
    setSortBy('date');
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={onToggle}
            variant="outline"
            className="gap-2 relative"
          >
            <FilterIcon className="h-4 w-4" />
            <span className="text-sm font-semibold">Filtros</span>
            {activeFiltersCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              onClick={handleClearFilters}
              variant="ghost"
              size="sm"
              className="text-sm"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
      {isOpen && (
        <FilterBar
          filterMonth={filterMonth}
          months={meses}
          searchTerm={searchTerm}
          setFilterMonth={setFilterMonth}
          setSearchTerm={setSearchTerm}
          setSortBy={setSortBy}
          sortBy={sortBy}
        />
      )}
    </>
  );
};

export default Filter;
