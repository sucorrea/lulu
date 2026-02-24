import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Luluzinha',
  description:
    'Dashboard da vaquinha. Calendário de aniversários e visão geral dos participantes.',
};

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => <>{children}</>;

export default DashboardLayout;
