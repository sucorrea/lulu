import { Skeleton } from '@/components/ui/skeleton';

const HistoricoLoading = () => (
  <div className="container mx-auto max-w-3xl p-4 md:p-6">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-9 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-4 h-8 w-16" />
        <div className="ml-8 space-y-4 border-l-2 border-muted pl-8">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default HistoricoLoading;
