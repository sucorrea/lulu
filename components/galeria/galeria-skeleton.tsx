import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_COUNT = 12;

export const GaleriaSkeleton = () => (
  <section className="bg-background py-6 md:py-8">
    <div className="container space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40 max-w-full" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>
      <Skeleton className="h-11 w-32 rounded-full" />
      <ul
        className="m-0 grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-4 md:grid-cols-6"
        aria-label="Carregando galeria"
      >
        {Array.from(
          { length: SKELETON_COUNT },
          (_, i) => `galeria-skeleton-${i}`
        ).map((key) => (
          <li key={key} className="relative" data-testid="skeleton-item">
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default GaleriaSkeleton;
