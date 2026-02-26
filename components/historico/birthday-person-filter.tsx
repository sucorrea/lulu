'use client';

import { SelectWithOptions } from '@/components/ui/select-with-options';
import { Gift } from 'lucide-react';

interface BirthdayPersonFilterProps {
  persons: string[];
  selectedPerson: string | null;
  onPersonChange: (person: string | null) => void;
}

export const BirthdayPersonFilter = ({
  persons,
  selectedPerson,
  onPersonChange,
}: BirthdayPersonFilterProps) => {
  const options = [
    { value: 'all', label: 'Todas as aniversariantes' },
    ...persons.map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="flex items-center gap-3">
      <Gift className="h-5 w-6 text-muted-foreground" aria-hidden="true" />
      <SelectWithOptions
        value={selectedPerson ?? 'all'}
        onValueChange={(value) =>
          onPersonChange(value === 'all' ? null : value)
        }
        options={options}
        placeholder="Filtrar por aniversariante"
        triggerClassName="w-[220px]"
      />
    </div>
  );
};

export default BirthdayPersonFilter;
