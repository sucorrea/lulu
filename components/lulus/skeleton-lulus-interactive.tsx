'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonLulusInteractive = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-2 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
        {['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'].map((key) => (
          <Card
            key={key}
            className="lulu-card mx-auto w-full max-w-md overflow-hidden p-2"
          >
            <CardContent className="flex h-full flex-col gap-2 overflow-hidden p-4">
              <div className="flex min-w-0 flex-row gap-4 items-start">
                <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-3">
                  <Skeleton className="h-6 max-w-[8rem]" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
                    <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default SkeletonLulusInteractive;
