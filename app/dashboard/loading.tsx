import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoading = () => (
  <div className="container mx-auto max-w-6xl p-4 md:p-6">
    <div className="mb-6 space-y-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Skeleton className="h-80 w-full rounded-lg" />
      <Skeleton className="h-80 w-full rounded-lg" />
      <Skeleton className="h-80 w-full rounded-lg" />
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  </div>
);

export default DashboardLoading;
