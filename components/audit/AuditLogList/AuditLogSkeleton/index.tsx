'use client';

export const AuditLogSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map((id) => (
        <div key={id} className="bg-card rounded-lg border p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
            <div className="h-3 bg-muted rounded w-24" />
          </div>

          <div className="space-y-3">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};
