'use client';

import { memo } from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchParticipants } from '@/services/queries/fetchParticipants';
import { Person } from '@/components/lulus/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { LIMIT_OPTIONS, ALL_PARTICIPANTS_VALUE } from '../constants';
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

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Select
            value={selectedParticipant}
            onValueChange={onParticipantChange}
            disabled={isLoadingParticipants}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por participante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PARTICIPANTS_VALUE}>
                Todos os Participantes
              </SelectItem>
              {participants.map((participant: Person) => (
                <SelectItem key={participant.id} value={String(participant.id)}>
                  {participant.fullName || participant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Select
            value={String(limitCount)}
            onValueChange={(v) => onLimitChange(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Quantidade de registros" />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
