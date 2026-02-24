import { Skeleton } from '@/components/ui/skeleton';

const GaleriaLoading = () => (
  <div className="mx-auto max-w-3xl p-4 md:p-6">
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-9 w-24" />
    </div>
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 list-none p-0 m-0">
      {Array.from({ length: 12 }, (_, i) => (
        <li key={i} className="relative">
          <Skeleton className="w-full aspect-square rounded" />
        </li>
      ))}
    </ul>
  </div>
);

export default GaleriaLoading;
