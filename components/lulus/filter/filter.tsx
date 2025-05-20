'use client';

import { Filter as FilterIcon } from 'lucide-react';

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

  return (
    <>
      <div className="mb-4">
        <Button onClick={onToggle} variant="default">
          <FilterIcon className="w-5 h-5" />
        </Button>
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
