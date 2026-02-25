import type { Metadata } from 'next';
import { Suspense } from 'react';

import AuditLogSkeleton from '@/components/audit/audit-log-skeleton';
import AuditPage from '@/components/audit/audit-page/audit';
import Header from '@/components/layout/header';
import PageLayout from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Auditoria | Luluzinha',
  description:
    'Registro de alterações e atividades no sistema. Visualize o histórico de modificações.',
};

const AuditPageSkeleton = () => (
  <PageLayout>
    <Header
      title="Histórico de Auditoria"
      description="Visualize todas as alterações realizadas nos dados dos participantes"
    />
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => `filter-${i}`).map((id) => (
          <div key={id} className="h-10 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
    <AuditLogSkeleton />
  </PageLayout>
);

const AuditPageRoute = async () => {
  return (
    <Suspense fallback={<AuditPageSkeleton />}>
      <AuditPage />
    </Suspense>
  );
};

export default AuditPageRoute;
