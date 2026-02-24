'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/header';
import PageLayout from '@/components/layout/page-layout';

const AuditPageSkeleton = () => (
  <PageLayout>
    <Header
      title="Histórico de Auditoria"
      description="Visualize todas as alterações realizadas nos dados dos participantes"
    />

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => `filter-skeleton-${i}`).map(
          (id) => (
            <Skeleton key={id} className="h-10" />
          )
        )}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => `log-skeleton-${i}`).map((id) => (
          <Skeleton key={id} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  </PageLayout>
);

const AuditPageDynamic = dynamic(() => import('./audit-page-content'), {
  ssr: false,
  loading: AuditPageSkeleton,
});

export const AuditPage = () => <AuditPageDynamic />;

export default AuditPage;
