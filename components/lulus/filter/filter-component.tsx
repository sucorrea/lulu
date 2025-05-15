import React from 'react';
import { Search, SortAsc, Filter } from 'lucide-react';

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
    <div className="bg-white/80 backdrop-blur rounded-lg p-4 mb-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-400" />
          <select
            className="w-full p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Ordenar por data</option>
            <option value="name">Ordenar por nome</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="w-full p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-600"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="all">Todos os meses</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
