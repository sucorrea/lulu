import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agenda | Luluzinha',
  description:
    'Agenda das Lulus. Calendário de aniversários e signos das participantes.',
};

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => <>{children}</>;

export default DashboardLayout;
