import { Skeleton } from '@/components/ui/skeleton';

import PageLayout from '../layout/page-layout';

const ROW_KEYS = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5', 'row-6'];

export const SorteioSkeleton = () => (
  <PageLayout>
    <div className="space-y-2">
      <Skeleton className="h-8 w-64 max-w-full" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </div>
    <Skeleton className="h-10 w-40" />
    <div className="space-y-3">
      {ROW_KEYS.map((key) => (
        <Skeleton key={key} className="h-12 w-full" />
      ))}
    </div>
  </PageLayout>
);
