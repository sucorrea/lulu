'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const TimelineSkeleton = () => (
  <div className="space-y-8" aria-label="Carregando histórico...">
    {[1, 2].map((yearIndex) => (
      <div key={yearIndex} className="relative min-w-0">
        <div className="mb-4 py-2">
          <Skeleton className="h-8 w-32 max-w-full" />
        </div>

        <div className="ml-3 min-w-0 space-y-4 border-l-2 border-accent/50 pl-6 sm:ml-4 sm:pl-8">
          {[1, 2, 3].map((itemIndex) => (
            <Card
              key={itemIndex}
              className="relative min-w-0 overflow-hidden bg-surface-warm"
            >
              <div className="absolute -left-[2.1rem] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-background bg-muted sm:-left-[2.6rem]" />
              <CardContent className="pt-4">
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className="h-5 w-full max-w-48" />
                    <Skeleton className="h-4 w-full max-w-72" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default TimelineSkeleton;
