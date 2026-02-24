import type { Metadata } from 'next';

import { HistoricoClient } from '@/components/vaquinha-history/historico-client';

export const metadata: Metadata = {
  title: 'Histórico | Luluzinha',
  description:
    'Histórico de vaquinhas de aniversário. Linha do tempo de sorteios e responsáveis.',
};

const HistoricoPage = () => <HistoricoClient />;

export default HistoricoPage;
