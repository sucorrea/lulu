import { Suspense } from 'react';
import { AuditPage, AuditLogSkeleton } from '@/components/audit';

export const AuditPageRoute = () => {
  return (
    <Suspense fallback={<AuditPageSkeleton />}>
      <AuditPage />
    </Suspense>
  );
};

const AuditPageSkeleton = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="h-9 bg-muted rounded w-64 mb-2 animate-pulse" />
        <div className="h-5 bg-muted rounded w-96 animate-pulse" />
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => `filter-${i}`).map((id) => (
            <div key={id} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
      <AuditLogSkeleton />
    </div>
  );
};

export default AuditPageRoute;
