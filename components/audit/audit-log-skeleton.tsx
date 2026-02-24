'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const AuditLogSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map((id) => (
        <div key={id} className="bg-card rounded-lg border p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditLogSkeleton;
