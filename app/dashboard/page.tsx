import { headers } from 'next/headers';

import { getParticipants } from '@/services/participants-server';
import PageError from '@/components/layout/page-error';
import DashboardPage from '@/components/modules/dashboard';

const Dashboard = async () => {
  await headers();
  let participants;
  let error = false;

  try {
    participants = await getParticipants();
  } catch {
    error = true;
  }

  if (error || !participants) {
    return (
      <PageError
        title="Erro ao carregar dashboard"
        message="Não foi possível carregar os dados dos participantes. Verifique sua conexão e tente novamente."
      />
    );
  }

  return <DashboardPage participants={participants} />;
};

export default Dashboard;
