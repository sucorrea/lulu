import { Skeleton } from '@/components/ui/skeleton';

const SorteioLoading = () => (
  <div className="container mx-auto max-w-3xl p-4 md:p-6">
    <div className="mb-6 space-y-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 8 }, (_, i) => `sorteio-skeleton-${i}`).map(
        (key) => (
          <Skeleton key={key} className="h-14 w-full rounded-lg" />
        )
      )}
    </div>
    <div className="mt-6 flex justify-end gap-3">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export default SorteioLoading;
