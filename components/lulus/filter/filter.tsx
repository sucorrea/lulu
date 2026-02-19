'use client';

import { Filter as FilterIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GenericBottomSheet } from '@/components/dialog/bottom-sheet';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useIsMobile } from '@/providers/device-provider';

import { meses } from '../utils';
import FilterBar from './filter-component';

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
  const { isOpen, onToggle, setOpen } = useDisclosure();
  const { isMobile } = useIsMobile();

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

  const filterBarContent = (
    <FilterBar
      filterMonth={filterMonth}
      months={meses}
      searchTerm={searchTerm}
      setFilterMonth={setFilterMonth}
      setSearchTerm={setSearchTerm}
      setSortBy={setSortBy}
      sortBy={sortBy}
    />
  );

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={onToggle}
            variant="outline"
            className="gap-2 relative"
            aria-label="Abrir filtros"
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

      {isMobile ? (
        <GenericBottomSheet
          open={isOpen}
          onOpenChange={setOpen}
          title="Filtros"
          description="Busque, ordene e filtre as participantes"
        >
          {filterBarContent}
        </GenericBottomSheet>
      ) : (
        isOpen && filterBarContent
      )}
    </>
  );
};

export default Filter;
