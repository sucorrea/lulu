'use client';

import { Card, CardContent } from '@/components/ui/card';

const SkeletonLulusInteractive = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <div className="h-9 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-64 mt-2 rounded bg-muted animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-2 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="lulu-card mx-auto w-full max-w-md overflow-hidden p-2"
          >
            <CardContent className="flex h-full flex-col gap-2 overflow-hidden p-4">
              <div className="flex min-w-0 flex-row gap-4 items-start">
                <div className="h-20 w-20 shrink-0 rounded-full bg-muted animate-pulse" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-6 max-w-[8rem] rounded bg-muted animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-24 shrink-0 rounded-full bg-muted animate-pulse" />
                    <div className="h-6 w-20 shrink-0 rounded-full bg-muted animate-pulse" />
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
