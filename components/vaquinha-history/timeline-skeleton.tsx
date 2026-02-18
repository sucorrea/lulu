'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const TimelineSkeleton = () => {
  return (
    <div className="space-y-8" aria-label="Carregando histórico...">
      {[1, 2].map((yearIndex) => (
        <div key={yearIndex} className="relative">
          <div className="py-2 mb-4">
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="space-y-4 ml-8 border-l-2 border-muted pl-8">
            {[1, 2, 3].map((itemIndex) => (
              <Card
                key={itemIndex}
                className="relative min-w-0 overflow-hidden"
              >
                <div className="absolute -left-[2.6rem] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted border-4 border-background" />
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
};
