'use client';

import { memo } from 'react';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';
import { Calendar, Gift, User, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import { cn } from '@/lib/utils';

interface VaquinhaHistoryTimelineProps {
  history: VaquinhaHistory[];
  onEdit?: (item: VaquinhaHistory) => void;
  onDelete?: (id: string) => void;
}

const TimelineItem = memo(function TimelineItem({
  item,
  onEdit,
  onDelete,
  isAuthenticated,
}: {
  item: VaquinhaHistory;
  onEdit?: (item: VaquinhaHistory) => void;
  onDelete?: (id: string) => void;
  isAuthenticated: boolean;
}) {
  return (
    <Card
      className={cn(
        'p-0',
        'relative',
        'transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        'animate-in fade-in slide-in-from-left-4 duration-500'
      )}
    >
      <div
        className="absolute -left-[2.6rem] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background"
        aria-hidden="true"
      />
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-base font-semibold">
                {item.birthdayPersonName}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium text-sm">
                  {`${item.responsibleName} foi responsável pela vaquinha`}
                </span>
              </div>
            </div>
          </div>
          {isAuthenticated && (onEdit || onDelete) && (
            <div className="flex items-center justify-end gap-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    (e.currentTarget as HTMLElement)?.blur();
                    onEdit(item);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                  aria-label={`Editar registro de ${item.birthdayPersonName}`}
                >
                  <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center gap-1.5 text-sm text-destructive hover:underline focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                  aria-label={`Excluir registro de ${item.birthdayPersonName}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Excluir
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export const VaquinhaHistoryTimeline = memo(function VaquinhaHistoryTimeline({
  history,
  onEdit,
  onDelete,
}: VaquinhaHistoryTimelineProps) {
  const { user } = useUserVerification();
  const isAuthenticated = !!user;

  if (history.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500"
        aria-live="polite"
      >
        <Gift
          className="h-12 w-12 text-muted-foreground mb-4"
          aria-hidden="true"
        />
        <p className="text-lg font-medium text-muted-foreground">
          Nenhum histórico encontrado
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Adicione registros para começar a construir a linha do tempo
        </p>
      </div>
    );
  }

  const groupedByYear = history.reduce(
    (acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = [];
      }
      acc[item.year].push(item);
      return acc;
    },
    {} as Record<number, VaquinhaHistory[]>
  );

  const years = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-4" role="feed" aria-label="Histórico de vaquinhas">
      {years.map((year, yearIndex) => (
        <section
          key={year}
          className="relative animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${yearIndex * 100}ms` }}
          aria-labelledby={`year-${year}`}
        >
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 mb-4">
            <h2
              id={`year-${year}`}
              className="text-2xl font-bold flex items-center gap-2"
            >
              <Calendar className="h-6 w-6" aria-hidden="true" />
              <span>{year}</span>
            </h2>
          </div>

          <ol
            className="space-y-4 ml-8 border-l-2 border-muted pl-8 list-none"
            aria-label={`Registros de ${year}`}
          >
            {[...groupedByYear[year]]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((item, index) => (
                <li
                  key={item.id}
                  style={{
                    animationDelay: `${yearIndex * 100 + index * 50}ms`,
                  }}
                >
                  <TimelineItem
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isAuthenticated={isAuthenticated}
                  />
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
});
