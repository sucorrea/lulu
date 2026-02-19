'use client';
import { memo } from 'react';

import { Check, CheckSquare, Square, Users } from 'lucide-react';

import type { Person } from '@/components/lulus/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDate } from '../lulus/utils';

type ParticipantRowProps = {
  participant: Person;
  isSelected: boolean;
  onToggle: (id: number) => void;
};

const ParticipantRow = memo(
  ({ participant, isSelected, onToggle }: ParticipantRowProps) => (
    <label
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50 focus-within:ring-1 focus-within:ring-ring data-[selected=true]:border-primary data-[selected=true]:bg-primary/5'
      )}
      data-selected={isSelected}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(participant.id)}
        className="peer sr-only"
        aria-label={`Selecionar ${participant.fullName || participant.name}`}
      />
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary shadow peer-checked:bg-primary peer-checked:text-primary-foreground">
        {isSelected && <Check className="h-3 w-3" />}
      </span>
      <div className="flex flex-1 flex-row items-center gap-3 text-left">
        <p className="text-sm text-muted-foreground">
          {formatDate(new Date(participant.date))}
        </p>
        <p className="font-medium">
          {participant.fullName || participant.name}
        </p>
      </div>
    </label>
  )
);

ParticipantRow.displayName = 'ParticipantRow';

type ParticipantSelectionProps = {
  participants: Person[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
};

export const ParticipantSelection = memo(
  ({
    participants,
    selectedIds,
    onToggle,
    onSelectAll,
    onClearSelection,
  }: ParticipantSelectionProps) => {
    const allSelected = selectedIds.size === participants.length;

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {selectedIds.size} de {participants.length} participantes
              selecionadas
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={allSelected}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Selecionar Todas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              disabled={selectedIds.size === 0}
            >
              <Square className="h-4 w-4 mr-2" />
              Limpar Seleção
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {participants
            .toSorted(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((p) => (
              <ParticipantRow
                key={p.id}
                participant={p}
                isSelected={selectedIds.has(p.id)}
                onToggle={onToggle}
              />
            ))}
        </div>

        {participants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Nenhuma participante encontrada.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ParticipantSelection.displayName = 'ParticipantSelection';
export default ParticipantSelection;
