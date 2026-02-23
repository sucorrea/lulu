'use client';

import { memo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Calendar, Filter, Search } from 'lucide-react';

import { Person } from '@/components/lulus/types';
import { Input } from '@/components/ui/input';
import { SelectWithOptions } from '@/components/ui/select-with-options';
import { fetchParticipants } from '@/services/queries/fetchParticipants';

import { ALL_PARTICIPANTS_VALUE, LIMIT_OPTIONS } from '../constants';
import { AuditFiltersProps } from '../types';

const AuditFiltersComponent = ({
  selectedParticipant,
  limitCount,
  searchTerm,
  onParticipantChange,
  onLimitChange,
  onSearchChange,
  isLoadingParticipants,
}: Readonly<AuditFiltersProps>) => {
  const { data: participants = [] } = useQuery({
    queryKey: ['participants'],
    queryFn: fetchParticipants,
  });

  const participantOptions = [
    { value: ALL_PARTICIPANTS_VALUE, label: 'Todos os Participantes' },
    ...participants.map((p: Person) => ({
      value: String(p.id),
      label: p.fullName || p.name,
    })),
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <SelectWithOptions
            value={selectedParticipant}
            onValueChange={onParticipantChange}
            options={participantOptions}
            placeholder="Filtrar por participante"
            disabled={isLoadingParticipants}
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <SelectWithOptions
            value={limitCount}
            onValueChange={(v) => onLimitChange(Number(v))}
            options={LIMIT_OPTIONS}
            placeholder="Quantidade de registros"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por usuário ou campo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
};

export const AuditFilters = memo(AuditFiltersComponent);
AuditFilters.displayName = 'AuditFilters';

export default AuditFilters;
