'use client';
import { useState } from 'react';

import { Filter as FilterIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <div className="mb-4">
        <Button
          onClick={() => setShowFilter((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition"
        >
          <FilterIcon className="w-5 h-5" />
        </Button>
      </div>
      {showFilter && (
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
