'use client';
import { memo } from 'react';

import { AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { SorteioPair } from '@/lib/sorteio';
import { formatDate } from '../lulus/utils';

type SorteioResultPreviewProps = {
  pairs: SorteioPair[];
  relaxed: boolean;
  isSaved?: boolean;
};

const PairRow = memo(
  ({ pair, index }: { pair: SorteioPair; index: number }) => (
    <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/30">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {index + 1}
      </span>
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatDate(new Date(pair.birthdayDate || ''))}
        </span>
        <span className="font-medium">
          {pair.birthdayPersonName.split(' ')[0]}
        </span>
        <ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-medium">
          {pair.responsibleName.split(' ')[0]}
        </span>
      </div>
    </div>
  )
);

PairRow.displayName = 'PairRow';

export const SorteioResultPreview = memo(
  ({ pairs, relaxed, isSaved = false }: SorteioResultPreviewProps) => {
    const sortedPairs = [...pairs].sort((a, b) => {
      const mmddA = a.birthdayDate ? String(a.birthdayDate).slice(5, 10) : '';
      const mmddB = b.birthdayDate ? String(b.birthdayDate).slice(5, 10) : '';
      return mmddA.localeCompare(mmddB);
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold">
            {isSaved ? 'Resultado do Sorteio' : 'Preview do Sorteio'}
          </h2>
          <Badge variant="secondary">{pairs.length} atribuições</Badge>
          {isSaved && (
            <Badge
              variant="outline"
              className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Salvo
            </Badge>
          )}
          {relaxed && (
            <Badge
              variant="outline"
              className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Restrições relaxadas
            </Badge>
          )}
        </div>

        {relaxed && (
          <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950">
            <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Não foi possível evitar todas as repetições do ano anterior.
              Algumas participantes podem ter pegado a mesma pessoa do ano
              passado.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {sortedPairs.map((pair, i) => (
            <PairRow key={pair.responsibleId} pair={pair} index={i} />
          ))}
        </div>
      </div>
    );
  }
);

SorteioResultPreview.displayName = 'SorteioResultPreview';
export default SorteioResultPreview;
