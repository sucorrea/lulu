'use client';

import { Skeleton } from '@/components/ui/skeleton';

import PageLayout from '../layout/page-layout';
import TimelineSkeleton from './timeline-skeleton';

export const HistoricoSkeleton = () => (
  <PageLayout>
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-48" />
    </div>
    <TimelineSkeleton />
  </PageLayout>
);

export default HistoricoSkeleton;
